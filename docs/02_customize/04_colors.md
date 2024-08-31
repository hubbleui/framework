# Colors

FrontBx is supported by an extensive CSS color system for enhanced styling, component customization and beyond.

---

*	[Theme colors](#theme-colors)
	* [Usage](#theme-usage)
*	[Grays](#grays)
	* [Usage](#gray-usage)
*	[Color Palette](#color-palette)
	* [Usage](#theme-usage)
* [Sass](#sass)
	* [theme-colors](#theme-colors)
	* [Palette](#pallette)
	* [Shades](#shades)
	
---

### Theme colors

FrontBx's color system is built using a combination of both CSS variables, Sass variables and Sass functions. The table below outlines the core color palette used by FrontBx:

| Swatch                                        | CSS Variable            | Sass Variable       | Description                                                |
|:---------------------------------------------:|-------------------------|---------------------|------------------------------------------------------------|
| <div class="docs-swatch bg-body-bg"></div>    | `--hb-body-bg`          | `$body-bg`          | Body background color.                                     |
| <div class="docs-swatch bg-body-color"></div> | `--hb-body-color`       | `$body-color`       | Body `color`                                               |
| <div class="docs-swatch bg-white"></div>      | `--hb-white`            | `$white`            | Global `white` definition.                                 |
| <div class="docs-swatch bg-black"></div>      | `--hb-black`            | `$black`            | Global `black` definition.                                 |
| <div class="docs-swatch bg-gray"></div>       | `--hb-gray`             | `$gray`             | Global `gray` definition.                                  |
| <div class="docs-swatch bg-primary"></div>    | `--hb-theme-primary`    | `$theme-primary`    | Global `theme-primary` definition.                         |
| <div class="docs-swatch bg-secondary"></div>  | `--hb-theme-secondary`  | `$theme-secondary`  | Global `theme-secondary` definition.                       |
| <div class="docs-swatch bg-success"></div>    | `--hb-theme-success`    | `$theme-success`    | Global `theme-success` definition.                         |
| <div class="docs-swatch bg-info"></div>       | `--hb-theme-info`       | `$theme-info`       | Global `theme-info` definition.                            |
| <div class="docs-swatch bg-warning"></div>    | `--hb-theme-warning`    | `$theme-warning`    | Global `theme-warning` definition.                         |
| <div class="docs-swatch bg-danger"></div>     | `--hb-theme-danger`     | `$theme-danger`     | Global `theme-danger` definition.                          |

#### Usage<a id='theme-usage'></a>

All theme colors are available via FrontBx's utility helper classes as `.bg-[name]` and `color-[name]` without the word `theme`.

<div class="code-content-example">
	<div class="flex-row align-cols-center">
	    <div class="paper paper-rounded raised-1 col col-5 col-lg-3 bg-primary pad-40 text-center">
	    	<p class="color-white text-bolder no-margin">Hello World!</p>
	    </div>
	</div>
</div>

```html
<div class="paper paper-rounded raised-1 bg-primary color-white">
	<p class="text-bolder no-margin">Hello World!</p>
</div>
```

If using any of the theme colors pre compilation, using the Sass variable will output a reference to the CSS Variable:

```scss
.my-element
{
	color: $theme-primary;
}
```

--- 

### Grays

Grays are available via CSS variables `--hb-gray-[num]` ranging from `100` through `900`. The table below outlines the core color palette used by FrontBx:

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

All gray colors are available via FrontBx's utility helper classes as `.bg-[name]` and `color-[name]`.

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

### Color Palette

FrontBx comes with a palette of colors via both CSS ans Sass variables for changing theme colors, customizing components or building out custom UI. The table below outlines theme colors:

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

Palette colors are available through both Sass and CSS Variables. They are not available as a utility classes or palette shades as CSS variables unless defined as a "theme" color pre-complication.

Changing FrontBx's core theme color via Sass is super simple:

```file-path
`src/scss/_config.scss`
```
```sass
$theme-primary: $emerland;
$theme-secondary: $nephritis;
```

Alternatively, you can change a theme by simply changing the CSS variable on `:root`:

```css
:root
{
	--hb-theme-primary: var(--hb-color-emerland);
	--hb-theme-primary-rgb: var(--hb-color-emerland-rgb);
}
```

FrontBx uses a Sass function for gradients on theme colors to style the odd component, if changing the theme color via CSS you should also update these CSS variables:

```css
:root
{
	--hb-theme-primary-100: #ffeaf7;
	--hb-theme-primary-200: #ffd5ee;
	--hb-theme-primary-300: #ff97d5;
	--hb-theme-primary-400: #ff77c8;
	--hb-theme-primary-500: #f22ca2;
	--hb-theme-primary-600: #cc2588;
	--hb-theme-primary-700: #bf2380;
	--hb-theme-primary-800: #b32077;
	--hb-theme-primary-900: #991c66;
}
```

---

### Sass

All Sass color variable definitions will point to the the real hex color of a given color (rather than a CSS Variable).

#### Theme colors<a id="sass-theme-colors"></a>

FrontBx defines the following variables for use in a theme. Note that theme colors will point to a CSS variable defined in `:root` rather than the hex.

```scss
// Contexts
$theme-primary:                 var(--hb-color-hotpink)     !default;
$theme-secondary:               var(--hb-color-salmon)      !default;
$theme-success:                 var(--hb-color-emerland)    !default;
$theme-info:                    var(--hb-color-skyblue)     !default;
$theme-warning:                 var(--hb-color-sunflower)   !default;
$theme-danger:                  var(--hb-color-coralred)    !default;
```

```scss
.my-element 
{
	background-color: $theme-primary;
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

FrontBx uses Sass functions to generate color shades (`100` -> `900`) for all palette colors and assign them as CSS Variables on `:root`. However doing this for all theme colors would obviously create a large amount of unnecessary CSS variables. 

You can also access **Base Color** shades (`100` -> `900`) via Sass variables:

```scss
.my-element
{
	background-color: $gray-100;
}

```
