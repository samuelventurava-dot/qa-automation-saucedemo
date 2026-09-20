import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/ChecckoutPage';
import products from '../data/products.json';
import { step } from '../utils/customStep';

test.describe('Flujo de Compra E2E', () => {
  test('CP05: Checkout E2E - Flujo correcto de proceso y ejecución', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await step('Autenticación y selección de producto', page, async () => {
      await loginPage.navigate();
      await loginPage.fillCredentials(process.env.STANDARD_USER!);
      await loginPage.submitLogin();
      await inventoryPage.addProductToCart(products[0].id);
    });

    await step('Navegar al carrito e iniciar checkout', page, async () => {
      await inventoryPage.goToCart();
      await cartPage.proceedToCheckout();
    });

    await step('Completar formulario de envío', page, async () => {
      await checkoutPage.fillShippingInfo('Jorge', 'Ventura', '56600');
    });

    await step('Finalizar orden y validar mensaje de éxito', page, async () => {
      await checkoutPage.finishOrder();
      const message = await checkoutPage.getConfirmationMessage();
      expect(message).toBe('Thank you for your order!');
    });
  });
});