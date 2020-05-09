type Tag = string | Function;
type Prop = { children: Array<ReactElement>, [x: string]: any };
type Child = Record<string, string> | string;

type ReactElement = string | number | { tag: Exclude<Tag, Function>; props: Prop};

const React = {
  // 1. VDOM
  createElement: (tag: Tag, props: Prop[] | null, ...children: Child[]) => {
    // On bootstrap, the tag will be a function (App())
    if (typeof tag === 'function') {
      // Crutial part for suspense
      try {
        return tag(props);
      } catch ({ promise, key }) {
        promise.then((data: any) => {
          promiseCache.set(key, data);
          reRender();
        })
        return { tag: 'h1', props: { children: ['I AM LOADING'] } }; // Default while fetching the promised value
      }
    }

    return { tag, props: { ...props, children } };
  }
};

// 2. Hooks
const states: Array<any> = [];
let currentStateIndex = 0;

function useState<T>(initialState: T): [T, (x: T) => void] {
  // WITH THE POWER OF CLOSUREEEEE
  const frozenStateIndex = currentStateIndex;
  states[frozenStateIndex] = states[frozenStateIndex] || initialState;

  function setState(newState: T): void {
    states[frozenStateIndex] = newState;
    reRender();
  }

  currentStateIndex++;

  return [states[frozenStateIndex], setState];
}

// 3. Suspense
const promiseCache = new Map<string, any>();

function createResource<T>(promiseRetrieval: () => Promise<T>, key: string): Promise<T> {
  if (promiseCache.has(key)) {
    return promiseCache.get(key);
  }

  throw { promise: promiseRetrieval(), key};
}

const App = () => {
  const [name, setName] = useState("person");
  const [count, setCount] = useState(0);

  const url = createResource(
    () => fetch('https://dog.ceo/api/breeds/image/random').then(r => r.json()).then(payload => payload.message),
    'dog photo'
  );

  return (
    <div className="react-2020">
      <h1>Hello, {name}</h1>
      <input type="text" placeholder="name" value={name} onchange={(e: Event) => setName((e.target as HTMLInputElement).value)}/>
      <h2>The count is: {count}</h2>
      <button onclick={() => setCount(count + 1)}>+</button>
      <button onclick={() => setCount(count - 1)}>-</button>
      <br/>
      <img src={url} width="300" height="300"/>
      <div>
        <div>hello</div>
      </div>
    </div>
  )
};


const render = (reactElement: ReactElement, container: HTMLElement) => {
  console.log(reactElement);
  // Stop if current element should be text node
  if (typeof reactElement === 'string' || typeof reactElement === 'number') {
    container.appendChild(document.createTextNode(String(reactElement)));
    return;
  }

  const { props, tag } = reactElement;
  const node = document.createElement(tag);

  // If any, assign properties
  if (reactElement.props) {
    Object.keys(props)
      .filter(p => p !== 'children')
      .forEach(p => node[p] = props[p]);
  }

  // Repeat recursevely for children
  if (props.children) {
    props.children.forEach(child => render(child, node));
  }

  container.appendChild(node);
};

const reRender = () => {
  currentStateIndex = 0; // Reset hooks 
  document.querySelector('#app').firstChild.remove();
  render(<App/>, document.querySelector('#app'));
}

// Bootstrap
render(<App/>, document.querySelector('#app'));
