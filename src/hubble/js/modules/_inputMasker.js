/**
 * InputMasker
 *
 * The InputMasker is a utility class used internally to apply and handle intput masking.
 * It can still be invoked directly via the IOC container if you want to use it.
 * @example Modules.require('InputMasker').creditcard();
 * @see     inputMasks.js
 */
 (function() {

    /**
     * @var Helper obj
     */
    var Helper = Modules.require('JSHelper');

    var Patterns = function() {
        
    };

    Patterns.money = function(value, opts) {
        opts = mergeMoneyOptions(opts);
        if (opts.zeroCents) {
            opts.lastOutput = opts.lastOutput || "";
            var zeroMatcher = ("(" + opts.separator + "[0]{0," + opts.precision + "})"),
                zeroRegExp = new RegExp(zeroMatcher, "g"),
                digitsLength = value.toString().replace(/[\D]/g, "").length || 0,
                lastDigitLength = opts.lastOutput.toString().replace(/[\D]/g, "").length || 0;
            value = value.toString().replace(zeroRegExp, "");
            if (digitsLength < lastDigitLength) {
                value = value.slice(0, value.length - 1);
            }
        }
        var number = value.toString().replace(/[\D]/g, ""),
            clearDelimiter = new RegExp("^(0|\\" + opts.delimiter + ")"),
            clearSeparator = new RegExp("(\\" + opts.separator + ")$"),
            money = number.substr(0, number.length - opts.moneyPrecision),
            masked = money.substr(0, money.length % 3),
            cents = new Array(opts.precision + 1).join("0");
        money = money.substr(money.length % 3, money.length);
        for (var i = 0, len = money.length; i < len; i++) {
            if (i % 3 === 0) {
                masked += opts.delimiter;
            }
            masked += money[i];
        }
        masked = masked.replace(clearDelimiter, "");
        masked = masked.length ? masked : "0";
        if (!opts.zeroCents) {
            var beginCents = number.length - opts.precision,
                centsValue = number.substr(beginCents, opts.precision),
                centsLength = centsValue.length,
                centsSliced = (opts.precision > centsLength) ? opts.precision : centsLength;
            cents = (cents + centsValue).slice(-centsSliced);
        }
        var output = opts.unit + masked + opts.separator + cents + opts.suffixUnit;
        return output.replace(clearSeparator, "");
    };

    Patterns.pattern = function(value, opts) {
        var pattern = (typeof opts === 'object' ? opts.pattern : opts),
            patternChars = pattern.replace(/\W/g, ''),
            output = pattern.split(""),
            values = value.toString().replace(/\W/g, ""),
            charsValues = values.replace(/\W/g, ''),
            index = 0,
            i,
            outputLength = output.length,
            placeholder = (typeof opts === 'object' ? opts.placeholder : undefined);

        for (i = 0; i < outputLength; i++) {
            // Reached the end of input
            if (index >= values.length) {
                if (patternChars.length == charsValues.length) {
                    return output.join("");
                } else if ((placeholder !== undefined) && (patternChars.length > charsValues.length)) {
                    return addPlaceholdersToOutput(output, i, placeholder).join("");
                } else {
                    break;
                }
            }
            // Remaining chars in input
            else {
                if ((output[i] === DIGIT && values[index].match(/[0-9]/)) ||
                    (output[i] === ALPHA && values[index].match(/[a-zA-Z]/)) ||
                    (output[i] === ALPHANUM && values[index].match(/[0-9a-zA-Z]/))) {
                    output[i] = values[index++];
                } else if (output[i] === DIGIT || output[i] === ALPHA || output[i] === ALPHANUM) {
                    if (placeholder !== undefined) {
                        return addPlaceholdersToOutput(output, i, placeholder).join("");
                    } else {
                        return output.slice(0, i).join("");
                    }
                }
            }
        }
        return output.join("").substr(0, i);
    };

    Patterns.numeric = function(value) {
        return value.toString().replace(/(?!^-)[^0-9]/g, "");
    };

    Patterns.alphaNumeric = function(value) {
        return value.toString().replace(/[^a-z0-9]+/i, "");
    };

    Patterns.alphaSpace = function(value) {
        return value.toString().replace(/[^a-z ]+/i, "");
    };

    Patterns.alphaNumericDash = function(value) {
        return value.toString().replace(/[^a-z0-9-]+/i, "");
    };

    Patterns.numericDecimal = function(value) {
        return value.toString().replace(/(?!^-)[^0-9\.]/g, "")
    };

    Patterns.alphaDash = function(value) {
        var val = value.toString();
        while (val[0] === '-') {
            val = val.slice(1);
        }
        return val.replace(/[^a-z-]+/i, "");
    };

    Patterns.alphaDashNumDot = function(value) {
        var val = value.toString();
        while (val[0] === '-') {
            val = val.slice(1);
        }
        return val.replace(/[^a-z0-9-.]+/i, "");
    };

    // INTERNAL VARIABLES
    /*****************************************/
    var DIGIT = "9",
    ALPHA = "A",
    ALPHANUM = "S",
    BY_PASS_KEYS = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91, 92, 93],
    isAllowedKeyCode = function(keyCode) {
        for (var i = 0, len = BY_PASS_KEYS.length; i < len; i++) {
            if (keyCode == BY_PASS_KEYS[i]) {
                return false;
            }
        }
        return true;
    },
    mergeMoneyOptions = function(opts) {
        opts = opts || {};
        opts = {
            precision: opts.hasOwnProperty("precision") ? opts.precision : 2,
            separator: opts.separator || ",",
            delimiter: opts.delimiter || ".",
            unit: opts.unit && (opts.unit.replace(/[\s]/g, '') + " ") || "",
            suffixUnit: opts.suffixUnit && (" " + opts.suffixUnit.replace(/[\s]/g, '')) || "",
            zeroCents: opts.zeroCents,
            lastOutput: opts.lastOutput
        };
        opts.moneyPrecision = opts.zeroCents ? 0 : opts.precision;
        return opts;
    },
    // Fill wildcards past index in output with placeholder
    addPlaceholdersToOutput = function(output, index, placeholder) {
        for (; index < output.length; index++) {
            if (output[index] === DIGIT || output[index] === ALPHA || output[index] === ALPHANUM) {
                output[index] = placeholder;
            }
        }
        return output;
    };

    // MODULE OBJECT
    /*****************************************/
    var InputMasker = function(element) {
        
        this.element = element;
    
        return this;
    }

    // UNBIND 
    /*****************************************/
    InputMasker.prototype._unbindElementToMask = function() {
        this.element.lastOutput = "";
        this.element.onkeyup = false;
        this.element.onkeydown = false;

        if (this.element.value.length) {
            this.element.value = this.element.value.replace(/\D/g, '');
        }
    };

    // BIND 
    /*****************************************/
    InputMasker.prototype._bindElementToMask = function(maskFunction) {
        var that = this,
            onType = function(e) {
                e = e || window.event;
                var source = e.target || e.srcElement;

                if (isAllowedKeyCode(e.keyCode)) {
                    setTimeout(function() {
                        that.opts.lastOutput = source.lastOutput;
                        source.value = Patterns[maskFunction](source.value, that.opts);
                        source.lastOutput = source.value;
                        if (source.setSelectionRange && that.opts.suffixUnit) {
                            source.setSelectionRange(source.value.length, (source.value.length - that.opts.suffixUnit.length));
                        }
                    }, 0);
                }
            };
        
        this.element.lastOutput = "";
        this.element.onkeyup = onType;
        if (this.element.value.length) {
            this.element.value = Patterns[maskFunction](this.element.value, this.opts);
        }
       
    };

    // PRESETS
    /*****************************************/
    InputMasker.prototype.creditcard = function() {
        this.opts = { pattern: '9999 9999 9999 9999' };
        this._bindElementToMask("pattern");
    };

    InputMasker.prototype.money = function(opts) {
        this.opts = mergeMoneyOptions(opts);
        this._bindElementToMask("money");
    };

    InputMasker.prototype.numeric = function() {
        this.opts = {};
        this._bindElementToMask("numeric");
    };

    InputMasker.prototype.numericDecimal = function(pattern) {
        this.opts = {
            pattern: pattern
        };
        this._bindElementToMask("numericDecimal");
    };

    InputMasker.prototype.alphaNumeric = function() {
        this.opts = {};
        this._bindElementToMask("alphaNumeric");
    };

    InputMasker.prototype.alphaSpace = function() {
        this.opts = {};
        this._bindElementToMask("alphaSpace");
    };

    InputMasker.prototype.alphaDash = function() {
        this.opts = {};
        this._bindElementToMask("alphaDash");
    };

    InputMasker.prototype.alphaNumericDash = function() {
        this.opts = {};
        this._bindElementToMask("alphaNumericDash");
    };

    InputMasker.prototype.pattern = function(pattern) {
        this.opts = {
            pattern: pattern
        };
        this._bindElementToMask("pattern");
    };

    InputMasker.prototype.remove = function() {
        this._unbindElementToMask();
    };

    // SET IN IOC
    /*****************************************/
    Modules.set('InputMasker', InputMasker);

}());