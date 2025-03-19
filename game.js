// ************************* Scene to set the background  *************************
const bootBackground = {
    key: 'background',
    active: true,

    preload: function() {
        this.load.image('court', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/BasketCourt.png');
    },

    create: function() {
        this.add.image(0, 0, 'court').setOrigin(0, 0);
        this.registry.set('score', 0);
    }
};

// ************************* Scene to add timer  *************************
const bootTimer = {
    key: 'timer',
    active: true,

    create: function () {
        var graphics = this.add.graphics();
        var rect = new Phaser.Geom.Rectangle(868, 50, 400, 116);
        graphics.fillStyle(0x929596, 1);
        graphics.lineStyle(2, 0x656666, 1)
        graphics.fillRectShape(rect);
        graphics.strokeRectShape(rect);


        var text = this.add.text(888, 70, 'Time remaining: 20', {fontSize: '28px', fill: '#ffffff',});
        this.scoreText = this.add.text(888, 118, 'Score: ', {fontSize: '28px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        this.scoreText.setOrigin(0, 0);

        var timeTrack = 20;

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: function() {
                timeTrack -= 1;
                text.setText('Time remaining: ' + timeTrack)
                if (timeTrack <= 0) {
                    this.scene.start("fail")
                }
            },
            callbackScope: this,
            loop: true
        });
        this.graphics = graphics;
    },
    
    update: function() {
        this.scoreText.setText('Score: ' + this.registry.get('score'))
    }
};

// ************************* Inital question scene  *************************
const bootQuestion = {
    key: 'question',
    active: true,

    preload: function() {
        const savedQandAs = JSON.parse(localStorage.getItem('QandAs')) || []; //access localstorage for question data
        this.savedQandAs = savedQandAs;
        var questionNum;
        do {
            questionNum = Math.floor(Math.random() * 4);
        } while (questionNum % 2 == 1)
        this.questionNum = questionNum;
        this.answerNum = questionNum + 1;
        console.log(this.questionNum);
        console.log(this.answerNum);
        console.log(savedQandAs[this.questionNum]);
        console.log(savedQandAs[this.answerNum]);
    },

    create: function() {
        var graphics = this.add.graphics();
        var rect = new Phaser.Geom.Rectangle(100, 100, 300, 440);
        graphics.fillStyle(0x929596, 1);
        graphics.lineStyle(2, 0x656666, 1)
        graphics.fillRectShape(rect);
        graphics.strokeRectShape(rect);
        var button = new Phaser.Geom.Rectangle(780, 295, 255, 68);
        graphics.fillRectShape(button);
        graphics.strokeRectShape(button);
        graphics.setInteractive(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height), Phaser.Geom.Rectangle.Contains);

        var text = this.add.text(120, 120, 'Question Time!', {fontSize: '31px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var text = this.add.text(800, 315, 'Submit Answer', {fontSize: '28px', fill: '#ffffff',});
        text.setOrigin(0, 0);

        var text = this.add.text(120, 300, 'What is ' + this.savedQandAs[this.questionNum] + '?', { font: '32px Courier', fill: '#ffffff',});
        this.answer = this.savedQandAs[this.answerNum];

        this.add.text(120, 350, 'Enter answer:', { font: '32px Courier', fill: '#ffffff' });
        this.textAnswer = this.add.text(120, 400, '', { font: '32px Courier', fill: '#ffff00' });
        this.input.keyboard.on('keydown', event =>
        {
            if (event.keyCode === 8 && this.textAnswer.text.length > 0)
            {
                this.textAnswer.text = this.textAnswer.text.substr(0, this.textAnswer.text.length - 1);
            }
            else if (event.keyCode === 32 || (event.keyCode >= 48 && event.keyCode <= 90))
            {
                this.textAnswer.text += event.key;
            }
        });

        this.graphics = graphics;
        this.buttonNotClicked = true;
    },

    update: function() {
        function questionClear(pointer, gameObject){
            if (this.buttonNotClicked) {
                if (this.textAnswer.text == this.answer) {
                    this.buttonNotClicked = false;
                    this.registry.inc('score', 10);
                    this.scene.start("catch")
                }
            }
        }
        this.graphics.on('pointerdown', questionClear, this);
    }
};


// ************************* Catching the ball scene  *************************
const bootCatch = {
    key: 'catch',

    preload: function() {
        this.load.image('ball', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/ball.png');
    },

    create: function() {
        var graphics = this.add.graphics();
        var text = this.add.text(120, 120, 'Catch!', {fontSize: '31px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var button = new Phaser.Geom.Rectangle(540, 350, 200, 200);
        graphics.fillStyle(0x929596, 1);
        graphics.lineStyle(2, 0x656666, 1)
        graphics.fillRectShape(button);
        graphics.strokeRectShape(button);

        graphics.setInteractive(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height), Phaser.Geom.Rectangle.Contains);
        this.graphics = graphics;
        this.ball = this.add.image(640, 200, 'ball');
        this.buttonNotClicked = true;
    },

    update: function() {
        function questionClear(pointer, gameObject){
            if (this.ball.y > 430 && this.ball.y < 465){
                if (this.buttonNotClicked) {
                    this.buttonNotClicked = false;
                    this.registry.inc('score', 10);
                    this.scene.start("throw")
                }
            } else {
                this.scene.start("question")
            }
        }
        this.graphics.on('pointerdown', questionClear, this);
        
        this.ball.y += 2;
        if (this.ball.y > 520) {
            this.ball.y = 150;
        }
    }
};


// ************************* Ball throw scene  *************************
const bootThrow = {
    key: 'throw',

    preload: function() {
        this.load.image('ball', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/ball.png');
        this.load.image('net', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/net.png');
    },

    create: function() {
        var rectGraphics = this.add.graphics();
        var button = new Phaser.Geom.Rectangle(880, 295, 255, 68);
        var bar = new Phaser.Geom.Rectangle(780, 100, 25, 400);
        rectGraphics.fillStyle(0x929596, 1);
        rectGraphics.lineStyle(2, 0x656666, 1)
        rectGraphics.fillRectShape(button);
        rectGraphics.strokeRectShape(button);
        rectGraphics.fillRectShape(bar);
        rectGraphics.strokeRectShape(bar);
        rectGraphics.setInteractive(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height), Phaser.Geom.Rectangle.Contains);

        var text = this.add.text(900, 315, 'Power: 50', {fontSize: '28px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var powerValue = 50;

        var polyGraphics = this.add.graphics();
        var arrow = new Phaser.Geom.Polygon([{x:800, y:300}, {x:810, y:310}, {x:850, y:310}, {x:850, y:290}, {x:810, y:290}]);
        polyGraphics.fillStyle(0x929596, 1);
        polyGraphics.lineStyle(2, 0x656666, 1)
        polyGraphics.fillPoints(arrow.points, true);
        polyGraphics.strokePoints(arrow.points, true);
        polyGraphics.setInteractive(new Phaser.Geom.Polygon(arrow.points), Phaser.Geom.Polygon.Contains);
        this.input.setDraggable(polyGraphics);
        const minY = -200;
        const maxY = 200;
        polyGraphics.on(
            "drag",
            function (pointer, dragX, dragY) {
                polyGraphics.y = Phaser.Math.Clamp(dragY, minY, maxY);
                text.setText('Power: ' + Math.floor(powerValue - (polyGraphics.y/4)));
            },
            this
        );

        this.rectGraphics = rectGraphics;
        this.polyGraphics = polyGraphics;

        this.ball = this.add.image(640, 450, 'ball');
        this.buttonNotClicked = true;
    },

    update: function(){
        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        async function questionClear(pointer, gameObject){
            if (this.polyGraphics.y > 100){ //Need a power level less than 25 to succeed
                if (this.buttonNotClicked) {
                    this.buttonNotClicked = false;
                    this.scene.pause("timer");
                    for (i = 0; i < 32; i++) {
                        var scale = 1 - (i / 50);
                        this.ball.setScale(scale);
                        this.ball.y -= 12;
                        if (i <= 16) {
                            await sleep(25);
                        } else if (i >=17 && i <= 26) {
                            await sleep(45);
                        } else {
                            await sleep(55)
                        }
                    }
                    this.net = this.add.image(642, 159.5, 'net');
                    for (i = 0; i < 32; i++) {
                        if (i <= 6) {
                            this.ball.y += 12;
                            var scale = 0.36 - (i / 200);
                            this.ball.setScale(scale);
                            await sleep(55);
                        } else if (i >=5 && i <= 12) {
                            this.ball.y += 3;
                            await sleep(150);
                        }
                    }
                    this.registry.inc('score', 10);
                    this.scene.start("end")
                }
            }
        }
        this.rectGraphics.on('pointerdown', questionClear, this);
    }
};


// ************************* End scene  *************************
const bootEnd = {
    key: 'end',

    preload: function () {
        this.scene.pause("timer")
    },

    create: function() {
        var graphics = this.add.graphics();
        var button = new Phaser.Geom.Rectangle(500, 150, 400, 200);
        graphics.fillStyle(0x929596, 1);
        graphics.lineStyle(2, 0x656666, 1)
        graphics.fillRectShape(button);
        graphics.strokeRectShape(button);
        graphics.setInteractive(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height), Phaser.Geom.Rectangle.Contains);

        var text = this.add.text(520, 170, 'End! Click to re-do.', {fontSize: '31px', fill: '#ffffff',});
        text.setOrigin(0, 0);

        this.graphics = graphics;
    },
    
    update: function() {
        function questionClear(pointer, gameObject){
            this.scene.start("question")
            this.scene.start("timer")
        }
        this.graphics.on('pointerdown', questionClear, this);
    }
};


// ************************* Fail scene  *************************
const bootFail = {
    key: 'fail',

    preload: function() {
        this.scene.stop("question")
        this.scene.stop("catch")
        this.scene.stop("throw")
    },

    create: function() {
        var graphics = this.add.graphics();
        var button = new Phaser.Geom.Rectangle(500, 150, 400, 200);
        graphics.fillStyle(0x929596, 1);
        graphics.lineStyle(2, 0x656666, 1)
        graphics.fillRectShape(button);
        graphics.strokeRectShape(button);
        graphics.setInteractive(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height), Phaser.Geom.Rectangle.Contains);

        var text = this.add.text(520, 170, 'Fail! Click to re-do.', {fontSize: '31px', fill: '#ffffff',});
        text.setOrigin(0, 0);

        this.graphics = graphics;
        this.registry.set('score', 0);
    },
    
    update: function() {
        function questionClear(pointer, gameObject){
            this.scene.start("question")
            this.scene.start("timer")
        }
        this.graphics.on('pointerdown', questionClear, this);
    }
};


// Initalise the game and scenes
new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 610,
    scene: [bootBackground, bootQuestion, bootCatch, bootThrow, bootEnd, bootFail, bootTimer],
});
