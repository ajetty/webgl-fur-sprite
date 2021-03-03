"use strict";

//look up alpha blending

let timesToSubdivide = 5;
let gl;

let renderWindow = function () {
    let canvas;
    let program;

    let sphere;
    let baseTexture;
    let furTexture;

    let near = 0.1;
    let far = 14.0;
    let radius = 7.0;
    let theta = 0.0;
    let phi = 0.0;

    let  fovy = 50.0;       //field-of-view in Y direction angle (in degrees)
    let  aspect = 1.0;      //viewport aspect ratio

    let left = -2.0;
    let right = 2.0;
    let bottom = -2.0;
    let top = 2.0;

    let vertexColors = [];

    let modelViewMatrix, projectionMatrix, normalSphereMatrix, eye,
        modelViewMatrixLocation, projectionMatrixLocation, normalMatrixLocation;

    let cameraMatrix = mat4();
    let cameraAngleRotation = 0.0;

    let at = vec3(0.0, 0.0, 0.0);
    let up = vec3(0.0, 1.0, 0.0);

    let lightPosition = vec4(0.1, 2.7, 2.9, 0.0);
    let lightAmbient = vec4(0.0, 0.0, 0.0, 1.0);
    let lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
    let lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

    let materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
    let materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
    let materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
    let materialShininess = 20.0;

    window.onload = function init() {

        canvas = document.getElementById("gl-canvas");
        gl = canvas.getContext('webgl2');
        if (!gl) alert("WebGL 2.0 isn't available");

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

        aspect =  canvas.width/canvas.height;

        gl.disable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        sphere = createSphere(timesToSubdivide);
        baseTexture = createBaseTexture(sphere.vertices);
        furTexture = createFurTexture(sphere.vertices);

        //load shaders and initialize attribute buffers, create shader program
        program = initShaders(gl, "vertexShader.glsl", "fragmentShader.glsl");
        gl.useProgram(program);

        //load vertex buffer data into gpu
        const vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(sphere.vertices), gl.STATIC_DRAW);

        //associate out shader variables with our data buffer
        const aPosition = gl.getAttribLocation(program, "aPosition");
        gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);

        //load normal buffer data into gpu,
        const nBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(sphere.normals), gl.STATIC_DRAW);

        const aNormal = gl.getAttribLocation(program, "aNormal");
        gl.vertexAttribPointer(aNormal, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aNormal);

        //load texture buffer data into gpu,
        let tBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(baseTexture.textureCoordsArray), gl.STATIC_DRAW);

        let aTexCoord = gl.getAttribLocation(program, "aTexCoord");
        gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aTexCoord);

        //base texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, baseTexture.texture);
        gl.uniform1i(gl.getUniformLocation(program, "uBaseTexture"), 0);

        //fur texture
        gl.activeTexture(gl.TEXTURE0+1);
        gl.bindTexture(gl.TEXTURE_2D, furTexture.texture);
        gl.uniform1i(gl.getUniformLocation(program, "uFurTexture"), 1);



        //get uniform variable memory location from program
        modelViewMatrixLocation = gl.getUniformLocation(program, "uModelViewMatrix");
        projectionMatrixLocation = gl.getUniformLocation(program, "uProjectionMatrix");
        normalMatrixLocation = gl.getUniformLocation(program, "uNormalMatrix");

        //light matrices
        let ambientProduct = mult(lightAmbient, materialAmbient);
        let diffuseProduct = mult(lightDiffuse, materialDiffuse);
        let specularProduct = mult(lightSpecular, materialSpecular);

        //light uniforms sent to fragment shader
        gl.uniform4fv(gl.getUniformLocation(program, "uAmbientProduct"), flatten(ambientProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "uDiffuseProduct"), flatten(diffuseProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "uSpecularProduct"), flatten(specularProduct));
        gl.uniform4fv(gl.getUniformLocation(program, "uLightPosition"), flatten(lightPosition));

        gl.uniform1f(gl.getUniformLocation(program, "uShininess"), materialShininess);


        document.getElementById("fovSlider").onchange = function(event) {
            fovy = event.target.value;
        };

        document.getElementById("rotateXZSlider").onchange = function(event) {
            theta = event.target.value * (Math.PI/180);
        }

        document.getElementById("divideSlider").onchange = function(event) {
            timesToSubdivide = event.target.value;
            init();
        }

        render();
    }

    //for seam detection purpose
    function createColorList() {
        let red = 0;
        let green = 0;
        let blue = 0;

        //vertexColors.push(vec4(0.0, 0.0, 0.0, 1.0));

        let total = baseTexture.textureCoordsArray/(256 * 3);

        for(let i = 0; i < total; i++) {
            for(let r = 0; r < 256; r++) {
                vertexColors.push(vec4(1.0, 0.0, 0.0, 1.0));
            }
            for(let g = 0; g < 256; g++) {
                vertexColors.push(vec4(0.0, 1.0, 0.0, 1.0));
            }
            for(let b = 0; b < 256; b++) {
                vertexColors.push(vec4(0.0, 0.0, 1.0, 1.0));
            }
        }
    }


    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        eye = vec3(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));

        modelViewMatrix = lookAt(eye, at, up);
        projectionMatrix = perspective(fovy, aspect, near, far);

        normalSphereMatrix = normalMatrix(modelViewMatrix, true);

        gl.uniformMatrix4fv(modelViewMatrixLocation, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLocation, false, flatten(projectionMatrix));
        gl.uniformMatrix3fv(normalMatrixLocation, false, flatten(normalSphereMatrix))

        //for wire mesh
        //for (let i = 0; i < sphere.vertices.length; i += 3) {
        //    gl.drawArrays(gl.LINE_LOOP, i, 3);
        //}

        //for solid sphere
        gl.drawArrays(gl.TRIANGLES, 0, sphere.vertices.length);

        requestAnimationFrame(render);
    }
}

renderWindow();