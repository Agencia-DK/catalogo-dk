# Catálogo Luni Estudio

Catálogo web estático basado en las capturas de referencia. No requiere instalación ni dependencias.

## Verlo localmente

Ejecuta `node server.mjs` y abre `http://localhost:5173`.

## Cambiar el contenido

- En `script.js`, cambia `WHATSAPP_URL` si se modifica el enlace de contacto.
- Edita `catalog-data.js` para cambiar modelos, categorías, niveles y enlaces de demo; el orden del archivo es el orden del catálogo.
- Las portadas usan los colores de `palettes` en `script.js` para representar cada color o tipo de evento.
- Los precios se toman del paquete correspondiente en `packageImages` y muestran USD primero, MXN debajo.
- Las portadas `cover-*.jpg` provienen de las fotos compartidas. `portada.jpg` sigue siendo una imagen provisional de la cabecera.
- Las fichas `paquete-*.png` son las imágenes proporcionadas para Intermedio, Premium y Ultra; se muestran después de cada dos modelos.

Los botones de pedido abren el enlace de WhatsApp configurado. Básico muestra “Precio disponible por WhatsApp” porque no se proporcionó un precio ni una ficha para ese nivel.
