#version 300 es
precision mediump float;

in vec4 aPosition;
in vec4 aNormal;
in vec2 aTexCoord;

out vec3 N, L, E;
out vec2 vTexCoord;
out float vCurrentLayer;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec4 uLightPosition;
uniform mat3 uNormalMatrix;
uniform float uCurrentLayer;
uniform float uHairLength;
uniform float uHairDroop;

void main()
{

    vec4 vPosition = aPosition + aNormal * uCurrentLayer * uHairLength;

    //give fur hairs a slight curve projectory
    float dist = uCurrentLayer * uHairLength * uHairDroop;
    vPosition += dist * dist * vec4(0.0,-0.1,0.0, 0.0);

    vec3 pos = (uModelViewMatrix * aPosition).xyz;

    //check for directional light
    if(uLightPosition.w == 0.0) {
        L = normalize(uLightPosition.xyz);
    } else {
        L = normalize(uLightPosition.xyz - pos);
    }

    E =  -normalize(pos);
    N = normalize( uNormalMatrix*aNormal.xyz);

    //gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;

    gl_Position = uProjectionMatrix * uModelViewMatrix * vPosition;

    //multiplying the y tex coordinate by a factor of 2 fixes the stretched spots on the texture
    vTexCoord = aTexCoord * vec2(1,2);

    vCurrentLayer = uCurrentLayer;

}
