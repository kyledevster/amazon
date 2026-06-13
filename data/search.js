export function search() {
    const searchQuery = document.querySelector('.js-search-bar').value;
      if(searchQuery.trim()) {
        window.location.href = `./?search=${searchQuery.trim().replaceAll(' ', '+')}`;
      }
}