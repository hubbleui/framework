export default function patchText(prevNode, nextNode)
{
    const el = (nextNode.__internals._el = prevNode.__internals._el)
  
    if (nextNode.text !== prevNode.text)
    {
        el.nodeValue = nextNode.text;
    }
}