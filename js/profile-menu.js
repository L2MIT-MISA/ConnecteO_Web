// profile-menu.js
const toggle = document.getElementById('profileToggle');
const dropdown = document.getElementById('profileDropdown');

toggle.addEventListener('click', (e) => {
  e.stopPropagation();
  dropdown.classList.toggle('open');
});

// Ferme le menu si on clique ailleurs sur la page
document.addEventListener('click', () => {
  dropdown.classList.remove('open');
});