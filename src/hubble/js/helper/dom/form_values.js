/**
 * Get an array of name/value objects for all inputs in a form
 *
 * @access {public}
 * @param  {node}   form Target element
 * @return {array}
 */
form_values(form)
{
    let inputs = this.form_inputs(form);
    let ret    = {};

    this.each(inputs, function(i, input)
    {
        let name = input.name;

        if (input.type === 'radio' && input.checked == false)
        {

        }
        else if (input.type === 'checkbox')
        {
            ret[name] = (input.checked == true);
        }
        if (name.indexOf('[]') > -1)
        {
            if (!ret[name])
            {
                ret[name] = [];
            }

            ret[name].push(this.input_value(input));
        }
        else
        {
            ret[name] = this.input_value(input);
        }

    }, this);
   
    return ret;
}