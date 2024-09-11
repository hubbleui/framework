# Slider

FrontBx's Slider component can be used to cycle through content such as images, cards and text as a carousel.

---

*   [How it works](#how-it-works)
*   [Markup](#markup)
*   [Options](#options)
*   [JavaScript Instantiation](#javascript-instantiation)
*   [Dynamic JavaScript Instantiation](#dynamic-javascript-instantiation)
*   [CSS Customization](#css-customization)

---

### How it works

Slider creates an interactive, fully touch-enabled carousel element. It works with a series of images, text, or custom markup. It also includes support for previous/next controls, indicators and lots more options.

In browsers where the Page Visibility API is supported, the carousel will avoid sliding when the webpage is not visible to the user (such as when the browser tab is inactive, the browser window is minimized, etc.).

---

### Markup

Carousels don't automatically normalize slide dimensions, however in FrontBx's `config.scss` file there is a default width used for slides. You can set this up how you want or use CSS Variables to customize slide dimensions.

Carousels can be instantiated through `HTML` markup using the `.js-slider` class with `.slider` for styling. Options can be set using as `JSON` in the `data-slider-options` attribute.

Here's is a basic example:

<div class="code-content-example">
    <div class="slider js-slider" data-slider-options='{ "wrap": true }'>
        <div class="bg-salmon">1</div>
        <div class="bg-teal">2</div>
        <div class="bg-bb-blue">3</div>
        <div class="bg-salmon">4</div>
        <div class="bg-teal">5</div>
        <div class="bg-bb-blue">6</div>
    </div>
</div>

```html
<div class="slider js-slider" data-slider-options='{ "wrap": true }'>
    <div class="bg-salmon">1</div>
    <div class="bg-teal">2</div>
    <div class="bg-bb-blue">3</div>
    <div class="bg-salmon">4</div>
    <div class="bg-teal">5</div>
    <div class="bg-bb-blue">6</div>
</div>
```

---

### Options

Whether initializing via `HTML` or `JavaScript`, Slider options remain the same. The only difference is when Initialized via **JavaScript** you have direct reference to the `Slider` Component itself, which has a few helper methods.

The table below outlines the available options and their respective effects on the Slider

| Option          | Var Type            | Default       | Description                                                            |
|-----------------|---------------------|---------------|------------------------------------------------------------------------|
| `accessibility` | `Boolean`           | `true`        | Enables keyboard naviagation of slider via arrow keys.                 |
| `autoPlay`      | `Boolean` `Integer` | `3000`        | Autoplay interval in milliseonds, or false to disable.                 |
| `controls`      | `Boolean`           | `true`        | Enables/disables the previous and next buttons.                        |
| `dots`          | `Boolean`           | `true`        | Enables/disables dot indicator navigation                              |
| `draggable`     | `Boolean`           | `true`        | Enables dragging                                                       |
| `easing`        | `Boolean`           | `easeOutExpo` | JavaScript easing timing pattern in camelCase                          |
| `groupSlides`   | `Boolean`           | `false`       | Group slides into blocks of n                                          |
| `initialIndex`  | `Integer`           | `0`           | The initial DOMElement starting index slide                            |
| `mouseSupport`  | `Boolean`           | `true`        | Enable/Disable dragging with mouse. draggable must be set to true      |
| `pauseOnHover`  | `Boolean`           | `true`        | Pause autoplay on hover                                                |
| `resize`        | `Boolean`           | `true`        | Enable/disabled window resize listener to update the slider dimensions |
| `wrap`          | `Boolean`           | `true`        | Wrap slides to an infinite carousel                                    |

---

### JavaScript Instantiation

To manually Initialize a Slider to Markup in the DOM, use FrontBx's Container and the `_Slider` method:

```JavaScript
let slider = FrontBx.Slider(DOMElement, options);
```

The `next` method animates moving to the next slide:
```JavaScript
slider.next();
```

The `previous` method animates moving to the previous slide:
```JavaScript
slider.previous();
```

Passing `false` as an optional argument on both `next` and `previous` will skip the animation and move directly to the slide:
```JavaScript
slider.next(false);
```

The `toSlide` method animates moving to a slide number:
```JavaScript
slider.toSlide(3);
```

Passing `false` as an optional second argument on `toSlide` will skip the animation and move directly to the slide:
```JavaScript
slider.toSlide(3, false);
```

The `resize` method re-calculates any internal variables for the slider and makes adjustments. This is called automatically when the `resize` option is enabled and window is resized :
```JavaScript
slider.resize();
```

Autoplay functionality has the following methods `play` `pause` `unpause` `stop`
```JavaScript
slider.play();

slider.pause();

slider.unpause();

slider.stop();
```

Finally, the `destroy` method will remove all listeners on the slider and disable it
```JavaScript
slider.destroy();
```

---

### Dynamic JavaScript Instantiation

For dynamically generated content, Sliders can be instantiated via JavaScript to generate dynamic content on the fly with FrontBx's `Component.Create` method either via the `FrontBx.Dom` or the `Slider` Component directly.

The `slides` value can be either an array or `HTML` strings or an Array/NodeList of `HTMLElements`.

```JavaScript
let options =
{
    wrap: false,
    draggable: false,
    slides:
    [
        '<img src="..." alt="...">',
        '<img src="..." alt="...">',
        '<img src="..." alt="...">',
        '<img src="..." alt="...">',
    ]
};

let container = document.querySelector('.my-container');

// Via Hibble dom
let slider = FrontBx.Dom().create('Slider', options, container);

// Or via Component directly
let slider = FrontBx.Dom().component('Slider').create(options, container);
```

---

### CSS Customization

Slider uses local CSS variables on `.slider` along with Sass variables for enhanced component customization and styling. The base values are used by the UI to create all the styling. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
$slider-bg:                     transparent !default;
$slider-dots-color:             var(--fbx-white) !default;
$slider-dots-color-active:      var(--fbx-theme-primary) !default;
$slider-dots-size:              3px !default;
$slider-nav-btn-size:           25px !default;
$slider-nav-btn-color:          var(--fbx-white) !default;
$slider-nav-btn-color-hover:    var(--fbx-theme-primary) !default;
$slider-slides-gap:             20px;
$slider-slide-width:            66%;
```

```file-path
src/scss/components/slider.scss
```
```css
.slider {
    --fbx-slider-bg: transparent;
    --fbx-slider-dots-color: var(--fbx-white);
    --fbx-slider-dots-color-active: var(--fbx-theme-primary);
    --fbx-slider-dots-size: 3px;
    --fbx-slider-nav-btn-size: 25px;
    --fbx-slider-nav-btn-color: var(--fbx-white);
    --fbx-slider-nav-btn-color-hover: var(--fbx-theme-primary);
    --fbx-slider-slides-gap: 20px;
    --fbx-slider-slide-width: 66%;
}
```
