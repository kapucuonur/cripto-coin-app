export default class CoinCard {
  constructor(coin, onRemove) {
    this.coin = coin;
    this.onRemove = onRemove;
    this.element = null;
  }

  handleRemove = () => {
    this.onRemove();
  }

  render() {
    const { name, symbol, price, iconUrl, change } = this.coin;
    const safeChange = typeof change === 'number' ? change : 0;
    const displayChange = typeof change === 'number' ? change.toFixed(2) : 'N/A';
    const changedClass = typeof change === 'number' && change !== 0 && change > 0 ? 'green' : 'red';

    this.element = document.createElement('div');
    this.element.className = 'col-6 col-md-3 d-flex flex-column align-items-center border py-3 position-relative coin-box rounded-5';
    this.element.dataset.name = name.toLowerCase();
    
    this.element.innerHTML = `
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
    `;

    this.element.querySelector('.close').addEventListener('click', this.handleRemove);
    
    return this.element;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
}