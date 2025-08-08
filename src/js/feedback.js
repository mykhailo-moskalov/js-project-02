import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import Raty from 'raty-js';
import 'raty-js/src/raty.css';
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

initFeedback();

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

async function createFeedbackList(data) {
  const markup = data
    .map(
      el =>
        `
<li class="feedback-swiper-slide swiper-slide">
  <div class="rating-list" data-score="${el.rate}"></div>
  <p class="feedback-slide-text">"${el.descr}"</p>
  <p class="feedback-slide-name">${el.name}</p>
</li>
`
    )
    .join('');
  feedbackContainer.querySelector('.swiper-wrapper').insertAdjacentHTML('beforeend', markup);
  document.querySelectorAll('.rating-list').forEach(item => {
    const score = parseFloat(item.dataset.score);

    const raty = new Raty(item, {
      round: {
        down: 0.25,
        full: 0.75,
        up: 0.76,
      },

      readOnly: true,
      score: score,
      starType: 'i',
    });

    raty.init();
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
