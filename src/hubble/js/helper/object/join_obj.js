/**
 * Joins an object into a string
 * 
 * @param   {Object} obj       Object
 * @param   {string} seperator Seperator Between key & value
 * @param   {string} glue      Glue between value and next key
 * @returns {string} 
 */
join_obj(obj, seperator, glue, recursive)
{
    seperator = this.is_undefined(seperator) ? '' : seperator;
    glue      = this.is_undefined(glue) ? '' : glue;
    recursive = this.is_undefined(recursive) ? false : recursive;
    
    var ret = '';

    this.each(obj, function(key, val)
    {
        if (this.is_object(val))
        {
            val = recursive ? '{' + this.join_obj(val, seperator, glue, recursive) + '}' : {};
        }
        else if (this.is_array(val))
        {
            val = recursive ? this.join_obj(val, seperator, glue, recursive) : val.join(', ').replaceAll('[object Object]', '{}');
        }
        else
        {            
            val = `${val}`;
        }

        ret += `${glue}${key}${seperator}${val}`;

    }, this);

    if (ret === `${glue}${seperator}`) return '';

    return this.rtrim(this.ltrim(ret, glue), seperator);
}