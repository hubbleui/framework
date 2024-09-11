# Drawer

Drawer provides access to an elevated surface providing additional app functionality such as filtering items, account access or displaying search results.

---

*   [Example](#example)
*   [Direction](#direction)
*   [Swipeable](#swipeable)
*   [Persistent](#persistent)
*   [Peekable](#peekable)
*   [Methods](#methods)
*   [Options](#options)
*   [HTML Initialization](#html-initialization)
*   [CSS Customization](#css-customization)

---

### Example

A Drawer can be created via FrontBx's Container with the `Drawer` method:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <button class="js-dw-trigger-1 btn">Show Drawer</button>
    </div>
</div>

```javascript
const drawer = FrontBx.Drawer({
    content : '<ul>...</ul>',
});
```

<script type="text/javascript">
const DRAWER_MENU = '<ul class="menu"><li><span class="item-left"><span class="fa fa-inbox color-gray-500"></span></span><span class="item-body">Inbox</span><span class="item-right"><span class="label">4</span></span>  </li>  <li><span class="item-left"><span class="fa fa-flag color-gray-500"></span></span><span class="item-body">Flagged</span><span class="item-right"><span class="label">23</span></span>  </li>  <li><span class="item-left"><span class="fa fa-note-sticky color-gray-500"></span></span><span class="item-body">Drafts</span><span class="item-right"><span class="label">3</span></span>  </li>  <li><span class="item-left"><span class="fa fa-paper-plane color-gray-500"></span></span><span class="item-body">Sent</span><span class="item-right"><span class="status status-xs"></span></span>  </li>  <li><span class="item-left"><span class="fa fa-circle-minus color-gray-500"></span></span><span class="item-body">Junk</span><span class="item-right"><span class="status status-xs status-warning"></span></span>  </li>  <li><span class="item-left"><span class="fa fa-trash color-gray-500"></span></span><span class="item-body">Trash</span><span class="item-right"><span class="status status-xs status-danger"></span></span>  </li> </ul>';
window.addEventListener('load', () =>
{
    let drawer;

    FrontBx.DocsDemo('.js-dw-trigger-1', () =>
    {
        if (drawer) return drawer.open();

        drawer = FrontBx.Drawer({ content : DRAWER_MENU });
    })
});
</script>

---

### Direction

Drawer direction can be manged by passing `left|right|top|bottom` to  `direction` in the options.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs">
        <button class="js-dw-trigger-2 btn">Left</button>
        <button class="js-dw-trigger-3 btn">Right</button>
        <button class="js-dw-trigger-4 btn">Top</button>
        <button class="js-dw-trigger-5 btn">Bottom</button>
    </div>
</div>

```javascript
const drawer = FrontBx.Drawer({
    content : '<ul>...</ul>',
    direction: 'right'
});
```
<script type="text/javascript">
window.addEventListener('load', () =>
{
    let drawer;

    FrontBx.DocsDemo('.js-dw-trigger-2, .js-dw-trigger-3, .js-dw-trigger-4, .js-dw-trigger-5', (e, btn) =>
    {
        if (drawer) drawer.destroy();

        drawer = FrontBx.Drawer({ direction : btn.innerText.toLowerCase().trim(), content : DRAWER_MENU });
    })
});
</script>

---

### Swipeable

By default, the Drawer element itself is Swipeable when expanded - meaning once it's opened, it can be swiped closed by swiping on the drawer in the opposite direction.

You can make the drawer swipeable on the window element itself instead by adding the `swipeable` option. This means a drawer can opened or closed by simply swiping up/down/left/right on the window itself at any time.

<div class="code-content-example">
    <div class="iphone-case">
        <iframe src="../drawer_iframe1.html"></iframe>
    </div>
</div>

```javascript
const drawer = FrontBx.Drawer({
    content   : '...',
    swipeable : true
});
```

---

### Persistent

Persistent navigation drawers can toggle open or closed and sits on the same surface elevation as the content. When the drawer opens or closes, the main page content is pushed or pulled adapts in width/height based on the drawer size.

Drawer will automatically wrap and unwrap page content when the it is invoked or destroyed.

<div class="code-content-example">
    <div class="row" style="height: 450px">
        <iframe src="../drawer_iframe2.html"></iframe>
    </div>
</div>

```javascript
const drawer = FrontBx.Drawer({
    content   : '...',
    persistent : true,
});
```

---

### Peekable

On persistent left and right drawers, adding the `peekable` option, allows the drawer to collapse into a fixed width when closed. When expanded, it appears as the standard persistent navigation drawer.

<div class="code-content-example">
    <div class="row" style="height: 450px">
        <iframe src="../drawer_iframe3.html"></iframe>
    </div>
</div>

```javascript
const drawer = FrontBx.Drawer({
    content   : '...',
    persistent : true,
    peekable : true,
});
```

---

### Methods

Once a drawer instance is created, there are a few methods to interact with the drawer:

The `open` method will animate and open the drawer:

```javascript
drawer.open();
```

The `close` method will animate and close the drawer:

```javascript
drawer.close();
```

The `direction` method returns the drawer state which will be either `left`, `right`, `top` or `bottom`:

```javascript
if (drawer.direction() === 'left')
{

}
```

The `state` method returns the drawer state which will be either `collapsed` or `expanded`:

```javascript
if (drawer.state() === 'collapsed')
{

}
```

The `opened` method returns `true` if the drawer is open or `false` if not

```javascript
if (drawer.opened())
{

}
```

The `closed` method returns `true` if the drawer is closed or `false` if not

```javascript
if (drawer.closed())
{

}
```

Finally the `destroy` method completely removes the drawer from the DOM and all related event listeners:

```javascript
drawer.destroy()
```

---

### Options

Drawer initialization has a number of different options depending on the use-case. The table below outlines the available options:

| Option key         | Var Type                                  | Behavior                                                                        | Required | Default    |
|--------------------|-------------------------------------------|---------------------------------------------------------------------------------|----------|------------|
| `content`          | `string` `array` `nodelist` `HTMLElement` | Content to be displayed inside the drawer                                       | `no`     | `null`     |
| `persistent`       | `Boolean`                                 | Enables persistent drawer.                                                      | `no`     | `false`    |
| `peekable`         | `Boolean`                                 | Enables peekable drawer.                                                        | `no`     | `false`    |
| `animateOnMount`   | `Boolean`                                 | Enables animating on initial mount. Defaults to `true` when state is `expanded` | `no`     | `false`    |
| `swipeable`        | `boolean`                                 | Enables swipes on the window to open/close drawer                               | `no`     | `false`    |
| `state`            | `string`                                  | Default state when first created can be either `collapsed` or `expanded`        | `no`     | `expanded` |
| `overlay`          | `string`                                  | Either `light` or `dark`                                                        | `no`     | `dark`     |
| `easing`           | `string`                                  | JavaScript easing pattern in `camelCase`                                        | `no`     | `easeOut`  |
| `animationTime`    | `Integer`                                 | Animation duration in milliseconds.                                             | `no`     | `250`      |
| `classes`          | `string`                                  | Additional classes to pass to the drawer wrapper                                | `no`     | `dark`     |
| `callbackBuilt`    | `function`                                | Callback function to be called when drawer is first built but not rendered.     | `no`     | `null`     |
| `callbackRender`   | `function`                                | Callback function to be called when drawer is first rendered into DOM.          | `no`     | `null`     |
| `callbackOpen`     | `function`                                | Callback function to be called when drawer is opened.                           | `no`     | `null`     |
| `callbackClose`    | `function`                                | Callback function to be called when drawer is closed.                           | `no`     | `null`     |
| `callbackValidate` | `function`                                | Callback function to validate if drawer can be closed. Must return boolean      | `no`     | `null`     |

Note that all callbacks callbacks will receive the following arguments: `containerWrap, drawer, overlay, bodyWrap`

---

### HTML Initialization

For basic use cases where access to the underlying JavaScript, Drawers can be enabled through HTML markup via an anchor element. Options can be set through `data-attributes` on the anchor element.

To initialize a drawer, create an anchor element using the `.js-drawer-trigger` class, you can then point to the id of the target drawer element in the DOM via the `data-content` attribute. No other special markup is required.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center pole-sm">
        <button type="button" class="btn js-drawer-trigger" data-content="#menu">Toggle</button>
        <ul id="menu" class="menu" style="display: none;"> 
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

```html
<button type="button" class="btn js-drawer-trigger" data-content="#my-drawer">Toggle</button>

<ul class="memu" id="my-drawer">...</ul>
```

---


### CSS Customization

Drawer use a combination of both local CSS variables and Sass variables on `.drawer-wrap`, `.drawer-overlay` for enhanced component customization and styling.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
$drawer-bg:                     var(--fbx-white) !default;
$drawer-width:                  230px !default;
$drawer-size-peekable:          80px !default;
$drawer-overlay-bg:             rgba(255, 255, 255, 0.8) !default;
$drawer-overlay-bg-dark:        rgba(0, 0, 0, 0.5) !default;
```

```file-path
`src/scss/components/_drawer.scss`
```
```sass
.drawer-container
{
    // Variables
    --fbx-drawer-bg: #{$drawer-bg};
    --fbx-drawer-width: #{$drawer-width};
    --fbx-drawer-size-peekable: #{$drawer-size-peekable};

    // Overlay
    --fbx-drawer-overlay-bg: #{$drawer-overlay-bg};
    --fbx-drawer-overlay-bg-dark: #{$drawer-overlay-bg-dark};
}
```

