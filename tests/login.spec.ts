import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import users from '../data/users.json';
import { step } from '../utils/customStep';

test.describe('Flujos de Autenticación', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('CP01: Login exitoso y redirección al inventario', async ({ page }) => {
    await step('Ingresar credenciales válidas', page, async () => {
      await loginPage.fillCredentials(process.env.STANDARD_USER || users.validUser);
    });

    await step('Enviar formulario de autenticación', page, async () => {
      await loginPage.submitLogin();
    });

    await step('Validar redirección correcta y visibilidad del módulo', page, async () => {
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(page.locator('.inventory_list')).toBeVisible();
    });
  });

  test('CP02: Validar prevención de acceso a usuario bloqueado', async ({ page }) => {
    await step('Ingresar credenciales de usuario bloqueado', page, async () => {
      await loginPage.fillCredentials(process.env.LOCKED_USER || users.lockedUser);
    });

    await step('Enviar formulario de autenticación', page, async () => {
      await loginPage.submitLogin();
    });

    await step('Validar mensaje de error descriptivo en pantalla', page, async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
    });
  });

  test('CP03: Demostrar fallo controlado sin detener ejecución (Soft Assertion)', async ({ page }) => {
    await step('Ingresar credenciales válidas', page, async () => {
      await loginPage.fillCredentials(process.env.STANDARD_USER || users.validUser);
      await loginPage.submitLogin();
    });

    await step('Validación intencionalmente fallida (Soft Assertion)', page, async () => {
      const logo = page.locator('.app_logo');
      await expect.soft(logo).toHaveText('Tienda Falsa Automotriz');
    });

    await step('Paso posterior que confirma que la ejecución no se detuvo', page, async () => {
      await expect(page.locator('.inventory_list')).toBeVisible();
    });
  });
});