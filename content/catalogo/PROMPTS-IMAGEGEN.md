# Prompts de edición del piloto

Modo usado: ImageGen integrado, edición de una fotografía local inspeccionada previamente. Los originales no se sobrescriben.

## Vista principal

```text
Use case: precise-object-edit
Asset type: fotografía principal para ficha web de producto Decorgrass, referencia [CÓDIGO], variante [VARIANTE]
Primary request: editar profesionalmente esta fotografía real; limpiar únicamente fondo, encuadre e iluminación
Input images: Image 1 is the edit target and source of truth
Scene/backdrop: fondo de estudio blanco cálido muy suave y uniforme
Subject: conservar exactamente la misma muestra
Style/medium: fotografía comercial realista, no render 3D
Composition/framing: vista superior casi cenital, muestra completa centrada, márgenes uniformes, formato horizontal 4:3
Lighting/mood: iluminación difusa de estudio y sombra de contacto suave
Materials/textures: conservar fibras, tonos, densidad, base, bordes e imperfecciones reales
Constraints: change only background cleanliness, exposure, white balance, crop and natural contact shadow; keep geometry, fiber count, fiber length, density, exact color, backing and imperfections unchanged; no text; no logos; no watermark
Avoid: rellenar huecos, aumentar densidad, cambiar color, inventar textura, cambiar altura o crear una muestra distinta
```

## Vista de perfil

```text
Use case: precise-object-edit
Asset type: fotografía lateral técnica para ficha web de producto Decorgrass, referencia [CÓDIGO], variante [VARIANTE]
Primary request: editar profesionalmente esta fotografía real manteniendo la vista lateral que muestra perfil, fibras y base
Input images: Image 1 is the edit target and source of truth
Scene/backdrop: fondo de estudio blanco cálido muy suave y uniforme
Subject: conservar exactamente la misma muestra
Style/medium: fotografía comercial realista, no render 3D
Composition/framing: vista lateral a nivel de la muestra, producto centrado, base visible, márgenes uniformes, formato horizontal 4:3
Lighting/mood: iluminación difusa de estudio y sombras de contacto suaves
Materials/textures: conservar fibras, tonos, densidad, base, irregularidades y altura aparente
Constraints: change only background cleanliness, exposure, white balance, crop and natural contact shadow; keep geometry, fiber count, fiber length, density, exact color, backing and imperfections unchanged; no ruler; no text; no logos; no watermark
Avoid: aumentar densidad o altura, enderezar artificialmente las fibras, ocultar la base, inventar una escala o cambiar el color
```

La textura con mano no se genera con IA. Requiere video o secuencia fotográfica real de la referencia física.

## Variantes roja y amarilla de la referencia 024

Se reutilizaron los prompts anteriores con `[CÓDIGO] = 024` y `[VARIANTE] = rojo` o `amarillo`. La vista principal se aplicó a `24.2.JPEG` y `24.4.JPEG`; la vista de perfil a `24.3.JPEG` y `24.5.JPEG`.

En todas las ediciones se exigió conservar el color exacto, las fibras, la densidad, la base negra, las proporciones y el ángulo de la fotografía original. Solo se autorizó limpiar fondo, equilibrar iluminación, encuadrar y añadir una sombra de contacto natural.

## Lote 003, 013 y 014

Se aplicó edición precisa sobre las dos fotografías reales de cada referencia: principal y perfil. El prompt restringe la edición al fondo blanco cálido, balance conservador de exposición, encuadre 4:3 y sombra de contacto. Se debe conservar sin reconstrucción el color, la forma de las fibras, la densidad, la altura visible, el relleno rizado, el respaldo negro, las proporciones y el ángulo de cámara de cada original.

No se generó la tercera toma de textura con una mano porque debe provenir de una captura real para no fabricar evidencia visual del comportamiento del producto.

## Lote 026, 028 y 029

Se aplicó la misma edición precisa y conservadora a las vistas principal y de perfil de las referencias 026, 028 y 029. En la referencia 026 se publicará únicamente la variante azul disponible; la variante blanca queda pendiente de fotografía real.

La referencia 023 no se procesó en este lote porque sus dos archivos muestran ángulos laterales muy similares y no existe una toma cenital real que pueda usarse como vista principal.
