document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("load", updateScale);
  window.addEventListener("resize", updateScale);

  const elements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          //observer.unobserve(entry.target); // Остановить наблюдение после анимации
        } else {
          entry.target.classList.remove("animate");
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
});

function updateScale() {
  const screenWidth = window.innerWidth;
  const baseWidth = 1400;

  if (screenWidth > baseWidth) {
    document.documentElement.style.fontSize = `${
      16 * (screenWidth / baseWidth)
    }px`;
  } else {
    document.documentElement.style.fontSize = "16px";
  }
}
