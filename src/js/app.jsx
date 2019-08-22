import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';

import {Container} from "./components";

let App = createReactClass({
  render() {
    return (
      <div>
        <h1>Number Folding Puzzels</h1>
        <p>(...description...see <a href="https://github.com/jungleford/math-folding/blob/master/docs/index.md" target="_blank">here</a>)</p>
        <Container/>
      </div>
    );
  }
});

ReactDOM.render(<App />, $('#root').get(0));
