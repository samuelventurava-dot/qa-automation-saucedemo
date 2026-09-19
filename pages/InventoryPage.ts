import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('.shopping_cart_link');
  }

  // Selector dinámico
  async addProductToCart(productId: string) {
    await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
  }

  async getCartItemCount(): Promise<number> {
    if (await this.cartBadge.isVisible()) {
      const text = await this.cartBadge.innerText();
      return parseInt(text, 10);
    }
    return 0;
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortBy(optionValue: string) {
    await this.sortDropdown.selectOption(optionValue);
  }

  async getAllItemPrices(): Promise<number[]> {
    const priceElements = this.page.locator('.inventory_item_price');
    const count = await priceElements.count();
    const prices: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const text = await priceElements.nth(i).innerText();
      prices.push(parseFloat(text.replace('$', '')));
    }
    return prices;
  }
}