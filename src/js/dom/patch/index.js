import { NODE_FLAG }  from '../vdom';
import patchChildren  from './patchChildren';
import patchComponent from './patchComponent';
import patchData      from './patchData';
import patchElement   from './patchElement';
import patchText      from './patchText';
import replaceNode    from './replaceNode';

export { patchChildren, patchComponent, patchData, patchElement, patchText, replaceNode};

export default function patch(prevNode, nextNode, parent)
{
    if (prevNode.$$typof !== nextNode.$$typof)
    {
        //console.log('replacing');

        replaceNode(prevNode, nextNode, parent)
    }
    else if (nextNode.$$typof === NODE_FLAG.ELEMENT)
    {
        //console.log('patching el');

        patchElement(prevNode, nextNode, parent)
    }
    else if (nextNode.$$typof === NODE_FLAG.TEXT)
    {
        //console.log('patching text');

        patchText(prevNode, nextNode)
    }
    else if (nextNode.$$typof === NODE_FLAG.COMPONENT)
    {
        //console.log('patch COMPONENT');

        patchComponent(prevNode, nextNode, parent);
    }
    else
    {
        console.log('Unknown patch');
    }
}