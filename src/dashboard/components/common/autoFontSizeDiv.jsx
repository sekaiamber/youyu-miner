import React from 'react';
import 'jquery-textfill/source/jquery.textfill';

export default class AutoFontSizeDiv extends React.Component {
  state = {
    id: 'autoFont_' + parseInt(Math.random() * 1000, 10),
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    const { id } = this.state;
    const { minFontPixels, maxFontPixels } = this.props;
    window.$('#' + id).textfill({
      minFontPixels,
      maxFontPixels,
    });
  }

  render() {
    const { children, width, height, className } = this.props;
    const { id } = this.state;
    return (
      <div id={id} style={{ width, height }} className={className}>
        <span>{children}</span>
      </div>
    );
  }
}
