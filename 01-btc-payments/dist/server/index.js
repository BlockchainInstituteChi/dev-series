"use strict";
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
var WebSocket = require("ws");
var bignumber_js_1 = require("bignumber.js");
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var Util_1 = require("./Util");
var Transactions_1 = require("./Transactions");
var fs_1 = require("fs");
var lib_1 = require("../lib");
var uuid = require("uuid/v4");
/* CONFIGURATION */
var network = bitcoinjs_lib_1.networks.testnet;
/* HANDLE SESSION COUNTER */
if (!fs_1.existsSync("session.dat")) {
    process.stderr.write("Cannot find session counter file\n");
    process.exit(2);
}
var sessionIndex = parseInt(fs_1.readFileSync("session.dat", "utf8"));
fs_1.writeFileSync("session.dat", (sessionIndex + 1).toString());
/* LOAD WALLET */
var wallet58 = fs_1.readFileSync("wallet58.key", "utf8");
var wallet = bitcoinjs_lib_1.HDNode.fromBase58(wallet58, network);
/* LOAD CATALOG */
var db = Util_1.openDatabase();
var catalogSql = "SELECT * FROM catalog";
db.all(catalogSql, startServerWith);
/* WEBSOCKET SERVER */
function startServerWith(err, catalog) {
    var _this = this;
    process.stdout.write("starting...\n");
    // We won't recover from a failure to retrieve the catalog
    if (err !== null) {
        process.stderr.write(err.toString() + "\n");
        process.exit(1);
    }
    var wss = new WebSocket.Server({ port: 8081 });
    wss.on("connection", function (ws) {
        process.stdout.write("connection\n");
        var payload = {
            __ctor: "Products",
            data: catalog
        };
        process.stdout.write("sending orders\n");
        ws.send(JSON.stringify(payload));
        ws.on("message", function (raw) { return __awaiter(_this, void 0, void 0, function () {
            var msg, id_1, _a, conf, spot, totalCents, btcAmount, index, address, details, notification, watcher;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        msg = JSON.parse(raw);
                        if (!(msg.__ctor === "Order")) return [3 /*break*/, 5];
                        return [4 /*yield*/, persistOrder(msg.selections, msg.streetAddress, msg.paymentMethod)];
                    case 1:
                        id_1 = _b.sent();
                        _a = msg.paymentMethod;
                        switch (_a) {
                            case lib_1.PaymentMethod.Credit: return [3 /*break*/, 2];
                            case lib_1.PaymentMethod.Bitcoin: return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 2:
                        {
                            process.stdout.write("credit card order received\n");
                            conf = {
                                __ctor: "Confirmation",
                                orderId: id_1
                            };
                            ws.send(JSON.stringify(conf));
                            return [3 /*break*/, 5];
                        }
                        _b.label = 3;
                    case 3:
                        process.stdout.write("bitcoin order received\n");
                        return [4 /*yield*/, Util_1.spotPrice()];
                    case 4:
                        spot = _b.sent();
                        totalCents = new bignumber_js_1.BigNumber(total(msg.selections, catalog));
                        btcAmount = totalCents
                            .dividedBy(100)
                            .dividedBy(spot)
                            .decimalPlaces(8);
                        index = newIndex();
                        address = wallet
                            .derive(sessionIndex)
                            .derive(index)
                            .getAddress();
                        persistBitcoin(id_1, index, btcAmount);
                        details = {
                            __ctor: "PaymentDetails",
                            address: address,
                            amount: btcAmount.toNumber()
                        };
                        notification = function () {
                            return ws.send(JSON.stringify({
                                __ctor: "Confirmation",
                                orderId: id_1
                            }));
                        };
                        watcher = watchFor(address, btcAmount.multipliedBy("1e8"), path(index), id_1, notification);
                        process.stdout.write("watching for payment\n");
                        Transactions_1.txMonitor.on("txoutput", watcher);
                        ws.send(JSON.stringify(details));
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        }); });
    });
}
/* PERSISTENCE */
function persistOrder(sels, address, method) {
    process.stdout.write("saving order");
    var orderId = uuid();
    var orderSql = "INSERT INTO orders VALUES ($orderId, $timestamp, $method, $status, $address)";
    var order = new Promise(function (resolve, reject) {
        return db.run(orderSql, {
            $address: address,
            $orderId: orderId,
            $timestamp: timestamp(),
            $method: method,
            $status: method == lib_1.PaymentMethod.Credit ? lib_1.Status.Paid : lib_1.Status.Received
        }, function (err) {
            if (err !== null) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
    var items = sels.map(function (s) {
        return new Promise(function (resolve, reject) {
            return db.run("INSERT INTO purchases VALUES ($orderId, $itemId, $size, $quantity)", {
                $orderId: orderId,
                $itemId: s.product.id,
                $size: lib_1.sizeIndex(s.size),
                $quantity: s.quantity
            }, function (err) {
                if (err === null) {
                    resolve();
                }
                else {
                    reject(err);
                }
            });
        });
    });
    return Promise.all([order].concat(items)).then(function () { return orderId; });
}
function persistBitcoin(orderId, index, amount) {
    process.stdout.write("saving bitcoin details");
    return new Promise(function (resolve, reject) {
        return db.run("INSERT INTO bitcoinPayments (orderId, addressPath, amount) VALUES ($id, $path, $amount)", {
            $id: orderId,
            $path: path(index),
            $amount: amount.toString()
        }, function (err) {
            if (err === null) {
                resolve();
            }
            else {
                reject(err);
            }
        });
    });
}
function timestamp() {
    var ms = Date.now();
    return Math.floor(ms / 1000);
}
function path(aIx) {
    return sessionIndex.toString() + "'/" + aIx.toString();
}
// Compute the total cost of the user's order
function total(ss, catalog) {
    var step = function (t, s) {
        var i = catalog.findIndex(function (p) { return p.id === s.product.id; });
        return i >= 0 ? t + s.quantity * catalog[i].price : t;
    };
    return ss.reduce(step, 0);
}
// Inspect incoming transactions
//
// Members of the audience pointed out that we could learn from what happened
// to MT GOX!  We are supporting address types whose transactions can be
// malleated (P2PKH, P2SH).  So it is possible that some malingerer will
// broadcast malleated versions of our users' payments.  If one of these is
// included in a block, it invalidates the user's original transaction.  The
// result is that the user has paid but we don't find out because of how we are
// watching for payments.
//
function watchFor(address, amount, path, id, notifyUser) {
    var watcher = function (_a) {
        var outAmt = _a[0], outAddr = _a[1], txId = _a[2];
        if (outAddr === address && amount.isLessThanOrEqualTo(outAmt)) {
            // Found the tx order
            // order to the confirming bucket
            process.stdout.write("Found a payment we care about\n");
            db.run("UPDATE bitcoinPayments SET txId = $txid WHERE addressPath = $path", {
                $txid: txId,
                $path: path
            }
            // FIXME: deal with errors
            );
            db.run("UPDATE orders SET status = $status WHERE id = $id", {
                $status: lib_1.Status.Confirming,
                $id: id
            }
            // FIXME: recover from errors
            );
            // Remove listener
            Transactions_1.txMonitor.removeListener("txoutputs", watcher);
            notifyUser();
        }
    };
    return watcher;
}
var addressIndex = 0;
function newIndex() {
    var index = addressIndex;
    addressIndex++;
    return index;
}
//# sourceMappingURL=index.js.map