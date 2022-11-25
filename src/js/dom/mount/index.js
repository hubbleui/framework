import { NODE_FLAG }  from '../vdom';
import mountElement   from './mountElement';
import mountText      from './mountText';
import mountComponent from './mountComponent';

export { mountElement, mountText, mountComponent };

export default function mount(vnode, parent, refNode)
{
    const {$$typof} = vnode;

    if ($$typof === NODE_FLAG.ELEMENT)
    {
        mountElement(vnode, parent, refNode)
    }
    else if ($$typof === NODE_FLAG.COMPONENT)
    {
        mountComponent(vnode, parent, refNode)
    }
    else if ($$typof === NODE_FLAG.TEXT)
    {
        mountText(vnode, parent, refNode)
    }
    else
    {
        throw new Error('Unknown child node.')
    }
}