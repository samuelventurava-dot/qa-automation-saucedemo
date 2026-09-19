import { test, Page } from '@playwright/test';

/**
 * Wrapper personalizado para test.step que ejecuta la acción, 
 * toma una captura de pantalla automáticamente y la adjunta al reporte.
 */
export async function step(title: string, page: Page, action: () => Promise<void>) {
  await test.step(title, async () => {
    await action();

    await page.waitForLoadState('domcontentloaded'); 

    const screenshot = await page.screenshot({ fullPage: true });

    await test.info().attach(`Evidencia: ${title}`, {
      body: screenshot,
      contentType: 'image/png'
    });
  });
}