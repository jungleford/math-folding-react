import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';

import {Container} from "./components";

let App = createReactClass({
  render() {
    return (
      <div>
        <h1>Number Folding Puzzels</h1>
        <p>(...description...see <a href="https://github.com/jungleford/math-folding#background-%E5%AF%B9%E6%8A%98%E5%BA%8F%E5%88%97%E9%97%AE%E9%A2%98number-folding-problem" target="_blank">here</a>)</p>
        <Container/>
      </div>
    );
  }
});

ReactDOM.render(<App />, $('#root').get(0));
