import SearchBar from './components/SearchBar.js';
import CoinCard from './components/CoinCard.js';
import { getCoins } from './services/api.js';
import Alert from './components/Alert.js';

class App {
  constructor() {
    this.allCoins = [];
    this.isDataLoaded = false;
    this.coinRow = null;
    this.searchBar = null;
    
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
    appContainer.innerHTML = '';

    const container = document.createElement('div');
    container.className = 'container text-center mb-5';
    
    // Create title container with logo
    const titleContainer = document.createElement('div');
    titleContainer.className = 'd-flex align-items-center justify-content-center mb-4';
    
    // Add spinning logo
    const logo = document.createElement('img');
    logo.src = '/assets/logo.png'; // Make sure to place your logo.png in public/assets
    logo.alt = 'Crypto Logo';
    logo.className = 'spin-logo me-3';
    logo.style.width = '50px';
    
    // Add title
    const title = document.createElement('h1');
    title.className = 'm-0';
    title.textContent = 'Crypto Coin App';
    
    titleContainer.appendChild(logo);
    titleContainer.appendChild(title);
    
    // Initialize SearchBar
    this.searchBar = new SearchBar({
      onSearch: this.handleSearch.bind(this),
      onBackToSearch: this.handleBackToSearch.bind(this)
    });

    // Initialize coinRow
    this.coinRow = document.createElement('div');
    this.coinRow.className = 'row justify-content-center';
    this.coinRow.id = 'row';
    
    container.appendChild(titleContainer);
    container.appendChild(this.searchBar.render());
    appContainer.appendChild(container);
    appContainer.appendChild(this.coinRow);
    
    const footer = document.createElement('footer');
    footer.className = 'text-center mt-5';
    footer.innerHTML = '<small><i class="fab fa-bitcoin"></i> Coded by Onur</small>';
    appContainer.appendChild(footer);

    // Add CSS for spinning animation
    this.addSpinAnimationStyles();
  }

  addSpinAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .spin-logo {
        animation: spin 4s linear infinite;
        transition: transform 0.3s ease;
      }
      .spin-logo:hover {
        animation-play-state: paused;
        transform: scale(1.1);
      }
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  // ... rest of your methods remain the same
  handleBackToSearch() {
    if (this.searchBar) {
      this.searchBar.showBackButton(false);
      this.searchBar.searchInput.value = '';
      this.searchBar.searchInput.focus();
    }
    if (this.coinRow) {
      this.coinRow.innerHTML = '';
    }
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
    
    if (this.searchBar) {
      this.searchBar.showBackButton(true);
    }
  }

  addCoinToDOM(coin) {
    if (!this.coinRow) return;

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