<script setup>
const dots = Array.from({ length: 26 }, (_, i) => {
    const cx = (i * 37 + 11) % 100;
    const cy = (i * 53 + 7) % 70;
    const r = ((i * 29 + 3) % 6) * 0.4 + 0.7;
    const delay = ((i * 0.31) % 4.5).toFixed(2);
    const dur = (2.4 + (i % 5) * 0.5).toFixed(2);
    return { cx, cy, r, delay, dur };
});
</script>

<template>
    <svg
        class="biolum"
        viewBox="0 0 100 70"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
    >
        <circle
            v-for="(d, i) in dots"
            :key="i"
            :cx="d.cx"
            :cy="d.cy"
            :r="d.r"
            :style="{ '--biolum-delay': `${d.delay}s`, '--biolum-dur': `${d.dur}s` }"
        />
    </svg>
</template>

<style scoped>
.biolum {
    display: block;
    width: 100%;
    height: auto;
    color: inherit;
    overflow: visible;
}

.biolum circle {
    fill: currentColor;
    filter:
        drop-shadow(0 0 2.4px currentColor)
        drop-shadow(0 0 6px color-mix(in srgb, currentColor 60%, transparent));
    transform-origin: center;
    transform-box: fill-box;
    animation: biolum-pulse var(--biolum-dur, 3s) ease-in-out infinite;
    animation-delay: var(--biolum-delay, 0s);
}

@keyframes biolum-pulse {
    0%, 100% {
        opacity: 0.18;
        transform: scale(0.7);
    }
    50% {
        opacity: 1;
        transform: scale(1.25);
    }
}

@media (prefers-reduced-motion: reduce) {
    .biolum circle {
        animation: none;
        opacity: 0.55;
        transform: none;
    }
}
</style>
