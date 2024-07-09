# Lists

---

Hubble lists allow you to to display a continuous group of text or images quickly with very little markup. Because HTML lists are used frequently across third-party libraries and plugins, Hubble lists are styled with the `.list` base class.

---

*   [Basic example](#basic-example)
*   [List contents](#list-contents)
*   [Selected lists](#selected-lists)

---

### Basic example
Simply add the `.list` class to a `<ul>`

Below is an example of a basic media block.

<div class="code-content-example">
    <div class="container-fuid" style="max-width: 450px">
        <div class="card flat">
            <ul class="list">
                <li>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                    </span>
                </li>
                <li>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                    </span>
                </li>
                <li>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</div>

---

### List contents

List items hold 3 elements `.item-left`, `.item-body` and `.item-right`. They align as you would expect: 

<div class="code-content-example">
    <div class="container-fuid" style="max-width: 450px">
        <div class="card flat">
            <ul class="list">
                <li>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                    </span>
                    <span class="item-right">
                        <button class="btn btn-pure btn-sm btn-circle">
                            <span class="glyph-icon glyph-icon-phone"></span>
                        </button>
                    </span>
                </li>
                <li>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                        <div class="item-subtitle">Secondary text</div>
                    </span>
                    <span class="item-right">
                        <button class="btn btn-pure btn-sm btn-circle">
                            <span class="glyph-icon glyph-icon-phone"></span>
                        </button>
                    </span>
                </li>
                <li>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                        <div class="item-subtitle">Secondary text</div>
                    </span>
                    <span class="item-right">
                        <button class="btn btn-pure btn-sm btn-circle">
                            <span class="glyph-icon glyph-icon-phone"></span>
                        </button>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</div>

<div class="code-content-example">
    <div class="container-fuid" style="max-width: 450px">
        <div class="card flat">
            <ul class="list">
                <li>
                    <span class="item-left">
                        <span class="glyph-icon glyph-icon-heart"></span>
                    </span>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                    </span>
                    <span class="item-right">
                        <button class="btn btn-pure btn-sm btn-circle">
                            <span class="glyph-icon glyph-icon-phone"></span>
                        </button>
                    </span>
                </li>
                <li>
                    <span class="item-left">
                        <span class="glyph-icon glyph-icon-heart"></span>
                    </span>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                        <div class="item-subtitle">Secondary text</div>
                    </span>
                    <span class="item-right">
                        <div class="form-field">
                            <span class="checkbox">
                                <input type="checkbox" name="input_1" id="input_1" checked="true">
                                <label for="input_1"></label>
                            </span>
                        </div>
                    </span>
                </li>
                <li>
                    <span class="item-left">
                        <span class="glyph-icon glyph-icon-heart"></span>
                    </span>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                        <div class="item-subtitle">Secondary text</div>
                    </span>
                    <span class="item-right">
                        <button class="btn btn-pure btn-sm btn-circle">
                            <span class="glyph-icon glyph-icon-phone"></span>
                        </button>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</div>

--- 

### Selected lists

Add the `.js-select-list` class to any list to enable clickable selection.

<div class="code-content-example">
    <div class="container-fuid" style="max-width: 450px">
        <div class="card flat">
            <ul class="list js-select-list">
                <li class="selected">
                    <span class="item-left">
                        <span class="glyph-icon glyph-icon-heart"></span>
                    </span>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                    </span>
                    <span class="item-right">
                        <button class="btn btn-pure btn-sm btn-circle">
                            <span class="glyph-icon glyph-icon-phone"></span>
                        </button>
                    </span>
                </li>
                <li>
                    <span class="item-left">
                        <span class="glyph-icon glyph-icon-heart"></span>
                    </span>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                        <div class="item-subtitle">Secondary text</div>
                    </span>
                    <span class="item-right">
                        <div class="form-field">
                            <span class="checkbox">
                                <input type="checkbox" name="input_2" id="input_2" checked="true">
                                <label for="input_2"></label>
                            </span>
                        </div>
                    </span>
                </li>
                <li>
                    <span class="item-left">
                        <span class="glyph-icon glyph-icon-heart"></span>
                    </span>
                    <span class="item-body">
                        <div class="item-title">List Item</div>
                        <div class="item-subtitle">Secondary text</div>
                    </span>
                    <span class="item-right">
                        <button class="btn btn-pure btn-sm btn-circle">
                            <span class="glyph-icon glyph-icon-phone"></span>
                        </button>
                    </span>
                </li>
            </ul>
        </div>
    </div>
</div>

Hubble will fire a custom event on the list when an item is selected. The `event.detail.item` key will tell you which item has been selected

| Event              | Description                                          | 
|--------------------|------------------------------------------------------|
| `list:selected`    | Fired immediately when an item is selected in a list |


```javascript

const list = document.getElementById('my-list')

list.addEventListener('list:selected', event => 
{
    const item = event.detail.item;

    // Do something here  
})
```



