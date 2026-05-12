document.addEventListener("DOMContentLoaded", () => {
  moveElement(".about__top_img-wrap", ".about__top_img-mobile");

  window.addEventListener("resize", () => {
    moveElement(".about__top_img-wrap", ".about__top_img-mobile");
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document
        .querySelector(this.getAttribute("href"))
        .scrollIntoView({ behavior: "smooth" });
    });
  });

  const carousels = [
    {
      selector: ".steps",
      auto: false,
      delay: 0,
      infinity: false,
      slidesPerView: { large: null, medium: 2, small: 1 },
    },
    {
      selector: ".players",
      auto: true,
      delay: 4000,
      infinity: true,
      slidesPerView: { large: 3, medium: 2, small: 1 },
    },
  ];

  carousels.forEach((carousel) => initializeCarousel(carousel));
});

function moveElement(selectorToMove, selectorDestination) {
  const elementToMove = document.querySelector(selectorToMove);
  const destinationContainer = document.querySelector(selectorDestination);

  if (!elementToMove || !destinationContainer) {
    return;
  }

  const screenWidth = window.innerWidth;
  if (screenWidth <= 1020) {
    destinationContainer.appendChild(elementToMove);
  }
}

function initializeCarousel({
  selector,
  auto,
  delay,
  infinity,
  slidesPerView,
}) {
  const carousel = document.querySelector(selector);
  const wrapper = carousel.querySelector(".carousel__wrapper");
  const items = Array.from(wrapper.children);
  const prevBtn = carousel.querySelector(".carousel__btn--prev");
  const nextBtn = carousel.querySelector(".carousel__btn--next");

  let currentIndex = 0;
  let slidesVisible = 1;
  let autoScrollInterval = null;
  let numberActiveSlide = 1;
  let dots = null;
  let numberSlideEl = null;

  function updateCarousel() {
    const screenWidth = window.innerWidth;

    slidesVisible =
      screenWidth > 1020
        ? slidesPerView.large
        : screenWidth > 720
          ? slidesPerView.medium
          : slidesPerView.small;
    numberActiveSlide = slidesVisible;

    updatePosition();
    setNumberSlide();
  }

  function updatePosition() {
    const itemWidth = items[0].offsetWidth + 20;
    wrapper.style.transition = "transform 0.5s ease";
    wrapper.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  function adjustSlides() {
    const itemWidth = items[0].offsetWidth + 20;

    if (currentIndex >= slidesVisible) {
      const firstItem = wrapper.firstElementChild;
      wrapper.appendChild(firstItem);
      currentIndex--;
      wrapper.style.transition = "none";
      wrapper.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }

    if (currentIndex <= 0) {
      const lastItem = wrapper.lastElementChild;
      wrapper.insertBefore(lastItem, wrapper.firstElementChild);
      currentIndex++;
      wrapper.style.transition = "none";
      wrapper.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }
  }

  if (selector === ".steps") {
    dots = document.getElementsByClassName("steps__pagination_item");
    setPaginationStyles(dots);
    for (let i = 0; i < dots.length; i++) {
      dots[i].addEventListener("click", () => {
        document
          .querySelector(".steps__pagination_item--current")
          .classList.remove("steps__pagination_item--current");
        dots[i].classList.add("steps__pagination_item--current");
        numberActiveSlide = i + 1;
        currentIndex = numberActiveSlide - 1;
        setPaginationStyles(dots);
        updatePosition();
      });
    }
  }

  function setNumberSlide() {
    if (selector === ".players") {
      numberSlideEl = document.querySelector(
        ".steps__pagination_current-slide",
      );
      numberSlideEl.innerHTML = numberActiveSlide;
    }
  }

  function moveToNextSlide() {
    if (numberActiveSlide >= items.length) {
      numberActiveSlide = 1;
    } else {
      numberActiveSlide++;
    }

    currentIndex++;
    updatePosition();
    if (selector === ".steps") {
      setPaginationStyles(dots);
    }

    setNumberSlide();

    if (infinity) {
      setTimeout(() => {
        adjustSlides();
      }, 500);
    }
  }

  function moveToPrevSlide() {
    if (numberActiveSlide <= 1) {
      numberActiveSlide = items.length;
    } else {
      numberActiveSlide--;
    }

    currentIndex--;
    updatePosition();
    if (selector === ".steps") {
      setPaginationStyles(dots);
    }

    setNumberSlide();

    if (infinity) {
      setTimeout(() => {
        adjustSlides();
      }, 500);
    }
  }

  prevBtn.addEventListener("click", moveToPrevSlide);
  nextBtn.addEventListener("click", moveToNextSlide);

  if (auto) {
    autoScrollInterval = setInterval(() => {
      moveToNextSlide();
    }, delay);

    carousel.addEventListener("mouseenter", () =>
      clearInterval(autoScrollInterval),
    );
    carousel.addEventListener("mouseleave", () => {
      autoScrollInterval = setInterval(() => {
        moveToNextSlide();
      }, delay);
    });
  }

  function setPaginationStyles(dots) {
    console.log(numberActiveSlide);
    for (let index = 0; index < dots.length; index++) {
      dots[index].classList.remove("steps__pagination_item--current");
      dots[numberActiveSlide - 1].classList.add(
        "steps__pagination_item--current",
      );
    }
    if (numberActiveSlide === slidesVisible) {
      prevBtn.disabled = "disabled";
    } else {
      prevBtn.disabled = "";
    }
    if (numberActiveSlide === items.length) {
      nextBtn.disabled = "disabled";
    } else {
      nextBtn.disabled = "";
    }
  }

  window.addEventListener("resize", updateCarousel);

  updateCarousel();
}
