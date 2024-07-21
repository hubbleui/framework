(function()
{
    /**
     * Helper instance
     * 
     * @var {object}
     */
    const Helper = Container.Helper();

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
     * Normalises a url
     *
     * @access {private}
     * @param  {string}  url The url to normalise
     * @return {string}
     */
    function _normaliseUrl(url)
    {
        // If the url was set as local

        // e.g www.foobar.com/foobar
        // foobar.com/foobar
        if (url.indexOf('http') < 0)
        {
            // Get the path
            var path = url.indexOf('/') >= 0 ? url.substr(url.indexOf('/') + 1) : url;

            // e.g www.foobar.com/foobar
            if (url[0] === 'w')
            {
                var host = url.split('.com');

                url = window.location.protocol + '//' + host[0] + '.com/' + path;
            }
            else
            {
                // foobar.com/foobar
                if (url.indexOf('.com') !== -1)
                {
                    var host = url.split('.com');
                    url = window.location.protocol + '//www.' + host[0] + '.com/' + path;
                }
                // /foobar/bar/
                else
                {
                    url = window.location.origin + '/' + path;
                }

            }
        }

        return url;
    }

    /**
     * Smooth scroll to an element or id
     *
     * @access {private}
     */
    function SmoothScroll(nodeOrId, options)
    {
        options = {...DEFAULT_OPTIONS, ...options};

        let DOMElement = Helper.is_string(nodeOrId) ? Helper.$(nodeOrId) : nodeOrId;

        if (!Helper.in_dom(DOMElement)) return;

        let pos = Helper.coordinates(DOMElement).top;

        let url = _normaliseUrl(window.location.href);

        let isHashable = Helper.is_string(nodeOrId);

        const complete = function()
        {
            window.location.hash = nodeOrId;
        }

        Helper.animate(window, { property : 'scrollTo', to: `0, ${pos}`,  easing: options.easing, duration: options.speed, callback: isHashable && options.updateURL ? complete : null});

    };


    // Load into Hubble DOM core
    Container.set('SmoothScroll', SmoothScroll);

}());
