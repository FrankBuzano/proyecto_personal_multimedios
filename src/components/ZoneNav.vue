<script setup>
defineProps({
    zones: { type: Array, required: true },
    activeId: { type: String, default: null },
});

const emit = defineEmits({
    select: (payload) => typeof payload?.id === "string",
});

function select(id) {
    emit("select", { id });
}
</script>

<template>
    <nav class="nav" aria-label="Zonas oceanicas">
        <ol class="nav__list">
            <li
                v-for="zone in zones"
                :key="zone.id"
                class="nav__item"
                :class="{ 'nav__item--active': zone.id === activeId }"
                :style="{ '--zone-accent': zone.accent }"
            >
                <button
                    type="button"
                    class="nav__btn"
                    :aria-current="zone.id === activeId ? 'true' : 'false'"
                    @click="select(zone.id)"
                >
                    <span class="nav__dot" aria-hidden="true"></span>
                    <span class="nav__name">{{ zone.name }}</span>
                    <span class="nav__depth">{{ zone.depthRange }}</span>
                </button>
            </li>
        </ol>
    </nav>
</template>

<style scoped>
.nav {
    margin-bottom: 1.5rem;
}

.nav__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.3rem;
}

.nav__item {
    position: relative;
}

.nav__btn {
    display: flex;
    align-items: center;
    gap: 0.55rem 0.8rem;
    flex-wrap: wrap;
    width: 100%;
    padding: 0.42rem 0.85rem;
    border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
    border-left: 3px solid var(--zone-accent, var(--c-accent));
    border-radius: 0 0.45rem 0.45rem 0;
    background:
        linear-gradient(
            to right,
            color-mix(in srgb, var(--zone-accent, var(--c-accent)) calc((1 - var(--bg-dark, 0)) * 12% + 4%), transparent) 0%,
            transparent 40%
        ),
        color-mix(in srgb, currentColor calc(var(--bg-dark, 0) * 6% + 3%), transparent);
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    box-shadow:
        inset 0 1px 0 color-mix(in srgb, white calc((1 - var(--bg-dark, 0)) * 28%), transparent),
        0 1px 2px rgba(0, 0, 0, 0.05);
    transition:
        background 180ms ease,
        border-color 180ms ease,
        transform 180ms ease,
        box-shadow 220ms ease;
}

.nav__btn:hover {
    background:
        linear-gradient(
            to right,
            color-mix(in srgb, var(--zone-accent, var(--c-accent)) calc((1 - var(--bg-dark, 0)) * 22% + 8%), transparent) 0%,
            transparent 50%
        ),
        color-mix(in srgb, currentColor calc(var(--bg-dark, 0) * 10% + 4%), transparent);
    transform: translateX(2px);
    box-shadow:
        inset 0 1px 0 color-mix(in srgb, white calc((1 - var(--bg-dark, 0)) * 48%), transparent),
        0 3px 10px rgba(0, 0, 0, 0.14),
        0 0 12px color-mix(in srgb, var(--zone-accent, var(--c-accent)) 22%, transparent);
}

.nav__btn:focus-visible {
    outline: 2px solid var(--zone-accent, var(--c-accent));
    outline-offset: 2px;
}

.nav__item--active .nav__btn {
    background:
        linear-gradient(
            to right,
            color-mix(in srgb, var(--zone-accent, var(--c-accent)) 26%, transparent) 0%,
            transparent 55%
        ),
        color-mix(in srgb, currentColor 6%, transparent);
    border-color: color-mix(in srgb, var(--zone-accent, var(--c-accent)) 60%, transparent);
}

.nav__dot {
    flex: 0 0 auto;
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: var(--zone-accent, var(--c-accent));
    box-shadow:
        0 0 0 1px color-mix(in srgb, var(--zone-accent, var(--c-accent)) 50%, transparent),
        0 0 8px color-mix(in srgb, var(--zone-accent, var(--c-accent)) 55%, transparent);
    transition: box-shadow 200ms ease, transform 200ms ease;
}

.nav__btn:hover .nav__dot {
    transform: scale(1.2);
    box-shadow:
        0 0 0 1px color-mix(in srgb, var(--zone-accent, var(--c-accent)) 80%, transparent),
        0 0 12px color-mix(in srgb, var(--zone-accent, var(--c-accent)) 90%, transparent);
}

.nav__name {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 0.92rem;
    font-weight: 600;
    letter-spacing: 0.005em;
}

.nav__depth {
    margin-left: auto;
    font-variant-numeric: tabular-nums;
    opacity: 0.7;
    font-size: 0.8rem;
}
</style>
