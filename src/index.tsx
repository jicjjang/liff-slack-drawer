import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SignaturePad from 'signature_pad';
import axios from 'axios';

import Pad from './components/Pad';
import Buttons from './components/Buttons';
import './css/index.css';

interface IState {
  signaturePad: SignaturePad | null;
}

class App extends React.Component<{}, IState> {
  public constructor(props: {}, state: IState) {
    super(props);

    this.clearSignaturePad = this.clearSignaturePad.bind(this);
    this.saveToBase64 = this.saveToBase64.bind(this);
    this._sendImage = this._sendImage.bind(this);

    this.state = {
      signaturePad: null
    };
  }

  public componentDidMount() {
    const canvas: HTMLCanvasElement | null = document.querySelector('#signature-pad');
    if (canvas) {
      canvas.setAttribute('width', (window.innerWidth - 40).toString());
      canvas.setAttribute('height', (window.innerHeight - 100).toString());

      this.setState(
        {
          signaturePad: new SignaturePad(canvas, {
            backgroundColor: 'rgb(238,238,238)'
          })
        },
        () => {
          this.clearSignaturePad();
        }
      );
    }
  }

  public clearSignaturePad(): void {
    if (this.state.signaturePad) {
      this.state.signaturePad.clear();
    }
  }

  public saveToBase64(): void {
    if (this.state.signaturePad) {
      this._sendImage(this.state.signaturePad.toDataURL('image/jpeg'));
    }
  }

  public render() {
    return (
      <React.Fragment>
        <div className="wrapper wrapper-pad">
          <Pad />
        </div>
        <div className="wrapper wrapper-buttons">
          <Buttons saveToBase64={this.saveToBase64} clearSignaturePad={this.clearSignaturePad} />
        </div>
      </React.Fragment>
    );
  }

  private _sendImage(base64Image: string): void {
    axios
      .post('/api', {
        timeout: 1000,
        data: {
          base64Image
        }
      })
      .then(res => {
        return res;
      })
      .catch(e => {
        return e;
      });
  }
}

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
