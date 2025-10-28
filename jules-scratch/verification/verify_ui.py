import time
from playwright.sync_api import sync_playwright

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Give the server a moment to start up
        time.sleep(15)

        page.goto("http://localhost:5173/")
        page.screenshot(path="jules-scratch/verification/01_home_page_full_text.png")

        browser.close()

if __name__ == '__main__':
    main()
