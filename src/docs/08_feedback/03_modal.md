# Modal

Modals are a handy `JavaScript` component for displaying an action the user must take. Modals are highly customizable from both a `CSS` and `JavaScript` perspective.

---

*   [Example](#example)
*   [Content](#content)
*   [Scrollable](#scrollable)
*   [Customization](#customization)
*   [Callbacks](#callbacks)
*   [Methods](#methods)
*	[Options](#options)
*   [HTML Initialization](#html-initialization)
*   [CSS Customization](#css-customization)

---

### Example

To display a Modal, call the `Modal` Component via Hubble's Container:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-sm">
        <button class="js-modal-trigger-1 btn">Basic Modal</button>
    </div>
</div>

```javascript
let modal = Hubble.Modal({
    title            : 'Use X\'s location service?',
    content          : 'Let X help apps determine location. This means sending anonymous location data to X, even when no apps are running.',
    cancelBtn        : 'Disagree',
    confirmBtn       : 'Agree',
});
```

> The `content` option can be either a `String`, `HTMLElement`, `NodeList` or `Array`

<script type="text/javascript">
window.addEventListener('load', () =>
{
    Hubble.DocsDemo('.js-modal-trigger-1', () => 
        Hubble.Modal({
            title            : 'Use X\'s location service?',
            content          : 'Let X help apps determine location. This means sending anonymous location data to X, even when no apps are running.',
            cancelBtn        : 'Disagree',
            confirmBtn       : 'Agree',
        })
    );
});
</script>

---

### Content

By default the Modal will structure provided `content` and `title` into a card element. In cases where more customized content is needed, set `custom:true` in the options to create your own markup.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-sm">
        <button class="js-modal-trigger-2 btn">Custom Modal</button>
    </div>
</div>

```javascript
let modal = Hubble.Modal({
    content: '...',
    custom: true,
    closeAnywhere: true
});
```

<script type="text/javascript">
window.addEventListener('load', () =>
{
    let content = `<div class="card col col-lg-4">
        <div class="card-header">
            <div class="card-header-left">
                <div class="avatar">
                    <img data-src="../../../dist/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-avatar_thumb.jpg" />
                </div>
            </div>
            <div class="card-header-content p5">
                <div class="text-bold">The Don</div>
                <div class="color-gray font-italic">Make America Great Again</div>
            </div>
        </div>
        <div class="card-media">
            <img data-src="../../../dist/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" />
        </div>
        <div class="card-block">
            <h4 class="card-title">This Is MAGA Country</h4>
            <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
        </div>
    </div>`;

    Hubble.DocsDemo('.js-modal-trigger-2', () => Hubble.Modal({
        content : content,
        custom: true,
        closeAnywhere: true
    }));
});
</script>

---

### Scrollable

When a Modal becomes too long for the user's viewport or device the content will scroll. By default the entire modal itself will scroll. You can customize this by setting the `scroll` option to either `modal` (default) or `content`.

The example below shows the difference:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-sm">
        <button class="js-modal-trigger-3 btn">Scroll "modal"</button>
        <button class="js-modal-trigger-4 btn">Scroll "content"</button>
    </div>
</div>

```javascript
let modal = Hubble.Modal({
    title   : '...',
    content : '...',
    scrollable: 'modal',
});
```

<script type="text/javascript">
window.addEventListener('load', () =>
{
    let options = {
        title            : 'Use X\'s location service?',
        content          : 'Lorem ipsum officia dolore id incididunt in est ut amet reprehenderit non ut pariatur esse do dolore nisi ut ut veniam minim sed ut fugiat exercitation eiusmod duis laboris consectetur anim id quis proident proident qui laboris cillum velit in sit consequat mollit et elit ut esse minim sit et mollit dolore dolor est dolor ea exercitation aliqua officia tempor dolore sit nulla in qui est ut minim sit dolore commodo in dolor in sed exercitation duis labore anim ut sed in id consequat anim aliquip incididunt irure cupidatat nisi dolore in sunt ullamco qui commodo ut magna tempor ut eu in id mollit laboris excepteur irure sint et elit commodo cillum cillum nostrud dolor nulla sint nostrud veniam do aliquip consequat eiusmod fugiat officia dolor reprehenderit dolore eu dolor veniam sed dolor eu in mollit magna voluptate et ullamco incididunt esse esse aliquip ut elit nisi.Lorem ipsum proident cupidatat sed eiusmod est id occaecat eiusmod ut fugiat ut tempor ut esse exercitation sint est minim nulla in amet commodo dolore incididunt adipisicing est mollit tempor mollit tempor in non laboris officia proident reprehenderit fugiat adipisicing voluptate mollit labore cupidatat amet do non pariatur in id cupidatat deserunt sint tempor do dolor qui occaecat id cillum amet incididunt duis esse id incididunt ea duis voluptate nisi dolor proident consequat adipisicing elit ullamco sit eiusmod dolor excepteur sed ut officia sit pariatur ut incididunt ullamco excepteur pariatur in qui nulla excepteur ut veniam elit officia elit amet irure sed dolore dolore amet sit veniam incididunt commodo est sit mollit consequat sed cupidatat labore deserunt minim commodo dolore excepteur reprehenderit est labore est exercitation exercitation nostrud ad officia mollit consequat ea laborum et ullamco veniam cillum ad eiusmod veniam velit irure voluptate cillum quis anim enim voluptate in consectetur incididunt est proident nulla eiusmod excepteur et quis ea labore cillum nisi deserunt ad deserunt sed adipisicing sed dolore ut anim et duis sunt occaecat adipisicing.Mollit in commodo ut amet in nostrud id nostrud quis occaecat mollit ut mollit enim labore dolor nostrud occaecat sint non veniam sint do in consectetur excepteur magna nisi magna consectetur nisi enim ea ad occaecat veniam dolore fugiat exercitation tempor deserunt velit et ad proident deserunt adipisicing fugiat deserunt sint commodo tempor proident sint irure in ullamco dolore ex cillum quis sit in fugiat reprehenderit dolor mollit veniam nulla aliquip magna excepteur culpa veniam tempor amet do voluptate sint officia eiusmod est ut occaecat ea minim ut sunt quis enim est non veniam qui quis quis consequat qui do laborum nostrud cillum fugiat aute eu consectetur reprehenderit elit dolore dolore sint consequat non non ut esse laborum ut dolor in ea nostrud eiusmod duis aute irure dolor proident sit aliqua laboris qui labore ex aliquip cupidatat officia consectetur reprehenderit aliqua consectetur sunt cillum proident aute ullamco mollit ea consectetur mollit elit veniam dolor consectetur quis in est laborum sint nulla ad laborum in dolor dolor consectetur laborum id minim ut labore voluptate sit deserunt qui fugiat ullamco proident velit sunt ut ex occaecat.In consectetur cillum sed culpa nisi culpa consectetur amet laborum aute in cupidatat in consequat incididunt cupidatat tempor in laborum non mollit ex in sed duis duis sit veniam enim nisi dolore tempor adipisicing eu adipisicing veniam ea tempor sed ut aute est ullamco incididunt anim cillum esse nisi labore nostrud voluptate irure officia velit qui et eiusmod deserunt enim minim mollit proident culpa ut minim do velit eu ut enim ex nostrud eiusmod sunt esse consectetur cillum deserunt aliqua aute laboris sunt dolor voluptate excepteur ut ut qui velit aliquip et duis laborum eiusmod dolor aute aliqua ex velit dolor incididunt consequat do fugiat non tempor ut consectetur est do magna ad deserunt elit magna mollit eu laboris ad tempor occaecat fugiat laborum pariatur reprehenderit laborum sit enim cupidatat officia esse labore eu magna magna nostrud in ut nulla occaecat mollit laborum dolore labore fugiat.',
        cancelBtn        : 'Disagree',
        confirmBtn       : 'Agree',
    };

    Hubble.DocsDemo('.js-modal-trigger-3', () => Hubble.Modal({...options, scroll: 'modal'}));
   
    Hubble.DocsDemo('.js-modal-trigger-4', () => Hubble.Modal({...options, scroll: 'content'}));
});
</script>

---

### Customization

Modal positioning, sizing and animations are set via local CSS Variables on `.modal-wrap`. You can create a custom modal by either overriding the variables, or passing a custom modifier class to the `classes` option and then modifying the variables from there.

The example below shows a simple example of a modal that slides in from the bottom of the page without an overlay element:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-sm">
        <button class="js-modal-trigger-5 btn">Custom modal</button>
    </div>
</div>

```css
.modal-wrap.custom-modal
{
    --hb-modal-transform-off: translate3d(0, 100%, 0);
    --hb-modal-transition: opacity .125s ease, transform .225s ease;
    align-items: flex-end;
    padding-bottom: 50px;
}
```

```javascript
let modal = Hubble.Modal({
    title : 'Subscribe for $1?',
    content : 'Subscribe for $1 and get all my posts for free!',
    cancelBtn : 'Nah',
    confirmBtn : 'YES!',
    classes: 'custom-modal',
    overlay: false,
    closeAnywhere: false,
});
```

<style>
    .modal-wrap.custom-modal
    {
        --hb-modal-transform-off: translate3d(0, 100%, 0);
        --hb-modal-transition: opacity .125s ease, transform .225s ease;
        --hb-modal-max-width: 450px;
        align-items: flex-end;
        padding-bottom: 30px;
    }
</style>

<script type="text/javascript">
window.addEventListener('load', () =>
{
    Hubble.DocsDemo('.js-modal-trigger-5', () => Hubble.Modal({
        title : 'Subscribe for $1?',
        content : 'Subscribe for $1 and get all my posts for free!',
        cancelBtn : 'Nah',
        confirmBtn : 'YES!',
        classes: 'custom-modal',
        overlay: false,
        closeAnywhere: false,
    }));
});
</script>

---

### Callbacks

There are a number of callbacks available depending on what access you require. In the example below, the `callbackOpen` option is used to focus an input within the modal when it pops up:

See the [Options Section](#options) for a full list of callbacks.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-sm">
        <button class="js-modal-trigger-6 btn">Show form</button>
    </div>
</div>

```javascript
Hubble.Modal( {
    title: 'Subscribe',
    content: '....',
    callbackOpen: (modal) => find('.js-modal-input', modal).focus(),
});
```

<script type="text/javascript">
window.addEventListener('load', () =>
{
    const [dom_element] = Hubble.import(['dom_element']).from('_');

    const blurb = dom_element({tag: 'p', class: 'pole-xs pole-s', innerText: 'To subscribe to this website, please enter your email address here. We will send updates occasionally.'});

    const form = dom_element({tag: 'div', class: 'form-field row underlined'}, null, [
        dom_element({tag: 'input', name: 'email', type: 'email', placeholder: 'Your email address', class: 'js-modal-input'}),
        dom_element({tag: 'label', for: 'email', innerText: 'Email'}),
    ]);

    Hubble.DocsDemo('.js-modal-trigger-6', function()
    {
        Hubble.Modal({
            title: 'Subscribe',
            content: [blurb.cloneNode(true), form.cloneNode(true)],
            cancelBtn : 'Cancel',
            confirmBtn : 'Subscribe',
            callbackOpen: (modal) => this._.find('.js-modal-input', modal).focus(),
        })
    });
});
</script>

---

### Methods

Once a Modal instance is created, there are a few methods to interact with the modal:

The `open` method will animate and open the modal:

```javascript
modal.open();
```

The `close` method will animate and close the modal:

```javascript
modal.close();
```

The `direction` method returns the modal state which will be either `closed` or `open`:

```javascript
if (modal.state() === 'closed')
{

}
```

The `state` method returns the modal state which will be either `closed` or `open`:

```javascript
if (modal.state() === 'closed')
{

}
```

The `opened` method returns `true` if the modal is open or `false` if not

```javascript
if (modal.opened())
{

}
```

The `closed` method returns `true` if the modal is closed or `false` if not

```javascript
if (modal.closed())
{

}
```

Finally the `destroy` method completely removes the modal from the DOM and all related event listeners:

```javascript
modal.destroy()
```

---

### Options

There are a number of options for a modal depending on a given purpose. The table below outlines the available options:

| Option key         | Var Type                                     | Behavior                                                                          | Required | Default       |
|--------------------|----------------------------------------------|-----------------------------------------------------------------------------------|----------|---------------|
| `title`            | `string`                                     | Text to be displayed inside `.card-title`.                                        | `no`     | `null`        |
| `message`          | `string`, `Array`, `Nodelist`, `HTMLElement` | Content to be displayed inside `.card-body >`.                                    | `no`     | `null`        |
| `classes`          | `string`                                     | Any additional classes to pass to the modal                                       | `no`     | `null`        |
| `custom`           | `Boolean`                                    | Creates an un-formatted modal based on `content`                                  | `no`     | `false`       |
| `state`            | `string`                                     | Initial state when first created - `open` or `closed`.                            | `no`     | `open`        |
| `overlay`          | `string` `Boolean`                           | Either `light` , `dark` or `false`  if no overlay is wanted                       | `no`     | `dark`        |
| `closeAnywhere`    | `boolean`                                    | Modal can be closed by clicking anywhere outside of it.                           | `no`     | `true`        |
| `cancelBtn`        | `string`                                     | Inner text on cancel button. No cancel button will be rendered if not provided.   | `no`     | `null`        |
| `cancelClass`      | `string`                                     | Btn variant/context class for cancel btn. e.g `.btn-danger`.                      | `no`     | `null`        |
| `confirmBtn`       | `string`                                     | Inner text on confirm button. No confirm button will be rendered if not provided. | `no`     | `null`        |
| `confirmClass`     | `string`                                     | Btn variant/context class for cancel btn. e.g `.btn-success`.                     | `no`     | `` |
| `callbackBuilt`    | `function`                                   | Callback function to be called when modal is built but not rendered.              | `no`     | `null`        |
| `callbackRender`   | `function`                                   | Callback function to be called when modal is rendered into DOM.                   | `no`     | `null`        |
| `callbackOpen`     | `function`                                   | Callback function to be called when modal is opened.                              | `no`     | `null`        |
| `callbackClose`    | `function`                                   | Callback function to be called when modal is closed.                              | `no`     | `null`        |
| `callbackValidate` | `function`                                   | Callback function to validate if modal can be closed. Must return boolean         | `no`     | `null`        |

---

### HTML Initialization

For basic use-cases where access to the underlying JavaScript is not required, Modals can be enabled through HTML markup via an anchor element with the `.js-modal-trigger` class.

For basic HTML string content, simply use the `data-content` attribute with any required string content to populate the modal.

For more complex requirements point to the id of a hidden target element element in the DOM with the `data-content` attribute. Remember to always include the `#` character before the ID as this differentiates it from it being interpenetrated as a string.

All other options can be set through `data-attributes` on the anchor element in `hyphen-case`. For example to set the `closeAnywhere` option, you would set the `data-close-anywhere="true"` attribute.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center pole-sm">
        <button type="button" class="btn js-modal-trigger" data-confirm-btn="Confirm" data-content="#html-modal">Show Modal</button>
        <div id="html-modal" style="display: none;"> 
            <p>Let X help apps determine location. This means sending anonymous location data to X, even when no apps are running.</p>
        </div>
    </div>
</div>

```html
<button type="button" class="btn js-modal-trigger" data-content="#my-modal">Toggle</button>

<div id="my-modal">...</div>
```

---


### CSS Customization

Modals use a combination of both local CSS variables on `.modal-wrap`, `.modal-overlay` and Sass variables for enhanced component customization and styling.

Customization via Sass can be made in the `src/scss/_config.scss` file in Hubble's source.

```file-path
`src/scss/_config.scss`
```
```scss
$modal-max-width:               680px !default;
$modal-max-height:              80vh !default;
$modal-shadow:                  3 !default; //0,1,2,3 
$modal-overlay-bg:              rgba(255, 255, 255, 0.8) !default;
$modal-overlay-bg-dark:         rgba(0, 0, 0, 0.5) !default;
$modal-title-size:              1.8rem !default;
$modal-transform-on:            translate3d(0px, 0px, 0px) !default;
$modal-transform-off:           translate3d(0px, -50px, 0px) !default;
$modal-transition:              opacity .225s ease-out .225s, transform .225s ease-out .225s !default;
$modal-overlay-transition:      opacity .225s ease-out !default;
```

```file-path
`src/scss/components/_modal.scss`
```
```scss
.modal-wrap
{
    --hb-modal-title-size: #{$modal-title-size};
    --hb-modal-transition: #{$modal-transition};
    --hb-modal-max-width: #{$modal-max-width};
    --hb-modal-max-height: #{$modal-max-height};
    --hb-modal-transform-on: #{$modal-transform-on};
    --hb-modal-transform-off: #{$modal-transform-off};
}
.modal-overlay
{
    --hb-modal-overlay-bg: #{$modal-overlay-bg};
    --hb-modal-overlay-bg-dark: #{$modal-overlay-bg-dark};
    --hb-modal-overlay-transition: #{$modal-overlay-transition};
}
```