import patch from '.';
import {mountComponent} from '../mount';

export default function patchComponent(prevNode, nextNode, parent)
{
    // Patch one component with another

    // @todo fragment / no return

    // unmount old compoonent & remove listeners etc..
    /// unmount (prevNode)

    if (prevNode === nextNode)
    {
        return;
    }
    else
    {
        console.log(prevNode);
    }
}