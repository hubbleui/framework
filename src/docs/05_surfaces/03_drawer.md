# Drawer

Drawer is provides an provides access to an elevated a surface providing additional app functionality such as filtering items, account access or displaying search results.

---

*   [Example](#example)
*   [Direction](#direction)
*   [Swipeable](#swipeable)
*   [Push Body](#push-body)
*   [Peekable](#peekable)
*	[Options](#options)
*   [CSS Customization](#css-customization)

---

### Example

A Drawer can be created via Hubble's Container with the `Drawer` method:

<div class="code-content-example">
    <button class="js-dw-trigger-1 btn">Show Drawer</button>
    <script type="text/javascript">
	    window.addEventListener('Hubble:ready', function()
	    {
            var drawer;

	        document.querySelector('.js-dw-trigger-1').addEventListener('click', () => 
            {
                if (drawer) return drawer.open();

                drawer = Hubble.Drawer(
                {
                    content : `<ul class="menu"> 
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
                </ul>`
                });
            });
	    });
    </script>
</div>

```javascript
const drawer = Hubble.Drawer({
    content : '<ul>...</ul>',
});
```

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
const drawer = Hubble.Drawer({
    content : '<ul>...</ul>',
    direction: 'right'
});
```

 <script type="text/javascript">
    window.addEventListener('Hubble:ready', function()
    {
        let btns = [Hubble._().find_all('.js-dw-trigger-2, .js-dw-trigger-3, .js-dw-trigger-4, .js-dw-trigger-5')]
        let drawer;

        Hubble._().on(btns, 'click', (e, btn) => 
        {                
            if (drawer) drawer.destroy();

            drawer = Hubble.Drawer(
            {
                direction : btn.innerText.toLowerCase().trim(),
                content          : `<ul class="menu"> 
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
                </ul>`,
        
            });
        });
    });
</script>

---

### Swipeable

By default, the Drawer element itself is Swipeable when expanded. You can make the a drawer swipeable with on the window when open or closed by adding the `swipeable` option. This means you can open and close the drawer by simply swiping up or down on the window itself at any time.

<div class="code-content-example">
    <div class="iphone-case">
        <iframe src="../drawer_iframe1.html"></iframe>
    </div>
</div>

```javascript
const drawer = Hubble.Drawer({
    content   : '...',
    swipeable : true
});
```

---

### Push Body

Persistent navigation drawers can toggle open or closed. The drawer sits on the same surface elevation as the main page content. Pass `pushBody` to the options when creating a drawer to enable it.

<div class="code-content-example">
    <div class="row" style="height: 400px">
        <iframe src="../drawer_iframe2.html"></iframe>
    </div>
</div>

```javascript
const drawer = Hubble.Drawer({
    content   : '...',
    pushBody : true,
});
```

---

### Peekable


---


### Options

There are a number of options for a modal depending on a given purpose. The table below outlines the available options:

| Option key         | Var Type                                  | Behavior                                                                          | Required | Default       |
|--------------------|-------------------------------------------|-----------------------------------------------------------------------------------|----------|---------------|
| `title`            | `string`                                  | Text to be displayed inside `.card-title`.                                        | `no`     | `null`        |
| `content`          | `string` `array` `nodelist` `HTMLElement` | Content to be displayed inside `.card-body > *`.                                  | `no`     | `null`        |
| `overlay`          | `string`                                  | Either `light` or `dark`                                                          | `no`     | `dark`        |
| `confirmBtn`       | `string`                                  | Inner text on confirm button. No confirm button will be rendered if not provided. | `no`     | `null`        |
| `confirmClass`     | `string`                                  | Btn variant/context class for confirmation button. e.g `.btn-success`.            | `no`     | `` |
| `state`            | `string`                                  | Default state when first created can be either `collapsed` or `expanded`          | `no`     | `expanded`    |
| `swipeable`        | `boolean`                                 | Enables up/down swipes on the window to open/close drawer                      | `no`     | `false`       |
| `callbackBuilt`    | `function`                                | Callback function to be called when drawer is first built but not rendered.    | `no`     | `null`        |
| `callbackRender`   | `function`                                | Callback function to be called when drawer is first rendered into DOM.         | `no`     | `null`        |
| `callbackConfirm`  | `function`                                | Callback function to be called when confirm button is clicked.                    | `no`     | `null`        |
| `callbackOpen`     | `function`                                | Callback function to be called when drawer is opened.                          | `no`     | `null`        |
| `callbackClose`    | `function`                                | Callback function to be called when drawer is closed.                          | `no`     | `null`        |
| `callbackValidate` | `function`                                | Callback function to validate if drawer can be closed. Must return boolean     | `no`     | `null`        |


---

### CSS Customization

Drawer use a combination of both local CSS variables and Sass variables on `.drawer-wrap`, `.drawer-overlay` for enhanced component customization and styling.

Customization via Sass can be made in the `src/scss/_config.scss` file in Hubble's source.

```file-path
`src/scss/_config.scss`
```
```sass
$drawer-overlay-bg:           var(--hb-white) !default;
$drawer-overlay-bg-dark:      var(--hb-black) !default;
$drawer-overlay-opacity:      0.8 !default;
$drawer-title-size:           1.8rem !default;
$drawer-transition:           opacity .2s ease, transform .4s var(--hb-ease-out-expo) !default;
$drawer-overlay-transition:   opacity .35s ease !default;
$drawer-shadow:               0px -5px 10px 0px rgb(0 0 0 / 22%);
$drawer-top:                  100px;
```

```file-path
`src/scss/components/_drawer.scss`
```
```sass
.drawer-overlay
{
    --hb-drawer-overlay-bg: #{$drawer-overlay-bg};
    --hb-drawer-overlay-bg-dark: #{$drawer-overlay-bg-dark};
    --hb-drawer-overlay-opacity: #{$drawer-overlay-opacity};
    --hb-drawer-overlay-transition: #{$drawer-overlay-transition};
}
.drawer-wrap
{
    --hb-drawer-title-size: #{$drawer-title-size};
    --hb-drawer-transition: #{$drawer-transition};
    --hb-drawer-shadow: #{$drawer-shadow};
    --hb-drawer-top: #{$drawer-top};
    --hb-drawer-edge-btm: #{calc(100% - 190px)};
}
```

