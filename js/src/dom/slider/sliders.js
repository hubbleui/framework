(function()
{
    /**
     * Component base
     * 
     * @var {Class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [attr, each, map, extend, dom_element, json_decode] = FrontBx.import(['attr', 'each', 'map', 'extend', 'dom_element', 'json_decode']).from('_');

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
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
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

        SLIDERS.push(FrontBx._Slider(node, options));
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

    /**
     * @inheritdoc
     * 
     */
    Slider.prototype.template = function(props)
    {
        return dom_element({tag: 'div', class: 'slider js-slider'}, null, props.slides);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Slider', extend(Component, Slider));
})();