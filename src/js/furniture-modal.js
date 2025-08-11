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

let escapeListener;
let backdropClickListener;
let closeBtnListener;
let orderBtnListener;
let colorItemListeners = [];
let colorRadioListeners = [];

export function renderModal(el) {
  modalWindow.innerHTML = `
    <button class="modal-close-btn" type="button" data-modal-close>
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
            <img src="${img}" class="gallery-image" alt='${el.name}' />
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
              <input type="radio" name="color" value="${color}" class="modal-color-radio" ${
              index === 0 ? 'checked' : ''
            } />
              <span class="color-circle ${
                index === 0 ? 'active' : ''
              }" style="background-color: ${color};"></span>
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

  new Raty(document.querySelector('.rating-list'), {
    readOnly: true,
    score: parseFloat(el.rate),
    starType: 'i',
    round: { down: 0.25, full: 0.75, up: 0.76 },
  }).init();

  galleryLightbox.refresh();

  // Add all modal-specific listeners
  addModalListeners();
}

function handleEscapeKey(e) {
  if (e.code === 'Escape') closeModal();
}

function addModalListeners() {
  const closeBtn = modalWindow.querySelector('[data-modal-close]');
  const orderBtn = modalWindow.querySelector('[data-order-open]');
  const colorItems = modalWindow.querySelectorAll('.modal-color-item');
  const colorRadios = modalWindow.querySelectorAll('.modal-color-radio');
  const colorCircles = modalWindow.querySelectorAll('.color-circle');

  closeBtnListener = () => closeModal();
  closeBtn.addEventListener('click', closeBtnListener);

  escapeListener = handleEscapeKey;
  document.addEventListener('keydown', escapeListener);

  backdropClickListener = e => {
    if (e.target === modalBackdrop) closeModal();
  };
  modalBackdrop.addEventListener('click', backdropClickListener);

  orderBtnListener = () => {
    closeModal();
    orderModal.init();
    orderModal.openModal();
  };
  orderBtn.addEventListener('click', orderBtnListener);

  colorItems.forEach(item => {
    const listener = () => {
      colorItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    };
    item.addEventListener('click', listener);
    colorItemListeners.push({ element: item, handler: listener });
  });

  colorRadios.forEach((radio, index) => {
    const listener = () => {
      colorCircles.forEach(circle => circle.classList.remove('active'));
      colorCircles[index].classList.add('active');
    };
    radio.addEventListener('change', listener);
    colorRadioListeners.push({ element: radio, handler: listener });
  });
}

function removeModalListeners() {
  document.removeEventListener('keydown', escapeListener);
  modalBackdrop.removeEventListener('click', backdropClickListener);

  const closeBtn = modalWindow.querySelector('[data-modal-close]');
  if (closeBtn) closeBtn.removeEventListener('click', closeBtnListener);

  const orderBtn = modalWindow.querySelector('[data-order-open]');
  if (orderBtn) orderBtn.removeEventListener('click', orderBtnListener);

  colorItemListeners.forEach(({ element, handler }) => {
    element.removeEventListener('click', handler);
  });
  colorItemListeners = [];

  colorRadioListeners.forEach(({ element, handler }) => {
    element.removeEventListener('change', handler);
  });
  colorRadioListeners = [];
}

export function openModal() {
  document.body.style.overflow = 'hidden';
  modalBackdrop.classList.remove('visually-hidden');
  modalBackdrop.scrollTop = 0;
}

export function closeModal() {
  document.body.style.overflow = 'auto';
  modalBackdrop.classList.add('visually-hidden');
  removeModalListeners();
  modalWindow.innerHTML = ``;
}
