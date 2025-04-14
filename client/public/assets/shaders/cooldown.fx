precision mediump float;

varying vec2 outTexCoord;
uniform sampler2D uTexture;
uniform float testing;
uniform float cooldown_time;
uniform float textureX;
uniform float textureY;

float angleBetweenPoints(vec2 p1, vec2 p2) {

    vec2 v1 = p2 - p1;
    vec2 v2 = normalize(v1); // Normalize the vector
    float dotProduct = dot(v2, vec2(0.0, 1.0)); // Dot product with the y-axis
    float angle = acos(dotProduct);
    if(p2.x >= 0.5){
        return angle;
    }
    else{
        return 3.14 * 2.0 - angle;
    }
}

void main() {
    vec4 color = texture2D(uTexture, vec2(outTexCoord.x, 1.0 - outTexCoord.y));
    if(cooldown_time >= 0.0){
        vec4 cooldown_color = vec4(color.r*0.5, color.g*0.5, color.b*0.9, color.a);
        float angle = angleBetweenPoints(vec2(0.5, 0.5), vec2(outTexCoord.x, outTexCoord.y));
        if(angle < cooldown_time){
            gl_FragColor = color;
        }
        else{
            gl_FragColor = cooldown_color;
        }
    }
    else
        gl_FragColor = color;
}