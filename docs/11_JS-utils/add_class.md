# add_class

---

Adds a class or multiple classes to a single or multiple HTMLElements.

```JavaScript
add_class(HTMLElement|Array: element, String|Array: className): Void
```
Adds provided classname(s) to provided HTMLElement(s). `element` can be provided as an individual HTMLElement or array of HTMLElements. `className` can be provided as both a String or Array.

---

*	[Access](#access)
*   [Parameters](#parameters)
*	[Examples](#examples)

---

### Access

`add_class` can be accessed via FrontBx's utility library

```JavaScript
FrontBx._().add_class();

const [add_class] = FrontBx.require(['add_class']).from('_');

```

---

### Parameters

| Property    | Var Type            | Description                                                                                                                                 | Required | Default |
|-------------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------|----------|---------|
| `element`   | `HTMLElement|Array` | The target HTMLElement or an array of HTMLElements to add class to.                                                                         | Yes      | N/A     |
| `className` | `String|Array`      | The String class name to add to the element or an array of class names. Multiple classes can also be provided a string separated by commas. | Yes      | N/A     |


Parameters can be provided a few different ways depending on the use-case.

<div class="api-table"></div>
| `add_class(element, className)`                                                                                                              |
|----------------------------------------------------------------------------------------------------------------------------------------------|
| **Description:** Add single or multiple classnames to an element or elements.                                                                |
| **element** <br> **Type:** `HTMLElement|Array` <br> The target DOM element or Array of elements to add the class to.                         |
| **className** <br> **Type:** `String|Array` <br> Class name to add as string or comma separeted list of class names. Or Array of class names.|
| **Example:** <br> <span class="big-code">`add_class(node, 'foo') `</span>                                                                    |

---

### Examples

Add the `red` class to a single `<p>` element:

```JavaScript
add_class($('p'), 'red');
```

Add the `red` and `big` class to a single `<p>` element:

```JavaScript
add_class($('p'), 'red, big');
```

Add the `red` and `big` class to all `<p>` elements:

```JavaScript
add_class($All('p'), 'red, big');
```

Add the `red` and `big` class to all `<p>` elements:

```JavaScript
add_class($All('p'), ['red', 'big']);
```