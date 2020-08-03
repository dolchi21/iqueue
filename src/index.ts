import Queue from 'promise-queue'
export default class IQueue {
    queue: Queue
    constructor(queue?: Queue) {
        this.queue = queue || new Queue(1)
    }
    threshold = 5 / 100
    state = {
        count: 0,
        ms: 0,
    }
    add<T>(fn: () => Promise<T>): Promise<T> {
        return this.queue.add(async () => {
            const start = Date.now()
            const ret = await fn()
            const ms = Date.now() - start
            this.state.count++
            this.state.ms += ms
            const average = this.state.ms / this.state.count

            if (ms < average) {
                const diff = average - ms
                const ath = average * this.threshold
                if (diff > ath) {
                    //@ts-ignore
                    this.queue.maxPendingPromises++
                }
            }
            //@ts-ignore
            if (average < ms && 1 < this.queue.maxPendingPromises) {
                //@ts-ignore
                this.queue.maxPendingPromises--
            }
            //@ts-ignore
            this.queue._dequeue()
            return ret
        })
    }
}
