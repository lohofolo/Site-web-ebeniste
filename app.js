/**
 * KOUASSI ARMAND — MAÎTRE ÉBÉNISTE D'ART
 * Interactive Application, Dynamic Catalog & GSAP Animations Engine
 */

// Catalogue initial par défaut de l'artisan
const DEFAULT_WORKS = [
  {
    id: "1",
    title: "Table de Réception « San-Pédro »",
    category: "tables",
    badge: "PIÈCE SIGNÉE N°01",
    img: "assets/table-iroko-walnut.jpg",
    essences: "Iroko Massif & Noyer",
    materials: "Laiton Brossé",
    dimensions: "300 × 110 × 75 cm",
    desc: "Plateau monolithique à chants naturels (live-edge), papillons de renfort sculptés en bois contrasté et filets géométriques en laiton massif poli.",
    specs: "• Dimensions : 300 × 110 × 75 cm (Assise pour 10 à 12 convives)<br>• Poids brut : ~145 kg de bois massif noble<br>• Finition : Huile biosourcée d'ébénisterie mate au toucher satiné<br>• Piètement : Chêne massif foncé à tenons traversants chevillés"
  },
  {
    id: "2",
    title: "Enfilade « Solstice »",
    category: "rangements",
    badge: "CRÉATION SUR-MESURE",
    img: "assets/credenza-ebene-noble.jpg",
    essences: "Ébène du Gabon & Chêne",
    materials: "Poignées Bronze Coulé",
    dimensions: "240 × 55 × 78 cm",
    desc: "Courbes douces enveloppantes, portes battantes à cannelures façonnées à la gouge et rétro-éclairage chaud intégré dissimulé sous la traverse.",
    specs: "• Dimensions : 240 × 55 × 78 cm<br>• Aménagement intérieur : 3 compartiments avec étagères réglables en noyer<br>• Assemblages : Embrèvements invisibles et queues d'aronde anglaises<br>• Temps de fabrication : 180 heures d'atelier"
  },
  {
    id: "3",
    title: "Fauteuil Architectural « Kôh »",
    category: "assises",
    badge: "ÉDITION LIMITÉE",
    img: "assets/fauteuil-sculptural.jpg",
    essences: "Iroko Sculpté & Cintré",
    materials: "Cuir Pleine Fleur Cognac",
    dimensions: "88 × 82 × 76 cm",
    desc: "Structure fluide sculptée d'un seul tenant, inspirée de l'architecture moderniste et de l'art statutaire ouest-africain. Confort enveloppant.",
    specs: "• Dimensions : 88 × 82 × 76 cm (Hauteur d'assise : 42 cm)<br>• Sellerie : Cuir pleine fleur tannage végétal, garnissage haute résilience<br>• Finition bois : Cire d'abeille artisanale appliquée à chaud<br>• Signature gravée et certificat d'authenticité"
  },
  {
    id: "4",
    title: "Secret de Tiroir & Queues d'Aronde",
    category: "details",
    badge: "SAVOIR-FAIRE D'ÉLITE",
    img: "assets/assemblage-bois-detail.jpg",
    essences: "Chêne Fumé & Wengé",
    materials: "Finition Cire d'Abeille",
    dimensions: "Tolérance < 0.1 mm",
    desc: "Démonstration de précision d'ébénisterie d'art. Assemblages traditionnels taillés à la scie japonaise et au bédane pour une longévité séculaire.",
    specs: "• Tolérance d'usinage : < 0.08 mm<br>• Assemblage : Queues d'aronde recouvertes à la scie à dos fine<br>• Protection : Huile de tung pure et cire naturelle<br>• Durabilité estimée : Plus d'un siècle"
  }
];

const STORAGE_KEY = 'kouassi_artisan_works_v2';

// État global de l'application
let currentWorks = [];
let currentFilter = 'all';
let isAdminMode = false;
let itemPendingDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  initNavbarMorphing();
  initMobileDrawer();
  initWorksGallery();
  initArtisanAdminMode();
  initProjectEstimator();
  initContactForm();
  initCvModal();
  initGsapAnimations();
});

/* ==========================================================================
   0. GESTION DU STORAGE LOCAL (PERSISTANCE DU CATALOGUE)
   ========================================================================== */
function initStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      currentWorks = JSON.parse(saved);
      if (!Array.isArray(currentWorks) || currentWorks.length === 0) {
        currentWorks = JSON.parse(JSON.stringify(DEFAULT_WORKS));
        saveWorks();
      }
    } else {
      currentWorks = JSON.parse(JSON.stringify(DEFAULT_WORKS));
      saveWorks();
    }
  } catch (err) {
    console.error("Erreur de chargement du catalogue:", err);
    currentWorks = JSON.parse(JSON.stringify(DEFAULT_WORKS));
  }
  updateWorksCount();
}

function saveWorks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentWorks));
    updateWorksCount();
  } catch (err) {
    console.error("Erreur de sauvegarde locale:", err);
  }
}

function updateWorksCount() {
  const badge = document.getElementById('worksCountBadge');
  if (badge) {
    badge.textContent = `${currentWorks.length} œuvre${currentWorks.length > 1 ? 's' : ''} au catalogue`;
  }
}

/* ==========================================================================
   1. NAVBAR MORPHING & SCROLL BEHAVIOR
   ========================================================================== */
function initNavbarMorphing() {
  const navbarPill = document.getElementById('navbarPill');
  if (!navbarPill) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbarPill.classList.add('scrolled');
    } else {
      navbarPill.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   2. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');
  const drawerLinks = document.querySelectorAll('.drawer-link');
  const btnMobileCv = document.getElementById('btnMobileCv');
  const btnDrawerAdmin = document.getElementById('btnDrawerAdmin');

  if (!drawer || !backdrop) return;

  const openDrawer = () => {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  if (btnDrawerAdmin) {
    btnDrawerAdmin.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
      const worksSection = document.getElementById('works');
      if (worksSection) worksSection.scrollIntoView({ behavior: 'smooth' });
      enableAdminMode();
    });
  }

  if (btnMobileCv) {
    btnMobileCv.addEventListener('click', () => {
      closeDrawer();
      const cvBackdrop = document.getElementById('cvModalBackdrop');
      if (cvBackdrop) {
        cvBackdrop.classList.add('open');
        cvBackdrop.setAttribute('aria-hidden', 'false');
      }
    });
  }
}

/* ==========================================================================
   3. GSAP 3 ANIMATIONS ENGINE
   ========================================================================== */
function initGsapAnimations() {
  const hasGsap = typeof gsap !== 'undefined';
  const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

  if (!hasGsap) {
    // Fallback gracieux
    document.querySelectorAll('.skill-meter-card').forEach(card => {
      const percent = parseInt(card.dataset.percent, 10) || 90;
      const gaugeBar = card.querySelector('.gauge-bar');
      const counter = card.querySelector('.counter-num');
      if (gaugeBar) {
        const offset = 314 * (1 - percent / 100);
        gaugeBar.style.strokeDashoffset = offset;
      }
      if (counter) counter.textContent = percent;
    });
    return;
  }

  if (hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // A. Hero Stagger Entrance
  const heroElements = document.querySelectorAll('.gsap-hero-el');
  if (heroElements.length) {
    gsap.from(heroElements, {
      opacity: 0,
      y: 35,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.12,
      clearProps: 'transform'
    });
  }

  // B. Section Title Reveals
  if (hasScrollTrigger) {
    document.querySelectorAll('.gsap-section-title').forEach(title => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 85%'
        },
        opacity: 0,
        y: 25,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // C. About Column Reveal
    const aboutCols = document.querySelectorAll('.gsap-about-reveal');
    if (aboutCols.length) {
      gsap.from(aboutCols, {
        scrollTrigger: {
          trigger: '#about',
          start: 'top 75%'
        },
        opacity: 0,
        y: 35,
        duration: 0.9,
        stagger: 0.2,
        ease: 'power3.out'
      });
    }

    // D. Timeline Cards Slide-In
    const timelineCards = document.querySelectorAll('.gsap-timeline-card');
    timelineCards.forEach(card => {
      const isLeft = card.classList.contains('timeline-left');
      const xOffset = window.innerWidth > 768 ? (isLeft ? -40 : 40) : -25;

      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%'
        },
        opacity: 0,
        x: xOffset,
        y: 20,
        duration: 0.9,
        ease: 'power3.out'
      });
    });

    // E. Skills Gauges & Counters Animation
    document.querySelectorAll('.skill-meter-card').forEach(card => {
      const targetPercent = parseInt(card.dataset.percent, 10) || 90;
      const gaugeBar = card.querySelector('.gauge-bar');
      const counterNum = card.querySelector('.counter-num');

      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (gaugeBar) {
            const offset = 314 * (1 - targetPercent / 100);
            gaugeBar.style.strokeDashoffset = offset;
          }
          if (counterNum) {
            const obj = { val: 0 };
            gsap.to(obj, {
              val: targetPercent,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                counterNum.textContent = Math.round(obj.val);
              }
            });
          }
        }
      });
    });

    // F. Wood Species Cards Reveal
    const woodCards = document.querySelectorAll('.gsap-wood-card');
    if (woodCards.length) {
      gsap.from(woodCards, {
        scrollTrigger: {
          trigger: '#wood-species',
          start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    // G. Education Cards Reveal
    const eduCards = document.querySelectorAll('.gsap-edu-card');
    if (eduCards.length) {
      gsap.from(eduCards, {
        scrollTrigger: {
          trigger: '#education',
          start: 'top 80%'
        },
        opacity: 0,
        y: 30,
        stagger: 0.14,
        duration: 0.8,
        ease: 'power3.out'
      });
    }

    // H. Contact Reveal
    const contactCols = document.querySelectorAll('.gsap-contact-reveal');
    if (contactCols.length) {
      gsap.from(contactCols, {
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 80%'
        },
        opacity: 0,
        y: 35,
        stagger: 0.18,
        duration: 0.85,
        ease: 'power3.out'
      });
    }
  }
}

/* ==========================================================================
   4. RENDU DYNAMIQUE DE LA GALERIE DES CRÉATIONS
   ========================================================================== */
function renderWorksGrid() {
  const container = document.getElementById('worksGrid');
  if (!container) return;

  const filtered = currentWorks.filter(item => {
    if (currentFilter === 'all') return true;
    return item.category === currentFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-12 px-6 bg-surface rounded-2xl border border-border w-full" style="grid-column: 1 / -1; padding: 3rem 1.5rem;">
        <i data-lucide="package-open" class="text-gold text-4xl mx-auto mb-3" style="width: 2.5rem; height: 2.5rem; margin: 0 auto 1rem;"></i>
        <h3 class="text-xl font-bold text-cream mb-2">Aucune pièce dans cette catégorie</h3>
        <p class="text-sm text-muted max-w-md mx-auto mb-4">
          Vous n'avez pas encore publié de création dans ce rayon d'atelier.
        </p>
        <button type="button" class="btn-magnetic btn-gold btn-sm" onclick="document.getElementById('btnOpenAddModal').click()">
          <i data-lucide="plus-circle"></i>
          <span>Ajouter une création</span>
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = filtered.map(item => `
    <article class="work-card gsap-card" data-category="${escapeHtml(item.category)}" data-id="${escapeHtml(item.id)}">
      <div class="work-media">
        <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.title)}" class="work-img" loading="lazy">
        
        <!-- Overlay Inspect Lightbox -->
        <div class="work-overlay">
          <button type="button" class="btn-inspect-work" data-id="${escapeHtml(item.id)}" aria-label="Voir la pièce en grand">
            <i data-lucide="maximize-2"></i>
          </button>
        </div>

        <!-- Badge de statut -->
        <span class="work-badge font-mono">${escapeHtml(item.badge || 'PIÈCE SIGNÉE')}</span>

        <!-- Bouton Supprimer en Mode Admin -->
        ${isAdminMode ? `
          <div class="work-admin-overlay">
            <button type="button" class="btn-delete-work" data-id="${escapeHtml(item.id)}" title="Supprimer définitivement ce meuble du catalogue">
              <i data-lucide="trash-2"></i>
              <span>Supprimer</span>
            </button>
          </div>
        ` : ''}
      </div>

      <div class="work-info">
        <div class="work-tags">
          <span class="tag-essence font-mono">${escapeHtml(item.essences)}</span>
          ${item.materials ? `<span class="tag-material font-mono">${escapeHtml(item.materials)}</span>` : ''}
        </div>
        <h3 class="work-title">${escapeHtml(item.title)}</h3>
        <p class="work-desc">${escapeHtml(item.desc)}</p>
        <div class="work-footer">
          <span class="font-mono text-xs text-gold">${escapeHtml(item.dimensions || 'Sur-mesure')}</span>
          <button type="button" class="link-details text-gold" data-id="${escapeHtml(item.id)}">
            Détails <i data-lucide="arrow-right"></i>
          </button>
        </div>
      </div>
    </article>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
  attachCardEvents();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function attachCardEvents() {
  // Clic sur inspect ou lien détails -> Modale Lightbox
  document.querySelectorAll('.btn-inspect-work, .link-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      openWorkModal(id);
    });
  });

  // Clic sur supprimer -> Modale de confirmation
  document.querySelectorAll('.btn-delete-work').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      promptDeleteWork(id);
    });
  });
}

/* ==========================================================================
   5. FILTRES DE LA GALERIE & MODALE LIGHTBOX
   ========================================================================== */
function initWorksGallery() {
  const filterBtns = document.querySelectorAll('#worksFilters .filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderWorksGrid();
    });
  });

  // Initial render
  renderWorksGrid();

  // Modale Lightbox
  const modalBackdrop = document.getElementById('workModalBackdrop');
  const closeBtn = document.getElementById('btnWorkModalClose');
  const btnModalOrder = document.getElementById('btnModalOrder');

  if (closeBtn) closeBtn.addEventListener('click', closeWorkModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeWorkModal();
    });
  }
  if (btnModalOrder) {
    btnModalOrder.addEventListener('click', closeWorkModal);
  }
}

function openWorkModal(id) {
  const modalBackdrop = document.getElementById('workModalBackdrop');
  const modalImg = document.getElementById('modalWorkImg');
  const modalBadge = document.getElementById('modalWorkBadge');
  const modalTitle = document.getElementById('modalWorkTitle');
  const modalMaterials = document.getElementById('modalWorkMaterials');
  const modalDesc = document.getElementById('modalWorkDesc');
  const modalSpecs = document.getElementById('modalWorkSpecs');

  const item = currentWorks.find(w => String(w.id) === String(id));
  if (!item || !modalBackdrop) return;

  modalImg.src = item.img;
  modalImg.alt = item.title;
  modalBadge.textContent = item.badge || 'PIÈCE SIGNÉE';
  modalTitle.textContent = item.title;
  modalMaterials.textContent = `${item.essences} • ${item.materials || ''}`;
  modalDesc.textContent = item.desc;
  modalSpecs.innerHTML = item.specs || `• Dimensions : ${item.dimensions || 'Sur-mesure'}<br>• Essences nobles : ${item.essences}`;

  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeWorkModal() {
  const modalBackdrop = document.getElementById('workModalBackdrop');
  if (!modalBackdrop) return;
  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ==========================================================================
   6. ESPACE ARTISAN : AJOUT & SUPPRESSION DE MEUBLES
   ========================================================================== */
function initArtisanAdminMode() {
  const adminCheckbox = document.getElementById('adminModeCheckbox');
  const statusLabel = document.getElementById('adminModeStatusLabel');
  const actionsGroup = document.getElementById('adminActionsGroup');
  const adminBar = document.getElementById('artisanAdminBar');
  const btnNavAdmin = document.getElementById('btnNavAdmin');
  const btnReset = document.getElementById('btnResetDefaultWorks');

  const toggleAdmin = (enabled) => {
    isAdminMode = enabled;
    if (adminCheckbox) adminCheckbox.checked = enabled;

    if (enabled) {
      if (statusLabel) statusLabel.textContent = "MODE GESTION ATELIER (ACTIF)";
      if (actionsGroup) actionsGroup.classList.remove('hidden');
      if (adminBar) adminBar.classList.add('active-mode');
      if (btnNavAdmin) btnNavAdmin.classList.add('active');
      showToast("Mode Gestion Activé", "Vous pouvez maintenant ajouter ou supprimer des meubles.", "sliders");
    } else {
      if (statusLabel) statusLabel.textContent = "MODE VISITEUR";
      if (actionsGroup) actionsGroup.classList.add('hidden');
      if (adminBar) adminBar.classList.remove('active-mode');
      if (btnNavAdmin) btnNavAdmin.classList.remove('active');
    }

    renderWorksGrid();
  };

  if (adminCheckbox) {
    adminCheckbox.addEventListener('change', (e) => {
      toggleAdmin(e.target.checked);
    });
  }

  if (btnNavAdmin) {
    btnNavAdmin.addEventListener('click', () => {
      const worksSection = document.getElementById('works');
      if (worksSection) worksSection.scrollIntoView({ behavior: 'smooth' });
      toggleAdmin(!isAdminMode);
    });
  }

  // Réinitialiser les meubles par défaut
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm("Voulez-vous restaurer les 4 créations originales de l'Atelier Kouassi ?")) {
        currentWorks = JSON.parse(JSON.stringify(DEFAULT_WORKS));
        saveWorks();
        renderWorksGrid();
        showToast("Catalogue Réinitialisé", "Les créations phares originales sont restaurées.", "rotate-ccw");
      }
    });
  }

  initAddWorkModal();
  initDeleteConfirmModal();
}

function enableAdminMode() {
  const adminCheckbox = document.getElementById('adminModeCheckbox');
  if (adminCheckbox && !adminCheckbox.checked) {
    adminCheckbox.checked = true;
    adminCheckbox.dispatchEvent(new Event('change'));
  }
}

/* Modale d'Ajout */
function initAddWorkModal() {
  const modalBackdrop = document.getElementById('addWorkModalBackdrop');
  const btnOpen = document.getElementById('btnOpenAddModal');
  const btnClose = document.getElementById('btnAddModalClose');
  const btnCancel = document.getElementById('btnCancelAdd');
  const form = document.getElementById('addWorkForm');
  const fileInput = document.getElementById('newWorkFileInput');
  const previewImg = document.getElementById('imagePreviewImg');
  const finalImageInput = document.getElementById('newWorkFinalImage');
  const presetChips = document.querySelectorAll('.preset-chip');

  const openModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Gestion de l'upload de photo locale (Téléphone ou PC)
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          if (previewImg) previewImg.src = dataUrl;
          if (finalImageInput) finalImageInput.value = dataUrl;
          presetChips.forEach(c => c.classList.remove('active'));
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Choix rapide des clichés d'atelier
  presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      presetChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const src = chip.dataset.src;
      if (previewImg) previewImg.src = src;
      if (finalImageInput) finalImageInput.value = src;
      if (fileInput) fileInput.value = '';
    });
  });

  // Soumission du formulaire d'ajout
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('newWorkTitle').value.trim();
      const category = document.getElementById('newWorkCategory').value;
      const essences = document.getElementById('newWorkEssences').value.trim();
      const materials = document.getElementById('newWorkMaterials').value.trim();
      const dimensions = document.getElementById('newWorkDimensions').value.trim();
      const badge = document.getElementById('newWorkBadge').value;
      const desc = document.getElementById('newWorkDesc').value.trim();
      const img = finalImageInput ? finalImageInput.value : 'assets/table-iroko-walnut.jpg';

      if (!title || !essences || !desc) {
        alert("Veuillez renseigner les champs obligatoires (Titre, Essences, Description).");
        return;
      }

      const newId = "work_" + Date.now();
      const newItem = {
        id: newId,
        title,
        category,
        badge: badge || "PIÈCE UNIQUE",
        img,
        essences,
        materials: materials || "Laiton d'atelier",
        dimensions: dimensions || "Sur-mesure",
        desc,
        specs: `• Dimensions : ${dimensions || 'Sur-mesure'}<br>• Essences : ${essences}<br>• Matériaux d'exception : ${materials || 'Bois noble certifié'}<br>• Assemblage d'artisanat d'art sans vis métallique`
      };

      currentWorks.unshift(newItem);
      saveWorks();
      renderWorksGrid();
      closeModal();
      form.reset();

      // Réinitialise l'image par défaut
      if (previewImg) previewImg.src = 'assets/table-iroko-walnut.jpg';
      if (finalImageInput) finalImageInput.value = 'assets/table-iroko-walnut.jpg';
      presetChips.forEach((c, idx) => c.classList.toggle('active', idx === 0));

      showToast("Création Ajoutée !", `La pièce « ${title} » a été publiée dans votre galerie.`, "check-circle-2");
    });
  }
}

/* Modale de Confirmation de Suppression */
function initDeleteConfirmModal() {
  const modalBackdrop = document.getElementById('confirmDeleteModalBackdrop');
  const btnConfirm = document.getElementById('btnConfirmDelete');
  const btnCancel = document.getElementById('btnCancelDelete');

  const closeModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    itemPendingDeleteId = null;
    document.body.style.overflow = '';
  };

  if (btnCancel) btnCancel.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  if (btnConfirm) {
    btnConfirm.addEventListener('click', () => {
      if (!itemPendingDeleteId) return;

      const deletedItem = currentWorks.find(w => String(w.id) === String(itemPendingDeleteId));
      const deletedTitle = deletedItem ? deletedItem.title : "La pièce";

      currentWorks = currentWorks.filter(w => String(w.id) !== String(itemPendingDeleteId));
      saveWorks();
      renderWorksGrid();
      closeModal();

      showToast("Meuble Supprimé", `« ${deletedTitle} » a été retiré du catalogue.`, "trash-2");
    });
  }
}

function promptDeleteWork(id) {
  const item = currentWorks.find(w => String(w.id) === String(id));
  if (!item) return;

  itemPendingDeleteId = id;
  const modalBackdrop = document.getElementById('confirmDeleteModalBackdrop');
  const targetTitle = document.getElementById('deleteTargetTitle');
  const targetImg = document.getElementById('deleteTargetImg');

  if (targetTitle) targetTitle.textContent = `« ${item.title} »`;
  if (targetImg) {
    targetImg.src = item.img;
    targetImg.alt = item.title;
  }

  if (modalBackdrop) {
    modalBackdrop.classList.add('open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
}

/* Toast Notifications */
let toastTimeout = null;
function showToast(title, desc, iconName = 'check-circle-2') {
  const toast = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  const toastIcon = document.getElementById('toastIcon');

  if (!toast) return;

  if (toastTitle) toastTitle.textContent = title;
  if (toastDesc) toastDesc.textContent = desc;
  if (toastIcon) toastIcon.innerHTML = `<i data-lucide="${iconName}"></i>`;

  if (window.lucide) window.lucide.createIcons();

  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   7. ESTIMATEUR DE PROJET INTERACTIF (DEVIS EXPRESS)
   ========================================================================== */
function initProjectEstimator() {
  const furnitureBtns = document.querySelectorAll('#furnitureTypeOptions .opt-btn');
  const woodBtns = document.querySelectorAll('#woodTypeOptions .opt-btn');
  const finishCheckboxes = document.querySelectorAll('#finishOptions input[type="checkbox"]');
  const estimateAmountEl = document.getElementById('estimateAmount');
  const estimateAmountCfaEl = document.getElementById('estimateAmountCFA');
  const btnSendWhatsapp = document.getElementById('btnSendEstimateWhatsapp');

  let basePrice = 1800;
  let multiplier = 1.0;
  let selectedFurnitureName = "Table de Repas / Banquet";
  let selectedWoodName = "Iroko Massif Ivoire";

  const calculateEstimate = () => {
    let finishesCost = 0;
    finishCheckboxes.forEach(cb => {
      if (cb.checked) {
        finishesCost += parseFloat(cb.value) || 0;
      }
    });

    const totalEur = Math.round((basePrice * multiplier) + finishesCost);
    const totalCfa = Math.round(totalEur * 655.957);

    if (estimateAmountEl) {
      estimateAmountEl.textContent = new Intl.NumberFormat('fr-FR').format(totalEur) + ' €';
    }
    if (estimateAmountCfaEl) {
      estimateAmountCfaEl.textContent = `~ ${new Intl.NumberFormat('fr-FR').format(totalCfa)} FCFA`;
    }
  };

  furnitureBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      furnitureBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      basePrice = parseFloat(btn.dataset.base) || 1800;
      selectedFurnitureName = btn.textContent.trim();
      calculateEstimate();
    });
  });

  woodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      woodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      multiplier = parseFloat(btn.dataset.multiplier) || 1.0;
      selectedWoodName = btn.textContent.trim();
      calculateEstimate();
    });
  });

  finishCheckboxes.forEach(cb => {
    cb.addEventListener('change', calculateEstimate);
  });

  calculateEstimate();

  if (btnSendWhatsapp) {
    btnSendWhatsapp.addEventListener('click', () => {
      let activeFinishes = [];
      finishCheckboxes.forEach(cb => {
        if (cb.checked) {
          activeFinishes.push(cb.closest('label').querySelector('span').textContent.trim());
        }
      });

      const eurPrice = estimateAmountEl ? estimateAmountEl.textContent : '';
      const cfaPrice = estimateAmountCfaEl ? estimateAmountCfaEl.textContent : '';

      const message = `Bonjour Maître Ébéniste Kouassi Armand,\n\nJe viens de configurer un projet sur votre site web :\n- Pièce : ${selectedFurnitureName}\n- Essence : ${selectedWoodName}\n- Finitions : ${activeFinishes.join(', ') || 'Standard'}\n- Estimation indicative : ${eurPrice} (${cfaPrice})\n\nJe souhaite échanger avec vous pour affiner ce projet sur-mesure. Merci !`;

      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/2250789451200?text=${encodedMsg}`, '_blank');
    });
  }
}

/* ==========================================================================
   8. CONTACT FORM VALIDATION & INTERACTIVITY
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const submitBtn = document.getElementById('btnSubmitForm');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();
    const nature = document.getElementById('projectNature').value;
    const message = document.getElementById('userMessage').value.trim();

    if (!name || !email || !message) {
      alert("Veuillez renseigner les champs obligatoires (Nom, Email, Message).");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Envoi en cours...</span>`;
    }

    setTimeout(() => {
      if (feedback) feedback.classList.remove('hidden');
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i data-lucide="check"></i><span>Message Transmis !</span>`;
        if (window.lucide) window.lucide.createIcons();
      }

      showToast("Demande Transmise", "Kouassi Armand vous répondra sous 24h.", "mail");
    }, 600);
  });
}

/* ==========================================================================
   9. CV & DOSSIER MODAL
   ========================================================================== */
function initCvModal() {
  const cvModalBackdrop = document.getElementById('cvModalBackdrop');
  const btnOpen = document.getElementById('btnOpenCvModal');
  const btnClose = document.getElementById('btnCvModalClose');
  const btnPrint = document.getElementById('btnPrintCv');

  if (!cvModalBackdrop) return;

  const openCvModal = () => {
    cvModalBackdrop.classList.add('open');
    cvModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeCvModal = () => {
    cvModalBackdrop.classList.remove('open');
    cvModalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (btnOpen) btnOpen.addEventListener('click', openCvModal);
  if (btnClose) btnClose.addEventListener('click', closeCvModal);

  cvModalBackdrop.addEventListener('click', (e) => {
    if (e.target === cvModalBackdrop) closeCvModal();
  });

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCvModal();
      closeWorkModal();
      const addModal = document.getElementById('addWorkModalBackdrop');
      if (addModal) addModal.classList.remove('open');
      const delModal = document.getElementById('confirmDeleteModalBackdrop');
      if (delModal) delModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}
