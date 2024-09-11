# Checkbox

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

Custom styled checkboxes require very little markup and can be created by simply wrapping the label and input in `.checkbox` classed element under a `.form-field` wrapper. 

<div class="code-content-example">
    <form class="text-center">
        <div class="form-field pad-5">
            <span class="checkbox">
                <input type="checkbox" name="checkbox_1" id="checkbox_1"  />
                <label for="checkbox_1"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="checkbox">
                <input type="checkbox" name="checkbox_2" id="checkbox_2" checked />
                <label for="checkbox_2"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="checkbox">
                <input type="checkbox" name="checkbox_3" id="checkbox_3" disabled />
                <label for="checkbox_3"></label>
            </span>
        </div>
        <div class="form-field  pad-5">
            <span class="checkbox">
                <input type="checkbox" name="checkbox_4" id="checkbox_4" checked disabled />
                <label for="checkbox_4"></label>
            </span>
        </div>
    </form>
</div>

```html
<div class="form-field pad-5">
    <span class="checkbox">
        <input type="checkbox" name="checkbox_1" id="checkbox_1"  />
        <label for="checkbox_1"></label>
    </span>
</div>
<div class="form-field pad-5">
    <span class="checkbox">
        <input type="checkbox" name="checkbox_2" id="checkbox_2" checked />
        <label for="checkbox_2"></label>
    </span>
</div>
<div class="form-field pad-5">
    <span class="checkbox">
        <input type="checkbox" name="checkbox_3" id="checkbox_3" disabled />
        <label for="checkbox_3"></label>
    </span>
</div>
<div class="form-field  pad-5">
    <span class="checkbox">
        <input type="checkbox" name="checkbox_4" id="checkbox_4" checked disabled />
        <label for="checkbox_4"></label>
    </span>
</div>
```

--- 

### Label

You can provide a label to the checkbox as you normally would. If you need the label to change based on the checkbox state, simply add `.toggle-on` and `toggle-off` elements inside the label.

<div class="code-content-example">
    <form>
        <div class="form-field row floor-xxs">
            <span class="checkbox">
                <input type="checkbox" name="checkbox_5" id="checkbox_5"  />
                <label for="checkbox_5">Normal Label</label>
            </span>
        </div>
        <div class="form-field row floor-xxs">
            <span class="checkbox">
                <input type="checkbox" name="checkbox_6" id="checkbox_6"  />
                <label for="checkbox_6">
                    <span class="toggle-on">Checked text</span>
                    <span class="toggle-off">Unchecked text</span>
                </label>
            </span>
        </div>
        <div class="form-field floor-xxs">
            <span class="checkbox">
                <input type="checkbox" name="checkbox_7" id="checkbox_7" disabled />
                <label for="checkbox_7">Disabled</label>
            </span>
        </div>
    </form>
</div>

```html
<div class="form-field row floor-xxs">
    <span class="checkbox">
        <input type="checkbox" name="checkbox_5" id="checkbox_5"  />
        <label for="checkbox_5">Normal Label</label>
    </span>
</div>
<div class="form-field row floor-xxs">
    <span class="checkbox">
        <input type="checkbox" name="checkbox_6" id="checkbox_6"  />
        <label for="checkbox_6">
            <span class="toggle-on">Checked text</span>
            <span class="toggle-off">Unchecked text</span>
        </label>
    </span>
</div>
<div class="form-field floor-xxs">
    <span class="checkbox">
        <input type="checkbox" name="checkbox_7" id="checkbox_7" disabled />
        <label for="checkbox_7">Disabled</label>
    </span>
</div>
```

--- 

### Contexts

Checkboxes can be further contextualized using FrontBx's contextual classes `.checkbox-primary`,  `.checkbox-secondary`,  `.checkbox-info`,  `.checkbox-success`,  `.checkbox-warning` and `.checkbox-danger`:

<div class="code-content-example">
    <form class="text-center">
        <div class="form-field pad-5">
            <span class="checkbox checkbox-primary">
                <input type="checkbox" name="checkbox_8" id="checkbox_8"  />
                <label for="checkbox_8"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="checkbox checkbox-secondary">
                <input type="checkbox" name="checkbox_9" id="checkbox_9" checked />
                <label for="checkbox_9"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="checkbox checkbox-info">
                <input type="checkbox" name="checkbox_10" id="checkbox_10" checked />
                <label for="checkbox_10"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="checkbox checkbox-success">
                <input type="checkbox" name="checkbox_11" id="checkbox_11" checked />
                <label for="checkbox_11"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="checkbox checkbox-warning">
                <input type="checkbox" name="checkbox_12" id="checkbox_12" checked />
                <label for="checkbox_12"></label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="checkbox checkbox-danger">
                <input type="checkbox" name="checkbox_13" id="checkbox_13" checked />
                <label for="checkbox_13"></label>
            </span>
        </div>
    </form>
</div>

```html
<span class="checkbox checkbox-primary">
    <input type="checkbox" name="input_12" id="input_12"  />
    <label for="input_12"></label>
</span>
```

--- 

### Sizing

Additional sizing is available through `.checkbox-sm`, `checkbox-md` and `checkbox-lg`:

<div class="code-content-example">
    <form class="text-center">
        <div class="form-field pad-5">
            <span class="checkbox checkbox-sm">
                <input type="checkbox" name="checkbox_14" id="checkbox_14" checked />
                <label for="checkbox_14">Small</label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="checkbox checkbox-md">
                <input type="checkbox" name="checkbox_15" id="checkbox_15" checked />
                <label for="checkbox_15">Medium</label>
            </span>
        </div>
        <div class="form-field pad-5">
            <span class="checkbox checkbox-lg">
                <input type="checkbox" name="checkbox_16" id="checkbox_16" checked />
                <label for="checkbox_16">Large</label>
            </span>
        </div>
    </form>
</div>

```html
<span class="checkbox checkbox-sm">
    <input type="checkbox" name="checkbox_14" id="checkbox_14"  />
    <label for="checkbox_14">Small</label>
</span>
<span class="checkbox checkbox-md">
    <input type="checkbox" name="checkbox_15" id="checkbox_15" checked />
    <label for="checkbox_15">Medium</label>
</span>
<span class="checkbox checkbox-lg">
    <input type="checkbox" name="checkbox_16" id="checkbox_16" checked />
    <label for="checkbox_16">Large</label>
</span>
```

---

### Customization

Checkboxes use local CSS variables on `.checkbox` for enhanced component customization and styling. The base values are used by the UI to create all the variants. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.

```file-path
src/scss/styles/forms/_checkbox.scss
```
```sass
--fbx-checkbox-size: #{$checkbox-size};
--fbx-checkbox-color: #{$checkbox-color};
--fbx-checkbox-label-color: #{$checkbox-label-color};
--fbx-checkbox-radius: #{$checkbox-radius};

```

<br>

```file-path
src/scss/_config.scss
```
```sass
$checkbox-size:                 2rem !default;
$checkbox-color:                var(--fbx-gray) !default;
$checkbox-label-color:          var(--fbx-gray) !default;
$checkbox-radius:               2px !default;
```

