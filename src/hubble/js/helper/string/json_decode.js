/**
 * Json encode
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
_.prototype.json_decode = function(str)
{
    var obj;
    try
    {
        obj = JSON.parse(str);
    }
    catch (e)
    {
        return false;
    }
    return obj;
}