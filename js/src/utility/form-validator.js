(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find_all, add_class, attr, bool, closest, each, form_inputs, form_values, in_dom, input_value, is_callable, is_empty, remove_class] = FrontBx.import(['find_all','add_class','attr','bool','closest','each','form_inputs','form_values','in_dom','input_value','is_callable','is_empty','remove_class']).from('_');

    /**
     * Validator functions
     *
     * @access {private}
     * @return {boolean}
     */
    const VALIDATORS = 
    {
        email: function(value)
        {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value);
        },
        name: function(value)
        {
            var re = /^[A-z _-]+$/;
            return re.test(value);
        },
        numeric: function(value)
        {
            var re = /^[\d]+$/;
            return re.test(value);
        },
        password: function(value)
        {
            var re = /^(?=.*[^a-zA-Z]).{6,40}$/;
            return re.test(value);
        },
        url: function(value)
        {
            re = /^(www\.|[A-z]|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
            return re.test(value);
        },
        alpha: function(value)
        {
            var re = /^[A-z _-]+$/;
            return re.test(value);
        },
        alphanumeric: function(value)
        {
            var re = /^[A-z0-9]+$/;
            return re.test(value);
        },
        list: function(value)
        {
            var re = /^[-\w\s]+(?:,[-\w\s]*)*$/;

            return re.test(value);
        },
        creditcard: function(value)
        {
            /*Amex Card: ^3[47][0-9]{13}$
            BCGlobal: ^(6541|6556)[0-9]{12}$
            Carte Blanche Card: ^389[0-9]{11}$
            Diners Club Card: ^3(?:0[0-5]|[68][0-9])[0-9]{11}$
            Discover Card: ^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$
            Insta Payment Card: ^63[7-9][0-9]{13}$
            JCB Card: ^(?:2131|1800|35\d{3})\d{11}$
            KoreanLocalCard: ^9[0-9]{15}$
            Laser Card: ^(6304|6706|6709|6771)[0-9]{12,15}$
            Maestro Card: ^(5018|5020|5038|6304|6759|6761|6763)[0-9]{8,15}$
            Mastercard: ^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$
            Solo Card: ^(6334|6767)[0-9]{12}|(6334|6767)[0-9]{14}|(6334|6767)[0-9]{15}$
            Switch Card: ^(4903|4905|4911|4936|6333|6759)[0-9]{12}|(4903|4905|4911|4936|6333|6759)[0-9]{14}|(4903|4905|4911|4936|6333|6759)[0-9]{15}|564182[0-9]{10}|564182[0-9]{12}|564182[0-9]{13}|633110[0-9]{10}|633110[0-9]{12}|633110[0-9]{13}$
            Union Pay Card: ^(62[0-9]{14,17})$
            Visa Card: ^4[0-9]{12}(?:[0-9]{3})?$
            Visa Master Card: ^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14})$*/

            var arr = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];
            var ccNum = String(value).replace(/[- ]/g, '');

            var
                len = ccNum.length,
                bit = 1,
                sum = 0,
                val;

            while (len)
            {
                val = parseInt(ccNum.charAt(--len), 10);
                sum += (bit ^= 1) ? arr[val] : val;
            }

            return sum && sum % 10 === 0;
        },
        minlength: function(value, min)
        {
            return value.length >= min;
        },
        maxlength: function(value, max)
        {
            return value.length <= max;
        }
    };

    /**
     * FormValidator
     *
     * This class is used to validate a form and 
     * also apply and classes to display form results and input errors.
     *
     */
    const FormValidator = function(form)
    {
        // Save inputs
        this._DOMElementForm = form;
        this._DOMElementsFormFields = find_all('.form-field', form);
        this._inputs = form_inputs(form);

        // Defaults
        this._rulesIndex = [];
        this._invalids   = [];
        this._formObj    = {};

        // Initialize
        this._indexValidations();
    }

    /**
     *  Is the form valid?
     *
     * @access {public}
     * @return {boolean}
     */
    FormValidator.prototype.isValid = function()
    {
        return this._validateForm();
    }

    /**
     * Show invalid inputs
     *
     * @access {public}
     */
    FormValidator.prototype.showInvalid = function()
    {
        this._clearForm();

        each(this._invalids, function(i, input)
        {
            var fieldWrap = closest(input, '.form-field');

            if (in_dom(fieldWrap)) add_class(fieldWrap, 'danger');
        });
    }

    /**
     * Remove errored inputs
     *
     * @access {public}
     */
    FormValidator.prototype.clearInvalid = function()
    {
        this._clearForm();
    }

    /**
     * Show form result
     *
     * @access {public}
     */
    FormValidator.prototype.showResult = function(result)
    {
        this._clearForm();

        add_class(this._DOMElementForm, result);
    }

    /**
     * Append a key/pair and return form obj
     *
     * @access {public}
     * @return {obj}
     */
    FormValidator.prototype.append = function(key, value)
    {
        this._formObj[key] = value;

        let form = this.form();

        return {...form, ...this._formObj};
    };

    /**
     * Get the form object
     *
     * @access {public}
     * @return {obj}
     */
    FormValidator.prototype.form = function()
    {
        return form_values(this._DOMElementForm);
    }

    /**
     * Index form inputs by name and rules
     *
     * @access {public}
     */
    FormValidator.prototype._indexValidations = function()
    {
        each(this._inputs, function(i, input)
        {
            // No name
            if (!input.name) return;

            this._rulesIndex.push(
            {
                node:       input,
                required:   bool(attr(input, 'data-js-required')),
                minlength:  attr(input, 'data-js-min-length'),
                maxlength:  attr(input, 'data-js-max-length'),
                validation: this._validationFunc(attr(input, 'data-js-validation')),
                valid:      true,
            });

        }, this);
    }

    /**
     * Index form inputs by name and rules
     *
     * @access {public}
     */
    FormValidator.prototype._validationFunc = function(name)
    {
        if (!name) return;

        let key = name.replaceAll('-', '').toLowerCase();

        if (!VALIDATORS[key]) throw new error(`Unsupported input validation [${name}].`)

        return VALIDATORS[key];
    }

    /**
     * Validate the form inputs
     *
     * @access {private}
     * @return {boolean}
     */
    FormValidator.prototype._validateForm = function()
    {
        this._invalids = [];
        this._isValid  = true;

        each(this._rulesIndex, function(i, ruleset)
        {
            let input = ruleset.node;
            let value = input_value(ruleset.node);

            // Skip radios, they don't have any validation
            if (input.type === 'radio') return;
            
            if (ruleset.required && is_empty(value))
            {
                this._devalidate(input);
            }
            else if (ruleset.minlength && !VALIDATORS.minlength.call(null, value, ruleset.minlength))
            {
                this._devalidate(input);
            }
            else if (ruleset.maxlength && !VALIDATORS.maxlength.call(null, value, ruleset.maxlength))
            {
                this._devalidate(input);
            }
            else if (is_callable(ruleset.validation) && !ruleset.validation.call(null, value))
            {
                this._devalidate(input);
            }

        }, this);

        return this._isValid;
    }

    /**
     * Mark an input as not valid (internally)
     *
     * @access {private}
     * @return {obj}
     */
    FormValidator.prototype._devalidate = function(node)
    {
        this._isValid = false;

        this._invalids.push(node);
    }

    /**
     * Clear form result and input errors
     *
     * @access {private}
     * @return {obj}
     */
    FormValidator.prototype._clearForm = function()
    {
        // Remove the form result
        remove_class(this._DOMElementForm, ['info', 'success', 'warning', 'danger']);

        // Make all input elements 'valid' - i.e hide the error msg and styles.
        remove_class(this._DOMElementsFormFields, ['info', 'success', 'warning', 'danger']);
    }

    // Load into container
    FrontBx.set('FormValidator', FormValidator);

})();