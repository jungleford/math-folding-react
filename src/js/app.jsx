import React from 'react';
import createReactClass from 'create-react-class';
import ReactDOM from 'react-dom';

import {Container} from "./components";

let App = createReactClass({
  render() {
    return (
      <div>
        <h1>Number Folding Puzzels</h1>
        <p>(...description...see README.md)</p>
        <Container/>
      </div>
    );
  }
});

ReactDOM.render(<App />, $('#root').get(0));
