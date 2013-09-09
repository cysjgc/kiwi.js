/// <reference path="../../src/Kiwi.ts" />

/**
* This script is a demonstration of how you can rotate a entity in Kiwi. 
* This can be any entity! 
* Meaning it could be a static image or a sprite.  
**/

class Rotation extends Kiwi.State {

    constructor() {
        super('Rotation');
    }

    preload() {
        this.addSpriteSheet('snake', 'assets/spritesheets/snake.png', 150, 117);
    }
    
    snakeA: Kiwi.GameObjects.Sprite;
    snakeB: Kiwi.GameObjects.StaticImage;

    create() {

        /**
        * When you want to scale an entity down you can access the transform property that is located on every entity. 
        * Note: Some entities have the scaleX/scaleY aliased for ease of use.
        **/
        
        //create the snake
        this.snakeA = new Kiwi.GameObjects.Sprite(this, this.textures.snake, 50, 100);                 
        this.addChild(this.snakeA);

        //create the seconds snake
        this.snakeB = new Kiwi.GameObjects.StaticImage(this, this.textures.snake, 400, 250);
        this.addChild(this.snakeB); 

        /**
        * In order to change the rotation point you have to go to the transform object. 
        * Note that the coordinates here are in relation to the entities coordinates. 
        * E.g. 0,0 will be the top left corner of the entity.
        *
        * By default the rotation point is the center.
        **/
        this.snakeB.transform.rotPointX = 0;
        this.snakeB.transform.rotPointY = 0;
    }

    update() {

        /**
        * Rotate the sprites by 1 degree in opposite directions.
        **/
        this.snakeA.transform.rotation += Kiwi.Utils.GameMath.degreesToRadians(1);
        this.snakeB.rotation -= Kiwi.Utils.GameMath.degreesToRadians(1); ///shortcut/shorthand
    }

}