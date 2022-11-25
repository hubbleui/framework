import patch from '.';
import diff  from '../diff';
import mount from '../mount';
import { CHILD_FLAG } from '../vdom';

export default function patchChildren(prevChildren, prevChildFlag, nextChildren, nextChildFlag, parent)
{  
    switch (prevChildFlag)
    {
        // The old children is a single child node, the case statement block will be executed
        case CHILD_FLAG.SINGLE_CHILD:
            
            switch (nextChildFlag)
            {
                case CHILD_FLAG.SINGLE_CHILD:
                    // When the new children is also a single child node, the case statement block will be executed
                    patch(prevChildren, nextChildren, parent)

                    break
                case CHILD_FLAG.NO_CHILD:
                    // When there are no child nodes in the new children, the case statement block will be executed
                    parent.removeChild(prevChildren.__internals._el)

                    break
                default:
                    // When there are multiple child nodes in the new children, the case statement block will be executed
                    parent.removeChild(prevChildren.__internals._el)
                    for (let child of nextChildren)
                    {
                        mount(child, parent)
                    }

                    break
                }

            break
        
        // When there are no child nodes in the old children, the case statement block will be executed
        case CHILD_FLAG.NO_CHILD:
            switch (nextChildFlag)
            {
            case CHILD_FLAG.SINGLE_CHILD:
                // When the new children is a single child node, the case statement block will be executed
                mount(nextChildren, parent)

                break
            case CHILD_FLAG.NO_CHILD:
                // When there are no child nodes in the new children, the case statement block will be executed
                break
            default:
                // When there are multiple child nodes in the new children, the case statement block will be executed
                for (const child of nextChildren)
                {
                    mount(child, parent)
                }

                break
            }
            break
        // When there are multiple child nodes in the old children, the case statement block will be executed
        default:
            switch (nextChildFlag)
            {
            case CHILD_FLAG.SINGLE_CHILD:
                
                // When the new children is a single child node, the case statement block will be executed
                for (const child of prevChildren)
                {
                    parent.removeChild(child.__internals._el)
                }
                mount(nextChildren, parent)

                break
            case CHILD_FLAG.NO_CHILD:
                
                // When there are no child nodes in the new children, the case statement block will be executed
                for (const child of prevChildren)
                {
                    parent.removeChild(child.__internals._el)
                }

                break
            default:
                
                // When there are multiple child nodes in the new children, the case statement block will be executed
                // key diff algorithm
                diff(prevChildren, nextChildren, parent)
                break
            }
            break
        }
} 