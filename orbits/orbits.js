const s = (orbits) => {

    let NUM_ENTITIES = 20;
    let G = 20;
    let DT = 1;
    let entities = [];
    let seed;
    let bg;
    let fg;
    let c;
    let running = false;

    orbits.setup = () => {
        seed = orbits.random(0, 99999);


        orbits.randomSeed(seed);

        // bg = random(0, 255);
        bg = 255;
        fg = 0;

        orbits.background(0);
        c = orbits.createCanvas(400, 400);
        orbits.initialize_entites();
        orbits.noLoop();
        orbits.button = orbits.createButton('Play');
        orbits.button.mousePressed(orbits.buttonPressed);

        orbits.resetButton = orbits.createButton('Reset');
        orbits.resetButton.mousePressed(orbits.buttonReset);
    };

    orbits.draw = () => {

        for (let i = 0; i < entities.length; i++) {
            entities[i].draw();
        }
        for (let i = 0; i < entities.length; i++) {
            entities[i].step_acceleration();
        }
        for (let i = 0; i < entities.length; i++) {
            entities[i].step_position();
        }

        orbits.merge_entities_too_close();
    };

    class Entity {
        constructor(position, mass) {
            this.p = position;
            this.s = mass;
            this.m = mass;
            this.a = orbits.createVector(0, 0);
            this.v = orbits.createVector(0, 0);
        }

        draw() {
            // fill(255);
            // ellipse(this.p.x, this.p.y, 2, 2);
            orbits.stroke(10, 80, 140, 10);
            orbits.line(this.p.x, this.p.y, this.t.p.x, this.t.p.y);
        }

        set_target(target) {
            this.t = target;
        }

        step_acceleration() {
            var diff = p5.Vector.sub(this.t.p, this.p);
            var mag = diff.mag();
            var dir = diff.normalize();
            var F = G * this.t.m / mag ** 2;

            this.a = p5.Vector.mult(dir, F);
        }

        step_position() {
            this.v.add(this.a.mult(DT));
            this.p.add(this.v.mult(DT));

            this.enforce_periodic_boundary();
        }

        enforce_periodic_boundary() {
            if (this.p.x > orbits.width || this.p.x < 0) {
                this.p.x = this.p.x % orbits.width;
            }
            if (this.p.y > orbits.height || this.p.y < 0) {
                this.p.y = this.p.y % orbits.height;
            }
        }
    }

    orbits.initialize_entites = () => {
        for (let i = 0; i < NUM_ENTITIES; i++) {
            let position = orbits.createVector(orbits.random(0, orbits.height), orbits.random(0, orbits.width));
            let mass = orbits.random(5, 20);
            entities.push(new Entity(position, mass));
        }

        for (let i = 0; i < NUM_ENTITIES; i++) {
            entities[i].set_target(entities[(i + 1) % NUM_ENTITIES]);
        }
    };

    orbits.merge_entities_too_close = () => {
        entities_to_remove = [];
        for (let i = 0; i < entities.length; i++) {
            let r = orbits.abs(p5.Vector.sub(entities[i].p, entities[i].t.p).mag());
            if (r < (entities[i].s + entities[i].t.s) / 2) {
                entities[i].s += entities[i].t.s;
                entities[i].m += entities[i].t.m;
                entities[i].t = entities[i].t.t;
                entities[i].v.add(entities[i].t.v);
                entities[i].a.add(entities[i].t.a);
                entities_to_remove.push(i + 1);
                i++;
            }
        }
        for (let i = 0; i < entities_to_remove.length; i++) {
            entities.splice(entities_to_remove[i], 1);
        }
    };

    orbits.mousePressed = () => {
        if (0 <= orbits.mouseX && orbits.mouseX <= orbits.width) {
            if (0 <= orbits.mouseY && orbits.mouseY <= orbits.height) {
                orbits.buttonReset();
            }
        }
    };

    orbits.buttonPressed = () => {
        if (running) {
            running = false;
            orbits.noLoop();
            orbits.button.html('Play');
        } else {
            running = true;
            orbits.loop();
            orbits.button.html('Pause');
        }
    };
    orbits.buttonReset = () => {
        orbits.background(255);
        entities = [];
        orbits.initialize_entites();
        orbits.button.html('Pause');
        orbits.loop();
        running = true;
    };
    orbits.keyPressed = () => {

        if (orbits.keyCode === 83) {
            saveCanvas(c, seed + "_orbits", "jpg");
        }
    }
};

let myOrbits = new p5(s, "orbits");