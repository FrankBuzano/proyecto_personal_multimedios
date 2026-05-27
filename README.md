# Vida marina profunda — Infografía animada

Proyecto del curso de Multimedios. Infografía web sobre las zonas verticales del océano: a medida que el usuario desciende por la página, los colores se oscurecen, aparecen especies características de cada zona y se pueden activar narraciones de audio haciendo clic sobre cada sección.

## Framework elegido: **Vue 3**

Se usa Vue 3 con Composition API y `<script setup>`.

## Cómo ejecutar

```bash
pnpm install      # primera vez
pnpm dev          # servidor de desarrollo en http://localhost:1234
pnpm build        # build de producción a /dist
pnpm preview      # previsualizar el build
```

## Estructura

```
.
├── public/
│   ├── data/
│   │   └── sections.json        ← datos cargados por fetch al montar
│   └── assets/
│       ├── svg/                 ← (pendiente) SVG propios de cada zona
│       └── audio/               ← (pendiente) clips de narración (≥3)
├── src/
│   ├── index.html               ← entrada de Vite
│   ├── index.css                ← estilos globales del host (no entran al Shadow DOM)
│   ├── index.js                 ← registra custom elements y monta la app Vue
│   ├── App.vue                  ← SFC raíz; hace fetch y orquesta estado
│   └── components/
│       └── InfographicSection.ce.vue   ← <marine-section>: primer componente, Custom Element
├── vite.config.js
├── REFERENCIAS.md
└── README.md
```

## Decisiones de diseño clave

1. **Híbrido SFC + Custom Element**: la "shell" (`App.vue`) es un SFC normal; los componentes públicos reutilizables se exponen como custom elements. Cumplimos el requisito de WebComponents *de verdad* sin tener que renunciar al ecosistema Vue.
2. **JSON en `public/data/`**: queda servido como recurso estático en dev y en build, así `fetch()` funciona con la misma URL en ambos entornos.
3. **Theming por CSS custom properties + `::part()`**: las custom properties atraviesan el Shadow Boundary, así que pasar `--darkness` desde el host es suficiente para tematizar el interior sin romper la encapsulación.
4. **Sin Tailwind/Bootstrap por ahora**: el efecto visual depende de variables CSS dinámicas controladas por scroll; un framework de utilidades estorbaría más que ayudaría. Si se quiere agregar luego, no rompe nada.