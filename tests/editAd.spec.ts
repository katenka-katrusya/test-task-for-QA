import { test, expect, Page } from '@playwright/test';

test.describe('Редактирование объявления', () => {
  test.beforeEach(async ({ page }) => {
    // переход сразу к редактированию объявления
    await page.goto(
      'http://tech-avito-intern.jumpingcrab.com/advertisements/2'
    );
    await page.waitForTimeout(3000); // ожидание загрузки объявления (на всякий случай)
    await page.getByRole('img').nth(2).click();
  });

  const editAd = async (
    page: Page,
    imageUrl: string,
    name: string,
    price: string,
    description: string
  ) => {
    await page.locator('input[name="imageUrl"]').fill(imageUrl);
    await page.locator('input[name="name"]').fill(name);
    await page.locator('input[name="price"]').fill(price);
    await page.locator('textarea[name="description"]').fill(description);
  };

  // подтверждение редактирования
  const confirmEdit = async (page: Page) => {
    await page.getByRole('img').nth(2).click();
  };

  test('Успешное редактирование объявления', async ({ page }) => {
    await editAd(
      page,
      'https://avatars.mds.yandex.net/i?id=916c10f825180c47640a6b374eeb2a52_l-5292620-images-thumbs&n=13',
      'Игрушка зайчик',
      '700',
      'Мягкий плюшевый зайчик'
    );

    await confirmEdit(page);

    // проверка, что объявление отредактировано
    await expect(
      page.getByRole('heading', { name: 'Игрушка зайчик' })
    ).toBeVisible();
    await expect(page.getByText('700')).toBeVisible();
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

    await confirmEdit(page);

    // перезагрузка страницы для проверки, что поля пустые
    await page.reload();
  });

  test('Редактирование объявления с некорректными данными', async ({
    page,
  }) => {
    // без функции, потому что нужен type() в description
    await page
      .locator('input[name="imageUrl"]')
      .fill('https://lalala-topolya.jpg');
    await page.locator('input[name="name"]').fill('🐰🐻‍❄️');
    await page.locator('input[name="price"]').type('--');
    await page
      .locator('textarea[name="description"]')
      .fill('<script>console.log(1)</script>');

    await confirmEdit(page);
  });
});
