import SearchBar from './components/SearchBar.js';
import CoinCard from './components/CoinCard.js';
import { getCoins } from './services/api.js';

class App {
  constructor() {
    this.allCoins = [];
    this.isDataLoaded = false;
    this.coinRow = document.createElement('div');
    this.coinRow.className = 'row justify-content-center';
    this.coinRow.id = 'row';
    
    this.init();
  }

  async init() {
    await this.loadCoins();
    this.render();
  }

  async loadCoins() {
    try {
      this.allCoins = await getCoins();
      this.isDataLoaded = true;
      console.log("✅ Coins loaded:", this.allCoins.slice(0, 5));
    } catch (err) {
      console.error("🚨 Fetch error:", err);
      Alert.showError("Oops!", "Failed to load crypto data.");
    }
  }

  render() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = ''; // Clear previous content
    const container = document.createElement('div');
    container.className = 'container text-center mb-5';
    
    const title = document.createElement('h1');
    title.className = 'mb-4';
    title.textContent = 'Crypto Coin App';
    
     // Search Bar
    this.searchBar = new SearchBar({
      onSearch: this.handleSearch.bind(this),
      onBackToSearch: this.handleBackToSearch.bind(this)
    });

    // Results Container
    this.coinRow = document.createElement('div');
    this.coinRow.className = 'row justify-content-center';
    this.coinRow.id = 'row';
    
    container.appendChild(title);
    container.appendChild(searchBar.render());
    appContainer.appendChild(container);
    appContainer.appendChild(this.coinRow);
    
    const footer = document.createElement('footer');
    footer.className = 'text-center mt-5';
    footer.innerHTML = '<small><i class="fab fa-bitcoin"></i> Coded by Onur</small>';
    appContainer.appendChild(footer);
  }

  handleBackToSearch() {
    this.searchBar.showBackButton(false);
    this.coinRow.innerHTML = ''; // Clear coins
    this.searchBar.searchInput.value = ''; // Clear input
    this.searchBar.searchInput.focus(); // Focus on search
  }

  handleSearch(searchValue) {
    if (!this.isDataLoaded) {
      Alert.showWarning("Wait!", "Still loading coins. Try again in a moment.");
      return;
    }

    if (!searchValue) {
      Alert.showError("Empty Input", "Please enter a coin name.");
      return;
    }

    const matchedCoin = this.allCoins.find(
      coin => coin.name.toLowerCase() === searchValue.toLowerCase()
    );

    if (!matchedCoin) {
      Alert.showError("Not Found", `"${searchValue}" could not be found.`);
      return;
    }

    this.addCoinToDOM(matchedCoin);
  }

  addCoinToDOM(coin) {
    const exists = [...this.coinRow.querySelectorAll('.coin-box')].some(
      el => el.dataset.name === coin.name.toLowerCase()
    );

    if (exists) {
      Alert.showWarning("Already Added", `${coin.name} is already displayed.`);
      return;
    }

    const coinCard = new CoinCard(coin, () => {
      coinCard.remove();
    });
    
    this.coinRow.appendChild(coinCard.render());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});