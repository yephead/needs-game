import { mount } from "svelte";
import App from "./App.svelte";
import { registerPwa } from "./pwa";
import "../styles.css";

const target = document.getElementById("app");

if (!target) {
  throw new Error("Missing #app mount target");
}

mount(App, { target });
registerPwa();
