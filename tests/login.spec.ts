import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import users from '../data/users.json';
import { time } from 'node:console';

test.describe('Flujos de Autenticación', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('CP01: Login exitoso y redirección al inventario', async ({ page }) => {
    await test.step('Ingresar credenciales válidas', async () => {
      await loginPage.login(process.env.STANDARD_USER || users.validUser);
    });

    await test.step('Validar redirección correcta y visibilidad del módulo', async () => {
      await expect(page).toHaveURL(/.*inventory.html/);
      await expect(page.locator('.inventory_list')).toBeVisible();
    });
  });

  test('CP02: Validar prevención de acceso a usuario bloqueado', async () => {
    await test.step('Ingresar credenciales de usuario bloqueado', async () => {
      await loginPage.login(process.env.LOCKED_USER || users.lockedUser);
    });

    await test.step('Validar mensaje de error descriptivo en pantalla', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
    });
  });
});