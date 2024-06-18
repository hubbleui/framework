(function()
{
    /**
     * JS Helper reference
     * 
     * @var {object}
     */
    var Helper = Hubble.helper();

    /**
     * Popover Handler
     *
     * @author    {Joe J. Howard}
     * @copyright {Joe J. Howard}
     * @license   {https://raw.githubusercontent.com/hubbleui/framework/master/LICENSE}
     */
    class _popHandler
    {
        /**
         * Module constructor
         *
         * @access {public}
         * @constructor
         */
    	constructor(options)
        {
            this.trigger = options.target;
            this.options = options;
            this.el = this.buildPopEl();
            this.el.className = options.classes;
            this.animation = false;

            if (options.animation === 'pop')
            {
                this.animation = 'popover-pop';
            }
            else if (options.animation === 'fade')
            {
                this.animation = 'popover-fade';
            }

            this.render = function()
            {
                document.body.appendChild(this.el);
                this.stylePop();
                this.el.classList.add(this.animation);
            }
            return this;
        }

        /**
         * Build the popover
         *
         * @access {private}
         */
        buildPopEl()
        {
            var pop = document.createElement('div');
            pop.className = this.options.classes;

            if (typeof this.options.template === 'string')
            {
                pop.innerHTML = this.options.template;
            }
            else
            {
                pop.appendChild(this.options.template);
            }
            return pop;
        }

        /**
         * Remove the popover
         *
         * @access {public}
         */
        remove()
        {
            if (Helper.in_dom(this.el)) this.el.parentNode.removeChild(this.el);
        }

        /**
         * Position the popover
         *
         * @access {public}
         */
        stylePop()
        {

            var tarcoordinates = Helper.coordinates(this.options.target);

            if (this.options.direction === 'top')
            {
                this.el.style.top = tarcoordinates.top - this.el.scrollHeight + 'px';
                this.el.style.left = tarcoordinates.left - (this.el.offsetWidth / 2) + (this.options.target.offsetWidth / 2) + 'px';
                return;
            }
            else if (this.options.direction === 'bottom')
            {
                this.el.style.top = tarcoordinates.top + this.options.target.offsetHeight + 10 + 'px';
                this.el.style.left = tarcoordinates.left - (this.el.offsetWidth / 2) + (this.options.target.offsetWidth / 2) + 'px';
                return;
            }
            else if (this.options.direction === 'left')
            {
                this.el.style.top = tarcoordinates.top - (this.el.offsetHeight / 2) + (this.options.target.offsetHeight / 2) + 'px';
                this.el.style.left = tarcoordinates.left - this.el.offsetWidth - 10 + 'px';
                return;
            }
            else if (this.options.direction === 'right')
            {
                this.el.style.top = tarcoordinates.top - (this.el.offsetHeight / 2) + (this.options.target.offsetHeight / 2) + 'px';
                this.el.style.left = tarcoordinates.left + this.options.target.offsetWidth + 10 + 'px';
                return;
            }
        }
    }

    // Set into container for private use
    Container.set('_popHandler', _popHandler);

}());
