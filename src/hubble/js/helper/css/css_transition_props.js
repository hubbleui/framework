/**
 * Returns an object of CSS transitions by transition property as keys.
 *
 * @param  {node|string} DOMElement  Target element or transition value string
 * @return {object}
 */
css_transition_props(DOMElement)
{
    if (!DOMElement) return {};
    var transitions   = {};
    var transitionVal = this.is_string(DOMElement) ? DOMElement : this.rendered_style(DOMElement, 'transition');

    // No transition
    if (!transitionVal || transitionVal.startsWith('all 0s ease 0s') || transitionVal === 'none' || transitionVal === 'unset' || transitionVal === 'auto')
    {
        return transitions;
    }

    this.each(transitionVal.trim().split(','), function(i, transition)
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