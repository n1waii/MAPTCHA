const DOC_HEIGHT = window.innerHeight;
const DOC_WIDTH = window.innerWidth;

const CANVAS_HEIGHT = DOC_HEIGHT * .7;
const CANVAS_WIDTH = DOC_WIDTH * .5;

const TOTAL_ROUNDS = 6;
const ORB_NUM = 5;
const ORB_WIDTH = 100;
const ORB_HEIGHT = 100;
const RADIAL_LENGTH = Math.sqrt(Math.pow(ORB_WIDTH, 2) + Math.pow(ORB_HEIGHT, 2));

const FOODS = [
    "chicken", "donut", "fries", "hotdog", "pizza"
]

const PhaserPhysics = Phaser.Physics.Arcade.ArcadePhysics;

let chosenFood = "";
let lastTime = 0;

async function changeChosenFood() {
    return fetch("./captcha", {
        method: 'GET',
    })
        .then(response => {
            return response.json();
        })
        .then(json => { 
            document.getElementById("captchaFrame").innerHTML = json.data;
            chosenFood = json.text;
            //document.body.innerHTML += json.data;
            return true;
        })
        .catch(err => console.log(err));
}


function updateProgressBar() {
    const progressBar = document.getElementById("progressBar");
    progressBar.value = (ExperimentController.getRoundNumber() / TOTAL_ROUNDS) * 100
}


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

        this.input.topOnly=false;
        this.physics.world.on("worldbounds", this.onBoundaryCollision);
        this.input.on('pointerdown', this.onMouseDown);

        this.createOrbs();
        const d = new Date();
        lastTime = d.getTime();;
        //this.refreshRound();
    }

    getRandomFood = (exclusion) => {
        const food = FOODS[Phaser.Math.Between(1, FOODS.length)-1];

        if ((exclusion) && (exclusion === food)) {
            return this.getRandomFood(exclusion);
        }

        return food;
    }

    getRandomAvailablePosition = (avoidCollisions) => {
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

    removeOrbs = () => {
        for (let i = 0; i < this.currentOrbs.length; i++) {
            const orbContainer = this.currentOrbs[i];            
            orbContainer.destroy();
            //this.currentOrbs.splice(i, 1);
        }
        this.currentOrbs = [];
    }

    setOrbColors = () => {
        for (let i = 0; i < this.currentOrbs.length; i++) {
            const orbContainer = this.currentOrbs[i];
            const orb = orbContainer.getFirst(); 
            if (orbContainer.name == chosenFood) {
                orb.setTint("#05fa46");
            } else {
                orb.clearTint();
            }
        }
    }


    nextRound = async () => {
        //nextCollection();
        let d = new Date();
        let time = d.getTime();
        ExperimentController.setTimeTaken(time-lastTime);
        ExperimentController.advanceRound();
        updateProgressBar();

        if ((ExperimentController.getRoundNumber()) === TOTAL_ROUNDS) {
            ExperimentController.resetRoundNumber();
            fetch("./add-data", {
                method: "POST",
                body: JSON.stringify(ExperimentController.getTotalExperimentData()),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            window.location.replace(window.location.href + "complete");
            console.log("research complete")
            console.log(ExperimentController.getTotalExperimentData());
        } else {
            
            return changeChosenFood().then(() => {                
    
                this.setOrbColors(); // some weird error here 

                d = new Date() 
                lastTime = d.getTime();
            });
        }
       
    } 

    onMouseDown = (pointer, currentlyOver) => {
        let worldX = pointer.worldX;
        let worldY = pointer.worldY;
        ExperimentController.incClicks();
        for (const orbContainer of currentlyOver) {
            console.log(orbContainer.name);
            if (orbContainer.name == chosenFood) {
                let distX = (30+orbContainer.x-pointer.x);
                let distY = (30+orbContainer.y-pointer.y);
                
                let dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

                ExperimentController.setMouseDist(dist);
                this.removeOrbs();
                this.nextRound().then(() => {
                    setTimeout(this.createOrbs, 500);
                });
                break;
            }
        }
    }


    onBoundaryCollision = (body) => {
        const { gameObject } = body; // gameObject is the container
        if (gameObject.name == chosenFood) {
            ExperimentController.incColls();
            changeChosenFood().then(() => {
                this.setOrbColors(); // some weird error here 
            });
        }
    }

    createOrbs = () => {
        this.removeOrbs();

        //const correctFood = this.getRandomFood();

        for (let i = 0; i<FOODS.length; i++) {
            const startPos = this.getRandomAvailablePosition();
            const goalPos = this.getRandomAvailablePosition();
            const foodName = FOODS[i]
            //const randomFood = i > 0 && this.getRandomFood(chosenFood) || chosenFood;
            

            const orb = this.add.image(0,0, 'orbTexture');
            orb.setSize(100);
            //orb.setDisplaySize(ORB_WIDTH, ORB_HEIGHT);
            //orb.setBounce(1);
            orb.setScale(.4);

            const food = this.add.image(0,0, foodName);
            food.setScale(.13);
            food.setSize(0, 0);
            //food.setDisplaySize(ORB_WIDTH*.7, ORB_HEIGHT*.7);

            const container = this.add.container(startPos.x, startPos.y, [orb, food]);
            container.setName(foodName);
            //container.setSize(ORB_WIDTH, ORB_HEIGHT);

            this.physics.world.enableBody(container);
            container.body.setCollideWorldBounds(true, 1, 1, true);
            container.body.setBounce(1);
            container.body.setCircle(30);
            container.inputEnabled = true;
            container.setInteractive(new Phaser.Geom.Circle(30, 30, 30, 30), Phaser.Geom.Circle.Contains);
            

            orb.setPosition(30);
            food.setPosition(30);

            this.currentOrbs.push(container); 

            this.physics.moveTo(container, goalPos.x, goalPos.y, 200);
        }
        
        this.setOrbColors();
        this.physics.world.addCollider(this.currentOrbs, this.currentOrbs);
    }

}

const config = {
    parent: "game", 
    type: Phaser.AUTO,
    width: "100%",
    height: "60%",
    scene: Main,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    }
};



changeChosenFood().then(() => {
    const game = new Phaser.Game(config);
})