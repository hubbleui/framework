import VNode from '../vdom';
import { RENDER_QUEUE } from '../render';

export default function createElement(tag, props, ...children)
{    
    let normalizedProps = {},
        key,
        ref,
        i;

    for (i in props)
    {
        if (i == 'key') 
        {
            key = props[i];
        }
        else if (i == 'ref')
        {
            ref = props[i];
        }
        
        normalizedProps[i] = props[i];
    }

    children = typeof children === 'undefined' ? [] : children;

    if (arguments.length > 2)
    {
        children = arguments.length > 3 ? [].slice.call(arguments, 2) : children;
    }

    // If a Component VNode, check for and apply defaultProps
    // Note: type may be undefined in development, must never error here.
    if (typeof tag == 'function' && tag.defaultProps != null)
    {
        for (i in tag.defaultProps)
        {
            if (normalizedProps[i] === undefined)
            {
                normalizedProps[i] = tag.defaultProps[i];
            }
        }
    }

    if (RENDER_QUEUE.current)
    {
        for (var x = 0; x < RENDER_QUEUE.current.length; x++)
        {
            let vnode = RENDER_QUEUE.current[x];
            
            if (vnode.type === tag)
            {                
                RENDER_QUEUE.current.splice(x, 1);

                return vnode;
            }

        }
    }

    return new VNode(tag, normalizedProps, children);
}