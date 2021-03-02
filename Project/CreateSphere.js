"use strict";

let createSphere = function (timesToSubdivide) {
    let sphereVertices = [];
    let sphereNormals = [];
    let index = 0;

    let boundary = 0.09;
    let posIncrease = vec4(1.00, 1.00, 1.00, 0);
    let threshold = 0.90;

    //initial tetrahedron vertex points - equilateral triangle
    const va = vec4(0, 0, -1, 1);
    const vb = vec4(0, 0.942809, 0.333333, 1);
    const vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    const vd = vec4(0.816497, -0.471405, 0.333333, 1);

    function pushTriangleVertices(a, b, c) {
        index += 3; //keeps track of where we are in size with the vertices in array

        // if(a[0] > threshold || b[0] > threshold || c[0] > threshold) {
        //     console.log("test");
        //     if(a[0] < 1.0 - threshold) {
        //         a = add(a, posIncrease);
        //     }
        //     if(b[0] < 1.0 - threshold) {
        //         b = add(b, posIncrease);
        //     }
        //     if(c[0] < 1.0 - threshold) {
        //         c = add(c, posIncrease);
        //     }
        //
        // }

        sphereVertices.push(a);
        sphereVertices.push(b);
        sphereVertices.push(c);

        // let aLength = distance(a,b);
        // let bLength = distance(b,c);
        // let cLength = distance(a,c);

        //console.log(`triangle: ${aLength} ${bLength} ${cLength}`);

        //let minDistance = Math.min(aLength,bLength,cLength);

        // if(minDistance < boundary) {
        //     console.log(`min: ${minDistance} pos: ${a} ${b} ${c}`);
        //     a = add(a, posIncrease);
        //     b = add(b, posIncrease);
        //     c = add(c, posIncrease);
        //
        //     console.log(`CHANGED: ${a} ${b} ${c}`);
        // }


        sphereNormals.push(vec4(a[0], a[1], a[2], 0.0));
        sphereNormals.push(vec4(b[0], b[1], b[2], 0.0));
        sphereNormals.push(vec4(c[0], c[1], c[2], 0.0));

        //console.log(`INDEX: ${index}`);
    }

    function distance(p1, p2) {
        let distAB = Math.sqrt(Math.pow((p1[0] - p2[0]), 2) + Math.pow((p1[1] - p2[1]), 2) + Math.pow((p1[2] - p2[2]), 2));
        return distAB;
    }

    function cartesianToSpherical(p) {
        let r = length(p);
        let theta = Math.acos(p.z / r)
        let fi = Math.atan(p.y / p.x)
        let uv = vec2(theta, fi);
        return
    }

    //sierpinski's gasket for reference on how we are subdividing this triangle recursively
    function divideTriangle(a, b, c, count) {
        if (count > 0) {
            //find the halfway point and normalize it between all three points of triangle
            let ab = normalize(mix(a, b, 0.5), true);
            let ac = normalize(mix(a, c, 0.5), true);
            let bc = normalize(mix(b, c, 0.5), true);

            //recursively find the halfway points/subdivide of each new point until the base case is reached
            divideTriangle(a, ab, ac, count - 1);
            divideTriangle(ab, b, bc, count - 1);
            divideTriangle(bc, c, ac, count - 1);
            divideTriangle(ab, bc, ac, count - 1);
        } else {
            pushTriangleVertices(a, b, c);
        }
    }

    function createTetrahedron(a, b, c, d, n) {
        divideTriangle(a, b, c, n);
        divideTriangle(d, c, b, n);
        divideTriangle(a, d, b, n);
        divideTriangle(a, c, d, n);
    }

    createTetrahedron(va, vb, vc, vd, timesToSubdivide);

    return {"vertices": sphereVertices, "index": index, "normals": sphereNormals};
}