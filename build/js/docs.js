var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {},
    Prism = function() {
        var a = /\blang(?:uage)?-(?!\*)(\w+)\b/i,
            b = _self.Prism = {
                util: {
                    encode: function(a) {
                        return a instanceof c ? new c(a.type, b.util.encode(a.content), a.alias) : "Array" === b.util.type(a) ? a.map(b.util.encode) : a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ")
                    },
                    type: function(a) {
                        return Object.prototype.toString.call(a).match(/\[object (\w+)\]/)[1]
                    },
                    clone: function(a) {
                        var c = b.util.type(a);
                        switch (c) {
                            case "Object":
                                var d = {};
                                for (var e in a) a.hasOwnProperty(e) && (d[e] = b.util.clone(a[e]));
                                return d;
                            case "Array":
                                return a.map && a.map(function(a) {
                                    return b.util.clone(a)
                                })
                        }
                        return a
                    }
                },
                languages: {
                    extend: function(a, c) {
                        var d = b.util.clone(b.languages[a]);
                        for (var e in c) d[e] = c[e];
                        return d
                    },
                    insertBefore: function(a, c, d, e) {
                        e = e || b.languages;
                        var f = e[a];
                        if (2 == arguments.length) {
                            d = arguments[1];
                            for (var g in d) d.hasOwnProperty(g) && (f[g] = d[g]);
                            return f
                        }
                        var h = {};
                        for (var i in f)
                            if (f.hasOwnProperty(i)) {
                                if (i == c)
                                    for (var g in d) d.hasOwnProperty(g) && (h[g] = d[g]);
                                h[i] = f[i]
                            } return b.languages.DFS(b.languages, function(b, c) {
                            c === e[a] && b != a && (this[b] = h)
                        }), e[a] = h
                    },
                    DFS: function(a, c, d, e) {
                        e = e || {};
                        for (var f in a) a.hasOwnProperty(f) && (c.call(a, f, a[f], d || f), "Object" !== b.util.type(a[f]) || e[a[f]] ? "Array" !== b.util.type(a[f]) || e[a[f]] || (e[a[f]] = !0, b.languages.DFS(a[f], c, f, e)) : (e[a[f]] = !0, b.languages.DFS(a[f], c, null, e)))
                    }
                },
                plugins: {},
                highlightAll: function(a, c) {
                    for (var d, e = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'), f = 0; d = e[f++];) b.highlightElement(d, a === !0, c)
                },
                highlightElement: function(c, d, e) {
                    for (var f, g, h = c; h && !a.test(h.className);) h = h.parentNode;
                    h && (f = (h.className.match(a) || [, ""])[1], g = b.languages[f]), c.className = c.className.replace(a, "").replace(/\s+/g, " ") + " language-" + f, h = c.parentNode, /pre/i.test(h.nodeName) && (h.className = h.className.replace(a, "").replace(/\s+/g, " ") + " language-" + f);
                    var i = c.textContent,
                        j = {
                            element: c,
                            language: f,
                            grammar: g,
                            code: i
                        };
                    if (!i || !g) return void b.hooks.run("complete", j);
                    if (b.hooks.run("before-highlight", j), d && _self.Worker) {
                        var k = new Worker(b.filename);
                        k.onmessage = function(a) {
                            j.highlightedCode = a.data, b.hooks.run("before-insert", j), j.element.innerHTML = j.highlightedCode, e && e.call(j.element), b.hooks.run("after-highlight", j), b.hooks.run("complete", j)
                        }, k.postMessage(JSON.stringify({
                            language: j.language,
                            code: j.code,
                            immediateClose: !0
                        }))
                    } else j.highlightedCode = b.highlight(j.code, j.grammar, j.language), b.hooks.run("before-insert", j), j.element.innerHTML = j.highlightedCode, e && e.call(c), b.hooks.run("after-highlight", j), b.hooks.run("complete", j)
                },
                highlight: function(a, d, e) {
                    var f = b.tokenize(a, d);
                    return c.stringify(b.util.encode(f), e)
                },
                tokenize: function(a, c) {
                    var d = b.Token,
                        e = [a],
                        f = c.rest;
                    if (f) {
                        for (var g in f) c[g] = f[g];
                        delete c.rest
                    }
                    a: for (var g in c)
                        if (c.hasOwnProperty(g) && c[g]) {
                            var h = c[g];
                            h = "Array" === b.util.type(h) ? h : [h];
                            for (var i = 0; i < h.length; ++i) {
                                var j = h[i],
                                    k = j.inside,
                                    l = !!j.lookbehind,
                                    m = 0,
                                    n = j.alias;
                                j = j.pattern || j;
                                for (var o = 0; o < e.length; o++) {
                                    var p = e[o];
                                    if (e.length > a.length) break a;
                                    if (!(p instanceof d)) {
                                        j.lastIndex = 0;
                                        var q = j.exec(p);
                                        if (q) {
                                            l && (m = q[1].length);
                                            var r = q.index - 1 + m,
                                                q = q[0].slice(m),
                                                s = q.length,
                                                t = r + s,
                                                u = p.slice(0, r + 1),
                                                v = p.slice(t + 1),
                                                w = [o, 1];
                                            u && w.push(u);
                                            var x = new d(g, k ? b.tokenize(q, k) : q, n);
                                            w.push(x), v && w.push(v), Array.prototype.splice.apply(e, w)
                                        }
                                    }
                                }
                            }
                        }
                    return e
                },
                hooks: {
                    all: {},
                    add: function(a, c) {
                        var d = b.hooks.all;
                        d[a] = d[a] || [], d[a].push(c)
                    },
                    run: function(a, c) {
                        var d = b.hooks.all[a];
                        if (d && d.length)
                            for (var e, f = 0; e = d[f++];) e(c)
                    }
                }
            },
            c = b.Token = function(a, b, c) {
                this.type = a, this.content = b, this.alias = c
            };
        if (c.stringify = function(a, d, e) {
                if ("string" == typeof a) return a;
                if ("Array" === b.util.type(a)) return a.map(function(b) {
                    return c.stringify(b, d, a)
                }).join("");
                var f = {
                    type: a.type,
                    content: c.stringify(a.content, d, e),
                    tag: "span",
                    classes: ["token", a.type],
                    attributes: {},
                    language: d,
                    parent: e
                };
                if ("comment" == f.type && (f.attributes.spellcheck = "true"), a.alias) {
                    var g = "Array" === b.util.type(a.alias) ? a.alias : [a.alias];
                    Array.prototype.push.apply(f.classes, g)
                }
                b.hooks.run("wrap", f);
                var h = "";
                for (var i in f.attributes) h += (h ? " " : "") + i + '="' + (f.attributes[i] || "") + '"';
                return "<" + f.tag + ' class="' + f.classes.join(" ") + '" ' + h + ">" + f.content + "</" + f.tag + ">"
            }, !_self.document) return _self.addEventListener ? (_self.addEventListener("message", function(a) {
            var c = JSON.parse(a.data),
                d = c.language,
                e = c.code,
                f = c.immediateClose;
            _self.postMessage(b.highlight(e, b.languages[d], d)), f && _self.close()
        }, !1), _self.Prism) : _self.Prism;
        var d = document.getElementsByTagName("script");
        return d = d[d.length - 1], d && (b.filename = d.src, document.addEventListener && !d.hasAttribute("data-manual") && document.addEventListener("DOMContentLoaded", b.highlightAll)), _self.Prism
    }();
"undefined" != typeof module && module.exports && (module.exports = Prism), "undefined" != typeof global && (global.Prism = Prism), Prism.languages.markup = {
    comment: /<!--[\w\W]*?-->/,
    prolog: /<\?[\w\W]+?\?>/,
    doctype: /<!DOCTYPE[\w\W]+?>/,
    cdata: /<!\[CDATA\[[\w\W]*?]]>/i,
    tag: {
        pattern: /<\/?(?!\d)[^\s>\/=.$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
        inside: {
            tag: {
                pattern: /^<\/?[^\s>\/]+/i,
                inside: {
                    punctuation: /^<\/?/,
                    namespace: /^[^\s>\/:]+:/
                }
            },
            "attr-value": {
                pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
                inside: {
                    punctuation: /[=>"']/
                }
            },
            punctuation: /\/?>/,
            "attr-name": {
                pattern: /[^\s>\/]+/,
                inside: {
                    namespace: /^[^\s>\/:]+:/
                }
            }
        }
    },
    entity: /&#?[\da-z]{1,8};/i
}, Prism.hooks.add("wrap", function(a) {
    "entity" === a.type && (a.attributes.title = a.content.replace(/&amp;/, "&"))
}), Prism.languages.xml = Prism.languages.markup, Prism.languages.html = Prism.languages.markup, Prism.languages.mathml = Prism.languages.markup, Prism.languages.svg = Prism.languages.markup, Prism.languages.css = {
    comment: /\/\*[\w\W]*?\*\//,
    atrule: {
        pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
        inside: {
            rule: /@[\w-]+/
        }
    },
    url: /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
    selector: /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
    string: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
    property: /(\b|\B)[\w-]+(?=\s*:)/i,
    important: /\B!important\b/i,
    function: /[-a-z0-9]+(?=\()/i,
    punctuation: /[(){};:]/
}, Prism.languages.css.atrule.inside.rest = Prism.util.clone(Prism.languages.css), Prism.languages.markup && (Prism.languages.insertBefore("markup", "tag", {
    style: {
        pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
        lookbehind: !0,
        inside: Prism.languages.css,
        alias: "language-css"
    }
}), Prism.languages.insertBefore("inside", "attr-value", {
    "style-attr": {
        pattern: /\s*style=("|').*?\1/i,
        inside: {
            "attr-name": {
                pattern: /^\s*style/i,
                inside: Prism.languages.markup.tag.inside
            },
            punctuation: /^\s*=\s*['"]|['"]\s*$/,
            "attr-value": {
                pattern: /.+/i,
                inside: Prism.languages.css
            }
        },
        alias: "language-css"
    }
}, Prism.languages.markup.tag)), Prism.languages.clike = {
    comment: [{
        pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
        lookbehind: !0
    }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0
    }],
    string: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    "class-name": {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
        lookbehind: !0,
        inside: {
            punctuation: /(\.|\\)/
        }
    },
    keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(true|false)\b/,
    function: /[a-z0-9_]+(?=\()/i,
    number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/
}, Prism.languages.javascript = Prism.languages.extend("clike", {
    keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
    number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
    function: /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i
}), Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
        lookbehind: !0
    }
}), Prism.languages.insertBefore("javascript", "class-name", {
    "template-string": {
        pattern: /`(?:\\`|\\?[^`])*`/,
        inside: {
            interpolation: {
                pattern: /\$\{[^}]+\}/,
                inside: {
                    "interpolation-punctuation": {
                        pattern: /^\$\{|\}$/,
                        alias: "punctuation"
                    },
                    rest: Prism.languages.javascript
                }
            },
            string: /[\s\S]+/
        }
    }
}), Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
    script: {
        pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
        alias: "language-javascript"
    }
}), Prism.languages.js = Prism.languages.javascript, Prism.languages.apacheconf = {
    comment: /#.*/,
    "directive-inline": {
        pattern: /^(\s*)\b(AcceptFilter|AcceptPathInfo|AccessFileName|Action|AddAlt|AddAltByEncoding|AddAltByType|AddCharset|AddDefaultCharset|AddDescription|AddEncoding|AddHandler|AddIcon|AddIconByEncoding|AddIconByType|AddInputFilter|AddLanguage|AddModuleInfo|AddOutputFilter|AddOutputFilterByType|AddType|Alias|AliasMatch|Allow|AllowCONNECT|AllowEncodedSlashes|AllowMethods|AllowOverride|AllowOverrideList|Anonymous|Anonymous_LogEmail|Anonymous_MustGiveEmail|Anonymous_NoUserID|Anonymous_VerifyEmail|AsyncRequestWorkerFactor|AuthBasicAuthoritative|AuthBasicFake|AuthBasicProvider|AuthBasicUseDigestAlgorithm|AuthDBDUserPWQuery|AuthDBDUserRealmQuery|AuthDBMGroupFile|AuthDBMType|AuthDBMUserFile|AuthDigestAlgorithm|AuthDigestDomain|AuthDigestNonceLifetime|AuthDigestProvider|AuthDigestQop|AuthDigestShmemSize|AuthFormAuthoritative|AuthFormBody|AuthFormDisableNoStore|AuthFormFakeBasicAuth|AuthFormLocation|AuthFormLoginRequiredLocation|AuthFormLoginSuccessLocation|AuthFormLogoutLocation|AuthFormMethod|AuthFormMimetype|AuthFormPassword|AuthFormProvider|AuthFormSitePassphrase|AuthFormSize|AuthFormUsername|AuthGroupFile|AuthLDAPAuthorizePrefix|AuthLDAPBindAuthoritative|AuthLDAPBindDN|AuthLDAPBindPassword|AuthLDAPCharsetConfig|AuthLDAPCompareAsUser|AuthLDAPCompareDNOnServer|AuthLDAPDereferenceAliases|AuthLDAPGroupAttribute|AuthLDAPGroupAttributeIsDN|AuthLDAPInitialBindAsUser|AuthLDAPInitialBindPattern|AuthLDAPMaxSubGroupDepth|AuthLDAPRemoteUserAttribute|AuthLDAPRemoteUserIsDN|AuthLDAPSearchAsUser|AuthLDAPSubGroupAttribute|AuthLDAPSubGroupClass|AuthLDAPUrl|AuthMerging|AuthName|AuthnCacheContext|AuthnCacheEnable|AuthnCacheProvideFor|AuthnCacheSOCache|AuthnCacheTimeout|AuthnzFcgiCheckAuthnProvider|AuthnzFcgiDefineProvider|AuthType|AuthUserFile|AuthzDBDLoginToReferer|AuthzDBDQuery|AuthzDBDRedirectQuery|AuthzDBMType|AuthzSendForbiddenOnFailure|BalancerGrowth|BalancerInherit|BalancerMember|BalancerPersist|BrowserMatch|BrowserMatchNoCase|BufferedLogs|BufferSize|CacheDefaultExpire|CacheDetailHeader|CacheDirLength|CacheDirLevels|CacheDisable|CacheEnable|CacheFile|CacheHeader|CacheIgnoreCacheControl|CacheIgnoreHeaders|CacheIgnoreNoLastMod|CacheIgnoreQueryString|CacheIgnoreURLSessionIdentifiers|CacheKeyBaseURL|CacheLastModifiedFactor|CacheLock|CacheLockMaxAge|CacheLockPath|CacheMaxExpire|CacheMaxFileSize|CacheMinExpire|CacheMinFileSize|CacheNegotiatedDocs|CacheQuickHandler|CacheReadSize|CacheReadTime|CacheRoot|CacheSocache|CacheSocacheMaxSize|CacheSocacheMaxTime|CacheSocacheMinTime|CacheSocacheReadSize|CacheSocacheReadTime|CacheStaleOnError|CacheStoreExpired|CacheStoreNoStore|CacheStorePrivate|CGIDScriptTimeout|CGIMapExtension|CharsetDefault|CharsetOptions|CharsetSourceEnc|CheckCaseOnly|CheckSpelling|ChrootDir|ContentDigest|CookieDomain|CookieExpires|CookieName|CookieStyle|CookieTracking|CoreDumpDirectory|CustomLog|Dav|DavDepthInfinity|DavGenericLockDB|DavLockDB|DavMinTimeout|DBDExptime|DBDInitSQL|DBDKeep|DBDMax|DBDMin|DBDParams|DBDPersist|DBDPrepareSQL|DBDriver|DefaultIcon|DefaultLanguage|DefaultRuntimeDir|DefaultType|Define|DeflateBufferSize|DeflateCompressionLevel|DeflateFilterNote|DeflateInflateLimitRequestBody|DeflateInflateRatioBurst|DeflateInflateRatioLimit|DeflateMemLevel|DeflateWindowSize|Deny|DirectoryCheckHandler|DirectoryIndex|DirectoryIndexRedirect|DirectorySlash|DocumentRoot|DTracePrivileges|DumpIOInput|DumpIOOutput|EnableExceptionHook|EnableMMAP|EnableSendfile|Error|ErrorDocument|ErrorLog|ErrorLogFormat|Example|ExpiresActive|ExpiresByType|ExpiresDefault|ExtendedStatus|ExtFilterDefine|ExtFilterOptions|FallbackResource|FileETag|FilterChain|FilterDeclare|FilterProtocol|FilterProvider|FilterTrace|ForceLanguagePriority|ForceType|ForensicLog|GprofDir|GracefulShutdownTimeout|Group|Header|HeaderName|HeartbeatAddress|HeartbeatListen|HeartbeatMaxServers|HeartbeatStorage|HeartbeatStorage|HostnameLookups|IdentityCheck|IdentityCheckTimeout|ImapBase|ImapDefault|ImapMenu|Include|IncludeOptional|IndexHeadInsert|IndexIgnore|IndexIgnoreReset|IndexOptions|IndexOrderDefault|IndexStyleSheet|InputSed|ISAPIAppendLogToErrors|ISAPIAppendLogToQuery|ISAPICacheFile|ISAPIFakeAsync|ISAPILogNotSupported|ISAPIReadAheadBuffer|KeepAlive|KeepAliveTimeout|KeptBodySize|LanguagePriority|LDAPCacheEntries|LDAPCacheTTL|LDAPConnectionPoolTTL|LDAPConnectionTimeout|LDAPLibraryDebug|LDAPOpCacheEntries|LDAPOpCacheTTL|LDAPReferralHopLimit|LDAPReferrals|LDAPRetries|LDAPRetryDelay|LDAPSharedCacheFile|LDAPSharedCacheSize|LDAPTimeout|LDAPTrustedClientCert|LDAPTrustedGlobalCert|LDAPTrustedMode|LDAPVerifyServerCert|LimitInternalRecursion|LimitRequestBody|LimitRequestFields|LimitRequestFieldSize|LimitRequestLine|LimitXMLRequestBody|Listen|ListenBackLog|LoadFile|LoadModule|LogFormat|LogLevel|LogMessage|LuaAuthzProvider|LuaCodeCache|LuaHookAccessChecker|LuaHookAuthChecker|LuaHookCheckUserID|LuaHookFixups|LuaHookInsertFilter|LuaHookLog|LuaHookMapToStorage|LuaHookTranslateName|LuaHookTypeChecker|LuaInherit|LuaInputFilter|LuaMapHandler|LuaOutputFilter|LuaPackageCPath|LuaPackagePath|LuaQuickHandler|LuaRoot|LuaScope|MaxConnectionsPerChild|MaxKeepAliveRequests|MaxMemFree|MaxRangeOverlaps|MaxRangeReversals|MaxRanges|MaxRequestWorkers|MaxSpareServers|MaxSpareThreads|MaxThreads|MergeTrailers|MetaDir|MetaFiles|MetaSuffix|MimeMagicFile|MinSpareServers|MinSpareThreads|MMapFile|ModemStandard|ModMimeUsePathInfo|MultiviewsMatch|Mutex|NameVirtualHost|NoProxy|NWSSLTrustedCerts|NWSSLUpgradeable|Options|Order|OutputSed|PassEnv|PidFile|PrivilegesMode|Protocol|ProtocolEcho|ProxyAddHeaders|ProxyBadHeader|ProxyBlock|ProxyDomain|ProxyErrorOverride|ProxyExpressDBMFile|ProxyExpressDBMType|ProxyExpressEnable|ProxyFtpDirCharset|ProxyFtpEscapeWildcards|ProxyFtpListOnWildcard|ProxyHTMLBufSize|ProxyHTMLCharsetOut|ProxyHTMLDocType|ProxyHTMLEnable|ProxyHTMLEvents|ProxyHTMLExtended|ProxyHTMLFixups|ProxyHTMLInterp|ProxyHTMLLinks|ProxyHTMLMeta|ProxyHTMLStripComments|ProxyHTMLURLMap|ProxyIOBufferSize|ProxyMaxForwards|ProxyPass|ProxyPassInherit|ProxyPassInterpolateEnv|ProxyPassMatch|ProxyPassReverse|ProxyPassReverseCookieDomain|ProxyPassReverseCookiePath|ProxyPreserveHost|ProxyReceiveBufferSize|ProxyRemote|ProxyRemoteMatch|ProxyRequests|ProxySCGIInternalRedirect|ProxySCGISendfile|ProxySet|ProxySourceAddress|ProxyStatus|ProxyTimeout|ProxyVia|ReadmeName|ReceiveBufferSize|Redirect|RedirectMatch|RedirectPermanent|RedirectTemp|ReflectorHeader|RemoteIPHeader|RemoteIPInternalProxy|RemoteIPInternalProxyList|RemoteIPProxiesHeader|RemoteIPTrustedProxy|RemoteIPTrustedProxyList|RemoveCharset|RemoveEncoding|RemoveHandler|RemoveInputFilter|RemoveLanguage|RemoveOutputFilter|RemoveType|RequestHeader|RequestReadTimeout|Require|RewriteBase|RewriteCond|RewriteEngine|RewriteMap|RewriteOptions|RewriteRule|RLimitCPU|RLimitMEM|RLimitNPROC|Satisfy|ScoreBoardFile|Script|ScriptAlias|ScriptAliasMatch|ScriptInterpreterSource|ScriptLog|ScriptLogBuffer|ScriptLogLength|ScriptSock|SecureListen|SeeRequestTail|SendBufferSize|ServerAdmin|ServerAlias|ServerLimit|ServerName|ServerPath|ServerRoot|ServerSignature|ServerTokens|Session|SessionCookieName|SessionCookieName2|SessionCookieRemove|SessionCryptoCipher|SessionCryptoDriver|SessionCryptoPassphrase|SessionCryptoPassphraseFile|SessionDBDCookieName|SessionDBDCookieName2|SessionDBDCookieRemove|SessionDBDDeleteLabel|SessionDBDInsertLabel|SessionDBDPerUser|SessionDBDSelectLabel|SessionDBDUpdateLabel|SessionEnv|SessionExclude|SessionHeader|SessionInclude|SessionMaxAge|SetEnv|SetEnvIf|SetEnvIfExpr|SetEnvIfNoCase|SetHandler|SetInputFilter|SetOutputFilter|SSIEndTag|SSIErrorMsg|SSIETag|SSILastModified|SSILegacyExprParser|SSIStartTag|SSITimeFormat|SSIUndefinedEcho|SSLCACertificateFile|SSLCACertificatePath|SSLCADNRequestFile|SSLCADNRequestPath|SSLCARevocationCheck|SSLCARevocationFile|SSLCARevocationPath|SSLCertificateChainFile|SSLCertificateFile|SSLCertificateKeyFile|SSLCipherSuite|SSLCompression|SSLCryptoDevice|SSLEngine|SSLFIPS|SSLHonorCipherOrder|SSLInsecureRenegotiation|SSLOCSPDefaultResponder|SSLOCSPEnable|SSLOCSPOverrideResponder|SSLOCSPResponderTimeout|SSLOCSPResponseMaxAge|SSLOCSPResponseTimeSkew|SSLOCSPUseRequestNonce|SSLOpenSSLConfCmd|SSLOptions|SSLPassPhraseDialog|SSLProtocol|SSLProxyCACertificateFile|SSLProxyCACertificatePath|SSLProxyCARevocationCheck|SSLProxyCARevocationFile|SSLProxyCARevocationPath|SSLProxyCheckPeerCN|SSLProxyCheckPeerExpire|SSLProxyCheckPeerName|SSLProxyCipherSuite|SSLProxyEngine|SSLProxyMachineCertificateChainFile|SSLProxyMachineCertificateFile|SSLProxyMachineCertificatePath|SSLProxyProtocol|SSLProxyVerify|SSLProxyVerifyDepth|SSLRandomSeed|SSLRenegBufferSize|SSLRequire|SSLRequireSSL|SSLSessionCache|SSLSessionCacheTimeout|SSLSessionTicketKeyFile|SSLSRPUnknownUserSeed|SSLSRPVerifierFile|SSLStaplingCache|SSLStaplingErrorCacheTimeout|SSLStaplingFakeTryLater|SSLStaplingForceURL|SSLStaplingResponderTimeout|SSLStaplingResponseMaxAge|SSLStaplingResponseTimeSkew|SSLStaplingReturnResponderErrors|SSLStaplingStandardCacheTimeout|SSLStrictSNIVHostCheck|SSLUserName|SSLUseStapling|SSLVerifyClient|SSLVerifyDepth|StartServers|StartThreads|Substitute|Suexec|SuexecUserGroup|ThreadLimit|ThreadsPerChild|ThreadStackSize|TimeOut|TraceEnable|TransferLog|TypesConfig|UnDefine|UndefMacro|UnsetEnv|Use|UseCanonicalName|UseCanonicalPhysicalPort|User|UserDir|VHostCGIMode|VHostCGIPrivs|VHostGroup|VHostPrivs|VHostSecure|VHostUser|VirtualDocumentRoot|VirtualDocumentRootIP|VirtualScriptAlias|VirtualScriptAliasIP|WatchdogInterval|XBitHack|xml2EncAlias|xml2EncDefault|xml2StartParse)\b/im,
        lookbehind: !0,
        alias: "property"
    },
    "directive-block": {
        pattern: /<\/?\b(AuthnProviderAlias|AuthzProviderAlias|Directory|DirectoryMatch|Else|ElseIf|Files|FilesMatch|If|IfDefine|IfModule|IfVersion|Limit|LimitExcept|Location|LocationMatch|Macro|Proxy|RequireAll|RequireAny|RequireNone|VirtualHost)\b *.*>/i,
        inside: {
            "directive-block": {
                pattern: /^<\/?\w+/,
                inside: {
                    punctuation: /^<\/?/
                },
                alias: "tag"
            },
            "directive-block-parameter": {
                pattern: /.*[^>]/,
                inside: {
                    punctuation: /:/,
                    string: {
                        pattern: /("|').*\1/,
                        inside: {
                            variable: /(\$|%)\{?(\w\.?(\+|\-|:)?)+\}?/
                        }
                    }
                },
                alias: "attr-value"
            },
            punctuation: />/
        },
        alias: "tag"
    },
    "directive-flags": {
        pattern: /\[(\w,?)+\]/,
        alias: "keyword"
    },
    string: {
        pattern: /("|').*\1/,
        inside: {
            variable: /(\$|%)\{?(\w\.?(\+|\-|:)?)+\}?/
        }
    },
    variable: /(\$|%)\{?(\w\.?(\+|\-|:)?)+\}?/,
    regex: /\^?.*\$|\^.*\$?/
}, ! function(a) {
    var b = {
        variable: [{
            pattern: /\$?\(\([\w\W]+?\)\)/,
            inside: {
                variable: [{
                    pattern: /(^\$\(\([\w\W]+)\)\)/,
                    lookbehind: !0
                }, /^\$\(\(/],
                number: /\b-?(?:0x[\dA-Fa-f]+|\d*\.?\d+(?:[Ee]-?\d+)?)\b/,
                operator: /--?|-=|\+\+?|\+=|!=?|~|\*\*?|\*=|\/=?|%=?|<<=?|>>=?|<=?|>=?|==?|&&?|&=|\^=?|\|\|?|\|=|\?|:/,
                punctuation: /\(\(?|\)\)?|,|;/
            }
        }, {
            pattern: /\$\([^)]+\)|`[^`]+`/,
            inside: {
                variable: /^\$\(|^`|\)$|`$/
            }
        }, /\$(?:[a-z0-9_#\?\*!@]+|\{[^}]+\})/i]
    };
    a.languages.bash = {
        shebang: {
            pattern: /^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/,
            alias: "important"
        },
        comment: {
            pattern: /(^|[^"{\\])#.*/,
            lookbehind: !0
        },
        string: [{
            pattern: /((?:^|[^<])<<\s*)(?:"|')?(\w+?)(?:"|')?\s*\r?\n(?:[\s\S])*?\r?\n\2/g,
            lookbehind: !0,
            inside: b
        }, {
            pattern: /("|')(?:\\?[\s\S])*?\1/g,
            inside: b
        }],
        variable: b.variable,
        function: {
            pattern: /(^|\s|;|\||&)(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)(?=$|\s|;|\||&)/,
            lookbehind: !0
        },
        keyword: {
            pattern: /(^|\s|;|\||&)(?:let|:|\.|if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)(?=$|\s|;|\||&)/,
            lookbehind: !0
        },
        boolean: {
            pattern: /(^|\s|;|\||&)(?:true|false)(?=$|\s|;|\||&)/,
            lookbehind: !0
        },
        operator: /&&?|\|\|?|==?|!=?|<<<?|>>|<=?|>=?|=~/,
        punctuation: /\$?\(\(?|\)\)?|\.\.|[{}[\];]/
    };
    var c = b.variable[1].inside;
    c.function = a.languages.bash.function, c.keyword = a.languages.bash.keyword, c.boolean = a.languages.bash.boolean, c.operator = a.languages.bash.operator, c.punctuation = a.languages.bash.punctuation
}(Prism), Prism.languages.css.selector = {
    pattern: /[^\{\}\s][^\{\}]*(?=\s*\{)/,
    inside: {
        "pseudo-element": /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
        "pseudo-class": /:[-\w]+(?:\(.*\))?/,
        class: /\.[-:\.\w]+/,
        id: /#[-:\.\w]+/
    }
}, Prism.languages.insertBefore("css", "function", {
    hexcode: /#[\da-f]{3,6}/i,
    entity: /\\[\da-f]{1,8}/i,
    number: /[\d%\.]+/
}), Prism.languages.http = {
    "request-line": {
        pattern: /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b\shttps?:\/\/\S+\sHTTP\/[0-9.]+/m,
        inside: {
            property: /^(POST|GET|PUT|DELETE|OPTIONS|PATCH|TRACE|CONNECT)\b/,
            "attr-name": /:\w+/
        }
    },
    "response-status": {
        pattern: /^HTTP\/1.[01] [0-9]+.*/m,
        inside: {
            property: {
                pattern: /(^HTTP\/1.[01] )[0-9]+.*/i,
                lookbehind: !0
            }
        }
    },
    "header-name": {
        pattern: /^[\w-]+:(?=.)/m,
        alias: "keyword"
    }
};
var httpLanguages = {
    "application/json": Prism.languages.javascript,
    "application/xml": Prism.languages.markup,
    "text/xml": Prism.languages.markup,
    "text/html": Prism.languages.markup
};
for (var contentType in httpLanguages)
    if (httpLanguages[contentType]) {
        var options = {};
        options[contentType] = {
            pattern: new RegExp("(content-type:\\s*" + contentType + "[\\w\\W]*?)(?:\\r?\\n|\\r){2}[\\w\\W]*", "i"),
            lookbehind: !0,
            inside: {
                rest: httpLanguages[contentType]
            }
        }, Prism.languages.insertBefore("http", "header-name", options)
    } Prism.languages.json = {
        property: /".*?"(?=\s*:)/gi,
        string: /"(?!:)(\\?[^"])*?"(?!:)/g,
        number: /\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/g,
        punctuation: /[{}[\]);,]/g,
        operator: /:/g,
        boolean: /\b(true|false)\b/gi,
        null: /\bnull\b/gi
    }, Prism.languages.jsonp = Prism.languages.json, Prism.languages.markdown = Prism.languages.extend("markup", {}), Prism.languages.insertBefore("markdown", "prolog", {
        blockquote: {
            pattern: /^>(?:[\t ]*>)*/m,
            alias: "punctuation"
        },
        code: [{
            pattern: /^(?: {4}|\t).+/m,
            alias: "keyword"
        }, {
            pattern: /``.+?``|`[^`\n]+`/,
            alias: "keyword"
        }],
        title: [{
            pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
            alias: "important",
            inside: {
                punctuation: /==+$|--+$/
            }
        }, {
            pattern: /(^\s*)#+.+/m,
            lookbehind: !0,
            alias: "important",
            inside: {
                punctuation: /^#+|#+$/
            }
        }],
        hr: {
            pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
            lookbehind: !0,
            alias: "punctuation"
        },
        list: {
            pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
            lookbehind: !0,
            alias: "punctuation"
        },
        "url-reference": {
            pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
            inside: {
                variable: {
                    pattern: /^(!?\[)[^\]]+/,
                    lookbehind: !0
                },
                string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
                punctuation: /^[\[\]!:]|[<>]/
            },
            alias: "url"
        },
        bold: {
            pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
            lookbehind: !0,
            inside: {
                punctuation: /^\*\*|^__|\*\*$|__$/
            }
        },
        italic: {
            pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
            lookbehind: !0,
            inside: {
                punctuation: /^[*_]|[*_]$/
            }
        },
        url: {
            pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
            inside: {
                variable: {
                    pattern: /(!?\[)[^\]]+(?=\]$)/,
                    lookbehind: !0
                },
                string: {
                    pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
                }
            }
        }
    }), Prism.languages.markdown.bold.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.italic.inside.url = Prism.util.clone(Prism.languages.markdown.url), Prism.languages.markdown.bold.inside.italic = Prism.util.clone(Prism.languages.markdown.italic), Prism.languages.markdown.italic.inside.bold = Prism.util.clone(Prism.languages.markdown.bold), Prism.languages.php = Prism.languages.extend("clike", {
        keyword: /\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,
        constant: /\b[A-Z0-9_]{2,}\b/,
        comment: {
            pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
            lookbehind: !0
        }
    }), Prism.languages.insertBefore("php", "class-name", {
        "shell-comment": {
            pattern: /(^|[^\\])#.*/,
            lookbehind: !0,
            alias: "comment"
        }
    }), Prism.languages.insertBefore("php", "keyword", {
        delimiter: /\?>|<\?(?:php)?/i,
        variable: /\$\w+\b/i,
        package: {
            pattern: /(\\|namespace\s+|use\s+)[\w\\]+/,
            lookbehind: !0,
            inside: {
                punctuation: /\\/
            }
        }
    }), Prism.languages.insertBefore("php", "operator", {
        property: {
            pattern: /(->)[\w]+/,
            lookbehind: !0
        }
    }), Prism.languages.markup && (Prism.hooks.add("before-highlight", function(a) {
        "php" === a.language && (a.tokenStack = [], a.backupCode = a.code, a.code = a.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/gi, function(b) {
            return a.tokenStack.push(b), "{{{PHP" + a.tokenStack.length + "}}}"
        }))
    }), Prism.hooks.add("before-insert", function(a) {
        "php" === a.language && (a.code = a.backupCode, delete a.backupCode)
    }), Prism.hooks.add("after-highlight", function(a) {
        if ("php" === a.language) {
            for (var b, c = 0; b = a.tokenStack[c]; c++) a.highlightedCode = a.highlightedCode.replace("{{{PHP" + (c + 1) + "}}}", Prism.highlight(b, a.grammar, "php").replace(/\$/g, "$$$$"));
            a.element.innerHTML = a.highlightedCode
        }
    }), Prism.hooks.add("wrap", function(a) {
        "php" === a.language && "markup" === a.type && (a.content = a.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g, '<span class="token php">$1</span>'))
    }), Prism.languages.insertBefore("php", "comment", {
        markup: {
            pattern: /<[^?]\/?(.*?)>/,
            inside: Prism.languages.markup
        },
        php: /\{\{\{PHP[0-9]+\}\}\}/
    })), ! function(a) {
        a.languages.sass = a.languages.extend("css", {
            comment: {
                pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t]+.+)*/m,
                lookbehind: !0
            }
        }), a.languages.insertBefore("sass", "atrule", {
            "atrule-line": {
                pattern: /^(?:[ \t]*)[@+=].+/m,
                inside: {
                    atrule: /(?:@[\w-]+|[+=])/m
                }
            }
        }), delete a.languages.sass.atrule;
        var b = /((\$[-_\w]+)|(#\{\$[-_\w]+\}))/i,
            c = [/[+*\/%]|[=!]=|<=?|>=?|\b(?:and|or|not)\b/, {
                pattern: /(\s+)-(?=\s)/,
                lookbehind: !0
            }];
        a.languages.insertBefore("sass", "property", {
            "variable-line": {
                pattern: /^[ \t]*\$.+/m,
                inside: {
                    punctuation: /:/,
                    variable: b,
                    operator: c
                }
            },
            "property-line": {
                pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s]+.*)/m,
                inside: {
                    property: [/[^:\s]+(?=\s*:)/, {
                        pattern: /(:)[^:\s]+/,
                        lookbehind: !0
                    }],
                    punctuation: /:/,
                    variable: b,
                    operator: c,
                    important: a.languages.sass.important
                }
            }
        }), delete a.languages.sass.property, delete a.languages.sass.important, delete a.languages.sass.selector, a.languages.insertBefore("sass", "punctuation", {
            selector: {
                pattern: /([ \t]*)\S(?:,?[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,?[^,\r\n]+)*)*/,
                lookbehind: !0
            }
        })
    }(Prism), Prism.languages.scss = Prism.languages.extend("css", {
        comment: {
            pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
            lookbehind: !0
        },
        atrule: {
            pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
            inside: {
                rule: /@[\w-]+/
            }
        },
        url: /(?:[-a-z]+-)*url(?=\()/i,
        selector: {
            pattern: /(?=\S)[^@;\{\}\(\)]?([^@;\{\}\(\)]|&|#\{\$[-_\w]+\})+(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/m,
            inside: {
                placeholder: /%[-_\w]+/
            }
        }
    }), Prism.languages.insertBefore("scss", "atrule", {
        keyword: [/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i, {
            pattern: /( +)(?:from|through)(?= )/,
            lookbehind: !0
        }]
    }), Prism.languages.insertBefore("scss", "property", {
        variable: /\$[-_\w]+|#\{\$[-_\w]+\}/
    }), Prism.languages.insertBefore("scss", "function", {
        placeholder: {
            pattern: /%[-_\w]+/,
            alias: "selector"
        },
        statement: /\B!(?:default|optional)\b/i,
        boolean: /\b(?:true|false)\b/,
        null: /\bnull\b/,
        operator: {
            pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
            lookbehind: !0
        }
    }), Prism.languages.scss.atrule.inside.rest = Prism.util.clone(Prism.languages.scss), Prism.languages.sql = {
        comment: {
            pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|(?:--|\/\/|#).*)/,
            lookbehind: !0
        },
        string: {
            pattern: /(^|[^@\\])("|')(?:\\?[\s\S])*?\2/,
            lookbehind: !0
        },
        variable: /@[\w.$]+|@("|'|`)(?:\\?[\s\S])+?\1/,
        function: /\b(?:COUNT|SUM|AVG|MIN|MAX|FIRST|LAST|UCASE|LCASE|MID|LEN|ROUND|NOW|FORMAT)(?=\s*\()/i,
        keyword: /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR VARYING|CHARACTER (?:SET|VARYING)|CHARSET|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMN|COLUMNS|COMMENT|COMMIT|COMMITTED|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|DATA(?:BASES?)?|DATETIME|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE(?: PRECISION)?|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE KEY|ELSE|ENABLE|ENCLOSED BY|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPE(?:D BY)?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|IDENTITY(?:_INSERT|COL)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTO|INVOKER|ISOLATION LEVEL|JOIN|KEYS?|KILL|LANGUAGE SQL|LAST|LEFT|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MODIFIES SQL DATA|MODIFY|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL(?: CHAR VARYING| CHARACTER(?: VARYING)?| VARCHAR)?|NATURAL|NCHAR(?: VARCHAR)?|NEXT|NO(?: SQL|CHECK|CYCLE)?|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READ(?:S SQL DATA|TEXT)?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEATABLE|REPLICATION|REQUIRE|RESTORE|RESTRICT|RETURNS?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE MODE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|START(?:ING BY)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED BY|TEXT(?:SIZE)?|THEN|TIMESTAMP|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNPIVOT|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?)\b/i,
        boolean: /\b(?:TRUE|FALSE|NULL)\b/i,
        number: /\b-?(?:0x)?\d*\.?[\da-f]+\b/,
        operator: /[-+*\/=%^~]|&&?|\|?\||!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|IN|LIKE|NOT|OR|IS|DIV|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
        punctuation: /[;[\]()`,.]/
    },
    function() {
        function a() {
            var a = "https://twitter.com/intent/tweet?hashtags=hubble&original_referer=https%3A%2F%2Fhubbleui.github.io%2F&text=Hubble%20UI&tw_p=tweetbutton&url=https%3A%2F%2Fhubbleui.github.io%2F";
            window.open(a, "_blank", "location=yes,height=570,width=520,scrollbars=yes,status=yes")
        }
        var b = Container.Helper(),
            c = b.$(".js-tweet-pop-up");
        b.in_dom(c) && c.addEventListener("click", function() {
            event.preventDefault(), a()
        })
    }(),
    function() {
        function a(a) {
            var codeEl = c[a],
            	_helper = b,
                code    = codeEl.innerHTML,
                syntax  = codeEl.dataset.syntax;
                code   = _helper.rtrim(_helper.ltrim(code.trim(), '<!--'), '-->').trim();
                codeEl.innerHTML = '';
                codeEl.innerText = code;
                
                if (!_helper.is_empty(syntax))
                {
                	_helper.add_class(codeEl, `language-${syntax}`);
                	Prism.highlightElement(codeEl);
                }
                else
                {
                	_helper.add_class(codeEl, 'language-noHighlight');
                }
        }
        var b = Container.Helper(),
            c = b.$All(".js-highlight");
        if (!b.is_empty(c))
            for (var d = 0; d < c.length; d++) a(d)
    }(),
    function() {
        var a, b = Container.Helper(),
            c = b.$(".js-doc-side-trigger"),
            d = b.$(".js-docs-menu"),
            e = b.$(".js-sidebar-overlay");
        b.in_dom(c) && c.addEventListener("click", function(f) {
            clearTimeout(a), b.has_class(e, "active") ? (b.remove_class(c, "active"), b.add_class(d, "removing"), b.remove_class(e, "active"), a = setTimeout(function() {
                b.remove_class(d, "active"), b.remove_class(d, "removing")
            }, 310)) : (b.add_class(c, "active"), b.add_class(d, "active"), b.add_class(e, "active"))
        }), e.addEventListener("click", function() {
            clearTimeout(a), b.has_class(e, "active") ? (b.remove_class(c, "active"), b.add_class(d, "removing"), b.remove_class(e, "active"), a = setTimeout(function() {
                b.remove_class(d, "active"), b.remove_class(d, "removing")
            }, 310)) : (b.add_class(c, "active"), b.add_class(d, "active"), b.add_class(e, "active"))
        })
    }();