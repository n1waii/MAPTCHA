const DOC_HEIGHT = window.innerHeight;
const DOC_WIDTH = window.innerWidth;

const CANVAS_HEIGHT = DOC_HEIGHT * .7;
const CANVAS_WIDTH = DOC_WIDTH * .5;

const ORB_NUM = 10;
const ORB_WIDTH = 100;
const ORB_HEIGHT = 100;
const RADIAL_LENGTH = Math.sqrt(Math.pow(ORB_WIDTH, 2) + Math.pow(ORB_HEIGHT, 2));

const FOODS = [
    "chicken", "donut", "fries", "hotdog", "pizza"
]

const PhaserPhysics = Phaser.Physics.Arcade.ArcadePhysics

class Main extends Phaser.Scene
{   
    preload ()
    {
        this.currentOrbs = [];
        this.screenWidth = this.renderer.width
        this.screenHeight = this.renderer.height

        this.load.image('orbTexture', './assets/orbTexture.png');
        this.load.image('chicken', './assets/chicken.png');
        this.load.image('donut', './assets/donut.png');
        this.load.image('fries', './assets/fries.png');
        this.load.image('hotdog', './assets/hotdog.png');
        this.load.image('pizza', './assets/pizza.png');

    }

    create ()
    {
        /*
        const orb = this.add.ellipse(ORB_WIDTH, ORB_HEIGHT, ORB_HEIGHT, ORB_WIDTH, '0xFFFFFF');
        const orb2 = this.add.ellipse(ORB_WIDTH, this.screenHeight-ORB_HEIGHT, ORB_HEIGHT, ORB_WIDTH, '0x303030');
        const orb3 = this.add.ellipse(this.screenWidth-ORB_WIDTH, ORB_HEIGHT, ORB_HEIGHT, ORB_WIDTH, '0xFFFFFF');
        const orb4 = this.add.ellipse(this.screenWidth-ORB_WIDTH, this.screenHeight-ORB_HEIGHT, ORB_HEIGHT, ORB_WIDTH, '0xFFFFFF');
        */

        this.createOrbs();
        //this.refreshRound();
    }

    getRandomFood(exclusion) {
        const food = FOODS[Phaser.Math.Between(1, FOODS.length)-1];

        if ((exclusion) && (exclusion === food)) {
            return this.getRandomFood(exclusion);
        }

        return food;
    }

    getRandomAvailablePosition(avoidCollisions) {
        const randomX = Phaser.Math.Between(ORB_WIDTH, this.screenWidth-ORB_WIDTH);
        const randomY = Phaser.Math.Between(ORB_HEIGHT, this.screenHeight-ORB_HEIGHT);
        const randomPos = new Phaser.Math.Vector2(randomX, randomY);

        if (avoidCollisions === true) {
            for (let i = 0; i < this.currentOrbs.length; i++) {
                const orb = this.currentOrbs[i];
                const orbCenterPos = orb.getCenter();
                const distance = Phaser.Math.Distance.BetweenPoints(orbCenterPos, randomPos);

                if (distance <= ORB_WIDTH) {
                    return this.getRandomAvailablePosition(true);
                }
            }
        }

        return randomPos;
    }

    removeOrbs() {
        for (let i = 0; i < this.currentOrbs.length; i++) {
            const orb = this.currentOrbs[i];            
            orb.destroy();
            //this.currentOrbs.splice(i, 1);
        }
        console.log(this.currentOrbs);
        this.currentOrbs = [];
    }

    createOrbs() {
        this.removeOrbs();

        const correctFood = this.getRandomFood();

        for (let i = 0; i<ORB_NUM; i++) {
            const startPos = this.getRandomAvailablePosition();
            const goalPos = this.getRandomAvailablePosition();
            const randomFood = this.getRandomFood(correctFood);


            const orb = this.add.image(0,0, 'orbTexture');
            orb.setSize(0);
            //orb.setDisplaySize(ORB_WIDTH, ORB_HEIGHT);
            //orb.setBounce(1);
            orb.setScale(.4);

            const food = this.add.image(0,0, randomFood);
            food.setName(randomFood);
            food.setScale(.13);
            food.setSize(0, 0);
            //food.setDisplaySize(ORB_WIDTH*.7, ORB_HEIGHT*.7);

            const container = this.add.container(0, 0, [orb, food]);
            //container.setSize(ORB_WIDTH, ORB_HEIGHT);

            this.physics.world.enableBody(container);
            container.body.setCollideWorldBounds(true);
            container.body.setBounce(1);
            container.body.setCircle(30);

            orb.setPosition(30);
            food.setPosition(30);

            this.currentOrbs.push(container); 

            this.physics.moveTo(container, goalPos.x, goalPos.y, 200);


        }

        this.physics.world.addCollider(this.currentOrbs, this.currentOrbs);
    }
}

const config = {
    parent: "game", 
    type: Phaser.AUTO,
    width: "100%",
    height: "100%",
    scene: Main,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};

const game = new Phaser.Game(config);