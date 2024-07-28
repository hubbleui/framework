/**
 * Get an array of name/value objects for all inputs in a form
 *
 * @access {public}
 * @param  {DOMElement}   form Target element
 * @return {array}
 */
_.prototype.form_values = function(form)
{
    var inputs = this.form_inputs(form);
    var ret    = {};
    
    this.each(inputs, function(i, input)
    {
        let name = input.name;

        if (input.type === 'radio')
        {
            if (this.attr(input, 'checked')) ret[name] = this.input_value(input);
        }
        else if (input.type === 'checkbox')
        {
            ret[name] = this.attr(input, 'checked');
        }
        else
        {
            ret[name] = this.input_value(input);
        }
        if (name.includes('[]'))
        {
            if (!ret[name] || !this.is_array(ret[name]))
            {
                ret[name] = [];
            }

            ret[name].push(this.input_value(input));
        }

    }, this);
   
    return ret;
}