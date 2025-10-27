from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5173/")

        # Navigate to the Projectile Motion simulation
        page.click('a[data-sim="projectile-motion"]')
        page.wait_for_selector('#projectile-motion-container')

        # Fire the cannon
        page.click('#fire-btn')

        # Wait for the simulation to run and the projectile to land
        time.sleep(3)

        # Move the mouse over the canvas to trigger the trajectory meter
        canvas = page.query_selector('#projectile-motion-canvas canvas')
        if canvas:
            box = canvas.bounding_box()
            page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2)
            time.sleep(0.5) # Give it a moment to render the tooltip

        page.screenshot(path="jules-scratch/verification/trajectory-meter.png")
        browser.close()

run()
