import { createApp, defineCustomElement } from "vue";
import App from "./App.vue";
import InfographicSection from "./components/InfographicSection.ce.vue";

if (!customElements.get("marine-section")) {
    customElements.define("marine-section", defineCustomElement(InfographicSection));
}

createApp(App).mount("#app");
