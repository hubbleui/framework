/**
 * Json encode
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
json_encode(str)
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