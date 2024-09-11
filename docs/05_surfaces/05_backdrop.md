# Backdrop

Backdrop provides access to an elevated surface providing additional app functionality such as filtering items, account access or displaying search results.

---

*   [Example](#example)
*   [Push body](#push-body)
*   [Direction](#direction)
*   [Swipeable](#swipeable)
*   [Methods](#methods)
*   [Options](#options)
*   [HTML Initialization](#html-initialization)
*   [CSS Customization](#css-customization)

---

### Example

A Backdrop can be created via FrontBx's Container with the `Backdrop` method:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <button class="js-bd-trigger-1 btn">Show Backdrop</button>
    </div>
</div>

```javascript
const backdrop = FrontBx.Backdrop( {
    content : '...',
});
```

<script type="text/javascript">
const SKELETONS = 
[
    { lines: 1, variant: 'block-h3' },
    { lines: 6, variant: 'text-block' },
    { lines: 1, variant: 'block-h4' },
    { lines: 3, variant: 'text-block' },
];
window.addEventListener('load', () =>
{
    let backdrop = FrontBx.Backdrop(
    {
        callbackBuilt: (container, drawer, overlay) => {
            let pad = FrontBx._().dom_element({tag: 'div', class: 'pad-20',}, FrontBx._().find('.js-drawer-dialog', container));
            FrontBx.Skeleton(pad, SKELETONS)
        },
        state: 'collapsed',
    });

    FrontBx.DocsDemo('.js-bd-trigger-1', () => backdrop.closed() ? backdrop.open() : backdrop.close());
});
</script>

---

### Push Body

By default, the Backdrop element will adapt the dimensions of the body. You can change this to push the body content instead by passing `pushbody: true` in the options:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <button class="js-bd-trigger-2 btn">Show Backdrop</button>
    </div>
</div>

```javascript
const backdrop = FrontBx.Backdrop( {
    content : '...',
});
```

<script type="text/javascript">
window.addEventListener('load', () =>
{
    let backdrop = FrontBx.Backdrop(
    {
        callbackBuilt: (container, drawer, overlay) => {
            let pad = FrontBx._().dom_element({tag: 'div', class: 'pad-20',}, FrontBx._().find('.js-drawer-dialog', container));
            FrontBx.Skeleton(pad, SKELETONS)
        },
        state: 'collapsed',
        pushbody: true,
    });

    FrontBx.DocsDemo('.js-bd-trigger-2', () => backdrop.closed() ? backdrop.open() : backdrop.close());
});
</script>

---

### Direction

Drawer direction can be manged by passing `left|right|top|bottom` to  `direction` in the options.

<div class="code-content-example">
    <div class="row" style="height: 300px">
        <iframe src="../backdrop_iframe1.html"></iframe>
    </div>
</div>

```javascript
const drawer = FrontBx.Drawer({
    content : '<ul>...</ul>',
    direction: 'right'
});
```

---

### Swipeable

By default, the Backdrop element itself is Swipeable when expanded. You can make the a backdrop swipeable with on the window when open or closed by adding the `swipeable` option. This means you can open and close the backdrop by simply swiping up or down on the window itself at any time.

<div class="code-content-example">
    <div class="iphone-case">
        <iframe src="../backdrop_iframe2.html"></iframe>
    </div>
</div>

```javascript
const backdrop = FrontBx.Backdrop({
    content   : '...',
    swipeable : true
});
```

---

### Methods

Once a Backdrop instance is created, there are a few methods to interact with the drawer:

The `open` method will animate and open the drawer:

```javascript
backdrop.open();
```

The `close` method will animate and close the drawer:

```javascript
backdrop.close();
```

The `direction` method returns the drawer state which will be either `collapsed` or `expanded`:

```javascript
if (backdrop.state() === 'collapsed')
{

}
```

The `state` method returns the drawer state which will be either `collapsed` or `expanded`:

```javascript
if (backdrop.state() === 'collapsed')
{

}
```

The `opened` method returns `true` if the drawer is open or `false` if not

```javascript
if (backdrop.opened())
{

}
```

The `closed` method returns `true` if the drawer is closed or `false` if not

```javascript
if (backdrop.closed())
{

}
```

Finally the `destroy` method completely removes the drawer from the DOM and all related event listeners:

```javascript
backdrop.destroy()
```

---

### Options

There are a number of options for a Backdrop depending on a given purpose. The table below outlines the available options:

| Option key         | Var Type                                  | Behavior                                                                        | Required | Default    |
|--------------------|-------------------------------------------|---------------------------------------------------------------------------------|----------|------------|
| `content`          | `string` `array` `nodelist` `HTMLElement` | Content to be displayed inside the drawer                                       | `no`     | `null`     |
| `pushBody`         | `Boolean`                                 | Pushes body rather than adapting it's dimensions                                | `no`     | `false`    |
| `animateOnMount`   | `Boolean`                                 | Enables animating on initial mount. Defaults to `true` when state is `expanded` | `no`     | `false`    |
| `swipeable`        | `boolean`                                 | Enables swipes on the window to open/close drawer                               | `no`     | `false`    |
| `state`            | `string`                                  | Default state when first created can be either `collapsed` or `expanded`        | `no`     | `expanded` |
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

For basic use-cases where access to the underlying JavaScript is not required, Backdrop can be enabled through HTML markup via an anchor element with the `.js-backdrop-trigger` class.

For basic HTML string content, simply use the `data-content` attribute with any required string content to populate the Backdrop.

For more complex requirements point to the id of a hidden target element element in the DOM with the `data-content` attribute. Remember to always include the `#` character before the ID as this differentiates it from it being interpenetrated as a string.

All other options can be set through `data-attributes` on the anchor element in `hyphen-case`. For example to set the `closeAnywhere` option, you would set the `data-close-anywhere="true"` attribute.


<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center pole-sm">
        <button type="button" class="btn js-backdrop-trigger" data-content="#fd-content">Toggle</button>
        <div id="fd-content"  class="pad-20" style="display: none;">
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
<button type="button" class="btn js-backdrop-trigger" data-content="fd-content">Toggle</button>

<div id="fd-content">...</ul>
```
---

### CSS Customization

Backdrop use a combination of both local CSS variables and Sass variables on `.backdrop-wrap`, `.backdrop-overlay` for enhanced component customization and styling.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
$backdrop-height:               75vh !default;
$backdrop-peekable-height:      50px !default;
$backdrop-radius:               10px !default;
$backdrop-overlay-bg:           rgba(255, 255, 255, 0.8) !default;
$backdrop-overlay-bg-dark:      rgba(0, 0, 0, 0.5) !default;
```


```file-path
`src/scss/components/_backdrop.scss`
```
```scss
.drawer-container.backdrop.drawer-bottom
{
    // Drawer
    --fbx-drawer-bg: #{$drawer-bg};
    --fbx-drawer-width: var(--fbx-backdrop-height);
    --fbx-drawer-size-peekable: #{$backdrop-peekable-height};

    // Overlay
    --fbx-drawer-overlay-bg: #{$backdrop-overlay-bg};
    --fbx-drawer-overlay-bg-dark: #{$backdrop-overlay-bg-dark};

    // Backdrop
    --fbx-backdrop-height: #{$backdrop-height};
    --fbx-backdrop-radius: #{$backdrop-radius};
}
```

