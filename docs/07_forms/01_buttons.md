# Buttons

---

FrontBx comes with a vast varietu of button options and styles, making it super simple to create buttons on just about any surface.

---

*   [Basic example](#basic-example)
*   [Contextual button](#contextual-buttons)
*   [Outline button](#outline-buttons)
*   [Pure button](#pure-buttons)
*   [Raised buttons](#raised-buttons)
*   [On-Primary buttons](#on-primary-buttons)
*   [Circle buttons](#circle-buttons)
*   [Icon buttons](#icon-buttons)
*   [Button sizes](#button-sizes)
*   [Loading buttons](#loading-buttons)
*   [Button groups](#button-groups)
*   [Button states](#button-states)
*   [CSS customization](#css-customization)

---

### Basic example

Buttons can be created by simply adding the `.btn` class to a `&lt;a&gt;` or `&lt;button&gt;` element.

<div class="code-content-example">
    <div class="container-fuid">
        <button class="btn" type="button">Button</button>
        <a class="btn" href="#">Button</a>
    </div>
</div>

```html
<button class="btn" type="button">Button</button>
<a class="btn" href="#" >Button</a>
```

---

### Contextual buttons

Add the contextual classes `.btn-primary`, `.btn-info`, `.btn-success`, `.btn-warning` and `.btn-danger` to contextualise button styling.

<div class="code-content-example">
    <div class="container-fuid">
        <button class="btn" type="button">.btn</button>
        <button class="btn btn-primary" type="button">.btn-primary</button>
        <button class="btn btn-info" type="button">.btn-info</button>
        <button class="btn btn-success" type="button">.btn-success</button>
        <button class="btn btn-warning" type="button">.btn-warning</button>
        <button class="btn btn-danger" type="button">.btn-danger</button>
    </div>
</div>

```html
<button class="btn" type="button">.btn</button>
<button class="btn btn-primary" type="button">.btn-primary</button>
<button class="btn btn-info" type="button">.btn-info</button>
<button class="btn btn-success" type="button">.btn-success</button>
<button class="btn btn-warning" type="button">.btn-warning</button>
<button class="btn btn-danger" type="button">.btn-danger</button>
```

---

### Outline buttons

Add the `.btn-outline` to any button to change the style to an outline.

<div class="code-content-example">
    <div class="container-fuid">
        <button class="btn btn-outline" type="button">.btn</button>
        <button class="btn btn-primary btn-outline" type="button">.btn-primary</button>
        <button class="btn btn-info btn-outline" type="button">.btn-info</button>
        <button class="btn btn-success btn-outline" type="button">.btn-success</button>
        <button class="btn btn-warning btn-outline" type="button">.btn-warning</button>
        <button class="btn btn-danger btn-outline" type="button">.btn-danger</button>
    </div>
</div>

```html
<button class="btn btn-outline" type="button">.btn</button>
<button class="btn btn-primary btn-outline" type="button">.btn-primary</button>
...
```

---

### Pure buttons

Add the `.pure` class to any button to remove all borders and drop shadows.

<div class="code-content-example">
    <div class="container-fuid">
        <button class="btn btn-pure" type="button">.btn</button>
        <button class="btn btn-primary btn-pure" type="button">.btn-primary</button>
        <button class="btn btn-info btn-pure" type="button">.btn-info</button>
        <button class="btn btn-success btn-pure" type="button">.btn-success</button>
        <button class="btn btn-warning btn-pure" type="button">.btn-warning</button>
        <button class="btn btn-danger btn-pure" type="button">.btn-danger</button>
    </div>
</div>

```html
<button class="btn btn-pure" type="button">.btn</button>
<button class="btn btn-primary btn-pure" type="button">.btn-primary</button>
...
```

---

### raised buttons

Add the `.raised-1`, `.raised-2`, or `.raised-3` classes to any button elevate its UI heirarchy:

<div class="code-content-example">
    <div class="container-fuid text-center">
        <button class="btn raised-1" type="button">.btn</button>
        &nbsp;&nbsp;
        <button class="btn raised-2" type="button">.btn</button>
        &nbsp;&nbsp;
        <button class="btn raised-3" type="button">.btn</button>
    </div>
</div>

```html
<button class="btn raised-1" type="button">.btn</button>
<button class="btn raised-2" type="button">.btn</button>
<button class="btn raised-3" type="button">.btn</button>
```

---

### On-Primary buttons

Add the contextual `.btn-white` class for buttons that are on a primary background.</p>

<div class="code-content-example">
    <div class="container-fuid bg-primary pad-20">
        <button class="btn btn-white" type="button">.btn-white</button>
        <button class="btn btn-white btn-outline" type="button">.btn-outline</button>
        <button class="btn btn-white btn-pure" type="button">.btn-pure</button>
        <button class="btn btn-white with-loading active" type="button"><span class="loader loader-3"></span> Spin! </button>
    </div>
</div>

```html
<button class="btn btn-white" type="button">.btn-white</button>
<button class="btn btn-white btn-outline" type="button">.btn-outline</button>
<button class="btn btn-white btn-pure" type="button">.btn-pure</button>
<button class="btn btn-white with-loading active" type="button"><svg>...</svg></button>
```

---

### Circle buttons

Add the `.btn-circle` class to any button to change the style to a circled type.

<div class="code-content-example">
    <div class="container-fuid">
        <button class="btn btn-primary btn-circle btn-xs" type="button">
            <span class="fa fa-headphones"></span>
        </button>
        <button class="btn btn-info btn-circle btn-sm" type="button">
            <span class="fa fa-headphones"></span>
        </button>
        <button class="btn btn-success btn-circle" type="button">
            <span class="fa fa-headphones"></span>
        </button>
        <button class="btn btn-warning btn-circle btn-lg" type="button">
            <span class="fa fa-headphones"></span>
        </button>
        <button class="btn btn-danger btn-circle btn-xl" type="button">
            <span class="fa fa-headphones"></span>
        </button>
    </div>
</div>

```html
<button class="btn btn-primary btn-circle" type="button">
    <span class="fa fa-headphones"></span>
</button>
```

---

### Icon buttons

You can add icons to buttons using the font awesome icon library. No special markup is needed. You can however use an html `&nbsp;` spacing character if you want extra spacing.

<div class="code-content-example">
    <div class="container-fuid">
        <button class="btn" type="button">
            <span class="fa fa-headphones"></span>&nbsp;&nbsp;.btn
        </button>
        <button class="btn btn-outline" type="button">
            <span class="fa fa-headphones"></span>&nbsp;&nbsp;.btn-outline
        </button>
        <button class="btn btn-pure" type="button">
            <span class="fa fa-headphones"></span>&nbsp;&nbsp;.btn-pure
        </button>
        <button class="btn" type="button">
            <span class="fa fa-headphones"></span>
        </button>
        <button class="btn btn-outline" type="button">
            <span class="fa fa-headphones"></span>
        </button>
        <button class="btn btn-pure" type="button">
            <span class="fa fa-headphones"></span>
        </button>
    </div>
</div>

```html
<button class="btn" type="button">
    <span class="fa fa-headphones"></span>&nbsp;&nbsp;.btn
</button>
<button class="btn btn-outline" type="button">
    <span class="fa fa-headphones"></span>&nbsp;&nbsp;.btn-outline
</button>
<button class="btn btn-pure" type="button">
    <span class="fa fa-headphones"></span>&nbsp;&nbsp;.btn-pure
</button>
```

---

### Button sizes

Buttons can be sized using 4 different sizing classes `.btn-xs`, `.btn-sm`, `.btn-lg` &amp; `.btn-xl`. The defauly `.btn` size sits in between the `.btn-sm`, `.btn-lg` sizes.

<div class="code-content-example">
    <div class="container-fuid">
        <button class="btn btn-xs" type="button"><span class="fa fa-heart"></span>.btn-xs</button>
        <button class="btn btn-sm" type="button"><span class="fa fa-heart"></span>.btn-sm</button>
        <button class="btn" type="button"><span class="fa fa-heart"></span>.btn</button>
        <button class="btn btn-lg" type="button"><span class="fa fa-heart"></span>.btn-lg</button>
        <button class="btn btn-xl" type="button"><span class="fa fa-heart"></span>.btn-xl</button>
    </div>
</div>

```html
<button class="btn btn-xs" type="button">.btn-xs</button>
<button class="btn btn-sm" type="button">.btn-sm</button>
<button class="btn" type="button">.btn</button>
<button class="btn btn-lg" type="button">.btn-lg</button>
<button class="btn btn-xl" type="button">.btn-xl</button>
```

---

### Loading buttons

Add one of FrontBx' loaders inside any button and give the button a `.with-loading` class. When the button has the `.active` class the loading animation will show

```html
<span class="loader loader-3"></span>
```
<div class="code-content-example">
    <div class="container-fuid">
        <button class="btn with-loading active" type="button">
            <span class="loader loader-1"></span> Loading...
        </button>
        <button class="btn with-loading btn-primary active" type="button">
            <span class="loader loader-2"></span> Loading...
        </button>
        <button class="btn with-loading btn-info active" type="button">
            <span class="loader loader-3"></span> Loading...
        </button>
        <button class="btn with-loading btn-info active" type="button">
            <span class="loader loader-4"></span> Loading...
        </button>
    </div>
</div>

```html
<button class="btn with-loading active" type="button">
    <span class="loader loader-1"></span> Loading...
</button>

<button class="btn with-loading active" type="button">
    <span class="loader loader-2"></span> Loading...
</button>

<button class="btn with-loading active" type="button">
    <span class="loader loader-3"></span> Loading...
</button>

<button class="btn with-loading active" type="button">
    <span class="loader loader-4"></span> Loading...
</button>
```

---

### Button groups

Create groups by wrapping a set of buttons in a `.btn-group` classed element.

<div class="code-content-example">
    <div class="container-fuid">
        <div class="btn-group floor-xs">
            <button class="btn btn-icon" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
            <button class="btn btn-icon" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
            <button class="btn btn-icon" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
            <button class="btn btn-icon" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
        </div>
        <div class="btn-group btn-pill floor-xs">
            <button class="btn btn-outline" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
            <button class="btn btn-outline" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
            <button class="btn btn-outline" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
            <button class="btn btn-outline" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
        </div>
        <div class="btn-group">
            <button class="btn btn-pure" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
            <button class="btn btn-pure" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
            <button class="btn btn-pure" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
            <button class="btn btn-pure" type="button">
                <span class="fa fa-headphones icon-md"></span>
            </button>
        </div>
    </div>
</div>

```html

<div class="btn-group floor-xs">
    ...
</div>

```

---

### Button states

Button states are native, but work also with a class to use `.active`, `.hover`, `.disabled`

<div class="code-content-example">
    <div class="container-fuid">
        <button class="btn" type="button">Normal</button>
        <button class="btn hover" type="button">Hover</button>
        <button class="btn active" type="button">Active</button>
        <button class="btn disabled" type="button">Disabled</button>
        <div class="row roof-xs floor-xs"></div>
        <button class="btn btn-primary" type="button">Normal</button>
        <button class="btn btn-primary hover" type="button">Hover</button>
        <button class="btn btn-primary active" type="button">Active</button>
        <button class="btn btn-primary disabled" type="button">Disabled</button>
        <div class="row roof-xs floor-xs"></div>
        <button class="btn btn-primary btn-outline" type="button">Normal</button>
        <button class="btn btn-primary btn-outline hover" type="button">Hover</button>
        <button class="btn btn-primary btn-outline active" type="button">Active</button>
        <button class="btn btn-primary btn-outline disabled" type="button">Disabled</button>
        <div class="row roof-xs floor-xs"></div>
        <button class="btn btn-primary btn-pure" type="button">Normal</button>
        <button class="btn btn-primary btn-pure hover" type="button">Hover</button>
        <button class="btn btn-primary btn-pure active" type="button">Active</button>
        <button class="btn btn-primary btn-pure disabled" type="button">Disabled</button>
    </div>
</div>

```html
<button class="btn" type="button">Normal</button>
<button class="btn hover" type="button">Hover</button>
<button class="btn active" type="button">Active</button>
<button class="btn disabled" type="button">Disabled</button>
```

States for `btn-white` will also work

<div class="code-content-example">
    <div class="bg-primary pad-20">
        <button class="btn btn-white" type="button">Normal</button>
        <button class="btn btn-white hover" type="button">Hover</button>
        <button class="btn btn-white active" type="button">Active</button>
        <button class="btn btn-white disabled" type="button">Disabled</button>
        <div class="row roof-xs floor-xs"></div>
        
        <button class="btn btn-white" type="button">Normal</button>
        <button class="btn btn-white hover" type="button">Hover</button>
        <button class="btn btn-white active" type="button">Active</button>
        <button class="btn btn-white disabled" type="button">Disabled</button>
        
        <div class="row roof-xs floor-xs"></div>
        
        <button class="btn btn-white btn-outline" type="button">Normal</button>
        <button class="btn btn-white btn-outline hover" type="button">Hover</button>
        <button class="btn btn-white btn-outline active" type="button">Active</button>
        <button class="btn btn-white btn-outline disabled" type="button">Disabled</button>
        
        <div class="row roof-xs floor-xs"></div>
        
        <button class="btn btn-white btn-pure" type="button">Normal</button>
        <button class="btn btn-white btn-pure hover" type="button">Hover</button>
        <button class="btn btn-white btn-pure active" type="button">Active</button>
        <button class="btn btn-white btn-pure disabled" type="button">Disabled</button>
    </div>
</div>

```html
<button class="btn" type="button">Normal</button>
<button class="btn hover" type="button">Hover</button>
<button class="btn active" type="button">Active</button>
<button class="btn disabled" type="button">Disabled</button>
```

---

### CSS Customization

Buttons use local CSS variables on `.btn` for enhanced component customization and styling. The base values are used by the UI to create all the variants. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
src/scss/styles/buttons/_base.scss
```
```sass
--fbx-btn-block: inline-block;
--fbx-btn-margin: 0;
--fbx-btn-font-weight: normal;
--fbx-btn-text-align: center;
--fbx-btn-position: relative;
--fbx-btn-overflow: hidden;
--fbx-btn-border: none;
--fbx-btn-width: auto;
--fbx-btn-border-radius: #{$border-radius};
--fbx-btn-font-size: #{$btn-font-size};
--fbx-btn-line-height: #{$btn-font-size};
--fbx-btn-bg-color: #{$btn-base-bg};
--fbx-btn-color: #{$btn-base-color};
--fbx-btn-font-weight: #{$btn-font-weight};
--fbx-btn-text-transform: #{$btn-text-transform};
--fbx-btn-white-space: nowrap;
--fbx-btn-vertical-align: middle;
--fbx-btn-cursor: pointer;
--fbx-btn-text-decoration: none;
--fbx-btn-transition: none;
--fbx-btn-padding-y: #{$btn-pad-y};
--fbx-btn-padding-x: #{$btn-pad-x};
--fbx-btn-letter-spacing: 0.5px;
--fbx-btn-loader-color: var(--fbx-btn-color);
--fbx-btn-icon-color: inherit;
--fbx-btn-box-shadow: none;
--fbx-btn-transition: none;

// Hover
--fbx-btn-color-hover: #{$btn-base-color-hover};
--fbx-btn-bg-color-hover: #{$btn-base-bg-hover};

// Active
--fbx-btn-color-active: #{$btn-base-color-active};
--fbx-btn-bg-color-active: #{$btn-base-bg-active};
```

<br>

```file-path
src/scss/_config.scss
```
```sass
$btn-height:                    38px !default;
$btn-text-transform:            uppercase !default;
$btn-pad-x:                     1.6rem !default;
$btn-pad-y:                     1.2rem !default;
$btn-font-size:                 1.4rem !default;
$btn-font-weight:               $text-bold !default;

// Base
$btn-base-bg:                   var(--fbx-gray-200);
$btn-base-color:                var(--fbx-gray-700);

// Hover
$btn-base-bg-hover:             var(--fbx-gray-300);
$btn-base-color-hover:          var(--fbx-gray-700);

// Active
$btn-base-bg-active:            var(--fbx-gray-400);
$btn-base-color-active:         var(--fbx-gray-700);

$btn-xs-pad-x:                  _minusPercent($btn-pad-x, 30) !default;
$btn-xs-pad-y:                  _minusPercent($btn-pad-y, 30) !default;

$btn-sm-pad-x:                  _minusPercent($btn-pad-x, 20) !default;
$btn-sm-pad-y:                  _minusPercent($btn-pad-y, 20) !default;

$btn-lg-pad-x:                  _addPercent($btn-pad-x, 30) !default;
$btn-lg-pad-y:                  _addPercent($btn-pad-y, 30) !default;

$btn-xl-pad-x:                  _addPercent($btn-pad-x, 50) !default;
$btn-xl-pad-y:                  _addPercent($btn-pad-y, 50) !default;

$circle-btn-font-size:          2.0rem !default;

$btn-icon-font-size:            1.6rem !default;
$btn-icon-line-height:          1.4rem !default;
$btn-icon-vertical-align:       text-top !default;

$btn-group-radius:              var(--fbx-border-radius) !default;
```