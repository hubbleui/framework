(function()
{
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
    const [find, each, is_undefined, attr, on, off, to_camel_case, add_class, remove_class, extend] = FrontBx.import(['find','each','is_undefined','attr','on','off','to_camel_case','add_class','remove_class','extend']).from('_');

    /**
     * Available data attributes.
     * 
     * @var {Array}
     */
    const DATA_ATTRIBUTES = ['title','content','direction','classes','pushbody','swipeable','state','easing','animation-time','responsive'];

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Backdrop = function()
    { 
        this.drawers = new Map;

        this.super('.js-backdrop-trigger');
    }

    /**
     * @inheritdoc
     * 
     */
    Backdrop.prototype.bind = function(node)
    {            
        let options = 
        { 
            fromHTML: true,
            state: 'collapsed',
            callbackClose: () => remove_class(node, 'active'),
            callbackOpen: () => add_class(node, 'active'),
        };

        let elem;

        each(DATA_ATTRIBUTES, (i, attribute) =>
        {
            let value = attr(node, `data-${attribute}`);

            if (!is_undefined(value))
            {
                if (value === 'true' || value === 'false') value = value === 'true' ? true : false;

                if (attribute === 'content' && value[0] === '#')
                {
                    elem = find(value);

                    value = elem;
                }

                options[to_camel_case(attribute)] = value;
            }
        });

        let backdrop = FrontBx.Backdrop(options);

        this.drawers.set(node, backdrop);

        on(node, 'click', this._toggle, this);

        if (elem) elem.style = '';
    }

    /**
     * @inheritdoc
     * 
     */
    Backdrop.prototype.unbind = function(node)
    {
        let backdrop = this.drawers.get(node);
        let content = attr(node, 'data-content');

        if (content[0] === '#')
        {
            content = find(content);

            content.style.display = 'none';

            document.body.appendChild(content);
        }

        backdrop.destroy();

        this.drawers.delete(node);

        off(node, 'click', this._toggle, this);
    }

    /**
     * Toggle Backdrop.
     * 
     * @access {private}
     */
    Backdrop.prototype._toggle = function(e, trigger)
    { 
        let backdrop = this.drawers.get(trigger);
        
        backdrop.closed() ? backdrop.open() : backdrop.close();
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Backdrop', extend(Component, Backdrop));

})();