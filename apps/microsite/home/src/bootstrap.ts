import { createApp, type App } from 'vue'
import AppComponent from './App.vue'
import type { MicroFrontend } from '@microapp/shared-contract'

import styles from './assets/styles/main.css?inline'

let app: App<Element> | null = null
let shadowRoot: ShadowRoot | null = null

const microfrontend: MicroFrontend = {
    mount(container) {
        shadowRoot =
            container.shadowRoot ??
            container.attachShadow({
                mode: 'open',
            })

        const style = document.createElement('style')

        style.textContent = styles

        shadowRoot.appendChild(style)

        const mountPoint = document.createElement('div')

        mountPoint.id = 'mfe-root'

        shadowRoot.appendChild(mountPoint)

        app = createApp(AppComponent)

        app.mount(mountPoint)
    },

    unmount() {
        app?.unmount()

        app = null

        shadowRoot?.replaceChildren()

        shadowRoot = null
    },
}

export default microfrontend

export const { mount, unmount } = microfrontend