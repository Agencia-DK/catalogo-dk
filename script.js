// Cambia este número por el WhatsApp del negocio, con lada y solo dígitos.
const WHATSAPP_NUMBER = "";

const covers = Array.from({ length: 9 }, (_, index) => `assets/cover-${String(index + 1).padStart(2, "0")}.jpg`);
const weddingNames = ["Mar", "Negro", "Periódico", "Paisajes", "Verde Olivo", "Terracota", "Viaje", "Elegante"];
const demoPaths = {
  "XV Años": {
    Ultra: {
      1: "up-md1-rosa-xv", 2: "up-md2-xv-rosa", 4: "up-md4-xv-rosa", 5: "up-md5-xv-rosa",
      6: "up-md6-xv-rosa", 7: "up-md7-xv-rosa", 8: "up-md8-xv-rosa", 9: "up-md9-xv-rosa",
      10: "up-md10-xv-rosa", 11: "up-md11-xv-rosa", 12: "up-md12-xv-rosa", 13: "up-md13-xv-rosa",
      14: "up-md14-xv-rosa", 15: "up-md15-xv-rosa", 16: "up-md16-xv-rosa",
    },
    Intermedio: {
      1: "intermedio-md1-rosa", 2: "intermedio-md2-xv-rosa", 4: "md4-xv-rosa-intermedio", 5: "md-5-xv-intermedio-rosa",
      6: "md-6-xv-intermedio-rosa", 7: "md-7-xv-intermedio-rosa", 8: "md-8-xv-intermedio-rosa", 9: "md-9-xv-intermedio-rosa",
      10: "md-10-xv-intermedio-rosa", 11: "md-11-intermedio-rosa", 12: "md-12-xv-intermedio-rosa", 13: "md-13-xv-intermedio-rosa",
      14: "md-14-xv-intermedio-rosa", 15: "md-15-xv-intermedio-rosa", 16: "md-16-xv-intermedio-rosa",
    },
    Premium: {
      1: "premium-md1-xv-rosa", 2: "premium-md2-xv-rosa", 4: "premium-md4-xv-rosa", 5: "premium-md5-xv-rosa",
      6: "premium-md6-xv-rosa", 7: "premium-md7-xv-rosa", 8: "premium-md8-xv-rosa", 9: "premium-md9-xv-rosa",
      10: "modelo-md10-xv-rosa", 11: "premium-md11-xv-rosa", 12: "premium-md12-xv-rosa", 13: "premium-md13-xv-rosa",
      14: "premium-md14-xv-rosa", 15: "premium-md15-xv-rosa", 16: "premium-md16-xv-rosa",
    },
  },
  Boda: {
    Ultra: {
      1: "up-md1-mar-luni", 2: "up-md2-negro-luni", 3: "up-md3-periodico-luni", 4: "up-md4-paisajes-luni",
      5: "up-md5-verde-olivo-luni", 6: "up-md6-terracota-luni", 7: "up-md7-viaje-luni", 8: "up-md8-elegante-luni",
    },
    Premium: {
      1: "md1-mar-premium-luni", 2: "md2-negro-premium-luni", 3: "md3-premium-luni", 4: "md4-premium-luni",
      5: "md5-vrd-olivo-premium-luni", 6: "md6-premium-luni", 7: "md7-viaje-premium-luni", 8: "md8-elegante-boda-premium",
    },
    Intermedio: {
      1: "md1-mar-intermdio-luni", 2: "md2-negro-intermedio-luni", 3: "md3-periodico-intermedio-luni", 4: "md4-paisajes-intermedio-luni",
      5: "md5-vrd-olivo-intermedio-luni", 6: "md6-terracota-intermedio-luni", 7: "md7-viaje-intermedio-lunia", 8: "md8-elegante-intermedio-luni",
    },
  },
};
const products = Object.entries(demoPaths).flatMap(([occasion, tiers]) =>
  Object.entries(tiers).flatMap(([tier, models]) =>
    Object.entries(models).map(([number, path]) => {
      const id = Number(number);
      return {
        key: `${occasion === "Boda" ? "boda" : "xv"}-${tier.toLowerCase()}-${id}`,
        id, name: occasion === "Boda" ? weddingNames[id - 1] : "Rosa",
        image: covers[(id - 1) % covers.length], occasion, tier,
        demo: `https://estudioluni.com/published/${path}`,
      };
    })
  )
);

const packageImages = {
  Intermedio: { src: "assets/paquete-intermedio.png", usd: 45, mxn: 900, alt: "Paquete Intermedio: música, cuenta regresiva, lluvia de sobres, hasta 3 fotos, código de vestimenta, pase sencillo y confirmación." },
  Premium: { src: "assets/paquete-premium.png", usd: 59, mxn: 1100, alt: "Paquete Premium: datos del evento, música, ubicación, hasta 10 fotos, código de vestimenta, lluvia de sobres, confirmación, cuenta regresiva, pases e itinerario." },
  Ultra: { src: "assets/paquete-ultra.png", usd: 74, mxn: 1450, alt: "Paquete Ultra Premium: datos del evento, música, ubicación, hasta 15 fotos, código de vestimenta, lluvia de sobres, confirmación, cuenta regresiva, pase personalizado e itinerario." },
};

const state = { occasion: "XV Años", category: "", tier: "Ultra" };
const grid = document.querySelector("#product-grid");
const toast = document.querySelector("#toast");
const favorites = new Set(JSON.parse(localStorage.getItem("luni-favorites") || "[]"));
let toastTimer;

function icon(name) {
  return `<svg aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function contactUrl(product) {
  const message = product
    ? `Hola, me interesa el Modelo ${product.id} ${product.name} (${product.occasion}, ${product.tier}) de Luni Estudio. ¿Me pueden dar más información?`
    : "Hola, quisiera información sobre las invitaciones de Luni Estudio.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
}

function priceMarkup(tier) {
  const { usd, mxn } = packageImages[tier];
  return `<div class="price"><strong>$${usd} USD</strong><small>$${mxn.toLocaleString("es-MX")} MXN</small></div>`;
}

function packageInfo() {
  const image = packageImages[state.tier];
  return `<figure class="package-info package-info--${state.tier.toLowerCase()}"><img src="${image.src}" alt="${image.alt}" loading="lazy" />${priceMarkup(state.tier)}</figure>`;
}

function render() {
  const visible = products.filter((product) => product.occasion === state.occasion && product.tier === state.tier && !state.category);
  document.querySelector("#catalog-title").textContent = state.category
    ? state.category
    : "All models can be customized in any color you like";
  document.querySelector("#catalog-subtitle").textContent = state.category
    ? "Pronto encontrarás aquí los modelos de esta categoría."
    : "Todos los modelos se pueden adaptar al color que quieras";

  grid.innerHTML = visible.length
    ? visible.map((product, index) => `
      <article class="product-card">
        <button class="favorite" type="button" data-favorite="${product.key}" aria-label="${favorites.has(product.key) ? "Quitar de favoritos" : "Agregar a favoritos"} el modelo ${product.id}" aria-pressed="${favorites.has(product.key)}">${icon("heart")}</button>
        <div class="product-card__photo"><img src="${product.image}" alt="Portada del modelo ${product.id} ${product.name}" loading="lazy" /></div>
        <div class="product-card__body">
          <p class="product-card__label">Modelo ${product.id}</p>
          <h3>${product.name}</h3>
          ${priceMarkup(product.tier)}
          <p class="product-card__kind">${icon("people")} Invitación interactiva</p>
          <div class="product-card__actions">
            <a class="button button--demo" href="${product.demo}" target="_blank" rel="noopener noreferrer">${icon("eye")} Ver demo</a>
            <a class="button button--green" href="${contactUrl(product)}" data-whatsapp="modelo" target="_blank" rel="noopener noreferrer">${icon("whatsapp")} Pedir este modelo</a>
          </div>
        </div>
      </article>${index % 2 === 1 ? packageInfo() : ""}`).join("")
    : `<div class="empty-state"><h3>Próximamente</h3><p>Aún estamos preparando los modelos de ${state.category || `${state.occasion} · ${state.tier}`}.</p></div>${state.category ? "" : packageInfo()}`;

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
  const whatsapp = event.target.closest("[data-whatsapp]");

  if (occasion) { state.occasion = occasion.dataset.occasion; state.category = ""; render(); }
  if (tier) { state.tier = tier.dataset.tier; state.category = ""; render(); }
  if (category) { state.category = state.category === category.dataset.category ? "" : category.dataset.category; render(); }
  if (favorite) {
    const key = favorite.dataset.favorite;
    favorites.has(key) ? favorites.delete(key) : favorites.add(key);
    localStorage.setItem("luni-favorites", JSON.stringify([...favorites]));
    render();
    showToast(favorites.has(key) ? "Guardado en favoritos" : "Quitado de favoritos");
  }
  if (whatsapp && !WHATSAPP_NUMBER) {
    event.preventDefault();
    showToast("Falta configurar el número de WhatsApp del negocio.");
  }
});

render();
