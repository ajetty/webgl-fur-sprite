#version 300 es
precision mediump float;

uniform vec4 uAmbientProduct;
uniform vec4 uDiffuseProduct;
uniform vec4 uSpecularProduct;
uniform float uShininess;

uniform sampler2D uBaseTexture;
uniform sampler2D uFurTexture;

in vec3 N, L, E;
in vec2 vTexCoord;
in float vCurrentLayer;

out vec4 fColor;

void main()
{
    //mix(x,y,a) - x: start, y: end, a: value to interpolate between x and y
    float shadow = mix(0.0,1.0,vCurrentLayer);

    vec3 H = normalize( L + E );
    //float ambientBlend = 1.0-pow(1.0-vCurrentLayer,5.0);
    vec4 ambient = uAmbientProduct;// * mix(0.4, 1.0, ambientBlend);

    float Kd = max( dot(L, N), 0.0 );
    vec4  diffuse = Kd * uDiffuseProduct * shadow;

    vec4 furColor = texture(uFurTexture,vTexCoord);

    //vec4 diffuseCombine = (diffuse + ambient) * texture(uFurTexture,vTexCoord);
    vec4 diffuseCombine = (diffuse + ambient) * furColor;

    float Ks = pow( max(dot(N, H), 0.0), uShininess );
    vec4  specular = Ks * uSpecularProduct;

    if( dot(L, N) < 0.0 )
        specular = vec4(0.0, 0.0, 0.0, 1.0);

    vec4 vColor = diffuseCombine + specular;
    vColor.a = (vCurrentLayer == 0.0) ? 1.0 : max((texture(uBaseTexture,vTexCoord).r - vCurrentLayer), 0.0);

    fColor = vColor;
}