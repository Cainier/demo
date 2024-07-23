import _Queue, { QueueWorker } from 'queue'

export class Queue {
    constructor (...options: ConstructorParameters<typeof _Queue>) {
        this._q = new _Queue(...options)
    }

    public init () {
        this._q.addEventListener('start', e => {
            const { job } = e.detail

            if (!job) return

            this.running.add(job)

            this.waiting.delete(job)
        })

        this._q.addEventListener('end', e => {
            console.log('end', e)
        })

        this._q.addEventListener('timeout', e => {
            const { job } = e.detail

            this.timeout.add(job)
            this.failed.add({
                job,
                err: new Error('timeout'),
            })

            this.running.delete(job)
        })

        this._q.addEventListener('success', e => {
            // @ts-ignore
            const { job } = e.detail

            this.success.add({
                job,
                res: e.detail.result,
            })

            this.running.delete(job)
        })
    }

    private readonly _q

    readonly total   = new Set<QueueWorker>()
    readonly waiting = new Set<QueueWorker>()
    readonly running = new Set<QueueWorker>()
    readonly timeout = new Set<QueueWorker>()

    readonly success = new Set<{
        job: QueueWorker
        res: any
    }>()

    readonly failed = new Set<{
        job: QueueWorker
        err: Error
    }>()

    public push (func: (...args: any) => Promise<any>) {
        const job: QueueWorker = cb => {
            func()
                .then(res => {
                    if (cb) cb(undefined, res)
                })
                .catch(err => {
                    if (cb) cb(err)
                })
        }

        this.waiting.add(job)
        this.total.add(job)

        return this._q.push(job)
    }

    public async start () {
        return await this._q.start()
    }

    public clear () {
        this._q.end()

        this.total.clear()
        this.waiting.clear()
        this.running.clear()
        this.timeout.clear()
        this.success.clear()
        this.failed.clear()
    }
}
