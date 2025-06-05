document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("coin");
  const searchButton = document.getElementById("searchBtn");
  const coinRow = document.getElementById("row");

  let coinNames = [];
  let isDataLoaded = false;

  // Initialize App
  const init = async () => {
    await getCoins();
    loadSavedCoins();
    setupEventListeners();
  };

  // Fetch Coins from API
  const getCoins = async () => {
    const BASE_URL = "https://api.coinranking.com/v2"; 
    const API_KEY = "coinrankinge579fa975b35c1027a9044045252f2819d1332755ba858f0"; // Replace if needed
    const URL = `${BASE_URL}/coins`;

    try {
      const res = await fetch(URL);
      if (!res.ok) throw new Error("API request failed");

      const data = await res.json();

      coinNames = data.data.coins.map(coin => coin.name.toLowerCase());
      window.allCoins = data.data.coins; // Save globally
      isDataLoaded = true;

      console.log("✅ Coins loaded:", coinNames.slice(0, 5));
    } catch (err) {
      console.error("🚨 Failed to fetch coins:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Failed to load cryptocurrency data.",
      });
    }
  };

  // Display Coin in DOM
  const addCoinToDOM = (coin) => {
    const { name, symbol, price, iconUrl, change } = coin;

    // Prevent duplicates
    const coinExists = [...coinRow.querySelectorAll(".coin-box")].some(
      el => el.dataset.name === name.toLowerCase()
    );

    if (coinExists) {
      Swal.fire({
        icon: "warning",
        title: "Already Added",
        text: `${name} is already displayed.`,
      });
      return;
    }

    const changedClass = change > 0 ? "green" : "red";
    const fsClass = name.length > 9 ? "smfontSize" : "fs-3";

    const coinHTML = `
      <div class="col-6 col-md-3 d-flex flex-column align-items-center border py-3 position-relative coin-box rounded-5" data-name="${name.toLowerCase()}">
        <span class="close text-white">x</span>
        <div class="coin_name position-relative">
          <p class="position-relative fs-3 text-bg-dark rounded-5 px-3 ${fsClass}" onclick="copyPrice('${price}')">
            ${name}
            <span class="position-absolute badge text-white bg-warning symbol rounded-5">${symbol}</span>
          </p>
        </div>
        <div class="price fs-4 fw-bold">
          <p>$${Number(price).toFixed(4)}</p>
        </div>
        <div class="icon w-100 d-flex justify-content-center align-items-center">
          <img class="w-50" src="${iconUrl}" alt="${name} icon">
        </div>
        <div class="changed ${changedClass} mt-3">
          <i class="fa-solid fa-chart-line"></i> ${change.toFixed(2)}%
        </div>
      </div>
    `;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = coinHTML;
    coinRow.appendChild(tempDiv.firstElementChild);

    saveCoinToLocalStorage(coin);
  };

  // Save Coin to localStorage
  const saveCoinToLocalStorage = (coin) => {
    let saved = JSON.parse(localStorage.getItem("selectedCoins")) || [];
    if (!saved.some(c => c.name === coin.name)) {
      saved.push(coin);
      localStorage.setItem("selectedCoins", JSON.stringify(saved));
    }
  };

  // Load Saved Coins from localStorage
  const loadSavedCoins = () => {
    const saved = JSON.parse(localStorage.getItem("selectedCoins")) || [];
    saved.forEach(coin => {
      const exists = [...coinRow.querySelectorAll(".coin-box")].some(
        el => el.dataset.name === coin.name.toLowerCase()
      );
      if (!exists) addCoinToDOM(coin);
    });
  };

  // Handle Search
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
        text: "Please enter a valid coin name.",
      });
      return;
    }

    const matchedCoin = window.allCoins.find(
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

  // Setup Event Listeners
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
        removeCoinFromLocalStorage(e.target.closest(".coin-box").dataset.name);
      }
    });

    searchInput.addEventListener("input", debounce(handleSearch, 500));
  };

  // Debounce Function
  function debounce(fn, delay = 300) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, arguments), delay);
    };
  }

  // Copy Price to Clipboard
  window.copyPrice = (price) => {
    navigator.clipboard.writeText(`$${Number(price).toFixed(4)}`);
    Swal.fire({
      icon: "success",
      title: "Copied!",
      text: `$${Number(price).toFixed(4)} copied to clipboard`,
      timer: 1000,
      showConfirmButton: false,
    });
  };

  // Remove Coin from localStorage
  const removeCoinFromLocalStorage = (name) => {
    let saved = JSON.parse(localStorage.getItem("selectedCoins")) || [];
    saved = saved.filter(coin => coin.name.toLowerCase() !== name);
    localStorage.setItem("selectedCoins", JSON.stringify(saved));
  };

  // Start App
  init();
});