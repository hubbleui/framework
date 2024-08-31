# Collapse

---

FrontBx's Collapse utility offers an easy to use, simple HTML initialized way to toggle collpased content height via a trigger.

The component uses a small amount of CSS, but mostly JavaScript to provide smooth and consistent transitions no matter the content size via animations

---

*   [Basic example](#basic-example)
*   [Options](#options)
*   [JavaScript Behavior](#javaScript-behavior)

---

### Basic example

Add the `.js-collapse` class to clickable element, with the `data-collapse-target` attribute set as the `id` of the element you want to toggle.

<div class="code-content-example">
    <button class="btn js-collapse" data-collapse-target="toggle-content">View Information</button>
    <div class="hide-overflow collapsed" id="toggle-content">
        <div class="row roof-sm floor-sm">
            <p> Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, s ed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. </p>
        </div>
    </div>
</div>

```html
<button class="btn js-collapse" data-collapse-target="toggle-content">View Information</button>

<div class="hide-overflow collapsed" id="toggle-content">
...
</div>
```

---

### Options

Extra options can be set via HTML `data-attributes` on the `.js-collapse` trigger:

| Attribute               | Description                             | 
|-------------------------|-----------------------------------------|
| `data-collapse-target`  | Target element id                       |
| `data-collapse-speed`   | Speed of the animation in miliseconds   |
| `data-collapse-easing`  | Animation easing timing in `CamelCase`  |

```html
<button
    class="btn btn-block btn-lg btn-info js-collapse"
    data-collapse-target="toggle-content"
    data-collapse-speed="500"
    data-collapse-easing="easeInOutCirc">View Information</button>

```

---

### JavaScript Behavior

FrontBx fires a few custom events to attach onto when a a collapse trigger is clicked. The `event.detail.state` key will tell you weather the 

Not that the event is attached to the collapsing content rather than the trigger being clicked. 

| Event              | Description                                                             | 
|--------------------|-------------------------------------------------------------------------|
| `collapse:toggle`  | Fired immediately when collapse is toggled either open or closed        |
| `collapse:toggled` | Fired when the collapse has been opened and transitions have completed. |



```javascript

const collapse = document.getElementById('my-collapse-content')

collapse.addEventListener('collapse:open', event => 
{
    // Do something here  
})
```

---