(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    const Helper = FrontBx._();

    /**
     * Input masker
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const InputMasks = function()
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
    InputMasks.prototype.destruct = function()
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
    InputMasks.prototype._bind = function()
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
                this._masks.push(FrontBx.InputMasker(input, mask, format));
            }

        }, this);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('InputMasks', InputMasks);

})();