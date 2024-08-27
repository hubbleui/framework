(function()
{
    /**
     * Component base
     * 
     * @var {class}
     */
    const [Component] = Hubble.get('Component');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, each, is_undefined, attr, on, off, to_camel_case, extend] = Hubble.import(['find','each','is_undefined','attr','on','off','to_camel_case','extend']).from('_');

    /**
     * Available data attributes.
     * 
     * @var {Array}
     */
    const DATA_ATTRIBUTES = ['text','timeout','icon','btn','variant','btnVariant'];

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    const Notification = function()
    { 
        this.notifications = new Map;

        this.super('.js-notification-trigger');
    }

    /**
     * @inheritdoc
     * 
     */
    Notification.prototype.bind = function(node)
    {            
        let options = { fromHTML: true };

        let elem;

        each(DATA_ATTRIBUTES, (i, attribute) =>
        {
            let value = attr(node, `data-${attribute}`);

            if (!is_undefined(value))
            {
                if (value === 'true' || value === 'false') value = value === 'true' ? true : false;

                if (attribute === 'timeout') value = parseInt(value);

                if (attribute === 'content' && value[0] === '#')
                {
                    elem = find(value);

                    value = elem;
                }

                options[to_camel_case(attribute)] = value;
            }
        });

        let notification = Hubble.Notification(options);

        this.notifications.set(node, notification);

        on(node, 'click', this._toggle, this);

        if (elem) elem.style = '';
    }

    /**
     * @inheritdoc
     * 
     */
    Notification.prototype.unbind = function(node)
    {
        let notification   = this.notifications.get(node);
        let content = attr(node, 'data-content');

        if (content[0] === '#')
        {
            content = find(content);

            content.style.display = 'none';

            document.body.appendChild(content);
        }

        notification.destroy();

        this.notifications.delete(node);

        off(node, 'click', this._toggle, this);
    }

    /**
     * Toggle notification.
     * 
     * @access {private}
     */
    Notification.prototype._toggle = function(e, trigger)
    { 
        let notification = this.notifications.get(trigger);

        notification.closed() ? notification.open() : notification.close();
    }

    // Load into Hubble DOM core
    Hubble.dom().register('Notification', extend(Component, Notification));

}());
