# Container

FrontBx's `.container` system is the most basic layout element in FrontBx and should be used when using the grid system. Choose from a responsive, fixed-width container (meaning its max-width changes at each breakpoint) or fluid-width (meaning it’s 100% wide all the time).

While containers can be nested, most layouts do not require a nested container.

---

*   [Fixed Container](#fixed-container)
*   [Fluid Container](#fluid-container)
*   [Container gutters](#container-gutters)
*   [CSS customization](#css-customization)

---

### Fixed Container

The fixed width `.container` will wrap layouts providing a `100%` width on screen sizes below the `sm` breakpoint and a fixed `max-width` at each breakpoint above.

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.container</code></div>
    <div class="container">
        <div class="col col-9 gutter-xxs gutter-r">
            <div class="bg-salmon fill"></div>
        </div>
        <div class="col col-3 gutter-xxs gutter-l">
            <div class="bg-bb-blue fill"></div>
        </div>
    </div>
</div>

```html
<div class="container">
...
</div>
```

---

### Fluid Container

The fluid width `.container-fluid` will wrap layouts providing a `100%` at all breakpoints with a fixed `max-width` of the `xl`. breakpoint.

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.container-fluid</code></div>
    <div class="container-fluid">
        <div class="col col-9 gutter-xxs gutter-r">
            <div class="bg-salmon fill"></div>
        </div>
        <div class="col col-3 gutter-xxs gutter-l">
            <div class="bg-bb-blue fill"></div>
        </div>
    </div>
</div>

```html
<div class="container-fluid">
...
</div>
```

---

### Container gutters

Container gutters are left and right padding applied to the container element. The gutter sizes are configured via both Sass and CSS variables.

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.container-fluid</code></div>
    <div class="container-fluid highlight-gutters">
        <div class="col col-9 gutter-xxs gutter-r">
            <div class="bg-salmon fill"></div>
        </div>
        <div class="col col-3 gutter-xxs gutter-l">
            <div class="bg-bb-blue fill"></div>
        </div>
    </div>
</div>

```html
<div class="container-fluid">
...
</div>
```

---

### CSS Customization

The container system uses a combination of both local root CSS variables for enhanced component customization and styling. The base values are used by the UI to create the gutters and sizings. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
// Grid breakpoints
$breakpoint-xs:                 0 !default;
$breakpoint-sm:                 576px !default;
$breakpoint-md:                 768px !default;
$breakpoint-lg:                 992px !default;
$breakpoint-xl:                 1200px !default;

$container-gutters:
(
    'xxs':                      0.5rem,
    'xs':                       1rem,
    'sm':                       3.0rem,
    'md':                       3.0rem,
    'lg':                       3.0rem,
    'xl':                       3.0rem,
) !default;
```

<br>

```file-path
src/scss/grid/_base.scss
```
```sass
.container,
.container-fluid
{
    --fbx-container-width: 100%;
    --fbx-container-max-width: 100%;
    --fbx-container-pad-l: 0;
    --fbx-container-pad-r: 0;
}
```

<br>

```css
:root
{
    /* Container gutters */
    --fbx-container-gutter-xxs: 0.5rem;
    --fbx-container-gutter-xs: 1rem;
    --fbx-container-gutter-sm: 3rem;
    --fbx-container-gutter-md: 3rem;
    --fbx-container-gutter-lg: 3rem;
    --fbx-container-gutter-xl: 3rem;
}
```
