import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';
import { showLoader, hideLoader } from './loader.js';

import imgUrl1 from '../img/webp/categories/category-1.webp';
import imgUrl2 from '../img/webp/categories/category-2.webp';
import imgUrl3 from '../img/webp/categories/category-3.webp';
import imgUrl4 from '../img/webp/categories/category-4.webp';
import imgUrl5 from '../img/webp/categories/category-5.webp';
import imgUrl6 from '../img/webp/categories/category-6.webp';
import imgUrl7 from '../img/webp/categories/category-7.webp';
import imgUrl8 from '../img/webp/categories/category-8.webp';
import imgUrl9 from '../img/webp/categories/category-9.webp';
import imgUrl10 from '../img/webp/categories/category-10.webp';
import imgUrl11 from '../img/webp/categories/category-11.webp';
import imgUrl12 from '../img/webp/categories/category-12.webp';
import imgUrl13 from '../img/webp/categories/category-13.webp';
import bigImgUrl1 from '../img/webp/categories@2x/category-1@2x.webp';
import bigImgUrl2 from '../img/webp/categories@2x/category-2@2x.webp';
import bigImgUrl3 from '../img/webp/categories@2x/category-3@2x.webp';
import bigImgUrl4 from '../img/webp/categories@2x/category-4@2x.webp';
import bigImgUrl5 from '../img/webp/categories@2x/category-5@2x.webp';
import bigImgUrl6 from '../img/webp/categories@2x/category-6@2x.webp';
import bigImgUrl7 from '../img/webp/categories@2x/category-7@2x.webp';
import bigImgUrl8 from '../img/webp/categories@2x/category-8@2x.webp';
import bigImgUrl9 from '../img/webp/categories@2x/category-9@2x.webp';
import bigImgUrl10 from '../img/webp/categories@2x/category-10@2x.webp';
import bigImgUrl11 from '../img/webp/categories@2x/category-11@2x.webp';
import bigImgUrl12 from '../img/webp/categories@2x/category-12@2x.webp';
import bigImgUrl13 from '../img/webp/categories@2x/category-13@2x.webp';

const categoryImages = {
  1: {
    src1x: imgUrl1,
    src2x: bigImgUrl1,
  },
  2: {
    src1x: imgUrl2,
    src2x: bigImgUrl2,
  },
  3: {
    src1x: imgUrl3,
    src2x: bigImgUrl3,
  },
  4: {
    src1x: imgUrl4,
    src2x: bigImgUrl4,
  },
  5: {
    src1x: imgUrl5,
    src2x: bigImgUrl5,
  },
  6: {
    src1x: imgUrl6,
    src2x: bigImgUrl6,
  },
  7: {
    src1x: imgUrl7,
    src2x: bigImgUrl7,
  },
  8: {
    src1x: imgUrl8,
    src2x: bigImgUrl8,
  },
  9: {
    src1x: imgUrl9,
    src2x: bigImgUrl9,
  },
  // ... repeat for all categories
  10: {
    src1x: imgUrl10,
    src2x: bigImgUrl10,
  },
  11: {
    src1x: imgUrl11,
    src2x: bigImgUrl11,
  },
  12: {
    src1x: imgUrl12,
    src2x: bigImgUrl12,
  },
  13: {
    src1x: imgUrl13,
    src2x: bigImgUrl13,
  },
};
// --------------------------- Шаблоны -----------------------------------------

const templateCat = `<li class="furniture-item" id="{idCat}">
  <div class="furniture-item-content">
    <h3 class="furniture-item-title">{nameCat}</h3>
  </div>
  <img
    srcset="{src1x} 1x, {src2x} 2x"
    src="{src1x}"
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
      const images = categoryImages[counter] || {};
      let temp = templateCat
        .replace('{idCat}', item._id)
        .replace('{nameCat}', item.name)
        .replace('{altCat}', item.name)
        .replace('{src1x}', images.src1x || '')
        .replace('{src2x}', images.src2x || '')
        .replaceAll('{numCat}', counter);
      counter++;
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

hideLoadMoreButton();
showLoader('.furniture-loader');
fetchCategories();
fetchFurnitures(currentPage, currentCategoryId, limit, '.furniture-cards').then(data => {
  const remainingItems = data.totalItems - currentPage * limit;
  loadMore.textContent = `Показати ще ${limit} з ${remainingItems}`;
  if (currentPage * limit >= data.totalItems) {
    hideLoadMoreButton();
    iziToast.info({
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
    });
  }
  hideLoader('.furniture-loader');
});

// Работа
const furnitureCategories = document.querySelector('.furniture-categories');

// Клик на категорию
furnitureCategories.addEventListener('click', event => {
  hideLoadMoreButton();
  currentPage = 1;
  currentCategoryId = event.target.closest('.furniture-item').getAttribute('id');
  document.querySelector('.furniture-cards').innerHTML = '';
  showLoader('.furniture-loader');
  fetchFurnitures(currentPage, currentCategoryId, limit, '.furniture-cards').then(data => {
    setBorder(currentCategoryId); // Установка бордюра после загрузки
    const remainingItems = data.totalItems - currentPage * limit;
    let show = limit <= remainingItems ? limit : remainingItems;
    loadMore.textContent = `Показати ще ${show} з ${remainingItems}`;
    if (currentPage * limit >= data.totalItems) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
    hideLoader('.furniture-loader');
  });
});

// Клик на Далее
loadMore.addEventListener('click', () => {
  hideLoadMoreButton();
  showLoader('.furniture-loader');

  currentPage++;
  fetchFurnitures(currentPage, currentCategoryId, limit, '.furniture-cards').then(data => {
    const remainingItems = data.totalItems - currentPage * limit;
    let show = limit <= remainingItems ? limit : remainingItems;
    loadMore.textContent = `Показати ще ${show} з ${remainingItems}`;
    if (currentPage * limit >= data.totalItems) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
    hideLoader('.furniture-loader');
  });
  const firstcard = document.querySelector('.furniture-card');

  if (firstcard) {
    const cardHeight = firstcard.getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight,
      behavior: 'smooth',
    });
  }
});
