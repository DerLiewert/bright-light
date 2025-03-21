/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
/*
Основниые модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
// import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';

// Инициализация слайдеров
function initSliders() {
  if (document.querySelector('.swiper')) {
    new Swiper('.swiper', {
      modules: [Navigation],
      observer: true,
      watchOverflow: true,
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      spaceBetween: 15,
      speed: 800,

      navigation: {
        prevEl: '.swiper-button-prev',
        nextEl: '.swiper-button-next',
      },

      breakpoints: {
        480: {
          slidesPerGroup: 1,
          spaceBetween: 20,
        },
        650: {
          slidesPerGroup: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerGroup: 2,
          spaceBetween: 30,
        },
        1150: {
          slidesPerGroup: 3,
          spaceBetween: 30,
        },
      },
    });
  }
}

window.addEventListener('load', function (e) {
  initSliders();
});
