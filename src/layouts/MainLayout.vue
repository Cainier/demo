<template>
    <q-layout view="lHh Lpr lFf">
        <q-header elevated>
            <q-toolbar>
                <q-btn
                    aria-label="Menu"
                    dense
                    flat
                    icon="menu"
                    round
                    @click="toggleLeftDrawer"
                />

                <q-toolbar-title>
                    {{ $router.currentRoute.value.path }}
                </q-toolbar-title>

                <div>v{{ $q.version }}</div>
            </q-toolbar>
        </q-header>

        <q-drawer
            v-model="leftDrawerOpen"
            bordered
            show-if-above
        >
            <q-list>
                <q-item-label
                    header
                >
                    Essential Links
                </q-item-label>

                <EssentialLink v-for="name in pages" :name="name"/>
            </q-list>
        </q-drawer>

        <q-page-container>
            <router-view/>
        </q-page-container>
    </q-layout>
</template>

<script lang="ts" setup>
import { ref }       from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { pages }     from 'src/router/routes'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
    leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
