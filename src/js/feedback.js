import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import Raty from 'raty-js';
import { showLoader, hideLoader } from './loader.js';

const feedbackContainer = document.querySelector('.feedback-swiper');
const feedbackSwiper = new Swiper(feedbackContainer, {
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  navigation: {
    prevEl: '.swiper-button-prev',
    nextEl: '.swiper-button-next',
  },

  slidesPerView: 1,
  spaceBetween: 16,

  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    1440: {
      slidesPerView: 3,
    },
  },
});

const starOn = `
<svg width="20" height="20" style="fill: #080c09" viewBox="0 0 32 32">
  <path
    d="M14.584 1.815c0.524-1.317 2.308-1.317 2.832 0l3.091 7.775c0.221 0.555 0.72 0.935 1.293 0.983l8.024 0.673c1.36 0.114 1.911 1.889 0.875 2.817l-6.114 5.478c-0.437 0.391-0.628 1.005-0.494 1.59l1.868 8.191c0.316 1.388-1.127 2.485-2.291 1.741l-6.87-4.39c-0.491-0.313-1.108-0.313-1.599 0l-6.87 4.389c-1.164 0.744-2.607-0.353-2.291-1.741l1.868-8.191c0.133-0.585-0.057-1.199-0.494-1.59l-6.114-5.478c-1.036-0.928-0.485-2.703 0.875-2.817l8.024-0.673c0.573-0.048 1.072-0.428 1.293-0.983l3.092-7.775z"
  ></path>
</svg>`;
const starOff = `
<svg width="20" height="20" style="fill: #080c09" viewBox="0 0 32 32">
  <path
    d="M8.688 19.097l-1.987 8.603c-0.062 0.261-0.043 0.533 0.053 0.783s0.265 0.465 0.485 0.617c0.22 0.152 0.481 0.235 0.749 0.236s0.53-0.078 0.752-0.227l7.26-4.84 7.26 4.84c0.227 0.151 0.495 0.228 0.768 0.222s0.537-0.095 0.757-0.256c0.22-0.161 0.386-0.385 0.475-0.642s0.097-0.536 0.023-0.799l-2.439-8.533 6.048-5.443c0.194-0.174 0.332-0.402 0.398-0.654s0.056-0.518-0.027-0.765-0.238-0.464-0.444-0.624c-0.206-0.16-0.454-0.256-0.714-0.277l-7.601-0.605-3.289-7.281c-0.105-0.234-0.275-0.434-0.491-0.573s-0.467-0.214-0.724-0.214c-0.257 0-0.508 0.074-0.724 0.214s-0.386 0.339-0.491 0.573l-3.289 7.281-7.601 0.604c-0.255 0.020-0.5 0.114-0.703 0.269s-0.358 0.366-0.445 0.607c-0.087 0.241-0.103 0.502-0.046 0.752s0.185 0.478 0.369 0.656l5.619 5.476zM12.492 13.329c0.238-0.019 0.467-0.101 0.662-0.239s0.35-0.325 0.448-0.543l2.399-5.308 2.399 5.308c0.098 0.218 0.252 0.405 0.448 0.543s0.424 0.22 0.662 0.239l5.296 0.42-4.361 3.925c-0.379 0.341-0.529 0.867-0.391 1.357l1.671 5.847-4.981-3.321c-0.219-0.147-0.476-0.225-0.739-0.225s-0.521 0.078-0.739 0.225l-5.205 3.471 1.4-6.061c0.051-0.223 0.044-0.455-0.020-0.675s-0.184-0.419-0.348-0.579l-4.051-3.949 5.453-0.435z"
  ></path>
</svg>`;
const starHalf = `
<svg width="20" height="20" style="fill: #080c09" viewBox="0 0 32 32">
  <path
    d="M31.075 12.168l0.121 0.401c0.1 0.303 0.016 0.639-0.213 0.85l-7.385 6.657 2.188 9.977c0.074 0.319-0.040 0.654-0.289 0.85l-0.334 0.241c-0.13 0.107-0.291 0.164-0.456 0.16-0.139 0.003-0.276-0.036-0.395-0.112l-8.312-5.341-8.267 5.341c-0.119 0.076-0.256 0.115-0.395 0.112-0.165 0.004-0.326-0.053-0.456-0.16l-0.38-0.241c-0.249-0.196-0.363-0.531-0.289-0.85l2.188-9.977-7.37-6.64c-0.24-0.21-0.331-0.556-0.228-0.866l0.167-0.401c0.089-0.317 0.356-0.541 0.669-0.561l9.71-0.818 3.723-9.447c0.119-0.314 0.409-0.518 0.729-0.513h0.395c0.317-0.007 0.604 0.199 0.714 0.513l3.784 9.447 9.71 0.818c0.313 0.020 0.58 0.244 0.669 0.561zM22.261 26.588l-1.702-7.507 5.577-5.021-7.309-0.61-2.826-7.154v16.265l6.261 4.026z"
  ></path>
</svg>`;
const starOnBase64 = 'data:image/svg+xml;base64,...';
const starOffBase64 = 'data:image/svg+xml;base64,...';
const starHalfBase64 = 'data:image/svg+xml;base64,...';

async function initFeedback() {
  showLoader();

  try {
    const data = await getFeedbackList();
    createFeedbackList(data);
    feedbackSwiper.update();
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити галерею відгуків. Спробуйте пізніше.',
      position: 'topRight',
    });

    console.error('Error fetching feedback:', error);
  } finally {
    hideLoader();
  }
}

initFeedback();

async function createFeedbackList(data) {
  const markup = data
    .map(
      el =>
        `
<li class="feedback-swiper-slide swiper-slide">
  <div class="rating-list" data-score="${el.rating}"></div>
  <p class="feedback-slide-text">"${el.descr}"</p>
  <p class="feedback-slide-name">${el.name}</p>
</li>
`
    )
    .join('');
  feedbackContainer.querySelector('.swiper-wrapper').insertAdjacentHTML('beforeend', markup);
  document.querySelectorAll('.rating-list').forEach(item => {
    const score = parseFloat(item.dataset.score);

    new Raty(item, {
      round: {
        down: 0.25,
        full: 0.75,
        up: 0.76,
      },
      readonly: true,
      score: score,
      starType: 'img',
      starOn: 'data:image/svg+xml;base64,' + btoa(starOn),
      starOff: 'data:image/svg+xml;base64,' + btoa(starOff),
      starHalf: 'data:image/svg+xml;base64,' + btoa(starHalf),
    }).init();
  });
}

async function getFeedbackList() {
  try {
    const response = await axios.get('https://furniture-store.b.goit.study/api/feedbacks', {
      params: {
        page: 1,
        limit: 10,
      },
    });

    return response.data.feedbacks;
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити відгуки. Спробуйте пізніше.',
      position: 'topRight',
    });

    console.error('Error fetching feedbacks:', error);
  }
}
