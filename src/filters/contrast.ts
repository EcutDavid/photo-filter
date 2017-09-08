export default `
  precision mediump float;
  uniform vec4 filterArea;
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform float contrast;
  void main() {
    vec4 sampleColor = texture2D(uSampler, vTextureCoord);
    sampleColor.xyz += contrast / 50.0;
    gl_FragColor = sampleColor;
  }
`;
