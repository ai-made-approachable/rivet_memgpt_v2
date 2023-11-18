"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TLS_MODE = exports.CONNECT_STATUS = exports.METADATA = void 0;
var METADATA;
(function (METADATA) {
    METADATA["DATABASE"] = "dbname";
    METADATA["AUTH"] = "authorization";
    METADATA["CLIENT_ID"] = "identifier";
})(METADATA = exports.METADATA || (exports.METADATA = {}));
var CONNECT_STATUS;
(function (CONNECT_STATUS) {
    CONNECT_STATUS[CONNECT_STATUS["NOT_CONNECTED"] = 0] = "NOT_CONNECTED";
    CONNECT_STATUS[CONNECT_STATUS["CONNECTING"] = 1] = "CONNECTING";
    CONNECT_STATUS[CONNECT_STATUS["CONNECTED"] = 2] = "CONNECTED";
    CONNECT_STATUS[CONNECT_STATUS["UNIMPLEMENTED"] = 3] = "UNIMPLEMENTED";
})(CONNECT_STATUS = exports.CONNECT_STATUS || (exports.CONNECT_STATUS = {}));
var TLS_MODE;
(function (TLS_MODE) {
    TLS_MODE[TLS_MODE["DISABLED"] = 0] = "DISABLED";
    TLS_MODE[TLS_MODE["ONE_WAY"] = 1] = "ONE_WAY";
    TLS_MODE[TLS_MODE["TWO_WAY"] = 2] = "TWO_WAY";
})(TLS_MODE = exports.TLS_MODE || (exports.TLS_MODE = {}));
//# sourceMappingURL=client.js.map