# Popover

Similar to tooltip, popover allows you to display helper content and information to the user without taking up space in layouts. Popover are like tooltips but allow more customization and are typically used to larger blocks of information. 

---

*   [Markup](#markup)
*   [Options](#markup)
*   [JavaScript Instantiation](#javascript-instantiation)
*   [CSS Customization](#css-customization)

---

### Markup

Popovers can be instantiated automatically via HTML through a combination of classes and data-attributes. Below is an example of a basic hover popover.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs">
        <button class="btn js-popover" data-popover-theme="dark" data-popover-title="Popover Title" data-popover-content="Aliqua commodo fugiat pariatur fugiat est dolor ut cillum dolore esse aliquip voluptate dolore labore." data-popover-direction="top" data-popover-event="click">Dark!</button>
        <button class="btn js-popover"  data-popover-theme="light" data-popover-title="Popover Title" data-popover-content="Aliqua commodo fugiat pariatur fugiat est dolor ut cillum dolore esse aliquip voluptate dolore labore." data-popover-direction="top" data-popover-event="click">Light</button>
    </div>
</div>

```html
<button 
    class="btn js-popover"
    data-popover-title="Popover Title"
    data-popover-content="Aliqua commodo..."
    data-popover-direction="top"
    data-popover-event="click">Click me!</button>
```

---

### Data attributes
Data attributes placed on the target element define various behavior of the popover. The `data-popover-direction`, `data-popover-content`, `data-popover-title` must be used for the popover to be displayed correctly - All other `data-attributes` are optional.
  
| Attribute                | Possible Values                                                                       | Behavior                                                                       |
|--------------------------|---------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `data-popover-theme`     | `dark` `light`                                                                        | Changes the theme of the popover.                                              |
| `data-popover-direction` | `top` `bottom` `left` `right`                                                         | Changes the direction of the popover.                                          |
| `data-popover-title`     | `string`                                                                              | The string to placed as the popover title.                                     |
| `data-popover-content`   | `string`                                                                              | The string to placed as the popover text content.                              |
| `data-popover-type`      | `popover-primary` `popover-info` `popover-success` `popover-warning` `popover-danger` | The contextual classname. Changes the background color of the popover title.   |
| `data-popover-event`     | `click` `hover`                                                                       | Defines whether the popover is displayed on `:hover`, or toggled with a click. |
| `data-popover-animate`   | `pop` `fade`                                                                          | Changes the popover animation when it is displayed.                            |
| `data-popover-target`    | `string (node id)`                                                                    | Optional node id to clone and copy into the popover                            |


<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs">
        <button class="btn js-popover" data-popover-title="Popover Title" data-popover-content="Laborum qui aute nulla reprehenderit culpa dolore non eu proident do ut tempor aliqua magna." data-popover-direction="top" data-popover-type="popover-primary" data-popover-event="click" data-popover-animate="pop"> Click Me! </button>
        <button class="btn js-popover" data-popover-title="Popover Title" data-popover-content="Ullamco laborum velit dolore do minim cillum minim labore sint excepteur sint laboris cupidatat proident dolor." data-popover-direction="top" data-popover-type="popover-primary" data-popover-event="hover" data-popover-animate="fade"> Hover Me! </button>
    </div>
</div>

```html
<button class="btn js-popover"
    data-popover-title="Popover Title" 
    data-popover-content="Anim dolor..."  
    data-popover-direction="top" 
    data-popover-type="popover-primary" 
    data-popover-event="click" 
    data-popover-animate="pop">Click Me!</button>

<button class="btn js-popover"
    data-popover-title="Popover Title" 
    data-popover-content="Consequat ad..."  
    data-popover-direction="top" 
    data-popover-type="popover-primary" 
    data-popover-event="hover" 
    data-popover-animate="fade">Hover Me!</button>
```

---


### Templates
If you would prefer to customize the popover markup further, you can specify a DOM node by `id` in the `data-popover-target`.
The library will clone the target node and insert the copy into the popover's contents.

> Use the <em>.hidden</em> class on the target element to hide it so that it's not visible on the page.

<div class="code-content-example">
    <div class="container-fuid">
        <button class="btn js-popover" data-popover-target="target-node" data-popover-event="click" data-popover-animate="pop" data-popover-direction="top"> Click Me! </button>
        <div id="target-node" class="hidden pad-20">
            <p>This node is cloned and inserted into the popover!</p>
        </div>
    </div>
</div>

```html
<button class="btn js-popover"
    data-popover-target="target-node" 
    data-popover-event="click" 
    data-popover-animate="pop"
    data-popover-direction="top" 
>Click Me!
</button>
<div id="target-node" class="hidden pad-20">
    <p>This node is cloned and inserted into the popover!</p>
</div>
```

                    