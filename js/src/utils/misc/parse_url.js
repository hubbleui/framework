/**
 * Parse url
 *
 * @param  {string}    str       The URL to parse. Invalid characters are replaced by _.
 * @return {object}
 */
_.prototype.parse_url = function(str)
{
    var ret = {};
    var url = new URL(str);

    if (url.search)
    {
        var queries = url.search.substring(1).split('&');
        var qret    = {};
        
        this.each(queries, function(i, query)
        {
            if (query.includes('='))
            {
                var set   = query.split('=');
                var key   = decodeURI(set[0].trim());
                var val   = true;

                if (set.length === 2)
                {
                    val = set[1].trim();
                }

                if (key !== '' && val !== '')
                {
                    qret[key] = val;
                }
            }
            else
            {
                qret[query] = true;
            }
        });

        url.query = qret;
    }

    return url;
}