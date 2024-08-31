# array_filter

---

Filters out empty items from an array or object and returns a new Array or Object.

```JavaScript
array_filter(Object|Array: array): Object|Array
```

`array_filter` does not modify the original Array or Object, rather it will filter out empty items and return a new Object or Array. 

[is_empty](../is_empty/index.html) is used to filter items, which defines following as "empty":

*   Empty strings that equal `''` or empty whitespace strings.
*   Empty Nested arrays or Objects.
*   `undefined`, `false`, `null`

---

*	[Access](#access)
*	[Parameters](#parameters)
*	[Return Values](#return-values)
*	[Examples](#examples)

---

### Access

`array_filter` can be accessed via FrontBx's utility library

```JavaScript
FrontBx._().array_filter();

const [array_filter] = FrontBx.require(['array_filter']).from('_');
```

---

### Parameters

| Property  | Var Type      | Description                 | Required | Default  |
|-----------|---------------|-----------------------------|----------|----------|
| `array`   | `Object|Array`| The target Array or Object. | Yes      | N/A      |

Using dot notation follows the same syntax you would use to access any nested item in Array or Object.

The advantage here is that for deeply nested Arrays and Objects, you don't need to check if a nested item exists before removing it!

---

### Return Values

**array_filter** will always return a copy of supplied Array or Object with empty items removed. It will not modify the original array.

```JavaScript
let array = [0, 1, 2, null, undefined, 3, 4, '', 5];

// [0, 1, 2, 3, 4, 5]
array = array_filter(array);
````

---

### Examples

To access an array key, use the array index with brackets `[num]`, for Objects simply use the Object key and dot `.key`:

```JavaScript
let array = [0, 1, 2, null, undefined, 3, 4, '', [], 5, {}, 6];

// [0, 1, 2, 3, 4, 5, 6]
array = array_filter(array);
```
