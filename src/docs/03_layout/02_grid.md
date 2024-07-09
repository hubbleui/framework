# Grid system

Hubble uses a powerful 12 column grid system for building layouts to fit any screen or size.

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

Grid systems are used for creating page layouts through a series of rows and columns that house your content. Here's how the Hubble grid system works:

*   Use rows (`.row`) to create horizontal groups of columns.
*   Content should be placed within columns (`.col`).
*   Predefined grid classes like `.row`, `.col-4` and are available for quickly making grid layouts.
*   Gutter classes (`.gutter-*`) can be used to create gaps between column content via padding.
*   Grid columns are created by specifying the number of twelve available columns you wish to span. For example, three equal columns would use 3x `.col-4`.
*   You can make column widths device-screen specific. e.g. `.col-12 .col-md-3` will be full width at small screens and 25% on medium screens.

---


### Responsive breakpoints

Because Hubble is mobile first, all screen-size specific grid classes will be applied to the breakpoint and above. For example a `.col-md-12` class will apply to medium screen sizes and above, but not below. The grid system includes all the necessary screen-size specific classes.

The grid system uses both CSS Variables and Sass variables so Customization can be made both pre and post compilation.

Customization of breakpoints via Sass can be made in the `src/scss/_config.scss` file in Hubble's source.

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
    --hb-breakpoint-xs: 0;
    --hb-breakpoint-sm: 576px;
    --hb-breakpoint-md: 768px;
    --hb-breakpoint-lg: 992px;
    --hb-breakpoint-xl: 1200px;
}
```

---

### Rows

Rows are used to as a clearfixing wrapper element to contain columns. Empty rows can also be used as spacers when combined with poles to clearfix and space floating columns.

| Class  | Example | Behavior                                                        |
|--------|---------|--  -------------------------------------------------------------|
| `.row` | `.row`  | Wraps around floated children, clearfixes and spans full width. |

<div class="code-content-example">
    <div class="row">
        <div class="col col-12">
            <div class="bg-salmon fill">.row</div>
        </div>
    </div>
</div>

```html
<div class="row"></div>
```

### Responsive Rows

Hubble's grid system comes with mobile-first fully responsive set of helpers to display rows according to screen size. The table below outlines the available options.

| Usage           | Class    | Options                         | Example   | Behavior                                    |
|-----------------|----------|---------------------------------|-----------|---------------------------------------------|
| Breakpoint & up | `.row-*` | `xxs`, `xs`,`sm`,`md`,`lg`,`xl` | `.row-lg` | Displays row at specified breakpoint and up |

The example below shows two rows. The first that displays on mobile (`<=md` breakpoint) and a second that displays on desktop (`>=lg` breakpoint).

<div class="code-content-example">
    <div class="row xs sm">
        <div class="col col-12">
            <div class="bg-salmon fill">.xs.sm.md.row</div>
        </div>
    </div>
    <div class="md lg xl row-lg">
        <div class="col col-12">
            <div class="bg-teal fill">.lg.xl.row-lg</div>
        </div>
    </div>
</div>

```html
<div class="row xs sm "></div>
<div class="md lg xl row-lg"></div>
```

---

### Columns

The core base class of Hubble layouts is the `.col`. The table below outlines the classes and formats made available when implementing layouts using columns.

| Usage       | Class    | Options | Example  | Behavior                                       |
|-------------|----------|---------|----------|------------------------------------------------|
| Column base | `.col`   | n/a     | `.col`   | Floats the column left                         |
| Column size | `.col-*` | `1-12`  | `.col-6` | Uses available space defined by column number. |

<div class="code-content-example">
    <div class="row pole-xs pole-s">
        <div class="col col-12">
            <div class="bg-salmon fill">.col-12</div>
        </div>
    </div>
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="bg-bb-blue fill">.col-6</div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <div class="bg-teal fill">.col-6</div>
        </div>
    </div>
</div> 

```html
<div class="row pole-xs">
    <div class="col col-12"></div>
    <div class="col col-6"></div>
    <div class="col col-6"></div>
</div>
```

#### Responsive Columns

Hubble's grid system comes with mobile-first fully responsive set of helpers to size column layouts according to screen size. The table below outlines the available options.

| Usage           | Class      | Options                                  | Example     | Behavior                                                                                              |
|-----------------|------------|------------------------------------------|-------------|-------------------------------------------------------------------------------------------------------|
| Breakpoint size | `.col-*-*` | `xxs`, `xs`,`sm`,`md`,`lg`,`xl` & `1-12` | `.col-sm-3` | \*Wildcard(1) defines breakpoint. \*Wildcard(2) defines the column number. Displays size on breakpoint and up |

The columns below span 2x columns on mobile and 12 columns on desktop (`>=lg` breakpoint).

<div class="code-content-example">
    <div class="row pole-xs pole-s">
        <div class="col col-12">
            <div class="bg-salmon fill">.col-12</div>
        </div>
    </div>
    <div class="row">
        <div class="col col-6 col-lg-12 gutter-xxs gutter-r no-gutter-lg">
            <div class="bg-bb-blue fill">.col-6.col-lg-12</div>
        </div>
        <div class="row-lg lg xl pole-xs"></div>
        <div class="col col-6 col-lg-12 gutter-xxs gutter-l no-gutter-lg">
            <div class="bg-teal fill">.col-6.col-lg-12</div>
        </div>
    </div>
</div>

```html
<div class="row ">
    <div class="col col-12"></div>
</div>
<div class="row">
    <div class="col col-6 col-lg-12"></div>
    <div class="col col-6 col-lg-12"></div>
</div>
```

---

### Gutters

Gutters apply a padding size on the sides of columns. The table below outlines the classes and formats made available when implementing layouts using gutters.

| Usage       | Class        | Options                         | Example      | Behavior                                                |
|-------------|--------------|---------------------------------|--------------|---------------------------------------------------------|
| Gutter size | `.gutter-*`  | `xxs`, `xs`,`sm`,`md`,`lg`,`xl` | `.gutter-lg` | Applies padding size gutter to both sides of the column |
| Gutter side | `.gutter-*`  | `l`, `r`                        | `.gutter-r`  | Applies padding to left or right gutter only            |
| No gutter   | `.no-gutter` | None                            | `.no-gutter` | Sets horizontal padding to zero                         |

<br>

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 gutter-xs gutter-r">
            <div class="bg-bb-blue fill">.gutter-xs.gutter-r</div>
        </div>
        <div class="col col-6 gutter-xs gutter-l">
            <div class="bg-teal fill">.gutter-xs.gutter-r</div>
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

Hubble's grid system comes with mobile-first fully responsive set of helpers to size gutters according to screen size. The table below outlines the available options.

| Usage           | Class          | Options                        | Example         | Behavior                                                                                       |
|-----------------|----------------|--------------------------------|-----------------|------------------------------------------------------------------------------------------------|
| Breakpoint size | `.gutter-*-*`  | `xxs`,`xs`,`sm`,`md`,`lg`,`xl` | `.gutter-md-lg` | Applies horizontal padding size gutter to both sides of element at specified breakpoint and up |
| Breakpoint side | `.gutter-*`    | `l`, `r`                       | `.gutter-md-r`  | Applies horizontal padding to left or right gutter only - at specified breakpoint and up       |
| No gutter       | `.no-gutter-*` | `xxs`,`xs`,`sm`,`md`,`lg`,`xl` | `.no-gutter-md` | Sets no horizontal padding at specified breakpoint and up                                      |

The example below is a little more complicated. It shows how to space columns evenly using a combination of left and right gutters and breakpoints.

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 col-lg-3 gutter-xxs gutter-r gutter-lg-xs gutter-lg-r">
            <div class="bg-bb-blue fill small">.gutter-xxs.gutter-r.gutter-lg-xs.gutter-lg-r</div>
        </div>
        <div class="col col-6 col-lg-3 gutter-xxs gutter-l gutter-lg-xs gutter-lg-r">
            <div class="bg-teal fill small">.gutter-xxs.gutter-l.gutter-lg-xs.gutter-lg-r</div>
        </div>
        <div class="row xs sm md pole-xs"></div>
        <div class="col col-6 col-lg-3 gutter-xxs gutter-r gutter-lg-xs gutter-lg-r">
            <div class="bg-teal fill small">.gutter-xxs.gutter-r.gutter-lg-xs.gutter-lg-r</div>
        </div>
        <div class="col col-6 col-lg-3 gutter-xxs gutter-l gutter-lg-xs no-gutter-lg">
            <div class="bg-bb-blue fill small">.gutter-xxs.gutter-l.gutter-lg-xs.no-gutter-lg</div>
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

| Usage     | Class      | Options                         | Example    | Behavior                                                    |
|-----------|------------|---------------------------------|------------|-------------------------------------------------------------|
| Pole size | `.pole-*`  | `xxs`, `xs`,`sm`,`md`,`lg`,`xl` | `.pole-lg` | Applies padding size pole to both top and bottom of element |
| Pole side | `.pole-*`  | `n`, `s`                        | `.pole-s`  | Applies padding to top or bottom pole only                  |
| No pole   | `.no-pole` | None                            | `.no-pole` | Sets vertical padding to zero                               |

<br>

<div class="code-content-example">
    <div class="row">
        <div class="col col-12">
            <div class="bg-salmon fill thin">.row</div>
        </div>
    </div>
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r pole-xs">
            <div class="bg-bb-blue fill">.pole-xs</div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l pole-xs">
            <div class="bg-teal fill">.pole-xs</div>
        </div>
    </div>
    <div class="row">
        <div class="col col-12">
            <div class="bg-salmon fill thin">.row</div>
        </div>
    </div>
</div> 

```html
<div class="row"></div>
<div class="col col-6 pole-xs">
    <div class="bg-bb-blue fill">.pole-xs</div>
</div>
<div class="col col-6 pole-xs">
    <div class="bg-teal fill">.pole-xs</div>
</div>
<div class="row"></div>
```

#### Responsive poles

Hubble's grid system comes with mobile-first fully responsive set of helpers to size gutters according to screen size. The table below outlines the available options.

| Usage           | Class        | Options                        | Example       | Behavior                                                                                         |
|-----------------|--------------|--------------------------------|---------------|--------------------------------------------------------------------------------------------------|
| Breakpoint size | `.pole-*-*`  | `xxs`,`xs`,`sm`,`md`,`lg`,`xl` | `.pole-md-lg` | Applies vertical padding size pole to both top and bottom element at specified breakpoint and up |
| Breakpoint pole | `.pole-*`    | `n`, `s`                       | `.pole-md-s`  | Applies vertical padding to top or bottom pole only - at specified breakpoint and up             |
| No pole         | `.no-pole-*` | `xxs`,`xs`,`sm`,`md`,`lg`,`xl` | `.no-pole-md` | Sets no vertical padding at specified breakpoint and up                                          |

In the example below, the first row has `.pole-s` while the second row has `.pole-n`, the poles are then sized differently and different breakpoints:

<div class="code-content-example">
    <div class="row pole-xxs pole-s pole-lg-xs pole-lg-s">
        <div class="col col-12">
            <div class="bg-salmon fill small">.pole-xxs.pole-s.pole-lg-xs.pole-lg-s</div>
        </div>
    </div>
    <div class="row pole-xxs pole-n pole-lg-xs pole-lg-n">
        <div class="col col-12">
            <div class="bg-salmon fill small">.pole-xxs.pole-s.pole-lg-xs.pole-lg-n</div>
        </div>
    </div>
</div> 

```html
<div class="row pole-xxs pole-s pole-lg-xs pole-lg-s"></div>
<div class="row pole-xxs pole-n pole-lg-xs pole-lg-n"></div>
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
    <div class="row">
        <div class="col col-9 col-pull-3 gutter-xxs gutter-l">
            <div class="bg-teal fill">.col-9.col-pull-3</div>
        </div>
        <div class="col col-3 col-push-9 gutter-xxs gutter-r">
            <div class="bg-bb-blue fill">.col-3.col-push-9</div>
        </div>
    </div>
</div> 

```html
<div class="row ">
    <div class="col col-9 col-pull-3"></div>
    <div class="col col-3 col-push-9"></div>
</div>
```

#### Responsive Push & Pull

Hubble's grid system comes with mobile-first fully responsive set of helpers to order column layouts according to screen size. The table below outlines the available options.

| Usage                | Class            | Options                                 | Example          | Behavior                                                              |
|----------------------|------------------|-----------------------------------------|------------------|-----------------------------------------------------------------------|
| Breakpoint pull size | `.col-*-pull-*`, | `xxs`,`xs`,`sm`,`md`,`lg`,`xl` & `1-12` | `.col-md-pull-3` | \*Wildcard(1) defines the breakpoint. \*Wildcard(2) defines pull size |
| Breakpoint push size | `.col-*-push-*`, | `xxs`,`xs`,`sm`,`md`,`lg`,`xl` & `1-12` | `.col-md-push-9` | \*Wildcard(1) defines the breakpoint. \*Wildcard(2) defines push size |

In the example below both columns are full width on mobile. On breakpoint (>=md) they are re-ordered.

<div class="code-content-example">
    <div class="row">
        <div class="col col-12 col-md-9 col-md-pull-3 gutter-md-xxs gutter-md-l pole-xxs pole-s no-pole-md">
            <div class="bg-teal fill small">.col-md-9.col-md-pull-3</div>
        </div>
        <div class="col col-12 col-md-3 col-md-push-9 gutter-md-xxs gutter-md-r pole-xxs pole-n no-pole-md">
            <div class="bg-bb-blue fill small">.col-md-3.col-md-push-9</div>
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

The grid system uses a combination of both local CSS variables on all components for enhanced component customization and styling. The base values are used by the UI to create all the sizing. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported, too.

Customization via Sass can be made in the `src/scss/_config.scss` file in Hubble's source.

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
    --hb-row-width: 100%;
    width: var(--hb-row-width);
}

/* Columns */
.col
{
    --hb-col-width: 0;
    --hb-col-push: initial;
    --hb-col-pull: initial;

    width: var(--hb-col-width);
    left:  var(--hb-col-pull);
    right: var(--hb-col-push); 
}

/* Gutters base */
[class*="gutter-"],
.no-gutter
{
    --hb-gutter-l: initial;
    --hb-gutter-r: initial;
    padding-left: var(--hb-gutter-l);
    padding-right: var(--hb-gutter-r);
}

/* Poles base */
[class*="pole-"],
.no-pole
{
    --hb-pole-n: initial;
    --hb-pole-s: initial;
    padding-top: var(--hb-pole-n);
    padding-bottom: var(--hb-pole-s);
}
```



