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
            >
                <button
                    type="button"
                    class="nav__btn"
                    :aria-current="zone.id === activeId ? 'true' : 'false'"
                    @click="select(zone.id)"
                >
                    <span class="nav__name">{{ zone.name }}</span>
                    <span class="nav__depth">{{ zone.depthRange }}</span>
                </button>
            </li>
        </ol>
    </nav>
</template>

<style scoped>
.nav__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.5rem;
}

.nav__btn {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75rem;
    width: 100%;
    padding: 0.6rem 0.9rem;
    border: 1px solid color-mix(in srgb, var(--c-ink) 20%, transparent);
    border-radius: 0.5rem;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease;
}

.nav__btn:hover {
    background: color-mix(in srgb, var(--c-accent) 10%, transparent);
}

.nav__btn:focus-visible {
    outline: 2px solid var(--c-accent);
    outline-offset: 2px;
}

.nav__item--active .nav__btn {
    border-color: var(--c-accent);
    background: color-mix(in srgb, var(--c-accent) 18%, transparent);
}

.nav__depth {
    font-variant-numeric: tabular-nums;
    opacity: 0.75;
    font-size: 0.85rem;
}
</style>
