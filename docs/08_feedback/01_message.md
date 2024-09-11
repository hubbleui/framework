# Message

---

FrontBx message provide contextual feedback messages for typical user actions user actions on page. They are also use as part of the built in JS Form Validation component.

---

*   [Basic example](#basic-example)
*   [Icons](#icons)
*   [Context](#context)
*   [Buttons](#buttons)
*   [Dismissible](#dismissible)
*   [JavaScript Behavior](#javaScript-behavior)
*   [CSS Customization](#css-customization)

---

### Basic example

A FrontBx message has specific markup that you must follow for it to be displayed correctly. Below is the most simple example:

<div class="code-content-example">    
    <div class="msg">
        <div class="msg-body">
            <p>This is an alert! Please read this carefully.</p>
        </div>
    </div>
</div>

```html
<div class="msg">
    <div class="msg-body">
        <p>This is an alert! Please read this carefully.</p>
    </div>
</div>
```

---

### Icons

FrontBx messages have built in styles for icons to help display a message's context to the user quickly:

<div class="code-content-example">    
    <div class="msg">
        <div class="msg-icon">
            <span class="fa fa-bell"></span>
        </div>
        <div class="msg-body">
            <p>This is an alert! Please read this carefully.</p>
        </div>
    </div>
</div>

```html
<div class="msg">
    <div class="msg-icon">
        <span class="fa fa-bell"></span>
    </div>
    <div class="msg-body">
        <p>This is an alert! Please read this carefully.</p>
    </div>
</div>
```

---

### Context

Add a class of `.msg-primary`, `.msg-info`, `.msg-success`, `.msg-warning` or `.msg-danger` to contextualize messages:

<div class="code-content-example">    
    <div class="flex-row row-gaps-xs">
        <div class="msg">
            <div class="msg-icon">
                <span class="fa fa-bell"></span>
            </div>
            <div class="msg-body">
                <p>This is an alert! Please read this carefully.</p>
            </div>
        </div>
        <div class="msg msg-info">
            <div class="msg-icon">
                <span class="fa fa-bell"></span>
            </div>
            <div class="msg-body">
                <p>This is an alert! Please read this carefully.</p>
            </div>
        </div>
        <div class="msg msg-success">
            <div class="msg-icon">
                <span class="fa fa-check"></span>
            </div>
            <div class="msg-body">
                <p>This is an alert! Please read this carefully.</p>
            </div>
        </div>
        <div class="msg msg-warning">
            <div class="msg-icon">
                <span class="fa fa-triangle-exclamation"></span>
            </div>
            <div class="msg-body">
                <p>This is an alert! Please read this carefully.</p>
            </div>
        </div>
        <div class="msg msg-danger">
            <div class="msg-icon">
                <span class="fa fa-xmark"></span>
            </div>
            <div class="msg-body">
                <p>This is an alert! Please read this carefully.</p>
            </div>
        </div>
    </div>
</div>

```html
<div class="msg">
    <div class="msg-icon">
        <span class="fa fa-bell"></span>
    </div>
    <div class="msg-body">
        <p>This is an alert! Please read this carefully.</p>
    </div>
</div>
```

---

### Buttons

Adding a button to a message is easy, simply wrap it in a `.msg-btn` element after the `.msg-body`:

<div class="code-content-example">    
    <div class="flex-row row-gaps-xs">
        <div class="msg">
            <div class="msg-icon">
                <span class="fa fa-bell"></span>
            </div>
            <div class="msg-body">
                <p>This is an alert! Please read this carefully.</p>
            </div>
            <div class="msg-btn">
                <button type="button" class="btn btn-primary btn-pure btn-sm" aria-label="Click me">WITH BUTTON</button>
            </div>
        </div>    
        <div class="msg msg-success">
            <div class="msg-icon">
                <span class="fa fa-check"></span>
            </div>
            <div class="msg-body">
                <p>This is an alert! Please read this carefully.</p>
            </div>
            <div class="msg-btn">
                <button type="button" class="btn btn-success btn-pure btn-sm" aria-label="Click me">WITH BUTTON</button>
            </div>
        </div>
    </div>
</div>

```html
<div class="msg">
    <div class="msg-icon">
        <span class="fa fa-bell"></span>
    </div>
    <div class="msg-body">
        <p>This is an alert! Please read this carefully.</p>
    </div>
    <div class="msg-btn">
        <button type="button" class="btn btn-primary btn-pure btn-sm" aria-label="Click me">WITH BUTTON</button>
    </div>
</div>
```

---

### Dismissible

Add a class of `.js-close-msg` to the button (or any element inside a message) to make the message removable by the user. The message will be removed from the DOM after it is clicked.

> Add a class of `.js-rmv-parent` to the trigger element to remove the message and its containing wrapper element. This is usufell when your message is wrapped in a spacing element that you want to remove at the same time.

<div class="code-content-example">    
    <div class="row">
        <div class="msg">
            <div class="msg-icon">
                <span class="fa fa-bell"></span>
            </div>
            <div class="msg-body">
                <p>This is an alert! Please read this carefully.</p>
            </div>
            <div class="msg-btn">
                <button type="button" class="btn btn-primary btn-pure btn-sm js-close-msg js-rmv-parent" aria-label="Close">Dismiss</button>
            </div>
        </div>
    </div>
</div>

```html
<div class="msg">
    <div class="msg-icon">
        <span class="fa fa-bell"></span>
    </div>
    <div class="msg-body">
        <p>This is an alert! Please read this carefully.</p>
    </div>
    <div class="msg-btn">
        <button type="button" class="btn btn-primary btn-pure btn-sm js-close-msg js-rmv-parent" aria-label="Close">Dismiss</button>
    </div>
</div>
```

---

### JavaScript Behavior

FrontBx fires two custom events to attach onto when a message is removed via a `.js-close-msg` click.

| Event            | Description                                                                      | 
|------------------|----------------------------------------------------------------------------------|
| `message:close`  | Fired immediately when close button is clicked                                   |
| `message:closed` | Fired when the message has been closed and the remove transitions have completed.|


```javascript

const myMsg = document.getElementById('myMsg')

myMsg.addEventListener('message:close', event => 
{
    // Do something here  
})
```

---

### CSS Customization

Messages use local CSS variables on `.msg` for enhanced component customization and styling. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.


```file-path
src/scss/components/_message.scss
```
```sass
--fbx-msg-bg: #{$msg-bg};
--fbx-msg-color: #{$msg-color};
--fbx-msg-icon-color: #{$msg-icon-color};
--fbx-msg-spacer-y: #{$msg-spacer-y};
--fbx-msg-spacer-x: #{$msg-spacer-x};
--fbx-msg-border-radius: #{$msg-border-radius};
--fbx-msg-font-size: #{$msg-font-size};
```

<br>

```file-path
src/scss/_config.scss
```
```sass
$msg-bg:                        var(--fbx-black) !default;
$msg-color:                     var(--fbx-white) !default;
$msg-icon-color:                var(--fbx-theme-primary) !default;
$msg-spacer-y:                  3rem !default;
$msg-spacer-x:                  2rem !default;
$msg-font-size:                 1.4rem !default;
$msg-border-radius:             var(--fbx-border-radius) !default;
```