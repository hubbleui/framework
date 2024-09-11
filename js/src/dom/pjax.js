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
    const [on, off, attr, bool, extend]  = FrontBx.import(['on','off','attr','bool','extend']).from('_');

    /**
     * URLS Requested
     * 
     * @var {object}
     */
    const REQUESTED = [];

    /**
     * Pjax Links Module
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.comfrontbx/uimaster/LICENSE}
     */
    const PjaxLinks = function()
    {
        this.super('.js-pjax-link');
    }

    /**
     * @inheritdoc
     * 
     */
    PjaxLinks.prototype.bind = function(node)
    {
        on(node, 'click', this._eventHandler, this);
    }

    /**
     * @inheritdoc
     * 
     */
    PjaxLinks.prototype.unbind = function(node)
    {
        off(node, 'click', this._eventHandler, this);
    }

    /**
     * Event handler
     *
     * @param {event|null} e JavaScript click event
     * @access {private}
     */
    PjaxLinks.prototype._eventHandler = function(e, clicked)
    {
        let url       = clicked.href || attr(clicked, 'data-pjax-target');
        let once      = attr(clicked, 'data-pjax-once') || false;
        let element   = attr(clicked, 'data-pjax-target');
        let cacheBust = bool(attr(clicked, 'data-pjax-nocache'));
        let pushstate = !element ? true : false;
        let urlhash   = !element ? false : bool(attr(clicked, 'data-pjax-urlhash'));

        // Only request once
        if (REQUESTED.includes(url) && once) return;

        REQUESTED.push(url);

        if (element) element = element[0] !== '#' ? `#${element}` : element;

        FrontBx.Pjax().request(url, {once, element, cacheBust, pushstate, urlhash});

        return false;
    }

    // Load into FrontBx DOM core
    FrontBx.dom().register('PjaxLinks', extend(Component, PjaxLinks));

})();