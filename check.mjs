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
const select = (attribute, value) => onClick({ target: { closest: (selector) => selector === `[data-${attribute}]` ? { dataset: { [attribute]: value } } : null } });
assert.equal(get("#catalog-subtitle").textContent, "Todos los modelos se pueden adaptar al color que quieras");
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 15);
assert.match(grid.innerHTML, /<strong>\$74 USD<\/strong><small>\$1,450 MXN<\/small>/);
assert.equal((grid.innerHTML.match(/href="https:\/\/estudioluni\.com\/published\/up-md/g) || []).length, 15);
assert.equal((grid.innerHTML.match(/class="package-info /g) || []).length, 7);
assert.match(grid.innerHTML, /src="assets\/cover-01\.jpg"/);
assert.ok(grid.innerHTML.indexOf("Modelo 2") < grid.innerHTML.indexOf('class="package-info '));
assert.ok(grid.innerHTML.indexOf('class="package-info ') < grid.innerHTML.indexOf("Modelo 4"));
select("tier", "Premium");
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 15);
assert.match(grid.innerHTML, /paquete-premium\.png/);
assert.match(grid.innerHTML, /<strong>\$59 USD<\/strong><small>\$1,100 MXN<\/small>/);
select("occasion", "Boda");
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 8);
assert.match(grid.innerHTML, /data-favorite="boda-premium-1"/);
select("tier", "Intermedio");
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 8);
assert.match(grid.innerHTML, /<strong>\$45 USD<\/strong><small>\$900 MXN<\/small>/);
console.log("Catálogo: filtros y fichas correctos");
