class CustomImage {
    constructor(image) {
        this.width = image.width;
        this.height = image.height;
        this.data = image.data;
    }
    getIndex(x, y) {
        if (x >= this.height || y >= this.width)
            throw "Index out of range";
        return x * (this.width * 4) + y * 4;
    }
    getColor(x, y) {
        let i = this.getIndex(y, x);
        return {
            red: this.data[i],
            green: this.data[i + 1],
            blue: this.data[i + 2],
            alpha: this.data[i + 3]
        };
    }
    setColor(x, y, color) {
        let i = this.getIndex(x, y);
        this.data[i] = color.red;
        this.data[i + 1] = color.green;
        this.data[i + 2] = color.blue;
        this.data[i + 3] = color.alpha;
    }
}

const height = 300;
const width = 300;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(width, height);
const img = new CustomImage(imageData);

function setInput(val) {
    document.getElementById("myRange").value = val;
    document.getElementById("slider-value").innerHTML = val;
}

function changeCanvas(rVal) {
    console.log(rVal);
    for (var x = 0; x < height; x++)
        for (var y = 0; y < width; y++) {
            img.setColor(x, y, { red: rVal, green: Math.floor(256 * x / width), blue: Math.floor(256 * y / height), alpha: 255 });
        }
    ctx.putImageData(imageData, 0, 0);
}


function valChanged(event, image) {
    const val = event.target.value;
    console.log(val);
    changeCanvas(val);
}

function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function getColor(x, y) {
    return img.getColor(x, y);
}

changeCanvas(0);
setInput(0);

document.getElementById("myRange").addEventListener('input', () => setInput(event.target.value));
document.getElementById("myRange").onchange = () => changeCanvas(event.target.value);
document.getElementById("canvas").onmousemove = (event => {
    let pos = getMousePos(event.target, event);
    let { x, y } = pos;
    if (x < width && y < height && x >= 0 && y >= 0) {
        let { red, green, blue } = getColor(Math.floor(x), Math.floor(y));
        document.getElementById("color").innerText = `rgb(${red}, ${green}, ${blue})`;
        document.getElementById("color-sample").style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    }
});

document.getElementById("canvas").onclick = ((event) => {
    var txt = document.getElementById("color").innerText;
    var el = document.createElement('textarea');
    document.body.appendChild(el);
    el.value = txt;
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    // alert('copied to clipboard');
    var tmpElement = document.createElement('div');
    tmpElement.className = "tmp-element";
    tmpElement.innerText = "color copied to clipboard";
    document.getElementById("tmp").appendChild(tmpElement);
    setTimeout(() => {
        document.getElementById("tmp").removeChild(tmpElement);
    }, 2000);
});