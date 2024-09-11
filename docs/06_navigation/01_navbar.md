# Navbar

Navbar allows to create a simple top-navigation bar through simple HTML markup.

---

*   [Markup](#markup)
*   [Variants](#variants)

---


### Markup

The base `.navbar` component provides a strong foundation for building all types of navigation components and can be combined with other components to create simple or complex navigation menus.

<div class="code-content-example">
    
</div>

```html
<ul class="tab-nav js-tab-nav">
    <li><a href="#" class="active" data-tab="panel-1">Tab 1</a></li>
    <li><a href="#" data-tab="panel-2">Tab 2</a></li>
    <li><a href="#" data-tab="panel-3">Tab 3</a></li>
</ul>
```

---

### Variants

Tabs come in with a handy pre-styled second variant - `.tab-border`. Add this for more traditional styled tabs

<div class="code-content-example">
    <ul class="tab-nav tab-border js-tab-nav">
        <li>
            <a href="#" class="active" data-tab="panel-1">Tab 1</a>
        </li>
        <li>
            <a href="#" data-tab="panel-2">Tab 2</a>
        </li>
        <li>
            <a href="#" data-tab="panel-3">Tab 3</a>
        </li>
    </ul>
</div>

```html
<ul class="tab-nav tab-border js-tab-nav">
    <li>
        <a href="#" class="active" data-tab="panel-1">Tab 1</a>
    </li>
    <li>
        <a href="#" data-tab="panel-2">Tab 2</a>
    </li>
    <li>
        <a href="#" data-tab="panel-3">Tab 3</a>
    </li>
</ul>
```

Add the `.tab-centered` class to center the navigation:

<div class="code-content-example">
    <ul class="tab-nav tab-centered js-tab-nav">
        <li>
            <a href="#" class="active" data-tab="panel-1">Tab 1</a>
        </li>
        <li>
            <a href="#" data-tab="panel-2">Tab 2</a>
        </li>
        <li>
            <a href="#" data-tab="panel-3">Tab 3</a>
        </li>
    </ul>
</div> 

```html
<ul class="tab-nav tab-centered js-tab-nav">
    <li>
        <a href="#" class="active" data-tab="panel-1">Tab 1</a>
    </li>
    <li>
        <a href="#" data-tab="panel-2">Tab 2</a>
    </li>
    <li>
        <a href="#" data-tab="panel-3">Tab 3</a>
    </li>
</ul>
```

Because styling and JavaScript functionality of tabs are split with `.js-` classes, you can use other FrontBx components to create your own styled tabs:

Here is an example FrontBx's `.btn` for the navigation:

<div class="code-content-example">
    <div class="flex-row-fluid col-gaps-xs align-cols-center js-tab-nav" data-active-class="btn-primary">
        <button type="button" class="btn btn-primary" data-tab="panel-1">Tab 1</button>
        <button type="button" class="btn" data-tab="panel-2">Tab 2</button>
        <button type="button" class="btn" data-tab="panel-3">Tab 3</button>
    </div>
</div>

```html
<div class="flex-row-fluid col-gaps-xs align-cols-center js-tab-nav" data-active-class="btn-primary">
    <button type="button" class="btn active btn-primary" data-tab="panel-1">Tab 1</button>
    <button type="button" class="btn" data-tab="panel-2">Tab 2</button>
    <button type="button" class="btn" data-tab="panel-3">Tab 3</button>
</div>
```

Here's another example using FrontBx `.chip` components:

<div class="code-content-example">
    <ul class="list-unstyled js-tab-nav" data-active-class="selected">
        <li>
            <button type="button" class="btn btn-chip selected" data-tab="panel-1">
                <span class="chip-text">Tab 1</span>
            </button>
        </li>
        <li>
            <button type="button" class="btn btn-chip" data-tab="panel-2">
                <span class="chip-text">Tab 2</span>
            </button>
        </li>
        <li>
            <button type="button" class="btn btn-chip" data-tab="panel-3">
                <span class="chip-text">Tab 3</span>
            </button>
        </li>
    </ul>
</div>

```html
<ul class="list-unstyled js-tab-nav">
    <li>
        <span class="chip active" data-tab="panel-1">
            <span class="chip-text">Tab 1</span>
        </span>
    </li>
    <li>
        <span class="chip" data-tab="panel-2">
            <span class="chip-text">Tab 2</span>
        </span>
    </li>
    <li>
        <span class="chip" data-tab="panel-3">
            <span class="chip-text">Tab 3</span>
        </span>
    </li>
</ul>
```



