# Lists

---

FrontBx lists allow you to to display a continuous group of text or images quickly with very little markup. Because HTML lists are used frequently across third-party libraries and plugins, FrontBx lists are styled with the `.list` base class.

---

*   [Basic example](#basic-example)
*   [List contents](#list-contents)
*   [Dense list](#dense-list)
*   [List overflow](#list-overflow)
*   [List controls](#list-controls)
*   [States](#states)
*   [Selected lists](#selected-lists)
*   [CSS Customization](#css-customization)
*   [JavaScript Instantiation](#javascript-instantiation)

---

### Basic example

To create a list, add the `.list` class to a `<ul>`. Below is an example of a list in it's most basic form:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="card flat col-12 col-md-8 col-lg-5">
            <ul class="list">
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
                <li>Item 4</li>
            </ul>
        </div>
    </div>
</div>

```html
<ul class="list">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
    <li>Item 4</li>
</ul>
```

---

### List contents

List items come with handy `.item-title` and `.item-subtitle` helper to help delineate content:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="card flat col-12 col-md-8 col-lg-5">
            <ul class="list">
                <li>
                    <div class="item-body">
                        <div class="item-title">Amet proident.</div>
                        <div class="item-subtitle">Officia cillum nisi ea velit.</div>
                    </div>
                </li>
                <li>
                    <div class="item-body">
                        <div class="item-title">Lorem ipsum sed ut mollit.</div>
                        <div class="item-subtitle">Ex excepteur adipisicing laboris.</div>
                    </div>
                </li>
                <li>
                    <div class="item-body">
                        <div class="item-title">Minim velit laboris in aliquip.</div>
                        <div class="item-subtitle">Esse et cillum magna.</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>

```html
<ul class="list">
    <li>
        <div class="item-body">
            <div class="item-title">List Item</div>
            <div class="item-subtitle">Secondary text</div>
        </div>
    </li>
    ...
</ul>
```

List items can hold three helper elements `.item-left`, `.item-body` and `.item-right` to align content. They align as you would expect: 

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="card flat col-12 col-md-8 col-lg-5">
            <ul class="list"> 
                <li>
                    <div class="item-left"><span class="fa fa-inbox color-gray-500"></span></div>
                    <div class="item-body">Inbox</div>
                    <div class="item-right"><span class="label">4</span></div>
                </li>
                <li>
                    <div class="item-left"><span class="fa fa-flag color-gray-500"></span></div>
                    <div class="item-body">Flagged</div>
                    <div class="item-right"><span class="label">23</span></div>
                </li>
                <li>
                    <div class="item-left"><span class="fa fa-note-sticky color-gray-500"></span></div>
                    <div class="item-body">Drafts</div>
                    <div class="item-right"><span class="label">3</span></div>
                </li>
                <li>
                    <div class="item-left"><span class="fa fa-paper-plane color-gray-500"></span></div>
                    <div class="item-body">Sent</div>
                    <div class="item-right"><span class="status status-xs"></span></div>
                </li>
                <li>
                    <div class="item-left"><span class="fa fa-circle-minus color-gray-500"></span></div>
                    <div class="item-body">Junk</div>
                    <div class="item-right"><span class="status status-xs status-warning"></span></div>
                </li>
                <li>
                    <div class="item-left"><span class="fa fa-trash color-gray-500"></span></div>
                    <div class="item-body">Trash</div>
                    <div class="item-right"><span class="status status-xs status-danger"></span></div>
                </li>
            </ul>
        </div>
    </div>
</div>

```html
<ul class="list"> 
    <li>
        <div class="item-left"><span class="fa fa-inbox color-gray-500"></span></div>
        <div class="item-body">Inbox</span>
        <div class="item-right"><span class="label">4</span></div>
    </li>
    ...
</ul>
```

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="card flat col-12 col-md-8 col-lg-5">
            <ul class="list"> 
                <li>
                    <div class="item-left">
                        <div class="avatar">
                            <img data-src="../../../dist/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-avatar_thumb.jpg" />
                        </div>
                    </div>
                    <div class="item-body">
                        <div class="item-title">The Don</div>
                        <div class="item-subtitle">Strong economy, secure borders, less regulation! MAGA!!!</div>
                    </div>
                </li>
                <li>
                    <div class="item-left">
                        <div class="avatar">
                            <img data-src="../../../dist/img/elon_avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/elon_avatar.jpg" />
                        </div>
                    </div>
                    <div class="item-body">
                        <div class="item-title">Elon Musk</div>
                        <div class="item-subtitle">🔥🔥</div>
                    </div>
                </li>
                <li>
                    <div class="item-left">
                        <div class="avatar">
                            <img data-src="../../../dist/img/greg_avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/greg_avatar_thumb.jpg" />
                        </div>
                    </div>
                    <div class="item-body">
                        <div class="item-title">Greg</div>
                        <div class="item-subtitle">I'll delete this comment tomorrow as I don't want to ratio you guys.</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>

```html
<ul class="list"> 
    <li>
        <div class="item-left">
            <div class="avatar">
                <img data-src="../../../dist/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-avatar_thumb.jpg" />
            </div>
        </div>
        <div class="item-body">
            <div class="item-title">The Don</div>
            <div class="item-subtitle">Strong economy, secure borders, less regulation! MAGA!!!</div>
        </div>
    </li>
    ...
</ul>
```

--- 

### Dense list

For larger lists with multiple items, you can use the `.list-dense` modifier on `.list` to reduce the padding and text size:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="card flat col-12 col-md-8 col-lg-5">
            <ul class="list list-dense">
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
                <li>Item 4</li>
                <li>Item 5</li>
                <li>Item 6</li>
            </ul>
        </div>
    </div>
</div>

```html
<ul class="list list-dense">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
    <li>Item 4</li>
    <li>Item 5</li>
    <li>Item 6</li>
</ul>
```

---

### List overflow

Adding the  `.list-ellipsis` modifier on `.list` enables text overflow ellipsis. Ensure your text is nested inside `.item-body` for this to work:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="card flat col-12 col-md-8 col-lg-5">
            <ul class="list list-ellipsis">
                <li>
                    <div class="item-body">
                        <div class="item-title">Amet proident.</div>
                        <div class="item-subtitle">Officia cillum nisi ea velit.</div>
                    </div>
                </li>
                <li>
                    <div class="item-body">
                        <div class="item-title">Lorem ipsum sed ut mollit.</div>
                        <div class="item-subtitle">Lorem ipsum dolor anim commodo elit in consectetur tempor amet dolor quis dolore laborum proident irure in.</div>
                    </div>
                </li>
                <li>
                    <div class="item-body">
                        <div class="item-title">Minim velit laboris in aliquip.</div>
                        <div class="item-subtitle">Esse et cillum magna.</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>

```html
<ul class="list list-dense">
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
    <li>Item 4</li>
    <li>Item 5</li>
    <li>Item 6</li>
</ul>
```

--- 

### List controls

A checkbox can either be a primary action or a secondary action. When a checkbox is nested `item-left` it serves as the primary primary action and the state indicator for the list item.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="card flat col-12 col-md-8 col-lg-5">
            <ul class="list"> 
                <li>
                    <div class="item-left">
                        <div class="form-field">
                            <span class="checkbox checkbox-info">
                                <input type="checkbox" name="checkbox_1" id="checkbox_1" checked />
                                <label for="checkbox_1"></label>
                            </span>
                        </div>
                    </div>
                    <div class="item-body">
                        <div class="item-title">The Don</div>
                    </div>
                </li>
                <li>
                    <div class="item-left">
                        <div class="form-field">
                            <span class="checkbox checkbox-info">
                                <input type="checkbox" name="checkbox_2" id="checkbox_2"  />
                                <label for="checkbox_2"></label>
                            </span>
                        </div>
                    </div>
                    <div class="item-body">
                        <div class="item-title">Elon Musk</div>
                    </div>
                </li>
                <li>
                    <div class="item-left">
                        <div class="form-field">
                            <span class="checkbox checkbox-info">
                                <input type="checkbox" name="checkbox_3" id="checkbox_3"  />
                                <label for="checkbox_3"></label>
                            </span>
                        </div>
                    </div>
                    <div class="item-body">
                        <div class="item-title">Greg</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>

```html
<ul class="list"> 
    <li>
        <div class="item-left">
            <div class="form-field">
                <span class="checkbox checkbox-info">
                    <input type="checkbox" name="checkbox_1" id="checkbox_1" checked />
                    <label for="checkbox_1"></label>
                </span>
            </div>
        </div>
        <div class="item-body">
            <div class="item-title">The Don</div>
        </div>
    </li>
    ...
</ul>
```

When nested inside `.item-right`, a checkbox becomes a secondary action:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="card flat col-12 col-md-8 col-lg-5">
            <ul class="list"> 
                <li>
                    <div class="item-left">
                        <div class="avatar">
                            <img data-src="../../../dist/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-avatar_thumb.jpg" />
                        </div>
                    </div>
                    <div class="item-body">
                        <div class="item-title">The Don</div>
                    </div>
                    <div class="item-right">
                        <div class="form-field">
                            <span class="checkbox checkbox-info">
                                <input type="checkbox" name="checkbox_4" id="checkbox_4"  />
                                <label for="checkbox_4"></label>
                            </span>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-left">
                        <div class="avatar">
                            <img data-src="../../../dist/img/elon_avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/elon_avatar.jpg" />
                        </div>
                    </div>
                    <div class="item-body">
                        <div class="item-title">Elon Musk</div>
                    </div>
                    <div class="item-right">
                        <div class="form-field">
                            <span class="checkbox checkbox-info">
                                <input type="checkbox" name="checkbox_5" id="checkbox_5"  />
                                <label for="checkbox_5"></label>
                            </span>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-left">
                        <div class="avatar">
                            <img data-src="../../../dist/img/greg_avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/greg_avatar_thumb.jpg" />
                        </div>
                    </div>
                    <div class="item-body">
                        <div class="item-title">Greg</div>
                    </div>
                    <div class="item-right">
                        <div class="form-field">
                            <span class="checkbox checkbox-info">
                                <input type="checkbox" name="checkbox_6" id="checkbox_6"  />
                                <label for="checkbox_6"></label>
                            </span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>

```html
<ul class="list"> 
    <li>
        <div class="item-left">
            <div class="avatar">
                <img data-src="../../../dist/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-avatar_thumb.jpg" />
            </div>
        </div>
        <div class="item-body">
            <div class="item-title">The Don</div>
        </div>
        <div class="item-right">
            <div class="form-field">
                <span class="checkbox checkbox-info">
                    <input type="checkbox" name="checkbox_4" id="checkbox_4"  />
                    <label for="checkbox_4"></label>
                </span>
            </div>
        </div>
    </li>
    ...
</ul>
```

---

### States

List items come with a handful of convenient states to help with different use-cases. Add the classes `.active` `.selected` or `.disabled` to a list item to help provide context:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="card flat col-12 col-md-8 col-lg-5">
            <ul class="list">
                <li>Default</li>
                <li class="hover">hover</li>
                <li>Default</li>
                <li class="active">.active</li>
                <li>Default</li>
                <li class="selected">.selected</li>
                <li>Default</li>
                <li class="disabled">.disabled</li>
            </ul>
        </div>
    </div>
</div>

```html
<ul class="list">
    <li>Default</li>
    <li class="hover">hover</li>
    <li>Default</li>
    <li class="active">.active</li>
    <li>Default</li>
    <li class="selected">.selected</li>
</ul>
```

---

### Selected lists

Add the `.js-select-list` class to any list to enable clickable selection.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="card flat col-12 col-md-8 col-lg-5">
            <ul class="list js-select-list">
                <li class="selected">
                    <div class="item-body">
                        <div class="item-title">Amet proident.</div>
                        <div class="item-subtitle">Officia cillum nisi ea velit.</div>
                    </div>
                </li>
                <li>
                    <div class="item-body">
                        <div class="item-title">Lorem ipsum sed ut mollit.</div>
                        <div class="item-subtitle">Ut duis reprehenderit ad.</div>
                    </div>
                </li>
                <li>
                    <div class="item-body">
                        <div class="item-title">Minim velit laboris in aliquip.</div>
                        <div class="item-subtitle">Esse et cillum magna.</div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>

```html
 <ul class="list js-select-list">
    <li class="selected">
        <div class="item-body">
            <div class="item-title">Amet proident.</div>
            <div class="item-subtitle">Officia cillum nisi ea velit.</div>
        </div>
    </li>
    <li>
        <div class="item-body">
            <div class="item-title">Lorem ipsum sed ut mollit.</div>
            <div class="item-subtitle">Ut duis reprehenderit ad.</div>
        </div>
    </li>
    <li>
        <div class="item-body">
            <div class="item-title">Minim velit laboris in aliquip.</div>
            <div class="item-subtitle">Esse et cillum magna.</div>
        </div>
    </li>
</ul>
```

FrontBx will fire a custom event on the list when an item is selected. The `event.detail.item` key will tell you which item has been selected

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


---

### CSS Customization

List uses local CSS variables on `.list` along with Sass variables for enhanced component customization and styling. The base values are used by the UI to create all the styling. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <style scoped>
            .custom-list
            {
                --fbx-list-bg: var(--fbx-black);
                --fbx-list-color: var(--fbx-white);
                --fbx-list-item-color-hover: var(--fbx-white);
                --fbx-list-item-color-active: var(--fbx-theme-primary);
                --fbx-list-item-color-selected: var(--fbx-theme-primary);
                --fbx-list-item-bg-hover: var(--fbx-gray-900);
                --fbx-list-item-bg-active: var(--fbx-gray-900);
                --fbx-list-item-bg-selected: var(--fbx-gray-900);
                --fbx-list-divider-color: var(--fbx-gray-600);
            }
        </style>
        <ul class="list custom-list col-12 col-md-8 col-lg-5"> 
            <li>
                <span class="item-left"><span class="fa fa-inbox color-gray-800"></span></span>
                <span class="item-body">Inbox</span>
                <span class="item-right"><span class="label bg-gray-800">4</span></span>
            </li>
            <li>
                <span class="item-left"><span class="fa fa-flag color-gray-800"></span></span>
                <span class="item-body">Flagged</span>
                <span class="item-right"><span class="label bg-gray-800">23</span></span>
            </li>
            <li>
                <span class="item-left"><span class="fa fa-note-sticky color-gray-800"></span></span>
                <span class="item-body">Drafts</span>
                <span class="item-right"><span class="label bg-gray-800">3</span></span>
            </li>
            <li>
                <span class="item-left"><span class="fa fa-paper-plane color-gray-800"></span></span>
                <span class="item-body">Sent</span>
                <span class="item-right"><span class="status status-xs bg-gray-800"></span></span>
            </li>
            <li>
                <span class="item-left"><span class="fa fa-circle-minus color-gray-800"></span></span>
                <span class="item-body">Junk</span>
                <span class="item-right"><span class="status status-xs status-warning"></span></span>
            </li>
            <li>
                <span class="item-left"><span class="fa fa-trash color-gray-800"></span></span>
                <span class="item-body">Trash</span>
                <span class="item-right"><span class="status status-xs status-danger"></span></span>
            </li>
        </ul>
    </div>
</div>

```css
.custom-list
{
    --fbx-list-bg: var(--fbx-black);
    --fbx-list-color: var(--fbx-white);
    --fbx-list-item-color-hover: var(--fbx-white);
    --fbx-list-item-color-active: var(--fbx-theme-primary);
    --fbx-list-item-color-selected: var(--fbx-theme-primary);
    --fbx-list-item-bg-hover: var(--fbx-gray-900);
    --fbx-list-item-bg-active: var(--fbx-gray-900);
    --fbx-list-item-bg-selected: var(--fbx-gray-900);
    --fbx-list-divider-color: var(--fbx-gray-600);
}
```

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
$list-bg:                       var(--fbx-white) !default;
$list-color:                    var(--fbx-gray-700) !default;
$list-font-size:                1.3rem !default;
$list-item-bg:                  transparent !default;
$list-item-color-hover:         var(--fbx-gray-700) !default;
$list-item-color-active:        var(--fbx-gray-700) !default;
$list-item-color-selected:      var(--fbx-white) !default;
$list-item-bg-hover:            var(--fbx-gray-200) !default;
$list-item-bg-active:           var(--fbx-theme-info-100) !default;
$list-item-bg-selected:         var(--fbx-theme-info) !default;
$list-item-pad-y:               10px !default;
$list-item-pad-x:               12px !default;
$list-divider-color:            var(--fbx-gray-200) !default;
$list-divider-space:            5px;
```

```file-path
src/scss/components/list.scss
```
```css
.list {
    --fbx-list-bg: var(--fbx-white);
    --fbx-list-color: var(--fbx-gray-700);
    --fbx-list-font-size: 1.3rem;
    --fbx-list-item-color-hover: var(--fbx-gray-700);
    --fbx-list-item-color-active: var(--fbx-gray-700);
    --fbx-list-item-color-selected: var(--fbx-white);
    --fbx-list-item-bg: transparent;
    --fbx-list-item-bg-hover: var(--fbx-gray-200);
    --fbx-list-item-bg-active: var(--fbx-theme-info-100);
    --fbx-list-item-bg-selected: var(--fbx-theme-info);
    --fbx-list-item-pad-y: 10px;
    --fbx-list-item-pad-x: 12px;
    --fbx-list-divider-color: var(--fbx-gray-200);
    --fbx-list-divider-space: 5px;
}
```

---

### JavaScript Instantiation

List can be instantiated via JavaScript to generate dynamic content on the fly. To create a List dynamically, use FrontBx's `Component.Create` method either via the `FrontBx.Dom` or the List Component directly:

```JavaScript
let options =
{
    dense: false,
    selectable: true,
    ellipsis: false,
    items:
    [
        'Option One',
        {
            left: '<span class="fa fa-sun"></span>',
            body: 'Option Two'
        },
        {
            left: '<span class="fa fa-sun"></span>',
            body: 'Option 3',
            right: '<span class="fa fa-user"></span>',
        }
    ]
};

let container = document.querySelector('.my-container');

// Via Hibble dom
FrontBx.Dom().create('List', options, container);

// Or via Component directly
FrontBx.Dom().component('List').create(options, container);
```

Below are the available options:


| Option             | Default | Example                                      | Behavior                                                        |
|--------------------|---------|----------------------------------------------|-----------------------------------------------------------------|
| `classes`          | `''`    | `my-button`                                  | Additional class name(s) on `<ul>` element.                     |
| `dense`            | `false` | `true`                                       | Makes dense list                                                |
| `ellipsis`         | `false` | `true`                                       | Enables list item text overflow ellipsis                        |
| `selectable`       | `false` | `true`                                       | Enables selectable items.                                       |
| `selected`         | `null`  | `option 2`                                   | Text or value of default selected item when `selectable` true   |
| `items`            | `[]`    | `['option 1', 'option 2']`                   | Array of list items as text or objects with sub item properties |
| `items.item.left`  | `null`  | `{left:<span class="fa fa-sun"></span>'`     | Optional HTML string of optional list item left                 |
| `items.item.right` | `null`  | `{right: '<span class="fa fa-user"></span>'` | Optional HTML string of optional list item right                |
| `items.item.body`  | `null`  | `{right: 'Option 1'`                         | Optional HTML string or text of optional list item body         |
| `items.item.state` | `null`  | `{state: 'selected'`                         | Optional list item state class                                  |
