# Pjax

FrontBx's `Pjax` Component allows you to easily handle dynamic DOM content and web-app style functionality via asynchronous requests, . 

---

*   [Introduction](#Introduction)
*   [HTML Initialization](#html-Initialization)
*   [Server Response](#server-response)
*   [JavaScript Usage](#javascript-usage)
*   [Events](#events)

---

### Introduction

Before we look at using the `Pjax` Component specifically, we should go over the concept as a whole. **Pjax** works by fetching HTML from your server via Ajax (GET) requests and replacing the content of a container element on your page with the loaded HTML.

It then updates the current URL in the browser using pushState.

An example of this might be a tab navigation that loads the content into the tab panel when the navigation link is clicked. The advantage here is that you:

1. Only load required `HTML` content that is necessary for the page over initial `GET` requests (smaller and faster page loads).
2. Additional content can be loaded via `GET` based on events/and/or server conditions, when it is needed.
3. Pages can show different views depending on a URL query string or URL.

Broadly speaking, Pjax follows a simple design pattern as follows:

1.  Page is loaded with only the required content for that specific page.
2.  An event (like clicking a button) triggers a `Pjax` request for content.
    _This may be navigating to a new page, or loading content such as a tab or sidebar._
3.  `JavaScript` makes a `GET` request to the server for the URL, with the `X-PJAX` header set.
4.  The server recognizes the request `Pjax` and returns only required HTML for what's being requested.
5.  Server sends back a valid `HTML` response.
6.  `JavaScript` appends the response into the `DOM`.
7.  User sees the content.

---

### HTML Initialization

Pjax can be invoked automatically via HTML via any clickable HTML anchor element. To enable Pjax on an element add the `.js-pjax-link` to the anchor element. 

For native link elements (`<a>`, the `href` attribute will be used as the request URL. For other element types, set the request URL as the `data-pjax-href` attribute.

Lastly, you can optionally provide the the `id` of the HTML response element to indicate where the response will be inserted into via `data-pjax-target` attribute. If this is omitted, Pjax assumes you're wanting to request an entire page and will replace the document `body`.

Additional options can be provided through `data-` attributes. The table below outlines available options and how they effect behavior.

| Attribute             | Default | Description                                                                                                  |
|-----------------------|---------|--------------------------------------------------------------------------------------------------------------|
| `href`                | `null`  | Used as the request URL to send request. Can be an absolute or a relative URL. Used on `<a>` elements only.  |
| `data-pjax-target`    | `null`  | Used as the request URL to send request. Can be an absolute or a relative URL.                               |
| `data-pjax-once`      | `false` | When set to `true` the request will only be sent once on first click.                                        |
| `data-pjax-nocache`   | `false` | When set to `true` a timestamp is appended to the URL query to ensure an un-cashed response.                 |
| `data-pjax-pushstate` | `false` | When set to `true` a new history state is created. If no `pjax-target` is provided it will default to `true` |
| `data-pjax-urlhash`   | `false` | When set to `true` and `pjax-target` is provided, the URL hash is updated with the id of the target element  |


> When response content contains CSS `<link>` tags or JavaScript `<script>` tags, Pjax automatically compares these to the currently loaded assets and will load them into the DOM if required. Additionally, Pjax will update the document title and meta description when `pushstate` is set to true and the response includes them. 

The link below would request send a Pjax request to `/my-page` and replace the entire document body:

```html
<a class="js-pjax-link" href="/my-page">My Page</button>
```

Here, the button will send a request to `/url?sidebar` and place the response into the element `#sidebar-wrapper`:

```html
<a class="js-pjax-link" href="/url?sidebar" data-pjax-target="sidebar-wrapper">Sidebar</button>
```

You may want the request to only happen once when it is first called, in this case add `data-pjax-once` attribute to the anchor:

```html
<a class="js-pjax-link" href="/url?sidebar" data-pjax-once="true" data-pjax-target="sidebar-wrapper">Sidebar</button>
```

Below is a simple example using a tab navigation to load content:

<div class="code-content-example">
    <ul class="tab-nav js-tab-nav">
        <li>
            <a href="../pjax_tabs_iframe1.html" class="active js-pjax-link" data-tab="panel-1" data-pjax-target="tab-1">Tab 1</a>
        </li>
        <li>
            <a href="../pjax_tabs_iframe2.html" class="js-pjax-link" data-tab="panel-2" data-pjax-target="tab-2">Tab 2</a>
        </li>
        <li>
            <a href="../pjax_tabs_iframe3.html" class="js-pjax-link" data-tab="panel-3" data-pjax-target="tab-3">Tab 3</a>
        </li>
    </ul>
    <div class="tab-panels js-tab-panels">
        <div class="tab-panel active" data-tab-panel="panel-1" id="tab-1">
            <div class="pad-20">
                <h4>Panel 1</h4>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </div>
        </div>
        <div class="tab-panel" data-tab-panel="panel-2" id="tab-2">
        </div>
        <div class="tab-panel" data-tab-panel="panel-3" id="tab-3">
        </div>
    </div>
</div>

```html
<ul class="tab-nav js-tab-nav">
    <li>
        <a href="/tab-1" class="active js-pjax-link" data-tab="panel-1" data-pjax-target="tab-1">Tab 1</a>
    </li>
    <li>
        <a href="/tab-2" class="js-pjax-link" data-tab="panel-2" data-pjax-target="tab-2">Tab 2</a>
    </li>
    <li>
        <a href="/tab-3" class="js-pjax-link" data-tab="panel-3" data-pjax-target="tab-3">Tab 3</a>
    </li>
</ul>
<div class="tab-panels js-tab-panels">
    <div class="tab-panel active" data-tab-panel="panel-1" id="tab-1">
        <div class="pad-20">
            <h4>Panel 1</h4>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
        </div>
    </div>
    <div class="tab-panel" data-tab-panel="panel-2" id="tab-2">
    </div>
    <div class="tab-panel" data-tab-panel="panel-3" id="tab-3">
    </div>
</div>
```

---

### Server Response

`Pjax` requests are made via HTTP `GET` requests. Your server can differentiate these requests from other incoming `GET` requests by checking if the `X-PJAX` header is sent with the request.

For example, in PHP:

```php
if (isset($_SERVER['X-PJAX']))
{
    # Send response
}
```

When sending a response, your server must send valid `HTML` markup, with the correct header type:

```php
header('Content-Type: text/html; charset=utf-8');

echo '<div>Hello World!</div>';
```

Server responses should not send an entire HTML `document`, it only needs return the content itself.

```php
header('Content-Type: text/html; charset=utf-8');

echo '<div>Hello World!</div>';
```

If Pjax is not supported on your server however, you can still send an entire HTML `document`. Pjax will parse the code and replace the document body.

```JavaScript
FrontBx.require('Pjax').invoke('/foo/bar');
```

```php
header('Content-Type: text/html; charset=utf-8');

echo '
<!DOCTYPE html>
<html lang="en">
    <head>
        ...
    </head>
    <body>
        <div>Hello World!</div>
    </body>
</html>
';
```

If the response contains a `<title>` element, and `stateChange` is set to true, that title will be used (regardless of if a full HTML `document` is sent).

```php
echo '
<title>Hello</title>
<div id="target-id">Hello World!</div>
';
```

---

### JavaScript Usage


The Pjax Component can be accessed directly via FrontBx's container using the `Pjax` key.

```JavaScript
let pjax = FrontBx.Pjax();
```

To make a request, use the `request` method:

```JavaScript
let pjax.request(url, options, success, error, complete, abort, headers);
```

Pjax extends FrontBx's Ajax Component so the callbacks folllow the same principles. For details on callbacks, see the [Ajax Documentation](/docs/javascript/pjax/index.html#arguments)

The options arguement is an Object with the following values / defaults

| Attribute   | Default | Description                                                                                             |
|-------------|---------|---------------------------------------------------------------------------------------------------------|
| `element`   | `body`  | Optional target element to insert response into                                                         |
| `cacheBust` | `false` | When set to `true` a timestamp is appended to the URL query to ensure an un-cashed response.            |
| `pushstate` | `false` | When set to `true` a new history state is created.                                                      |
| `urlhash`   | `false` | When set to `true` and `element` is provided, the URL hash is updated with the id of the target element |

---

### Events

Pjax will dispatch the following custom events on `window`. The provided options are set to `event.detail.options`:

| Attribute   Description |                                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------------------|
| `FrontBx:Pjax:start`     | Sent immediately before a Pjax request is made.                                                       |
| `FrontBx:Pjax:success`   | Sent after a successful Pjax request is made, DOM is updated and all assets have loaded.              |
| `FrontBx:Pjax:error`     | Sent when Pjax request receives an XHR error response.                                                |
| `FrontBx:Pjax:abort`     | Sent when Pjax request is interrupted and aborted by either another Pjax request or manually aborted. |

```JavaScript
window.addEventListener('FrontBx:Pjax:success', (e) =>
{
    let url = e.detail.options.url;

})
```


