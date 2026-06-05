import { createApp, defineCustomElement } from "vue";
import App from "./App.vue";
import InfographicSection from "./components/InfographicSection.ce.vue";
import MarineZone from "./components/MarineZone.ce.vue";
import AudioPlayer from "./components/AudioPlayer.ce.vue";

if (!customElements.get("marine-section")) {
    customElements.define("marine-section", defineCustomElement(InfographicSection));
}

if (!customElements.get("marine-zone")) {
    customElements.define("marine-zone", defineCustomElement(MarineZone));
}

if (!customElements.get("marine-audio")) {
    customElements.define("marine-audio", defineCustomElement(AudioPlayer));
}

createApp(App).mount("#app");
