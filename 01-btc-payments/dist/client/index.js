"use strict";
// Client side functionality
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var maquette_1 = require("maquette");
var qrcode = require("qrcode-generator");
var lib_1 = require("../lib");
/* INIT
 *
 * We start on the welcome page with an empty cart, empty catalog, and nothing
 * selected.
 *
 */
var state = {
    __ctor: "Blank",
    page: "welcome"
};
/* WEBSOCKET
 *
 * Communication with the server is handled by a websocket.  When we connect,
 * the server sends us the current catalog.  When we send an order, the server
 * sends back a confirmation with the order id.
 *
 */
var ws = new WebSocket("ws://localhost:8081");
var projector = maquette_1.createProjector();
ws.addEventListener("message", function (e) {
    var msg = JSON.parse(e.data);
    switch (msg.__ctor) {
        case "PaymentDetails": {
            event({
                __ctor: "PaymentDetails",
                address: msg.address,
                amount: msg.amount
            });
            break;
        }
        case "Products": {
            event({
                __ctor: "Load",
                products: new Map(msg.data.map(function (p) { return [p.id, p]; }))
            });
            break;
        }
        case "Confirmation": {
            event({
                __ctor: "GotOrderId",
                orderId: msg.orderId
            });
        }
    }
    projector.scheduleRender();
});
/* STEPPER
 *
 * This function updates the program state for each event.
 *
 */
function step(ev, s0) {
    switch (ev.__ctor) {
        case "Checkout": {
            console.log("CHECKOUT");
            s0 = {
                __ctor: "Checkout",
                cart: s0.cart,
                page: "checkout",
                paymentMethod: lib_1.PaymentMethod.Credit,
                products: s0.products,
                streetAddress: ""
            };
            break;
        }
        case "Load": {
            console.log("LOAD");
            s0 = {
                __ctor: "Shopping",
                cart: new Map(),
                page: "store",
                products: ev.products,
                selections: new Map()
            };
            break;
        }
        case "CartAdd": {
            console.log("CARTADD");
            if (s0.__ctor === "Shopping") {
                var sel = s0.selections.get(ev.product);
                var cartKey = ev.product + ":" + sel.size;
                if (s0.cart.has(cartKey)) {
                    s0.cart.get(cartKey).quantity += sel.quantity;
                }
                else {
                    s0.cart.set(cartKey, __assign({}, sel));
                }
                s0.selections.delete(ev.product);
            }
            break;
        }
        case "ConfirmOk": {
            console.log("CONFIRMOK");
            s0 = {
                __ctor: "Shopping",
                cart: new Map(),
                page: "store",
                products: s0.products,
                selections: new Map()
            };
            break;
        }
        case "Goto": {
            console.log("GOTO", ev.page);
            s0.page = ev.page;
            break;
        }
        case "GotOrderId": {
            console.log("GOTORDERID");
            s0 = {
                __ctor: "OrderSummary",
                cart: s0.cart,
                orderId: ev.orderId,
                page: "confirmation",
                products: s0.products
            };
            break;
        }
        case "QuantityClick": {
            console.log("QUANTITYCLICK");
            if (s0.__ctor === "Shopping" && s0.selections.has(ev.product)) {
                var sel = s0.selections.get(ev.product);
                switch (ev.action) {
                    case "up": {
                        sel.quantity += 1;
                        break;
                    }
                    case "down": {
                        sel.quantity = Math.max(0, sel.quantity - 1);
                    }
                }
            }
            break;
        }
        case "PaymentDetails": {
            console.log("PAYMENTDETAILS");
            s0 = {
                __ctor: "BitcoinPayment",
                amount: ev.amount,
                bitcoinAddress: ev.address,
                cart: s0.cart,
                page: "payment",
                products: s0.products
            };
            break;
        }
        case "UpdateDetails": {
            console.log("UPDATEDETAILS");
            if (s0.__ctor == "Checkout") {
                s0.streetAddress = ev.streetAddress;
            }
            break;
        }
        case "SizeClick": {
            console.log("SIZECLICK");
            if (s0.__ctor === "Shopping") {
                if (!s0.selections.has(ev.product)) {
                    s0.selections.set(ev.product, {
                        product: s0.products.get(ev.product),
                        quantity: 1,
                        size: ev.size
                    });
                }
                else {
                    s0.selections.get(ev.product).size = ev.size;
                }
            }
            break;
        }
        case "SubmitOrder": {
            console.log("SUBMITORDER");
            var ss = Array.from(s0.cart.values());
            var order = {
                __ctor: "Order",
                paymentMethod: ev.paymentMethod,
                selections: ss,
                streetAddress: s0.streetAddress
            };
            ws.send(JSON.stringify(order));
        }
    }
    return s0;
}
function event(ev) {
    state = step(ev, state);
    projector.scheduleRender();
}
/* VIEWS */
function render() {
    switch (state.page) {
        case "welcome": {
            return welcome();
        }
        case "store": {
            return store();
        }
        case "cart": {
            return cart();
        }
        case "payment": {
            return payment();
        }
        case "checkout": {
            return checkout();
        }
        case "confirmation": {
            return confirmation();
        }
    }
}
// Welcome!
function welcome() {
    return maquette_1.h("div.container", [
        "Welcome to the Bitcoin & Open Blockchain meetup store!"
    ]);
}
// T-shirt store
function store() {
    var ps = [];
    if (state.__ctor === "Shopping") {
        var sels_1 = state.selections;
        state.products.forEach(function (p) {
            ps.push(renderProduct(p, sels_1));
        });
        var cartSize_1 = 0;
        state.cart.forEach(function (s) { return (cartSize_1 += s.quantity); });
        return maquette_1.h("div.container", [
            maquette_1.h("div.row", { key: 1 }, [maquette_1.h("h1", ["Bitcoin & Open Blockchain Store"])]),
            maquette_1.h("div.row.nav", { key: 2 }, [
                maquette_1.h("div.col", { key: 1, onclick: gotoPage("cart") }, [
                    "View cart (" + cartSize_1 + ")"
                ])
            ]),
            maquette_1.h("div.row", { key: 3 }, ps)
        ]);
    }
    else {
        return error();
    }
}
function renderProduct(p, selections) {
    var f = function (ev) {
        event({
            __ctor: "CartAdd",
            product: p.id
        });
    };
    var children = [
        maquette_1.h("div.row", { key: "caption" }, [p.caption]),
        maquette_1.h("div.row", { key: "image" }, [maquette_1.h("img", { src: p.id + ".svg" })]),
        maquette_1.h("div.row", { key: "price" }, ["$" + dollars(p.price).toString()]),
        sizes(p.id, selections),
        quantity(p.id, selections) // quantity
    ];
    if (selectionComplete(p.id, selections)) {
        children.push(maquette_1.h("div.row", { key: "add", onclick: f }, ["Add to cart"]));
    }
    return maquette_1.h("div.product", { key: p.id }, [maquette_1.h("div.container", children)]);
}
// Simple size selector
function sizes(pid, selections) {
    function f(s) {
        return function (e) {
            event({
                __ctor: "SizeClick",
                product: pid,
                size: s
            });
        };
    }
    return maquette_1.h("div.row", { key: "sizes" }, ["S", "M", "L"].map(function (s) {
        var isSelected = selections.has(pid) && selections.get(pid).size === s;
        return maquette_1.h("div.col-sm", { key: s, onclick: f(s), classes: { selected: isSelected } }, [s]);
    }));
}
// Simple quantity updater: "(-) q (+)"
function quantity(pid, selections) {
    var up = function (ev) {
        event({
            __ctor: "QuantityClick",
            product: pid,
            action: "up"
        });
    };
    var down = function (ev) {
        event({
            __ctor: "QuantityClick",
            product: pid,
            action: "down"
        });
    };
    var q = selections.has(pid)
        ? selections.get(pid).quantity
        : 0;
    return maquette_1.h("div.row", { key: "quantity" }, [
        maquette_1.h("div.col-sm", { key: 1, onclick: down }, ["(-)"]),
        maquette_1.h("div.col-sm", { key: 2 }, [q.toString()]),
        maquette_1.h("div.col-sm", { key: 3, onclick: up }, ["(+)"])
    ]);
}
// Shopping cart
function cart() {
    if (state.__ctor === "Shopping") {
        var total_1 = 0;
        var rows_1 = [];
        state.cart.forEach(function (s) {
            total_1 += s.quantity * s.product.price;
            rows_1.push(maquette_1.h("div.row", { key: s.product.id }, [
                cols([
                    s.product.caption,
                    s.size,
                    s.quantity.toString(),
                    dollars(s.quantity * s.product.price).toString()
                ])
            ]));
        });
        var items = [
            maquette_1.h("div.row", { key: 1 }, [maquette_1.h("h1", ["Shopping cart"])]),
            maquette_1.h("div.row", { key: 2 }, cols(["Desc", "Size", "Quantity", "Price"])),
            rows_1.length > 0 ? rows_1 : "No items",
            maquette_1.h("div.row", { key: 3 }, ["Total: $" + dollars(total_1).toString()]),
            maquette_1.h("div.row", { key: 4, onclick: gotoPage("store") }, [
                "Continue shopping"
            ])
        ];
        var checkoutNow = function () {
            return event({
                __ctor: "Checkout"
            });
        };
        if (state.cart.size > 0) {
            items.push(maquette_1.h("div.row", { key: 5, onclick: checkoutNow }, ["Checkout"]));
        }
        return maquette_1.h("div.container", items);
    }
    else {
        return error();
    }
}
// Gather user details
function checkout() {
    var card = function () {
        return event({
            __ctor: "SubmitOrder",
            paymentMethod: lib_1.PaymentMethod.Credit
        });
    };
    var bitcoin = function () {
        return event({
            __ctor: "SubmitOrder",
            paymentMethod: lib_1.PaymentMethod.Bitcoin
        });
    };
    var f = function (e) {
        return event({
            __ctor: "UpdateDetails",
            streetAddress: e.target.value
        });
    };
    return maquette_1.h("div.container", [
        maquette_1.h("div.row", { key: 1 }, [maquette_1.h("h1", ["Shipping address"])]),
        maquette_1.h("div.row", { key: 2 }, [maquette_1.h("input", { oninput: f }, [])]),
        maquette_1.h("div.row", { key: 3, onclick: card }, ["Pay with card"]),
        maquette_1.h("div.row", { key: 4, onclick: bitcoin }, ["Pay with bitcoin"])
    ]);
}
// BTC payment page
function payment() {
    if (state.__ctor === "BitcoinPayment") {
        var bitcoinURI = "bitcoin:" + state.bitcoinAddress + "?amount=" + state.amount.toString() + "&message=BOBChicago";
        var qr = qrcode(0, "H");
        qr.addData(bitcoinURI);
        qr.make();
        return maquette_1.h("div.container", [
            maquette_1.h("div.row", { key: 1 }, [
                "Please send " + state.amount.toString() + " BTC to " + state.bitcoinAddress + " to complete your order."
            ]),
            maquette_1.h("div.row", { key: 2, innerHTML: qr.createImgTag(5).toString() }, []),
            maquette_1.h("div.row", { key: 3 }, [maquette_1.h("a", { href: bitcoinURI }, [bitcoinURI])])
        ]);
    }
    else {
        return error();
    }
}
// Confirmation
function confirmation() {
    var f = function (ev) {
        event({
            __ctor: "ConfirmOk"
        });
    };
    if (state.__ctor === "OrderSummary") {
        var rows_2 = [];
        state.cart.forEach(function (s) {
            return rows_2.push(maquette_1.h("div.row", { key: s.product.id }, cols([s.product.caption, s.size, s.quantity.toString()])));
        });
        return maquette_1.h("div.container", [
            maquette_1.h("div.row", { key: 1 }, ["Success!"]),
            maquette_1.h("div.row", { key: 2 }, ["Your order id is " + state.orderId]),
            rows_2,
            maquette_1.h("div.row", { key: 3 }, [maquette_1.h("div.button", { onclick: f }, ["OK"])])
        ]);
    }
    else {
        return error();
    }
}
// Errors
function error() {
    return maquette_1.h("div.container", maquette_1.h("h1.err", ["There is a problem."]));
}
/* HELPERS */
function cols(xs) {
    return xs.map(function (x) { return maquette_1.h("div.col-sm", { key: x.toString() }, [x]); });
}
function dollars(cs) {
    return cs / 100;
}
function gotoPage(p) {
    var f = function (ev) {
        event({
            __ctor: "Goto",
            page: p
        });
    };
    return f;
}
function selectionComplete(pid, ss) {
    if (ss.has(pid)) {
        var sel = ss.get(pid);
        return sel.size !== null && sel.quantity > 0;
    }
    return false;
}
// GO!
projector.append(document.body, render);
//# sourceMappingURL=index.js.map