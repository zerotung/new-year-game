var canvas = document.createElement("canvas");
var cxt = canvas.getContext("2d");

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

        // 添加电脑端使用时的鼠标点击事件
        canvas.addEventListener('click', function(e) {

            // e.pageX, e.pageY 为相对整个屏幕的坐标值
            var bbox = canvas.getBoundingClientRect();
            var x = e.pageX,
                y = e.pageY;

            // 计算实际相对 canvas 的坐标值
            x = Math.floor(x - bbox.left * (canvas.width / bbox.width));
            y = Math.floor(y - bbox.top * (canvas.height / bbox.height));

            ball.clickBall(x, y);
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

            ball.clickBall(x, y);
        });
    }
}

var ball = {

    // 初始化小球的位置、速度、重力、半径
    posX: canvasStage.stageWidth / 2,
    posY: canvasStage.stageHeight / 2,
    speedX: 20,
    speedY: -50,
    gravity: 10,
    r: 25,

    // 将小球数据初始化
    init: function() {
        this.posX = canvasStage.stageWidth / 2;
        this.posY = canvasStage.stageHeight / 2;
        this.speedX = 0;
        this.speedY = -50;
        this.gravity = 10;
        this.r = 25;
        this.render();
    },

    // 点击小球后小球数据的改变
    clickBall: function(x, y) {

        // 判断点击是否在允许范围内
        // 允许点击的位置在小球下方一个半径的距离 点击半径比小球半径大5像素
        if (((x - this.posX) * (x - this.posX) + (y - this.r - this.posY) * (y - this.r - this.posY)) < ((this.r + 5) * (this.r + 5))) {
            // 小球的获取向上 70 的速度
            this.speedY = -70;
            player.gotScore();
            // 玩家每得 3 分小球半径减小 1 像素
            this.r -= player.getScore() % 3 == 0 ? 1 : 0;
            // 小球在 x 方向的速度根据点击的横坐标与小球中心的横坐标相关
            this.speedX = Math.floor(((this.posX - x) / this.r) * 20)
        } else {
            console.log('out!')
        }
    },

    // 小球下一状态的各个数据的改变
    fly: function() {

        // x = x0 + v(x) * t
        this.posX = this.posX + this.speedX * 0.2;
        // y = y0 + v(y) * t + 1/2 * g * t^2
        this.posY = this.posY + this.speedY * 0.2 + 0.5 * this.gravity * 0.2;

        // 如果超出屏幕范围
        if ((this.posY - this.r) > canvasStage.stageHeight) {
            // 如果是触到底边弹起则使用注释中的代码，且将判断条件中的 '-' 改为 '+'
            // this.speedY = -this.speedY * 0.8;
            // this.posY = canvasStage.stageHeight - this.r;

            // 游戏结束
            player.end();
        }

        // 如果触碰左右边界
        if ((this.posX + this.r) > canvasStage.stageWidth || (this.posX - this.r) < 0) {
            // x 方向速度反向
            this.speedX = -this.speedX;
        }

        // v(y) = v0(y) + g * t
        this.speedY = this.speedY + this.gravity * 0.2;

        this.render();
    },

    // 渲染小球
    render: function() {

        // 清空画布
        cxt.clearRect(0, 0, canvasStage.stageWidth, canvasStage.stageHeight);

        // 画出小球
        cxt.fillStyle = "#FF0000";
        cxt.beginPath();
        cxt.arc(this.posX, this.posY, this.r, 0, Math.PI * 2, true);
        cxt.closePath();
        cxt.fill();
    }
}

// 玩家的构造函数
function Player() {

    // 玩家得分
    var score = 0;
    // 控制小球 setInterval 状态
    var ballState;

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
        titleBoxDOM.innerHTML = '接住小红球';
        hintBoxDOM.className = 'hint-box';
        hintBoxDOM.innerHTML = '点击小球<br>防止小球掉落';

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
        scoreBarDOM.innerHTML = 'score: ';
        scoreNumDOM.innerHTML = '0';
        scoreBarDOM.appendChild(scoreNumDOM);
        gameDOM.appendChild(scoreBarDOM);
        stage.appendChild(gameDOM);
        document.getElementsByClassName('game-page')[0].appendChild(canvas); // 添加 canvas

        ball.init();

        // 每 20ms 计算一次下一个点的位置
        ballState = setInterval(function() {
            ball.fly();
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

        clearInterval(ballState);

        endDOM.className = 'end-page';
        resultBoxDOM.className = 'result-box';
        resultTextDOM.className = 'result-text';
        resultTextDOM.innerHTML = 'YOUR SCORE';
        resultNumDOM.className = 'result-num';

        resultNumDOM.innerHTML = player.getScore() + '';
        resultBoxDOM.appendChild(resultTextDOM);
        resultBoxDOM.appendChild(resultNumDOM);

        restartBtnDOM.className = 'restart-btn';
        restartBtnDOM.innerHTML = '重新开始';

        restartBtnDOM.addEventListener('click', function() {
            player.startGame();
        });

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
// 初始化 canvas 舞台
canvasStage.initStage();
// 实例化对象
var player = new Player();
// 进入 ready 状态
player.ready();