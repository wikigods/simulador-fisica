import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import p5 from 'p5';
import vectorLabSketch from './src/vector_lab.js';
import skateParkSketch from './src/skate_park.js';
import projectileMotionSketch from './src/projectile_motion.js';

// --- State Management ---
let currentSketch = null;

// --- DOM Elements ---
const navLinks = document.querySelectorAll('.nav-link');
const simContainers = document.querySelectorAll('.sim-container');

// --- Functions ---

/**
 * Loads a p5.js sketch into its container.
 * @param {string} simId - The ID of the simulation to load (e.g., 'vector-lab').
 */
function loadSketch(simId) {
    // 1. Clean up the previous sketch if it exists
    if (currentSketch) {
        currentSketch.remove();
    }

    // 2. Hide all containers and show the target one
    simContainers.forEach(c => c.style.display = 'none');
    const targetContainer = document.getElementById(`${simId}-container`);
    if (targetContainer) {
        targetContainer.style.display = 'block';
    } else {
        console.error(`Container for simId '${simId}' not found.`);
        return;
    }

    // 3. Load the new sketch
    switch (simId) {
        case 'vector-lab':
            currentSketch = new p5(vectorLabSketch);
            break;
        case 'skate-park':
            currentSketch = new p5(skateParkSketch);
            break;
        case 'projectile-motion':
            currentSketch = new p5(projectileMotionSketch);
            break;
        default:
            console.error(`Unknown simId: ${simId}`);
    }
}


// --- Event Listeners ---
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Deactivate all links
        navLinks.forEach(l => l.classList.remove('active'));

        // Activate the clicked link
        const clickedLink = e.target;
        clickedLink.classList.add('active');

        // Load the corresponding sketch
        const simId = clickedLink.getAttribute('data-sim');
        loadSketch(simId);
    });
});

// --- Initial Load ---
// Load the default simulation (Vector Lab) when the page loads.
window.addEventListener('DOMContentLoaded', () => {
    loadSketch('vector-lab');
});
