# Waypoints

Waypoints

Waypoints provide a convenient to automatically scroll to content on a page. They also provide the ability to land at a particular element on page load via the `URL` hash.

---

*   [Usage](#usage)
*   [Options](#options)

---

### Usage

To setup a click-to-scroll event, simply add the `.js-waypoint-trigger` class to a clickable element and provide the `id` of target element as the `data-waypoint-target` attribute. 

<div class="code-content-example">
    <button class="btn btn-primary js-waypoint-trigger" data-waypoint-target="scroll-target">Scroll To Content</button>
    <div id="scroll-target">
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
    </div>
</div>

```html
<div class="code-content-example">
    <button class="btn btn-primary js-waypoint-trigger" data-waypoint-target="scroll-target">Scroll To Content</button>
    <div id="scroll-target">
        ...
    </div>
</div>
```

Additionally, you can invoke smooth-scrolling to an element on page load by adding the class `.js-waypoint` to any element with an `id`. For example, `http://example.com#landhere` on page-load would scroll to the element. Try the example below:


<div class="code-content-example">
    <div id="landhere" class="js-waypoint">
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
    </div>
    <div class="row pole-xs pole-n">
        <button class="btn btn-primary" onclick="(function(){ window.scrollTo(0,0); window.location.hash = '#landhere'; window.location.reload(true);return false;})();">Reload page</button>
    </div>
</div>

```html
<div id="landhere" class="js-waypoint">
   ...
</div>
```

---

### Options

You can specify the the animation speed as well as the animation `easing` via HTML `data-` attributes on both the click-target and landing elements. The table below outlines possible options:


| Attribute                  | Example                            | Description                             |
|----------------------------|------------------------------------|-----------------------------------------|
| `data-waypoint-target`     | `data-waypoint-target="my-id"`     | Target element id.                      |
| `data-waypoint-speed`      | `data-waypoint-speed="1000"`       | Scroll animation speed in milliseconds. |
| `data-waypoint-easing`     | `data-waypoint-easing="easeInOut`  | Scroll animation easing in `camelCase`. |
| `data-waypoint-update-url` | `data-waypoint-update-url="false"` | Update the URL hash.                    |


