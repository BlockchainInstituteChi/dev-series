"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = require("https");
var sqlite3_1 = require("sqlite3");
// Get the BTC spot price in dollars from Coinbase
function spotPrice() {
    var options = {
        hostname: "api.coinbase.com",
        path: "/v2/prices/BTC-USD/spot",
        method: "GET"
    };
    return new Promise(function (cont, fail) {
        var req = https_1.request(options, function (res) {
            res.setEncoding("utf8");
            res.on("data", function (raw) {
                var msg = JSON.parse(raw);
                cont(parseFloat(msg.data.amount));
            });
        });
        req.on("error", function (err) { return fail(err); });
        req.end();
    });
}
exports.spotPrice = spotPrice;
function openDatabase() {
    if (process.env.DATABASE === undefined) {
        process.stderr.write("DATABASE environment variable must be set");
        process.exit(1);
    }
    var dbFile = process.env.DATABASE;
    var db = new sqlite3_1.Database(dbFile);
    return db;
}
exports.openDatabase = openDatabase;
//# sourceMappingURL=Util.js.map