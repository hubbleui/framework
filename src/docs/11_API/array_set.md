# array_set

---

Sets a value to array or object using `dot.notation`.

```JavaScript
array_set(String: path, Mixed: value, Object|Array: array): Void
```

Sets key/value an pair to any nested array or object via `dot.notation`. If parent items do not exist in the path, they are created.

---

*	[Access](#access)
*	[Parameters](#parameters)
*	[Return Values](#return-values)
*	[Examples](#examples)
*   [See Also](#see-also)

---

### Access

`array_set` can be accessed via Hubble's utility library

```JavaScript
Hubble._().array_set();

const [array_set] = Hubble.require(['array_set']).from('_');
```

---

### Parameters

| Property  | Var Type      | Description                                                | Required | Default  |
|-----------|---------------|------------------------------------------------------------|----------|----------|
| `path`    | `String`      | An Array or Object path key in `dot.notation`              | Yes      | N/A      |
| `value`   | `Mixed`       | The value to set.                                          | Yes      | N/A      |
| `array`   | `Object|Array`| The target Array or Object.                                | Yes      | N/A      |

Using dot notation follows the same syntax you would use to access any nested item in Array or Object.

The advantage is that for deeply nested Arrays and Objects, you don't need to create deeply nested items first if they do not exist.

---

### Return Values

**array_set** does not return a value.

---

### Examples

To set an array key, use the array index with brackets `[num]`. For Objects simply use the Object key and a dot `.key`:

```JavaScript
let array = [
    {foo: 'foo'},
    {bar: 'bar'}
];

/*
let array = [
    {foo: 'bar'},
    {bar: 'bar'}
];
*/
array_set('[0].foo', 'bar', array);
```

```JavaScript
let obj = {
    {foo: [1,2,3]},
    {bar: [4,5,6]}
};

/*
let obj = {
    {foo: [9,2,3]},
    {bar: [4,5,6]}
};
*/
array_set('foo[0]', 9, obj);
```

On nested nested Arrays/Objects if the path does not exist it will be created automatically.

```JavaScript
let obj = {
    foo: [
        { bar: { baz: [1, 2, 3] } }
    ]
};

/*
let obj = {
    foo: [
        { bar: { baz: [1, 9, 3], foo: [3] } }
    ]
};

*/
array_set('foo[1].bar.baz[1]', 9, obj);

array_set('foo[1].bar.foo[1]', 3, obj);
```

### See Also

*   [array_has](#../array_has/index.html) - Checks if an array or object has an path using **dot.notation**.
*   [array_delete](#../array_delete/index.html) - Deletes an item from an array or object using **dot.notation**.
*   [array_set](#../array_set/index.html) - Sets a value to array or object using **dot.notation**.
