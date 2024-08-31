# Introduction

Get FrontBx started with production-ready drop-in JS and CSS and quick-start any project.

---

*   [Welcome](#welcome)
*   [Quickstart](#quickstart)
    *   [CSS](#css)
      *   [Icons](#icons)
    *   [JavaScript](#javascript)
        *   [Bundle](#bundle)
        *   [Lazyload](#lazyload)
*   [Boilerplate](#boilerplate)
*   [Next Steps](#next-steps)

---

### Welcome

FrontBx is a modular `CSS` and `JavaScript` front-end framework built with `Sass` and vanilla `JavaScript`. FrontBx is designed so that you can use it as a starting point for any sized project from a tiny landing page to a giant web app.

One of the main purposes of FrontBx is to save you time while building beautiful web pages with ease. FrontBx is is a medium to large front-end framework. It has everything you need to start your next project.

If you are new to FrontBx, it's recommended you read this documentation from start to finish. It's also highly advisable to spend some time reading through the **Getting Started** section to learn the library architecture and how to use it on a broad level, rather than jumping straight into a component.

---

### Quickstart

Get started by including FrontBx's production-ready CSS and JavaScript via CDN without the need for any build steps. If you're using a package manager or wanting to start a custom build - [Head to the Downloads page](../download/index.html).


#### CSS

Copy-paste the stylesheet `<link>` into your `<head>` before all other stylesheets to load FrontBx's CSS.

```html
<link href="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/css/frontbx.bundle.min.css" rel="stylesheet" crossorigin="anonymous">
```

##### Icons

FrontBx uses [FontAwesome](https://fontawesome.com/) for icons which are included in `frontbx.bundle.min.css`. However if you prefer to have them loaded separately or don't need them, you can use `frontbx.min.css` which excludes icons and `frontbx-icons.min.css` which is the standalone icon CSS.

```html
<link href="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/css/frontbx.min.css" rel="stylesheet" crossorigin="anonymous">
<link href="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/css/frontbx-icons.min.css" rel="stylesheet" crossorigin="anonymous">
```

Additionally, icons be configured to be loaded locally (hosted on your own server) **OR** externally via a jsdelivr. By default, icons are set to be hosted locally and are stored in the `dist/fonts` directory. If you want to load them externally you can change this configuration in `src/scss/_config.scss` and run `npm run dist` or when running your own webpack build.

```scss
$local-icons: 'true' !default;
$icons-url:   '../fonts/' !default;
```

```scss
@import "~frontbx/scss/frontbx.bundle";

$local-icons: 'true';
$icons-url:   '/path-to-fonts/';
```

> For more info on running a FrontBx Build [see the Build Tools page](../build-tools/index.html)

#### JavaScript

Many of FrontBx components require the use of `JavaScript` to function. FrontBx's JS is Component based with an inversion control system to manage it's own dependencies. Place the following `<script>` near the end of your pages, right before the closing `</body>` tag, to enable them.


##### Bundle

Include all FrontBx JavaScript Components and dependencies with FrontBx's bundled JS. For more information about what's included in FrontBx - see our [contents section](../contents/index.html).

```html
<script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/frontbx.bundle.min.js" crossorigin="anonymous"></script>
```

##### Lazyload

Image lazy loading is included in `frontbx.bundle.min.js`, however for best performance, you should include this as a separate script in your document's `<head>`. This allows any lazyloaded images to start loading and rendering immediately - without having to wait for any other page dependencies to load.

For details on lazy loading images - [see the LazyLoad page](../../images/lazyload/index.html).

```html
<script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/frontbx-lazyload.min.js" crossorigin="anonymous"></script>
```



--- 

### Boilerplate

Below is a simple HTML5 Boilerplate to get up and running quickly with FrontBx.

```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- FrontBx CSS -->
    <link href="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/css/frontbx.min.css" rel="stylesheet" crossorigin="anonymous">

    <!-- FrontBx Lazyload JS -->
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/frontbx.lazyload.min.js" crossorigin="anonymous"></script>

    <title>Hello, world!</title>
  </head>
  <body>
    <h1>Hello, world!</h1>

    <!-- Optional JavaScript; choose one of the two! -->

    <!-- Option 1: FrontBx Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/frontbx.bundle.min.js" crossorigin="anonymous"></script>

    <!-- Option 2: Separate Components -->
    <!-- FrontBx Core
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/core.js" crossorigin="anonymous"></script>
    -->

    <!-- Utility Components 
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/ajax.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/pjax.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/formvalidator.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/inputmask.js" crossorigin="anonymous"></script>
    -->

    <!-- DOM Components
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/ripple.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/dropdown.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/tab.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/message.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/waypoint.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/drawer.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/modal.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/backdrop.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/frontdrop.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/notification.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/skeleton.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/slider.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/chips.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/collapse.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/gh/frontbx/ui@0.1.0/dist/js/components/list.js" crossorigin="anonymous"></script>
    -->

    <!-- Boot FrontBx
    <script type="text/javascript">FrontBx.boot();</script>
    -->
  </body>
</html>
```

---

### Next Steps

If you're not wanting to create a custom build, or do not require access to FrontBx's source, you can jump straight to the [Content Section](../../content/typography/index.html) to get started with familiarizing yourself with FrontBx.

Otherwise, head over the the [Installation Page](../installation/index.html) to get started on getting FrontBx installed.
