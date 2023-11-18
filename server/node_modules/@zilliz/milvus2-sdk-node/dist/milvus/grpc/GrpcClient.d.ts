import { Metadata } from '@grpc/grpc-js';
import { GetVersionResponse, CheckHealthResponse } from '../';
import { User } from './User';
/**
 * A client for interacting with the Milvus server via gRPC.
 */
export declare class GRPCClient extends User {
    connect(sdkVersion: string): void;
    /**
     * Injects client metadata into the metadata of the gRPC client.
     * @param metadata The metadata object of the gRPC client.
     * @returns The updated metadata object.
     */
    protected metadataListener(metadata: Metadata): Metadata;
    /**
     * Sets the active database for the gRPC client.
     * @param data An optional object containing the name of the database to use.
     * @returns A Promise that resolves with a `ResStatus` object.
     */
    use(data?: {
        db_name: string;
    }): Promise<any>;
    /**
     * Retrieves server information from the Milvus server.
     * @param {string} sdkVersion - The version of the SDK being used.
     * @returns {Promise<void>} - A Promise that resolves when the server information has been retrieved.
     */
    private _getServerInfo;
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
    closeConnection(): import("@grpc/grpc-js").connectivityState | undefined;
    /**
     * Returns version information for the Milvus server.
     * This method returns a Promise that resolves with a `GetVersionResponse` object.
     */
    getVersion(): Promise<GetVersionResponse>;
    /**
     * Checks the health of the Milvus server.
     * This method returns a Promise that resolves with a `CheckHealthResponse` object.
     */
    checkHealth(): Promise<CheckHealthResponse>;
}
