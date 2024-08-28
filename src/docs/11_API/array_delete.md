# array_delete

---

Deletes an item from an array or object using `dot.notation`.

```JavaScript
array_delete(String: path, Object|Array: array): Object|Array
```

Deletes an item from an array or object with `dot.notation` support and returns the original array or object. If the item does not exist, the Array or Object is unmodified.

---

*	[Access](#access)
*	[Parameters](#parameters)
*	[Return Values](#return-values)
*	[Examples](#examples)

---

### Access

`array_delete` can be accessed via Hubble's utility library

```JavaScript
Hubble._().array_delete();

const [array_delete] = Hubble.require(['array_delete']).from('_');
```

---

### Parameters

| Property  | Var Type      | Description                                                | Required | Default  |
|-----------|---------------|------------------------------------------------------------|----------|----------|
| `path`    | `String`      | An array or object path key                                | Yes      | N/A      |
| `array`   | `Object|Array`| An object containing CSS properties and animation options. | Yes      | N/A      |

Parameters can be provided a few different ways depending on the use-case for an animation.

Using dot notation follows the same syntax you would use to access any nested item in Array or Object.

The advantage here is that for deeply nested Arrays and Objects, you don't need to check if a nested item exists before removing it!

---

### Return Values

**array_delete** will always return the original supplied Array or Object with the item removed if it exists.

```JavaScript
let array = [ {foo: 'foo'} ];

// No need re-assign here as the original array is now modified.
array_delete('[0].foo', array);

````

---

### Examples

To access an array key, use the array index with brackets `[num]`, for Objects simply use the Object key and dot `.key`:

```JavaScript
let array = [
    {foo: 'foo'},
    {bar: 'bar'}
];

array_delete('[0].foo', array);
```

```JavaScript
let obj = {
    {foo: [1,2,3]},
    {bar: [4,5,6]}
};

array_delete('foo[0]', obj);
```

`array_delete` will work on deeply nested Arrays/Objects without having to run validation that the item exists first.

```JavaScript
let obj = {
    foo: [
        { bar: { baz: [1, 2, 3] } }
    ]
};

// Removes "2"
array_delete('foo[0].bar.baz[1]', obj);

// Does nothing
array_delete('foo[0].bar.baz[15]', obj);
```
