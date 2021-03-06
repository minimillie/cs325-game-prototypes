"use strict";

window.onload = function() {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, jump: jump, restartGame: restartGame, addOnePipe: addOnePipe, addRowOfPipes: addRowOfPipes, hitPipe: hitPipe } );
    
    function preload() {
        
        game.load.image( 'bird', 'assets/ghost.png' );
        game.load.image( 'pipe', 'assets/pillar.png' );
        game.load.audio( 'jump', 'assets/whoosh.wav');
    }
    
    var bouncy;
    
    function create() {
        
        game.stage.backgroundColor = '#71c5cf';
       
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.bird = game.add.sprite(100, 245, 'bird');
        
        game.physics.arcade.enable(this.bird);
        
        this.bird.body.gravity.y = 1000;
        
        var spaceKey = game.input.keyboard.addKey(
                        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        
        this.pipes = game.add.group();
        
        this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);
        
        this.score = 0;
        
        this.labelScore = game.add.text(20, 20, "0",
                                        { font: "30px Arial", fill: "#ffffff" });
        
        this.bird.anchor.setTo(-0.2, 0.5);
        
        this.jumpSound = game.add.audio('jump');
        
    }
    
    function update() {
       if (this.bird.y < 0 || this.bird.y > 490)
           this.restartGame()
       game.physics.arcade.overlap (
           this.bird, this.pipes, this.hitPipe, null, this);
       if (this.bird.angle < 20)
           this.bird.angle += 1;
    }
    
    function jump() {
        if (this.bird.alive == false)
            return;
        
        this.bird.body.velocity.y = -350;
        
        game.add.tween(this.bird).to({angle: -20}, 100).start();
        
        this.jumpSound.play();
        
    }
    
    function restartGame() {
        game.state.restart();
    }
    
    function addOnePipe(x,y) {
       var pipe = game.add.sprite(x, y, 'pipe');
        
       this.pipes.add(pipe);
        
       game.physics.arcade.enable(pipe);
        
       pipe.body.velocity.x = -200;
        
       pipe.checkWorldBounds = true;
       pipe.outOfBoundsKill = true;
    }
    
    function addRowOfPipes() {
        
       var hole = Math.floor(Math.random() * 5) + 1;
        
       for (var i = 0; i < 8; i++)
           if (i != hole && i != hole + 1)
               this.addOnePipe(400, i * 60 + 10);
               this.score += 1;
               this.labelScore.text = this.score;
    }
    
    function hitPipe() {
       
        if (this.bird.alive == false)
            return;
        
        this.bird.alive = false;
        
        game.time.events.remove(this.timer);
        
        this.pipes.forEach(function(p){
            p.body.velocity.x = 0;
        }, this);
    }
};
