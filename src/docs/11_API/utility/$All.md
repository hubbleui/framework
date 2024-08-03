# $All

---

Selects all HTMLElements by selector.


```JavaScript
$All(String: selector, ?HTMLElement: context = document): Array
```
Selects and returns an Array of HTMLElements using any valid CSS selector under a given context element if provided. If the selector did not match an element an empty Array will be returned.

> The alias function `find_all` can also be use which does the same thing.

For more information on CSS Selectors see the [MDN Reference](#https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors)

---

*	[Access](#access)
*	[Parameters](#parameters)
*	[Examples](#examples)

---

### Access

`$All` can be accessed via Hubble's utility library

```JavaScript
Hubble._().$All();

const [$All] = Hubble.require(['$All']).from('_');

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
| **Description:** Selects and returns all matching elements by selector.                                        |
| **selector** <br> **Type:** `String` <br> A valid CSS selector to match elements with.                         |
| **context** <br> **Type:** `?HTMLElement` <br> A context element to select children from if provided.          |
| **Example:** <br> <span class="big-code">`$All('div')`</span>                                                  |

---

### Examples

Selects all available `<div>` elements:

```JavaScript
let div = $All('div');
```

Selects all available `<div>` element with the `red` classname:

```JavaScript
let div = $All('div.red');
```

Selects all `<li>` element that are direct children of `<ul>`:

```JavaScript
let div = $('ul > li');
```