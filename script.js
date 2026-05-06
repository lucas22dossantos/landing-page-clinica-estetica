const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));

    const icon = menuButton.querySelector(".material-symbols-outlined");
    if (icon) {
      icon.textContent = isOpen ? "close" : "menu";
    }
  });
}

const whatsappNumber = "5491160000000";
const whatsappLink = document.querySelector(".whatsapp-link");
const selectedTreatment = document.querySelector(".selected-treatment");

function updateWhatsappLink(treatment) {
  const message = `Hola AESTHETICA, vengo desde la web. Quiero consultar por ${treatment}. ¿Me pasan disponibilidad y valores?`;

  if (selectedTreatment) {
    selectedTreatment.textContent = treatment;
  }

  if (whatsappLink) {
    whatsappLink.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }
}

document.querySelectorAll(".chips button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".chips button").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    updateWhatsappLink(button.dataset.treatment || button.textContent.trim());
  });
});

document.querySelectorAll(".comparison").forEach((comparison) => {
  const range = comparison.querySelector(".compare-range");

  if (!range) return;

  range.addEventListener("input", () => {
    comparison.style.setProperty("--position", `${range.value}%`);
  });
});
