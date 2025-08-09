import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import axios from 'axios';

// --------------------------- Шаблоны -----------------------------------------

const templateCat = `<li class="furniture-item" id="{idCat}">
  <div class="furniture-item-content">
    <h3 class="furniture-item-title">{nameCat}</h3>
  </div>
  <img
    srcset="
      /img/webp/categories/category-{numCat}.webp        1x,
      /img/webp/categories@2x/category-{numCat}@2x.webp 2x
    "
    src="/img/webp/categories/category-{numCat}.webp"
    alt="{altCat}"
    class="furniture-item-image"
  />
</li>`;

const template2 = `<li class="furniture-card">
  <img class="furniture-card-img" src="{srcFrn}" alt="{altFrn}" />
  <div class="furniture-card-propeties">
    <p class="furniture-card-name">{nameFrn}</p>
    <div class="furniture-card-colors">{colorHtml}</div>
    <p class="furniture-card-cost">{priceFrn} грн</p>
  </div>
  <button id="{idFrn}" class="furniture-card-button">Детальніше</button>
</li>`;

// --------------------------- Запрос категорий ---------------------------------
async function getCategoriesByQuery(query, page, perPage) {
  try {
    const response = await axios.get('https://furniture-store.b.goit.study/api/categories', {});
    return response.data;
  } catch (error) {
    return [];
  }
}

// --------------------------- Запрос товаров ---------------------------------
async function getFurnitures(page = 1, categoryId = '', limit) {
  try {
    const params = {
      page,
      limit: limit,
    };
    if (categoryId && categoryId !== 'all-categories') {
      params.category = categoryId;
    }
    const response = await axios.get('https://furniture-store.b.goit.study/api/furnitures', {
      params,
    });
    return response.data;
  } catch (error) {
    return [];
  }
}

// ------------------------------------ Рендер категорий -----------------------------------
async function createCategories(categories) {
  // Добавляем первую категорию "Всі товари" с id="all-categories"
  const updatedCategories = [
    { _id: 'all-categories', name: 'Всі товари' },
    ...categories, // Остальные категории из промиса
  ];

  let counter = 1; // Счётчик для numCat, начиная с 1
  const markup = updatedCategories
    .map(item => {
      let temp = templateCat
        .replace('{idCat}', item._id)
        .replace('{nameCat}', item.name)
        .replace('{altCat}', item.name)
        .replaceAll('{numCat}', counter); // Используем счётчик
      counter++; // Увеличиваем счётчик для следующего элемента
      return temp;
    })
    .join('');

  const furnitureСategories = document.querySelector('.furniture-categories');

  furnitureСategories.insertAdjacentHTML('beforeend', markup);

  setBorder('all-categories');
}

// -------------------------------------- Запрос категорий ---------------------------------------
async function fetchCategories() {
  try {
    const data = await getCategoriesByQuery();

    await createCategories(data); // Вызов рендера с полученными данными
    return data;
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Не удалось загрузить категории. Попробуйте позже!',
      position: 'topRight',
    });
    return [];
  }
}

// --------------------------- Запуск лодыря -----------------------
function showLoader() {
  loader.style.display = 'inline-block';
}

// --------------------------- Останов лодыря -----------------------
function hideLoader() {
  loader.style.display = 'none';
}

// ----------------------- Показать кнопку Load more ---------------------------
function showLoadMoreButton() {
  loadMore.style.display = 'block';
}

// ------------------------- Скрыть кнопку Load more ----------------------------------
function hideLoadMoreButton() {
  loadMore.style.display = 'none';
}

// ----------------------- Показать кнопку Load no ---------------------------
function showLoadNoButton() {
  loadNo.style.display = 'block';
}

// ------------------------- Скрыть кнопку Load no ----------------------------------
function hideLoadNoButton() {
  loadNo.style.display = 'none';
}

// -------------------------------------- Запрос мебели ---------------------------------------
async function fetchFurnitures(page, categoryId = '', limit, insert) {
  try {
    const data = await getFurnitures(page, categoryId, limit);
    await createFurnitureCards(data.furnitures, insert);
    return data;
  } catch (error) {
    hideLoadMoreButton();
    iziToast.error({
      title: 'Error',
      message: 'Не удалось загрузить товары. Попробуйте позже!',
      position: 'topRight',
    });
    return [];
  }
}

// --------------------------- Рендер мебели --------------------------
async function createFurnitureCards(furnitures, insert) {
  const markup2 = furnitures
    .map(item => {
      let colorHtml = '';
      item.color.forEach(color => {
        colorHtml += `<span class="furniture-card-color-chek" style="display: inline-block; background-color: ${color};"></span>`;
      });
      let temp2 = template2
        .replace('{srcFrn}', item.images[0])
        .replace('{nameFrn}', item.name)
        .replace('{priceFrn}', item.price)
        .replace('{idFrn}', item._id)
        .replace('{altFrn}', item.description)
        .replace('{colorHtml}', colorHtml);
      return temp2;
    })
    .join('');

  const furnitureCards = document.querySelector(insert);
  furnitureCards.insertAdjacentHTML('beforeend', markup2);
  showLoadMoreButton();
}

// --------------------------- Функция для управления бордюров -----------------------
function setBorder(categoryId) {
  // Сбрасываем бордюр у всех элементов .furniture-item-content
  const allItems = document.querySelectorAll('.furniture-item-content');
  allItems.forEach(item => {
    item.style.border = '';
    item.style.borderRadius = '';
  });
  // Устанавливаем бордюр для .furniture-item-content внутри указанного id
  const currentItem = document.getElementById(categoryId).querySelector('.furniture-item-content');

  currentItem.style.border = '8px solid #6b0609';
  currentItem.style.borderRadius = '8px';
}

// ---------------------------- Тельце --------------------------------
// Инициализация
const limit = 8;
let currentCategoryId = 'all-categories';
let currentPage = 1;

const loadMore = document.querySelector('.furniture-load-more');
const loadNo = document.querySelector('.furniture-load-no');
const loader = document.querySelector('.loader');

hideLoadNoButton();
hideLoadMoreButton();
showLoader();
fetchCategories();
fetchFurnitures(currentPage, currentCategoryId, limit, '.furniture-cards').then(data => {
  const remainingItems = data.totalItems - currentPage * limit;
  loadMore.textContent = `Показати ще ${limit} з ${remainingItems}`;
  if (currentPage * limit >= data.totalItems) {
    hideLoadMoreButton();
    showLoadNoButton();
  }
  hideLoader();
});

// Работа
const furnitureCategories = document.querySelector('.furniture-categories');

// Клик на категорию
furnitureCategories.addEventListener('click', event => {
  hideLoadNoButton();
  hideLoadMoreButton();
  currentPage = 1;
  currentCategoryId = event.target.closest('.furniture-item').getAttribute('id');
  document.querySelector('.furniture-cards').innerHTML = '';
  showLoader();
  fetchFurnitures(currentPage, currentCategoryId, limit, '.furniture-cards').then(data => {
    setBorder(currentCategoryId); // Установка бордюра после загрузки
    const remainingItems = data.totalItems - currentPage * limit;
    let show = limit <= remainingItems ? limit : remainingItems;
    loadMore.textContent = `Показати ще ${show} з ${remainingItems}`;
    if (currentPage * limit >= data.totalItems) {
      hideLoadMoreButton();
      showLoadNoButton();
    }
    hideLoader();
  });
});

// Клик на Далее
loadMore.addEventListener('click', () => {
  hideLoadMoreButton();
  showLoader();
  currentPage++;
  fetchFurnitures(currentPage, currentCategoryId, limit, '.furniture-cards').then(data => {
    const remainingItems = data.totalItems - currentPage * limit;
    let show = limit <= remainingItems ? limit : remainingItems;
    loadMore.textContent = `Показати ще ${show} з ${remainingItems}`;
    if (currentPage * limit >= data.totalItems) {
      hideLoadMoreButton();
      showLoadNoButton();
    }
    hideLoader();
  });
});
