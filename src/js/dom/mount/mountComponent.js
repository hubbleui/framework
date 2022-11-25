import mount from '.';
import {patchData} from '../patch';
import { attachChildren }from '../component';

export default function mountComponent(vnode, parent, refNode)
{    
    // @todo fragment / no children
    if (vnode.__internals._component)
    {
        const child = vnode.__internals._component.props.children[0];

        mount(child, parent, refNode);
    }
    else
    {
        const component = new (vnode.type)(vnode.props);

        attachChildren(component);

        vnode.__internals._component = component;

        // Todo fragment / no children
        const child = component.props.children[0];

        mount(child, parent, refNode);
    }
}