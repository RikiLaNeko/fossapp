window.onload = () => {
  // Liste des sections à charger dynamiquement
  const sections = [
    {id: 'section-navigateur', file: 'section-navigateur.html', type: 'hosted'},
    {id: 'section-moteurs', file: 'section-moteurs.html', type: 'hosted,selfhost'},
    {id: 'section-mail', file: 'section-mail.html', type: 'hosted'},
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
            setFilter('all'); // Afficher tout une fois que tout est chargé
          }
        });
  });
  // Gestion des filtres
  document.getElementById('filter-all').onclick = () => setFilter('all');
  document.getElementById('filter-hosted').onclick = () => setFilter('hosted');
  document.getElementById('filter-selfhost').onclick = () => setFilter('selfhost');
  // Initialiser le reste de la page (hors sections dynamiques)
  initIntroToggle();
};

// Gestion ouverture/fermeture de l'intro
function initIntroToggle() {
  const btn = document.querySelector('.intro-toggle');
  const content = document.getElementById('intro-content');
  if (!btn || !content) return;
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    content.style.display = expanded ? 'none' : 'block';
  });
}

function initFossappInteractions() {
  document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    const key = box.dataset.key;
    if (!key) return;
    box.checked = localStorage.getItem(key) === 'true';
    box.addEventListener('change', () => {
      localStorage.setItem(key, box.checked);
      updateProgressCounter();
    });
  });
  updateProgressCounter();

  // Gestion des liens info (affichage des explications en bas)
  document.querySelectorAll('.info-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const infoId = this.dataset.info + '-info';
      document.querySelectorAll('.info-popup').forEach(p => animatePopup(p, false));
      const popup = document.getElementById(infoId);
      if (popup) {
        animatePopup(popup, true); // suppression de l'auto-fermeture
        popup.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Focus pour accessibilité
        //setTimeout(() => { popup.focus && popup.focus(); }, 250);
      }
    });
  });

  // Fermer la popup
  document.querySelectorAll('.info-popup .close').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      animatePopup(this.parentElement, false);
    });
  });

  // Accessibilité clavier pour popup (Échap)
  document.querySelectorAll('.info-popup').forEach(popup => {
    popup.setAttribute('tabindex', '-1');
    popup.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        animatePopup(popup, false);
      }
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
  // Filtrage par item (li)
  document.querySelectorAll('[data-type-section]').forEach(section => {
    // Afficher la section par défaut
    section.style.display = '';
    // Filtrer les items à l'intérieur
    section.querySelectorAll('li').forEach(li => {
      const type = li.getAttribute('data-type');
      if (!type || filter === 'all') {
        li.style.display = '';
      } else if (type.split(',').includes(filter)) {
        li.style.display = '';
      } else {
        li.style.display = 'none';
      }
    });
    // Masquer la section si aucun item visible
    const hasVisible = Array.from(section.querySelectorAll('li')).some(li => li.style.display !== 'none');
    section.style.display = hasVisible ? '' : 'none';
  });
}

function clearAll() {
  document.querySelectorAll('input[type="checkbox"]').forEach(box => {
    box.checked = false;
    localStorage.removeItem(box.dataset.key);
  });
}

function updateProgressCounter() {
  const allBoxes = document.querySelectorAll('input[type="checkbox"][data-key]');
  const checked = Array.from(allBoxes).filter(box => box.checked).length;
  const total = allBoxes.length;
  const counter = document.getElementById('progress-counter');
  if (counter) counter.textContent = `${checked} / ${total} alternatives cochées`;
}

function filterAlternativesBySearch(query) {
  const q = query.trim().toLowerCase();
  document.querySelectorAll('[data-type-section]').forEach(section => {
    let sectionVisible = false;
    section.querySelectorAll('li').forEach(li => {
      const text = li.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        li.style.display = '';
        sectionVisible = true;
      } else {
        li.style.display = 'none';
      }
    });
    section.style.display = sectionVisible ? '' : 'none';
  });
}

function exportChecklist() {
  const allBoxes = document.querySelectorAll('input[type="checkbox"][data-key]');
  const data = {};
  allBoxes.forEach(box => {
    data[box.dataset.key] = box.checked;
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fossapp-checklist.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importChecklist(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      document.querySelectorAll('input[type="checkbox"][data-key]').forEach(box => {
        if (data.hasOwnProperty(box.dataset.key)) {
          box.checked = !!data[box.dataset.key];
          localStorage.setItem(box.dataset.key, box.checked);
        }
      });
      updateProgressCounter();
    } catch (err) {
      alert('Fichier invalide.');
    }
  };
  reader.readAsText(file);
}

// Ajout d'animation pour les popups
function animatePopup(popup, show) {
  if (!popup) return;
  if (show) {
    popup.style.display = 'block';
    popup.classList.add('popup-fade-in');
    popup.classList.remove('popup-fade-out');
    // Suppression TOTALE de toute gestion d'auto-fermeture
    if (typeof popup._autoCloseTimeout !== 'undefined') {
      clearTimeout(popup._autoCloseTimeout);
      popup._autoCloseTimeout = undefined;
    }
  } else {
    popup.classList.remove('popup-fade-in');
    popup.classList.add('popup-fade-out');
    if (typeof popup._autoCloseTimeout !== 'undefined') {
      clearTimeout(popup._autoCloseTimeout);
      popup._autoCloseTimeout = undefined;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // Recherche rapide
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      filterAlternativesBySearch(e.target.value);
    });
  }
  // Export
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportChecklist);
  }
  // Import
  const importBtn = document.getElementById('import-btn');
  const importFile = document.getElementById('import-file');
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', e => {
      if (e.target.files.length > 0) {
        importChecklist(e.target.files[0]);
      }
    });
  }
});

// Ajouter un champ de note personnelle à chaque alternative
function addNotesToAlternatives() {
  document.querySelectorAll('input[type="checkbox"][data-key]').forEach(box => {
    const key = box.dataset.key;
    if (!key) return;
    const li = box.closest('li');
    if (!li || li.querySelector('.note-btn')) return; // déjà ajouté
    // Créer le bouton note
    const noteBtn = document.createElement('button');
    noteBtn.type = 'button';
    noteBtn.className = 'note-btn';
    noteBtn.title = 'Ajouter une note';
    noteBtn.textContent = '📝';
    noteBtn.style.marginLeft = '0.5em';
    // Créer le champ note caché
    const noteInput = document.createElement('textarea');
    noteInput.className = 'note-input';
    noteInput.rows = 2;
    noteInput.placeholder = 'Ta note...';
    noteInput.style.display = 'none';
    noteInput.style.marginLeft = '2em';
    noteInput.style.width = '90%';
    noteInput.value = localStorage.getItem('note-' + key) || '';
    // Afficher/masquer le champ note
    noteBtn.onclick = () => {
      noteInput.style.display = noteInput.style.display === 'none' ? 'block' : 'none';
      if (noteInput.style.display === 'block') noteInput.focus();
    };
    // Sauvegarder la note
    noteInput.oninput = () => {
      localStorage.setItem('note-' + key, noteInput.value);
    };
    // Ajouter au DOM
    li.appendChild(noteBtn);
    li.appendChild(noteInput);
  });
}
