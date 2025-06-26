window.onload = () => {
  document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    const key = box.dataset.key;
    if (!key) return;
    box.checked = localStorage.getItem(key) === 'true';
    box.addEventListener('change', () => {
      localStorage.setItem(key, box.checked);
    });
  });

  // Gestion des liens info (affichage des explications en bas)
  document.querySelectorAll('.info-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const infoId = this.dataset.info + '-info';
      document.querySelectorAll('.info-popup').forEach(p => p.style.display = 'none');
      const popup = document.getElementById(infoId);
      if (popup) {
        popup.style.display = 'block';
        popup.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Fermer la popup
  document.querySelectorAll('.info-popup .close').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      this.parentElement.style.display = 'none';
    });
  });

  // Gestion du basculement de thème
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'auto';

  // Appliquer le thème sauvegardé
  if (currentTheme !== 'auto') {
    document.documentElement.style.colorScheme = currentTheme;
  }

  themeToggle.addEventListener('click', () => {
    const currentScheme = document.documentElement.style.colorScheme;
    let newScheme;

    if (currentScheme === 'dark') {
      newScheme = 'light';
      themeToggle.textContent = '☀️';
    } else if (currentScheme === 'light') {
      newScheme = 'auto';
      themeToggle.textContent = '🌓';
    } else {
      newScheme = 'dark';
      themeToggle.textContent = '🌙';
    }

    document.documentElement.style.colorScheme = newScheme;
    localStorage.setItem('theme', newScheme);
  });

  // Définir l'icône initiale du bouton thème
  const scheme = document.documentElement.style.colorScheme || 'auto';
  if (scheme === 'dark') {
    themeToggle.textContent = '🌙';
  } else if (scheme === 'light') {
    themeToggle.textContent = '☀️';
  } else {
    themeToggle.textContent = '🌓';
  }

  // Navigation fluide
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
};

function clearAll() {
  document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.checked = false;
    localStorage.removeItem(box.dataset.key);
  });
}
