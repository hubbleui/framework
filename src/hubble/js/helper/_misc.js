/**
 * Miscellaneous helper functions
 *
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 * @license   {https://github.com/kanso-cms/cms/blob/master/LICENSE}
 */

/**
 * Gets url query
 *
 * @access {public}
 * @param  {string}  name String query to get (optional)
 * @return {object|string}
 */
url_query(name)
{
    var results = {};

    if (window.location.search !== '')
    {
        var params = window.location.search.substring(1).split('&');

        for (var i = 0; i < params.length; i++)
        {
            if (!params[i].includes('='))
            {
                continue;
            }

            var split = params[i].split('=');

            results[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
        }
    }

    // No param return all url query
    if (typeof name === 'undefined')
    {
        return results;
    }

    name = decodeURIComponent(name);

    if (name in results)
    {
        return results[name];
    }

    return false;
}