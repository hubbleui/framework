# Dom

FrontBx's Dom Component is used throughout the library to manage interactions with the live DOM.

---

*	[Access](#usage)
*	[Components](#components)
	*	[Lifecycle](#lifecycle)
	*	[Usage](#usage)	
	*	[Instantiation](#instantiation)

*	[Events](#events)

---

### Access

FrontBx's Dom Component can be accessed globally via the Inversion container through the `dom` key.

```javascript
const dom = FrontBx.Dom();
```

---

### Components

FrontBx uses a specific design pattern for DOM components. In FrontBx a DOM component is a JavaScript Class or Object Function that when "mounted" binds listeners or alters the Live DOM. FrontBx uses a base `Component` base that is extended to help build Components easily. 


#### Lifecycle

When FrontBx first loads, it caches all DOM Components in it's container until it's ready to boot. Once ready, it loops through all DOM Components, instantiates an instance of each once, which triggers them to `bind` any listeners or alter the live DOM.

Once the FrontBx's DOM has loaded, if the Live DOM is altered, mutated or updated in any way FrontBx's Dom can be "refreshed", which removes any redundant listeners on nodes that were removed and checks for any new elements that need binding.

#### Usage

The base Component can be retrieved via the container:

```javascript
const [Component] = FrontBx.get('Component');
```

In an extended component's `constructor`, `this.super` method should be called with a selector string, which constructs the base `Component` and queries any DOM selectors to `this._DOMElements`;

```javascript
const Buttons = function()
{
    this.super('.js-special-btns');

    // "this._DOMElements" now contains all ".js-special-btns" nodes
    console.log(this._DOMElements);
};
```

Once `this.super` has been called and the Component has been constructed, the Component will loop through each node and call `bind` on the component

```javascript
Buttons.prototype.bind = function(node)
{
	FrontBx._().on(node, 'click', this._handler, this);
}
```

If FrontBx's Dom gets refreshed or the module gets refreshed specifically, `unbind` will be called with each DOM element:

```javascript
Buttons.prototype.unbind = function(node)
{
	FrontBx._().off(node, 'click', this._handler, this);
}
```

> Dom components must contain a `bind` and `unbind` method which gets called by the base Component whenever FrontBx's Dom is refreshed.

To register a Component in the FrontBx Dom use the `register` method:

```javascript
dom.register('Buttons', Buttons);
```

Refreshing a Component can be used whenever the Live DOM is altered and you want to to re-bind Components. For example, when inserting content that contains HTML Components into the Live DOM.

To refresh a Component call the `refresh` method. Refreshing a component will call the `unbind` method on each `this._DOMElements` node of the Component. Once completed, the Component will re-select all nodes with the original selector to re-populate `this._DOMElements` and call `bind` on each element.

The design pattern is intended to increase browser performance by ensuring deprecated event listeners are removed correctly.

```javascript
dom.refresh('Buttons');
```

You can also refresh a Component to a specific context or element in the Live DOM:

```javascript
dom.refresh('Buttons', document.querySelector('.wrapper'));
```

Or refresh all Dom Components:

```javascript
dom.refresh();
```

Or refresh all Dom Components to a context element:

```javascript
dom.refresh(document.querySelector('.wrapper'));
```

Below is a simple example of a complete Dom Component that console logs click events on buttons:

```javascript
const [Component] = FrontBx.get('Component');

const [on, off, extend] = FrontBx.import(['on','off','extend']).from('_');

const Buttons = function()
{
    this.super('button');

    // "this._DOMElements" now contains all "<button>" nodes
    console.log(this._DOMElements);
}

Buttons.prototype.bind = function(node)
{
	on('click', this._handler, this);
}

Buttons.prototype.unbind = function(node)
{
	off('click', this._handler, this);
}

Buttons.prototype._handler = function(e, node)
{
	console.log(this);

	console.log(e, node);
}

FrontBx.Dom().register('Buttons', extend(Component, Buttons));
```

#### Instantiation

By default, FrontBx DOM Components are instantiated by HTML. However most Components offer JavaScript Instantiation to generate content dynamically.

JavaScript Components can be instantiated either directly via the Component, or via FrontBx's Dom with `Component.create` and will always return a DOMElement node.

```JavaScript
let dropdown = FrontBx.Dom().component('Dropdown').create(options);

document.querySelector('div').appendChild(dropdown);
```

```JavaScript
let dropdown = FrontBx.Dom().create('Dropdown', options);

document.querySelector('div').appendChild(dropdown);
```

Adding a second paramter to `Component.create` will append the returned DOMElement node to the target element

```JavaScript
FrontBx.Dom().create('Dropdown', options, document.querySelector('.div'));
```


#### Dynamic Content

When creating your own component, if you want a Component use `Component.create` use the `template` method to return a DOM element. The method will receive an object of passed properties merged with `this.defaultProps` on the Component.


```javascript
const [Component] = FrontBx.get('Component');

const [dom_element] = FrontBx.import(['dom_element']).from('_');

const Buttons = function()
{
    this.super();

    this.defaultProps = {
    	class: 'btn btn-primary',
    	text: 'Hello world!'
    }
}

Buttons.prototype.template = function(props)
{
	return dom_element({tag: 'button', class: props.class, innerText: props.text});
}

FrontBx.Dom().register('Buttons', extend(Component, Buttons));

const button = FrontBx.Dom().create('Buttons', {text: 'Click me!'});
```

---

### Events

FrontBx will dispatch various events when DOM components are interacted with or the Live DOM is updated. All FrontBx events contain their data in `event.detail`.

| Event                            | Target element | Properties                              | Description                                                                           |
|----------------------------------|----------------|-----------------------------------------|---------------------------------------------------------------------------------------|
| `FrontBx:dom:ready`               | `window`       | `e.detail.dom`                          | Fired immediately after FrontBx Dom has booted and all Components are loaded.          |
| `FrontBx:dom:refresh`             | `window`       | `e.detail.context`                      | Fired immediately after FrontBx Dom has been refreshed and all Components are re-bound |
| `FrontBx:dom:mutate`              | `DOMElement`   | `e.detail.DOMElement`                   | Fired immediately after content on live DOMElement node is mutated                    |
| `FrontBx:dom:remove`              | `DOMElement`   | `e.detail.DOMElement`                   | Fired immediately after live DOMElement node is removed from the DOM                  |
| `FrontBx:dom:bind:[component]`    | `window`       | `e.detail.component` `e.detail.context` | Fired immediately after a Dom Component is bound                                      |
| `FrontBx:dom:unbind:[component]`  | `window`       | `e.detail.component` `e.detail.context` | Fired immediately after a Dom Component is unbound                                    |
| `FrontBx:dom:refresh:[component]` | `window`       | `e.detail.component` `e.detail.context` | Fired immediately after a Dom Component is refreshed                                  |
