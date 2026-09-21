// Cambia este número por el WhatsApp del negocio, con lada y solo dígitos.
const WHATSAPP_NUMBER = "";

const products = [
  { id: 1, name: "Rosa", price: 1249, image: "assets/modelo-1.jpg", occasion: "XV Años", tier: "Ultra" },
  { id: 2, name: "Rosa", price: 1249, image: "assets/modelo-2.jpg", occasion: "XV Años", tier: "Ultra" },
  { id: 4, name: "Rosa", price: 1249, image: "assets/modelo-4.jpg", occasion: "XV Años", tier: "Ultra" },
  { id: 5, name: "Rosa", price: 1249, image: "assets/modelo-5.jpg", occasion: "XV Años", tier: "Ultra" },
];

const state = { occasion: "XV Años", category: "", tier: "Ultra" };
const grid = document.querySelector("#product-grid");
const dialog = document.querySelector("#preview-dialog");
const toast = document.querySelector("#toast");
const favorites = new Set(JSON.parse(localStorage.getItem("luni-favorites") || "[]"));
let toastTimer;

function icon(name) {
  return `<svg aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function contactUrl(product) {
  const message = product
    ? `Hola, me interesa el Modelo ${product.id} ${product.name} de Luni Estudio. ¿Me pueden dar más información?`
    : "Hola, quisiera información sobre las invitaciones de Luni Estudio.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
}

function render() {
  const visible = products.filter((product) => product.occasion === state.occasion && product.tier === state.tier && !state.category);
  document.querySelector("#catalog-title").textContent = state.category
    ? state.category
    : "Todos los modelos se pueden adaptar al color que quieras";
  document.querySelector("#catalog-subtitle").textContent = state.category
    ? "Pronto encontrarás aquí los modelos de esta categoría."
    : `Invitaciones ${state.occasion.toLowerCase()} · ${state.tier}`;

  grid.innerHTML = visible.length
    ? visible.map((product) => `
      <article class="product-card">
        <button class="favorite" type="button" data-favorite="${product.id}" aria-label="${favorites.has(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"} el modelo ${product.id}" aria-pressed="${favorites.has(product.id)}">${icon("heart")}</button>
        <div class="product-card__photo"><img src="${product.image}" alt="Vestido rosa del modelo ${product.id}" loading="lazy" /></div>
        <div class="product-card__body">
          <p class="product-card__label">Modelo ${product.id}</p>
          <h3>${product.name}</h3>
          <p class="product-card__price">$${product.price.toLocaleString("es-MX")} MXN</p>
          <p class="product-card__kind">${icon("people")} Invitación interactiva</p>
          <div class="product-card__actions">
            <button class="button button--demo" type="button" data-preview="${product.id}">${icon("eye")} Ver demo</button>
            <a class="button button--green" href="${contactUrl(product)}" data-whatsapp="modelo" data-product="${product.id}" target="_blank" rel="noopener noreferrer">${icon("whatsapp")} Pedir este modelo</a>
          </div>
        </div>
      </article>`).join("")
    : `<div class="empty-state"><h3>Próximamente</h3><p>Aún estamos preparando los modelos de ${state.category || `${state.occasion} · ${state.tier}`}.</p></div>`;

  document.querySelectorAll("[data-occasion]").forEach((button) => {
    const active = button.dataset.occasion === state.occasion && !state.category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-tier]").forEach((button) => {
    const active = button.dataset.tier === state.tier;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-category]").forEach((button) => button.classList.toggle("is-active", button.dataset.category === state.category));
}

document.addEventListener("click", (event) => {
  const occasion = event.target.closest("[data-occasion]");
  const tier = event.target.closest("[data-tier]");
  const category = event.target.closest("[data-category]");
  const favorite = event.target.closest("[data-favorite]");
  const preview = event.target.closest("[data-preview]");
  const whatsapp = event.target.closest("[data-whatsapp]");

  if (occasion) { state.occasion = occasion.dataset.occasion; state.category = ""; render(); }
  if (tier) { state.tier = tier.dataset.tier; state.category = ""; render(); }
  if (category) { state.category = state.category === category.dataset.category ? "" : category.dataset.category; render(); }
  if (favorite) {
    const id = Number(favorite.dataset.favorite);
    favorites.has(id) ? favorites.delete(id) : favorites.add(id);
    localStorage.setItem("luni-favorites", JSON.stringify([...favorites]));
    render();
    showToast(favorites.has(id) ? "Guardado en favoritos" : "Quitado de favoritos");
  }
  if (preview) {
    const product = products.find((item) => item.id === Number(preview.dataset.preview));
    document.querySelector("#preview-title").textContent = `Modelo ${product.id} · ${product.name}`;
    document.querySelector("#preview-image").src = product.image;
    document.querySelector("#preview-image").alt = `Vista previa del modelo ${product.id}`;
    document.querySelector("#preview-order").href = contactUrl(product);
    dialog.showModal();
  }
  if (whatsapp && !WHATSAPP_NUMBER) {
    event.preventDefault();
    showToast("Falta configurar el número de WhatsApp del negocio.");
  }
});

document.querySelector(".preview-dialog__close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
render();
