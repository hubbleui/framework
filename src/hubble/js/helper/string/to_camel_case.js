_.prototype.to_camel_case = function(str)
{
    
    str = str.trim();

    // Shouldn't be changed
    if (!str.includes(' ') && !str.includes('-') && /[A-Z]/.test(str))
    {
        return str;
    }

    return str.toLowerCase().replace(/['"]/g, '').replace(/\W+/g, ' ').replace(/ (.)/g, function($1)
    {
        return $1.toUpperCase();
    })
    .replace(/ /g, '');
}