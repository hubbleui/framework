/**
 * Left trim string 
 * 
 * @param  {str}           str
 * @return {array|string} charlist (optional)
 */
_.prototype.rtrim = function(str, charlist)
{
    if (!charlist) return str.trimEnd();

    if (this.is_string(charlist))
    {
        let len = charlist.length; 

        return str.slice(-len) === charlist ? str.slice(0, -len) : str;
    }

    var ret = str;

    this.each(charlist, function(i, chars)
    {
        var len = chars.length;

        if (str.slice(-len) === chars)
        {
            ret = str.slice(0, -len);

            return false;
        }

    }, this);

    return ret;
}