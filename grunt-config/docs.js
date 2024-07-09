function createDocs()
{
    const FS            = require('fs');
    const PATH          = require('path');
    const SHOWDOWN      = require('showdown');
    const MARKDOWN      = new SHOWDOWN.Converter();
    const DIRNAME       = __dirname.replace('/grunt-config', '');
    const DOCS_DEST_DIR = `${DIRNAME}/docs`;
    const DOCS_SRC_DIR  = `${DIRNAME}/src/docs`;
    const TAB_CHAR      = "    ";
    const LB_CHRAR      = "\n";
    const BACK_DIR_CHAR = '../';

    const each = function(obj, callback)
    {
        if (typeof obj !== 'object' || obj === null) return;

        let isArray = Object.prototype.toString.call(obj) === '[object Array]';
        let i       = 0;
        let keys    = isArray ? null : Object.keys(obj);
        let len     = isArray ? obj.length : keys.length;
        let args    = Array.prototype.slice.call(arguments).slice(2);
        let ret     = isArray ? [] : {};
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

    const writeDirRecursive = function(filePath)
    {
        var dirname = PATH.dirname(filePath);
        
        if (FS.existsSync(dirname))
        {
            return true;
        }

        writeDirRecursive(dirname);

        FS.mkdirSync(dirname);
    }

    const flattenDirs = function(lists)
    {
        return lists.reduce((a, b) => a.concat(b), []);
    }

    const listDirs = function(srcpath)
    {
        return FS.readdirSync(srcpath).map(file => PATH.join(srcpath, file)).filter(path => FS.statSync(path).isDirectory());
    }

    const listDirsRecursive = function(srcpath)
    {
        return [srcpath, ...flattenDirs(listDirs(srcpath).map(listDirsRecursive))];
    }

    const listFilesRecursive = function(dir)
    {
        let files = [];

        const __filesRecursive = (directory) =>
        {
            const filesInDirectory = FS.readdirSync(directory);

            for (const file of filesInDirectory)
            {
                const absolute = PATH.join(directory, file);
                
                if (FS.statSync(absolute).isDirectory())
                {
                    __filesRecursive(absolute);
                }
                else if (!absolute.includes('DS_Store'))
                {
                    files.push(absolute);
                }
            }

            return files;
        };

        return __filesRecursive(dir);
    }

    const listFolderFiles = function(directory)
    {
        let files = [];

        const filesInDirectory = FS.readdirSync(directory);

        for (const file of filesInDirectory)
        {
            const absolute = PATH.join(directory, file);
            
            if (!FS.statSync(absolute).isDirectory() && !absolute.includes('DS_Store'))
            {
               files.push(absolute);
            }
        }

        return files;
    }

    const titleCase = function(str)
    {
      str = str.toLowerCase().split(' ');
      
      for (var i = 0; i < str.length; i++)
      {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
      }

      return str.join(' ');
    }

    const prettyFileName = function(name)
    {
        return titleCase(name.split('/').pop().replaceAll(/[0-9_]/g, '').replaceAll('-', ' ').split('.').shift());
    }

    const buildMenuTree = function(dir)
    {
        let title = prettyFileName(dir);
        let dirs  = listDirs(dir);
        let files = listFolderFiles(dir);
        let menu  = {[title]: []};

        each(files, function(i, file)
        {
            let name = prettyFileName(file);

            menu[title].push(name);
        });

        each(dirs, function(i, subDir)
        {
            if (subDir.includes('templates')) return;

            menu[title].push(buildMenuTree(subDir));
        });

        return menu;
    }

    const MDtoHTMLFile = function(path)
    {
        const text = FS.readFileSync(path, 'utf8', (err, data) => data).replaceAll('$', 'DOLLAR_SIGN');
        
        return MARKDOWN.makeHtml(text);
    }

    const relativeLinkBack = function(to, from)
    {        
        let toFromRoot   = to.split('/').length;
        let fromFromRoot = from.toLowerCase().split(DOCS_DEST_DIR.toLowerCase()).pop().split('/').length;
        let diff         = fromFromRoot > toFromRoot ? fromFromRoot - toFromRoot : toFromRoot - fromFromRoot;

        if (diff === 0 || toFromRoot === fromFromRoot)
        {
            return BACK_DIR_CHAR.repeat(toFromRoot -2).slice(0, -1);
        }

        diff = diff + 2;

        return BACK_DIR_CHAR.repeat(diff).slice(0, -1);
    }

    const buildHTMLMenu = function(menu, currFile, dir, tabIndex)
    {
        tabIndex     = typeof tabIndex === 'undefined' ? 1 : tabIndex;
        dir          = typeof dir === 'undefined' ? '' : dir;
        let HTML     = '';
        let filepath = currFile.toLowerCase().split(DOCS_DEST_DIR.toLowerCase()).pop().split('/').map((x) => prettyFileName(x)).filter((x) => x.trim() !== '' ).join('/');
        let isRoot   = tabIndex === 1;
        

        if (isRoot)
        {
            HTML += '<ul class="doc-menu js-docs-menu">';
        }

        each(menu, function(i, item)
        {
            if (typeof item === 'string')
            {
                let active = filepath.includes(item) ? 'class="active"' : '';
                let name   = item.toLowerCase().replaceAll(' ', '-');
                let slug   = `${dir}/${name}/index.html`;
                let back   = relativeLinkBack(slug, currFile);

                HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex)}<li class="menu-item"><a ${active} href="${back}${slug}">${item}</a></li>`;
            }
            else
            {
                let name   = Object.keys(item)[0];
                let items  = item[name];
                let id     = name.toLowerCase().replaceAll(' ', '-');
                let active = filepath.includes(name) ? 'active' : '';
                let height = active ? 'style="height:auto"' : '';
                let slug   = `${dir}/${id}`;

                HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex)}<li class="menu-item menu-item-title js-collapse ${active}" data-collapse-target="menu-${id}">`;
                        HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex + 1)}<h6>${name}</h6>`;
                        HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex + 1)}<span class="icon glyph-icon glyph-icon-chevron-down"></span>`;
                HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex)}</li>`;

                HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex)}<li ${height} id="menu-${id}" class="menu-item menu-item-submenu">`;
                    HTML += `${LB_CHRAR}${TAB_CHAR.repeat(tabIndex + 1)}<ul>`;
                        HTML += buildHTMLMenu(items, currFile, slug, tabIndex + 2)
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

    const buildAssethref = function(path)
    {
        let count = path.split(DOCS_DEST_DIR.toLowerCase()).pop().split('/').filter((x) => x !== '').length;

        return BACK_DIR_CHAR.repeat(count);
    }

    const srcToDestFile = function(path)
    {
        return path.replace(DOCS_SRC_DIR, DOCS_DEST_DIR).replaceAll(/\/\d+_/g, '/').toLowerCase().replace('.md', '/index.html');
    }

    const startFresh = function()
    {
        FS.rmSync(DOCS_DEST_DIR, { recursive: true, force: true });

        FS.mkdirSync(DOCS_DEST_DIR, { recursive: true, force: true });
    }

    const MENU_TREE     = buildMenuTree(DOCS_SRC_DIR).Docs;
    const SRC_FILES     = listFilesRecursive(DOCS_SRC_DIR).filter(path => !path.includes('DS_Store') && !path.includes('/templates'));
    const PAGE_TEMPLATE = FS.readFileSync(`${DOCS_SRC_DIR}/templates/page.html`, 'utf8', (err, data) => data);
    
    MARKDOWN.setFlavor('github');

    const startBuild = function()
    {
        startFresh();
        
        each(SRC_FILES, function(i, filepath)
        {
            let destpath = srcToDestFile(filepath)
            let menu     = buildHTMLMenu(MENU_TREE, destpath);
            let article  = MDtoHTMLFile(filepath);
            let page     = PAGE_TEMPLATE.replace('{{DOCS_MENU}}', menu).replace('{{ARTICLEBODY}}', article).replaceAll('{{ASSET_PATH}}', buildAssethref(destpath)).replaceAll('DOLLAR_SIGN', '$');

            writeDirRecursive(destpath);

            FS.writeFileSync(destpath, page, {encoding: 'utf8', flag: 'a+'}); 
        });
    }

    startBuild();
}

module.exports = {
  build: createDocs,
};