const transitionTime = 300

const body = document.querySelector('body')
const contacts = [...document.querySelectorAll('.card')]
const closeModalBtn = document.querySelector('.modal__close')
const modal = document.querySelector('.modal')

const mySwiper = new Swiper ('.swiper-container', {
  direction: 'horizontal',
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  spaceBetween: 10,
  centerSlides: true
})


closeModalBtn.addEventListener('click', () => {
  body.classList.remove('scroll-lock')
  modal.classList.add('modal--hiding')
  setTimeout(() => {
    modal.classList.remove('modal--hiding')
    modal.classList.replace('modal--visible' ,'modal--hidden')
  }, transitionTime);
})

const slideTo = id => {
  body.classList.add('scroll-lock')
  modal.classList.replace('modal--hidden' ,'modal--revealing')
  mySwiper.slideTo(id)
  setTimeout(() => modal.classList.replace('modal--revealing', 'modal--visible'), transitionTime);
}

contacts.forEach(
  contact => contact.addEventListener('click',
  ({target}) => {
      if (target.classList.value != 'card__envelope') {
        slideTo(contact.id)
      }
    }
));