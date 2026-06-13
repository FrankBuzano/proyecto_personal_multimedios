# Referencias consultadas hasta este punto

## Uso de la IA (Chat GPT)

- **03.06.2026** — Guía para reutilizar código Vue como Web Components
  - Instrucciones: "cómo empaquetar un componente Vue 3 como web component"
  - Principales hallazgos:
    - Usar `defineCustomElement`.
    - Nombrar correctamente el tag HTML (`<mi-widget-popularidad>`).
    - Importar y exportar desde el entry-point (`main.ts`).
    - Opciones de configuración (`shadowRootMode`, `shadowRoot.delegatesFocus`).


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

