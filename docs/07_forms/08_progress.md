# Progress

---

Custom styled progress bars can be used in upload forms or Ajax tasks with very little markup required.

---

*   [Markup](#markup)
*   [Contexts](#contexts)
*   [Customization](#customization)

---

### Markup

<div class="code-content-example">
	<div class="row floor-xs">
	    <span class="progress-bar">
	        <span class="progress" style="width: 20%"></span>
	    </span>
	</div>
</div>

```html
<span class="progress-bar">
    <span class="progress" style="width: 20%"></span>
</span>
```

---

### Contexts

Progress bars can be further contextualized using the `.progress-primary`, `.progress-secondary`,  `.progress-info`, `.progress-success`, `.progress-warning`, `.progress-danger`, `.progress-gradient` classes.


<div class="code-content-example">
	<div class="row floor-xs">
	    <span class="progress-bar progress-primary">
	        <span class="progress" style="width: 20%"></span>
	    </span>
	</div>
	<div class="row floor-xs">
	    <span class="progress-bar progress-secondary">
	        <span class="progress" style="width: 30%"></span>
	    </span>
	</div>
	<div class="row floor-xs">
	    <span class="progress-bar progress-info">
	        <span class="progress" style="width: 40%"></span>
	    </span>
	</div>
	<div class="row floor-xs">
	    <span class="progress-bar progress-success">
	        <span class="progress" style="width: 50%"></span>
	    </span>
	</div>
	<div class="row floor-xs">
	    <span class="progress-bar progress-warning">
	        <span class="progress" style="width: 60%"></span>
	    </span>
	</div>
	<div class="row floor-xs">
	    <span class="progress-bar progress-danger">
	        <span class="progress" style="width: 70%"></span>
	    </span>
	</div>
	<div class="row floor-xs">
	    <span class="progress-bar progress-gradient">
	        <span class="progress" style="width: 80%"></span>
	    </span>
	</div>
</div>

---

### Customization

Progress bars use local CSS variables on `.progress-bar` for enhanced component customization and styling. The base values are used by the UI to create all the variants. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

```file-path
src/scss/styles/forms/_progress.scss
```
```sass
--fbx-progress-size: #{$progress-size};
--fbx-progress-radius: #{$progress-radius};
--fbx-progress-bg: #{$progress-bg};
--fbx-progress-color: #{$progress-color};
```

<br>

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.


```file-path
src/scss/_config.scss
```
```sass
$progress-size:                 1rem !default;
$progress-radius:               var(--fbx-border-radius) !default;
$progress-bg:                   var(--fbx-gray-200) !default;
$progress-color:                var(--fbx-gray) !default;
$progress-gradient:             linear-gradient(to right,  #b0e2fe 0%,#b0b2fb 100%);
```

