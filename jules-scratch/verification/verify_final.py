
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:5179/simulador-fisica/")

    # Click the "Projectile Motion" nav link to ensure the correct sim is active
    page.click('a[data-sim="projectile-motion"]')

    # Select the "Piano" projectile
    page.select_option("#projectile-select", "piano")

    # Wait for the values to update and for the canvas to render
    page.wait_for_timeout(1000)

    # Take the screenshot
    page.screenshot(path="jules-scratch/verification/final_verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
