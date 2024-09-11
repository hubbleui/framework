(function()
{
    /**
     * Lazyload fallback
     * 
     * @var {string}
     */
    var LAZY_FALLBACK_IMAGE = typeof LAZY_FALLBACK_IMAGE === 'undefined' ? '"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSJ3aGl0ZSI+CiAgPHBhdGggZD0iTTAgNCBMMCAyOCBMMzIgMjggTDMyIDQgeiBNNCAyNCBMMTAgMTAgTDE1IDE4IEwxOCAxNCBMMjQgMjR6IE0yNSA3IEE0IDQgMCAwIDEgMjUgMTUgQTQgNCAwIDAgMSAyNSA3Ij48L3BhdGg+Cjwvc3ZnPg=="' : LAZY_FALLBACK_IMAGE;

    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = FrontBx.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [is_undefined, map, dom_element, extend] = FrontBx.import(['is_undefined','map','dom_element','extend']).from('_');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const AVAILABLE_OPTIONS =[ 'background', 'lazy', 'ratio', 'placeholder', 'src', 'grayscale'];

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Image = function()
    { 
        this.super();
    }

    /**
     * @inheritdoc
     * 
     */
    Image.prototype.template = function(props)
    {
        let attrs        = map({...props}, (k, v) => !AVAILABLE_OPTIONS.includes(k) ? v : false );
        let isBackground = props.background;
        let isRatio      = !is_undefined(props.ratio);
        let isLazy       = is_undefined(props.lazy) ? false : props.lazy;
        let src          = isLazy ? (props.placeholder || LAZY_FALLBACK_IMAGE) : props.src;
        let dataSrc      = isLazy ? props.src : false;
        
        if (!attrs.style) attrs.style = '';
        if (!attrs.class) attrs.class = '';

        if (isLazy)
        {
            attrs.class  += ` lazyload js-lazyload ${props.grayscale ? 'grayscale' : ''}`;
            attrs.dataSrc = dataSrc;
        }

        // Background image
        if (isBackground)
        {
            attrs.class += ' bg-image';
            attrs.style += `;background-image: url(${src})`;
            
            if (isRatio) attrs.class += ` ratio-${props.ratio}`;

            return dom_element({...attrs, tag: 'div'});
        }

        attrs.src = src;

        let image = dom_element({...attrs, src: src, dataSrc: dataSrc, tag: 'img'})

        // Ratio image
        if (isRatio)
        {
            return dom_element({tag: 'div', class: `ratio-img ratio-${props.ratio}`}, null, image);
        }

        return image;
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Image', extend(Component, Image));
    
})();