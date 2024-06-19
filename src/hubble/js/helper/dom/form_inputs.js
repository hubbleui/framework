/**
 * Get all input elements from a form
 *
 * @access {public}
 * @param  {node}   form Target element
 * @return {array}
 */
form_inputs(form)
{
    var allInputs = this.$All('input, textarea, select', form);

    var i = allInputs.length;

    while (i--)
    {
        var input = allInputs[i];

        if (input.type == "radio" && input.checked !== true)
        {
            allInputs.splice(i, 1);
        }
    }

    return allInputs;
}