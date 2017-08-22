/**
 * Browser utility functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Get the browser with version
 *
 * @access public
 * @return object
 */
JSHelper.prototype.getBrowser = function()
{
    if (this.browser) return this.browser;
    var nVer = navigator.appVersion;
    var nAgt = navigator.userAgent;
    var browserName = navigator.appName;
    var fullVersion = "" + parseFloat(navigator.appVersion);
    var majorVersion = parseInt(navigator.appVersion, 10);
    var nameOffset, verOffset, ix;
    if ((verOffset = nAgt.indexOf("OPR/")) != -1)
    {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 4)
    } else {
        if ((verOffset = nAgt.indexOf("Opera")) != -1)
        {
            browserName = "Opera";
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
            {
                fullVersion = nAgt.substring(verOffset + 8)
            }
        } else {
            if ((verOffset = nAgt.indexOf("MSIE")) != -1)
            {
                browserName = "Microsoft Internet Explorer";
                fullVersion = nAgt.substring(verOffset + 5)
            } else {
                if ((verOffset = nAgt.indexOf("Chrome")) != -1)
                {
                    browserName = "Chrome";
                    fullVersion = nAgt.substring(verOffset + 7)
                } else {
                    if ((verOffset = nAgt.indexOf("Safari")) != -1)
                    {
                        browserName = "Safari";
                        fullVersion = nAgt.substring(verOffset + 7);
                        if ((verOffset = nAgt.indexOf("Version")) != -1)
                        {
                            fullVersion = nAgt.substring(verOffset + 8)
                        }
                    } else {
                        if ((verOffset = nAgt.indexOf("Firefox")) != -1)
                        {
                            browserName = "Firefox";
                            fullVersion = nAgt.substring(verOffset + 8)
                        } else {
                            if ((nameOffset = nAgt.lastIndexOf(" ") + 1) < (verOffset = nAgt.lastIndexOf("/")))
                            {
                                browserName = nAgt.substring(nameOffset, verOffset);
                                fullVersion = nAgt.substring(verOffset + 1);
                                if (browserName.toLowerCase() == browserName.toUpperCase())
                                {
                                    browserName = navigator.appName
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    if ((ix = fullVersion.indexOf(";")) != -1)
    {
        fullVersion = fullVersion.substring(0, ix)
    }
    if ((ix = fullVersion.indexOf(" ")) != -1)
    {
        fullVersion = fullVersion.substring(0, ix)
    }
    majorVersion = parseInt("" + fullVersion, 10);
    if (isNaN(majorVersion))
    {
        fullVersion = "" + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10)
    }
    this.browser = {'name': browserName, 'version': majorVersion };

    return this.browser;
}

/**
 * Is this a mobile user agent?
 *
 * @return bool
 */
JSHelper.prototype.isMobile = function()
{
	return this.in_array(
		
		this.getBrowser()['name'].toLowerCase(),
		
		['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini']

	);   
}

/**
 * Is this a mobile user agent?
 *
 * @return bool
 */
JSHelper.prototype.isRetina = function()
{
    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
                      (min--moz-device-pixel-ratio: 1.5),\
                      (-o-min-device-pixel-ratio: 3/2),\
                      (min-resolution: 1.5dppx)";

    if (window.devicePixelRatio > 1)
    {
      return true;
    }

    if (window.matchMedia && window.matchMedia(mediaQuery).matches)
    {
      return true;
    }

    return false;
}
