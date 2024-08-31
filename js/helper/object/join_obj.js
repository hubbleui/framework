/**
 * Joins an object into a string
 * 
 * @param   {Object} obj       Object
 * @param   {string} seperator Seperator Between key & value
 * @param   {string} glue      Glue between value and next key
 * @returns {string} 
 */
_.prototype.join_obj = function(obj, seperator, glue, recursive, trimLast)
{
    seperator = this.is_undefined(seperator) ? '' : seperator;
    glue      = this.is_undefined(glue) ? '' : glue;
    recursive = this.is_undefined(recursive) ? false : recursive;
    trimLast  = this.is_undefined(trimLast)  ? true : trimLast;
    
    var ret = '';

    this.each(obj, function(key, val)
    {
        if (this.is_object(val))
        {
            val = recursive ? '{' + this.join_obj(val, seperator, glue, recursive, trimLast) + '}' : {};
        }
        else if (this.is_array(val))
        {
            val = recursive ? this.join_obj(val, seperator, glue, recursive, trimLast) : val.join(', ').replaceAll('[object Object]', '{}');
        }
        else
        {            
            val = `${val}`;
        }

        ret += `${glue}${key}${seperator}${val}`;

    }, this);

    if (ret === `${glue}${seperator}` || ret.trim() === '') return '';

    return trimLast ? this.rtrim(this.ltrim(ret, glue), seperator) : this.ltrim(ret, glue).trim() + glue;
}