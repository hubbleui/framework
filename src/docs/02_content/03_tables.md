# Tables

---

Hubble comes with a few different basic table stylings ready to go. Because tables are used frequently across third-party libraries and plugins, Hubble tables are styled with the `.table` base class.

---

*   [Basic table](#basic-table)
*   [Bordered table](#bordered-table)
*   [Alternate table](#alternate-table)
*   [Raised Table](#raised-table)
*   [Pure button](#pure-button)
*   [Hover table](#hover-table)
*   [Responsive table](#responsive-table)
*   [Dense table](#dense-table)
*   [Table highlights](#table-highlights)
*   [CSS Customization](#css-customization)

---

### Basic table

For the most basic of table styling, simply add the `.table` class to a table.

<div class="code-content-example">
    <div class="container-fuid">
        <table class="table">
            <caption>Optional table caption.</caption>
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
        <caption>Optional table caption.</caption>
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
    <div class="container-fuid">
        <table class="table table-bordered">
            <caption>Optional table caption.</caption>
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
    <caption>Optional table caption.</caption>
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
    <div class="container-fuid">
        <table class="table table-alternate">
            <caption>Optional table caption.</caption>
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
    <caption>Optional table caption.</caption>
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
    <div class="container-fuid">
        <table class="table table-bordered raised-1">
            <caption>Optional table caption.</caption>
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
    <caption>Optional table caption.</caption>
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
    <div class="container-fuid">
        <table class="table table-bordered table-hover">
            <caption>Optional table caption.</caption>
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
    <caption>Optional table caption.</caption>
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
    <div class="container-fuid">
        <div class="table-responsive">
            <table class="table table-bordered">
                <caption>Optional table caption.</caption>
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
        <caption>Optional table caption.</caption>
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
    <div class="container-fuid">
        <table class="table table-dense">
            <caption>Optional table caption.</caption>
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
    <caption>Optional table caption.</caption>
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

You can highlight table rows, cells, heads and foots using Hubble's contextual classes. Simply add `.primary` `.info`, `.success`, `.warning`, or `.danger` to a table element to highlight it

<div class="code-content-example">
    <div class="container-fuid">
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
                <tr class="info">
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
                    <td class="info">James</td>
                    <td>the Bird</td>
                    <td>@twitter</td>
                </tr>
            </tbody>
        </table>
    </div>
</div> 