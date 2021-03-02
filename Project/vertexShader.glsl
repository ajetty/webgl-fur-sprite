#version 300 es
precision mediump float;

in vec4 aPosition;
in vec4 aNormal;
in vec2 aTexCoord;

out vec3 N, L, E;
out vec2 vTexCoord;
out float s, t;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform vec4 uLightPosition;
uniform mat3 uNormalMatrix;

void main()
{


    vec3 pos = (uModelViewMatrix * aPosition).xyz;

    float pi = acos(0.0);

    s= 0.5*acos(aPosition.x)/pi;
    t = 0.5*asin(aPosition.y/sqrt(1.0-aPosition.x*aPosition.x))/pi;


    //check for directional light

    if(uLightPosition.w == 0.0) {
        L = normalize(uLightPosition.xyz);
    } else {
        L = normalize(uLightPosition.xyz - pos);
    }

    E =  -normalize(pos);
    N = normalize( uNormalMatrix*aNormal.xyz);

    gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;

    vTexCoord = aTexCoord;




}
