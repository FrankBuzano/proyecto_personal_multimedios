# Referencias consultadas hasta este punto

## Uso de la IA (Chat GPT)

- **03.06.2026** — Guía para reutilizar código Vue como Web Components
  - Instrucciones: "cómo empaquetar un componente Vue 3 como web component"
  - Principales hallazgos:
    - Usar `defineCustomElement`.
    - Nombrar correctamente el tag HTML (`<mi-widget-popularidad>`).
    - Importar y exportar desde el entry-point (`main.ts`).
    - Opciones de configuración (`shadowRootMode`, `shadowRoot.delegatesFocus`).


## Uso de la IA (Claude)

- **01.06.2026** — Consulta sobre organización inicial de componentes y composables
  - Instrucciones: "cómo separar una app Vue 3 entre custom elements y SFC internos, y dónde poner la lógica reactiva reutilizable"
  - Principales hallazgos:
    - Distinguir entre componentes expuestos como custom element (`<marine-audio>`) y SFC internos al proyecto (`ZoneNav`).
    - Extraer lógica reactiva reutilizable (oscurecer el fondo con el scroll) a un composable propio (`useScrollDarkness`) en lugar de dejarla en el componente.
    - Definir el contrato (props/emits) de cada pieza antes de implementar la lógica interna.

- **03.06.2026** — Consulta sobre oscurecimiento progresivo al scrollear
  - Instrucciones: "cómo hacer que el fondo y los textos se vayan oscureciendo a medida que el usuario baja por la página"
  - Principales hallazgos:
    - Mapear `scrollY / maxScroll` a un valor 0–1 actualizado dentro de `requestAnimationFrame` para no bloquear el scroll.
    - Usar `smoothstep` para curvas suaves de transición en lugar de un cambio lineal.
    - Exponer la progresión como variables CSS (`--page-darkness`, `--text-light`, `--bg-dark`) para que cada componente reaccione vía `color-mix`.

- **16.06.2026** — Consulta sobre lector de texto (TTS) integrado
  - Instrucciones: "cómo agregar un botón que lea en voz alta el texto de cada zona usando una API del navegador"
  - Principales hallazgos:
    - `window.speechSynthesis.getVoices()` es asíncrono en Chrome: hay que esperar el evento `voiceschanged` antes de elegir voz.
    - Diferir `synth.speak()` con `setTimeout(0)` evita un bug donde `cancel()` + `speak()` en el mismo tick deja el motor atascado.
    - Manejar `onend` / `onerror` en la `SpeechSynthesisUtterance` para resetear el estado `playing` del botón.

- **17.06.2026** — Consulta sobre componentes decorativos y navegación entre zonas
  - Instrucciones: "cómo simular bioluminiscencia en SVG para las zonas oscuras y agregar un botón flotante para saltar a la siguiente zona"
  - Principales hallazgos:
    - SVG inline con círculos posicionados manualmente y `animation` CSS para los puntos parpadeantes; el componente toma el color de la zona vía `currentColor`.
    - Botón `position: fixed` abajo-derecha con `aria-label` dinámico: cuando ya es la última zona el botón pasa a "volver al inicio".
    - Emitir un único evento `@go` desde el botón para que el padre (`App.vue`) decida el destino del scroll según el estado actual.

- **18.06.2026** — Consulta sobre optimización de rendimiento y SVG navegable
  - Instrucciones: "cómo aplicar las técnicas del slide de rendimiento (WebP, lazy loading, preload, AbortController) y cómo hacer un SVG accesible por teclado"
  - Principales hallazgos:
    - WebP reduce el peso de las imágenes; combinarlo con `loading="lazy"` y atributos `width`/`height` evita el CLS.
    - `<link rel="preload" as="fetch">` permite que el navegador baje el JSON en paralelo con el bundle JS en lugar de esperarlo.
    - `AbortController` con `addEventListener(..., { signal })` cancela listeners y timeouts pendientes en una sola operación.
    - SVG inline accesible: cada zona clickeable como `<g role="button" tabindex="0">` con soporte de teclado (Enter/Space).


## Vue 3 y plataforma web

### Vue 3 (framework)

- Documentación oficial — Composition API y `<script setup>`: <https://vuejs.org/guide/introduction.html>
- API: `defineCustomElement` (Custom Elements con Vue): <https://vuejs.org/guide/extras/web-components.html>
- API: `defineProps`, `defineEmits`, validación de eventos: <https://vuejs.org/api/sfc-script-setup.html>
- Reactividad: `ref` / `computed`: <https://vuejs.org/guide/essentials/reactivity-fundamentals.html>
- `onMounted` y ciclo de vida: <https://vuejs.org/guide/essentials/lifecycle.html>
- Slots y `<slot name="...">`: <https://vuejs.org/guide/components/slots.html>
- Renderizado condicional con `v-if` / `v-else` y `<template v-for>`: <https://vuejs.org/guide/essentials/conditional.html>
- Modificador `.prop` en bindings para pasar valores como propiedad (necesario al pasar arrays/objetos a custom elements): <https://vuejs.org/guide/extras/web-components.html#passing-dom-properties>
- Manejo de Shadow DOM y CSS Parts con `defineCustomElement`: <https://vuejs.org/guide/extras/web-components.html#sfc-as-custom-element>

### Curso en video — Vue.js 3 (jofradev)

Episodios consultados de la playlist *Curso de Vue.js 3 en Español 2024* del canal **jofradev** (José Barrientos) para reforzar los fundamentos del framework usado en el proyecto. Playlist completa: <https://www.youtube.com/playlist?list=PLg-z1C9R1jutezByZ3WmH8NE_JqYBsDOA>

- Cómo Crear Proyecto Vue 3 y subirlo a Github | Curso de Vue.js 3 - 01: <https://www.youtube.com/watch?v=h2uMXGzX58M>
- Fundamentos y Estructura de un Proyecto Vue 3 | Curso de Vue.js 3 - 02: <https://www.youtube.com/watch?v=EIwjp1Vs-q0>
- La reactividad y componentes en un Proyecto Vue 3 | Curso de Vue.js 3 - 03: <https://www.youtube.com/watch?v=oeCfkrNyTk0>
- Componentes Padres, Componentes Hijos y Props | Curso de Vue js 3 - 09: <https://www.youtube.com/watch?v=aPE5d2HBU-o>

### Plataforma web (estándares HTML/CSS)

- MDN — `<details>` y `<summary>` (acordeón nativo, accesible y sin JS): <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details>
- MDN — CSS Grid Layout (`grid-template-columns`, `grid-column`, `gap`): <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout>
- MDN — `::slotted()` (estilar contenido de un slot desde el Shadow DOM): <https://developer.mozilla.org/en-US/docs/Web/CSS/::slotted>
- MDN — `aspect-ratio` (para encuadrar imágenes de zona sin saltos de layout): <https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio>
- MDN — `color-mix()` (interpolación de colores usada para fondo, texto y bordes según `darkness`): <https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix>
- web.dev — Patrones accesibles con `<details>`: <https://web.dev/learn/html/details>

## Vida marina (datos de la infografía)

Fuentes utilizadas en `public/data/sections.json`. Los identificadores numéricos coinciden con el campo `fuentes` de cada zona dentro del JSON.

- [1] Exploring Our Fluid Earth, Univ. of Hawaii at Manoa — Depth Zones: <https://manoa.hawaii.edu/exploringourfluidearth/physical/ocean-depths/depth-zones>
- [2] Woods Hole Oceanographic Institution — Ocean Zones: <https://www.whoi.edu/ocean-learning-hub/ocean-topics/how-the-ocean-works/ocean-zones/>
- [3] Dummies — The 5 Vertical Zones of the Ocean's Water Column: <https://www.dummies.com/article/academics-the-arts/science/environmental-science/the-5-vertical-zones-of-the-oceans-water-column-284232/>
- [4] Sea and Sky — Layers of the Ocean: <http://www.seasky.org/deep-sea/ocean-layers.html>
- [5] Wikipedia — Bathypelagic zone: <https://en.wikipedia.org/wiki/Bathypelagic_zone>
- [6] NOAA Ocean Exploration — How far does light travel in the ocean?: <https://oceanexplorer.noaa.gov/facts/light-distributed.html>
- [8] Geosciences LibreTexts — Zones of Marine Environments: <https://geo.libretexts.org/Courses/Diablo_Valley_College/OCEAN-101:_Fundamentals_of_Oceanography_(Keddy)/15:_Introduction_to_Marine_Life/15.11:_Zones_of_Marine_Environments>
- [9] Ingman Marine — Understanding the Pelagic Zone: <https://www.ingmanmarine.com/article/pelagic-zone-101>
- [10] NOAA Ocean Exploration — What is the deepest-living fish?: <https://oceanexplorer.noaa.gov/ocean-fact/what-is-the-deepest-living-fish/>
- [11] Natural History Museum (Londres) — Deepest-ever fish filmed at 8,336 m: <https://www.nhm.ac.uk/discover/news/2023/april/deepest-ever-fish-filmed-depth-8336-metres.html>
- [12] EarthSky — How much do oceans add to world's oxygen?: <https://earthsky.org/earth/how-much-do-oceans-add-to-worlds-oxygen/>
- [13] NOAA Ocean Service — What is a thermocline?: <https://oceanservice.noaa.gov/facts/thermocline.html>
- [14] Guinness World Records — Deepest fish: <https://www.guinnessworldrecords.com/world-records/deepest-fish>
- [15] Wikipedia — Underwater camouflage (countershading en peces pelágicos): <https://en.wikipedia.org/wiki/Underwater_camouflage>
- [16] NOAA — Ocean acidification (educación y datos): <https://www.noaa.gov/education/resource-collections/ocean-coasts/ocean-acidification>
- [17] National Weather Service JetStream — Layers of the Ocean (capa de mezcla y termoclina): <https://w2.weather.gov/jetstream/layers_ocean>
- [18] Wikipedia — Bioluminescence (mecanismo luciferina/luciferasa, prevalencia en el mesopelágico, contra-iluminación): <https://en.wikipedia.org/wiki/Bioluminescence>
- [19] Wikipedia — Diel vertical migration (migración diaria del zooplancton y pequeños nectónicos; bomba biológica): <https://en.wikipedia.org/wiki/Diel_vertical_migration>
- [20] NOAA Ocean Exploration — What is marine snow?: <https://oceanexplorer.noaa.gov/facts/marine-snow.html>
- [21] Wikipedia — Anglerfish (parasitismo sexual del macho enano, *Ceratiidae*): <https://en.wikipedia.org/wiki/Anglerfish>
- [22] Wikipedia — Abyssal plain (geología y biodiversidad de las llanuras abisales): <https://en.wikipedia.org/wiki/Abyssal_plain>
- [23] Wikipedia — Whale fall (ecosistemas efímeros sobre cadáveres de cetáceos): <https://en.wikipedia.org/wiki/Whale_fall>
- [24] The Nippon Foundation–GEBCO Seabed 2030 Project (objetivo: mapear el 100% del fondo oceánico para 2030): <https://seabed2030.org/>
- [25] Wikipedia — Deep scattering layer (capa de dispersión profunda detectada por sonar): <https://en.wikipedia.org/wiki/Deep_scattering_layer>
- [26] MBARI — Barreleye, *Macropinna microstoma* (pez con cabeza transparente y ojos tubulares): <https://www.mbari.org/animal/barreleye/>
- [27] Wikipedia — Hadal zone (caracterización general de la zona hadal, fauna y gigantismo abisal): <https://en.wikipedia.org/wiki/Hadal_zone>
- [28] Wikipedia — Oceanic trench (formación de fosas por subducción y distribución en el Pacífico): <https://en.wikipedia.org/wiki/Oceanic_trench>
- [29] Wikipedia — Challenger Deep (historia de descensos tripulados: Trieste 1960, Cameron 2012): <https://en.wikipedia.org/wiki/Challenger_Deep>
- [30] Wikipedia — Mariana Trench (contaminación documentada y microplásticos en anfípodos hadales): <https://en.wikipedia.org/wiki/Mariana_Trench>

## Recursos multimedia

### Imágenes de las zonas oceánicas

Las tres ilustraciones de zonas (`public/assets/svg/zona-epipelagica.webp`, `zona-batipelagica.webp`, `zona-hadopelagica.webp`) fueron **creadas manualmente en Canva Pro**, combinando elementos premium incluidos en la suscripción y descargadas con licencia de Canva Pro.

- Canva Pro — Herramienta de diseño usada para componer cada zona a partir de elementos premium: <https://www.canva.com/pro/>
- Las composiciones se exportaron originalmente como PNG (1000×1000 px) y se convirtieron a WebP (`quality: 82`) con `sharp` para optimizar el peso de transferencia (~30% de reducción promedio).
- Las zonas mesopelágica y abisopelágica no usan PNG: se generan en tiempo de render con el componente `ZoneBioluminescence.vue` (SVG inline con puntos animados que simulan bioluminiscencia), por lo que no son archivos multimedia descargados.

