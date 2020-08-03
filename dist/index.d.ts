import Queue from 'promise-queue';
export default class IQueue {
    queue: Queue;
    constructor(queue?: Queue);
    threshold: number;
    state: {
        count: number;
        ms: number;
    };
    add<T>(fn: () => Promise<T>): Promise<T>;
}
