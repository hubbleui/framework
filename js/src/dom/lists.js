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
    const [find, add_event_listener, remove_event_listener, has_class, add_class, remove_class, closest, trigger_event, dom_element, map, extend] = FrontBx.import(['find','add_event_listener','remove_event_listener','has_class','add_class','remove_class','closest','trigger_event','dom_element', 'map','extend']).from('_');

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const List = function()
    { 
        this.super('.js-select-list > li');
    }

    /**
     * @inheritdoc
     * 
     */
    List.prototype.bind = function(node)
    {            
        add_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * @inheritdoc
     * 
     */
    List.prototype.unbind = function(node)
    {
        remove_event_listener(node, 'click', this._eventHandler);
    }

    /**
     * Handle the click event
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    List.prototype._eventHandler = function(e)
    {
        e = e || window.event;
        
        if (has_class(this, 'selected')) return;

        var list = closest(this, '.js-select-list');

        remove_class(find('li.selected', list), 'selected');
        
        add_class(this, 'selected');

        trigger_event(list, 'list:selected', {item: this});
    }

    /**
     * @inheritdoc
     * 
     */
    List.prototype.template = function(props)
    {
        return dom_element({tag: 'ul', class: `list ${props.classes ? props.classes : ''} ${props.dense ? 'list-dense' : ''} ${props.ellipsis ? 'list-ellipsis' : ''} ${ props.selectable ? `js-select-list` : '' }`}, null, map(props.items, (i, item) =>
            {
                return dom_element({tag: 'li', class: `${item.state} ${props.selected && (props.selected === item.value || props.selected === item.text) ? 'selected' : null}`}, null,
                [
                    item.left ? dom_element({tag: 'span', class: 'item-left', innerHTML: item.left}) : null,
                    dom_element({tag: 'span', class: 'item-body', innerText: item.body || item.text || item }),
                    item.right ? dom_element({tag: 'span', class: 'item-right', innerHTML: item.right}) : null,
                ])
            })
        );
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('List', extend(Component, List));
})();