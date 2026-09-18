import { defineCustomElement, type ComponentOptions } from 'vue'
import AppComponent from './App.vue'
import type { MicroFrontend } from '@microapp/shared-contract'

import styles from './assets/styles/main.css?inline'

interface VueCustomElementOptions extends ComponentOptions {
    styles?: string[]
}

const componentOptions = AppComponent as VueCustomElementOptions

const MyMicroFrontendElement = defineCustomElement({
    ...componentOptions,
    styles: [styles, ...(componentOptions.styles || [])]
})

if (!customElements.get('my-home')) {
    customElements.define('my-home', MyMicroFrontendElement)
}

let elementInstance: HTMLElement | null = null

const microfrontend: MicroFrontend = {
    mount(container) {
        elementInstance = document.createElement('my-home')
        container.appendChild(elementInstance)
    },

    unmount() {
        if (elementInstance) {
            elementInstance.remove()
            elementInstance = null
        }
    },
}

export default microfrontend
export const { mount, unmount } = microfrontend