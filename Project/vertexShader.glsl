#version 300 es
precision mediump float;

in vec4 aPosition;
in vec4 aNormal;
in vec2 aTexCoord;

out vec3 N, L, E;
out vec2 vTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec4 uLightPosition;
uniform mat3 uNormalMatrix;
uniform float uCurrentLayer;

void main()
{

    vec4 vPosition = aPosition + aNormal * uCurrentLayer;

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


    vTexCoord = aTexCoord;

}
