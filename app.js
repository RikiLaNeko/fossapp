window.onload = () => {
  // Liste des sections à charger dynamiquement
  const sections = [
    {id: 'section-navigateur', file: 'section-navigateur.html', type: 'hosted'},
    {id: 'section-moteurs', file: 'section-moteurs.html', type: 'hosted,selfhost'},
    {id: 'section-mail', file: 'section-mail.html', type: 'hosted,selfhost'},
    {id: 'section-android', file: 'section-android.html', type: 'hosted'},
    {id: 'section-cartes', file: 'section-cartes.html', type: 'hosted,selfhost'},
    {id: 'section-cloud', file: 'section-cloud.html', type: 'hosted,selfhost'},
    {id: 'section-ia', file: 'section-ia.html', type: 'selfhost'},
    {id: 'section-bureautique', file: 'section-bureautique.html', type: 'hosted,selfhost'},
    {id: 'section-multimedia', file: 'section-multimedia.html', type: 'hosted,selfhost'},
    {id: 'section-communication', file: 'section-communication.html', type: 'hosted,selfhost'},
    {id: 'section-os', file: 'section-os.html', type: 'selfhost'}
  ];
  let loaded = 0;
  sections.forEach(section => {
    const sectionDiv = document.getElementById(section.id);
    sectionDiv.setAttribute('data-type-section', section.type);
    fetch(section.file)
        .then(response => response.text())
        .then(html => {
          sectionDiv.innerHTML = html;
          loaded++;
          // Initialiser les interactions après le chargement de toutes les sections
          if (loaded === sections.length) {
            initFossappInteractions();
          }
        });
  });
  // Gestion des filtres
  document.getElementById('filter-all').onclick = () => setFilter('all');
  document.getElementById('filter-hosted').onclick = () => setFilter('hosted');
  document.getElementById('filter-selfhost').onclick = () => setFilter('selfhost');
  // Initialiser le reste de la page (hors sections dynamiques)
  initFossappInteractions();
  setFilter('all');
};

function initFossappInteractions() {
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
  if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'auto';
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
}

function setFilter(filter) {
  // Retirer la classe active de tous les boutons
  document.querySelectorAll('.nav-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
  // Ajouter la classe active au bouton sélectionné
  if (filter === 'all') {
    document.getElementById('filter-all').classList.add('active');
  } else if (filter === 'hosted') {
    document.getElementById('filter-hosted').classList.add('active');
  } else if (filter === 'selfhost') {
    document.getElementById('filter-selfhost').classList.add('active');
  }
  // Afficher/masquer les sections selon le filtre
  document.querySelectorAll('[data-type-section]').forEach(section => {
    if (filter === 'all') {
      section.style.display = '';
    } else {
      const types = section.getAttribute('data-type-section').split(',');
      if (types.includes(filter)) {
        section.style.display = '';
      } else {
        section.style.display = 'none';
      }
    }
  });
}

function clearAll() {
  document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.checked = false;
    localStorage.removeItem(box.dataset.key);
  });
}
