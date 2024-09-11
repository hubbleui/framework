# Switch

---

Form results can be displayed as a message by simply adding a contextual class to the `<form>` element. 

This is super handy as you can have all your messages setup in the form result, and simply add the contextual class depending on the form validation. The contextual classes are `.info`, `.success`, `.warning`, `.danger`. This can be automated using the form validation component.

---

*   [Basic example](#basic-example)
*   [Label](#label)
*   [Contexts](#contexts)
*   [Sizing](#sizing)
*   [Customization](#customization)

---

### Basic example

Custom styled switches require very little markup and can be created by simply wrapping the label and input in `.switch` classed element under a `.form-field` wrapper. 

<div class="code-content-example">
    <form class="text-center">
        <div class="form-field pad-5">
            <span class="switch">
                <input type="checkbox" name="switch_1" id="switch_1"  />
                <label for="switch_1"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="switch">
                <input type="checkbox" name="switch_2" id="switch_2" checked />
                <label for="switch_2"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="switch">
                <input type="checkbox" name="switch_3" id="switch_3" disabled />
                <label for="switch_3"></label>
            </span>
        </div>
        <div class="form-field  pad-5">
            <span class="switch">
                <input type="checkbox" name="switch_4" id="switch_4" checked disabled />
                <label for="switch_4"></label>
            </span>
        </div>
    </form>
</div>

```html
<div class="form-field pad-5">
    <span class="switch">
        <input type="checkbox" name="switch_1" id="switch_1"  />
        <label for="switch_1"></label>
    </span>
</div>
<div class="form-field pad-5">
    <span class="switch">
        <input type="checkbox" name="switch_2" id="switch_2" checked />
        <label for="switch_2"></label>
    </span>
</div>
<div class="form-field pad-5">
    <span class="switch">
        <input type="checkbox" name="switch_3" id="switch_3" disabled />
        <label for="switch_3"></label>
    </span>
</div>
<div class="form-field  pad-5">
    <span class="switch">
        <input type="checkbox" name="switch_4" id="switch_4" checked disabled />
        <label for="switch_4"></label>
    </span>
</div>
```

--- 

### Label

You can provide a label to the switch as you normally would. If you need the label to change based on the switch state, simply add `.toggle-on` and `toggle-off` elements inside the label.

<div class="code-content-example">
    <form>
        <div class="form-field row floor-xxs">
            <span class="switch">
                <input type="checkbox" name="switch_5" id="switch_5"  />
                <label for="switch_5">Normal Label</label>
            </span>
        </div>
        <div class="form-field row floor-xxs">
            <span class="switch">
                <input type="checkbox" name="switch_6" id="switch_6"  />
                <label for="switch_6">
                    <span class="toggle-on">Checked text</span>
                    <span class="toggle-off">Unchecked text</span>
                </label>
            </span>
        </div>
        <div class="form-field floor-xxs">
            <span class="switch">
                <input type="checkbox" name="switch_7" id="switch_7" disabled />
                <label for="switch_7">Disabled</label>
            </span>
        </div>
    </form>
</div>

```html
<div class="form-field row floor-xxs">
    <span class="switch">
        <input type="checkbox" name="switch_5" id="switch_5"  />
        <label for="switch_5">Normal Label</label>
    </span>
</div>
<div class="form-field row floor-xxs">
    <span class="switch">
        <input type="checkbox" name="switch_6" id="switch_6"  />
        <label for="switch_6">
            <span class="toggle-on">Checked text</span>
            <span class="toggle-off">Unchecked text</span>
        </label>
    </span>
</div>
<div class="form-field floor-xxs">
    <span class="switch">
        <input type="checkbox" name="switch_7" id="switch_7" disabled />
        <label for="switch_7">Disabled</label>
    </span>
</div>
```

--- 

### Contexts

Switches can be further contextualized using FrontBx's contextual classes `.switch-primary`,  `.switch-secondary`,  `.switch-info`,  `.switch-success`,  `.switch-warning` and `.switch-danger`:

<div class="code-content-example">
    <form class="text-center">
        <div class="form-field pad-5">
            <span class="switch switch-primary">
                <input type="checkbox" name="switch_8" id="switch_8"  />
                <label for="switch_8"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="switch switch-secondary">
                <input type="checkbox" name="switch_9" id="switch_9" checked />
                <label for="switch_9"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="switch switch-info">
                <input type="checkbox" name="switch_10" id="switch_10" checked />
                <label for="switch_10"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="switch switch-success">
                <input type="checkbox" name="switch_11" id="switch_11" checked />
                <label for="switch_11"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="switch switch-warning">
                <input type="checkbox" name="switch_12" id="switch_12" checked />
                <label for="switch_12"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="switch switch-danger">
                <input type="checkbox" name="switch_13" id="switch_13" checked />
                <label for="switch_13"></label>
            </span>
        </div>
    </form>
</div>

```html
<span class="switch switch-primary">
    <input type="checkbox" name="input_12" id="input_12"  />
    <label for="input_12"></label>
</span>
```

--- 

### Sizing

Additional sizing is available through `.switch-sm`, `switch-md` and `switch-lg`:

<div class="code-content-example">
    <form class="text-center">
        <div class="form-field pad-5">
            <span class="switch switch-sm">
                <input type="checkbox" name="switch_14" id="switch_14" checked />
                <label for="switch_14">Small</label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="switch switch-md">
                <input type="checkbox" name="switch_15" id="switch_15" checked />
                <label for="switch_15">Medium</label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="switch switch-lg">
                <input type="checkbox" name="switch_16" id="switch_16" checked />
                <label for="switch_16">Large</label>
            </span>
        </div>
    </form>
</div>

```html
<span class="switch switch-sm">
    <input type="checkbox" name="switch_14" id="switch_14"  />
    <label for="switch_14">Small</label>
</span>
<span class="switch switch-md">
    <input type="checkbox" name="switch_15" id="switch_15" checked />
    <label for="switch_15">Medium</label>
</span>
<span class="switch switch-lg">
    <input type="checkbox" name="switch_16" id="switch_16" checked />
    <label for="switch_16">Large</label>
</span>
```

---

### Customization

Switches use local CSS variables on `.switch` for enhanced component customization and styling. The base values are used by the UI to create all the variants. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

```file-path
src/scss/styles/forms/_switch.scss
```
```sass
--fbx-switch-size :#{$switch-size};
--fbx-switch-track-color-off :#{$switch-track-color-off};
--fbx-switch-track-color-on :#{$switch-track-color-on};
--fbx-switch-knob-color-off :#{$switch-knob-color-off};
--fbx-switch-knob-color-on :#{$switch-knob-color-on};
```

<br>
Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
src/scss/_config.scss
```
```sass
$switch-size:                   2rem !default;
$switch-track-color-off:        var(--fbx-gray-300) !default;
$switch-track-color-on:         var(--fbx-gray-300) !default;
$switch-knob-color-off:         var(--fbx-white) !default;
$switch-knob-color-on:          var(--fbx-gray) !default;
```

