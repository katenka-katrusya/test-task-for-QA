import { test, expect } from '@playwright/test';

test.describe('Поиск объявлений', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://tech-avito-intern.jumpingcrab.com/');
  });

  test('Поиск по полному названию', async ({ page }) => {
    await page
      .getByRole('textbox', { name: 'Поиск по объявлениям' })
      .fill('кен');
    await expect(page.getByText('Кен')).toBeVisible();
  });

  test('Поиск по названию с капслоком', async ({ page }) => {
    await page
      .getByRole('textbox', { name: 'Поиск по объявлениям' })
      .fill('кен');
    await expect(page.getByText('КЕН')).toBeVisible();
  });

  test('Поиск по части названия', async ({ page }) => {
    await page
      .getByRole('textbox', { name: 'Поиск по объявлениям' })
      .fill('кен');
    await expect(page.getByText('ке')).toBeVisible();
  });

  test('Поиск с пробелами с обеих сторон', async ({ page }) => {
    await page
      .getByRole('textbox', { name: 'Поиск по объявлениям' })
      .fill('кен');
    await expect(page.getByText('  кен  ')).toBeVisible();
  });

  test('Очистка поля поиска и проверка обновления списка объявлений', async ({
    page,
  }) => {
    await page
      .getByRole('textbox', { name: 'Поиск по объявлениям' })
      .fill('кен');
    await expect(
      page.getByRole('textbox', { name: 'Поиск по объявлениям' })
    ).toHaveValue('кен');
    await page.getByRole('textbox', { name: 'Поиск по объявлениям' }).fill('');
    await expect(
      page.getByRole('textbox', { name: 'Поиск по объявлениям' })
    ).toHaveValue('');
  });

  test('Поиск несуществующего объявления', async ({ page }) => {
    await page
      .getByRole('textbox', { name: 'Поиск по объявлениям' })
      .fill('Барби 3000');
    await expect(page.getByText('Барби 3000')).toBeVisible();
  });
});
