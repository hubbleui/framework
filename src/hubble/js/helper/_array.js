/**
 * Array utility functions
 *
 * @author    Joe J. Howard
 * @copyright Joe J. Howard
 * @license   https://github.com/kanso-cms/cms/blob/master/LICENSE
 */

/**
 * Checks if an array contains a value
 *
 * @access public
 * @param  string needle    The value to search for
 * @param  array  haystack  The target array to index
 * @param  bool   argStrict Compare strict
 * @return bool
 */
JSHelper.prototype.in_array = function(needle, haystack, argStrict) {

    var key = '',
    strict = !!argStrict;

    //we prevent the double check (strict && arr[key] === ndl) || (!strict && arr[key] == ndl)
    //in just one for, in order to improve the performance 
    //deciding wich type of comparation will do before walk array
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    }
    else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Reduce an array to n values
 * 
 * @access public
 * @param  array  array The target array to change
 * @param  int    count The amount of items to reduce the array to
 * @return array
 */
JSHelper.prototype.array_reduce = function(array, count) {
    return this.array_slice(array, 0, count);
}

/**
 * Compare two arrays
 * 
 * @access public
 * @param  array  a
 * @param  array  b
 * @return array
 */
JSHelper.prototype.array_compare = function(a, b)
{
    return JSON.stringify(a) === JSON.stringify(b);;
}

/**
 * Implode an array
 * 
 * @access public
 * @param  array  array  The target array to implode
 * @param  string prefix Imploding prefix
 * @param  string suffix Imploding sufix (optional) (default )
 * @return string
 */
JSHelper.prototype.implode = function(array, prefix, suffix)
{
    if (this.is_obj(array))
    {
        if (this.empty(array))
        {
            return '';
        }

        glue = typeof prefix === 'undefined' ? '' : prefix;

        separator = typeof suffix === 'undefined' ? '' : suffix; 

        return this.rtrim(Object.keys(array).map(function (key, value) { return [key, array[key]].join(glue); }).join(separator), suffix);
    }

    var str = '';

    prefix = typeof prefix === 'undefined' ? '' : prefix;

    suffix = typeof suffix === 'undefined' ? '' : suffix; 
   
    for (var i = 0; i < array.length; i++)
    {
        if (i === array.length - 1)
        {
            str += prefix + array[i];
        }
        else
        {
            str += prefix + array[i] + suffix;
        }
    }
    return str;
}

/**
 * PHP "array_slice" function
 * 
 * @access public
 * @param  array array         The target array to slice
 * @param  int   offst         At what offset to start the slice
 * @param  int   lgth          Target ending length
 * @param  bool  preserve_keys Preserve array keys (optional) (default false)
 * @return array
 */
JSHelper.prototype.array_slice = function(arr, offst, lgth, preserve_keys) {
    //  discuss at: http://phpjs.org/functions/array_slice/
    // original by: Brett Zamir (http://brett-zamir.me)
    //  depends on: is_int
    //    input by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    //        note: Relies on is_int because !isNaN accepts floats
    //   example 1: array_slice(["a", "b", "c", "d", "e"], 2, -1);
    //   returns 1: {0: 'c', 1: 'd'}
    //   example 2: array_slice(["a", "b", "c", "d", "e"], 2, -1, true);
    //   returns 2: {2: 'c', 3: 'd'}

    /*
    if ('callee' in arr && 'length' in arr) {
      arr = Array.prototype.slice.call(arr);
    }
    */

    var key = '';

    if (Object.prototype.toString.call(arr) !== '[object Array]' ||
        (preserve_keys && offst !== 0)) { // Assoc. array as input or if required as output
        var lgt = 0,
    newAssoc = {};
    for (key in arr) {
            //if (key !== 'length') {
                lgt += 1;
                newAssoc[key] = arr[key];
            //}
        }
        arr = newAssoc;

        offst = (offst < 0) ? lgt + offst : offst;
        lgth = lgth === undefined ? lgt : (lgth < 0) ? lgt + lgth - offst : lgth;

        var assoc = {};
        var start = false,
        it = -1,
        arrlgth = 0,
        no_pk_idx = 0;
        for (key in arr) {
            ++it;
            if (arrlgth >= lgth) {
                break;
            }
            if (it == offst) {
                start = true;
            }
            if (!start) {
                continue;
            }++arrlgth;
            if (this.is_int(key) && !preserve_keys) {
                assoc[no_pk_idx++] = arr[key];
            }
            else {
                assoc[key] = arr[key];
            }
        }
        //assoc.length = arrlgth; // Make as array-like object (though length will not be dynamic)
        return assoc;
    }

    if (lgth === undefined) {
        return arr.slice(offst);
    }
    else if (lgth >= 0) {
        return arr.slice(offst, offst + lgth);
    }
    else {
        return arr.slice(offst, lgth);
    }
}

/**
 * Paginates an array of data
 * 
 * @access public
 * @param  array array The target array to paginate
 * @param  int   page  The current page
 * @param  int   limit Data per page
 * @return array
 */
JSHelper.prototype.paginate = function(array, page, limit) {
    page = (page === false || page === 0 ? 1 : page);
    limit = (limit ? limit : 10);
    var total = count(array);
    var pages = Math.ceil((total / limit));
    var offset = (page - 1) * limit;
    var start = offset + 1;
    var end = Math.min((offset + limit), total);
    var paged = [];

    if (page > pages) return false;

    for (var i = 0; i < pages; i++) {
        offset = i * limit;
        paged.push(array.slice(offset, limit));
    }

    return paged;
}

/**
 * Foreach loop
 * 
 * @access public
 * @param  object  obj       The target object to loop over
 * @param  closure callback  Callback to apply to each iteration
 * @param  array   args      Array of params to apply to callback (optional) (default null)
 */
JSHelper.prototype.foreach = function(obj, callback, args) {
    var value, i = 0,
    length  = obj.length,
    isArray = Object.prototype.toString.call(obj) === '[object Array]';

    if (Object.prototype.toString.call(args) === '[object Array]')
    {
        if (isArray)
        {
            for (; i < length; i++) {

                var _currArgs = [i, obj[i]];

                value = callback.apply(obj, this.array_merge([i, obj[i]], args));

                if (value === false) {
                    break;
                }
            }
        }
        else
        {
            for (i in obj)
            {

                var _currArgs = [i, obj[i]];

                value = callback.apply(obj, this.array_merge([i, obj[i]], args));

                if (value === false)
                {
                    break;
                }
            }
        }

        // A special, fast, case for the most common use of each
    }
    else {
        if (isArray)
        {
            for (; i < length; i++)
            {
                value = callback.call(obj, i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        }
        else {
            for (i in obj)
            {
                value = callback.call(obj, i, obj[i]);

                if (value === false) {
                    break;
                }
            }
        }
    }

    return obj;
}

/**
 * Clone an object
 * 
 * @access public
 * @param  object  src       The object to clone
 * @return object
 */
JSHelper.prototype.cloneObj = function(src) {
    var clone = {};
    for (var prop in src) {
        if (src.hasOwnProperty(prop)) clone[prop] = src[prop];
    }
    return clone;
}

/**
 * Merge multiple arrays together
 * 
 * @access public
 * @param  ...   List of arrays to merge
 * @return array
 */
JSHelper.prototype.array_merge = function () {
  //  discuss at: http://phpjs.org/functions/array_merge/
  // original by: Brett Zamir (http://brett-zamir.me)
  // bugfixed by: Nate
  // bugfixed by: Brett Zamir (http://brett-zamir.me)
  //    input by: josh
  //   example 1: arr1 = {"color": "red", 0: 2, 1: 4}
  //   example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
  //   example 1: array_merge(arr1, arr2)
  //   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
  //   example 2: arr1 = []
  //   example 2: arr2 = {1: "data"}
  //   example 2: array_merge(arr1, arr2)
  //   returns 2: {0: "data"}

  var args = Array.prototype.slice.call(arguments),
  argl = args.length,
  arg,
  retObj = {},
  k = '',
  argil = 0,
  j = 0,
  i = 0,
  ct = 0,
  toStr = Object.prototype.toString,
  retArr = true;

  for (var i = 0; i < argl; i++) {
    if (toStr.call(args[i]) !== '[object Array]') {
      retArr = false;
      break;
  }
}

if (retArr) {
    retArr = [];
    for (var i = 0; i < argl; i++) {
      retArr = retArr.concat(args[i]);
  }
  return retArr;
}

for (i = 0, ct = 0; i < argl; i++) {
    arg = args[i];
    if (toStr.call(arg) === '[object Array]') {
      for (j = 0, argil = arg.length; j < argil; j++) {
        retObj[ct++] = arg[j];
    }
} else {
  for (k in arg) {
    if (arg.hasOwnProperty(k)) {
      if (parseInt(k, 10) + '' === k) {
        retObj[ct++] = arg[k];
    } else {
        retObj[k] = arg[k];
    }
}
}
}
}
return retObj;
}

/**
 * Array filter
 * 
 * @access public
 * @param  array array Target array to filter
 * @return array
 */
JSHelper.prototype.array_filter = function(array) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i] === '' || this.empty(array[i])) continue;
        result.push(array[i]);
    }
    return result;
}

/**
 * Array filter
 * 
 * @access public
 * @param  array array Target array to filter
 * @return array
 */
JSHelper.prototype.array_unique = function(array)
{
    var result = [];

    if (this.is_array(array))
    {
        for (var i = 0; i < array.length; i++)
        {
            if (!this.in_array(array[i], result))
            {
                result.push(array[i])
            }
        }
    }
    
    return result;
}

/**
 * Is array
 * 
 * @access public
 * @param  mixed mixed_var Target object to to check
 * @return bool
 */
JSHelper.prototype.is_obj = function(mixed_var)
{
    if( (typeof mixed_var === "object" || typeof mixed_var === 'function') && (mixed_var !== null) )
    {
        return true;
    }

    return false;
}


/**
 * Is array
 * 
 * @access public
 * @param  array array Target array to filter
 * @return bool
 */
JSHelper.prototype.is_array = function(mixed_var)
{
    return Object.prototype.toString.call(mixed_var) === '[object Array]' || Object.prototype.toString.call(mixed_var) === '[object NodeList]';
}