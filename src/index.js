class Ball {

    constructor(posX, posY, speedX, speedY, r, arc, w) {
        // this.initPosX = canvasStage.stageWidth / 2;
        // this.initPosY = canvasStage.stageHeight / 2;
        // this.initSpeedX = 20;
        // this.initSpeedY = -50;
        // this.initGravity = 10;
        // this.initR = 30;
        // this.initArc = 0;
        // this.initW = 0;
        this.initPosX = posX;
        this.initPosY = posY;
        this.initSpeedX = speedX;
        this.initSpeedY = speedY;
        this.initGravity = 10;
        this.initR = r;
        this.initArc = arc;
        this.initW = w;
        this.init();
    }

    init() {
        this.posX = this.initPosX;
        this.posY = this.initPosY;
        this.speedX = this.initSpeedX;
        this.speedY = this.initSpeedY;
        this.gravity = this.initGravity;
        this.r = this.initR;
        this.arc = this.initArc;
        this.w = this.initW;
    }

    // 小球下一状态的各个数据的改变
    fly() {

        this.arc = this.arc + this.w;
        this.arc = this.arc > 360 ? this.arc - 360 : this.arc;
        this.arc = this.arc < 0 ? this.arc + 360 : this.arc;

        // x = x0 + v(x) * t
        this.posX = this.posX + this.speedX * 0.2;
        // y = y0 + v(y) * t + 1/2 * g * t^2
        this.posY = this.posY + this.speedY * 0.2 + 0.5 * this.gravity * 0.2;

        // 如果触碰左右边界
        if ((this.posX + this.r) > canvasStage.stageWidth || (this.posX - this.r) < 0) {
            // x 方向速度反向
            this.speedX = -this.speedX;
        }

        // v(y) = v0(y) + g * t
        this.speedY = this.speedY + this.gravity * 0.2;

    }
}

class Fu extends Ball {

    constructor(posX, posY, speedX, speedY, r, arc, w) {
        super(posX, posY, speedX, speedY, r, arc, w);
    }

    clickFu(x, y) {

        // 判断点击是否在允许范围内
        // 允许点击的位置在小球下方一个半径的距离 点击半径比小球半径大5像素
        if (((x - this.posX) * (x - this.posX) + (y - this.r - this.posY) * (y - this.r - this.posY)) < (this.r * this.r * 4)) {
            // 小球的获取向上 70 的速度
            this.speedY = -70;
            player.gotScore();
            // 玩家每得 3 分小球半径减小 1 像素
            this.r -= player.getScore() % 3 == 0 ? 1 : 0;
            // 小球在 x 方向的速度根据点击的横坐标与小球中心的横坐标相关
            var posXRender = this.posX + Math.sin(this.arc * Math.PI / 180) * this.r;
            var posYRender = this.posY - Math.cos(this.arc * Math.PI / 180) * this.r;
            var vX = 10 * Math.sin(this.arc * Math.PI / 180); // 计算硬币的x轴速度
            var vY = this.speedY - 10 * Math.cos(this.arc * Math.PI / 180); // 计算硬币的y轴速度
            for (var i = 0; i < 4; i++) {
                var coin = new Coin(posXRender, posYRender, vX, vY, 12, 0, 10);
                coins.push(coin);
            }
            this.speedX = Math.floor(((this.posX - x) / this.r) * 20);
            this.w = Math.floor(((this.posX - x) / this.r) * 10);
        } else {
            console.log('out!')
        }
    }

    // 如果超出屏幕范围
    outStage() {
        if ((this.posY - this.r) > canvasStage.stageHeight) {
            // 如果是触到底边弹起则使用注释中的代码，且将判断条件中的 '-' 改为 '+'
            // this.speedY = -this.speedY * 0.8;
            // this.posY = canvasStage.stageHeight - this.r;

            // 游戏结束
            coins = [];
            player.end();
        }
    }
}

class Coin extends Ball {

    constructor(posX, posY, speedX, speedY, r, arc, w) {
        super(posX, posY, speedX, speedY, r, arc, w);
        this.speedX = this.speedX - 20 + 40 * Math.random();
        this.speedY = this.speedY - 10 + 20 * Math.random();
        this.img = imgObjs[Math.floor(Math.random() * imgObjs.length)];
    }

    outStage() {
        if ((this.posY - this.r) > canvasStage.stageHeight) {

        }
    }
}

var canvas = document.createElement("canvas");
var cxt = canvas.getContext("2d");

// 全局加载福袋图片 防止反复加载
var img = new Image();
img.src = "static/fu.png";
var imgObjs = [];

var imgCoin = new Image();
imgCoin.src = "static/coin.png";
imgObjs.push(imgCoin);
var imgDiamond = new Image();
imgDiamond.src = "static/diamond.png";
imgObjs.push(imgDiamond);
var imgGold = new Image();
imgGold.src = "static/gold.png";
imgObjs.push(imgGold);

// 预加载背景图
var imgStage = new Image();
imgStage.src = "static/bg.jpg";

var stage = {

    // 获取可视区域的宽高
    width: document.body.clientWidth,
    height: document.body.clientHeight,
    // 计算可视区域的中点
    get mid() {
        return [Math.floor(this.width / 2), Math.floor(this.height / 2)];
    }
}

var canvasStage = {

    // 初始化最大显示宽高
    maxWidth: 500,
    maxHeight: 500,

    // 计算宽高的比率
    get magn() {

        var magnW = stage.width > this.maxWidth ? 1 : (this.maxWidth / stage.width),
            magnH = stage.height > this.maxHeight ? 1 : (this.maxHeight / stage.height);

        return magnW > magnH ? magnW : magnH;
    },

    // 计算实际舞台宽度
    get stageWidth() {

        return Math.floor(this.maxWidth / this.magn)
    },

    // 计算实际舞台高度
    get stageHeight() {

        return Math.floor(this.maxHeight / this.magn);
    },

    // 初始化舞台
    initStage: function() {

        // 设置 canvas 的宽高
        canvas.width = this.stageWidth;
        canvas.height = this.stageHeight;

        // posX, posY, speedX, speedY, r, arc, w

        // 添加电脑端使用时的鼠标点击事件
        canvas.addEventListener('click', function(e) {

            // e.pageX, e.pageY 为相对整个屏幕的坐标值
            var bbox = canvas.getBoundingClientRect();
            var x = e.pageX,
                y = e.pageY;

            // 计算实际相对 canvas 的坐标值
            x = Math.floor(x - bbox.left * (canvas.width / bbox.width));
            y = Math.floor(y - bbox.top * (canvas.height / bbox.height));

            fu.clickFu(x, y);
        });

        // 添加手机端使用时触摸点击事件
        canvas.addEventListener('touchstart', function(e) {

            // 防止在触发 touchstart 事件的时候同时触发 click 事件
            e.preventDefault();

            // e.touches[0].clientX, e.touches[0].clientY 为相对整个屏幕的坐标值
            var bbox = canvas.getBoundingClientRect();
            var x = e.touches[0].clientX,
                y = e.touches[0].clientY;

            // 计算实际相对 canvas 的坐标值
            x = Math.floor(x - bbox.left * (canvas.width / bbox.width));
            y = Math.floor(y - bbox.top * (canvas.height / bbox.height));

            fu.clickFu(x, y);
        });
    },

    renderFu: function() {

        cxt.save();
        cxt.translate(fu.posX, fu.posY);
        cxt.rotate(fu.arc * Math.PI / 180); // 选择arc度
        cxt.translate(-fu.posX, -fu.posY);
        // cxt.drawImage(image1, xpos - image1.width / 2, ypos - image1.height / 2);
        cxt.drawImage(img, fu.posX - fu.r, fu.posY - fu.r, fu.r * 2, fu.r * 2);
        cxt.restore();
    },

    renderCoin: function() {

        coins.map(function(coin) {
            cxt.save();
            cxt.translate(coin.posX, coin.posY);
            cxt.rotate(coin.arc * Math.PI / 180); // 选择arc度
            cxt.translate(-coin.posX, -coin.posY);
            // cxt.drawImage(image1, xpos - image1.width / 2, ypos - image1.height / 2);
            cxt.drawImage(coin.img, coin.posX - coin.r, coin.posY - coin.r, coin.r * 2, coin.r * 2);
            cxt.restore();
        })
    },

    render: function() {

        // 清空画布
        cxt.clearRect(0, 0, canvasStage.stageWidth, canvasStage.stageHeight);

        // // 画出小球
        // cxt.fillStyle = "#FF0000";
        // cxt.beginPath();
        // cxt.arc(this.posX, this.posY, this.r, 0, Math.PI * 2, true);
        // cxt.closePath();
        // cxt.fill();
        this.renderFu();
        this.renderCoin();
    }
}

// 玩家的构造函数
function Player() {

    // 玩家得分
    var score = 0;
    // 控制小球 setInterval 状态
    var fuState;

    // 转换到 ready 状态
    this.ready = function() {
        var stage = document.getElementsByClassName('stage')[0],
            readyDOM = document.createElement('div'),
            titleBoxDOM = document.createElement('div'),
            hintBoxDOM = document.createElement('div'),
            startBtnDOM = document.createElement('div');

        if (stage.getElementsByTagName('div')[0]) {
            stage.removeChild(stage.getElementsByTagName('div')[0]);
        }

        readyDOM.className = 'ready-page';
        titleBoxDOM.className = 'title-box';
        titleBoxDOM.innerHTML = '接住福袋';
        hintBoxDOM.className = 'hint-box';
        hintBoxDOM.innerHTML = '点击福袋<br>防止福袋掉落';

        startBtnDOM.innerHTML = '开始游戏';
        startBtnDOM.className = 'start-btn';

        startBtnDOM.addEventListener('click', function() {
            this.startGame();
        }.bind(this));
        startBtnDOM.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.startGame();
        }.bind(this));

        readyDOM.appendChild(titleBoxDOM);
        readyDOM.appendChild(startBtnDOM);
        readyDOM.appendChild(hintBoxDOM);
        stage.appendChild(readyDOM);

    };

    // 转换到 开始游戏 状态
    this.startGame = function() {
        var stage = document.getElementsByClassName('stage')[0],
            gameDOM = document.createElement('div'),
            scoreBarDOM = document.createElement('div'),
            scoreNumDOM = document.createElement('span');

        if (stage.getElementsByTagName('div')[0]) {
            stage.removeChild(stage.getElementsByTagName('div')[0]);
        }

        score = 0; // 初始化分数

        gameDOM.className = 'game-page';
        scoreBarDOM.className = 'score';
        scoreBarDOM.innerHTML = 'SCORE: ';
        scoreNumDOM.innerHTML = '0';
        scoreBarDOM.appendChild(scoreNumDOM);
        gameDOM.appendChild(scoreBarDOM);
        stage.appendChild(gameDOM);
        document.getElementsByClassName('game-page')[0].appendChild(canvas); // 添加 canvas

        fu.init();

        // 每 20 ms 计算一次下一个点的位置
        fuState = setInterval(function() {
            fu.fly();
            coins.map(function(coin) {
                coin.fly();
            });
            canvasStage.render();
            fu.outStage();
        }, 20);

    };

    // 转换到 结算 状态
    this.end = function() {
        var stage = document.getElementsByClassName('stage')[0],
            endDOM = document.createElement('div'),
            resultBoxDOM = document.createElement('div'),
            resultTextDOM = document.createElement('p'),
            resultNumDOM = document.createElement('p'),
            restartBtnDOM = document.createElement('div');

        if (stage.getElementsByTagName('div')[0]) {
            stage.removeChild(stage.getElementsByTagName('div')[0]);
        }

        clearInterval(fuState);

        endDOM.className = 'end-page';
        resultBoxDOM.className = 'result-box';
        resultTextDOM.className = 'result-text';
        resultTextDOM.innerHTML = 'YOUR SCORE';
        resultNumDOM.className = 'result-num';

        resultNumDOM.innerHTML = this.getScore() + '';
        resultBoxDOM.appendChild(resultTextDOM);
        resultBoxDOM.appendChild(resultNumDOM);

        restartBtnDOM.className = 'restart-btn';
        restartBtnDOM.innerHTML = '重新开始';

        restartBtnDOM.addEventListener('click', function() {
            this.startGame();
        }.bind(this));
        restartBtnDOM.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.startGame();
        }.bind(this));

        endDOM.appendChild(resultBoxDOM);
        endDOM.appendChild(restartBtnDOM);

        stage.appendChild(endDOM);

    };

    // 玩家点在小球范围内获取分数
    this.gotScore = function() {
        score += 1;
        document.getElementsByClassName('score')[0].getElementsByTagName('span')[0].innerHTML = score;
    }

    // 获取玩家当前分数
    this.getScore = function() {
        return score;
    }
}

var fu = new Fu(canvasStage.stageWidth / 2, canvasStage.stageHeight / 2, 0, -50, 30, 0, 0);
var coins = [];

// 初始化 canvas 舞台
canvasStage.initStage();
// 实例化对象
var player = new Player();
// 进入 ready 状态
player.ready();