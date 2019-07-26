const t = (trees) => {
    let sprouts = [];
    MAX_SPROUTS = 2000;
    MAX_TREES = 20;
    CURRENT_TREES = 0;
    trees.resetCanvas = function () {
        trees.background(60);
        sprouts = [];
        CURRENT_TREES = 0;
        trees.loop();
    }
    trees.setup = () => {
        trees.createCanvas(400, 400);
        trees.background(60);
        trees.resetButton = trees.createButton('Reset');
        trees.resetButton.mousePressed(trees.resetCanvas);
        trees.noLoop();
    };

    function purge_overlapping_sprouts() {
        let indexes_to_remove = new Set();
        for (let i = 0; i < sprouts.length - 1; i++) {
            for (let j = i + 1; j < sprouts.length; j++) {
                if (sprouts[i].x === sprouts[j].x) {
                    if (trees.abs(sprouts[i].y - sprouts[j].y) < 1.0e-7) {
                        indexes_to_remove.add(i);
                        break;
                    }
                }
            }
        }
        indexes_to_remove = Array.from(indexes_to_remove);
        for (let i = 0; i < indexes_to_remove.length; i++) {
            sprouts = sprouts.splice(indexes_to_remove[i], 1);
        }
    }

    trees.draw = () => {

        if (sprouts.length === 0) {
            let x = Math.floor(trees.random(0, trees.width) / 10) * 10;
            sprouts.push(new Sprout(x, trees.height));
            CURRENT_TREES += 1;
        }

        if (CURRENT_TREES === MAX_TREES) {
            trees.noLoop();
        }

        let sprouts_to_remove = [];
        let sprouts_to_add = [];

        purge_overlapping_sprouts();

        for (let i = 0; i < sprouts.length; i++) {

            if (sprouts[i].y < 0) {
                sprouts_to_remove.push(sprouts[i]);

            } else {
                if (sprouts[i].must_split() && sprouts.length < MAX_SPROUTS) {
                    let new_sprout = sprouts[i].split();
                    sprouts_to_add.push(new_sprout);
                } else {
                    sprouts[i].step();
                }
            }
        }

        for (let i = 0; i < sprouts_to_add.length; i++) {
            sprouts.push(sprouts_to_add[i]);
        }

        for (let i = 0; i < sprouts.length; i++) {
            sprouts[i].draw();
        }


        for (let i = 0; i < sprouts_to_remove.length; i++) {
            var j = sprouts.indexOf(sprouts_to_remove[i]);
            sprouts.splice(j, 1);
        }


    };
    trees.mousePressed = () => {
        if (0 <= trees.mouseX && trees.mouseX <= trees.width) {
            if (0 <= trees.mouseY && trees.mouseY <= trees.height) {
                trees.resetCanvas();
            }
        }
    };

    class Sprout {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        draw() {
            trees.noStroke();
            trees.fill(255, 255, 255, 25);
            var s = (1 - this.y / trees.height) * 15 + 2;
            trees.ellipse(this.x, this.y, s, s);
        }

        must_split() {
            let r = trees.randomGaussian(1, 1);
            if (r > 1.8) {
                return true;
            } else {
                return false;
            }
        }

        split() {
            var xoff = (1 - this.y / trees.height) * 10 + 5;
            let new_sprout = new Sprout(this.x + xoff, this.y);
            this.x = this.x - xoff;
            return new_sprout;
        }

        step() {
            this.y -= 10;
        }
    }
};

let myTree = new p5(t, 'trees');