<script setup>
import { onMounted, onBeforeUnmount, ref, computed, nextTick, watch } from "vue";
import ZoneDiagram from "./components/ZoneDiagram.vue";
import ZoneBioluminescence from "./components/ZoneBioluminescence.vue";
import NextZoneButton from "./components/NextZoneButton.vue";
import { useScrollDarkness } from "./composables/useScrollDarkness.js";

const data = ref(null);
const error = ref(null);
const { darkness } = useScrollDarkness();

const zones = computed(() => data.value?.zonas ?? []);
const title = computed(() => data.value?._meta?.titulo ?? "Cargando...");

const activeIndex = ref(-1);
let scrollRaf = 0;

const isLastZone = computed(
    () => zones.value.length > 0 && activeIndex.value === zones.value.length - 1,
);
const currentAccent = computed(
    () => zones.value[activeIndex.value]?.color_sugerido ?? null,
);
const activeZoneId = computed(
    () => zones.value[activeIndex.value]?.id ?? null,
);

function updateActiveZone() {
    scrollRaf = 0;
    const threshold = window.innerHeight * 0.25;
    let idx = -1;
    const zs = zones.value;
    for (let i = 0; i < zs.length; i++) {
        const el = document.getElementById(`zona-${zs[i].id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) {
            idx = i;
        } else {
            break;
        }
    }
    if (idx < zs.length - 1) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (window.scrollY >= maxScroll - 2) idx = zs.length - 1;
    }
    activeIndex.value = idx;
}

function onScroll() {
    if (scrollRaf) return;
    scrollRaf = requestAnimationFrame(updateActiveZone);
}

watch(
    () => zones.value.length,
    async (n) => {
        if (n > 0) {
            await nextTick();
            updateActiveZone();
        }
    },
);

onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
});

function goNextOrTop() {
    if (isLastZone.value) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
    }
    const targetIdx = activeIndex.value < 0 ? 0 : activeIndex.value + 1;
    const target = zones.value[targetIdx];
    if (target) scrollToZone({ id: target.id });
}

const navZones = computed(() =>
    zones.value.map((z) => ({
        id: z.id,
        name: z.nombre,
        depthRange: depthRange(z),
        depthMin: z.prof_min_m,
        depthMax: z.prof_max_m,
        accent: z.color_sugerido,
    })),
);

function depthRange(zone) {
    return `${zone.prof_min_m} - ${zone.prof_max_m} m`;
}

function zoneBlocks(zone) {
    const base = [
        { id: "luz", titulo: "Luz", contenido: zone.luz },
        { id: "temp", titulo: "Temperatura", contenido: zone.temp },
        { id: "presion", titulo: "Presion", contenido: `${zone.presion_atm} atm` },
        { id: "curioso", titulo: "Dato curioso", contenido: zone.dato_curioso },
    ];
    const extra = (zone.secciones_extra ?? []).map((s) => ({
        id: s.id,
        titulo: s.titulo,
        contenido: s.contenido,
    }));
    return [...base, ...extra];
}

const zoneImages = {
    epipelagica: `${import.meta.env.BASE_URL}assets/svg/zona-epipelagica.webp`,
    batipelagica: `${import.meta.env.BASE_URL}assets/svg/zona-batipelagica.webp`,
    hadopelagica: `${import.meta.env.BASE_URL}assets/svg/zona-hadopelagica.webp`,
};

onMounted(async () => {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/sections.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data.value = await res.json();
    } catch (err) {
        error.value = err.message ?? String(err);
    }
});

async function scrollToZone({ id }) {
    await nextTick();
    const el = document.getElementById(`zona-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}
</script>

<template>
    <main class="page">
        <header class="page__header">
            <h1 class="page__title">{{ title }}</h1>
            <p class="page__intro">
                Un descenso por las cinco zonas verticales del oceano: a medida que bajamos, la luz
                se apaga, la presion aumenta y la vida toma formas cada vez mas extranas.
            </p>
            <div class="page__hint" aria-hidden="true">
                <span class="page__hint-line"></span>
                <span class="page__hint-text">Comienza el descenso</span>
                <span class="page__hint-arrow">&#9662;</span>
            </div>
        </header>

        <p v-if="error" role="alert" class="page__error">
            No se pudo cargar la informacion: {{ error }}
        </p>

        <aside v-if="zones.length" class="page__sidebar">
            <ZoneDiagram
                :zones="navZones"
                :active-id="activeZoneId"
                @select="scrollToZone"
            />
        </aside>

        <div class="page__zones">
            <marine-zone
                v-for="(zone, idx) in zones"
                :key="zone.id"
                :id="`zona-${zone.id}`"
                :zone-id="zone.id"
                :name="zone.nombre"
                :name-alt="zone.nombre_alt"
                :depth-range="depthRange(zone)"
                :ambiente="zone.ambiente"
                :fauna.prop="zone.fauna"
                :blocks.prop="zoneBlocks(zone)"
                :accent="zone.color_sugerido"
                :darkness="darkness"
            >
                <img
                    v-if="zoneImages[zone.id]"
                    slot="image"
                    :src="zoneImages[zone.id]"
                    :alt="`Ilustracion de la zona ${zone.nombre}`"
                    width="1000"
                    height="1000"
                    :loading="idx === 0 ? 'eager' : 'lazy'"
                    decoding="async"
                />
                <ZoneBioluminescence
                    v-else
                    slot="image"
                    :style="{ color: zone.color_sugerido }"
                />
            </marine-zone>
        </div>

        <NextZoneButton
            v-if="zones.length"
            :is-last="isLastZone"
            :accent="currentAccent"
            @go="goNextOrTop"
        />
    </main>
</template>

<style scoped>
.page {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.page__header {
    position: relative;
    margin-bottom: 2.5rem;
    padding-block: 1.5rem 0;
}

.page__title {
    --title-ink: color-mix(
        in srgb,
        var(--c-ink) calc((1 - var(--text-light, 0)) * 100%),
        var(--c-ink-bright)
    );
    margin: 0 0 0.65rem;
    font-size: clamp(2rem, 5.4vw, 3.1rem);
    line-height: 1.08;
    letter-spacing: -0.005em;
    font-weight: 800;
    position: relative;
    display: inline-block;
    padding-bottom: 0.45rem;
    background: linear-gradient(
        180deg,
        var(--title-ink) 0%,
        color-mix(in srgb, var(--title-ink) 75%, var(--c-accent) 25%) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
}

.page__title::after {
    content: "";
    position: absolute;
    left: 0;
    right: 35%;
    bottom: 0;
    height: 2px;
    background: linear-gradient(
        to right,
        var(--c-accent) 0%,
        color-mix(in srgb, var(--c-accent) 35%, transparent) 60%,
        transparent 100%
    );
    border-radius: 2px;
}

.page__intro {
    margin: 0 0 1.6rem;
    max-width: 42rem;
    font-size: 1.02rem;
    line-height: 1.65;
    color: color-mix(in srgb, var(--c-ink) calc((1 - var(--text-light, 0)) * 78% + var(--text-light, 0) * 85%), transparent);
}

.page__hint {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    opacity: 0.7;
}

.page__hint-line {
    width: 2rem;
    height: 1px;
    background: linear-gradient(
        to right,
        transparent,
        currentColor 80%
    );
}

.page__hint-arrow {
    display: inline-flex;
    animation: hint-bob 2.2s ease-in-out infinite;
    font-size: 0.95rem;
    color: var(--c-accent);
}

@keyframes hint-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(3px); }
}

@media (prefers-reduced-motion: reduce) {
    .page__hint-arrow {
        animation: none;
    }
}

.page__error {
    background: #ffe4e4;
    color: #7a0000;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
}

.page__zones {
    display: grid;
    gap: 1.25rem;
    margin-top: 2.5rem;
}

.page__sidebar {
    margin: 0 auto 1.5rem;
    max-width: 240px;
}

@media (min-width: 1280px) {
    .page__sidebar {
        position: fixed;
        top: 50%;
        left: calc((100vw - 960px) / 4);
        transform: translate(-50%, -50%);
        width: clamp(140px, calc((100vw - 960px) / 2 - 32px), 220px);
        max-width: 220px;
        margin: 0;
        z-index: 5;
    }
}
</style>
