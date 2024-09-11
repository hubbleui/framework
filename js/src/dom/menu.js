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
    const [find, add_class, on, closest, has_class, remove_class, off, attr, css, dom_element, extend] = FrontBx.import(['find','add_class','on','closest','has_class','remove_class','off','attr','css','dom_element','extend']).from('_');

    /**
     * Dropdown Buttons
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Menu = function()
    {
        this.super('.js-select-menu > *:not(.menu-divider):not(.menu-header), .js-check-menu > *:not(.menu-divider):not(.menu-header), .js-active-menu > *:not(.menu-divider):not(.menu-header)');
    }

    /**
     * @inheritdoc
     * 
     */
    Menu.prototype.bind = function(node)
    {
        on(node, 'click', this._clickHandler, this);
    }

     /**
     * @inheritdoc
     * 
     */
    Menu.prototype.unbind = function(node)
    {
        off(node, 'click', this._clickHandler, this);
    }

    /**
     * Click event handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    Menu.prototype._clickHandler = function(e, item)
    {
        // Nothing to do
        if (has_class(item, 'selected') || has_class(item, 'active') || has_class(item, 'checked')) return;

        // Menu and class
        let menu        = closest(item, '.js-select-menu') || closest(item, '.js-check-menu') || closest(item, '.js-active-menu');
        let activeClass = has_class(menu, 'js-select-menu') ? 'selected' : (has_class(menu, 'js-check-menu') ? 'checked' : 'active');
        let selected    = find(`> .${activeClass}`, menu);
        let isCheck     = activeClass === 'checked';
        let content     = item.innerText.trim();
            
        if (selected) remove_class(selected, activeClass);
        
        add_class(item, activeClass);

        if (isCheck)
        {
            if (selected)
            {
                let selectedCheck = find('.item-right .fa.fa-check', selected);

                if (selectedCheck) css(selectedCheck.parentNode, 'display', 'none');
            }
            
            let check = find('.item-right .fa', item);

            if (!check)
            {
                let itemContent = find('.item-body', item);

                if (!itemContent)
                {
                    item.innerText = '';

                    dom_element({tag: 'span', class: 'item-body'}, item, content);
                }

                dom_element({tag: 'span', class: 'item-right'}, item, dom_element({tag: 'span', class: 'fa fa-check'}));
            }
            else
            {
                attr(check.parentNode, 'style', false);
            }
        }
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Menu', extend(Component, Menu));

})();