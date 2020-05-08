const React = {
  // 1. VDOM
  createElement: (tag, props, ...children) => {
    if (typeof tag === 'function') {
      // Crutial part for suspense
      try {
        return tag(props);
      } catch ({ promise, key }) {
        promise.then(data => {
          promiseCache.set(key, data);
          reRender();
        })
        return { tag: 'h1', props: { children: ['I AM LOADING'] } }
      }
    }
    const element = { tag, props: { ...props, children } };
    return element;
  }
};

// 2. Hooks
const states = [];
let currentStateIndex = 0;

const useState = (initialState) => {
  const FROZENCURSOR = currentStateIndex;
  states[FROZENCURSOR] = states[FROZENCURSOR] || initialState;

  let setState = newState => {
    states[FROZENCURSOR] = newState;
    reRender();
  }
  currentStateIndex++;

  return [states[FROZENCURSOR], setState];
}

// 3. Suspense
const promiseCache = new Map();

const createResource = (promiseRetrieval, key) => {
  if (promiseCache.has(key)) {
    return promiseCache.get(key);
  }

  throw { promise: promiseRetrieval(), key};
}

const App = () => {
  const [name, setName] = useState("person");
  const [count, setCount] = useState(0);

  const url = createResource(() =>
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(r => r.json())
      .then(payload => payload.message),
    'dog photo'
  );

  return (
    <div className="react-2020">
      <h1>Hello, {name}</h1>
      <input type="text" placeholder="name" value={name} onchange={e => setName(e.target.value)}/>
      <h2>The count is: {count}</h2>
      <button onclick={() => setCount(count + 1)}>+</button>
      <button onclick={() => setCount(count - 1)}>-</button>
      <br/>
      <img src={url} width="300" height="300"/>
    </div>
  )
};

const render = (reactElement, container) => {
  // Stop if current element should be text node
  if (['string', 'number'].includes(typeof reactElement)) {
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
