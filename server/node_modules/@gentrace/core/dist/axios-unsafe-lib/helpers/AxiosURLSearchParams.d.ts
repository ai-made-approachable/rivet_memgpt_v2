export default AxiosURLSearchParams;
/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
declare function AxiosURLSearchParams(params: {
    [x: string]: any;
}, options: {
    [x: string]: any;
}): void;
declare class AxiosURLSearchParams {
    /**
     * It takes a params object and converts it to a FormData object
     *
     * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
     * @param {Object<string, any>} options - The options object passed to the Axios constructor.
     *
     * @returns {void}
     */
    constructor(params: {
        [x: string]: any;
    }, options: {
        [x: string]: any;
    });
    _pairs: any[];
}
