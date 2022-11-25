import patchChildren from './patchChildren';
import patchData from './patchData';
import replaceNode from './replaceNode';

export default function patchElement(prevNode, nextNode, parent)
{
    if (prevNode.tag !== nextNode.tag)
    {
        replaceNode(prevNode, nextNode, parent);
        
        return;
    }

    const el = (nextNode.__internals._el = prevNode.__internals._el);
    
    let prevData = prevNode.props;
    let nextData = nextNode.props;

    if (nextData)
    {
        for (let key of Object.keys(nextData))
        {
            let prevValue = prevData[key];
            let nextValue = nextData[key];
            
            patchData(el, key, prevValue, nextValue)
        }
    }

    if (prevData)
    {
        for (let key of Object.keys(prevData))
        {
            if (!nextData.hasOwnProperty(key))
            {
                patchData(el, key, prevData[key], null);
            }
        }
    }

    let prevChildren = prevNode.props.children;
    let nextChildren = nextNode.props.children;
    let prevChildFlag = prevNode.__internals._childFlag;
    let nextChildFlag = nextNode.__internals._childFlag;

    patchChildren(prevChildren, prevChildFlag, nextChildren, nextChildFlag, el);
}