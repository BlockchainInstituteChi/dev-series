"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var zmq_1 = require("zmq");
var EventEmitter = require("events");
var bitcoindSocket = "tcp://127.0.0.1:6164";
/* TRANSACTION MONITOR */
/**
 * We expose an EventEmitter which emits "btctx" events containing simplified
 * transaction data.
 */
exports.txMonitor = new EventEmitter();
// bitcoind uses ZeroMQ to broadcast messages about bitcoin blocks and
// transactions to other programs running on the same system.
var sock = zmq_1.socket("sub");
sock.connect(bitcoindSocket);
sock.subscribe("rawtx");
sock.on("message", function (topic, rawtx) {
    var outs = parseRawTx(rawtx);
    outs.forEach(function (x) { return exports.txMonitor.emit("txoutput", x); });
});
function parseRawTx(raw) {
    var tx = bitcoinjs_lib_1.Transaction.fromBuffer(raw);
    var res = [];
    // Prepare the outputs
    for (var _i = 0, _a = tx.outs; _i < _a.length; _i++) {
        var out = _a[_i];
        var value = out.value, script = out.script;
        try {
            res.push([
                value,
                bitcoinjs_lib_1.address.fromOutputScript(script, bitcoinjs_lib_1.networks.testnet),
                tx.getId()
            ]);
        }
        catch (err) {
            process.stderr.write(err.toString() + "\n");
            // ignore
        }
    }
    return res;
}
//# sourceMappingURL=Transactions.js.map