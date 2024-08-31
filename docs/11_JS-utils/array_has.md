# array_has

---

Checks if an item from an array or object exists using `dot.notation`.

```JavaScript
array_has(String: path, Object|Array: array): Object|Array
```

Checks for an item from an array or object via `dot.notation` and returns a boolean.

---

*	[Access](#access)
*	[Parameters](#parameters)
*	[Return Values](#return-values)
*	[Examples](#examples)
*   [See Also](#see-also)

---

### Access

`array_has` can be accessed via FrontBx's utility library

```JavaScript
FrontBx._().array_has();

const [array_has] = FrontBx.require(['array_has']).from('_');
```

---

### Parameters

| Property  | Var Type      | Description                                                | Required | Default  |
|-----------|---------------|------------------------------------------------------------|----------|----------|
| `path`    | `String`      | An Array or Object path key in `dot.notation`              | Yes      | N/A      |
| `array`   | `Object|Array`| The target Array or Object.                                | Yes      | N/A      |

Using dot notation follows the same syntax you would use to access any nested item in Array or Object.

The advantage is that for deeply nested Arrays and Objects, you don't need to check if they exist first.

---

### Return Values

**array_has** will return `true` if the item exists or `false` if it does not.


```JavaScript
let array = [ {foo: 'foo'} ];

// true
array_has('[0].foo', array);
````

---

### Examples

To check for an array key, use the array index with brackets `[num]`. For Objects simply use the Object key and a dot `.key`:

```JavaScript
let array = [
    {foo: 'foo'},
    {bar: 'bar'}
];

// true
array_has('[0].foo', array);

// false
array_has('[0].foo', obj);
```

```JavaScript
let obj = {
    foo: [1,2,3]],
    bar: [3,4,5]],
};

// true
array_has('foo[0]', obj);

// false
array_has('foo[3]', obj);
```

`array_has` will work on deeply nested Arrays/Objects without having to run validation that parent items exist first.

```JavaScript
let obj = {
    foo: [
        { bar: { baz: [1, 2, 3] } }
    ]
};

// true
array_has('foo[0].bar.baz[1]', obj);

//false
array_has('foo[0].bar.baz[15]', obj);
```

### See Also

*   [array_get](#../array_get/index.html) - Returns an item from an array or object using **dot.notation**.
*   [array_delete](#../array_delete/index.html) - Deletes an item from an array or object using **dot.notation**.
*   [array_set](#../array_set/index.html) - Sets a value to array or object using **dot.notation**.
