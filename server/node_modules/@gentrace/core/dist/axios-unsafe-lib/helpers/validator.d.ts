declare namespace _default {
    export { assertOptions };
    export { validators };
}
export default _default;
/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */
declare function assertOptions(options: object, schema: object, allowUnknown: boolean | null): object;
declare namespace validators {
    /**
     * Transitional option validator
     *
     * @param {function|boolean?} validator - set to false if the transitional option has been removed
     * @param {string?} version - deprecated version / removed since version
     * @param {string?} message - some message with additional info
     *
     * @returns {function}
     */
    function transitional(validator: boolean | Function, version: string, message: string): Function;
}
