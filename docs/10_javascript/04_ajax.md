# Ajax

FrontBx's `Ajax` Component allows you to easily handle Ajax calls in consistent and flexible manner. 

---

*   [Access](#access)
*   [Methods](#methods)
*   [Arguments](#arguments)
*   [Response](#response)
*   [Upload](#upload)

---

Ajax can be accessed via FrontBx's container using the `Ajax` key.

```JavaScript
let Ajax = FrontBx.Ajax();
```

---

### Methods

The `post` method posts an Ajax call with an object to a url. 

```JavaScript
Ajax.post(url, data, success, error, complete, abort, headers;
```

The `get` method calls a `GET` request to a given url. 

```JavaScript
Ajax.get(url, data, success, error, complete, abort, headers);
```

The `head` method calls a `HEAD` request to a given url. 

```JavaScript
Ajax.get(url, data, success, error, complete, abort, headers);
```

The `put` method calls a `HEAD` request to a given url. 

```JavaScript
Ajax.put(url, data, success, error, complete, abort, headers);
```

The `delete` method calls a `DELETE` request to a given url. 

```JavaScript
Ajax.delete(url, data, success, error, complete, abort, headers);
```

---

### Arguments

All Ajax calls can be provided arguments with response handlers either as anonymous functions or named functions.

In the case of anonymous functions, arguments must be provided in the correct order:

```JavaScript
Ajax.post(url, data, success, error, complete, abort, headers);
```

You can still omit handlers, for example if you don't need an abort handler:

```JavaScript
Ajax.post(url, data, complete);

Ajax.post(url, data, success, error);
```

With named functions, as long as the function names are one of `success`, `error`, `complete`, `abort`, they can be provided in any order

```JavaScript
Ajax.post(url, error, abort, success, complete, headers);
```

Additionally you can supply response handlers directly to an Ajax instance, this can be done either before or after the `XHR` call is made:

```JavaScript
// After call
Ajax.post(url, data).success((response) =>
{
    // Do something here
});

// Before call
Ajax.success((response) =>
{
    // Do something here

}).post(url, data);
```

All response handlers are chainable making it easy to setup complex scenarios 

```JavaScript
Ajax.success((response) =>
{
    // Do something here

})
.error((response) =>
{
    // Do something here

})
.complete((response, successful) =>
{
    // Do something here

})
.post(url, data);
```

Additionally, you can use the `headers` function to supply headers specifically this way:

```JavaScript
Ajax.success((response) =>
{
    // Do something here

}).headers({foo: 'bar'}).post(url, data);
```

If the `abort` method is called after an XHR call is made, the request will be immediately aborted. The `abort` and `error` handler with both be called:

```JavaScript
Ajax.success((response) =>
{
    // Do something here

}).
Ajax.error((response) =>
{
    // Do something here

}).post(url, data);

Ajax.abort();
```

If the `abort` method is called before an XHR call is made, a supplied callback will be used as the abort handler

```JavaScript
Ajax.success((response) =>
{
    // Do something here

}).
Ajax.abort((response) =>
{
    // Do something here

}).post(url, data);

Ajax.abort();
```

---

### Response

Response handlers will receive the [XHR.responseText](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseText) as their primary parameter with `this` applied as the [XHR Object](https://developer.mozilla.org/en-US/docs/Glossary/XMLHttpRequest).

In the case of `complete` a second `boolean` parameter is supplied indicating if the call was successful or not.

```JavaScript
Ajax.post('http://example.com', { foo : 'bar' }, 
    function success(response)
    {
        // this === XHR
        console.log('success');
        console.log(response);
    },
    function error(response)
    {
        // this === XHR
        console.log('error');
        console.log(response);
    },
    function complete(response, successful)
    {
        // this === XHR
        console.log('Completed');
        console.log(`Was successful: ${successful}`);
        console.log(response);
    }
);
```

---

### Upload

The `upload` method calls an upload to a url. Upload has the same response handlers as other Ajax calls with the addition of a `progress` handler which receives the browser progress event:

```JavaScript
Ajax.upload(url, fileObj, success, error, complete, abort, progress, headers);
```

Below is an example 

```JavaScript
Ajax.success((response) =>
{
    console.log('The upload completed successfully.')
})
.error((response) =>
{
    console.log('There was an error uploading the file.')
})
.progress((e) =>
{
    console.log(`[${e.loaded}] uploaded of total [${e.total}]. [${e.total - e.loaded}] remaining....`);
})
.upload(url,fileObject);
```