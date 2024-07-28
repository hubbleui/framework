/**
 * Removes duplicates and returns new array.
 *
 * @param   {array} arr Array to run
 * @returns {array}
 */
_.prototype.array_unique = function(arr)
{
    let uniq = function(value, index, self)
    {
        return self.indexOf(value) === index;
    }

    return arr.filter(uniq);
}