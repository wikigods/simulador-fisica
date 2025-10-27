from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5173/")

        # Click the link to navigate to the Projectile Motion simulation
        page.click('a[data-sim="projectile-motion"]')

        # Wait for the container to be visible
        page.wait_for_selector('#projectile-motion-container')

        page.screenshot(path="jules-scratch/verification/projectile-motion-ui.png")
        browser.close()

run()
