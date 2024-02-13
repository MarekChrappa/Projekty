import React from 'react';
import ReactDOM from 'react-dom/client';

//const myFirstElement = <h1>Hello React!</h1>


function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function Form() {
  function handleSubmit(e) {
    e.preventDefault();
    console.log('You clicked submit.');
  }

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const element = <Welcome name="Sara" />;

const button = ReactDOM.createRoot(document.getElementById('button'));
const button_call = <Form />;

root.render(element);
button.render(button_call)
//root.render(myFirstElement);