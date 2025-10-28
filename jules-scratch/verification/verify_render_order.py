
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            # Navigate to the correct URL
            await page.goto("http://localhost:5179/simulador-fisica/")

            # CORRECTED LOCATOR: Find the card by its text and click it
            await page.locator("div.card", has_text="Movimiento de Proyectiles").click()

            # Wait for the canvas to be fully loaded
            await page.wait_for_selector("#projectile-motion-canvas", state="attached")
            await page.wait_for_timeout(2000)

            # Get canvas dimensions for interaction
            canvas = await page.query_selector("#projectile-motion-canvas")
            if not canvas:
                raise Exception("Canvas element not found")

            box = await canvas.bounding_box()
            if not box:
                raise Exception("Canvas bounding box not found")

            # Define coordinates for the drag action
            start_x = box['x'] + box['width'] * 0.5
            start_y = box['y'] + box['height'] * 0.5
            end_x = box['x'] + box['width'] * 0.8
            end_y = box['y'] + box['height'] * 0.9

            # Simulate the drag
            await page.mouse.move(start_x, start_y)
            await page.mouse.down()
            await page.mouse.move(end_x, end_y)
            await page.mouse.up()

            await page.wait_for_timeout(500)

            # Take the screenshot
            await page.screenshot(path="jules-scratch/verification/render_order_fix.png")
            print("Screenshot saved successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
