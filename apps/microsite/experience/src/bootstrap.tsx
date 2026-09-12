import { createRoot, type Root } from "react-dom/client";
import App from "./App";
import type { MicroFrontend } from "@microapp/shared-contract";

import styles from "./assets/styles/main.css?inline";

let root: Root | null = null;
let shadowRoot: ShadowRoot | null = null;

const microfrontend: MicroFrontend = {
  mount(container) {
    shadowRoot =
      container.shadowRoot ??
      container.attachShadow({
        mode: "open",
      });

    console.log("[ABOUT] shadow root", shadowRoot);

    const style = document.createElement("style");

    style.textContent = styles;

    shadowRoot.appendChild(style);

    const mountPoint = document.createElement("div");

    mountPoint.id = "mfe-root";

    shadowRoot.appendChild(mountPoint);

    root = createRoot(mountPoint);

    root.render(<App />);
  },

  unmount() {
    root?.unmount();
    root = null;

    shadowRoot?.replaceChildren();
    shadowRoot = null;
  },
};

export default microfrontend;

export const { mount, unmount } = microfrontend;
