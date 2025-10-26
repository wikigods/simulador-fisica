import p5 from 'p5';

const vectorLabSketch = (p) => {
    let vectorA, vectorB;
    let originA, originB;
    let drawingState = {
        isDrawing: false,
        startPoint: null,
        currentVector: 'A'
    };

    // DOM Elements (will be selected via the p5 instance)
    let showSumCheckbox, showComponentsCheckbox;
    let vectorAData, vectorBData, vectorSumData, scalarProductData, vectorProductData;

    p.setup = () => {
        const canvasContainer = document.getElementById('vector-lab-canvas');
        const canvas = p.createCanvas(canvasContainer.offsetWidth, 500); // Responsive width
        canvas.parent('vector-lab-canvas');

        originA = p.createVector(0, 0);
        originB = p.createVector(0, 0);
        vectorA = p.createVector(0, 0);
        vectorB = p.createVector(0, 0);

        // Get DOM elements using p5's select
        showSumCheckbox = p.select('#show-sum');
        showComponentsCheckbox = p.select('#show-components');
        vectorAData = p.select('#vector-a-data');
        vectorBData = p.select('#vector-b-data');
        vectorSumData = p.select('#vector-sum-data');
        scalarProductData = p.select('#scalar-product-data');
        vectorProductData = p.select('#vector-product-data');

        // Attach mouse press/release events to the canvas to avoid conflicts
        canvas.mousePressed(handleMousePressed);
        canvas.mouseReleased(handleMouseReleased);
    };

    p.draw = () => {
        p.background(240);
        p.translate(p.width / 2, p.height / 2);

        drawGrid();
        drawAxes();

        drawVector(originA, vectorA, p.color('blue'));
        drawVector(originB, vectorB, p.color('red'));

        if (drawingState.isDrawing) {
            const mouseVec = p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2);
            const currentDrawingVec = p5.Vector.sub(mouseVec, drawingState.startPoint);
            drawVector(drawingState.startPoint, currentDrawingVec, p.color(0, 0, 0, 128));
            displayVectorInfo(currentDrawingVec, mouseVec);
        }

        if (showSumCheckbox.checked()) {
            drawSum();
        }
        if (showComponentsCheckbox.checked()) {
            drawComponents(originA, vectorA, p.color('blue'));
            drawComponents(originB, vectorB, p.color('red'));
        }

        updateDataPanel();
    };

    function handleMousePressed() {
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
            drawingState.isDrawing = true;
            drawingState.startPoint = p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2);
        }
    }

    function handleMouseReleased() {
        if (drawingState.isDrawing) {
            drawingState.isDrawing = false;
            const endPoint = p.createVector(p.mouseX - p.width / 2, p.mouseY - p.height / 2);
            const newVector = p5.Vector.sub(endPoint, drawingState.startPoint);

            if (drawingState.currentVector === 'A') {
                vectorA = newVector;
                originA = drawingState.startPoint.copy();
                drawingState.currentVector = 'B';
            } else {
                vectorB = newVector;
                originB = drawingState.startPoint.copy();
                drawingState.currentVector = 'A';
            }
        }
    }

    // --- Helper Drawing Functions ---
    function drawGrid() {
        p.stroke(200);
        p.strokeWeight(1);
        for (let x = -p.width / 2; x < p.width / 2; x += 20) {
            p.line(x, -p.height / 2, x, p.height / 2);
        }
        for (let y = -p.height / 2; y < p.height / 2; y += 20) {
            p.line(-p.width / 2, y, p.width / 2, y);
        }
    }

    function drawAxes() {
        p.stroke(0);
        p.strokeWeight(2);
        p.line(-p.width / 2, 0, p.width / 2, 0); // X-Axis
        p.line(0, -p.height / 2, 0, p.height / 2); // Y-Axis
    }

    function drawVector(origin, vec, color) {
        if (vec.mag() === 0) return;
        p.push();
        p.stroke(color);
        p.strokeWeight(3);
        p.fill(color);
        p.translate(origin.x, origin.y);
        p.line(0, 0, vec.x, vec.y);

        let angle = vec.heading();
        p.translate(vec.x, vec.y);
        p.rotate(angle);
        p.triangle(0, 0, -8, 4, -8, -4);
        p.pop();
    }

    function displayVectorInfo(vec, position) {
        const mag = vec.mag().toFixed(2);
        const angle = p.degrees(p.atan2(-vec.y, vec.x)).toFixed(2);
        const textContent = `|V|: ${mag}\nθ: ${angle}°\n(${vec.x.toFixed(1)}, ${-vec.y.toFixed(1)})`;

        p.push();
        p.noStroke();
        p.fill(0);
        p.textSize(14);
        p.text(textContent, position.x + 15, position.y);
        p.pop();
    }

    function drawSum() {
        const sumVector = p5.Vector.add(vectorA, vectorB);
        drawVector(p.createVector(0, 0), sumVector, p.color('green'));
    }

    function drawComponents(origin, vec, color) {
        p.push();
        p.stroke(color);
        p.strokeWeight(1);
        p.drawingContext.setLineDash([5, 5]);
        p.line(origin.x, origin.y, origin.x + vec.x, origin.y);
        p.line(origin.x + vec.x, origin.y, origin.x + vec.x, origin.y + vec.y);
        p.drawingContext.setLineDash([]);
        p.pop();
    }

    function updateDataPanel() {
        const magA = vectorA.mag();
        const angleA = p.degrees(p.atan2(-vectorA.y, vectorA.x));
        vectorAData.html(`(x: ${vectorA.x.toFixed(1)}, y: ${-vectorA.y.toFixed(1)}), |A|: ${magA.toFixed(1)}, θ: ${angleA.toFixed(1)}°`);

        const magB = vectorB.mag();
        const angleB = p.degrees(p.atan2(-vectorB.y, vectorB.x));
        vectorBData.html(`(x: ${vectorB.x.toFixed(1)}, y: ${-vectorB.y.toFixed(1)}), |B|: ${magB.toFixed(1)}, θ: ${angleB.toFixed(1)}°`);

        const sumVector = p5.Vector.add(vectorA, vectorB);
        const magSum = sumVector.mag();
        const angleSum = p.degrees(p.atan2(-sumVector.y, sumVector.x));
        vectorSumData.html(`(x: ${sumVector.x.toFixed(1)}, y: ${-sumVector.y.toFixed(1)}), |R|: ${magSum.toFixed(1)}, θ: ${angleSum.toFixed(1)}°`);

        const scalarProd = vectorA.dot(vectorB);
        scalarProductData.html(`${scalarProd.toFixed(2)}`);

        const vectorProd = vectorA.cross(vectorB);
        vectorProductData.html(`${-vectorProd.z.toFixed(2)} (in z-axis)`);
    }
};

export default vectorLabSketch;