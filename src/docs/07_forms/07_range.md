Hubble inputs allow you to style forms quickly with very little markup. Because HTML inputs are used frequently across third-party libraries and plugins, Hubble inputs are styled with the `.form-field` wrapper class.

<div class="code-content-example">
    <div class="container-fuid">
        <form class="row clearfix" style="width: 400px;">
            <div class="row floor-md">
            	<div class="form-field row">
                    <input name="text" id="example_1" type="text" placeholder="Enter some text...">
                    <label for="example_1">My Input</label>
                </div>
                <div class="form-field row">
                    <span class="range-input">
					    <!-- <input type="range" min="0" max="50" value="5" id="lower"> -->
					    <input type="range" min="0" max="50" value="45" id="upper">
					    <label for="upper">Range:</label>
					</span>
                </div>
            </div>
        </form>
    </div>
</div>

```html
<form>
    <div class="form-field row">
        <input name="text" id="my-input" type="text" placeholder="Enter some text...">
        <label for="my-input">My Input</label>
    </div>
</form>
```

