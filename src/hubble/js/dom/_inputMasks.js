(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

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
         */
    	constructor()
        {
            this._nodes = Helper.$All('.js-mask');
            
            this._masks = [];

            this._bind();

            return this;
        }

        /**
         * Public destructor remove all masks
         *
         * @access {public}
         */
        destruct()
        {
            Helper.each(this._masks, function(i, mask)
            {
                mask.destroy();
            });
            
            this._nodes = [];

            this._masks = [];
        }

        /**
         * Find all the nodes and apply any masks
         *
         * @access {private}
         */
        _bind()
        {
            // Find all the nodes
            Helper.each(this._nodes, function(i, input)
            {
                let mask = Helper.attr(input, 'data-mask');

                let format = Helper.attr(input, 'data-format');

                if (mask && mask.startsWith('regex('))
                {
                    mask = mask.trim().replace('regex(', '').slice(0, -1);
                }

                if (mask)
                {
                    this._masks.push(Container.InputMasker(input, mask, format));
                }

            }, this);
        }
    }

    // Load into Hubble DOM core
    Hubble.dom().register('InputMasks', InputMasks);

}());
