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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const BaseClient_1 = require("./BaseClient");
const __1 = require("../");
class Database extends BaseClient_1.BaseClient {
    /**
     * create a database.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | db_name | String | Database name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | status.error_code | string | error code |
     *  | status.reason | string | error reason |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).listDatabases();
     * ```
     */
    createDatabase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // check compatibility
            yield this.checkCompatibility({
                message: `createDatabase is not supported on this version of milvus.`,
            });
            const promise = yield (0, __1.promisify)(this.client, 'CreateDatabase', data, data.timeout || this.timeout);
            return promise;
        });
    }
    /**
     * List all databases.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | status.error_code | string | error code |
     *  | status.reason | string | error reason |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).listDatabases();
     * ```
     */
    listDatabases(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // check compatibility
            yield this.checkCompatibility({
                message: `listDatabases is not supported on this version of milvus.`,
            });
            const promise = yield (0, __1.promisify)(this.client, 'ListDatabases', {}, (data === null || data === void 0 ? void 0 : data.timeout) || this.timeout);
            return promise;
        });
    }
    /**
     * drop a database.
     *
     * @param data
     *  | Property | Type | Description |
     *  | :--- | :-- | :-- |
     *  | db_name | String | Database name |
     *  | timeout? | number | An optional duration of time in millisecond to allow for the RPC. If it is set to undefined, the client keeps waiting until the server responds or error occurs. Default is undefined |
     *
     * @returns
     *  | Property | Type | Description |
     *  | :-- | :-- | :-- |
     *  | status.error_code | string | error code |
     *  | status.reason | string | error reason |
     *
     * #### Example
     *
     * ```
     *  new milvusClient(MILUVS_ADDRESS).listDatabases();
     * ```
     */
    dropDatabase(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // check compatibility
            yield this.checkCompatibility({
                message: `dropDatabase is not supported on this version of milvus.`,
            });
            const promise = yield (0, __1.promisify)(this.client, 'DropDatabase', data, data.timeout || this.timeout);
            return promise;
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=Database.js.map