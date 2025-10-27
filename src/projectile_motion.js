import p5 from 'p5';

const projectileMotionSketch = (p) => {
    // --- Simulation State ---
    let cannon, projectile, target, trajectoryMeter;
    let traces = [];
    let time = 0;
    const pixelsPerMeter = 10; // Scale: 10 pixels = 1 meter

    // --- DOM Elements ---
    let initialHeightSlider, initialVelocitySlider, launchAngleSlider,
        gravitySlider, airResistanceSwitch, projectileSelect,
        massSlider, diameterSlider;
    let fireBtn, resetBtn;

    // --- Physics Parameters ---
    let initialHeight = 10, initialVelocity = 25, launchAngle = 45;
    let gravity = 9.8, mass = 50, diameter = 0.5;
    let airResistanceOn = false;

    // --- Target Interaction ---
    let isDraggingTarget = false;

    class Cannon {
        constructor() {
            this.baseWidth = 80;
            this.baseHeight = 40;
            this.barrelLength = 60;
            this.barrelHeight = 20;
        }

        update(y, angle) {
            this.pos = p.createVector(this.baseWidth / 2, p.height - y * pixelsPerMeter - this.baseHeight / 2);
            this.angle = -p.radians(angle); // Convert degrees to radians and negate for p5's coordinate system
        }

        display() {
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.fill(80);
            p.stroke(40);
            p.strokeWeight(2);
            p.rectMode(p.CENTER);
            p.rect(0, 0, this.baseWidth, this.baseHeight);
            p.rotate(this.angle);
            p.fill(60);
            p.rect(this.barrelLength / 2, 0, this.barrelLength, this.barrelHeight);
            p.pop();
        }

        getBarrelEnd() {
            const x = this.pos.x + this.barrelLength * p.cos(this.angle);
            const y = this.pos.y + this.barrelLength * p.sin(this.angle);
            return p.createVector(x, y);
        }
    }

    class Projectile {
        constructor(pos, vel, projectileType) {
            this.pos = pos;
            this.vel = vel;
            this.acc = p.createVector(0, 0);
            this.type = projectileType;
            this.radius = (diameter / 2) * pixelsPerMeter;
            this.path = [];
            this.inFlight = true;
        }

        applyForce(force) {
            let f = p5.Vector.div(force, mass);
            this.acc.add(f);
        }

        update(dt) {
            if (!this.inFlight) return;

            const gForce = p.createVector(0, mass * gravity);
            this.applyForce(gForce);

            if (airResistanceOn) {
                const area = p.PI * (diameter / 2) ** 2;
                const densityOfAir = 1.225;
                const dragCoefficient = 0.47;
                const dragMag = 0.5 * densityOfAir * this.vel.magSq() * dragCoefficient * area;
                const dragForce = this.vel.copy().normalize().mult(-dragMag);
                this.applyForce(dragForce);
            }

            this.vel.add(this.acc.copy().mult(dt));
            this.pos.add(this.vel.copy().mult(dt * pixelsPerMeter));
            this.acc.mult(0);

            time += dt;
            this.path.push({ t: time, x: this.pos.x, y: this.pos.y });

            if (this.pos.y > p.height - this.radius || target.checkCollision(this.pos)) {
                this.inFlight = false;
                if(this.pos.y > p.height - this.radius) this.pos.y = p.height - this.radius;
            }
        }

        display() {
            p.fill(20);
            p.noStroke();
            p.ellipse(this.pos.x, this.pos.y, this.radius * 2);

            traces.forEach(trace => {
                p.noFill();
                p.stroke(0, 0, 255, 100);
                p.strokeWeight(2);
                p.beginShape();
                trace.forEach(pt => p.vertex(pt.x, pt.y));
                p.endShape();
            });
        }
    }

    class Target {
        constructor(x, y, size) {
            this.pos = p.createVector(x, y);
            this.size = size;
        }

        checkCollision(projectilePos) {
            return p.dist(this.pos.x, this.pos.y, projectilePos.x, projectilePos.y) < this.size / 2;
        }

        handleDragging() {
            if (isDraggingTarget) {
                this.pos.x = p.mouseX;
                this.pos.y = p.mouseY;
            }
        }

        display() {
            this.handleDragging();
            p.fill(255, 0, 0);
            p.stroke(200, 0, 0);
            p.strokeWeight(3);
            p.ellipse(this.pos.x, this.pos.y, this.size);
            p.fill(255);
            p.ellipse(this.pos.x, this.pos.y, this.size * 0.6);
            p.fill(255, 0, 0);
            p.ellipse(this.pos.x, this.pos.y, this.size * 0.2);
        }
    }

    class TrajectoryMeter {
        display(paths) {
            let closestPoint = null;
            let minDist = Infinity;

            paths.forEach(path => {
                path.forEach(pt => {
                    const d = p.dist(p.mouseX, p.mouseY, pt.x, pt.y);
                    if (d < minDist) {
                        minDist = d;
                        closestPoint = pt;
                    }
                });
            });

            if (minDist < 20 && closestPoint) {
                this.drawTooltip(closestPoint);
            }
        }

        drawTooltip(point) {
            const groundY = p.height - 40;
            const range = (point.x - cannon.pos.x) / pixelsPerMeter;
            const height = (groundY - point.y) / pixelsPerMeter;

            const tooltipText = `Time: ${point.t.toFixed(2)}s\nRange: ${range.toFixed(2)}m\nHeight: ${height.toFixed(2)}m`;

            p.push();
            p.translate(point.x, point.y);
            p.fill(0, 0, 0, 180);
            p.noStroke();
            p.rect(10, -40, 150, 60, 5);
            p.fill(255);
            p.textSize(14);
            p.textAlign(p.LEFT, p.TOP);
            p.text(tooltipText, 20, -30);
            p.stroke(255, 255, 0);
            p.strokeWeight(2);
            p.point(0,0);
            p.pop();
        }
    }

    p.setup = () => {
        const canvasContainer = document.getElementById('projectile-motion-canvas');
        const canvas = p.createCanvas(canvasContainer.offsetWidth, 600);
        canvas.parent('projectile-motion-canvas');

        initialHeightSlider = p.select('#initial-height');
        initialVelocitySlider = p.select('#initial-velocity');
        launchAngleSlider = p.select('#launch-angle');
        gravitySlider = p.select('#proj-gravity-slider');
        airResistanceSwitch = p.select('#air-resistance-switch');
        projectileSelect = p.select('#projectile-select');
        massSlider = p.select('#proj-mass-slider');
        diameterSlider = p.select('#proj-diameter-slider');
        fireBtn = p.select('#fire-btn');
        resetBtn = p.select('#reset-sim-btn');

        fireBtn.mousePressed(fireProjectile);
        resetBtn.mousePressed(resetSimulation);

        const sliders = [
            { el: initialHeightSlider, val: () => initialHeight = initialHeightSlider.value(), labelId: '#initial-height-value' },
            { el: initialVelocitySlider, val: () => initialVelocity = initialVelocitySlider.value(), labelId: '#initial-velocity-value' },
            { el: launchAngleSlider, val: () => launchAngle = launchAngleSlider.value(), labelId: '#launch-angle-value' },
            { el: gravitySlider, val: () => gravity = gravitySlider.value(), labelId: '#proj-gravity-value' },
            { el: massSlider, val: () => mass = massSlider.value(), labelId: '#proj-mass-value' },
            { el: diameterSlider, val: () => diameter = diameterSlider.value(), labelId: '#proj-diameter-value' }
        ];

        sliders.forEach(s => {
            s.el.input(() => {
                s.val();
                p.select(s.labelId).html(s.el.value());
            });
        });

        airResistanceSwitch.changed(() => airResistanceOn = airResistanceSwitch.checked());

        cannon = new Cannon();
        target = new Target(p.width * 0.75, p.height - 100, 50);
        trajectoryMeter = new TrajectoryMeter();
        resetSimulation();
    };

    p.draw = () => {
        drawBackground();

        if (projectile) {
            projectile.update(p.deltaTime / 1000);
            projectile.display();
        }

        cannon.update(initialHeight, launchAngle);
        cannon.display();
        target.display();

        let allPaths = [...traces];
        if (projectile) allPaths.push(projectile.path);
        trajectoryMeter.display(allPaths);
    };

    function drawBackground() {
        p.background(135, 206, 250);
        p.fill(34, 139, 34);
        p.noStroke();
        p.rect(0, p.height - 40, p.width, 40);
    }

    function fireProjectile() {
        if (projectile && projectile.inFlight) return;
        if (projectile) traces.push(projectile.path);

        time = 0;
        const barrelEnd = cannon.getBarrelEnd();
        const angle = p.radians(launchAngle);
        const velocity = p5.Vector.fromAngle(-angle).mult(initialVelocity);
        projectile = new Projectile(barrelEnd, velocity, projectileSelect.value());
    }

    function resetSimulation() {
        projectile = null;
        traces = [];
        time = 0;
        target.pos.x = p.width * 0.75;
        target.pos.y = p.height - 100;
    }

    p.mousePressed = () => {
        if (p.dist(p.mouseX, p.mouseY, target.pos.x, target.pos.y) < target.size / 2) {
            isDraggingTarget = true;
        }
    };

    p.mouseReleased = () => {
        isDraggingTarget = false;
    };
};

export default projectileMotionSketch;
