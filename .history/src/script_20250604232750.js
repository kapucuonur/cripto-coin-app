// Elements
const searchInput = document.getElementById("coin");
const searchButton = document.getElementById("searchBtn"); // More reliable than .btn
const coinRow = document.querySelector(".row");

let coinNames = [];
let isDataLoaded = false;

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
    window.allCoins = data.data.coins;
    isDataLoaded = true;

    console.log("✅ Coins loaded:", coinNames.slice(0, 5)); // Log sample
  } catch (err) {
    console.error("🚨 Failed to fetch coins:", err);
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Failed to load cryptocurrency data.",
    });
  }
};

// Handle Search
const handleSearch = () => {
  if (!isDataLoaded) {
    Swal.fire({
      icon: "warning",
      title: "Hold on!",
      text: "Please wait while we load the latest crypto data.",
    });
    return;
  }

  const searchValue = searchInput.value.trim().toLowerCase();

  if (!searchValue || !window.allCoins) return;

  const matchedCoin = window.allCoins.find(
    coin => coin.name.toLowerCase() === searchValue
  );

  if (!matchedCoin) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "The searched coin could not be found!",
    });
    searchInput.value = "";
    return;
  }

  addCoinToDOM(matchedCoin);
  searchInput.value = "";
};

// Setup Event Listeners
const setupEventListeners = () => {
  if (searchButton) {
    searchButton.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent form reload
      handleSearch();
    });
  }

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Optional
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
function debounce(fn, delay) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, arguments), delay);
  };
}

// Start App
init();