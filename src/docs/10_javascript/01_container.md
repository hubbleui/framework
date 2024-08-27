# Container

Hubble's components are all held via a single application interface. The only global variable in the window namespace is the global `Hubble` object!

---

*	[Usage](#usage)
*	[Dependency injection](#dependency-injection)

---

### Usage

Hubble uses an Inversion control Container to hold all components and related peripherals. The Hubble application and Container can be globally accessed via the `Hubble` variable. This is the only globally available variable


```javascript
let hubble = Hubble;
```

To set a value into the Container use the `set` method:

```javascript
Hubble.set('foo bar', 'Awesome!');
```

To retrieve a value use the `get` method:

```javascript
let awesome = Hubble.get('foo bar');
```

The has method checks if a key is stored in the Container:

```javascript
if (Hubble.has('foo bar'))
```

The `delete` method will delete a key value pair from the Container:

```javascript
Hubble.delete('app');
```

Any key-value pair set to the Container can also be retrieved using a direct method call. Hubble converts the key `CamelCase` when adding to the Container:

```javascript
let awesome = Hubble.FooBar();
```

You can set any variable you like to a key, including functions, instantiated instances and Object Functions. Functions that can instantiate an instance will automatically get created with any provided arguments:

```javascript
Hubble.set('do something', (arg1, arg2) => console.log(arg1, arg2));

// Or via method
Hubble.DoSomething('foo', 'bar');
```

Here is am example of setting an instance as key / value pair. The same instance will be returned each time the key is retrieved:

```javascript
const app = function(a, b)
{
	console.log(a, b);
}

Hubble.set('app', new App(1, 2) );

// Retrieve via get
let instance = Hubble.get('app');

// Or directly via method
let instance = Hubble.App();
```

With the example below, a new instance will be created each time the key is retrieved with any arguments passed on:

```javascript
const app = function(a, b)
{
	console.log(a, b);
}

Hubble.set('app', app);

// Retrieve via get
let instance1 = Hubble.get('app', 1, 2);

// Or directly via method
let instance2 = Hubble.App(1, 2);
```

The `singleton` method takes a Object Function and returns the same instance no matter how many times it's called. The instance will only be created when it's first called:

```javascript
const app = function(a, b)
{
	console.log(a, b);
}

Hubble.set('app', app);

// Retrieve via get 
let instance = Hubble.get('app', 1, 2);

// Or directly via method
let instance = Hubble.App(1, 2);
```

When setting a function as a key/value pair, if you require reference to underlying function itself (rather than it being called or instantiated), pass the `Hubble.IMPORT_AS_REF` to retrieve the function:

```javascript
Hubble.set('do something', (arg1, arg2) => console.log(arg1, arg2));

// Or via method
let callback = Hubble.DoSomething(Hubble.IMPORT_AS_REF);

callback('foo', 'bar');
```

---

### Dependency injection

Hubble comes with a handy Dependency injection utility to import functions, constants or any other properties from an object, this means you only need to import the variables you require on a given piece of code.

```javascript
let [add_class, remove_class] = Hubble.import(['add_class', 'remove_class']).from('_');
```

Although this is longer than accessing the method normally, if you're reusing the method multiple times it will ultimately save code space and memory to cache it.

```javascript
Hubble._().remove_class(node, 'bar');
```