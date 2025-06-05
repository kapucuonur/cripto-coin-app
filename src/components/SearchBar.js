export default class SearchBar {
  constructor({ onSearch, onBackToSearch }) {
    this.onSearch = onSearch;
    this.onBackToSearch = onBackToSearch;
  }

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.onSearch(this.searchInput.value.trim());
    }
  }

  handleClick = (e) => {
    e.preventDefault();
    this.onSearch(this.searchInput.value.trim());
  }

  handleBackClick = (e) => {
    e.preventDefault();
    this.onBackToSearch();
  }

  render() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';

    // Search Input
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.id = 'coin';
    this.searchInput.className = 'form-control w-50 mx-auto mb-3';
    this.searchInput.placeholder = 'Search for a coin';
    this.searchInput.autofocus = true;
    this.searchInput.addEventListener('keydown', this.handleKeyDown);

    // Back Button (hidden by default)
    this.backButton = document.createElement('button');
    this.backButton.id = 'backBtn';
    this.backButton.className = 'btn btn-secondary me-2 d-none';
    this.backButton.innerHTML = '<i class="fas fa-arrow-left me-2"></i>Back to Search';
    this.backButton.addEventListener('click', this.handleBackClick);

    // Search Button
    const searchButton = document.createElement('button');
    searchButton.id = 'searchBtn';
    searchButton.className = 'btn btn-primary';
    searchButton.textContent = 'Search';
    searchButton.addEventListener('click', this.handleClick);

    // Button Group Container
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'd-flex justify-content-center mt-3';
    buttonGroup.appendChild(this.backButton);
    buttonGroup.appendChild(searchButton);

    searchContainer.appendChild(this.searchInput);
    searchContainer.appendChild(buttonGroup);

    return searchContainer;
  }

  showBackButton(show = true) {
    this.backButton.classList.toggle('d-none', !show);
    this.backButton.classList.toggle('d-inline-block', show);
  }
}