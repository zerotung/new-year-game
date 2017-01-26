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

// var player = function() {
//     var score = 0;
//     return function() {
//         score += 1;
//         console.log(score);
//         document.getElementById('score').getElementsByTagName('span')[0].innerHTML = score;
//         return score;
//     }
// }
// var score = player();

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
        // document.getElementsByClassName('game-page')[0].appendChild(canvas); // 添加 canvas
        // document.getElementById("canvas-stage").addEventListener("click", function() {
        //     console.log('yes!')
        // });
        // 
        canvas.addEventListener('click', function(e) {
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

            // console.log(e.touches[0].clientX, e.touches[0].clientY)
        });
        // ball.init();
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
        if (((x - this.posX) * (x - this.posX) + (y - this.r - this.posY) * (y - this.r - this.posY)) < ((this.r + 5) * (this.r + 5))) {
            // console.log("in!")
            this.speedY = -70;
            player.gotScore();
            this.r -= player.getScore() % 3 == 0 ? 1 : 0;
            this.speedX = Math.floor(((this.posX - x) / this.r) * 20)
        } else {
            console.log('out!')
        }
    },

    fly: function() {
        this.posX = this.posX + this.speedX * 0.2;
        this.posY = this.posY + this.speedY * 0.2 + 0.5 * this.gravity * 0.2;
        if ((this.posY - this.r) > canvasStage.stageHeight) { // 超出屏幕范围
            // this.speedY = -this.speedY * 0.8;
            // this.posY = canvasStage.stageHeight - this.r;

            player.end();
        }
        if ((this.posX + this.r) > canvasStage.stageWidth || (this.posX - this.r) < 0) {
            this.speedX = -this.speedX;
        }
        this.speedY = this.speedY + this.gravity * 0.2;

        this.render();
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

function Player() {
    this.state = 0;
    var score = 0;
    var ballState;

    this.ready = function() {
        var stage = document.getElementsByClassName('stage')[0];
        if (stage.getElementsByTagName('div')[0]) {
            stage.removeChild(stage.getElementsByTagName('div')[0]);
        }

        var readyDOM = document.createElement('div');
        readyDOM.className = 'ready-page';
        var titleBoxDOM = document.createElement('div');
        titleBoxDOM.className = 'title-box';
        titleBoxDOM.innerHTML = '接住小红球';
        var hintBoxDOM = document.createElement('div');
        hintBoxDOM.className = 'hint-box';
        hintBoxDOM.innerHTML = '点击小球<br>防止小球掉落';

        var startBtnDOM = document.createElement('div');
        startBtnDOM.innerHTML = '开始游戏';
        startBtnDOM.className = 'start-btn';

        startBtnDOM.addEventListener('click', function() {
            this.startGame();
        }.bind(this));
        startBtnDOM.addEventListener('touchstart', function() {
            this.startGame();
        }.bind(this));

        readyDOM.appendChild(titleBoxDOM);
        readyDOM.appendChild(startBtnDOM);
        readyDOM.appendChild(hintBoxDOM);
        stage.appendChild(readyDOM);

    };

    this.startGame = function() {
        var stage = document.getElementsByClassName('stage')[0];
        if (stage.getElementsByTagName('div')[0]) {
            stage.removeChild(stage.getElementsByTagName('div')[0]);
        }

        score = 0; // 初始化分数

        var gameDOM = document.createElement('div');
        gameDOM.className = 'game-page';
        var scoreBarDOM = document.createElement('div');
        scoreBarDOM.className = 'score';
        scoreBarDOM.innerHTML = 'score: ';
        var scoreNumDOM = document.createElement('span');
        scoreNumDOM.innerHTML = '0';
        scoreBarDOM.appendChild(scoreNumDOM);
        gameDOM.appendChild(scoreBarDOM);
        stage.appendChild(gameDOM);
        document.getElementsByClassName('game-page')[0].appendChild(canvas); // 添加 canvas

        ball.init();

        ballState = setInterval(function() {
            ball.fly();
        }, 20);

    };

    this.end = function() {
        var stage = document.getElementsByClassName('stage')[0];
        if (stage.getElementsByTagName('div')[0]) {
            stage.removeChild(stage.getElementsByTagName('div')[0]);
        }

        clearInterval(ballState);

        var endDOM = document.createElement('div');
        endDOM.className = 'end-page';
        var resultBoxDOM = document.createElement('div');
        resultBoxDOM.className = 'result-box';
        var resultTextDOM = document.createElement('p');
        resultTextDOM.className = 'result-text';
        resultTextDOM.innerHTML = 'YOUR SCORE';
        var resultNumDOM = document.createElement('p');
        resultNumDOM.className = 'result-num';

        resultNumDOM.innerHTML = player.getScore() + '';
        resultBoxDOM.appendChild(resultTextDOM);
        resultBoxDOM.appendChild(resultNumDOM);

        var restartBtnDOM = document.createElement('div');
        restartBtnDOM.className = 'restart-btn';
        restartBtnDOM.innerHTML = '重新开始';

        restartBtnDOM.addEventListener('click', function() {
            player.startGame();
        });

        endDOM.appendChild(resultBoxDOM);
        endDOM.appendChild(restartBtnDOM);

        stage.appendChild(endDOM);

    };

    this.gotScore = function() {
        score += 1;
        document.getElementsByClassName('score')[0].getElementsByTagName('span')[0].innerHTML = score;
    }

    this.getScore = function() {
        return score;
    }
}
canvasStage.initStage();
var player = new Player();
player.ready();


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