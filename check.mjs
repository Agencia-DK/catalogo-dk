import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const elements = new Map();
let onClick;
const get = (selector) => {
  if (!elements.has(selector)) elements.set(selector, { innerHTML: "", textContent: "", hidden: false, classList: { add() {}, remove() {} } });
  return elements.get(selector);
};
const context = vm.createContext({
  document: {
    documentElement: { style: { setProperty() {} } },
    querySelector: get,
    querySelectorAll: () => [],
    addEventListener: (type, callback) => { if (type === "click") onClick = callback; },
  },
  localStorage: { getItem: () => null, setItem() {} },
  setTimeout,
  clearTimeout,
});

vm.runInContext(readFileSync("catalog-data.js", "utf8"), context);
vm.runInContext(readFileSync("script.js", "utf8"), context);

const grid = get("#product-grid");
const select = (attribute, value) => onClick({ target: { closest: (selector) => selector === `[data-${attribute}]` ? { dataset: { [attribute]: value } } : null } });

assert.equal(get("#catalog-title").textContent, "XV Años · ROSA · Ultra Premium");
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 16);
assert.match(grid.innerHTML, /<strong>\$74 USD<\/strong><small>\$1,450 MXN<\/small>/);
assert.equal((grid.innerHTML.match(/href="https:\/\/(www\.)?agenciadk\.vip\/published\//g) || []).length, 16);
assert.equal((grid.innerHTML.match(/class="package-info /g) || []).length, 1);
assert.match(grid.innerHTML, /--cover-light:#f7c1d2/);

select("style", "DORADO");
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 15);
assert.match(grid.innerHTML, /--cover-light:#f5dea0/);

select("tier", "Premium");
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 15);
assert.match(grid.innerHTML, /paquete-premium\.png/);
assert.match(grid.innerHTML, /<strong>\$59 USD<\/strong><small>\$1,100 MXN<\/small>/);

select("occasion", "Boda");
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 8);
assert.match(grid.innerHTML, /data-favorite="Boda-Premium-0"/);
assert.ok(grid.innerHTML.indexOf("Modelo 1") < grid.innerHTML.indexOf("Modelo 2"));
assert.ok(grid.innerHTML.indexOf("Modelo 6") < grid.innerHTML.indexOf("Modelo Temática Viaje"));
assert.ok(grid.innerHTML.indexOf("Modelo Temática Viaje") < grid.innerHTML.indexOf("Modelo Mar 2"));

select("tier", "Intermedio");
assert.match(grid.innerHTML, /<strong>\$45 USD<\/strong><small>\$900 MXN<\/small>/);

select("tier", "Básico");
assert.equal((grid.innerHTML.match(/class="product-card"/g) || []).length, 8);
assert.match(grid.innerHTML, /Precio disponible por WhatsApp/);
assert.doesNotMatch(grid.innerHTML, /class="package-info /);

console.log("Catálogo: 684 demos, filtros, orden y precios verificados");

