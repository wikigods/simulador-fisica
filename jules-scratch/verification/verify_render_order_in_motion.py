
import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        try:
            await page.goto("http://localhost:5179/simulador-fisica/")

            # Navigate to the correct simulation
            await page.locator("div.card", has_text="Movimiento de Proyectiles").click()

            # Wait for canvas to load
            await page.wait_for_selector("#projectile-motion-canvas", state="attached")
            await page.wait_for_timeout(2000)

            # Fire the projectile
            await page.get_by_role("button", name="¡Disparar!").click()

            # Wait for a moment to let the projectile travel a bit
            await page.wait_for_timeout(500)

            # Get canvas for interaction
            canvas = await page.query_selector("#projectile-motion-canvas")
            if not canvas:
                raise Exception("Canvas element not found")
            box = await canvas.bounding_box()
            if not box:
                raise Exception("Canvas bounding box not found")

            # Move the measurement tool over the projectile's path
            start_x = box['x'] + box['width'] * 0.5
            start_y = box['y'] + box['height'] * 0.5
            # Target a point along the trajectory
            end_x = box['x'] + box['width'] * 0.4
            end_y = box['y'] + box['height'] * 0.6

            await page.mouse.move(start_x, start_y)
            await page.mouse.down()
            await page.mouse.move(end_x, end_y)
            await page.mouse.up()

            # Final wait for rendering
            await page.wait_for_timeout(500)

            # Capture the definitive proof
            await page.screenshot(path="jules-scratch/verification/render_order_in_motion.png")
            print("Screenshot of in-motion verification saved.")

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
