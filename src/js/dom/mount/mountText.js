export default function mountText(vnode, parent)
{
    const el = document.createTextNode(vnode.text);
    
    vnode.__internals._el = el;
    
    parent.appendChild(el);
}