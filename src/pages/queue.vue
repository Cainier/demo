<template>
    <main class="p-4 space-y-4">
        <q-list
            bordered separator
            class="w-[300px]"
        >
            <q-item
                v-for="item in [
                { label: 'Total',   value: queue.total.size   },
                { label: 'Waiting', value: queue.waiting.size },
                { label: 'Running', value: queue.running.size },
                { label: 'Success', value: queue.success.size },
                { label: 'Failed',  value: queue.failed.size },
                { label: 'Timeout', value: queue.timeout.size },
            ]"
                clickable
            >
                <q-item-section>{{ item.label }}</q-item-section>
                <q-item-section side>{{ item.value }}</q-item-section>
            </q-item>
        </q-list>

        <div class="space-x-2">
            <q-btn
                v-for="item in [
                    { label: 'Add',   click: add   },
                    { label: 'Start', click: start },
                    { label: 'Clear', click: clear },
                ]"
                :label="item.label"
                unelevated
                color="primary"
                no-caps
                @click="item.click"
            />
        </div>
    </main>
</template>

<script setup lang="ts">
import { ref }   from 'vue'
import { wait }  from 'src/core/wait'
import { Queue } from 'src/core/queue'

const queue = ref(new Queue({
    concurrency: 3,
    timeout    : 700,
    // autostart  : true,
}))

queue.value.init()

function add () {
    queue.value.push(async () => {
        const time = Math.random() * 10000

        await wait(time)

        if (time < 300) throw new Error('Random failed')

        return Date.now()
    })
}

async function start () {
    const res = await queue.value.start()
    console.log(res, queue.value)
}

function clear () {
    queue.value.clear()
}
</script>
