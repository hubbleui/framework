# Frontdrop

Frontdrop provides access to an elevated surface providing additional app functionality such as filtering items, account access or displaying search results.

---

*   [Example](#example)
*   [Confirm Button](#confirm-button)
*   [Swipeable](#swipeable)
*   [Peekable](#peekable)
*   [Methods](#methods)
*   [Options](#options)
*   [HTML Initialization](#html-initialization)
*   [CSS Customization](#css-customization)

---

### Example

A Frontdrop can be created via FrontBx's Container with the `Frontdrop` method:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <button class="js-fd-trigger-1 btn">Show Frontdrop</button>
    </div>
</div>

```javascript
const frontdrop = FrontBx.Frontdrop( {
    content : '...',
});
```

<script type="text/javascript">
const SKELETONS = 
[
    { lines: 1, variant: 'block-h3' },
    { lines: 6, variant: 'text-block' },
    { lines: 1, variant: 'block-h4' },
    { lines: 8, variant: 'text-block' },
];
window.addEventListener('load', () =>
{
    let frontdrop = FrontBx.Frontdrop(
    {
        callbackBuilt: (container, drawer, overlay) => FrontBx.Skeleton(FrontBx._().find('.card-block .container-fluid', container), SKELETONS),
        state: 'collapsed'
    });

    FrontBx.DocsDemo('.js-fd-trigger-1', () => frontdrop.closed() ? frontdrop.open() : frontdrop.close());
});
</script>

---

### Confirm Button

Pass a text value to `confirmBtn` to add a persistent confirmation button a Frontdrop. Additionally, if the Frontdrop requires validation to be closed you can pass a callback to `callbackValidate` to run your own validation and validate if the Frontdrop should close.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <button class="js-fd-trigger-2 btn">Show Frontdrop</button>
    </div>
</div>

```javascript
const frontdrop = FrontBx.Frontdrop( {
    content          : '...',
    confirmBtn       : 'Confirm Choice',
    callbackValidate : () => {
        //if (some condition) return false;
        return true;
    }
});
```

<script type="text/javascript">
window.addEventListener('load', () =>
{
    let frontdrop = FrontBx.Frontdrop(
    {
        callbackBuilt: (container, drawer, overlay) => FrontBx.Skeleton(FrontBx._().find('.card-block .container-fluid', container), SKELETONS),
        state: 'collapsed',
        confirmBtn: 'Confirm Choice',
    });

    FrontBx.DocsDemo('.js-fd-trigger-2', () => frontdrop.closed() ? frontdrop.open() : frontdrop.close());
});
</script>

---

### Swipeable

By default, the Frontdrop element itself is Swipeable when expanded. You can make the a frontdrop swipeable with on the window when open or closed by adding the `swipeable` option. This means you can open and close the frontdrop by simply swiping up or down on the window itself at any time.

<div class="code-content-example">
    <div class="iphone-case">
        <iframe src="../frontdrop_iframe1.html"></iframe>
    </div>
</div>

```javascript
const frontdrop = FrontBx.Frontdrop({
    content   : '...',
    swipeable : true
});
```

---

### Peekable

By default, the Frontdrop element will hide completely when collapsed. You can make the a frontdrop collapse to an edge by passing `peekable: true` in the options. This allows a remain persistent through user-actions. 

<div class="code-content-example">
    <div class="iphone-case">
        <iframe src="../frontdrop_iframe2.html"></iframe>
    </div>
</div>

```javascript
const frontdrop = FrontBx.Frontdrop({
    content   : '...',
    peekable  : true
});
```

---

### Methods

Once a Frontdrop instance is created, there are a few methods to interact with the drawer:

The `open` method will animate and open the drawer:

```javascript
frontdrop.open();
```

The `close` method will animate and close the drawer:

```javascript
frontdrop.close();
```

The `direction` method returns the drawer state which will be either `collapsed` or `expanded`:

```javascript
if (frontdrop.state() === 'collapsed')
{

}
```

The `state` method returns the drawer state which will be either `collapsed` or `expanded`:

```javascript
if (frontdrop.state() === 'collapsed')
{

}
```

The `opened` method returns `true` if the drawer is open or `false` if not

```javascript
if (frontdrop.opened())
{

}
```

The `closed` method returns `true` if the drawer is closed or `false` if not

```javascript
if (frontdrop.closed())
{

}
```

Finally the `destroy` method completely removes the drawer from the DOM and all related event listeners:

```javascript
frontdrop.destroy()
```

---

### Options

There are a number of options for a Frontdrop depending on a given purpose. The table below outlines the available options:

| Option key         | Var Type                                  | Behavior                                                                        | Required | Default    |
|--------------------|-------------------------------------------|---------------------------------------------------------------------------------|----------|------------|
| `content`          | `string` `array` `nodelist` `HTMLElement` | Content to be displayed inside the drawer                                       | `no`     | `null`     |
| `peekable`         | `Boolean`                                 | Enables peekable drawer.                                                        | `no`     | `false`    |
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

For basic use-cases where access to the underlying JavaScript is not required, Frontdrop can be enabled through HTML markup via an anchor element with the `.js-frontdrop-trigger` class.

For basic HTML string content, simply use the `data-content` attribute with any required string content to populate the Frontdrop.

For more complex requirements point to the id of a hidden target element element in the DOM with the `data-content` attribute. Remember to always include the `#` character before the ID as this differentiates it from it being interpenetrated as a string.

All other options can be set through `data-attributes` on the anchor element in `hyphen-case`. For example to set the `closeAnywhere` option, you would set the `data-close-anywhere="true"` attribute.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center pole-sm">
        <button type="button" class="btn js-frontdrop-trigger" data-content="#fd-content">Toggle</button>
        <div id="fd-content"  style="display: none;">
            <div class="skeleton-text-block skeleton-lines">
                <div class="skeleton" style="width: 81%;"></div>
                <div class="skeleton" style="width: 74%;"></div>
                <div class="skeleton" style="width: 78%;"></div>
                <div class="skeleton" style="width: 81%;"></div>
                <div class="skeleton" style="width: 74%;"></div>
                <div class="skeleton" style="width: 78%;"></div>
                <div class="skeleton" style="width: 84%;"></div>
                <div class="skeleton" style="width: 91%;"></div>
                <div class="skeleton" style="width: 84%;"></div>
                <div class="skeleton" style="width: 91%;"></div>
            </div>
        </div>
    </div>
</div>

```html
<button type="button" class="btn js-frontdrop-trigger" data-content="#fd-content">Toggle</button>

<div id="fd-content">...</ul>
```
---

### CSS Customization

Frontdrop use a combination of both local CSS variables and Sass variables on `.frontdrop-wrap`, `.frontdrop-overlay` for enhanced component customization and styling.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
$frontdrop-height:               75vh !default;
$frontdrop-peekable-height:      50px !default;
$frontdrop-radius:               10px !default;
$frontdrop-overlay-bg:           rgba(255, 255, 255, 0.8) !default;
$frontdrop-overlay-bg-dark:      rgba(0, 0, 0, 0.5) !default;
```


```file-path
`src/scss/components/_frontdrop.scss`
```
```scss
.drawer-container.frontdrop.drawer-bottom
{
    // Drawer
    --fbx-drawer-bg: #{$drawer-bg};
    --fbx-drawer-width: var(--fbx-frontdrop-height);
    --fbx-drawer-size-peekable: #{$frontdrop-peekable-height};

    // Overlay
    --fbx-drawer-overlay-bg: #{$frontdrop-overlay-bg};
    --fbx-drawer-overlay-bg-dark: #{$frontdrop-overlay-bg-dark};

    // Frontdrop
    --fbx-frontdrop-height: #{$frontdrop-height};
    --fbx-frontdrop-radius: #{$frontdrop-radius};
}
```

