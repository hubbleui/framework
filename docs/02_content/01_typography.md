# Typography

Font sizing, padding, margins and line-heights are all set out using rem with a font-size: 62.5%; on the the HTML element. This gives a logical conversion rate on any element and provides consistent font sizing. Meaning 1.4rem = 14px

---

*   [Headings](#headings)
*   [Body copy](#body-copy)
*   [Inline Elements](#inline-elements)
*   [Blockquotes](#blockquotes)
*   [Lists](#lists)
*   [Code](#code)
*   [Address](#address)

---

### Headings

All HTML headings, `<h1>` through `<h6>` are available natively or explicitly via `.h1` to `.h6` for when you want to match the font styling of a heading but still want your text to be displayed inline.

<div class="code-content-example">
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <h6>Heading 6</h6>
</div>

```html
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<h6>Heading 6</h6>
```

### Body copy

The default FrontBx font size is `1.45rem` (14.5px) with a line height of `1.8`. This is applied to the body as well as paragraph tags. Additionally paragraph tags have a bottom margin of `1rem`.

<div class="code-content-example">
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
    <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>

```html
<p>...</p>
```
In addition to standard paragraph tags, FrontBx has added `.p1` through `.p6` classes for text emphasis.

<div class="code-content-example">
    <p class="p1">Paragraph 1</p>
    <p class="p2">Paragraph 2</p>
    <p class="p3">Paragraph 3</p>
    <p class="p4">Paragraph 4</p>
    <p class="p5">Paragraph 5</p>
    <p class="p6">Paragraph 6</p>
</div>

```html
<p class="p1">Paragraph 1</p>
<p class="p2">Paragraph 2</p>
<p class="p3">Paragraph 3</p>
<p class="p4">Paragraph 4</p>
<p class="p5">Paragraph 5</p>
<p class="p6">Paragraph 6</p>
```

--- 

### Inline elements

In-line text elements have some very minimal styling applied to ensure they display consistently.

<div class="code-content-example">
    <p>
        <mark>Lorem ipsum dolor sit amet consectetur adipiscing elit</mark>
        <br>
        <del>Lorem ipsum dolor sit amet consectetur adipiscing elit</del>
        <br>
        <s>Lorem ipsum dolor sit amet consectetur adipiscing elit</s>
        <br>
        <ins>Lorem ipsum dolor sit amet consectetur adipiscing elit</ins>
        <br>
        <u>Lorem ipsum dolor sit amet consectetur adipiscing elit</u>
        <br>
        <small>Lorem ipsum dolor sit amet consectetur adipiscing elit</small>
        <br>
        <strong>Lorem ipsum dolor sit amet consectetur adipiscing elit</strong>
        <br>
        <em>Lorem ipsum dolor sit amet consectetur adipiscing elit</em>
        <br>
        <u>Lorem ipsum dolor sit amet consectetur adipiscing elit</u>
        <br>
    </p>
</div>

```html
<mark>...</mark>
<del>...</del>
<s>...</s>
<ins>...</ins>
<u>...</u>
<small>...</small>
<strong>...</strong>
<em>...</em>
<u>...</u>
```

---

### Blockquotes

Blockquotes have some very basic styling applied, but stylized versions are available via contextual classes `bq-*`.

<div class="code-content-example">
    <blockquote>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    </blockquote>
    <blockquote class="bq-info">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    </blockquote>
    <blockquote class="bq-success">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    </blockquote>
    <blockquote class="bq-warning">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    </blockquote>
    <blockquote class="bq-danger">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
    </blockquote>
</div>

```html
<blockquote><p>...</p></blockquote>
<blockquote class="bq-info"><p>...</p></blockquote>
<blockquote class="bq-success"><p>...</p></blockquote>
<blockquote class="bq-warning"><p>...</p></blockquote>
<blockquote class="bq-danger"><p>...</p></blockquote>
```

Add a `<footer>` for identifying the source. Wrap the name of the source work in `<cite>`.

<div class="code-content-example">
    <blockquote>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
        <footer>Someone famous in
            <cite title="Source Title">Source Title</cite>
        </footer>
    </blockquote>
</div>

```html
<blockquote>
    <p>...</p>
    <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
</blockquote>
```

---

### Lists

Some rudimentary list styling allows you to display consistent, simple and attractive looking lists with ease

<br>

#### Unordered

A list of items in which the order does not explicitly matter.

<div class="code-content-example">
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

```html
<ul>
    <li>...</li>
</ul>
```

<br>

#### Ordered

A list of items in which the order does explicitly matter.

<div class="code-content-example">
    <ol>
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
    </ol>
</div>

```html
<ol>
    <li>...</li>
</ol>
```

<br>

#### Inline

Use `.list-inline` to place all list items on a single line and some light padding.

<div class="code-content-example">
    <ul class="list-inline">
        <li>Lorem ipsum dolor sit amet</li>
        <li>Consectetur adipiscing elit</li>
        <li>Sed do eiusmod tempor incididunt</li>
    </ul>
</div>

```html
<ul class="list-inline">
    <li>...</li>
</ul>
```

<br>

#### Unstyled

Strip list styles from a list, no padding or margins.

<div class="code-content-example">
    <ul class="list-unstyled">
        <li>Lorem ipsum dolor sit amet</li>
        <li>Consectetur adipiscing elit</li>
        <li>Sed do eiusmod tempor incididunt</li>
    </ul>
</div>

```html
<ul class="list-unstyled">
    <li>...</li>
</ul>
```

<br>

#### Description

A list of terms with their associated descriptions.

<div class="code-content-example">
    <dl>
        <dt>Lorem ipsum dolor sit amet</dt>
        <dd>Sed do eiusmod tempor incididunt consectetur adipiscing elit.</dd>
        <dt>Lorem ipsum dolor sit amet</dt>
        <dd>Sed do eiusmod tempor incididunt consectetur adipiscing elit.</dd>
        <dt>Lorem ipsum dolor sit amet</dt>
        <dd>Sed do eiusmod tempor incididunt consectetur adipiscing elit.</dd>
    </dl>
</div>

```html
<dl>
    <dt>...</dt>
    <dd>...</dd>
</dl>
```

<br>

#### Horizontal description

Make terms and descriptions line up side-by-side.

<div class="code-content-example">
    <dl class="dl-horizontal">
        <dt>Lorem ipsum dolor sit amet</dt>
        <dd>Sed do eiusmod tempor incididunt consectetur adipiscing elit.</dd>
        <dt>Lorem ipsum dolor sit amet</dt>
        <dd>Sed do eiusmod tempor incididunt consectetur adipiscing elit.</dd>
        <dt>Lorem ipsum dolor sit amet</dt>
        <dd>Sed do eiusmod tempor incididunt consectetur adipiscing elit.</dd>
    </dl>
</div>

```html
<dl class="dl-horizontal">
    <dt>...</dt>
    <dd>...</dd>
</dl>
```

---

### Code

Wrap inline snippets of code with `<code>`

<div class="code-content-example">
    <p>So you can wrap this `.class-name` in a `&lt;code&gt;` tag.</p>
</div>

```html
<p>...<code>...</code>...</p>
```

<br>

#### Code blocks

Use a `<pre>` tag for snippets spanning multiple lines. You can also wrap a `<code>` tag inside a `<pre>` tag.


<div class="code-content-example">
    <pre>
.foo
{
    color: red;
}
    </pre>
</div>

```html
<pre>...</pre>
```

--- 

### Address

Present contact information for the nearest ancestor or the entire body of work. Preserve formatting by ending all lines with `<br>`.

<div class="code-content-example">
    <address>
        <strong>Twitter, Inc.</strong><br>
        1355 Market Street, Suite 900<br>
        San Francisco, CA 94103<br>
        <abbr title="Phone">P:</abbr> (123) 456-7890
    </address>
    <address>
        <strong>Full Name</strong><br>
        <a href="mailto:#">first.last@example.com</a>
    </address>
</div>


```html
<address>
    <strong>Twitter, Inc.</strong><br>
    1355 Market Street, Suite 900<br>
    San Francisco, CA 94103<br>
    <abbr title="Phone">P:</abbr> (123) 456-7890
</address>
<address>
    <strong>Full Name</strong><br>
    <a href="mailto:#">first.last@example.com</a>
</address>
```

