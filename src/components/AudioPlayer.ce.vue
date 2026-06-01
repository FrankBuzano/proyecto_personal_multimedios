<script setup>
import { ref } from "vue";

const props = defineProps({
    src: { type: String, required: true },
    label: { type: String, default: "Narracion" },
    preload: { type: String, default: "metadata" },
});

const emit = defineEmits({
    play: null,
    pause: null,
    ended: null,
});

const audioEl = ref(null);
const playing = ref(false);

function toggle() {
    // TODO: implementar play/pause real sobre audioEl.value
}

function onPlay() {
    playing.value = true;
    emit("play");
}

function onPause() {
    playing.value = false;
    emit("pause");
}

function onEnded() {
    playing.value = false;
    emit("ended");
}
</script>

<template>
    <div class="player" part="root">
        <button
            type="button"
            class="player__btn"
            part="button"
            :aria-pressed="playing"
            :aria-label="(playing ? 'Pausar ' : 'Reproducir ') + label"
            @click="toggle"
        >
            <span class="player__icon" aria-hidden="true">{{ playing ? "II" : "&#9658;" }}</span>
            <span class="player__label" part="label">{{ label }}</span>
        </button>

        <audio
            ref="audioEl"
            :src="src"
            :preload="preload"
            @play="onPlay"
            @pause="onPause"
            @ended="onEnded"
        ></audio>
    </div>
</template>

<style>
:host {
    display: inline-block;
}

.player {
    display: inline-flex;
    align-items: center;
}

.player__btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.9rem;
    border: 1px solid currentColor;
    border-radius: 999px;
    background: transparent;
    color: inherit;
    font: inherit;
    cursor: pointer;
}

.player__btn:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
}

.player__icon {
    font-variant-numeric: tabular-nums;
    min-width: 1.25ch;
    text-align: center;
}
</style>
