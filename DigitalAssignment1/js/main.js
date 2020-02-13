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
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, jump: jump, restartGame: restartGame } );
    
    function preload() {
        // Load an image and call it 'logo'.
        game.load.image( 'bird', 'assets/bone.png' );
    }
    
    var bouncy;
    
    function create() {
        
        game.stage.backgroundColor = '#71c5cf';
       
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        this.bird = game.add.sprite(100, 245, 'bird');
        
        game.physics.arcade.enable(this.bird);
        
        this.bird.body.gravity.y = 1000;
        
        var spaceKey = game.input.keybaord.addKey(
                        Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
    }
    
    function update() {
       if (this.bird.y < 0 || this.bird.y > 490)
           this.restartGame()
    }
    
    function jump() {
        this.bird.body.velocity.y = -350;
    }
    
    function restartGame() {
        game.state.start('main');
    }
};
© 2020 GitHub, Inc.
