/**
 * Browser utility functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */


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
