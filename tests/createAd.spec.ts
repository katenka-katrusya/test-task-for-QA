import { test, expect } from '@playwright/test';

test.describe('Создание объявления', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://tech-avito-intern.jumpingcrab.com/');
    await page.getByRole('button', { name: 'Создать' }).click();
  });

  test('Успешное создание объявления', async ({ page }) => {
    // заполнение формы
    await page.getByRole('textbox', { name: 'Название' }).fill('Игрушка мишка');
    await page.getByRole('spinbutton', { name: 'Цена' }).fill('500');
    await page
      .getByRole('textbox', { name: 'Описание' })
      .fill('Плюшевый медведь');
    await page
      .getByRole('textbox', { name: 'Ссылка на изображение' })
      .fill(
        'https://cdn.culture.ru/images/70e8e01f-d33f-52d8-8f7b-9a923040e618'
      );
    await expect(
      page.locator(
        'img[src="https://cdn.culture.ru/images/70e8e01f-d33f-52d8-8f7b-9a923040e618"]'
      )
    ).toBeVisible();

    // сохранение объявления
    await page.getByRole('button', { name: 'Сохранить' }).click();

    // проверка, что объявление создано. Для этого сначала поиск по названию и выбор самого первого
    await page
      .getByRole('textbox', { name: 'Поиск по объявлениям' })
      .fill('Игрушка мишка');
    await expect(page.getByText('Игрушка мишка').first()).toBeVisible();
  });

  test('Создание объявления с пустыми полями', async ({ page }) => {
    // поля должны быть пустыми
    await expect(page.getByRole('textbox', { name: 'Название' })).toBeEmpty();
    await expect(page.getByRole('spinbutton', { name: 'Цена' })).toBeEmpty();
    await expect(page.getByRole('textbox', { name: 'Описание' })).toBeEmpty();
    await expect(
      page.getByRole('textbox', { name: 'Ссылка на изображение' })
    ).toBeEmpty();

    // сохранение объявления
    await page.getByRole('button', { name: 'Сохранить' }).click();

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
    await page.getByRole('textbox', { name: 'Название' }).fill('M'.repeat(300)); // 300 символов без пробелов
    await page.getByRole('spinbutton', { name: 'Цена' }).fill('-500');
    await page.getByRole('textbox', { name: 'Описание' }).fill('   '); // Только пробелы
    await page
      .getByRole('textbox', { name: 'Ссылка на изображение' })
      .fill('abcd');

    // сохранение объявления
    await page.getByRole('button', { name: 'Сохранить' }).click();

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

    // проверка, что объявление НЕ создано.Если хоть 1 объявление совпадёт, значит создалось
    await page
      .getByRole('textbox', { name: 'Поиск по объявлениям' })
      .fill('MMMMMMMMMMMMMMMMMMMM');
    await page.waitForTimeout(3000); // ждём пока прогрузится выдача
    await expect(page.getByText('MMMMMMMMMMMMMMMMMMMM')).toHaveCount(0);
  });
});
