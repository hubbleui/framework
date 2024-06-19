/**
 * Clone an object
 * 
 * @access {public}
 * @param  {object}  src       The object to clone
 * @return {object}
 */
obj_clone(src)
{
    var clone = {};

    for (var prop in src)
    {
        if (src.hasOwnProperty(prop))
        {
            clone[prop] = src[prop];
        }
    }
    return clone;
}