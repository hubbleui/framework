/**
 * Utility constants
 *
 */
const FS            = require('fs');
const PATH          = require('path');
const SHOWDOWN      = require('showdown');
const MARKDOWN      = new SHOWDOWN.Converter();
const ROOTDIR       = PATH.dirname(__dirname);
const DOCS_DEST_DIR = `${ROOTDIR}/site`;
const DOCS_SRC_DIR  = `${ROOTDIR}/docs`;
const TAB_CHAR      = "    ";
const LB_CHRAR      = "\n";
const BACK_DIR_CHAR = '../';

/**
 * Helper each.
 *
 * @param {Array|Object} obj
 * @param {Function}     callback
 */
function each(obj, callback)
{
    if (typeof obj !== 'object' || obj === null) return;

    let isArray = Object.prototype.toString.call(obj) === '[object Array]';
    let i       = 0;
    let keys    = isArray ? null : Object.keys(obj);
    let len     = isArray ? obj.length : keys.length;
    let args    = Array.prototype.slice.call(arguments).slice(2);
    let key;
    let val;
    let clbkVal;

    var thisArg = args.length === 0 ? obj : args[0];

    for (; i < len; i++)
    {
        key   = isArray ? i : keys[i];
        val   = isArray ? obj[i] : obj[key];
        clbkVal = callback.call(thisArg, key, val);

        if (clbkVal === false)
        {
            break;
        }
    }

    return obj;
}

/**
 * Convert text to title case
 *
 * @param {String} str
 * @param {String}
 */
function titleCase(str)
{
  str = str.toLowerCase().split(' ');
  
  for (var i = 0; i < str.length; i++)
  {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  }

  return str.join(' ');
}

/**
 * Generate Docs HTML files.
 *
 * @class
 * @author    {Joe J. Howard}
 * @copyright {Joe J. Howard}
 */
const DocsBuilder = function()
{
    // Markdown
    MARKDOWN.setFlavor('github');

    // Build menu tree
    this.MENU_TREE = this._genMenuTree();

    // Get src files
    this.SRC_DEST_FILES = this._genSrcDestFiles();

    // Get page template
    this.PAGE_TEMPLATE = this._getPageTemplate();

    // Clear destination dir
    this._clearDestDir();

    each(this.SRC_DEST_FILES, (src, dest) =>
    {
        // Ensure nested dir exists.
        this._writeDirRecursive(dest);

        // Create HTML and write
        FS.writeFileSync(dest, this._genDocsPage(src, dest), {encoding: 'utf8', flag: 'a+'});
    });
}

/**
 * Writes a nested directory.
 *
 * @param {String} path
 */
DocsBuilder.prototype._writeDirRecursive = function(path)
{
    var dirname = PATH.dirname(path);
        
    if (FS.existsSync(dirname)) return true;

    this._writeDirRecursive(dirname);

    FS.mkdirSync(dirname);
}

/**
 * Returns a flat list of directories in a directory.
 *
 * @param  {String} path
 * @return {Array}
 */
DocsBuilder.prototype._listDirs = function(path)
{
    return FS.readdirSync(path).map(file => PATH.join(path, file)).filter(path => FS.statSync(path).isDirectory());
}

/**
 * Returns flat list of files in a directory.
 *
 * @param  {String} path
 * @return {Array}
 */
DocsBuilder.prototype._listFiles = function(path)
{
    let ret = [];

    let files = FS.readdirSync(path);

    for (const file of files)
    {
        let absolute = PATH.join(path, file);

        if (!FS.statSync(absolute).isDirectory() && !absolute.toLowerCase().includes('ds_store') && absolute.split('/').pop()[0] !== '.')
        {
            ret.push(absolute);
        }
    }

    return ret;
}

/**
 * Returns a recursive flat list of files in a directory.
 *
 * @param  {String} path
 * @return {Array}
 */
DocsBuilder.prototype._listFilesRecursive = function(path)
{
    let ret = [];

    const __filesRecursive = (directory) =>
    {        
        let files = this._listFiles(directory);

        ret = [...ret, ...files];

        each(this._listDirs(directory), (i, dir) => __filesRecursive(dir));

        return ret;
    };

    return __filesRecursive(path);
}


/**
 * Builds nested menu tree structure for docs.
 *
 * @param  {String} path
 * @return {Array}
 */
DocsBuilder.prototype._genMenuTree = function(path)
{
    let isroot = typeof path === 'undefined';

    path = isroot ? DOCS_SRC_DIR : path;

    let title = this._prettyMenuName(path);
    let dirs  = this._listDirs(path);
    let files = this._listFiles(path);
    let menu  = {[title]: []};

    each(files, (i, file) =>
    {
        menu[title].push(this._prettyMenuName(file));
    });

    each(dirs, (i, subDir) =>
    {
        if (!subDir.includes('templates'))
        {
            menu[title].push(this._genMenuTree(subDir));
        }
    });

    return isroot ? menu.Docs : menu;
}

/**
 * Prettifies Menu name for Docs menu.
 *
 * @param  {String} path
 * @return {String}
 */
DocsBuilder.prototype._prettyMenuName = function(path)
{
    return titleCase(path.split('/').pop().replace(/\d+_/, '').replaceAll('-', ' ').split('.').shift());
}

/**
 * Generates src -> dest list of files to read / write
 *
 * @return {Object}
 */
DocsBuilder.prototype._genSrcDestFiles = function()
{
    let srcs = this._listFilesRecursive(DOCS_SRC_DIR).filter(path => PATH.basename(PATH.dirname(path)) !== 'templates');

    let ret = {};

    each(srcs, (i, path) => ret[path] = path.replace(DOCS_SRC_DIR, DOCS_DEST_DIR).replaceAll(/\/\d+_/g, '/').toLowerCase().replace('.md', '/index.html'));

    return ret;
}

/**
 * Reads the docs page HTML template. 
 *
 * @return {String}
 */
DocsBuilder.prototype._getPageTemplate = function()
{
    return FS.readFileSync(`${DOCS_SRC_DIR}/templates/page.html`, 'utf8', (err, data) => data);
}

/**
 * Clears the docs dest directory.
 *
 */
DocsBuilder.prototype._clearDestDir = function()
{
    FS.rmSync(DOCS_DEST_DIR, { recursive: true, force: true });

    FS.mkdirSync(DOCS_DEST_DIR, { recursive: true, force: true });
}

/**
 * Generates the docs HTML page from markdown.
 *
 * @return {String}
 */
DocsBuilder.prototype._genDocsPage = function(src, dest)
{
    if (src.includes('.html'))
    {
        return FS.readFileSync(src, 'utf8', (err, data) => data).replaceAll('{{ASSET_PATH}}', this._getAssetsPath(src));
    }

    let menu = this._genHTMLDocsMenu(this.MENU_TREE, dest);

    let html = this._MDtoHTMLFile(src);

    return this.PAGE_TEMPLATE.replaceAll('{{DOCS_MENU}}', menu).replace('{{ARTICLEBODY}}', html).replaceAll('{{ASSET_PATH}}', this._getAssetsPath(src)).replaceAll('DOLLAR_SIGN', '$');
}

/**
 * Converts MArkdown to HTML.
 *
 * @param  {String} path
 * @return {Array}
 */
DocsBuilder.prototype._MDtoHTMLFile = function(path)
{
    const text = FS.readFileSync(path, 'utf8', (err, data) => data).replaceAll('$', 'DOLLAR_SIGN');
        
    return MARKDOWN.makeHtml(text);
}

/**
 * Generates HTML Docs Menu for page.
 *
 * @param  {Array}   menu     Current or root menu
 * @param  {String}  currFile Current file being processed
 * @param  {String}  currFile Current nested directory of menu or submenu
 * @param  {Integer} tabIndex Current depth level
 * @return {String}
 */
DocsBuilder.prototype._genHTMLDocsMenu = function(menu, currFile, dir, tabIndex)
{
    tabIndex     = typeof tabIndex === 'undefined' ? 1 : tabIndex;
    dir          = typeof dir === 'undefined' ? '' : dir;
    let HTML     = '';
    let filepath = currFile.toLowerCase().split(DOCS_DEST_DIR.toLowerCase()).pop().split('/').map((x) => this._prettyFileName(x)).filter((x) => x.trim() !== '' ).join('/');
    let isRoot   = tabIndex === 1;
    

    if (isRoot)
    {
        HTML += '<ul class="doc-menu menu">';
    }

    each(menu, (i, item) =>
    {
        if (typeof item === 'string')
        {
            if (!item.includes('iframe'))
            {
                let _name  = filepath.split('/'); _name.pop(); _name = _name.pop();
                let active = _name === item ? 'active' : '';
                let name   = item.toLowerCase().replaceAll(' ', '-');
                let slug   = `${dir}/${name}/index.html`;
                let back   = this._relativeLinkBack(slug, currFile.toLowerCase().split(DOCS_DEST_DIR.toLowerCase()).pop());

                HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex)}<li class="menu-item ${active}"><a href="${back}${slug}">${item}</a></li>`;
            }
        }
        else
        {
            let name   = Object.keys(item)[0];
            let items  = item[name];
            let id     = name.toLowerCase().replaceAll(' ', '-');
            let active = filepath.includes(name) ? 'active' : '';
            let height = active ? 'style="height:auto"' : '';
            let slug   = `${dir}/${id}`;

            HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex)}<li class="menu-item-title js-collapse ${active}" data-collapse-target="menu-${id}">`;
                    HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex + 1)}<span class="item-left"><span class="fa fa-chevron-right"></span></span>`;
                    HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex + 1)}<span class="item-body">${name}</span>`;

            HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex)}</li>`;

            HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex)}<li ${height} id="menu-${id}" class="menu-item-submenu">`;
                HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex + 1)}<ul class="menu menu-dense">`;
                    HTML += this._genHTMLDocsMenu(items, currFile, slug, tabIndex + 2)
                HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex + 1)}</ul>`;
            HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex)}</li>`;
        }
    });

    if (isRoot)
    {
        HTML += `${LB_CHRAR}</ul>`;
    }

    return HTML;
}

/**
 * Prettifies file path.
 *
 * @param  {String} path
 * @return {Array}
 */
DocsBuilder.prototype._prettyFileName = function(path)
{
    return titleCase(path.split('/').pop().replaceAll(/[0-9_]/g, '').replaceAll('-', ' ').split('.').shift());
}

/**
 * Build's relative back-link to other file.
 *
 * @param  {String} to
 * @param  {String} from
 * @return {String}
 */
DocsBuilder.prototype._relativeLinkBack = function(to, from)
{
    let fromDirs = from.split('/').filter((x) => x !== '').slice(0, -1);
    let toDirs   = to.split('/').filter((x) => x !== '').slice(0, -1);
    let toRoot   = fromDirs.length;
    let sameDir  = fromDirs.length === toDirs.length && fromDirs.slice(0, -1).pop() === toDirs.slice(0, -1).pop();

    if (sameDir) return BACK_DIR_CHAR.repeat(2).slice(0, -1);

    for (var i = 0; i < toDirs.length; i++)
    {
        if (toDirs[i] === fromDirs[i])
        {
            return BACK_DIR_CHAR.repeat(i+1).slice(0, -1);
        }
    }

    return BACK_DIR_CHAR.repeat(toRoot).slice(0, -1);
}

/**
 * Returns relative path to assets dir.
 *
 * @param  {String} path
 * @return {String}
 */
DocsBuilder.prototype._getAssetsPath = function(path)
{
    let count = path.toLowerCase().split(DOCS_SRC_DIR.toLowerCase()).pop().split('/').filter((x) => x !== '').length;

    return BACK_DIR_CHAR.repeat(count + 1);
}

const build = new DocsBuilder;