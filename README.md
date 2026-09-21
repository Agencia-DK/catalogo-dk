# Catálogo Luni Estudio

Catálogo web estático basado en las capturas de referencia. No requiere instalación ni dependencias.

## Verlo localmente

Ejecuta `node server.mjs` y abre `http://localhost:5173`.

## Cambiar el contenido

- En `script.js`, reemplaza `WHATSAPP_NUMBER` por el número del negocio con lada y solo dígitos (ejemplo: `5215512345678`).
- Edita `products` para cambiar modelos, imágenes, categorías, niveles y enlaces de demo.
- Los precios se toman del paquete correspondiente en `packageImages` y muestran USD primero, MXN debajo. Los cuatro modelos visibles enlazan a las demos proporcionadas.
- Sustituye las imágenes de `assets/` por las fotos oficiales. Las imágenes actuales son provisionales y generadas para esta maqueta.
- Las fichas `paquete-*.png` son las imágenes proporcionadas para Intermedio, Premium y Ultra; se muestran después de cada dos modelos.

Los filtros sin productos muestran “Próximamente” hasta que se agreguen modelos reales. Los botones de WhatsApp se activan al configurar el número.
