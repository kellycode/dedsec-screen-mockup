// animates the center circles

let canvas = document.getElementById("view_canvas_z2");
let ctx = canvas.getContext("2d");

let centerX = 275;// half of the svg center width
let centerY = 275;// half of the svg center height
let innerRadius = 200; // circle one
let middleRadius = 230; // circle two
let outerRadius = 270;
let arcLength = 360; // just a full circle
let stroke_color = "rgba(50, 100, 100, " + 0.8 + ")";
let lineWidth = 3;

let degrees = 0;
let radiusAdd = 0;

let shift = {
    0: 4,
    2: 8,
    4: 12,
    6: 16,
    8: 20,
    10: 20,
    12: 16,
    14: 12,
    16: 8,
    18: 4
};

// start here
radialDrawLoop();

function radialDrawLoop() {
    radialLine(degrees);
    degrees += 2;
    radiusAdd < 20 ? radiusAdd += 2 : radiusAdd = 0;
    if (degrees < arcLength) {
        radialDrawLoop();
    }
    else {
        restartDrawLoop();
    }
}

function restartDrawLoop() {
    setTimeout(function () {
        degrees = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        radialDrawLoop();
    }, 200);
}


function radialLine(degrees) {

    let add = Math.trunc(Math.random() * 20);
    let sub = Math.trunc(Math.random() * 10);
    let secAdd = Math.trunc(Math.random() * shift[radiusAdd]);

    let radians = degrees * Math.PI / 180;
    
    let innerX = centerX + (innerRadius - sub) * Math.cos(radians);
    let innerY = centerY + (innerRadius - sub) * Math.sin(radians);
    let outerX = centerX + (middleRadius + add) * Math.cos(radians);
    let outerY = centerY + (middleRadius + add) * Math.sin(radians);
    
    let secInnerX = centerX + outerRadius * Math.cos(radians);
    let secInnerY = centerY + outerRadius * Math.sin(radians);
    let secOuterX = centerX + (outerRadius + secAdd) * Math.cos(radians);
    let secOuterY = centerY + (outerRadius + secAdd) * Math.sin(radians);
    
    


    ctx.beginPath();
    ctx.setLineDash([2]);
    ctx.strokeStyle = stroke_color;
    ctx.lineWidth = lineWidth;
    // the inner busy lines
    ctx.moveTo(innerX, innerY);
    ctx.lineTo(outerX, outerY);
    // the outer lines
    ctx.moveTo(secInnerX, secInnerY);
    ctx.lineTo(secOuterX, secOuterY);
    
    ctx.stroke();
}