import { test, expect, Page } from '@playwright/test';

test.describe('Поиск объявлений', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://tech-avito-intern.jumpingcrab.com/');
  });

  // ф-ия поиска и проверки результата
  const searchAndCheck = async (
    page: Page,
    searchQuery: string,
    expectedResult: string
  ) => {
    const searchBox = page.getByRole('textbox', {
      name: 'Поиск по объявлениям',
    });
    await searchBox.fill(searchQuery);
    await expect(page.getByText(expectedResult)).toBeVisible();
  };

  test('Поиск по полному названию', async ({ page }) => {
    await searchAndCheck(page, 'кен', 'Кен');
  });

  test('Поиск по названию с капслоком', async ({ page }) => {
    await searchAndCheck(page, 'КЕН', 'Кен');
  });

  test('Поиск по части названия', async ({ page }) => {
    await searchAndCheck(page, 'ке', 'Кен');
  });

  test('Поиск с пробелами с обеих сторон', async ({ page }) => {
    await searchAndCheck(page, '  кен  ', 'Кен');
  });

  test('Очистка поля поиска и проверка обновления списка объявлений', async ({
    page,
  }) => {
    const searchBox = page.getByRole('textbox', {
      name: 'Поиск по объявлениям',
    });
    await searchBox.fill('кен');
    await expect(searchBox).toHaveValue('кен');

    // удаление значения из поля поиска и проверка, что пусто
    await searchBox.fill('');
    await expect(searchBox).toHaveValue('');
  });

  test('Поиск несуществующего объявления', async ({ page }) => {
    await searchAndCheck(page, 'Барби 3000', 'Найдено: 0');
  });
});
