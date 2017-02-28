(function() {

    // REQUIRES
    /*****************************************/
    var Helper = Modules.require('JSHelper');

    // MODULE
    /*****************************************/
    var TabNav = function() {
        
        this.__construct();

        return this;
    };

    // CONSTRUCTOR
    /*****************************************/
    TabNav.prototype.__construct = function() {

        // Make sure Helper is included
        if (Helper == 'null') Helper = Modules.require('JSHelper');
        
        // Find nodes
        this._nodes = Helper.$All('.js-tab-nav');

        // If nothing to do destruct straight away
        if (!this._nodes.length) {
            this.destruct();
            return;
        }

        for (var i = 0; i < this._nodes.length; i++) {
            this._bindDOMListeners(this._nodes[i]);
        }
    }

    // DESTRUCTOR
    /*****************************************/
    TabNav.prototype.destruct = function() {
        for (var i = 0; i < this._nodes.length; i++) {
            this._unbindDOMListeners(this._nodes[i]);
        }
        this._nodes = [];
        Helper      = 'null';
    }

    // LISTENERS BINDER
    /*****************************************/
    TabNav.prototype._bindDOMListeners = function(navWrap) {
        var links  = Helper.$All('a', navWrap);
        for (var i = 0; i < links.length; i++) {
            this._bind(links[i]);
        }
    }

    // LISTENERS UN-BINDER
    /*****************************************/
    TabNav.prototype._unbindDOMListeners = function(navWrap) {
        var links    = Helper.$All('a', navWrap);
        for (var i = 0; i < links.length; i++) {
            this._unbind(links[i]);
        }
    }

    // LISTENER UNBINDER
    /*****************************************/
    TabNav.prototype._unbind = function(link) {
       Helper.removeEventListener(link, 'click', this._changeTab);
    }

    // LISTENER BINDER
    /*****************************************/
    TabNav.prototype._bind = function(link) {
       Helper.addEventListener(link, 'click', this._changeTab);
    }

    // EVENT HANDLER 
    /*****************************************/
    TabNav.prototype._changeTab = function(e) {
        e = e || window.event;
        e.preventDefault();

        var _this = TabNav.prototype;
        
        var node = this;

        if (Helper.hasClass(node, 'active')) return;
        
        var tab           = node.dataset.tab;
        var tabNav        = Helper.closest(node, 'ul');

        var tabPane       = Helper.$('[data-tab-panel="' + tab + '"]');
        var tabPanel      = Helper.parentUntillClass(tabPane, 'js-tab-panels-wrap');
        var activePanel   = Helper.$('.tab-panel.active', tabPanel);

        var navWrap       = Helper.parentUntillClass(node, 'js-tab-nav');
        var activeNav     = Helper.$('a.active', navWrap);

        Helper.removeClass(activeNav, 'active');
        Helper.removeClass(activePanel, 'active');

        Helper.addClass(node, 'active');
        Helper.addClass(tabPane, 'active');
        if (Helper.hasClass(tabNav, 'js-url-tabs')) {
            var title = node.dataset.tabTitle;
            var slug  = node.dataset.tabUrl;
            _this._changeUrl(title, slug);
        }
    }

    // CHANGE URL AND TITLE
    /*****************************************/
    TabNav.prototype._changeUrl = function(title, slug) {
        var url;

        if (slug.substring(0,1) === '/') {
            url = window.location.origin + slug;
        }
        else {
            url = window.location.href.split('?');
            url = url[0] + '?' + Helper.ltrim(slug, '?');
        }

        var baseTitle = document.title.split('|').pop().trim();
        title = title + ' | ' + baseTitle;

        var statedata = title;
        window.history.pushState( { id: url }, title, url);
        var locationObj = {
            location : window.location.href,
            target   : 'document',
            title    : document.title,
        };
        document.title = title;
    }

    // Load into container and invoke
    /*****************************************/
    Modules.singleton('TabNav', TabNav).require('TabNav');

})();