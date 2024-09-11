# Breakpoints

Since FrontBx is developed to be mobile first, there are a handful of media queries to create sensible breakpoints for customization and various screen sizes. These breakpoints are mostly based on minimum viewport widths and allow you to adjust layouts an content as the viewport changes.

---

*   [Breakpoints](#breakpoints)
*   [Sass Mixins](#sass-mixins)
*   [CSS Customization](#css-customization)

---

### Breakpoints

FrontBx primarily uses the following media `min-width` breakpoints for layouts, grid system, and components. The breakpoint sizes can be changed via CSS or Sass variables.

```css
@media (min-width: 576px) { ... }

@media (min-width: 768px) { ... }

@media (min-width: 992px) { ... }

@media (min-width: 1200px) { ... }
```

There are also a handul of `max-width` breakpoints for screen-size and below styles:

```css
@media (max-width: 576px) { ... }

@media (max-width: 768px) { ... }

@media (max-width: 992px) { ... }

@media (max-width: 1200px) { ... }
```

---

### Sass Mixins

Both `max-width` and `min-width` media queries are available as Sass mixins making it super easy to target screen-sizes:

```sass
@include media-breakpoint-up(xs) { ... }
@include media-breakpoint-up(sm) { ... }
@include media-breakpoint-up(md) { ... }
@include media-breakpoint-up(lg) { ... }
@include media-breakpoint-up(xl) { ... }

// Example usage:
@include media-breakpoint-up(sm)
{
    .some-class
    {
        display: block;
    }
}
```

```sass
@include media-breakpoint-down(xs) { ... }
@include media-breakpoint-down(sm) { ... }
@include media-breakpoint-down(md) { ... }
@include media-breakpoint-down(lg) { ... }

// Example usage:
@include media-breakpoint-down(sm)
{
    .some-class
    {
        display: none;
    }
}
```

---

### CSS Customization

The breakpoint system uses a combination of both local root CSS variables for enhanced component customization and styling across a range of components.

Changes to breakpoints should be made pre-compilation via Sass as breakpoint sizes on media queries via CSS variables are not supported. The CSS variables can still be changed, however this will only effect container sizing not baked in media-queries.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
$breakpoint-xs:                 0 !default;
$breakpoint-sm:                 576px !default;
$breakpoint-md:                 768px !default;
$breakpoint-lg:                 992px !default;
$breakpoint-xl:                 1200px !default;

$breakpoints:
(
    'xs':                       $breakpoint-xs,
    'sm':                       $breakpoint-sm,
    'md':                       $breakpoint-md,
    'lg':                       $breakpoint-lg,
    'xl':                       $breakpoint-xl,
) !default;
```

<br>

```css
:root
{
    --fbx-breakpoint-xs: 0;
    --fbx-breakpoint-sm: 576px;
    --fbx-breakpoint-md: 768px;
    --fbx-breakpoint-lg: 992px;
    --fbx-breakpoint-xl: 1200px;
}
```
