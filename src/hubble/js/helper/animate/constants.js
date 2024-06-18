/**
 * Math Contstansts.
 * 
 * @var {mixed}
 */
const POW  = Math.pow;
const SQRT = Math.sqrt;
const SIN  = Math.sin;
const COS  = Math.cos;
const PI   = Math.PI;
const C1   = 1.70158;
const C2   = C1 * 1.525;
const c3   = C1 + 1;
const C4   = (2 * PI) / 3;
const C5   = (2 * PI) / 4.5;

/**
 * bounceOut function.
 * 
 * @var {function}
 */
const bounceOut = function (x)
{
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1)
    {
        return n1 * x * x;
    }
    else if (x < 2 / d1)
    {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    }
    else if (x < 2.5 / d1)
    {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    }
    else
    {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
};

/**
 * Easing functions.
 * 
 * @var {object}
 */
const ANIMATION_EASING_FUNCTIONS = 
{
    linear: (x) => x,
    ease: function (x)
    {
        return x < 0.5 ? 4 * x * x * x : 1 - POW(-2 * x + 2, 3) / 2;
    },
    easeIn: function (x)
    {
        return 1 - COS((x * PI) / 2);
    },
    easeOut: function (x)
    {
        return SIN((x * PI) / 2);
    },
    easeInOut: function (x)
    {
        return -(COS(PI * x) - 1) / 2;
    },
    easeInQuad: function (x)
    {
        return x * x;
    },
    easeOutQuad: function (x)
    {
        return 1 - (1 - x) * (1 - x);
    },
    easeInOutQuad: function (x)
    {
        return x < 0.5 ? 2 * x * x : 1 - POW(-2 * x + 2, 2) / 2;
    },
    easeInCubic: function (x)
    {
        return x * x * x;
    },
    easeOutCubic: function (x)
    {
        return 1 - POW(1 - x, 3);
    },
    easeInOutCubic: function (x)
    {
        return x < 0.5 ? 4 * x * x * x : 1 - POW(-2 * x + 2, 3) / 2;
    },
    easeInQuart: function (x)
    {
        return x * x * x * x;
    },
    easeOutQuart: function (x)
    {
        return 1 - POW(1 - x, 4);
    },
    easeInOutQuart: function (x)
    {
        return x < 0.5 ? 8 * x * x * x * x : 1 - POW(-2 * x + 2, 4) / 2;
    },
    easeInQuint: function (x)
    {
        return x * x * x * x * x;
    },
    easeOutQuint: function (x)
    {
        return 1 - POW(1 - x, 5);
    },
    easeInOutQuint: function (x)
    {
        return x < 0.5 ? 16 * x * x * x * x * x : 1 - POW(-2 * x + 2, 5) / 2;
    },
    easeInSine: function (x)
    {
        return 1 - COS((x * PI) / 2);
    },
    easeOutSine: function (x)
    {
        return SIN((x * PI) / 2);
    },
    easeInOutSine: function (x)
    {
        return -(COS(PI * x) - 1) / 2;
    },
    easeInExpo: function (x)
    {
        return x === 0 ? 0 : POW(2, 10 * x - 10);
    },
    easeOutExpo: function (x)
    {
        return x === 1 ? 1 : 1 - POW(2, -10 * x);
    },
    easeInOutExpo: function (x)
    {
        return x === 0
            ? 0
            : x === 1
            ? 1
            : x < 0.5
            ? POW(2, 20 * x - 10) / 2
            : (2 - POW(2, -20 * x + 10)) / 2;
    },
    easeInCirc: function (x)
    {
        return 1 - SQRT(1 - POW(x, 2));
    },
    easeOutCirc: function (x)
    {
        return SQRT(1 - POW(x - 1, 2));
    },
    easeInOutCirc: function (x)
    {
        return x < 0.5
            ? (1 - SQRT(1 - POW(2 * x, 2))) / 2
            : (SQRT(1 - POW(-2 * x + 2, 2)) + 1) / 2;
    },
    easeInBack: function (x)
    {
        return c3 * x * x * x - C1 * x * x;
    },
    easeOutBack: function (x)
    {
        return 1 + c3 * POW(x - 1, 3) + C1 * POW(x - 1, 2);
    },
    easeInOutBack: function (x)
    {
        return x < 0.5
            ? (POW(2 * x, 2) * ((C2 + 1) * 2 * x - C2)) / 2
            : (POW(2 * x - 2, 2) * ((C2 + 1) * (x * 2 - 2) + C2) + 2) / 2;
    },
    easeInElastic: function (x)
    {
        return x === 0
            ? 0
            : x === 1
            ? 1
            : -POW(2, 10 * x - 10) * SIN((x * 10 - 10.75) * C4);
    },
    easeOutElastic: function (x)
    {
        return x === 0
            ? 0
            : x === 1
            ? 1
            : POW(2, -10 * x) * SIN((x * 10 - 0.75) * C4) + 1;
    },
    easeInOutElastic: function (x)
    {
        return x === 0
            ? 0
            : x === 1
            ? 1
            : x < 0.5
            ? -(POW(2, 20 * x - 10) * SIN((20 * x - 11.125) * C5)) / 2
            : (POW(2, -20 * x + 10) * SIN((20 * x - 11.125) * C5)) / 2 + 1;
    },
    easeInBounce: function (x)
    {
        return 1 - bounceOut(1 - x);
    },
    easeOutBounce: bounceOut,
    easeInOutBounce: function (x)
    {
        return x < 0.5
            ? (1 - bounceOut(1 - 2 * x)) / 2
            : (1 + bounceOut(2 * x - 1)) / 2;
    },
};

/**
 * Default options.
 * 
 * @var {object}
 */
const ANIMATION_DEFAULT_OPTIONS =
{
    // Options
    //'property', 'from', 'to'
    easing:               'ease',
    callback:              function() { console.log('complete'); },

    // Mutable options
    startValue:           null,
    endValue:             null,
    duration:             500,

    // Internal trackers
    currentValue:          null,
    totalDistance:         null,
    timeLapsed:            0,
    percentage:            0,
    eventTimeout:          null,
    animationInterval:     null,
    CSSPropertyUnits:      '',
    backwardsAnimation:    false,
    animationStepDuration: 16,

    // Color specific
    isColorAnimation:      false,
    colorAnimationStep:    0,
    colorAnimationCount:   50,
    colorGradientMap:      []
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