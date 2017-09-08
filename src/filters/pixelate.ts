export default `
precision mediump float;
varying vec2 vTextureCoord;
uniform vec2 size;
uniform sampler2D uSampler;
uniform vec4 filterArea;

vec2 mapCoord(vec2 coord) {
  return coord * filterArea.xy;
}

vec2 unmapCoord(vec2 coord) {
  return coord / filterArea.xy;
}

vec2 pixelate(vec2 coord, vec2 size) {
	return floor(coord / size) * size;
}

void main(void) {
  vec2 coord = mapCoord(vTextureCoord);
  coord = pixelate(coord, size);
  coord = unmapCoord(coord);
  gl_FragColor = texture2D(uSampler, coord);
}`;
