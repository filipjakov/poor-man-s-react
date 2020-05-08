const React = {
  // VDOM
  createElement: (tag, props, ...children) => {
    const element = { tag, props: { ...props, children } };
    console.log(element);
    return element;
  }
};

const a = <div className="react-2020">
  <h1>Hello, person</h1>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam non doloremque officiis necessitatibus architecto cumque commodi expedita? Porro deserunt laboriosam officia delectus! Accusantium cum minima, eligendi fugit deleniti unde ex vitae quae nesciunt quam soluta ab at, harum consequatur consectetur?</p>
</div>;
