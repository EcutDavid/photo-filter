import * as React from 'react';
import FileDropper from './FileDropper';

import 'styles/main.scss';

class AppComponent extends React.Component<{}, {imgSrc: string}> {
  constructor() {
    super();
    this.state = { imgSrc: '' };
  }

  handleFiles = event => {
    if (event.target.files && event.target.files.length === 1) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.setState({imgSrc: e.target.result});
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  handleImage = (imgSrc: HTMLImageElement) => {
    console.log(imgSrc);

    // this.setState({ imgSrc });
  }

  // handleImage = (img: HTMLImageElement) => {
  //   console.log(img);
  // }

  render() {
    const { imgSrc } = this.state;

    return (
      <div className="index">
        <FileDropper handleImage={this.handleImage} />
        <img src={imgSrc} />
      </div>
    );
  }
}

export default AppComponent;
