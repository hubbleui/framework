(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    var Helper = Hubble.helper();

    /**
     * Input masker
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class InputMasks
    {
        /**
         * Module constructor
         *
         * @constructor
         {*} @access public
         */
    	constructor()
        {
            // Private
            this._nodes_money = [];
            this._nodes_creditcard = [];
            this._nodes_numeric = [];
            this._nodes_numericDecimal = [];
            this._nodes_alphaNumeric = [];
            this._nodes_alphaSpace = [];
            this._nodes_alphaDash = [];
            this._nodes_AlphaNumericDash = [];

            // Constructor
            this._invoke();

            return this;
        }

        /**
         * Public destructor remove all masks
         *
         * @access {public}
         */
        destruct()
        {
            this._loopUnBind(this._nodes_money);
            this._loopUnBind(this._nodes_creditcard);
            this._loopUnBind(this._nodes_numeric);
            this._loopUnBind(this._nodes_numericDecimal);
            this._loopUnBind(this._nodes_alphaNumeric);
            this._loopUnBind(this._nodes_alphaSpace);
            this._loopUnBind(this._nodes_alphaDash);
            this._loopUnBind(this._nodes_AlphaNumericDash);
            this._nodes_money = [];
            this._nodes_creditcard = [];
            this._nodes_numeric = [];
            this._nodes_numericDecimal = [];
            this._nodes_alphaNumeric = [];
            this._nodes_alphaSpace = [];
            this._nodes_alphaDash = [];
            this._nodes_AlphaNumericDash = [];
        }

        /**
         * Find all the nodes and apply any masks
         *
         * @access {private}
         */
        _invoke()
        {
            // Find all the nodes
            this._nodes_money = Helper.$All('.js-mask-money');
            this._nodes_creditcard = Helper.$All('.js-mask-creditcard');
            this._nodes_numeric = Helper.$All('.js-mask-numeric');
            this._nodes_numericDecimal = Helper.$All('.js-mask-numeric-decimal');
            this._nodes_alphaNumeric = Helper.$All('.js-mask-alpha-numeric');
            this._nodes_alphaSpace = Helper.$All('.js-mask-alpha-space');
            this._nodes_alphaDash = Helper.$All('.js-mask-alpha-dash');
            this._nodes_AlphaNumericDash = Helper.$All('.js-mask-alpha-numeric-dash');

            if (!Helper.is_empty(this._nodes_money))
            {
                this._loopBind(this._nodes_money, 'money');
            }
            if (!Helper.is_empty(this._nodes_creditcard))
            {
                this._loopBind(this._nodes_creditcard, 'creditcard');
            }
            if (!Helper.is_empty(this._nodes_numeric))
            {
                this._loopBind(this._nodes_numeric, 'numeric');
            }
            if (!Helper.is_empty(this._nodes_numericDecimal))
            {
                this._loopBind(this._nodes_numericDecimal, 'numericDecimal');
            }
            if (!Helper.is_empty(this._nodes_alphaNumeric))
            {
                this._loopBind(this._nodes_alphaNumeric, 'alphaNumeric');
            }
            if (!Helper.is_empty(this._nodes_alphaSpace))
            {
                this._loopBind(this._nodes_alphaSpace, 'alphaSpace');
            }
            if (!Helper.is_empty(this._nodes_alphaDash))
            {
                this._loopBind(this._nodes_alphaDash, 'alphaDash');
            }
            if (!Helper.is_empty(this._nodes_AlphaNumericDash))
            {
                this._loopBind(this._nodes_AlphaNumericDash, 'alphaNumericDash');
            }
        }

        /**
         * Loop and bind masks to DOM LIST
         *
         * @access {private}
         */
        _loopBind(nodes, mask)
        {
            for (var i = 0; i < nodes.length; i++)
            {
                Container.get('InputMasker', nodes[i])[mask]();
            }
        }

        /**
         * Loop and unbind masks to DOM LIST
         *
         * @access {private}
         */
        _loopUnBind(nodes)
        {
            for (var i = 0; i < nodes.length; i++)
            {
                Container.get('InputMasker', nodes[i]).remove();
            }
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('InputMasks', InputMasks);

}());
