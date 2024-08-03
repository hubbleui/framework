# Notification

Notifications are a handy `JavaScript` component for displaying messages to the. Notifications are highly customizable from both a `CSS` and `JavaScript` perspective.

---

*   [Example](#example)
*	[Options](#options)
*   [CSS Customization](#css-customization)

---

### Example

To display a notification, call the `Notifications` module with your options via the `Container`.

<div class="code-content-example">
    <button class="js-notif-trigger-1 btn btn-primary">Show Notification</button>
    <script type="text/javascript">
	    window.addEventListener('Hubble:ready', function()
	    {
	        document.querySelector('.js-notif-trigger-1').addEventListener('click', function()
	        {
	            Hubble.Notification(
	            {
	                text: 'Hello! I\'m a notification.',
	            });
	        });
	    });
    </script>
</div>

```JavaScript
Hubble.Notification(
{
	text  : `Hello! I'm a notification.`,
});
```

---

### Options

There are a number of options for a notification depending on a given purpose. The table below outlines the available options:

| Option key       | Var Type   | Behavior                                                                           | Required |
|------------------|------------|------------------------------------------------------------------------------------|----------|
| text             | `string`   | Text to be displayed inside the notification.                                      | `yes`    |
| timeout          | `int`      | Time in milliseconds when notification will be auto-dismissed. Defaults to `6000`. | `no`     |
| icon             | `string`   | Optional icon name. Gets set as `fa-[name]` if provided                    | `no`     |
| btn              | `string`   | Text to be displayed in a confirmation button.                                     | `no`     |
| variant          | `string`   | Optional message variant, gets set as `msg-[name]` if provided                     | `no`     |
| btnVariant       | `string`   | Btn variant/context class. Gets set as `btn-[name]` if provided.                   | `no`     |
| callbackOpen     | `function` | Callback function to be called notification is ready and displayed.                | `no`     |
| callbackBtn      | `function` | Callback function to be called when optional btn is clicked.                       | `no`     |
| callbackDismiss  | `function` | Callback function to be called when notification is removed.                       | `no`     |
| callbackValidate | `function` | Callback function to validate if notification can be closed. Must return `boolean` | `no`     |


Try out a few of the different examples below:

<div class="code-content-example">
    <button class="js-notif-trigger-2 btn btn-primary">Btn</button>
    <button class="js-notif-trigger-3 btn btn-primary">Icon</button>
    <button class="js-notif-trigger-4 btn btn-primary">Btn Variant</button>
    <button class="js-notif-trigger-5 btn btn-primary">Message Variant</button>
    <script type="text/javascript">
        window.addEventListener('Hubble:ready', function()
        {
            document.querySelector('.js-notif-trigger-2').addEventListener('click', function()
            {
                Hubble.Notification(
                {
                    btn  : `Dismiss`,
                    text : `Hello! I'm a notification.`,
                });
            });
            document.querySelector('.js-notif-trigger-3').addEventListener('click', function()
            {
                Hubble.Notification(
                {
                    icon : `bell`,
                    text : `Hello! I'm a notification.`,
                });
            });
            document.querySelector('.js-notif-trigger-4').addEventListener('click', function()
            {
                Hubble.Notification(
                {
                    btn        : `Danger`,
                    btnVariant : `danger`,
                    text       : `Hello! I'm a notification.`,
                });
            });
            document.querySelector('.js-notif-trigger-5').addEventListener('click', function()
            {
                Hubble.Notification(
                {
                    icon    : `check`,
                    variant : `success`, 
                    text    : `Hello! I'm a notification.`,
                });
            });
        });
    </script>
</div>

```JavaScript
Hubble.Notification(
{
    icon    : 'success',
    variant : 'success', 
    text    : `Hello! I'm a notification.`,
});
```

---

### CSS Customization

Notifications use a combination of both local CSS variables on `.msg` and Sass variables for enhanced component customization and styling.

Customization via Sass can be made in the `src/scss/_config.scss` file in Hubble's source.

```file-path
`src/scss/_config.scss`
```
```sass
$notif-bg:                      var(--hb-black) !default;
$notif-color:                   var(--hb-white) !default;
$notif-font-size:               1.2rem !default;
$notif-spacer-y:                2rem !default;
$notif-spacer-x:                2rem !default;
$notif-border-radius:           var(--hb-border-radius) !default;
$notif-shadow:                  3 !default;
```

```sass
.notification-wrap .msg
{
    --hb-msg-bg: #{$notif-bg};
    --hb-msg-color: #{$notif-color};
    --hb-msg-font-size: #{$notif-font-size};
    --hb-msg-spacer-y: #{$notif-spacer-y};
    --hb-msg-spacer-x: #{$notif-spacer-x};
    --hb-msg-border-radius: #{$notif-border-radius};
}
```

