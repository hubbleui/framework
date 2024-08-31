# Tooltip

---

*   [Markup](#markup)
*   [Direction](#direction)
*   [CSS Customization](#css-customization)

---

### Markup

FrontBx comes with a simple CSS tooltip that's easy to use. Simple add the `.tooltipped` class with the direction `.tooltipped-[direction]` you want the toooltip to be displayed.

Then add the content you want displayed as the `data-tooltip` attribute.

<div class="code-content-example">
    <div class="container-fuid text-center">
        <button class="btn tooltipped tooltipped-n" data-tooltip="Hello World!">.tooltipped</button>
    </div>
</div>

```html
    <button class="tooltipped tooltipped-n" data-tooltip="Hello World!">...</button>
```

---

### Direction

Use the directional classes `.tooltipped-[direction]` to change the direction of tooltip.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs">
        <button class="btn tooltipped tooltipped-ne" data-tooltip="Hello World!">NE </button>
        <button class="btn tooltipped tooltipped-n" data-tooltip="Hello World!">N</button>
        <button class="btn tooltipped tooltipped-nw" data-tooltip="Hello World!">NW</button>
        <div class="col-12"></div>
        <button class="btn tooltipped tooltipped-se" data-tooltip="Hello World!">SE </button>
        <button class="btn tooltipped tooltipped-s" data-tooltip="Hello World!">S</button>
        <button class="btn tooltipped tooltipped-sw" data-tooltip="Hello World!">SW</button>
        <div class="col-12"></div>
        <button class="btn tooltipped tooltipped-e" data-tooltip="Hello World!">E</button>
        <button class="btn tooltipped tooltipped-w" data-tooltip="Hello World!">W</button>
    </div>
</div> 

```html
    <button class="btn tooltipped tooltipped-ne" data-tooltip="Hello World!">
        .tooltipped-ne
    </button> 
    <button class="btn tooltipped tooltipped-n" data-tooltip="Hello World!">
        .tooltipped-n
    </button>
    <button class="btn tooltipped tooltipped-nw" data-tooltip="Hello World!">
        .tooltipped-nw
    </button>
    <button class="btn tooltipped tooltipped-se" data-tooltip="Hello World!">
        .tooltipped-se
    </button> 
    <button class="btn tooltipped tooltipped-s" data-tooltip="Hello World!">
        .tooltipped-s
    </button>
    <button class="btn tooltipped tooltipped-sw" data-tooltip="Hello World!">
        .tooltipped-sw
    </button>
    <button class="btn tooltipped tooltipped-e" data-tooltip="Hello World!">
        .tooltipped-e
    </button>
    <button class="btn tooltipped tooltipped-w" data-tooltip="Hello World!">
        .tooltipped-w
    </button>
```

---

### CSS Customization

The grid system uses a combination of both local CSS variables on all components for enhanced component customization and styling. The base values are used by the UI to create all the sizing. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

<div class="code-content-example">
    <div class="container-fuid text-center">
         <style scoped>
            .tooltipped-custom
            {
                --hb-tooltip-bg: var(--hb-color-hotpink);
                --hb-tooltip-font-size: 13px;
                --hb-tooltip-font-weight: 600;
            }
        </style>
        <button class="btn tooltipped tooltipped-n tooltipped-custom" data-tooltip="Hello World!">
            Custom
        </button>
    </div>
</div>

```css
.tooltipped
{
    --hb-tooltip-bg: var(--hb-color-hotpink);
    --hb-tooltip-font-size: 13px;
}
```

```file-path
`src/scss/_config.scss`
```
```sass
$tooltip-bg:                    var(--hb-gray-900) !default;
$tooltip-color:                 var(--hb-white) !default;
$tooltip-font-size:             11px !default;
$tooltip-font-weight:           $text-light !default;
$tooltip-line-height:           20px !default;
$tooltip-radius:                var(--hb-border-radius) !default;
$tooltip-pad-y:                 2px !default;
$tooltip-pad-x:                 8px !default;
$tooltop-target-space:          5px !default;
$tooltop-target-space-neg:      -5px !default;```
```

```file-path
src/scss/components/_tooltip.scss
```
```css
.tooltipped
{
    --hb-tooltip-bg: var(--hb-gray-900);
    --hb-tooltip-color: var(--hb-white);
    --hb-tooltip-font-size: 11px;
    --hb-tooltip-font-weight: 300;
    --hb-tooltip-line-height: 20px;
    --hb-tooltip-radius: var(--hb-border-radius);
    --hb-tooltip-pad-y: 2px;
    --hb-tooltip-pad-x: 8px;
    --hb-tooltop-target-space: 5px;
    --hb-tooltop-target-space-neg: -5px;
    position: relative;
    overflow: visible !important;
}
```