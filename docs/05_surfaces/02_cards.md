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
*   [Scrollable](#scrollable)
*   [Primary Action](#primary-action)
*   [CSS Customization](#css-customization)

---

### Basic example

Cards are built with as little markup and styles as possible, but still manage to deliver control and customization.

Cards consist of the following blocks, which can be moved around interchangeably within a card:

1. `.card-header`
2. `.card-media`
3. `.card-block`
4. `.card-footer`

Below is an example of a basic card with some text content.

<div class="code-content-example">
    <div class="flex-row align-cols-center">
        <div class="card col col-md-8 col-lg-5">
            <div class="card-block">
                <h4 class="card-title">This Is MAGA Country</h4>
                <span class="card-subtitle">Make America Great Again</span>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
            </div>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-block">
        <h4 class="card-title">This Is MAGA Country</h4>
        <span class="card-subtitle">Make America Great Again</span>
        <p>...</p>
    </div>
</div>
```

---

### Media

To render media inside a card, wrap an image in a `.card-media` block. Media can be placed at the at the top, bottom or center of a card:

<div class="code-content-example">
   <div class="flex-row col-gaps-xs row-gaps-xs">
        <div class="card col col-lg-4">
            <div class="card-media">
                <img data-src="../../../dist/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" />
            </div>    
            <div class="card-block">
                <h4 class="card-title">This Is MAGA Country</h4>
                <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
            </div>
            <div class="card-footer">
                <div class="card-footer-left">
                    <div class="avatar">
                        <img data-src="../../../dist/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-avatar_thumb.jpg" />
                    </div>
                </div>
                <div class="card-footer-content p5">
                    <div class="text-bold">The Don</div>
                    <div class="color-gray font-italic">Make America Great Again</div>
                </div>
            </div>
        </div>
        <div class="card col col-lg-4">
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
        </div>
        <div class="card col col-lg-4">
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
            <div class="card-block">
                <h4 class="card-title">This Is MAGA Country</h4>
                <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
            </div>
            <div class="card-media">
                <img data-src="../../../dist/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" />
            </div> 
        </div>
    </div>
</div>

```html
<div class="flex-row col-gaps-xs">
    <div class="card col col-lg-4">
        <div class="card-media">
            <img ... />
        </div>    
        <div class="card-block">
            ...
        </div>
        <div class="card-footer">
            ...
        </div>
    </div>
    <div class="card col col-lg-4">
        <div class="card-header">
            ...
        </div>
        <div class="card-media">
            <img ... />
        </div>
        <div class="card-block">
            ...
        </div>
    </div>
    <div class="card col col-lg-4">
        <div class="card-header">
            ...
        </div>
        <div class="card-block">
            ...
        </div>
        <div class="card-media">
            <img ... />
        </div> 
    </div>
</div>
```

#### Background images

You can also make use of FrontBx's `.bg-image` inside a `.card-media` block if you need a fixed height image at a specific aspect ratio:

<div class="code-content-example">
    <div class="flex-row align-cols-center">
        <div class="card col col-md-8 col-lg-5">
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
                <div data-src="../../../dist/img/trump-hero.jpg" class="bg-image js-lazyload lazyload grayscale" style="background-image: url(../../../dist/img/trump-hero_thumb.jpg)"></div>
            </div>
            <div class="card-block">
                <h4 class="card-title">This Is MAGA Country</h4>
                <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
            </div>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-header">
        ...
    </div>
    <div class="card-media">
        <div class="bg-image" style="background-image: url(...)"></div>
    </div>
    <div class="card-block">
        ...
    </div>
</div>
```

---

### Landscape

Landscape cards have their media to left or right of their content. You'll need to add `.card-landscape` modifier to the card.

If using `card-header` or `.card-footer`, you'll need to your card content in a `<div>`:

<div class="code-content-example">
    <div class="flex-row align-cols-center row-gaps-sm">
        <div class="col col-lg-8 card card-landscape">
            <div>
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
                <div class="card-block">
                    <h4 class="card-title">This Is MAGA Country</h4>
                    <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
                </div>
            </div>
            <div class="card-media">
                <img data-src="../../../dist/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" />
            </div> 
        </div>
        <div class="col col-lg-8 card card-landscape">
            <div class="card-media">
                <img data-src="../../../dist/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" />
            </div> 
            <div>
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
                <div class="card-block">
                    <h4 class="card-title">This Is MAGA Country</h4>
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

Add the `.responsive` modifier class to `.card.card-landscape` to make it stack like a regular card on screens below `md` breakpoint.

<div class="code-content-example">
    <div class="flex-row align-cols-center row-gaps-xs">
        <div class="col col-lg-8 card card-landscape responsive">
            <div class="card-media">
                <img data-src="../../../dist/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" />
            </div> 
            <div>
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
                <div class="card-block">
                    <h4 class="card-title">This Is MAGA Country</h4>
                    <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
                </div>
            </div>  
        </div>
    </div>
</div>

---

### Header

Add an optional header within a card by using `.card-header`, remember to wrap any content in `.card-header-content`

<div class="code-content-example">
    <div class="flex-row align-cols-center">
        <div class="card col col-md-8 col-lg-5">
            <div class="card-header">
                <div class="card-header-content">
                    <div class="avatar">
                        <img data-src="../../../dist/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-avatar_thumb.jpg" />
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
        <div class="card-header-content">
            ...
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
        <div class="card col col-md-8 col-lg-5">
            <div class="card-header">
                <div class="card-header-left">
                    <div class="avatar">
                        <img src="../../../dist/img/trump-avatar.jpg" />
                    </div>
                </div>
                <div class="card-header-content">
                    <h5 class="card-title">The Don</h5>
                    <div class="card-subtitle">Make America Great Again</div>
                </div>
                <div class="card-header-right">
                    <div class="drop-container">
                        <button type="button" class="btn btn-pure btn-circle btn-sm btn-dropdown js-drop-trigger">
                            <span class="fa fa-flickr"></span>
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

Add an optional footer within a card by using `.card-footer`, remember to wrap any content in `.card-footer-content`:

<div class="code-content-example">
    <div class="flex-row align-cols-center">
        <div class="card col col-md-8 col-lg-5">
            <div class="card-media">
                <img data-src="../../../dist/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" />
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

`.card-footer` has two additional child elements for aligning items inside it `.card-footer-left` and `.card-footer-right`:

<div class="code-content-example">
    <div class="flex-row align-cols-center">
        <div class="card col col-md-8 col-lg-5">
            <div class="card-header">
                <div class="card-header-left">
                    <div class="avatar">
                        <img src="../../../dist/img/trump-avatar.jpg" />
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
                    <span class="fa fa-github icon-lg"></span>
                </div>
                <div class="card-footer-content">
                    <button class="btn btn-pure btn-primary">Action</button>
                </div>
                <div class="card-footer-right">
                    <div class="drop-container">
                        <button type="button" class="btn btn-pure btn-circle btn-sm btn-dropdown js-drop-trigger">
                            <span class="fa fa-flickr"></span>
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
    <div class="flex-row align-cols-center">
        <div class="card col col-md-8 col-lg-5">
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
    <div class="flex-row align-cols-center">
        <div class="card col col-md-8 col-lg-5">
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
                <div class="hide-overflow collapsed" id="toggle-content">
                    <p>Lorem ipsum dolor sit amet</p>
                    <p>Consectetur adipiscing elit</p>
                    <p class="no-margin">Sed do eiusmod tempor incididunt</p>
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
        ...
    </div>
    <div class="card-block">
        <p>...</p>
        <p>...</p>
    </div>
    <div class="card-divider"></div>
    <div class="card-footer">
        ...
    </div>
</div>
```

---

### Tables

To add tables to simply add the table markup without a `.card-block` so it spans the full width of the card.

<div class="code-content-example">
    <div class="flex-row align-cols-center">
        <div class="card col col-lg-8">
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
            <div class="card-block">
                <h4 class="card-title">This Is MAGA Country</h4>
                <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
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

### Scrollable

There are two different ways to scroll content on a card. Use `.card-scrollable` to make the entire card scrollable, or `.card-scrollable-content` to to make the card's content scrollable while the footer and header are in fixed piositons:

<div class="code-content-example">
    <div class="flex-row align-cols-center col-gaps-sm">
        <div class="card card-scrollable col-6" style="height: 600px;">
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
            <div class="card-block">
                <h4 class="card-title">This Is MAGA Country</h4>
                <span class="card-subtitle">Make America Great Again</span>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
            </div>
            <div class="card-footer">
                <div class="card-footer-content">
                    <button class="btn btn-pure btn-primary btn-xs">Share</button>
                </div>
            </div>
        </div>
        <div class="card card-scrollable-content col-6" style="height: 600px;">
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
            <div class="card-block">
                <h4 class="card-title">This Is MAGA Country</h4>
                <span class="card-subtitle">Make America Great Again</span>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
                <p>Mollit aliquip adipisicing aliqua velit irure consequat proident sed culpa eiusmod culpa consectetur velit excepteur est amet pariatur in sunt esse ex anim exercitation mollit ea commodo.</p>
            </div>
            <div class="card-footer">
                <div class="card-footer-content">
                    <button class="btn btn-pure btn-primary btn-xs">Share</button>
                </div>
            </div>
        </div>
    </div>
</div>

```html
<div class="card card-scrollable">
    <div class="card-block">
        <h4 class="card-title">This Is MAGA Country</h4>
        <span class="card-subtitle">Make America Great Again</span>
        <p>...</p>
    </div>
</div>
```



### Primary Action

Add the `.primary-action` to any element inside a card or the card itself to make it clickable with a ripple effect:

<div class="code-content-example">
   <div class="flex-row col-gaps-xs row-gaps-xs align-cols-center-x align-cols-y-stretch">
        <div class="card col col-lg-4 primary-action">
            <div class="card-media">
                <img data-src="../../../dist/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" />
            </div>    
            <div class="card-block">
                <h4 class="card-title">This Is MAGA Country</h4>
                <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
            </div>
            <div class="card-footer">
                <div class="card-footer-left">
                    <div class="avatar">
                        <img data-src="../../../dist/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-avatar_thumb.jpg" />
                    </div>
                </div>
                <div class="card-footer-content p5">
                    <div class="text-bold">The Don</div>
                    <div class="color-gray font-italic">Make America Great Again</div>
                </div>
            </div>
        </div>
        <div class="card col col-lg-4">
            <div class="primary-action">
                <div class="card-media">
                    <img data-src="../../../dist/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" />
                </div>    
                <div class="card-block">
                    <h4 class="card-title">This Is MAGA Country</h4>
                    <p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>
                </div>
            </div>
            <div class="card-footer">
                <div class="card-footer-content">
                    <button class="btn btn-pure btn-primary btn-xs">Share</button>
                </div>
            </div>
        </div>
    </div>
</div>

```html
<div class="card primary-action">
    <div class="card-media">
        <img ... />
    </div>
    <div class="card-block">
        ...
    </div>
    <div class="card-footer">
        ...
    </div>
</div>
<div class="card">
    <div class="primary-action">
        <div class="card-media">
            <img ... />
        </div>
        <div class="card-block">
            ...
        </div>
    </div>
    <div class="card-footer">
        ...
    </div>
</div>
```

---

### CSS Customization

Cards use a combination of both local CSS variables on `.card` and Sass variables for enhanced component customization and styling. The base values are used by the UI to create all the sizing. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
$card-bg:                       var(--hb-white) !default;
$card-bg-focus:                 var(--hb-white) !default;
$card-color:                    var(--hb-gray-900) !default;
$card-title-color:              var(--hb-body-color) !default;
$card-line-height:              1.8 !default;
$card-border-radius:            var(--hb-border-radius) !default;
$card-border-width:             0 !default;
$card-border-color:             var(--hb-gray-300) !default;
$card-box-shadow:               var(--hb-raised-level-two) !default;
$card-box-shadow-hover:         var(--hb-raised-level-two) !default;
$card-spacer-y:                 1.2rem !default;
$card-spacer-x:                 1.6rem !default;
$card-divider-color:            var(--hb-gray-300) !default;
$card-divider-size:             1px !default;
$card-divier-space:             1rem !default;
$card-actions-spacer-y:         2rem !default;
$card-actions-spacer-x:         0.5rem !default;
$card-media-padding:            0 !default;
$card-media-bg:                 var(--hb-gray-100) !default;
$card-landscape-img-sm:         80px !default;
$card-landscape-img-md:         150px !default;
$card-landscape-img-lg:         300px !default;
```

```file-path
src/scss/components/_card.scss
```
```sass
.card
{
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
    --hb-card-divider-color:    #{$card-divider-color};
    --hb-card-divider-size:     #{$card-divider-size};
    --hb-card-divier-space:     #{$card-divier-space};
    --hb-card-actions-spacer-y: #{$card-actions-spacer-y};
    --hb-card-actions-spacer-x: #{$card-actions-spacer-x};
    --hb-card-media-padding:    #{$card-media-padding};
    --hb-card-media-bg:         #{$card-media-bg};
    --hb-card-landscape-sm:     #{$card-landscape-img-sm};
    --hb-card-landscape-md:     #{$card-landscape-img-md};
    --hb-card-landscape-lg:     #{$card-landscape-img-lg};
}
```