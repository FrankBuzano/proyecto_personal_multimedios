<script setup>
import { onMounted, ref, computed } from "vue";

const data = ref(null);
const error = ref(null);
const activeZoneId = ref(null);

const activeZone = computed(() => {
    if (!data.value) return null;
    return data.value.zones.find((z) => z.id === activeZoneId.value) ?? data.value.zones[0];
});

onMounted(async () => {
    try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/sections.json`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data.value = await res.json();
        activeZoneId.value = data.value.zones[0]?.id ?? null;
    } catch (err) {
        error.value = err.message ?? String(err);
    }
});

function handleActivate(event) {
    activeZoneId.value = event.detail.id;
}
</script>

<template>
    <main class="page">
        <header class="page__header">
            <h1>{{ data?.title ?? "Cargando..." }}</h1>
            <p v-if="data?.intro" class="page__intro">{{ data.intro }}</p>
        </header>

        <p v-if="error" role="alert" class="page__error">
            No se pudo cargar la informacion: {{ error }}
        </p>

        <marine-section
            v-if="activeZone"
            :zone-id="activeZone.id"
            :name="activeZone.name"
            :depth-range="activeZone.depthRange"
            :accent="activeZone.color"
            :darkness="activeZone.darkness"
            @activate="handleActivate"
        >
            <p>{{ activeZone.description }}</p>

            <template #media>
                <div class="media-placeholder">
                    [SVG de la zona "{{ activeZone.name }}" ira aqui]
                    <br />
                    [AudioPlayer con narracion ira aqui]
                </div>
            </template>
        </marine-section>
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

.media-placeholder {
    border: 2px dashed currentColor;
    border-radius: 0.5rem;
    padding: 2rem 1rem;
    text-align: center;
    opacity: 0.6;
    font-style: italic;
}
</style>
