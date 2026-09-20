import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import products from '../data/products.json';
import { step } from '../utils/customStep';

test.describe('Flujos de Inventario y Carrito', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    
    await loginPage.navigate();
    await loginPage.fillCredentials(process.env.STANDARD_USER!);
    await loginPage.submitLogin();
  });

  test('CP03: Gestión de carrito - Agregar productos y validar listado', async ({page}) => {
    await step('Agregar productos dinámicamente desde el archivo de datos', page, async () => {
      for (const product of products) {
        await inventoryPage.addProductToCart(product.id);
      }
    });

    await step('Validar contador del carrito en el header',page, async () => {
      const count = await inventoryPage.getCartItemCount();
      expect(count).toBe(products.length);
    });

    await step('Navegar al carrito y validar items añadidos',page, async () => {
      await inventoryPage.goToCart();
      await expect(cartPage.cartItems).toHaveCount(products.length);
    });
  });

  test('CP04: Ordenamiento Dinámico por Precio (Low to High)', async ({page}) => {
    await step('Cambiar el filtro de productos',page, async () => {
      await inventoryPage.sortBy('lohi');
    });

    await step('Validar que la lista de precios está en orden ascendente',page, async () => {
      const prices = await inventoryPage.getAllItemPrices();
      const isSorted = prices.every((val, i, arr) => !i || (val >= arr[i - 1]));
      
      expect.soft(isSorted, 'Los precios no están ordenados correctamente de menor a mayor').toBeTruthy();
    });
  });
});