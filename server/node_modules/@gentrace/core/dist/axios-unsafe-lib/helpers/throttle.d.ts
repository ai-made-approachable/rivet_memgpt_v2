export default throttle;
/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
declare function throttle(fn: Function, freq: number): Function;
