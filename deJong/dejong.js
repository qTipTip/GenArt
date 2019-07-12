const attractor = (dejong_attractor) => {
    let canvas;
    let system;
    let presets = [
        [-2.24, 0.43, -0.65, -2.43],
        [2.01, -2.53, 1.61, -0.33],
        [-2, -2, -1.2, 2],
        [1.641, 1.902, 0.316, 1.525],
        [0.970, -1.899, 1.381, -1.506],
        [1.4, -2.3, 2.4, -2.1],
        [2.01, -2.53, 1.61, -0.33],
        [-2.7, -0.09, -0.86, -2.2],
        [-0.827, -1.637, 1.659, -0.943],
        [-2.24, 0.43, -0.65, -2.43],
        [-0.709, 1.638, 0.452, 1.740]
    ];
    let counter = 0;

    function initialize_system(a, b, c, d) {

        system = new DeJong(a, b, c, d);
        points = system.compute(10000);
        x = points[0];
        y = points[1];


        dejong_attractor.stroke(0, 0, 0, 100);

        for (let i = 0; i < x.length; i++) {
            dejong_attractor.ellipse(x[i], y[i], 1, 1);
        }
    }

    dejong_attractor.setup = () => {
        canvas = dejong_attractor.createCanvas(400, 400);
        dejong_attractor.background(255);
        reset_button = dejong_attractor.createButton('Random');
        reset_button.mousePressed(dejong_attractor.resetButton);
        preset_button = dejong_attractor.createButton('Preset');
        preset_button.mousePressed(dejong_attractor.presetButton);
        initialize_system(-2, -2, -1.2, 2);
    };

    dejong_attractor.presetButton = () => {
        dejong_attractor.background(255);
        initialize_system(presets[counter][0], presets[counter][1], presets[counter][2], presets[counter][3]);
        counter = (counter + 1) % presets.length;
    }
    dejong_attractor.resetButton = () => {
        dejong_attractor.background(255);
        initialize_system(dejong_attractor.random(-3, 3), dejong_attractor.random(-3, 3), dejong_attractor.random(-3, 3), dejong_attractor.random(-3, 3));
    };

    dejong_attractor.mousePressed = () => {
        if (0 <= dejong_attractor.mouseX && dejong_attractor.mouseX <= dejong_attractor.width) {
            if (0 <= dejong_attractor.mouseY && dejong_attractor.mouseY <= dejong_attractor.height) {
                dejong_attractor.resetButton();
            }
        }
    };

    class DeJong {

        constructor(a, b, c, d) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.p = dejong_attractor.createVector(dejong_attractor.random(0, dejong_attractor.width), dejong_attractor.random(0, dejong_attractor.height));
            this.pp = this.p.copy();
        }

        compute(n) {
            let x = [dejong_attractor.map(this.p.x, 0, dejong_attractor.width, -2, 2)];
            let y = [dejong_attractor.map(this.p.y, 0, dejong_attractor.height, -2, 2)];

            for (let i = 0; i < n; i++) {
                x.push(dejong_attractor.sin(this.a * y[i]) - dejong_attractor.cos(this.b * x[i]));
                y.push(dejong_attractor.sin(this.c * x[i]) - dejong_attractor.cos(this.d * y[i]));
            }

            for (let i = 0; i < x.length; i++) {
                x[i] = dejong_attractor.map(x[i], -2.1, 2.1, 0, dejong_attractor.width);
                y[i] = dejong_attractor.map(y[i], -2.1, 2.1, 0, dejong_attractor.height);
            }

            return [x, y];
        }
    }
};

var myDeJong = new p5(attractor, 'dejong');