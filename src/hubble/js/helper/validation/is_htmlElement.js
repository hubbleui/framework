/**
 * Checks if variable is HTMLElement.
 *
 * @param   {mixed}  mixed_var  Variable to evaluate
 * @returns {boolean}
 */
is_htmlElement(mixed_var)
{
    if (mixed_var && mixed_var.nodeType)
    {
        let type = this.var_type(mixed_var);

        return HTML_REGXP.test(type) || type === '[object HTMLDocument]' || type === '[object Text]';
    }

    return false;
}