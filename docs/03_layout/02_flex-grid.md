# Flex Grid

FrontBx uses a powerful 12 column grid system for building layouts to fit any screen or size.

---

*   [Introduction](#introduction)
*   [Responsive breakpoints](#responsive-breakpoints)
*   [Rows](#rows)
    *   [Responsive rows](#responsive-rows)
    *   [Fluid Rows](#fluid-rows)
*   [Columns](#columns)
    *   [Row columns](#row-columns)
    *   [Child columns](#child-columns)
    *   [Using both](#using-both)
*   [Responsive columns](#responsive-columns)
    *   [Responsive row columns](#responsive-row-columns)
    *   [Responsive child columns](#responsive-child-columns)
    *   [Responsive parent child](#responsive-parent-child)
*   [Column Gaps](#column-gaps)
    *   [Responsive column gaps](#responsive-column-gaps)
*   [Row gaps](#row-gaps)
    *   [Responsive row gaps](#responsive-row-gaps)
*   [Gutters](#gutters)
    *   [Responsive Gutters](#responsive-gutters)
*   [Poles](#poles)
    *   [Responsive poles](#responsive-poles)
*   [Alignment](#alignment)
    *   [Responsive alignment](#responsive-alignment)
*   [Order](#Order)
    *   [Responsive order](#responsive-order)
*   [CSS customization](#css-customization)

---


### Introduction

Grid systems are used for creating page layouts through a series of rows and columns that house your content. Before CSS `flex` was introduced the common way of doing things was through a 12 column grid system.

However with `flex`, the way grids and columns are structured is different. There are pros and cons to both, but once you become accustomed to using `flex` it is essentially just a another way to skin a cat.

One issue with `flex` and a grid system is that it isn't really designed for mobile-first (semantically speaking). i.e it defaults to packing in as many columns that natively fit into a space - which normally isn't what you want on mobile-first.

In FrontBx, the Flex Grid is designed to mobile-first. Meaning all children of a row will default to full-width unless overridden at a breakpoint. This makes it far easier to design grid layouts with less markup and less styling.

Here is a breakdown of how it works:

*   Use rows (`.flex-row`) to wrap columns.
*   `.col` should be applied to native elements or wrapped if you don't want their styling effected.
*   Apply row spacing, gutters and breakpoint changes to the parent `flex-row` using modifier classes.
*   Grid columns are created by specifying the number of columns you want on the parent `flex-row`.

---

### Responsive breakpoints

Because FrontBx is mobile first, all screen-size specific grid classes will be applied to the breakpoint and above. For example `.col-md-6` will apply to medium screen sizes and above, but not below. The grid system includes all the necessary screen-size specific classes.

The grid system uses both CSS Variables and Sass variables so customization can be made both pre and post compilation.

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

Rows are used to as the main wrapper element to contain columns. They will span full-width unless they're in a nested grid.

| Class       | Example     | Behavior                                                        |
|-------------|-------------|-----------------------------------------------------------------|
| `.flex-row` | `.flex-row` | Wraps around flex children. Sets any child `.col` to full width |

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code></div>
    <div class="flex-row">
        <div class="col">
            <div class="bg-salmon fill"><code>.col</code></div>
        </div>
    </div>
</div>

```html
<div class="flex-row"></div>
```

#### Responsive rows

FrontBx's grid system comes with a mobile-first fully responsive set of helpers to display rows according to screen size. You can use these helpers as modifiers on `.flex-row` to hide or show the row at different breakpoints.

The table below outlines the available options.

| Usage           | Class         | Options                    | Example             | Behavior                                    |
|-----------------|---------------|----------------------------|---------------------|---------------------------------------------|
| Breakpoint & up | `.*-flex`     | `xs` `sm` `md` `lg` `xl`   | `.flex-row.md-flex` | Displays row at specified breakpoint and up |

The example below shows two rows. The first that displays on mobile (`<md` breakpoint) and a second that displays on desktop (`>md` breakpoint).

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.xs-flex</code><code>.sm-flex</code></div>
    <div class="flex-row xs-flex sm-flex">
        <div class="col">
            <div class="bg-salmon fill"><code>.col</code></div>
        </div>
    </div>
    <div class="parent-row-diagram"><code>.flex-row</code><code>.md-flex</code><code>.lg-flex</code><code>.xl-flex</code></div>
    <div class="flex-row md-flex lg-flex xl-flex">
        <div class="col">
            <div class="bg-salmon fill"><code>.col</code></div>
        </div>
    </div>
</div>

```html
<div class="flex-row xs-flex sm-flex">
...
</div>
<div class="flex-row md-flex lg-flex xl-flex">
...
</div>
```

#### Fluid rows

`.flex-row-fluid` acts how you would expect native flex to behave. It distributes content evenly allowing each `.col` to shrink or grow as necessary to fill available space.

With `.flex-row-fluid` you can set an individual `.col` width too - other columns automatically will adjust as necessary.

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row-fluid</code></div>
    <div class="flex-row-fluid col-gaps-xs">
        <div class="col">
            <div class="bg-teal fill"><code>.col</code></div>
        </div>
        <div class="col col-6">
            <div class="bg-salmon fill"><code>.col-6</code></div>
        </div>
        <div class="col">
            <div class="bg-bb-blue fill"><code>.col</code></div>
        </div>
    </div>
</div>

```html
<div class="flex-row-fluid">
    <div class="col"></div>
    <div class="col col-6"></div>
    <div class="col"></div>
</div>
```

---

### Columns

FrontBx's flex grid system is incredibly flexible, so there are multiple ways to specify column widths depending on your needs.

1.  **On the parent `.flex-row`**
    Suitable when your columns are all evenly sized. Individual child `.col` width can be specified, while siblings retain specified width.
2.  **On child parent `.col` elements**
    Suitable when your columns need specific sizing and you don't want them to grow or shrink
3.  **Combination**
    Suitable when you have multiple columns at one size but want a few exceptions.
4.  **Fluid `.flex-row-fluid`**
    Defaults to evenly distributing sizes and spacing. Can be used with any combination of the above. 

#### 1. Row Columns

Setting column width via the `.flex-row` is easy to setup via modifier classes. Simply add `.flex-cols-*` with your desired column sizings:

| Usage       | Class          | Options | Example        | Behavior                                              |
|-------------|----------------|---------|----------------|-------------------------------------------------------|
| Column size | `.flex-cols-*` | `1-12`  | `.flex-cols-6` | Sizes child `.col` elements based on specified value. |


This example shows setting even column widths via the parent `.flex-row`:

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code></div>
    <div class="flex-row">
        <div class="col">
            <div class="bg-salmon fill"><code>.col</code></div>
        </div>
    </div>
    <div class="flex-row pole-xs"></div>
    <div class="parent-row-diagram"><code>.flex-row</code><code>.flex-cols-3</code></div>
    <div class="flex-row flex-cols-3 col-gaps-xs row-gaps-xs">
        <div class="col">
            <div class="bg-bb-blue fill"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-bb-blue fill"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill"><code>.col</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row">
    <div class="col"></div>
</div>
<div class="flex-row flex-cols-3">
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
</div>
```

#### 2. Child Columns

The core base class of FrontBx layouts is the `.col`. The table below outlines the classes and formats made available when implementing layouts using child columns.

| Usage       | Class         | Options | Example       | Behavior                                |
|-------------|---------------|---------|---------------|-----------------------------------------|
| Column base | `.col`        | n/a     | `.col`        | Defaults to full width.                 |
| Column size | `.col-*`      | `1-12`  | `.col-6`      | Sizes element based on specified value. |

Here we set the width via the child `.col` elements:

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code></div>
    <div class="flex-row">
        <div class="col col-12">
            <div class="bg-salmon fill"><code>.col-12</code></div>
        </div>
    </div>
    <div class="flex-row pole-xs"></div>
    <div class="parent-row-diagram"><code>.flex-row</code></div>
    <div class="flex-row col-gaps-xs row-gaps-xs">
        <div class="col col-3">
            <div class="bg-bb-blue fill small"><code>.col-3</code></div>
        </div>
        <div class="col col-3">
            <div class="bg-teal fill small"><code>.col-3</code></div>
        </div>
        <div class="col col-3">
            <div class="bg-bb-blue fill small"><code>.col-3</code></div>
        </div>
        <div class="col col-3">
            <div class="bg-teal fill small"><code>.col-3</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row">
    <div class="col col-12"></div>
</div>
<div class="flex-row">
    <div class="col col-3"></div>
    <div class="col col-3"></div>
    <div class="col col-3"></div>
    <div class="col col-3"></div>
</div>
```

#### 3. Using both

This design pattern uses a combination of both the parent `.flex-row` and it's children. The base column-width is defined on the parent `.flex-row`, with any individual adjustments made on individual columns. Remaining columns will remain their size defined by the parent:

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code><code>flex-cols-3</code></div>
    <div class="flex-row flex-cols-3 col-gaps-xs row-gaps-xs">
        <div class="col col-6">
            <div class="bg-salmon fill"><code>.col-6</code></div>
        </div>
        <div class="col col-6">
            <div class="bg-salmon fill"><code>.col-6</code></div>
        </div>
        <div class="col">
            <div class="bg-bb-blue fill"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-bb-blue fill"><code>.col</code></div>
        </div>
    </div>
</div>

```html
<div class="flex-row flex-cols-3">
    <div class="col col-6"></div>
    <div class="col col-6"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
</div>
```

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code><code>flex-cols-6</code></div>
    <div class="flex-row flex-cols-6 col-gaps-xs row-gaps-xs">
        <div class="col">
            <div class="bg-salmon fill"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-salmon fill"><code>.col</code></div>
        </div>
        <div class="col col-4">
            <div class="bg-bb-blue fill"><code>.col-4</code></div>
        </div>
        <div class="col col-4">
            <div class="bg-teal fill"><code>.col-4</code></div>
        </div>
        <div class="col col-4">
            <div class="bg-bb-blue fill"><code>.col-4</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row flex-cols-6">
    <div class="col"></div>
    <div class="col"></div>
    <div class="col col-4"></div>
    <div class="col col-4"></div>
    <div class="col col-4"></div>
</div>
```

---

### Responsive Columns

The flex grid system comes with a mobile-first fully responsive set of helpers to size column layouts according to screen size.

Because flex by default spaces children evenly, FrontBx has made all flex columns full-width at mobile size. You then overwrite their widths either individually or via the parent `.flex-row` at breakpoints:

#### Responsive row columns

Setting responsive column width via the `.flex-row` is easy to setup via modifier classes. Simply add `.flex-cols-[breakpoint]-[size]` with your desired column sizings.

The table below outlines the available options.

| Usage           | Class                            | Options                                  | Example          | Behavior                                                  |
|-----------------|----------------------------------|------------------------------------------|------------------|-----------------------------------------------------------|
| Breakpoint size | `.flex-cols-[breakpoint]-[size]` | `xxs`, `xs` `sm` `md` `lg` `xl` & `1-12` | `.flex-col-sm-3` | Sizes child `.col` elements to width on breakpoint and up |

This example shows setting even column widths at `.col-6` on mobile and `.col-3'` at breakpoint `lg` and above via parent `.flex-row`:

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code> <code>.flex-cols-3</code> <code>.flex-cols-lg-6</code></div>
    <div class="flex-row flex-cols-3 flex-cols-lg-6 col-gaps-xs row-gaps-xs">
        <div class="col">
            <div class="bg-bb-blue fill"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-bb-blue fill"><code>.col</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row flex-cols-3 flex-cols-lg-6">
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
</div>
```

#### Responsive child columns

Setting responsive column width via the child `.col` elements is easy to setup via modifier classes. Simply add `.col-[breakpoint]-[size]` with your desired column sizings.

| Usage           | Class                      | Options                                  | Example          | Behavior                                           |
|-----------------|----------------------------|------------------------------------------|------------------|----------------------------------------------------|
| Breakpoint size | `.col-[breakpoint]-[size]` | `xxs`, `xs` `sm` `md` `lg` `xl` & `1-12` | `.flex-col-sm-3` | Sizes `.col` element to width on breakpoint and up |

This example shows setting even column widths at `.col-6` on mobile and `.col-4'` at breakpoint `md` and above via child `.col` elements:

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code></div>
    <div class="flex-row col-gaps-xs row-gaps-xs">
        <div class="col col-6 col-md-4">
            <div class="bg-bb-blue fill small"><code>.col-6</code><code>.col-md-4</code></div>
        </div>
        <div class="col col-6 col-md-4">
            <div class="bg-teal fill small"><code>.col-6</code><code>.col-md-4</code></div>
        </div>
        <div class="col col-6 col-md-4">
            <div class="bg-bb-blue fill small"><code>.col-6</code><code>.col-md-4</code></div>
        </div>
        <div class="col col-6 col-md-12">
            <div class="bg-salmon fill small"><code>.col-6</code><code>.col-md-12</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row">
    <div class="col-6 col-md-4"></div>
    <div class="col-6 col-md-4"></div>
    <div class="col-6 col-md-4"></div>
    <div class="col-6 col-md-12"></div>
</div>
```

#### Responsive parent child

This example shows setting even column widths at `.col-6` on mobile and `.col-4'` at breakpoint `lg` and above via parent `.flex-row` with one column set to `.col-12` at breakpoint `lg` and above:

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.flex-cols-6</code><code>.flex-cols-lg-4</code></div>
    <div class="flex-row flex-cols-6 flex-cols-lg-4 col-gaps-xs row-gaps-xs">
        <div class="col col-lg-12">
            <div class="bg-salmon fill small"><code>.col</code><code>.col-lg-12</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-bb-blue fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row flex-cols-6 flex-cols-lg-4">
    <div class="col col-lg-12"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
</div>
```

---

### Column Gaps

Column gaps define the spacing between columns in a row and can be set via the parent `.flex-row` with modifier classes. By default there are no column gaps in a `.flex-row` unless specified.

| Usage       | Class              | Options                         | Example        | Behavior                                                |
|-------------|--------------------|---------------------------------|----------------|---------------------------------------------------------|
| Gap size    | `.col-gaps-[size]` | `xxs`, `xs` `sm` `md` `lg` `xl` | `.col-gaps-xs` | Spaces horizontal gaps between columns to size          |

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.flex-cols-6</code><code>.col-gaps-lg</code></div>
    <div class="flex-row flex-cols-6 col-gaps-lg row-gaps-xs">
        <div class="col">
            <div class="bg-bb-blue fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-bb-blue fill small"><code>.col</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row flex-cols-6 col-gaps-lg">
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
</div>
```

#### Responsive column gaps

FrontBx's grid system comes with mobile-first fully responsive set of helpers to size gutters according to screen size. The table below outlines the available options.

| Usage               | Class                           | Options                                                                | Example           | Behavior                                                            |
|---------------------|---------------------------------|------------------------------------------------------------------------|-------------------|---------------------------------------------------------------------|
| Breakpoint gap size | `.col-gaps-[breakpoint]-[size]` | `xs`, `xs` `sm` `md` `lg` `xl` & `xxs`, `xs`, `xs` `sm` `md` `lg` `xl` | `.col-gaps-md-lg` | Spaces horizontal gaps between columns to size at breakpoint and up |


The example below shows column gaps set to `xs` on mobile and `lg` on breakpoint `>=md`:

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.flex-cols-6</code><code>.col-gaps-xs</code><code>.col-gaps-md-lg</code></div>
    <div class="flex-row flex-cols-6 col-gaps-xs col-gaps-md-lg row-gaps-xs">
        <div class="col">
            <div class="bg-bb-blue fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-bb-blue fill small"><code>.col</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row flex-cols-6 col-gaps-xs">
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
</div>
```

---

### Row Gaps

Row gaps define the spacing between rows. With FrontBx' flex grid, you set this via the parent `.flex-row`.

| Usage       | Class              | Options                         | Example        | Behavior                                         |
|-------------|--------------------|---------------------------------|----------------|--------------------------------------------------|
| Gap size    | `.row-gaps-[size]` | `xxs`, `xs` `sm` `md` `lg` `xl` | `.col-gaps-xs` | Spaces vertical gaps between column rows to size |

<div class="code-content-example">
     <div class="parent-row-diagram"><code>.flex-row</code><code>.flex-cols-6</code><code>.row-gaps-md</code></div>
    <div class="flex-row flex-cols-6 row-gaps-md col-gaps-xs">
        <div class="col">
            <div class="bg-bb-blue fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-bb-blue fill small"><code>.col</code></div>
        </div>
    </div>
</div> 

```html
<div class="lex-row flex-cols-6 row-gaps-md">
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
</div>
```

#### Responsive row gaps

FrontBx's grid system comes with mobile-first fully responsive set of helpers to size row gaps according to screen size. The table below outlines the available options.

| Usage               | Class                           | Options                                                                | Example           | Behavior                                                              |
|---------------------|---------------------------------|------------------------------------------------------------------------|-------------------|-----------------------------------------------------------------------|
| Breakpoint gap size | `.row-gaps-[breakpoint]-[size]` | `xs`, `xs` `sm` `md` `lg` `xl` & `xxs`, `xs`, `xs` `sm` `md` `lg` `xl` | `.col-gaps-md-lg` | Spaces vertical gaps between column rows to size at breakpoint and up |

The example below shows row gaps set to `xs` on mobile and `lg` on breakpoint `>=md`:

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.flex-cols-6</code><code>.row-gaps-xs</code><code>.row-gaps-md-lg</code></div>
    <div class="flex-row flex-cols-6 row-gaps-xs row-gaps-md-lg col-gaps-xs">
        <div class="col">
            <div class="bg-bb-blue fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-bb-blue fill small"><code>.col</code></div>
        </div>
    </div>
</div> 

```html
<div class="lex-row flex-cols-6 row-gaps-md">
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
    <div class="col"></div>
</div>
```

---

### Gutters

Gutters can be used to push columns away from each other.

| Usage       | Class            | Options                         | Example        | Behavior                                               |
|-------------|------------------|---------------------------------|----------------|--------------------------------------------------------|
| Gutter size | `.gutter-[size]` | `xxs`, `xs` `sm` `md` `lg` `xl` | `.gutter-lg`   | Applies margin size gutter to both sides of the column |
| Gutter side | `.gutter-[side]` | `l`, `r`                        | `.gutter-r`    | Applies margin to left or right gutter only            |
| No gutter   | `.no-gutter`     | None                            | `.no-gutter`   | Sets horizontal margins to zero                        |
| Auto gutter | `.auto-gutter`   | None                            | `.auto-gutter` | Sets horizontal margins to auto                        |

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code></div>
    <div class="flex-row">
        <div class="col col-6 gutter-xs gutter-r">
            <div class="bg-bb-blue fill small"><code>.gutter-xs</code><code>.gutter-r</code></div>
        </div>
        <div class="col col-6 gutter-xs gutter-l">
            <div class="bg-teal fill small"><code>.gutter-xs</code><code>.gutter-l</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row">
    <div class="col col-6 gutter-xs gutter-r"></div>
    <div class="col col-6 gutter-xs gutter-l"></div>
</div>
```

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.align-cols-center-x</code></div>
    <div class="flex-row align-cols-center-x">
        <div class="col col-md-4 gutter-xs gutter-r">
            <div class="bg-bb-blue fill smaller"><code>.col-md-4</code><code>.gutter-xs</code><br><code>.gutter-r</code></div>
        </div>
        <div class="col col-md-4 gutter-xs gutter-l">
            <div class="bg-teal fill smaller"><code>.col-md-4</code><code>.gutter-xs</code><br><code>.gutter-l</code></div>
        </div>
    </div>
    <div class="row pole-xs"></div>
    <div class="parent-row-diagram"><code>.flex-row</code></div>
    <div class="flex-row row-gaps-xs">
        <div class="col col-md-4 auto-gutter gutter-r">
            <div class="bg-bb-blue fill smaller"><code>.col-md-4</code><code>.auto-gutter</code><br><code>.gutter-r</code></div>
        </div>
        <div class="col col-md-4">
            <div class="bg-teal fill smaller"><code>.col-md-4</code></div>
        </div>
    </div>
    <div class="row pole-xs"></div>
    <div class="parent-row-diagram"><code>.flex-row</code></div>
    <div class="flex-row row-gaps-xs">
        <div class="col col-md-4 auto-gutter">
            <div class="bg-teal fill smaller"><code>.col-md-4</code><code>.auto-gutter</code></div>
        </div>
        <div class="col col-md-4 auto-gutter">
            <div class="bg-bb-blue fill smaller"><code>.col-md-4</code><code>.auto-gutter</code></div>
        </div>
    </div>
</div>


```html
<div class="flex-row align-cols-center-x">
    <div class="col col-md-4 gutter-xs gutter-r"></div>
    <div class="col col-md-4 gutter-xs gutter-l"></div>
</div>
<div class="flex-row">
    <div class="col col-md-4 auto-gutter gutter-r"></div>
    <div class="col col-md-4"></div>
</div>
<div class="flex-row">
    <div class="col col-md-4 auto-gutter"></div>
    <div class="col col-md-4 auto-gutter"></div>
</div>
```


#### Responsive gutters

FrontBx's grid system comes with mobile-first fully responsive set of helpers to size gutters according to screen size. The table below outlines the available options.

| Usage           | Class                         | Options                        | Example         | Behavior                                                                                      |
|-----------------|-------------------------------|--------------------------------|-----------------|-----------------------------------------------------------------------------------------------|
| Breakpoint size | `.gutter-[breakpoint]-[size]` | `xxs`,`xs` `sm` `md` `lg` `xl` | `.gutter-md-lg` | Applies horizontal margin size gutter to both sides of element at specified breakpoint and up |
| Breakpoint side | `.gutter-[breakpoint]-[side]` | `l`, `r`                       | `.gutter-md-r`  | Applies horizontal margin to left or right gutter only - at specified breakpoint and up       |
| No gutter       | `.no-gutter-[breakpoint]`     | `xxs`,`xs` `sm` `md` `lg` `xl` | `.no-gutter-md` | Sets no horizontal margin at specified breakpoint and up                                      |
| Auto gutter     | `.auto-gutter-[breakpoint]`   | None                           | `.auto-gutter`  | Sets horizontal margins to auto                                                               |

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code></div>
    <div class="flex-row">
        <div class="col col-6 gutter-xs gutter-r gutter-md-lg gutter-lg-r">
            <div class="bg-bb-blue fill small"><code>.gutter-xs</code><code>.gutter-r</code><br><code>.gutter-md-lg</code><code>.gutter-lg-r</code></div>
        </div>
        <div class="col col-6 gutter-xs gutter-l gutter-md-lg gutter-lg-l">
            <div class="bg-teal fill small"><code>.gutter-xs</code><code>.gutter-l</code><br><code>.gutter-md-lg</code><code>.gutter-lg-l</code></div>
        </div>
    </div>
</div>

```html
<div class="flex-row">
    <div class="col col-6 gutter-xs gutter-r gutter-md-lg gutter-lg-r">
        ...
    </div>
    <div class="col col-6 gutter-xs gutter-l gutter-md-lg gutter-lg-l">
        ...
    </div>
</div>
```

---

### Poles

Poles are essentially vertical gutters. `.pole-n` applies a `padding-top` value while `.pole-s` applies a `padding-bottom` value.

Poles can be used to space consecutive `.flex-row` element or `.col` elements that serve as containers.

The table below outlines the classes and formats made available for poles.

| Usage     | Class      | Options                         | Example    | Behavior                                                    |
|-----------|------------|---------------------------------|------------|-------------------------------------------------------------|
| Pole size | `.pole-*`  | `xxs`, `xs`,`sm`,`md`,`lg`,`xl` | `.pole-lg` | Applies padding size pole to both top and bottom of element |
| Pole side | `.pole-*`  | `n`, `s`                        | `.pole-s`  | Applies padding to top or bottom pole only                  |
| No pole   | `.no-pole` | None                            | `.no-pole` | Sets vertical padding to zero                               |


<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code></div>
    <div class="flex-row col-gaps-xs">
        <div class="col col-6 pole-xs">
            <div class="bg-bb-blue fill small"><code>.col</code><code>.pole-xs</code></div>
        </div>
        <div class="col col-6 pole-xs">
            <div class="bg-teal fill small"><code>.col</code><code>.pole-xs</code></div>
        </div>
        <div class="col col-12">
            <div class="bg-salmon fill thin"><code>.col-12</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row ">
    <div class="col col-6 pole-xs"></div>
    <div class="col col-6 pole-xs"></div>
    <div class="col col-12"></div>
</div>
```

#### Responsive poles

FrontBx's grid system comes with mobile-first fully responsive set of helpers to size gutters according to screen size. The table below outlines the available options.

| Usage           | Class        | Options                        | Example       | Behavior                                                                                         |
|-----------------|--------------|--------------------------------|---------------|--------------------------------------------------------------------------------------------------|
| Breakpoint size | `.pole-*-*`  | `xxs`,`xs`,`sm`,`md`,`lg`,`xl` | `.pole-md-lg` | Applies vertical padding size pole to both top and bottom element at specified breakpoint and up |
| Breakpoint pole | `.pole-*`    | `n`, `s`                       | `.pole-md-s`  | Applies vertical padding to top or bottom pole only - at specified breakpoint and up             |
| No pole         | `.no-pole-*` | `xxs`,`xs`,`sm`,`md`,`lg`,`xl` | `.no-pole-md` | Sets no vertical padding at specified breakpoint and up                                          |

In the example below, the first col the poles are sized differently and different breakpoints:

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code></div>
    <div class="flex-row">
        <div class="col col-12 pole-xxs pole-lg-xs">
            <div class="bg-salmon fill small"><code>.col</code><code>.pole-xxs</code><code>.pole-lg-xs</code></div>
        </div>
        <div class="col col-12 pole-xxs pole-lg-xs">
            <div class="bg-salmon fill small"><code>.col</code><code>.pole-xxs</code><code>.pole-lg-xs</code></div>
        </div>
    </div>
</div>

```html
<div class="flex-row">
    <div class="col col-12 pole-xxs pole-lg-xs"></div>
    <div class="col col-12 pole-xxs pole-lg-xs"></div>
</div>
```

---

### Alignment

Alignment can be thought of in two ways.

1. The positioning of available free-space within a grid.
2. The positioning of items within a grid.

With FrontBx's flex grid, we define alignment by option two as this just makes more sense and is simpler. With FrontBx's flex grid, you set this via the parent `.flex-row` using the `.align-cols-[position]` modifier classes.

The table below outlines the available alignment options:

**Axis alignments**
| Class                      | Behavior                                                                |
|----------------------------|-------------------------------------------------------------------------|
| `.align-cols-left`        | Aligns items to left of container                                        |
| `.align-cols-right`       | Aligns items to right of container                                       |
| `.align-cols-top`         | Aligns items to top of container                                         |
| `.align-cols-bottom`      | Aligns items to bottom of container                                      |
| `.align-cols-center-x`    | Aligns items to horizontal center of container                           |
| `.align-cols-center-y`    | Aligns items to vertical center of container                             |
| `.align-cols-center`      | Aligns items to vertical and horizontal center of container              |

**Spacing alignments**
| Class                      | Behavior                                                                |
|----------------------------|-------------------------------------------------------------------------|
| `.align-cols-y-stretch`   | Makes all items full width vertically                                    |
| `.align-cols-y-baseline`  | Aligns items to vertical baseline of items                               |
| `.align-cols-x-between`   | Distributes any space between items horizontally                         |
| `.align-cols-x-around`    | Distributes any space around items horizontally                          |
| `.align-cols-x-evenly`    | Distributes any space evenly between items and around items horizontally |

<div class="code-content-example flex-show-h-space">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.align-cols-center-x</code></div>
    <div class="flex-row flex-cols-3 col-gaps-xs align-cols-center-x">
        <div class="col">
            <div class="bg-bb-blue fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
        <div class="col col-12 pole-xs pole-s"></div>
    </div>
</div> 

```html
<div class="flex-row flex-cols-3 align-cols-center-x">
    <div class="col"></div>
    <div class="col"></div>
</div>
```

<div class="code-content-example flex-show-v-space">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.align-cols-center-y</code></div>
    <div class="flex-row flex-cols-3 col-gaps-xs align-cols-center-y">
        <div class="col">
            <div class="bg-bb-blue fill small"><code>.col</code></div>
        </div>
        <div class="col">
            <div class="bg-teal fill small"><code>.col</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row flex-cols-3 align-cols-center-y">
    <div class="col"></div>
    <div class="col"></div>
</div>
```

#### Responsive Alignment

All alignment classes are available through breakpoint specific targeting with `.align-cols-[breakpoint]-[position]` modifier classes. The table below outlines the available alignment options:

\* *For the sake of brevity, breakponts are `xs`, `sm`, `md`, `lg` amd `xl`*

**Axis alignments**
| Class                               | Behavior                                                                           |
|-------------------------------------|------------------------------------------------------------------------------------|
| `.align-cols-[breakpoint]-left`     | Aligns items to left of container at specified breakpoint and up                   |
| `.align-cols-[breakpoint]-right`    | Aligns items to right of container at specified breakpoint and up                  |
| `.align-cols-[breakpoint]-top`      | Aligns items to top of container at specified breakpoint and up                    |
| `.align-cols-[breakpoint]-bottom`   | Aligns items to bottom of container at specified breakpoint and up                 |
| `.align-cols-[breakpoint]-center-x` | Aligns items to horizontal center of container at specified breakpoint and up      |
| `.align-cols-[breakpoint]-center-y` | Aligns items to vertical center of container at specified breakpoint and up        |
| `.align-cols-[breakpoint]-center`   | Aligns items to horizontal and vertically container at specified breakpoint and up |


**Spacing alignments**
| Class                                 | Behavior                                                                                                |
|---------------------------------------|---------------------------------------------------------------------------------------------------------|
| `.align-cols-[breakpoint]-y-stretch`  | Makes all items full width vertically at specified breakpoint and up                                    |
| `.align-cols-[breakpoint]-y-baseline` | Aligns items to vertical baseline of items at specified breakpoint and up                               |
| `.align-cols-[breakpoint]-x-between`  | Distributes any space between items horizontally at specified breakpoint and up                         |
| `.align-cols-[breakpoint]-x-around`   | Distributes any space around items horizontally at specified breakpoint and up                          |
| `.align-cols-[breakpoint]-x-evenly`   | Distributes any space evenly between items and around items horizontally at specified breakpoint and up |


<div class="code-content-example flex-show-h-space">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.align-cols-md-center-x</code></div>
    <div class="flex-row flex-cols-2 col-gaps-xs align-cols-md-center-x">
        <div class="col">
            <div class="bg-bb-blue fill">.col</div>
        </div>
        <div class="col">
            <div class="bg-teal fill">.col</div>
        </div>
    </div>
</div> 

```html
<div class="flex-row flex-cols-2 align-cols-md-center-x">
    <div class="col"></div>
    <div class="col"></div>
</div>
```

<div class="code-content-example flex-show-v-space">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.align-cols-md-center-y</code></div>
    <div class="flex-row flex-cols-6 col-gaps-xs align-cols-md-center-y">
        <div class="col">
            <div class="bg-bb-blue fill">.col</div>
        </div>
        <div class="col">
            <div class="bg-teal fill">.col</div>
        </div>
    </div>
</div> 

```html
<div class="flex-row flex-cols-6 align-cols-md-center-y">
    <div class="col"></div>
    <div class="col"></div>
</div>
```

### Order

Use `.order-[num]` classes to re-arrange content within a grid.

| Usage       | Class          | Options | Example    | Behavior                  |
|-------------|----------------|---------|------------|---------------------------|
| Order value | `.order-[num]` | `1-5`   | `.order-2` | Sets column order in grid |

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.flex-cols-4</code></div>
    <div class="flex-row flex-cols-4 col-gaps-xs row-gaps-xs">
        <div class="col">
            <div class="bg-salmon fill small">1. <code>.col</code></div>
        </div>
        <div class="col order-5">
            <div class="bg-bb-blue fill small">2. <code>.col</code><code>.order-5</code></div>
        </div>
        <div class="col order-1">
            <div class="bg-teal fill small">3. <code>.col</code> <code>.order-1</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row flex-cols-4 col-gaps-xs row-gaps-xs">
        <div class="col"></div>
        <div class="col order-5"></div>
        <div class="col order-1"></div>
    </div>
```

#### Responsive order

Responsive order can be used through `.order-[breakpoint]-[num]` classes to re-arrange content at breakpoints and up.

| Usage       | Class                       | Options                              | Example       | Behavior                                       |
|-------------|-----------------------------|--------------------------------------|---------------|------------------------------------------------|
| Order value | `.order-[breakpoint]-[num]` | `xs`, `sm`, `md`, `lg`, `xl` & `1-5` | `.order-md-2` | Sets column order in grid at breakpoint and up |

<div class="code-content-example">
    <div class="parent-row-diagram"><code>.flex-row</code><code>.flex-cols-4</code></div>
    <div class="flex-row flex-cols-4 col-gaps-xs row-gaps-xs">
        <div class="col">
            <div class="bg-salmon fill small">1. <code>.col</code></div>
        </div>
        <div class="col order-md-5">
            <div class="bg-bb-blue fill small">2. <code>.col</code><code>.order-md-5</code></div>
        </div>
        <div class="col order-md-1">
            <div class="bg-teal fill small">3. <code>.col</code><code>.order-md-1</code></div>
        </div>
    </div>
</div> 

```html
<div class="flex-row flex-cols-4 col-gaps-xs row-gaps-xs">
        <div class="col"></div>
        <div class="col order-md-5"></div>
        <div class="col order-md-1"></div>
    </div>
```

### CSS Customization

The grid system uses a combination of both local CSS variables and Sass variables for enhanced component customization and styling. The base values are used by the UI to create all the sizing. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
`src/scss/_config.scss`
```
```sass
$breakpoints:
(
    'xs':                       $breakpoint-xs,
    'sm':                       $breakpoint-sm,
    'md':                       $breakpoint-md,
    'lg':                       $breakpoint-lg,
    'xl':                       $breakpoint-xl,
) !default;

// Grid gutters
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
.flex-row,
.flex-row-fluid
{
    --fbx-flex-wrap: wrap;
    --fbx-flex-direction: row;
    --fbx-flex-col-gaps: 0px;
    --fbx-flex-row-gaps: 0px;
}

/* Columns */
.col
{
    --fbx-col-flex: 0 0 100%;
    --fbx-col-width: 100%;
    --fbx-gutter-l: initial;
    --fbx-gutter-r: initial;
    --fbx-pole-n: initial;
    --fbx-pole-s: initial;
}
```
