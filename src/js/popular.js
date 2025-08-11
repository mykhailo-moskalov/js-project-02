import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { showLoader, hideLoader } from './loader.js';
import { renderModal, openModal } from './furniture-modal.js';
import { furnitureList, addToFurnitureList } from './furniture.js';

const popularContainer = document.querySelector('.popular-swiper');
const popularSwiper = new Swiper(popularContainer, {
  pagination: {
    el: '.popular .swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    prevEl: '.popular .swiper-button-prev',
    nextEl: '.popular .swiper-button-next',
  },

  slidesPerView: 1,
  spaceBetween: 24,

  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    1440: {
      slidesPerView: 4,
    },
  },
});

function handlePopularClick(e) {
  const button = e.target.closest('.popular-details-btn');
  if (!button) return;

  const furnitureId = button.dataset.id;
  const furnitureData = furnitureList.find(item => item._id === furnitureId);

  if (!furnitureData) {
    iziToast.error({
      title: 'Помилка',
      message: 'Товар не знайдено',
      position: 'topRight',
    });
    return;
  }

  renderModal(furnitureData);
  openModal();
}

initPopular();

async function initPopular() {
  showLoader('.popular-loader');

  try {
    const data = await getPopularList();
    createPopularList(data);
    popularSwiper.update();

    addToFurnitureList(data);

    if (!window._popularClickBound) {
      document.addEventListener('click', handlePopularClick);
      window._popularClickBound = true;
    }
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити галерею популярних товарів. Спробуйте пізніше!',
      position: 'topRight',
    });
    console.error('Error fetching popular items:', error);
  } finally {
    hideLoader('.popular-loader');
  }
}

async function createPopularList(data) {
  const wrapper = popularContainer.querySelector('.popular .swiper-wrapper');
  const markup = data
    .map(el => {
      let colorHtml = '';
      el.color.forEach(color => {
        colorHtml += `<li class="popular-color-item" style="display: inline-block; background-color: ${color};"></li>`;
      });
      return `
      <li class="popular-swiper-slide swiper-slide">
        <img class="popular-slide-img" src="${el.images[0]}" alt="${el.description}" />
        <div class="popular-card-propeties">
          <p class="popular-slide-name">${el.name}</p>
          <ul class="popular-color">${colorHtml}</ul>
          <p class="popular-slide-price">${el.price} грн</p>
        </div>
        <button data-id="${el._id}" class="popular-details-btn" data-open-modal>Детальніше</button>
      </li>`;
    })
    .join('');

  wrapper.insertAdjacentHTML('beforeend', markup);
}

async function getPopularList() {
  try {
    const response = await axios.get('https://furniture-store.b.goit.study/api/furnitures', {
      params: {
        page: 1,
        limit: 11,
        type: 'popular',
      },
    });

    return response.data.furnitures || [];
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити товари. Спробуйте пізніше.',
      position: 'topRight',
    });

    console.error('Error fetching furnitures:', error);
  }
}
