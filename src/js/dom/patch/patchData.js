import { ACCEPTED_PROPS, attr, addEventListener, removeEventListener} from '../component';

const DOM_PROPS_RE = /\[A-Z]|^(?:value|checked|selected|muted)$/;

export default function patchData(el, key, prevValue, nextValue)
{
    switch (key)
    {
        case 'children':
            
            break;

        case 'style':
            
            for (let k in nextValue)
            {
                el.style[k] = nextValue[k]
            }
            for (let k in prevValue)
            {
                if (!nextValue.hasOwnProperty(k))
                {
                    el.style[k] = '';
                }
            }
            break;

        case 'class':

            el.className = nextValue
            
            break;

        case 'className':

            el.className = nextValue
            
            break;
        
        default:

            const tagName = el.tagName.toLowerCase();

            // event
            if (key[0] === 'o' && key[1] === 'n')
            {
              
                // remove old events
                if (prevValue)
                {
                    removeEventListener(el, key.slice(2).toLowerCase(), prevValue);
                }

                // add new event
                if (nextValue)
                {
                    addEventListener(el, key.slice(2).toLowerCase(), nextValue)
                }
            }
            // Treat as DOM Prop
            else if (DOM_PROPS_RE.test(key))
            {
                el[key] = nextValue
            }
            else if (ACCEPTED_PROPS['*'].includes(key) || ACCEPTED_PROPS[tagName] && ACCEPTED_PROPS[tagName].includes(key))
            {
                attr(el, key, nextValue);
            }
            else
            {
                // Treat as Attr
                el.setAttribute(key, nextValue)
            }
            
        break;
    }
}