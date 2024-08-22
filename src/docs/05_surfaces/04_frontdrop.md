# Frontdrop

Frontdrop is provides an provides access to an elevated a surface providing additional app functionality such as filtering items, account access or displaying search results.

---

*   [Example](#example)
*   [Confirm Button](#confirm-button)
*   [Swipeable](#swipeable)
*   [KeepEdge](#keepedge)
*	[Options](#options)
*   [CSS Customization](#css-customization)

---

### Example

A Frontdrop can be created via Hubble's Container with the `Frontdrop` method:

<div class="code-content-example">
    <button class="js-fd-trigger-1 btn btn-primary">Show Frontdrop</button>
    <script type="text/javascript">
	    window.addEventListener('Hubble:ready', function()
	    {
            var frontdrop;

	        document.querySelector('.js-fd-trigger-1').addEventListener('click', () => 
            {
                if (frontdrop) frontdrop.destroy();

                frontdrop = Hubble.Frontdrop(
                {
                    title            : 'Options',
                    content          : `<ul class="list">
                        <li>
                            <div class="item-body">
                                <div class="item-title">Amet proident.</div>
                                <div class="item-subtitle">Officia cillum nisi ea velit.</div>
                            </div>
                        </li>
                        <li>
                            <div class="item-body">
                                <div class="item-title">Eu dolor anim.</div>
                                <div class="item-subtitle">Lorem ipsum elit aute sint irure id esse.</div>
                            </div>
                        </li>
                        <li>
                            <div class="item-body">
                                <div class="item-title">Eu dolor anim.</div>
                                <div class="item-subtitle">Lorem ipsum elit aute sint irure id esse.</div>
                            </div>
                        </li>
                        <li>
                            <div class="item-body">
                                <div class="item-title">Eu dolor anim.</div>
                                <div class="item-subtitle">Lorem ipsum elit aute sint irure id esse.</div>
                            </div>
                        </li>
                        <li>
                            <div class="item-body">
                                <div class="item-title">Minim velit laboris in aliquip.</div>
                                <div class="item-subtitle">Esse et cillum magna.</div>
                            </div>
                        </li>
                    </ul>`
                });
            });
	    });
    </script>
</div>

```javascript
const frontdrop = Hubble.Frontdrop( {
    title   : 'Options',
    content : '<ul>...</ul>',
});
```

---

### Confirm Button

Pass a text value to `confirmBtn` to add a persistent confirmation button a Frontdrop. Additionally, if the Frontdrop requires validation to be closed you can pass a callback to `callbackValidate` to run your own validation and validate if the Frontdrop should close.

<div class="code-content-example">
    <button class="js-fd-trigger-2 btn btn-primary">Show Frontdrop</button>
    <script type="text/javascript">
        window.addEventListener('Hubble:ready', function()
        {
            var frontdrop;

            document.querySelector('.js-fd-trigger-2').addEventListener('click', () => 
            {
                if (frontdrop) frontdrop.destroy();

                frontdrop = Hubble.Frontdrop(
                {
                    title            : '<span class="skeleton skeleton-h5" style="width:150px"></span>',
                    content          : `
                        <div class="skeleton-text-block skeleton-lines">
                            <div class="skeleton" style="width: 81%;"></div>
                            <div class="skeleton" style="width: 84%;"></div>
                            <div class="skeleton" style="width: 91%;"></div>
                        </div>`,
                    confirmBtn: 'Confirm',
                });
            });
        });
    </script>
</div>

```javascript
const frontdrop = Hubble.Frontdrop( {
    title            : '...',
    content          : '...',
    confirmBtn       : 'Confirm',
    callbackValidate : () => {
        //if (some condition) return false;
        return true;
    }
});
```

---

### Swipeable

By default, the Frontdrop element itself is Swipeable when expanded. You can make the a frontdrop swipeable with on the window when open or closed by adding the `swipeable` option. This means you can open and close the frontdrop by simply swiping up or down on the window itself at any time.

<div class="code-content-example">
    <div class="iphone-case">
        <iframe src="../frontdrop_iframe1.html"></iframe>
    </div>
</div>

```javascript
const frontdrop = Hubble.Frontdrop({
    title     : '...',
    content   : '...',
    swipeable : true
});
```

---

### KeepEdge

By default, the Frontdrop element will hide completely when collapsed. You can make the a frontdrop collapse to an edge by passing `keepEdge: true` in the options. This allows a remain persistent through user-actions. 

<div class="code-content-example">
    <div class="iphone-case">
        <iframe src="../frontdrop_iframe2.html"></iframe>
    </div>
</div>

```javascript
const frontdrop = Hubble.Frontdrop({
    title     : '...',
    content   : '...',
    keepEdge  : true
});
```


### Options

There are a number of options for a modal depending on a given purpose. The table below outlines the available options:

| Option key         | Var Type                                  | Behavior                                                                          | Required | Default       |
|--------------------|-------------------------------------------|-----------------------------------------------------------------------------------|----------|---------------|
| `title`            | `string`                                  | Text to be displayed inside `.card-title`.                                        | `no`     | `null`        |
| `content`          | `string` `array` `nodelist` `HTMLElement` | Content to be displayed inside `.card-body > *`.                                  | `no`     | `null`        |
| `overlay`          | `string`                                  | Either `light` or `dark`                                                          | `no`     | `dark`        |
| `confirmBtn`       | `string`                                  | Inner text on confirm button. No confirm button will be rendered if not provided. | `no`     | `null`        |
| `confirmClass`     | `string`                                  | Btn variant/context class for confirmation button. e.g `.btn-success`.            | `no`     | `btn-primary` |
| `state`            | `string`                                  | Default state when first created can be either `collapsed` or `expanded`          | `no`     | `expanded`    |
| `swipeable`        | `boolean`                                 | Enables up/down swipes on the window to open/close frontdrop                      | `no`     | `false`       |
| `callbackBuilt`    | `function`                                | Callback function to be called when frontdrop is first built but not rendered.    | `no`     | `null`        |
| `callbackRender`   | `function`                                | Callback function to be called when frontdrop is first rendered into DOM.         | `no`     | `null`        |
| `callbackConfirm`  | `function`                                | Callback function to be called when confirm button is clicked.                    | `no`     | `null`        |
| `callbackOpen`     | `function`                                | Callback function to be called when frontdrop is opened.                          | `no`     | `null`        |
| `callbackClose`    | `function`                                | Callback function to be called when frontdrop is closed.                          | `no`     | `null`        |
| `callbackValidate` | `function`                                | Callback function to validate if frontdrop can be closed. Must return boolean     | `no`     | `null`        |


---

### CSS Customization

Frontdrop use a combination of both local CSS variables and Sass variables on `.frontdrop-wrap`, `.frontdrop-overlay` for enhanced component customization and styling.

Customization via Sass can be made in the `src/scss/_config.scss` file in Hubble's source.

```file-path
`src/scss/_config.scss`
```
```sass
$frontdrop-overlay-bg:           var(--hb-white) !default;
$frontdrop-overlay-bg-dark:      var(--hb-black) !default;
$frontdrop-overlay-opacity:      0.8 !default;
$frontdrop-title-size:           1.8rem !default;
$frontdrop-transition:           opacity .2s ease, transform .4s var(--hb-ease-out-expo) !default;
$frontdrop-overlay-transition:   opacity .35s ease !default;
$frontdrop-shadow:               0px -5px 10px 0px rgb(0 0 0 / 22%);
$frontdrop-top:                  100px;
```

```file-path
`src/scss/components/_frontdrop.scss`
```
```sass
.frontdrop-overlay
{
    --hb-frontdrop-overlay-bg: #{$frontdrop-overlay-bg};
    --hb-frontdrop-overlay-bg-dark: #{$frontdrop-overlay-bg-dark};
    --hb-frontdrop-overlay-opacity: #{$frontdrop-overlay-opacity};
    --hb-frontdrop-overlay-transition: #{$frontdrop-overlay-transition};
}
.frontdrop-wrap
{
    --hb-frontdrop-title-size: #{$frontdrop-title-size};
    --hb-frontdrop-transition: #{$frontdrop-transition};
    --hb-frontdrop-shadow: #{$frontdrop-shadow};
    --hb-frontdrop-top: #{$frontdrop-top};
    --hb-frontdrop-edge-btm: #{calc(100% - 190px)};
}
```

