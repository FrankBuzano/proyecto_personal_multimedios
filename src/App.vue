<script setup>
import { onMounted, ref, computed, nextTick } from "vue";
import ZoneNav from "./components/ZoneNav.vue";
import { useScrollDarkness } from "./composables/useScrollDarkness.js";

const data = ref(null);
const error = ref(null);
const { darkness } = useScrollDarkness();

const zones = computed(() => data.value?.zonas ?? []);
const title = computed(() => data.value?._meta?.titulo ?? "Cargando...");

const navZones = computed(() =>
    zones.value.map((z) => ({
        id: z.id,
        name: z.nombre,
        depthRange: depthRange(z),
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
    epipelagica: `${import.meta.env.BASE_URL}assets/svg/zona-epipelagica.png`,
    batipelagica: `${import.meta.env.BASE_URL}assets/svg/zona-batipelagica.png`,
};

onMounted(async () => {
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
            <h1>{{ title }}</h1>
            <p class="page__intro">
                Un descenso por las cinco zonas verticales del oceano: a medida que bajamos, la luz
                se apaga, la presion aumenta y la vida toma formas cada vez mas extranas.
            </p>
        </header>

        <p v-if="error" role="alert" class="page__error">
            No se pudo cargar la informacion: {{ error }}
        </p>

        <ZoneNav v-if="zones.length" :zones="navZones" @select="scrollToZone" />

        <div class="page__zones">
            <marine-zone
                v-for="zone in zones"
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
                    decoding="async"
                />
            </marine-zone>
        </div>
    </main>
</template>

<style scoped>
.page {
    max-width: 960px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

.page__header h1 {
    margin: 0 0 0.5rem;
    font-size: clamp(1.75rem, 4vw, 2.5rem);
}

.page__intro {
    margin: 0 0 2rem;
    color: color-mix(in srgb, var(--c-ink) 75%, transparent);
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
    margin-top: 1.5rem;
}
</style>
