# Results

---

Form results can be displayed as a message by simply adding a contextual class to the `<form>` element. 

This is super handy as you can have all your messages setup in the form result, and simply add the contextual class depending on the form validation. The contextual classes are `.info`, `.success`, `.warning`, `.danger`. This can be automated using the form validation component.

---

*   [Markup](#Markup)

---

### Markup
 
<div class="code-content-example">
	<form class="info">
	    <div class="form-result">
	        <div class="msg msg-info" aria-hidden="true">
	            <div class="msg-icon">
	                <span class="fa fa-bell icon"></span>
	            </div>
	            <div class="msg-body">
	                <p>Please check your email to activate your account</p>
	            </div>
	        </div>
	    </div>
	</form>
	<form class="success">
	    <div class="form-result">
	        <div class="msg msg-success" aria-hidden="true">
	            <div class="msg-icon">
	                <span class="fa fa-check icon"></span>
	            </div>
	            <div class="msg-body">
	                <p>Hooorayy! Your message was successfully sent!</p>
	            </div>
	        </div>
	    </div>
	</form>
	<form class="warning">
	    <div class="form-result">
	        <div class="msg msg-warning" aria-hidden="true">
	            <div class="msg-icon">
	                <span class="fa fa-triangle-exclamation icon"></span>
	            </div>
	            <div class="msg-body">
	                <p>There was an unknown error. Please try again later or contact support.</p>
	            </div>
	        </div>
	    </div>
	</form>
	<form class="danger">
	    <div class="form-result">
	        <div class="msg msg-danger" aria-hidden="true">
	            <div class="msg-icon">
	                <span class="fa fa-xmark icon"></span>
	            </div>
	            <div class="msg-body">
	                <p>You have been banned from creating an account with us.</p>
	            </div>
	        </div>
	    </div>
	</form>
</div>

```html
<form class="info">
    <div class="form-result">
        <div class="msg msg-info" aria-hidden="true">
            <div class="msg-icon">
                <span class="fa fa-bell icon"></span>
            </div>
            <div class="msg-body">
                <p>Did you know you can use this for Ajax?</p>
            </div>
        </div>
    </div>
</form>
<form class="success">
    <div class="form-result">
        <div class="msg msg-success" aria-hidden="true">
            <div class="msg-icon">
                <span class="fa fa-check icon"></span>
            </div>
            <div class="msg-body">
                <p>Did you know you can use this for Ajax?</p>
            </div>
        </div>
    </div>
</form>
<form class="warning">
    <div class="form-result">
        <div class="msg msg-warning" aria-hidden="true">
            <div class="msg-icon">
                <span class="fa fa-triangle-exclamation icon"></span>
            </div>
            <div class="msg-body">
                <p>Did you know you can use this for Ajax?</p>
            </div>
        </div>
    </div>
</form>
<form class="danger">
    <div class="form-result">
        <div class="msg msg-danger" aria-hidden="true">
            <div class="msg-icon">
                <span class="fa fa-xmark icon"></span>
            </div>
            <div class="msg-body">
                <p>There was an error processing your request. Please try again later.</p>
            </div>
        </div>
    </div>
</form>
```