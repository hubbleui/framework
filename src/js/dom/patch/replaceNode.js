import mount from '../mount';

export default function replaceNode(prevNode, nextNode, parent)
{
    // Node types are different or one is a component

    // @todo framgent / no child
    if (prevNode._component)
    {
        // unmount remove listeners etc...
        parent.innerHTML = '';
    }
    else if (prevNode.__internals._el)
    {
        parent.removeChild(prevNode.__internals._el)
    }
    
    mount(nextNode, parent);
}