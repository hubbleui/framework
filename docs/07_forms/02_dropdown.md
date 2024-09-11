# Dropdown

Dropdown provides end-users with a list of options on a temporary surface. It appears when the user interacts with a button, or other control.

---

*   [Markup](#markup)
*   [Menu items](#menu-items)
*   [Dense menu](#icon-menu)
*   [States](#states)
*   [Selected menu](#selected-menu)
*   [Positioning](#positioning)
*   [Sizing](#sizing)
*   [Carets](#carets)
*   [Arrows](#arrows)
*   [CSS Customization](#css-customization)
*   [JavaScript Instantiation](#javascript-instantiation)

---

### Markup

A basic menu opens underneath the anchor element by default (positioning can be changed via class modifiers). To create a menu:

1.   Create a wrapper element with the `.drop-container` class.
2.   Nest any clickable element (usually `.btn`) with the `.js-drop-trigger` class to control the dropdown.
3.   Create the dropdown menu as the next sibling of the anchor element as `.drop-menu`.
4.   Nest your menu as `.menu` inside the dropdown.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs">
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">Dropdown trigger</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu"> 
                    <li>Menu 1</li>
                    <li>Menu 2</li>
                    <li>Menu 3</li>
                </ul>
            </div>
        </div>
    </div>
</div>

```html
<div class="drop-container">
    <button type="button" class="btn btn-dropdown">Dropdown trigger</button>
    <div class="drop-menu js-drop-menu">
        <ul class="menu"> 
            <li>Menu 1</li>
            <li>Menu 2</li>
            <li>Menu 3</li>
        </ul>
    </div>
</div>
```

---

### Menu items

Menu items have a few different options to provide additional content. To align content inside an item, wrap the main content in `.item-body` with left or right content in `.item-left` or `.item-right`:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">Dropdown trigger</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu"> 
                    <li>
                        <span class="item-left"><span class="fa fa-inbox color-gray-500"></span></span>
                        <span class="item-body">Inbox</span>
                        <span class="item-right"><span class="label">4</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-flag color-gray-500"></span></span>
                        <span class="item-body">Flagged</span>
                        <span class="item-right"><span class="label">23</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-note-sticky color-gray-500"></span></span>
                        <span class="item-body">Drafts</span>
                        <span class="item-right"><span class="label">3</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-paper-plane color-gray-500"></span></span>
                        <span class="item-body">Sent</span>
                        <span class="item-right"><span class="status status-xs"></span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-circle-minus color-gray-500"></span></span>
                        <span class="item-body">Junk</span>
                        <span class="item-right"><span class="status status-xs status-warning"></span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-trash color-gray-500"></span></span>
                        <span class="item-body">Trash</span>
                        <span class="item-right"><span class="status status-xs status-danger"></span></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>

```html
<ul class="menu"> 
    <li>
        <span class="item-left"><span class="fa fa-inbox color-gray-500"></span></span>
        <span class="item-body">Inbox</span>
        <span class="item-right"><span class="label">4</span></span>
    </li>
</ul>
```

Use `.menu-divider` on menu item to separate menu items or add `.menu-header` to the first item to give a menu a heading:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">Dropdown trigger</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu">
                    <li class="menu-header">Options</li>
                    <li>
                        <span class="item-left"><span class="fa fa-inbox color-gray-500"></span></span>
                        <span class="item-body">Inbox</span>
                        <span class="item-right"><span class="label">4</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-flag color-gray-500"></span></span>
                        <span class="item-body">Flagged</span>
                        <span class="item-right"><span class="label">23</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-note-sticky color-gray-500"></span></span>
                        <span class="item-body">Drafts</span>
                        <span class="item-right"><span class="label">3</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-paper-plane color-gray-500"></span></span>
                        <span class="item-body">Sent</span>
                        <span class="item-right"><span class="status status-xs"></span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-circle-minus color-gray-500"></span></span>
                        <span class="item-body">Junk</span>
                        <span class="item-right"><span class="status status-xs status-warning"></span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-trash color-gray-500"></span></span>
                        <span class="item-body">Trash</span>
                        <span class="item-right"><span class="status status-xs status-danger"></span></span>
                    </li>
                    <li class="menu-divider"></li>
                    <li>
                        <span class="item-left"><span class="fa fa-ellipsis-vertical color-gray-500"></span></span>
                        <span class="item-body">More</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>

```html
<ul class="menu"> 
    <li class="menu-header">Options</li>
    ...
    <li class="menu-divider"></li>
    ...
</ul>
```

---

### Dense menu

For larger menus with multiple items, you can use the `.menu-dense` modifier on `.menu` to reduce the padding and text size.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">Dropdown trigger</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu menu-dense">
                    <li>Back</li>
                    <li>Forward</li>
                    <li>Reload</li>
                    <li class="menu-divider"></li>
                    <li>Save As...</li>
                    <li>Print...</li>
                    <li>Cast...</li>
                    <li class="menu-divider"></li>
                    <li>View Page Source</li>
                    <li>Inspect</li>
                </ul>
            </div>
        </div>
    </div>
</div>

```html
<div class="drop-container">
    <button type="button" class="btn btn-dropdown js-drop-trigger">Dropdown trigger</button>
    <div class="drop-menu js-drop-menu">
        <ul class="menu menu-dense">
            <li>Back</li>
            <li>Forward</li>
            <li>Reload</li>
            <li class="menu-divider"></li>
            <li>Save As...</li>
            <li>Print...</li>
            <li>Cast...</li>
            <li class="menu-divider"></li>
            <li>View Page Source</li>
            <li>Inspect</li>
        </ul>
    </div>
</div>
```

---

### States

Menu items come with a handful of convenient states to help with different use-cases. Add the classes `.active` `.selected` or `.disabled` to a list item to help provide context:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <ul class="menu raised-2 border-radius" style="width: 200px;">
            <li>Back</li>
            <li class="disabled">.disabled</li>
            <li class="active">.active</li>
            <li>Cast...</li>
            <li class="selected">
                <span class="item-body">.selected</span>
                <span class="item-right"><span class="fa fa-check"></span>
            </li>
            <li>Inspect</li>
        </ul>
    </div>
</div>

```html
<ul class="menu">
    <li class="disabled">.disabled</li>
    <li class="active">.active</li>
    <li class="selected">
        <span class="item-body">.selected</span>
        <span class="item-right"><span class="fa fa-check"></span>
    </li>
</ul>
```

---

### Selected Menu

Dropdown offers three different options for selectable menus.

1. `.js-select-menu` - Add this modifier class to the `.menu` to toggle the `.selected` class on items when clicked.
2. `.js-check-menu` - Add this modifier class to the `.menu` to toggle the `.checked` class on items when clicked.
3. `.js-active-menu` - Add this modifier class to the `.menu` to toggle the `.active` class on items when clicked.

Note that when using the `.js-menu-check` modifier, FrontBx will automatically include a checkmark on the checked item.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs">
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">.js-select-menu</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu js-select-menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">.js-check-menu</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu js-check-menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">.js-active-menu</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu js-active-menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
    </div>
</div>

```html
<div class="drop-container">
    <input type="hidden" name="menu" value="">
    <button type="button" class="btn btn-dropdown js-drop-trigger">.js-select-menu</button>
    <div class="drop-menu js-drop-menu">
        <ul class="menu js-select-menu">
            <li>Option  1</li>
            <li>Option  2</li>
            <li>Option  3</li>
            <li>Option  4</li>
            <li>Option  5</li>
            <li>Option  6</li>
        </ul>
    </div>
</div>
```

Additionally, adding the `js-drop-selectable` modifier to the anchor element will replace the anchor element `innerText` with the text of a selected menu item.

You may also nest a hidden `input` inside the `.drop-container` to store the input value of the selected menu item. If items have a `data-value` attribute - the input value will be updated to this attribute rather than the text of the menu item.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs">
        <div class="drop-container">
            <input type="hidden" name="menu" value="">
            <button type="button" class="btn btn-dropdown js-drop-trigger js-drop-selectable">.js-select-menu</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu js-select-menu">
                    <li data-value="1">Option  1</li>
                    <li data-value="2">Option  2</li>
                    <li data-value="3">Option  3</li>
                    <li data-value="4">Option  4</li>
                    <li data-value="5">Option  5</li>
                    <li data-value="6">Option  6</li>
                </ul>
            </div>
        </div>
        <div class="drop-container">
            <input type="hidden" name="menu" value="">
            <button type="button" class="btn btn-dropdown js-drop-trigger js-drop-selectable">.js-check-menu</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu js-check-menu">
                    <li data-value="1">Option  1</li>
                    <li data-value="2">Option  2</li>
                    <li data-value="3">Option  3</li>
                    <li data-value="4">Option  4</li>
                    <li data-value="5">Option  5</li>
                    <li data-value="6">Option  6</li>
                </ul>
            </div>
        </div>
        <div class="drop-container">
            <input type="hidden" name="menu" value="">
            <button type="button" class="btn btn-dropdown js-drop-trigger js-drop-selectable">.js-active-menu</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu js-active-menu">
                    <li data-value="1">Option  1</li>
                    <li data-value="2">Option  2</li>
                    <li data-value="3">Option  3</li>
                    <li data-value="4">Option  4</li>
                    <li data-value="5">Option  5</li>
                    <li data-value="6">Option  6</li>
                </ul>
            </div>
        </div>
    </div>
</div>

```html
<div class="drop-container">
    <input type="hidden" name="menu" value="">
    <button type="button" class="btn btn-dropdown js-drop-trigger js-drop-selectable">.js-select-menu</button>
    <div class="drop-menu js-drop-menu">
        <ul class="menu js-select-menu">
            <li data-value="1">Option  1</li>
            <li data-value="2">Option  2</li>
            <li data-value="3">Option  3</li>
            <li data-value="4">Option  4</li>
            <li data-value="5">Option  5</li>
            <li data-value="6">Option  6</li>
        </ul>
    </div>
</div>
```

---

### Positioning

You can change the alignment of the dropdown to different directions by adding a directional class to the `.drop-menu` element. The directions are `.drop-s` `.drop-se` `.drop-sw` `.drop-n` `.drop-ne` `.drop-nw`

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs">
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">.drop-s</button>
            <div class="drop-menu drop-s js-drop-menu">
                <ul class="menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">.drop-se</button>
            <div class="drop-menu drop-se js-drop-menu">
                <ul class="menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">.drop-sw</button>
            <div class="drop-menu drop-sw js-drop-menu">
                <ul class="menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
        <div class="col-12"></div>
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">.drop-n</button>
            <div class="drop-menu drop-n js-drop-menu">
                <ul class="menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">.drop-ne</button>
            <div class="drop-menu drop-ne js-drop-menu">
                <ul class="menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">.drop-nw</button>
            <div class="drop-menu drop-nw js-drop-menu">
                <ul class="menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
    </div>
</div>

```html
<div class="drop-container">
    <button type="button" class="btn btn-dropdown js-drop-trigger">.drop-s</button>
    <div class="drop-menu drop-s js-drop-menu">
        ...
    </div>
</div>
```

---

### Sizing

Dropdown height is sized via `max-height` on `.menu`. This value can be overidden via either Sass or CSS variables.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">Dropdown trigger</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu menu-dense"> 
                    <li>Albania</li>
                    <li>Algeria</li>
                    <li>Andorra</li>
                    <li>Angola</li>
                    <li>Antigua</li>
                    <li>Argentina</li>
                    <li>Armenia</li>
                    <li>Australia</li>
                    <li>Austria</li>
                    <li>Azerbaijan</li>
                    <li>Bahamas</li>
                    <li>Bahrain</li>
                    <li>Bangladesh</li>
                    <li>Barbados</li>
                    <li>Belarus</li>
                    <li>Belgium</li>
                    <li>Belize</li>
                    <li>Benin</li>
                    <li>Bhutan</li>
                    <li>Bolivia</li>
                    <li>Bosnia</li>
                    <li>Botswana</li>
                    <li>Brazil</li>
                    <li>Brunei</li>
                    <li>Bulgaria</li>
                    <li>Burkina</li>
                    <li>Burundi</li>
                    <li>Côte</li>
                    <li>Cabo</li>
                    <li>Cambodia</li>
                    <li>Cameroon</li>
                    <li>Canada</li>
                    <li>Central</li>
                    <li>Chad</li>
                    <li>Chile</li>
                    <li>China</li>
                    <li>Colombia</li>
                    <li>Comoros</li>
                    <li>Congo</li>
                    <li>Costa</li>
                    <li>Croatia</li>
                    <li>Cuba</li>
                    <li>Cyprus</li>
                    <li>Czechia</li>
                    <li>Democratic</li>
                    <li>Denmark</li>
                    <li>Djibouti</li>
                    <li>Dominica</li>
                    <li>Dominican</li>
                    <li>Ecuador</li>
                    <li>Egypt</li>
                </ul>
            </div>
        </div>
    </div>
</div>

```css
.drop-container {
    --fbx-dropdown-height: 300px;
}
```

Dropdown width is sized via `min-width` on `.menu`. This value can be overidden via either Sass or CSS variables. Longer text will wrap, however you can add `menu-ellipsis` to the menu to prevent this from happening


```css
.drop-container {
    --fbx-dropdown-width: 160px;
}
```

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs">
        <div>
            <ul class="menu raised-2 border-radius" style="width: 200px;"> 
                <li>Menu 1</li>
                <li>This text will wrap which is the default behavior</li>
                <li>Menu 3</li>
            </ul>
        </div>
        <div>
            <ul class="menu menu-ellipsis raised-2 border-radius" style="width: 200px;">  
                <li>Menu 1</li>
                <li><span class="item-body">This text will be truncated if it's too long.</span></li>
                <li>Menu 3</li>
            </ul>
        </div>
    </div>
</div>

```html
<ul class="menu menu-ellipsis">  
    <li><span class="item-body">Menu item with additional text that spills over</span></li>
</ul>
```

---

### Carets

Add a caret to the button by using either a `.caret-s` or `caret-n` element inside inside the button or a caret icon

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs">
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">
                .caret-s <span class="caret-s"></span>
            </button>
            <div class="drop-menu drop-s js-drop-menu">
                <ul class="menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">
                .caret-n <span class="caret-n"></span>
            </button>
            <div class="drop-menu drop-n js-drop-menu">
                <ul class="menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
    </div>
</div>

```html
<button type="button" class="btn btn-dropdown js-drop-trigger">
    .caret-s <span class="caret-s"></span>
</button>
```

---

### Arrows

Add an arrow on the border of the dropdown using the `.arrow` with an arrow position `arrow-[position]` class. Arrow positions are `.arrow-s` `.arrow-se` `.arrow-sw` `.arrow-n` `.arrow-ne` `.arrow-nw`

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs">
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">.arrow-n</button>
            <div class="drop-menu drop-s arrow arrow-n js-drop-menu">
                <ul class="menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-dropdown js-drop-trigger">.arrow-s</button>
            <div class="drop-menu drop-n arrow arrow-s js-drop-menu">
                <ul class="menu">
                    <li>Option  1</li>
                    <li>Option  2</li>
                    <li>Option  3</li>
                    <li>Option  4</li>
                    <li>Option  5</li>
                    <li>Option  6</li>
                </ul>
            </div>
        </div>
    </div>
</div>

```html
<div class="drop-container">
    ...
    <div class="drop-menu drop-s arrow arrow-n js-drop-menu">
        ...
    </div>
</div>
```

---

### CSS Customization

Dropdown uses local CSS variables on `.drop-container` and `.menu` along with Sass variables for enhanced component customization and styling. The base values are used by the UI to create all the styling. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.


<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <style scoped>
            .custom-drop
            {
                --fbx-dropdown-bg: var(--fbx-black);
            }
            .custom-drop .menu
            {
                --fbx-menu-color: var(--fbx-white);
                --fbx-menu-item-color-hover: var(--fbx-white);
                --fbx-menu-item-color-active: var(--fbx-theme-primary);
                --fbx-menu-item-color-selected: var(--fbx-theme-primary);
                --fbx-menu-item-bg-hover: var(--fbx-gray-900);
                --fbx-menu-item-bg-active: var(--fbx-gray-900);
                --fbx-menu-item-bg-selected: var(--fbx-gray-900);
                --fbx-menu-divider-color: var(--fbx-gray-600);
            }
        </style>
        <div class="drop-container custom-drop">
            <button type="button" class="btn btn-dropdown js-drop-trigger">Dropdown trigger</button>
            <div class="drop-menu js-drop-menu">
                <ul class="menu"> 
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
    </div>
</div>

```css
.custom-drop
{
    --fbx-dropdown-bg: var(--fbx-black);
}
.custom-drop .menu
{
    --fbx-menu-color: var(--fbx-white);
    --fbx-menu-item-color-hover: var(--fbx-white);
    --fbx-menu-item-color-active: var(--fbx-theme-primary);
    --fbx-menu-item-color-selected: var(--fbx-theme-primary);
    --fbx-menu-item-bg-hover: var(--fbx-gray-900);
    --fbx-menu-item-bg-active: var(--fbx-gray-900);
    --fbx-menu-item-bg-selected: var(--fbx-gray-900);
    --fbx-menu-divider-color: var(--fbx-gray-600);
}
```

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
// Dropdown
$dropdown-border-radius:        var(--fbx-border-radius) !default;
$dropdown-width:                160px !default;
$dropdown-height:               300px !default;
$dropdown-shadow-level:         2 !default;
$dropdown-bg:                   var(--fbx-white) !default;

// Menu
$menu-bg:                       var(--fbx-white) !default;
$menu-color:                    var(--fbx-gray-700) !default;
$menu-font-size:                1.3rem !default;
$menu-item-bg:                  transparent !default;
$menu-item-color-hover:         var(--fbx-gray-700) !default;
$menu-item-color-active:        var(--fbx-gray-700) !default;
$menu-item-color-selected:      var(--fbx-white) !default;
$menu-item-bg-hover:            var(--fbx-gray-200) !default;
$menu-item-bg-active:           var(--fbx-theme-info-100) !default;
$menu-item-bg-selected:         var(--fbx-theme-info) !default;
$menu-item-pad-y:               10px !default;
$menu-item-pad-x:               12px !default;
$menu-divider-color:            var(--fbx-gray-200) !default;
$menu-divider-space:            5px;
```

```file-path
src/scss/components/dropdown.scss
```
```css
.drop-container {
  --fbx-dropdown-border-radius: var(--fbx-border-radius);
  --fbx-dropdown-width: 160px;
  --fbx-dropdown-height: 300px;
  --fbx-dropdown-bg: var(--fbx-white);
}
```

```file-path
src/scss/components/menu.scss
```
```css
.menu {
    --fbx-menu-bg: var(--fbx-white);
    --fbx-menu-color: var(--fbx-gray-700);
    --fbx-menu-font-size: 1.3rem;
    --fbx-menu-item-color-hover: var(--fbx-gray-700);
    --fbx-menu-item-color-active: var(--fbx-gray-700);
    --fbx-menu-item-color-selected: var(--fbx-white);
    --fbx-menu-item-bg: transparent;
    --fbx-menu-item-bg-hover: var(--fbx-gray-200);
    --fbx-menu-item-bg-active: var(--fbx-theme-info-100);
    --fbx-menu-item-bg-selected: var(--fbx-theme-info);
    --fbx-menu-item-pad-y: 10px;
    --fbx-menu-item-pad-x: 12px;
    --fbx-menu-divider-color: var(--fbx-gray-200);
    --fbx-menu-divider-space: 5px;
}
```

---

### JavaScript Instantiation

Dropdown can be instantiated via JavaScript to generate dynamic content on the fly. To create a Dropdown dynamically, use FrontBx's `Component.Create` method either via the `FrontBx.Dom` or the Dropdown Component directly:

```JavaScript
let options =
{
    anchorText: 'Basic',
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
FrontBx.Dom().create('Dropdown', options, container);

// Or via Component directly
FrontBx.Dom().component('Dropdown').create(options, container);
```

Below are the available options


| Option             | Default  | Example                                      | Behavior                                                                        |
|--------------------|----------|----------------------------------------------|---------------------------------------------------------------------------------|
| `anchorTag`        | `button` | `div`                                        | Tag element for anchor element                                                  |
| `anchorClass`      | `''`     | `my-button`                                  | Additional class name(s) on anchor element.                                     |
| `anchorText`       | `''`     | `click me`                                   | Text inside anchor element                                                      |
| `caret`            | `false`  | `s`                                          | Adds caret to anchor element - either `n` or `s`                                |
| `position`         | `sw`     | `ne'`                                        | Position of dropdown menu                                                       |
| `dense`            | `false`  | `true`                                       | Makes dense menu                                                                |
| `ellipsis`         | `false`  | `true`                                       | Makes dropdown menu text overflow ellipsis                                      |
| `checkable`        | `false`  | `true`                                       | Checkable menu items with checkmarks                                            |
| `selectable`       | `false`  | `true`                                       | Adds a hidden input and makes menu items selectable                             |
| `input`            | `null`   | `myinput`                                    | Hidden input `name` attribute when `selectable` is true                         |
| `selected`         | `null`   | `option 2`                                   | Text or value of default selected item when `selectable` or `checkable` is true |
| `items`            | `[]`     | `['option 1', 'option 2']`                   | Array of menu items as text or objects with sub item properties                 |
| `items.item.left`  | `null`   | `{left:<span class="fa fa-sun"></span>'`     | Optional HTML string of optional menu item left                                 |
| `items.item.right` | `null`   | `{right: '<span class="fa fa-user"></span>'` | Optional HTML string of optional menu item right                                |
| `items.item.body`  | `null`   | `{right: 'Option 1'`                         | Optional HTML string or text of optional menu item body                         |
| `items.item.state` | `null`   | `{state: 'selected'`                         | Optional Menu item state class                                                  |
