import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import Raty from 'raty-js';
import 'raty-js/src/raty.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { showLoader, hideLoader } from './loader.js';

const modalBackdrop = document.querySelector('[data-modal-bg]');
const modalWindow = document.querySelector('.modal'); // outer containerconst modalWindow = document.querySelector('.modal-window');
const galleryLightbox = new SimpleLightbox('div.gallery a');

document.addEventListener('click', async e => {
  const button = e.target.closest('.furniture-card-button');
  if (!button) return;

  const furnitureId = e.target.dataset.id;

  showLoader('.modal-loader');

  try {
    const response = await axios.get(
      `https://furniture-store.b.goit.study/api/furnitures/${furnitureId}`
    );
    const furnitureData = response.data;

    renderModal(furnitureData); // Your modal rendering function
    openModal(); // Your modal open function
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити деталі товару',
      position: 'topRight',
    });
    console.error('Modal fetch error:', error);
  } finally {
    hideLoader('.modal-loader');
  }
});

export function renderModal(el) {
  modalWindow.innerHTML = `
    <span class="modal-loader loader hidden"></span>
    <button class="modal-close-btn" type="button" id="modal-close-btn" data-modal-close>
      <svg class="modal-icon" width="32" height="32">
        <use href="/img/sprite.svg#x"></use>
      </svg>
    </button>
    <div class="gallery">
      ${el.images
        .map(
          img => `
        <div class="gallery-item">
          <a class="gallery-link" href="${img}">
            <img src="${img}" class="gallery-image" alt="${el.name}" />
          </a>
        </div>`
        )
        .join('')}
    </div>
    <h3 class="modal-name">${el.name}</h3>
    <p class="modal-category">${el.category.name}</p>
    <div class="modal-info">
      <p class="modal-slide-price">${el.price} грн</p>
      <div class="rating-list" data-score="${el.rate}"></div>
      <ul class="modal-color">
        ${el.color
          .map(
            (color, index) => `
          <li class="modal-color-item${index === 0 ? ' active' : ''}" 
              style="background-color: ${color};" 
              data-color="${color}"></li>`
          )
          .join('')}
      </ul>
      <p class="modal-descr">${el.description}</p>
      <p class="modal-sizes">${el.sizes}</p>
      <button type="button" class="modal-btn" data-order-open>Перейти до замовлення</button>
    </div>
  `;

  modalWindow.querySelector('[data-modal-close]').addEventListener('click', closeModal);

  new Raty(document.querySelector('.rating-list'), {
    readOnly: true,
    score: parseFloat(el.rate),
    starType: 'i',
    round: { down: 0.25, full: 0.75, up: 0.76 },
  }).init();

  galleryLightbox.refresh();

  // Color selection logic
  modalWindow.querySelectorAll('.modal-color-item').forEach(item => {
    item.addEventListener('click', () => {
      modalWindow.querySelectorAll('.modal-color-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // Order button logic
  modalWindow.querySelector('[data-order-open]').addEventListener('click', () => {
    closeModal();
    // trigger order modal here
    document.dispatchEvent(new CustomEvent('openOrderModal'));
  });
}

export function openModal() {
  document.body.style.overflow = 'hidden';
  modalBackdrop.classList.remove('visually-hidden');
  modalBackdrop.scrollTop = 0;
}

export function closeModal() {
  document.body.style.overflow = 'auto';
  modalBackdrop.classList.add('visually-hidden');
  modalWindow.innerHTML = ''; // Clear modal content
}

modal.addEventListener('click', e => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.code === 'Escape') closeModal();
});
