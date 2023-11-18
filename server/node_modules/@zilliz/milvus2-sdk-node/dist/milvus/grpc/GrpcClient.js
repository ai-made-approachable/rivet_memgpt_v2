"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRPCClient = void 0;
const fs_1 = require("fs");
const grpc_js_1 = require("@grpc/grpc-js");
const dayjs_1 = __importDefault(require("dayjs"));
const __1 = require("../");
const User_1 = require("./User");
/**
 * A client for interacting with the Milvus server via gRPC.
 */
class GRPCClient extends User_1.User {
    // create a grpc service client(connect)
    connect(sdkVersion) {
        // get Milvus GRPC service
        const MilvusService = (0, __1.getGRPCService)({
            protoPath: this.protoFilePath.milvus,
            serviceName: this.protoInternalPath.serviceName, // the name of the Milvus service
        });
        // meta interceptor, add the injector
        const metaInterceptor = (0, __1.getMetaInterceptor)(this.metadataListener.bind(this));
        // retry interceptor
        const retryInterceptor = (0, __1.getRetryInterceptor)({
            maxRetries: typeof this.config.maxRetries === 'undefined'
                ? __1.DEFAULT_MAX_RETRIES
                : this.config.maxRetries,
            retryDelay: typeof this.config.retryDelay === 'undefined'
                ? __1.DEFAULT_RETRY_DELAY
                : this.config.retryDelay,
            clientId: this.clientId,
        });
        // interceptors
        const interceptors = [metaInterceptor, retryInterceptor];
        // add interceptors
        this.channelOptions.interceptors = interceptors;
        // setup auth if necessary
        const auth = (0, __1.getAuthString)(this.config);
        if (auth.length > 0) {
            this.metadata.set(__1.METADATA.AUTH, auth);
        }
        // setup database
        this.metadata.set(__1.METADATA.DATABASE, this.config.database || __1.DEFAULT_DB);
        // create credentials
        let creds;
        // assign credentials according to the tls mode
        switch (this.tlsMode) {
            case __1.TLS_MODE.ONE_WAY:
                // create ssl with empty parameters
                creds = grpc_js_1.credentials.createSsl();
                break;
            case __1.TLS_MODE.TWO_WAY:
                const { rootCertPath, privateKeyPath, certChainPath, verifyOptions } = this.config.tls;
                // init
                let rootCertBuff = null;
                let privateKeyBuff = null;
                let certChainBuff = null;
                // read root cert file
                if (rootCertPath) {
                    rootCertBuff = (0, fs_1.readFileSync)(rootCertPath);
                }
                // read private key file
                if (privateKeyPath) {
                    privateKeyBuff = (0, fs_1.readFileSync)(privateKeyPath);
                }
                // read cert chain file
                if (certChainPath) {
                    certChainBuff = (0, fs_1.readFileSync)(certChainPath);
                }
                // create credentials
                creds = grpc_js_1.credentials.createSsl(rootCertBuff, privateKeyBuff, certChainBuff, verifyOptions);
                break;
            default:
                creds = grpc_js_1.credentials.createInsecure();
                break;
        }
        // create grpc client
        this.client = new MilvusService((0, __1.formatAddress)(this.config.address), // format the address
        creds, this.channelOptions);
        // connect to get identifier
        this.connectPromise = this._getServerInfo(sdkVersion);
    }
    /**
     * Injects client metadata into the metadata of the gRPC client.
     * @param metadata The metadata object of the gRPC client.
     * @returns The updated metadata object.
     */
    metadataListener(metadata) {
        // inject client metadata into the metadata of the grpc client
        for (var [key, value] of this.metadata) {
            metadata.add(key, value);
        }
        return metadata;
    }
    /**
     * Sets the active database for the gRPC client.
     * @param data An optional object containing the name of the database to use.
     * @returns A Promise that resolves with a `ResStatus` object.
     */
    use(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                if (!data || data.db_name === '') {
                    __1.logger.info(`No database name provided, using default database: ${__1.DEFAULT_DB}`);
                }
                // update database
                this.metadata.set(__1.METADATA.DATABASE, (data && data.db_name) || __1.DEFAULT_DB);
                resolve({ error_code: __1.ErrorCode.SUCCESS, reason: '' });
            });
        });
    }
    /**
     * Retrieves server information from the Milvus server.
     * @param {string} sdkVersion - The version of the SDK being used.
     * @returns {Promise<void>} - A Promise that resolves when the server information has been retrieved.
     */
    _getServerInfo(sdkVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            // build user info
            const userInfo = {
                client_info: {
                    sdk_type: 'nodejs',
                    sdk_version: sdkVersion,
                    local_time: (0, dayjs_1.default)().format(`YYYY-MM-DD HH:mm:ss.SSS`),
                    user: this.config.username,
                },
            };
            // update connect status
            this.connectStatus = __1.CONNECT_STATUS.CONNECTING;
            return (0, __1.promisify)(this.client, 'Connect', userInfo, this.timeout).then(f => {
                // add new identifier interceptor
                if (f && f.identifier) {
                    // update identifier
                    this.metadata.set(__1.METADATA.CLIENT_ID, f.identifier);
                    // setup identifier
                    this.serverInfo = f.server_info;
                }
                // update connect status
                this.connectStatus =
                    f && f.identifier
                        ? __1.CONNECT_STATUS.CONNECTED
                        : __1.CONNECT_STATUS.UNIMPLEMENTED;
            });
        });
    }
    /**
     * Closes the gRPC client connection and returns the connectivity state of the channel.
     * This method should be called before terminating the application or when the client is no longer needed.
     * This method returns a number that represents the connectivity state of the channel:
     * - 0: CONNECTING
     * - 1: READY
     * - 2: IDLE
     * - 3: TRANSIENT FAILURE
     * - 4: FATAL FAILURE
     * - 5: SHUTDOWN
     */
    closeConnection() {
        // Close the gRPC client connection
        if (this.client) {
            this.client.close();
        }
        // grpc client closed -> 4, connected -> 0
        if (this.client) {
            return this.client.getChannel().getConnectivityState(true);
        }
    }
    /**
     * Returns version information for the Milvus server.
     * This method returns a Promise that resolves with a `GetVersionResponse` object.
     */
    getVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, __1.promisify)(this.client, 'GetVersion', {}, this.timeout);
        });
    }
    /**
     * Checks the health of the Milvus server.
     * This method returns a Promise that resolves with a `CheckHealthResponse` object.
     */
    checkHealth() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, __1.promisify)(this.client, 'CheckHealth', {}, this.timeout);
        });
    }
}
exports.GRPCClient = GRPCClient;
//# sourceMappingURL=GrpcClient.js.map