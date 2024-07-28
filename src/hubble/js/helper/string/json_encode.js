/**
 * Json encode
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
_.prototype.json_encode = function(str)
{
    var obj;
    try
    {
        obj = JSON.stringify(str);
    }
    catch (e)
    {
        return false;
    }
    return obj;
}