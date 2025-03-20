// Підключення списку активних модулів
import { flsModules } from './modules.js';

/* Перевірка мобільного браузера */
export let isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};

// Отримання хешу на адресі сайту
export function getHash() {
  if (location.hash) {
    return location.hash.replace('#', '');
  }
}
// Вказівка хеша на адресу сайту
export function setHash(hash) {
  hash = hash ? `#${hash}` : window.location.href.split('#')[0];
  history.pushState('', '', hash);
}
// Допоміжні модулі блокування прокручування та стрибка ====================================================================================================================================================================================================================================================================================
export let bodyLockStatus = true;
export let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
export let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll('[data-lp]');
    setTimeout(() => {
      lockPaddingElements.forEach((lockPaddingElement) => {
        lockPaddingElement.style.paddingRight = '';
      });
      document.body.style.paddingRight = '';
      document.documentElement.classList.remove('lock');
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
export let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll('[data-lp]');
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + 'px';
    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    });

    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add('lock');

    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};

// Модуль роботи з меню (бургер) =======================================================================================================================================================================================================================
export function menuInit() {
  if (document.querySelector('.icon-menu')) {
    document.addEventListener('click', function (e) {
      if (bodyLockStatus && e.target.closest('.icon-menu')) {
        menuToggle();
      }
    });

    const pcMatchMedia = window.matchMedia('(min-width: 767.98px)');
    const onScreenWidthChange = (e) => {
      if (e.matches) menuClose();
    };
    pcMatchMedia.addEventListener('change', onScreenWidthChange);
    onScreenWidthChange(pcMatchMedia);
  }
}
export function menuOpen() {
  bodyLock();
  document.documentElement.classList.add('menu-open');
  document.querySelector('.icon-menu').setAttribute('aria-label', 'Close menu');
}
export function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove('menu-open');
  document.querySelector('.icon-menu').setAttribute('aria-label', 'Open menu');
}
export function menuToggle() {
  if (document.documentElement.classList.contains('menu-open')) menuClose();
  else menuOpen();
}

//================================================================================================================================================================================================================================================================================================================
// Інші корисні функції ================================================================================================================================================================================================================================================================================================================
//================================================================================================================================================================================================================================================================================================================
// FLS (Full Logging System)
export function FLS(message) {
  setTimeout(() => {
    if (window.FLS) {
      console.log(message);
    }
  }, 0);
}
// Отримати цифри з рядка
export function getDigFromString(item) {
  return parseInt(item.replace(/[^\d]/g, ''));
}
// Форматування цифр типу 100 000 000
export function getDigFormat(item, sepp = ' ') {
  return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`);
}
// Прибрати клас з усіх елементів масиву
export function removeClasses(array, className) {
  for (var i = 0; i < array.length; i++) {
    array[i].classList.remove(className);
  }
}
// Унікалізація масиву
export function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}
