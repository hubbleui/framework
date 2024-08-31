# Input mask

---

FrontBx comes with a convenient and easy to use input masker that can either be instantiated through HTML or JavaScript. The input masker forces an input to only except a predefined set of input rules (e.g numbers only). 

---

*   [Usage](#usage)
*   [Regex](#regex)
*   [Formatting](#formatting)
*   [JavaScript Instantiation](#javaScript-instantiation)

---


### Usage

You can initialize the input masker via HTML by using a the `.js-mask` class on a given input. You can then use one of the prebuilt masks as the `data-mask` attribute.

Pre-built masks are `creditcard`, `money`, `alpha-numeric`, `alpha-space`, `alpha-dash`, `alpha-numeric-dash`, `numeric`, and `numeric-decimal`.

To mask a credit card, use the `.js-mask` class.

<div class="code-content-example">
    <div class="flex-row align-cols-center flex-cols-12 flex-cols-md-6">
        <div>
            <div class="flex-row row-gaps-xs">
                <div>
                    <div class="form-field row">
                        <input class="js-mask" data-mask="creditcard" type="text" name="input_1" id="input_1" placeholder="**** **** **** ****">
                        <label for="input_1">Credit Card</label>
                    </div>
                </div>        
                <div>
                    <div class="form-field row">
                        <input class="js-mask" data-mask="money" type="text" name="input_2" id="input_2" placeholder="44.43">
                        <label for="input_2">Money</label>
                    </div>
                </div>        
                <div>
                    <div class="form-field row">
                        <input class="js-mask" data-mask="alpha-numeric" type="text" name="input_3" id="input_3" placeholder="Rocker_Man_91">
                        <label for="input_3">Alpha-numeric</label>
                    </div>
                </div>        
                <div>
                    <div class="form-field row">
                        <input class="js-mask" data-mask="alpha-space" type="text" name="input_4" id="input_4" placeholder="Rocket Mab">
                        <label for="input_4">Alpha space</label>
                    </div>
                </div>        
                <div>
                    <div class="form-field row">
                        <input class="js-mask" data-mask="alpha-dash" type="text" name="input_5" id="input_5" placeholder="Rocket-Man">
                        <label for="input_5">Alpha dash</label>
                    </div>
                </div>        
                <div>
                    <div class="form-field row">
                        <input class="js-mask" data-mask="alpha-numeric-dash" type="text" name="input_6" id="input_6" placeholder="Rocket-Man">
                        <label for="input_6">Alpha-numeric dash</label>
                    </div>
                </div>        
                <div>
                    <div class="form-field row">
                        <input class="js-mask" data-mask="numeric" type="text" name="input_7" id="input_7" placeholder="1234567">
                        <label for="input_7">numeric</label>
                    </div>
                </div>        
                <div>
                    <div class="form-field row">
                        <input class="js-mask" data-mask="numeric-decimal" type="text" name="input_8" id="input_8" placeholder="332.43">
                        <label for="input_8">Numeric decimal</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


```html
<!-- Credit card -->
<input class="js-mask" data-mask="creditcard" type="text" name="input_1" id="input_1" placeholder="**** **** **** ****">
<label for="input_1">Credit Card</label>

<!-- Money-->
<input class="js-mask" data-mask="money" type="text" name="input_2" id="input_2" placeholder="44.43">
<label for="input_2">Money</label>

<!-- Alpha-numeric-->
<input class="js-mask" data-mask="alpha-numeric" type="text" name="input_3" id="input_3" placeholder="Rocker_Man_91">
<label for="input_3">Alpha-numeric</label>

<!-- Alpha-space -->
<input class="js-mask" data-mask="alpha-space" type="text" name="input_4" id="input_4" placeholder="Rocket Mab">
<label for="input_4">Alpha space</label>

<!-- Alpha-dash -->
<input class="js-mask" data-mask="alpha-dash" type="text" name="input_5" id="input_5" placeholder="Rocket-Man">
<label for="input_5">Alpha dash</label>

<!-- Alpha-numeric-dash -->
<input class="js-mask" data-mask="alpha-numeric-dash" type="text" name="input_6" id="input_6" placeholder="Rocket-Man">
<label for="input_6">Alpha-numeric dash</label>

<!-- Numeric -->
<input class="js-mask" data-mask="numeric" type="text" name="input_7" id="input_7" placeholder="1234567">
<label for="input_7">numeric</label>

<!-- Numeric decimal -->
<input class="js-mask" data-mask="numeric-decimal" type="text" name="input_8" id="input_8" placeholder="332.43">
<label for="input_8">Numeric decimal</label>
```

---

### Regex

You can also pass your own custom RegExp to the `data-mask` attribute in format `regex(pattern)`. The regex should math allowed characters in the input.

<div class="code-content-example">
    <div class="flex-row align-cols-center flex-cols-12 flex-cols-md-6">
        <div>
            <div class="form-field row">
                <input class="js-mask" data-mask="regex([\w\|\s])" type="text" name="input_9" id="input_9" placeholder="**** **** **** ****">
                <label for="input_9">Words and Spaces</label>
            </div>
        </div>
    </div>        
</div>

```html
<div class="form-field">
    <input class="js-mask" data-mask="regex([\w\|\s])" type="text" name="input_9" id="input_9" placeholder="**** **** **** ****">
    <label for="input_9">Words and Spaces</label>
</div>
```

---

### Formatting

You can custom format any masked input using the `data-format` attribute. Formats should be structured using an `x` for input values and anything else you want to add

<div class="code-content-example">
    <div class="flex-row align-cols-center flex-cols-12 flex-cols-md-6">
        <div>
            <div class="form-field row">
                <input class="js-mask" data-mask="numeric" data-format="xxxx--xxxx--xxxx--xxxx" type="text" name="input_10" id="input_10" placeholder="**** **** **** ****">
                <label for="input_10">Custom Format</label>
            </div>
        </div>
    </div>
</div>
   
```html
<div class="form-field">
    <input class="js-mask" data-mask="numeric" data-format="xxxx--xxxx--xxxx--xxxx" type="text" name="input_10" id="input_10" placeholder="**** **** **** ****">
    <label for="input_10">Custom Format</label>
</div>
```

---

### JavaScript Instantiation

If you need to add a custom input mask using JavaScript, you can instantiate a mask via the `Container`.

```javascript
const input = document.querySelector('#my-input');

const mask = FrontBx.InputMasker(input, '[A-z0-9-]',  'xxxx--xxxx--xxxx--xxxx');

if (someEvent)
{
    mask.destroy();
}
```
