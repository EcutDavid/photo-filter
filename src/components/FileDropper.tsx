import * as fileDialog from 'file-dialog';
import * as React from 'react';
import 'styles/fileDropper.scss';

interface IFileDroperState {
  isDragOver: boolean;
}
interface IFileDroperProps {
  handleImage(img: HTMLImageElement): void;
}

export default class FileDropper extends React.Component<IFileDroperProps, IFileDroperState> {
  constructor() {
    super();
    this.state = { isDragOver: false };
    // Disable default browser DND featrue such as open an image.
    // This is the not place to put these handlers actually.
    document.addEventListener('dragover', evt => evt.preventDefault());
    document.addEventListener('dragleave', evt => evt.preventDefault());
    document.addEventListener('drop', evt => evt.preventDefault());
  }

  handlefileDialog = () => {
    fileDialog()
      .then(files => {
        this.handleFileInput(files);
      });
  }

  hadnleDrop = (evt: React.DragEvent<{}>) => {
    this.setState({ isDragOver: false });
    evt.stopPropagation();
    evt.preventDefault();

    const files = evt.dataTransfer.files;
    this.handleFileInput(files);
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

  handleDragOver(evt, isDragOver) {
    evt.stopPropagation();
    evt.preventDefault();
    if (isDragOver !== this.state.isDragOver) {
      this.setState({ isDragOver });
    }
  }

  render() {
    const { isDragOver } = this.state;

    return (
      <div className="fileDroper">
        <div
          className={`receiver ${isDragOver ? 'onDragOver' : ''}`}
          onClick={this.handlefileDialog}
          onDragOver={evt => this.handleDragOver(evt, true)}
          onDragLeave={evt => this.handleDragOver(evt, false)}
          onDrop={this.hadnleDrop}
        >
          <div>
            <p>Drop your image here</p>
            <p>or</p>
            <p>Click here to select the image</p>
          </div>
        </div>
      </div>
    );
  }
}
