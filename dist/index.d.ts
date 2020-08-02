export default class IQueue {
    queue: any;
    constructor(queue: any);
    threshold: number;
    state: {
        count: number;
        ms: number;
    };
    add<T>(fn: () => Promise<T>): Promise<T>;
}
