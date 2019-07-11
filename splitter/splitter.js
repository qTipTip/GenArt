const split = (splitter) => {
    let canvas;
    let splitters = [];
    let MAX_RADIUS = 300;
    let MAX_SPLITTERS = 2000;

    splitter.setup = () => {
        canvas = splitter.createCanvas(400, 400);
        splitter.background(255);

        splitter.initialize_splitters();
        splitter.buttonReset = splitter.createButton('Reset');
        splitter.buttonReset.mousePressed(splitter.resetButton);
    };

    splitter.draw = () => {

        if (splitters.length <= MAX_SPLITTERS) {

            for (let i = 0; i < splitters.length; i++) {
                splitters[i].draw();
            }

            let splitters_to_remove = [];
            let splitters_to_add = [];
            for (let i = 0; i < splitters.length; i++) {
                if (splitters[i].do_split()) {
                    children = splitters[i].split();
                    splitters_to_remove.push(i);
                    splitters_to_add = splitters_to_add.concat(children);
                }
            }

            for (let i = 0; i < splitters_to_remove.length; i++) {
                splitters.splice(splitters_to_remove[i], 1);
            }

            splitters = splitters.concat(splitters_to_add);
        }
    };

    splitter.resetButton = () => {
        splitters = [];
        splitter.initialize_splitters();
        splitter.background(255);
    };

    splitter.mousePressed = () => {
        if (0 <= splitter.mouseX && splitter.mouseX <= splitter.width) {
            if (0 <= splitter.mouseY && splitter.mouseY <= splitter.height) {
                splitter.resetButton();
            }
        }
    }


    splitter.initialize_splitters = () => {
        splitters.push(new Splitter(splitter.width / 2, splitter.height / 2, splitter.random(MAX_RADIUS / 2, MAX_RADIUS)));
    };

    class Splitter {
        constructor(x, y, r) {
            this.p = splitter.createVector(x, y);
            this.r = r;
        }

        draw() {
            splitter.stroke(0, 0, 0, 7);
            splitter.fill(0, 0, 0, 5);
            splitter.ellipse(this.p.x, this.p.y, this.r, this.r);
        }

        do_split() {
            let threshold = 0.5;
            let s = splitter.random(0, 1);

            if (s > threshold) {
                return true;
            } else {
                return false;
            }
        }

        split() {
            let num_childs = splitter.int(splitter.random(5, 10));
            let dalpha = 2 * splitter.PI / (num_childs);
            let alpha = splitter.random(0, 2 * splitter.PI);
            let children = [];

            for (let i = 0; i < num_childs; i++) {
                var a = alpha + i * dalpha;
                var x = this.p.x + this.r / 2 * splitter.cos(a);
                var y = this.p.y + this.r / 2 * splitter.sin(a);

                var r = splitter.random(this.r * 0.5, this.r * 0.7);
                children.push(new Splitter(x, y, r));
            }
            return children;
        }
    }


};

let mySplitter = new p5(split, 'splitter');