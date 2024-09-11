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
    const [find, each, is_undefined, attr, on, off, to_camel_case, extend] = FrontBx.import(['find','each','is_undefined','attr','on','off','to_camel_case','extend']).from('_');

    /**
     * Available data attributes.
     * 
     * @var {Array}
     */
    const DATA_ATTRIBUTES = ['title','content','classes','custom','close-anywhere','scroll','cancel-btn','cancel-class','confirm-btn','confirm-class','overlay','state'];

    /**
     * Toggle active on lists
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const Modal = function()
    { 
        this.modals = new Map;

        this.super('.js-modal-trigger');
    }

    /**
     * @inheritdoc
     * 
     */
    Modal.prototype.bind = function(node)
    {            
        let options = { fromHTML: true, state: 'closed' };

        let elem;

        each(DATA_ATTRIBUTES, (i, attribute) =>
        {
            let value = attr(node, `data-${attribute}`);

            if (!is_undefined(value))
            {
                if (value === 'true' || value === 'false')value = value === 'true' ? true : false;

                if (attribute === 'content' && value[0] === '#')
                {
                    elem = find(value);

                    value = elem;
                }

                options[to_camel_case(attribute)] = value;
            }
        });

        let modal = FrontBx.Modal(options);

        this.modals.set(node, modal);

        on(node, 'click', this._toggle, this);

        if (elem) elem.style = '';
    }

    /**
     * @inheritdoc
     * 
     */
    Modal.prototype.unbind = function(node)
    {
        let modal   = this.modals.get(node);
        let content = attr(node, 'data-content');

        if (content[0] === '#')
        {
            content = find(content);

            content.style.display = 'none';

            document.body.appendChild(content);
        }

        modal.destroy();

        this.modals.delete(node);

        off(node, 'click', this._toggle, this);
    }

    /**
     * Toggle modal.
     * 
     * @access {private}
     */
    Modal.prototype._toggle = function(e, trigger)
    { 
        let modal = this.modals.get(trigger);

        modal.closed() ? modal.open() : modal.close();
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('Modal', extend(Component, Modal));
})();