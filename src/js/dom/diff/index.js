import mount from '../mount';
import patch from '../patch';

/**
 * Diff Vndoes
 * 
 * @param [{Array}|{null}]  prevChildren  Previous children
 * @param [{Array}|{null}]  nextChildren  Next children
 * @param {htmlElement}     parent        Parent node
 */
export default function diff(prevChildren, nextChildren, parent)
{    
    let prevIndexMap = {};
    let nextIndexMap = {};
    
    for (let i = 0; i < prevChildren.length; i++)
    {
        let { key } = prevChildren[i];

        prevIndexMap[key] = i;
    }

    let lastIndex = 0;
    
    for (let i = 0; i < nextChildren.length; i++)
    {
        let nextChild = nextChildren[i];
        let nextKey   = nextChild.key;
        let j         = prevIndexMap[nextKey];

        nextIndexMap[nextKey] = i;

        if (j === undefined)
        {
            let refNode = i === 0 ? prevChildren[0].__internals._el : nextChildren[i - 1].__internals._el.nextSibling;

            mount(nextChild, parent, refNode)
        }
        else
        {
            patch(prevChildren[j], nextChild, parent)
            
            if (j < lastIndex)
            {
                let refNode = nextChildren[i - 1].__internals._el.nextSibling;
                
                parent.insertBefore(nextChild.__internals._el, refNode);
            }
            else
            {
                lastIndex = j;
            }
        }
    }

    for (let i = 0; i < prevChildren.length; i++)
    {
        let { key } = prevChildren[i];

        if (!nextIndexMap.hasOwnProperty(key))
        {
            parent.removeChild(prevChildren[i].__internals._el)
        }
    }
}