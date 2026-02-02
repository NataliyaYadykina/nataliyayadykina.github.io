$(document).ready(function () {
  const rate = 70;
  console.log("run script");

  function updatePrice(container, isUsd) {
    const currencySymbol = isUsd ? "$" : "₽";

    container.find(".js-price-old, .js-price-current").each(function () {
      const basePrice = parseFloat($(this).data("base-price"));
      let newPrice;

      if (isUsd) {
        newPrice = (basePrice / rate).toFixed(0);
      } else {
        newPrice = basePrice.toLocaleString("ru-RU");
      }

      $(this).text(newPrice);
    });

    container.find(".js-currency-symbol").text(currencySymbol);

    if (isUsd) {
      container.find(".js-curr-usd").removeClass("mlq_opacity");
      container.find(".js-curr-rub").addClass("mlq_opacity");
    } else {
      container.find(".js-curr-rub").removeClass("mlq_opacity");
      container.find(".js-curr-usd").addClass("mlq_opacity");
    }
  }

  $(".js-curr-usd").on("click", function () {
    const card = $(this).closest(".price-block");
    updatePrice(card, true);
  });

  $(".js-curr-rub").on("click", function () {
    const card = $(this).closest(".price-block");
    updatePrice(card, false);
  });
});
