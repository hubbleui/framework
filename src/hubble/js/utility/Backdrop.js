/**
 * Modal
 *
 * The Modal class is a utility class used to
 * display a modal.
 *
 */
(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [on, find, dom_element, extend] = Hubble.import(['on','find','dom_element','extend']).from('_');

    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const Drawer = Hubble.Drawer(Hubble.IMPORT_AS_REF);

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
    Hubble.set('Backdrop', extend(Drawer, Backdrop));

})();
