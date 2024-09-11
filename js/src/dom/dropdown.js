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
    const [find, find_all, map, add_class, on, closest, has_class, is_string, hide_aria, remove_class, off, show_aria, attr, css, dom_element, extend] = FrontBx.import(['find','find_all','map','add_class','on','closest','has_class','is_string','hide_aria','remove_class','off','show_aria','attr','css','dom_element','extend']).from('_');

    /**
     * Dropdown Buttons
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Dropdown = function()
    {
        this.super('.js-drop-trigger, .drop-container .js-select-menu > *:not(.menu-divider):not(.menu-header), .drop-container .js-check-menu > *:not(.menu-divider):not(.menu-header), .drop-container .js-active-menu > *:not(.menu-divider):not(.menu-header)');

        this.defaultProps =
        {
            checkable:    false,
            selectable:   false,
            caret:        false,
            ellipsis:     false,
            dense:        false,
            position:     'sw',
            anchorText:   '',
            anchorTag:    'button', 
            items:        [],
        };

        this.boundWindow  = false;
    }

    /**
     * @inheritdoc
     * 
     */
    Dropdown.prototype.bind = function(node)
    {
        if (has_class(node, 'js-drop-trigger'))
        {
            on(node, 'click', this._clickHandler, this);
        }
        else
        {
            on(node, 'click', this._selectHandler, this);
        }

        if (!this.boundWindow)
        {
            on(window, 'click', this._windowClick, this);

            this.boundWindow = true;
        }
    }

     /**
     * @inheritdoc
     * 
     */
    Dropdown.prototype.unbind = function(node)
    {
        if (has_class(node, 'js-drop-trigger'))
        {
            off(node, 'click', this._clickHandler, this);
        }
        else
        {
            off(node, 'click', this._selectHandler, this);
        }

        if (this.boundWindow)
        {
            off(window, 'click', this._windowClick, this);

            this.boundWindow = false;
        }
    }

    /**
     * Click event handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    Dropdown.prototype._clickHandler = function(e, button)
    {
        e = e || window.event;

        var active = find('.js-drop-trigger.drop-active');

        if (active) this._hideDrop(active);

        // Remove active and return
        if (active !== button)
        {
            this._showDrop(button);
        }
    }

    /**
     * Click event handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    Dropdown.prototype._hideDrop = function(button)
    {
        var drop = find('.js-drop-menu', button.parentNode);
        
        remove_class(button, ['active', 'drop-active']);
        
        button.setAttribute('aria-pressed', 'false');
        
        hide_aria(drop);
        
        drop.blur();
    }

    /**
     * Click event handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    Dropdown.prototype._showDrop = function(button)
    {
        var drop = find('.js-drop-menu', button.parentNode);
        
        add_class(button, ['active', 'drop-active']);
        
        button.setAttribute('aria-pressed', 'true');
        
        show_aria(drop);
        
        drop.focus();
    }

    /**
     * Window click event
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    Dropdown.prototype._windowClick = function(e)
    {
        e = e || window.event;

        if (closest(e.target, '.js-drop-trigger'))
        {
            return;
        }

        var active = find('.js-drop-trigger.drop-active');

        if (active) this._hideDrop(active);
    }

    /**
     * Click item on select handler
     *
     * @param  {event|null} e JavaScript Click event
     * @access {private}
     */
    Dropdown.prototype._selectHandler = function(e, item)
    {
        let wrapper    = closest(item, '.drop-container');
        let menu       = find('.js-select-menu, .js-check-menu, .js-active-menu', wrapper);
        let trigger    = find('.js-drop-trigger', wrapper);
        let selectable = has_class(trigger, 'js-drop-selectable');
        let content    = item.innerText.trim();
        let value      = attr(item, 'data-value') || content;
        let input      = find('> input', wrapper);

        if (input) attr(input, 'value', value);

        if (selectable) trigger.innerText = content;
    }

    /**
     * @inheritdoc
     * 
     */
    Dropdown.prototype.template = function(props)
    {
        return dom_element({tag: 'div', class: 'drop-container'}, null,
        [
            // Input
            props.checkable ? dom_element({tag: 'input', type: 'hidden', name: props.input, value: props.selected || ''}) : null,

            // button / anchor
            dom_element({tag: props.anchorTag, type: props.anchorTag === 'button' ? 'button' : null, role: props.anchorTag === 'button' ? 'button' : null, class: `${props.anchorTag === 'button' ? 'btn btn-dropdown' : 'btn-dropdown'} js-drop-trigger ${props.anchorClass} ${props.selectable ? 'js-select-menu' : '' }`}, null,
                [
                    props.anchorText,
                    props.caret ? dom_element({tag: 'span', class: `caret-${props.caret}`}) : null,
                ]
            ),

            // Dropdown
            dom_element({tag: 'div', class: `drop-menu ${ props.position ? `drop-${props.position}` : '' } js-drop-menu`}, null, 
                dom_element({tag: 'ul', class: `menu ${props.dense ? 'menu-dense' : ''} ${props.ellipsis ? 'menu-ellipsis' : ''} ${ props.checkable ? 'js-menu-check' : '' }`}, null, 
                    map(props.items, (i, item) =>
                    {
                        return dom_element({tag: 'li', class: `${item.state} ${props.selected && (props.selected === item.value || props.selected === item.text) ? 'selected' : null}`, dataValue: item.value || item.text || item}, null,
                        [
                            item.left ? dom_element({tag: 'span', class: 'item-left', innerHTML: item.left}) : null,
                            dom_element({tag: 'span', class: 'item-body', innerText: item.body || item.text || item }),
                            item.right ? dom_element({tag: 'span', class: 'item-right', innerHTML: item.right}) : null,
                        ])
                    })
                )
            )
        ]);
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Dropdown', extend(Component, Dropdown));

})();