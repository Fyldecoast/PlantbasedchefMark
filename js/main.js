/*
  Static JS for: navigation, smooth scrolling, tabs, gallery lightbox, forms, and recipe modal.
  No dependencies.
*/

(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ---- Loading screen ----
  const loadingScreen = $('#loadingScreen');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.classList.add('opacity-0');
        loadingScreen.style.transition = 'opacity 400ms ease';
        setTimeout(() => loadingScreen.remove(), 450);
      }, 3000);
    });
  }

  // ---- Smooth scroll helpers ----
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // ---- Navigation (desktop + mobile) ----
  const nav = $('#nav');
  const mobileBtn = $('#mobileMenuBtn');
  const mobileMenu = $('#mobileMenu');

  const setNavScrolled = () => {
    if (!nav) return;
    const scrolled = window.scrollY > 50;
    nav.classList.toggle('bg-transparent', !scrolled);
    if (scrolled) {
      nav.classList.add('bg-background/80', 'backdrop-blur-md', 'border-b', 'border-border');
    } else {
      nav.classList.remove('bg-background/80', 'backdrop-blur-md', 'border-b', 'border-border');
    }
  };
  setNavScrolled();
  window.addEventListener('scroll', setNavScrolled, { passive: true });

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('block');
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
  };

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !isHidden);
      mobileMenu.classList.toggle('block', isHidden);
      mobileBtn.setAttribute('aria-expanded', String(isHidden));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target) return;
      const clickedInside = mobileMenu.contains(target) || mobileBtn.contains(target);
      if (!clickedInside) closeMobileMenu();
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  // Nav buttons
  // Any element with data-scroll will smooth-scroll
  $$('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-scroll');
      if (id) scrollToId(id);
      closeMobileMenu();
    });
  });

  // ---- Hero CTA ----
  const heroBook = $('#heroBook');
  if (heroBook) heroBook.addEventListener('click', () => scrollToId('contact'));

  // ---- Menu tabs ----
  const menuData = {
    lunch: [
      {
        name: 'Crispy Buddha Bowl',
        description: 'Roasted chickpeas, quinoa, roasted vegetables, tahini dressing',
        ingredients: ['Chickpeas', 'Quinoa', 'Seasonal veg', 'Tahini'],
      },
      {
        name: 'Green Goddess Pasta',
        description: 'Fresh tagliatelle with basil, spinach, pine nut sauce',
        ingredients: ['Pasta', 'Basil', 'Spinach', 'Pine nuts'],
      },
      {
        name: 'Spiced Lentil Soup',
        description: 'Warming blend of red lentils, coconut, and warming spices',
        ingredients: ['Red lentils', 'Coconut', 'Cumin', 'Ginger'],
      },
    ],
    dinner: [
      {
        name: 'Charred Beetroot with Horseradish Cream',
        description: 'Thick-cut beetroot with horseradish cream,microgreens, truffle oil',
        ingredients: ['Beetroot', 'Horseradish', 'Microgreens', 'Truffle oil'],
      },
      {
        name: 'Wild Mushroom Risotto',
        description: 'Creamy arborio rice with porcini, truffle, parmesan-style nutritional yeast',
        ingredients: ['Arborio rice', 'Porcini', 'Truffle', 'Nutritional yeast'],
      },
      {
        name: 'Chocolate Avocado Torte',
        description: 'Rich dark chocolate with silky avocado mousse, raspberry coulis',
        ingredients: ['Dark chocolate', 'Avocado', 'Raspberries', 'Coconut cream'],
      },
    ],
    events: [
      {
        name: 'Seasonal Tasting Menu',
        description: '7-course curated experience featuring the finest seasonal ingredients',

        ingredients: ['Seasonal', "Chef's selection", 'Wine pairings available'],
      },
      {
        name: 'Cocktail Reception',
        description: 'Elegant canapés and plant-based finger foods paired with signature mocktails',

        ingredients: ['Fresh canapés', 'Bespoke mocktails', 'Seasonal produce'],
      },
    ],
  };

  const menuItemsRoot = $('#menuItems');
  const renderMenu = (tab) => {
    if (!menuItemsRoot) return;
    const items = menuData[tab] || [];

    menuItemsRoot.innerHTML = items
      .map((item) => {
        const tags = (item.ingredients || [])
          .map((ing) => `<span class="px-2.5 sm:px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">${ing}</span>`)
          .join('');
        return `
          <div class="group border-b border-border/50 pb-6 sm:pb-8 last:border-b-0">
            <div class="flex justify-between items-start gap-3 mb-2 sm:mb-3">
              <h3 class="text-lg sm:text-xl font-semibold text-foreground group-hover:text-primary transition-colors">${item.name}</h3>
            </div>
            <p class="text-foreground/70 text-sm sm:text-base mb-3 sm:mb-4">${item.description}</p>
            <div class="flex flex-wrap gap-1.5 sm:gap-2">${tags}</div>
          </div>
        `;
      })
      .join('');
  };

  const setActiveTabBtn = (tab) => {
    $$('.menu-tab').forEach((btn) => {
      const isActive = btn.getAttribute('data-tab') === tab;
      btn.classList.toggle('text-primary', isActive);
      btn.classList.toggle('text-foreground/60', !isActive);
      // underline
      const underline = btn.querySelector('[data-underline]');
      if (underline) underline.remove();
      if (isActive) {
        const u = document.createElement('div');
        u.setAttribute('data-underline', '1');
        u.className = 'absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full';
        btn.appendChild(u);
      }
    });
  };

  let currentTab = 'lunch';
  renderMenu(currentTab);
  setActiveTabBtn(currentTab);
  $$('.menu-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (!tab || !menuData[tab]) return;
      currentTab = tab;
      renderMenu(tab);
      setActiveTabBtn(tab);
    });
  });

  const menuCta = $('#menuCta');
  if (menuCta) menuCta.addEventListener('click', () => scrollToId('contact'));

  // ---- Gallery lightbox ----
  const galleryItems = [
    {
      src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/chinese_food-irIcTMEzVgCvrkOmBeBhnjbJCcTZfo.jpg',
      alt: 'Wok with colorful stir-fry',
      title: 'Stir-Fry Mastery',
    },
    {
      src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/grilled_veg-vfuwth46zjelqE3J8Qf2B1fW5hcYKE.jpg',
      alt: 'Grilled vegetables over flames',
      title: 'Fire-Roasted Vegetables',
    },
    {
      src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Antojitos_paster-FGnUg8qTlBt55sLx0KjiPvqrpr3bRO.jpg',
      alt: 'Plant-based street food',
      title: 'Modern Antojitos',
    },
    {
      src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CHIX-s9JH2gcfZMtbnsK6saicaVPpp8AWZC.jpg',
      alt: 'Fried plant-based chicken',
      title: 'Plant-Based Indulgence',
    },
    {
      src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Haldi-D3FWwDGAeMiU3S5r5Je6ZxGvApOHri.jpg',
      alt: 'Decorative street food dish',
      title: 'Artistic Plating',
    },
    {
      src: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The_peruvian-MPxnc8iy0O4EngOBegG2E9odhmTgi2.jpg',
      alt: 'Peruvian plant-based dish',
      title: 'Global Fusion',
    },
  ];

  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightboxImg');
  const lightboxTitle = $('#lightboxTitle');
  const lightboxClose = $('#lightboxClose');
  const lightboxPrev = $('#lightboxPrev');
  const lightboxNext = $('#lightboxNext');

  let lightboxIndex = 0;
  const openLightbox = (index) => {
    if (!lightbox || !lightboxImg || !lightboxTitle) return;
    lightboxIndex = index;
    const item = galleryItems[lightboxIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.alt;
    lightboxTitle.textContent = item.title;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  };

  const stepLightbox = (dir) => {
    lightboxIndex = (lightboxIndex + dir + galleryItems.length) % galleryItems.length;
    openLightbox(lightboxIndex);
  };

  $$('.gallery-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = Number(card.getAttribute('data-index'));
      if (Number.isFinite(idx)) openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
  if (lightbox) lightbox.addEventListener('click', () => closeLightbox());
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(-1); });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); stepLightbox(1); });

  document.addEventListener('keydown', (e) => {
    if (!lightbox || lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });
// ---- Contact form (Formspree submit) ----
const form = document.getElementById("contactForm");
const statusEl = document.getElementById("contactFormStatus");
const btnText = document.getElementById("contactBtnText");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (statusEl) {
      statusEl.classList.remove("hidden");
      statusEl.textContent = "Sending...";
    }

    if (btnText) btnText.textContent = "Sending...";

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        if (statusEl) statusEl.textContent = "Message sent. Thank you!";
        if (btnText) btnText.textContent = "Send Message";
      } else {
        if (statusEl) statusEl.textContent = "Something went wrong. Please try again.";
        if (btnText) btnText.textContent = "Send Message";
      }

    } catch (err) {
      if (statusEl) statusEl.textContent = "Network error. Please try again.";
      if (btnText) btnText.textContent = "Send Message";
    }
  });
}

  // ---- Mailing list (fake submit) ----
  const mailingForm = $('#mailingForm');
  const mailingBtn = $('#mailingBtn');
  if (mailingForm && mailingBtn) {
    mailingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      mailingBtn.textContent = 'Subscribed!';
      mailingBtn.setAttribute('disabled', 'true');
      setTimeout(() => {
        mailingForm.reset();
        mailingBtn.textContent = 'Subscribe';
        mailingBtn.removeAttribute('disabled');
      }, 2000);
    });
  }

  // ---- Timeline (render milestones) ----
  const milestones = [
    {
      year: 'Early Days',
      title: 'Where It All Began',
      description: 'Started washing dishes for pocket money — hospitality became more than a job, it became a passion.',
    },
    {
      year: 'The Switch',
      title: 'Going Plant-Based',
      description: 'Initially for health, but quickly discovering the environmental and ethical reasons that made it a lifestyle.',
    },
    {
      year: 'First Events',
      title: 'Pop-Ups & Supper Clubs',
      description: 'Taking plant-based food to the people — proving that vegan cuisine means zero compromise on flavour.',
    },
    {
      year: 'Growing',
      title: 'Festivals & Fields',
      description: 'Expanding into festival catering and outdoor events — anything in a field became the speciality.',
    },
    {
      year: 'Now',
      title: 'UK-Wide & Beyond',
      description: 'Operating across the whole of the UK, with EU events available. Weddings, festivals, supper clubs and more.',
    },
    {
      year: 'Giving Back',
      title: 'Food Poverty Initiative',
      description: 'Donating a percentage of profits to food poverty charities — because good food should be for everyone.',
    },
  ];

  const timelineRoot = $('#timelineItems');
  if (timelineRoot) {
    timelineRoot.innerHTML = milestones
      .map((m, index) => {
        const showLine = index < milestones.length - 1;
        return `
          <div class="flex gap-6 md:gap-8">
            <div class="flex flex-col items-center">
              <div class="w-4 h-4 rounded-full bg-primary ring-4 ring-background/50"></div>
              ${showLine ? '<div class="w-1 h-24 bg-gradient-to-b from-primary to-transparent mt-4"></div>' : ''}
            </div>
            <div class="pb-4 pt-1 group cursor-pointer">
              <div class="text-sm font-bold text-primary mb-2">${m.year}</div>
              <h3 class="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">${m.title}</h3>
              <p class="text-foreground/70">${m.description}</p>
            </div>
          </div>
        `;
      })
      .join('');
  }

  // ---- Recipe modal ----
  const recipes = [
    {
      name: 'Quick Tahini Dressing',
      ingredients: ['Tahini', 'Lemon juice', 'Garlic', 'Water', 'Salt'],
      instructions: ['Mix tahini with lemon juice', 'Add minced garlic', 'Whisk with water until smooth', 'Season to taste'],
    },
    {
      name: 'Crispy Chickpeas',
      ingredients: ['Canned chickpeas', 'Paprika', 'Cumin', 'Olive oil', 'Salt & pepper'],
      instructions: ['Drain and dry chickpeas', 'Toss with spices and oil', 'Roast at 200°C for 25 minutes', 'Cool and store'],
    },
  ];

  const recipeModal = $('#recipeModal');
  const recipeContent = $('#recipeContent');
  const recipeClose = $('#recipeClose');

  const openRecipe = (index) => {
    if (!recipeModal || !recipeContent) return;
    const r = recipes[index];
    if (!r) return;

    recipeContent.innerHTML = `
      <div>
        <h2 class="text-3xl font-bold text-primary mb-2">${r.name}</h2>
        <p class="text-foreground/60">A simple recipe from Mark's kitchen</p>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-foreground mb-3">Ingredients</h3>
        <ul class="space-y-2">
          ${r.ingredients
            .map((ing) => `<li class="flex items-center gap-3 text-foreground/80"><span class="w-2 h-2 rounded-full bg-primary"></span>${ing}</li>`)
            .join('')}
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-foreground mb-3">Instructions</h3>
        <ol class="space-y-2">
          ${r.instructions
            .map((step, i) => `<li class="flex gap-3 text-foreground/80"><span class="font-semibold text-primary min-w-fit">${i + 1}.</span>${step}</li>`)
            .join('')}
        </ol>
      </div>
    `;

    recipeModal.classList.remove('hidden');
    recipeModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  const closeRecipe = () => {
    if (!recipeModal) return;
    recipeModal.classList.add('hidden');
    recipeModal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  $$('.recipe-open').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-recipe'));
      if (Number.isFinite(idx)) openRecipe(idx);
    });
  });

  if (recipeClose) recipeClose.addEventListener('click', closeRecipe);
  if (recipeModal) recipeModal.addEventListener('click', (e) => {
    if (e.target === recipeModal) closeRecipe();
  });

  // Mobile gallery slider (swipe + dots)
(function () {
  const track = document.querySelector(".gallery-track");
  const slides = Array.from(document.querySelectorAll(".gallery-slide"));
  const dots = Array.from(document.querySelectorAll(".gallery-dots .dot"));
  if (!track || slides.length === 0 || dots.length === 0) return;

  let index = 0;
  let startX = 0;
  let dragging = false;

  const goTo = (i) => {
    index = Math.max(0, Math.min(i, slides.length - 1));
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle("active", idx === index));
  };

  dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

  track.addEventListener("touchstart", (e) => {
    dragging = true;
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", (e) => {
    if (!dragging) return;
    dragging = false;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) goTo(index + 1);
    else if (diff < -50) goTo(index - 1);
    else goTo(index);
  });

  goTo(0);
})();

})();
