export interface MicroFrontendConfig {
    url: string
}

export const microfrontends = {
    home: {
        url: import.meta.env.PUBLIC_HOME_MFE_URL,
    },

    experience: {
        url: import.meta.env.PUBLIC_EXPERIENCE_MFE_URL,
    },
} satisfies Record<string, MicroFrontendConfig>
