export default `
  precision mediump float;
  uniform vec4 filterArea;
  varying vec2 vTextureCoord;
  uniform sampler2D uSampler;
  uniform float saturation;
  void main() {
    vec4 sampleColor = texture2D(uSampler, vTextureCoord);
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec4 intensity = vec4(vec3(dot(sampleColor.xyz, W)), 1);
    gl_FragColor = mix(intensity, sampleColor, 1.0 + saturation / 20.0);
  }
`;
