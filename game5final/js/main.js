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
    
    // var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { create: create });
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, pickTile: pickTile, updateMarker: updateMarker, createTileSelector: createTileSelector });

var bmd;
var map;
var layer;
var marker;
var currentTile = 0;
var cursors;
var player;
var facing = 'left';
var jumpTimer = 0;
var jumpButton;
var currentTileMarker;
var bg;
var music
var door;
var stateText;
var ground;
var t;

function preload() {

    game.load.spritesheet('dude', 'assets/newgirl.png', 32, 48);
    game.load.image('background', 'assets/fortress.png', 32, 48);
    game.load.audio('ambient', 'assets/music.mp3');
    game.load.image('doors', 'assets/castledoors.png');
    game.load.image('dirt', 'assets/platform.png');
    game.load.image('tower', 'assets/tower.png');
}

function create() {
    
    music = game.add.audio('ambient');
    music.play();

    game.stage.backgroundColor = '#2d2d2d';
    
     bg = game.add.tileSprite(0, 0, 800, 600, 'background');

    //  Creates a blank tilemap
    map = game.add.tilemap();
    
    door = game.add.sprite(760, 50, 'doors');
    
    t = game.add.sprite(400, 200, 'tower');
    
    //ground = game.add.sprite(760, 100, 'dirt');

    //  This is our tileset - it's just a BitmapData filled with a selection of randomly colored tiles
    //  but you could generate anything here
    bmd = game.make.bitmapData(32 * 25, 32 * 2);

    var colors = Phaser.Color.HSVColorWheel();

    var i = 0;

    for (var y = 0; y < 2; y++)
    {
        for (var x = 0; x < 25; x++)
        {
            bmd.rect(x * 32, y * 32, 32, 32, colors[i].rgba);
            i += 6;
        }
    }

    //  Add a Tileset image to the map
    map.addTilesetImage('tiles', bmd);

    //  Creates a new blank layer and sets the map dimensions.
    //  In this case the map is 40x30 tiles in size and the tiles are 32x32 pixels in size.
    layer = map.create('level1', 40, 30, 32, 32);

    //  Populate some tiles for our player to start on
    map.putTile(30, 2, 10, layer);
    map.putTile(30, 3, 10, layer);
    map.putTile(30, 4, 10, layer);

    map.setCollisionByExclusion([0]);

    //  Create our tile selector at the top of the screen
    createTileSelector();

    player = game.add.sprite(64, 100, 'dude');
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(door);
    //game.physic.arcade.enable(t);
    game.physics.arcade.gravity.y = 350;

    player.body.bounce.y = 0.1;
    player.body.collideWorldBounds = true;
    door.body.collideWorldBounds = true;
    //t.body.collideWorldBounds = true;
    //ground.body.immovable = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.input.addMoveCallback(updateMarker, this);
    
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '20px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

}

function update() {

    game.physics.arcade.collide(player, layer);

    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
    
    game.physics.arcade.collide(player, door, collisionHandler, null, this);

}

function pickTile(sprite, pointer) {

    var x = game.math.snapToFloor(pointer.x, 32, 0);
    var y = game.math.snapToFloor(pointer.y, 32, 0);

    currentTileMarker.x = x;
    currentTileMarker.y = y;

    x /= 32;
    y /= 32;

    currentTile = x + (y * 25);

}

function updateMarker() {

    marker.x = layer.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = layer.getTileY(game.input.activePointer.worldY) * 32;

    if (game.input.mousePointer.isDown && marker.y > 32)
    {
        map.putTile(currentTile, layer.getTileX(marker.x), layer.getTileY(marker.y), layer);
    }

}

function createTileSelector() {

    //  Our tile selection window
    var tileSelector = game.add.group();

    var tileSelectorBackground = game.make.graphics();
    tileSelectorBackground.beginFill(0x000000, 0.8);
    tileSelectorBackground.drawRect(0, 0, 800, 66);
    tileSelectorBackground.endFill();

    tileSelector.add(tileSelectorBackground);

    var tileStrip = tileSelector.create(1, 1, bmd);
    tileStrip.inputEnabled = true;
    tileStrip.events.onInputDown.add(pickTile, this);

    //  Our painting marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);

    //  Our current tile marker
    currentTileMarker = game.add.graphics();
    currentTileMarker.lineStyle(1, 0xffffff, 1);
    currentTileMarker.drawRect(0, 0, 32, 32);

    tileSelector.add(currentTileMarker);

}
    
    function collisionHandler (player, door) {
    
    stateText.text="Check back next week for what's behind the door, until then free-create!";
    stateText.visible = true;
   
}

};
