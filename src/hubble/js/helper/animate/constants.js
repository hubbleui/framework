/**
 * Default options.
 * 
 * @var {object}
 */
const ANIMATION_DEFAULT_OPTIONS =
{
    // Options
    //'property', 'from', 'to', 'callback', 'complete', 'start', 'fail'
    easing:               'ease',
    duration:              500,
    fps:                   60, // (16ms)
};

 /**
 * Allowed Options.
 * 
 * @var {array}
 */
const ANIMATION_ALLOWED_OPTIONS = ['property', 'from', 'to', 'duration', 'easing', 'callback'];

/**
 * Allowed Options.
 * 
 * @var {array}
 */
const ANIMATION_FILTER_OPTIONS = [ ...Object.keys(ANIMATION_DEFAULT_OPTIONS), ...ANIMATION_ALLOWED_OPTIONS];

/**
 * Currently animating animations.
 * 
 * @var {array}
 */
const ANIMATING = [];

