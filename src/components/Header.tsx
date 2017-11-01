import * as fileDialog from 'file-dialog';
import * as React from 'react';
import 'styles/header.scss';

interface IFileDroperProps {
  handleImage(img: HTMLImageElement): void;
}

export default class Header extends React.Component<IFileDroperProps> {
  handlefileDialog = () => {
    fileDialog()
      .then(files => {
        this.handleFileInput(files);
      });
  }

  handleFileInput = (files: FileList) => {
    if (files.length !== 1) {
      return alert('Just give me one file please :)');
    }

    const file = files[0];
    if (file.type.split('/')[0] !== 'image') {
      return alert('Only image files are supported :(');
    }
    this.readFile(file);
  }

  readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (evt: any) => {
      try {
        const img = new Image();
        img.src = evt.target.result;
        this.props.handleImage(img);
      } catch (e) {
        return alert(e);
      }
    };

    reader.readAsDataURL(file);
  }
  render() {

    return (
      <div className="header">
        <h1>Photo Filter</h1>
        <button className="button" onClick={this.handlefileDialog}>Open Photo</button>
        <img src='http://davidguan.me/book.jpg' />
      </div>
    );
  }
}
// <p>Drop your image here</p>
{/* <p>or</p> */ }
  // <p>Click here to select the image</p>