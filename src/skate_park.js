import p5 from 'p5';

const skateParkSketch = (p) => {
    // --- Simulation State ---
    let skater;
    let path;
    let dragging = false;

    // --- DOM Elements ---
    let massSlider, gravitySlider, frictionSlider;
    let resetButton;

    // --- Physics Constants ---
    let mass = 50;
    let gravity = 9.8;
    let friction = 0;

    // --- Path Definition ---
    // A simple parabolic path: y = a*x^2
    const pathScale = 0.005;
    const pathYOffset = 200;

    class Skater {
        constructor(x, y) {
            this.pos = p.createVector(x, y);
            this.vel = p.createVector(0, 0);
            this.acc = p.createVector(0, 0);
            this.radius = 20;
            this.energy = { kinetic: 0, potential: 0, total: 0, thermal: 0 };
        }

        applyForce(force) {
            let f = p5.Vector.div(force, mass);
            this.acc.add(f);
        }

        update() {
            if (dragging) return;

            // --- Physics Calculations ---
            const pathY = pathScale * this.pos.x * this.pos.x;
            const tangentAngle = p.atan(2 * pathScale * this.pos.x);

            // Gravity force component along the tangent
            const gravityForce = p.createVector(
                -mass * gravity * p.sin(tangentAngle) * p.cos(tangentAngle),
                mass * gravity * p.sin(tangentAngle) * p.sin(tangentAngle)
            );
            this.applyForce(gravityForce);

            // Friction force (opposite to velocity)
            if (friction > 0) {
                const frictionForce = this.vel.copy();
                frictionForce.mult(-1);
                frictionForce.normalize();
                frictionForce.mult(friction * mass * gravity); // Simplified friction model
                this.applyForce(frictionForce);
            }

            this.vel.add(this.acc);
            this.pos.add(this.vel);
            this.acc.mult(0); // Clear acceleration

            // Stick to the path
            this.pos.y = pathScale * this.pos.x * this.pos.x;

            // --- Energy Calculations ---
            const height = pathYOffset - this.pos.y;
            this.energy.potential = mass * gravity * height / 100; // Scaled for display
            this.energy.kinetic = 0.5 * mass * this.vel.magSq() / 10; // Scaled for display

            const currentTotal = this.energy.potential + this.energy.kinetic;
            if (this.energy.total === 0) this.energy.total = currentTotal;

            // Energy loss due to friction
            if (friction > 0) {
                const loss = this.energy.total - currentTotal;
                if (loss > 0) {
                    this.energy.thermal += loss;
                }
            }
            this.energy.total = currentTotal;
        }

        display() {
            p.push();
            p.translate(this.pos.x, this.pos.y);
            p.fill(100, 150, 255);
            p.stroke(0);
            p.ellipse(0, 0, this.radius * 2);
            p.pop();
        }
    }

    p.setup = () => {
        const canvasContainer = document.getElementById('skate-park-canvas');
        const canvas = p.createCanvas(canvasContainer.offsetWidth, 500);
        canvas.parent('skate-park-canvas');

        // Get DOM elements
        massSlider = p.select('#mass-slider');
        gravitySlider = p.select('#gravity-slider');
        frictionSlider = p.select('#friction-slider');
        resetButton = p.select('#reset-skater-btn');

        // Attach events
        massSlider.input(() => mass = massSlider.value());
        gravitySlider.input(() => gravity = gravitySlider.value());
        frictionSlider.input(() => friction = frictionSlider.value());
        resetButton.mousePressed(resetSkater);

        canvas.mousePressed(startDragging);
        canvas.mouseReleased(stopDragging);

        resetSkater();
    };

    function resetSkater() {
        skater = new Skater(-p.width / 4, pathScale * (-p.width/4)**2);
        skater.energy.total = 0; // Recalculate total energy on reset
        skater.energy.thermal = 0;
    }

    p.draw = () => {
        p.background(240);
        p.translate(p.width / 2, pathYOffset); // Center horizontally, move origin down

        drawPath();

        if (dragging) {
            // Snap skater to mouse X on the path
            let mouseX = p.mouseX - p.width / 2;
            mouseX = p.constrain(mouseX, -p.width/2 + skater.radius, p.width/2 - skater.radius);
            skater.pos.x = mouseX;
            skater.pos.y = pathScale * skater.pos.x * skater.pos.x;
            skater.vel.mult(0); // Reset velocity while dragging
        }

        skater.update();
        skater.display();

        // Must be drawn last, without translation
        p.resetMatrix();
        drawEnergyBars();
    };

    function drawPath() {
        p.noFill();
        p.stroke(0);
        p.strokeWeight(4);
        p.beginShape();
        for (let x = -p.width / 2; x <= p.width / 2; x += 10) {
            p.vertex(x, pathScale * x * x);
        }
        p.endShape();
    }

    function drawEnergyBars() {
        const barWidth = 20;
        const barSpacing = 30;
        const startX = 20;
        const startY = p.height - 20;

        // Potential Energy (Blue)
        p.fill(0, 0, 255);
        p.rect(startX, startY - skater.energy.potential, barWidth, skater.energy.potential);

        // Kinetic Energy (Green)
        p.fill(0, 255, 0);
        p.rect(startX + barSpacing, startY - skater.energy.kinetic, barWidth, skater.energy.kinetic);

        // Thermal Energy (Red)
        p.fill(255, 0, 0);
        p.rect(startX + 2 * barSpacing, startY - skater.energy.thermal, barWidth, skater.energy.thermal);

        // Total Energy (Yellow line)
        p.stroke(255, 204, 0);
        p.strokeWeight(3);
        const totalEnergy = skater.energy.kinetic + skater.energy.potential + skater.energy.thermal;
        p.line(startX - 5, startY - totalEnergy, startX + 3 * barSpacing, startY - totalEnergy);
    }

    function startDragging() {
        const d = p.dist(p.mouseX - p.width / 2, p.mouseY - pathYOffset, skater.pos.x, skater.pos.y);
        if (d < skater.radius) {
            dragging = true;
            skater.energy.total = 0; // Recalculate total energy on release
            skater.energy.thermal = 0;
        }
    }

    function stopDragging() {
        dragging = false;
    }
};

export default skateParkSketch;
