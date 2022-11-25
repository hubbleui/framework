import mount        from '../mount';
import patch        from '../patch';
import VNode        from '../vdom';
import RENDER_QUEUE from './queue';

function render(vnode, parent)
{        
    vnode = ((typeof vnode === 'object') && vnode.constructor && vnode.constructor.name !== 'VNode') || (typeof vnode === 'function') ? new VNode(vnode, {}, []) : vnode;

    let prevNode = parent._vnode;

    if (!prevNode)
    {
        mount(vnode, parent);

        parent._vnode = vnode;
    }
    else
    {
        if (vnode)
        {            
            patch(prevNode, vnode, parent);

            parent._vnode = vnode;
        }
        else
        {
            parent.removeChild(prevNode.__internals._el);
        }
    }
}

export { RENDER_QUEUE, render };
export default render;