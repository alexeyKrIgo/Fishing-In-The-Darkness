precision mediump float;

varying vec2 outTexCoord;
uniform sampler2D uTexture;
uniform float brightness;

void main(){
    vec4 color = texture2D(uTexture, vec2(outTexCoord.x, 1.0 - outTexCoord.y));
    gl_FragColor = vec4(color.r*brightness, color.g*brightness, color.b*brightness, color.a);
}