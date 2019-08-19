"use strict";
/* DATA MODEL */
Object.defineProperty(exports, "__esModule", { value: true });
/* CONSTANTS */
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod[PaymentMethod["Credit"] = 0] = "Credit";
    PaymentMethod[PaymentMethod["Bitcoin"] = 1] = "Bitcoin";
})(PaymentMethod = exports.PaymentMethod || (exports.PaymentMethod = {}));
var Status;
(function (Status) {
    Status[Status["Received"] = 0] = "Received";
    Status[Status["Paid"] = 1] = "Paid";
    Status[Status["Processing"] = 2] = "Processing";
    Status[Status["Shipped"] = 3] = "Shipped";
    Status[Status["Confirming"] = 4] = "Confirming";
})(Status = exports.Status || (exports.Status = {}));
function sizeIndex(s) {
    switch (s) {
        case "S":
            return 0;
        case "M":
            return 1;
        case "L":
            return 2;
    }
}
exports.sizeIndex = sizeIndex;
//# sourceMappingURL=index.js.map