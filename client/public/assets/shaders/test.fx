precision mediump float;

varying vec2 outTexCoord;
uniform sampler2D uTexture;
uniform float brightness;

void main(){
    vec4 color = texture2D(uTexture, vec2(outTexCoord.x,outTexCoord.y));
    gl_FragColor = color;
}