/**
 * Filters empty array entries and returns new array
 *
 * @param   {object|array}  object Object to delete from
 * @returns {object|array}
 */
_.prototype.array_filter = function(arr)
{
    let isArr = this.is_array(arr);

    let ret = isArr ? [] : {};

    this.each(arr, function(i, val)
    {
        if (!this.is_empty(val))
        {
            isArr ? ret.push(val) : ret[i] = val;
        }
        
    }, this);

    return ret;
}