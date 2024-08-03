
<h1>Scrollbars</h1>
<p> Custom <code>JavaScript</code> enabled scrollbars will display consistently across all browsers, giving you Mac OS style scrollbars on any element. </p>
<hr>
<ul class="list-bullet">
<li>
    <a href="#" class="js-waypoint-trigger" data-waypoint-target="example" data-waypoint-speed="400">Basic example</a>
</li>
<li>
    <a href="#" class="js-waypoint-trigger" data-waypoint-target="styles" data-waypoint-speed="500">Styles</a>
</li>
<li>
    <a href="#" class="js-waypoint-trigger" data-waypoint-target="updates" data-waypoint-speed="600">Updates</a>
</li>
</ul>
<hr>
<div class="row roof-xs floor-xs" data-waypoint="example">
<h2>Basic example</h2>
<p> By default, the scrollbars will only be visible when the user hovers over the element or is scrolling on the element. You can change this behavior by adding the <code>.scrollbar-visible</code> classname to the wrapper element. </p>
<blockquote>
    <p> The <code>JavaScript</code> component will first check if the element has <code>overflow</code> (i.e the wrapper is not big enough to display its contents vertically). If the wrapper has no <code>overflow</code>, the scrollbars won't be created. </p>
</blockquote>
<p> To create an element with custom scrollbars, simply add the <code>.js-custom-scroll</code> classname to the wrapper. </p>


<div class="code-content-example">
    <div class="container-fuid">
        <div class="js-custom-scroll" style="height:200px;">
            <ul>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Consectetur adipiscing elit</li>
                <li>Sed do eiusmod tempor incididunt</li>
                <li>Ut labore et dolore magna aliqua</li>
                <li>Ut enim ad minim veniam
                    <ul>
                        <li>Consectetur adipiscing elit</li>
                        <li>Sed do eiusmod tempor incididunt</li>
                        <li>Ut labore et dolore magna aliqua</li>
                    </ul>
                </li>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Consectetur adipiscing elit</li>
            </ul>
        </div>
    </div>
</div> <pre class="highlight-wrap"><code class="js-highlight" data-syntax="html">
<!--
<div class="js-custom-scroll" style="height:200px;">
...
</div>
-->
</code></pre> </div>
<hr>
<div class="row roof-xs floor-xs" data-waypoint="styles">
<h2>Styles</h2>
<p> For elements with dark backgrounds, add the <code>.scroll-light</code> classname to the wrapper element to make the scrollbars light. </p>
<div class="code-content-example">
    <div class="container-fuid">
        <div class="js-custom-scroll scrollbar-visible scroll-light bg-black color-white" style="height:200px;">
            <ul>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Consectetur adipiscing elit</li>
                <li>Sed do eiusmod tempor incididunt</li>
                <li>Ut labore et dolore magna aliqua</li>
                <li>Ut enim ad minim veniam
                    <ul>
                        <li>Consectetur adipiscing elit</li>
                        <li>Sed do eiusmod tempor incididunt</li>
                        <li>Ut labore et dolore magna aliqua</li>
                    </ul>
                </li>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Consectetur adipiscing elit</li>
            </ul>
        </div>
    </div>
</div> <pre class="highlight-wrap"><code class="js-highlight" data-syntax="html">
<!--
<div class="js-custom-scroll scrollbar-visible scroll-light" style="height:200px;">
...
</div>
-->
</code></pre> </div>
<div class="row roof-xs floor-xs" data-waypoint="updates">
<h2>Updates</h2>
<p> The scrollbars are automatically updated whenever the browser is resized, maintaining the scroll position on the element. However if you add/remove content inside a scroll element, you will need to update the scroller manually. </p>
<div class="code-content-example">
    <div class="container-fuid">
        <div class="js-custom-scroll scrollbar-visible" style="height:200px;" id="scroll-example">
            <ul>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Consectetur adipiscing elit</li>
                <li>Sed do eiusmod tempor incididunt</li>
                <li>Ut labore et dolore magna aliqua</li>
                <li>Ut enim ad minim veniam
                    <ul>
                        <li>Consectetur adipiscing elit</li>
                        <li>Sed do eiusmod tempor incididunt</li>
                        <li>Ut labore et dolore magna aliqua</li>
                    </ul>
                </li>
                <li>Lorem ipsum dolor sit amet</li>
                <li>Consectetur adipiscing elit</li>
            </ul>
        </div>
        <button class="js-trigger-insert btn"> Insert more HTML </button>
        <button class="js-update-scroll btn btn-success"> Update Scroll </button>
        <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function()
        {
            document.querySelector('.js-trigger-insert').addEventListener('click', function()
            {
                Hubble.helper().$('#scroll-example ul').innerHTML += '<li>Ut labore et dolore magna aliqua</li>';
            });
        });
        </script>
        <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function()
        {
            document.querySelector('.js-update-scroll').addEventListener('click', function()
            {
                Hubble.Scrollbars().refresh(Hubble.helper().$('#scroll-example'));
            });
        });
        </script>
    </div>
</div> <pre class="highlight-wrap"><code class="js-highlight" data-syntax="js">
<!--
Hubble.Scrollbars().refresh( node );
-->
</code></pre> </div>
<hr> 