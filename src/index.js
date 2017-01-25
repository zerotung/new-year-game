// let background = {

//     initStage: function() {
//         let canvas = document.createElement("canvas");
//         let cxt = canvas.getContext("2d");
//         canvas.width = 500;
//         canvas.height = 500;
//         document.getElementById('canvas-stage').appendChild(canvas);
//     },

//     initBall: function() {
//         console.log('hello');
//     }
// }

// background.initStage();
// background.initBall();
// 
var canvas = document.createElement("canvas");
var cxt = canvas.getContext("2d");

var stage = {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    get mid() {
        return [Math.floor(this.width / 2), Math.floor(this.height / 2)];
    }
}

var canvasStage = {

    maxWidth: 500,
    maxHeight: 500, // 初始化最大显示宽高

    get magn() {

        var magnW = stage.width > this.maxWidth ? 1 : (this.maxWidth / stage.width),
            magnH = stage.height > this.maxHeight ? 1 : (this.maxHeight / stage.height);

        return magnW > magnH ? magnW : magnH; // 计算宽高的比率;
    },

    get stageWidth() {

        return Math.floor(this.maxWidth / this.magn)
    },

    get stageHeight() {

        return Math.floor(this.maxHeight / this.magn); // 计算实际显示的宽高
    },

    initStage: function() {
        canvas.width = this.stageWidth;
        canvas.height = this.stageHeight; // 设置 canvas 的宽高
        $('#canvas-stage').append(canvas); // 添加 canvas
        // document.getElementById("canvas-stage").addEventListener("click", function() {
        //     console.log('yes!')
        // });
        $('canvas').click(function(e) {
            // console.log(e.pageX, e.pageY);
            var bbox = canvas.getBoundingClientRect();
            var x = e.pageX,
                y = e.pageY;
            x = Math.floor(x - bbox.left * (canvas.width / bbox.width));
            y = Math.floor(y - bbox.top * (canvas.height / bbox.height));

            // console.log(x, y)
            ball.clickBall(x, y);
        });
        canvas.addEventListener('touchstart', function(e) {
            var bbox = canvas.getBoundingClientRect();
            var x = e.touches[0].clientX,
                y = e.touches[0].clientY;
            x = Math.floor(x - bbox.left * (canvas.width / bbox.width));
            y = Math.floor(y - bbox.top * (canvas.height / bbox.height));

            console.log(x, y)

            // console.log(e.touches[0].clientX, e.touches[0].clientY)
        });
        ball.init();
    }
}

var ball = {
    posX: canvasStage.stageWidth / 2,
    posY: canvasStage.stageHeight / 2,
    speedX: 20,
    speedY: -50,
    gravity: 10,
    r: 25,

    init: function() {
        this.posX = canvasStage.stageWidth / 2;
        this.posY = canvasStage.stageHeight / 2;
        this.speedX = 0;
        this.speedY = -50;
        this.gravity = 10;
        this.r = 25;
        this.render();
    },

    clickBall: function(x, y) {
        if (((x - this.posX) ** 2 + (y - this.r - this.posY) ** 2) < ((this.r + 5) ** 2)) {
            // console.log("in!")
            this.speedY = -60;
            this.speedX = Math.floor(((this.posX - x) / this.r) * 20)
        } else {
            console.log('out!')
        }
    },

    render: function() {

        cxt.clearRect(0, 0, canvasStage.stageWidth, canvasStage.stageHeight);
        cxt.fillStyle = "#FF0000";
        cxt.beginPath();
        cxt.arc(this.posX, this.posY, this.r, 0, Math.PI * 2, true);
        // console.log(this.speedY)
        cxt.closePath();
        cxt.fill();
    }
}

canvasStage.initStage();

var ballFly = setInterval(function() {

    ball.posX = ball.posX + ball.speedX * 0.2;
    ball.posY = ball.posY + ball.speedY * 0.2 + 0.5 * ball.gravity * 0.2;
    if ((ball.posY + ball.r) > canvasStage.stageHeight) {
        ball.speedY = -ball.speedY * 0.8;
        ball.posY = canvasStage.stageHeight - ball.r;
    }
    if ((ball.posX + ball.r) > canvasStage.stageWidth || (ball.posX - ball.r) < 0) {
        ball.speedX = -ball.speedX;
    }
    ball.speedY = ball.speedY + ball.gravity * 0.2;
    // if (Math.abs(ball.speedY) < 1 && ball.posY > canvasStage.stageHeight - ball.r * 1.1) {
    //     clearInterval(ballFly);
    // }
    ball.render();
}, 20);

// $(document).ready(function() {
//     console.log('网页可见区域宽：' + document.body.clientWidth);
//     console.log('网页可见区域高：' + document.body.clientHeight);
//     console.log('网页可见区域宽：' + document.body.offsetWidth);
//     console.log('网页可见区域高：' + document.body.offsetHeight);
//     console.log('网页正文全文宽：' + document.body.scrollWidth);
//     console.log('网页正文全文高：' + document.body.scrollHeight);
//     console.log('网页被卷去的高：' + document.body.scrollTop);
//     console.log('网页被卷去的左：' + document.body.scrollLeft);
//     console.log('网页正文部分上：' + window.screenTop);
//     console.log('网页正文部分左：' + window.screenLeft);
//     console.log('屏幕分辨率的高：' + window.screen.height);
//     console.log('屏幕分辨率的宽：' + window.screen.width);
//     console.log('屏幕可用工作区高度：' + window.screen.availHeight);
//     console.log('屏幕可用工作区宽度：' + window.screen.availWidth);
// })