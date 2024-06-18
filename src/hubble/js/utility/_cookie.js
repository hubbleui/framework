/**
 * Cookie manager
 *
 * @see {https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie}
 * 
 */
(function()
{
    /* Base64 Polyfill https://github.com/davidchambers/Base64.js */
    ! function(e)
    {
        "use strict";
        if ("object" == typeof exports && null != exports && "number" != typeof exports.nodeType) module.exports = e();
        else if ("function" == typeof define && null != define.amd) define([], e);
        else
        {
            var t = e(),
                o = "undefined" != typeof self ? self : $.global;
            "function" != typeof o.btoa && (o.btoa = t.btoa), "function" != typeof o.atob && (o.atob = t.atob)
        }
    }(function()
    {
        "use strict";
        var f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        function c(e)
        {
            this.message = e
        }
        return (c.prototype = new Error).name = "InvalidCharacterError",
        {
            btoa: function(e)
            {
                for (var t, o, r = String(e), n = 0, a = f, i = ""; r.charAt(0 | n) || (a = "=", n % 1); i += a.charAt(63 & t >> 8 - n % 1 * 8))
                {
                    if (255 < (o = r.charCodeAt(n += .75))) throw new c("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                    t = t << 8 | o
                }
                return i
            },
            atob: function(e)
            {
                var t = String(e).replace(/[=]+$/, "");
                if (t.length % 4 == 1) throw new c("'atob' failed: The string to be decoded is not correctly encoded.");
                for (var o, r, n = 0, a = 0, i = ""; r = t.charAt(a++); ~r && (o = n % 4 ? 64 * o + r : r, n++ % 4) && (i += String.fromCharCode(255 & o >> (-2 * n & 6)))) r = f.indexOf(r);
                return i
            }
        }
    });

    /**
     * Cookie prefix
     * 
     * @var {string}
     */
    var _prefix = '_hb';

    /**
     * Module constructor
     *
     * @access {public}
     * @constructor
     {*} @return this
     */
    var Cookies = function()
    {
        return this;
    }

    /**
     * Set a cookie
     *
     * @access {public}
     * @param  {string}    key      Cookie key
     * @param  {string}    value    Cookie value
     * @param  {int}    days     Cookie expiry in days (optional) (default when browser closes)
     * @param  {string}    path     Cookie path (optional) (default "/")
     * @param  {bool}   secure   Secure policy (optional) (default) (true)
     * @param  {stringing} samesite Samesite policy (optional) (default) (true)
     * @return {sting}
     */
    Cookies.prototype.set = function(key, value, days, path, secure, samesite)
    {
        value = this._encodeCookieValue(value);
        key = this._normaliseKey(key);
        path = typeof path === 'undefined' ? '; path=/' : '; path=' + path;
        secure = (typeof secure === 'undefined' || secure === true) && window.location.protocol === 'https:' ? '; secure' : '';
        samesite = typeof samesite === 'undefined' ? '' : '; samesite=' + samesite;
        var expires = expires = "; expires=" + this._normaliseExpiry(days | 365);

        document.cookie = key + '=' + value + expires + path + secure + samesite;

        return value;
    }

    /**
     * Get a cookie
     *
     * @access {public}
     * @param  {string} key Cookie key
     * @return {mixed}
     */
    Cookies.prototype.get = function(key)
    {
        key = this._normaliseKey(key);

        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++)
        {
            var c = ca[i];

            while (c.charAt(0) == ' ')
            {
                c = c.substring(1);
            }

            if (c.indexOf(key) == 0)
            {
                return this._decodeCookieValue(c.split('=').pop());
            }
        }

        return false;
    }

    /**
     * Remove a cookie
     *
     * @access {public}
     * @param  {string} key Cookie to remove
     */
    Cookies.prototype.remove = function(key)
    {
        key = this._normaliseKey(key);

        document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    /**
     * Normalise cookie expiry date
     *
     * @access {private}
     * @param  {int}    days Days when cookie expires
     * @return {sting}
     */
    Cookies.prototype._normaliseExpiry = function(days)
    {
        var date = new Date();

        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        return date.toUTCString();
    }

    /**
     * Normalise cookie key
     *
     * @access {private}
     * @param  {string} key Cookie key
     * @return {sting}
     */
    Cookies.prototype._normaliseKey = function(key)
    {
        key = key.replace(/[^a-z0-9+]+/gi, '').toLowerCase();

        return _prefix + key;
    }

    /**
     * Encode cookie value
     *
     * @access {private}
     * @param  {mixed}  value Value to encode
     * @return {sting}
     */
    Cookies.prototype._encodeCookieValue = function(value)
    {
        try
        {
            value = this._base64_encode(JSON.stringify(value));
        }
        catch (e)
        {
            value = this._base64_encode(value);
        }

        return value;
    }

    /**
     * Decode cookie value
     *
     * @access {private}
     * @param  {string}  str Value to decode
     * @return {mixed}
     */
    Cookies.prototype._decodeCookieValue = function(str)
    {
        var value = this._base64_decode(str);

        try
        {
            value = JSON.parse(value);
        }
        catch (e)
        {
            return value;
        }

        return value;
    }

    /**
     * Base64 encode
     *
     * @access {private}
     * @param  {string} str String to encode
     * @return {sting}
     */
    Cookies.prototype._base64_encode = function(str)
    {
        return btoa(this._toBinary(str)).replace(/=/g, '_');
    }

    /**
     * Base64 decode
     *
     * @access {pubic}
     * @param  {string} str String to decode
     * @return {sting}
     */
    Cookies.prototype._base64_decode = function(str)
    {
        return this._fromBinary(atob(str.replace(/_/g, '=')));
    }

    /**
     * From binary
     *
     * @access {prvate}
     * @param  {string} binary String to decode
     * @return {string}
     */
    Cookies.prototype._fromBinary = function(binary)
    {
        const bytes = new Uint8Array(binary.length);

        for (var i = 0; i < bytes.length; i++)
        {
            bytes[i] = binary.charCodeAt(i);
        }

        return String.fromCharCode.apply(null, new Uint16Array(bytes.buffer));
    }

    /**
     * To binary
     *
     * @access {pubic}
     * @param  {string} string String to encode
     * @return {sting}
     */
    Cookies.prototype._toBinary = function(string)
    {
        const codeUnits = new Uint16Array(string.length);

        for (var i = 0; i < codeUnits.length; i++)
        {
            codeUnits[i] = string.charCodeAt(i);
        }

        return String.fromCharCode.apply(null, new Uint8Array(codeUnits.buffer));
    }

    // Register as DOM Module and invoke
    Container.singleton('Cookies', Cookies);

})();
