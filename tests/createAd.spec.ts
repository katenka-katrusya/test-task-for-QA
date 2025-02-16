import { test, expect, Page } from '@playwright/test';

test.describe('Создание объявления', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://tech-avito-intern.jumpingcrab.com/');
    await page.getByRole('button', { name: 'Создать' }).click();
  });

  // ф-ия создания объявления (заполнение всех полей)
  const fillAdForm = async (
    page: Page,
    name: string,
    price: string,
    description: string,
    imageUrl: string
  ) => {
    await page.getByRole('textbox', { name: 'Название' }).fill(name);
    await page.getByRole('spinbutton', { name: 'Цена' }).fill(price);
    await page.getByRole('textbox', { name: 'Описание' }).fill(description);
    await page
      .getByRole('textbox', { name: 'Ссылка на изображение' })
      .fill(imageUrl);
  };

  // сохранение объявления
  const confirmSave = async (page: Page) => {
    await page.getByRole('button', { name: 'Сохранить' }).click();
  };

  test('Успешное создание объявления', async ({ page }) => {
    await fillAdForm(
      page,
      'Игрушка мишка',
      '500',
      'Плюшевый медведь',
      'https://cdn.culture.ru/images/70e8e01f-d33f-52d8-8f7b-9a923040e618'
    );

    await expect(
      page.locator(
        'img[src="https://cdn.culture.ru/images/70e8e01f-d33f-52d8-8f7b-9a923040e618"]'
      )
    ).toBeVisible();

    await confirmSave(page);

    // проверка, что объявление создано. Для этого сначала поиск по названию и выбор самого первого
    await page
      .getByRole('textbox', { name: 'Поиск по объявлениям' })
      .fill('Игрушка мишка');
    await expect(page.getByText('Игрушка мишка').first()).toBeVisible();
  });

  test('Создание объявления с пустыми полями', async ({ page }) => {
    // поля ничем не заполнять
    await fillAdForm(page, '', '', '', '');

    await confirmSave(page);

    // проверка на ошибки валидации. Рядом с нужным инпутом должен появиться текст ошибки
    await expect(
      page.locator('[name="name"] + .chakra-form__error-message')
    ).toHaveText('Поле обязательно для заполнения.');
    await expect(
      page.locator('[name="price"] + .chakra-form__error-message')
    ).toHaveText('Поле обязательно для заполнения.');
    await expect(
      page.locator('[name="description"] + .chakra-form__error-message')
    ).toHaveText('Поле обязательно для заполнения.');
    await expect(
      page.locator('[name="imageUrl"] + .chakra-form__error-message')
    ).toHaveText('Поле обязательно для заполнения.');
  });

  test('Создание объявления с некорректными данными', async ({ page }) => {
    // заполнение формы
    await fillAdForm(page, 'U'.repeat(300), '-500', '   ', 'abcd');

    await confirmSave(page);

    // проверка на ошибки валидации. Есть ошибка только о пустом поле, остальные неизвестны, поэтому проверям просто наличие элемента с классом ошибки
    await expect
      .soft(page.locator('[name="name"] + .chakra-form__error-message'))
      .toBeVisible();
    await expect
      .soft(page.locator('[name="price"] + .chakra-form__error-message'))
      .toBeVisible();
    await expect
      .soft(page.locator('[name="description"] + .chakra-form__error-message'))
      .toHaveText('Поле обязательно для заполнения.');
    await expect
      .soft(page.locator('[name="imageUrl"] + .chakra-form__error-message'))
      .toBeVisible();

    // проверка, что объявление НЕ создано, то есть их 0.
    await page
      .getByRole('textbox', { name: 'Поиск по объявлениям' })
      .fill('UUUUUUUUUUUUUUUUUU');
    await page.waitForTimeout(3000); // ждём пока прогрузится выдача
    await expect(page.getByText('UUUUUUUUUUUUUUUUUU')).toHaveCount(0);
  });
});
