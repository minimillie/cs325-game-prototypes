"use strict";

window.onload = function() {
    
  var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, updateBullets: updateBullets, fireBullet: fireBullet, collisionHandler: collisionHandler, restartGame: restartGame });

function preload () {

    game.load.image('player', 'assets/ghost.png');
    game.load.image('star', 'assets/reds.png');
    game.load.image('baddie', 'assets/travel.png');
    game.load.image('lazer', 'assets/lazer.png');
    game.load.audio('007', 'assets/007.mp3');
}

var stars;
var baddies;
var lazers;
var player;
var cursors;
var fireButton;
var bulletTime = 0;
var frameTime = 0;
var frames;
var prevCamX = 0;
var score = 16;
var scoreString = '';
var scoreText;
var music;

function create () {

    game.world.setBounds(0, 0, 800*4, 600);
    
    music = game.add.audio('007');
    music.play();
    
    game.physics.startSystem(Phaser.Physics.ARCADE);

    frames = Phaser.Animation.generateFrameNames('frame', 2, 30, '', 2);
    frames.unshift('frame02');

    stars = game.add.group();

    for (var i = 0; i < 128; i++)
    {
        stars.create(game.world.randomX, game.world.randomY, 'star');
    }

    baddies = game.add.group();
    baddies.enableBody = true;
    baddies.physicsBodyType = Phaser.Physics.ARCADE;

    for (var i = 0; i < 16; i++)
    {
        baddies.create(game.world.randomX, game.world.randomY, 'baddie');
    }

    lazers = game.add.group();
    lazers.enableBody = true;
    lazers.physicsBodyType = Phaser.Physics.ARCADE;
    lazers.createMultiple(30, 'lazer');
    lazers.setAll('anchor.x', 0.5);
    lazers.setAll('anchor.y', 1);
    lazers.setAll('outOfBoundsKill', true);
    lazers.setAll('checkWorldBounds', true);
    

    player = game.add.sprite(100, 300, 'player');
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.anchor.x = 0.5;

    game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1);

    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    prevCamX = game.camera.x;
    
    scoreString = 'Agents Left : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

}

function update () {

    if (cursors.left.isDown)
    {
        player.x -= 8;
        player.scale.x = -1;
    }
    else if (cursors.right.isDown)
    {
        player.x += 8;
        player.scale.x = 1;
    }

    if (cursors.up.isDown)
    {
        player.y -= 8;
    }
    else if (cursors.down.isDown)
    {
        player.y += 8;
    }

    if (fireButton.isDown)
    {
        fireBullet();
    }

    prevCamX = game.camera.x;
    
    game.physics.arcade.overlap(lazers, baddies, collisionHandler, null, this);
    game.physics.arcade.collide(player, stars, restartGame);
    
    if (game.physics.arcade.collide(player, stars))
        {
            game.state.restart();
        }
   // game.physics.arcade.overlap(player, baddies, restartGame, null, this);
    
}

function updateBullets (lazer) {

     if (game.time.now > frameTime)
     {
         frameTime = game.time.now + 500;
     }
     else
     {
         return;
     }

    //  Adjust for camera scrolling
    var camDelta = game.camera.x - prevCamX;
    lazer.x += camDelta;

    if (lazer.animations.frameName !== 'frame30')
    {
        lazer.animations.next();
    }
    else
    {
        if (lazer.scale.x === 1)
        {
            lazer.x += 16;

            if (lazer.x > (game.camera.view.right - 224))
            {
                lazer.kill();
            }
        }
        else
        {
            lazer.x -= 16;

            if (lazer.x < (game.camera.view.left - 224))
            {
                lazer.kill();
            }
        }
    }

}

    
function fireBullet () {

        //  Grab the first bullet we can from the pool
        var lazer = lazers.getFirstExists(false);

        if (lazer)
        {
            lazer.reset(player.x, player.y + 8)
            lazer.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
       
}
    
function collisionHandler (lazer, baddie) {
    lazer.kill()
    baddie.kill()
    
     //  Increase the score
    score -= 1;
    scoreText.text = scoreString + score;
    
    if (score == 0) 
    {
        score = 16;
        game.state.restart();
    }
}
   
function restartGame (player, star) {
    //player.kill()
    //star.kill()
    game.state.restart();
    
}
    
    
};
