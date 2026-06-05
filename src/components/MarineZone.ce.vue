<script setup>
import { computed } from "vue";

const props = defineProps({
    zoneId: { type: String, required: true },
    name: { type: String, required: true },
    nameAlt: { type: String, default: "" },
    depthRange: { type: String, default: "" },
    ambiente: { type: String, default: "" },
    fauna: { type: Array, default: () => [] },
    blocks: { type: Array, default: () => [] },
    accent: { type: String, default: "#0aa6c2" },
    darkness: { type: Number, default: 0 },
});

const sectionStyle = computed(() => ({
    "--accent": props.accent,
    "--darkness": String(props.darkness),
}));
</script>

<template>
    <section class="zone" :style="sectionStyle" part="root">
        <div class="zone__bg" aria-hidden="true" part="bg">
            <slot name="image"></slot>
        </div>

        <div class="zone__title-band" part="title-band">
            <div class="zone__title-deco" aria-hidden="true"></div>
            <div class="zone__title-text">
                <h2 class="zone__title" part="title">{{ name }}</h2>
                <p class="zone__sub" part="sub">
                    <span v-if="nameAlt" class="zone__alt">{{ nameAlt }}</span>
                    <span v-if="nameAlt && depthRange" class="zone__sep">|</span>
                    <span v-if="depthRange" class="zone__depth">{{ depthRange }}</span>
                </p>
            </div>
        </div>

        <div class="zone__layout">
            <div class="zone__content">
                <div class="zone__block zone__block--ambiente" part="ambiente">
                    <span class="zone__eyebrow">Ambiente</span>
                    <p class="zone__ambiente">{{ ambiente }}</p>
                </div>

                <div class="zone__block zone__block--fauna" part="fauna">
                    <span class="zone__eyebrow">Fauna caracteristica</span>
                    <ul class="zone__chips">
                        <li v-for="f in fauna" :key="f" class="zone__chip">{{ f }}</li>
                    </ul>
                </div>
            </div>

            <div class="zone__media" part="media">
                <slot name="media">
                    <div class="placeholder placeholder--media">
                        [Espacio reservado para GIF / video animado]
                    </div>
                </slot>
            </div>

            <div class="zone__details" part="details">
                <details v-for="b in blocks" :key="b.id" class="zone__detail">
                    <summary class="zone__summary">
                        <span class="zone__summary-mark" aria-hidden="true"></span>
                        <span class="zone__summary-text">{{ b.titulo }}</span>
                    </summary>
                    <div class="zone__detail-body">
                        <p>{{ b.contenido }}</p>
                    </div>
                </details>
            </div>
        </div>
    </section>
</template>

<style>
:host {
    display: block;
    margin-block: 3.5rem 4.5rem;

    --accent: #0aa6c2;
    --darkness: 0;

    --soft: color-mix(in srgb, currentColor 8%, transparent);
    --soft-strong: color-mix(in srgb, currentColor 16%, transparent);
    --line: color-mix(in srgb, currentColor 22%, transparent);
}

.zone {
    color: inherit;
    position: relative;
    isolation: isolate;
}

.zone__bg {
    position: absolute;
    top: -1rem;
    right: -1rem;
    width: min(85%, 28rem);
    z-index: -1;
    pointer-events: none;
    opacity: 0.48;
    -webkit-mask-image: linear-gradient(225deg, #000 22%, transparent 78%);
    mask-image: linear-gradient(225deg, #000 22%, transparent 78%);
}

.zone__bg ::slotted(img),
.zone__bg ::slotted(svg),
.zone__bg ::slotted(picture) {
    display: block;
    width: 100%;
    height: auto;
}

.zone__title-band {
    position: relative;
    display: flex;
    align-items: stretch;
    gap: 0.9rem;
    margin-bottom: 1.5rem;
    max-width: 30rem;
}

.zone__title-deco {
    flex: 0 0 5px;
    border-radius: 999px;
    background: linear-gradient(
        to bottom,
        var(--accent) 0%,
        color-mix(in srgb, var(--accent) 30%, transparent) 100%
    );
}

.zone__title-text {
    padding-block: 0.15rem;
}

.zone__title {
    margin: 0;
    font-size: clamp(1.7rem, 4vw, 2.5rem);
    line-height: 1.05;
    letter-spacing: 0.005em;
    text-shadow: 0 1px 2px color-mix(in srgb, var(--c-surface, #a8d8f0) 70%, transparent);
}

.zone__sub {
    margin: 0.4rem 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.85;
}

.zone__alt {
    text-transform: uppercase;
    letter-spacing: 0.1em;
}

.zone__sep {
    opacity: 0.4;
}

.zone__depth {
    font-variant-numeric: tabular-nums;
}

.zone__layout {
    position: relative;
    display: flow-root;
}

.zone__media {
    border: 2px dashed color-mix(in srgb, currentColor 35%, transparent);
    border-radius: 0.5rem;
    min-height: 7rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--soft);
    margin-block: 0.25rem 1.5rem;
}

.placeholder {
    margin: 0;
    padding: 1.25rem 1rem;
    font-style: italic;
    opacity: 0.7;
    text-align: center;
}

.placeholder--media {
    font-size: 0.95rem;
}

.zone__content {
    display: contents;
}

.zone__block {
    border-left: 2px solid color-mix(in srgb, var(--accent) 70%, transparent);
    padding: 0.55rem 0.9rem 0.55rem 0.9rem;
    margin-bottom: 1.6rem;
    background: color-mix(in srgb, var(--c-surface, #a8d8f0) 75%, transparent);
    border-radius: 0 0.4rem 0.4rem 0;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
}

.zone__block--ambiente {
    max-width: 36rem;
}

.zone__block--fauna {
    max-width: 34rem;
}

.zone__eyebrow {
    display: block;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    opacity: 0.78;
    margin-bottom: 0.45rem;
}

.zone__ambiente {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.65;
}

.zone__chips {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.zone__chip {
    padding: 0.28rem 0.7rem;
    border: 1px solid var(--line);
    border-radius: 999px;
    font-size: 0.85rem;
    background: color-mix(in srgb, var(--c-surface, #a8d8f0) 65%, transparent);
}

.zone__details {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.55rem;
    margin-top: 1rem;
    clear: both;
}

.zone__detail {
    border: 1px solid var(--line);
    border-radius: 0.55rem;
    background: var(--soft);
    overflow: hidden;
}

.zone__detail[open] {
    background: var(--soft-strong);
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
}

.zone__summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.6rem 0.85rem;
    font-weight: 600;
    user-select: none;
}

.zone__summary::-webkit-details-marker {
    display: none;
}

.zone__summary:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: -2px;
}

.zone__summary-mark {
    width: 0.55rem;
    height: 0.55rem;
    border-right: 2px solid currentColor;
    border-bottom: 2px solid currentColor;
    transform: rotate(-45deg);
    transition: transform 180ms ease;
}

.zone__detail[open] .zone__summary-mark {
    transform: rotate(45deg);
}

.zone__detail-body {
    padding: 0 0.9rem 0.8rem 2.1rem;
    font-size: 0.97rem;
    line-height: 1.55;
}

.zone__detail-body p {
    margin: 0;
}

@media (min-width: 720px) {
    .zone__bg {
        width: min(48%, 26rem);
        top: -1.5rem;
        right: -2rem;
        opacity: 0.55;
    }

    .zone__title-band {
        margin-left: -1.6rem;
    }

    .zone__media {
        width: 60%;
        max-width: 24rem;
        margin-right: auto;
        margin-left: 1.5rem;
    }

    .zone__block--ambiente {
        margin-left: 0.5rem;
    }

    .zone__block--fauna {
        margin-left: 4rem;
        margin-top: 0.5rem;
    }

    .zone__details {
        grid-template-columns: repeat(6, 1fr);
        gap: 0.7rem 0.8rem;
    }

    .zone__detail:nth-child(6n + 1) { grid-column: span 4; }
    .zone__detail:nth-child(6n + 2) { grid-column: span 2; }
    .zone__detail:nth-child(6n + 3) { grid-column: span 3; }
    .zone__detail:nth-child(6n + 4) { grid-column: span 3; }
    .zone__detail:nth-child(6n + 5) { grid-column: span 2; }
    .zone__detail:nth-child(6n + 6) { grid-column: span 4; }
}

@media (min-width: 1000px) {
    .zone__bg {
        width: min(44%, 28rem);
    }
}
</style>
