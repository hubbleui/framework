# Skeleton 

FrontBx's skeleton component lets you quickly display a placeholder preview of your content before the data gets loaded to reduce load-time and improve user experience on Pjax or Ajax requests.

---

*   [Markup](#markup)
*   [Base Variants](#base-variants)
*   [Text](#text)
*   [Text Blocks](#text-blocks)
*   [Variant examples](#variant-examples)
*   [JavaScript Utility](#javascript-utility)
    *   [Usage](#usage)
    *   [Options](#options)
    *   [Loading Content](#loading-content)
*   [CSS Customization](#css-customization)

---

### Markup

Skeletons are simple to create, simply create an element with the `.skeleton` class inside a component.

Note that Skeletons by default with fill all available vertical and horizontal space inside their container. If you're placing a skeleton inside an empty column or a container without a height you'll need to either specify a height on the container or on the skeleton itself.

The example below shows the markup for a skeleton using a simple card:

<div class="code-content-example">
    <div class="flex-row align-cols-center-x">
        <div class="card col col-lg-4">
            <div class="card-header">
                <div class="card-header-left">
                    <div class="skeleton skeleton-circle skeleton-wave" style="width: 40px; height: 40px;"></div>
                </div>
                <div class="card-header-content">
                    <div class="skeleton-text-block skeleton-lines">
                        <div class="skeleton" style="width: 71%;"></div>
                        <div class="skeleton" style="width: 81%;"></div>
                    </div>
                </div>
            </div>
            <div class="card-media">
                <div class="skeleton skeleton-block skeleton-wave" style="width: 100%; height: auto; aspect-ratio: 16 / 9;"></div>
            </div>
            <div class="card-block">
                <div class="skeleton skeleton-h5"></div>
                <div class="skeleton-text-block skeleton-lines">
                    <div class="skeleton" style="width: 81%;"></div>
                    <div class="skeleton" style="width: 84%;"></div>
                    <div class="skeleton" style="width: 91%;"></div>
                </div>
            </div>
        </div>
    </div>
</div>

```html
<div class="card">
    <div class="card-header">
        <div class="card-header-left">
            <div class="skeleton skeleton-circle skeleton-wave" style="width: 40px; height: 40px;"></div>
        </div>
        <div class="card-header-content">
            <div class="skeleton-text-block skeleton-lines">
                <div class="skeleton" style="width: 71%;"></div>
                <div class="skeleton" style="width: 81%;"></div>
            </div>
        </div>
    </div>
    <div class="card-media">
        <div class="skeleton skeleton-block skeleton-wave" style="width: 100%; height: auto; aspect-ratio: 16 / 9;"></div>
    </div>
    <div class="card-block">
        <div class="skeleton skeleton-h5"></div>
        <div class="skeleton-text-block skeleton-lines">
            <div class="skeleton" style="width: 81%;"></div>
            <div class="skeleton" style="width: 84%;"></div>
            <div class="skeleton" style="width: 91%;"></div>
        </div>
    </div>
</div>
```

---

### Base Variants

Skeletons come in a few different base variants `.skeleton-wave`, `.skeleton-text`, `.skeleton-rounded`, `.skeleton-btn`, `.skeleton-input`, `.skeleton-circle` and via modifier classes. 

The table below outlines their core styles

| Class               | Behavior                                                                                           |
|---------------------|----------------------------------------------------------------------------------------------------|
| `.skeleton-wave`    | Sets skeleton animation to a wave effect. Good for images                                          |
| `.skeleton-text`    | Sets skeleton to height of body copy with matching margins with addition of rounded corners        |
| `.skeleton-rounded` | Sets rounded corners on a skeleton                                                                 |
| `.skeleton-btn`     | Creates a rectangular fixed height and width skeleton to match FrontBx button sizing                |
| `.skeleton-input`   | Creates a rectangular fixed height skeleton to match FrontBx input sizing                           |
| `.skeleton-circle`  | Sets skeleton to a circle. Width and height can adjusted via modifier sizes or overridden manually |

<div class="code-content-example">
    <div class="row pole-xs pole-s">
        <div class="col col-12 col-md-4 center-horizontal">
            <div class="skeleton skeleton-text"></div>
            <div class="pole-xs pole-s"><div class="skeleton skeleton-circle"></div></div>
            <div class="pole-xs pole-s"><div class="skeleton skeleton-wave" style="height: 130px;"></div></div>
            <div class="pole-xs pole-s"><div class="skeleton skeleton-rounded" style="height: 130px;"></div></div>
            <div class="pole-xs pole-s"><div class="skeleton skeleton-input"></div></div>
            <div class="pole-xs pole-s"><div class="skeleton skeleton-btn"></div></div>
        </div>
    </div>
</div>

```html
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-circle"></div>
<div class="skeleton skeleton-wave"></div>
<div class="skeleton skeleton-rounded"></div>
<div class="skeleton skeleton-input"></div>
<div class="skeleton skeleton-btn"></div>
```

`.skeleton-circle` comes in three modifier sizes `.circle-sm`, `.circle-md` and `.circle-lg` 

<div class="code-content-example">
    <div class="row pole-xs pole-s">
        <div class="col col-12 col-md-4 center-horizontal">
            <div class="skeleton skeleton-circle circle-sm"></div>
            <div class="skeleton skeleton-circle circle-md"></div>
            <div class="skeleton skeleton-circle circle-lg"></div>
        </div>
    </div>
</div>

```html
<div class="skeleton skeleton-circle circle-sm"></div>
<div class="skeleton skeleton-circle circle-md"></div>
<div class="skeleton skeleton-circle circle-lg"></div>
```

---

### Text

To display text and the `.skeleton-text` modifier class. The sizing, height and line height will match FrontBx's typography configurations:

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <p>Lorem ipsum dolore excepteur culpa sit.</p>
            <p>Lorem ipsum velit amet officia minim fugiat.</p>
            <p>Cillum laboris do est.</p>
        </div>
    </div>
</div>

```html
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text"></div>
```

To display text headings add the appropriate heading `.skeleton-h[num]` modifier class. The sizing, height and line height will match FrontBx's typography configurations:

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="skeleton skeleton-h1"></div>
            <div class="skeleton skeleton-h2"></div>
            <div class="skeleton skeleton-h3"></div>
            <div class="skeleton skeleton-h4"></div>
            <div class="skeleton skeleton-h5"></div>
            <div class="skeleton skeleton-h6"></div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <h1>Heading 1</h1>
            <h2>Heading 2</h2>
            <h3>Heading 3</h3>
            <h4>Heading 4</h4>
            <h5>Heading 5</h5>
            <h6>Heading 6</h6>
        </div>
    </div>
</div>

```html
<div class="skeleton skeleton-h1"></div>
<div class="skeleton skeleton-h2"></div>
<div class="skeleton skeleton-h3"></div>
<div class="skeleton skeleton-h4"></div>
<div class="skeleton skeleton-h5"></div>
<div class="skeleton skeleton-h6"></div>
```

---

### Text Blocks

For multi-line text blocks, wrap skeletons in a `.skeleton-text-block` element.

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="skeleton-text-block">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <p>Aliquip veniam eu enim quis sit nisi enim exercitation ad irure sunt ut pariatur, cillum reprehenderit do duis voluptate proident dolor sint duis. Id commodo cupidatat minim labore elit officia eu officia eu velit sunt veniam. Quis aute minim dolore voluptate nisi ut aliquip et exercitation commodo nisi enim sunt labore et nulla enim in minim consequat ea velit dolore reprehenderit aute anim voluptate consectetur magna enim consectetur fugiat in occaecat magna dolor culpa elit.</p>
        </div>
    </div>
</div>

```html
<div class="skeleton-text-block">
    <div class="skeleton"></div>
    <div class="skeleton"></div>
    ...
</div>
```

For multi-line heading use the same `.skeleton-text-block` wrapper with the appropriate heading modifier `.skeleton-text-block-h[num]`:

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="skeleton-text-block skeleton-text-block-h1">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <h1>Lorem ipsum voluptate eiusmod.</h1>
        </div>
    </div>
</div>

```html
<div class="skeleton-text-block skeleton-text-block-h1">
    <div class="skeleton"></div>
    <div class="skeleton"></div>
</div>
```

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="skeleton-text-block skeleton-text-block-h2">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <h2>Lorem ipsum voluptate eiusmod.</h2>
        </div>
    </div>
</div>

```html
<div class="skeleton-text-block skeleton-text-block-h2">
    <div class="skeleton"></div>
    <div class="skeleton"></div>
</div>
```

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="skeleton-text-block skeleton-text-block-h3">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <h3>Lorem ipsum voluptate eiusmod velit.</h3>
        </div>
    </div>
</div>

```html
<div class="skeleton-text-block skeleton-text-block-h3">
    <div class="skeleton"></div>
    <div class="skeleton"></div>
</div>
```

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="skeleton-text-block skeleton-text-block-h4">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <h4>Lorem ipsum voluptate eiusmod velit excepteur quis ullamco.</h4>
        </div>
    </div>
</div>

```html
<div class="skeleton-text-block skeleton-text-block-h4">
    <div class="skeleton"></div>
    <div class="skeleton"></div>
</div>
```

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="skeleton-text-block skeleton-text-block-h5">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <h5>Lorem ipsum voluptate eiusmod velit excepteur quis ullamco.</h5>
        </div>
    </div>
</div>

```html
<div class="skeleton-text-block skeleton-text-block-h5">
    <div class="skeleton"></div>
    <div class="skeleton"></div>
</div>
```

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="skeleton-text-block skeleton-text-block-h6">
                 <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <h6>Eu cupidatat cupidatat ut consequat non cupidatat qui irure magna sunt ullamco eu non consectetur.</h6>
        </div>
    </div>
</div>

```html
<div class="skeleton-text-block skeleton-text-block-h6">
    <div class="skeleton"></div>
    <div class="skeleton"></div>
</div>
```

To align skeleton text to the right, add the `text-right` modifier to the wrapping element

<div class="code-content-example">
    <div class="row">
        <div class="col col-6 gutter-xxs gutter-r">
            <div class="skeleton-text-block skeleton-text-block-h3 text-right">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
            <div class="skeleton-text-block text-right">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
            <div class="skeleton-text-block skeleton-text-block-h4 text-right">
                <div class="skeleton"></div>
            </div>
            <div class="skeleton-text-block text-right">
                <div class="skeleton"></div>
                <div class="skeleton"></div>
            </div>
        </div>
        <div class="col col-6 gutter-xxs gutter-l">
            <h3>In culpa voluptate laboris adipisicing.</h3>
            <p>In sed do incididunt labore magna elit ut consectetur do laborum ullamco do adipisicing mollit occaecat ad.</p>
            <h4>Enim veniam voluptate sunt non.</h4>
            <p>Incididunt amet nostrud in dolor aliquip in officia do ut duis incididunt ex ut.</p>
        </div>
    </div>
</div>

```html
<div class="skeleton-text-block skeleton-text-block-h3 text-right">
    <div class="skeleton"></div>
</div>
<div class="skeleton-text-block text-right">
    <div class="skeleton"></div>
</div>
<div class="skeleton-text-block skeleton-text-block-h4 text-right">
    <div class="skeleton"></div>
</div>
<div class="skeleton-text-block text-right">
    <div class="skeleton"></div>
</div>
```
--- 

### Variant Examples

Try the example below create a few skeletons

<div class="code-content-example">
    <div class="col col-12 col-md-6 center-horizontal">
        <div class="row pole-sm pole-s">
            <div class="card raised-1 card-skeleton-example" style="min-height: 100px;">
                <div class="pad-20 js-skeleton-card">
                </div>
            </div>
        </div>
        <form class="js-skeleton-form">
            <div class="flex-row-fluid pole-xs pole-s">
                <div class="col gutter-xxs gutter-r">
                    <div class="form-field row">
                        <select name="count" id="count">
                            <option value="1" selected>1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                        <label for="select">Count</label>
                    </div>
                </div>
                <div class="col">
                    <div class="form-field row">
                        <select name="variant" id="variant">
                            <option value="block" selected>block</option>
                            <option value="text">text</option>
                            <option value="btn">btn</option>
                            <option value="input">input</option>
                            <option value="circle">circle</option>
                            <option value="h1">h1</option>
                            <option value="h2">h2</option>
                            <option value="h3">h3</option>
                            <option value="h4">h4</option>
                            <option value="h5">h5</option>
                            <option value="h6">h6</option>
                        </select>
                        <label for="select">Variant</label>
                    </div>
                </div>
                <div class="col gutter-xxs gutter-l">
                    <div class="form-field row">
                        <select name="style" id="style">
                            <option value="rounded" selected>rounded</option>
                            <option value="wave" >wave</option>
                        </select>
                        <label for="select">Style</label>
                    </div>
                </div>                
            </div>
            <div class="row pole-xs pole-s">
                <div class="form-field row">
                    <select name="textblock" id="textblock">
                        <option value="" selected>None</option>
                        <option value="text-block">text-block</option>
                        <option value="block-h1">block-h1</option>
                        <option value="block-h2">block-h2</option>
                        <option value="block-h3">block-h3</option>
                        <option value="block-h4">block-h4</option>
                        <option value="block-h5">block-h5</option>
                        <option value="block-h6">block-h6</option>
                    </select>
                    <label for="textblock">Text Blocks</label>
                </div>
            </div>
            <div class="row">
                <div class="col col-6 gutter-md-xs gutter-md-r">
                    <button class="btn btn-primary btn-block js-insert-skeletons">Insert Skeletons</button>
                </div>
                <div class="col col-6 gutter-md-xs gutter-md-l">
                    <button class="btn btn-block js-destroy-skeletons">Destroy Skeletons</button>
                </div>
            </div>
        </form>
    </div>
</div>

<script type="text/javascript">
const sandbox = function()
{
    /* Helpers */
    const [$, add_event_listener, form_values, each, has_class, add_class, remove_class] = FrontBx.import(['$', 'add_event_listener', 'form_values', 'each', 'has_class', 'add_class', 'remove_class']).from('_');

    // Instantiate validator and cache vars
    const DOMElementform    = $('.js-skeleton-form');
    const DOMElementCard    = $('.js-skeleton-card');
    const DOMElementInsert  = $('.js-insert-skeletons', DOMElementform);
    const DOMElementDestroy = $('.js-destroy-skeletons', DOMElementform);
    var skeletons           = [];

    add_event_listener(DOMElementInsert, 'click', function(e)
    {
        // Stop the form from submitting via POST
        e = e || window.event;

        e.preventDefault();

        if (has_class(DOMElementDestroy, 'active')) return;

        let form    = form_values(DOMElementform);
        let height  = form.variant === 'block' ? '100px' : null;
        let options = { count: form.count, height: height, variant: `${form.style} ${form.variant} ${form.textblock}`.trim() };
        
        skeletons.push(FrontBx.Skeleton(DOMElementCard, options));
    });

    add_event_listener(DOMElementDestroy, 'click', function(e)
    {
        // Stop the form from submitting via POST
        e = e || window.event;

        e.preventDefault();

        if (has_class(DOMElementDestroy, 'active')) return;

        add_class(DOMElementDestroy, 'active');

        each(skeletons, (i, skeleton) => skeleton.fade_out(() => remove_class(DOMElementDestroy, 'active')));
    });
};

window.addEventListener('FrontBx:ready', sandbox);

</script>

### JavaScript Utility

FrontBx comes with a handy JavaScript utility component for creating skeletons on the fly. You can create a skeleton by calling `Skeleton` via the container.

#### Usage

```javascript
const skeleton = FrontBx.Skeleton(DOMElement, options);
```

The component will build the skeleton(s) with the supplied options and append them to the the `DOMElement`.

Once you have created a `Skeleton` instance, you can destroy it via the `destroy` method. The skeleton(s) will be removed from the `DOMElement` wrapper.

```javascript
skeleton.destroy();
```

If you want to fade out skeletons before destroying use the `fade_out` method. An optional callback can be supplied once the animation completes:

```javascript
skeleton.fade_out(callback);
```

If you only want the skeleton(s) to fade out and want to destroy them manually, add a second argument as `false`:

```javascript
skeleton.fade_out(callback, false);
```

#### Options

The table below outlines the available options:

| Option        | Type      | Default | Values                                                                                                                                                              |
|---------------|-----------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `count`       | `integer` | `1`     | Number of skeletons to generate.                                                                                                                                    |
| `lines`       | `integer` | `1`     | Optional value number of lines for **Text Block** variants.                                                                                                         |
| `variant`     | `string`  | `block` | `block` `text` `btn` `input` `circle` `wave` `rounded` `h1` `h2` `h3` `h4` `h5` `h6` `text-block` `block-h1` `block-h2` `block-h3` `block-h4` `block-h5` `block-h6` |
| `width`       | `string`  | `null`  | Any CSS width value                                                                                                                                                 |
| `height`      | `string`  | `null`  | Any CSS height value                                                                                                                                                |
| `aspectratio` | `string`  | `null`  | If provided will make skeleton width responsive while retaining aspect ratio. Value should be provided as `w/h` e.g `16/9`.                                         |

Multi-variant values should be supplied as a single string separated by spaces. e.g for a wave block skeleton with rounded corners you would supply `block wave rounded` as the `variant` value.

```javascript
const options  = {
    count: 5,
    variant: 'block wave rounded',
    width: '100%',
    height: '60px'
};

const skeleton = FrontBx.Skeleton(DOMElement, options);
```

When creating a multi-line text-block variant (`text-block` `block-h1` `block-h2` `block-h3` `block-h4` `block-h5` `block-h6`), any other options apart from `count` or `lines` will be ignored.

There are no modifier options for these skeletons. Additionally, the JS component will set a random width on each skeleton to give a natural text paragraph look.

```javascript
const options  = {
    lines: 3,
    variant: 'text-block',
};

const skeleton = FrontBx.Skeleton(DOMElement, options);
```

You can also provide options as an array to add multiple skeletons to single container element:

```javascript
const options = [
    { lines: 2, variant: 'h3-block' },
    { lines: 6, variant: 'text-block' },
];

const skeleton = FrontBx.Skeleton(DOMElement, options);
```

Or if you need more control to a layout you can provide an optional child `selector` key for each variant-set. The skeleton will get inserted into the the selector element rather than the parent wrapper element.

```javascript
const options = [
    { selector: '.js-heading', lines: 2, variant: 'h3-block'},
    { selector: '.js-text', lines: 6, variant: 'text-block' },
];
const skeleton = FrontBx.Skeleton(DOMElement, options);
```

#### Loading Content

Once you have reference to a `Skeleton` instance, you can gracefully load your own content in via the `load` method.

The method accepts both html as a `string` or an `HTMLDomElement` node with an optional callback when the animation completes.

```javascript
let content = '<div>...</div>';

const callback = () => console.log('Complete!');

skeleton.load(content, callback);
```

When calling `load` on a multi-instance Skeleton, provide an object with the selector as key to replace the content:

```javascript
let content =
{
    '.title' : '<div>...</div>',
    '.text'  : '<p>...</p>',
    '.image' :  document.createElement('IMG'),
};

skeleton.load(content);
```

The example below shows swapping out the contents of card component. Click the `Load content` button to try it out.

<div class="code-content-example">
    <div class="flex-row align-cols-center-x">
        <div class="card col col-lg-4 js-skeleton-loader-card">
            <div class="card-header">
                <div class="card-header-left js-card-header-left">
                </div>
                <div class="card-header-content js-card-header-content">
                </div>
            </div>
            <div class="card-media js-card-media">
            </div>
            <div class="card-block">
                <div class="js-card-title"></div>
                <div class="js-card-text"></div>
            </div>
        </div>
    </div> 
    <div class="flex-row align-cols-center col-gaps-xs pole-xs pole-n">
        <button class=" btn btn-primary js-load-content">Load content</button>
        <button class=" btn js-reset-skeletons">Reset</button>
    </div>
</div>

```JavaScript
const [find]       = FrontBx.import(['find']).from('_');
const cardWrapper  = find('.js-skeleton-loader-card');
const options      = 
{
    '.js-card-header-left' : '<div class="avatar"><img ... /></div>',
    '.js-card-header-content' : '<div class="text-bold">...</div>',
    '.js-card-media' : '<img ... />',
    '.js-card-title' : '<h5>...</h5>',
    '.js-card-text' : '<p>...</p>',
};

FrontBx.Skeleton(cardWrapper).load(options);
```

<script type="text/javascript">
(function()
{
    const loader = function()
    {
        /* Helpers */
        const [$, each] = FrontBx.import(['$', 'each']).from('_');
        const [cardWrapper, triggerLoad, triggerReset] = [$('.js-skeleton-loader-card'), $('.js-load-content'), $('.js-reset-skeletons')];
        const contents  = 
        {
            '.js-card-header-left' : '<div class="avatar"><img class="img-responsive js-lazyload lazyload grayscale lazy-loaded" src="../../../dist/img/trump-avatar.jpg"></div>',
            '.js-card-header-content' : '<div class="text-bold">The Don</div><div class="color-gray font-italic">Make America Great Again</div>',
            '.js-card-media' : '<img data-src="../../../dist/img/trump-hero.jpg" class="img-responsive js-lazyload lazyload grayscale" src="../../../dist/img/trump-hero_thumb.jpg" />',
            '.js-card-title' : '<h5 class="text-bold">MAGA Country</h5>',
            '.js-card-text' : '<p>Veniam laboris do sit sunt dolore incididunt fugiat id enim ut ullamco enim deserunt fugiat.</p>',
        };
        
        let options =
        [
            { selector: '.js-card-header-left', variant: 'circle wave', width: '40px',height: '40px'},
            { selector: '.js-card-header-content', variant: 'text-block', lines: 2},
            { selector: '.js-card-media', variant: 'block wave', aspectratio: '16/9'},
            { selector: '.js-card-title', variant: 'h5'},
            { selector: '.js-card-text', variant: 'text-block', lines: 3},
        ];

        var skeletons = [];
        var loaded    = false;
        var skeleton;

        const makeSkeletons = () =>
        {            
            each(options, (i, option) => $(option.selector, cardWrapper).innerHTML = '' );

            skeleton = FrontBx.Skeleton(cardWrapper, options);
        };

        triggerLoad.addEventListener('click', () =>
        {
            if (loaded) return;

            skeleton.load(contents);

            FrontBx.dom().refresh('LazyLoad', cardWrapper);

            loaded = true;
        });

        triggerReset.addEventListener('click', () =>
        {
            loaded = false;

            makeSkeletons();
        });
        
        makeSkeletons();
    }

    window.addEventListener('FrontBx:ready', loader);
})();

</script>


---

### CSS Customization

Skeleton uses local CSS variables on all `.skeleton` for enhanced component customization and styling. The base values are used by the UI to create all the sizing. Values for the CSS variables are set via Sass, so pre-compilation customization is still supported too.

Customization via Sass can be made in the `src/scss/_config.scss` file in FrontBx's source.


```file-path
`src/scss/_config.scss`
```
```sass
$skeleton-bg-1:                 rgba(0, 0, 0, 0.2) !default;
$skeleton-bg-2:                 rgba(0, 0, 0, 0.4) !default;
$skeleton-text-radius:          var(--hb-border-radius) !default;
```

<br>

```file-path
src/scss/components/_skeleton.scss
```
```sass
--hb-skeleton-bg-1: #{$skeleton-bg-1};
--hb-skeleton-bg-2: #{$skeleton-bg-2};
--hb-bg-animation: #{1s ease-in-out infinite normal none running skeleton-pulse};
--hb-skeleton-width: 100%;
--hb-skeleton-height: 100%;
--hb-skeleton-radius: 0;
--hb-skeleton-margin: 0;
--hb-skeleton-display: inline-block;

display: var(--hb-skeleton-display);
width: var(--hb-skeleton-width);
height: var(--hb-skeleton-height);
border-radius: var(--hb-skeleton-radius);
animation: var(--hb-bg-animation);
background: var(--hb-skeleton-bg-1);
margin: var(--hb-skeleton-margin);
```

The example below shows customization using CSS Variables:

<div class="code-content-example">
    <style scoped>
        .skeleton-custom
        {
            --hb-skeleton-bg-1: var(--hb-theme-primary-300);
            --hb-skeleton-bg-2: var(--hb-theme-primary-600);
        }
    </style>
    <div class="row pole-xs pole-s">
        <div class="col col-12 col-md-4 center-horizontal">
            <div class="skeleton skeleton-custom skeleton-text"></div>
            <div class="skeleton skeleton-custom skeleton-circle"></div>
            <div class="skeleton skeleton-custom skeleton-wave skeleton-rounded" style="height: 130px;"></div>
        </div>
    </div>
</div>

```css
.skeleton
{
    --hb-skeleton-bg-1: var(--hb-theme-primary-300);
    --hb-skeleton-bg-2: var(--hb-theme-primary-600);
}
```