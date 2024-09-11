# Ripple

Ripple adds an interactive click animation to clickable elements, giving users direct UI response to their actions on page.

---

*	[Markup](#markup)
*	[Elements](#elements)
*	[CSS Customization](#css-customization)

---

### Markup

To add a ripple to an element, add the `.js-ripple` class. The library will handle the rest for you. Here's an example using a simple image

<div class="code-content-example">
	<div class="flex-row-fluid align-cols-center">
		<div style="width: 300px;" class="js-ripple raised-1">
			<img alt="Trump" data-src="../../../dist/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-avatar_thumb.jpg" />
		</div>
	</div>
</div>

```html
<div class="js-ripple raised-1">
	<img alt="Trump" data-src="../../../dist/img/trump-avatar.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-avatar_thumb.jpg" />
</div>
```

---

### Elements

Ripple get added automatically to the following FrontBx components:

*   `.btn`
*   `.list > li`
*   `.pagination li a`
*   `.tab-nav li a`
*   `.card.primary-action`
*   `.card .primary-action`
*   `.card-media`

To hide ripple on a given element, add the `.no-ripple` class:

<div class="code-content-example">
	<div class="flex-row-fluid align-cols-center">
		<button class="btn no-ripple">.no-ripple</button>
	</div>
</div>

```html
<button class="btn no-ripple">.no-ripple</button>
```

---

### CSS Customization

Ripple's default color is the current color of the element being clicked (aka the CSS `currentColor` keyword). If there are instances where you want a specific colored ripple you can change the color via the CSS variable on `.ripple`.

<div class="code-content-example">
	<style scoped>
		.custom-ripple .ripple
		{
    		--fbx-ripple-color: rgba(0, 0, 255, 0.3);
		}
	</style>
	<div class="flex-row-fluid align-cols-center">
		<button class="btn custom-ripple">Custom Ripple</button>
	</div>
</div>

```css
.ripple
{
	--fbx-ripple-color: rgba(0, 0, 255, 0.3);
}
```
