import * as React from 'react';

interface IProps {
  saveToBase64(): void;
  clearSignaturePad(): void;
}

export default class Buttons extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <React.Fragment>
        <button id="save" onClick={this.props.saveToBase64}>
          Save
        </button>
        <button id="clear" onClick={this.props.clearSignaturePad}>
          Clear
        </button>
      </React.Fragment>
    );
  }
}
