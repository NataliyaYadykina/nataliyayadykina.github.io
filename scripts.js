document.addEventListener("DOMContentLoaded", () => {
  // Запускаем при загрузке и ресайзе
  window.addEventListener("load", updateScale);
  window.addEventListener("resize", updateScale);
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
