import { createApp } from "vue";

import "./assets/styles/style.css";
import CategorizerVue from "./Categorizer.vue";

export interface CategorizerObject {
	id: number,
	creationDate: Date
}

window.onload = () => createApp(CategorizerVue).mount("#categorizer");
