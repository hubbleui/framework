/**
 * Returns an object of CSS transitions by transition property as keys.
 *
 * @param  {node|string} DOMElement  Target element or transition value string
 * @return {object}
 */
_.prototype.css_transition_props = function(DOMElement)
{
    if (!DOMElement) return {};
    var transitions   = {};
    var transitionVal = this.is_string(DOMElement) ? DOMElement : this.rendered_style(DOMElement, 'transition');

    // No transition
    if (!transitionVal || transitionVal.startsWith('all 0s ease 0s') || transitionVal === 'none' || transitionVal === 'unset' || transitionVal === 'auto')
    {
        return transitions;
    }

    let transitionSplit = transitionVal.includes('cubic-bezier') ? '' : transitionVal.trim().split(',');

    if (transitionVal.includes('cubic-bezier'))
    {
        let map      = [];
        let inBezier = false;
        let block    = '';
        let char;

        this.for(transitionVal.length, function(i)
        {
            char = transitionVal[i];

            if (char === '(') inBezier = true;
            if (char === ')') inBezier = false;

            if (char === ',' && !inBezier)
            {
                map.push(block.trim());
                block = '';

                // next
                return;
            }

            block += char;

            if (i === transitionVal.length -1) map.push(block.trim());
        });

        transitionSplit = map;
    }

    this.each(transitionSplit, function(i, transition)
    {
        transition = transition.trim();

        // Variants of all
        if (transition[0] === '.' || transition.startsWith('all ') ||  this.is_numeric(transition[0]))
        {
            transitions.all = transition.replace('all ', '');

            return false;
        }

        var prop = transition.split(' ', 4).shift();

        transitions[prop] = transition.replace(prop, '').trim();

    }, this);

    return transitions;
}