declare namespace _default {
    let isNode: boolean;
    namespace classes {
        export { URLSearchParams };
        export { FormData };
        export let Blob: {
            new (blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
            prototype: Blob;
        };
    }
    let protocols: string[];
}
export default _default;
import URLSearchParams from './classes/URLSearchParams.js';
import FormData from './classes/FormData.js';
