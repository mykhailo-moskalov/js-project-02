import IMask from 'imask';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const API_URL = 'https://furniture-store.b.goit.study/api/orders';

export const orderModal = {
  refs: {
    closeModalBtn: document.querySelector('[data-order-close]'),
    modal: document.querySelector('[data-order]'),
    form: document.getElementById('order-form'),
    emailInput: document.getElementById('order-email'),
    phoneInput: document.getElementById('order-phone'),
    emailError: document.getElementById('email-error'),
    phoneError: document.getElementById('phone-error'),
    commentInput: document.getElementById('order-comment'),
    commentError: document.getElementById('comment-error'),
  },
  modelId: '682f9bbf8acbdf505592ac36',
  color: '#1212ca',

  init() {
    this.refs.closeModalBtn.addEventListener('click', this.closeModal.bind(this));
    this.refs.modal.addEventListener('click', this.backdropClick.bind(this));
    document.addEventListener('keydown', this.keydownHandler.bind(this));
    this.refs.form.addEventListener('submit', this.handleSubmit.bind(this));

    // Додаємо обробники подій для динамічної валідації
    this.refs.emailInput.addEventListener('input', this.validateEmail.bind(this));
    this.refs.phoneInput.addEventListener('input', this.validatePhone.bind(this));
    this.refs.commentInput.addEventListener('input', this.validateComment.bind(this));

    IMask(orderModal.refs.phoneInput, {
      mask: '+38 (0\\00) 000 00 00',
    });
  },

  checkElements() {
    const requiredElements = [
      this.refs.closeModalBtn,
      this.refs.modal,
      this.refs.form,
      this.refs.emailInput,
      this.refs.phoneInput,
      this.refs.emailError,
      this.refs.phoneError,
      this.refs.commentInput,
      this.refs.commentError,
    ];

    return requiredElements.every(el => el !== null);
  },

  openModal() {
    document.body.style.overflow = 'hidden';
    this.refs.modal.classList.remove('visually-hidden');
  },

  closeModal() {
    document.body.style.overflow = '';
    this.refs.modal.classList.add('visually-hidden');
    this.refs.form.reset();
    this.clearValidationStyles();
  },

  backdropClick(e) {
    if (e.target === e.currentTarget) this.closeModal();
  },

  keydownHandler(e) {
    if (e.code === 'Escape') this.closeModal();
  },

  // Валідація email
  validateEmail() {
    const email = this.refs.emailInput.value.trim();
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      this.markInvalid(this.refs.emailInput);
      this.refs.emailError.textContent = 'Пошта повинна бути у форматі example@email.com';
      this.refs.emailError.style.display = 'block';
      return false;
    } else {
      this.refs.emailInput.classList.remove('invalid');
      this.refs.emailError.textContent = '';
      this.refs.emailError.style.display = 'none';
      return true;
    }
  },

  // Валідація телефону
  validatePhone() {
    const phone = this.refs.phoneInput.value.trim();
    const phoneRegex = /^\+38\s\(\d{3}\)\s\d{3}\s\d{2}\s\d{2}$/;

    if (!phoneRegex.test(phone)) {
      this.markInvalid(this.refs.phoneInput);
      this.refs.phoneError.textContent = 'Телефон має бути у форматі +38 (0XX) XXX XX XX';
      this.refs.phoneError.style.display = 'block';
      return false;
    } else {
      this.refs.phoneInput.classList.remove('invalid');
      this.refs.phoneError.textContent = '';
      this.refs.phoneError.style.display = 'none';
      return true;
    }
  },

  formatPhoneNumber(phone) {
    // Видаляємо всі нецифрові символи
    return phone.replace(/\D/g, '');
  },

  // Валідація коментаря
  validateComment() {
    const comment = this.refs.commentInput.value.trim();

    if (comment && (comment.length < 5 || comment.length > 256)) {
      this.markInvalid(this.refs.commentInput);
      this.refs.commentError.textContent = 'Коментар має містити від 5 до 256 символів';
      this.refs.commentError.style.display = 'block';
      return false;
    } else {
      this.refs.commentInput.classList.remove('invalid');
      this.refs.commentError.textContent = '';
      this.refs.commentError.style.display = 'none';
      return true;
    }
  },

  async handleSubmit(e) {
    e.preventDefault();

    // Очистити попередні стилі помилок
    this.clearValidationStyles();

    let isValid = true;

    // Виконуємо всі валідації
    if (!this.validateEmail()) isValid = false;
    if (!this.validatePhone()) isValid = false;
    if (!this.validateComment()) isValid = false;

    if (!isValid) {
      iziToast.error({
        title: 'Помилка',
        message: 'Будь ласка, виправте помилки у формі',
        position: 'topRight',
      });
      return;
    }

    // Формуємо об'єкт замовлення
    const orderData = {
      email: this.refs.emailInput.value.trim(),
      phone: this.formatPhoneNumber(this.refs.phoneInput.value.trim()), // Форматуємо телефон
      modelId: this.modelId,
      color: this.color,
    };

    const comment = this.refs.commentInput.value.trim();
    if (comment) orderData.comment = comment;

    // Логування для перевірки

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Не вдалося відправити заявку');
      }

      iziToast.success({
        title: 'Успіх',
        message: 'Ваша заявка відправлена!',
        position: 'topRight',
      });

      this.closeModal();
    } catch (err) {
      console.error('Помилка при відправці:', err);
      iziToast.error({
        title: 'Помилка',
        message: err.message || 'Помилка зʼєднання з сервером',
        position: 'topRight',
      });
    }
  },

  markInvalid(input) {
    input.classList.add('invalid');
  },

  clearValidationStyles() {
    this.refs.emailInput.classList.remove('invalid');
    this.refs.phoneInput.classList.remove('invalid');
    this.refs.commentInput.classList.remove('invalid');
    this.refs.emailError.textContent = '';
    this.refs.emailError.style.display = 'none';
    this.refs.phoneError.textContent = '';
    this.refs.phoneError.style.display = 'none';
    this.refs.commentError.textContent = '';
    this.refs.commentError.style.display = 'none';
  },
};

document.addEventListener('DOMContentLoaded', () => {
  orderModal.init();
});
