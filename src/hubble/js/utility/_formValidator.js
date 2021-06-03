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
     * @var Helper obj
     */
    var Helper = Container.Helper();

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @param form node
     * @access public
     * @return this
     */
    var FormValidator = function(form)
    {

        // Save inputs
        this._form = form;
        this._inputs = Helper.getFormInputs(form);

        // Defaults
        this._rulesIndex = [];
        this._invalids = [];
        this._formObj = {};
        this._nameIndex = {};
        this._validForm = true;

        // Initialize
        this._indexInputs();

        return this;

    };

    // PUBLIC ACCESS

    /**
     *  Is the form valid?
     *
     * @access public
     * @return boolean
     */
    FormValidator.prototype.isValid = function()
    {
        return this._validateForm();
    };

    /**
     * Show invalid inputs
     *
     * @access public
     */
    FormValidator.prototype.showInvalid = function()
    {

        this._clearForm();

        // Show the invalid inputs
        for (var j = 0; j < this._invalids.length; j++)
        {
            var __wrap = Helper.closest(this._invalids[j], '.form-field');
            if (Helper.nodeExists(__wrap)) Helper.addClass(__wrap, 'danger');
        }
    }

    /**
     * Remove errored inputs
     *
     * @access public
     */
    FormValidator.prototype.clearInvalid = function()
    {
        this._clearForm();
    }

    /**
     * Show form result
     *
     * @access public
     */
    FormValidator.prototype.showResult = function(result)
    {
        this._clearForm();
        Helper.addClass(this._form, result);
    }

    /**
     * Append a key/pair and return form obj
     *
     * @access public
     * @return obj
     */
    FormValidator.prototype.append = function(key, value)
    {
        this._formObj[key] = value;
        return this._generateForm();
    };

    /**
     * Get the form object
     *
     * @access public
     * @return obj
     */
    FormValidator.prototype.form = function()
    {
        return this._generateForm();
    };


    // PRIVATE FUNCTIONS

    /**
     * Index form inputs by name and rules
     *
     * @access public
     */
    FormValidator.prototype._indexInputs = function()
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
    };

    /**
     * Validate the form inputs
     *
     * @access private
     * @return boolean
     */
    FormValidator.prototype._validateForm = function()
    {
        this._invalids = [];
        this._validForm = true;

        for (var i = 0; i < this._rulesIndex.length; i++)
        {

            this._rulesIndex[i].isValid = true;

            var pos = this._rulesIndex[i];
            var value = Helper.getInputValue(pos.node);

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
    };

    /**
     * Generate the form object
     *
     * @access private
     * @return obj
     */
    FormValidator.prototype._generateForm = function()
    {
        for (var i = 0; i < this._inputs.length; i++)
        {
            var name = this._inputs[i].name;
            var value = Helper.getInputValue(this._inputs[i]);
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
                if (!Helper.isset(this._formObj[name])) this._formObj[name] = [];
                this._formObj[name].push(value);
            }
            else
            {
                this._formObj[name] = value;
            }
        }
        return this._formObj;
    };

    /**
     * Mark an input as not valid (internally)
     *
     * @access private
     * @return obj
     */
    FormValidator.prototype._devalidate = function(i)
    {
        this._rulesIndex[i].isValid = false;
        this._validForm = false;
        this._invalids.push(this._rulesIndex[i].node);
    };

    /**
     * Clear form result and input errors
     *
     * @access private
     * @return obj
     */
    FormValidator.prototype._clearForm = function(i)
    {
        // Remove the form result
        Helper.removeClass(this._form, ['info', 'success', 'warning', 'danger']);

        // Make all input elements 'valid' - i.e hide the error msg and styles.
        for (var i = 0; i < this._inputs.length; i++)
        {
            var _wrap = Helper.closest(this._inputs[i], '.form-field');
            if (Helper.nodeExists(_wrap)) Helper.removeClass(_wrap, ['info', 'success', 'warning', 'danger'])
        }
    };

    /**
     * Private validator methods
     *
     * @access private
     * @return boolean
     */
    FormValidator.prototype._validateEmail = function(value)
    {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    };
    FormValidator.prototype._validateName = function(value)
    {
        var re = /^[A-z _-]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validateNumeric = function(value)
    {
        var re = /^[\d]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validatePassword = function(value)
    {
        var re = /^(?=.*[^a-zA-Z]).{6,40}$/;
        return re.test(value);
    };
    FormValidator.prototype._validateUrl = function(value)
    {
        re = /^(www\.|[A-z]|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        return re.test(value);
    };
    FormValidator.prototype._validateMinLength = function(value, min)
    {
        return value.length >= min;
    };
    FormValidator.prototype._validateMaxLength = function(value, max)
    {
        return value.length <= max;
    };
    FormValidator.prototype._validateAplha = function(value)
    {
        var re = /^[A-z _-]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validateAplhaNumeric = function(value)
    {
        var re = /^[A-z0-9]+$/;
        return re.test(value);
    };
    FormValidator.prototype._validateList = function(value)
    {
        var re = /^[-\w\s]+(?:,[-\w\s]*)*$/;
        return re.test(value);
    };
    FormValidator.prototype._validateCreditCard = function(value)
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
    };

    // Load into container
    Container.set('FormValidator', FormValidator);

})();
