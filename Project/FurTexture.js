"use strict";

let createFurTexture = function(vertices, layers) {

    let texture = 3500;

    let textureCoordsArray = [];

    let alpha = [...Array(layers+1).keys()];

    let texCoord = [
        vec2(0, 0),
        vec2(0.5, 1),
        vec2(1, 0)
    ]

    let index = 0;
    let minBoundary = 0.70;
    let maxBoundary = 1.0;

    let lastUV = vec2(0, 0);

    function createTextureCoordsArray() {
        vertices.forEach(vertexPos => {
            index += 1;
            textureCoordsArray.push(cartesianToSpherical(vertexPos))
        });
    }

    function cartesianToSpherical(p)
    {
        let r = 1;
        let theta = Math.acos(p[1] / r) / 3.14 + 0.5;
        let fi = Math.atan2(p[2],p[0]) / 6.28 + 0.5;
        let uv = vec2(theta,fi);


        let sDiff = Math.abs(uv[0] - lastUV[0]);
        let tDiff = Math.abs(uv[1] - lastUV[1]);

        if(tDiff > 0.25) {
            //console.log(`diff: ${tDiff}`);
            //console.log(`current: ${uv[0]} ${uv[1]}`);
            //console.log(`last   : ${lastUV[0]} ${lastUV[1]}`);
            uv[1] -= 1.0;
            //console.log(`new    : ${uv[0]} ${uv[1]}`);
            //console.log("  ");
        }

        lastUV = uv;

        return uv;
    }

    function createImage() {
        let image = new Image();
        image.src = '../Images/seamless-giraffe-fur-background.jpg';

        texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.generateMipmap(gl.TEXTURE_2D);

    }

    createTextureCoordsArray();
    createImage();

    return {"textureCoordsArray": textureCoordsArray, "texture": texture, "alpha": alpha};
}