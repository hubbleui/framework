/**
 * Json encode
 * 
 * @param  {mixed} str String JSON
 * @return {object|false}
 */
json_decode(str)
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