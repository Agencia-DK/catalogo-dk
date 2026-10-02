const WHATSAPP_URL = "https://wa.link/h07sjn";

const packageImages = {
  Intermedio: { src: "assets/paquete-intermedio.png", usd: 45, mxn: 900, alt: "Paquete Intermedio: música, cuenta regresiva, lluvia de sobres, hasta 3 fotos, código de vestimenta, pase sencillo y confirmación." },
  Premium: { src: "assets/paquete-premium.png", usd: 59, mxn: 1100, alt: "Paquete Premium: datos del evento, música, ubicación, hasta 10 fotos, código de vestimenta, lluvia de sobres, confirmación, cuenta regresiva, pases e itinerario." },
  Ultra: { src: "assets/paquete-ultra.png", usd: 74, mxn: 1450, alt: "Paquete Ultra Premium: datos del evento, música, ubicación, hasta 15 fotos, código de vestimenta, lluvia de sobres, confirmación, cuenta regresiva, pase personalizado e itinerario." },
};

const palettes = {
  ROSA: ["#f7c1d2", "#ad3568"], DORADO: ["#f5dea0", "#9a6411"], ROJO: ["#f3a0a0", "#9e1723"],
  "VERDE ESMERALDA": ["#a6dec9", "#086247"], LILA: ["#d9c1ef", "#70418e"], "VERDE CEMENTO": ["#c5cec0", "#536451"],
  "AZUL CIELO": ["#bfe4f6", "#397aa4"], "AZUL REY": ["#9dbaf0", "#173f98"], NEGRO: ["#747474", "#141414"],
  "AZUL MARINO": ["#8294b5", "#132948"], "XV HOMBRE": ["#8ca8d2", "#152d55"], "TEMÁTICAS": ["#edbded", "#763b82"],
  Diamante: ["#edf1f5", "#637383"], "Verde Olivo": ["#bec79a", "#566225"], Terracota: ["#e7b49c", "#984e32"],
  Paisaje: ["#b7d5aa", "#3c6839"], Viaje: ["#b7daf1", "#295d85"], Mar: ["#a9dce9", "#17627c"],
};

const state = { occasion: "XV Años", style: "ROSA", tier: "Ultra" };
const grid = document.querySelector("#product-grid");
const styleSwitch = document.querySelector("#style-switch");
const toast = document.querySelector("#toast");
const favorites = new Set(JSON.parse(localStorage.getItem("luni-favorites") || "[]"));
let toastTimer;

function icon(name) {
  return `<svg aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function tierName(tier) {
  return tier === "Ultra" ? "Ultra Premium" : tier;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3500);
}

function priceMarkup(tier) {
  const price = packageImages[tier];
  return price
    ? `<div class="price"><strong>$${price.usd} USD</strong><small>$${price.mxn.toLocaleString("es-MX")} MXN</small></div>`
    : `<div class="price price--contact"><small>Precio disponible por WhatsApp</small></div>`;
}

function packageInfo() {
  const image = packageImages[state.tier];
  return image
    ? `<figure class="package-info package-info--${state.tier.toLowerCase()}"><img src="${image.src}" alt="${image.alt}" loading="lazy" />${priceMarkup(state.tier)}</figure>`
    : "";
}

function coverMarkup(product) {
  const [light, dark] = palettes[product.group] || palettes[product.group.toUpperCase()] || ["#ecd8c8", "#765541"];
  const coverTitle = product.group === "TEMÁTICAS" ? product.label.replace(/^Modelo /, "") : product.group;
  const coverIcon = state.occasion === "Boda" ? "rings" : product.group === "XV HOMBRE" ? "people" : product.group === "TEMÁTICAS" ? "image" : "sparkle";
  return `<div class="product-card__cover" style="--cover-light:${light};--cover-dark:${dark}" role="img" aria-label="Portada ${escapeHtml(coverTitle)}">
    <span class="cover-art__ornament">✦</span>${icon(coverIcon)}<strong>${escapeHtml(coverTitle)}</strong><small>${escapeHtml(state.occasion)}</small>
  </div>`;
}

function styleOptions(items) {
  return [...new Set(items.map(({ group }) => group))];
}

function applyTheme() {
  const theme = state.occasion === "Boda" ? palettes.Diamante : palettes[state.style];
  const [light, dark] = theme || palettes.ROSA;
  document.documentElement.style.setProperty("--accent-light", light);
  document.documentElement.style.setProperty("--accent", dark);
}

function renderStyleSwitch(items) {
  if (state.occasion === "Boda") {
    styleSwitch.hidden = true;
    styleSwitch.innerHTML = "";
    return;
  }
  const options = styleOptions(items);
  if (!options.includes(state.style)) state.style = options[0];
  styleSwitch.hidden = false;
  styleSwitch.innerHTML = options.map((style) => `<button type="button" data-style="${escapeHtml(style)}" class="${style === state.style ? "is-active" : ""}" aria-pressed="${style === state.style}">${escapeHtml(style)}</button>`).join("");
}

function renderCard(product) {
  const key = `${state.occasion}-${state.tier}-${product.index}`;
  const favoriteLabel = favorites.has(key) ? "Quitar de favoritos" : "Agregar a favoritos";
  return `<article class="product-card">
    <button class="favorite" type="button" data-favorite="${key}" aria-label="${favoriteLabel}: ${escapeHtml(product.label)}" aria-pressed="${favorites.has(key)}">${icon("heart")}</button>
    <div class="product-card__photo">${coverMarkup(product)}</div>
    <div class="product-card__body">
      <p class="product-card__label">${escapeHtml(product.label)}</p>
      <h3>${escapeHtml(product.group)}</h3>
      ${priceMarkup(state.tier)}
      <p class="product-card__kind">${icon(state.occasion === "Boda" ? "rings" : "people")} Invitación interactiva</p>
      <div class="product-card__actions">
        <a class="button button--demo" href="${product.url}" target="_blank" rel="noopener noreferrer">${icon("eye")} Ver demo</a>
        <a class="button button--green" href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer">${icon("whatsapp")} Pedir este modelo</a>
      </div>
    </div>
  </article>`;
}

function render() {
  const tierItems = CATALOG_DATA[state.occasion][state.tier].map((product, index) => ({ ...product, index }));
  renderStyleSwitch(tierItems);
  applyTheme();
  const visible = state.occasion === "XV Años" ? tierItems.filter(({ group }) => group === state.style) : tierItems;
  const groupName = state.occasion === "XV Años" ? ` · ${state.style}` : "";

  document.querySelector(".hero h1").textContent = state.occasion;
  document.querySelector("#catalog-title").textContent = `${state.occasion}${groupName} · ${tierName(state.tier)}`;
  document.querySelector("#catalog-subtitle").textContent = `${visible.length} modelos en el orden del catálogo. Todos se pueden personalizar.`;
  grid.innerHTML = visible.map((product, index) => `${renderCard(product)}${index === 1 ? packageInfo() : ""}`).join("");

  document.querySelectorAll("[data-occasion]").forEach((button) => {
    const active = button.dataset.occasion === state.occasion;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  document.querySelectorAll("[data-tier]").forEach((button) => {
    const active = button.dataset.tier === state.tier;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

document.addEventListener("click", (event) => {
  const occasion = event.target.closest("[data-occasion]");
  const tier = event.target.closest("[data-tier]");
  const style = event.target.closest("[data-style]");
  const favorite = event.target.closest("[data-favorite]");

  if (occasion) { state.occasion = occasion.dataset.occasion; render(); }
  if (tier) { state.tier = tier.dataset.tier; render(); }
  if (style) { state.style = style.dataset.style; render(); }
  if (favorite) {
    const key = favorite.dataset.favorite;
    favorites.has(key) ? favorites.delete(key) : favorites.add(key);
    localStorage.setItem("luni-favorites", JSON.stringify([...favorites]));
    render();
    showToast(favorites.has(key) ? "Guardado en favoritos" : "Quitado de favoritos");
  }
});

render();

