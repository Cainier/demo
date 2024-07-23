<template>
    <q-item :to="name">
        <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
    name: string
}>(), {})
</script>
