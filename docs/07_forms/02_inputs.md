# Inputs

---

FrontBx comes with a number of basic form inputs  

---

*   [Basic example](#basic-example)
*   [Basic example](#basic-example)
*   [List contents](#list-contents)
*   [Selected lists](#selected-lists)

---

### Basic example

FrontBx inputs allow you to style forms quickly with very little markup. Because HTML inputs are used frequently across third-party libraries and plugins, FrontBx inputs are styled with the `.form-field` wrapper class.

<div class="code-content-example">
    <form class="flex-row-fluid col-gaps-sm align-cols-center">
        <div class="form-field">
            <input name="text" id="example_1" type="text" placeholder="Enter some text...">
            <label for="example_1">Default</label>
        </div>
        <div class="form-field underlined">
            <input name="text" id="example_1_underline" type="text" placeholder="Enter some text...">
            <label for="example_1_underline">.underline</label>
        </div>
    </form>
</div>

```html
<form>
    <div class="form-field">
        <input name="text" id="example_1" type="text" placeholder="Enter some text...">
        <label for="example_1">Default</label>
    </div>
    <div class="form-field underlined">
        <input name="text" id="example_1_underline" type="text" placeholder="Enter some text...">
        <label for="example_1_underline">underline</label>
    </div>
</form>
```

---

### Input addons

To create an input group, add the `.input-group` class to `.form-field` wrapper. You can place an `.input-addon` either or both sides of an input. You'll then need to wrap the input and label in a `<div>`.

<div class="code-content-example">
    <form class="flex-row row-gaps-xs align-cols-center">
        <div class="col-12 col-md-8 col-lg-6">
            <div class="row pole-sm pole-s">
                <div class="form-field input-group">
                    <span class="input-addon">@</span>
                    <div>
                        <input name="text" id="example_2" type="text" placeholder="Your handle...">
                        <label for="example_2">Username</label>
                    </div>
                </div>
            </div>
            <div class="row pole-sm pole-s">
                <div class="form-field input-group">
                    <span class="input-addon">foo.com/</span>
                    <div>
                        <input name="text" id="example_3" type="text" placeholder="Your handle">
                        <label for="example_3">Vanity URL</label>
                    </div>
                </div>
            </div>
            <div class="form-field input-group">
                <span class="input-addon">Cool Name</span>
                <div>
                    <input name="text" id="example_5" type="text" placeholder="Your email">
                    <label for="example_5">Email address</label>
                </div>
                <span class="input-addon">@foo.com</span>
            </div>
        </div>
    </form>
</div>

```html
<!-- Addon before input -->
<div class="form-field input-group">
    <span class="input-addon">@</span>
    <div>
        <input name="text" id="example_2" type="text" placeholder="Your handle...">
        <label for="example_2">Username</label>
    </div>
</div>

<!-- Addon after input -->
<div class="form-field input-group">
    <span class="input-addon">foo.com/</span>
    <div>
        <input name="text" id="example_3" type="text" placeholder="Your handle">
        <label for="example_3">Vanity URL</label>
    </div>
</div>

<!-- Addon before & after input -->
<div class="form-field input-group">
    <span class="input-addon">@</span>
    <div>
        <input name="text" id="example_5" type="text" placeholder="Your email">
        <label for="example_5">Email address</label>
    </div>
    <span class="input-addon">@foo.com</span>
</div>
```

You can add icons inside the `.form-field` wrapper as addons. Unlike input groups, there's no additional markup needed

<div class="code-content-example">
    <form class="flex-row row-gaps-xs align-cols-center">
        <div class="col-12 col-md-8 col-lg-6">
            <div class="row pole-sm pole-s">
                <div class="form-field row">
                    <span class="fa fa-heart"></span>
                    <input name="text" id="example_6" type="text" placeholder="Enter some text...">
                    <label for="example_6">Text Input</label>
                </div>
            </div>
            <div class="row pole-sm pole-s">
                <div class="form-field row">
                    <input name="text" id="example_7" type="text" placeholder="Enter some text...">
                    <label for="example_7">Text Input</label>
                    <span class="fa fa-heart"></span>
                </div>
            </div>
            <div class="form-field row">
                <span class="fa fa-heart"></span>
                <input name="text" id="example_8" type="text" placeholder="Enter some text...">
                <label for="example_8">Text Input</label>
                <span class="fa fa-heart"></span>
            </div>
        </div>
    </form>
</div>

```html
<!-- Icon before input -->
 <div class="form-field row">
    <span class="fa fa-heart"></span>
    <input name="text" id="text" type="text" placeholder="Enter some text...">
    <label>Text Input</label>
</div>

<!-- Icon after input -->
 <div class="form-field row">
    <span class="fa fa-heart"></span>
    <input name="text" id="text" type="text" placeholder="Enter some text...">
    <label>Text Input</label>
</div>

<!-- Icon before & after input -->
<div class="form-field row">
    <span class="fa fa-heart"></span>
    <input name="text" id="text" type="text" placeholder="Enter some text...">
    <label>Text Input</label>
    <span class="fa fa-heart"></span>
</div>
```

### Input states

Input states are styled on classes added to the `.form-field` wrapper element via JavaScript. The library adds `.not-empty`, `.empty` & `.focus` automatically.

<div class="code-content-example">
    <form class="flex-row row-gaps-xs align-cols-center">
        <div class="col-12 col-md-8 col-lg-6">
            <div class="row pole-sm pole-s">
                <div class="form-field row">
                    <input name="text" id="example_10" type="text" placeholder="Enter some text...">
                    <label for="example_10">Default</label>
                </div>
            </div>
            <div class="row pole-sm pole-s">
                <div class="form-field row not-empty">
                    <input name="text" id="example_10" type="text" placeholder="Enter some text..." value="Something here">
                    <label for="example_10">.not-empty</label>
                </div>
            </div>
            <div class="row pole-sm pole-s">
                <div class="form-field row focus">
                    <input name="text" id="example_10" type="text" placeholder="Enter some text...">
                    <label for="example_10">.focus.empty</label>
                </div>
            </div>
            <div class="row pole-sm pole-s">
                <div class="form-field row focus not-empty">
                    <input name="text" id="example_10" type="text" placeholder="Enter some text..." value="Something here">
                    <label for="example_10">.focus.not-empty</label>
                </div>
            </div>
            <div class="row pole-sm pole-s">
                <div class="form-field row danger">
                    <input name="text" id="example_10" type="text" placeholder="Enter some text...">
                    <label for="example_10">.danger</label>
                </div>
            </div>
            <div class="row pole-sm pole-s">
                <div class="form-field row warning">
                    <input name="text" id="example_10" type="text" placeholder="Enter some text...">
                    <label for="example_10">.warning</label>
                </div>
            </div>
            <div class="row pole-sm pole-s">
                <div class="form-field row disabled">
                    <input name="text" id="text" type="text" placeholder="Enter some text..." disabled class="disabled">
                    <label>Disabled</label>
                </div>
            </div>
        </div>
    </form>
</div> 

---

### Helper text

Input errors and warning help text can be helpful when running form validations. They're hidden by default and will display when the the wrapping `.form-field` has a class of `.danger` or `.warning`.

<div class="code-content-example">
    <form class="flex-row row-gaps-xs align-cols-center">
        <div class="col-12 col-md-8 col-lg-6">
            <div class="row pole-xs pole-s">
                <div class="form-field row warning">
                    <input name="text" id="example_10" type="text" placeholder="Enter some text...">
                    <label for="example_10">Warning</label>
                </div>
                <p class="help-warning">* Make sure your name is real</p>
            </div>
            <div class="row pole-xs pole-s">
                <div class="form-field row danger">
                    <input name="text" id="example_10" type="text" placeholder="Enter some text...">
                    <label for="example_10">Danger</label>
                </div>
                <p class="help-danger">* You need to enter your name</p>
                <p class="help-warning">* Make sure your name is real</p>
            </div>
        </div>
    </form>
</div>



---

### Field types

FrontBx's forms and form elements come pre-styled out of the box. Below is a list of examples using different `<input>` types:

<div class="code-content-example">
    <form class="row clearfix" style="width: 400px;">
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="text" id="text" type="text" placeholder="Enter some text...">
                <label>Text Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="email" id="email" type="email" placeholder="john@exampe.com">
                <label for="email">Email Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="tel" id="tel" type="tel" placeholder="+61 0400 043 043">
                <label for="tel">Tel Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="password" id="password" type="password" placeholder="Use a secure passowrd">
                <label for="password">Password Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="url" id="url" type="url" placeholder="www.example.com">
                <label>Url Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="number" id="number" type="number" placeholder="44">
                <label>Number Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="search" id="search" type="search" placeholder="e.g Shoes">
                <label for="search">Search Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="date" id="date" type="date" placeholder="01/05/2001">
                <label for="date">Date Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="datetime-local" id="datetime-local" type="datetime-local" placeholder="01/05/2001 4:15am">
                <label for="datetime-local">Datetime Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="month" id="month" type="month" placeholder="June 2001">
                <label>Month Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="week" id="week" type="week" placeholder="Week 12, 2003">
                <label for="week">Week Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <input name="time" id="time" type="time" placeholder="11:01 am">
                <label>Time Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <select name="select" id="select" placeholder="Choose something nice">
                    <option value="">Choose an option</option>
                    <option value="Option 1">Option 1</option>
                    <option value="Option 2">Option 2</option>
                    <option value="Option 3">Option 3</option>
                </select>
                <label for="select">Select Input</label>
            </div>
        </div>
        <div class="row pole-sm pole-s">
            <div class="form-field row">
                <textarea name="textarea" id="textarea" placeholder="Write a story..." rows="5"></textarea>
                <label for="textarea">Textarea Input</label>
            </div>
        </div>
        <button type="submit" class="btn">Submit</button>
    </form>
</div> 

```html
<form>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="text" id="text" type="text" placeholder="Enter some text...">
<label>Text Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="email" id="email" type="email" placeholder="john@exampe.com">
<label for="email">Email Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="tel" id="tel" type="tel" placeholder="+61 0400 043 043">
<label for="tel">Tel Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="password" id="password" type="password" placeholder="Use a secure passowrd">
<label for="password">Password Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="url" id="url" type="url" placeholder="www.example.com">
<label>Url Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="number" id="number" type="number" placeholder="44">
<label>Number Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="search" id="search" type="search" placeholder="e.g Shoes">
<label for="search">Search Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="date" id="date" type="date" placeholder="01/05/2001">
<label for="date">Date Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="datetime-local" id="datetime-local" type="datetime-local" placeholder="01/05/2001 4:15am">
<label for="datetime-local">Datetime Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="month" id="month" type="month" placeholder="June 2001">
<label>Month Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="week" id="week" type="week" placeholder="Week 12, 2003">
<label for="week">Week Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<input name="time" id="time" type="time" placeholder="11:01 am">
<label>Time Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<select name="select" id="select" placeholder="Choose something nice">
<option value="">Choose an option</option>
<option value="Option 1">Option 1</option>
<option value="Option 2">Option 2</option>
<option value="Option 3">Option 3</option>
</select>
<label for="select">Select Input</label>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field file-field js-file-field">
<input type="text" class="js-file-text file-text" placeholder="Choose a file">
<label  for="file_input">Upload Input</label>
<button type="button" class="btn btn-primary btn-upload">
<span class="upload-cover">
<input type="file" class="js-file-input" name="file_input">
</span>
<span class="fa fa-upload"></span>
</button>
</div>
</div>
<div class="row pole-sm pole-s">
<div class="form-field row">
<textarea name="textarea" id="textarea" placeholder="Write a story..." rows="5"></textarea>
<label for="textarea">Textarea Input</label>
</div>
</div>
<button type="submit" class="btn">Submit</button>
</form>
-->
```
