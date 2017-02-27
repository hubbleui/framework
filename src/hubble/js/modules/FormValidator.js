(function() {

    // REQUIRES
    /*****************************************/
    var Helper = Modules.require('JSHelper');

    // MODULE
    /*****************************************/
    var FormValidator = function(form) {

        // Save inputs
        this._form   = form;
        this._inputs = Helper.getFormInputs(form);

        // Defaults
        this._rulesIndex      = [];
        this._invalids        = [];
        this._formObj         = {};
        this._nameIndex       = {};
        this._validForm       = true;

        // Initialize
        this._indexInputs();
    
        return this;

    };

    // PUBLIC ACCESS
    /*****************************************/
    
    // Is the form valid?
    FormValidator.prototype.isValid = function() {       
        return this._validateForm();
    };
    
    // Show invalid inputs
    FormValidator.prototype.showInvalid = function() {
        
        this._clearForm();

        // Show the invalid inputs
        for (var j = 0; j < this._invalids.length; j++) {
            var __wrap = Helper.parentUntillClass(this._invalids[j], 'form-field');
            if (Helper.nodeExists(__wrap)) Helper.addClass(__wrap, 'danger');
        }
    };

    // Show the form result
    FormValidator.prototype.showResult = function(result) {
        this._clearForm();
        Helper.addClass(this._form, result);
    }
    
    // Append a keypair
    FormValidator.prototype.append = function(key, value) {
        this._formObj[key] = value;
        return  this._generateForm();
    };
    
    // Get the form
    FormValidator.prototype.form = function() {
        return  this._generateForm();
    };


    // INDEX BY NAME AND RULES
    /*****************************************/
    FormValidator.prototype._indexInputs = function() {
        for (var i = 0; i < this._inputs.length; i++) {
            if (!this._inputs[i].name) continue;
            var name = this._inputs[i].name;
            this._nameIndex[name] = this._inputs[i];
            this._rulesIndex.push({
                node: this._inputs[i],
                isRequired: this._inputs[i].dataset.jsRequired || null,
                validationMinLength: this._inputs[i].dataset.jsMinLegnth || null,
                validationMaxLength: this._inputs[i].dataset.jsMaxLegnth || null,
                validationType: this._inputs[i].dataset.jsValidation || null,
                isValid: true,
            });
        }
    };

    // VALIDATE THE FORM
    /*****************************************/
    FormValidator.prototype._validateForm = function() {
        this._invalids = [];
        this._validForm = true;

        for (var i = 0; i < this._rulesIndex.length; i++) {
            
            this._rulesIndex[i].isValid = true;

            var pos   = this._rulesIndex[i];
            var value = Helper.getInputValue(pos.node);

            if (!pos.isRequired && value === '') {
                continue;
            } else if (pos.isRequired && value.replace(/ /g,'') === '') {
                this._devalidate(i);
            } else if (pos.validationMinLength && !this.validateMinLength(value, pos.validationMinLength)) {
                this._devalidate(i);
            } else if (pos.validationMaxLength && !this.validateMaxLength(value, pos.validationMaxLength)) {
                this._devalidate(i);
            } else if (pos.validationType) {
                var isValid = true;
                if (pos.validationType === 'email') isValid = this.validateEmail(value);
                if (pos.validationType === 'name') isValid = this.validateName(value);
                if (pos.validationType === 'password') isValid = this.validatePassword(value);
                if (pos.validationType === 'creditcard') isValid = this.validateCreditCard(value);
                if (pos.validationType === 'url') isValid = this.validateUrl(value);
                if (pos.validationType === 'alpha') isValid = this.alpha(value);
                if (pos.validationType === 'numeric') isValid = this.validateNumeric(value);
                if (pos.validationType === 'list') isValid = this.validateList(value);
                if (!isValid) this._devalidate(i);
            }
        }

        return this._validForm;
    };

    // GENERATE THE FORM
    /*****************************************/
    FormValidator.prototype._generateForm = function() {
        for (var i = 0; i < this._inputs.length; i++) {
            var name  = this._inputs[i].name;
            var value = Helper.getInputValue(this._inputs[i]);
            if (this._inputs[i].type === 'radio' && this._inputs[i].checked == false) {
                continue;
            }
            if (Helper.is_numeric(value)) value = parseInt(value);
            if (name.indexOf('[]') > -1) {
                if (!Helper.isset(this._formObj[name])) this._formObj[name] = [];
                this._formObj[name].push(value);
            }
            else {
                this._formObj[name] = value;
            }
        }
        return this._formObj;
    };

    // DEVALIDATE AN INPUT
    /*****************************************/
    FormValidator.prototype._devalidate = function(i) {
        this._rulesIndex[i].isValid = false;
        this._validForm = false;
        this._invalids.push(this._rulesIndex[i].node);
    };

    // CLEAR FORM ERRORS AND RESULTS
    /*****************************************/
    FormValidator.prototype._clearForm = function(i) {
        // Remove the form result
        Helper.removeClass(this._form, ['info', 'success', 'warning', 'danger']);

        // Make all input elements 'valid' - i.e hide the error msg and styles.
        for (var i = 0; i < this._inputs.length; i++) {
            var _wrap = Helper.parentUntillClass(this._inputs[i], 'form-field');
            if (Helper.nodeExists(_wrap)) Helper.removeClass(_wrap, ['info', 'success', 'warning', 'danger'])
        }
    };


    // PRIVATE VALIDATIORS
    /*****************************************/
    FormValidator.prototype.validateEmpty = function(value) {
        value = value.trim();
        var re = /^\s*$/;
        return re.test(value) ? false : true;
    };
    FormValidator.prototype.validateEmail = function(value) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    };
    FormValidator.prototype.validateName = function(value) {
        var re = /^[A-z _-]+$/;
        return re.test(value);
    };
    FormValidator.prototype.validateNumeric = function(value) {
        var re = /^[\d]+$/;
        return re.test(value);
    };
    FormValidator.prototype.validatePassword = function(value) {
        var re = /^(?=.*[^a-zA-Z]).{6,40}$/;
        return re.test(value);
    };
    FormValidator.prototype.validateUrl = function(value) {
        re = /^(www\.|[A-z]|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        return re.test(value);
    };
    FormValidator.prototype.validateMinLength = function(value, min) {
        return value.length >= min;
    };
    FormValidator.prototype.validateMaxLength = function(value, max) {
        return value.length <= max;
    };
    FormValidator.prototype.validateAplha = function(value) {
        var re = /^[A-z _-]+$/;
        return re.test(value);
    };
    FormValidator.prototype.validateAplhaNumeric = function(value) {
        var re = /^[A-z0-9]+$/;
        return re.test(value);
    };
    FormValidator.prototype.validateList = function(value) {
        var re = /^[-\w\s]+(?:,[-\w\s]*)*$/;
        return re.test(value);
    };
    FormValidator.prototype.validateCreditCard = function(value) {
        value = value.replace(/ /g, "");
        var re = /^[0-9]+$/;
        var check = re.test(value);
        if (check === false) return false;
        if (value.length !== 16) return false;
        return true;
    };


    // Load into container and invoke
    /*****************************************/
    Modules.set('FormValidator', FormValidator);

})();
