<script setup>
import { computed, ref, nextTick, onBeforeUnmount, watch } from "vue";

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

const zoneRef = ref(null);
const panelRef = ref(null);
const chipsRef = ref(null);
const activeId = ref(null);
const panelStyle = ref({ visibility: "hidden" });
const panelReady = ref(false);

const activeBlock = computed(
    () => props.blocks.find((b) => b.id === activeId.value) ?? null,
);

async function toggleBlock(b, event) {
    if (activeId.value === b.id) {
        closePanel();
        return;
    }
    activeId.value = b.id;
    panelReady.value = false;
    panelStyle.value = { visibility: "hidden" };
    const trigger = event.currentTarget;
    await nextTick();
    positionPanel(trigger);
    panelReady.value = true;
}

function closePanel() {
    activeId.value = null;
    panelReady.value = false;
    panelStyle.value = { visibility: "hidden" };
}

function positionPanel(triggerEl) {
    const panel = panelRef.value;
    const chips = chipsRef.value;
    if (!panel || !triggerEl || !chips) return;

    const parent = panel.offsetParent ?? zoneRef.value;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const trigRect = triggerEl.getBoundingClientRect();
    const chipsRect = chips.getBoundingClientRect();
    const panelW = panel.offsetWidth;
    const panelH = panel.offsetHeight;
    const margin = 12;
    const isDesktop = window.innerWidth >= 720;

    let left;
    let top;
    let anchorOrigin;
    let enterX = "0px";
    let enterY = "0px";

    const desktopLeft = chipsRect.left - parentRect.left - panelW - margin;

    if (isDesktop && desktopLeft >= margin) {
        left = desktopLeft;
        top = trigRect.top - parentRect.top;
        const minTopInView = -parentRect.top + 16;
        const maxTopInView = window.innerHeight - panelH - 16 - parentRect.top;
        if (maxTopInView > minTopInView) {
            top = Math.max(minTopInView, Math.min(top, maxTopInView));
        }
        anchorOrigin = "right center";
        enterX = "10px";
    } else {
        const trigCenter = trigRect.left + trigRect.width / 2;
        left = trigCenter - parentRect.left - panelW / 2;
        const fitsAboveChips = chipsRect.top - margin - panelH > 12;
        top = fitsAboveChips
            ? chipsRect.top - parentRect.top - panelH - margin
            : chipsRect.bottom - parentRect.top + margin;
        anchorOrigin = fitsAboveChips ? "center bottom" : "center top";
        enterY = fitsAboveChips ? "8px" : "-8px";
    }

    const maxLeft = parentRect.width - panelW - margin;
    if (left > maxLeft) left = Math.max(margin, maxLeft);
    if (left < margin) left = margin;

    panelStyle.value = {
        top: `${top}px`,
        left: `${left}px`,
        visibility: "visible",
        "--enter-x": enterX,
        "--enter-y": enterY,
        "--anchor-origin": anchorOrigin,
    };
}

function onDocPointer(e) {
    if (!activeId.value) return;
    const path = e.composedPath();
    if (panelRef.value && path.includes(panelRef.value)) return;
    const onAnyChip = path.some(
        (el) => el?.classList?.contains?.("zone__chip-btn"),
    );
    if (onAnyChip) return;
    closePanel();
}

function onKeydown(e) {
    if (e.key === "Escape") closePanel();
}

function onWinResize() {
    if (activeId.value) closePanel();
}

watch(activeId, (id) => {
    if (id) {
        document.addEventListener("pointerdown", onDocPointer, true);
        document.addEventListener("keydown", onKeydown);
        window.addEventListener("resize", onWinResize);
        window.addEventListener("scroll", onWinResize, { passive: true });
    } else {
        document.removeEventListener("pointerdown", onDocPointer, true);
        document.removeEventListener("keydown", onKeydown);
        window.removeEventListener("resize", onWinResize);
        window.removeEventListener("scroll", onWinResize);
    }
});

onBeforeUnmount(() => {
    document.removeEventListener("pointerdown", onDocPointer, true);
    document.removeEventListener("keydown", onKeydown);
    window.removeEventListener("resize", onWinResize);
    window.removeEventListener("scroll", onWinResize);
});
</script>

<template>
    <section ref="zoneRef" class="zone" :style="sectionStyle" part="root">
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
                    <div class="zone__block-head">
                        <span class="zone__eyebrow">Ambiente</span>
                        <marine-audio
                            :text="ambiente"
                            lang="es-ES"
                            label="Escuchar"
                        ></marine-audio>
                    </div>
                    <p class="zone__ambiente">{{ ambiente }}</p>
                </div>

                <div class="zone__block zone__block--fauna" part="fauna">
                    <span class="zone__eyebrow">Fauna caracteristica</span>
                    <ul class="zone__chips">
                        <li v-for="f in fauna" :key="f" class="zone__chip">{{ f }}</li>
                    </ul>
                </div>
            </div>

            <div class="zone__info" part="info">
                <span class="zone__eyebrow zone__eyebrow--info">Mas informacion</span>
                <div ref="chipsRef" class="zone__info-chips" role="toolbar" aria-label="Bloques de informacion adicional">
                    <button
                        v-for="b in blocks"
                        :key="b.id"
                        type="button"
                        class="zone__chip-btn"
                        :class="{ 'zone__chip-btn--active': activeId === b.id }"
                        :aria-expanded="activeId === b.id"
                        :aria-controls="`${zoneId}__panel`"
                        @click="toggleBlock(b, $event)"
                    >
                        <span class="zone__chip-btn-dot" aria-hidden="true"></span>
                        <span class="zone__chip-btn-label">{{ b.titulo }}</span>
                    </button>
                </div>
            </div>
        </div>

        <div
            v-if="activeBlock"
            ref="panelRef"
            :id="`${zoneId}__panel`"
            class="zone__panel"
            :class="{ 'zone__panel--ready': panelReady }"
            role="dialog"
            :aria-label="activeBlock.titulo"
            :style="panelStyle"
            part="panel"
        >
            <header class="zone__panel-head">
                <h3 class="zone__panel-title">{{ activeBlock.titulo }}</h3>
                <button
                    type="button"
                    class="zone__panel-close"
                    aria-label="Cerrar"
                    @click="closePanel"
                >
                    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                        <path
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2.4"
                            stroke-linecap="round"
                            d="M6 6l12 12M18 6L6 18"
                        />
                    </svg>
                </button>
            </header>
            <p class="zone__panel-body">{{ activeBlock.contenido }}</p>
        </div>
    </section>
</template>

<style>
:host {
    display: block;
    margin-block: 3.5rem 4.5rem;
    scroll-margin-top: 1rem;

    --accent: #0aa6c2;
    --darkness: 0;

    --soft: rgba(0, 0, 0, calc(0.05 + var(--bg-dark, 0) * 0.35));
    --soft-strong: rgba(0, 0, 0, calc(0.11 + var(--bg-dark, 0) * 0.38));
    --line: color-mix(in srgb, currentColor 22%, transparent);
}

@media (min-width: 720px) {
    :host {
        scroll-margin-top: 5rem;
    }
}

.zone {
    color: inherit;
    position: relative;
    isolation: isolate;
}

:host(:not(:first-of-type))::before {
    content: "";
    display: block;
    height: 1px;
    width: min(60%, 18rem);
    margin: -1rem auto 3rem;
    background: linear-gradient(
        to right,
        transparent 0%,
        color-mix(in srgb, var(--accent) 55%, transparent) 50%,
        transparent 100%
    );
    opacity: 0.65;
}

.zone__bg {
    position: absolute;
    top: -1rem;
    right: -1rem;
    width: min(85%, 28rem);
    z-index: -1;
    pointer-events: none;
    opacity: 0.62;
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
    box-shadow:
        0 0 10px color-mix(in srgb, var(--accent) 55%, transparent),
        0 -6px 14px color-mix(in srgb, var(--accent) 70%, transparent);
}

.zone__title-text {
    padding-block: 0.15rem;
}

.zone__title {
    margin: 0;
    font-size: clamp(1.7rem, 4vw, 2.5rem);
    line-height: 1.05;
    letter-spacing: 0.005em;
    position: relative;
    display: inline-block;
    padding-bottom: 0.32rem;
    text-shadow:
        0 1px 2px color-mix(in srgb, var(--c-surface, #a8d8f0) calc((1 - var(--text-light, 0)) * 70%), transparent),
        0 0 10px color-mix(in srgb, #000 calc(var(--text-light, 0) * 90%), transparent),
        0 2px 4px color-mix(in srgb, #000 calc(var(--text-light, 0) * 80%), transparent);
}

.zone__title::after {
    content: "";
    position: absolute;
    left: 0;
    right: 28%;
    bottom: 0;
    height: 1px;
    background: linear-gradient(
        to right,
        var(--accent) 0%,
        color-mix(in srgb, var(--accent) 35%, transparent) 55%,
        transparent 100%
    );
    opacity: 0.75;
}

.zone__sub {
    margin: 0.4rem 0 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    font-size: 0.9rem;
    opacity: 0.95;
    text-shadow:
        0 1px 2px color-mix(in srgb, #000 calc(var(--text-light, 0) * 70%), transparent);
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

.zone__content {
    display: contents;
}

.zone__block {
    border-left: 2px solid color-mix(in srgb, var(--accent) 70%, transparent);
    padding: 0.55rem 0.9rem 0.55rem 0.9rem;
    margin-bottom: 1.6rem;
    background:
        linear-gradient(
            rgba(0, 0, 0, calc(var(--bg-dark, 0) * 0.45)),
            rgba(0, 0, 0, calc(var(--bg-dark, 0) * 0.45))
        ),
        color-mix(in srgb, var(--c-surface, #a8d8f0) 75%, transparent);
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

.zone__block-head {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    flex-wrap: wrap;
    margin-bottom: 0.45rem;
}

.zone__eyebrow {
    display: inline-block;
    position: relative;
    padding-left: 1.55rem;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    opacity: 0.95;
}

.zone__eyebrow::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 1.05rem;
    height: 1px;
    transform: translateY(-50%);
    background: linear-gradient(
        to right,
        var(--accent) 0%,
        color-mix(in srgb, var(--accent) 35%, transparent) 100%
    );
    opacity: 0.9;
}

.zone__block-head .zone__eyebrow {
    margin-bottom: 0;
}

.zone__ambiente {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.65;
}

.zone__chips {
    list-style: none;
    margin: 0.45rem 0 0;
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
    background:
        linear-gradient(
            rgba(0, 0, 0, calc(var(--bg-dark, 0) * 0.42)),
            rgba(0, 0, 0, calc(var(--bg-dark, 0) * 0.42))
        ),
        color-mix(in srgb, var(--c-surface, #a8d8f0) 65%, transparent);
}

.zone__info {
    margin-top: 1.25rem;
    clear: both;
}

.zone__eyebrow--info {
    margin-bottom: 0.55rem;
}

.zone__info-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem 0.5rem;
}

.zone__chip-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.42rem 0.95rem;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--line));
    border-radius: 999px;
    background:
        linear-gradient(
            to bottom,
            color-mix(in srgb, white calc((1 - var(--bg-dark, 0)) * 30% + var(--bg-dark, 0) * 8%), transparent) 0%,
            transparent 65%
        ),
        var(--soft);
    color: inherit;
    font: inherit;
    font-size: 0.86rem;
    line-height: 1;
    cursor: pointer;
    box-shadow:
        inset 0 1px 0 color-mix(in srgb, white calc((1 - var(--bg-dark, 0)) * 55% + var(--bg-dark, 0) * 12%), transparent),
        0 1px 2px rgba(0, 0, 0, 0.1);
    transition:
        background 160ms ease,
        border-color 160ms ease,
        transform 160ms ease,
        box-shadow 220ms ease;
}

.zone__chip-btn:hover {
    background:
        linear-gradient(
            to bottom,
            color-mix(in srgb, white calc((1 - var(--bg-dark, 0)) * 40% + var(--bg-dark, 0) * 16%), transparent) 0%,
            transparent 65%
        ),
        var(--soft-strong);
    border-color: color-mix(in srgb, var(--accent) 75%, transparent);
    transform: translateY(-1px);
    box-shadow:
        inset 0 1px 0 color-mix(in srgb, white calc((1 - var(--bg-dark, 0)) * 70% + var(--bg-dark, 0) * 20%), transparent),
        0 5px 12px rgba(0, 0, 0, 0.2),
        0 0 14px color-mix(in srgb, var(--accent) 30%, transparent);
}

.zone__chip-btn:active {
    transform: translateY(0) scale(0.98);
}

.zone__chip-btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

.zone__chip-btn--active {
    background:
        linear-gradient(
            to bottom,
            color-mix(in srgb, white calc((1 - var(--bg-dark, 0)) * 22%), transparent) 0%,
            transparent 60%
        ),
        color-mix(in srgb, var(--accent) 25%, var(--soft-strong));
    border-color: var(--accent);
    box-shadow:
        inset 0 1px 0 color-mix(in srgb, white 35%, transparent),
        0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent),
        0 4px 14px color-mix(in srgb, var(--accent) 35%, transparent);
}

.zone__chip-btn-dot {
    width: 0.42rem;
    height: 0.42rem;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px color-mix(in srgb, var(--accent) 60%, transparent);
    transition: box-shadow 200ms ease, transform 200ms ease;
}

.zone__chip-btn--active .zone__chip-btn-dot {
    animation: chip-dot-pulse 1.8s ease-in-out infinite;
}

@keyframes chip-dot-pulse {
    0%, 100% {
        box-shadow: 0 0 6px color-mix(in srgb, var(--accent) 60%, transparent);
        transform: scale(1);
    }
    50% {
        box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 100%, transparent);
        transform: scale(1.2);
    }
}

@media (prefers-reduced-motion: reduce) {
    .zone__chip-btn--active .zone__chip-btn-dot {
        animation: none;
    }
}

.zone__chip-btn-label {
    font-weight: 600;
    letter-spacing: 0.01em;
}

.zone__panel {
    position: absolute;
    z-index: 5;
    max-width: min(26rem, calc(100% - 1rem));
    min-width: min(18rem, 100%);
    padding: 0.9rem 1.05rem 1rem;
    border-radius: 0.7rem;
    border: 1px solid color-mix(in srgb, var(--accent) 60%, transparent);
    background:
        linear-gradient(
            rgba(0, 0, 0, calc(0.62 + var(--bg-dark, 0) * 0.25)),
            rgba(0, 0, 0, calc(0.62 + var(--bg-dark, 0) * 0.25))
        ),
        color-mix(in srgb, var(--c-surface, #a8d8f0) 78%, transparent);
    color: var(--c-ink-bright);
    box-shadow:
        0 14px 36px rgba(0, 0, 0, 0.45),
        0 4px 12px rgba(0, 0, 0, 0.28),
        0 0 0 1px color-mix(in srgb, var(--accent) 18%, transparent) inset;
    backdrop-filter: blur(10px) saturate(1.1);
    -webkit-backdrop-filter: blur(10px) saturate(1.1);
    opacity: 0;
    transform: scale(0.88) translate(var(--enter-x, 0px), var(--enter-y, 8px));
    transform-origin: var(--anchor-origin, center bottom);
    transition:
        opacity 180ms ease,
        transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1);
    will-change: transform, opacity;
}

.zone__panel--ready {
    opacity: 1;
    transform: scale(1) translate(0, 0);
}

.zone__panel-head {
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
    margin-bottom: 0.4rem;
}

.zone__panel-title {
    margin: 0;
    font-size: 1rem;
    line-height: 1.2;
    letter-spacing: 0.01em;
    color: color-mix(in srgb, var(--accent) 75%, currentColor);
}

.zone__panel-close {
    margin-left: auto;
    width: 1.6rem;
    height: 1.6rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--line);
    border-radius: 50%;
    background: transparent;
    color: inherit;
    cursor: pointer;
    transition: background 120ms ease, border-color 120ms ease;
}

.zone__panel-close:hover {
    background: var(--soft-strong);
    border-color: color-mix(in srgb, var(--accent) 60%, transparent);
}

.zone__panel-close:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

.zone__panel-body {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.55;
}

@media (min-width: 720px) {
    .zone__bg {
        width: min(48%, 26rem);
        top: -1.5rem;
        right: -2rem;
        opacity: 0.72;
    }

    .zone__title-band {
        margin-left: -1.6rem;
    }

    .zone__layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) clamp(15rem, 30%, 18rem);
        column-gap: 1.75rem;
        align-items: start;
    }

    .zone__content {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        min-width: 0;
    }

    .zone__block--ambiente,
    .zone__block--fauna {
        margin-left: 0;
        margin-bottom: 0;
    }

    .zone__info {
        margin-top: 0;
        position: sticky;
        top: 1rem;
    }

    .zone__panel {
        max-width: min(28rem, calc(100% - 1rem));
    }
}

@media (min-width: 1000px) {
    .zone__bg {
        width: min(44%, 28rem);
    }
}

@keyframes zone-bg-float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50%      { transform: translateY(-10px) rotate(0.6deg); }
}

@keyframes zone-bg-shimmer {
    0%, 100% { filter: brightness(1) saturate(1); }
    50%      { filter: brightness(1.08) saturate(1.06); }
}

@media (prefers-reduced-motion: no-preference) {
    .zone__bg {
        animation:
            zone-bg-float 7s ease-in-out infinite,
            zone-bg-shimmer 11s ease-in-out infinite;
        transform-origin: top right;
    }
}
</style>
