(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const [add_class, animate, attr, css, dom_element, each, find, find_all, _for, is_object, map, nth_siblings, off, on, preapend, remove_class, rendered_style, width] = Hubble.import(['add_class','animate','attr','css','dom_element','each','find','find_all','for','is_object','map','nth_siblings','off','on','preapend','remove_class','rendered_style','width']).from('_');

    /**
     * Default options
     * 
     * @var {Object}
     */
    const DEFAULT_OPTIONS =
    {
        accessibility: true,
        // enable keyboard navigation, pressing left & right keys

        autoPlay: true,
        // advances to the next cell
        // if true, default is 3 seconds
        // or set time between advances in milliseconds
        // i.e. `autoPlay: 1000` will advance every 1 second

        initialIndex: 0,
        // zero-based index of the initial selected cell

        controls: true,
        // creates and enables buttons to click to previous & next cells

        dots: true,
        // create and enable page dots

        resize: true,
        // listens to window resize events to adjust size & positions

        wrap: true,
        // at end of cells, wraps-around to first for infinite scrolling

        pauseOnHover: true,
        // Pauses autoplay on hover

        easing: 'easeOutExpo',
        // Easing pattern

        draggable: '>1',
        dragThreshold: 3,

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

        this._hovering = false;

        this._translated = 0;

        this._throttle = throttle(() => this.resize(), 100);

        this._build();

        this._moveIndexToMiddle();

        this.resize();

        //if (this.options.autoPlay) this.play();
    }

    /**
     * Destroy the slider.
     *
     * @access {public}
     */
    _Slider.prototype.destroy = function()
    {
        this.stop();

        off(this._righBtn, 'click', this.next, this);

        off(this._leftBtn, 'click', this.previous, this);

        off(window, 'resize', this._throttle, this);

        off(this.DOMElementWrapper, 'mouseover', this.pause, this);

        off(this.DOMElementWrapper, 'mouseout', this.unpause, this);

        off(this._dots, 'click', this.next, this);
    }

    /**
     * Next slide
     *
     * @access {public}
     */
    _Slider.prototype.next = function(e)
    {
        // Stop on animating
        if (this._animating) return;

        // Do nothing on non-wrap and at end
        if (!this.options.wrap && this._index === this._slidesIndexs) return;

        // Pause autoplay
        this.pause();

        // We're now animating
        this._animating = true;

        // Run animation
        let distance = (this._slideWidth + this._gapSize);

        if (!this.options.wrap)
        {
            distance += this._translated;
            
            this._translated = distance;
        }

        animate(this._DOMElementViewport, { transform: `translateX(-${distance}px)`, easing: this.options.easing, duration: 550, complete: () => { 

            if (this.options.wrap) css(this._DOMElementViewport, 'transform', `translateX(0px)`);

            this._moved(1);

            this._animating = false;

            if (!e) this.unpause();

        }});
    
        // Update the index and dots.        
        this._updateIndex(1);
        this._updateDots();
    }

    /**
     * Previous slide
     *
     * @access {public}
     */
    _Slider.prototype.previous = function()
    {
        // Stop on animating
        if (this._animating) return;

        // Do nothing on non-wrap and at start
        if (!this.options.wrap && this._index === 0) return;

        // Clear timeout
        this.pause();

        // We're now animating
        this._animating = true;

        if (!this.options.wrap)
        {
            let distance = this._translated - (this._slideWidth + this._gapSize);

            this._translated = distance;
            
            animate(this._DOMElementViewport, { transform: `translateX(${distance < 0 ? 0 : -distance}px)`, easing: this.options.easing, duration: 550, complete: () => 
            { 
                this._animating = false;

                this.unpause();

            } });
        }
        else
        {
            // Shuffle before animation
            this._moved(-1);

            // Adjust pre distance before animation
            let preDistance = this._offset + (this._slideWidth + this._gapSize);

            // Run animation
            let distance = (this._slideWidth + this._gapSize);

            css(this._DOMElementViewport, 'left', `-${preDistance}px`);

            // Run animation
            animate(this._DOMElementViewport, { transform: `translateX(${distance}px)`, easing: this.options.easing, duration: 550, complete: () => 
            { 
                css(this._DOMElementViewport, 'left', `-${this._offset}px`);

                css(this._DOMElementViewport, 'transform', `translateX(0px)`);

                this._animating = false;

                this.unpause();

            } });
        }
            
        // Update dots and indexes
        this._updateIndex(-1);

        this._updateDots();
    }

    /**
     * Go to slide.
     *
     * @access {public}
     * @param  {integer} slideNum Slide number
     */
    _Slider.prototype.toSlide = function(slideNum, fromClick)
    {   
        // Animating
        if (this._animating) return false;

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
            let distance = (this._slideWidth + this._gapSize) * delta;

            distance = direction === -1 ? this._translated - distance : this._translated + distance;
            
            this._translated = distance;

            _for(delta, () => { this._updateIndex(direction) });

            this._updateDots();
            
            animate(this._DOMElementViewport, { transform: `translateX(${distance < 0 ? 0 : -distance}px)`, easing: this.options.easing, duration: 550, complete: () => 
            { 
                this._animating = false;

                this.unpause();

            } });

            return;
        }

        // Moving back shifts index forward
        // Moving forwards shifts index back
        let postIndex = direction === -1 ? this._middleIndex + delta : (this._middleIndex - delta) + this._bufferSize;

        // Since we know the new index, we can just calculate how far offset center it is.
        let tmpOffset = (postIndex * (this._slideWidth + this._gapSize)) - (this._viewportWidth / 2) + (this._slideWidth / 2);

        // Run animation
        let distance = (this._slideWidth + this._gapSize) * delta;
        distance  = direction === 1 ? -distance : distance;

        // Shuffle slides
        _for(delta, () => { this._moved(direction); this._updateIndex(direction) }, this);

        // Insert buffer clones
        let clones = this._bufferNodes(direction);

        css(this._DOMElementViewport, 'left', `-${tmpOffset}px`);

        // Run animation
        animate(this._DOMElementViewport, { transform: `translateX(${distance}px)`, easing: this.options.easing, duration: 550, complete: () => 
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
     * Window resize handler.
     *
     * @access {private}
     */
    _Slider.prototype.resize = function()
    {
        // Is full width, may change with responsive CSS
        this._isFullWidth = parseInt(rendered_style(this._slides[0], 'max-width')) === 100;

        // Viewport width
        this._viewportWidth = Math.round(width(this.DOMElementWrapper));

        // Gap size
        this._gapSize = parseInt(rendered_style(this._DOMElementViewport, 'column-gap'));

        // Slide width
        this._slideWidth = Math.round(width(this._slides[0], this.DOMElementWrapper));

        // Offset
        this._offset = Math.round(this.options.wrap ? (this._middleIndex * (this._slideWidth + this._gapSize)) - (this._viewportWidth / 2) + (this._slideWidth / 2) : (this._slideWidth + this._gapSize) - ((this._viewportWidth + this._slideWidth) / 2));

        // Buffer
        if (!this._isFullWidth)
        {
            let percentagWidth  = (100 * this._slideWidth) / this._viewportWidth;
            this._bufferSize    = percentagWidth > 50 ? 3 : Math.round(100 / percentagWidth);            
        }

        // Make offset
        css(this._DOMElementViewport, 'left', `${this._offset === 0 ? 0 : -this._offset}px`);
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
        this._slides = find_all('> *', this.DOMElementWrapper);

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
        this._dot = null;
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
            on(window, 'resize', this._throttle, this);
        }

        if (this.options.draggable)
        {
            add_class(this.DOMElementWrapper, 'draggable');

            this._bindGestures();
        }
    }

    /**
     * Build controls.
     *
     * @access {private}
     */
    _Slider.prototype._bindGestures = function()
    {
        let wrapper = this.DOMElementWrapper;

        const handlePointerDown = function(event)
        {
            this.dragX = event.x;

            add_class(wrapper, 'pointer-down');

            console.log('pointerdown');
        }

        const handlePointerUp = function(event)
        {
            this.dragX = event.x;

            remove_class(wrapper, 'pointer-down');

            console.log('pointerdown');
        }

        const handleDragStart = function(event, pointer)
        {
            console.log('handleDragStart');

            add_class(wrapper, 'dragging');

            this.dragStartPosition = event.x;
            
            //this.startAnimation();
        }

        const handleDragMove = function( event, pointer, moveVector )
        {
            console.log('handleDragMove');

            event.preventDefault();

            this.previousDragX = this.dragX;

            let dragX = this.dragStartPosition + moveVector.x;

            /*if ( !this.options.draggable ) return;

            // Slow down
            if ( !this.options.wrap )
            {
                // slow drag
                let originBound = Math.max( -this.slides[0].target, this.dragStartPosition );
                dragX = dragX > originBound ? ( dragX + originBound ) * 0.5 : dragX;
                let endBound = Math.min( -this.getLastSlide().target, this.dragStartPosition );
                dragX = dragX < endBound ? ( dragX + endBound ) * 0.5 : dragX;
            }

            this.dragX = dragX;

            this.dragMoveTime = new Date();*/
        };

        const handleDragEnd = () =>
        {
            console.log('handleDragEnd');

            add_class(wrapper, 'dragging');

            /*if ( !this.options.draggable ) return;

            // set selectedIndex based on where flick will end up
            //let index = this.dragEndRestingSelect();

            delete this.previousDragX;

            //this.select( index );
            
            delete this.isDragSelect;*/
        }

        // Gestures
        const gestures = Hubble.Gestures(this.DOMElementWrapper, { handlePointerDown, handleDragStart, handleDragMove, handleDragEnd, handlePointerUp });
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

        this._dotWrap = dom_element({tag: 'div', class: 'slider-dots'}, this.DOMElementWrapper, map(this._slides, (i, slide) =>
        {
            let active = i === index ? 'active' : '';

            let dot = dom_element({tag: 'button', type: 'button', dataIndex: i, class: `slider-dot js-slider-dot btn btn-circle ${active}`});

            on(dot, 'click', this._dotClick, this);

            this._dots.push(dot);

            if (i === index) this._dot = dot;

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
        let index = parseInt(attr(dot, 'data-index')) +1;

        this.toSlide(index, true);
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
        
        // We only go shortest path if we're wrapping
        if (this.options.wrap)
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

        remove_class(this._dot, 'active');

        this._dot = this._dots[this._index];

        add_class(this._dot, 'active');
    }

    // Load into container
    Hubble.set('_Slider', _Slider);

})();