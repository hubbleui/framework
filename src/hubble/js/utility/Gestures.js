(function()
{
    const Gestures = function(element, handlers)
    {
        handlers = handlers || {};


        this.element = element;

        this.handleEvent = this.handleEvent.bind(this);

        Object.keys(handlers).forEach((key) =>
        {
            this[key] = handlers[key].bind(this);
        });

        this.bind();
    }

    // ----- bind start ----- //

    // trigger handler methods for events
    Gestures.prototype.handleEvent = function( event )
    {
        let method = 'on' + event.type;

        if ( this[ method ] )
        {
            this[ method ]( event );
        }
    }

    Gestures.prototype.emitEvent = function(event, args)
    {
        let method = 'handle' + event.charAt(0).toUpperCase() + event.slice(1);;

        if ( this[ method ] )
        {
            this[ method ]( ...args );
        }
    };

    let startEvent, activeEvents;
    if ( 'ontouchstart' in window )
    {
    // HACK prefer Touch Events as you can preventDefault on touchstart to
    // disable scroll in iOS & mobile Chrome metafizzy/flickity#1177
        startEvent = 'touchstart';
        activeEvents = [ 'touchmove', 'touchend', 'touchcancel' ];
    } else if ( window.PointerEvent )
    {
    // Pointer Events
        startEvent = 'pointerdown';
        activeEvents = [ 'pointermove', 'pointerup', 'pointercancel' ];
    } else {
    // mouse events
        startEvent = 'mousedown';
        activeEvents = [ 'mousemove', 'mouseup' ];
    }

    // prototype so it can be overwriteable by Flickity
    Gestures.prototype.touchActionValue = 'none';

    Gestures.prototype.bind = function()
    {
        this.element.addEventListener(startEvent, this.handleEvent);

        this.element.addEventListener('click', this.handleEvent);

        // touch-action: none to override browser touch gestures.
        if ( window.PointerEvent ) this.element.style.touchAction = 'none';
    }

    Gestures.prototype.unbind = function()
    {
        this.element.removeEventListener(startEvent, this.handleEvent);

        this.element.removeEventListener('click', this.handleEvent);

    }

    Gestures.prototype.bindActivePointerEvents = function()
    {
        activeEvents.forEach( ( eventName ) => {
            window.addEventListener( eventName, this.handleEvent);
        } );
    };

    Gestures.prototype.unbindActivePointerEvents = function()
    {
        activeEvents.forEach( ( eventName ) => {
            window.removeEventListener( eventName, this.handleEvent);
        } );
    };

    // ----- event handler helpers ----- //

    // trigger method with matching pointer
    Gestures.prototype.withPointer = function( methodName, event )
    {
        if ( event.pointerId === this.pointerIdentifier )
        {
            this[ methodName ]( event, event );
        }
    };

    // trigger method with matching touch
    Gestures.prototype.withTouch = function( methodName, event )
    {
        let touch;
        for ( let changedTouch of event.changedTouches )
        {
            if ( changedTouch.identifier === this.pointerIdentifier )
            {
                touch = changedTouch;
            }
        }
        if ( touch ) this[ methodName ]( event, touch );
    };

    // ----- start event ----- //

    Gestures.prototype.onmousedown = function( event )
    {
        this.pointerDown( event, event );
    };

    Gestures.prototype.ontouchstart = function( event )
    {
        this.pointerDown( event, event.changedTouches[0] );
    };

    Gestures.prototype.onpointerdown = function( event )
    {
        this.pointerDown( event, event );
    };

    // nodes that have text fields
    const cursorNodes = [ 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION' ];
    // input types that do not have text fields
    const clickTypes = [ 'radio', 'checkbox', 'button', 'submit', 'image', 'file' ];

    /**
    * any time you set `event, pointer` it refers to:
    * @param {Event} event
    * @param {Event | Touch} pointer
    */
    Gestures.prototype.pointerDown = function( event, pointer )
    {
        // dismiss multi-touch taps, right clicks, and clicks on text fields
        let isCursorNode = cursorNodes.includes( event.target.nodeName );
        let isClickType = clickTypes.includes( event.target.type );
        let isOkayElement = !isCursorNode || isClickType;
        let isOkay = !this.isPointerDown && !event.button && isOkayElement;
        if ( !isOkay ) return;

        this.isPointerDown = true;
        // save pointer identifier to match up touch events
        this.pointerIdentifier = pointer.pointerId !== undefined ?
        // pointerId for pointer events, touch.indentifier for touch events
        pointer.pointerId : pointer.identifier;
        // track position for move
        this.pointerDownPointer = {
            pageX: pointer.pageX,
            pageY: pointer.pageY,
        };

        this.bindActivePointerEvents();

        this.emitEvent( 'pointerDown', [ event, pointer ] );
    };

    // ----- move ----- //

    Gestures.prototype.onmousemove = function( event )
    {
        this.pointerMove( event, event );
    };

    Gestures.prototype.onpointermove = function( event )
    {
        this.withPointer( 'pointerMove', event );
    };

    Gestures.prototype.ontouchmove = function( event )
    {
        this.withTouch( 'pointerMove', event );
    };

    Gestures.prototype.pointerMove = function( event, pointer )
    {
        let moveVector = {
            x: pointer.pageX - this.pointerDownPointer.pageX,
            y: pointer.pageY - this.pointerDownPointer.pageY,
        };
        this.emitEvent( 'pointerMove', [ event, pointer, moveVector ] );
    // start drag if pointer has moved far enough to start drag
        let isDragStarting = !this.isDragging && this.hasDragStarted( moveVector );
        if ( isDragStarting ) this.dragStart( event, pointer );
        if ( this.isDragging ) this.dragMove( event, pointer, moveVector );
    };

    // condition if pointer has moved far enough to start drag
    Gestures.prototype.hasDragStarted = function( moveVector )
    {
        return Math.abs( moveVector.x ) > 3 || Math.abs( moveVector.y ) > 3;
    };

    // ----- drag ----- //

    Gestures.prototype.dragStart = function( event, pointer )
    {
        this.isDragging = true;
        this.isPreventingClicks = true; // set flag to prevent clicks
        this.emitEvent( 'dragStart', [ event, pointer ] );
    };

    Gestures.prototype.dragMove = function( event, pointer, moveVector )
    {
        this.emitEvent( 'dragMove', [ event, pointer, moveVector ] );
    };

        // ----- end ----- //

    Gestures.prototype.onmouseup = function( event )
    {
        this.pointerUp( event, event );
    };

    Gestures.prototype.onpointerup = function( event )
    {
        this.withPointer( 'pointerUp', event );
    };

    Gestures.prototype.ontouchend = function( event )
    {
        this.withTouch( 'pointerUp', event );
    };

    Gestures.prototype.pointerUp = function( event, pointer )
    {
        this.pointerDone();
        this.emitEvent( 'pointerUp', [ event, pointer ] );

        if ( this.isDragging )
        {
            this.dragEnd( event, pointer );
        } else {
        // pointer didn't move enough for drag to start
            this.staticClick( event, pointer );
        }
    };

    Gestures.prototype.dragEnd = function( event, pointer )
    {
        this.isDragging = false; // reset flag
        
        // re-enable clicking async
        setTimeout( () => delete this.isPreventingClicks );

        this.emitEvent( 'dragEnd', [ event, pointer ] );
    };

    // triggered on pointer up & pointer cancel
    Gestures.prototype.pointerDone = function()
    {
        this.isPointerDown = false;
        delete this.pointerIdentifier;
        this.unbindActivePointerEvents();
        this.emitEvent('pointerDone');
    };

        // ----- cancel ----- //

    Gestures.prototype.onpointercancel = function( event )
    {
        this.withPointer( 'pointerCancel', event );
    };

    Gestures.prototype.ontouchcancel = function( event )
    {
        this.withTouch( 'pointerCancel', event );
    };

    Gestures.prototype.pointerCancel = function( event, pointer )
    {
        this.pointerDone();
        this.emitEvent( 'pointerCancel', [ event, pointer ] );
    };

        // ----- click ----- //

        // handle all clicks and prevent clicks when dragging
    Gestures.prototype.onclick = function( event )
    {
        if ( this.isPreventingClicks ) event.preventDefault();
    };

        // triggered after pointer down & up with no/tiny movement
    Gestures.prototype.staticClick = function( event, pointer )
    {
        // ignore emulated mouse up clicks
        let isMouseup = event.type === 'mouseup';
        if ( isMouseup && this.isIgnoringMouseUp ) return;

        this.emitEvent( 'staticClick', [ event, pointer ] );

        // set flag for emulated clicks 300ms after touchend
        if ( isMouseup )
        {
            this.isIgnoringMouseUp = true;
        // reset flag after 400ms
            setTimeout( () => {
                delete this.isIgnoringMouseUp;
            }, 400 );
        }
    };

    // Load into container
    Hubble.set('Gestures', Gestures);

})();