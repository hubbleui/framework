# Dom

Hubble's Dom module is used throughout the library to manage Dom components to both and unbind components that interact with the live HTML Dom.

---

*	[Access](#usage)
*	[Components](#components)
	*	[Instantiation](#instantiation)
*	[Events](#events)

---

### Access

Hubble Dom can be accessed globally via the Inversion container through the `dom` key.

```javascript
const dom = Hubble.Dom();
```

---

### Components

Hubble uses a specific syntax for DOM components. In Hubble a DOM component is a JavaScript Class or Object Function that when "mounted" binds listeners or alters the Live DOM. Hubble uses a base `Component` utility that should be extended to help build Components easily. 

> Dom components must contain a `bind` and `unbind` method which gets called by the base Component whenever Hubble's Dom is refreshed.

The base Component can be retrieved via the container:

```javascript
const [Component] = Hubble.get('Component');
```

In an extended component's `constructor` the `this.super` method should be called with a selector string, which constructs the base `Component` and queries any DOM selectors to `this._DOMElements`;

```javascript
const Buttons = function()
{
    this.super('.js-special-btns');

    // "_DOMElements" now contains all ".js-special-btns" nodes
    console.log(this._DOMElements);
};
```

Once `this.super` has been called and the Component has been constructed, the Component will loop through each node and call `bind` on the component

```javascript
Buttons.prototype.bind = function(node)
{
	Hubble._().add_event_listener('click', this._handler, this);
}
```

If Hubble's Dom gets refreshed or the module gets refreshed specifically, `unbind` will be called with each DOM element:

```javascript
Buttons.prototype.unbind = function(node)
{
	Hubble._().remove_event_listener('click', this._handler, this);
}
```

To register a Component in the Hubble Dom use the `register` method:

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
const [Component] = Hubble.get('Component');

const [add_event_listener, remove_event_listener, extend] = Hubble.import(['add_event_listener','remove_event_listener','extend']).from('_');

const Buttons = function()
{
    this.super('button');

    // "this._DOMElements" now contains all "<button>" nodes
    console.log(this._DOMElements);
}

Buttons.prototype.bind = function(node)
{
	add_event_listener('click', this._handler, this);
}

Buttons.prototype.unbind = function(node)
{
	remove_event_listener('click', this._handler, this);
}

Buttons.prototype._handler = function(e, node)
{
	console.log(this);

	console.log(e, node);
}

Hubble.Dom().register('Buttons', extend(Component, Buttons));
```

#### Instantiation

By default, Hubble DOM Components are instantiated by HTML. However most Components offer JavaScript Instantiation to generate content dynamically.

JavaScript Components can be instantiated either directly via the Component, or via Hubble's Dom with `Component.create` and will always return a DOMElement node.

```JavaScript
let dropdown = Hubble.Dom().component('Dropdown').create(options);

document.querySelector('div').appendChild(dropdown);
```

```JavaScript
let dropdown = Hubble.Dom().create('Dropdown', options);

document.querySelector('div').appendChild(dropdown);
```

Adding a second paramter to `Component.create` will append the returned DOMElement node to the target element

```JavaScript
Hubble.Dom().create('Dropdown', options, document.querySelector('.div'));
```


#### Dynamic Content

When creating your own component, if you want a Component use `Component.create` use the `template` method to return a DOM element. The method will receive an object of passed properties merged with `this.defaultProps` on the Component.


```javascript
const [Component] = Hubble.get('Component');

const [dom_element] = Hubble.import(['dom_element']).from('_');

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

Hubble.Dom().register('Buttons', extend(Component, Buttons));

const button = Hubble.Dom().create('Buttons', {text: 'Click me!'});
```

---

### Events

Hubble will dispatch various events when DOM components are interacted with or the Live DOM is updated. All Hubble events contain their data in `event.detail`.

| Event                            | Target element | Properties                              | Description                                                                           |
|----------------------------------|----------------|-----------------------------------------|---------------------------------------------------------------------------------------|
| `Hubble:dom:ready`               | `window`       | `e.detail.dom`                          | Fired immediately after Hubble Dom has booted and all Components are loaded.          |
| `Hubble:dom:refresh`             | `window`       | `e.detail.context`                      | Fired immediately after Hubble Dom has been refreshed and all Components are re-bound |
| `Hubble:dom:mutate`              | `DOMElement`   | `e.detail.DOMElement`                   | Fired immediately after content on live DOMElement node is mutated                    |
| `Hubble:dom:remove`              | `DOMElement`   | `e.detail.DOMElement`                   | Fired immediately after live DOMElement node is removed from the DOM                  |
| `Hubble:dom:bind:[component]`    | `window`       | `e.detail.component` `e.detail.context` | Fired immediately after a Dom Component is bound                                      |
| `Hubble:dom:unbind:[component]`  | `window`       | `e.detail.component` `e.detail.context` | Fired immediately after a Dom Component is unbound                                    |
| `Hubble:dom:refresh:[component]` | `window`       | `e.detail.component` `e.detail.context` | Fired immediately after a Dom Component is refreshed                                  |
