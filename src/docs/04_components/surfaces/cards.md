# Cards

A card is a flexible and extensible content container. It includes options for headers and footers, a wide variety of content, contextual background colors, and powerful display options.

---

*   [Basic example](#basic-example)
*   [Media](#Media)
*   [Landscape](#landscape)
*   [Header](#header)
*   [Footer](#footer)
*   [Divider](#divider)
*   [Tables](#tables)
*   [Primary Action](#primary-action)
*   [CSS Customization](#css-customization)

---

### Basic example

Cards are built with as little markup and styles as possible, but still manage to deliver a ton of control and customization.

Below is an example of a basic card with mixed content and a fixed width. Cards have no fixed width to start, so they'll naturally fill the full width of its parent element. This is easily customized with our various sizing options.

<div class="code-content-example">
    <div class="flex-row align-cols-center">
        <div class="card col col-md-6">
            <div class="card-block">
                <h4 class="card-title">The Donald</h4>
                <span class="card-subtitle">Card subtitle</span>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
            </div>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-block">
        <h4 class="card-title">The Donald</h4>
        <span class="card-subtitle">Card subtitle</span>
        <p>...</p>
    </div>
</div>
```

---

### Media

Media can be placed at the top, bottom or center of a card:

<div class="code-content-example">
   <div class="flex-row align-cols-center">
        <div class="card col col-md-6">
            <div class="card-media">
                <img data-src="../../../../build/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../../build/img/trump-hero_thumb.jpg" />
            </div>    
            <div class="card-block">
                <h4 class="card-title">The Donald</h4>
                <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
            </div>
            <div class="card-footer">
                <div class="card-footer-content">
                    <button class="btn btn-pure btn-primary btn-sm">Share</button>
                    <button class="btn btn-pure btn-primary btn-sm">Learn More</button>
                </div>
            </div>
        </div>
    </div>
</div>


Media can be placed at the top, bottom or center of a card:

<div class="code-content-example">
    <div class="flex-row flex-row-xs-12 poles-xs gutters-xs align-items-top">        
        <div class="card col-lg-4">            
            <div class="card-block">
                <h4 class="card-title">The Donald</h4>
                <span class="card-subtitle">Card subtitle</span>
                <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
            </div>
            <div class="card-media">
                <img data-src="../../../../build/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../../build/img/trump-hero_thumb.jpg" />
            </div>
        </div>
        <div class="card col-lg-4">            
            <div class="card-block">
                <h4 class="card-title">The Donald</h4>
                <span class="card-subtitle">Card subtitle</span>
            </div>
            <div class="card-media">
                <img data-src="../../../../build/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../../build/img/trump-hero_thumb.jpg" />
            </div>
            <div class="card-block">
                <p>Qui ex irure do non laborum sed cillum mollit veniam excepteur tempor magna nostrud ut.</p>
            </div>
        </div>
        <div class="card col-lg-4">
            <div class="card-media">
                <img data-src="../../../../build/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../../build/img/trump-hero_thumb.jpg" />
            </div>         
            <div class="card-block">
                <h4 class="card-title">The Donald</h4>
                <span class="card-subtitle">Card subtitle</span>
                <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
            </div>
        </div>
    </div>
</div>

```html
<div class="card">            
    <div class="card-block">
        <h4 class="card-title">...</h4>
        <span class="card-subtitle">...</span>
        <p>...</p>
    </div>
    <div class="card-media">
        <img class="img-responsive" src="..." />
    </div>
</div>

<div class="card">            
    <div class="card-block">
        <h4 class="card-title">...</h4>
        <span class="card-subtitle">...</span>
    </div>
    <div class="card-media">
        <img class="img-responsive" src="..." />
    </div>
    <div class="card-block">
        <p>...</p>
        <button class="btn btn-primary">...</button>
    </div>
</div>
```

---

---

### Landscape

Landscape cards have their media to left or right of their content. You'll need to add `.card-landscape` modifier to the card.

If using `card-header` or `.card-footer`, you'll need to your card content in a `<div>`:

<div class="code-content-example">
    <div class="flex-row flex-row-12 align-cols-center poles-xs">
        <div class="card card-landscape col-lg-8">
            <div class="card-block">
                <h4 class="card-title">The Donald</h4>
                <span class="card-subtitle">Card subtitle</span>
                <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
            </div>
            <div class="card-media">
                <img data-src="../../../../build/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../../build/img/trump-hero_thumb.jpg" />
            </div>
        </div> 
        <div class="card card-landscape col-lg-8">
            <div class="card-media">
                <img data-src="../../../../build/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../../build/img/trump-hero_thumb.jpg" />
            </div>
            <div>
                <div class="card-header">
                    <div class="card-header-left">
                        <div class="avatar">
                            <img src="../../../../build/img/trump-avatar.jpg" />
                        </div>
                    </div>
                    <div class="card-header-content">
                        <h5 class="card-title">The Don</h5>
                        <div class="card-subtitle">Make America Great Again</div>
                    </div>
                    <div class="card-header-right">
                        <div class="drop-container">
                            <button type="button" class="btn btn-pure btn-circle btn-sm btn-dropdown js-drop-trigger">
                                <span class="glyph-icon glyph-icon-flickr"></span>
                            </button>
                            <div class="drop-menu drop-sw raised">
                                <div class="drop">
                                    <ul>
                                        <li class="drop-header">More</li>
                                        <li>
                                            <a href="#" title="">Menu 1</a>
                                        </li>
                                        <li>
                                            <a href="#" title="">Menu 2</a>
                                        </li>
                                        <li>
                                            <a href="#" title="">Menu 3</a>
                                        </li>
                                        <li class="divider"></li>
                                        <li>
                                            <a href="#" title="">More 1</a>
                                        </li>
                                        <li>
                                            <a href="#" title="">More 2</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-block">
                    <h4 class="card-title">The Donald</h4>
                    <span class="card-subtitle">Card subtitle</span>
                    <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
                </div>
            </div>
        </div>
    </div>
</div>

```html
<div class="card card-landscape">
    <div class="card-block">
        <h4 class="card-title">...</h4>
        <span class="card-subtitle">...</span>
        <p>...</p>
    </div>
    <div class="card-media">
        <img class="img-responsive" src="..." />
    </div>
</div>

<div class="card card-landscape">
    <div class="card-media">
        <img class="img-responsive" src="..." />
    </div>
    <div>
        <div class="card-header">
            ...
        </div>
        <div class="card-block">
            ...
        </div>
    </div>
</div>
```
---

### Header

Add an optional header within a card by using `.card-header`, remember to wrap any content in `.card-header-content`

<div class="code-content-example">
    <div class="flex-row align-cols-center">
        <div class="card col-md-6">
            <div class="card-header">
                <div class="card-header-content">
                    <h5 class="card-title">The Don</h5>
                    <div class="card-subtitle">Make America Great Again</div>
                </div>
            </div>
            <div class="card-block">
                <p>Proident minim veniam in adipisicing in adipisicing sint quis in commodo labore labore ea velit officia dolor incididunt nisi consequat ut in tempor id.</p>
            </div>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-header">
        <div class="card-header-content">
            <h5 class="card-title">...</h5>
            <div class="card-subtitle">...</div>
        </div>
    </div>
    <div class="card-block">
        <p>...</p>
    </div>
</div>
```

`.card-header` has two additional child elements for aligning items inside it `.card-header-left` and `.card-header-right`:

<div class="code-content-example">
    <div class="flex-row align-cols-center">
        <div class="card col-md-8 col-lg-6">
            <div class="card-header">
                <div class="card-header-left">
                    <div class="avatar">
                        <img src="../../../../build/img/trump-avatar.jpg" />
                    </div>
                </div>
                <div class="card-header-content">
                    <h5 class="card-title">The Don</h5>
                    <div class="card-subtitle">Make America Great Again</div>
                </div>
                <div class="card-header-right">
                    <div class="drop-container">
                        <button type="button" class="btn btn-pure btn-circle btn-sm btn-dropdown js-drop-trigger">
                            <span class="glyph-icon glyph-icon-flickr"></span>
                        </button>
                        <div class="drop-menu drop-sw raised">
                            <div class="drop">
                                <ul>
                                    <li class="drop-header">More</li>
                                    <li>
                                        <a href="#" title="">Menu 1</a>
                                    </li>
                                    <li>
                                        <a href="#" title="">Menu 2</a>
                                    </li>
                                    <li>
                                        <a href="#" title="">Menu 3</a>
                                    </li>
                                    <li class="divider"></li>
                                    <li>
                                        <a href="#" title="">More 1</a>
                                    </li>
                                    <li>
                                        <a href="#" title="">More 2</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-block">
                <p>Proident minim veniam in adipisicing in adipisicing sint quis in commodo labore labore ea velit officia dolor incididunt nisi consequat ut in tempor id.</p>
            </div>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-header">
        <div class="card-header-left">
            ...
        </div>
        <div class="card-header-content">
            ...
        </div>
        <div class="card-header-right">
            ...
        </div>
    </div>
    <div class="card-block">
        ...
    </div>
</div>
```

---

### Footer

Add an optional footer within a card by using `.card-footer`, remember to wrap any content in `.card-footer-content`

<div class="code-content-example">
    <div class="container-fuid" style="width: 300px">
        <div class="card">
            <div class="card-media">
                <img data-src="../../../../build/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../../build/img/trump-hero_thumb.jpg" />
            </div>
            <div class="card-block">
                <p>Proident minim veniam in adipisicing in adipisicing sint quis in commodo labore labore ea velit officia dolor incididunt nisi consequat ut in tempor id.</p>
            </div>
            <div class="card-footer">
                <div class="card-footer-content">
                    <button class="btn btn-pure btn-primary">Action 1</button>
                    <button class="btn btn-pure btn-primary">Action 2</button>
                </div>
            </div>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-media">
        <img class="img-responsive" src="..." />
    </div>
    <div class="card-block">
        <p>...</p>
    </div>
    <div class="card-footer">
        <div class="card-footer-content">
            <button class="btn btn-pure btn-primary">Action 1</button>
            <button class="btn btn-pure btn-primary">Action 2</button>
        </div>
    </div>
</div>
```

`.card-header` has two additional child elements for aligning items inside it `.card-header-left` and `.card-header-right`:

<div class="code-content-example">
    <div class="container-fuid" style="width: 300px">
        <div class="card">
            <div class="card-header">
                <div class="card-header-left">
                    <div class="avatar">
                        <img src="../../../../build/img/trump-avatar.jpg" />
                    </div>
                </div>
                <div class="card-header-content">
                    <h5 class="card-title">The Don</h5>
                    <div class="card-subtitle">Make America Great Again</div>
                </div>
            </div>
            <div class="card-block">
                <p>Proident minim veniam in adipisicing in adipisicing sint quis in commodo labore labore ea velit officia dolor incididunt nisi consequat ut in tempor id.</p>
            </div>
            <div class="card-footer">
                <div class="card-footer-left">
                    <span class="glyph-icon glyph-icon-github icon-lg"></span>
                </div>
                <div class="card-footer-content">
                    <button class="btn btn-pure btn-primary">Action</button>
                </div>
                <div class="card-footer-right">
                    <div class="drop-container">
                        <button type="button" class="btn btn-pure btn-circle btn-sm btn-dropdown js-drop-trigger">
                            <span class="glyph-icon glyph-icon-flickr"></span>
                        </button>
                        <div class="drop-menu drop-nw raised">
                            <div class="drop">
                                <ul>
                                    <li class="drop-header">More</li>
                                    <li>
                                        <a href="#" title="">Menu 1</a>
                                    </li>
                                    <li>
                                        <a href="#" title="">Menu 2</a>
                                    </li>
                                    <li>
                                        <a href="#" title="">Menu 3</a>
                                    </li>
                                    <li class="divider"></li>
                                    <li>
                                        <a href="#" title="">More 1</a>
                                    </li>
                                    <li>
                                        <a href="#" title="">More 2</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-header">
        ...
    </div>
    <div class="card-block">
        ...
    </div>
     <div class="card-footer">
        <div class="card-footer-left">...</div>
        <div class="card-footer-content">...</div>
        <div class="card-footer-right">...</div>
    </div>
</div>
```

---

### Divider

Dividers can be used to separate regions in cards or to indicate areas of a card that can expand. Dividers wrapped in `.card-block` should be used to separate content.

<div class="code-content-example">
    <div class="container-fuid" style="width: 300px">
        <div class="card">
            <div class="card-header">
                <div class="card-header-content">
                    <h5 class="card-title">The Don</h5>
                    <div class="card-subtitle">Make America Great Again</div>
                </div>
            </div>
            <div class="card-block">
                <p>Voluptate nisi in dolor occaecat dolor esse dolore est aliquip nulla et labore nostrud occaecat.</p>
                <div class="card-divider"></div>
                <p>Duis officia magna est culpa sint culpa enim sunt ex dolore est aliquip sunt velit exercitation fugiat.</p>
            </div>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-header">
        <div class="card-header-content">
            <h5 class="card-title">...</h5>
            <div class="card-subtitle">...</div>
        </div>
    </div>
    <div class="card-block">
        <p>...</p>
        <div class="card-divider"></div>
        <p>...</p>
    </div>
</div>
```

Dividers outside of `.card-block` should indicate areas of a card that can expand:

<div class="code-content-example">
    <div class="container-fuid" style="width: 300px">
        <div class="card">
            <div class="card-header">
                <div class="card-header-content">
                    <h5 class="card-title">The Don</h5>
                    <div class="card-subtitle">Make America Great Again</div>
                </div>
            </div>
            <div class="card-block">
                <p>Voluptate nisi in dolor occaecat dolor esse dolore est aliquip nulla et labore nostrud occaecat.</p>
                <p>Duis officia magna est culpa sint culpa enim sunt ex dolore est aliquip sunt velit exercitation fugiat.</p>
                <div class="hide-overflow collapsed" id="toggle-content">
                    <ul>
                        <li>Lorem ipsum dolor sit amet</li>
                        <li>Consectetur adipiscing elit</li>
                        <li>Sed do eiusmod tempor incididunt</li>
                    </ul>
                </div>
            </div>
            <div class="card-divider"></div>
            <div class="card-footer">
                <div class="card-footer-content">
                    <button type="button" class="btn btn-pure btn-sm btn-primary btn-sm js-collapse" data-collapse-target="toggle-content">Expand</button>
                </div>
            </div>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-header">
        <div class="card-header-content">
            <h5 class="card-title">...</h5>
            <div class="card-subtitle">...</div>
        </div>
    </div>
    <div class="card-block">
        <p>...</p>
        <div class="card-divider"></div>
        <p>...</p>
    </div>
</div>
```

### Tables

To add tables to simply add the table markup without a `.card-block` so it spans the full width of the card.

<div class="code-content-example">
    <div class="container-fuid" style="width: 600px">
        <div class="card">
            <div class="card-header">
                <div class="card-header-left">
                    <div class="avatar">
                        <span class="glyph-icon glyph-icon-github icon-lg"></span>
                    </div>
                </div>
                <div class="card-header-content">
                    <h5 class="card-title">The Don</h5>
                    <h6 class="card-subtitle">Make America Great Again</h6>
                </div>
            </div>
            <div class="card-block">
                <p>Ullamco excepteur veniam enim sed id dolor dolore velit adipisicing dolore ut sit commodo.</p>
            </div>
            <table class="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>John</td>
                        <td>Foobar</td>
                        <td>@fbar</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Joe</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td>James</td>
                        <td>the Bird</td>
                        <td>@twitter</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-header">
        ...
    </div>
    <div class="card-block">
        ...
    </div>
    <table class="table">
    ...
    </table>
    <div class="card-footer">
        ...
    </div>
</div>
```

---

### Primary Action

Add the `.primary-action` to any element inside a card or the card itself to make it clickable with a ripple effect:

<div class="code-content-example">
    <div class="flex-row flex-row-xs-12 flex-gutters-xs flex-poles-xs">
        <div class="card primary-action">            
            <div class="card-media">
                <img data-src="../../../../build/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../../build/img/trump-hero_thumb.jpg" />
            </div>
            <div class="card-block">
                <h4>The Don</h4>
                <p>In deserunt velit reprehenderit sint velit ea id ut adipisicing in mollit duis anim ut sint culpa sint deserunt qui velit duis reprehenderit commodo occaecat proident et pariatur amet cupidatat.</p>
            </div>
        </div>
        <div class="card">
            <div class="primary-action">
                <div class="card-media">
                    <img data-src="../../../../build/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../../build/img/trump-hero_thumb.jpg" />
                </div>
                <div class="card-block">
                    <h4>The Don</h4>
                    <p>In deserunt velit reprehenderit sint velit ea id ut adipisicing in mollit duis anim ut sint culpa sint deserunt qui velit duis reprehenderit commodo occaecat proident et pariatur amet cupidatat.</p>
                </div>
            </div>
            <div class="card-footer">
                <div class="card-footer-content">
                    <button class="btn btn-pure btn-primary">Share</button>
                </div>
            </div>
        </div>
    </div>
</div>

```html
<div class="card primary-action">            
    <div class="card-media">
        <img class="img-responsive" src="..." />
    </div>
    <div class="card-block">
        <h4>The Don</h4>
        <p>....</p>
    </div>
</div>
<div class="card">
    <div class="primary-action">
        <div class="card-media">
            <img class="img-responsive" src="..." />
        </div>
        <div class="card-block">
            <h4>The Don</h4>
            <p>...</p>
        </div>
    </div>
    <div class="card-footer">
        <div class="card-footer-content">
            <button class="btn btn-pure btn-primary">Share</button>
        </div>
    </div>
</div>
```

---

### CSS Customization

Cards use local <code>CSS Variables</code> on <code>.card</code> to enable easy on the fly customization. Values for the CSS variables are set via Sass, so Sass customization is still supported, too.</p>

</p>
                           

```html
--hb-card-bg:               #{$card-bg};
--hb-card-bg-focus:         #{$card-bg-focus};
--hb-card-color:            #{$card-color};
--hb-card-title-color:      #{$card-title-color};
--hb-card-line-height:      #{$card-line-height};
--hb-card-border-radius:    #{$card-border-radius};
--hb-card-border-width:     #{$card-border-width};
--hb-card-border-color:     #{$card-border-color};
--hb-card-box-shadow:       #{$card-box-shadow};
--hb-card-box-shadow-hover: #{$card-box-shadow-hover};
--hb-card-spacer-y:         #{$card-spacer-y};
--hb-card-spacer-x:         #{$card-spacer-x};
--hb-card-title-spacer-y:   #{$card-title-spacer-y};
--hb-card-divider-color:    #{$card-divider-color};
--hb-card-divider-size:     #{$card-divider-size};
--hb-card-divier-space:     #{$card-divier-space};
--hb-card-footer-spacer-y: #{$card-footer-spacer-y};
--hb-card-footer-spacer-x: #{$card-footer-spacer-x};
--hb-card-icon-color:       #{$card-icon-color};
--hb-card-icon-bg:          #{$card-icon-bg};
--hb-card-media-padding:      #{$card-media-padding};
--hb-card-media-bg:           #{$card-media-bg};
```
