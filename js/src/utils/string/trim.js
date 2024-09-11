/**
 * Left and right trim string.
 * 
 * @param  {str}           str
 * @return {array|string} charlist (optional)
 */
_.prototype.trim = function(str, charlist)
{
    if (!charlist) return str.trim();

    return this.rtrim(this.ltrim(str, charlist), charlist);
}