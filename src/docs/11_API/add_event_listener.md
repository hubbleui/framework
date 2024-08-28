# add_event_listener

---

Adds an event listener callback function to an element or 


```JavaScript
add_event_listener(HTMLElement|Array: element, string|Array: event, Function: callback, ?Array: args): Void
```
Adds a removable event listener callback function to an HTMLElement or Array of HTMLElements with provided arguments if provided.

For more information on event listeners see the [MDN Reference](#https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)

---

*	[Access](#access)
*	[Parameters](#parameters)
*	[Examples](#examples)

---

### Access

`add_event_listener` can be accessed via Hubble's utility library

```JavaScript
Hubble._().add_event_listener();

const [add_event_listener] = Hubble.require(['add_event_listener']).from('_');

```

---

### Parameters

| Property   | Var Type           | Description                                                       | Required | Default |
|------------|--------------------|-------------------------------------------------------------------|----------|---------|
| `element`  | `HTMLElement|Array`| The HTMLElement to or array of elements to add event listener to. | Yes      | N/A     |
| `event`    | `String`           | Any valid event name including custom events.                     | Yes      | N/A     |
| `callback` | `Function`         | A callable JavaScript function.                                   | Yes      | N/A     |
| `args`     | `Array`            | Optional list of arguements to provide to the callback function.  | No       | N/A     |


<div class="api-table"></div>
| `add_event_listener(element, event, callback, args)`                                                        |
|----------------------------------------------------------------------------------------------------------------|
| **Description:** Adds a removable event listener callback function to an element or array of elements.                          |
| **element** <br> **Type:** `HTMLElement|Array` <br> The HTMLElement to or array of elements to add event listener to.  |
| **event** <br> **Type:** `String` <br> The event or a comma-separated list of events to add the listener to.        |
| **callback** <br> **Type:** `Function` <br> A callback function to be called when event is triggered.          |
| **args** <br> **Type:** `?HTMLElement` <br> An optional array of arguments to apply to the callback function. <br><br> The callback function will always receive the **Event Object** as the first argument and the **HTMLElement** as the second argument. When no **args** value is provided `this` on the callback will be the **HTMLElement** which is the default browser behavior for `addEventListener`.<br><br>When **args** is provided `this` will become the first suplied value in **args**, any other subsequent values will be applied to callback after the **Event Object** and **HTMLElement**. <br><br>When a single boolean is provided as **args** this indicates whether to push the event listener to the front of the callback stack on the element, making it get called before all other callbacks when set to `true`  |
| **Example:** <br> <span class="big-code">`add_event_listener(button, 'click', (e) => console.log(e))`</span>  |

---

### Examples

Adds an event listener to a button element that console logs it has been clicked:

```JavaScript
add_event_listener(button, 'click', () => console.log('clicked!'));
```

Adds an event listener to a button element that console logs when it has been clicked or hovered:
```JavaScript
add_event_listener(button, 'click, mouseenter', (e) => console.log(e.type));
```

Passes "this" context to the proved callback:
```JavaScript
let _this = 'Foobar!';

add_event_listener(button, 'click, mouseenter', (e, element) => console.log(this), _this);
```

Passes a "this" and extra arguments to the provided callback:

```JavaScript
let _this = 'Foobar!';

let args = [1, 2, 3];

add_event_listener(button, 'click', (e, element, one, two, three) => console.log(this, arguments), [_this, ...args]);
```