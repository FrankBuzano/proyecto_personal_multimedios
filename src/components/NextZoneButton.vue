<script setup>
import { computed } from "vue";

const props = defineProps({
    isLast: { type: Boolean, default: false },
    accent: { type: String, default: null },
});

defineEmits(["go"]);

const label = computed(() => (props.isLast ? "Volver al inicio" : "Siguiente zona"));
const arrowPath = computed(() =>
    props.isLast ? "M6 14l6-6 6 6" : "M6 10l6 6 6-6",
);
</script>

<template>
    <button
        type="button"
        class="next-zone"
        :class="{ 'next-zone--up': isLast }"
        :style="accent ? { '--btn-accent': accent } : {}"
        :aria-label="label"
        @click="$emit('go')"
    >
        <span class="next-zone__label">{{ label }}</span>
        <span class="next-zone__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="14" height="14">
                <path
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :d="arrowPath"
                />
            </svg>
        </span>
    </button>
</template>

<style scoped>
.next-zone {
    position: fixed;
    z-index: 50;
    right: 1.25rem;
    bottom: 1.25rem;
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.65rem 1.05rem;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--btn-accent, var(--c-accent, #0aa6c2)) 60%, transparent);
    background:
        linear-gradient(
            to bottom,
            color-mix(in srgb, white calc((1 - var(--bg-dark, 0)) * 28% + 10%), transparent) 0%,
            transparent 70%
        ),
        color-mix(in srgb, var(--btn-accent, var(--c-accent, #0aa6c2)) 28%, rgba(0, 0, 0, 0.42));
    color: var(--c-ink-bright, #fff);
    font: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    line-height: 1;
    cursor: pointer;
    box-shadow:
        0 8px 22px rgba(0, 0, 0, 0.32),
        0 0 0 1px color-mix(in srgb, var(--btn-accent, var(--c-accent, #0aa6c2)) 25%, transparent),
        inset 0 1px 0 color-mix(in srgb, white 35%, transparent);
    backdrop-filter: blur(8px) saturate(1.1);
    -webkit-backdrop-filter: blur(8px) saturate(1.1);
    transition:
        background 220ms ease,
        border-color 220ms ease,
        transform 180ms ease,
        box-shadow 260ms ease;
}

.next-zone:hover {
    transform: translateY(-2px);
    box-shadow:
        0 14px 30px rgba(0, 0, 0, 0.42),
        0 0 0 1px color-mix(in srgb, var(--btn-accent, var(--c-accent, #0aa6c2)) 60%, transparent),
        0 0 18px color-mix(in srgb, var(--btn-accent, var(--c-accent, #0aa6c2)) 45%, transparent),
        inset 0 1px 0 color-mix(in srgb, white 50%, transparent);
}

.next-zone:active {
    transform: translateY(0) scale(0.97);
}

.next-zone:focus-visible {
    outline: 2px solid var(--btn-accent, var(--c-accent, #0aa6c2));
    outline-offset: 3px;
}

.next-zone__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--btn-accent, var(--c-accent, #0aa6c2));
}

.next-zone:hover .next-zone__icon {
    animation: next-bob 0.9s ease-in-out infinite;
}

.next-zone--up:hover .next-zone__icon {
    animation: next-bob-up 0.9s ease-in-out infinite;
}

@keyframes next-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(3px); }
}

@keyframes next-bob-up {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
}

@media (prefers-reduced-motion: reduce) {
    .next-zone:hover .next-zone__icon,
    .next-zone--up:hover .next-zone__icon {
        animation: none;
    }
    .next-zone:hover {
        transform: none;
    }
}

@media (max-width: 480px) {
    .next-zone {
        right: 0.85rem;
        bottom: 0.85rem;
        padding: 0.55rem 0.9rem;
        font-size: 0.78rem;
    }
}

@media (min-width: 1280px) {
    .next-zone {
        display: none;
    }
}
</style>
