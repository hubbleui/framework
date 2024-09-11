# Tables

---

FrontBx comes with a few different basic table stylings ready to go. Because tables are used frequently across third-party libraries and plugins, FrontBx tables are styled with the `.table` base class.

---

*   [Basic table](#basic-table)
*   [Bordered table](#bordered-table)
*   [Alternate table](#alternate-table)
*   [Raised Table](#raised-table)
*   [Hover table](#hover-table)
*   [Selectable table](#selectable-table)
*   [Responsive table](#responsive-table)
*   [Dense table](#dense-table)
*   [Table highlights](#table-highlights)
*   [CSS Customization](#css-customization)
*   [JavaScript Instantiation](#javascript-instantiation)

---

### Basic table

For the most basic of table styling, simply add the `.table` class to a table.

<div class="code-content-example">
    <div class="card flat hide-overflow">
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>John</td>
                    <td>Foobar</td>
                    <td>@fbar</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Joe</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

```html
<table class="table">
    <thead>
        <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">1</th>
            <td>John</td>
            <td>Foobar</td>
            <td>@fbar</td>
        </tr>
        <tr>
            <th scope="row">2</th>
            <td>Joe</td>
            <td>Thornton</td>
            <td>@fat</td>
        </tr>
        <tr>
            <th scope="row">3</th>
            <td>James</td>
            <td>the Bird</td>
            <td>@twitter</td>
        </tr>
    </tbody>
</table>
```


---

### Bordered table

To make a bordered table add the `.table-bordered` class to a `.table`:

<div class="code-content-example">
    <div class="card flat hide-overflow">
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>John</td>
                    <td>Foobar</td>
                    <td>@fbar</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Joe</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

```html
<table class="table table-bordered">
    <thead>
        <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">1</th>
            <td>John</td>
            <td>Foobar</td>
            <td>@fbar</td>
        </tr>
        <tr>
            <th scope="row">2</th>
            <td>Joe</td>
            <td>Thornton</td>
            <td>@fat</td>
        </tr>
        <tr>
            <th scope="row">3</th>
            <td>James</td>
            <td>the Bird</td>
            <td>@twitter</td>
        </tr>
    </tbody>
</table>
```

---

### Alternate table

Add the `.table-alternate` class to a `.table` to add alternate background colors on rows:

<div class="code-content-example">
    <div class="card flat hide-overflow">
        <table class="table table-alternate">
            <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>John</td>
                    <td>Foobar</td>
                    <td>@fbar</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Joe</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

```html
<table class="table table-bordered">
    <thead>
        <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">1</th>
            <td>John</td>
            <td>Foobar</td>
            <td>@fbar</td>
        </tr>
        <tr>
            <th scope="row">2</th>
            <td>Joe</td>
            <td>Thornton</td>
            <td>@fat</td>
        </tr>
        <tr>
            <th scope="row">3</th>
            <td>James</td>
            <td>the Bird</td>
            <td>@twitter</td>
        </tr>
    </tbody>
</table>
```

---

### Raised table

Make a table raised by adding the `.raised-1`, `.raised-2` or `.raised-3` classes.

<div class="code-content-example">
    <div class="card flat hide-overflow">
        <table class="table table-bordered raised-1">
            <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>John</td>
                    <td>Foobar</td>
                    <td>@fbar</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Joe</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

```html
<table class="table table-bordered raised-1">
    <thead>
        <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">1</th>
            <td>John</td>
            <td>Foobar</td>
            <td>@fbar</td>
        </tr>
        <tr>
            <th scope="row">2</th>
            <td>Joe</td>
            <td>Thornton</td>
            <td>@fat</td>
        </tr>
        <tr>
            <th scope="row">3</th>
            <td>James</td>
            <td>the Bird</td>
            <td>@twitter</td>
        </tr>
    </tbody>
</table>
```

---

### Hover table

Adding the `.table-hover` class highlights the rows on hover.

<div class="code-content-example">
    <div class="card flat hide-overflow">
        <table class="table table-bordered table-hover">
            <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>John</td>
                    <td>Foobar</td>
                    <td>@fbar</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Joe</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

```html
<table class="table table-hover">
    <thead>
        <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">1</th>
            <td>John</td>
            <td>Foobar</td>
            <td>@fbar</td>
        </tr>
        <tr>
            <th scope="row">2</th>
            <td>Joe</td>
            <td>Thornton</td>
            <td>@fat</td>
        </tr>
        <tr>
            <th scope="row">3</th>
            <td>James</td>
            <td>the Bird</td>
            <td>@twitter</td>
        </tr>
    </tbody>
</table>
```
---

### Selectable table

Add the `.js-select-table` class to any table to enable clickable selection on table rows.

FrontBx will fire a custom event on the `<table>` when an row is selected. The `event.detail.item` key will tell you which row has been selected

| Event              | Description                                          | 
|--------------------|------------------------------------------------------|
| `table:selected`   | Fired immediately when an row is selected in a table |


```javascript

const list = document.getElementById('my-table')

list.addEventListener('table:selected', event => 
{
    const item = event.detail.item;

    // Do something here  
})
```

<div class="code-content-example">
    <div class="card flat hide-overflow">
        <table class="table js-select-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>John</td>
                    <td>Foobar</td>
                    <td>@fbar</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Joe</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

```html
<table class="table js-select-table">

        <thead>
            <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">1</th>
                <td>John</td>
                <td>Foobar</td>
                <td>@fbar</td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>Joe</td>
                <td>Thornton</td>
                <td>@fat</td>
            </tr>
            <tr>
                <th scope="row">3</th>
                <td>James</td>
                <td>the Bird</td>
                <td>@twitter</td>
            </tr>
        </tbody>
    </table>
```

---

### Responsive table

A responsive table will scroll horizontally at smaller screen sizes. This is handy for tables with lots of text. Simply wrap the table in a `div` with the `.table-responsive` class.

<div class="code-content-example">
    <div class="card flat hide-overflow">
        <div class="table-responsive">
            <table class="table table-bordered">

                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>John</td>
                        <td>Foobar</td>
                        <td>@fbar</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Joe</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>James</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

```html
<div class="table-responsive">
    <table class="table">

        <thead>
            <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <th scope="row">1</th>
                <td>John</td>
                <td>Foobar</td>
                <td>@fbar</td>
            </tr>
            <tr>
                <th scope="row">2</th>
                <td>Joe</td>
                <td>Thornton</td>
                <td>@fat</td>
            </tr>
            <tr>
                <th scope="row">3</th>
                <td>James</td>
                <td>the Bird</td>
                <td>@twitter</td>
            </tr>
        </tbody>
    </table>
</div>
```

---

### Dense table

Adding the `.table-dense` for a table with less padding in its cells:

<div class="code-content-example">
    <div class="card flat hide-overflow">
        <table class="table table-dense">
            <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>John</td>
                    <td>Foobar</td>
                    <td>@fbar</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>Joe</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

```html
<table class="table table-hover">
    <thead>
        <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th scope="row">1</th>
            <td>John</td>
            <td>Foobar</td>
            <td>@fbar</td>
        </tr>
        <tr>
            <th scope="row">2</th>
            <td>Joe</td>
            <td>Thornton</td>
            <td>@fat</td>
        </tr>
        <tr>
            <th scope="row">3</th>
            <td>James</td>
            <td>the Bird</td>
            <td>@twitter</td>
        </tr>
    </tbody>
</table>
```

---

### Table Highlights

You can highlight table rows, cells, heads and foots using FrontBx's contextual classes. Simply add `.primary` `.info`, `.success`, `.warning`, or `.danger` to a table element to highlight it

<div class="code-content-example">
    <div class="card flat hide-overflow">
        <table class="table table-bordered">
            <thead class="primary">
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>John</td>
                    <td>Foobar</td>
                    <td>@fbar</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>John</td>
                    <td>Foobar</td>
                    <td>@fbar</td>
                </tr>
                <tr class="primary color-white">
                    <th scope="row">3</th>
                    <td>Joe</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">4</th>
                    <td>James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
                <tr>
                    <th scope="row">5</th>
                    <td class="primary color-white">James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>


---

### CSS Customization

Table uses local CSS variables on `.table` along with Sass variables for enhanced component customization and styling. The base values are used by the UI to create all the styling. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <style scoped>
            .custom-table
            {
                --fbx-table-bg: var(--fbx-black);
                --fbx-table-color: var(--fbx-white);
                --fbx-table-bg-hover: var(--fbx-gray-900);
                --fbx-table-border-color: var(--fbx-gray-900);
                --fbx-table-head-bg: var(--fbx-gray-900);
                --fbx-table-head-color: var(--fbx-white);
            }
        </style>
        <table class="table custom-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Username</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>John</td>
                    <td>Foobar</td>
                    <td>@fbar</td>
                </tr>
                <tr>
                    <th scope="row">2</th>
                    <td>John</td>
                    <td>Foobar</td>
                    <td>@fbar</td>
                </tr>
                <tr>
                    <th scope="row">3</th>
                    <td>Joe</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                </tr>
                <tr>
                    <th scope="row">4</th>
                    <td>James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
                <tr>
                    <th scope="row">5</th>
                    <td>James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

```css
.custom-table
{
    --fbx-table-bg: var(--fbx-black);
    --fbx-table-color: var(--fbx-white);
    --fbx-table-bg-hover: var(--fbx-gray-900);
    --fbx-table-border-color: var(--fbx-gray-900);
    --fbx-table-head-bg: var(--fbx-gray-900);
    --fbx-table-head-color: var(--fbx-white);
}
```

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
$table-font-size:               1.3rem !default;
$table-bg:                      transparent !default;
$table-bg-hover:                rgba(0, 0, 0, 0.08) !default;
$table-bg-alternate:            rgba(0, 0, 0, 0.08) !default;
$table-color:                   inherit !default;
$table-cell-pad-y:              1.2rem !default;
$table-cell-pad-x:              1.8rem !default;
$table-border-color:            var(--fbx-gray-200) !default;
$table-head-bg:                 var(--fbx-gray-200) !default;
$table-head-color:              var(--fbx-gray-900) !default;
$table-head-weight:             $text-bold !default;
$table-caption-color:           var(--fbx-gray) !default;
$table-selected-color:          var(--fbx-white) !default;
$table-selected-bg:             var(--fbx-theme-info) !default;
```

```file-path
src/scss/components/table.scss
```
```css
.table {
    --fbx-table-font-size: 1.3rem;
    --fbx-table-bg: transparent;
    --fbx-table-color: inherit;
    --fbx-table-bg-hover: rgba(0, 0, 0, 0.08);
    --fbx-table-cell-pad-y: 1.2rem;
    --fbx-table-cell-pad-x: 1.8rem;
    --fbx-table-border-color: var(--fbx-gray-200);
    --fbx-table-head-bg: var(--fbx-gray-200);
    --fbx-table-head-color: var(--fbx-gray-900);
    --fbx-table-head-weight: 500;
    --fbx-table-caption-color: var(--fbx-gray);
    --fbx-table-bg-alternate: rgba(0, 0, 0, 0.08);
    --fbx-table-selected-color: var(--fbx-white);
    --fbx-table-selected-bg: var(--fbx-theme-info);
}
```

---

### JavaScript Instantiation

Table can be instantiated via JavaScript to generate dynamic content on the fly. To create a Table dynamically, use FrontBx's `Component.Create` method either via the `FrontBx.Dom` or the Table Component directly:

<div class="code-content-example">
    <div class="card flat js-table-container"></div>
</div>

<script>
window.addEventListener('FrontBx:ready', () =>
{
    let options =
    {
        head: ['Dessert (100g serving)', 'Calories', 'Fat (g)', 'Carbs (g)', 'Protein (g)'],
        rows:
        [
            ['Frozen yoghurt', 159, 6.0, 24, 4.0],
            ['Ice cream sandwich', 237, 9.0, 37, 4.3],
            ['Eclair', 262, 16.0, 24, 6.0],
            ['Cupcake', 305, 3.7, 67, 4.3],
            ['Gingerbread', 356, 16.0, 49, 3.9],
        ]
    };

    let container = document.querySelector('.js-table-container');

    // Via Hibble dom
    FrontBx.Dom().create('Table', options, container);
});
</script>

```JavaScript
let options =
{
    dense: false,
    selectable: false,
    head: ['Dessert (100g serving)', 'Calories', 'Fat (g)', 'Carbs (g)', 'Protein (g)'],
    rows:
    [
        ['Frozen yoghurt', 159, 6.0, 24, 4.0],
        ['Ice cream sandwich', 237, 9.0, 37, 4.3],
        ['Eclair', 262, 16.0, 24, 6.0],
        ['Cupcake', 305, 3.7, 67, 4.3],
        ['Gingerbread', 356, 16.0, 49, 3.9],
    ]
};

let container = document.querySelector('.js-table-container');

// Via Hibble dom
FrontBx.Dom().create('Table', options, container);

// Or via Component directly
FrontBx.Dom().component('Table').create(options, container);
```

Below are the available options:


| Option             | Default | Example                                      | Behavior                                                        |
|--------------------|---------|----------------------------------------------|-----------------------------------------------------------------|
| `classes`          | `''`    | `my-button`                                  | Additional class name(s) on `<table>` element.                  |
| `dense`            | `false` | `true`                                       | Makes dense table.                                              |
| `selectable`       | `false` | `true`                                       | Enables selectable rows.                                        |
| `selected`         | `null`  | `1`                                          | Index of selected row when `selectable` is true.                |
| `row`              | `[]`    | `['Heading', 'cell 1']`                      | Array of rows with first item is the table heading  |
