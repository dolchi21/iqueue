import axios from 'axios'
import fs from 'fs'
//@ts-ignore
import Queue from 'promise-queue'

import IQueue from './'

interface IState {
    max: number
    errors: number
    iqueue: IStateMedia
    media: { [key: string]: IStateMedia }
    time: any
}
interface IStateMedia {
    count: number
    ms: number
}
class State implements IState {
    max = 0
    media = {}
    iqueue = {
        count: 0,
        ms: 0
    }
    errors = 0
    time = {
        start: Date.now(),
        end: Date.now(),
        ms: 0
    }
}

async function file(name: string, data?: any) {
    if (!data) return new Promise((resolve, reject) => fs.readFile(name, (err, data) => {
        if (err) return reject(err)
        resolve(JSON.parse(data.toString()))
    }))

    const str = JSON.stringify(data, null, 2)
    return new Promise((resolve, reject) => {
        fs.writeFile(name, str, err => {
            if (err) return reject(err)
            resolve()
        })
    })
}
async function task() {
    //const url = 'https://web02.cobranzas.com/classes/InboxDocument.test.asp?id=351494'
    const url = 'https://web02.cobranzas.com/api/'
    const res = await axios.get(url, {
        headers: {
            cobranzas: '123'
        }
    })
    return res.data
}

async function main() {
    if (process.argv[2]) return analize()
    const queue = new Queue(5)
    const media: { [key: string]: any } = {}
    const state = new State()
    const tasks = []
    const iqueue = new IQueue(queue)
    for (let i = 0; i < 10000; i++) {
        const t = iqueue.add(async () => {
            const key = queue.maxPendingPromises
            const start = Date.now()
            await task()
            if (!media[key]) media[key] = {
                count: 0,
                ms: 0,
            }
            media[key].count++
            media[key].ms += Date.now() - start
            return 123
        })
        t.then(() => {
            if (state.max < queue.maxPendingPromises) state.max = queue.maxPendingPromises
            state.time.end = Date.now()
            state.time.ms = state.time.end - state.time.start
            console.log(queue.getQueueLength(), queue.maxPendingPromises, { ...state, ...iqueue.state })
            return file('state.json', {
                ...state,
                iqueue: iqueue.state
            })
        }).catch(err => {
            state.errors++
            console.error(err)
        })
        tasks.push(t)
    }
    await file('state.json', {
        ...state,
        iqueue: iqueue.state
    })
    await Promise.all(tasks)
    state.time.end = Date.now()
    state.time.ms = state.time.end - state.time.start
    await file('state.json', {
        ...state,
        iqueue: iqueue.state,
        media
    })
}

async function analize(num = '') {
    const state = await file('state' + num + '.json') as IState
    const r = Object.entries(state.media).map(pair => {
        const { count, ms } = pair[1]
        return {
            key: pair[0],
            value: ms / count
        }
    }).sort((a, b) => {
        return a.value - b.value
    }).filter((e, i) => i < 20)
    console.log(r)
    console.log('ms', state.iqueue.ms, state.iqueue.ms / state.iqueue.count)
}

main().catch(err => {
})