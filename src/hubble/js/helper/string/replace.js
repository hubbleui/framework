/**
 * String replace
 * 
 * @param  {str}           str
 * @return {array|string} charlist (optional)
 */
_.prototype.replace = function(str, charlist, value)
{
    if (this.is_string(charlist) || this.is_regexp(charlist))
    {
        return str.replaceAll(charlist, value)
    }

    this.each(charlist, function(i, char)
    {
        str = str.replaceAll(char, value);

    }, this);

    return str;
}

