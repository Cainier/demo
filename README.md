# Demo

Demo project

## ESM

- [package.json](package.json) 增加 `"type": "module"`
- `@quasar/app-vite` 版本更新至最新 (Ex: ^2.0.0-beta.15)
- `@types/node` 版本更新至 LTS (Ex: ^20.14.11)
- [tsconfig.json](tsconfig.json) 中 `compilerOptions` 增加 `"moduleResolution": "bundler"`
- [postcss.config.cjs](postcss.config.js) 重命名为 [postcss.config.js](postcss.config.js)

- [postcss.config.js](postcss.config.js) 内容修改

```javascript
import autoprefixer from 'autoprefixer'

export default {
    plugins: [
        autoprefixer({
            overrideBrowserslist: [
                'last 4 Chrome versions',
                'last 4 Firefox versions',
                'last 4 Edge versions',
                'last 4 Safari versions',
                'last 4 Android versions',
                'last 4 ChromeAndroid versions',
                'last 4 FirefoxAndroid versions',
                'last 4 iOS versions'
            ]
        })
    ]
}
```

- [quasar.config.js](quasar.config.js) 重命名为 [quasar.config.ts](quasar.config.ts)
- [quasar.config.ts](quasar.config.ts) 内容修改

```javascript
const { configure } = require('quasar/wrappers')
const path          = require('path')
module.exports = configure(function (/* ctx */) {
   // ...
})
```

修改为

```typescript
import { configure } from 'quasar/wrappers'
import path          from 'node:path'

export default configure(_ctx => ({
    // ...
}))
```

- 修改 [src-electron/electron-env.d.ts](src-electron/electron-env.d.ts) 中 `QUASAR_ELECTRON_PRELOAD` 为 `QUASAR_ELECTRON_PRELOAD_FOLDER`
- 新建 [src-electron/init/env.ts](src-electron/init/env.ts)

```typescript
import { fileURLToPath } from 'node:url'
import path              from 'node:path'

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
```

- 修改 [src-electron/electron-main.ts](src-electron/electron-main.ts)

```typescript
mainWindow = new BrowserWindow({
    // ...
    icon          : path.resolve(env.currentDir, 'icons/icon.png'), // tray icon
    webPreferences: {
        // ...
        preload: env.preloadPath,
    },
})
```

- node 组件引入方式修改

```typescript
import fs from 'fs'
// 修改为
import fs from 'node:fs'
```

## Tailwind CSS

- 安装 `npm install -D tailwindcss`
- 新建 [tailwind.config.js](tailwind.config.js)

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,vue,ts}'],
    theme  : {
        extend: {},
    },
    plugins: [],
}
```

- [postcss.config.js](postcss.config.js) 内容修改

```javascript
// https://github.com/michael-ciniawsky/postcss-load-config
import tailwindcss  from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
    plugins: [
        tailwindcss,

        // https://github.com/postcss/autoprefixer
        autoprefixer({
            overrideBrowserslist: [
                'last 4 Chrome versions',
                'last 4 Firefox versions',
                'last 4 Edge versions',
                'last 4 Safari versions',
                'last 4 Android versions',
                'last 4 ChromeAndroid versions',
                'last 4 FirefoxAndroid versions',
                'last 4 iOS versions'
            ]
        })

        // https://github.com/elchininet/postcss-rtlcss
        // If you want to support RTL css, then
        // 1. yarn/npm install postcss-rtlcss
        // 2. optionally set quasar.config.js > framework > lang to an RTL language
        // 3. uncomment the following line:
        // require('postcss-rtlcss')
    ]
}
```

- [src/css/app.sass](src/css/app.sass) 内容修改

```sass
@tailwind base
@tailwind components
@tailwind utilities
```
