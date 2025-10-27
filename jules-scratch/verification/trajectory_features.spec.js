// jules-scratch/verification/trajectory_features.spec.js
import { test, expect } from '@playwright/test';

test.describe('Verification for New Trajectory Features', () => {
  const SIMULATION_URL = 'http://localhost:5180';

  test.beforeEach(async ({ page }) => {
    await page.goto(SIMULATION_URL);
    await page.getByRole('link', { name: 'Projectile Motion' }).click();
    await page.waitForSelector('#projectile-motion-canvas canvas');
  });

  test('should display translated tooltip with the draggable meter', async ({ page }) => {
    // Fire the projectile with default settings
    await page.locator('#fire-btn').click();

    // Wait for the trajectory to be drawn
    await page.waitForTimeout(1000);

    // Find the canvas to calculate drag coordinates
    const canvas = page.locator('#projectile-motion-canvas canvas');
    const canvasBoundingBox = await canvas.boundingBox();

    // Manually simulate a drag-and-drop for better canvas compatibility
    const startX = canvasBoundingBox.x + canvasBoundingBox.width / 2;
    const startY = canvasBoundingBox.y + canvasBoundingBox.height / 2;
    const endX = canvasBoundingBox.x + canvasBoundingBox.width * 0.4;
    const endY = canvasBoundingBox.y + canvasBoundingBox.height * 0.4;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY, { steps: 5 }); // Use steps for smoother dragging
    await page.mouse.up();

    // Text inside a canvas cannot be asserted with a locator.
    // Verification will be done by visually inspecting the screenshot.
    await page.waitForTimeout(250); // Allow a moment for the final frame to draw

    await page.screenshot({ path: 'jules-scratch/verification/draggable_meter_verification.png' });
    console.log('Draggable meter screenshot captured.');
  });

  test('should keep the entire trajectory visible with dynamic zoom', async ({ page }) => {
    // Set high initial velocity to force a large trajectory
    await page.locator('#initial-velocity-input').fill('80');
    await page.locator('#launch-angle-input').fill('60');
    await page.waitForTimeout(500); // Wait for the view to scale

    // Fire the projectile
    await page.locator('#fire-btn').click();

    // Wait for the animation to complete
    await page.waitForTimeout(3000);

    await page.screenshot({ path: 'jules-scratch/verification/trajectory_zoom_verification.png' });
    console.log('Trajectory zoom screenshot captured.');
  });
});
