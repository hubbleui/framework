/**
 * Boot and Initialize Hubble Core
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */
(function()
{
    // Boot Hubble
    Container.get('Hubble').boot();

	if (!window.Hubble)
	{
		window.Hubble = Container.get('Hubble');
	}
    
})();