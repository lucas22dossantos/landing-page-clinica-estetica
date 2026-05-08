/* ============================================================
   AESTHETICA — script.js
   Animaciones: hero stagger, header scroll, contadores,
   reveal por scroll, before/after, chips WhatsApp, FAQ, menú
   ============================================================ */

/* ---------------------------------------------------------------
   1. MENÚ MOBILE
--------------------------------------------------------------- */
const menuButton = document.querySelector(".menu-toggle");
const navLinks   = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  function closeMenu() {
    navLinks.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    const icon = menuButton.querySelector(".material-symbols-outlined");
    if (icon) icon.textContent = "menu";
  }

  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    const icon = menuButton.querySelector(".material-symbols-outlined");
    if (icon) icon.textContent = isOpen ? "close" : "menu";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

/* ---------------------------------------------------------------
   2. HEADER — Fondo sólido al hacer scroll
--------------------------------------------------------------- */
const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 60);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // estado inicial
}

/* ---------------------------------------------------------------
   3. WHATSAPP — Chips + preview animado
--------------------------------------------------------------- */
const whatsappNumber    = "5491160000000";
const whatsappLink      = document.querySelector(".whatsapp-link");
const selectedTreatment = document.querySelector(".selected-treatment");
const messageBubble     = document.querySelector(".message-bubble");

function updateWhatsappLink(treatment) {
  const message = `Hola AESTHETICA, vengo desde la web. Quiero consultar por ${treatment}. ¿Me pasan disponibilidad y valores?`;

  // Fade-out → actualizar → fade-in
  if (messageBubble) messageBubble.classList.add("updating");

  setTimeout(() => {
    if (selectedTreatment) selectedTreatment.textContent = treatment;
    if (whatsappLink) {
      whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    }
    if (messageBubble) messageBubble.classList.remove("updating");
  }, 220);
}

document.querySelectorAll(".chips button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".chips button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    updateWhatsappLink(button.dataset.treatment || button.textContent.trim());
  });
});

/* ---------------------------------------------------------------
   4. BEFORE/AFTER slider
--------------------------------------------------------------- */
document.querySelectorAll(".comparison").forEach((comparison) => {
  const range = comparison.querySelector(".compare-range");
  if (!range) return;

  // Posición inicial: centrado
  comparison.style.setProperty("--position", "50%");
  range.value = 50;

  range.addEventListener("input", () => {
    comparison.style.setProperty("--position", `${range.value}%`);
  });

  // Animación de entrada: al entrar al viewport mueve de 20% → 50%
  let animated = false;
  const compObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateSlider(comparison, range, 20, 50, 1200);
          compObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );
  compObs.observe(comparison);
});

function animateSlider(comparison, range, from, to, duration) {
  const start = performance.now();
  const tick = (now) => {
    const t     = Math.min((now - start) / duration, 1);
    // Ease in-out cúbico
    const ease  = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const value = from + (to - from) * ease;
    range.value = value;
    comparison.style.setProperty("--position", `${value}%`);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------------------------------------------------------------
   5. CONTADORES ANIMADOS — Métricas
   Maneja: "12K+", "15 años", "98%", "40+"
--------------------------------------------------------------- */
function animateCounter(el, target, suffix, duration = 1800) {
  const start = performance.now();
  const isDecimal = target % 1 !== 0;
  const tick  = (now) => {
    const t    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3); // ease-out cúbico
    const val  = isDecimal
      ? (target * ease).toFixed(1)
      : Math.round(target * ease);
    el.textContent = val + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const metricsObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const strong = entry.target.querySelector("strong");
      if (!strong) return;

      // Guardar el HTML original para no perder el <span> del sufijo accent
      const rawText = strong.textContent.trim(); // ej: "12K+", "15 años", "98%"

      // Extraer número (puede ser entero o decimal)
      const numMatch = rawText.match(/[\d]+(\.\d+)?/);
      if (!numMatch) return;
      const num = parseFloat(numMatch[0]);

      // El sufijo es todo lo que no es dígito (puede incluir letras como "K" o " años")
      // Lo construimos sin el número puro
      const suffix = rawText.replace(/[\d]+(\.\d+)?/, "");

      // Animar solo el texto, preservamos el innerHTML luego
      // Guardamos el <span> de color accent si existe
      const accentSpan = strong.querySelector("span");
      const accentText = accentSpan ? accentSpan.textContent : null;

      if (accentText) {
        // Sufijo tiene color accent (ej: "K+", "%", "+", " años")
        // Animamos solo el número, el span lo reconstruimos
        const numOnlySuffix = suffix.replace(accentText, "");
        const tick = (() => {
          const start2 = performance.now();
          return (now) => {
            const t    = Math.min((now - start2) / 1800, 1);
            const ease = 1 - Math.pow(1 - t, 3);
            const val  = Math.round(num * ease);
            strong.innerHTML = val + numOnlySuffix + `<span>${accentText}</span>`;
            if (t < 1) requestAnimationFrame(tick);
          };
        })();
        requestAnimationFrame(tick);
      } else {
        animateCounter(strong, num, suffix);
      }

      metricsObs.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".metrics article").forEach((el) => metricsObs.observe(el));

/* ---------------------------------------------------------------
   6. REVEAL POR SCROLL — Cards, secciones, testimonios, precios
--------------------------------------------------------------- */
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("anim-visible");
        revealObs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

const revealSelectors = [
  ".treatment-card",
  ".price-card",
  ".quote-card",
  ".faq-list details",
  ".benefits li",
  ".metrics article",
  ".section-heading",
  ".result-card",
  ".reservation-copy > *",
  ".whatsapp-card",
];

revealSelectors.forEach((selector) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.classList.add("anim-hidden");
    revealObs.observe(el);
  });
});

/* ---------------------------------------------------------------
   8. BOTONES DE PRECIO — Pre-seleccionan el plan en WhatsApp
--------------------------------------------------------------- */
document.querySelectorAll(".btn-plan").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const plan = btn.dataset.plan;
    if (!plan) return;

    // Armar el mensaje personalizado con el plan elegido
    const message = `Hola AESTHETICA, vengo desde la web. Me interesa el ${plan}. ¿Me pasan disponibilidad y cómo proceder?`;

    // Actualizar el preview del mensaje en la sección de reserva
    if (selectedTreatment) selectedTreatment.textContent = plan;
    if (messageBubble) messageBubble.classList.add("updating");

    setTimeout(() => {
      if (whatsappLink) {
        whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      }
      if (messageBubble) messageBubble.classList.remove("updating");
    }, 220);

    // Desactivar todos los chips y no activar ninguno
    // (el plan no corresponde a un chip existente)
    document.querySelectorAll(".chips button").forEach((chip) => {
      chip.classList.remove("active");
    });
  });
});

/* ---------------------------------------------------------------
   9. ESTRELLAS — Animación de entrada en testimonios
--------------------------------------------------------------- */
document.querySelectorAll(".stars").forEach((stars) => {
  const original = stars.textContent.trim(); // "★★★★★"
  stars.textContent = "";

  const starsObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        [...original].forEach((char, i) => {
          setTimeout(() => {
            stars.textContent += char;
          }, i * 110);
        });
        starsObs.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );
  starsObs.observe(stars);
});
