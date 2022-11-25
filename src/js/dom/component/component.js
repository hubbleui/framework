import { RENDER_QUEUE } from '../render';
import { NODE_FLAG }  from '../vdom';
import parseJSX         from '../jsx';
import patch            from '../patch';
import _ from '../utils';

export function attachChildren(component)
{
    const jsx = jsxFactory(component);
    
    component.props.children = [jsx];
}

function renderContext(component)
{
    const exclude = ['constructor', 'render'];
    const funcs   = Object.getOwnPropertyNames(Object.getPrototypeOf(component));
    const props   = Object.keys(component);
    const keys    = [...funcs, ...props];
    let   ret     = {};

    for (var i = 0; i < keys.length; i++)
    {
        const key = keys[i];

        if (!exclude.includes(key))
        {
            ret[key] = component[key];
        }
    }

    return ret;
}

function jsxFactory(component)
{    
    const render = component.render();

    if (render.trim() === '')
    {
        return [];
    }

    const context = renderContext(component);

    return parseJSX(render, {...context, this: component });
}

function reRender(component)
{    
    // @todo / fragemnt / no children
    const prevRender  = component.props.children[0];
    const parentNode  = prevRender.__internals._el.parentNode;
    
    RENDER_QUEUE.current = [];

    _.foreach(prevRender.props.children, function(i, vnode)
    {
        if (vnode.$$typof === NODE_FLAG.COMPONENT)
        {
            RENDER_QUEUE.current.push(vnode);
        }
    });

    const newRender = jsxFactory(component);

    patch(prevRender, newRender, parentNode);
}

/**
 * Base component
 * 
 * @class
 */
export class Component
{
    /**
     * Context.
     *
     * @var {object}
     */
    context = {};

    /**
     * props.
     *
     * @var {object}
     */
    props = {};

    /**
     * Reference to DOM node.
     *
     * @var {object}
     */
    refs = {};

    /**
     * State obj
     *
     * @var {object}
     */
    state = {};

    /**
     * Default props.
     *
     * @var {object}
     */
    defaultProps = {};

    /**
     * Constructor
     *
     */
    constructor(props)
    {
        // If there is only a single arguement here
        // it means the component was constructed using
        // super(props)

        // Which means the extended class must have a render function
        this.props = !_.is_object(props) ? {} : props;

        this.internals = {

        };
    }

    static getDerivedStateFromProps()
    {

    }

    componentDidMount()
    {
    }

    componentWillUnmount()
    {
    }

    componentWillReceiveProps(nextProps)
    {
    }

    getSnapshotBeforeUpdate(prevProps, prevState)
    {
    }

    shouldComponentUpdate(nextProps, nextState)
    {
        return true;
    }

    componentWillUpdate(changedProps, changedState)
    {

    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
    }

    componentDidCatch()
    {
    }
    
    setState(key, value)
    {
        let newState  = {};

        if (arguments.length === 1)
        {
            if (!_.is_object(key))
            {
                throw new Error('State must be an object.');
            }

            newState = key;
        }
        else
        {
            newState[key] = value;
        }

        newState = _.dotify(newState);

        if (_.is_callable(this.componentWillUpdate))
        {
            this.componentWillUpdate(this.props, newState);
        }

        _.foreach(newState, function(key, value)
        {
            _.array_set(key, value, this.state);
            
        }, this);

        // @todo no children / fragment / recursive components
        reRender(this);
    }

    getState(key)
    {
        return array_get(key, this.state);
    }

    jsx(jsx)
    {
        const context = renderContext(this);

        return parseJSX(jsx, {...context, this: this});
    }
}

export default Component;