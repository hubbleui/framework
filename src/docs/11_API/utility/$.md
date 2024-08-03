# $

---

Selects a single HTMLElement by selector.


```JavaScript
$(String: selector, ?HTMLElement: context = document): HTMLElement?Undefined
```
Selects and returns an HTMLElement using any valid CSS selector under a given context element if provided. If the selector did not match an element `undefined` is returned.

> The alias function `find` can also be use which does the same thing.

For more information on CSS Selectors see the [MDN Reference](#https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)

---

*	[Access](#access)
*	[Parameters](#parameters)
*	[Examples](#examples)

---

### Access

`$` can be accessed via Hubble's utility library

```JavaScript
Hubble._().$();

const [$] = Hubble.require(['$']).from('_');

```

---

### Parameters

| Property    | Var Type            | Description                                           | Required | Default   |
|-------------|---------------------|-------------------------------------------------------|----------|-----------|
| `selector`  | `String`            | A valid CSS selector provided as a string.            | Yes      | N/A       |
| `context`   | `?HTMLElement`      | A context element to select children from if provided.| No       | `document`|


<div class="api-table"></div>
| `$(selector, context)`                                                                                         |
|----------------------------------------------------------------------------------------------------------------|
| **Description:** Selects and returns first matching element by selector if it exists.                          |
| **selector** <br> **Type:** `String` <br> A valid CSS selector to match elements with.                         |
| **context** <br> **Type:** `?HTMLElement` <br> A context element to select children from if provided.          |
| **Example:** <br> <span class="big-code">`$('div')`</span>                                                     |

---

### Examples

Selects first available `<div>` element:

```JavaScript
let div = $('div');
```

Selects first available `<div>` element with the `red` classname:

```JavaScript
let div = $('div.red');
```

Selects element with the `happy` id:

```JavaScript
let div = $('#red');
```

Selects first `<li>` element that's child of `<ul>`:

```JavaScript
let div = $('ul > li');
```