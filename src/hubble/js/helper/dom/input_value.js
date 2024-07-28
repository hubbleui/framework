/**
 * Gets an input element's value
 *
 * @access {public}
 * @param  {DOMElement}   input Target element
 * @return {mixed}
 */
_.prototype.input_value = function(input)
{
    if (input.type == "number" || this.is_numeric(input.value))
    {
        return input.value.includes('.') ? parseInt(input.value) : parseFloat(input.value);
    }
    if (input.type == "select")
    {
        return input.options[input.selectedIndex].value;
    }
    if (input.type == "file")
    {
        if (input.multiple == true)
        {
            return input.files;
        }

        return input.files[0];
    }

    return input.value;
}