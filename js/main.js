// ─────────────────────────────────────────────────────────────────────────────
// MOSMED — main.js
// Language switching, scroll animations, mobile nav
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  "use strict";

  // ── Language detection & persistence ────────────────────────────────────────

  const SUPPORTED = ["en", "ru", "am"];
  const STORAGE_KEY = "mosmed_lang";

  // Lang codes used in lang= attributes
  const LANG_ATTR = { en: "en", ru: "ru", am: "hy" };

  function detectLang() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;

    // Browser preference
    const browser = (navigator.language || navigator.userLanguage || "en")
      .toLowerCase()
      .split("-")[0];
    if (browser === "hy" || browser === "am") return "am";
    if (browser === "ru") return "ru";
    return "en";
  }

  let currentLang = detectLang();

  // ── Apply translations ───────────────────────────────────────────────────────

  function applyLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = LANG_ATTR[lang];

    // Update every element with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!translations[key]) return;
      let text = translations[key][lang] || translations[key]["en"] || "";

      // Handle {year} substitution
      text = text.replace("{year}", new Date().getFullYear());

      // Preserve line breaks in address
      if (el.getAttribute("data-i18n-html") === "true") {
        el.innerHTML = text.replace(/\n/g, "<br>");
      } else {
        el.textContent = text;
      }
    });

    // Update placeholder attributes
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (translations[key]) {
        el.placeholder = translations[key][lang] || translations[key]["en"];
      }
    });

    // Update aria-label attributes
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (translations[key]) {
        el.setAttribute("aria-label", translations[key][lang] || translations[key]["en"]);
      }
    });

    // Update alt attributes
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (translations[key]) {
        el.alt = translations[key][lang] || translations[key]["en"];
      }
    });

    // Update iframe title
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (translations[key]) {
        el.title = translations[key][lang] || translations[key]["en"];
      }
    });

    // Show press links only in RU and AM
    const pressSection = document.getElementById("press-section");
    if (pressSection) {
      pressSection.style.display = lang === "en" ? "none" : "block";
    }

    // Active state on switcher buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("lang-btn--active", btn.dataset.lang === lang);
      btn.setAttribute("aria-pressed", btn.dataset.lang === lang);
    });
  }

  // ── Mobile navigation ────────────────────────────────────────────────────────

  function initMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("nav-menu--open");
      toggle.setAttribute("aria-expanded", open);
      toggle.classList.toggle("nav-toggle--open", open);
    });

    // Close menu when a link is clicked
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("nav-menu--open");
        toggle.setAttribute("aria-expanded", false);
        toggle.classList.remove("nav-toggle--open");
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove("nav-menu--open");
        toggle.setAttribute("aria-expanded", false);
        toggle.classList.remove("nav-toggle--open");
      }
    });
  }

  // ── Smooth scroll ────────────────────────────────────────────────────────────

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        const headerH = document.getElementById("site-header")?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  // ── Sticky header shadow ─────────────────────────────────────────────────────

  function initHeaderShadow() {
    const header = document.getElementById("site-header");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("header--scrolled", window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ── Scroll-triggered fade-in ─────────────────────────────────────────────────

  function initScrollAnimations() {
    const els = document.querySelectorAll(".fade-in");
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-in--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => observer.observe(el));
  }

  // ── Logo fallback ────────────────────────────────────────────────────────────

  function initLogoFallback() {
    document.querySelectorAll(".logo-img").forEach((img) => {
      img.addEventListener("error", () => {
        img.style.display = "none";
        const fallback = img.nextElementSibling;
        if (fallback && fallback.classList.contains("logo-fallback")) {
          fallback.style.display = "block";
        }
      });
    });
  }

  // ── Init ─────────────────────────────────────────────────────────────────────

  function init() {
    // Wire up language buttons
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyLang(btn.dataset.lang));
    });

    applyLang(currentLang);
    initMobileNav();
    initSmoothScroll();
    initHeaderShadow();
    initScrollAnimations();
    initLogoFallback();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
