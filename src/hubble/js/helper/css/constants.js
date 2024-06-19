/**
 * List of shorthand properties and their longhand equivalents
 *
 * @var {object}
 */
const SHORTHAND_PROPS =
{
    // CSS 2.1: http://www.w3.org/TR/CSS2/propidx.html
    'list-style': ['-type', '-position', '-image'],
    'margin': ['-top', '-right', '-bottom', '-left'],
    'outline': ['-width', '-style', '-color'],
    'padding': ['-top', '-right', '-bottom', '-left'],

    // CSS Backgrounds and Borders Module Level 3: http://www.w3.org/TR/css3-background/
    'background': ['-image', '-position', '-size', '-repeat', '-origin', '-clip', '-attachment', '-color'],
    'border': ['-width', '-style', '-color'],
    'border-color': ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'],
    'border-style': ['border-top-style', 'border-right-style', 'border-bottom-style', 'border-left-style'],
    'border-width': ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width'],
    'border-top': ['-width', '-style', '-color'],
    'border-right': ['-width', '-style', '-color'],
    'border-bottom': ['-width', '-style', '-color'],
    'border-left': ['-width', '-style', '-color'],
    'border-radius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
    'border-image': ['-source', '-slice', '-width', '-outset', '-repeat'],

    // CSS Fonts Module Level 3: http://www.w3.org/TR/css3-fonts/
    'font': ['-style', '-variant', '-weight', '-stretch', '-size', 'line-height', '-family'],
    'font-variant': ['-ligatures', '-alternates', '-caps', '-numeric', '-east-asian'],

    // CSS Masking Module Level 1: http://www.w3.org/TR/css-masking/
    'mask': ['-image', '-mode', '-position', '-size', '-repeat', '-origin', '-clip'],
    'mask-border': ['-source', '-slice', '-width', '-outset', '-repeat', '-mode'],

    // CSS Multi-column Layout Module: http://www.w3.org/TR/css3-multicol/
    'columns': ['column-width', 'column-count'],
    'column-rule': ['-width', '-style', '-color'],

    // CSS Speech Module: http://www.w3.org/TR/css3-speech/
    'cue': ['-before', '-after'],
    'pause': ['-before', '-after'],
    'rest': ['-before', '-after'],

    // CSS Text Decoration Module Level 3: http://www.w3.org/TR/css-text-decor-3/
    'text-decoration': ['-line', '-style', '-color'],
    'text-emphasis': ['-style', '-color'],

    // CSS Animations (WD): http://www.w3.org/TR/css3-animations
    'animation': ['-name', '-duration', '-timing-function', '-delay', '-iteration-count', '-direction', '-fill-mode', '-play-state'],

    // CSS Transitions (WD): http://www.w3.org/TR/css3-transitions/
    'transition': ['-property', '-duration', '-timing-function', '-delay'],

    // CSS Flexible Box Layout Module Level 1 (WD): http://www.w3.org/TR/css3-flexbox/
    'flex': ['-grow', '-shrink', '-basis'],
};

/**
 * List of shorthand properties and their longhand equivalents
 *
 * @var {object}
 */
const SHORTHAND_DEFAULTS = 
{
    '-width' : '0',
    '-height' : '0',
    '-top' : '0',
    '-left' : '0',
    '-bottom' : '0',
    '-duration' : '0s',
    '-delay' : '0s',
    '-grow' : '1' ,
    '-shrink' : '1' ,
    '-iteration-count' : '1',
    '-timing-function' : 'linear',
    '-transition-property' : 'all',
    '-fill-mode': 'none',
    '-emphasis' : 'none',
    '-color' : 'none',
    '-decoration' : 'none',
    '-direction' : 'normal',
    '-play-state' : 'running',
};

/**
 * Cached CSS propery cases.
 *
 * @var {object}
 */
const CSS_PROP_TO_HYPHEN_CASES = {};
const CSS_PROP_TO_CAMEL_CASES  = {};