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
 * CSS Transform value counts
 *
 * @var {object}
 */
const CSS_TRANSFORM_VALUES_COUNT = 
{
    perspective: 1,
    skewY: 1,
    translateY: 1,
    translateZ: 1,
    scaleY: 1,
    scaleZ: 1,
    rotateX: 1,
    rotateY: 1,
    rotateZ: 1,
    translateX: 1,
    skewX: 1,
    scaleX: 1,
    rotate: 1,

    skew: 2,
    translate: 2,
    scale: 2,

    translate3d: 3,
    scale3d: 3,
    rotate3d: 3,

    matrix: 6,
    matrix3d: 16
};

const CSS_3D_TRANSFORM_DEFAULTS =
{
    'translate3d' : ['0','0','0'],
    'scale3d'     : ['1','1','1'],
    'rotate3d'    : ['0','0','1','0'],
    'skew'        : ['0', '0'],
};

const CSS_3D_TRANSFORM_MAP_KEYS =
{
    x: 0,
    y: 1,
    z: 3
};

/* USED FOR css_to_px */
const CSS_PIXELS_PER_INCH = 96;
const CSS_RELATIVE_UNITS  = {
    // Relative to the font-size of the element (2em means 2 times the size of the current font)
    'em' : 16,

    // Relative to the x-height of the current font (rarely used)
    'ex' : 7.15625,

    // Relative to the width of the "0" (zero)
    'ch' : 8,

    // Relative to font-size of the root element
    'rem' : 16,

    // Relative to 1% of the width of the viewport
    'vw' : 1,

    // Relative to 1% of the height of the viewport
    'vh' : 1,

    // Relative to 1% of viewport's* smaller dimension
    // If the viewport height is smaller than the width, 
    // the value of 1vmin will be equal to 1% of the viewport height.
    // Similarly, if the viewport width is smaller than the height, the value of 1vmin will be equal to 1% of the viewport width.
    'vmin' : 765,
    'vmax' : 1200,

    // Relative to the parent element
    '%' : 16
}
const CSS_ABSOLUTE_UNITS =
{
    'in': CSS_PIXELS_PER_INCH,
    'cm': CSS_PIXELS_PER_INCH / 2.54,
    'mm': CSS_PIXELS_PER_INCH / 25.4,
    'pt': CSS_PIXELS_PER_INCH / 72,
    'pc': CSS_PIXELS_PER_INCH / 6,
    'px': 1
}


/**
 * Cached CSS propery cases.
 *
 * @var {object}
 */
const CSS_PROP_TO_HYPHEN_CASES = {};
const CSS_PROP_TO_CAMEL_CASES  = {};