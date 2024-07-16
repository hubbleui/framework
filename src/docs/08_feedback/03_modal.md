# Modal

Modals are a handy `JavaScript` component for displaying an action the user must take. Modals are highly customizable from both a `CSS` and `JavaScript` perspective.

---

*   [Example](#example)
*	[Options](#options)
*   [CSS Customization](#css-customization)

---

### Example

To display a Modal, call the `Modal` module with your options via the `Container`.

<div class="code-content-example">
    <button class="js-modal-trigger-1 btn btn-primary">Show Modal</button>
    <script type="text/javascript">
	    window.addEventListener('HubbleReady', function()
	    {
	        document.querySelector('.js-modal-trigger-1').addEventListener('click', () => Container.Modal( {
                title            : 'MAGA Country',
                message          : 'Do you want to make America great again?',
                cancelBtn        : 'Cancel',
                confirmBtn       : 'MAGA',
            }));
	    });
    </script>
</div>

```javascript
Container.Modal( {
    title            : 'MAGA Country',
    message          : 'Do you want to make America great again?',
    cancelBtn        : 'Cancel',
    confirmBtn       : 'MAGA',
});
```

If you want a custom modal with your own content, provide your own HTML as string via the `customContent` option. The content will be inserted into the modal modal:

<div class="code-content-example">
    <button class="js-modal-trigger-2 btn btn-primary">Show Modal</button>
    <script type="text/javascript">
        window.addEventListener('HubbleReady', function()
        {
            const card = `
                <div class="card-header">
                    <div class="card-header-left">
                        <div class="avatar">
                            <img class="img-responsive js-lazyload lazyload grayscale lazy-loaded" src="../../../build/img/trump-avatar.jpg">
                        </div>
                    </div>
                    <div class="card-header-content p5">
                        <div class="text-bold">The Don</div>
                        <div class="color-gray font-italic">Make America Great Again</div>
                    </div>
                </div>
                <div class="card-media">
                    <img class="img-responsive js-lazyload lazyload grayscale lazy-loaded" src="../../../build/img/trump-hero.jpg">
                </div>
                <div class="card-block">
                    <h4 class="card-title">MAGA Country</h4>
                    <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
                </div>
            `;
            document.querySelector('.js-modal-trigger-2').addEventListener('click', () => Container.Modal( {
                customContent    : card,
            }));
        });
    </script>
</div>

```javascript
const card = `
    <div class="card-header">
        <div class="card-header-left">
            <div class="avatar">
                <img class="img-responsive js-lazyload lazyload grayscale lazy-loaded" src="../../../build/img/trump-avatar.jpg">
            </div>
        </div>
        <div class="card-header-content p5">
            <div class="text-bold">The Don</div>
            <div class="color-gray font-italic">Make America Great Again</div>
        </div>
    </div>
    <div class="card-media">
        <img class="img-responsive js-lazyload lazyload grayscale lazy-loaded" src="../../../build/img/trump-hero.jpg">
    </div>
    <div class="card-block">
        <h4 class="card-title">MAGA Country</h4>
        <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
    </div>
`;
Container.Modal( { customContent : card });
```

Here's another example using options

<div class="code-content-example">
    <button class="js-modal-trigger-3 btn btn-primary">Show Modal</button>
    <script type="text/javascript">
        window.addEventListener('HubbleReady', function()
        {
            document.querySelector('.js-modal-trigger-3').addEventListener('click', () => Container.Modal( {
                title            : 'MAGA Country',
                message          : 'Do you want to make America great again?',
                cancelBtn        : 'Cancel',
                cancelClass      : 'btn btn-pure',
                confirmBtn       : 'MAGA',
                confirmClass     : 'btn btn-pure btn-primary',
                overlay          : 'dark',
                extras           : '<img data-src="../../../build/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../build/img/trump-hero_thumb.jpg" />',
                callbackRender   : () => Container.Hubble().dom().refresh('LazyLoad')
            }));
        });
    </script>
</div>

```javascript
Container.Modal( {
    title            : 'MAGA Country',
    message          : 'Do you want to make America great again?',
    cancelBtn        : 'Cancel',
    cancelClass      : 'btn btn-pure',
    confirmBtn       : 'MAGA',
    confirmClass     : 'btn btn-pure btn-primary',
    overlay          : 'dark',
    extras           : '<img data-src="../../../build/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../build/img/trump-hero_thumb.jpg" />',
    callbackRender   : () => Container.Hubble().dom().refresh('LazyLoad')
});
```

---

### Options

There are a number of options for a modal depending on a given purpose. The table below outlines the available options:

| Option key         | Var Type   | Behavior                                                                          | Required | Default       |
|--------------------|------------|-----------------------------------------------------------------------------------|----------|---------------|
| `title`            | `string`   | Text to be displayed inside `.card-title`.                                        | `no`     | `null`        |
| `message`          | `string`   | Text to be displayed inside `.card-body > p`.                                     | `no`     | `null`        |
| `extras`           | `string`   | Optional extra content to be append inside `.card` after `.card-body`             | `no`     | `null`        |
| `overlay`          | `string`   | Either `light` or `dark`                                                          | `no`     | `dark`        |
| `closeAnywhere`    | `boolean`  | Modal can be closed by clicking anywhere outside of it.                           | `no`     | `true`        |
| `customContent`    | `string`   | Optional custom string `html` content to build modal.                             | `no`     | `null`        |
| `cancelBtn`        | `string`   | Inner text on cancel button. No cancel button will be rendered if not provided.   | `no`     | `null`        |
| `cancelClass`      | `string`   | Btn variant/context class for cancel btn. e.g `.btn-danger`.                      | `no`     | `null`        |
| `confirmBtn`       | `string`   | Inner text on confirm button. No confirm button will be rendered if not provided. | `no`     | `null`        |
| `confirmClass`     | `string`   | Btn variant/context class for cancel btn. e.g `.btn-success`.                     | `no`     | `btn-primary` |
| `callbackBuilt`    | `function` | Callback function to be called when modal is built but not rendered.              | `no`     | `null`        |
| `callbackRender`   | `function` | Callback function to be called when modal is rendered into DOM.                   | `no`     | `null`        |
| `callbackConfirm`  | `function` | Callback function to be called when confirm button is clicked.                    | `no`     | `null`        |
| `callbackClose`    | `function` | Callback function to be called when modal is closed.                              | `no`     | `null`        |
| `callbackValidate` | `function` | Callback function to validate if modal can be closed. Must return boolean         | `no`     | `null`        |

---

### CSS Customization

Modals use a combination of both local CSS variables on `.modal-wrap`, `.modal-overlay` and Sass variables for enhanced component customization and styling.

Customization via Sass can be made in the `src/scss/_config.scss` file in Hubble's source.

```file-path
`src/scss/_config.scss`
```
```sass
$modal-max-width:               680px !default;
$modal-shadow:                  3 !default; //0,1,2,3 
$modal-overlay-bg:              var(--hb-white) !default;
$modal-overlay-bg-dark:         var(--hb-black) !default;
$modal-overlay-opacity:         0.8 !default;
$modal-title-size:              1.8rem !default;
$modal-transition-on:           opacity .2s .3s ease, transform .3s .3s ease !default;
$modal-transition-off:          opacity .4s  ease, transform .5s ease !default;
$modal-overlay-transition-on:   opacity .5s ease !default;
$modal-overlay-transition-off:  opacity .5s ease !default;
```

```sass
.modal-wrap
{
    --hb-modal-title-size: #{$modal-title-size};
    --hb-modal-transition-on: #{$modal-transition-on};
    --hb-modal-transition-off: #{$modal-transition-off};
    --hb-modal-max-width: #{$modal-max-width};
}
.modal-overlay
{
    --hb-modal-overlay-bg: #{$modal-overlay-bg};
    --hb-modal-overlay-bg-dark: #{$modal-overlay-bg-dark};
    --hb-modal-overlay-opacity: #{$modal-overlay-opacity};
    --hb-modal-overlay-transition-on: #{$modal-overlay-transition-on};
    --hb-modal-overlay-transition-off: #{$modal-overlay-transition-off};
}
```

