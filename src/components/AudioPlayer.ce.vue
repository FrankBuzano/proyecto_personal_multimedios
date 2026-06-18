<script setup>
import { ref, onBeforeUnmount, computed } from "vue";

const props = defineProps({
    text: { type: String, required: true },
    label: { type: String, default: "Escuchar" },
    lang: { type: String, default: "es-ES" },
    voiceName: { type: String, default: "Microsoft Pablo" },
    rate: { type: Number, default: 1 },
    pitch: { type: Number, default: 1 },
});

const emit = defineEmits({
    play: null,
    end: null,
    error: null,
});

const supported =
    typeof window !== "undefined" &&
    "speechSynthesis" in window &&
    "SpeechSynthesisUtterance" in window;

const playing = ref(false);
let utterance = null;
const controller = new AbortController();
const { signal } = controller;

const titleAttr = computed(() => (playing.value ? `Detener ${props.label}` : props.label));

if (supported) {
    // Kick voice loading at module evaluation. Chrome loads voices asynchronously
    // and the first call to speak() before voices are ready fails silently.
    window.speechSynthesis.getVoices();
}

function voicesReady() {
    return supported && window.speechSynthesis.getVoices().length > 0;
}

function waitForVoices() {
    return new Promise((resolve) => {
        if (voicesReady() || signal.aborted) return resolve();

        const done = () => {
            clearTimeout(timeoutId);
            resolve();
        };

        window.speechSynthesis.addEventListener("voiceschanged", done, {
            once: true,
            signal,
        });

        const timeoutId = setTimeout(done, 1500);

        signal.addEventListener("abort", done, { once: true });
    });
}

function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    if (props.voiceName) {
        const needle = props.voiceName.toLowerCase();
        const byName = voices.find((v) => v.name.toLowerCase().includes(needle));
        if (byName) return byName;
    }
    const exact = voices.find((v) => v.lang === props.lang);
    if (exact) return exact;
    const family = props.lang.split("-")[0];
    return voices.find((v) => v.lang.startsWith(family)) ?? null;
}

function stop() {
    if (!supported) return;
    window.speechSynthesis.cancel();
    playing.value = false;
    utterance = null;
}

async function speak() {
    if (!supported || !props.text) return;
    const synth = window.speechSynthesis;
    synth.cancel();

    playing.value = true;
    emit("play");

    if (!voicesReady()) await waitForVoices();

    utterance = new SpeechSynthesisUtterance(props.text);
    utterance.lang = props.lang;
    utterance.rate = props.rate;
    utterance.pitch = props.pitch;
    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
        playing.value = false;
        utterance = null;
        emit("end");
    };
    utterance.onerror = (e) => {
        if (e.error !== "canceled" && e.error !== "interrupted") {
            console.warn("[marine-audio] speech error:", e.error);
        }
        playing.value = false;
        utterance = null;
        emit("error", e);
    };

    // Defer to next macrotask: works around a Chrome quirk where
    // cancel() + speak() in the same task leaves the engine stuck.
    setTimeout(() => {
        if (utterance) synth.speak(utterance);
    }, 0);
}

function toggle() {
    if (playing.value) stop();
    else speak();
}

onBeforeUnmount(() => {
    controller.abort();
    stop();
});
</script>

<template>
    <button
        v-if="supported"
        type="button"
        class="tts"
        part="button"
        :class="{ 'tts--playing': playing }"
        :aria-pressed="playing"
        :aria-label="titleAttr"
        :title="titleAttr"
        @click="toggle"
    >
        <span class="tts__icon" aria-hidden="true">
            <svg v-if="!playing" viewBox="0 0 24 24" width="14" height="14">
                <path
                    fill="currentColor"
                    d="M4 9v6h4l5 4V5L8 9H4zm12.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06A7 7 0 0 1 14 18.7v2.07A9 9 0 0 0 14 3.23z"
                />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="14" height="14">
                <rect x="6" y="5" width="4" height="14" fill="currentColor" rx="1" />
                <rect x="14" y="5" width="4" height="14" fill="currentColor" rx="1" />
            </svg>
        </span>
        <span class="tts__label" part="label">{{ playing ? "Detener" : label }}</span>
    </button>
</template>

<style>
:host {
    display: inline-block;
}

.tts {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.32rem 0.75rem;
    border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
    border-radius: 999px;
    background: rgba(0, 0, 0, calc(0.05 + var(--bg-dark, 0) * 0.25));
    color: inherit;
    font: inherit;
    font-size: 0.78rem;
    line-height: 1;
    cursor: pointer;
    transition:
        background 140ms ease,
        border-color 140ms ease,
        transform 140ms ease;
}

.tts:hover {
    background: rgba(0, 0, 0, calc(0.1 + var(--bg-dark, 0) * 0.3));
    border-color: color-mix(in srgb, currentColor 55%, transparent);
}

.tts:active {
    transform: scale(0.97);
}

.tts:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
}

.tts--playing {
    background: color-mix(in srgb, currentColor 18%, transparent);
    border-color: currentColor;
}

.tts__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.tts__label {
    font-weight: 600;
    letter-spacing: 0.02em;
}
</style>
