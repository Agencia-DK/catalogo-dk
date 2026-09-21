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
assert.equal(get("#catalog-subtitle").textContent, "Todos los modelos se pueden adaptar al color que quieras");
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 4);
assert.match(grid.innerHTML, /<strong>\$74 USD<\/strong><small>\$1,450 MXN<\/small>/);
assert.equal((grid.innerHTML.match(/href="https:\/\/estudioluni\.com\/published\/up-md/g) || []).length, 4);
assert.equal((grid.innerHTML.match(/class="package-info /g) || []).length, 2);
assert.ok(grid.innerHTML.indexOf("Modelo 2") < grid.innerHTML.indexOf('class="package-info '));
assert.ok(grid.innerHTML.indexOf('class="package-info ') < grid.innerHTML.indexOf("Modelo 4"));
onClick({ target: { closest: (selector) => selector === "[data-tier]" ? { dataset: { tier: "Premium" } } : null } });
assert.match(grid.innerHTML, /Próximamente/);
assert.match(grid.innerHTML, /paquete-premium\.png/);
assert.match(grid.innerHTML, /<strong>\$59 USD<\/strong><small>\$1,100 MXN<\/small>/);
onClick({ target: { closest: (selector) => selector === "[data-tier]" ? { dataset: { tier: "Ultra" } } : null } });
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 4);
console.log("Catálogo: filtros y fichas correctos");
