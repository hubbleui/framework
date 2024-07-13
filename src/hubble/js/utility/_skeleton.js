(function()
{
    /**
     * @var {Helper} obj
     */
    const [each, _for, in_array, is_undefined, is_callable, animate] = Container.import(['each','for','in_array','is_undefined','is_callable','animate']).from('Helper');

    /**
     * Default options.
     * 
     * @var {array}
     */
    const DEFAULT_OPTIONS =
    {
        count: 1,
        height: null,
        width: null,
        variant: 'block',
    };

    /**
     * Class variants.
     * 
     * @var {array}
     */
    const CLASS_VARIANTS = ['block', 'text', 'btn', 'input', 'circle', 'wave', 'rounded', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

    /**
     * Class variants.
     * 
     * @var {array}
     */
    const WRAPPER_VARIANTS = ['text-block', 'block-h1', 'block-h2', 'block-h3', 'block-h4', 'block-h5', 'block-h6'];

    /**
     * Skeleton utility
     *
     * The Notification class is a utility class used to
     * display a notification.
     */
    class Skeleton
    {
        /**
         * Module constructor
         *
         * @params {options} obj
         * @access {public}
         * @return {this}
         */
        constructor(DOMElement, options)
        {
            this._DOMElement = DOMElement;
            this._options    = {...DEFAULT_OPTIONS, ...options};
            this._nodes      = [];
            this._build();

            return this;
        }

        /**
         * Remove a notification
         *
         * @params {_node} node
         * @access {private}
         */
        _build()
        {
            let wrapper    = null;
            let skeleton   = document.createElement('div');
            let variants   = this._options.variant.split(' ').map((x) => x.trim().toLowerCase()).filter((x) => x !== '');
            let DOMElement = this._DOMElement;
            let width      = this._options.width;
            let height     = this._options.height;
            let classes    = ['skeleton'];

            skeleton.classList.add('skeleton');

            each(variants, function(i, variant)
            {
                if (in_array(variant, CLASS_VARIANTS))
                {
                    classes.push(`skeleton-${variant}`);
                }
                else if (in_array(variant, WRAPPER_VARIANTS))
                {
                    if (!wrapper)
                    {
                        wrapper = document.createElement('div');
                        wrapper.className = 'skeleton-text-block';
                    }
                    if (variant !== 'text-block')
                    {
                        wrapper.className += ` skeleton-text-${variant}`;
                    }
                }
            });

            skeleton.className = classes.join(' ');

            let skeletons = [skeleton];

            if (this._options.count > 1)
            {
                _for(this._options.count -1, (i) => skeletons.push(skeleton.cloneNode(true)));
            }

            each(skeletons, function(i, _skeleton)
            {
                this._setDimensions(_skeleton, width, height, wrapper);

                if (wrapper)
                {
                    wrapper.appendChild(_skeleton);
                }
                else
                {
                    DOMElement.appendChild(_skeleton);
                }

            }, this);

            if (wrapper)
            {                
                DOMElement.appendChild(wrapper);

                this._nodes = [wrapper];
            }
            else
            {
                this._nodes = skeletons;
            }
        }

        /**
         * Remove and destroy
         *
         * @params {callback} node
         * @access {private}
         */
        _setDimensions(skeleton, width, height, wrapper)
        {
            // Text blocks get random width;
            if (wrapper)
            {
                let min = 15;
                let max = 85;
                let w   = Math.floor(Math.random() * (max - min + 1) + min);

                skeleton.style.width = `${w}%`;

                return;
            }

            if (width)
            {
                skeleton.style.width = width;
            }

            if (height)
            {
                skeleton.style.height = height;
            }
        }

        /**
         * Remove and destroy
         *
         * @params {callback} node
         * @access {private}
         */
        fade_out(callback, destroy)
        {
            destroy = is_undefined(destroy) ? true : destroy;
            
            let _this = this;

            const complete = function()
            {
                if (destroy)
                {
                    _this.destroy();
                }

                if (is_callable(callback))
                {
                    callback();
                }
            }

            let madeCallback = false;

            each(this._nodes, function(i, node)
            {
                let _callback = madeCallback ? undefined : complete;

                animate(node, { property : 'opacity', to : 0, duration: 500, callback: complete});

                madeCallback = true;
            });
        }

        /**
         * Remove and destroy
         *
         * @params {_node} node
         * @access {private}
         */
        destroy()
        {
            each(this._nodes, function(i, node)
            {
                node.parentNode.removeChild(node);
            });

            this._nodes = [];
        }
    }

    // Add to container
    Container.set('Skeleton', Skeleton);

})();
