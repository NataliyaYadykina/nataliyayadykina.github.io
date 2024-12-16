document.addEventListener('DOMContentLoaded', () => {

    moveElement('.about__top_img-wrap', '.about__top_img-mobile');

    window.addEventListener('resize', () => {
        moveElement('.about__top_img-wrap', '.about__top_img-mobile');
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
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


function initializeCarousel({ selector, auto, delay, infinity, slidesPerView }) {
    const carousel = document.querySelector(selector);
    const wrapper = carousel.querySelector(".carousel__wrapper");
    const items = Array.from(wrapper.children); // Преобразуем в массив для удобства работы
    const prevBtn = carousel.querySelector(".carousel__btn--prev");
    const nextBtn = carousel.querySelector(".carousel__btn--next");

    let currentIndex = 0;
    let slidesVisible = 1;
    let autoScrollInterval = null;
    let numberActiveSlide = 1;
    let dots = null;
    let numberSlideEl = null;

    // Функция для обновления видимых слайдов
    function updateCarousel() {
        const screenWidth = window.innerWidth;

        // Определяем количество видимых слайдов
        slidesVisible = screenWidth > 1020 ? slidesPerView.large : screenWidth > 720 ? slidesPerView.medium : slidesPerView.small;
        numberActiveSlide = slidesVisible;

        updatePosition();
        setNumberSlide();
    }

    // Функция для обновления позиции
    function updatePosition() {
        const itemWidth = items[0].offsetWidth + 20; // ширина элемента + отступ
        wrapper.style.transition = "transform 0.5s ease"; // Плавная анимация
        wrapper.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

    }

    // Функция для обработки слайда, ушедшего за пределы видимости
    function adjustSlides() {
        const itemWidth = items[0].offsetWidth + 20; // ширина элемента + отступ

        // Если листаем вправо и первый слайд вышел за пределы видимости
        if (currentIndex >= slidesVisible) {
            const firstItem = wrapper.firstElementChild;
            wrapper.appendChild(firstItem); // Перемещаем первый слайд в конец
            currentIndex--; // Корректируем индекс
            wrapper.style.transition = "none"; // Убираем анимацию
            wrapper.style.transform = `translateX(-${currentIndex * itemWidth}px)`; // Сброс позиции
        }

        // Если листаем влево и последний слайд вышел за пределы видимости
        if (currentIndex <= 0) {
            const lastItem = wrapper.lastElementChild;
            wrapper.insertBefore(lastItem, wrapper.firstElementChild); // Перемещаем последний слайд в начало
            currentIndex++; // Корректируем индекс
            wrapper.style.transition = "none"; // Убираем анимацию
            wrapper.style.transform = `translateX(-${currentIndex * itemWidth}px)`; // Сброс позиции
        }
    }

    if (selector === '.steps') {
        dots = document.getElementsByClassName('steps__pagination_item');
        setPaginationStyles(dots);
        for (let i = 0; i < dots.length; i++) {
            dots[i].addEventListener('click', () => {
                document.querySelector('.steps__pagination_item--current').classList.remove('steps__pagination_item--current');
                dots[i].classList.add('steps__pagination_item--current');
                numberActiveSlide = i + 1;
                currentIndex = numberActiveSlide - 1;
                setPaginationStyles(dots);
                updatePosition();
            });
        };
    }

    function setNumberSlide() {
        if (selector === '.players') {
            numberSlideEl = document.querySelector('.steps__pagination_current-slide');
            numberSlideEl.innerHTML = numberActiveSlide;
        }
    }

    // Функция для перехода к следующему слайду
    function moveToNextSlide() {

        if (numberActiveSlide >= items.length) {
            numberActiveSlide = 1
        } else {
            numberActiveSlide++;
        }

        currentIndex++;
        updatePosition();
        if (selector === '.steps') {
            setPaginationStyles(dots);
        }

        setNumberSlide();

        // После анимации корректируем элементы
        if (infinity) {
            setTimeout(() => {
                adjustSlides();
            }, 500); // Таймаут соответствует длительности анимации
        }

    }

    // Функция для перехода к предыдущему слайду
    function moveToPrevSlide() {

        if (numberActiveSlide <= 1) {
            numberActiveSlide = items.length;
        } else {
            numberActiveSlide--;
        }

        currentIndex--;
        updatePosition();
        if (selector === '.steps') {
            setPaginationStyles(dots);
        }

        setNumberSlide();

        // После анимации корректируем элементы
        if (infinity) {
            setTimeout(() => {
                adjustSlides();
            }, 500);
        }

    }

    // Обработчики событий для кнопок навигации
    prevBtn.addEventListener("click", moveToPrevSlide);
    nextBtn.addEventListener("click", moveToNextSlide);

    // Автопрокрутка
    if (auto) {
        autoScrollInterval = setInterval(() => {
            moveToNextSlide();
        }, delay);

        // Остановка автопрокрутки при наведении мыши
        carousel.addEventListener("mouseenter", () => clearInterval(autoScrollInterval));
        carousel.addEventListener("mouseleave", () => {
            autoScrollInterval = setInterval(() => {
                moveToNextSlide();
            }, delay);
        });
    }

    // Номер активной страницы
    function setPaginationStyles(dots) {
        console.log(numberActiveSlide);
        for (let index = 0; index < dots.length; index++) {
            dots[index].classList.remove('steps__pagination_item--current');
            dots[numberActiveSlide - 1].classList.add('steps__pagination_item--current');
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

    // Адаптация при изменении размера окна
    window.addEventListener("resize", updateCarousel);

    // Первоначальная настройка
    updateCarousel();


}