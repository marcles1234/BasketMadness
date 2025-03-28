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
        var rect = new Phaser.Geom.Rectangle(1068, 12, 200, 116);
        graphics.fillStyle(0x929596, 1);
        graphics.lineStyle(2, 0x656666, 1)
        graphics.fillRectShape(rect);
        graphics.strokeRectShape(rect);


        var text = this.add.text(1088, 32, 'Time: 40', {fontSize: '28px', fill: '#ffffff',});
        this.scoreText = this.add.text(1088, 80, 'Score: ', {fontSize: '28px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        this.scoreText.setOrigin(0, 0);

        var timeTrack = 40;

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: function() {
                timeTrack -= 1;
                text.setText('Time: ' + timeTrack)
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
        var questionNum;
        if (savedQandAs[0] === undefined) { // fill array if empty
            for (var i = 0; i < 20; i++) {
                if (i % 2 == 0) {
                    savedQandAs[i] = i  + '+' + (i+1)
                } else if (i % 2 == 1) {
                    var tempAnswer = i + (i+1) - 2;
                    savedQandAs[i] = tempAnswer
                }
            }
        }
        do {
            questionNum = Math.floor(Math.random() * 20);
        } while (questionNum % 2 == 1 || this.registry.get(questionNum.toString()) == 1)
        this.questionNum = questionNum;
        this.answerNum = questionNum + 1;
        this.savedQandAs = savedQandAs;
    },

    create: function() {
        var graphics = this.add.graphics();
        var rect = new Phaser.Geom.Rectangle(100, 100, 300, 152);
        graphics.fillStyle(0x929596, 1);
        graphics.lineStyle(2, 0x656666, 1)
        graphics.fillRectShape(rect);
        graphics.strokeRectShape(rect);
        var rect = new Phaser.Geom.Rectangle(100, 352, 300, 152);
        graphics.fillRectShape(rect);
        graphics.strokeRectShape(rect);
        var button = new Phaser.Geom.Rectangle(780, 295, 255, 68);
        graphics.fillRectShape(button);
        graphics.strokeRectShape(button);
        graphics.setInteractive(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height), Phaser.Geom.Rectangle.Contains);

        var text = this.add.text(120, 120, 'Question:', {fontSize: '32px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var text = this.add.text(800, 315, 'Submit Answer', {fontSize: '28px', fill: '#ffffff',});
        text.setOrigin(0, 0);

        var text = this.add.text(120, 200, 'What is ' + this.savedQandAs[this.questionNum] + '?', { font: '32px Courier', fill: '#ffffff',});
        this.answer = this.savedQandAs[this.answerNum];

        this.add.text(120, 372, 'Enter answer:', { font: '32px Courier', fill: '#ffffff' });
        this.textAnswer = this.add.text(120, 452, '', { font: '32px Courier', fill: '#ffffff' });
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
                    this.registry.set(this.questionNum.toString(), 1);
                    this.registry.inc('completions', 1)
                    if (this.registry.get('completions') == 10) {
                        for (var i = 0; i < 20; i++) {
                            this.registry.set(i.toString(), 0)
                        }
                    }
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
        this.load.image('zone', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/Zone.png');
        this.load.image('hand', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/Hand.png');
        this.load.image('cutHand', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/HandOverlay.png');
        this.notCaught = true;
    },

    create: function() {
        var graphics = this.add.graphics();
        var button = new Phaser.Geom.Rectangle(540, 350, 200, 200);
        graphics.fillStyle(0x929596, 0);
        graphics.lineStyle(2, 0x656666, 0)
        graphics.fillRectShape(button);
        graphics.strokeRectShape(button);
        this.zone = this.add.image(640, 450, 'zone');
        this.handRight = this.add.image(790, 470, 'hand');
        this.handLeft = this.add.image(490, 470, 'hand');
        this.handLeft.setFlipX(true);

        graphics.setInteractive(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height), Phaser.Geom.Rectangle.Contains);
        this.graphics = graphics;
        this.ball = this.add.image(640, 200, 'ball');
        this.buttonNotClicked = true;
    },

    update: function() {
        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        async function questionClear(pointer, gameObject){
            if (this.ball.y > 430 && this.ball.y < 465){
                if (this.buttonNotClicked) {
                    this.buttonNotClicked = false;
                    this.registry.inc('score', 10);
                    this.notCaught = false;
                    this.cutHandRight = this.add.image(790, 470, 'cutHand');
                    this.cutHandLeft = this.add.image(490, 470, 'cutHand');
                    this.cutHandLeft.setFlipX(true);
                    this.ball.x = 640;
                    this.ball.y = 450;
                    for (var i = 0; i < 35; i++) {
                        this.handRight.x -= 2;
                        this.handLeft.x += 2;
                        this.cutHandRight.x -= 2;
                        this.cutHandLeft.x += 2;
                        await sleep(5);
                    }
                    this.scene.start("throw")
                }
            } else {
                this.scene.start("question")
            }
        }
        this.graphics.on('pointerdown', questionClear, this);
        
        if (this.notCaught) {
            this.ball.y += 2;
        }
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
        this.load.image('bar', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/PowerMeter.png');
        this.load.image('hand', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/Hand.png');
        this.load.image('cutHand', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/HandOverlay.png');
        this.load.image('behindHand', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/HandBehind.png');
        this.load.image
        var distance = Math.floor(Math.random() * 70) + 1;
        var height = Math.floor(Math.random() * 70) + 1;
        var power = Math.sqrt((distance * distance) + (height * height))
        this.distance = distance;
        this.height = height;
        this.powerLower = power - 0.5;
        this.powerUpper = power + 0.5
    },

    create: function() {
        var rectGraphics = this.add.graphics();
        var button = new Phaser.Geom.Rectangle(880, 295, 255, 68);
        rectGraphics.fillStyle(0x929596, 1);
        rectGraphics.lineStyle(2, 0x656666, 1)
        rectGraphics.fillRectShape(button);
        rectGraphics.strokeRectShape(button);
        this.powerBar = this.add.image(795, 300, 'bar');
        rectGraphics.setInteractive(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height), Phaser.Geom.Rectangle.Contains);

        var text = this.add.text(900, 315, 'Power: 50', {fontSize: '28px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var powerValue = 50;

        var distanceText = this.add.text(900, 211, 'Distance: ' + this.distance, {fontSize: '28px', fill: '#000000',});
        var heightText = this.add.text(900, 253, 'Height: ' + this.height, {fontSize: '28px', fill: '#000000',});

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
                var powerLevel = Math.floor(powerValue - (polyGraphics.y/4));
                this.powerLevel = powerLevel
                text.setText('Power: ' + powerLevel);
            },
            this
        );

        this.rectGraphics = rectGraphics;
        this.polyGraphics = polyGraphics;

        this.handRight = this.add.image(720, 470, 'hand');
        this.handLeft = this.add.image(560, 470, 'hand');
        this.handLeft.setFlipX(true);
        this.ball = this.add.image(640, 450, 'ball');
        this.cutHandRight = this.add.image(720, 470, 'cutHand');
        this.cutHandLeft = this.add.image(560, 470, 'cutHand');
        this.cutHandLeft.setFlipX(true);
        this.buttonNotClicked = true;
    },

    update: function(){
        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        async function questionClear(pointer, gameObject){
            if (this.powerLevel < this.powerUpper && this.powerLevel > this.powerLower){
                if (this.buttonNotClicked) {
                    this.buttonNotClicked = false;
                    this.scene.pause("timer");
                    this.handRight.destroy();
                    this.handLeft.destroy();
                    this.cutHandRight.destroy();
                    this.cutHandLeft.destroy();
                    this.backHandRight = this.add.image(720, 470, 'behindHand')
                    this.backHandLeft = this.add.image(560, 470, 'behindHand')
                    this.backHandLeft.setFlipX(true);
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
        var button = new Phaser.Geom.Rectangle(440, 205, 400, 200);
        graphics.fillStyle(0x929596, 1);
        graphics.lineStyle(2, 0x656666, 1)
        graphics.fillRectShape(button);
        graphics.strokeRectShape(button);
        graphics.setInteractive(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height), Phaser.Geom.Rectangle.Contains);

        var text = this.add.text(460, 225, 'Congratulations! \n\nYou have won!', {fontSize: '31px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var text = this.add.text(460, 361, 'Click this box to re-set', {fontSize: '24px', fill: '#ffffff',});
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
        var button = new Phaser.Geom.Rectangle(420, 205, 440, 200);
        graphics.fillStyle(0x929596, 1);
        graphics.lineStyle(2, 0x656666, 1)
        graphics.fillRectShape(button);
        graphics.strokeRectShape(button);
        graphics.setInteractive(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height), Phaser.Geom.Rectangle.Contains);

        var text = this.add.text(440, 225, 'Times up! \n\nBetter luck next time!', {fontSize: '31px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var text = this.add.text(440, 361, 'Click this box re-try.', {fontSize: '24px', fill: '#ffffff',});
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
