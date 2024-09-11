# Images

FrontBx comes with a set of handy image utilities for setting image dimensions as well as LazyLoading and much more.

---

*   [Aspect ratios](#aspect-ratios)
*   [Dimensions](#aspect-ratios)
*   [JavaScript Instantiation](#javaScript-instantiation)

---

### Aspect ratios

FrontBx's utility classes allow you to set aspect ratios on both **image** and **Background image** elements. This enables you to set a fixed height or width for an image, while retaining a specific aspect ratio.

For `<image>` elements, wrap the image in a `.ratio-img` div, then add the relevant `.ratio-[w]-[h]` class to the wrapper:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
    	<div class="col-12 col-md-8 col-lg-5">
        	<div class="raised-1 ratio-img ratio-16-9">
        		<img src="../../../dist/img/trump-hero.jpg" alt="trump" />
        	</div>
        </div>
    </div>
</div>

```html
<div class="raised-1 ratio-img ratio-16-9">
	<img src="trump-hero.jpg" alt="trump" />
</div>
```

For **Background image** elements, add the relevant `.ratio-[w]-[h]` class to the `.bg-image` element directly:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
    	<div class="col-12 col-md-8 col-lg-5">
        	<div class="bg-image ratio-16-9 raised-1" style="background-image: url(../../../dist/img/trump-hero.jpg)"></div>
        </div>
    </div>
</div>

```html
<div class="bg-image ratio-16-9" style="background-image: url(...)"></div>
```

FrontBx provides a set of classes for common aspect ratios which are detailed below:

**Landscape aspect ratios:**
| CSS Class    | CSS Var                        |
|--------------|--------------------------------|
| `ratio-1-1`  | `--fbx-aspect-ratio:ratio-1-1`  |
| `ratio-3-2`  | `--fbx-aspect-ratio:ratio-3-2`  |
| `ratio-4-3`  | `--fbx-aspect-ratio:ratio-4-3`  |
| `ratio-5-3`  | `--fbx-aspect-ratio:ratio-5-3`  |
| `ratio-5-4`  | `--fbx-aspect-ratio:ratio-5-4`  |
| `ratio-16-9` | `--fbx-aspect-ratio:ratio-16-9` |


**Portrait aspect ratios:**

| CSS Class    | CSS Var                        |
|--------------|--------------------------------|
| `ratio-2-3`  | `--fbx-aspect-ratio:ratio-2-3`  |
| `ratio-3-4`  | `--fbx-aspect-ratio:ratio-3-4`  |
| `ratio-3-5`  | `--fbx-aspect-ratio:ratio-3-5`  |
| `ratio-4-5`  | `--fbx-aspect-ratio:ratio-4-5`  |
| `ratio-9-16` | `--fbx-aspect-ratio:ratio-9-16` |


Aspect ratios are set via CSS Variables, which can be also be customized for more flexibility. Below are the variables available for both `.ratio-img` and `.bg-img`. You can set the `--fbx-aspect-ratio` to whatever aspect ratio value you like to create your own aspect ratio if needed.

```html
<div class="raised-1 ratio-img" style="--fbx-aspect-ratio:5/9">
	<img src="trump-hero.jpg" alt="trump" />
</div>

```
```css
.ratio-img, .bg-image
{
    --fbx-aspect-ratio: 1/1;
}
```

---

### Dimensions

Dimensions for both **image** and **Background image** elements can be set via CSS Variables. For browsers that support the CSS [aspect-ratio](https://caniuse.com/mdn-css_properties_aspect-ratio) property, these values can be customized. The default values are `width: 100%` and `height: auto`:

<div class="code-content-example">
    <div class="flex-row align-cols-center">
        <div class="col col-md-8 col-lg-4">
            <div class="ratio-img raised-1" style="--fbx-aspect-ratio:1/1;">
				<img class="js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" data-src="../../../dist/img/trump-hero.jpg" alt="trump" />
			</div>
        </div>
    </div>
</div>

```html
<div class="ratio-img raised-1" style="--fbx-aspect-ratio:1/1; --fbx-width: auto;--fbx-height: 200px;">
	<img class="js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" data-src="../../../dist/img/trump-hero.jpg" alt="trump" />
</div>
```
```css
.ratio-img
{
	--fbx-aspect-ratio:1/1
    --fbx-width: auto;
    --fbx-height: 200px;
}
```

---

### JavaScript Instantiation

Images can be instantiated via JavaScript to generate dynamic content on the fly. To create an image dynamically, use FrontBx's `Component.Create` method either via the `FrontBx.Dom` or the `Image` Component directly:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center-x align-cols-top col-gaps-xs row-gaps-xs">
    	<div class="col-3 js-img-container">
    	</div>
    </div>
</div>

```JavaScript
let options =
{
	src: '../../../dist/img/trump-hero.jpg',
	alt: 'Trump',
	lazy: true,
	ratio: '1/1',
	background: false,
};

let container = document.querySelector('.js-img-container');

// Via Hibble dom
FrontBx.Dom().create('Image', options, container);

// Or via Component directly
FrontBx.Dom().component('Image').create(options, container);
```

<script>
window.addEventListener('FrontBx:ready', () => 
{
	let options =
	{
		src: '../../../dist/img/trump-hero.jpg',
		alt: 'Trump',
		lazy: true,
		ratio: '1/1',
		background: false,
	};

	FrontBx.Dom().create('Image', options, FrontBx._().find('.js-img-container'));
});

</script>

Below are the available options:


| Option        | Default | Example                               | Behavior                                                                |
|---------------|---------|---------------------------------------|-------------------------------------------------------------------------|
| `background`  | `false` | `{ background: true }`                | Creates a background image element.                                     |
| `ratio`       | `null`  | `{ ratio: '16/9' }`                   | Creates either a background image or image with specified aspect ratio. |
| `lazy`        | `false` | `{ lazy: true }`                      | Enables LazyLoading.                                                    |
| `grayscale`   | `false` | `{ grayscale: true }`                 | Enables grayscale effect on lazyload.                                   |
| `placeholder` | `null`  | `{ placeholder: 'https://.....jpg' }` | Temporary image URL to load when lazyload enabled.                      |
| `src`         | `null`  | `{ src: 'https://.....jpg' }`         | Image source URL                                                        |
| `{...props}`  | `null`  | `{ alt: 'Trump' }`                    | Any additonal attributes to pass to the `<image>` tag or `<div>`        |


### See Also

*   [Lazyload](../../images/lazy-load/index.html) - Lazyload image Component.
*   [Slider](../../images/slider/index.html) - Carousel slider Component.
*   [Gallery](../../images/gallery/index.html) - Image gallery Component.
