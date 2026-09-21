# Catálogo Luni Estudio

Catálogo web estático basado en las capturas de referencia. No requiere instalación ni dependencias.

## Verlo localmente

Ejecuta `node server.mjs` y abre `http://localhost:5173`.

## Cambiar el contenido

- En `script.js`, reemplaza `WHATSAPP_NUMBER` por el número del negocio con lada y solo dígitos (ejemplo: `5215512345678`).
- Edita `demoPaths` para cambiar modelos, categorías, niveles y enlaces de demo; `covers` determina las fotos que se repiten.
- Los precios se toman del paquete correspondiente en `packageImages` y muestran USD primero, MXN debajo.
- Las portadas `cover-*.jpg` provienen de las fotos compartidas. `portada.jpg` sigue siendo una imagen provisional de la cabecera.
- Las fichas `paquete-*.png` son las imágenes proporcionadas para Intermedio, Premium y Ultra; se muestran después de cada dos modelos.

Los filtros sin productos muestran “Próximamente” hasta que se agreguen modelos reales. Los botones de WhatsApp se activan al configurar el número.
