import { app, BrowserWindow } from 'electron'
import path                   from 'node:path'
import os                     from 'node:os'
import { env }                from 'app/src-electron/init/env'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

let mainWindow: BrowserWindow | undefined

function createWindow () {
    /**
     * Initial window options
     */
    mainWindow = new BrowserWindow({
        icon          : path.resolve(env.path.currentDir, 'icons/icon.png'), // tray icon
        width         : 1600,
        height        : 700,
        useContentSize: true,
        webPreferences: {
            contextIsolation: true,
            // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
            preload: env.path.preloadPath,
        },
    })

    mainWindow.loadURL(process.env.APP_URL).then()

    if (process.env.DEBUGGING) {
        // if on DEV or Production with debug enabled
        mainWindow.webContents.openDevTools()
    } else {
        // we're on production; no access to devtools pls
        mainWindow.webContents.on('devtools-opened', () => {
            mainWindow?.webContents.closeDevTools()
        })
    }

    mainWindow.on('closed', () => {
        mainWindow = undefined
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === undefined) {
        createWindow()
    }
})
