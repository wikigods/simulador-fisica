import p5 from 'p5';

const projectileMotionSketch = (p) => {
    // --- Simulation State ---
    let cannon, projectile, target, trajectoryMeter;
    let traces = [];
    let time = 0;
    let pixelsPerMeter = 10; // Scale: pixels per meter. This will be adjusted dynamically.

    // --- DOM Elements ---
    let initialHeightSlider, initialVelocitySlider, launchAngleSlider,
        gravitySlider, airResistanceSwitch, projectileSelect,
        massSlider, diameterSlider;
    let fireBtn, resetBtn;

    // --- Projectile Data ---
    const PROJECTILES = {
        cannonball: { mass: 50, diameter: 0.5, initialHeight: 10, initialVelocity: 25, launchAngle: 45 },
        piano:      { mass: 400, diameter: 1.5, initialHeight: 100, initialVelocity: 10, launchAngle: 10 },
        car:        { mass: 1000, diameter: 2.5, initialHeight: 50, initialVelocity: 50, launchAngle: 30 },
        human:      { mass: 70, diameter: 0.7, initialHeight: 5, initialVelocity: 20, launchAngle: 50 }
    };

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
        constructor(x, y) {
            this.pos = p.createVector(x, y);
            this.size = 20;
            this.isDragging = false;
            this.offsetX = 0;
            this.offsetY = 0;
        }

        handleDragging() {
            if (this.isDragging) {
                this.pos.x = p.mouseX + this.offsetX;
                this.pos.y = p.mouseY + this.offsetY;
            }
        }

        display() {
            this.handleDragging();
            p.push();
            p.stroke(0);
            p.strokeWeight(2);
            p.fill(255, 255, 0); // Yellow color like the example
            p.ellipse(this.pos.x, this.pos.y, this.size, this.size);
            p.line(this.pos.x - this.size / 2, this.pos.y, this.pos.x + this.size / 2, this.pos.y);
            p.line(this.pos.x, this.pos.y - this.size / 2, this.pos.x, this.pos.y + this.size / 2);
            p.pop();
        }

        drawTooltip(point) {
            const groundY = p.height - 40;
            const range = (point.x - cannon.pos.x) / pixelsPerMeter;
            const height = Math.max(0, (groundY - point.y) / pixelsPerMeter);

            const boxWidth = 150;
            const boxHeight = 70;
            const textPadding = 10;

            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.fill(30, 30, 50, 200); // Dark blueish background
            p.noStroke();
            p.rect(15, -boxHeight / 2, boxWidth, boxHeight, 8);

            p.fill(255);
            p.textSize(14);
            p.textAlign(p.LEFT, p.CENTER);

            p.text(`Tiempo:`, 15 + textPadding, -boxHeight / 2 + textPadding * 2);
            p.text(`Distancia:`, 15 + textPadding, -boxHeight / 2 + textPadding * 3.5);
            p.text(`Altura:`, 15 + textPadding, -boxHeight / 2 + textPadding * 5);

            p.textAlign(p.RIGHT, p.CENTER);
            p.text(`${point.t.toFixed(2)} s`, 15 + boxWidth - textPadding, -boxHeight / 2 + textPadding * 2);
            p.text(`${range.toFixed(2)} m`, 15 + boxWidth - textPadding, -boxHeight / 2 + textPadding * 3.5);
            p.text(`${height.toFixed(2)} m`, 15 + boxWidth - textPadding, -boxHeight / 2 + textPadding * 5);
            p.pop();
        }
    }

    function calculateMaxHeight() {
        const v0y = initialVelocity * p.sin(p.radians(launchAngle));
        // Using the kinematic equation: v_f^2 = v_i^2 + 2*a*d
        // At max height, v_f = 0. So, 0 = v0y^2 - 2*g*h_max
        // h_max = v0y^2 / (2*g)
        const h_max_above_cannon = (v0y ** 2) / (2 * gravity);
        return initialHeight + h_max_above_cannon;
    }

    function updateScale() {
        const groundHeightPixels = 40;
        const availableHeight = p.height - groundHeightPixels;

        const predictedMaxHeight = calculateMaxHeight();
        const requiredMeters = Math.max(initialHeight, predictedMaxHeight) * 1.2; // 20% buffer
        const minVisibleMeters = 20; // Ensure a minimum zoom level

        const visibleMeters = Math.max(requiredMeters, minVisibleMeters);
        pixelsPerMeter = availableHeight / visibleMeters;

        resetSimulation();
    }

    p.setup = () => {
        const canvasContainer = document.getElementById('projectile-motion-canvas');
        const canvas = p.createCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
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

        const controls = [
            { slider: initialHeightSlider, input: p.select('#initial-height-input'), value: () => initialHeight = parseFloat(initialHeightSlider.value()), label: p.select('#initial-height-value') },
            { slider: initialVelocitySlider, input: p.select('#initial-velocity-input'), value: () => initialVelocity = parseFloat(initialVelocitySlider.value()), label: p.select('#initial-velocity-value') },
            { slider: launchAngleSlider, input: p.select('#launch-angle-input'), value: () => launchAngle = parseFloat(launchAngleSlider.value()), label: p.select('#launch-angle-value') },
            { slider: gravitySlider, input: p.select('#proj-gravity-input'), value: () => gravity = parseFloat(gravitySlider.value()), label: p.select('#proj-gravity-value') },
            { slider: massSlider, input: p.select('#proj-mass-input'), value: () => mass = parseFloat(massSlider.value()), label: p.select('#proj-mass-value') },
            { slider: diameterSlider, input: p.select('#proj-diameter-input'), value: () => diameter = parseFloat(diameterSlider.value()), label: p.select('#proj-diameter-value') }
        ];

        controls.forEach(c => {
            const updateHandler = () => {
                c.value();
                // Update scale if any parameter affecting trajectory height changes
                if (c.slider === initialHeightSlider || c.slider === initialVelocitySlider || c.slider === launchAngleSlider || c.slider === gravitySlider) {
                    updateScale();
                }
            };

            c.slider.input(() => {
                c.input.value(c.slider.value());
                c.label.html(c.slider.value());
                updateHandler();
            });

            c.input.input(() => {
                let val = parseFloat(c.input.value());
                const min = parseFloat(c.slider.elt.min);
                const max = parseFloat(c.slider.elt.max);
                if (isNaN(val)) return;
                val = p.constrain(val, min, max);
                c.slider.value(val);
                c.label.html(val);
                updateHandler();
            });
        });

        projectileSelect.changed(() => {
            const projectileType = projectileSelect.value();
            const data = PROJECTILES[projectileType];

            // Update physics parameters
            mass = data.mass;
            diameter = data.diameter;
            initialHeight = data.initialHeight;
            initialVelocity = data.initialVelocity;
            launchAngle = data.launchAngle;

            // Update all controls
            controls.forEach(c => {
                let val;
                if (c.slider === massSlider) val = mass;
                else if (c.slider === diameterSlider) val = diameter;
                else if (c.slider === initialHeightSlider) val = initialHeight;
                else if (c.slider === initialVelocitySlider) val = initialVelocity;
                else if (c.slider === launchAngleSlider) val = launchAngle;

                if (val !== undefined) {
                    c.slider.value(val);
                    c.input.value(val);
                    c.label.html(val);
                }
            });

            updateScale();
        });

        airResistanceSwitch.changed(() => airResistanceOn = airResistanceSwitch.checked());

        cannon = new Cannon();
        target = new Target(p.width * 0.75, p.height - 100, 50);
        trajectoryMeter = new TrajectoryMeter(p.width / 2, p.height / 2);
        updateScale(); // Initial setup call
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
        trajectoryMeter.display();

        let allPaths = [...traces];
        if (projectile && projectile.path.length > 0) {
            allPaths.push(projectile.path);
        }

        if (allPaths.length > 0) {
            let closestPoint = null;
            let minDist = Infinity;

            allPaths.forEach(path => {
                path.forEach(pt => {
                    const d = p.dist(trajectoryMeter.pos.x, trajectoryMeter.pos.y, pt.x, pt.y);
                    if (d < minDist) {
                        minDist = d;
                        closestPoint = pt;
                    }
                });
            });

            if (minDist < 30 && closestPoint) { // 30 pixel tolerance
                trajectoryMeter.drawTooltip(closestPoint);
            }
        }
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
        } else if (p.dist(p.mouseX, p.mouseY, trajectoryMeter.pos.x, trajectoryMeter.pos.y) < trajectoryMeter.size / 2) {
            trajectoryMeter.isDragging = true;
            trajectoryMeter.offsetX = trajectoryMeter.pos.x - p.mouseX;
            trajectoryMeter.offsetY = trajectoryMeter.pos.y - p.mouseY;
        }
    };

    p.mouseReleased = () => {
        isDraggingTarget = false;
        trajectoryMeter.isDragging = false;
    };

    p.windowResized = () => {
        const canvasContainer = document.getElementById('projectile-motion-canvas');
        p.resizeCanvas(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
        updateScale(); // Recalculate scale and positions based on new canvas size
    };
};

export default projectileMotionSketch;
