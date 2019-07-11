const c = (celestial_attraction) => {

    let canvas;
    let bodies = [];
    let NUM_ENTITIES = 500;
    let running = false;

    celestial_attraction.initialize_bodies = () => {
        for (let i = 0; i < NUM_ENTITIES; i++) {
            bodies.push(new CelestialBody());
        }
    };

    celestial_attraction.initialize_target = () => {

        let r = celestial_attraction.random(0, 1);
        if (r < 0.5) {
            for (let i = 0; i < bodies.length; i++) {
                j = celestial_attraction.int(celestial_attraction.random(0, bodies.length));
                bodies[i].set_target(bodies[j]);
            }
        } else {
            for (let i = 0; i < bodies.length; i++) {
                j = celestial_attraction.int(celestial_attraction.random(0, bodies.length));
                bodies[i].set_target(bodies[0]);
            }
        }
    };
    celestial_attraction.setup = () => {
        canvas = celestial_attraction.createCanvas(400, 400);
        celestial_attraction.background(60);

        celestial_attraction.initialize_bodies();
        celestial_attraction.initialize_target();

        celestial_attraction.noLoop();
        celestial_attraction.button = celestial_attraction.createButton('Play');
        celestial_attraction.button.mousePressed(celestial_attraction.buttonPressed);
        celestial_attraction.resetButton = celestial_attraction.createButton('Reset');
        celestial_attraction.resetButton.mousePressed(celestial_attraction.buttonReset);
    };

    celestial_attraction.draw = () => {
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].draw();
        }
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].step();
        }
    };

    class CelestialBody {
        constructor() {
            this.p = celestial_attraction.createVector(celestial_attraction.random(0, celestial_attraction.width), celestial_attraction.random(0, celestial_attraction.height));
            this.pp = this.p.copy();
            this.alpha = celestial_attraction.random(0, 2 * celestial_attraction.PI);
            this.dalpha = celestial_attraction.random(0, 0.1);
            this.r = celestial_attraction.random(20, 400);
        }

        draw() {
            celestial_attraction.stroke(255, 255, 255, 10);
            celestial_attraction.line(this.p.x, this.p.y, this.pp.x, this.pp.y);
        }

        set_target(target) {
            this.t = target;
        }

        step() {
            let tx = this.t.p.x + this.r * celestial_attraction.cos(this.alpha);
            let ty = this.t.p.y + this.r * celestial_attraction.sin(this.alpha);
            let t_orbit = celestial_attraction.createVector(tx, ty);
            this.alpha += this.dalpha;
            this.pp = this.p;
            this.p = p5.Vector.lerp(this.p, t_orbit, 0.01);
        }
    }

    celestial_attraction.buttonPressed = () => {
        if (running) {
            celestial_attraction.button.html('Pause');
            celestial_attraction.noLoop();
            running = !running;
        } else {
            celestial_attraction.button.html('Play');
            celestial_attraction.loop();
            running = !running;
        }
    };

    celestial_attraction.buttonReset = () => {
        bodies = [];
        celestial_attraction.background(60);
        celestial_attraction.initialize_bodies();
        celestial_attraction.initialize_target();
    };
};

let myCelestialAttraction = new p5(c, 'celestial_attraction');