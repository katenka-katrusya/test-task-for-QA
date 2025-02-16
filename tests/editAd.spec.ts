import { test, expect } from '@playwright/test';

test.describe('Редактирование объявления', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      'http://tech-avito-intern.jumpingcrab.com/advertisements/2'
    );
    await page.waitForTimeout(3000); // ожидание загрузки картинки
    await page.getByRole('img').nth(2).click();
  });

  test('Успешное редактирование объявления', async ({ page }) => {
    // новые данные объявления
    await page
      .locator('input[name="imageUrl"]')
      .fill(
        'https://avatars.mds.yandex.net/i?id=916c10f825180c47640a6b374eeb2a52_l-5292620-images-thumbs&n=13'
      );
    await page.locator('input[name="name"]').fill('Игрушка зайчик');
    await page.locator('input[name="price"]').fill('700');
    await page
      .locator('textarea[name="description"]')
      .fill('Мягкий плюшевый зайчик');

    // подтверждение редактирования
    await page.getByRole('img').nth(2).click();

    // проверка, что объявление отредактировано
    await expect(
      page.getByRole('heading', { name: 'Игрушка зайчик' })
    ).toBeVisible();
    await expect(page.getByText('700 ₽')).toBeVisible();
    await expect(page.getByText('Мягкий плюшевый зайчик')).toBeVisible();
    await expect(
      page.locator(
        'img[src="https://avatars.mds.yandex.net/i?id=916c10f825180c47640a6b374eeb2a52_l-5292620-images-thumbs&n=13"]'
      )
    ).toBeVisible();
  });

  test('Редактирование объявления с пустыми полями', async ({ page }) => {
    await page.locator('input[name="imageUrl"]').clear();
    await page.locator('input[name="name"]').clear();
    await page.locator('input[name="price"]').clear();
    await page.locator('textarea[name="description"]').clear();

    // подтверждение редактирования
    await page.getByRole('img').nth(2).click();

    // проверка, что объявление сохранено
    await page.goto(
      'http://tech-avito-intern.jumpingcrab.com/advertisements/2'
    );
  });

  test('Редактирование объявления с некорректными данными', async ({
    page,
  }) => {
    await page
      .locator('input[name="imageUrl"]')
      .fill('https://lalala-topolya.jpg');
    await page.locator('input[name="name"]').fill('🐰🐻‍❄️');
    await page.locator('input[name="price"]').type('--');
    await page
      .locator('textarea[name="description"]')
      .fill('<script>console.log(1)</script>');

    // подтверждение редактирования
    await page.getByRole('img').nth(2).click();
  });
});
