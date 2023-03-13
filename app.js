const lineWidthText = document.querySelector("#line-width-text");
const saveBtn = document.querySelector("#save-btn");
const textInput = document.querySelector("#text");
const fileInput = document.querySelector("#file");
const modeBtn = document.querySelector("#mode-btn");
const clearBtn = document.querySelector("#clear-btn");
const eraserBtn = document.querySelector("#eraser-btn");
const colorOptions = Array.from(document.querySelectorAll(".color-option"));
const color = document.querySelector("#color");
const lineWidth = document.querySelector("#line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d"); /*paint brush*/

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 900;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

let isPainting = false;
let isFilling = false;
let isErasing = false;

function onMove(event) {
    if (isPainting) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }
    ctx.moveTo(event.offsetX, event.offsetY);
}
function changeColor(event) {
    const targetValue = event.target.value;
    const datasetColor = event.target.dataset.color;
    if (targetValue === undefined) {
        ctx.strokeStyle = datasetColor;
        ctx.fillStyle = datasetColor;
    }
    else {
        ctx.strokeStyle = targetValue;
        ctx.fillStyle = targetValue;
    }
}
function startPainting() {
    isPainting = true;
    if(isFilling){
        ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
    }
}
function canclePainting() {
    isPainting = false;
    ctx.beginPath();
}
function onLineWidthChange(event) {
    ctx.lineWidth = event.target.value;
    lineWidthText.innerText = `Line Width : ${event.target.value}px`;
}
function onColorChange(event) {
    changeColor(event);
}
function onColorClick(event) {
    const colorValue = event.target.dataset.color;
    changeColor(event);
    color.value = colorValue;
}
function onModeClick(){
    if(isFilling){
        isFilling = false;
        modeBtn.innerText = "Mode : Draw";
    }
    else{
        isFilling = true;
        modeBtn.innerText = "Mode : Fill";
    }
}
function onClearClick(){
    ctx.fillStyle = "white"; 
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
}
function onEraserClick(){
    if(isErasing===false){
        ctx.save();
        ctx.strokeStyle = "white";
        isErasing = true;
        isFilling = false;
        modeBtn.innerText = "-";
        eraserBtn.innerText = "Eraser Off";
    }
    else{
        ctx.restore();
        eraserBtn.innerText = "⚪Eraser";
        isErasing = false;
        if(!isFilling){
            isFilling = false;
            modeBtn.innerText = "Mode : Draw";
        }
        else{
            isFilling = true;
            modeBtn.innerText = "Mode : Fill";
        }
    }
}
function onFileChange(event){
    const file = event.target.files[0];
    const url = URL.createObjectURL(file);
    const image = document.createElement("img");
    image.src = url;
    image.onload = function(){
        ctx.drawImage(image,0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        fileInput.value=null;
    }
}
function onDoubleClick(event){
    const text = textInput.value;
    if(text !== null){
        ctx.save();
        ctx.font="60px sans-serif";
        ctx.lineWidth=1;
        ctx.fillText(text,event.offsetX,event.offsetY);
        ctx.restore();
    }
}
function onSaveClick(){
    const url = canvas.toDataURL();
    const a = document.createElement("a");
    a.href = url;
    a.download = "myDrawing.png";
    a.click();
}
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", canclePainting);
canvas.addEventListener("mouseleave", canclePainting);
canvas.addEventListener("dblclick",onDoubleClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

colorOptions.forEach(color => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click",onModeClick);
clearBtn.addEventListener("click",onClearClick);
eraserBtn.addEventListener("click",onEraserClick);
fileInput.addEventListener("change",onFileChange);
saveBtn.addEventListener("click",onSaveClick);