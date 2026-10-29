# Catálogo piloto

Esta carpeta registra la preparación e integración local de las referencias publicadas en el catálogo piloto. Los manifiestos separan datos confirmados, recursos visuales y pendientes. La integración local no equivale a despliegue en producción ni valida certificaciones, unidades comerciales o especificaciones pendientes.

## Convención de archivos derivados

Los originales permanecen en sus ubicaciones actuales y no se sobrescriben. Los archivos aprobados para web se guardarán así:

```text
public/productos/catalogo/<codigo>/
  principal.webp
  principal.avif
  perfil.webp
  perfil.avif
  textura.mp4
  textura-poster.webp
  manifest.json
```

El código usa tres dígitos. Los nombres `principal`, `perfil` y `textura` describen el rol del recurso, no el ángulo supuesto por el nombre del archivo original.

## Captura mínima por referencia

1. Vista superior o cenital, con escala y color controlados.
2. Vista lateral, mostrando base, borde y altura sin exageraciones.
3. Video real de 4 a 6 segundos con una mano desplazándose sobre la superficie. Debe mostrar textura y movimiento sin afirmar propiedades no medidas.

Usar iluminación difusa, fondo neutro y la misma referencia física en los tres recursos. Incluir una carta gris o referencia de color en una toma de control que no se publicará.

## Certificaciones

Una norma o certificación solo pasa a `VERIFICADA` cuando existe un documento que identifica referencia, emisor, resultado, fecha y alcance. La palabra “certificado” en una lista comercial no es evidencia suficiente.

## Aprobación

Antes de publicar, deben confirmarse código, precio, unidad, correspondencia de imágenes, especificaciones técnicas y fuentes documentales. Los estados `POR_VERIFICAR`, `FALTA_CAPTURA_REAL` y `CANDIDATO_PENDIENTE_QA` bloquean la publicación.
