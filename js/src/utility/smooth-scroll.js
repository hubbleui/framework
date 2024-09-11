(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [find, in_dom, normalize_url, is_string, coordinates, animate] = FrontBx.import(['find','in_dom','normalize_url','is_string','coordinates','animate']).from('_');

    /**
     * Default options
     * 
     * @var {object}
     */
    const DEFAULT_OPTIONS =
    {
        'speed'     : 500,
        'easing'    : 'easeInOutCubic',
        'updateURL' : true,
    };

    /**
     * Smooth scroll to an element or id
     *
     * @access {private}
     */
    function SmoothScroll(nodeOrId, options)
    {
        options = {...DEFAULT_OPTIONS, ...options};

        let DOMElement = is_string(nodeOrId) ? find(nodeOrId) : nodeOrId;

        if (!in_dom(DOMElement)) return;

        let pos = coordinates(DOMElement).top;

        let url = normalize_url(window.location.href);

        let isHashable = is_string(nodeOrId);

        const complete = function()
        {
            window.location.hash = nodeOrId;
        }

        animate(window, { property : 'scrollTo', to: `0, ${pos}`,  easing: options.easing, duration: options.speed, callback: isHashable && options.updateURL ? complete : null});
    }


    // Load into FrontBx DOM core
    FrontBx.set('SmoothScroll', SmoothScroll);

})();