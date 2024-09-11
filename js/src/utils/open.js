(function()
{
    var _THIS = null;

    const _ = function()
    {
        this.version = "1.0.0";

        this.author = "Joe Howard";

        this.browser = false;

        this._events = {};

        this._guid = 1;

        _THIS = this;
    }

    _.prototype._guidgen = function()
    {
        return `__${this._guid++}`;
    }