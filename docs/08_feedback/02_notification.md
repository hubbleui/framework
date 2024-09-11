# Notification

Notifications are a handy `JavaScript` component for displaying messages to the. Notifications are highly customizable from both a `CSS` and `JavaScript` perspective.

---

*   [Example](#example)
*   [Position](#position)
*   [Content](#content)
*   [Timeout](#timeout)
*   [Methods](#methods)
*	[Options](#options)
*   [HTML Initialization](#html-initialization)
*   [CSS Customization](#css-customization)

---

### Example

To display a notification, call the `Notifications` module with your options via the `Container`.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center ">
        <button class="js-notif-trigger-1 btn">Show Notification</button>
    </div>
</div>

```JavaScript
let notif = FrontBx.Notification(
{
	text  : `Hello! I'm a notification.`,
});
```

<script type="text/javascript">
window.addEventListener('load', () =>
    FrontBx.DocsDemo('.js-notif-trigger-1', () =>
        FrontBx.Notification({
            text  : `Hello! I'm a notification.`,
        })
    )
);
</script>

---

### Position

Use the `position` option to set a notification in a desired position on the screen:

Available positions are:  `top-left` `top` `top-right` `left` `right` `bottom-left` `bottom` `top-right`

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs">
        <button class="js-notif-triggers-pos btn">top-left</button>
        <button class="js-notif-triggers-pos btn">top</button>
        <button class="js-notif-triggers-pos btn">top-right</button>
        <div class="col-12"></div>
        <button class="js-notif-triggers-pos btn">left</button>
        <button class="js-notif-triggers-pos btn">right</button>
        <div class="col-12"></div>
        <button class="js-notif-triggers-pos btn">bottom-left</button>
        <button class="js-notif-triggers-pos btn">bottom</button>
        <button class="js-notif-triggers-pos btn">bottom-right</button>
    </div>
</div>

```JavaScript
let notif = FrontBx.Notification(
{
    text  : `Hello! I'm a notification.`,
});
```

<script type="text/javascript">
window.addEventListener('load', () =>
    FrontBx.DocsDemo('.js-notif-triggers-pos', (e, trigger) =>
    {
        FrontBx.Notification({
            text: 'Hello! I\'m a notification.',
            position: trigger.innerText.trim()
        })
    })
);
</script>

---

### Content

Notifications have a few options for different use-cases. Use the provided options to add text and actions to a Notification:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="notification-wrap js-nofification-wrap active" style="position: relative;">
            <div class="msg msg-dense animate-in-up"><div class="msg-body"><p>Hello! I'm a notification.</p></div><div class="msg-btn"><button class="btn btn-pure btn-primary btn-sm js-notif-btn">Dismiss</button></div></div>
            <div class="msg msg-dense animate-in-up"><div class="msg-icon"><span class="fa fa-bell"></span></div><div class="msg-body"><p>Hello! I'm a notification.</p></div></div>
            <div class="msg msg-dense animate-in-up"><div class="msg-body"><p>Hello! I'm a notification.</p></div><div class="msg-btn"><button class="btn btn-pure btn-danger btn-sm js-notif-btn">Danger</button></div></div>
            <div class="msg msg-dense msg-success animate-in-up"><div class="msg-icon"><span class="fa fa-check"></span></div><div class="msg-body"><p>Hello! I'm a notification.</p></div></div>
        </div>
    </div>
</div>

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs">
        <button class="js-notif-trigger-2 btn">With button</button>
        <button class="js-notif-trigger-3 btn">With icon</button>
        <button class="js-notif-trigger-4 btn">Button variant</button>
        <button class="js-notif-trigger-5 btn">Message variant</button>
    </div>
</div>

```JavaScript
/* WITH BUTTON */
let notif1 = FrontBx.Notification(
{
    btn  : `Dismiss`,
    text : `Hello! I'm a notification.`,
});

/* WITH ICON */
let notif2 = FrontBx.Notification(
{
    icon : `bell`,
    text : `Hello! I'm a notification.`,
});

/* WITH BUTTON VARIANT */
let notif3 = FrontBx.Notification(
{
    btn        : `Danger`,
    btnVariant : `danger`,
    text       : `Hello! I'm a notification.`,
});

/* WITH MESSAGE VARIANT */
let notif4 = FrontBx.Notification(
{
    icon    : `check`,
    variant : `success`, 
    text    : `Hello! I'm a notification.`,
});
```

<script type="text/javascript">
window.addEventListener('load', () =>
{
    FrontBx.DocsDemo('.js-notif-trigger-2', () => FrontBx.Notification(
    {
        btn  : `Dismiss`,
        text : `Hello! I'm a notification.`,
    }));
    FrontBx.DocsDemo('.js-notif-trigger-3', () => FrontBx.Notification(
    {
        icon : `bell`,
        text : `Hello! I'm a notification.`,
    }));
    FrontBx.DocsDemo('.js-notif-trigger-4', () => FrontBx.Notification(
    {
        btn        : `Danger`,
        btnVariant : `danger`,
        text       : `Hello! I'm a notification.`,
    }));
    FrontBx.DocsDemo('.js-notif-trigger-5', () => FrontBx.Notification(
    {
        icon    : `check`,
        variant : `success`, 
        text    : `Hello! I'm a notification.`,
    }));
});
</script>

---

### Timeout

Notifications auto-dismiss after 6 seconds by default. You can set a different timeout in milliseconds on the `timeout` option, or set it to `false` if you don't want it to auto-dismiss.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs">
        <button class="js-notif-trigger-6 btn">Persistent</button>
        <button class="js-notif-trigger-7 btn">Timeout</button>
    </div>
</div>

```JavaScript
let notif1 = FrontBx.Notification(
{
    text  : `Hello! I'm a notification.`,
    timeout: false,
});

let notif2 =FrontBx.Notification(
{
    text  : `Hello! I'm a notification.`,
    timeout: 10000,
});
```

<script type="text/javascript">
window.addEventListener('load', () =>
{
    FrontBx.DocsDemo('.js-notif-trigger-6', () => FrontBx.Notification(
    {
        text: 'Hello! You need to click me to dismiss.',
        timeout: false,
    }));
   
    FrontBx.DocsDemo('.js-notif-trigger-7', function()
    {
        let start = 10;
        let i     = 1;
        let timer = setInterval(() => this._.find('.js-time', notif.domElement()).innerText = (start - i++), 1000);

        let notif = FrontBx.Notification(
        {
            text: 'Hello! I\'ll disappear in <span class="js-time">10</span> seconds.',
            timeout: 10000,
            callbackDismiss: () => clearInterval(timer)
        });
    });
});
</script>

---

### Methods

Once a Notification instance is created, there are a few methods to interact with it:

The `remove` method will animate and remove the notification:

```javascript
notification.remove();
```

The `domElement` method returns the notification HTMLElement, which is wrapped in a positioning element:

```javascript
notification.domElement();
```

The `callbackValidate` option when creating the notification allows you to run your own validation on whether the notification can be dismissed. Return `true` from this function to allow it or `false` if the user needs to take some sort of action:

```javascript
let notif = FrontBx.Notification(
{
    text  : `Hello! I'm a notification.`,

    callbackValidate: (element) =>
    {
        if (someCondition) return true;

        return false;
    }
});
```

---

### Options

The table below outlines the available options:

| Option key       | Var Type          | Behavior                                                                           | Required |
|------------------|-------------------|------------------------------------------------------------------------------------|----------|
| text             | `string`          | Text to be displayed inside the notification.                                      | `yes`    |
| timeout          | `integer` `false` | Time in milliseconds when notification will be auto-dismissed. Defaults to `6000`. | `no`     |
| icon             | `string`          | Optional icon name. Gets set as `fa-[name]` if provided                            | `no`     |
| btn              | `string`          | Text to be displayed in a confirmation button.                                     | `no`     |
| variant          | `string`          | Optional message variant, gets set as `msg-[name]` if provided                     | `no`     |
| btnVariant       | `string`          | Btn variant/context class. Gets set as `btn-[name]` if provided.                   | `no`     |
| callbackBuilt    | `function`        | Callback function to be called notification element is built but not rendered.     | `no`     |
| callbackRender   | `function`        | Callback function to be called notification is ready and displayed.                | `no`     |
| callbackDismiss  | `function`        | Callback function to be called when notification is removed.                       | `no`     |
| callbackValidate | `function`        | Callback function to validate if notification can be closed. Must return `boolean` | `no`     |

All callback functions receive the notification `HTMLElement` as their parameter.


---

### HTML Initialization

For basic use-cases where access to the underlying JavaScript is not required, Notifications can be enabled through HTML markup via an anchor element with the `.js-notification-trigger` class.

All options can be set through `data-attributes` on the anchor element in `hyphen-case`. For example to set the `btnVariant` option, you would set the `data-btn-variant="btn-primary"` attribute.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center pole-sm">
        <button type="button" class="btn js-notification-trigger" data-text="Hello, I'm a notification!">Trigger notification</button>
    </div>
</div>

```html
<button type="button" class="btn js-notification-trigger" data-text="Hello, I'm a notification!">Trigger notification</button>
```

---

### CSS Customization

Notifications use a combination of both local CSS and Sass variable on `.notification-wrap` with nested variables on `.msg` for enhanced component customization and styling.

For details on customizing message components, see the [Message Documentation](../message/index.html#css-customization)

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```scss
$notif-bg:                      var(--fbx-black) !default;
$notif-color:                   var(--fbx-white) !default;
$notif-font-size:               1.2rem !default;
$notif-spacer-y:                2rem !default;
$notif-spacer-x:                2rem !default;
$notif-border-radius:           var(--fbx-border-radius) !default;
$notif-shadow:                  3 !default;
```

```scss
.notification-wrap
{
    --fbx-notification-max-width: #{$notification-max-width};
    --fbx-notification-bg: #{$notification-bg};
    --fbx-notification-color: #{$notification-color};
}
.notification-wrap .msg
{
    --fbx-msg-bg: var(--fbx-notification-bg);
    --fbx-msg-color: var(--fbx-notification-color);
}
```
