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
uniform float uTime;

void main()
{

    vec4 vPosition = aPosition + aNormal * uCurrentLayer * uHairLength;

    //Position.xyz * Frequency + Speed.xyz * Time
    vec3 sampleCoords = aPosition.xyz * 25.0 + vec3(0.3, 0.2, 0.2) * (uTime * 2.0);
    vec4 forceDirection = vec4(sin(sampleCoords).xyz * 0.03, 0.0);

    //give fur hairs a droop factor
    float displacement = uCurrentLayer * uHairLength * uHairDroop;

    //add gravity factor with displacement - x^2 * gravity
    vPosition += pow(displacement,2.0) * vec4(0.0,-0.1,0.0, 0.0);
    //add force direction factor with current layer - x^2 * force direction
    vPosition += pow(uCurrentLayer,2.0) * forceDirection;

    vec3 pos = (uModelViewMatrix * aPosition).xyz;

    //check for directional light
    if(uLightPosition.w == 0.0) {
        L = normalize(uLightPosition.xyz);
    } else {
        L = normalize(uLightPosition.xyz - pos);
    }

    E =  -normalize(pos);
    N = normalize( uNormalMatrix*aNormal.xyz);

    gl_Position = uProjectionMatrix * uModelViewMatrix * vPosition;

    //multiplying the y tex coordinate by a factor of 2 fixes the stretched spots on the texture
    vTexCoord = aTexCoord * vec2(1,2);

    vCurrentLayer = uCurrentLayer;

}
