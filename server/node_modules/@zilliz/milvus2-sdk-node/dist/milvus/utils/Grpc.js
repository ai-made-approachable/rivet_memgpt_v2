"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRetryInterceptor = exports.getMetaInterceptor = exports.getGRPCService = void 0;
const path_1 = __importDefault(require("path"));
const proto_loader_1 = require("@grpc/proto-loader");
const grpc_js_1 = require("@grpc/grpc-js");
const _1 = require(".");
const const_1 = require("../const");
const PROTO_OPTIONS = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};
/**
 * Returns a gRPC service client constructor for the given proto file and service name.
 * @param proto An object containing the proto file path and service name.
 * @returns A gRPC service client constructor.
 */
const getGRPCService = (proto) => {
    // Resolve the proto file path.
    const PROTO_PATH = path_1.default.resolve(__dirname, proto.protoPath);
    // Load the proto file.
    const packageDefinition = (0, proto_loader_1.loadSync)(PROTO_PATH, PROTO_OPTIONS);
    // Load the gRPC object.
    const grpcObj = (0, grpc_js_1.loadPackageDefinition)(packageDefinition);
    // Get the service object from the gRPC object.
    const service = proto.serviceName
        .split('.')
        .reduce((a, b) => a[b], grpcObj);
    // Check that the service object is valid.
    if ((service === null || service === void 0 ? void 0 : service.name) !== 'ServiceClientImpl') {
        throw new Error(`Unable to load service: ${proto.serviceName} from ${proto.protoPath}`);
    }
    // Return the service client constructor.
    return service;
};
exports.getGRPCService = getGRPCService;
/**
 * Returns a gRPC interceptor function that adds metadata to outgoing requests.
 *
 * @param {Function} onInvoked - A function to be called with the modified metadata.
 * @param {Object[]} initValues - An array of objects containing key-value pairs to add to the metadata.
 * @returns {Function} The gRPC interceptor function.
 */
const getMetaInterceptor = (onInvoked, initValues = []) => function (options, nextCall) {
    // Create a new InterceptingCall object with nextCall(options) as its first parameter.
    return new grpc_js_1.InterceptingCall(nextCall(options), {
        // Define the start method of the InterceptingCall object.
        start: function (metadata, listener, next) {
            initValues.forEach(obj => {
                Object.entries(obj).forEach(([key, value]) => {
                    metadata.add(key, value);
                });
            });
            if (onInvoked) {
                onInvoked(metadata);
            }
            // Call next(metadata, listener) to continue the call with the modified metadata.
            next(metadata, listener);
        },
    });
};
exports.getMetaInterceptor = getMetaInterceptor;
/**
 * Returns a gRPC interceptor function that retries failed requests up to a maximum number of times.
 *
 * @param {Object} options - The options object.
 * @param {number} options.maxRetries - The maximum number of times to retry a failed request.
 * @param {number} options.retryDelay - The delay in milliseconds between retries.
 * @returns {Function} The gRPC interceptor function.
 */
/* istanbul ignore next */
const getRetryInterceptor = ({ maxRetries = 3, retryDelay = 30, clientId = '' }) => function (options, nextCall) {
    let savedMetadata;
    let savedSendMessage;
    let savedReceiveMessage;
    let savedMessageNext;
    // deadline
    const deadline = options.deadline;
    // get method name
    // option example
    // {
    //   deadline: 2023-05-04T09:04:16.231Z,
    //   method_definition: {
    //     path: '/milvus.proto.milvus.MilvusService/ListCredUsers',
    //     requestStream: false,
    //     responseStream: false,
    //     requestSerialize: [Function: serialize],
    //     responseDeserialize: [Function: deserialize]
    //   }
    // }
    const methodName = (0, _1.extractMethodName)(options.method_definition.path);
    // start time
    const startTime = new Date();
    let dbname = '';
    // requester, used to re-execute method
    let requester = {
        start: function (metadata, listener, next) {
            savedMetadata = metadata;
            // get db name
            dbname = metadata.get('dbname') || const_1.DEFAULT_DB;
            // logger.debug(`[DB:${dbname}:${methodName}] started.`);
            const newListener = {
                onReceiveMessage: function (message, next) {
                    savedReceiveMessage = message;
                    savedMessageNext = next;
                },
                onReceiveStatus: function (status, next) {
                    // retry count
                    let retries = 0;
                    // retry function
                    let retry = function (message, metadata) {
                        // retry count
                        retries++;
                        // retry delay
                        const _retryDelay = Math.pow(2, retries) * retryDelay;
                        // timeout
                        const _timeout = deadline.getTime() - startTime.getTime();
                        // log
                        _1.logger.debug(`[${clientId}>${dbname}>${methodName}] executed failed, status: ${JSON.stringify(status)}, timeout set: ${_timeout}ms, retry after ${_retryDelay} ms.`);
                        // retry listener
                        const retryListener = {
                            onReceiveMessage: function (message) {
                                savedReceiveMessage = message;
                            },
                            onReceiveStatus: function (status) {
                                if ((0, _1.isStatusCodeMatched)(status.code)) {
                                    if (retries < maxRetries) {
                                        setTimeout(() => {
                                            // need to update the deadline
                                            retry(message, metadata);
                                            // double increase delay every retry
                                        }, _retryDelay);
                                    }
                                    else {
                                        _1.logger.debug(`[${clientId}>${dbname}>${methodName}] retry run out of ${retries} times. ${JSON.stringify(status)}`);
                                        // we still pop up server information to client
                                        savedMessageNext(savedReceiveMessage);
                                        // and do the next call if there is
                                        next(status);
                                    }
                                }
                                else {
                                    _1.logger.debug(`[${clientId}>${dbname}>${methodName}] retried successfully in ${Date.now() - startTime.getTime()}ms.`);
                                    savedMessageNext(savedReceiveMessage);
                                    next({ code: grpc_js_1.status.OK });
                                }
                            },
                        };
                        // retry, update deadline
                        options.deadline = new Date(Date.now() + _timeout);
                        let newCall = nextCall(options);
                        newCall.start(metadata, retryListener);
                    };
                    // check grpc status
                    switch (status.code) {
                        case grpc_js_1.status.DEADLINE_EXCEEDED:
                        case grpc_js_1.status.UNAVAILABLE:
                        case grpc_js_1.status.INTERNAL:
                            retry(savedSendMessage, savedMetadata);
                            break;
                        case grpc_js_1.status.UNIMPLEMENTED:
                            // const returnMsg = { error_code: 'Success', reason: '' };
                            _1.logger.debug(`[${clientId}>${dbname}>${methodName}] returns ${JSON.stringify(status)}`);
                            // throw new Error(
                            //   'This version of sdk is incompatible with the server, please downgrade your sdk or upgrade your server.'
                            // );
                            // return empty message
                            savedReceiveMessage = {};
                            next({ code: grpc_js_1.status.OK });
                        default:
                            // OK
                            _1.logger.debug(`[${clientId}>${dbname}>${methodName}] executed in ${Date.now() - startTime.getTime()}ms, returns ${JSON.stringify(savedReceiveMessage)}`);
                            savedMessageNext(savedReceiveMessage);
                            next(status);
                    }
                },
            };
            next(metadata, newListener);
        },
        sendMessage: function (message, next) {
            _1.logger.debug(`[${clientId}>${dbname}>${methodName}] sending ${JSON.stringify(message)}`);
            savedSendMessage = message;
            next(message);
        },
    };
    return new grpc_js_1.InterceptingCall(nextCall(options), requester);
};
exports.getRetryInterceptor = getRetryInterceptor;
//# sourceMappingURL=Grpc.js.map