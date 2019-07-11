const b = (boids) => {

    let NUM_ENTITIES = 100;
    let G = 20;
    let DT = 1;
    let boid_container = [];
    let seed;
    let bg;
    let fg;
    let c;
    let vlim = 5;
    let running = false;

    boids.setup = () => {
        seed = boids.random(0, 99999);
        boids.randomSeed(seed);

        // bg = random(0, 255);
        bg = 255;
        fg = 0;

        boids.background(255);
        c = boids.createCanvas(400, 400);
        boids.initialize_entites();
        boids.noLoop();

        boids.button = boids.createButton('Play');
        boids.button.mousePressed(boids.buttonPressed);
        boids.resetButton = boids.createButton('Reset');
        boids.resetButton.mousePressed(boids.buttonReset);
    };

    boids.update_position = function () {
        for (let i = 0; i < boid_container.length; i++) {
            let center_of_mass = boids.createVector(0, 0);
            let center_of_velo = boids.createVector(0, 0);
            let repelling = boids.createVector(0, 0);

            for (let j = 0; j < boid_container.length; j++) {
                if (i !== j) {
                    center_of_mass.add(boid_container[j].p);
                    center_of_velo.add(boid_container[j].v);
                    if (p5.Vector.sub(boid_container[j].p, boid_container[i].p).mag() < 5) {
                        repelling.sub(p5.Vector.sub(boid_container[j].p, boid_container[i].p));
                    }
                }
            }
            center_of_mass.mult(1 / (boid_container.length - 1));
            center_of_velo.mult(1 / (boid_container.length - 1));

            let dir = p5.Vector.sub(center_of_mass, boid_container[i].p);
            let v1 = p5.Vector.mult(dir, 1 / 1000);
            let v2 = repelling;
            let v3 = p5.Vector.mult(p5.Vector.sub(center_of_velo, boid_container[i].v), 1 / 16);

            boid_container[i].v.add(v1);
            boid_container[i].v.add(v2);
            boid_container[i].v.add(v3);
            boid_container[i].p.add(boid_container[i].v);
            boid_container[i].soft_bound_position();
            boid_container[i].bound_velocity();
        }
    };
    boids.clamp_position = function () {
        for (let i = 0; i < boid_container.length; i++) {
            if (boid_container[i].p.x < 0) {
                boid_container[i].p.x = 0;
            }
            if (boid_container[i].p.x > boids.width) {
                boid_container[i].p.x = boids.width;
            }
            if (boid_container[i].p.y < 0) {
                boid_container[i].p.y = 0;
            }
            if (boid_container[i].p.y > boids.height) {
                boid_container[i].p.y = boids.height;
            }
        }
    };
    boids.draw = () => {
        boids.background(255, 255, 255, 80);
        for (let i = 0; i < boid_container.length; i++) {
            boid_container[i].draw();
        }

        boids.update_position();
        // boids.clamp_position();
    };

    class Boid {
        constructor(position, mass) {
            this.p = position;
            this.s = mass;
            this.m = mass;
            this.a = boids.createVector(0, 0);
            this.v = boids.createVector(0, 0);
        }

        draw() {
            boids.fill(0, 0, 0);
            boids.stroke(0, 0, 0);
            boids.ellipse(this.p.x, this.p.y, 5, 5);
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
            if (this.p.x > boids.width || this.p.x < 0) {
                this.p.x = this.p.x % boids.width;
            }
            if (this.p.y > boids.height || this.p.y < 0) {
                this.p.y = this.p.y % boids.height;
            }
        }

        soft_bound_position() {
            let bounding_vector = boids.createVector(0, 0);
            if (this.p.x < 0) {
                bounding_vector.x = 0.5;
            } else if (this.p.x > boids.width) {
                bounding_vector.x = -0.5;
            }
            if (this.p.y < 0) {
                bounding_vector.y = 0.5;
            } else if (this.p.y > boids.height) {
                bounding_vector.y = -0.5;
            }
            this.v.add(bounding_vector);
        }

        bound_velocity() {
            if (this.v.mag() > vlim) {
                this.v = this.v.normalize().mult(vlim);
            }
        }
    }

    boids.initialize_entites = () => {
        for (let i = 0; i < NUM_ENTITIES; i++) {
            let position = boids.createVector(boids.random(0, boids.height), boids.random(0, boids.width));
            let mass = boids.random(5, 20);
            boid_container.push(new Boid(position, mass));
        }
    };


    boids.keyPressed = () => {

        if (boids.keyCode === 83) {
            boids.saveCanvas(c, seed + "_boids", "jpg");
        }
    };

    boids.mousePressed = () => {
        if (0 <= boids.mouseX && boids.mouseX <= boids.width) {
            if (0 <= boids.mouseY && boids.mouseY <= boids.height) {
                boids.buttonReset();
            }
        }
    };

    boids.buttonPressed = () => {
        if (running) {
            running = false;
            boids.noLoop();
            boids.button.html('Play');
        } else {
            running = true;
            boids.loop();
            boids.button.html('Pause');
        }
    };
    boids.buttonReset = () => {
        boids.background(255);
        boid_container = [];
        boids.initialize_entites();
        boids.draw();
        running = true;
        boids.loop();
        boids.button.html('Pause');
    };
};

let myBoids = new p5(b, "boids");