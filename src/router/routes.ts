import { RouteRecordRaw } from 'vue-router'

export const pages = [
    'queue',
]

const routes: RouteRecordRaw[] = [
    {
        path     : '/',
        component: () => import('layouts/MainLayout.vue'),
        children : pages.map(name => ({
            path     : name,
            component: () => import(`pages/${ name }.vue`),
        })),
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path     : '/:catchAll(.*)*',
        component: () => import('pages/404.vue'),
    },
]

export default routes
