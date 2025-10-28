import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './src/styles/main.scss';
import p5 from 'p5';
import vectorLabSketch from './src/vector_lab.js';
import skateParkSketch from './src/skate_park.js';
import projectileMotionSketch from './src/projectile_motion.js';

// --- State Management ---
let currentSketch = null;

// --- DOM Elements ---
const homeSection = document.getElementById('home-section');
const simContent = document.getElementById('sim-content');
const simContainers = document.querySelectorAll('.sim-container');
const simCards = document.querySelectorAll('.sim-card');
const backToHomeBtn = document.getElementById('back-to-home');

// --- Functions ---

/**
 * Loads a p5.js sketch into its container.
 * @param {string} simId - The ID of the simulation to load (e.g., 'vector-lab').
 */
function loadSketch(simId) {
    // 1. Clean up the previous sketch if it exists
    if (currentSketch) {
        currentSketch.remove();
        currentSketch = null;
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
            currentSketch = new p5(vectorLabSketch, document.getElementById('vector-lab-canvas'));
            break;
        case 'skate-park':
            currentSketch = new p5(skateParkSketch, document.getElementById('skate-park-canvas'));
            break;
        case 'projectile-motion':
            currentSketch = new p5(projectileMotionSketch, document.getElementById('projectile-motion-canvas'));
            break;
        default:
            console.error(`Unknown simId: ${simId}`);
    }
}

/**
 * Shows the home screen and hides the simulation content.
 */
function showHomeScreen() {
    homeSection.style.display = 'block';
    simContent.style.display = 'none';
    if (currentSketch) {
        currentSketch.remove();
        currentSketch = null;
    }
}

/**
 * Shows the simulation content and hides the home screen.
 * @param {string} simId - The ID of the simulation to display.
 */
function showSimScreen(simId) {
    homeSection.style.display = 'none';
    simContent.style.display = 'block';
    loadSketch(simId);
}

// --- Event Listeners ---
simCards.forEach(card => {
    card.addEventListener('click', () => {
        const simId = card.getAttribute('data-sim');
        showSimScreen(simId);
    });
});

backToHomeBtn.addEventListener('click', showHomeScreen);

// --- Initial Load ---
// Show the home screen by default.
window.addEventListener('DOMContentLoaded', () => {
    showHomeScreen();
});
