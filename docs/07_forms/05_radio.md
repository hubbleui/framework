# Radio

---

Checkboxes can be used to turn an option on or off or in forms to indicate confirmation.

---

*   [Basic example](#basic-example)
*   [Label](#label)
*   [Contexts](#contexts)
*   [Sizing](#sizing)
*   [Customization](#customization)

---

### Basic example

Custom styled radioes require very little markup and can be created by simply wrapping the label and input in `.radio` classed element under a `.form-field` wrapper. 

<div class="code-content-example">
    <form class="text-center">
        <div class="form-field pad-5">
            <span class="radio">
                <input type="radio" name="radio_1" id="radio_1"  />
                <label for="radio_1"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="radio">
                <input type="radio" name="radio_1" id="radio_2" checked />
                <label for="radio_2"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="radio">
                <input type="radio" name="radio_1" id="radio_3" disabled />
                <label for="radio_3"></label>
            </span>
        </div>
        <div class="form-field  pad-5">
            <span class="radio">
                <input type="radio" name="radio_1" id="radio_4" checked disabled />
                <label for="radio_4"></label>
            </span>
        </div>
    </form>
</div>

```html
<div class="form-field pad-5">
    <span class="radio">
        <input type="radio" name="radio_1" id="radio_1"  />
        <label for="radio_1"></label>
    </span>
</div>
<div class="form-field pad-5">
    <span class="radio">
        <input type="radio" name="radio_1" id="radio_2" checked />
        <label for="radio_2"></label>
    </span>
</div>
<div class="form-field pad-5">
    <span class="radio">
        <input type="radio" name="radio_1" id="radio_3" disabled />
        <label for="radio_3"></label>
    </span>
</div>
<div class="form-field  pad-5">
    <span class="radio">
        <input type="radio" name="radio_1" id="radio_4" checked disabled />
        <label for="radio_4"></label>
    </span>
</div>
```

--- 

### Label

You can provide a label to the radio as you normally would. If you need the label to change based on the radio state, simply add `.toggle-on` and `toggle-off` elements inside the label.

<div class="code-content-example">
    <form>
        <div class="form-field row floor-xxs">
            <span class="radio">
                <input type="radio" name="radio_2" id="radio_5"  checked/>
                <label for="radio_5">Normal Label</label>
            </span>
        </div>
        <div class="form-field row floor-xxs">
            <span class="radio">
                <input type="radio" name="radio_2" id="radio_6"  />
                <label for="radio_6">
                    <span class="toggle-on">Checked text</span>
                    <span class="toggle-off">Unchecked text</span>
                </label>
            </span>
        </div>
        <div class="form-field floor-xxs">
            <span class="radio">
                <input type="radio" name="radio_2" id="radio_7" disabled />
                <label for="radio_7">Disabled</label>
            </span>
        </div>
    </form>
</div>

```html
<div class="form-field row floor-xxs">
    <span class="radio">
        <input type="radio" name="radio_2" id="radio_5" checked />
        <label for="radio_5">Normal Label</label>
    </span>
</div>
<div class="form-field row floor-xxs">
    <span class="radio">
        <input type="radio" name="radio_2" id="radio_6"  />
        <label for="radio_6">
            <span class="toggle-on">Checked text</span>
            <span class="toggle-off">Unchecked text</span>
        </label>
    </span>
</div>
<div class="form-field floor-xxs">
    <span class="radio">
        <input type="radio" name="radio_2" id="radio_7" disabled />
        <label for="radio_7">Disabled</label>
    </span>
</div>
```

--- 

### Contexts

Checkboxes can be further contextualized using FrontBx's contextual classes `.radio-primary`,  `.radio-secondary`,  `.radio-info`,  `.radio-success`,  `.radio-warning` and `.radio-danger`:

<div class="code-content-example">
    <form class="text-center">
        <div class="form-field pad-5">
            <span class="radio radio-primary">
                <input type="radio" name="radio_3" id="radio_8" checked />
                <label for="radio_8"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="radio radio-secondary">
                <input type="radio" name="radio_3" id="radio_9"  />
                <label for="radio_9"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="radio radio-info">
                <input type="radio" name="radio_3" id="radio_10" />
                <label for="radio_10"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="radio radio-success">
                <input type="radio" name="radio_3" id="radio_11" />
                <label for="radio_11"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="radio radio-warning">
                <input type="radio" name="radio_3" id="radio_12" />
                <label for="radio_12"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="radio radio-danger">
                <input type="radio" name="radio_3" id="radio_13" />
                <label for="radio_13"></label>
            </span>
        </div>
    </form>
</div>

```html
<span class="radio radio-primary">
    <input type="radio" name="radio_3" id="input_12"  />
    <label for="input_12"></label>
</span>
```

--- 

### Sizing

Additional sizing is available through `.radio-sm`, `radio-md` and `radio-lg`:

<div class="code-content-example">
    <form class="text-center">
        <div class="form-field pad-5">
            <span class="radio radio-sm">
                <input type="radio" name="radio_14" id="radio_14" checked />
                <label for="radio_14">Small</label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="radio radio-md">
                <input type="radio" name="radio_15" id="radio_15" checked />
                <label for="radio_15">Medium</label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="radio radio-lg">
                <input type="radio" name="radio_16" id="radio_16" checked />
                <label for="radio_16">Large</label>
            </span>
        </div>
    </form>
</div>

```html
<span class="radio radio-sm">
    <input type="radio" name="radio_14" id="radio_14"  />
    <label for="radio_14">Small</label>
</span>
<span class="radio radio-md">
    <input type="radio" name="radio_15" id="radio_15" checked />
    <label for="radio_15">Medium</label>
</span>
<span class="radio radio-lg">
    <input type="radio" name="radio_16" id="radio_16" checked />
    <label for="radio_16">Large</label>
</span>
```

---

### Customization

Checkboxes use local CSS variables on `.radio` for enhanced component customization and styling. The base values are used by the UI to create all the variants. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
src/scss/styles/forms/_radio.scss
```
```sass
--fbx-radio-size: #{$radio-size};
--fbx-radio-color: #{$radio-color};
--fbx-radio-label-color: #{$radio-label-color};
```

<br>

```file-path
src/scss/_config.scss
```
```sass
$radio-size:                    2rem !default;
$radio-color:                   var(--fbx-gray) !default;
$radio-label-color:             var(--fbx-gray) !default;
```

