# 🪵 Atelier Kouassi Armand — Ébénisterie d'Art & Mobilier Contemporain

> Site web vitrine haute-fidélité, cinématographique et mobile-responsive pour maître artisan ébéniste, avec interface de gestion dynamique du catalogue (ajout et suppression de mobilier).

---

## ✨ Points Forts & Direction Artistique

- **Direction Visuelle — Preset B « Nocturne Prestige »** :
  - Palette sombre luxueuse : Charbon (`#0F0F13`), Or chaud impérial (`#D4A843`), Crème (`#F5F3EE`) et Ardoise (`#1E1E26`).
  - Typographie éditoriale : *Inter* (titres & UI), *Playfair Display* (dramatique italique éditorial) et *JetBrains Mono* (statistiques & jauges).
  - Texture feutrée : Overlay de bruit CSS inline `<feTurbulence>` (opacité 0.05) et conteneurs adoucis (`rounded-[2rem]` à `rounded-[3rem]`).

- **Identité de l'Artisan** :
  - **Kouassi Armand**, maître artisan ébéniste ivoirien d'exception sublimant les essences précieuses d'Afrique de l'Ouest (Iroko, Ébène de Côte d'Ivoire, Fraké) et d'Europe (Noyer français, Chêne massif).
  - Clichés photographiques haute définition intégrés (portrait d'atelier, table banquet en Iroko & laiton, enfilade en ébène cannelée, fauteuil sculptural, assemblages en queues d'aronde).

- **Espace Artisan & Gestion du Catalogue** :
  - Bascule en 1 clic vers le **Mode Gestion Atelier**.
  - **Ajout de meubles** : formulaire avec téléversement de photos directes (ordinateur ou smartphone via l'API `FileReader`), sélection de catégories, essences, dimensions et descriptif.
  - **Suppression sécurisée** : modale de confirmation avec miniature et titre de la pièce.
  - **Persistance locale (`localStorage`)** : toutes les modifications restent sauvegardées automatiquement.
  - Bouton de **réinitialisation** pour retrouver les pièces d'origine à tout moment.

- **Fonctionnalités Interactives** :
  - **Simulateur de Devis Express** : calcul instantané en EUR (€) et FCFA, génération d'un message pré-rempli pour WhatsApp direct (`+225 07 89 45 12 00`).
  - **Galerie Filtrable & Lightbox** : fiches techniques détaillées de chaque œuvre.
  - **Tableau de Bord des Compétences** : jauges circulaires SVG animées avec compteurs en temps réel (GSAP 3).
  - **Dossier CV & Brochure** : prévisualisation et impression optimisée.

---

## 🚀 Lancement en local

Ce projet est conçu en technologies web légères et ultra-performantes (HTML5, Vanilla CSS, JavaScript ES6+, GSAP 3).

### Avec Python (intégré nativement sur macOS) :
```bash
python3 -m http.server 8080
```
Ouvrez ensuite votre navigateur sur `http://localhost:8080/`.

---

## 📁 Architecture des Fichiers

```
site-ebeniste/
├── index.html        # Structure sémantique, SEO & modales
├── style.css         # Système de design Nocturne Prestige & responsive mobile
├── app.js            # Moteur JavaScript, GSAP, gestion catalogue & devis
├── assets/           # Photographies haute définition d'artisanat & mobilier
├── .gitignore        # Exclusions Git
└── README.md         # Documentation du projet
```

---

© 2026 Atelier Kouassi Armand. Tous droits réservés.
