/**
 * Is valid JSON
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
is_json(str)
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

