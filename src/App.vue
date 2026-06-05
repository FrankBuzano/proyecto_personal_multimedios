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

const epipelagicaImgUrl = `${import.meta.env.BASE_URL}assets/svg/zona-epipelagica.png`;

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
            <template v-for="zone in zones" :key="zone.id">
                <marine-zone
                    v-if="zone.id === 'epipelagica'"
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
                        slot="image"
                        :src="epipelagicaImgUrl"
                        :alt="`Ilustracion de la zona ${zone.nombre}`"
                        decoding="async"
                    />
                </marine-zone>

                <marine-section
                    v-else
                    :id="`zona-${zone.id}`"
                    :zone-id="zone.id"
                    :name="zone.nombre"
                    :depth-range="depthRange(zone)"
                    :accent="zone.color_sugerido"
                    :darkness="darkness"
                >
                    <p class="zone__alt">{{ zone.nombre_alt }}</p>
                    <p class="zone__ambiente">{{ zone.ambiente }}</p>

                    <dl class="zone__facts">
                        <div class="zone__fact">
                            <dt>Luz</dt>
                            <dd>{{ zone.luz }}</dd>
                        </div>
                        <div class="zone__fact">
                            <dt>Temperatura</dt>
                            <dd>{{ zone.temp }}</dd>
                        </div>
                        <div class="zone__fact">
                            <dt>Presion</dt>
                            <dd>{{ zone.presion_atm }} atm</dd>
                        </div>
                    </dl>

                    <div class="zone__fauna">
                        <h3 class="zone__fauna-title">Fauna caracteristica</h3>
                        <ul class="zone__fauna-list">
                            <li v-for="especie in zone.fauna" :key="especie" class="zone__fauna-chip">
                                {{ especie }}
                            </li>
                        </ul>
                    </div>

                    <aside class="zone__curioso">
                        <strong>Dato curioso:</strong> {{ zone.dato_curioso }}
                    </aside>

                    <div slot="media" class="media-placeholder">
                        [SVG ilustrativo de "{{ zone.nombre }}" ira aqui]
                        <br />
                        [Pista de audio ambiente opcional]
                    </div>
                </marine-section>
            </template>
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

.zone__alt {
    margin: 0;
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.75;
}

.zone__ambiente {
    margin: 0;
    font-size: 1.02rem;
    line-height: 1.55;
}

.zone__facts {
    display: grid;
    gap: 0.75rem;
    margin: 0;
    padding: 0.85rem 1rem;
    background: rgba(0, 0, 0, 0.18);
    border-radius: 0.5rem;
}

.zone__fact {
    display: grid;
    grid-template-columns: 8rem 1fr;
    gap: 0.5rem;
    align-items: baseline;
}

.zone__fact dt {
    font-weight: 600;
    letter-spacing: 0.02em;
    opacity: 0.85;
}

.zone__fact dd {
    margin: 0;
}

.zone__fauna-title {
    margin: 0 0 0.5rem;
    font-size: 0.95rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.85;
}

.zone__fauna-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.zone__fauna-chip {
    padding: 0.25rem 0.6rem;
    border: 1px solid currentColor;
    border-radius: 999px;
    font-size: 0.88rem;
    background: rgba(255, 255, 255, 0.06);
}

.zone__curioso {
    border-left: 4px solid currentColor;
    padding: 0.6rem 0.9rem;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 0 0.5rem 0.5rem 0;
    font-size: 0.95rem;
}

.media-placeholder {
    border: 2px dashed currentColor;
    border-radius: 0.5rem;
    padding: 2rem 1rem;
    text-align: center;
    opacity: 0.6;
    font-style: italic;
}

.zone__svg {
    display: block;
    width: 100%;
    height: auto;
    min-height: 200px;
    max-height: 320px;
    object-fit: contain;
    border-radius: 0.5rem;
    border: 2px dashed rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.06);
}
</style>
