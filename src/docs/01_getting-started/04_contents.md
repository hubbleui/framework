Hubble is downloadable in two forms, within which you'll find the following directories and files, logically grouping common resources and providing both compiled and minified variations.

Precompiled Hubble
Hubble source code
Compiling with Grunt
Configuration
jQuery NOT required!

Please note that no JavaScript components require jQuery to be included. All JavaScript is written in Vanilla and dependency free!

Precompiled Hubble
Once downloaded, unzip the compressed folder to see the structure of (compiled) Hubble. You'll see something like this:


hubble/
├── css/
│   ├── hubble.css
│   ├── hubble.css.map
│   ├── hubble.css
│   ├── hubble.css.map
│   ├── hubble-theme.css
│   ├── hubble-theme.css.map
│   ├── hubble-docs.css
│   └── hubble-docs.css.map
├── js/
│   ├── hubble.js
│   ├── hubble.js
│   ├── hubble-theme.js
│   └── hubble-theme.js
└── fonts/
    ├── fontawesome-webfont.eot
    ├── fontawesome-webfont.svg
    ├── fontawesome-webfont.ttf
    ├── fontawesome-webfont.woff
    ├── fontawesome-webfont.woff2
    └── fontawesome-webfont.otf
This is the most basic form of Hubble: precompiled files for quick drop-in usage in nearly any web project. We provide compiled CSS and JS (hubble.*), as well as compiled and minified CSS and JS (hubble.*). CSS source maps (hubble.*.map) are available for use with certain browsers' developer tools. Fonts from FontAwesome are included, as is the optional Hubble theme.

Hubble source code
The Hubble source code download includes the precompiled CSS, JavaScript, and font assets, along with source Sass, JavaScript, and documentation. More specifically, it includes the following and more:

Hubble uses Grunt to compile. If you're unfamiliar with Grunt you should head over to they're website to get an understanding of how it works as well as read through they're documentation.

A Hubble project has the following setup:


Hubble
├── Gruntfile.js
├── package.json
├── src
│   ├── hubble
│   │   ├── js
│   │   └── scss
│   │ 
│   └── theme
│       ├── js
│       └── scss
│
└── build
    ├── css
    ├── js
    └── fonts
This is just the basic directory structure, there are many more files and directory within the project. To familiarize yourself with more detail on specific files, please explore the codebase and read this documentation from start to finish.

The src directory holds all the pre-compiled Sass and JavaScript. When Grunt runs, the JavaScript and CSS is compiled into the build directory. The build directory serves as your assets directory in a typical front-end project setup.


Hubble
└── build
    ├── css
    │   ├── hubble.css
    │   ├── hubble.css
    │   ├── theme.css
    │   └── docs.css
    ├── js
    │    ├── hubble.js
    │    ├── hubble.js
    │    ├── theme.js
    │    └── theme.js
    └── fonts
        └── fonts...
Compiling with Grunt
Node.js
If you don't have Node.js installed on your system, head over to nodejs.org and install it as per the Node.js documentation.

Sass
If you don't have Sass installed on your system, head over to sass-lang.com and install it as per the Sass documentation.

Grunt
If you don't have Grunt installed on your system, head over to gruntjs.com and install it as per the Grunt documentation.

Once you have the prerequisites above, to get started with your project download the latest Hubble source code, unzip the package and drop the contents into your project folder.

Change to the project's root directory.
Install project dependencies with npm install.
Run Grunt with grunt or grunt watch.
Configuration
Font sizing, padding, margins and line-heights are all set out using rem with a font-size: 62.5%; on the the HTML element. This gives a logical conversion rate on any element and provides consistent font sizing. Meaning 1.4rem = 14px

All the Sass configuration can be found in the hubble/src/scss/_config.scss. This file serves as the projects styling configuration file and sets all variables such as colors, font-sizes, margins etc...