export default formDataToJSON;
/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
declare function formDataToJSON(formData: string): {
    [x: string]: any;
} | null;
