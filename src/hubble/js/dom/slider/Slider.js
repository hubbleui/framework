(function()
{
    /**
     * Helper functions
     * 
     * @var {Function}
     */
    const _ = Hubble._();

    function roundPx(number)
    {
        return Math.round(number * 10) / 10;
    }

    /**
     * Selectors
     * 
     * @var {Map}
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

        groupCells: false,
        // group cells together in slides

        initialIndex: 0,
        // zero-based index of the initial selected cell

        controls: true,
        // creates and enables buttons to click to previous & next cells

        dots: true,
        // create and enable page dots

        resize: true,
        // listens to window resize events to adjust size & positions

        wrap: false,
        // at end of cells, wraps-around to first for infinite scrolling

        pauseOnHover: true,
        // Pauses autoplay on hover

        easing: 'easeOutExpo'
    };
    
    /**
     * Slider.
     *
     * @param {HTMLElement} wrapper Wrapper element
     * @param {Object}      options Options
     */
    const _Slider = function(wrapper, options)
    {
        this.options = _.is_object(options) ? {...DEFAULT_OPTIONS, ...options } :  {...DEFAULT_OPTIONS };

        this.DOMElementWrapper = wrapper;

        this._animating = false;

        this._playing = 'stopped';

        this._hovering = false;

        this._translated = 0;

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

        _.animate(this._DOMElementViewport, { transform: `translateX(-${distance}px)`, easing: this.options.easing, duration: 750, complete: () => { 

            if (this.options.wrap) _.css(this._DOMElementViewport, 'transform', `translateX(0px)`);

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
            
            _.animate(this._DOMElementViewport, { transform: `translateX(${distance < 0 ? 0 : -distance}px)`, easing: this.options.easing, duration: 750, complete: () => 
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

            _.css(this._DOMElementViewport, 'left', `-${preDistance}px`);

            // Run animation
            _.animate(this._DOMElementViewport, { transform: `translateX(${distance}px)`, easing: this.options.easing, duration: 750, complete: () => 
            { 
                _.css(this._DOMElementViewport, 'left', `-${this._offset}px`);

                _.css(this._DOMElementViewport, 'transform', `translateX(0px)`);

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

            _.for(delta, () => { this._updateIndex(direction) });

            this._updateDots();
            
            _.animate(this._DOMElementViewport, { transform: `translateX(${distance < 0 ? 0 : -distance}px)`, easing: this.options.easing, duration: 750, complete: () => 
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
        _.for(delta, () => { this._moved(direction); this._updateIndex(direction) }, this);

        // Insert buffer clones
        let clones = this._bufferNodes(direction);

        _.css(this._DOMElementViewport, 'left', `-${tmpOffset}px`);

        // Run animation
        _.animate(this._DOMElementViewport, { transform: `translateX(${distance}px)`, easing: this.options.easing, duration: 750, complete: () => 
        { 
            _.each(clones, (i, clone) =>
            {
                clone.parentNode.removeChild(clone);
            });

            _.css(this._DOMElementViewport, 'left', `-${this._offset}px`);

            _.css(this._DOMElementViewport, 'transform', `translateX(0px)`);

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
        this._isFullWidth = parseInt(_.rendered_style(this._slides[0], 'max-width')) === 100;

        // Viewport width
        this._viewportWidth = Math.round(_.width(this.DOMElementWrapper));

        // Gap size
        this._gapSize = parseInt(_.rendered_style(this._DOMElementViewport, 'column-gap'));

        // Slide width
        this._slideWidth = Math.round(_.width(this._slides[0], this.DOMElementWrapper));

        // Offset
        this._offset = Math.round(this.options.wrap ? (this._middleIndex * (this._slideWidth + this._gapSize)) - (this._viewportWidth / 2) + (this._slideWidth / 2) : (this._slideWidth + this._gapSize) - ((this._viewportWidth + this._slideWidth) / 2));

        // Buffer
        if (!this._isFullWidth)
        {
            let percentagWidth  = (100 * this._slideWidth) / this._viewportWidth;
            this._bufferSize    = percentagWidth > 50 ? 3 : Math.round(100 / percentagWidth);            
        }

        // Make offset
        _.css(this._DOMElementViewport, 'left', `${this._offset === 0 ? 0 : -this._offset}px`);
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
            _.on(document, 'visibilitychange', this._onVisibilityPlay, this);

            return;
        }

        this._playing = 'playing';

        // listen to visibility change
        _.on(document, 'visibilitychange', this._onVisibilityChange, this);

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
        _.off(document, 'visibilitychange', this._onVisibilityChange, this);
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
        this._slides = _.find_all('> *', this.DOMElementWrapper);

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
        this._DOMElementViewport = _.dom_element({tag: 'div', class: 'slider-viewport js-slider-viewport'}, this.DOMElementWrapper, this._slides);

        // Controls
        if (this.options.controls) this._buildControls();

        // Dots
        this._dots = [];
        this._dot = null;
        if (this.options.dots) this._buildDots();

        // Pause on hover
        if (this.options.autoPlay && this.options.pauseOnHover)
        {
            _.on(this.DOMElementWrapper, 'mouseover', this.pause, this);

            _.on(this.DOMElementWrapper, 'mouseout', this.unpause, this);
        }
    }

     /**
     * Build controls.
     *
     * @access {private}
     */
    _Slider.prototype._buildControls = function()
    {
        // Right button
        this._righBtn = _.dom_element({tag: 'button', type: 'button', class: 'slider-control control-right btn btn-pure'}, this.DOMElementWrapper, 
            _.dom_element({tag: 'span',class: 'fa fa-caret-right'})
        );

        // Left button
        this._leftBtn = _.dom_element({tag: 'button', type: 'button', class: 'slider-control control-left btn btn-pure'}, this.DOMElementWrapper, 
            _.dom_element({tag: 'span',class: 'fa fa-caret-left'})
        );

        // Handlers
        _.on(this._righBtn, 'click', this.next, this);
        _.on(this._leftBtn, 'click', this.previous, this);
    }

    /**
     * Build dots.
     *
     * @access {private}
     */
    _Slider.prototype._buildDots = function()
    {
        let index = this._index;

        this._dotWrap = _.dom_element({tag: 'div', class: 'slider-dots'}, this.DOMElementWrapper, _.map(this._slides, (i, slide) =>
        {
            let active = i === index ? 'btn-primary' : '';

            let dot = _.dom_element({tag: 'button', type: 'button', dataIndex: i, class: `slider-dot js-slider-dot btn btn-circle ${active}`});

            _.on(dot, 'click', this._dotClick, this);

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

        _.for(this._slidesCount, (i) =>
        {
            if (_.nth_siblings(slide) === this._middleIndex) return false;

            _.preapend(_.find('> *:last-child', this._DOMElementViewport), this._DOMElementViewport);
        
        }, this);
    }

    /**
     * On dot click.
     *
     * @access {private}
     */
    _Slider.prototype._dotClick = function(e, dot)
    {
        let index = parseInt(_.attr(dot, 'data-index')) +1;

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

        return _.map([...Array(this._bufferSize).keys()], (i) =>
        {
            let clone = _.find(`> *:nth${direction === -1 ? '-' : '-last-'}child(${i+1})`, viewport).cloneNode(true);

            direction === -1 ? viewport.appendChild(clone) : _.preapend(clone, viewport);

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
        
        _.off(document, 'visibilitychange', this._onVisibilityPlay, this);
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
            this._DOMElementViewport.appendChild(_.find('> *:first-child', this._DOMElementViewport));
        }
        else
        {
           _.preapend(_.find('> *:last-child', this._DOMElementViewport), this._DOMElementViewport);
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

        _.remove_class(this._dot, 'btn-primary');

        this._dot = this._dots[this._index];

        _.add_class(this._dot, 'btn-primary');
    }

    // Load into container
    Hubble.set('_Slider', _Slider);

})();
