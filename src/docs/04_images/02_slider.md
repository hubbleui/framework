# Slider

Hubble's slider component uses an open source library called [flickity.js](http://flickity.metafizzy.co/index.html). The library uses a combination `JavaScript` and `CSS` to produce cross-browser, responsive, mobile and touch enabled carousels.            

> Slider is a large JS component so has been split from Hubble's core. To enable Gallery add `slider.js` file after your `hubble.js` file.

> This documentation only shows some very simple usage examples. For more in-depth documentation please see the [flickity.js](#http://flickity.metafizzy.co/index.html) website.

---

---


### Basic example
Carousels can be enabled through `HTML` markup rather than manually via `JavaScript`. The options are stored as `JSON` in the `data-flickity` attribute. 
Here's a very simple example.

<div class="code-content-example">
    <div class="slider js-slider" data-options='{ "wrap": true }'>
        <div class="bg-salmon">1</div>
        <div class="bg-teal">2</div>
        <div class="bg-bb-blue">3</div>
        <div class="bg-salmon">4</div>
        <div class="bg-teal">5</div>
        <div class="bg-bb-blue">6</div>
        <div class="bg-salmon">7</div>
        <div class="bg-teal">8</div>
        <div class="bg-bb-blue">9</div>
    </div>
</div>

```html
<div class="slider js-slider" data-options='{ "wrapAround": true }'>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
</div>
```

---

### Initialization

There are two ways to initialize Flickity. 

#### Initialize with JavaScript

To retrieve the Flickity object, simply call it from the via the container with `Container.Flickity();`. The constructor accepts two arguments: the carousel element and an options object.

```html
var elem = document.querySelector('.main-carousel');
var flkty = Container.Flickity( elem,
{
  // options
  cellAlign: 'left',
  contain: true
});
// element argument can be a selector string
//   for an individual element
var flkty = Container.Flickity( '.main-carousel',
{
  // options
  cellAlign: 'left',
  contain: true
});
```

                            <br>
### Initialize with HTML

You can initialize Flickity in HTML, without writing any JavaScript. Add data-flickity attribute to the carousel element. Options can be set in its value.  

```html
<div data-flickity='{ "cellAlign": "left", "contain": true }'>

```

<br>
                            
> Options set in HTML must be valid `JSON`. Keys need to be quoted, for example `"cellAlign":`. Note that the attribute value uses single quotes `'`, but the JSON entities use double-quotes `"`. 

### Styling

To provide as much customization as possible, Flickity provides only the styles necessary for the carousel to function. All sizing and styling of the cells are handled by your own CSS. The height of the carousel is set to the maximum height of the cells. 

<div class="code-content-example">
    <div class="slider">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
</div>

```html
.carousel-cell {
  width: 100%; /* full width */
  height: 160px; /* height of carousel */
  margin-right: 10px;
}
```

                            <div class="code-content-example">
                                <div class="carousel carousel-half" data-flickity>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div> 
```html
.carousel-cell {
  width: 50%; /* half-width */
  height: 160px;
  margin-right: 10px;
}
```
