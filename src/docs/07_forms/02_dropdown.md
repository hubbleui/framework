# Dropdown

The Dropdown Menu component provides end users with a list of options on a temporary surface.

---

*   [Markup](#markup)
*   [Menu Items](#menu-items)
*   [States](#states)
*   [Positioning](#positioning)
*   [Dense Menu](#icon-menu)

---

### Markup

Basic drop down menus are a straight forward setup.

*   Create a wrapper element with the `.drop-container` class.
*   Nest any clickable element (usually `.btn`) with the `.js-drop-trigger` class.
*   Create the dropdown menu as the next sibling of the button as `.drop-menu > .drop > ul`.
                            
<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="drop-container">
            <button type="button" class="btn btn-default btn-dropdown js-drop-trigger">Dropdown trigger</button>
            <div class="drop-menu">
                <ul class="menu"> 
                    <li>Menu 1</li>
                    <li>Menu 2</li>
                    <li>Menu 3</li>
                </ul>
            </div>
        </div>
    </div>
</div>

---

### Menu items

Menu items have a few different options to provide additional content. To align content inside an item, wrap the main content in `.item-content` with left or right content in `.item-left` or `.item-right`:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="drop-container">
            <button type="button" class="btn btn-default btn-dropdown js-drop-trigger">Dropdown trigger</button>
            <div class="drop-menu">
                <ul class="menu"> 
                    <li>
                        <span class="item-left"><span class="fa fa-inbox color-gray-500"></span></span>
                        <span class="item-content">Inbox</span>
                        <span class="item-right"><span class="label">4</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-flag color-gray-500"></span></span>
                        <span class="item-content">Flagged</span>
                        <span class="item-right"><span class="label">23</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-note-sticky color-gray-500"></span></span>
                        <span class="item-content">Drafts</span>
                        <span class="item-right"><span class="label">3</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-paper-plane color-gray-500"></span></span>
                        <span class="item-content">Sent</span>
                        <span class="item-right"><span class="status status-xs"></span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-circle-minus color-gray-500"></span></span>
                        <span class="item-content">Junk</span>
                        <span class="item-right"><span class="status status-xs status-warning"></span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-trash color-gray-500"></span></span>
                        <span class="item-content">Trash</span>
                        <span class="item-right"><span class="status status-xs status-danger"></span></span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>

Use `.menu-divider` on an item to separate menu items or add `.menu-header` to the first item to give a menu a heading:

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center">
        <div class="drop-container">
            <button type="button" class="btn btn-default btn-dropdown js-drop-trigger">Dropdown trigger</button>
            <div class="drop-menu">
                <ul class="menu"> 
                    <li>
                        <span class="item-left"><span class="fa fa-inbox color-gray-500"></span></span>
                        <span class="item-content">Inbox</span>
                        <span class="item-right"><span class="label">4</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-flag color-gray-500"></span></span>
                        <span class="item-content">Flagged</span>
                        <span class="item-right"><span class="label">23</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-note-sticky color-gray-500"></span></span>
                        <span class="item-content">Drafts</span>
                        <span class="item-right"><span class="label">3</span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-paper-plane color-gray-500"></span></span>
                        <span class="item-content">Sent</span>
                        <span class="item-right"><span class="status status-xs"></span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-circle-minus color-gray-500"></span></span>
                        <span class="item-content">Junk</span>
                        <span class="item-right"><span class="status status-xs status-warning"></span></span>
                    </li>
                    <li>
                        <span class="item-left"><span class="fa fa-trash color-gray-500"></span></span>
                        <span class="item-content">Trash</span>
                        <span class="item-right"><span class="status status-xs status-danger"></span></span>
                    </li>
                    <li class="menu-divider"></li>
                    <li>
                        <span class="item-left"><span class="fa fa-ellipsis-vertical color-gray-500"></span></span>
                        <span class="item-content">More</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>




---

### Positioning

You can change the alignment of the dropdown to different directions by adding a directional class to the `.drop-menu` element. The directions are `.drop-s`, `.drop-se`, `.drop-sw`, `.drop-n`, `.drop-ne`, `.drop-nw`

<div class="code-content-example">
    <div class="flex-row-fluid align-cols-center col-gaps-xs row-gaps-xs">
        <div class="drop-container">
            <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-s </button>
            <div class="drop-menu drop-s">
                <div class="menu">
                    <ul class="menu">
                        <li class="drop-header">More</li>
                        <li>
                            <a href="#" title="">Menu 1</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 2</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 3</a>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <a href="#" title="">More 1</a>
                        </li>
                        <li>
                            <a href="#" title="">More 2</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-se </button>
            <div class="drop-menu drop-se">
                <div class="menu">
                    <ul class="menu">
                        <li class="drop-header">More</li>
                        <li>
                            <a href="#" title="">Menu 1</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 2</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 3</a>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <a href="#" title="">More 1</a>
                        </li>
                        <li>
                            <a href="#" title="">More 2</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-sw </button>
            <div class="drop-menu drop-sw">
                <div class="menu">
                    <ul class="menu">
                        <li class="drop-header">More</li>
                        <li>
                            <a href="#" title="">Menu 1</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 2</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 3</a>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <a href="#" title="">More 1</a>
                        </li>
                        <li>
                            <a href="#" title="">More 2</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-n </button>
            <div class="drop-menu drop-n">
                <div class="menu">
                    <ul class="menu">
                        <li class="drop-header">More</li>
                        <li>
                            <a href="#" title="">Menu 1</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 2</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 3</a>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <a href="#" title="">More 1</a>
                        </li>
                        <li>
                            <a href="#" title="">More 2</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-ne </button>
            <div class="drop-menu drop-ne">
                <div class="menu">
                    <ul class="menu">
                        <li class="drop-header">More</li>
                        <li>
                            <a href="#" title="">Menu 1</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 2</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 3</a>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <a href="#" title="">More 1</a>
                        </li>
                        <li>
                            <a href="#" title="">More 2</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="drop-container">
            <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-nw </button>
            <div class="drop-menu drop-nw">
                <div class="menu">
                    <ul class="menu">
                        <li class="drop-header">More</li>
                        <li>
                            <a href="#" title="">Menu 1</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 2</a>
                        </li>
                        <li>
                            <a href="#" title="">Menu 3</a>
                        </li>
                        <li class="divider"></li>
                        <li>
                            <a href="#" title="">More 1</a>
                        </li>
                        <li>
                            <a href="#" title="">More 2</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
                            
```html
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger">.drop-s</button>
    <div class="drop-menu drop-s"></div>
</div>
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger">.drop-se</button>
    <div class="drop-menu drop-se"></div>
</div>
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger">.drop-sw</button>
    <div class="drop-menu drop-sw"></div>
</div>
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger">.drop-n</button>
    <div class="drop-menu drop-n"></div>
</div>
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger">.drop-ne</button>
    <div class="drop-menu drop-ne"></div>
</div>
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger">.drop-nw</button>
    <div class="drop-menu drop-nw"></div>
</div>
```



### Carets
Add a caret to the button by using either `.caret-s` or `caret-n` on a `&lt;span&gt;` element inside the button.
<div class="code-content-example">
<div class="container-fuid">
    <div class="drop-container">
        <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .caret-s&nbsp;
            <span class="caret-s"></span>
        </button>
        <div class="drop-menu drop-sw raised">
            <div class="menu">
                <ul class="menu">
                    <li class="drop-header">More</li>
                    <li>
                        <a href="#" title="">Menu 1</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 2</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 3</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#" title="">More 1</a>
                    </li>
                    <li>
                        <a href="#" title="">More 2</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="drop-container">
        <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .caret-n&nbsp;
            <span class="caret-n"></span>
        </button>
        <div class="drop-menu drop-nw raised">
            <div class="menu">
                <ul class="menu">
                    <li class="drop-header">More</li>
                    <li>
                        <a href="#" title="">Menu 1</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 2</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 3</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#" title="">More 1</a>
                    </li>
                    <li>
                        <a href="#" title="">More 2</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
                            
```html
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger">
        .caret-s&nbsp;
        <span class="caret-s"></span>
    </button>
    <div class="drop-menu drop-sw raised">
    
    </div>
</div>
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger">
        .caret-n&nbsp;
        <span class="caret-n"></span>
    </button>
    <div class="drop-menu drop-nw raised">
    
    </div>
</div>
```

---

### Arrows
Add an arrow on the border of the dropdown using the `.arrow` class.
<div class="code-content-example">
<div class="container-fuid">
    <div class="drop-container">
        <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-s </button>
        <div class="drop-menu drop-s raised arrow arrow-n">
            <div class="menu">
                <ul class="menu">
                    <li class="drop-header">More</li>
                    <li>
                        <a href="#" title="">Menu 1</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 2</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 3</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#" title="">More 1</a>
                    </li>
                    <li>
                        <a href="#" title="">More 2</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="drop-container">
        <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-se </button>
        <div class="drop-menu drop-se raised arrow arrow-ne">
            <div class="menu">
                <ul class="menu">
                    <li class="drop-header">More</li>
                    <li>
                        <a href="#" title="">Menu 1</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 2</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 3</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#" title="">More 1</a>
                    </li>
                    <li>
                        <a href="#" title="">More 2</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="drop-container">
        <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-sw </button>
        <div class="drop-menu drop-sw raised arrow arrow-nw">
            <div class="menu">
                <ul class="menu">
                    <li class="drop-header">More</li>
                    <li>
                        <a href="#" title="">Menu 1</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 2</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 3</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#" title="">More 1</a>
                    </li>
                    <li>
                        <a href="#" title="">More 2</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="drop-container">
        <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-n </button>
        <div class="drop-menu drop-n raised arrow arrow-s">
            <div class="menu">
                <ul class="menu">
                    <li class="drop-header">More</li>
                    <li>
                        <a href="#" title="">Menu 1</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 2</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 3</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#" title="">More 1</a>
                    </li>
                    <li>
                        <a href="#" title="">More 2</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="drop-container">
        <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-ne </button>
        <div class="drop-menu drop-ne raised arrow arrow-se">
            <div class="menu">
                <ul class="menu">
                    <li class="drop-header">More</li>
                    <li>
                        <a href="#" title="">Menu 1</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 2</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 3</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#" title="">More 1</a>
                    </li>
                    <li>
                        <a href="#" title="">More 2</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <div class="drop-container">
        <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"> .drop-nw </button>
        <div class="drop-menu drop-nw raised arrow arrow-sw">
            <div class="menu">
                <ul class="menu">
                    <li class="drop-header">More</li>
                    <li>
                        <a href="#" title="">Menu 1</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 2</a>
                    </li>
                    <li>
                        <a href="#" title="">Menu 3</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="#" title="">More 1</a>
                    </li>
                    <li>
                        <a href="#" title="">More 2</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
                            
```html
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"></button>
    <div class="drop-menu drop-s raised arrow arrow-n"></div>
</div>
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"></button>
    <div class="drop-menu drop-se raised arrow arrow-ne"></div>
</div>
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"></button>
    <div class="drop-menu drop-sw raised arrow arrow-nw"></div>
</div>
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"></button>
    <div class="drop-menu drop-n raised arrow arrow-s"></div>
</div>
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"></button>
    <div class="drop-menu drop-ne raised arrow arrow-se"></div>
</div>
<div class="drop-container">
    <button type="button" class="btn btn-default btn-dropdown js-drop-trigger"></button>
    <div class="drop-menu drop-nw raised arrow arrow-sw"></div>
</div>
```
