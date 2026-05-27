<script setup>
import { computed } from "vue";

const props = defineProps({
    zoneId: { type: String, required: true },
    name: { type: String, required: true },
    depthRange: { type: String, default: "" },
    accent: { type: String, default: "#0aa6c2" },
    darkness: { type: Number, default: 0 },
});

const emit = defineEmits({
    activate: (payload) => typeof payload?.id === "string",
});

const sectionStyle = computed(() => ({
    "--accent": props.accent,
    "--darkness": String(props.darkness),
}));

function activate() {
    emit("activate", { id: props.zoneId });
}

function onKeyActivate(event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
    }
}
</script>

<template>
    <section class="section" :style="sectionStyle" part="root">
        <header
            class="section__header"
            part="header"
            role="button"
            tabindex="0"
            :aria-label="`Activar ${name}`"
            @click="activate"
            @keydown="onKeyActivate"
        >
            <h2 class="section__title" part="title">{{ name }}</h2>
            <span class="section__depth" part="depth">{{ depthRange }}</span>
        </header>

        <div class="section__body" part="body">
            <slot></slot>

            <div class="section__media" part="media">
                <slot name="media">
                    <p class="section__media-empty">Sin multimedia disponible.</p>
                </slot>
            </div>
        </div>
    </section>
</template>

<style>
:host {
    display: block;
    margin-block: 1.5rem;

    --accent: #0aa6c2;
    --darkness: 0;

    --bg: color-mix(in srgb, var(--accent) calc((1 - var(--darkness)) * 100%), #000);
    --ink: color-mix(in srgb, white calc((1 - var(--darkness)) * 30% + 70%), #000);
}

.section {
    background: var(--bg);
    color: var(--ink);
    border-radius: 0.75rem;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    transition: transform 200ms ease, box-shadow 200ms ease;
}

.section:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 38px rgba(0, 0, 0, 0.22);
}

.section__header {
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    cursor: pointer;
    user-select: none;
    background: rgba(0, 0, 0, 0.12);
}

.section__header:focus-visible {
    outline: 3px solid #fff;
    outline-offset: -3px;
}

.section__title {
    margin: 0;
    font-size: clamp(1.25rem, 2.5vw, 1.6rem);
    letter-spacing: 0.01em;
}

.section__depth {
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
    font-size: 0.95rem;
}

.section__body {
    padding: 1.25rem 1.5rem 1.75rem;
    display: grid;
    gap: 1.25rem;
}

.section__media {
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 1rem;
    min-height: 6rem;
}

.section__media-empty {
    margin: 0;
    opacity: 0.65;
    font-style: italic;
}

@media (min-width: 720px) {
    .section__body {
        grid-template-columns: 3fr 2fr;
        align-items: start;
    }

    .section__media {
        border-top: none;
        border-left: 1px solid rgba(255, 255, 255, 0.15);
        padding-top: 0;
        padding-left: 1rem;
    }
}
</style>
