# array_get

---

Returns an item from an array or object using `dot.notation`.

```JavaScript
array_get(String: path, Object|Array: array): Object|Array
```

Returns an item from an array or object via `dot.notation`. If the item does not exist `undefined` is returned.

---

*	[Access](#access)
*	[Parameters](#parameters)
*	[Return Values](#return-values)
*	[Examples](#examples)
*   [See Also](#see-also)

---

### Access

`array_get` can be accessed via FrontBx's utility library

```JavaScript
FrontBx._().array_get();

const [array_get] = FrontBx.require(['array_get']).from('_');
```

---

### Parameters

| Property  | Var Type      | Description                                                | Required | Default  |
|-----------|---------------|------------------------------------------------------------|----------|----------|
| `path`    | `String`      | An Array or Object path key in `dot.notation`              | Yes      | N/A      |
| `array`   | `Object|Array`| The target Array or Object.                                | Yes      | N/A      |

Using dot notation follows the same syntax you would use to access any nested item in Array or Object.

The advantage is that for deeply nested Arrays and Objects, you don't need to check if a nested item exists to assign it to a variable.

---

### Return Values

**array_get** will return the item indexed by the path or `undefined` if it does not exist.

```JavaScript
let array = [ {foo: 'foo'} ];

let foo = array_get('[0].foo', array);
````

---

### Examples

To access an array key, use the array index with brackets `[num]`. For Objects simply use the Object key and a dot `.key`:

```JavaScript
let array = [
    {foo: 'foo'},
    {bar: 'bar'}
];

let foo = array_get('[0].foo', array);
```

```JavaScript
let obj = {
    {foo: [1,2,3]},
    {bar: [4,5,6]}
};

let one = array_get('foo[0]', obj);
```

`array_get` will work on deeply nested Arrays/Objects without having to run validation that the item exists first.

```JavaScript
let obj = {
    foo: [
        { bar: { baz: [1, 2, 3] } }
    ]
};

// Returns "2"
let two = array_get('foo[0].bar.baz[1]', obj);

// Returns undefined
let undef = array_get('foo[0].bar.baz[15]', obj);
```

### See Also

*   [array_has](#../array_has/index.html) - Checks if an array or object has an path using **dot.notation**.
*   [array_delete](#../array_delete/index.html) - Deletes an item from an array or object using **dot.notation**.
*   [array_set](#../array_set/index.html) - Sets a value to array or object using **dot.notation**.
