export default `
precision mediump float;
varying vec2 vTextureCoord;
uniform float size;
uniform sampler2D uSampler;
uniform vec4 filterArea;

vec2 mapCoord(vec2 coord) {
  return coord * filterArea.xy;
}

vec2 unmapCoord(vec2 coord) {
  return coord / filterArea.xy;
}

vec2 pixelate(vec2 coord, vec2 size) {
  vec2 addition = coord - (floor(coord / size)) * size;
  if(addition.x < addition.y) {
    return min((floor(coord / size) + 0.75), filterArea.xy / size) * size;
  } else {
    return min((floor(coord / size) + 0.25), filterArea.xy / size) * size;
  }
}

void main(void) {
  vec2 coord = mapCoord(vTextureCoord);
  coord = pixelate(coord, vec2(size, size));
  coord = unmapCoord(coord);
  gl_FragColor = texture2D(uSampler, coord);
}`;
