import Alert from './Alert.js';

export default class SearchBar {
  constructor({ onSearch }) {
    this.onSearch = onSearch;
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

  render() {
    const searchContainer = document.createElement('div');
    
    this.searchInput = document.createElement('input');
    this.searchInput.type = 'text';
    this.searchInput.id = 'coin';
    this.searchInput.className = 'form-control w-50 mx-auto mb-3';
    this.searchInput.placeholder = 'Search for a coin';
    this.searchInput.autofocus = true;
    this.searchInput.addEventListener('keydown', this.handleKeyDown);
    
    const searchButton = document.createElement('button');
    searchButton.id = 'searchBtn';
    searchButton.className = 'btn btn-danger';
    searchButton.textContent = 'Search';
    searchButton.addEventListener('click', this.handleClick);
    
    searchContainer.appendChild(this.searchInput);
    searchContainer.appendChild(searchButton);
    
    return searchContainer;
  }
}