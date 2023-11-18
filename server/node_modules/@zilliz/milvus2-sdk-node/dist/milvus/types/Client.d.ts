import { ChannelOptions } from '@grpc/grpc-js';
/**
 * Configuration options for the Milvus client.
 */
export interface ClientConfig {
    id?: string;
    protoFilePath?: {
        milvus?: string;
        schema?: string;
    };
    address: string;
    token?: string;
    ssl?: boolean;
    username?: string;
    password?: string;
    channelOptions?: ChannelOptions;
    timeout?: number | string;
    maxRetries?: number;
    retryDelay?: number;
    database?: string;
    logLevel?: string;
    tls?: {
        rootCertPath?: string;
        privateKeyPath?: string;
        certChainPath?: string;
        verifyOptions?: Record<string, any>;
        serverName?: string;
    };
}
export interface ServerInfo {
    build_tags?: string;
    build_time?: string;
    git_commit?: string;
    go_version?: string;
    deploy_mode?: string;
    reserved?: {
        [key: string]: any;
    };
}
