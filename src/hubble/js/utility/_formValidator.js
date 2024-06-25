/**
 * FormValidator
 *
 * This class is used to validate a form and 
 * also apply and classes to display form results and input errors.
 *
 */
(function()
{

    /**
     * @var {Helper} obj
     */
    const Helper = Container.Helper();

    /**
     * Module constructor
     *
     * @class
     {*} @constructor
     * @param {form} node
     * @access {public}
     * @return {this}
     */
    class FormValidator
    {
        constructor(form)
        {
            // Save inputs
            this._form = form;
            this._inputs = Helper.form_inputs(form);

            // Defaults
            this._rulesIndex = [];
            this._invalids = [];
            this._formObj = {};
            this._nameIndex = {};
            this._validForm = true;

            // Initialize
            this._indexInputs();

            return this;
        }

        // PUBLIC ACCESS

        /**
         *  Is the form valid?
         *
         * @access {public}
         * @return {boolean}
         */
        isValid()
        {
            return this._validateForm();
        }

        /**
         * Show invalid inputs
         *
         * @access {public}
         */
        showInvalid()
        {
            this._clearForm();

            // Show the invalid inputs
            for (var j = 0; j < this._invalids.length; j++)
            {
                var __wrap = Helper.closest(this._invalids[j], '.form-field');
                if (Helper.in_dom(__wrap)) Helper.add_class(__wrap, 'danger');
            }
        }

        /**
         * Remove errored inputs
         *
         * @access {public}
         */
        clearInvalid()
        {
            this._clearForm();
        }

        /**
         * Show form result
         *
         * @access {public}
         */
        showResult(result)
        {
            this._clearForm();
            Helper.add_class(this._form, result);
        }

        /**
         * Append a key/pair and return form obj
         *
         * @access {public}
         * @return {obj}
         */
        append(key, value)
        {
            this._formObj[key] = value;
            return this._generateForm();
        };

        /**
         * Get the form object
         *
         * @access {public}
         * @return {obj}
         */
        form()
        {
            return this._generateForm();
        }

        // PRIVATE FUNCTIONS

        /**
         * Index form inputs by name and rules
         *
         * @access {public}
         */
        _indexInputs()
        {
            for (var i = 0; i < this._inputs.length; i++)
            {
                if (!this._inputs[i].name) continue;
                var name = this._inputs[i].name;
                this._nameIndex[name] = this._inputs[i];
                this._rulesIndex.push(
                {
                    node: this._inputs[i],
                    isRequired: this._inputs[i].dataset.jsRequired || null,
                    validationMinLength: this._inputs[i].dataset.jsMinLegnth || null,
                    validationMaxLength: this._inputs[i].dataset.jsMaxLegnth || null,
                    validationType: this._inputs[i].dataset.jsValidation || null,
                    isValid: true,
                });
            }
        }

        /**
         * Validate the form inputs
         *
         * @access {private}
         * @return {boolean}
         */
        _validateForm()
        {
            this._invalids = [];
            this._validForm = true;

            for (var i = 0; i < this._rulesIndex.length; i++)
            {

                this._rulesIndex[i].isValid = true;

                var pos = this._rulesIndex[i];
                var value = Helper.input_value(pos.node);

                if (!pos.isRequired && value === '')
                {
                    continue;
                }
                else if (pos.isRequired && value.replace(/ /g, '') === '')
                {
                    this._devalidate(i);
                }
                else if (pos.validationMinLength && !this._validateMinLength(value, pos.validationMinLength))
                {
                    this._devalidate(i);
                }
                else if (pos.validationMaxLength && !this._validateMaxLength(value, pos.validationMaxLength))
                {
                    this._devalidate(i);
                }
                else if (pos.validationType)
                {
                    var isValid = true;
                    if (pos.validationType === 'email') isValid = this._validateEmail(value);
                    if (pos.validationType === 'name') isValid = this._validateName(value);
                    if (pos.validationType === 'password') isValid = this._validatePassword(value);
                    if (pos.validationType === 'creditcard') isValid = this._validateCreditCard(value);
                    if (pos.validationType === 'url') isValid = this._validateUrl(value);
                    if (pos.validationType === 'alpha') isValid = this.alpha(value);
                    if (pos.validationType === 'numeric') isValid = this._validateNumeric(value);
                    if (pos.validationType === 'list') isValid = this._validateList(value);
                    if (!isValid) this._devalidate(i);
                }
            }

            return this._validForm;
        }

        /**
         * Generate the form object
         *
         * @access {private}
         * @return {obj}
         */
        _generateForm()
        {
            for (var i = 0; i < this._inputs.length; i++)
            {
                var name = this._inputs[i].name;
                var value = Helper.input_value(this._inputs[i]);
                if (this._inputs[i].type === 'radio' && this._inputs[i].checked == false)
                {
                    continue;
                }
                if (this._inputs[i].type === 'checkbox')
                {
                    this._formObj[name] = (this._inputs[i].checked == true);
                    continue;
                }
                if (name.indexOf('[]') > -1)
                {
                    if (!this._formObj[name]) this._formObj[name] = [];
                    this._formObj[name].push(value);
                }
                else
                {
                    this._formObj[name] = value;
                }
            }
            return this._formObj;
        }

        /**
         * Mark an input as not valid (internally)
         *
         * @access {private}
         * @return {obj}
         */
        _devalidate(i)
        {
            this._rulesIndex[i].isValid = false;
            this._validForm = false;
            this._invalids.push(this._rulesIndex[i].node);
        }

        /**
         * Clear form result and input errors
         *
         * @access {private}
         * @return {obj}
         */
        _clearForm(i)
        {
            // Remove the form result
            Helper.remove_class(this._form, ['info', 'success', 'warning', 'danger']);

            // Make all input elements 'valid' - i.e hide the error msg and styles.
            for (var i = 0; i < this._inputs.length; i++)
            {
                var _wrap = Helper.closest(this._inputs[i], '.form-field');
                if (Helper.in_dom(_wrap)) Helper.remove_class(_wrap, ['info', 'success', 'warning', 'danger'])
            }
        }

        /**
         * Private validator methods
         *
         * @access {private}
         * @return {boolean}
         */
        _validateEmail(value)
        {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(value);
        }
        _validateName(value)
        {
            var re = /^[A-z _-]+$/;
            return re.test(value);
        }
        _validateNumeric(value)
        {
            var re = /^[\d]+$/;
            return re.test(value);
        }
        _validatePassword(value)
        {
            var re = /^(?=.*[^a-zA-Z]).{6,40}$/;
            return re.test(value);
        }
        _validateUrl(value)
        {
            re = /^(www\.|[A-z]|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
            return re.test(value);
        }
        _validateMinLength(value, min)
        {
            return value.length >= min;
        }
        _validateMaxLength(value, max)
        {
            return value.length <= max;
        }
        _validateAplha(value)
        {
            var re = /^[A-z _-]+$/;
            return re.test(value);
        }
        _validateAplhaNumeric(value)
        {
            var re = /^[A-z0-9]+$/;
            return re.test(value);
        }
        _validateList(value)
        {
            var re = /^[-\w\s]+(?:,[-\w\s]*)*$/;
            return re.test(value);
        }
        _validateCreditCard(value)
        {
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
        }
    }

    // Load into container
    Container.set('FormValidator', FormValidator);

})();
