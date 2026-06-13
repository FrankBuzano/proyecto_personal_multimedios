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
│   │   └── sections.json                  ← datos cargados por fetch al montar
│   └── assets/
│       ├── svg/                           ← (pendiente) SVG propios de cada zona
│       └── audio/                         ← (pendiente) clips de narración (≥3)
├── src/
│   ├── index.html                         ← entrada de Vite
│   ├── index.css                          ← estilos globales del host (no entran al Shadow DOM)
│   ├── index.js                           ← registra custom elements y monta la app Vue
│   ├── App.vue                            ← SFC raíz; hace fetch y orquesta estado
│   ├── components/
│   │   ├── InfographicSection.ce.vue      ← <marine-section>: contenedor de zona (Custom Element)
│   │   ├── AudioPlayer.ce.vue             ← <marine-audio>: reproductor de narración (Custom Element, skeleton)
│   │   └── ZoneNav.vue                    ← navegación entre zonas (SFC interno, skeleton)
│   └── composables/
│       └── useScrollDarkness.js           ← scroll vertical → ref 'darkness' 0..1 (skeleton)
├── vite.config.js
├── Notas.md                               ← decisiones de diseño detalladas
├── REFERENCIAS.md
└── README.md
```

