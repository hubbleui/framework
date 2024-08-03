/**
 * Removes duplicates and returns new array.
 *
 * @param   {array} arr Array to run
 * @returns {array}
 */
_.prototype.array_unique = function(arr)
{
    return arr.filter((value, index, self) => self.indexOf(value) === index);
}