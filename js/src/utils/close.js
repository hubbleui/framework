// Destructor
_.prototype.destruct = function()
{
    this.clear_event_listeners();
}

Container.singleton('_', _);

})();