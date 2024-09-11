(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [add_class, animate, attr, css, dom_element, each, find, find_all, _for, is_object, map, nth_siblings, off, on, preapend, remove_class, rendered_style, width, remove_from_dom, inline_style] = FrontBx.import(['add_class','animate','attr','css','dom_element','each','find','find_all','for','is_object','map','nth_siblings','off','on','preapend','remove_class','rendered_style','width','remove_from_dom','inline_style']).from('_');

    /**
     * Default options
     * 
     * @var {Object}
     */
    const DEFAULT_OPTIONS =
    {
        // enable keyboard navigation, pressing left & right keys
        accessibility: true,
        
        // advances to the next cell
        // if true, default is 3 seconds
        // or set time between advances in milliseconds
        // i.e. `autoPlay: 1000` will advance every 1 second
        autoPlay: true,

        // zero-based index of the initial selected cell
        initialIndex: 0,
        
        controls: true,
        // creates and enables buttons to click to previous & next cells

        dots: true,
        // create and enable page dots

        resize: true,
        // listens to window resize events to adjust size & positions

        wrap: true,
        // at end of cells, wraps-around to first for infinite scrolling

        // Group slides
        groupSlides: false,

        pauseOnHover: true,
        // Pauses autoplay on hover

        easing: 'easeOutExpo',
        // Easing pattern

        draggable: true,
        // Draggable

        friction: 0.85,
        // Dragging friction

        mouseSupport: true,
        // Enables dragging with mouse,

        // Minimum swipe distance to be a "swipe"
        threshold: (type, self) => 3,

        // Minimum travel swipe velocity to be considered a "swipe"
        velocityThreshold: 3,
        
    };

    /**
     * Slider.
     *
     * @param {HTMLElement} wrapper Wrapper element
     * @param {Object}      options Options
     */
    const _Slider = function(wrapper, options)
    {
        this.options = is_object(options) ? {...DEFAULT_OPTIONS, ...options } :  {...DEFAULT_OPTIONS };

        this.DOMElementWrapper = wrapper;

        this._animating = false;

        this._playing = 'stopped';

        this._translated = 0;

        this._resizeThrottle = throttle(() => this.resize(), 100);

        this._build();

        this._moveIndexToMiddle();

        this.resize();

        if (this.options.autoPlay) this.play();
    }

    /**
     * Destroy the slider.
     *
     * @access {public}
     */
    _Slider.prototype.destroy = function()
    {
        this.stop();

        if (this._gestures) this._gestures.destroy();

        off(window, 'resize', this._resizeThrottle, this);

        off(this.DOMElementWrapper, 'mouseover', this.pause, this);

        off(this.DOMElementWrapper, 'mouseout', this.unpause, this);

        if (this.options.dots) remove_from_dom(this._dotWrap);

        if (this.options.controls) remove_from_dom([this._righBtn, this._leftBtn]);

        let slides = !this.options.groupSlides ? this._slides : find_all('.slide-group > *', this.DOMElementWrapper);

        each(slides, (i, slide) => this.DOMElementWrapper.appendChild(slide));
    }

    /**
     * Next slide
     *
     * @access {public}
     */
    _Slider.prototype.next = function(animationOrClickEvent)
    {
        // Stop on animating
        if (this._animating || this._dragging) return;

        // Do nothing on non-wrap and at end
        if (!this.options.wrap && this._index === this._slidesIndexs) return;

        // Don't animate
        if (animationOrClickEvent === false) return this._toSlideDirect(this._index +1);

        // Pause autoplay
        this.pause();

        // We're now animating
        this._animating = true;

        // Run animation
        let distance = this._slideWidthWGap;

        if (!this.options.wrap)
        {
            distance += this._translated;
            
            this._translated = distance;
        }

        // Update the index and dots.        
        this._updateIndex(1);
        this._updateDots();

        // Shuffle before animation
        if (this.options.wrap)
        {
            // Adjust pre distance before animation
            let preDistance = this._offset - this._slideWidthWGap;

            this._moved(1);

            css(this._DOMElementViewport, 'left', `-${preDistance}px`);
        }

        animate(this._DOMElementViewport, { transform: `translateX(-${distance}px)`, easing: this.options.easing, duration: 550, complete: () =>
        { 
            if (this.options.wrap)
            {
                css(this._DOMElementViewport, 'left', `-${this._offset}px`);

                css(this._DOMElementViewport, 'transform', `translateX(0px)`);
            }

            if (!this.options.wrap) this._moved(1);

            this._animating = false;

            if (!animationOrClickEvent) this.unpause();
        }});
    }

    /**
     * Previous slide
     *
     * @access {public}
     */
    _Slider.prototype.previous = function(animationOrClickEvent)
    {
        // Stop on animating
        if (this._animating || this._dragging) return;

        // Do nothing on non-wrap and at start
        if (!this.options.wrap && this._index === 0) return;

        // Don't animate
        if (animationOrClickEvent === false) return this._toSlideDirect(this._index +1);

        // Clear timeout
        this.pause();

        // We're now animating
        this._animating = true;

        // Cache distance
        let distance = !this.options.wrap ? (this._translated - this._slideWidthWGap) : this._slideWidthWGap;

        this._translated = distance < 2 ? 0 : distance;

        // Failsafe 
        if (!this.options.wrap) distance = distance < 2 ? 0 : -distance;

        // Update dots and indexes
        this._updateIndex(-1);
        this._updateDots();

        // Shuffle before animation
        if (this.options.wrap)
        {
            // Adjust pre distance before animation
            let preDistance = this._offset + this._slideWidthWGap;

            this._moved(-1);

            css(this._DOMElementViewport, 'left', `-${preDistance}px`);
        }

        // Run animation
        animate(this._DOMElementViewport, { transform: `translateX(${distance}px)`, easing: this.options.easing, duration: 550, complete: () => 
        { 
            if (this.options.wrap)
            {
                css(this._DOMElementViewport, 'left', `-${this._offset}px`);

                css(this._DOMElementViewport, 'transform', `translateX(0px)`);
            }

            this._animating = false;

            if (!animationOrClickEvent) this.unpause();
        } });
    }

    /**
     * Go to slide.
     *
     * @access {public}
     * @param  {integer} slideNum Slide number
     */
    _Slider.prototype.toSlide = function(slideNum, animation, fromClick)
    {
        // Animating
        if (this._animating) return false;

        animation = typeof animation === 'undefined' ? true : animation;

        fromClick = typeof fromClick === 'undefined' ? false : fromClick;

        if (!animation) return this._toSlideDirect(slideNum);

        // convert slide number to index
        let index = slideNum === 1 ? 0 : slideNum-1;

        // Invalid or does nothing
        if (index === this._index || index > this._slidesIndexs || index < 0) return;

        // Go to previous
        if ( (index === (this._index -1) && this._index > 0) || (index === this._slidesIndexs && this._index === 0 && this.options.wrap))
        {
            return this.previous();
        }

        // Go to next
        else if ((index === (this._index + 1) && this._index < this._slidesIndexs) || (index === 0 && this._index === this._slidesIndexs && this.options.wrap))
        {            
            return this.next();
        }

        // We're now animating
        this._animating = true;

        // Clear timeout
        this.pause();

        // Default delta and direction
        let { delta, direction } = this._moveDelta(index);

        // If we're not wrapping we can skip all of this
        if (!this.options.wrap)
        {
            let distance = this._slideWidthWGap * delta;

            distance = direction === -1 ? this._translated - distance : this._translated + distance;
            
            this._translated = distance < 2 ? 0 : distance;

            _for(delta, () => { this._updateIndex(direction) });

            this._updateDots();
            
            animate(this._DOMElementViewport, { transform: `translateX(${distance < 2 ? 0 : -distance}px)`, easing: this.options.easing, duration: 550, complete: () => 
            { 
                this._animating = false;

                if (!fromClick) this.unpause();

            } });

            return;
        }

        // Moving back shifts index forward
        // Moving forwards shifts index back
        let postIndex = direction === -1 ? this._middleIndex + delta : (this._middleIndex - delta) + this._bufferSize;

        // Since we know the new index, we can just calculate how far offset center it is.
        let tmpOffset = (postIndex * this._slideWidthWGap) - (this._viewportWidth / 2) + (this._slideWidth / 2);

        // Run animation
        let distance = this._slideWidthWGap * delta;
        distance  = direction === 1 ? -distance : distance;

        // Shuffle slides
        _for(delta, () => { this._moved(direction); this._updateIndex(direction) }, this);

        // Insert buffer clones
        let clones = this._bufferNodes(direction);

        css(this._DOMElementViewport, 'left', `-${tmpOffset}px`);

        // Run animation
        animate(this._DOMElementViewport, { transform: `translateX(${distance}px)`, easing: this.options.easing, duration: 650, complete: () => 
        { 
            each(clones, (i, clone) =>
            {
                clone.parentNode.removeChild(clone);
            });

            css(this._DOMElementViewport, 'left', `-${this._offset}px`);

            css(this._DOMElementViewport, 'transform', `translateX(0px)`);

            this._animating = false;

            if (!fromClick) this.unpause();

        } });

        this._updateDots();
    }

     /**
     * Go to slide.
     *
     * @access {public}
     * @param  {integer} slideNum Slide number
     */
    _Slider.prototype._toSlideDirect = function(slideNum)
    {
        // convert slide number to index
        let index = slideNum === 1 ? 0 : slideNum-1;

        // Clear timeout
        this.pause();

        // Default delta and direction
        let delta       = index < this._index ? this._index - index : index - this._index;
        let direction   = index < this._index ? -1 : 1;

        // If we're not wrapping we can skip all of this
        if (!this.options.wrap)
        {
            let distance = this._slideWidthWGap * delta;

            distance = direction === -1 ? this._translated - distance : this._translated + distance;
            
            this._translated = distance < 2 ? 0 : distance;

            _for(delta, () => { this._updateIndex(direction) });

            this._updateDots();

            css(this._DOMElementViewport, 'transform',  `translateX(${distance < 2 ? 0 : -distance}px)`);
            
            this.unpause();

            return;
        }

        // Shuffle slides
        _for(delta, () => { this._moved(direction); this._updateIndex(direction) }, this);

        css(this._DOMElementViewport, 'transform', `translateX(0px)`);

        this._updateDots();

        this.unpause();
    }

    /**
     * Window resize handler.
     *
     * @access {private}
     */
    _Slider.prototype.resize = function()
    {
        if (this._slidesCount === 0) return;

        // Is full width, may change with responsive CSS
        this._isFullWidth = parseInt(rendered_style(this._slides[0], 'max-width')) === 100;

        // Viewport width
        this._viewportWidth = Math.round(width(this.DOMElementWrapper));

        // Gap size
        this._gapSize = parseInt(rendered_style(this._DOMElementViewport, 'column-gap'));

        // Slide width
        this._slideWidth = Math.round(width(this._slides[0], this.DOMElementWrapper));

        // Slide width with gap
        this._slideWidthWGap = this._slideWidth + this._gapSize;

        // Offset
        this._offset = Math.round(this.options.wrap ? (this._middleIndex * this._slideWidthWGap) - (this._viewportWidth / 2) + (this._slideWidth / 2) : this._slideWidthWGap - ((this._viewportWidth + this._slideWidth) / 2));

        // Buffer
        if (!this._isFullWidth)
        {
            let percentagWidth  = (100 * this._slideWidth) / this._viewportWidth;
            this._bufferSize    = percentagWidth > 50 ? 3 : Math.round(100 / percentagWidth);            
        }

        // Make offset
        css(this._DOMElementViewport, 'left', `${this._offset === 0 ? 0 : -this._offset}px`);

        // Visible slides
        this._visibleSlides = this._isFullWidth ? 1 : this._viewportWidth / this._slideWidthWGap;

        this._dragBoundryL = this._offset - this._slideWidthWGap;

        this._dragBoundryR = -(this._dragBoundryL);
    }

    /**
     * Start autoplay.
     *
     * @access {public}
     */
    _Slider.prototype.play = function()
    {      
        if (this._playing === 'playing') return;

        // do not play if page is hidden, start playing when page is visible
        let isPageHidden = document.hidden;
        
        if (isPageHidden)
        {
            on(document, 'visibilitychange', this._onVisibilityPlay, this);

            return;
        }

        this._playing = 'playing';

        // listen to visibility change
        on(document, 'visibilitychange', this._onVisibilityChange, this);

        // start ticking
        this._tick();
    }

    /**
     * Stop autoplay.
     *
     * @access {public}
     */
    _Slider.prototype.stop = function()
    {
        this._playing = 'stopped';

        clearTimeout(this._playTimer);
        
        // remove visibility change event
        off(document, 'visibilitychange', this._onVisibilityChange, this);
    }

    /**
     * Pause autoplay.
     *
     * @access {public}
     */
    _Slider.prototype.pause = function()
    {
        if (this._playing === 'playing')
        {
            this._playing = 'paused';
            
            clearTimeout(this._playTimer);
        }
    }

    /**
     * Unpause autoplay.
     *
     * @access {public}
     */
    _Slider.prototype.unpause = function()
    {
        // re-start play if paused
        if (this._playing === 'paused') this.play();
    }

    /**
     * Build the slider.
     *
     * @access {private}
     */
    _Slider.prototype._build = function()
    {
        // Find slides
        this._slides = !this.options.groupSlides ? find_all('> *', this.DOMElementWrapper) : map([...Array(Math.ceil(find_all('> *', this.DOMElementWrapper).length / this.options.groupSlides)).keys()], (i) =>
        {
            // Since we're appending children as we go we're always taking the first n children
            return dom_element({tag: 'div', class: 'slide-group'}, null, find_all('> *', this.DOMElementWrapper).slice(0, this.options.groupSlides));
        });

        // Slides count
        this._slidesCount = this._slides.length;

        // Slide indexes
        this._slidesIndexs = this._slides.length -1;

        // Starting index
        this._index = this.options.initialIndex;

        // Middle index
        this._middleIndex = Math.floor(this._slidesCount / 2);

        // Visible slides
        this._visibleSlides = 1;

        // Buffer size
        this._bufferSize = 0;

        // Create viewport
        this._DOMElementViewport = dom_element({tag: 'div', class: 'slider-viewport js-slider-viewport'}, this.DOMElementWrapper, this._slides);

        // Controls
        if (this.options.controls) this._buildControls();

        // Dots
        this._dots = [];
        if (this.options.dots) this._buildDots();

        // Pause on hover
        if (this.options.autoPlay && this.options.pauseOnHover)
        {
            on(this.DOMElementWrapper, 'mouseover', this.pause, this);

            on(this.DOMElementWrapper, 'mouseout', this.unpause, this);
        }

        // Window resize
        if (this.options.resize)
        {
            on(window, 'resize', this._resizeThrottle, this);
        }

        if (this.options.draggable && this._slidesCount > 1)
        {
            add_class(this.DOMElementWrapper, 'draggable');

            this._bindGestures();
        }

        add_class(this.DOMElementWrapper, 'js-slider');
    }

    /**
     * Start dragging slide.
     *
     * @access {public}
     * @param  {integer} slideNum Slide number
     */
    _Slider.prototype._dragSlide = function(moved)
    {
        let x = this._dragX;

        if (this.options.wrap)
        {
            let nearEnd = (x < 0 && x <= this._dragBoundryR) || (x > 0 && x >= this._dragBoundryL);

            if (nearEnd)
            {
                this._dragCloneSlides();

                return;
            }
        }

        css(this._DOMElementViewport, 'transform', `translateX(${x}px)`);
    }

    /**
     * Go to slide.
     *
     * @access {public}
     * @param  {integer} slideNum Slide number
     */
    _Slider.prototype._dragCloneSlides = function()
    {   
        // No need to clone on non wrapping sliders     
        if (!this.options.wrap) return;

        let distance = this._slideWidthWGap * this._bufferSize;

        // Push out the drag boundaries
        // Drag bondry L remains the same as it is a fixed position from start
        this._dragBoundryR = -((this._slideWidthWGap * (this._bufferSize + this._slidesCount -1)) + (this._slideWidth /2));

        // Adjust the dragging buffer
        this._draggingbuffer = !this._draggingbuffer ? distance : this._draggingbuffer + distance;

        // Resting distance
        distance = this._dragX - distance;

        // Pad sides and clone
        this._bufferDragClones();

        // Adjust drag position
        css(this._DOMElementViewport, 'transform', `translateX(${distance}px)`);
    }

    /**
     * Fake shuffle cloned slides to start or end
     *
     * @access {private}
     */
    _Slider.prototype._bufferDragClones = function()
    {    
        if (!this.options.wrap) return;

        let viewport = this._DOMElementViewport;

        let clones = [];

        _for(this._bufferSize, (i) =>
        {
            let cloneR = find(`> *:nth-child(${this._dragRIndex})`, this._DOMElementViewport).cloneNode(true);
            let cloneL = find(`> *:nth-last-child(${this._dragLIndex})`, this._DOMElementViewport).cloneNode(true);
            add_class([cloneR, cloneL], 'slide-clone');

            this._dragClones.push(cloneR);
            this._dragClones.push(cloneL);

            preapend(cloneL, viewport);

            viewport.appendChild(cloneR);

            this._dragRIndex += 2;

            this._dragLIndex += 2;
        });
    }

    /**
     * Clear drag clones.
     *
     * @access {private}
     */
    _Slider.prototype._clearDragClones = function()
    {
        each(this._dragClones, (i, clone) =>
        {
            this._DOMElementViewport.removeChild(clone);
        });
    }

    _Slider.prototype._restingDragPos = function()
    {
        let ret = { rest: 0, slideIndex: 1 };

        // There would be a smarter way to figure all this out, however have not been able to figure out an easy solution
        let wrapping = this.options.wrap;

        // What distance have we actually moved in total?
        let moved = !wrapping ? Math.abs(this._dragX) - Math.abs(this._offset) : (this._slideWidthWGap * this._middleIndex) + (this._slideWidth / 2)

        if (wrapping) moved = this._dragX < 0 ? moved + Math.abs(this._dragX) : moved - this._dragX;

        // Always first slide
        if (!wrapping && (this._dragX > 0 || moved < 0)) return ret;

        // Get the DOM index of the slide that should be resting
        let index = !wrapping ? Math.ceil(moved / this._slideWidthWGap) : Math.ceil(moved / this._slideWidthWGap) -1;

        // Dragged over the edge on non-wrapping sliders
        if (!wrapping && index > this._slidesIndexs) index = this._slidesIndexs;

        // Get X pos of where target slide starts
        let slideStarts = (index * this._slideWidthWGap) - (this._viewportWidth / 2) + (this._slideWidth / 2);

        // Figure out the resting point
        let rest = this._offset - slideStarts;

        let slideIndex = parseInt(attr(find(`>:nth-child(${index +1})`, this._DOMElementViewport), 'data-index')) +1;

        this._dragMoved = (slideIndex -1) !== this._index;

        if (!wrapping) this._translated = Math.abs(rest);

        return { rest, slideIndex };
    }

    /**
     * Find closest slide on end
     *
     * @access {private}
     */
    _Slider.prototype._onDragEnd = function()
    {
        let { rest, slideIndex } = this._restingDragPos();

        this._dragEndAnim = animate(this._DOMElementViewport, { property: 'transform', from: `translateX(${this._dragX}px)`, to: `translateX(${rest}px)`, duration: 650, easing: this.options.easing, complete: () => 
        {
            if (this._dragClones.length >= 1) this._clearDragClones();

            if (this._dragMoved && this.options.wrap) this.toSlide(slideIndex, false, false);

            if (!this._dragMoved && this.options.wrap) css(this._DOMElementViewport, 'transform', `translateX(0px)`);

            this._index = slideIndex -1;

            this._translated = Math.abs(rest);

            this._updateDots();

            this.unpause();

            this._resetDragVars();
        }} );
    }

    /**
     * Build controls.
     *
     * @access {private}
     */
    _Slider.prototype._resetDragVars = function()
    {
        this._dragClones      = [];
        this._dragRIndex      = 1;
        this._dragLIndex      = 1;
        this._dragging        = false;
        this._dragMoved       = false;
        this._dragStartPointX = { x: 0, y: 0};
        this._dragBoundryL    = this._offset - this._slideWidthWGap;
        this._dragBoundryR    = -(this._dragBoundryL);
        
        delete this._dragX;

        delete this._prevDrag;

        delete this._dragEndAnim;

        delete this._draggingbuffer;
    }

    /**
     * Build controls.
     *
     * @access {private}
     */
    _Slider.prototype._bindGestures = function()
    {
        let wrapper = this.DOMElementWrapper;

        const gestures = FrontBx.TinyGesture(this.DOMElementWrapper, { mouseSupport: this.options.mouseSupport, velocityThreshold: this.options.velocityThreshold, threshold: this.options.threshold });

        this._resetDragVars();

        gestures.on('panstart', (event) =>
        {
            // No drag on transitioning
            if (this._animating) return;

            // Clear timeout
            this.pause();

            // Register start point
            this._dragStartPointX = event.pageX;

            // We have a previous unfinished drag
            if (this._dragEndAnim)
            {
                this._dragEndAnim.stop();

                this._prevDrag = parseFloat(inline_style(this._DOMElementViewport, 'transform').replaceAll(/[^0-9-.]/g, ''));

                delete this._dragEndAnim;
            }

            // Add helper class for optional UI
            add_class(wrapper, 'dragging');
        });

        gestures.on('panmove', (event) =>
        {
            // No drag on transitioning
            if (this._animating) return;

            // Base movement
            let moveVectorX = (event.pageX - this._dragStartPointX);

            // No drag
            if ( Math.abs(moveVectorX) < 3 ) return;

            this._dragging = true;

            // Much slower on non-wrapping sliders when at end or start and going in opposite direction
            if (!this.options.wrap && ( (this._index === 0 && moveVectorX > 0) || (this._index === this._slidesIndexs && moveVectorX < 0) ))
            {
                moveVectorX = moveVectorX * (this.options.friction / 3);
            }
            else
            {
                // Slow down further we drag
                moveVectorX = moveVectorX * this.options.friction;
            }

            // Previous drag
            if (this._prevDrag)
            {
                moveVectorX = this._prevDrag + moveVectorX
            }

            // Non wrap + translated
            else if (!this.options.wrap)
            {
                moveVectorX = moveVectorX - this._translated;
            }

            // Calculate travel distance
            this._dragX = !this._draggingbuffer ? moveVectorX : moveVectorX - this._draggingbuffer;

            // Drag the slide
            this._dragSlide();
        });

        gestures.on('panend', (event) =>
        {
            remove_class(wrapper, 'dragging');

            if (!this._dragX) return this.unpause();

            this._onDragEnd();
        });

        gestures.on('swiperight', (event) =>
        {
            // Don't swipe on animating
            if (this._animating) return;

            // Don't swipe on drags
            if (this._dragEndAnim && this._dragMoved) return;

            // Can't go back
            if (!this.options.wrap && this._index === 0) return;

            // Stop dragend if running
            if (this._dragEndAnim) this._dragEndAnim.stop();

            this._resetDragVars();

            this.previous();
        });
        gestures.on('swipeleft', (event) =>
        {
            // Don't swipe on animating
            if (this._animating) return;

            // Don't swipe on drags
            if (this._dragEndAnim && this._dragMoved) return;
            
            // Can't go forward
            if (!this.options.wrap && this._index === this._slidesIndexs) return;

            // Stop dragend if running
            if (this._dragEndAnim) this._dragEndAnim.stop();

            this._resetDragVars();

            this.next();
        });

        this._gestures = gestures;
    }

    /**
     * Build controls.
     *
     * @access {private}
     */
    _Slider.prototype._buildControls = function()
    {
        // Right button
        this._righBtn = dom_element({tag: 'button', type: 'button', class: 'slider-control control-right btn btn-pure'}, this.DOMElementWrapper, 
            dom_element({tag: 'span',class: 'fa fa-caret-right'})
        );

        // Left button
        this._leftBtn = dom_element({tag: 'button', type: 'button', class: 'slider-control control-left btn btn-pure'}, this.DOMElementWrapper, 
            dom_element({tag: 'span',class: 'fa fa-caret-left'})
        );

        // Handlers
        on(this._righBtn, 'click', this.next, this);
        on(this._leftBtn, 'click', this.previous, this);
    }

    /**
     * Build dots.
     *
     * @access {private}
     */
    _Slider.prototype._buildDots = function()
    {
        let index = this._index;

        this._dotWrap = dom_element({tag: 'div', class: 'slider-dots js-slider-dots'}, this.DOMElementWrapper, map(this._slides, (i, slide) =>
        {
            let active = i === index ? 'active' : '';

            let dot = dom_element({tag: 'button', type: 'button', dataIndex: i, class: `slider-dot js-slider-dot btn btn-circle ${active}`});

            on(dot, 'click', this._dotClick, this);

            this._dots.push(dot);

            return dot;
        }));
    }

     /**
     * Moves indexed slide to middle.
     *
     * @access {private}
     */
    _Slider.prototype._moveIndexToMiddle = function()
    {
        each(this._slides, (i) =>
        {
            attr(this._slides[i], 'data-index', i);
        
        }, this);

        if (!this.options.wrap) return;

        let slide = this._slides[this._index];

        _for(this._slidesCount, (i) =>
        {
            if (nth_siblings(slide) === this._middleIndex) return false;

            preapend(find('> *:last-child', this._DOMElementViewport), this._DOMElementViewport);
        
        }, this);  
    }

    /**
     * On dot click.
     *
     * @access {private}
     */
    _Slider.prototype._dotClick = function(e, dot)
    {
        if (this._animating || this._dragging) return;

        let index = parseInt(attr(dot, 'data-index')) +1;

        this.toSlide(index, true, true);
    }

    /**
     * Update index from previous / next.
     *
     * @access {private}
     * @param  {Integer} direction -1|1
     */
    _Slider.prototype._updateIndex = function(direction)
    {
        if (direction === 1)
        {
            this._index = this._index === this._slidesIndexs ? 0 : this._index + 1;
        }
        else
        {
            this._index = this._index === 0 ? this._slidesIndexs : this._index - 1;
        }
    }

    /**
     * Returns the move delta
     *
     * @access {private}
     * @param  {Integer} direction -1|1
     */
    _Slider.prototype._moveDelta = function(index)
    {
        // Default delta and direction
        let delta       = index < this._index ? this._index - index : index - this._index;
        let direction   = index < this._index ? -1 : 1;
        
        // We only go shortest path if we're wrapping and there's more than 5 slides
        if (this.options.wrap && this._slidesCount > 4)
        {
            if (index > this._index)
            {
                let backN = (this._slidesCount - index) + this._index;

                if (backN < delta)
                {
                    delta = backN;
                    direction = -1;
                }
            }
            else if (index < this._index)
            {
                let forwdN = (this._slidesCount - this._index) + index;

                if (forwdN < delta)
                {
                    delta = forwdN;
                    direction = 1;
                }
            }
        }

        return { delta, direction };
    }

    /**
     * Create buffers cloned nodes.
     *
     * @access {private}
     * @param  {Integer} direction -1|1
     */
    _Slider.prototype._bufferNodes = function(direction)
    {
        let viewport = this._DOMElementViewport;

        return map([...Array(this._bufferSize).keys()], (i) =>
        {
            let clone = find(`> *:nth${direction === -1 ? '-' : '-last-'}child(${i+1})`, viewport).cloneNode(true);

            direction === -1 ? viewport.appendChild(clone) : preapend(clone, viewport);

            return clone;
        });
    }

    /**
     * pause if page visibility is hidden, unpause if visible
     *
     * @access {private}
     */
    _Slider.prototype._onVisibilityChange = function()
    {
        let isPageHidden = document.hidden;
        
        this[ isPageHidden ? 'pause' : 'unpause' ]();
    }

    /**
     * Start playing on page return.
     *
     * @access {private}
     */
    _Slider.prototype._onVisibilityPlay = function()
    {
        this.play();
        
        off(document, 'visibilitychange', this._onVisibilityPlay, this);
    }

    /**
     * Timeout ticker.
     *
     * @access {private}
     */
    _Slider.prototype._tick = function()
    {
        // do not tick if not playing
        if ( this._playing !== 'playing' ) return;

        // default to 3 seconds
        let time = typeof this.options.autoPlay == 'number' ? this.options.autoPlay : 3000;

        // HACK: reset ticks if stopped and started within interval
        clearTimeout(this._playTimer);

        this._playTimer = setTimeout( () =>
        {
            this.next();
            
            this._tick();

        }, time );
    }

    /**
     * Shuffle slides after moved.
     *
     * @access {private}
     * @param  {Integer} direction -1|1
     */
    _Slider.prototype._moved = function(direction)
    {    
        if (!this.options.wrap) return;

        if (direction === 1)
        {
            this._DOMElementViewport.appendChild(find('> *:first-child', this._DOMElementViewport));
        }
        else
        {
           preapend(find('> *:last-child', this._DOMElementViewport), this._DOMElementViewport);
        }
    }

    /**
     * Update active dot after move.
     *
     * @access {private}
     */
    _Slider.prototype._updateDots = function()
    {
        if (!this.options.dots) return;

        remove_class(find('.js-slider-dots .js-slider-dot.active', this.DOMElementWrapper), 'active');

        add_class(this._dots[this._index], 'active');
    }

    // Load into container
    FrontBx.set('_Slider', _Slider);

})();