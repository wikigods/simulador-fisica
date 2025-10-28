import { test, expect } from '@playwright/test';

test.describe('Simulation Verification', () => {
  test('should load the simulation and display the canvas', async ({ page }) => {
    // Navigate to the local development server
    await page.goto('http://localhost:5176/simulador-fisica/');

    // Click on the "Laboratorio de Vectores" card to start the simulation
    await page.click('text=Laboratorio de Vectores');

    // Wait for the canvas to be visible
    await page.waitForSelector('#vector-lab-canvas canvas', { state: 'visible' });

    // Take a screenshot of the simulation
    await page.screenshot({ path: 'jules-scratch/verification/02_simulation_page.png' });

    // Assert that the canvas is present
    const canvas = await page.$('#vector-lab-canvas canvas');
    expect(canvas).not.toBeNull();
  });
});
