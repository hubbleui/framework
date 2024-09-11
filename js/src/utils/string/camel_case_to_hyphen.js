_.prototype.camel_case_to_hyphen = function(str)
{
    if (str === str.toLowerCase()) return str;
    
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1-$2$3').toLowerCase();
}