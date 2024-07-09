# Cards

A card is a flexible and extensible content container. It includes options for headers and footers, a wide variety of content, contextual background colors, and powerful display options.

---

*   [Basic example](#basic-example)
*   [Blocks](#Blocks)
*   [Text](#Text)
*   [Images](#Images)
*   [Header](#Header)
*   [Actions](#Actions)
*   [Overflow](#Overflow)
*   [Divider](#Divider)
*   [Tables](#Tables)
*   [CSS](#CSS)

---

Basic example
-------------

Cards are built with as little markup and styles as possible, but still manage to deliver a ton of control and customization.

Below is an example of a basic card with mixed content and a fixed width. Cards have no fixed width to start, so they’ll naturally fill the full width of its parent element. This is easily customized with our various sizing options.

<div class="code-content-example">
    <div class="card" style="width: 300px;">
        <div class="card-img-top"><span class="ripple-container js-ripple-container"></span><img class="img-responsive" data-src="holder.js/100px180/" alt="100%x180" style="height: 180px; width: 100%; display: block;" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22318%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20318%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_15a63dd608b%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A16pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_15a63dd608b%22%3E%3Crect%20width%3D%22318%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22118.0859375%22%20y%3D%2297.2%22%3E318x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" data-holder-rendered="true"></div>
        <div class="card-block">
            <h4 class="card-title">Card title</h4>
            <h6 class="card-subtitle">Card subtitle</h6>
            <p class="card-text">Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-img-top"><img class="img-responsive" src="..."></div>
    <div class="card-block">
        <h4 class="card-title">Card title</h4>
        <h6 class="card-subtitle">Card subtitle</h6>
        <p class="card-text">....</p>
    </div>
</div>
```