import * as PIXI from 'pixi.js';
import * as React from 'react';
import { fragmentShader } from '../filters/pixelate';
import FileDropper from './FileDropper';

import 'styles/main.scss';

const DEFAULT_RENDERER_WIDTH = 800;
const DEFAULT_RENDERER_HEIGHT = 600;
const WIDTH_HEIGTH_RATIO = DEFAULT_RENDERER_WIDTH / DEFAULT_RENDERER_HEIGHT;

let pixiAPP: PIXI.Application;
interface IComponentState {
  hasImg: boolean;
  pixelateX: number;
  pixelateY: number;
  blur: number;
}

export default class Main extends React.Component<{}, IComponentState> {
  private sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
  private needUpdateDownloadLink = false;

  constructor() {
    super();
    this.state = { hasImg: false, pixelateX: 4, pixelateY: 4, blur: 0 };
  }

  componentDidMount() {
    pixiAPP = new PIXI.Application({ backgroundColor: 0xffffff });
    pixiAPP.renderer.autoResize = true;
    pixiAPP.renderer.resize(0, 0);
    pixiAPP.stage.addChild(this.sprite);
    const blurFilter = new PIXI.filters.BlurFilter(3);
    const customizedFilter = new PIXI.Filter(
      PIXI.Filter.defaultVertexSrc,
      fragmentShader,
    );

    this.sprite.filters = [
      blurFilter,
      customizedFilter,
    ];
    (this.refs.pixi as HTMLElement).appendChild(pixiAPP.view);
    pixiAPP.ticker.add(() => {
      const { blur, pixelateX, pixelateY } = this.state;
      blurFilter.blur = blur;
      (customizedFilter.uniforms as any).size = [pixelateX, pixelateY];
      pixiAPP.render();
      if (this.needUpdateDownloadLink) {
        (this.refs.link as HTMLElement).setAttribute(
          'href',
          pixiAPP.renderer.view.toDataURL(),
        );
        this.needUpdateDownloadLink = false;
      }
    });
  }

  handleFiles = event => {
    if (event.target.files && event.target.files.length === 1) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  handleImage = (img: HTMLImageElement) => {
    this.sprite.texture = PIXI.Texture.from(img.src);

    this.sprite.texture.baseTexture.on('loaded', ({ height, width }) => {
      let ratio = 1;
      let rendererWidth = DEFAULT_RENDERER_WIDTH;
      let rendererHeight = DEFAULT_RENDERER_HEIGHT;
      pixiAPP.renderer.resize(rendererWidth, rendererHeight);
      if (width > DEFAULT_RENDERER_WIDTH || height > DEFAULT_RENDERER_HEIGHT) {
        const temp = height * WIDTH_HEIGTH_RATIO;

        if (temp > width) {
          ratio = DEFAULT_RENDERER_HEIGHT / height;
          rendererWidth = DEFAULT_RENDERER_WIDTH * width / temp;
        } else {
          ratio = DEFAULT_RENDERER_WIDTH / width;
          rendererHeight = DEFAULT_RENDERER_HEIGHT / (width / temp);
        }
      } else {
        rendererWidth = width < rendererWidth ? width : rendererWidth;
        rendererHeight = height < rendererHeight ? height : rendererHeight;
      }
      this.sprite.scale.set(ratio, ratio);

      pixiAPP.renderer.resize(rendererWidth, rendererHeight);
      this.setState({ hasImg: true });
      this.needUpdateDownloadLink = true;
    });
  }

  onSlideChangeGenerator = key => {
    return (evt: React.FormEvent<HTMLInputElement>) => {
      this.needUpdateDownloadLink = true;
      this.setState({ [key]: evt.currentTarget.value });
    };
  }

  render() {
    // TODO: generate sliders automatically instead of current solution
    const { hasImg, blur, pixelateX, pixelateY } = this.state;

    return (
      <div className="main">
        <div className="header">
          <h1>Photo Filter</h1>
        </div>
        <FileDropper handleImage={this.handleImage} />
        { hasImg && (
          <div className="control-panel">
            <div>
              <span>Blur: </span>
              <input
                type="range"
                min={0}
                max={20}
                value={blur}
                onChange={this.onSlideChangeGenerator('blur')}
              />
            </div>
            <div>
              <span>PixelateX: </span>
              <input
                type="range"
                min={1}
                max={20}
                value={pixelateX}
                onChange={this.onSlideChangeGenerator('pixelateX')}
              />
            </div>
            <div>
              <span>PixelateY: </span>
              <input
                type="range"
                min={1}
                max={20}
                value={pixelateY}
                onChange={this.onSlideChangeGenerator('pixelateY')}
              />
            </div>
          </div>
        )}
        <div
          className="pixi-container"
          ref="pixi"
          style={{ height: DEFAULT_RENDERER_HEIGHT, width: DEFAULT_RENDERER_WIDTH }}
        />
        { hasImg && <a ref="link" download="output.png" id="downloader">Download Image</a>}
      </div>
    );
  }
}
