"use strict";
// WALLET
//
// Subcommands:
// - new
// - derive-pubkey
// - derive-privkey
// - spend
Object.defineProperty(exports, "__esModule", { value: true });
var bitcoinjs_lib_1 = require("bitcoinjs-lib");
var crypto_1 = require("crypto");
/* CONFIG */
var network = bitcoinjs_lib_1.networks.testnet;
/* PROGRAM */
if (typeof process.argv[2] === "undefined") {
    process.stderr.write("See readme for usage");
    process.exit(1);
}
var cmd = process.argv[2];
switch (cmd) {
    case "new": {
        // Generate a brand new wallet
        newWallet();
        break;
    }
    case "spend": {
        // Generate a raw transaction
        spend();
        break;
    }
    case "derive-pubkey": {
        deriveKey(false);
        break;
    }
    case "derive-privkey": {
        deriveKey(true);
        break;
    }
    default: {
        process.stderr.write("Unrecognized command: " + cmd);
        process.exit(2);
    }
}
function deriveKey(priv) {
    // Read derivation pathway from stdin
    var data = "";
    process.stdin.on("data", function (chunk) {
        data += chunk;
    });
    process.stdin.on("end", function () {
        var _a = JSON.parse(data), wallet58 = _a.wallet58, paths = _a.paths;
        var wallet = bitcoinjs_lib_1.HDNode.fromBase58(wallet58, network);
        var b58s = paths.map(function (path) {
            var newKey = wallet.derivePath(path);
            return priv ? newKey.toBase58() : newKey.neutered().toBase58();
        });
        process.stdout.write(JSON.stringify(b58s));
    });
}
function newWallet() {
    var wallet = bitcoinjs_lib_1.HDNode.fromSeedBuffer(crypto_1.randomBytes(64), network);
    process.stdout.write(JSON.stringify(wallet.toBase58()));
}
function spend() {
    var data = "";
    process.stdin.on("data", function (chunk) {
        data += chunk;
    });
    process.stdin.on("end", function () {
        var sp = JSON.parse(data);
        var wallet = bitcoinjs_lib_1.HDNode.fromBase58(sp.wallet58, network);
        var signed = sp.txs.map(function (tx) {
            var txb = new bitcoinjs_lib_1.TransactionBuilder(network);
            tx.outputs.forEach(function (out) { return txb.addOutput(out.address, out.amount); });
            for (var i = 0; i < tx.inputs.length; i++) {
                var txId = Buffer.from(tx.inputs[i].txId, "hex");
                txb.addInput(txId, tx.inputs[i].vout);
                txb.sign(i, wallet.derivePath(tx.inputs[i].fullPath).keyPair);
            }
            return txb.build().toHex();
        });
        process.stdout.write(JSON.stringify(signed));
    });
}
//# sourceMappingURL=index.js.map