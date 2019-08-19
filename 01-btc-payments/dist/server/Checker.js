"use strict";
// Make sure that payments are confirming
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var RpcClient = require("bitcoind-rpc");
var Util_1 = require("./Util");
var lib_1 = require("../lib");
var nBlocks = process.argv[2] === undefined ? 10 : parseInt(process.argv[2]);
var db = Util_1.openDatabase();
var config = {
    protocol: "http",
    user: "user",
    password: "pass",
    host: "127.0.0.1",
    port: "6163"
};
var rpc = new RpcClient(config);
// We need the outstanding records
var sql = "SELECT id, txId FROM orders \n   JOIN bitcoinPayments ON orders.id = bitcoinPayments.orderId \n   WHERE orders.paymentMethod = $paymentMethod AND orders.status = $status";
db.all(sql, {
    $paymentMethod: lib_1.PaymentMethod.Bitcoin,
    $status: lib_1.Status.Confirming
}, withResults);
function withResults(err, rows) {
    var _this = this;
    if (err !== null) {
        process.stderr.write("Problem fetching results: " + err.toString() + "\n");
        process.exit(1);
    }
    rows.forEach(function (row) { return __awaiter(_this, void 0, void 0, function () {
        var d, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, txDepth(row.txId)];
                case 1:
                    d = _a.sent();
                    if (d >= nBlocks) {
                        process.stdout.write("Updating status for " + row.id + "\n");
                        db.run("UPDATE orders SET status = $status WHERE id = $id", {
                            $status: lib_1.Status.Paid,
                            $id: row.id
                        });
                    }
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    // do nothing
                    process.stderr.write(err_1.toString() + "\n");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
function txDepth(hash) {
    return new Promise(function (resolve, fail) {
        rpc.getTransaction(hash, true, function (err, res) {
            if (err !== null) {
                fail(err);
            }
            else {
                resolve(res.result.confirmations);
            }
        });
    });
}
//# sourceMappingURL=Checker.js.map