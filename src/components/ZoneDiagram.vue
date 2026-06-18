<script setup>
import { computed } from "vue";

const props = defineProps({
    zones: { type: Array, required: true },
    activeId: { type: String, default: null },
});

const emit = defineEmits({
    select: (payload) => typeof payload?.id === "string",
});

const VB_W = 220;
const VB_H = 520;

const bands = computed(() => {
    const items = props.zones.map((z) => {
        const min = Number(z.depthMin ?? 0);
        const max = Number(z.depthMax ?? min + 1);
        const range = Math.max(max - min, 1);
        return { ...z, weight: Math.log2(range + 1) };
    });
    const total = items.reduce((a, b) => a + b.weight, 0);
    let y = 0;
    return items.map((it) => {
        const h = (it.weight / total) * VB_H;
        const band = { ...it, y, h, midY: y + h / 2 };
        y += h;
        return band;
    });
});

const activeBand = computed(
    () => bands.value.find((b) => b.id === props.activeId) ?? null,
);

function activate(id) {
    emit("select", { id });
}

function onKey(e, id) {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate(id);
    }
}
</script>

<template>
    <nav class="diagram" aria-label="Mapa interactivo de zonas oceanicas">
        <p class="diagram__caption" aria-hidden="true">Mapa de profundidades</p>
        <svg
            class="diagram__svg"
            :viewBox="`0 0 ${VB_W} ${VB_H}`"
            preserveAspectRatio="xMidYMid meet"
            role="presentation"
        >
            <defs>
                <linearGradient id="diagram-ocean" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#cfecff" />
                    <stop offset="18%" stop-color="#4fa6da" />
                    <stop offset="55%" stop-color="#093a5f" />
                    <stop offset="100%" stop-color="#010812" />
                </linearGradient>
            </defs>

            <rect
                class="diagram__bg"
                x="0"
                y="0"
                :width="VB_W"
                :height="VB_H"
                fill="url(#diagram-ocean)"
            />

            <g
                v-for="band in bands"
                :key="band.id"
                class="diagram__band"
                :class="{ 'diagram__band--active': band.id === activeId }"
                :style="{ '--zone-accent': band.accent }"
                role="button"
                tabindex="0"
                :aria-label="`Ir a ${band.name}, profundidad ${band.depthRange}`"
                :aria-current="band.id === activeId ? 'true' : 'false'"
                @click="activate(band.id)"
                @keydown="onKey($event, band.id)"
            >
                <rect
                    class="diagram__band-hit"
                    x="0"
                    :y="band.y"
                    :width="VB_W"
                    :height="band.h"
                />
                <text
                    class="diagram__band-name"
                    x="14"
                    :y="band.midY - 2"
                >{{ band.name }}</text>
                <text
                    class="diagram__band-depth"
                    x="14"
                    :y="band.midY + 14"
                >{{ band.depthRange }}</text>
            </g>

            <g
                v-if="activeBand"
                class="diagram__marker"
                :style="{ '--marker-y': `${activeBand.midY}px` }"
                aria-hidden="true"
            >
                <polygon points="0,0 10,7 0,14" />
            </g>
        </svg>
    </nav>
</template>

<style scoped>
.diagram {
    color: inherit;
}

.diagram__caption {
    margin: 0 0 0.45rem;
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    opacity: 0.72;
}

.diagram__svg {
    display: block;
    width: 100%;
    border-radius: 0.55rem;
    overflow: hidden;
    box-shadow:
        0 6px 22px rgba(0, 0, 0, 0.22),
        0 0 0 1px color-mix(in srgb, currentColor 14%, transparent);
}

.diagram__band {
    cursor: pointer;
    outline: none;
}

.diagram__band-hit {
    fill: transparent;
    stroke: color-mix(in srgb, white 12%, transparent);
    stroke-width: 0.6;
    transition:
        fill 200ms ease,
        stroke 200ms ease,
        stroke-width 200ms ease;
}

.diagram__band:hover .diagram__band-hit {
    fill: color-mix(in srgb, var(--zone-accent, white) 22%, transparent);
    stroke: color-mix(in srgb, var(--zone-accent, white) 80%, transparent);
    stroke-width: 1.2;
}

.diagram__band:focus-visible .diagram__band-hit {
    stroke: var(--zone-accent, white);
    stroke-width: 2;
}

.diagram__band--active .diagram__band-hit {
    fill: color-mix(in srgb, var(--zone-accent, white) 30%, transparent);
    stroke: var(--zone-accent, white);
    stroke-width: 1.6;
}

.diagram__band-name {
    fill: #ffffff;
    font-size: 12px;
    font-weight: 600;
    pointer-events: none;
    paint-order: stroke;
    stroke: rgba(0, 0, 0, 0.55);
    stroke-width: 2.4;
    stroke-linejoin: round;
}

.diagram__band-depth {
    fill: rgba(255, 255, 255, 0.85);
    font-size: 10px;
    pointer-events: none;
    font-variant-numeric: tabular-nums;
    paint-order: stroke;
    stroke: rgba(0, 0, 0, 0.55);
    stroke-width: 2.4;
    stroke-linejoin: round;
}

.diagram__marker {
    transform: translate(2px, var(--marker-y, 0)) translateY(-7px);
    transition: transform 360ms cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
}

.diagram__marker polygon {
    fill: var(--c-accent, #f4a261);
    filter: drop-shadow(
        0 0 5px color-mix(in srgb, var(--c-accent, #f4a261) 70%, transparent)
    );
    animation: diagram-marker-pulse 2.4s ease-in-out infinite;
    transform-origin: 5px 7px;
}

@keyframes diagram-marker-pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
}

@media (prefers-reduced-motion: reduce) {
    .diagram__marker {
        transition: none;
    }
    .diagram__marker polygon {
        animation: none;
    }
}
</style>
