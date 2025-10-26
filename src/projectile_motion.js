import p5 from 'p5';

const projectileMotionSketch = (p) => {
    // --- Simulation State ---
    let cannon, projectile;
    let aiming = false;
    let traces = [];

    // --- DOM Elements ---
    let gravitySlider, massSlider, airResistanceSlider;
    let tracePathCheckbox, showVectorsCheckbox;
    let clearTracesBtn;
    let maxRangeData, maxHeightData;

    // --- Physics Constants ---
    let gravity = 9.8;
    let mass = 50;
    let airResistance = 0;

    class Cannon {
        constructor() {
            this.pos = p.createVector(50, p.height - 50);
            this.angle = -p.QUARTER_PI;
            this.length = 60;
        }

        display(aimVector) {
            p.push();
            p.translate(this.pos.x, this.pos.y);

            // Update angle if aiming
            if (aimVector) {
                this.angle = aimVector.heading();
            }
            p.rotate(this.angle);

            // Draw cannon barrel
            p.fill(50);
            p.stroke(0);
            p.rect(0, -10, this.length, 20);

            // Draw cannon base
            p.fill(80);
            p.ellipse(0, 0, 40);
            p.pop();

            // Draw aiming vector
            if (aimVector) {
                p.push();
                p.translate(this.pos.x, this.pos.y);
                p.stroke(255, 0, 0, 150);
                p.strokeWeight(2);
                p.line(0, 0, aimVector.x, aimVector.y);
                p.pop();
            }
        }

        getBarrelEnd() {
            return p.createVector(
                this.pos.x + this.length * p.cos(this.angle),
                this.pos.y + this.length * p.sin(this.angle)
            );
        }
    }

    class Projectile {
        constructor(pos, vel) {
            this.pos = pos;
            this.vel = vel;
            this.acc = p.createVector(0, 0);
            this.radius = 10;
            this.path = [this.pos.copy()];
            this.maxHeight = 0;
            this.inFlight = true;
        }

        applyForce(force) {
            let f = p5.Vector.div(force, mass);
            this.acc.add(f);
        }

        update() {
            if (!this.inFlight) return;

            // Apply gravity
            this.applyForce(p.createVector(0, mass * gravity));

            // Apply air resistance
            if (airResistance > 0) {
                const drag = this.vel.copy();
                drag.mult(-1);
                drag.normalize();
                drag.mult(this.vel.magSq() * airResistance); // Proportional to v^2
                this.applyForce(drag);
            }

            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0);

            // Record path
            this.path.push(this.pos.copy());

            // Check for max height (relative to ground)
            const currentHeight = (p.height - 50) - this.pos.y;
            if(currentHeight > this.maxHeight) {
                this.maxHeight = currentHeight;
            }

            // Check if it hit the ground
            if (this.pos.y >= p.height - 50) {
                this.inFlight = false;
                this.pos.y = p.height - 50; // Stick to ground
                updateShotData();
            }
        }

        display() {
            // Draw projectile
            p.fill(0);
            p.noStroke();
            p.ellipse(this.pos.x, this.pos.y, this.radius * 2);

            // Draw path trace
            if (tracePathCheckbox.checked()) {
                p.noFill();
                p.stroke(0, 0, 255, 100);
                p.strokeWeight(2);
                p.beginShape();
                this.path.forEach(pt => p.vertex(pt.x, pt.y));
                p.endShape();
            }

            // Draw velocity and acceleration vectors
            if (showVectorsCheckbox.checked() && this.inFlight) {
                // Velocity (tangent)
                p.stroke(0, 255, 0);
                p.line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 5, this.pos.y + this.vel.y * 5);
                // Gravity (down)
                p.stroke(255, 0, 0);
                p.line(this.pos.x, this.pos.y, this.pos.x, this.pos.y + gravity * 5);
            }
        }
    }

    p.setup = () => {
        const canvasContainer = document.getElementById('projectile-motion-canvas');
        const canvas = p.createCanvas(canvasContainer.offsetWidth, 500);
        canvas.parent('projectile-motion-canvas');

        // Get DOM elements
        gravitySlider = p.select('#proj-gravity-slider');
        massSlider = p.select('#proj-mass-slider');
        airResistanceSlider = p.select('#air-resistance-slider');
        tracePathCheckbox = p.select('#trace-path-checkbox');
        showVectorsCheckbox = p.select('#show-vectors-checkbox');
        clearTracesBtn = p.select('#clear-traces-btn');
        maxRangeData = p.select('#max-range-data');
        maxHeightData = p.select('#max-height-data');

        // Attach events
        gravitySlider.input(() => gravity = gravitySlider.value());
        massSlider.input(() => mass = massSlider.value());
        airResistanceSlider.input(() => airResistance = airResistanceSlider.value());
        clearTracesBtn.mousePressed(() => traces = []);

        canvas.mousePressed(startAiming);
        canvas.mouseReleased(fire);

        cannon = new Cannon();
    };

    p.draw = () => {
        p.background(220);
        drawGround();

        // Draw all past traces
        traces.forEach(trace => {
            p.noFill();
            p.stroke(0, 0, 255, 50);
            p.strokeWeight(2);
            p.beginShape();
            trace.forEach(pt => p.vertex(pt.x, pt.y));
            p.endShape();
        });

        if (projectile) {
            projectile.update();
            projectile.display();
        }

        let aimVector = null;
        if (aiming) {
            aimVector = p.createVector(p.mouseX - cannon.pos.x, p.mouseY - cannon.pos.y);
        }
        cannon.display(aimVector);
    };

    function drawGround() {
        p.fill(120, 80, 40);
        p.noStroke();
        p.rect(0, p.height - 50, p.width, 50);
    }

    function startAiming() {
        const d = p.dist(p.mouseX, p.mouseY, cannon.pos.x, cannon.pos.y);
        if (d < 40) { // Clicked on cannon base
            aiming = true;
        }
    }

    function fire() {
        if (!aiming) return;
        aiming = false;

        if (projectile && tracePathCheckbox.checked()) {
            traces.push(projectile.path);
        }

        const barrelEnd = cannon.getBarrelEnd();
        const velocity = p.createVector(p.mouseX - cannon.pos.x, p.mouseY - cannon.pos.y);
        velocity.mult(0.2); // Scale down the velocity

        projectile = new Projectile(barrelEnd, velocity);
    }

    function updateShotData() {
        if (!projectile) return;
        const range = (projectile.pos.x - cannon.pos.x) / 10; // Scale to 'meters'
        const height = projectile.maxHeight / 10;

        maxRangeData.html(`${range.toFixed(2)}`);
        maxHeightData.html(`${height.toFixed(2)}`);
    }
};

export default projectileMotionSketch;
