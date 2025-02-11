// ************************* Scene to set the background  *************************
const bootBackground = {
    key: 'background',
    active: true,

    preload: function() {
        this.load.image('court', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/BasketCourt.png');
    },

    create: function() {
        this.add.image(0, 0, 'court').setOrigin(0, 0);
    }
};

// ************************* Scene to add timer  *************************
const bootTimer = {
    key: 'timer',
    active: true,

    create: function () {
        var graphics = this.add.graphics();
        var rect = new Phaser.Geom.Rectangle(868, 50, 400, 68);
        graphics.fillStyle(0x929596, 1);
        graphics.lineStyle(2, 0x656666, 1)
        graphics.fillRectShape(rect);
        graphics.strokeRectShape(rect);
        var text = this.add.text(888, 70, 'Time remaining: 20', {fontSize: '28px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var timeTrack = 20;

        this.timer = this.time.addEvent({
            delay: 1000,
            callback: function() {
                timeTrack -= 1;
                text.setText('Time remaining: ' + timeTrack)
                if (timeTrack <= 0) {
                    this.scene.stop("question")
                    this.scene.stop("catch")
                    this.scene.stop("throw")
                    this.scene.start("end")
                }
            },
            callbackScope: this,
            loop: true
        });
        this.graphics = graphics;
    },
};
        
// ************************* Inital question scene  *************************
const bootQuestion = {
    key: 'question',
    active: true,

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

        this.graphics = graphics;
    },

    update: function() {
        function questionClear(pointer, gameObject){
            console.log('Rectangle clicked!');
            this.scene.start("catch")
        }
        this.graphics.on('pointerdown', questionClear, this);
    }
};


// ************************* Catching the ball scene  *************************
const bootCatch = {
    key: 'catch',

    preload: function() {
        this.load.image('ball', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/basketball.png');
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
        this.ball = this.add.image(640, 200, 'ball').setScale(0.5);
    },

    update: function() {
        function questionClear(pointer, gameObject){
            if (this.ball.y > 430 && this.ball.y < 465){
                console.log('Rectangle clicked!');
                this.scene.start("throw")
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
        this.load.image('ball', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/basketball.png');
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

        this.ball = this.add.image(640, 450, 'ball').setScale(0.5);
    },

    update: function(){
        function questionClear(pointer, gameObject){
            if (this.polyGraphics.y > 100){ //Need a power level less than 25 to succeed
                console.log('Rectangle clicked!');
                this.scene.start("end")
            }
        }
        this.rectGraphics.on('pointerdown', questionClear, this);
    }
};


// ************************* Ending scene  *************************
const bootEnd = {
    key: 'end',

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
            console.log('Rectangle clicked!');
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
    scene: [bootBackground, bootQuestion, bootCatch, bootThrow, bootEnd, bootTimer],
});
