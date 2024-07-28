/**
 * Is valid JSON
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
_.prototype.is_json = function(str)
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

