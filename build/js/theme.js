(function()
{
    var Example = function(arg1, arg2)
    {
        console.log(arg1, arg2);

        return this;
    }

    Hubble.container().set('Example', Example);

    console.log(Hubble.require('Example', 'arg1', 'arg2'));

})();