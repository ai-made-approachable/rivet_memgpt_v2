export default AxiosHeaders;
declare class AxiosHeaders {
    static from(thing: any): AxiosHeaders;
    static concat(first: any, ...targets: any[]): AxiosHeaders;
    static accessor(header: any): typeof AxiosHeaders;
    constructor(headers: any);
    set(header: any, valueOrRewrite: any, rewrite: any): this;
    get(header: any, parser: any): any;
    has(header: any, matcher: any): boolean;
    delete(header: any, matcher: any): boolean;
    clear(matcher: any): boolean;
    normalize(format: any): this;
    concat(...targets: any[]): any;
    toJSON(asStrings: any): any;
    toString(): string;
    [Symbol.iterator](): IterableIterator<[string, any]>;
    get [Symbol.toStringTag](): string;
    [$internals]: {
        accessors: {};
    };
}
declare const $internals: unique symbol;
