(function()
{
    /**
     * 
     * @var {Helper} obj
     */
    const [find, each, _for, is_array, is_object, in_array, is_undefined, is_callable, is_htmlElement, in_dom, is_empty, animate, add_class, remove_class, width, height, inline_style, rendered_style, css, is_array_last, dom_element] = FrontBx.import(['find','each','for','is_array', 'is_object', 'in_array','is_undefined','is_callable','is_htmlElement','in_dom','is_empty','animate', 'add_class','remove_class', 'width', 'height', 'inline_style', 'rendered_style', 'css', 'is_array_last','dom_element']).from('_');

    /**
    * Wrappers that need "position:relative" to hide overflow.
    * 
    * @var {array}
    */
    const STATIC_POSITIONS = ['static', 'unset', 'initial'];

    /**
     * Default options.
     * 
     * @var {array}
    */
    const DEFAULT_OPTIONS =
    {
        count: 1,
        lines: 0,
        height: null,
        width: null,
        variant: 'block',
        aspectratio: '',

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
    * Skeleton.
    *
    * @param  {DOMElement}   DOMElement Target node
    * @param  {object|array} options
    * @return {this}
    */
    const Skeleton = function(DOMElement, options)
    {
    this._DOMElement = DOMElement;

    this._nodes = [];

    this._isMulti = is_array(options);

    if (is_empty(options)) return this;

    if (is_array(options))
    {
        each(options, function(i, optionSet)
        {
            optionSet = {...DEFAULT_OPTIONS, ...optionSet};

            this._build(optionSet);

        }, this);
    }
    else
    {
        options = {...DEFAULT_OPTIONS, ...options};

        this._build(options);
    }
    }

    /**
     * Gracefully individual content
     * 
     * @param  {DOMElement|String} content
     * @param  {function|null}     callback
     * @access {public}
     */
    Skeleton.prototype.load = function(content, callback, wrapper)
    {
        if (is_object(content))
        {
            each(content, (selector, node) => 
            {
                let cb = is_array_last(node, content) ? callback : null;

                this.load(node, cb, find(selector, this._DOMElement));

            }, this);

            return;
        }

        wrapper = !wrapper ? this._DOMElement : wrapper;
        const isHTML  = is_htmlElement(content);
        
        // Cache wrapper height and width and so we can transition content without changing layout
        const h           = height(wrapper);
        const w           = width(wrapper);
        const position    = rendered_style(wrapper, 'position');
        const InlOverflow = inline_style(wrapper, 'overflow') || false;
        const InlPosition = inline_style(wrapper, 'overflow') || false;
        const InlHeight   = inline_style(wrapper, 'height') || false;
        const InlWidth    = inline_style(wrapper, 'width') || false;
        const InlStyles   = { overflow: InlOverflow, position: InlPosition, height: InlHeight, width: InlWidth };
        const newStyles   = { overflow: 'hidden', height: `${h}px`, width: `${w}px` };
        if (in_array(position, STATIC_POSITIONS)) newStyles.position = 'relative';

        // Prep content for inserting
        var isFragment = false;
        var oldContnet;

        if (isHTML)
        {
            add_class(content, 'swapping-content-wrapper');
        }
        else
        {
            let div    = dom_element({tag: 'div', class: 'swapping-content-wrapper'}, null, content);
            isFragment = div.children.length > 1;
            if (isFragment) div.className += ' fragment';
            oldContnet = content;
            content    = div;
        }

        const _this = this;

        const complete = function()
        {
            // Make optional user callback
            if (is_callable(callback))
            {
                callback();
            }

            // If we wrapped 'content' we need to remove the outer '.swapping-content-wrapper'
            if (!isHTML)
            {
                if (isFragment)
                {
                    wrapper.innerHTML = '';

                    dom_element(null, wrapper, oldContnet);
                }
                else
                {
                    wrapper.replaceChild(content.children[0], content);
                }
            }
            else
            {
                remove_class(content, 'swapping-content-wrapper');
            }

            // Remove skeletons
            each(_this._nodes, function(i, node)
            {
                if (in_dom(node)) node.parentNode.removeChild(node);                    
            });

            // Set inline styles back to original
            css(wrapper, InlStyles);

            // Remove wrapper classes
            remove_class(wrapper, 'skeleton-swapping-content');
        }

        // Fix dimensions, overflow and positioning while transition.
        css(wrapper, newStyles);

        // Add wrapper class to position content swap while transitioning
        add_class(wrapper, 'skeleton-swapping-content');

        // Finally append content
        wrapper.appendChild(content);

        each(this._nodes, function(i, node)
        {
            animate(node, { property : 'opacity', to : 0, duration: 500 });
        });

        animate(content, { property : 'opacity', from: '0', to : '1', duration: 750, callback: complete});
    }

    /**
     * Remove and destroy
     *
     * @params {function} callback (optional)
     * @params {boolean}  destroy  (optional default true)
     * @access {private}
     */
    Skeleton.prototype.fade_out = function(callback, destroy)
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
    Skeleton.prototype.destroy = function()
    {
        each(this._nodes, function(i, node)
        {
            node.parentNode.removeChild(node);
        });

        this._nodes = [];
    }

    /**
     * Remove a notification
     *
     * @params {_node} node
     * @access {private}
     */
    Skeleton.prototype._build = function(options)
    {
        let wrapper    = null;
        let skeleton   = document.createElement('div');
        let variants   = options.variant.split(' ').map((x) => x.trim().toLowerCase()).filter((x) => x !== '');
        let DOMElement = options.selector ? find(options.selector, this._DOMElement) : this._DOMElement;
        let width      = options.width;
        let height     = options.height;
        let classes    = ['skeleton'];

        each(variants, function(i, variant)
        {
            if (in_array(variant, CLASS_VARIANTS))
            {
                classes.push(`skeleton-${variant}`);
            }
            else if (in_array(variant, WRAPPER_VARIANTS))
            {
                classes = ['skeleton'];

                if (!wrapper)
                {
                    wrapper = document.createElement('div');
                    wrapper.className = options.lines > 1 ? 'skeleton-text-block skeleton-lines' : 'skeleton-text-block' ;
                }

                if (variant !== 'text-block')
                {
                    wrapper.className += ` skeleton-text-${variant}`;
                }
            }
        });

        skeleton.className = classes.join(' ');

        let skeletons = [skeleton];

        if (options.count > 1 || options.lines > 1)
        {
            let count = Math.max(options.count, options.lines);

            _for(count -1, (i) => skeletons.push(skeleton.cloneNode(true)));
        }

        each(skeletons, function(i, _skeleton)
        {
            this._setDimensions(_skeleton, width, height, wrapper, options.aspectratio, options.lines > 1);

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

            this._nodes.push(wrapper);
        }
        else
        {
            each(skeletons, (i, skel) => this._nodes.push(skel), this);
        }
    }

    /**
     * Remove and destroy
     *
     * @params {callback} node
     * @access {private}
     */
    Skeleton.prototype._setDimensions = function(skeleton, width, height, wrapper, aspectRatio, isLines)
    {
        // Text blocks get random width;
        if (wrapper)
        {
            let min = isLines ? 70 : 15;
            let max = isLines ? 95 : 85;
            let w   = Math.floor(Math.random() * (max - min + 1) + min);

            skeleton.style.width = `${w}%`;

            return;
        }

        if (aspectRatio !== '')
        {
            skeleton.style.width  = '100%';
            skeleton.style.height = 'auto';
            skeleton.style.aspectRatio = aspectRatio;

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

    // Add to container
    FrontBx.set('Skeleton', Skeleton);

})();