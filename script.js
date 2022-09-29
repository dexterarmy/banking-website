'use strict';

// selections
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault(); // to prevent the default behaviour of link element
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Smooth Scrolling , for extra info go to final files

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

// page navigation with event delegation

//getAttribute because we wanted relative URL, use href to select an element because that href is like an id selector.
// we are attaching same handler func to each element, so copying which is not efficient

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// tabbed component , event delegation
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  // because we want to select buttons to get the data attribute
  const clicked = e.target.closest('.operations__tab');

  // guard case. modern way
  if (!clicked) return;

  // remove classes from tab and content area
  tabs.forEach(el => el.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // activate tab
  clicked.classList.add('operations__tab--active');

  // activate tabs content area with data attribute and adding classes
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Menu fade animation and passing arguments into event handler
const nav = document.querySelector('.nav');

const handleHover = function (e) {
  e.preventDefault();

  // simple check for links, no guard case
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    // getting all the siblings of link
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    // applying style to all the siblings of link except link itself
    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this; // by using this
      }
    });
    logo.style.opacity = this;
  }
};

// with event delegation and bind method, passing arguments in event handler func
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// sticky navigation : Intersection observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height; // get dimensions relative to viewport

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  // guard case with NOT , it guards the rest code because the first entry always gets triggered
  if (!entry.isIntersecting) return;

  // entry.target to know which section intersected the viewport, so as to reveal that only
  entry.target.classList.remove('section--hidden');

  // entry will not trigger again and again so will increase the performance of application
  observer.unobserve(entry.target);
};

// intersection observer which will observe the intersection
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, // triggers callback when target is 15% visible
});

// adds all the classes rightaway, then observes the target asynchronously.
allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Lazy loading of images
// selecting elements containing data-src attribute / property.
const imgTargets = document.querySelectorAll('img[data-src]');

const lazyImage = function (entries, observer) {
  const [entry] = entries;

  // guarde clause, because of that first default entry event
  if (!entry.isIntersecting) return;

  // replacing low resolution img with high one, with special data attribute
  entry.target.src = entry.target.dataset.src;

  //load event,
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  // unobserve, good for performance of app
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(lazyImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // callback called 200px before we reach element
});

imgTargets.forEach(img => imgObserver.observe(img));
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// sliders
// functionality in its own function
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const slider = document.querySelector('.slider');
  const dotsContainer = document.querySelector('.dots');
  let curSlide = 0; // // state variable for slider implementation

  // functions
  const dotMaker = function () {
    slides.forEach(function (_, i) {
      // to always insert as last child in dotsContainer, dynamically inserting data attribute of slide.
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`) // selecting element based on data attribute
      .classList.add('dots__dot--active');
  };

  const goslide = function (currentSlide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - currentSlide)}%)`; // tranform property CSS
    });
  };

  const nextSlide = function () {
    // make length of slide zero based with subtracting 1
    if (curSlide === slides.length - 1) curSlide = 0;
    else curSlide++;

    goslide(curSlide);
    activeDots(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) curSlide = slides.length - 1;
    else curSlide--;
    goslide(curSlide);
    activeDots(curSlide);
  };

  // initialise the slider, what will happen in the beginning
  const init = function () {
    goslide(0);
    dotMaker();
    activeDots(0);
  };
  init();

  // next slide
  // event handlers, with named callback
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // keydown event on document
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    else if (e.key === 'ArrowLeft') prevSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; // destructuring of object
      goslide(slide);
      activeDots(slide);
    }
  });
};
// call this whole func in the end, we could even pass values , options object etc and work with that. So we could make this slider func accept object which contain these options, it is very common to do.
slider();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
