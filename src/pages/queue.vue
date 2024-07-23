<template>
    <main class="p-4">
        <div>Total: {{ q.total.size }}</div>
        <div>Running: {{ q.running.size }}</div>
        <div>Success: {{ q.success.size }}</div>
        <div>Timeout: {{ q.timeout.size }}</div>
        <q-btn
            label="Add"
            @click="add"
        />
        <q-btn
            label="Start"
            @click="start"
        />
    </main>
</template>

<script setup lang="ts">
import { ref }                 from 'vue'
import _Queue, { QueueWorker } from 'queue'
import { wait }                from 'src/core/wait'

class Queue {
    constructor (...options: ConstructorParameters<typeof _Queue>) {
        this.q = new _Queue(...options)
    }

    readonly q

    readonly total   = new Set<QueueWorker>()
    readonly running = new Set<QueueWorker>()
    readonly timeout = new Set<QueueWorker>()

    readonly success = new Set<{
        job: QueueWorker
        res: any
    }>()

    public push (job: (...args: any) => Promise<any>) {
        this.total.add(job)

        return this.q.push((cb) => {
            job()
                .then(res => {
                    if (cb) cb(undefined, res)
                })
                .catch(err => {
                    if (cb) cb(err)
                })
        })
    }

    public async start () {
        return await this.q.start()
    }
}

const q = ref(new Queue({
    concurrency: 3,
    timeout    : 300,
    // autostart  : true,
}))

q.value.q.addEventListener('start', e => {
    if (!e.detail.job) return

    q.value.running.add(e.detail.job)
})

q.value.q.addEventListener('end', e => {
    console.log('end', e)
})

q.value.q.addEventListener('error', e => {
    console.log('error', e)
})

q.value.q.addEventListener('timeout', e => {
    q.value.running.delete(e.detail.job)
    q.value.timeout.add(e.detail.job)
})

q.value.q.addEventListener('success', e => {
    // @ts-ignore
    q.value.running.delete(e.detail.job)
    q.value.success.add({
        // @ts-ignore
        job: e.detail.job,
        res: e.detail.result,
    })
})

function add () {
    q.value.push(async () => {
        const time = Math.random() * 1000

        await wait(time)

        if (time > 500) throw new Error('???')

        return Date.now()
    })
}

async function start () {
    await q.value.start()
    console.log('.....')
}
</script>
