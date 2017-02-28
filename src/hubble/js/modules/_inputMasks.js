(function() {

    // REQUIRE THE HELPER
    /*****************************************/
    var Helper = Modules.require('JSHelper');

    // MODULE OBJECT
    /*****************************************/
    var InputMasks = function() {

        // Private
        this._nodes_money			 = [];
        this._nodes_creditcard	     = [];
        this._nodes_numeric          = [];
        this._nodes_numericDecimal   = [];
        this._nodes_alphaNumeric     = [];
        this._nodes_alphaDash        = [];
        this._nodes_AlphaNumericDash = [];
        this._nodes_AlphaNumericDashDecimal = [];

        // Constructor
        this.__construct();
        
        return this;
    }

    // PRIVATE CONSTRUCTOR
    /*****************************************/
    InputMasks.prototype.__construct = function() {

        // Find all the nodes
        this._nodes_money			 = Helper.$All('.js-mask-money');
        this._nodes_creditcard	     = Helper.$All('.js-mask-creditcard');
        this._nodes_numeric          = Helper.$All('.js-mask-numeric');
        this._nodes_numericDecimal   = Helper.$All('.js-mask-numeric-decimal');
        this._nodes_alphaNumeric     = Helper.$All('.js-mask-alpha-numeric');
        this._nodes_alphaSpace       = Helper.$All('.js-mask-alpha-space');
        this._nodes_alphaDash        = Helper.$All('.js-mask-alpha-dash');
        this._nodes_AlphaNumericDash = Helper.$All('.js-mask-alpha-numeric-dash');
        this._nodes_AlphaNumericDashDecimal = Helper.$All('.js-mask-alphaNumericDashDecimal');

        if (!Helper.empty(this._nodes_money)) {
        	this._loopBind(this._nodes_money, 'money');
        }
        if (!Helper.empty(this._nodes_creditcard)) {
            this._loopBind(this._nodes_creditcard, 'creditcard');
        }
        if (!Helper.empty(this._nodes_numeric)) {
            this._loopBind(this._nodes_numeric, 'numeric');
        }
        if (!Helper.empty(this._nodes_numericDecimal)) {
            this._loopBind(this._nodes_numericDecimal, 'numericDecimal');
        }
        if (!Helper.empty(this._nodes_alphaNumeric)) {
            this._loopBind(this._nodes_alphaNumeric, 'alphaNumeric');
        }
        if (!Helper.empty(this._nodes_alphaSpace)) {
            this._loopBind(this._nodes_alphaSpace, 'alphaSpace');
        }
        if (!Helper.empty(this._nodes_alphaDash)) {
            this._loopBind(this._nodes_alphaDash, 'alphaDash');
        }
        if (!Helper.empty(this._nodes_AlphaNumericDash)) {
            this._loopBind(this._nodes_AlphaNumericDash, 'alphaNumericDash');
        }
    }


    // PUBLIC DESTRUCTOR
    /*****************************************/
    InputMasks.prototype.destruct = function() {
        
        this._loopUnBind(this._nodes_money);
        this._loopUnBind(this._nodes_creditcard);
        this._loopUnBind(this._nodes_numeric);
        this._loopUnBind(this._nodes_numericDecimal);
        this._loopUnBind(this._nodes_alphaNumeric);
        this._loopUnBind(this._nodes_alphaSpace);
        this._loopUnBind(this._nodes_alphaDash);
        this._loopUnBind(this._nodes_AlphaNumericDash);
        this._nodes_money            = [];
        this._nodes_creditcard       = [];
        this._nodes_numeric          = [];
        this._nodes_numericDecimal   = [];
        this._nodes_alphaNumeric     = [];
        this._nodes_alphaDash        = [];
        this._nodes_AlphaNumericDash = [];
        this._nodes_AlphaNumericDashDecimal = [];
        
    }

    // LOOP NODES AND BIND MASKS
    /*****************************************/
    InputMasks.prototype._loopBind = function(nodes, mask) {
    	for (var i = 0; i < nodes.length; i++) {
    		Modules.require('InputMasker', nodes[i])[mask]();
        }
    }

    // LOOP NODES AND BIND MASKS
    /*****************************************/
    InputMasks.prototype._loopUnBind = function(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            Modules.require('InputMasker', nodes[i])[unMask]();
        }
    }

    // SET IN IOC
    /*****************************************/
    Modules.singleton('InputMasks', InputMasks).get('InputMasks');

}());