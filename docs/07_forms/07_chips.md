# Chips

Chips allow users to enter information, make selections, filter content, or trigger actions and are one of FrontBx's most versatile components.

While buttons are expected to appear consistently and with familiar calls to action, chips should appear dynamically as a group of multiple interactive elements.

---

*   [Markup](#markup)
*   [States](#states)
*   [Variants](#variants)
*   [Input chips](#input-chips)
*   [Suggestion Chips](#suggestion-chips)
*   [Choice Chips](#choice-chips)
*   [Filter Chips](#filter-chips)

---

### Markup

Chips are a modifier class to FrontBx's `.btn`, however as you'll see have extended functionality and states. A basic chip is created using the `.btn-chip` on `.btn`.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs">
        <button class="btn btn-chip">Hello</button>
        <button class="btn btn-chip">World</button>
        <button class="btn btn-chip">
            <span class="fa fa-check"></span>
            Good
        </button>
        <button class="btn btn-chip">
            Love&nbsp;
            <span class="fa fa-heart"></span>
        </button>
    </div>
</div>

```html
<button class="btn btn-chip">Hello</button>
<button class="btn btn-chip">World</button>
<button class="btn btn-chip">
    <span class="fa fa-check"></span>
    Good
</button>
<button class="btn btn-chip">
    Love&nbsp;
    <span class="fa fa-heart"></span>
</button>
```

---

### States

Along with their native states native states, chips can have extra states depending on their use case:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs">
        <button class="btn btn-chip">normal</button>
        <button class="btn btn-chip hover">:hover</button>
        <button class="btn btn-chip selected">.selected</button>
        <button class="btn btn-chip checked">.checked</button>
        <button class="btn btn-chip disabled">.disabled</button>
    </div>
</div>

```html
<button class="btn btn-chip">normal</button>
<button class="btn btn-chip hover">:hover</button>
<button class="btn btn-chip selected">.selected</button>
<button class="btn btn-chip checked">.checked</button>
<button class="btn btn-chip disabled">.disabled</button>
```

---

### Variants

Since chips are a modifier on `.btn`, they have all the same contextual variants.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs">
        <button class="btn btn-primary btn-chip">.btn-primary</button>
        <button class="btn btn-info btn-chip">.btn-info</button>
        <button class="btn btn-success btn-chip">.btn-success</button>
        <button class="btn btn-warning btn-chip">.btn-warning</button>
        <button class="btn btn-danger btn-chip">.btn-danger</button>
    </div>
    <div class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs pole-sm pole-n">
        <button class="btn btn-outline btn-primary btn-chip">.btn-primary</button>
        <button class="btn btn-outline btn-info btn-chip">.btn-info</button>
        <button class="btn btn-outline btn-success btn-chip">.btn-success</button>
        <button class="btn btn-outline btn-warning btn-chip">.btn-warning</button>
        <button class="btn btn-outline btn-danger btn-chip">.btn-danger</button>
    </div>
</div>


```html
<button class="btn btn-primary btn-chip">.btn-primary</button>
<button class="btn btn-info btn-chip">.btn-info</button>
<button class="btn btn-success btn-chip">.btn-success</button>
<button class="btn btn-warning btn-chip">.btn-warning</button>
<button class="btn btn-danger btn-chip">.btn-danger</button>

<button class="btn btn-outline btn-primary btn-chip">.btn-primary</button>
<button class="btn btn-outline btn-info btn-chip">.btn-info</button>
<button class="btn btn-outline btn-success btn-chip">.btn-success</button>
<button class="btn btn-outline btn-warning btn-chip">.btn-warning</button>
<button class="btn btn-outline btn-danger btn-chip">.btn-danger</button>
```

---

### Input chips

Adding chips to a input requires a few bits and pieces of markup but is relatively straight-forward. 

The `data-name` attribute on the wrapper element on the is used for the `name` attribute on hidden inputs inside each chip.

The `data-class` attribute is used for styling the chips that get inserted into the input. For example setting this to `.btn-outline` would insert outline variants of chips.

> Note that input chips use `span` element rather than a `button` as there is a hidden `input` element inside each chip as well as `button` to remove it.

<div class="code-content-example">
    <form class="row pole-xs">
        <div class="chips-input js-chips-input" data-input-name="chips[]" data-chip-class="">
            <span class="btn btn-chip">
                Hello
                <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
                    <span class="fa fa-xmark"></span>
                </button>
                <input type="hidden" value="Hello" name="chips[]">
            </span>
            <span class="btn btn-chip">
                World
                <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
                    <span class="fa fa-xmark"></span>
                </button>
                <input type="hidden" value="World" name="chips[]">
            </span>
            <div class="form-field">
                <input class="js-chip-input" id="chip-field" type="text" placeholder="Add your chips...">
                <label for="chip-field">Text Input</label>
            </div>
        </div>
    </form>
</div>

```html
<form>
    <div class="chips-input js-chips-input" data-input-name="chips[]" data-chip-class="">
        
        <span class="btn btn-chip">
            Hello
            <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
                <span class="fa fa-xmark"></span>
            </button>
            <input type="hidden" value="Hello" name="chips[]">
        </span>

        <span class="btn btn-chip">
            World
            <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
                <span class="fa fa-xmark"></span>
            </button>
            <input type="hidden" value="World" name="chips[]">
        </span>
        
        <div class="form-field">
            <input class="js-chip-input" id="chip-field" type="text" placeholder="Add your chips...">
            <label for="chip-field">Text Input</label>
        </div>

    </div>
</form>
```

Chips can also be used inside an unstyled input. The base input has no styling making it versatile usage.

<div class="code-content-example">
    <form class="row">
        <div class="chips-input-unstyled js-chips-input" data-input-name="chips[]" data-chip-class="">
            <label for="chip-field2">Tags</label>
            <span class="btn btn-chip">
                Hello
                <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
                    <span class="fa fa-xmark"></span>
                </button>
                <input type="hidden" value="Hello" name="chips[]">
            </span>
            <span class="btn btn-chip">
                World
                <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
                    <span class="fa fa-xmark"></span>
                </button>
                <input type="hidden" value="World" name="chips[]">
            </span>
            <input type="text" class="input-unstyled js-chip-input" placeholder="Enter your tags..." id="chip-field2">
        </div>
    </form>
</div>

```html
<form class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs">
    <div class="chips-input-unstyled js-chips-input" data-input-name="chips[]" data-chip-class="">
        <label for="chip-field2">Tags</label>
        <span class="btn btn-chip">
            Hello
            <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
                <span class="fa fa-xmark"></span>
            </button>
            <input type="hidden" value="Hello" name="chips[]">
        </span>
        <span class="btn btn-chip">
            World
            <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
                <span class="fa fa-xmark"></span>
            </button>
            <input type="hidden" value="World" name="chips[]">
        </span>
        <input type="text" class="input-unstyled js-chip-input" placeholder="Enter your tags..." id="chip-field2">
    </div>
</form>
```

---

### Suggestions

Chips can be used as suggestions to any existing input. Simply wrap chips in a `.js-chip-suggestions` element.

The `data-input-target` must contain the `id` of the target input.

<div class="code-content-example">
    <div class="row pole-xs">
        <div class="form-field row">
            <input name="response" id="response1" type="text" placeholder="Enter some text...">
            <label for="response1">Text Input</label>
        </div>
        <div class="row pole-xs pole-n chip-suggestions js-chip-suggestions" data-input-target="response1">
            <button class="btn btn-chip ">Wow great idea!</button>
            <button class="btn btn-chip">Sounds good. Let's do it.</button>
            <button class="btn btn-chip">Ok see you there.</button>
        </div>
    </div>
</div>

```html
<form>
    <div class="form-field row">
        <input name="response" id="response1" type="text" placeholder="Enter some text...">
        <label for="response1">Text Input</label>
    </div>
    <div class="row pole-xs pole-n chip-suggestions js-chip-suggestions" data-input-target="response1">
        <button class="btn btn-chip ">Wow great idea!</button>
        <button class="btn btn-chip">Sounds good. Let's do it.</button>
        <button class="btn btn-chip">Ok see you there.</button>
    </div>
</form>
```

Chip suggestions can be incorporated into a **chip input** too.

<div class="code-content-example">
    <div class="row pole-xs">
        <div class="chips-input js-chips-input" data-input-name="chips[]" data-chip-class="" id="suggestions-chip-input">
            <span class="btn btn-chip">
                Hello
                <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
                    <span class="fa fa-xmark"></span>
                </button>
                <input type="hidden" value="Hello" name="chips[]">
            </span>
            <span class="btn btn-chip">
                World
                <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
                    <span class="fa fa-xmark"></span>
                </button>
                <input type="hidden" value="World" name="chips[]">
            </span>
            <div class="form-field">
                <input class="js-chip-input" id="chip-suggestions-field" type="text" placeholder="Add your chips...">
                <label for="chip-suggestions-field">Text Input</label>
            </div>
        </div>
        <div class="row pole-xs pole-n chip-suggestions js-chip-suggestions" data-input-target="suggestions-chip-input">
            <button class="btn btn-chip ">Wow great idea!</button>
            <button class="btn btn-chip">Sounds good. Let's do it.</button>
            <button class="btn btn-chip">Ok see you there.</button>
        </div>
    </div>
</div>

```html
<div class="chips-input js-chips-input" data-input-name="chips[]" data-chip-class="" id="suggestions-chip-input">
    
    <span class="btn btn-chip">
        Hello
        <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
            <span class="fa fa-xmark"></span>
        </button>
        <input type="hidden" value="Hello" name="chips[]">
    </span>

    <span class="btn btn-chip">
        World
        <button type="button" aria-label="remove" class="remove-btn btn-unstyled js-remove-btn">
            <span class="fa fa-xmark"></span>
        </button>
        <input type="hidden" value="World" name="chips[]">
    </span>

    <div class="form-field">
        <input class="js-chip-input" id="chip-suggestions-field" type="text" placeholder="Add your chips...">
        <label for="chip-suggestions-field">Text Input</label>
    </div>

</div>

<div class="row pole-xs pole-n chip-suggestions js-chip-suggestions" data-input-target="suggestions-chip-input">
    <button class="btn btn-chip ">Wow great idea!</button>
    <button class="btn btn-chip">Sounds good. Let's do it.</button>
    <button class="btn btn-chip">Ok see you there.</button>
</div>
```

---

### Choice chips

Choice chips are another way of displaying a radio input to the end-user or in other words, a multiple-choice answer.

Choice chips clearly delineate and display options in a compact area. They are a good alternative to toggle buttons, radio buttons, and single select menus.

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs js-choice-chips">
        <button class="btn btn-chip" data-value="small">Small</button>
        <button class="btn btn-chip" data-value="medium">Medium</button>
        <button class="btn btn-chip selected" data-value="large">Large</button>
        <button class="btn btn-chip" data-value="extra-large">Extra Large</button>
        <input type="hidden" name="choice" value="large" class="js-choice-input">
    </div>
</div>

```html
<div class="choice-chips js-choice-chips"> 
    <span class="btn btn-chip selected" data-value="small">
		Small</span>
	</span>
	...
    <input type="hidden" name="choice" value="small" class="js-choice-input">
</div>
<div class="choice-chips js-choice-chips"> 
    <span class="btn btn-chip chip-outline" data-value="small">
		Small</span>
	</span>
	...
    <input type="hidden" name="choice" value="large" class="js-choice-input">
</div>
```

---

### Filter chips

Filter chips use tags or descriptive words to filter content. Filter chips clearly delineate and display options in a compact area. They are a good alternative to toggle buttons or checkboxes.

<div class="code-content-example">
    <div class="row floor-xs">
        <div class="flex-row-fluid align-cols-center col-gaps-xs js-filter-chips">
            <button class="btn btn-chip">
                <span class="fa fa-bed"></span>Bedroom
                <input type="hidden" value="bedroom" name="location[]">
            </button>
            <button class="btn btn-chip">
                <span class="fa fa-couch"></span>Living Room
                <input type="hidden" value="living-room" name="location[]">
            </button>
            <button class="btn btn-chip checked">
                <span class="fa fa-kitchen-set"></span>Kitchen
                <input type="hidden" value="kitchen" name="location[]">
            </button>
            <button class="btn btn-chip checked">
                <span class="fa fa-kitchen-book"></span>Study
                <input type="hidden" value="study" name="location[]">
            </button>
        </div>
    </div>
</div>

```html
<div class="js-filter-chips">
    <button class="btn btn-chip">
        <span class="fa fa-bed"></span>Bedroom
        <input type="hidden" value="bedroom" name="location[]">
    </button>
    <button class="btn btn-chip">
        <span class="fa fa-couch"></span>Living Room
        <input type="hidden" value="living-room" name="location[]">
    </button>
    <button class="btn btn-chip checked">
        <span class="fa fa-kitchen-set"></span>Kitchen
        <input type="hidden" value="kitchen" name="location[]">
    </button>
    <button class="btn btn-chip checked">
        <span class="fa fa-kitchen-book"></span>Study
        <input type="hidden" value="study" name="location[]">
    </button>
</div>
```