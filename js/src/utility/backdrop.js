(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [on, find, dom_element, extend] = FrontBx.import(['on','find','dom_element','extend']).from('_');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const Drawer = FrontBx.Drawer(FrontBx.IMPORT_AS_REF);

    /**
     * Module constructor
     *
     * @class
     * @params {options} obj
     * @access {public}
     * @return {this}
     */
    const Backdrop = function(options)
    {
        let classes = !options.classes ? 'backdrop' : `backdrop ${options.classes}`;

        let persistent = true;

        options = {...options, classes, persistent };

        this.super(options);
    }

    // Load into container 
    FrontBx.set('Backdrop', extend(Drawer, Backdrop));
})();