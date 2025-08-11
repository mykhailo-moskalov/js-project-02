import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import Raty from 'raty-js';
import 'raty-js/src/raty.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { showLoader, hideLoader } from './loader.js';
import { orderModal } from './order.js';
import spriteUrl from '../img/sprite.svg';

const modalBackdrop = document.querySelector('[data-modal-bg]');
const modalWindow = document.querySelector('.modal-window');
const galleryLightbox = new SimpleLightbox('div.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  download: true,
});

document.addEventListener('click', async e => {
  const button = e.target.closest('[data-id]');
  if (!button) return;

  const furnitureId = button.getAttribute('data-id'); // ← Виправлено

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
    console.error(error);
  } finally {
    hideLoader('.modal-loader');
  }
});

export function renderModal(el) {
  modalWindow.innerHTML = `
    <span class="modal-loader loader hidden"></span>
    <button class="modal-close-btn" type="button" id="modal-close-btn" data-modal-close>
      <svg class="modal-icon" width="32" height="32">
        <use href="${spriteUrl}#x"></use>
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
    <div class="modal-bottom-right">
        <h3 class="modal-name">${el.name}</h3>
        <p class="modal-category">${el.category.name}</p>
        <h4 class="modal-slide-price">${el.price} грн</h4>
        <div class="rating-list" data-score="${el.rate}"></div>
        <p class="modal-color-title">Колір</p>
        <ul class="modal-color">
          ${el.color
            .map(
              (color, index) => `
            <li class="modal-color-item">
                <label class="color-label">
                    <input
                      type="radio"
                      name="color"
                      value="${color}"
                      class="modal-color-radio"
                      ${index === 0 ? 'checked' : ''}
                    />
                    <span
                      class="color-circle ${index === 0 ? 'active' : ''}"
                      style="background-color: ${color};">
                    </span>
                </label>
            </li>`
            )
            .join('')}
        </ul>
        <p class="modal-descr">${el.description}</p>
        <p class="modal-sizes">Розміри: ${el.sizes}</p>
        <button type="button" class="modal-btn" data-order-open>Перейти до замовлення</button>
    </div>
  `;

  modalWindow.querySelector('[data-modal-close]').addEventListener('click', closeModal);

  const colorRadios = modalWindow.querySelectorAll('.modal-color-radio');
  const colorCircles = modalWindow.querySelectorAll('.color-circle');

  colorRadios.forEach((radio, index) => {
    radio.addEventListener('change', () => {
      colorCircles.forEach(circle => circle.classList.remove('active'));
      colorCircles[index].classList.add('active');
    });
  });

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
    orderModal.init();
    orderModal.openModal();
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
  modalWindow.innerHTML = `
      <span class="loader hidden modal-loader"></span>
    `;
}

modalBackdrop.addEventListener('click', e => {
  if (e.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.code === 'Escape') closeModal();
});
