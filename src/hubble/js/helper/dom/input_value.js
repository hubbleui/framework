/**
 * Gets an input element's value
 *
 * @access {public}
 * @param  {DOMElement}   input Target element
 * @return {mixed}
 */
input_value(input)
{
    if (input.type == "checkbox")
    {
        var val = '';

        var checks = this.$All('input[name=' + input.name + ']');

        for (var i = 0, len = checks.length; i < len; i++)
        {
            if (checks[i].checked)
            {
                val += checks[i].value + ', ';
            }
        }

        return this.rtrim(val, ', ');
    }

    if (input.type == "number")
    {
        return parseInt(input.value);
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