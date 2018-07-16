import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './css/index.css';

class App extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <div className="wrapper">
          <canvas id="signature-pad" className="signature-pad" />
        </div>
        <div>
          <button id="save">Save</button>
          <button id="clear">Clear</button>
        </div>
      </React.Fragment>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
