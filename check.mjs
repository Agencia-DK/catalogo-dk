import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const elements = new Map();
let onClick;
const get = (selector) => {
  if (!elements.has(selector)) elements.set(selector, { innerHTML: "", textContent: "", addEventListener() {} });
  return elements.get(selector);
};

vm.runInNewContext(readFileSync("script.js", "utf8"), {
  document: {
    querySelector: get,
    querySelectorAll: () => [],
    addEventListener: (type, callback) => { if (type === "click") onClick = callback; },
  },
  localStorage: { getItem: () => null, setItem() {} },
  setTimeout,
  clearTimeout,
});

const grid = get("#product-grid");
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 4);
onClick({ target: { closest: (selector) => selector === "[data-tier]" ? { dataset: { tier: "Básico" } } : null } });
assert.match(grid.innerHTML, /Próximamente/);
onClick({ target: { closest: (selector) => selector === "[data-tier]" ? { dataset: { tier: "Ultra" } } : null } });
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 4);
console.log("Catálogo: filtros básicos correctos");
