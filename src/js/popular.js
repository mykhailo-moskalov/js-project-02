import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

class PopularSlider {
  constructor() {
    this.container = document.querySelector('.popular-container');
    this.track = document.querySelector('.popular-slider-track');
    this.prevBtn = document.querySelector('.slider-btn-prev');
    this.nextBtn = document.querySelector('.slider-btn-next');
    this.dotsContainer = document.querySelector('.slider-dots');
    this.slider = document.querySelector('.popular-slider');

    this.currentIndex = 0;
    this.itemsPerView = this.getItemsPerView();
    this.totalItems = 0;
    this.items = [];
    this.isLoading = false;

   
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;
    this.startTransform = 0;
    this.currentTransform = 0;

    this.init();
  }

  async init() {
    if (!this.container) return;

    this.bindEvents();
    await this.loadPopularItems();
    this.setupResponsive();
  }

  bindEvents() {
 
    this.prevBtn?.addEventListener('click', () => this.prevSlide());
    this.nextBtn?.addEventListener('click', () => this.nextSlide());

   
    this.slider?.addEventListener('touchstart', e => this.handleTouchStart(e), { passive: true });
    this.slider?.addEventListener('touchmove', e => this.handleTouchMove(e), { passive: false });
    this.slider?.addEventListener('touchend', e => this.handleTouchEnd(e), { passive: true });

  
    this.slider?.addEventListener('mousedown', e => this.handleMouseDown(e));
    this.slider?.addEventListener('mousemove', e => this.handleMouseMove(e));
    this.slider?.addEventListener('mouseup', e => this.handleMouseUp(e));
    this.slider?.addEventListener('mouseleave', e => this.handleMouseUp(e));

    
    this.slider?.addEventListener('dragstart', e => e.preventDefault());

   
    document.addEventListener('keydown', e => this.handleKeyPress(e));

    
    window.addEventListener('resize', () => this.handleResize());
  }

  async loadPopularItems() {
    if (this.isLoading) return;

    this.isLoading = true;

    try {
      const response = await axios.get('https://furniture-store.b.goit.study/api/furnitures', {
        params: {
          limit: 12,
          page: 1,
        },
      });

      this.items = response.data.furnitures || [];
      this.totalItems = this.items.length;

      this.renderItems();
      this.renderDots();
      this.updateSlider();
    } catch (error) {
      console.error('Error loading popular items:', error);
      iziToast.error({
        title: 'Помилка',
        message: 'Не вдалося завантажити популярні товари',
        position: 'topRight',
      });
    } finally {
      this.isLoading = false;
    }
  }

  renderItems() {
    if (!this.track || !this.items.length) return;

    
    const clonesBefore = this.items.slice(-this.itemsPerView);
    const clonesAfter = this.items.slice(0, this.itemsPerView);

    const fullSet = [...clonesBefore, ...this.items, ...clonesAfter];

    const itemsHTML = fullSet.map(item => this.createItemHTML(item)).join('');
    this.track.innerHTML = itemsHTML;

    
    this.totalItems = fullSet.length;

    
    this.currentIndex = this.itemsPerView;
    this.updateSlider(true);

    // Bind detail buttons
    this.track.querySelectorAll('.popular-details-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        const itemId = e.target.dataset.id;
        this.openItemDetails(itemId);
      });
    });
  }

  createItemHTML(item) {
    const colors = item.color || [];
    const colorsHTML = colors
      .map(color => `<span class="popular-color" style="background-color: ${color};"></span>`)
      .join('');

    return `
      <div class="popular-item">
        <img class="popular-item-img" src="${item.images?.[0] || ''}" alt="${
      item.name || ''
    }" loading="lazy">
        <h3 class="popular-item-name">${item.name || ''}</h3>
        <div class="popular-item-colors">${colorsHTML}</div>
        <p class="popular-item-price">${item.price || 0} грн</p>
        <button class="popular-details-btn" data-id="${item._id}">Детальніше</button>
      </div>
    `;
  }

  renderDots() {
    if (!this.dotsContainer) return;

    const totalSlides = Math.ceil(this.items.length / this.itemsPerView);
    const dotsHTML = Array.from(
      { length: totalSlides },
      (_, index) =>
        `<button class="slider-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></button>`
    ).join('');

    this.dotsContainer.innerHTML = dotsHTML;

    this.dotsContainer.querySelectorAll('.slider-dot').forEach(dot => {
      dot.addEventListener('click', e => {
        const slideIndex = parseInt(e.target.dataset.slide);
        this.currentIndex = slideIndex + this.itemsPerView;
        this.updateSlider();
      });
    });
  }

  getItemsPerView() {
    const width = window.innerWidth;
    if (width >= 1440) return 4;
    if (width >= 768) return 2;
    return 1;
  }

  updateSlider(instant = false) {
    if (!this.track) return;

    const slideWidth = 100 / this.itemsPerView;
    const translateX = -this.currentIndex * slideWidth;

    if (instant) {
      this.track.style.transition = 'none';
    } else {
      this.track.style.transition = 'transform 0.3s ease';
    }

    this.track.style.transform = `translateX(${translateX}%)`;
    this.currentTransform = translateX;

    this.updateDots();
  }

  updateButtons() {
    if (!this.prevBtn || !this.nextBtn) return;

    const maxIndex = Math.max(0, Math.ceil(this.totalItems / this.itemsPerView) - 1);

    this.prevBtn.disabled = this.currentIndex <= 0;
    this.nextBtn.disabled = this.currentIndex >= maxIndex;
  }

  updateDots() {
    if (!this.dotsContainer) return;

    const realSlideCount = Math.ceil(this.items.length / this.itemsPerView);

    
    let realIndex = (this.currentIndex - this.itemsPerView) % realSlideCount;
    if (realIndex < 0) realIndex += realSlideCount;

    this.dotsContainer.querySelectorAll('.slider-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === realIndex);
    });
  }

  nextSlide() {
    this.currentIndex++;
    this.updateSlider();

    if (this.currentIndex >= this.totalItems - this.itemsPerView) {
      setTimeout(() => {
        this.currentIndex = this.itemsPerView; 
      }, 300);
    }
  }

  prevSlide() {
    this.currentIndex--;
    this.updateSlider();

    if (this.currentIndex < this.itemsPerView) {
      setTimeout(() => {
        this.currentIndex = this.totalItems - this.itemsPerView * 2; 
        this.updateSlider(true);
      }, 300);
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }

  goToSlide(index) {
    const maxIndex = Math.max(0, Math.ceil(this.totalItems / this.itemsPerView) - 1);
    this.currentIndex = Math.max(0, Math.min(index, maxIndex));
    this.updateSlider();
  }

  
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
    this.isDragging = true;
    this.startTransform = this.currentTransform;
    this.track?.classList.add('swiping');
  }

  handleTouchMove(e) {
    if (!this.isDragging) return;

    e.preventDefault();
    this.touchEndX = e.touches[0].clientX;
    const diff = this.touchStartX - this.touchEndX;
    const percentage = (diff / this.slider.offsetWidth) * 100;

    const newTransform = this.startTransform - percentage;
    this.track.style.transform = `translateX(${newTransform}%)`;
  }

  handleTouchEnd(e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.track?.classList.remove('swiping');

    const diffX = this.touchStartX - this.touchEndX;
    const threshold = 50; 

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    } else {
      this.updateSlider();
    }
  }

 
  handleMouseDown(e) {
    e.preventDefault();
    this.touchStartX = e.clientX;
    this.isDragging = true;
    this.startTransform = this.currentTransform;
    this.track?.classList.add('swiping');
    this.slider.style.cursor = 'grabbing';
  }

  handleMouseMove(e) {
    if (!this.isDragging) return;

    e.preventDefault();
    this.touchEndX = e.clientX;
    const diff = this.touchStartX - this.touchEndX;
    const percentage = (diff / this.slider.offsetWidth) * 100;

    const newTransform = this.startTransform - percentage;
    this.track.style.transform = `translateX(${newTransform}%)`;
  }

  handleMouseUp(e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.track?.classList.remove('swiping');
    this.slider.style.cursor = 'grab';

    const diffX = this.touchStartX - this.touchEndX;
    const threshold = 50;

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    } else {
      this.updateSlider();
    }
  }

  handleKeyPress(e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.nextSlide();
    }
  }

  handleResize() {
    const newItemsPerView = this.getItemsPerView();
    if (newItemsPerView !== this.itemsPerView) {
      this.itemsPerView = newItemsPerView;
      this.currentIndex = 0; 
      this.renderDots();
      this.updateSlider();
    }
  }

  setupResponsive() {
   
    if (this.slider) {
      this.slider.style.cursor = 'grab';
    }
  }

  openItemDetails(itemId) {
    
    console.log('Opening details for item:', itemId);

    
    const existingModalBtn = document.querySelector(`#${itemId}`);
    if (existingModalBtn) {
      existingModalBtn.click();
      return;
    }

    
    const detailEvent = new CustomEvent('showFurnitureDetails', {
      detail: { id: itemId },
    });
    document.dispatchEvent(detailEvent);

    
    this.showItemInfo(itemId);
  }

  async showItemInfo(itemId) {
    try {
      const response = await axios.get(
        `https://furniture-store.b.goit.study/api/furnitures/${itemId}`
      );
      const item = response.data;

      alert(
        `${item.name}\nPrice: ${item.price} грн\nDescription: ${
          item.description || 'No description available'
        }`
      );
    } catch (error) {
      console.error('Error fetching item details:', error);
      iziToast.error({
        title: 'Помилка',
        message: 'Не вдалося завантажити деталі товару',
        position: 'topRight',
      });
    }
  }
}


document.addEventListener('DOMContentLoaded', () => {
  new PopularSlider();
});


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PopularSlider();
  });
} else {
  new PopularSlider();
}
