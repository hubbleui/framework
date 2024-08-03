(function()
{
    /**
     * Cached helper functions.
     * 
     * @var {functions}
     */
    const [add_event_listener, remove_event_listener, _map, is_regexp] = Hubble.import(['add_event_listener', 'remove_event_listener', 'map', 'is_regexp']).from('_');

    /**
     * Regex masks
     * 
     * @var {object}
     */
    const MASK_MAP = 
    {
        creditcard: /[0-9]/,
        money: /[0-9.]/,
        numeric: /[0-9]/,
        numericdecimal: /[0-9.]/,
        alphanumeric: /[A-z0-9-]/,
        alphaspace: /[A-z ]/,
        alphadash: /[A-z-]/,
        alphanumericdash: /[A-z0-9-]/,
    };

    /**
     * Credit card formatters.
     * 
     * @var {function}
     */
    const _format_464 = function(cc)
    {
        return [cc.substring(0,4),cc.substring(4,10),cc.substring(10,14)].join(' ').trim()
    };
    const _format_465 = function(cc)
    {
        return [cc.substring(0,4),cc.substring(4,10),cc.substring(10,15)].join(' ').trim()
    };
    const _format_4444 = function(cc)
    {
        return cc?cc.match(/[0-9]{1,4}/g).join(' '):''
    };

    /**
     * Credit card formatting.
     * 
     * @var {object}
     */
    const _CARD_TYPES =
    [
        {'type':'visa','pattern':/^4/, 'format': _format_4444, 'maxlength': 19},
        {'type':'master','pattern':/^((5[12345])|(2[2-7]))/, 'format': _format_4444, 'maxlength': 16},
        {'type':'amex','pattern':/^3[47]/, 'format': _format_465, 'maxlength':15},
        {'type':'jcb','pattern':/^35[2-8]/, 'format': _format_465, 'maxlength':19},
        {'type':'maestro','pattern':/^(5018|5020|5038|5893|6304|6759|676[123])/, 'format': _format_4444, 'maxlength':19},
        {'type':'discover','pattern':/^6[024]/, 'format': _format_4444, 'maxlength':19},
        {'type':'instapayment','pattern':/^63[789]/, 'format': _format_4444, 'maxlength':16},
        {'type':'diners_club','pattern':/^54/, 'format': _format_4444, 'maxlength':16},
        {'type':'diners_club_international','pattern':/^36/, 'format': _format_464, 'maxlength':14},
        {'type':'diners_club_carte_blanche','pattern':/^30[0-5]/, 'format': _format_464, 'maxlength':14}
    ];    

    /**
     * InputMasker
     *
     */
    class InputMasker
    {
        /**
         * Module constructor
         *
         * @constructor
         * @param       {DOMElement}  element  Input element
         * @param       {string}      mask     Supported mask name or regex filter as string
         * @param       {string}      format   Optional format e.g (xxxx-xxxx-xxxx-xxxx);
         */
        constructor(element, mask, format)
        {
            this.DOMElement = element;

            this.maskRegexp = this._getMaskRegexp(mask);

            this.format = !format ? null : this._buildFormatRegexp(format);

            this.maskName = mask;

            this.handler = function(){};

            this._bind();

            return this;
        }

        /**
         * Disable the mask
         *
         * @access {public}
         */
        destroy()
        {
            remove_event_listener(this.DOMElement, 'input', this.handler);
            remove_event_listener(this.DOMElement, 'paste', this.handler);
        }

        /**
         * Binds input events.
         *
         * @access {private}
         */
        _bind()
        {
            var _this      = this;
            var DOMElement = this.DOMElement;
            var maskRegexp = this.maskRegexp;
            var format     = this.format;
            var isCC       = _this.maskName === 'creditcard';

            const _handler = function(e)
            {
                e = e || window.event;

                _this._handle(DOMElement, DOMElement.value, maskRegexp, isCC);
            }

            this.handler = _handler;

            add_event_listener(this.DOMElement, 'input', _handler);
            add_event_listener(this.DOMElement, 'paste', _handler);
        }

        /**
         * Get or builds mask regexp.
         *
         * @access {private}
         * @param  {string}  mask
         * @return {RegExp}
         */
        _getMaskRegexp(mask)
        {
            if (is_regexp(mask)) return mask;
            
            let regexp = MASK_MAP[mask.replaceAll('-', '').toLowerCase()];

            if (!regexp)
            {
                return new RegExp(mask);
            }

            return regexp;
        }

        /**
         * Builds custom format values.
         *
         * @access {private}
         * @param  {string}  format Formatting string
         * @return {object}
         */
        _buildFormatRegexp(format)
        {
            let raw        = format;
            let seperators = format.split('x').filter((x) => x !== '');
            let regexp     = new RegExp(_map(format.split(/[^x]/), (i, x) => x.includes('x') ? `(.{0,${x.length}})` : false ).join(''));
            let prefix     = format.startsWith('x') ? '' : seperators.shift();
            let suffix     = format.endsWith('x') ? '' : seperators.pop();
            let len        = (raw.length -suffix.length);

            return { seperators, regexp, prefix, suffix, raw, len };
        }
        
        /**
         * Custom format function.
         *
         * @access {private}
         * @param  {string}  str
         * @return {str}
         */
        _formatFilter(str)
        {
            // Regex filter
            str = _map(str.split(''), (x, char) => !this.maskRegexp.test(char) ? null : char ).join('');

            // Ignore or no formatting
            if (str === '' || !this.format) return str;

            // Cache seperators
            let { seperators, regexp, prefix, suffix, raw, len } = this.format;

            let splits = _map(str.match(regexp).slice(1), (i, str) => str === '' ? false : str);
            let mapped = _map(splits, function(i, match)
            {
                return i === 0 ? prefix + match : seperators[i-1] + match;
                
            }).join('');

            if (mapped.length === len)
            {
                mapped += suffix;
            }

            return mapped;
        }

        /**
         * Sepcial handler for creditcard
         *
         * @access {private}
         */
        _formatCC(cc)
        {           
            cc = cc.replaceAll(/[^0-9]/g, '');

            for(var i in _CARD_TYPES)
            {
                const ct = _CARD_TYPES[i];

                if (cc.match(ct.pattern))
                {
                    cc = cc.substring(0, ct.maxlength)
                    
                    return ct.format(cc);
                }
            }

            cc = cc.substring(0,19);

            return _format_4444(cc);
        }

        /**
         * Handles input event
         *
         * @access {private}
         * @param  {DOMElement} DOMElement
         * @param  {string}     oldval     
         * @param  {RegExp}     maskRegexp 
         * @param  {bool}       isCC 
         */
        _handle(DOMElement, oldval, maskRegexp, isCC)
        {
            // Filter
            let newVal = isCC ? this._formatCC(oldval) : this._formatFilter(oldval);

            // Ignore no change
            if (newVal == oldval) return;

            // Set position and format
            var pos          = DOMElement.selectionStart;
            var before_caret = oldval.substring(0, pos);
            before_caret     = isCC ? this._formatCC(oldval) : this._formatFilter(before_caret);
            pos              = before_caret.length;
            
            DOMElement.value = newVal;
            DOMElement.focus();
            DOMElement.setSelectionRange(pos,pos);
        }
    }

    // SET IN IOC
    /*****************************************/
    Hubble.set('InputMasker', InputMasker);

}());
