/* eslint-disable */

declare namespace NodeJS {
    interface ProcessEnv {
        QUASAR_PUBLIC_FOLDER: string
        QUASAR_ELECTRON_PRELOAD_FOLDER: string
        APP_URL: string
    }
}
