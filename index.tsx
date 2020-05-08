const React = {
  // VDOM
  createElement: (tag, props, ...children) => {
    if (typeof tag === 'function') {
      return tag(props);
    }
    const element = { tag, props: { ...props, children } };
    console.log(element);
    return element;
  }
};

const App = () => (
  <div className="react-2020">
    <h1>Hello, person</h1>
    <input type="text" placeholder="name"></input>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam non doloremque officiis necessitatibus architecto cumque commodi expedita? Porro deserunt laboriosam officia delectus! Accusantium cum minima, eligendi fugit deleniti unde ex vitae quae nesciunt quam soluta ab at, harum consequatur consectetur?</p>
  </div>
);

const render = (reactElement, container) => {
  if (['string', 'number'].includes(typeof reactElement)) {
    const node = document.createTextNode(String(reactElement));
    container.appendChild(node);
    return;
  }

  const actualDOMElement = document.createElement(reactElement.tag);

  if (reactElement.props) {
    Object.keys(reactElement.props)
      .filter(p => p !== 'children')
      .forEach(p => actualDOMElement[p] = reactElement.props[p]);
  }

  if (reactElement.props.children) {
    reactElement.props.children.forEach(child => render(child, actualDOMElement));
  }

  container.appendChild(actualDOMElement);
};

render(<App/>, document.querySelector('#app'));
