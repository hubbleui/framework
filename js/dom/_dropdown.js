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
    const [$, $All, each, map, add_class, add_event_listener, closest, has_class, is_string, hide_aria, remove_class, remove_event_listener, show_aria, attr, css, dom_element, extend] = FrontBx.import(['$','$All','each','map','add_class','add_event_listener','closest','has_class','is_string','hide_aria','remove_class','remove_event_listener','show_aria','attr','css','dom_element','extend']).from('_');

    /**
     * Dropdown Buttons
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Dropdown = function()
    {
        this.super('.js-drop-trigger, .js-select-menu + .drop-menu .menu > *:not(.menu-divider):not(.menu-header), .js-menu-check > *:not(.menu-divider):not(.menu-header)');

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
            add_event_listener(node, 'click', this._clickHandler, this);
        }
        else
        {
            add_event_listener(node, 'click', this._selectHandler, this);
        }

        if (!this.boundWindow)
        {
            add_event_listener(window, 'click', this._windowClick, this);

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
            remove_event_listener(node, 'click', this._clickHandler, this);
        }
        else
        {
            remove_event_listener(node, 'click', this._selectHandler, this);
        }

        if (this.boundWindow)
        {
            remove_event_listener(window, 'click', this._windowClick, this);

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

        var active = $('.js-drop-trigger.drop-active');

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
        var drop = $('.js-drop-menu', button.parentNode);
        
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
        var drop = $('.js-drop-menu', button.parentNode);
        
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

        var active = $('.js-drop-trigger.drop-active');

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
        e = e || window.event;

        if (has_class(item, 'selected')) return;

        let wrapper  = closest(item, '.drop-container');
        let trigger  = $('.js-drop-trigger', wrapper);
        let isCheck  = $('.js-menu-check', wrapper) || false;
        let selected = $('.menu > .selected', wrapper);
        let content  = item.innerText.trim();
        let value    = attr(item, 'data-value') || content;
        let input    = $('input', wrapper);

        if (input) attr(input, 'value', value);

        if (selected) remove_class(selected, 'selected');

        add_class(item, 'selected');

        if (has_class(trigger, 'js-select-menu')) trigger.innerText = content;

        if (isCheck)
        {
            if (selected)
            {
                let selectedCheck = $('.item-right .fa.fa-check', selected);

                if (selectedCheck) css(selectedCheck.parentNode, 'display', 'none');
            }
            
            let check = $('.item-right .fa', item);

            if (!check)
            {
                let itemContent = $('.item-body', item);

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
            dom_element({tag: props.anchorTag, type: props.anchorTag === 'button' ? 'button' : null, class: `${props.anchorTag === 'button' ? 'btn btn-dropdown' : 'btn-dropdown'} js-drop-trigger ${props.anchorClass} ${props.selectable ? 'js-select-menu' : '' }`}, null,
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
