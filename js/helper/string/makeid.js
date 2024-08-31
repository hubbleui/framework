/**
 * Make a random string
 *
 * @param  {int}    length String length
 * @return {string}
 */
_.prototype.makeid = function(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < length; i++)
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return text;
}