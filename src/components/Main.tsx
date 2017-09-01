import * as PIXI from 'pixi.js';
import * as React from 'react';
import FileDropper from './FileDropper';

import 'styles/main.scss';

const RENDERER_WIDTH = 800;
const RENDERER_HEIGHT = 600;
const WIDTH_HEIGTH_RATIO = RENDERER_WIDTH / RENDERER_HEIGHT;

let pixiAPP: PIXI.Application;
class AppComponent extends React.Component<{}, {imgSrc: string}> {
  constructor() {
    super();
    this.state = { imgSrc: '' };
  }

  componentDidMount() {
    pixiAPP = new PIXI.Application();
    pixiAPP.renderer.autoResize = true;
    pixiAPP.renderer.resize(RENDERER_WIDTH, RENDERER_HEIGHT);
    (this.refs.pixi as HTMLElement).appendChild(pixiAPP.view);
  }

  handleFiles = event => {
    if (event.target.files && event.target.files.length === 1) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  handleImage = (img: HTMLImageElement) => {
    pixiAPP.stage.removeChildren();
    const sprite = PIXI.Sprite.from(img.src);
    pixiAPP.stage.addChild(sprite);
    sprite.texture.baseTexture.on('loaded', ({ height, width }) => {
      let ratio = 1;
      let xOffest = 0;
      let yOffest = 0;
      if (width > RENDERER_WIDTH || height > RENDERER_HEIGHT) {
        const temp = height * WIDTH_HEIGTH_RATIO;

        if (temp > width) {
          ratio = RENDERER_HEIGHT / height;
          xOffest = (1 - width / temp) / 2;
        } else {
          ratio = RENDERER_WIDTH / width;
          yOffest = (1 - temp / width) / 2;
        }
      }

      sprite.scale.set(ratio, ratio);
      sprite.x = xOffest * RENDERER_WIDTH;
      sprite.y = yOffest * RENDERER_HEIGHT;

      pixiAPP.render();
    });
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
        <div ref="pixi"></div>
      </div>
    );
  }
}

export default AppComponent;
