# Lazyload

Hubble's handy Lazyload utility lets you gracefully load images asynchronously while the DOM renders, providing not only faster page load speeds but an elastically pleasing image loading experience for the user.

---

*   [Setup](#setuop)
*   [Markup](#Markup)
*   [Background image](#background-image)
*   [Fallback](#fallback)
*   [Dynamic Content](#dynamic-content)
*   [CSS Customization](#css-customization)

---

### Setup

Lazyloading requires a small amount of `JavaScript` and CSS loaded in the document head, preferably as high up possible.

```html
<script src="build/js/lazyload.js"></script>

<link rel="stylesheet" href="build/css/lazyload.css">
```

### Markup

Once that is setup, add your images, you'll want to have a reduced size thumbnail version of your image set as the `src` and the full size as the image `data-src`.

Remember to add the `.js-lazyload` `.lazyload` classes.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="avatar avatar-xl">
            <img alt="Trump" data-src="../../../build/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload" src="../../../build/img/trump-avatar_thumb.jpg" />
        </div>
    </div>
</div>

```html
<img alt="Trump" data-src="trump-hero.jpg" class="js-lazyload lazyload" src="trump-hero_thumb.jpg" />
```

Add the optional `.graysale` class to have the image fade from grayscale to full color.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="avatar avatar-xl">
            <img alt="Trump" data-src="../../../build/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload" src="../../../build/img/trump-avatar_thumb.jpg" />
        </div>
    </div>
</div>

```html
<img alt="Trump" data-src="trump-hero.jpg" class="js-lazyload lazyload grayscale" src="trump-hero_thumb.jpg" />
```

---

### Background image

Lazyloading works on CSS background image elements too. This can be handy when you need an image at a fixed height.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div style="height: 200px;width: auto;" data-src="../../../build/img/trump-hero.jpg" class="bg-image js-lazyload lazyload grayscale raised-1" style="background-image: url(../../../build/img/trump-hero_thumb.jpg)"></div>
    </div>
</div>

```html
<div data-src="trump-hero.jpg" class="bg-image js-lazyload lazyload grayscale" style="background-image: url(trump-hero_thumb.jpg)"></div>
```

Hubble's `.bg-image` image is a handy utility to help manage image sizing, simply add one of the aspect ratio modifier classes and ensure the element has either a width or height.

Landscape aspect ratio classes are:

*   `ratio-1-1`
*   `ratio-3-2`
*   `ratio-4-3`
*   `ratio-5-3`
*   `ratio-5-4`
*   `ratio-16-9`

And portrait aspect ratios:

*   `ratio-2-3`
*   `ratio-3-4`
*   `ratio-3-5`
*   `ratio-4-5`
*   `ratio-9-16`

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs">
        <div style="height: 200px;width: auto;" data-src="../../../build/img/trump-hero.jpg" class="bg-image ratio-2-3 js-lazyload lazyload grayscale raised-1" style="background-image: url(../../../build/img/trump-hero_thumb.jpg)"></div>
        <div style="height: 200px;width: auto;" data-src="../../../build/img/trump-hero.jpg" class="bg-image ratio-3-4 js-lazyload lazyload grayscale raised-1" style="background-image: url(../../../build/img/trump-hero_thumb.jpg)"></div>
        <div style="height: 200px;width: auto;" data-src="../../../build/img/trump-hero.jpg" class="bg-image ratio-3-5 js-lazyload lazyload grayscale raised-1" style="background-image: url(../../../build/img/trump-hero_thumb.jpg)"></div>
    </div>
</div>

```html
<div data-src="..." class="bg-image ratio-2-3 js-lazyload lazyload grayscale raised-1" style="background-image: url(...)"></div>
<div data-src="..." class="bg-image ratio-3-4 js-lazyload lazyload grayscale raised-1" style="background-image: url(...)"></div>
<div data-src="..." class="bg-image ratio-3-5 js-lazyload lazyload grayscale raised-1" style="background-image: url(...)"></div>
```

Background images can be customized using CSS variables below:

```css
.bg-image
{
    --hb-width: 100%;
    --hb-height: auto;
    --hb-aspect-ratio: 16/9;
}
```
---

### Fallback

Falback images gracefully display a simple icon and background when an image fails to load for whatever reason.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs">
        <div class="col col-12 col-md-3">
            <img alt="Trump" data-src="foobar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="foobar.jpg" />
        </div>
        <div class="col col-12 col-md-3">
            <div data-src="foobar.jpg" class="bg-image image-responsive ratio-1-1 js-lazyload lazyload grayscale" style="background-image: url(foobar.jpg)"></div>
        </div>
    </div>
</div>

```html
<img alt="Trump" data-src="foobar.jpg" class="img-responsive js-lazyload lazyload" src="foobar.jpg" />
<div data-src="foobar.jpg" class="bg-image image-responsive ratio-1-1 js-lazyload lazyload grayscale" style="background-image: url(foobar.jpg)"></div>
```

The fallback image is set via the JavaScript LazyLoad module from the variable `LAZY_FALLBACK_IMAGE`. You can change this by setting the variable to your own image before the LazyLoad script is called:

```html
<script type="text/javascript">var LAZY_FALLBACK_IMAGE = '...';</script>

<script src="build/js/lazyload.js"></script>

<link rel="stylesheet" href="build/css/lazyload.css">
```

---

### Dynamic content

If your inserting elements into the DOM after the page has loaded, you refresh the `LazyLoad` module via the Hubble's `dom`.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs js-image-insert">
    </div>
    <div class="flex-row-fluid align-cols-center pole-sm pole-n">
        <button class="btn js-trigger-image">Insert Image</button>
    </div>
    <script type="text/javascript">
        window.addEventListener('HubbleReady', function()
        {
            const wrapper = document.querySelector('.js-image-insert');

            document.querySelector('.js-trigger-image').addEventListener('click', () =>
            {
                wrapper.innerHTML += '<div class="avatar avatar-xl"><img alt="Trump" data-src="../../../build/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../build/img/trump-avatar_thumb.jpg" /></div>';

                Hubble.dom().refresh('LazyLoad');
            });
        });
    </script>
</div>

```javascript

Hubble.dom().refresh('LazyLoad');

```

---

### CSS Customization

Lazyloading uses a combination of both local CSS and Sass variables for enhanced component customization and styling across a range of components.

The CSS variables are set via Sass variables so customization pre-compilation is still possible.

Customization via Sass can be made in the `src/scss/_config.scss` file in Hubble's source.

```file-path
`src/scss/_config.scss`
```
```scss
$lazyload-start-opacity:        0.6 !default;
$lazyload-end-opacity:          1 !default;
$lazyload-start-blur:           5px !default;
$lazyload-end-blur:             0px !default;
$lazyload-start-grayscale:      1 !default;
$lazyload-end-grayscale:        0 !default;
$lazyload-transition:           opacity 1s cubic-bezier(0.4, 0.0, 0.2, 1), filter 1s cubic-bezier(0.4, 0.0, 0.2, 1);
$lazyload-falback-bg:           #d0d4d9;
```

```css
.lazyload
{
    --hb-lazyload-start-opacity: 0.6;
    --hb-lazyload-end-opacity: 1;
    --hb-lazyload-start-blur: 5px;
    --hb-lazyload-end-blur: 0px;
    --hb-lazyload-start-grayscale: 1;
    --hb-lazyload-end-grayscale: 0;
    --hb-lazyload-transition: opacity 1s cubic-bezier(0.4, 0.0, 0.2, 1), filter 1s cubic-bezier(0.4, 0.0, 0.2, 1);
    --hb-lazyload-falback-bg: #d0d4d9;

}
```
