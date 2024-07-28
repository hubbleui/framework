/**
 * Left trim string 
 * 
 * @param  {str}           str
 * @return {array|string} charlist (optional)
 */
_.prototype.ltrim = function(str, charlist)
{
    // Special fast cases
    if (!charlist) return str.trimStart();

    if (this.is_string(charlist))
    {
        return str.slice(0, charlist.length) === charlist ? str.replace(charlist, '') : str;
    }

    var ret = str;

    this.each(charlist, function(i, char)
    {
        if (str.slice(0, char.length) === char)
        {
            ret = str.replace(char, '');
            
            // break            
            return false;
        }

    }, this);

    return ret;
}

