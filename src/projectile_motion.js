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

            const roadSurfaceY = p.height - 10;
            if (this.pos.y > roadSurfaceY - this.radius || target.checkCollision(this.pos)) {
                this.inFlight = false;
                if (this.pos.y > roadSurfaceY - this.radius) this.pos.y = roadSurfaceY - this.radius;
            }
        }

        display() {
            p.fill(20);
            p.noStroke();
            p.ellipse(this.pos.x, this.pos.y, this.radius * 2);
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

            // --- Display Distance ---
            const distanceInMeters = (this.pos.x - cannon.pos.x) / pixelsPerMeter;
            p.push();
            p.fill(255);
            p.stroke(0);
            p.strokeWeight(1);
            p.rect(this.pos.x - 40, this.pos.y + this.size / 2 + 5, 80, 25);
            p.fill(0);
            p.textSize(16);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(`${distanceInMeters.toFixed(1)} m`, this.pos.x, this.pos.y + this.size / 2 + 18);
            p.pop();
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
            const groundY = p.height - 10; // Adjusted for road surface
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

    function calculateFlightTimeAndRange() {
        const v0y = initialVelocity * p.sin(p.radians(launchAngle));
        const v0x = initialVelocity * p.cos(p.radians(launchAngle));

        // Solve for t when y(t) = 0 using the quadratic formula: y = y0 + v0y*t - 0.5*g*t^2
        const a = -0.5 * gravity;
        const b = v0y;
        const c = initialHeight;

        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return { time: 0, range: 0 };

        const t_flight = (-b - p.sqrt(discriminant)) / (2 * a);
        const range = v0x * t_flight;

        return { time: t_flight, range: range };
    }

    function updateScale() {
        const groundHeightPixels = 10; // Adjusted for road surface
        const padding = 1.2; // 20% buffer

        const availableHeight = p.height - groundHeightPixels;
        const availableWidth = p.width;

        // Calculate trajectory metrics
        const predictedMaxHeight = calculateMaxHeight();
        const { range: predictedRange } = calculateFlightTimeAndRange();

        // Determine required world units to be visible
        const requiredHeightMeters = Math.max(initialHeight, predictedMaxHeight);
        const requiredWidthMeters = predictedRange;

        // Ensure we don't zoom in too far
        const minVisibleHeight = 20;
        const minVisibleWidth = 20;

        // Calculate scale based on height and width constraints
        const ppmHeight = availableHeight / (Math.max(requiredHeightMeters, minVisibleHeight) * padding);
        const ppmWidth = availableWidth / (Math.max(requiredWidthMeters, minVisibleWidth) * padding);

        // Use the more restrictive scale (the smaller value) to ensure everything fits
        pixelsPerMeter = Math.min(ppmHeight, ppmWidth);

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
        target = new Target(p.width * 0.75, p.height - 35, 50); // Adjusted for road
        trajectoryMeter = new TrajectoryMeter(p.width / 2, p.height / 2);
        updateScale(); // Initial setup call
    };

    function drawTraces() {
        let allPaths = [...traces];
        if (projectile && projectile.path.length > 0) {
            allPaths.push(projectile.path);
        }

        allPaths.forEach(path => {
            p.noFill();
            p.stroke(0, 0, 255, 100);
            p.strokeWeight(2);
            p.beginShape();
            path.forEach(pt => p.vertex(pt.x, pt.y));
            p.endShape();
        });
    }

    p.draw = () => {
        drawBackground();

        // Draw static objects and traces first.
        drawTraces();
        trajectoryMeter.display();
        cannon.update(initialHeight, launchAngle);
        cannon.display();
        target.display();

        // Update and draw the projectile on top.
        if (projectile) {
            projectile.update(p.deltaTime / 1000);
            projectile.display();
        }

        // Draw the tooltip last so it's on top of everything.
        const allPaths = projectile ? [...traces, projectile.path] : [...traces];
        const allPoints = allPaths.flat();

        if (allPoints.length > 0) {
            const { point: closestPoint, dist: minDist } = allPoints.reduce((acc, pt) => {
                const d = p.dist(trajectoryMeter.pos.x, trajectoryMeter.pos.y, pt.x, pt.y);
                return d < acc.dist ? { point: pt, dist: d } : acc;
            }, { point: null, dist: Infinity });

            if (minDist < 30 && closestPoint) { // 30 pixel tolerance
                trajectoryMeter.drawTooltip(closestPoint);
            }
        }
    };

    function drawBackground() {
        p.background(135, 206, 250); // Sky blue

        const groundAreaY = p.height - 40;
        const roadHeight = 30;
        const roadOffsetY = 5;
        const roadSurfaceY = groundAreaY + roadOffsetY;

        // Grass
        p.fill(34, 139, 34); // Green
        p.noStroke();
        p.rect(0, groundAreaY, p.width, 40);

        // Road
        p.fill(100); // Grey
        p.rect(0, roadSurfaceY, p.width, roadHeight);

        // Dashed line
        p.stroke(255, 223, 0); // Yellow
        p.strokeWeight(2);
        const dashLength = 15;
        const dashGap = 10;
        const lineY = roadSurfaceY + roadHeight / 2;
        for (let x = 0; x < p.width; x += dashLength + dashGap) {
            p.line(x, lineY, x + dashLength, lineY);
        }
        p.noStroke(); // Reset stroke
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
