import type { MicroFrontend } from '@microapp/shared-contract'

export interface LoadMicroFrontendOptions {
    url: string
    container: HTMLElement
}

function isMicroFrontend(value: unknown): value is MicroFrontend {
    return (
        typeof value === 'object' &&
        value !== null &&
        'mount' in value &&
        'unmount' in value &&
        typeof value.mount === 'function' &&
        typeof value.unmount === 'function'
    )
}

export async function loadMicroFrontend({
    url,
    container,
}: LoadMicroFrontendOptions) {
    try {
        const module = await import(/* @vite-ignore */ url)
        console.log(module, 'module');
        
        if (!isMicroFrontend(module)) {
            throw new Error(
                `Remote module "${url}" does not implement the MicroFrontend contract`,
            )
        }

        await module.mount(container)

        return async () => {
            await module.unmount()
        }
    } catch (error) {
        throw error
    }
}