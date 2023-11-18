export default CancelToken;
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
declare class CancelToken {
    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    static source(): {
        token: CancelToken;
        cancel: undefined;
    };
    constructor(executor: any);
    promise: Promise<any>;
    /**
     * Throws a `CanceledError` if cancellation has been requested.
     */
    throwIfRequested(): void;
    /**
     * Subscribe to the cancel signal
     */
    subscribe(listener: any): void;
    _listeners: any[];
    /**
     * Unsubscribe from the cancel signal
     */
    unsubscribe(listener: any): void;
}
