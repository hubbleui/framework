# Colors

Hubble is supported by an extensive CSS color system for enhanced styling, component customization and beyond.

---

*	[Base colors](#base-colors)
	* [Usage](#base-usage)
*	[Grays](#grays)
	* [Usage](#gray-usage)
*	[Theme colors](#theme-colors)
	* [Usage](#theme-usage)
* [Sass](#sass)
	* [brand-colors](#brand-colors)
	* [Palette](#pallette)
	* [Shades](#shades)

---

### Base colors

Hubble's color system is built using a combination of both CSS variables, Sass variables and Sass functions. The table below outlines the core color palette used by Hubble:

| Swatch                                        | CSS Variable            | Sass Variable       | Description                                                |
|:---------------------------------------------:|-------------------------|---------------------|------------------------------------------------------------|
| <div class="docs-swatch bg-body-bg"></div>    | `--hb-body-bg`          | `$body-bg`          | Body background color.                                     |
| <div class="docs-swatch bg-body-color"></div> | `--hb-body-color`       | `$body-color`       | Body `color`                                               |
| <div class="docs-swatch bg-white"></div>      | `--hb-white`            | `$white`            | Global `white` definition.                                 |
| <div class="docs-swatch bg-black"></div>      | `--hb-black`            | `$black`            | Global `black` definition.                                 |
| <div class="docs-swatch bg-gray"></div>       | `--hb-gray`             | `$gray`             | Global `gray` definition.                                  |
| <div class="docs-swatch bg-primary"></div>    | `--hb-brand-primary`    | `$brand-primary`    | Global `brand-primary` definition.                         |
| <div class="docs-swatch bg-secondary"></div>  | `--hb-brand-secondary`  | `$brand-secondary`  | Global `brand-secondary` definition.                       |
| <div class="docs-swatch bg-success"></div>    | `--hb-brand-success`    | `$brand-success`    | Global `brand-success` definition.                         |
| <div class="docs-swatch bg-info"></div>       | `--hb-brand-info`       | `$brand-info`       | Global `brand-info` definition.                            |
| <div class="docs-swatch bg-warning"></div>    | `--hb-brand-warning`    | `$brand-warning`    | Global `brand-warning` definition.                         |
| <div class="docs-swatch bg-danger"></div>     | `--hb-brand-danger`     | `$brand-danger`     | Global `brand-danger` definition.                          |

#### Usage<a id='base-usage'></a>

All base colors are available via Hubble's utility helper classes as `.bg-[name]` and `color-[name]` without the word `brand`.

<div class="code-content-example">
	<div class="flex-row align-cols-center">
	    <div class="paper paper-rounded raised-1 col col-5 col-lg-3 bg-primary pad-40 text-center">
	    	<p class="color-white text-bolder no-margin">Hello World!</p>
	    </div>
	</div>
</div>

```html
<div class="paper paper-rounded raised-1 col col-3 bg-primary pad-20 text-center">
	<p class="color-white text-bolder no-margin">Hello World!</p>
</div>
```

If using any of the base colors pre CSS compilation, using the Sass variable will output actual #hex color.

```scss
.my-element
{
	color: $brand-primary;
	background var(--hb-brand-primary);
}
```

--- 

### Grays

Grays are available via CSS variables `--hb-gray-[num]` ranging from `100` through `900`. The table below outlines the core color palette used by Hubble:

| Swatch                                      | CSS Variable    |
|:-------------------------------------------:|-----------------|
| <div class="docs-swatch bg-gray-100"></div> | `--hb-gray-100` |
| <div class="docs-swatch bg-gray-200"></div> | `--hb-gray-200` |
| <div class="docs-swatch bg-gray-300"></div> | `--hb-gray-300` |
| <div class="docs-swatch bg-gray-400"></div> | `--hb-gray-400` |
| <div class="docs-swatch bg-gray-500"></div> | `--hb-gray-500` |
| <div class="docs-swatch bg-gray-600"></div> | `--hb-gray-600` |
| <div class="docs-swatch bg-gray-700"></div> | `--hb-gray-700` |
| <div class="docs-swatch bg-gray-800"></div> | `--hb-gray-800` |
| <div class="docs-swatch bg-gray-900"></div> | `--hb-gray-900` |


#### Usage<a id='gray-usage'></a>

All gray colors are available via Hubble's utility helper classes as `.bg-[name]` and `color-[name]`.

<div class="code-content-example">
	<div class="flex-row align-cols-center">
	    <div class="paper paper-rounded raised-1 col col-5 col-lg-3 bg-gray-800 pad-40 text-center">
	    	<p class="color-white text-bolder no-margin">Hello World!</p>
	    </div>
	</div>
</div>

```html
<div class="paper paper-rounded raised-1 col col-3 bg-gray-800 pad-20 text-center">
	<p class="color-white text-bolder no-margin">Hello World!</p>
</div>
```

---

### Theme colors

Hubble comes with a palette of theme colors via both CSS ans Sass variables for changing theme colors, customizing components or building out custom UI components. The table below outlines theme colors:

| Swatch                                                                           | CSS Variable              | Sass Variable   |
|:--------------------------------------------------------------------------------:|---------------------------|-----------------|
| <div class="docs-swatch" style="background: var(--hb-color-teal)"></div>         | `--hb-color-teal`         | `$teal`         |
| <div class="docs-swatch" style="background: var(--hb-color-turquoise)"></div>    | `--hb-color-turquoise`    | `$turquoise`    |
| <div class="docs-swatch" style="background: var(--hb-color-greensea)"></div>     | `--hb-color-greensea`     | `$greensea`     |
| <div class="docs-swatch" style="background: var(--hb-color-emerland)"></div>     | `--hb-color-emerland`     | `$emerland`     |
| <div class="docs-swatch" style="background: var(--hb-color-nephritis)"></div>    | `--hb-color-nephritis`    | `$nephritis`    |
| <div class="docs-swatch" style="background: var(--hb-color-babyblue)"></div>     | `--hb-color-babyblue`     | `$babyblue`     |
| <div class="docs-swatch" style="background: var(--hb-color-peterrive)"></div>    | `--hb-color-peterrive`    | `$peterrive`    |
| <div class="docs-swatch" style="background: var(--hb-color-belizehol)"></div>    | `--hb-color-belizehol`    | `$belizehol`    |
| <div class="docs-swatch" style="background: var(--hb-color-amethyst)"></div>     | `--hb-color-amethyst`     | `$amethyst`     |
| <div class="docs-swatch" style="background: var(--hb-color-wisteria)"></div>     | `--hb-color-wisteria`     | `$wisteria`     |
| <div class="docs-swatch" style="background: var(--hb-color-wetasphalt)"></div>   | `--hb-color-wetasphalt`   | `$wetasphalt`   |
| <div class="docs-swatch" style="background: var(--hb-color-midnightblue)"></div> | `--hb-color-midnightblue` | `$midnightblue` |
| <div class="docs-swatch" style="background: var(--hb-color-sunflower)"></div>    | `--hb-color-sunflower`    | `$sunflower`    |
| <div class="docs-swatch" style="background: var(--hb-color-orange)"></div>       | `--hb-color-orange`       | `$orange`       |
| <div class="docs-swatch" style="background: var(--hb-color-carrot)"></div>       | `--hb-color-carrot`       | `$carrot`       |
| <div class="docs-swatch" style="background: var(--hb-color-salmon)"></div>       | `--hb-color-salmon`       | `$salmon`       |
| <div class="docs-swatch" style="background: var(--hb-color-pumpkin)"></div>      | `--hb-color-pumpkin`      | `$pumpkin`      |
| <div class="docs-swatch" style="background: var(--hb-color-alizarin)"></div>     | `--hb-color-alizarin`     | `$alizarin`     |
| <div class="docs-swatch" style="background: var(--hb-color-pomegranate)"></div>  | `--hb-color-pomegranate`  | `$pomegranate`  |
| <div class="docs-swatch" style="background: var(--hb-color-clouds)"></div>       | `--hb-color-clouds`       | `$clouds`       |
| <div class="docs-swatch" style="background: var(--hb-color-silver)"></div>       | `--hb-color-silver`       | `$silver`       |
| <div class="docs-swatch" style="background: var(--hb-color-concrete)"></div>     | `--hb-color-concrete`     | `$concrete`     |
| <div class="docs-swatch" style="background: var(--hb-color-asbestos)"></div>     | `--hb-color-asbestos`     | `$asbestos`     |
| <div class="docs-swatch" style="background: var(--hb-color-neongreen)"></div>    | `--hb-color-neongreen`    | `$neongreen`    |
| <div class="docs-swatch" style="background: var(--hb-color-skyblue)"></div>      | `--hb-color-skyblue`      | `$skyblue`      |
| <div class="docs-swatch" style="background: var(--hb-color-beetroot)"></div>     | `--hb-color-beetroot`     | `$beetroot`     |
| <div class="docs-swatch" style="background: var(--hb-color-hotpink)"></div>      | `--hb-color-hotpink`      | `$hotpink`      |
| <div class="docs-swatch" style="background: var(--hb-color-pineapple)"></div>    | `--hb-color-pineapple`    | `$pineapple`    |
| <div class="docs-swatch" style="background: var(--hb-color-coralred)"></div>     | `--hb-color-coralred`     | `$coralred`     |
| <div class="docs-swatch" style="background: var(--hb-color-ash)"></div>          | `--hb-color-ash`          | `$ash`          |


#### Usage<a id='theme-usage'></a>

Theme colors are available through both Sass and CSS Variables. They are not available as a utility classes or palette shades unless defined as a "brand" color pre-complication

Changing Hubble's core theme color via Sass is super simple:

```file-path
`src/scss/_config.scss`
```
```sass
$brand-primary: $emerland;
$brand-secondary: $nephritis;
```

Alternatively, you can change a theme by simply changing the CSS variable on `:root`:

```css
:root
{
	--hb-brand-primary: var(--hb-color-emerland);
	--hb-brand-primary-rgb: var(--hb-color-emerland-rgb);
}
```

Hubble uses a Sass function for gradients on theme colors to style the odd component, if changing the theme color via CSS you will also need to update these CSS variables:

```css
:root
{
	--hb-brand-primary-100: #ffeaf7;
	--hb-brand-primary-200: #ffd5ee;
	--hb-brand-primary-300: #ff97d5;
	--hb-brand-primary-400: #ff77c8;
	--hb-brand-primary-500: #f22ca2;
	--hb-brand-primary-600: #cc2588;
	--hb-brand-primary-700: #bf2380;
	--hb-brand-primary-800: #b32077;
	--hb-brand-primary-900: #991c66;
}
```

---

### Sass

All Sass color variable definitions will point to the the real hex color of a given color (rather than a CSS Variable).

#### Theme colors<a id="sass-theme-colors"></a>

Hubble defines the following variables for use in a theme. Note that theme colors will point to a CSS variable defined in `:root` rather than the hex.

```scss
// Contexts
$brand-primary:                 var(--hb-color-hotpink)     !default;
$brand-secondary:               var(--hb-color-salmon)      !default;
$brand-success:                 var(--hb-color-emerland)    !default;
$brand-info:                    var(--hb-color-skyblue)     !default;
$brand-warning:                 var(--hb-color-sunflower)   !default;
$brand-danger:                  var(--hb-color-coralred)    !default;
```

```scss
.my-element 
{
	background-color: $brand-primary;
}
```

#### Palette <a id="sass-theme-colors"></a>

All palette hex colors are available through the following:

```scss
// Prebuilt colors to choose a theme from
// Flat colors
$teal:                          #7de3b5 !default;
$turquoise:                     #1abc9c !default;
$greensea:                      #16a085 !default;
$emerland:                      #2ecc71 !default;
$nephritis:                     #27ae60 !default;
$babyblue:                      #b0e2fe !default;
$peterrive:                     #3498db !default;
$belizehol:                     #2980b9 !default;
$amethyst:                      #9b59b6 !default;
$wisteria:                      #8e44ad !default;
$wetasphalt:                    #34495e !default;
$midnightblue:                  #2c3e50 !default;
$sunflower:                     #f1c40f !default;
$orange:                        #f39c12 !default;
$carrot:                        #e67e22 !default;
$salmon:                        #ed5d81 !default;
$pumpkin:                       #d35400 !default;
$alizarin:                      #e74c3c !default;
$pomegranate:                   #c0392b !default;
$clouds:                        #ecf0f1 !default;
$silver:                        #bdc3c7 !default;
$concrete:                      #95a5a6 !default;
$asbestos:                      #7f8c8d !default;

// Neons
$neongreen:                     #2bf877 !default;
$skyblue:                       #73dcff !default;
$beetroot:                      #c349ff !default;
$hotpink:                       #ff2eaa !default;
$pineapple:                     #fff224 !default;
$coralred:                      #ff3a24 !default;
$ash:                           #838c92 !default;

// Basic colors
$white:                         #FFFFFF !default;
$black:                         #323232 !default;
$gray:                          #9597a0 !default;
```

```scss
.my-element 
{
	background-color: $teal;
}
```

#### Shades <a id="sass-theme-shades"></a>

Hubble uses Sass functions to generate color shades (`100` -> `900`) for all palette colors and assign them as CSS Variables on `:root`. However doing this for all theme colors would obviously create a large amount of unnecessary CSS variables. 

You can also access **Base Color** shades (`100` -> `900`) via Sass variables:

```scss
.my-element
{
	background-color: $gray-100;
}

```
