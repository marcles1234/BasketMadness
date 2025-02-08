const bootBackground = {
    key: 'background',
    active: true,
    preload: function() {
        this.load.image('court', 'https://raw.githubusercontent.com/marcles1234/BasketMadness/refs/heads/main/assets/BasketCourt.png');
    },
    create: function() {
        this.add.image(0, 0, 'court').setOrigin(0, 0);;
    }
};

const bootQuestion = {
    key: 'question',
    active: true,
    create: function() {
        var graphics = this.add.graphics();

        function drawRect(x, y, width, height) {
            var rect = new Phaser.Geom.Rectangle(x, y, width, height);
            graphics.fillRectShape(rect);
            graphics.strokeRectShape(rect);
        }
        graphics.fillStyle(0x929596, 1);
        graphics.lineStyle(2, 0x656666, 1)
        drawRect(100, 100, 300, 440);
        drawRect(780, 295, 255, 68);
        var button = new Phaser.Geom.Rectangle(500, 150, 200, 200);
        graphics.fillRectShape(button);
        graphics.strokeRectShape(button);

        graphics.setInteractive(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height), Phaser.Geom.Rectangle.Contains);

        var text = this.add.text(120, 120, 'Question Time!', {fontSize: '31px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var text = this.add.text(800, 315, 'Submit Answer', {fontSize: '28px', fill: '#ffffff',});
        text.setOrigin(0, 0);

        this.graphics = graphics;
    },
    update: function(){
        function questionClear(pointer, gameObject){
            console.log('Rectangle clicked!');
            this.scene.start("catch")
        }
        this.graphics.on('pointerdown', questionClear, this);
    }
};

const bootCatch = {
    key: 'catch',
    create: function() {
        var graphics = this.add.graphics();
        var text = this.add.text(120, 120, 'Catch!', {fontSize: '31px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var rect1 = new Phaser.Geom.Rectangle(500, 150, 200, 200);
        graphics.fillStyle(0x821526, 1);
        graphics.lineStyle(2, 0x159626, 1)
        graphics.fillRectShape(rect1);
        graphics.strokeRectShape(rect1);

        graphics.setInteractive(new Phaser.Geom.Rectangle(rect1.x, rect1.y, rect1.width, rect1.height), Phaser.Geom.Rectangle.Contains);
        this.graphics = graphics;
    },
    update: function(){
        function questionClear(pointer, gameObject){
            console.log('Rectangle clicked!');
            this.scene.start("throw")
        }
        this.graphics.on('pointerdown', questionClear, this);
    }
};

const bootThrow = {
    key: 'throw',
    create: function(){
        var graphics = this.add.graphics();
        var text = this.add.text(120, 120, 'Throw!', {fontSize: '31px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var rect = new Phaser.Geom.Rectangle(200, 150, 200, 200);
        graphics.fillStyle(0x525556, 1);
        graphics.lineStyle(2, 0x159626, 1)
        graphics.fillRectShape(rect);
        graphics.strokeRectShape(rect);
        graphics.setInteractive(new Phaser.Geom.Rectangle(rect.x, rect.y, rect.width, rect.height), Phaser.Geom.Rectangle.Contains);
        this.graphics = graphics;
    },
    update: function(){
        function questionClear(pointer, gameObject){
            console.log('Rectangle clicked!');
            this.scene.start("end")
        }
        this.graphics.on('pointerdown', questionClear, this);
    }
};

const bootEnd = {
    key: 'end',
    create: function() {
        var graphics = this.add.graphics();
        var text = this.add.text(120, 120, 'End!', {fontSize: '31px', fill: '#ffffff',});
        text.setOrigin(0, 0);
        var rect1 = new Phaser.Geom.Rectangle(500, 150, 200, 200);
        graphics.fillStyle(0x821526, 1);
        graphics.lineStyle(2, 0x159626, 1)
        graphics.fillRectShape(rect1);
        graphics.strokeRectShape(rect1);

        graphics.setInteractive(new Phaser.Geom.Rectangle(rect1.x, rect1.y, rect1.width, rect1.height), Phaser.Geom.Rectangle.Contains);
        this.graphics = graphics;
    },
    update: function(){
        function questionClear(pointer, gameObject){
            console.log('Rectangle clicked!');
        }
        this.graphics.on('pointerdown', questionClear, this);
    }
};

new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 610,
    scene: [bootBackground, bootQuestion, bootCatch, bootThrow, bootEnd],
});
