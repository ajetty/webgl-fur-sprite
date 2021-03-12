function changeFOV(value) {
    document.getElementById("sliderFOV").innerHTML = value;
}

function changeRotate() {
    rotateFlag = !rotateFlag;
    if(rotateFlag) {
        document.getElementById("rotateToggle").innerHTML = "ON";
    }else {
        document.getElementById("rotateToggle").innerHTML = "OFF";
    }
}

function changeDivide(value) {
    document.getElementById("sliderSubdivide").innerHTML = value;
}

function changeLayers(value) {
    document.getElementById("sliderLayers").innerHTML = value;
}

function changeHairLength(value) {
    document.getElementById("sliderHairLength").innerHTML = value;
}

function changeHairDroop(value) {
    document.getElementById("sliderHairDroop").innerHTML = value;
}