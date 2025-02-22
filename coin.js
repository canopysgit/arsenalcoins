// For the #WCCChallenge, theme: "from 0 to 1"
// I'm embarrassed to admit this, but I miss cash! 🪙💵
// Coin images: usmint.gov

let coin = 0;
let zoom = 1;
let tzoom = 1;
let orient, torient;
let cpos, tpos;
let denominations = [200, 100, 50, 20, 10, 5, 2, 1];
let faces = [];
let places = [];
let coins = [];
let value;  // 添加 value 变量声明
let slider;  // 添加 slider 变量声明
function makeRims() {
    // 为硬币添加边缘效果
    ambientMaterial(200);
    specularMaterial(100);
    shininess(50);
}
function preload() {
    faces.push(loadImage('twophead.jpg'));    // £2
    faces.push(loadImage('twoptails.jpg'));
    faces.push(loadImage('onephead.jpg'));    // £1
    faces.push(loadImage('oneptails.jpg'));
    faces.push(loadImage('fiftyhead.jpg'));   // 50p
    faces.push(loadImage('fiftytails.jpg'));
    faces.push(loadImage('twentyhead.jpg'));  // 20p
    faces.push(loadImage('twentytails.jpg'));
    faces.push(loadImage('tenhead.jpg'));     // 10p
    faces.push(loadImage('tentails.jpg'));
    faces.push(loadImage('fivehead.jpg'));    // 5p
    faces.push(loadImage('fivetails.jpg'));
    faces.push(loadImage('twohead.jpg'));     // 2p
    faces.push(loadImage('twotails.jpg'));
    faces.push(loadImage('onehead.jpg'));     // 1p
    faces.push(loadImage('onetails.jpg'));
}
function makePlaces() {
    const spacing = 300;  // 基础间距改小
    const closeSpacing = 250;  // 两个硬币时的间距
    const radius = spacing * 0.8;  // 5个硬币的环绕半径也相应调小
    
    for (let i = 0; i < 20; i++) {
        let row = [];
        let numCoins = i + 1;
        
        if (numCoins === 7) {
            // 中心一个，周围6个环绕
            row.push(createVector(0, 0));  // 中心
            // 从正上方开始，每60度放置一个硬币
            for (let j = 0; j < 6; j++) {
                let angle = -PI/2 + j * TWO_PI/6;  // 从正上方开始，每60度一个
                let x = radius * cos(angle);
                let y = radius * sin(angle);
                row.push(createVector(x, y));
            }
        } else if (numCoins === 6) {
            // 中心一个，周围5个环绕
            row.push(createVector(0, 0));  // 中心
            // 从正上方开始，每72度放置一个硬币
            for (let j = 0; j < 5; j++) {
                let angle = -PI/2 + j * TWO_PI/5;  // 从正上方开始，每72度一个
                let x = radius * cos(angle);
                let y = radius * sin(angle);
                row.push(createVector(x, y));
            }
        } else if (numCoins === 5) {
            // 花瓣形布局：中心一个，四周环绕
            row.push(createVector(0, 0));  // 中心
            for (let j = 0; j < 4; j++) {
                let angle = j * PI/2;
                let x = radius * cos(angle);
                let y = radius * sin(angle);
                row.push(createVector(x, y));
            }
        } else if (numCoins === 4) {
            // 2x2 网格布局
            row.push(createVector(-spacing/2, -spacing/2));  // 左上
            row.push(createVector(spacing/2, -spacing/2));   // 右上
            row.push(createVector(-spacing/2, spacing/2));   // 左下
            row.push(createVector(spacing/2, spacing/2));    // 右下
        } else if (numCoins === 2) {
            // 两个硬币靠近一些
            row.push(createVector(-closeSpacing/2, 0));
            row.push(createVector(closeSpacing/2, 0));
        } else {
            // 其他数量保持一行
            for (let j = 0; j < numCoins; j++) {
                let x = map(j, 0, numCoins - 1, -spacing, spacing);
                row.push(createVector(x, 0));
            }
        }
        places.push(row);
    }
}

function nextCoins() {
    slider.value(coin);
    coins = [];
    clist = change(coin);
    let totalCoins = 0;
    
    // 计算总硬币数
    for (let c of clist) {
        totalCoins += c[1];
    }
    
    let coinIndex = 0;
    // 确保硬币按照网格位置排列
    for (let c of clist) {
        for (let i = 0; i < c[1]; i++) {
            if (coinIndex < places[totalCoins - 1].length) {
                let pos = places[totalCoins - 1][coinIndex];
                let tpos = createVector(pos.x, pos.y, 0);
                coins.push(new Coin(c[0], tpos, coinIndex));
                coinIndex++;
            }
        }
    }
}
// 恢复原来的 makeHTML 函数
function makeHTML() {
    value = createP('');
    value.position(0, -height / 5);
    value.style('color', 'rgba(255,255,255,0.5)');
    value.style('fontSize', (height / 5) + 'px');
    slider = createSlider(0, 200, 0, 1);  // 改为0-200便士（£2）
    slider.position(10, height / 5);
    slider.style('width', height / 2.4 + 'px');
    slider.style('opacity', 0.5);
    slider.changed(slideToValue);
}

// 将 setup 函数移到外面作为顶级函数
function setup() {
    cnv = createCanvas(windowWidth, windowHeight, WEBGL);
    cnv.mouseClicked(advanceCoin);
    makeHTML();
    makePlaces();
    processImages();
    makeRims();
    setTimeout(nextCoins, 1000);
}

function slideToValue() {
    coin = slider.value();
    frameCount = 0;
    for (let c of coins) {
        c.tpos.x = 2 * height / zoom;
    }
    setTimeout(nextCoins, 500);
}

function nextCoins() {
    slider.value(coin);
    coins = [];
    clist = change(coin);
    let count = 0;
    for (let c of clist) {
        for (let i = 0; i < c[1]; i++) {
            count++;
        }
    }
    let cnum = 0;
    for (let c of clist) {
        for (let i = 0; i < c[1]; i++) {
            let x = places[count - 1][cnum].x;
            let y = places[count - 1][cnum].y;;
            let tpos = createVector(x, y, 0);
            coins.push(new Coin(c[0], tpos, count - cnum));
            cnum += 1;
        }
    }
}
class Coin {
    constructor(denom, tpos, delay) {
        this.denom = denom;
        this.tpos = tpos;
        this.pos = createVector(2 * height, 0, 0);
        this.orient = createVector(0, 0, 0);
        this.torient = createVector(0, 0, 0);
        this.delay = delay;
    }

    move() {
        if (frameCount < this.delay * 2) return;
        this.pos.x = lerp(this.pos.x, this.tpos.x, 0.1);
        this.pos.y = lerp(this.pos.y, this.tpos.y, 0.1);
        this.pos.z = lerp(this.pos.z, this.tpos.z, 0.1);
        this.orient.x = lerp(this.orient.x, this.torient.x, 0.1);
        this.orient.y = lerp(this.orient.y, this.torient.y, 0.1);
        this.orient.z = lerp(this.orient.z, this.torient.z, 0.1);
    }
    show() {
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        rotateX(this.orient.x);
        rotateY(this.orient.y);
        rotateZ(this.orient.z);
        texture(faces[this.denom * 2]);
        plane(200, 200);
        translate(0, 0, -5);  // 增加到-15，让正反面间距更大
        rotateY(PI);
        texture(faces[this.denom * 2 + 1]);
        plane(200, 200);
        pop();
    }
}
//Adapted from: https://stackoverflow.com/questions/27854459/calculating-change-to-a-customer
function change(amount) {
    let res = [];
    for (let i = 0; amount > 0 && i < denominations.length; i++) {
        res.push([denominations.length - i - 1])
        let value = denominations[i];
        if (value <= amount) {
            let count = Math.floor(amount / value);
            amount -= value * count;
            res[i].push(count);
        } else {
            res[i].push(0);
        }
    }
    return res;
}

function processImages() {
    for (let f of faces) {
        f.loadPixels();
        let x = 0;
        let y = 0;
        for (let i = 0; i < f.pixels.length; i += 4) {
            if (dist(x, y, f.width / 2, f.height / 2) > (f.height / 2) * 0.98) f.pixels[i + 3] = 0;
            x += 1;
            if (x >= f.width) {
                x = 0;
                y += 1;
            }
        }
        f.updatePixels();
    }
}

function advanceCoin() {
    if (coin == 200) return;  // 改为200便士（£2）
    coin += 1;
    coin = constrain(coin, 0, 200);  // 改为200
    frameCount = 0;
    for (let c of coins) {
        c.tpos.x = 2 * height / zoom;
    }
    setTimeout(nextCoins, 500);
}

function draw() {
    background(0);
    value.html('£' + nf(slider.value() / 100, 1, 2));  // 改为£符号
    scale(zoom);
    ambientLight(200);
    pointLight(120, 120, 120, 0, height, height / 2);
    tzoom = map(mouseY, 0, height, 1.5, 0.2);
    zoom = lerp(zoom, tzoom, 0.1);
    shininess(5);
    for (let c of coins) {
        c.torient.x = map(mouseY, 0.2 * height, 0.8 * height, TAU, -TAU, true);
        c.torient.y = map(mouseX, 0.2 * width, 0.8 * width, -TAU, TAU, true);
        c.move();
        c.show();
    }
}