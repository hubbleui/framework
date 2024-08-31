# Form Validation

---

FrontBx's `FormValidator` provides a powerful module to validate and interact with your forms an easily and quickly.

---

*   [Instantiation](#Instantiation)
*   [Markup](#markup)
*   [Validating](#validating)
*   [Example](#example)

---

### Instantiation

The `FormValidator` can be accessed through FrontBx's `Container`, providing your target `<form>` DOMElement as a parameter.

```javascript
const validator = FrontBx.FormValidator(document.querySelector.$('#myform'));
```

---

### Markup

To setup a form for validation, you can use one of the prebuilt validations under the `data-js-validation` attribute on any input:

```html
<input type="email" name="email" data-js-validation="email">
```

Prebuilt `data-js-validation` values are: `email` `name` `creditcard` `password` `url` `list` `alpha` `numeric` `alpha-numeric`

```html
<input type="email" name="email" data-js-validation="email">
<input type="text" name="name" data-js-validation="name">
<input type="text" name="creditcard" data-js-validation="creditcard">
<input type="text" name="password" data-js-validation="password">
<input type="text" name="url" data-js-validation="url">
<input type="text" name="list" data-js-validation="list">
<input type="text" name="username" data-js-validation="alpha">
<input type="text" name="phone" data-js-validation="numeric">
<input type="text" name="user" data-js-validation="alpha-numeric">
```

The `data-js-min-length` specifies the value must be `>=` a length in characters.

```html
<input type="text" name="name"  data-js-min-length="5">
```

The `data-js-max-length` specifies the value must be `<=` a length in characters.

```html
<input type="text" name="name"  data-js-max-length="20">
```

### Validating

Instantiate a `FormValidator` via FrontBx's `Container`, passing the target `<form>` DOMElement as the parameter.

```javascript
const validator = FrontBx.FormValidator(document.querySelector.$('#myform'));
```

The `isValid` method will check if the form is valid based on any validation input attributes:

```javascript
if (validator.isValid())
{
    // do stuff
}
```

The `showInvalid` method add the appropriate `context` class to any FrontBx `.form-fields` to show them as invalid:

```javascript
if (validator.isValid())
{
    validator.showInvalid();
}
```

The `clearInvalid` method clears any `context` classes on all `.form-fields`:

```javascript
validator.clearInvalid();
```

The `form` method returns an object with all the key/values from the forms inputs (it will handle multi inputs ass well e.g `<input name="foo[]"/>`)

```javascript
var form = validator.form();
```

The `append` method appends a key/pair to the form object from the form and returns it. Useful when you need to add something to an Ajax request like a `CSRF` token.

```javascript
var form = validator.append('secret_key', '$FDS#$T$@');
```

The `showResult` method will add the context class to form, which in turns displays the appropriate form result:

```javascript
validator.showResult('success');
```

---

### Example

Below is an example form using the validator. In a real request, you would use FrontBx's `Ajax` component, however for this example we just use a `timeout`. Check the console log for more details.

<div class="code-content-example">
    <form class="flex-row row-gaps-xs align-cols-center js-form">
        <div class="col-12 col-md-8">
			<div class="row pole-xs pole-s">
				<div class="form-field row">
					<input type="text" name="name" id="name" data-js-required="true" data-js-validation="name">
					<label for="name">Name</label>
				</div>
				<p class="help-danger">* You need to enter your name.</p>
			</div>
			<div class="row pole-xs pole-s">
				<div class="form-field row">
					<input type="email" name="email" id="email" data-js-required="true" data-js-validation="email">
					<label for="email">Email</label>
				</div>
				<p class="help-danger">* You need to enter your email address.</p>
			</div>
			<div class="row pole-xs pole-s">
				<div class="form-field row">
					<input type="password" name="password" id="password" data-js-required="true" data-js-validation="password">
					<label for="password">Password</label>
				</div>
				<p class="help-danger">* Passwords must include a number or special character.</p>
			</div>
			<div class="row pole-xs pole-s">
				<div class="form-field row">
					<span class="checkbox">
						<input type="checkbox" name="checkbox" id="checkbox" checked="true" />
						<label for="checkbox">Send me free stuff</label>
					</span>
				</div>
			</div>
			<div class="row pole-xs pole-s">
		        <div class="form-field pad-10 pad-r pad-s">
		        	<p class="no-margin">Form result:</p>
		            <span class="radio radio-info">
		                <input type="radio" name="result" id="radio_10" value="info" />
		                <label for="radio_10">Info</label>
		            </span>
		        </div>
		        <div class="form-field pad-10">
		            <span class="radio radio-success">
		                <input type="radio" name="result" id="radio_11" value="success" checked />
		                <label for="radio_11">Success</label>
		            </span>
		        </div>
		        <div class="form-field pad-10">
		            <span class="radio radio-warning">
		                <input type="radio" name="result" id="radio_12" value="warning" />
		                <label for="radio_12">Warning</label>
		            </span>
		        </div>
		        <div class="form-field pad-10">
		            <span class="radio radio-danger">
		                <input type="radio" name="result" id="radio_13" value="danger" />
		                <label for="radio_13">Danger</label>
		            </span>
		        </div>
		    </div>
		    <div class="row pole-xs pole-s">
				<button type="submit" class="btn with-loading">
					<span class="loader loader-1"></span>
					Submit
				</button>
			</div>
			<div class="form-result">
				<div class="msg msg-info" aria-hidden="true">
		            <div class="msg-icon">
		                <span class="fa fa-bell icon"></span>
		            </div>
		            <div class="msg-body">
		                <p>Please check your email to activate your account</p>
		            </div>
		        </div>
		        <div class="msg msg-success" aria-hidden="true">
		            <div class="msg-icon">
		                <span class="fa fa-check icon"></span>
		            </div>
		            <div class="msg-body">
		                <p>Hooorayy! Your message was successfully sent!</p>
		            </div>
		        </div>
		        <div class="msg msg-warning" aria-hidden="true">
		            <div class="msg-icon">
		                <span class="fa fa-triangle-exclamation icon"></span>
		            </div>
		            <div class="msg-body">
		                <p>There was an unknown error. Please try again later or contact support.</p>
		            </div>
		        </div>
		        <div class="msg msg-danger" aria-hidden="true">
		            <div class="msg-icon">
		                <span class="fa fa-xmark icon"></span>
		            </div>
		            <div class="msg-body">
		                <p>You have been banned from creating an account with us.</p>
		            </div>
		        </div>
			</div>
		</div>
	</form>
</div>

<script type="text/javascript">
window.addEventListener('FrontBx:ready', function()
{
	/* Helpers */
	const [find, has_class, add_class, remove_class, on] = FrontBx.import(['find', 'has_class', 'add_class', 'remove_class', 'on']).from('_');

	// Instantiate validator and cache vars
	const DOMElementform = find('.js-form');
	const validator = FrontBx.FormValidator(DOMElementform);
	const submitBtn = find('button[type=submit]', DOMElementform);
	let fakeAjax;

	on(submitBtn, 'click', function(e)
	{
		console.log('submitting');

		// Stop the form from submitting via POST
	    e = e || window.event;

	    e.preventDefault();

	    // Don't submit if the form if it is being submitted
	    if (has_class(submitBtn, 'active')) return;

	    // Cache result class from radio
	    var result = validator.form().result;

	    // Clear all invalid input classes and form results
	    validator.clearInvalid();

	    // Clear fake ajax timeout
	    clearTimeout(fakeAjax);

	    console.log(result);

	    // Validation
	    if (validator.isValid())
	    {
	    	// Button active
	        add_class(submitBtn, 'active');

	        // Here you would send a real ajax request
	        fakeAjax = setTimeout(function()
	        { 
	            validator.showResult(result);

	            remove_class(submitBtn, 'active');

	        }, 500);
	    }
	    else
	    {
	        validator.showInvalid();
	    }
	});
})

</script>

```javascript

/* Helpers */
const [find, has_class, add_class, remove_class, on] = FrontBx.import(['find', 'has_class', 'add_class', 'remove_class', 'on']).from('Helper');

// Instantiate validator and cache vars
const form      = find('.js-form');
const validator = FrontBx.FormValidator(form);
const submitBtn = find('button[type=submit]', form);
let fakeAjax;

on(submitBtn, 'click', function(e)
{
	// Stop the form from submitting via POST
    e = e || window.event;
    e.preventDefault();

    // Don't submit if the form if it is being submitted
    if (has_class(submitBtn, 'active')) return;

    // Clear all invalid input classes and form results
    validator.clearInvalid();

    // Clear fake ajax timeout
    clearTimeout(fakeAjax);

    // Validation
    if (validator.isValid())
    {
    	// Button active
        add_class(submitBtn, 'active');

        // No Ajax?
        // form.submit()

        // Here you would send a real ajax request
        fakeAjax = setTimeout(function()
        { 
            validator.showResult('success');

            remove_class(submitBtn, 'active');

        }, 3000);
    }
    else
    {
        validator.showInvalid();
    }
});
```
