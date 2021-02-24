"use strict";

//draw a sphere
//create gui interface with bootstrap
//https://webgl2fundamentals.org/webgl/lessons/webgl-visualizing-the-camera.html

let renderWindow = function () {
    let canvas;
    let gl;
    let program;

    let sphere;

    let near = 0.1;
    let far = 14.0;
    let radius = 7.0;
    let theta = 0.0;
    let phi = 0.0;
    let dr = 5.0 * Math.PI/180.0;

    let  fovy = 50.0;       //field-of-view in Y direction angle (in degrees)
    let  aspect = 1.0;      //viewport aspect ratio
    let rotateXZ = 0.0;     //rotation in xz plane (in degrees)

    let left = -2.0;
    let right = 2.0;
    let bottom = -2.0;
    let top = 2.0;

    let timesToSubdivide = 5;

    let modelViewMatrix, projectionMatrix, eye,
        modelViewMatrixLocation, projectionMatrixLocation;

    let cameraMatrix = mat4();
    let cameraAngleRotation = 0.0;

    let at = vec3(0.0, 0.0, 0.0);
    let up = vec3(0.0, 1.0, 0.0);

    window.onload = function init() {

        canvas = document.getElementById("gl-canvas");
        gl = canvas.getContext('webgl2');
        if (!gl) alert("WebGL 2.0 isn't available");

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

        aspect =  canvas.width/canvas.height;

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
        
        document.getElementById("fovSlider").onchange = function(event) {
            fovy = event.target.value;
        };

        document.getElementById("rotateXZSlider").onchange = function(event) {
            theta = event.target.value * (Math.PI/180);
        }

        render();
    }


    function render() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        eye = vec3(radius * Math.sin(theta) * Math.cos(phi), radius * Math.sin(theta) * Math.sin(phi), radius * Math.cos(theta));

        modelViewMatrix = lookAt(eye, at, up);
        projectionMatrix = perspective(fovy, aspect, near, far);

        gl.uniformMatrix4fv(modelViewMatrixLocation, false, flatten(modelViewMatrix));
        gl.uniformMatrix4fv(projectionMatrixLocation, false, flatten(projectionMatrix));

        //for wire mesh
        for (let i = 0; i < sphere.index; i += 3) {
            gl.drawArrays(gl.LINE_LOOP, i, 3);
        }

        //for solid sphere
        //gl.drawArrays(gl.TRIANGLES, 0, sphere.vertices.length)

        requestAnimationFrame(render);
    }

    function moveCamera() {

    }
}

renderWindow();