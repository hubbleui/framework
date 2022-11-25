import { render, Component, createElement } from './dom';

(function()
{
    class Nest2 extends Component
    {
        constructor(props)
        {
            super(props);

            console.log('Constructing Nest2');
        }

        render()
        {
            return `
                <div>NEST2</div>
            `;
        }
    }

    class Nest1 extends Component
    {
        Nest2 = Nest2;

        constructor(props)
        {
            super(props);

            console.log('Constructing Nest1');
        }

        render()
        {
            return `
                <div>
                    NEST 1
                    <Nest2 />
                </div>
            `;
        }
    }

    class Bar extends Component
    {
        constructor(props)
        {
            super(props);

            this.interpolate = 'interpolated from bar!';
            this.evaluate    = this.exampleMethod;
            this.nested      = 'Nested from Bar!';
            this.Nest1       = Nest1;

            console.log('Constructing Bar');
        }

        exampleMethod()
        {
            return 'Evaluated from bar!'
        }
        
        render()
        {
            console.log('rending Bar')
            return `
            <div> 
                <h2>
                    {this.interpolate}
                </h2>
                <Nest1 />
            </div>
            `;
        }
    }

    class Foo extends Component
    {
        constructor(props)
        {
            super(props);

            this.state = {counter : 1, foo: 'bar', bar: {foo: 'bar'}};

            this.interpolate = 'interpolated!';
            this.evaluate    = this.returnJsx;
            this.Bar         = Bar;
            this.numbers     = [1, 2, 3, 4, 5];
            this.nested      = 'Nested from Foo!';
            this.Nest1       = Nest1;
            this.variable    = 'interpolated variable';

            var _this = this;

            console.log('Constructing Foo')

            setInterval(function()
            {
                _this.tick();

            }, 1000);
        }

        tick()
        {
            if (this.state.counter > 2)
            {
                return;
            }

            this.setState('counter', this.state.counter + 1);
        }

        exampleMethod()
        {
            return 'Evaluated!'
        }

        returnJsx()
        {
            return this.jsx('<div><h1>Returned JSX! with <i>{variable}</i></h1></div>');
        }

        handler()
        {
            alert('clicked!');
        }

        render()
        {
            return `
                <section>
                    <div onClick={this.handler}>{this.state.counter}</div>
                    <div>
                        <span>
                            {this.exampleMethod()}
                        </span>
                            {this.returnJsx()}
                        <i>Foo</i>
                    </div>
                    <div><Bar /></div>
                </section>
            `;
        }
    }


    const initialProps =
    {
        string: "foo", 
        number: 5,
        boolean: true
    };

/*   let vnode = createElement(
  'ul',
  {
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: 'red'
    }
  },
  [
    createElement('li',{ key: 'li-a' }, 'li-a'),
    createElement('li',{ key: 'li-b' }, 'li-b'),
    createElement('li',{ key: 'li-c' }, 'li-c'),
    createElement('li',{ key: 'li-d', id: 'd' }, 'li-d'),
  ]
)

let nextVNode = createElement(
  'ul',
  {
    style: {
      width: '100px',
      height: '100px',
      backgroundColor: 'green'
    }
  },
  [
    createElement('li', { key: 'li-f' }, 'li-f'),
    createElement('li', { key: 'li-d', id: 'd' }, 'li-d'),
    createElement('li', { key: 'li-b' }, 'li-b'),
    createElement('li', { key: 'li-a' }, 'li-a'),
    createElement('li', { key: 'li-c' }, 'li-c'),
  ]
)

let nextVNode2 = createElement(
  'ul',
  {
    style: {
      width: '100px',
      backgroundColor: 'yellow'
    }
  },
  [
    createElement('li', { key: 'li-b' }, 'li-b'),
    createElement('li', { key: 'li-d', id: 'd' }, 'li-d'),
    createElement('li', { key: 'li-c' }, 'li-c'),
    createElement('li', { key: 'li-a' }, 'li-a'),
    createElement('li', { key: 'li-e' }, 'li-e'),
  ]
)

let nextVNode3 = createElement(
  'ul',
  {
    style: {
      width: '100px',
      backgroundColor: 'yellow'
    }
  },
  [
    createElement('li', { key: 'li-d', id: 'd' }, 'li-d'),
    createElement('li', { key: 'li-a' }, 'li-a'),
    createElement('li', { key: 'li-f' }, 'li-f'),
  ]
)

function fn() {
  setTimeout(() => {
    render(nextVNode, document.getElementById('app'))
    f = document.querySelector('li')
    fn2()
  }, 1000)
}
function fn2() {
  setTimeout(() => {
    render(nextVNode2, document.getElementById('app'))
    fn3()
  }, 1000)
}
function fn3() {
  setTimeout(() => {
    render(nextVNode3, document.getElementById('app'))
    console.log(d === document.getElementById('d'))
    console.log(firstLi === document.getElementsByTagName('li')[1])
    console.log(f === document.getElementsByTagName('li')[2])
  }, 1000)
}

render(vnode, document.getElementById('app'));

fn()
let d = document.getElementById('app');
let firstLi = document.querySelector('li')
let f = null;*/



render(Foo, document.getElementById('app'));

//render(new createElement('div', {}, 'bar'), document.getElementById('app'));


//Hubble.Dom.render(Foo, initialProps, document.getElementById('app'));


//
//const root = Hubble.createElement(Foo, initialProps);

//root.forceUpdate();

//console.log(root);

//document.getElementById('app').appendChild(root.el());


})();