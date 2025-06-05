// src/script.js
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("coin");
  const searchButton = document.getElementById("searchBtn");
  const coinRow = document.getElementById("row");

  let isDataLoaded = false;
  let allCoins = [];

  const init = async () => {
    await getCoins();
    setupEventListeners();
  };

  const getCoins = async () => {
    const URL = "https://api.coinranking.com/v2/coins"; 

    try {
      const res = await fetch(URL);
      if (!res.ok) throw new Error(`API failed: ${res.status}`);

      const data = await res.json();
      allCoins = data.data.coins;
      isDataLoaded = true;

      console.log("✅ Coins loaded:", allCoins.slice(0, 5));
    } catch (err) {
      console.error("🚨 Fetch error:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to load crypto data.",
      });
    }
  };

  const handleSearch = () => {
    if (!isDataLoaded) {
      Swal.fire({
        icon: "warning",
        title: "Wait!",
        text: "Still loading coins. Try again in a moment.",
      });
      return;
    }

    const searchValue = searchInput.value.trim().toLowerCase();

    if (!searchValue) {
      Swal.fire({
        icon: "error",
        title: "Empty Input",
        text: "Please enter a coin name.",
      });
      return;
    }

    const matchedCoin = allCoins.find(
      coin => coin.name.toLowerCase() === searchValue
    );

    if (!matchedCoin) {
      Swal.fire({
        icon: "error",
        title: "Not Found",
        text: `"${searchValue}" could not be found.`,
      });
      return;
    }

    addCoinToDOM(matchedCoin);
    searchInput.value = "";
  };

  const addCoinToDOM = (coin) => {
    const { name, symbol, price, iconUrl, change } = coin;

    // Safely handle 'change'
    const safeChange = typeof change === "number" ? change : 0;
    const displayChange = typeof change === "number" ? change.toFixed(2) : "N/A";
    const changedClass = typeof change === "number" && change !== 0 && change > 0 ? "green" : "red";

    const exists = [...coinRow.querySelectorAll(".coin-box")].some(
      el => el.dataset.name === name.toLowerCase()
    );

    if (exists) {
      Swal.fire({
        icon: "warning",
        title: "Already Added",
        text: `${name} is already displayed.`,
      });
      return;
    }

    const coinHTML = `
      <div class="col-6 col-md-3 d-flex flex-column align-items-center border py-3 position-relative coin-box rounded-5" data-name="${name.toLowerCase()}">
        <span class="close text-white">x</span>
        <div class="coin_name position-relative">
          <p class="position-relative fs-3 text-bg-dark rounded-5 px-3">${name}
            <span class="position-absolute badge text-white bg-warning symbol rounded-5">${symbol}</span>
          </p>
        </div>
        <div class="price fs-4 fw-bold"><p>$${Number(price).toFixed(4)}</p></div>
        <div class="icon w-100 d-flex justify-content-center align-items-center">
          <img class="w-50" src="${iconUrl}" alt="${name} icon">
        </div>
        <div class="changed ${displayChange === "N/A" ? "text-muted" : changedClass} mt-3">
          <i class="fa-solid fa-chart-line"></i> ${displayChange}%
        </div>
      </div>
    `;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = coinHTML;
    coinRow.appendChild(tempDiv.firstElementChild);
  };

  const setupEventListeners = () => {
    if (searchButton) {
      searchButton.addEventListener("click", (e) => {
        e.preventDefault();
        handleSearch();
      });
    }

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSearch();
      }
    });

    coinRow.addEventListener("click", (e) => {
      if (e.target.classList.contains("close")) {
        e.target.closest(".coin-box").remove();
      }
    });

    searchInput.addEventListener("input", debounce(handleSearch, 500));
  };

  function debounce(fn, delay = 300) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, arguments), delay);
    };
  }

  init();
});