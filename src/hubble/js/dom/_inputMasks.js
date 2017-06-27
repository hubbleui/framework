/**
 * InputMasks
 *
 * This module uses the "inputmasker.js" module to handle the masking of inputs
 * This module itself handles the activation of inputs via DOM elements.
 * @see     inputMasker.js
 *
 */
 (function() {

    /**
     * @var Helper obj
     */
    var Helper = Container.get('JSHelper');

    /**
     * Module constructor
     *
     * @class
     * @constructor
     * @params null
     * @access public
     * @return this
     */
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
        this._invoke();
        
        return this;
    }

    /**
     * Public destructor remove all masks
     *
     * @access public
     */
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

    /**
     * Find all the nodes and apply any masks
     *
     * @access private
     */
    InputMasks.prototype._invoke = function() {

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

    /**
     * Loop and bind masks to DOM LIST
     *
     * @access private
     */
    InputMasks.prototype._loopBind = function(nodes, mask) {
    	for (var i = 0; i < nodes.length; i++) {
    		Container.get('InputMasker', nodes[i])[mask]();
        }
    }

    /**
     * Loop and unbind masks to DOM LIST
     *
     * @access private
     */
    InputMasks.prototype._loopUnBind = function(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            Container.get('InputMasker', nodes[i])[unMask]();
        }
    }

    // Load into hubble DOM core
    Container.get('Hubble').dom().register('InputMasks', InputMasks);

}());