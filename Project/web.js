"use strict";

//draw a sphere
//create gui interface with bootstrap

let renderWindow = function () {
    let canvas;
    let gl;
    let program;

    let sphere;

    let near = -10;
    let far = 10;
    let radius = 6.0;
    let theta = 0.0;
    let phi = 0.0;

    let left = -2.0;
    let right = 2.0;
    let bottom = -2.0;
    let top = 2.0;

    let timesToSubdivide = 5;

    let modelViewMatrix, projectionMatrix, eye, modelViewMatrixLocation, projectionMatrixLocation;

    let at = vec3(0.0, 0.0, 0.0);
    let up = vec3(0.0, 1.0, 0.0);

    window.onload = function init() {

        canvas = document.getElementById("gl-canvas");
        gl = canvas.getContext('webgl2');
        if (!gl) alert("WebGL 2.0 isn't available");

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

        gl.enable(gl.DEPTH_TEST);

        sphere = createSphere(timesToSubdivide);

        //load shaders and initialize attribute buffers, create shader program
        program = initShaders(gl, "vertexShader.glsl", "fragmentShader.glsl");
        gl.useProgram(program);

        //load vertex buffer data into gpu,
        const vBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, flatten(sphere.vertices), gl.STATIC_DRAW);

        //associate out shader variables with our data buffer
        const aPosition = gl.getAttribLocation(program, "aPosition");
        gl.vertexAttribPointer(aPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aPosition);

        //get uniform variable memory location from program
        modelViewMatrixLocation = gl.getUniformLocation(program, "uModelViewMatrix");
        projectionMatrixLocation = gl.getUniformLocation(program, "uProjectionMatrix");

        render();
    }


    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        eye = vec3(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));

        modelViewMatrix = lookAt(eye, at, up);
        projectionMatrix = ortho(left, right, bottom, top, near, far);

        gl.uniformMatrix4fv(modelViewMatrixLocation, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLocation, false, flatten(projectionMatrix));

        //for wire mesh
        // for (let i = 0; i < sphere.index; i += 3) {
        //     gl.drawArrays(gl.LINE_LOOP, i, 3);
        // }

        //for solid sphere
        gl.drawArrays(gl.TRIANGLES, 0, sphere.vertices.length)

        requestAnimationFrame(render);
    }
}

renderWindow();