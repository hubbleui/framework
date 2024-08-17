/**
 * Normalises a url
 *
 * @access {public}
 * @param  {string}  url The url to normalise
 * @return {string}
 */
_.prototype.normalize_url = function(url)
{
    // Remove www.
    if (url.startsWith('www.') || url.includes('//www.')) url = url.replace('www.', '');

    // Back dirs
    if (url.startsWith('../'))
    {
        let paths = this.parse_url(this.trim(window.location.href, '/')).pathname.split('/');

        if (!this.is_empty(paths))
        {
            // Remove file
            if (paths.slice(-1).includes('.')) paths.pop();

            let backs = url.split('../').length;

            this.for(backs, () => paths.pop());

            url = '/' + this.trim(`${paths.join('/')}/${url.replace(/\.\.\//g, '')}`, '/');
        }
    }

    // Local
    if (url[0] === '/') url = window.location.origin + url;

    // Add protocol
    if (!url.startsWith('https') && !url.startsWith('http')) url = `${window.location.protocol}//${url}`;

    return url;
}