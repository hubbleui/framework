# Grid system

FrontBx uses a powerful 12 column grid system for building layouts to fit any screen or size. It's recommended to use the Flex Grid where possible however there are still instances where you may want to use the regular grid.

---

*   [Introduction](#introduction)
*   [Responsive breakpoints](#responsive-breakpoints)
*   [Rows](#rows)
    *   [Responsive rows](#responsive-rows)
*   [Columns](#columns)
    *   [Responsive columns](#responsive-columns)
*   [Gutters](#gutters)
    *   [Responsive gutters](#responsive-gutters)
*   [Poles](#poles)
    *   [Responsive poles](#responsive-poles)
*   [Push & Pull](#push--pull)
    *   [Responsive push & pull](#responsive-push--pull)
*   [CSS customization](#css-customization)

---


### Introduction

Grid systems are used for creating page layouts through a series of rows and columns that house your content. Here's how the FrontBx grid system works:

*   Use rows (`.row`) to create horizontal groups of columns.
*   Content should be placed within columns (`.col`).
*   Predefined grid classes like `.row`, `.col-4` and are available for quickly making grid layouts.
*   Gutter classes (`.gutter-*`) can be used to create gaps between column content via padding.
*   Grid columns are created by specifying the number of twelve available columns you wish to span. For example, three equal columns would use 3x `.col-4`.
*   You can make column widths device-screen specific. e.g. `.col-12 .col-md-3` will be full width at small screens and 25% on medium screens.

---

### Responsive breakpoints

Because FrontBx is mobile first, all screen-size specific grid classes will be applied to the breakpoint and above. For example a `.col-md-12` class will apply to medium screen sizes and above, but not below. The grid system includes all the necessary screen-size specific classes.

The grid system uses both CSS Variables and Sass variables so Customization can be made both pre and post compilation.

Customization of breakpoints via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
src/scss/_config.scss
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

Or via CSS variables on the `:root`

```file-path
src/scss/_config.scss
```
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

---

### Rows

Rows are used to as a clearfixing wrapper element to contain columns. Empty rows can also be used as spacers when combined with poles to clearfix and space floating columns.

| Class  | Example | Behavior                                                        |
|--------|---------|--  -------------------------------------------------------------|
| `.row` | `.row`  | Wraps around floated children, clearfixes and spans full width. |

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.row</code></div>
    <div class="row">
        <div class="col col-12">
            <div class="bg-salmon fill"><code>.col-12</code></div>
        </div>
    </div>
</div>

```html
<div class="row"></div>
```

### Responsive Rows

FrontBx's grid system comes with mobile-first fully responsive set of helpers to display rows according to screen size. The table below outlines the available options.

| Usage           | Class          | Options                  | Example      | Behavior                                     |
|-----------------|----------------|--------------------------|--------------|----------------------------------------------|
| Breakpoint & up | `[breakpoint]` | `xs` `sm` `md` `lg` `xl` | `.row xs md` | Displays row at specified breakpoint *not up |

The example below shows two rows. The first that displays on mobile (`<=md` breakpoint) and a second that displays on desktop (`>=lg` breakpoint).

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.row</code><code>.xs</code><code>.sm</code></div>
    <div class="row xs sm pole-xs pole-s">
        <div class="col col-12">
            <div class="bg-salmon fill"><code>.col-12</code></div>
        </div>
    </div>
    <div class="parent-row-diagram"><code>.row</code><code>.md</code><code>.lg</code><code>.xl</code></div>
    <div class="md lg xl row-lg">
        <div class="col col-12">
            <div class="bg-teal fill"><code>.col-12</code></div>
        </div>
    </div>
</div>

```html
<div class="row xs sm"></div>
<div class="row md lg xl"></div>
```

---

### Columns

The core base class of FrontBx layouts is the `.col`. The table below outlines the classes and formats made available when implementing layouts using columns.

| Usage       | Class        | Options | Example  | Behavior                                       |
|-------------|--------------|---------|----------|------------------------------------------------|
| Column base | `.col`       | n/a     | `.col`   | Floats the column left                         |
| Column size | `.col-[num]` | `1-12`  | `.col-6` | Uses available space defined by column number. |

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.row</code></div>
    <div class="row">
        <div class="col col-12">
            <div class="bg-salmon fill"><code>.col-12</code></div>
        </div>
        <div class="row pole-xs"></div>
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="bg-bb-blue fill"><code>.col-6</code></div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <div class="bg-teal fill"><code>.col-6</code></div>
        </div>
    </div>
</div> 

```html
<div class="row">
    <div class="col col-12"></div>
    <div class="col col-6"></div>
    <div class="col col-6"></div>
</div>
```

#### Responsive Columns

FrontBx's grid system comes with mobile-first fully responsive set of helpers to size column layouts according to screen size. The table below outlines the available options.

| Usage           | Class                      | Options                           | Example     | Behavior                                             |
|-----------------|----------------------------|-----------------------------------|-------------|------------------------------------------------------|
| Breakpoint size | `.col-[breakpoint]-[size]` | `xs` `sm` `md` `lg` `xl` & `1-12` | `.col-sm-3` | Sizes column to width at specified breakpoint and up |

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.row</code></div>
    <div class="row">
        <div class="col col-6 col-lg-4 gutter-xs gutter-r">
            <div class="bg-bb-blue fill small"><code>.col</code><code>.col-6</code><code>.col-lg-4</code></div>
        </div>
        <div class="col col-6 col-lg-4 gutter-xs gutter-l no-gutter-lg">
            <div class="bg-teal fill small"><code>.col</code><code>.col-6</code><code>.col-lg-4</code></div>
        </div>
        <div class="row pole-xs xs sm md"></div>
        <div class="col col-12 col-lg-4 gutter-lg-xs gutter-lg-l">
            <div class="bg-salmon fill small"><code>.col</code><code>.col-12</code><code>.col-lg-4</code></div>
        </div>
    </div>
</div>

```html
<div class="row">
    <div class="col col-6 col-lg-4"></div>
    <div class="col col-6 col-lg-4"></div>
    <div class="col col-12 col-lg-4"></div>
</div>
```

---

### Gutters

Gutters apply a padding size on the sides of columns. The table below outlines the classes and formats made available when implementing layouts using gutters.

| Usage       | Class            | Options                         | Example      | Behavior                                                |
|-------------|------------------|---------------------------------|--------------|---------------------------------------------------------|
| Gutter size | `.gutter-[size]` |  `xs` `sm` `md` `lg` `xl` | `.gutter-lg` | Applies padding size gutter to both sides of the column |
| Gutter side | `.gutter-[side]` | `l`, `r`                        | `.gutter-r`  | Applies padding to left or right gutter only            |
| No gutter   | `.no-gutter`     | None                            | `.no-gutter` | Sets horizontal padding to zero                         |

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.row</code></div>
    <div class="row">
        <div class="col col-6 gutter-xs gutter-r">
            <div class="bg-bb-blue fill small"><code>.col</code><code>.gutter-xs</code><code>.gutter-r</code></div>
        </div>
        <div class="col col-6 gutter-xs gutter-l">
            <div class="bg-teal fill small"><code>.col</code><code>.gutter-xs</code><code>.gutter-l</code></div>
        </div>
    </div>
</div> 

```html
<div class="row">
    <div class="col col-6 gutter-xs gutter-r"></div>
    <div class="col col-6 gutter-xs gutter-l"></div>
</div>
```

#### Responsive gutters

FrontBx's grid system comes with mobile-first fully responsive set of helpers to size gutters according to screen size. The table below outlines the available options.

| Usage           | Class          | Options                        | Example         | Behavior                                                                                       |
|-----------------|----------------|--------------------------------|-----------------|------------------------------------------------------------------------------------------------|
| Breakpoint size | `.gutter-*-*`  | `xs` `sm` `md` `lg` `xl` | `.gutter-md-lg` | Applies horizontal padding size gutter to both sides of element at specified breakpoint and up |
| Breakpoint side | `.gutter-*`    | `l`, `r`                       | `.gutter-md-r`  | Applies horizontal padding to left or right gutter only - at specified breakpoint and up       |
| No gutter       | `.no-gutter-*` | `xs` `sm` `md` `lg` `xl` | `.no-gutter-md` | Sets no horizontal padding at specified breakpoint and up                                      |

The example below is a little more complicated. It shows how to space columns evenly using a combination of left and right gutters and breakpoints.

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.row</code></div>
    <div class="row">
        <div class="col col-6 col-lg-3 gutter-xxs gutter-r gutter-lg-xs gutter-lg-r">
            <div class="bg-bb-blue fill smaller"><code>.col</code><code>.gutter-xxs</code><code>.gutter-r</code><br><code>.gutter-lg-xs</code><code>.gutter-lg-r</code></div>
        </div>
        <div class="col col-6 col-lg-3 gutter-xxs gutter-l gutter-lg-xs gutter-lg-r">
            <div class="bg-teal fill smaller"><code>.col</code><code>.gutter-xxs</code><code>.gutter-l</code><br><code>.gutter-lg-xs</code><code>.gutter-lg-r</code></div>
        </div>
        <div class="row xs sm md pole-xs"></div>
        <div class="col col-6 col-lg-3 gutter-xxs gutter-r gutter-lg-xs gutter-lg-r">
            <div class="bg-teal fill smaller"><code>.col</code><code>.gutter-xxs</code><code>.gutter-r</code><br><code>.gutter-lg-xs</code><code>.gutter-lg-r</code></div>
        </div>
        <div class="col col-6 col-lg-3 gutter-xxs gutter-l gutter-lg-xs no-gutter-lg">
            <div class="bg-bb-blue fill smaller"><code>.col</code><code>.gutter-xxs</code><code>.gutter-l</code><br><code>.gutter-lg-xs</code><code>.no-gutter-lg</code></div>
        </div>
    </div>
</div> 

```html
<div class="row">
    <div class="col col-6 col-lg-3 gutter-xxs gutter-r gutter-lg-xs gutter-lg-r"></div>
    <div class="col col-6 col-lg-3 gutter-xxs gutter-l gutter-lg-xs gutter-lg-r"></div>
    
    <!-- Clearfix mobile only -->
    <div class="row xs sm md pole-xs"></div>

    <div class="col col-6 col-lg-3 gutter-xxs gutter-r gutter-lg-xs gutter-lg-r"></div>
    <div class="col col-6 col-lg-3 gutter-xxs gutter-l gutter-lg-xs no-gutter-lg"></div>
</div>
```

---

### Poles

Poles are essentially vertical gutters. `.pole-n` applies a `padding-top` value while `.pole-s` applies a `padding-bottom` value. The table below outlines the classes and formats made available for poles.

| Usage     | Class          | Options                         | Example    | Behavior                                                    |
|-----------|----------------|---------------------------------|------------|-------------------------------------------------------------|
| Pole size | `.pole-[size]` |  `xs` `sm` `md` `lg` `xl` | `.pole-lg` | Applies padding size pole to both top and bottom of element |
| Pole side | `.pole-[side]` | `n`, `s`                        | `.pole-s`  | Applies padding to top or bottom pole only                  |
| No pole   | `.no-pole`     | None                            | `.no-pole` | Sets vertical padding to zero                               |

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.row</code></div>
    <div class="row">
        <div class="col col-12">
            <div class="bg-salmon fill thin small"><code>.col</code><code>.col-12</code></div>
        </div>
        <div class="col col-6 gutter-xxs gutter-r pole-xs">
            <div class="bg-bb-blue fill small"><code>.col</code><code>.col-6</code><code>.pole-xs</code></div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l pole-xs">
            <div class="bg-teal fill small"><code>.col</code><code>.col-6</code><code>.pole-xs</code></div>
        </div>
        <div class="col col-12">
            <div class="bg-salmon fill thin small"><code>.col</code><code>.col-12</code></div>
        </div>
    </div>
</div> 

```html
<div class="row">
    <div class="col col-12"></div>
    
    <div class="col col-6 pole-xs"></div>
    <div class="col col-6 pole-xs"></div>
    
    <div class="col col-12"></div>
</div>
```

#### Responsive poles

FrontBx's grid system comes with mobile-first fully responsive set of helpers to size gutters according to screen size. The table below outlines the available options.

| Usage           | Class        | Options                        | Example       | Behavior                                                                                         |
|-----------------|--------------|--------------------------------|---------------|--------------------------------------------------------------------------------------------------|
| Breakpoint size | `.pole-*-*`  | `xs` `sm` `md` `lg` `xl` | `.pole-md-lg` | Applies vertical padding size pole to both top and bottom element at specified breakpoint and up |
| Breakpoint pole | `.pole-*`    | `n`, `s`                       | `.pole-md-s`  | Applies vertical padding to top or bottom pole only - at specified breakpoint and up             |
| No pole         | `.no-pole-*` | `xs` `sm` `md` `lg` `xl` | `.no-pole-md` | Sets no vertical padding at specified breakpoint and up                                          |

In the example below, the first col the poles are sized differently and different breakpoints:

<div class="code-content-example">
    <div class="parent-row-diagram"><code>row</code></div>
    <div class="row">
        <div class="col col-12 pole-xxs pole-lg-xs">
            <div class="bg-salmon fill small"><code>.col</code><code>.pole-xxs</code><code>.pole-lg-xs</code></div>
        </div>
        <div class="col col-12 pole-xxs pole-lg-xs">
            <div class="bg-salmon fill small"><code>.col</code><code>.pole-xxs</code><code>.pole-lg-xs</code></div>
        </div>
    </div>
</div>

```html
<div class="row">
    <div class="col col-12 pole-xxs pole-lg-xs"></div>
    <div class="col col-12 pole-xxs pole-lg-xs"></div>
</div>
```

---

### Push & Pull

The `.push` and `.pull` system allows you to easily change the order of grid columns with modifier classes. The table below outlines the classes and formats made available when implementing push or pull.

| Usage     | Class          | Options | Example       | Behavior               |
|-----------|----------------|---------|---------------|------------------------|
| Pull size | `.col-pull-*`, | `1-12`  | `.col-pull-3` | Pulls column right     |
| Push size | `.col-push-*`, | `1-12`  | `.col-push-9` | Pushes column left     |

In the example below the second column is pushed to the left and the first is pushed right - reordering the layout of the columns:

<div class="code-content-example">
    <div class="parent-row-diagram"><code>row</code></div>
    <div class="row">
        <div class="col col-8 col-pull-4 gutter-xxs gutter-l">
            <div class="bg-teal fill small"><code>.col</code><code>.col-8</code><code>.col-pull-4</code></div>
        </div>
        <div class="col col-4 col-push-8 gutter-xxs gutter-r">
            <div class="bg-bb-blue fill small"><code>.col</code><code>.col-4</code><code>.col-push-8</code></div>
        </div>
    </div>
</div> 

```html
<div class="row ">
    <div class="col col-8 col-pull-4"></div>
    <div class="col col-4 col-push-8"></div>
</div>
```

#### Responsive Push & Pull

FrontBx's grid system comes with mobile-first fully responsive set of helpers to order column layouts according to screen size. The table below outlines the available options.

| Usage                | Class                           | Options                           | Example          | Behavior                                          |
|----------------------|---------------------------------|-----------------------------------|------------------|---------------------------------------------------|
| Breakpoint pull size | `.col-[breakpoint]-pull-[num]`, | `xs` `sm` `md` `lg` `xl` & `1-12` | `.col-md-pull-3` | Pulls col to size at specified breakpoint and up  |
| Breakpoint push size | `.col-[breakpoint]-push-[num]`, | `xs` `sm` `md` `lg` `xl` & `1-12` | `.col-md-push-9` | Pushes col to size at specified breakpoint and up |

In the example below both columns are full width on mobile. On breakpoint (>=md) they are re-ordered.

<div class="code-content-example">
    <div class="parent-row-diagram"><code>row</code></div>
    <div class="row">
        <div class="col col-12 col-md-8 col-md-pull-4 gutter-md-xxs gutter-md-l pole-xxs pole-s no-pole-md">
            <div class="bg-teal fill smaller"><code>.col</code><code>.col-12</code><code>.col-md-8</code><code>.col-md-pull-4</code></div>
        </div>
        <div class="col col-12 col-md-4 col-md-push-8 gutter-md-xxs gutter-md-r pole-xxs pole-n no-pole-md">
            <div class="bg-bb-blue fill smaller"><code>.col</code><code>.col-12</code><code>.col-md-4</code><code>.col-md-push-8</code></div>
        </div>
    </div>
</div>

```html
<div class="row ">
    <div class="col col-12 col-md-9 col-md-pull-3"></div>
    <div class="col col-12 col-md-3 col-md-push-9"></div>
</div>
```

---

### CSS Customization

The grid system uses a combination of both local CSS variables on all components for enhanced component customization and styling. The base values are used by the UI to create all the sizing. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
$grid-gutters:
(
    'xxs':                      0.5rem,
    'xs':                       1rem,
    'sm':                       2.0rem,
    'md':                       2.5rem,
    'lg':                       3.0rem,
    'xl':                       3.5rem,
) !default;

// Grid poles
$grid-poles:
(
    'xxs':                      0.5rem,
    'xs':                       1rem,
    'sm':                       3.0rem,
    'md':                       6.0rem,
    'lg':                       8.0rem,
    'xl':                       10.0rem,
) !default;
```

<br>

```file-path
src/scss/grid/_base.scss
```
```sass
/* Row */
.row
{
    --fbx-row-width: 100%;
    width: var(--fbx-row-width);
}

/* Columns */
.col
{
    --fbx-col-width: 0;
    --fbx-col-push: initial;
    --fbx-col-pull: initial;
    --fbx-gutter-l: initial;
    --fbx-gutter-r: initial;
    --fbx-pole-n: initial;
    --fbx-pole-s: initial;
}
```