import { fileURLToPath } from 'node:url'
import path              from 'node:path'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

const currentDir  = fileURLToPath(new URL('.', import.meta.url))
const preloadPath = path.resolve(
    currentDir,
    path.join(process.env.QUASAR_ELECTRON_PRELOAD_FOLDER, 'electron-preload' + process.env.QUASAR_ELECTRON_PRELOAD_EXTENSION)
)

export const env = {
    path: {
        currentDir,
        preloadPath,
    }
}
