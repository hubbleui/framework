import { NODE_FLAG, CHILD_FLAG } from './flag';
import _ from '../utils';

const TEXT_TYPES = ['boolean', 'number', 'string', 'undefined'];

export default class VNode
{
    constructor(type, props, children)
    {        
        children = normaliseChildren(children);

        this.$$typof = _.is_callable(type) ? NODE_FLAG.COMPONENT : (type === undefined ? NODE_FLAG.TEXT : NODE_FLAG.ELEMENT);
        this.key     = null;
        this.props   = props || { children: children };
        this.ref     = null;
        this.type    = type;

        if (props && props.key)
        {
            this.key = props.key;
        }

        const vnode = this;
        
        const makeChildFlag = function(children)
        {
            children = typeof children === 'undefined' ? vnode.props.children : children;

            if (vnode.flag === NODE_FLAG.COMPONENT)
            {
                vnode.__internals._childFlag = CHILD_FLAG.SINGLE_CHILD;
            }
            else
            {
                if (_.is_array(children))
                {
                    if (children.length === 0)
                    {
                        vnode.__internals._childFlag = CHILD_FLAG.NO_CHILD;
                    }
                    else if (children.length === 1)
                    {
                        vnode.__internals._childFlag = CHILD_FLAG.SINGLE_CHILD;
                        vnode.props.children = children[0];
                    }
                    else
                    {
                        vnode.__internals._childFlag = CHILD_FLAG.KEY_CHILD;
                        vnode.props.children = children;
                    }
                }
                else if (children == null)
                {
                    vnode.__internals._childFlag = CHILD_FLAG.NO_CHILD
                }
                else if (typeof children.$$typof !== 'undefined')
                {
                    vnode.__internals._childFlag = CHILD_FLAG.SINGLE_CHILD
                    vnode.props.children = children
                }
                else
                {                
                    // treat all as text
                    vnode.__internals._childFlag = CHILD_FLAG.SINGLE_CHILD
                    vnode.props.children  = createTextVNode(children);
                }
            }
        }

        this.__internals = 
        {
            _el: null,
            _component: null,
            _childFlag: 1,
            _makeChildFlag: makeChildFlag,
        };

        makeChildFlag(children);
    }
}

function createTextVNode(text, key)
{    
    return {
        $$typof: NODE_FLAG.TEXT,
        type: null,
        props: null,
        text : text + '',
        key: key,
        __internals :
        {
            _el: null,
            _component: null,
            _childFlag: 2,
        }
   };
}

function normaliseChildren(children, offset)
{    
    offset = typeof offset === 'undefined' ? 0 : offset;

    var ret = [];

    if (_.is_array(children))
    {
        _.foreach(children, function(i, child)
        {
            const type = typeof child;
            const keyIndex = '|' + (offset + i);

            if (child && child.$$typof)
            {
                if (!child.key)
                {
                    child.key = keyIndex;
                }

                ret.push(child);
            }
            else if (TEXT_TYPES.includes(type))
            {        
                ret.push(createTextVNode(child, keyIndex));
            }
            else if (_.is_array(child))
            {                
                child = normaliseChildren(child, ret.length);
                
                ret = [...ret, ...child];
            }
        });
    }
    
    return ret;
}