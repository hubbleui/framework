/**
 * Get all input elements from a form
 *
 * @access {public}
 * @param  {DOMElement}   form Target element
 * @return {array}
 */
form_inputs(form)
{
    return this.$All('input, textarea, select', form);
}