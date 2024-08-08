(function()
{
    /**
     * Component base
     * 
     * @var {Class}
     */
    const [Component] = Hubble.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [attr, each, extend, json_decode] = Hubble.import(['attr', 'each', 'extend', 'json_decode']).from('_');
    
    /**
     * Slider instances.
     * 
     * @var {Array}
     */
    const SLIDERS = [];

    /**
     * Dom Slider component.
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    const Slider = function()
    {
        this.super('.js-slider');
    }
    
    /**
     * @inheritdoc
     * 
     */
    Slider.prototype.bind = function(node)
    {
        let options = attr(node, 'data-slider-options');

        options = !options ? {} : json_decode(options);

        SLIDERS.push(Hubble._Slider(node, options));
    }

    /**
     * @inheritdoc
     * 
     */
    Slider.prototype.unbind  = function(node)
    {
        each(SLIDERS, (i, slider) =>
        {
            if (slider.DOMElementWrapper === node)
            {
                slider.destroy();

                SLIDERS.splice(i, 1);

                return false;
            }
        });
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Slider', extend(Component, Slider));

})();
