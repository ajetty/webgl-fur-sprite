"use strict";

let createTexture = function(vertices) {

    let texture = 256;

    let textureCoordsArray = [];

    let texCoord = [
        vec2(0, 0),
        vec2(0.5, 1),
        vec2(1, 0)
    ]

    function createTextureCoordsArray() {
        vertices.forEach(vertexPos => textureCoordsArray.push(cartesianToSpherical(vertexPos)));
    }

    function cartesianToSpherical(p)
    {
        let r = 1;
        let theta = Math.acos(p[1] / r) / 3.14 + 0.5;
        let fi = Math.atan2(p[2],p[0]) / 6.28 + 0.5;
        let uv = vec2(theta,fi);
        return uv;
    }

    function createImage() {
        let image = new Image();
        image.src = '../Images/baseTexture.png';

        texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    }

    createTextureCoordsArray();
    createImage();

    return {"textureCoordsArray": textureCoordsArray, "texture": texture};
}