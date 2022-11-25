import { CHILD_FLAG } from '../vdom';
import { patchData } from '../patch'
import mount from './index.js'

export default function mountElement(vnode, parent, refNode)
{
    const childFlag = vnode.__internals._childFlag;
    const el = document.createElement(vnode.type);

    vnode.__internals._el = el;

    if (vnode.props)
    {
        for (let key of Object.keys(vnode.props))
        {
            patchData(el, key, null, vnode.props[key])
        }
    }

    if (childFlag !== CHILD_FLAG.NO_CHILD)
    {
        if (childFlag & CHILD_FLAG.SINGLE_CHILD)
        {
            mount(vnode.props.children, el)
        }
        else if (childFlag & CHILD_FLAG.MULTI_CHILD)
        {
            for (let child of vnode.props.children)
            {
                mount(child, el)
            }
        }
    }

    refNode ? parent.insertBefore(el, refNode) : parent.appendChild(el);
}