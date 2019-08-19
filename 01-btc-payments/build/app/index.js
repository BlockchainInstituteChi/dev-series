/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./client/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./client/index.ts":
/*!*************************!*\
  !*** ./client/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// Client side functionality
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var maquette_1 = __webpack_require__(/*! maquette */ "./node_modules/maquette/dist/maquette.umd.js");
var qrcode = __webpack_require__(/*! qrcode-generator */ "./node_modules/qrcode-generator/qrcode.js");
var lib_1 = __webpack_require__(/*! ../lib */ "./lib/index.ts");
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
var ws = new WebSocket("ws://18.224.44.173:8081");
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


/***/ }),

/***/ "./lib/index.ts":
/*!**********************!*\
  !*** ./lib/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

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


/***/ }),

/***/ "./node_modules/maquette/dist/maquette.umd.js":
/*!****************************************************!*\
  !*** ./node_modules/maquette/dist/maquette.umd.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
     true ? factory(exports) :
    undefined;
}(this, function (exports) { 'use strict';

    /* tslint:disable no-http-string */
    var NAMESPACE_W3 = 'http://www.w3.org/';
    /* tslint:enable no-http-string */
    var NAMESPACE_SVG = NAMESPACE_W3 + "2000/svg";
    var NAMESPACE_XLINK = NAMESPACE_W3 + "1999/xlink";
    var emptyArray = [];
    var extend = function (base, overrides) {
        var result = {};
        Object.keys(base).forEach(function (key) {
            result[key] = base[key];
        });
        if (overrides) {
            Object.keys(overrides).forEach(function (key) {
                result[key] = overrides[key];
            });
        }
        return result;
    };
    var same = function (vnode1, vnode2) {
        if (vnode1.vnodeSelector !== vnode2.vnodeSelector) {
            return false;
        }
        if (vnode1.properties && vnode2.properties) {
            if (vnode1.properties.key !== vnode2.properties.key) {
                return false;
            }
            return vnode1.properties.bind === vnode2.properties.bind;
        }
        return !vnode1.properties && !vnode2.properties;
    };
    var checkStyleValue = function (styleValue) {
        if (typeof styleValue !== 'string') {
            throw new Error('Style values must be strings');
        }
    };
    var findIndexOfChild = function (children, sameAs, start) {
        if (sameAs.vnodeSelector !== '') {
            // Never scan for text-nodes
            for (var i = start; i < children.length; i++) {
                if (same(children[i], sameAs)) {
                    return i;
                }
            }
        }
        return -1;
    };
    var checkDistinguishable = function (childNodes, indexToCheck, parentVNode, operation) {
        var childNode = childNodes[indexToCheck];
        if (childNode.vnodeSelector === '') {
            return; // Text nodes need not be distinguishable
        }
        var properties = childNode.properties;
        var key = properties ? (properties.key === undefined ? properties.bind : properties.key) : undefined;
        if (!key) { // A key is just assumed to be unique
            for (var i = 0; i < childNodes.length; i++) {
                if (i !== indexToCheck) {
                    var node = childNodes[i];
                    if (same(node, childNode)) {
                        throw new Error(parentVNode.vnodeSelector + " had a " + childNode.vnodeSelector + " child " + (operation === 'added' ? operation : 'removed') + ", but there is now more than one. You must add unique key properties to make them distinguishable.");
                    }
                }
            }
        }
    };
    var nodeAdded = function (vNode) {
        if (vNode.properties) {
            var enterAnimation = vNode.properties.enterAnimation;
            if (enterAnimation) {
                enterAnimation(vNode.domNode, vNode.properties);
            }
        }
    };
    var removedNodes = [];
    var requestedIdleCallback = false;
    var visitRemovedNode = function (node) {
        (node.children || []).forEach(visitRemovedNode);
        if (node.properties && node.properties.afterRemoved) {
            node.properties.afterRemoved.apply(node.properties.bind || node.properties, [node.domNode]);
        }
    };
    var processPendingNodeRemovals = function () {
        requestedIdleCallback = false;
        removedNodes.forEach(visitRemovedNode);
        removedNodes.length = 0;
    };
    var scheduleNodeRemoval = function (vNode) {
        removedNodes.push(vNode);
        if (!requestedIdleCallback) {
            requestedIdleCallback = true;
            if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
                window.requestIdleCallback(processPendingNodeRemovals, { timeout: 16 });
            }
            else {
                setTimeout(processPendingNodeRemovals, 16);
            }
        }
    };
    var nodeToRemove = function (vNode) {
        var domNode = vNode.domNode;
        if (vNode.properties) {
            var exitAnimation = vNode.properties.exitAnimation;
            if (exitAnimation) {
                domNode.style.pointerEvents = 'none';
                var removeDomNode = function () {
                    if (domNode.parentNode) {
                        domNode.parentNode.removeChild(domNode);
                        scheduleNodeRemoval(vNode);
                    }
                };
                exitAnimation(domNode, removeDomNode, vNode.properties);
                return;
            }
        }
        if (domNode.parentNode) {
            domNode.parentNode.removeChild(domNode);
            scheduleNodeRemoval(vNode);
        }
    };
    var setProperties = function (domNode, properties, projectionOptions) {
        if (!properties) {
            return;
        }
        var eventHandlerInterceptor = projectionOptions.eventHandlerInterceptor;
        var propNames = Object.keys(properties);
        var propCount = propNames.length;
        var _loop_1 = function (i) {
            var propName = propNames[i];
            var propValue = properties[propName];
            if (propName === 'className') {
                throw new Error('Property "className" is not supported, use "class".');
            }
            else if (propName === 'class') {
                toggleClasses(domNode, propValue, true);
            }
            else if (propName === 'classes') {
                // object with string keys and boolean values
                var classNames = Object.keys(propValue);
                var classNameCount = classNames.length;
                for (var j = 0; j < classNameCount; j++) {
                    var className = classNames[j];
                    if (propValue[className]) {
                        domNode.classList.add(className);
                    }
                }
            }
            else if (propName === 'styles') {
                // object with string keys and string (!) values
                var styleNames = Object.keys(propValue);
                var styleCount = styleNames.length;
                for (var j = 0; j < styleCount; j++) {
                    var styleName = styleNames[j];
                    var styleValue = propValue[styleName];
                    if (styleValue) {
                        checkStyleValue(styleValue);
                        projectionOptions.styleApplyer(domNode, styleName, styleValue);
                    }
                }
            }
            else if (propName !== 'key' && propValue !== null && propValue !== undefined) {
                var type = typeof propValue;
                if (type === 'function') {
                    if (propName.lastIndexOf('on', 0) === 0) { // lastIndexOf(,0)===0 -> startsWith
                        if (eventHandlerInterceptor) {
                            propValue = eventHandlerInterceptor(propName, propValue, domNode, properties); // intercept eventhandlers
                        }
                        if (propName === 'oninput') {
                            /* tslint:disable no-this-keyword no-invalid-this only-arrow-functions no-void-expression */
                            (function () {
                                // record the evt.target.value, because IE and Edge sometimes do a requestAnimationFrame between changing value and running oninput
                                var oldPropValue = propValue;
                                propValue = function (evt) {
                                    oldPropValue.apply(this, [evt]);
                                    evt.target['oninput-value'] = evt.target.value; // may be HTMLTextAreaElement as well
                                };
                            }());
                            /* tslint:enable */
                        }
                        domNode[propName] = propValue;
                    }
                }
                else if (projectionOptions.namespace === NAMESPACE_SVG) {
                    if (propName === 'href') {
                        domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
                    }
                    else {
                        // all SVG attributes are read-only in DOM, so...
                        domNode.setAttribute(propName, propValue);
                    }
                }
                else if (type === 'string' && propName !== 'value' && propName !== 'innerHTML') {
                    domNode.setAttribute(propName, propValue);
                }
                else {
                    domNode[propName] = propValue;
                }
            }
        };
        for (var i = 0; i < propCount; i++) {
            _loop_1(i);
        }
    };
    var addChildren = function (domNode, children, projectionOptions) {
        if (!children) {
            return;
        }
        for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
            var child = children_1[_i];
            createDom(child, domNode, undefined, projectionOptions);
        }
    };
    var initPropertiesAndChildren = function (domNode, vnode, projectionOptions) {
        addChildren(domNode, vnode.children, projectionOptions); // children before properties, needed for value property of <select>.
        if (vnode.text) {
            domNode.textContent = vnode.text;
        }
        setProperties(domNode, vnode.properties, projectionOptions);
        if (vnode.properties && vnode.properties.afterCreate) {
            vnode.properties.afterCreate.apply(vnode.properties.bind || vnode.properties, [domNode, projectionOptions, vnode.vnodeSelector, vnode.properties, vnode.children]);
        }
    };
    var createDom = function (vnode, parentNode, insertBefore, projectionOptions) {
        var domNode;
        var start = 0;
        var vnodeSelector = vnode.vnodeSelector;
        var doc = parentNode.ownerDocument;
        if (vnodeSelector === '') {
            domNode = vnode.domNode = doc.createTextNode(vnode.text);
            if (insertBefore !== undefined) {
                parentNode.insertBefore(domNode, insertBefore);
            }
            else {
                parentNode.appendChild(domNode);
            }
        }
        else {
            for (var i = 0; i <= vnodeSelector.length; ++i) {
                var c = vnodeSelector.charAt(i);
                if (i === vnodeSelector.length || c === '.' || c === '#') {
                    var type = vnodeSelector.charAt(start - 1);
                    var found = vnodeSelector.slice(start, i);
                    if (type === '.') {
                        domNode.classList.add(found);
                    }
                    else if (type === '#') {
                        domNode.id = found;
                    }
                    else {
                        if (found === 'svg') {
                            projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
                        }
                        if (projectionOptions.namespace !== undefined) {
                            domNode = vnode.domNode = doc.createElementNS(projectionOptions.namespace, found);
                        }
                        else {
                            domNode = vnode.domNode = (vnode.domNode || doc.createElement(found));
                            if (found === 'input' && vnode.properties && vnode.properties.type !== undefined) {
                                // IE8 and older don't support setting input type after the DOM Node has been added to the document
                                domNode.setAttribute('type', vnode.properties.type);
                            }
                        }
                        if (insertBefore !== undefined) {
                            parentNode.insertBefore(domNode, insertBefore);
                        }
                        else if (domNode.parentNode !== parentNode) {
                            parentNode.appendChild(domNode);
                        }
                    }
                    start = i + 1;
                }
            }
            initPropertiesAndChildren(domNode, vnode, projectionOptions);
        }
    };
    var updateDom;
    /**
     * Adds or removes classes from an Element
     * @param domNode the element
     * @param classes a string separated list of classes
     * @param on true means add classes, false means remove
     */
    var toggleClasses = function (domNode, classes, on) {
        if (!classes) {
            return;
        }
        classes.split(' ').forEach(function (classToToggle) {
            if (classToToggle) {
                domNode.classList.toggle(classToToggle, on);
            }
        });
    };
    var updateProperties = function (domNode, previousProperties, properties, projectionOptions) {
        if (!properties) {
            return;
        }
        var propertiesUpdated = false;
        var propNames = Object.keys(properties);
        var propCount = propNames.length;
        for (var i = 0; i < propCount; i++) {
            var propName = propNames[i];
            // assuming that properties will be nullified instead of missing is by design
            var propValue = properties[propName];
            var previousValue = previousProperties[propName];
            if (propName === 'class') {
                if (previousValue !== propValue) {
                    toggleClasses(domNode, previousValue, false);
                    toggleClasses(domNode, propValue, true);
                }
            }
            else if (propName === 'classes') {
                var classList = domNode.classList;
                var classNames = Object.keys(propValue);
                var classNameCount = classNames.length;
                for (var j = 0; j < classNameCount; j++) {
                    var className = classNames[j];
                    var on = !!propValue[className];
                    var previousOn = !!previousValue[className];
                    if (on === previousOn) {
                        continue;
                    }
                    propertiesUpdated = true;
                    if (on) {
                        classList.add(className);
                    }
                    else {
                        classList.remove(className);
                    }
                }
            }
            else if (propName === 'styles') {
                var styleNames = Object.keys(propValue);
                var styleCount = styleNames.length;
                for (var j = 0; j < styleCount; j++) {
                    var styleName = styleNames[j];
                    var newStyleValue = propValue[styleName];
                    var oldStyleValue = previousValue[styleName];
                    if (newStyleValue === oldStyleValue) {
                        continue;
                    }
                    propertiesUpdated = true;
                    if (newStyleValue) {
                        checkStyleValue(newStyleValue);
                        projectionOptions.styleApplyer(domNode, styleName, newStyleValue);
                    }
                    else {
                        projectionOptions.styleApplyer(domNode, styleName, '');
                    }
                }
            }
            else {
                if (!propValue && typeof previousValue === 'string') {
                    propValue = '';
                }
                if (propName === 'value') { // value can be manipulated by the user directly and using event.preventDefault() is not an option
                    var domValue = domNode[propName];
                    if (domValue !== propValue // The 'value' in the DOM tree !== newValue
                        && (domNode['oninput-value']
                            ? domValue === domNode['oninput-value'] // If the last reported value to 'oninput' does not match domValue, do nothing and wait for oninput
                            : propValue !== previousValue // Only update the value if the vdom changed
                        )) {
                        // The edge cases are described in the tests
                        domNode[propName] = propValue; // Reset the value, even if the virtual DOM did not change
                        domNode['oninput-value'] = undefined;
                    } // else do not update the domNode, otherwise the cursor position would be changed
                    if (propValue !== previousValue) {
                        propertiesUpdated = true;
                    }
                }
                else if (propValue !== previousValue) {
                    var type = typeof propValue;
                    if (type !== 'function' || !projectionOptions.eventHandlerInterceptor) { // Function updates are expected to be handled by the EventHandlerInterceptor
                        if (projectionOptions.namespace === NAMESPACE_SVG) {
                            if (propName === 'href') {
                                domNode.setAttributeNS(NAMESPACE_XLINK, propName, propValue);
                            }
                            else {
                                // all SVG attributes are read-only in DOM, so...
                                domNode.setAttribute(propName, propValue);
                            }
                        }
                        else if (type === 'string' && propName !== 'innerHTML') {
                            if (propName === 'role' && propValue === '') {
                                domNode.removeAttribute(propName);
                            }
                            else {
                                domNode.setAttribute(propName, propValue);
                            }
                        }
                        else if (domNode[propName] !== propValue) { // Comparison is here for side-effects in Edge with scrollLeft and scrollTop
                            domNode[propName] = propValue;
                        }
                        propertiesUpdated = true;
                    }
                }
            }
        }
        return propertiesUpdated;
    };
    var updateChildren = function (vnode, domNode, oldChildren, newChildren, projectionOptions) {
        if (oldChildren === newChildren) {
            return false;
        }
        oldChildren = oldChildren || emptyArray;
        newChildren = newChildren || emptyArray;
        var oldChildrenLength = oldChildren.length;
        var newChildrenLength = newChildren.length;
        var oldIndex = 0;
        var newIndex = 0;
        var i;
        var textUpdated = false;
        while (newIndex < newChildrenLength) {
            var oldChild = (oldIndex < oldChildrenLength) ? oldChildren[oldIndex] : undefined;
            var newChild = newChildren[newIndex];
            if (oldChild !== undefined && same(oldChild, newChild)) {
                textUpdated = updateDom(oldChild, newChild, projectionOptions) || textUpdated;
                oldIndex++;
            }
            else {
                var findOldIndex = findIndexOfChild(oldChildren, newChild, oldIndex + 1);
                if (findOldIndex >= 0) {
                    // Remove preceding missing children
                    for (i = oldIndex; i < findOldIndex; i++) {
                        nodeToRemove(oldChildren[i]);
                        checkDistinguishable(oldChildren, i, vnode, 'removed');
                    }
                    textUpdated = updateDom(oldChildren[findOldIndex], newChild, projectionOptions) || textUpdated;
                    oldIndex = findOldIndex + 1;
                }
                else {
                    // New child
                    createDom(newChild, domNode, (oldIndex < oldChildrenLength) ? oldChildren[oldIndex].domNode : undefined, projectionOptions);
                    nodeAdded(newChild);
                    checkDistinguishable(newChildren, newIndex, vnode, 'added');
                }
            }
            newIndex++;
        }
        if (oldChildrenLength > oldIndex) {
            // Remove child fragments
            for (i = oldIndex; i < oldChildrenLength; i++) {
                nodeToRemove(oldChildren[i]);
                checkDistinguishable(oldChildren, i, vnode, 'removed');
            }
        }
        return textUpdated;
    };
    updateDom = function (previous, vnode, projectionOptions) {
        var domNode = previous.domNode;
        var textUpdated = false;
        if (previous === vnode) {
            return false; // By contract, VNode objects may not be modified anymore after passing them to maquette
        }
        var updated = false;
        if (vnode.vnodeSelector === '') {
            if (vnode.text !== previous.text) {
                var newTextNode = domNode.ownerDocument.createTextNode(vnode.text);
                domNode.parentNode.replaceChild(newTextNode, domNode);
                vnode.domNode = newTextNode;
                textUpdated = true;
                return textUpdated;
            }
            vnode.domNode = domNode;
        }
        else {
            if (vnode.vnodeSelector.lastIndexOf('svg', 0) === 0) { // lastIndexOf(needle,0)===0 means StartsWith
                projectionOptions = extend(projectionOptions, { namespace: NAMESPACE_SVG });
            }
            if (previous.text !== vnode.text) {
                updated = true;
                if (vnode.text === undefined) {
                    domNode.removeChild(domNode.firstChild); // the only textnode presumably
                }
                else {
                    domNode.textContent = vnode.text;
                }
            }
            vnode.domNode = domNode;
            updated = updateChildren(vnode, domNode, previous.children, vnode.children, projectionOptions) || updated;
            updated = updateProperties(domNode, previous.properties, vnode.properties, projectionOptions) || updated;
            if (vnode.properties && vnode.properties.afterUpdate) {
                vnode.properties.afterUpdate.apply(vnode.properties.bind || vnode.properties, [domNode, projectionOptions, vnode.vnodeSelector, vnode.properties, vnode.children]);
            }
        }
        if (updated && vnode.properties && vnode.properties.updateAnimation) {
            vnode.properties.updateAnimation(domNode, vnode.properties, previous.properties);
        }
        return textUpdated;
    };
    var createProjection = function (vnode, projectionOptions) {
        return {
            getLastRender: function () { return vnode; },
            update: function (updatedVnode) {
                if (vnode.vnodeSelector !== updatedVnode.vnodeSelector) {
                    throw new Error('The selector for the root VNode may not be changed. (consider using dom.merge and add one extra level to the virtual DOM)');
                }
                var previousVNode = vnode;
                vnode = updatedVnode;
                updateDom(previousVNode, updatedVnode, projectionOptions);
            },
            domNode: vnode.domNode
        };
    };

    var DEFAULT_PROJECTION_OPTIONS = {
        namespace: undefined,
        performanceLogger: function () { return undefined; },
        eventHandlerInterceptor: undefined,
        styleApplyer: function (domNode, styleName, value) {
            // Provides a hook to add vendor prefixes for browsers that still need it.
            domNode.style[styleName] = value;
        }
    };
    var applyDefaultProjectionOptions = function (projectorOptions) {
        return extend(DEFAULT_PROJECTION_OPTIONS, projectorOptions);
    };
    var dom = {
        /**
         * Creates a real DOM tree from `vnode`. The [[Projection]] object returned will contain the resulting DOM Node in
         * its [[Projection.domNode|domNode]] property.
         * This is a low-level method. Users will typically use a [[Projector]] instead.
         * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
         * objects may only be rendered once.
         * @param projectionOptions - Options to be used to create and update the projection.
         * @returns The [[Projection]] which also contains the DOM Node that was created.
         */
        create: function (vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            createDom(vnode, document.createElement('div'), undefined, projectionOptions);
            return createProjection(vnode, projectionOptions);
        },
        /**
         * Appends a new child node to the DOM which is generated from a [[VNode]].
         * This is a low-level method. Users will typically use a [[Projector]] instead.
         * @param parentNode - The parent node for the new child node.
         * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
         * objects may only be rendered once.
         * @param projectionOptions - Options to be used to create and update the [[Projection]].
         * @returns The [[Projection]] that was created.
         */
        append: function (parentNode, vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            createDom(vnode, parentNode, undefined, projectionOptions);
            return createProjection(vnode, projectionOptions);
        },
        /**
         * Inserts a new DOM node which is generated from a [[VNode]].
         * This is a low-level method. Users wil typically use a [[Projector]] instead.
         * @param beforeNode - The node that the DOM Node is inserted before.
         * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function.
         * NOTE: [[VNode]] objects may only be rendered once.
         * @param projectionOptions - Options to be used to create and update the projection, see [[createProjector]].
         * @returns The [[Projection]] that was created.
         */
        insertBefore: function (beforeNode, vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            createDom(vnode, beforeNode.parentNode, beforeNode, projectionOptions);
            return createProjection(vnode, projectionOptions);
        },
        /**
         * Merges a new DOM node which is generated from a [[VNode]] with an existing DOM Node.
         * This means that the virtual DOM and the real DOM will have one overlapping element.
         * Therefore the selector for the root [[VNode]] will be ignored, but its properties and children will be applied to the Element provided.
         * This is a low-level method. Users wil typically use a [[Projector]] instead.
         * @param element - The existing element to adopt as the root of the new virtual DOM. Existing attributes and child nodes are preserved.
         * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]] objects
         * may only be rendered once.
         * @param projectionOptions - Options to be used to create and update the projection, see [[createProjector]].
         * @returns The [[Projection]] that was created.
         */
        merge: function (element, vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            vnode.domNode = element;
            initPropertiesAndChildren(element, vnode, projectionOptions);
            return createProjection(vnode, projectionOptions);
        },
        /**
         * Replaces an existing DOM node with a node generated from a [[VNode]].
         * This is a low-level method. Users will typically use a [[Projector]] instead.
         * @param element - The node for the [[VNode]] to replace.
         * @param vnode - The root of the virtual DOM tree that was created using the [[h]] function. NOTE: [[VNode]]
         * objects may only be rendered once.
         * @param projectionOptions - Options to be used to create and update the [[Projection]].
         * @returns The [[Projection]] that was created.
         */
        replace: function (element, vnode, projectionOptions) {
            projectionOptions = applyDefaultProjectionOptions(projectionOptions);
            createDom(vnode, element.parentNode, element, projectionOptions);
            element.parentNode.removeChild(element);
            return createProjection(vnode, projectionOptions);
        }
    };

    /* tslint:disable function-name */
    var toTextVNode = function (data) {
        return {
            vnodeSelector: '',
            properties: undefined,
            children: undefined,
            text: data.toString(),
            domNode: null
        };
    };
    var appendChildren = function (parentSelector, insertions, main) {
        for (var i = 0, length_1 = insertions.length; i < length_1; i++) {
            var item = insertions[i];
            if (Array.isArray(item)) {
                appendChildren(parentSelector, item, main);
            }
            else {
                if (item !== null && item !== undefined && item !== false) {
                    if (typeof item === 'string') {
                        item = toTextVNode(item);
                    }
                    main.push(item);
                }
            }
        }
    };
    function h(selector, properties, children) {
        if (Array.isArray(properties)) {
            children = properties;
            properties = undefined;
        }
        else if ((properties && (typeof properties === 'string' || properties.hasOwnProperty('vnodeSelector'))) ||
            (children && (typeof children === 'string' || children.hasOwnProperty('vnodeSelector')))) {
            throw new Error('h called with invalid arguments');
        }
        var text;
        var flattenedChildren;
        // Recognize a common special case where there is only a single text node
        if (children && children.length === 1 && typeof children[0] === 'string') {
            text = children[0];
        }
        else if (children) {
            flattenedChildren = [];
            appendChildren(selector, children, flattenedChildren);
            if (flattenedChildren.length === 0) {
                flattenedChildren = undefined;
            }
        }
        return {
            vnodeSelector: selector,
            properties: properties,
            children: flattenedChildren,
            text: (text === '') ? undefined : text,
            domNode: null
        };
    }

    var createParentNodePath = function (node, rootNode) {
        var parentNodePath = [];
        while (node !== rootNode) {
            parentNodePath.push(node);
            node = node.parentNode;
        }
        return parentNodePath;
    };
    var find;
    if (Array.prototype.find) {
        find = function (items, predicate) { return items.find(predicate); };
    }
    else {
        find = function (items, predicate) { return items.filter(predicate)[0]; };
    }
    var findVNodeByParentNodePath = function (vnode, parentNodePath) {
        var result = vnode;
        parentNodePath.forEach(function (node) {
            result = (result && result.children) ? find(result.children, function (child) { return child.domNode === node; }) : undefined;
        });
        return result;
    };
    var createEventHandlerInterceptor = function (projector, getProjection, performanceLogger) {
        var modifiedEventHandler = function (evt) {
            performanceLogger('domEvent', evt);
            var projection = getProjection();
            var parentNodePath = createParentNodePath(evt.currentTarget, projection.domNode);
            parentNodePath.reverse();
            var matchingVNode = findVNodeByParentNodePath(projection.getLastRender(), parentNodePath);
            projector.scheduleRender();
            var result;
            if (matchingVNode) {
                /* tslint:disable no-invalid-this */
                result = matchingVNode.properties["on" + evt.type].apply(matchingVNode.properties.bind || this, arguments);
                /* tslint:enable no-invalid-this */
            }
            performanceLogger('domEventProcessed', evt);
            return result;
        };
        return function (propertyName, eventHandler, domNode, properties) { return modifiedEventHandler; };
    };
    /**
     * Creates a [[Projector]] instance using the provided projectionOptions.
     *
     * For more information, see [[Projector]].
     *
     * @param projectorOptions   Options that influence how the DOM is rendered and updated.
     */
    var createProjector = function (projectorOptions) {
        var projector;
        var projectionOptions = applyDefaultProjectionOptions(projectorOptions);
        var performanceLogger = projectionOptions.performanceLogger;
        var renderCompleted = true;
        var scheduled;
        var stopped = false;
        var projections = [];
        var renderFunctions = []; // matches the projections array
        var addProjection = function (
        /* one of: dom.append, dom.insertBefore, dom.replace, dom.merge */
        domFunction, 
        /* the parameter of the domFunction */
        node, renderFunction) {
            var projection;
            var getProjection = function () { return projection; };
            projectionOptions.eventHandlerInterceptor = createEventHandlerInterceptor(projector, getProjection, performanceLogger);
            projection = domFunction(node, renderFunction(), projectionOptions);
            projections.push(projection);
            renderFunctions.push(renderFunction);
        };
        var doRender = function () {
            scheduled = undefined;
            if (!renderCompleted) {
                return; // The last render threw an error, it should have been logged in the browser console.
            }
            renderCompleted = false;
            performanceLogger('renderStart', undefined);
            for (var i = 0; i < projections.length; i++) {
                var updatedVnode = renderFunctions[i]();
                performanceLogger('rendered', undefined);
                projections[i].update(updatedVnode);
                performanceLogger('patched', undefined);
            }
            performanceLogger('renderDone', undefined);
            renderCompleted = true;
        };
        projector = {
            renderNow: doRender,
            scheduleRender: function () {
                if (!scheduled && !stopped) {
                    scheduled = requestAnimationFrame(doRender);
                }
            },
            stop: function () {
                if (scheduled) {
                    cancelAnimationFrame(scheduled);
                    scheduled = undefined;
                }
                stopped = true;
            },
            resume: function () {
                stopped = false;
                renderCompleted = true;
                projector.scheduleRender();
            },
            append: function (parentNode, renderFunction) {
                addProjection(dom.append, parentNode, renderFunction);
            },
            insertBefore: function (beforeNode, renderFunction) {
                addProjection(dom.insertBefore, beforeNode, renderFunction);
            },
            merge: function (domNode, renderFunction) {
                addProjection(dom.merge, domNode, renderFunction);
            },
            replace: function (domNode, renderFunction) {
                addProjection(dom.replace, domNode, renderFunction);
            },
            detach: function (renderFunction) {
                for (var i = 0; i < renderFunctions.length; i++) {
                    if (renderFunctions[i] === renderFunction) {
                        renderFunctions.splice(i, 1);
                        return projections.splice(i, 1)[0];
                    }
                }
                throw new Error('renderFunction was not found');
            }
        };
        return projector;
    };

    /**
     * Creates a [[CalculationCache]] object, useful for caching [[VNode]] trees.
     * In practice, caching of [[VNode]] trees is not needed, because achieving 60 frames per second is almost never a problem.
     * For more information, see [[CalculationCache]].
     *
     * @param <Result> The type of the value that is cached.
     */
    var createCache = function () {
        var cachedInputs;
        var cachedOutcome;
        return {
            invalidate: function () {
                cachedOutcome = undefined;
                cachedInputs = undefined;
            },
            result: function (inputs, calculation) {
                if (cachedInputs) {
                    for (var i = 0; i < inputs.length; i++) {
                        if (cachedInputs[i] !== inputs[i]) {
                            cachedOutcome = undefined;
                        }
                    }
                }
                if (!cachedOutcome) {
                    cachedOutcome = calculation();
                    cachedInputs = inputs;
                }
                return cachedOutcome;
            }
        };
    };

    /**
     * Creates a {@link Mapping} instance that keeps an array of result objects synchronized with an array of source objects.
     * See {@link http://maquettejs.org/docs/arrays.html|Working with arrays}.
     *
     * @param <Source>       The type of source items. A database-record for instance.
     * @param <Target>       The type of target items. A [[MaquetteComponent]] for instance.
     * @param getSourceKey   `function(source)` that must return a key to identify each source object. The result must either be a string or a number.
     * @param createResult   `function(source, index)` that must create a new result object from a given source. This function is identical
     *                       to the `callback` argument in `Array.map(callback)`.
     * @param updateResult   `function(source, target, index)` that updates a result to an updated source.
     */
    var createMapping = function (getSourceKey, createResult, updateResult) {
        var keys = [];
        var results = [];
        return {
            results: results,
            map: function (newSources) {
                var newKeys = newSources.map(getSourceKey);
                var oldTargets = results.slice();
                var oldIndex = 0;
                for (var i = 0; i < newSources.length; i++) {
                    var source = newSources[i];
                    var sourceKey = newKeys[i];
                    if (sourceKey === keys[oldIndex]) {
                        results[i] = oldTargets[oldIndex];
                        updateResult(source, oldTargets[oldIndex], i);
                        oldIndex++;
                    }
                    else {
                        var found = false;
                        for (var j = 1; j < keys.length + 1; j++) {
                            var searchIndex = (oldIndex + j) % keys.length;
                            if (keys[searchIndex] === sourceKey) {
                                results[i] = oldTargets[searchIndex];
                                updateResult(newSources[i], oldTargets[searchIndex], i);
                                oldIndex = searchIndex + 1;
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            results[i] = createResult(source, i);
                        }
                    }
                }
                results.length = newSources.length;
                keys = newKeys;
            }
        };
    };

    exports.createCache = createCache;
    exports.createMapping = createMapping;
    exports.createProjector = createProjector;
    exports.dom = dom;
    exports.h = h;

    Object.defineProperty(exports, '__esModule', { value: true });

}));


/***/ }),

/***/ "./node_modules/qrcode-generator/qrcode.js":
/*!*************************************************!*\
  !*** ./node_modules/qrcode-generator/qrcode.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//---------------------------------------------------------------------
//
// QR Code Generator for JavaScript
//
// Copyright (c) 2009 Kazuhiko Arase
//
// URL: http://www.d-project.com/
//
// Licensed under the MIT license:
//  http://www.opensource.org/licenses/mit-license.php
//
// The word 'QR Code' is registered trademark of
// DENSO WAVE INCORPORATED
//  http://www.denso-wave.com/qrcode/faqpatent-e.html
//
//---------------------------------------------------------------------

var qrcode = function() {

  //---------------------------------------------------------------------
  // qrcode
  //---------------------------------------------------------------------

  /**
   * qrcode
   * @param typeNumber 1 to 40
   * @param errorCorrectionLevel 'L','M','Q','H'
   */
  var qrcode = function(typeNumber, errorCorrectionLevel) {

    var PAD0 = 0xEC;
    var PAD1 = 0x11;

    var _typeNumber = typeNumber;
    var _errorCorrectionLevel = QRErrorCorrectionLevel[errorCorrectionLevel];
    var _modules = null;
    var _moduleCount = 0;
    var _dataCache = null;
    var _dataList = [];

    var _this = {};

    var makeImpl = function(test, maskPattern) {

      _moduleCount = _typeNumber * 4 + 17;
      _modules = function(moduleCount) {
        var modules = new Array(moduleCount);
        for (var row = 0; row < moduleCount; row += 1) {
          modules[row] = new Array(moduleCount);
          for (var col = 0; col < moduleCount; col += 1) {
            modules[row][col] = null;
          }
        }
        return modules;
      }(_moduleCount);

      setupPositionProbePattern(0, 0);
      setupPositionProbePattern(_moduleCount - 7, 0);
      setupPositionProbePattern(0, _moduleCount - 7);
      setupPositionAdjustPattern();
      setupTimingPattern();
      setupTypeInfo(test, maskPattern);

      if (_typeNumber >= 7) {
        setupTypeNumber(test);
      }

      if (_dataCache == null) {
        _dataCache = createData(_typeNumber, _errorCorrectionLevel, _dataList);
      }

      mapData(_dataCache, maskPattern);
    };

    var setupPositionProbePattern = function(row, col) {

      for (var r = -1; r <= 7; r += 1) {

        if (row + r <= -1 || _moduleCount <= row + r) continue;

        for (var c = -1; c <= 7; c += 1) {

          if (col + c <= -1 || _moduleCount <= col + c) continue;

          if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
              || (0 <= c && c <= 6 && (r == 0 || r == 6) )
              || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
            _modules[row + r][col + c] = true;
          } else {
            _modules[row + r][col + c] = false;
          }
        }
      }
    };

    var getBestMaskPattern = function() {

      var minLostPoint = 0;
      var pattern = 0;

      for (var i = 0; i < 8; i += 1) {

        makeImpl(true, i);

        var lostPoint = QRUtil.getLostPoint(_this);

        if (i == 0 || minLostPoint > lostPoint) {
          minLostPoint = lostPoint;
          pattern = i;
        }
      }

      return pattern;
    };

    var setupTimingPattern = function() {

      for (var r = 8; r < _moduleCount - 8; r += 1) {
        if (_modules[r][6] != null) {
          continue;
        }
        _modules[r][6] = (r % 2 == 0);
      }

      for (var c = 8; c < _moduleCount - 8; c += 1) {
        if (_modules[6][c] != null) {
          continue;
        }
        _modules[6][c] = (c % 2 == 0);
      }
    };

    var setupPositionAdjustPattern = function() {

      var pos = QRUtil.getPatternPosition(_typeNumber);

      for (var i = 0; i < pos.length; i += 1) {

        for (var j = 0; j < pos.length; j += 1) {

          var row = pos[i];
          var col = pos[j];

          if (_modules[row][col] != null) {
            continue;
          }

          for (var r = -2; r <= 2; r += 1) {

            for (var c = -2; c <= 2; c += 1) {

              if (r == -2 || r == 2 || c == -2 || c == 2
                  || (r == 0 && c == 0) ) {
                _modules[row + r][col + c] = true;
              } else {
                _modules[row + r][col + c] = false;
              }
            }
          }
        }
      }
    };

    var setupTypeNumber = function(test) {

      var bits = QRUtil.getBCHTypeNumber(_typeNumber);

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
      }

      for (var i = 0; i < 18; i += 1) {
        var mod = (!test && ( (bits >> i) & 1) == 1);
        _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
      }
    };

    var setupTypeInfo = function(test, maskPattern) {

      var data = (_errorCorrectionLevel << 3) | maskPattern;
      var bits = QRUtil.getBCHTypeInfo(data);

      // vertical
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 6) {
          _modules[i][8] = mod;
        } else if (i < 8) {
          _modules[i + 1][8] = mod;
        } else {
          _modules[_moduleCount - 15 + i][8] = mod;
        }
      }

      // horizontal
      for (var i = 0; i < 15; i += 1) {

        var mod = (!test && ( (bits >> i) & 1) == 1);

        if (i < 8) {
          _modules[8][_moduleCount - i - 1] = mod;
        } else if (i < 9) {
          _modules[8][15 - i - 1 + 1] = mod;
        } else {
          _modules[8][15 - i - 1] = mod;
        }
      }

      // fixed module
      _modules[_moduleCount - 8][8] = (!test);
    };

    var mapData = function(data, maskPattern) {

      var inc = -1;
      var row = _moduleCount - 1;
      var bitIndex = 7;
      var byteIndex = 0;
      var maskFunc = QRUtil.getMaskFunction(maskPattern);

      for (var col = _moduleCount - 1; col > 0; col -= 2) {

        if (col == 6) col -= 1;

        while (true) {

          for (var c = 0; c < 2; c += 1) {

            if (_modules[row][col - c] == null) {

              var dark = false;

              if (byteIndex < data.length) {
                dark = ( ( (data[byteIndex] >>> bitIndex) & 1) == 1);
              }

              var mask = maskFunc(row, col - c);

              if (mask) {
                dark = !dark;
              }

              _modules[row][col - c] = dark;
              bitIndex -= 1;

              if (bitIndex == -1) {
                byteIndex += 1;
                bitIndex = 7;
              }
            }
          }

          row += inc;

          if (row < 0 || _moduleCount <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    };

    var createBytes = function(buffer, rsBlocks) {

      var offset = 0;

      var maxDcCount = 0;
      var maxEcCount = 0;

      var dcdata = new Array(rsBlocks.length);
      var ecdata = new Array(rsBlocks.length);

      for (var r = 0; r < rsBlocks.length; r += 1) {

        var dcCount = rsBlocks[r].dataCount;
        var ecCount = rsBlocks[r].totalCount - dcCount;

        maxDcCount = Math.max(maxDcCount, dcCount);
        maxEcCount = Math.max(maxEcCount, ecCount);

        dcdata[r] = new Array(dcCount);

        for (var i = 0; i < dcdata[r].length; i += 1) {
          dcdata[r][i] = 0xff & buffer.getBuffer()[i + offset];
        }
        offset += dcCount;

        var rsPoly = QRUtil.getErrorCorrectPolynomial(ecCount);
        var rawPoly = qrPolynomial(dcdata[r], rsPoly.getLength() - 1);

        var modPoly = rawPoly.mod(rsPoly);
        ecdata[r] = new Array(rsPoly.getLength() - 1);
        for (var i = 0; i < ecdata[r].length; i += 1) {
          var modIndex = i + modPoly.getLength() - ecdata[r].length;
          ecdata[r][i] = (modIndex >= 0)? modPoly.getAt(modIndex) : 0;
        }
      }

      var totalCodeCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalCodeCount += rsBlocks[i].totalCount;
      }

      var data = new Array(totalCodeCount);
      var index = 0;

      for (var i = 0; i < maxDcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < dcdata[r].length) {
            data[index] = dcdata[r][i];
            index += 1;
          }
        }
      }

      for (var i = 0; i < maxEcCount; i += 1) {
        for (var r = 0; r < rsBlocks.length; r += 1) {
          if (i < ecdata[r].length) {
            data[index] = ecdata[r][i];
            index += 1;
          }
        }
      }

      return data;
    };

    var createData = function(typeNumber, errorCorrectionLevel, dataList) {

      var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, errorCorrectionLevel);

      var buffer = qrBitBuffer();

      for (var i = 0; i < dataList.length; i += 1) {
        var data = dataList[i];
        buffer.put(data.getMode(), 4);
        buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
        data.write(buffer);
      }

      // calc num max data.
      var totalDataCount = 0;
      for (var i = 0; i < rsBlocks.length; i += 1) {
        totalDataCount += rsBlocks[i].dataCount;
      }

      if (buffer.getLengthInBits() > totalDataCount * 8) {
        throw 'code length overflow. ('
          + buffer.getLengthInBits()
          + '>'
          + totalDataCount * 8
          + ')';
      }

      // end code
      if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) {
        buffer.put(0, 4);
      }

      // padding
      while (buffer.getLengthInBits() % 8 != 0) {
        buffer.putBit(false);
      }

      // padding
      while (true) {

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD0, 8);

        if (buffer.getLengthInBits() >= totalDataCount * 8) {
          break;
        }
        buffer.put(PAD1, 8);
      }

      return createBytes(buffer, rsBlocks);
    };

    _this.addData = function(data, mode) {

      mode = mode || 'Byte';

      var newData = null;

      switch(mode) {
      case 'Numeric' :
        newData = qrNumber(data);
        break;
      case 'Alphanumeric' :
        newData = qrAlphaNum(data);
        break;
      case 'Byte' :
        newData = qr8BitByte(data);
        break;
      case 'Kanji' :
        newData = qrKanji(data);
        break;
      default :
        throw 'mode:' + mode;
      }

      _dataList.push(newData);
      _dataCache = null;
    };

    _this.isDark = function(row, col) {
      if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
        throw row + ',' + col;
      }
      return _modules[row][col];
    };

    _this.getModuleCount = function() {
      return _moduleCount;
    };

    _this.make = function() {
      if (_typeNumber < 1) {
        var typeNumber = 1;

        for (; typeNumber < 40; typeNumber++) {
          var rsBlocks = QRRSBlock.getRSBlocks(typeNumber, _errorCorrectionLevel);
          var buffer = qrBitBuffer();

          for (var i = 0; i < _dataList.length; i++) {
            var data = _dataList[i];
            buffer.put(data.getMode(), 4);
            buffer.put(data.getLength(), QRUtil.getLengthInBits(data.getMode(), typeNumber) );
            data.write(buffer);
          }

          var totalDataCount = 0;
          for (var i = 0; i < rsBlocks.length; i++) {
            totalDataCount += rsBlocks[i].dataCount;
          }

          if (buffer.getLengthInBits() <= totalDataCount * 8) {
            break;
          }
        }

        _typeNumber = typeNumber;
      }

      makeImpl(false, getBestMaskPattern() );
    };

    _this.createTableTag = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var qrHtml = '';

      qrHtml += '<table style="';
      qrHtml += ' border-width: 0px; border-style: none;';
      qrHtml += ' border-collapse: collapse;';
      qrHtml += ' padding: 0px; margin: ' + margin + 'px;';
      qrHtml += '">';
      qrHtml += '<tbody>';

      for (var r = 0; r < _this.getModuleCount(); r += 1) {

        qrHtml += '<tr>';

        for (var c = 0; c < _this.getModuleCount(); c += 1) {
          qrHtml += '<td style="';
          qrHtml += ' border-width: 0px; border-style: none;';
          qrHtml += ' border-collapse: collapse;';
          qrHtml += ' padding: 0px; margin: 0px;';
          qrHtml += ' width: ' + cellSize + 'px;';
          qrHtml += ' height: ' + cellSize + 'px;';
          qrHtml += ' background-color: ';
          qrHtml += _this.isDark(r, c)? '#000000' : '#ffffff';
          qrHtml += ';';
          qrHtml += '"/>';
        }

        qrHtml += '</tr>';
      }

      qrHtml += '</tbody>';
      qrHtml += '</table>';

      return qrHtml;
    };

    _this.createSvgTag = function(cellSize, margin) {

      var opts = {};
      if (typeof arguments[0] == 'object') {
        // Called by options.
        opts = arguments[0];
        // overwrite cellSize and margin.
        cellSize = opts.cellSize;
        margin = opts.margin;
      }

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;
      var size = _this.getModuleCount() * cellSize + margin * 2;
      var c, mc, r, mr, qrSvg='', rect;

      rect = 'l' + cellSize + ',0 0,' + cellSize +
        ' -' + cellSize + ',0 0,-' + cellSize + 'z ';

      qrSvg += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"';
      qrSvg += !opts.scalable ? ' width="' + size + 'px" height="' + size + 'px"' : '';
      qrSvg += ' viewBox="0 0 ' + size + ' ' + size + '" ';
      qrSvg += ' preserveAspectRatio="xMinYMin meet">';
      qrSvg += '<rect width="100%" height="100%" fill="white" cx="0" cy="0"/>';
      qrSvg += '<path d="';

      for (r = 0; r < _this.getModuleCount(); r += 1) {
        mr = r * cellSize + margin;
        for (c = 0; c < _this.getModuleCount(); c += 1) {
          if (_this.isDark(r, c) ) {
            mc = c*cellSize+margin;
            qrSvg += 'M' + mc + ',' + mr + rect;
          }
        }
      }

      qrSvg += '" stroke="transparent" fill="black"/>';
      qrSvg += '</svg>';

      return qrSvg;
    };

    _this.createDataURL = function(cellSize, margin) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      return createDataURL(size, size, function(x, y) {
        if (min <= x && x < max && min <= y && y < max) {
          var c = Math.floor( (x - min) / cellSize);
          var r = Math.floor( (y - min) / cellSize);
          return _this.isDark(r, c)? 0 : 1;
        } else {
          return 1;
        }
      } );
    };

    _this.createImgTag = function(cellSize, margin, alt) {

      cellSize = cellSize || 2;
      margin = (typeof margin == 'undefined')? cellSize * 4 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;

      var img = '';
      img += '<img';
      img += '\u0020src="';
      img += _this.createDataURL(cellSize, margin);
      img += '"';
      img += '\u0020width="';
      img += size;
      img += '"';
      img += '\u0020height="';
      img += size;
      img += '"';
      if (alt) {
        img += '\u0020alt="';
        img += alt;
        img += '"';
      }
      img += '/>';

      return img;
    };

    var _createHalfASCII = function(margin) {
      var cellSize = 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r1, r2, p;

      var blocks = {
        '██': '█',
        '█ ': '▀',
        ' █': '▄',
        '  ': ' '
      };

      var blocksLastLineNoMargin = {
        '██': '▀',
        '█ ': '▀',
        ' █': ' ',
        '  ': ' '
      };

      var ascii = '';
      for (y = 0; y < size; y += 2) {
        r1 = Math.floor((y - min) / cellSize);
        r2 = Math.floor((y + 1 - min) / cellSize);
        for (x = 0; x < size; x += 1) {
          p = '█';

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r1, Math.floor((x - min) / cellSize))) {
            p = ' ';
          }

          if (min <= x && x < max && min <= y+1 && y+1 < max && _this.isDark(r2, Math.floor((x - min) / cellSize))) {
            p += ' ';
          }
          else {
            p += '█';
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          ascii += (margin < 1 && y+1 >= max) ? blocksLastLineNoMargin[p] : blocks[p];
        }

        ascii += '\n';
      }

      if (size % 2 && margin > 0) {
        return ascii.substring(0, ascii.length - size - 1) + Array(size+1).join('▀');
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.createASCII = function(cellSize, margin) {
      cellSize = cellSize || 1;

      if (cellSize < 2) {
        return _createHalfASCII(margin);
      }

      cellSize -= 1;
      margin = (typeof margin == 'undefined')? cellSize * 2 : margin;

      var size = _this.getModuleCount() * cellSize + margin * 2;
      var min = margin;
      var max = size - margin;

      var y, x, r, p;

      var white = Array(cellSize+1).join('██');
      var black = Array(cellSize+1).join('  ');

      var ascii = '';
      var line = '';
      for (y = 0; y < size; y += 1) {
        r = Math.floor( (y - min) / cellSize);
        line = '';
        for (x = 0; x < size; x += 1) {
          p = 1;

          if (min <= x && x < max && min <= y && y < max && _this.isDark(r, Math.floor((x - min) / cellSize))) {
            p = 0;
          }

          // Output 2 characters per pixel, to create full square. 1 character per pixels gives only half width of square.
          line += p ? white : black;
        }

        for (r = 0; r < cellSize; r += 1) {
          ascii += line + '\n';
        }
      }

      return ascii.substring(0, ascii.length-1);
    };

    _this.renderTo2dContext = function(context, cellSize) {
      cellSize = cellSize || 2;
      var length = _this.getModuleCount();
      for (var row = 0; row < length; row++) {
        for (var col = 0; col < length; col++) {
          context.fillStyle = _this.isDark(row, col) ? 'black' : 'white';
          context.fillRect(row * cellSize, col * cellSize, cellSize, cellSize);
        }
      }
    }

    return _this;
  };

  //---------------------------------------------------------------------
  // qrcode.stringToBytes
  //---------------------------------------------------------------------

  qrcode.stringToBytesFuncs = {
    'default' : function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        bytes.push(c & 0xff);
      }
      return bytes;
    }
  };

  qrcode.stringToBytes = qrcode.stringToBytesFuncs['default'];

  //---------------------------------------------------------------------
  // qrcode.createStringToBytes
  //---------------------------------------------------------------------

  /**
   * @param unicodeData base64 string of byte array.
   * [16bit Unicode],[16bit Bytes], ...
   * @param numChars
   */
  qrcode.createStringToBytes = function(unicodeData, numChars) {

    // create conversion map.

    var unicodeMap = function() {

      var bin = base64DecodeInputStream(unicodeData);
      var read = function() {
        var b = bin.read();
        if (b == -1) throw 'eof';
        return b;
      };

      var count = 0;
      var unicodeMap = {};
      while (true) {
        var b0 = bin.read();
        if (b0 == -1) break;
        var b1 = read();
        var b2 = read();
        var b3 = read();
        var k = String.fromCharCode( (b0 << 8) | b1);
        var v = (b2 << 8) | b3;
        unicodeMap[k] = v;
        count += 1;
      }
      if (count != numChars) {
        throw count + ' != ' + numChars;
      }

      return unicodeMap;
    }();

    var unknownChar = '?'.charCodeAt(0);

    return function(s) {
      var bytes = [];
      for (var i = 0; i < s.length; i += 1) {
        var c = s.charCodeAt(i);
        if (c < 128) {
          bytes.push(c);
        } else {
          var b = unicodeMap[s.charAt(i)];
          if (typeof b == 'number') {
            if ( (b & 0xff) == b) {
              // 1byte
              bytes.push(b);
            } else {
              // 2bytes
              bytes.push(b >>> 8);
              bytes.push(b & 0xff);
            }
          } else {
            bytes.push(unknownChar);
          }
        }
      }
      return bytes;
    };
  };

  //---------------------------------------------------------------------
  // QRMode
  //---------------------------------------------------------------------

  var QRMode = {
    MODE_NUMBER :    1 << 0,
    MODE_ALPHA_NUM : 1 << 1,
    MODE_8BIT_BYTE : 1 << 2,
    MODE_KANJI :     1 << 3
  };

  //---------------------------------------------------------------------
  // QRErrorCorrectionLevel
  //---------------------------------------------------------------------

  var QRErrorCorrectionLevel = {
    L : 1,
    M : 0,
    Q : 3,
    H : 2
  };

  //---------------------------------------------------------------------
  // QRMaskPattern
  //---------------------------------------------------------------------

  var QRMaskPattern = {
    PATTERN000 : 0,
    PATTERN001 : 1,
    PATTERN010 : 2,
    PATTERN011 : 3,
    PATTERN100 : 4,
    PATTERN101 : 5,
    PATTERN110 : 6,
    PATTERN111 : 7
  };

  //---------------------------------------------------------------------
  // QRUtil
  //---------------------------------------------------------------------

  var QRUtil = function() {

    var PATTERN_POSITION_TABLE = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ];
    var G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
    var G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
    var G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);

    var _this = {};

    var getBCHDigit = function(data) {
      var digit = 0;
      while (data != 0) {
        digit += 1;
        data >>>= 1;
      }
      return digit;
    };

    _this.getBCHTypeInfo = function(data) {
      var d = data << 10;
      while (getBCHDigit(d) - getBCHDigit(G15) >= 0) {
        d ^= (G15 << (getBCHDigit(d) - getBCHDigit(G15) ) );
      }
      return ( (data << 10) | d) ^ G15_MASK;
    };

    _this.getBCHTypeNumber = function(data) {
      var d = data << 12;
      while (getBCHDigit(d) - getBCHDigit(G18) >= 0) {
        d ^= (G18 << (getBCHDigit(d) - getBCHDigit(G18) ) );
      }
      return (data << 12) | d;
    };

    _this.getPatternPosition = function(typeNumber) {
      return PATTERN_POSITION_TABLE[typeNumber - 1];
    };

    _this.getMaskFunction = function(maskPattern) {

      switch (maskPattern) {

      case QRMaskPattern.PATTERN000 :
        return function(i, j) { return (i + j) % 2 == 0; };
      case QRMaskPattern.PATTERN001 :
        return function(i, j) { return i % 2 == 0; };
      case QRMaskPattern.PATTERN010 :
        return function(i, j) { return j % 3 == 0; };
      case QRMaskPattern.PATTERN011 :
        return function(i, j) { return (i + j) % 3 == 0; };
      case QRMaskPattern.PATTERN100 :
        return function(i, j) { return (Math.floor(i / 2) + Math.floor(j / 3) ) % 2 == 0; };
      case QRMaskPattern.PATTERN101 :
        return function(i, j) { return (i * j) % 2 + (i * j) % 3 == 0; };
      case QRMaskPattern.PATTERN110 :
        return function(i, j) { return ( (i * j) % 2 + (i * j) % 3) % 2 == 0; };
      case QRMaskPattern.PATTERN111 :
        return function(i, j) { return ( (i * j) % 3 + (i + j) % 2) % 2 == 0; };

      default :
        throw 'bad maskPattern:' + maskPattern;
      }
    };

    _this.getErrorCorrectPolynomial = function(errorCorrectLength) {
      var a = qrPolynomial([1], 0);
      for (var i = 0; i < errorCorrectLength; i += 1) {
        a = a.multiply(qrPolynomial([1, QRMath.gexp(i)], 0) );
      }
      return a;
    };

    _this.getLengthInBits = function(mode, type) {

      if (1 <= type && type < 10) {

        // 1 - 9

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 10;
        case QRMode.MODE_ALPHA_NUM : return 9;
        case QRMode.MODE_8BIT_BYTE : return 8;
        case QRMode.MODE_KANJI     : return 8;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 27) {

        // 10 - 26

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 12;
        case QRMode.MODE_ALPHA_NUM : return 11;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 10;
        default :
          throw 'mode:' + mode;
        }

      } else if (type < 41) {

        // 27 - 40

        switch(mode) {
        case QRMode.MODE_NUMBER    : return 14;
        case QRMode.MODE_ALPHA_NUM : return 13;
        case QRMode.MODE_8BIT_BYTE : return 16;
        case QRMode.MODE_KANJI     : return 12;
        default :
          throw 'mode:' + mode;
        }

      } else {
        throw 'type:' + type;
      }
    };

    _this.getLostPoint = function(qrcode) {

      var moduleCount = qrcode.getModuleCount();

      var lostPoint = 0;

      // LEVEL1

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount; col += 1) {

          var sameCount = 0;
          var dark = qrcode.isDark(row, col);

          for (var r = -1; r <= 1; r += 1) {

            if (row + r < 0 || moduleCount <= row + r) {
              continue;
            }

            for (var c = -1; c <= 1; c += 1) {

              if (col + c < 0 || moduleCount <= col + c) {
                continue;
              }

              if (r == 0 && c == 0) {
                continue;
              }

              if (dark == qrcode.isDark(row + r, col + c) ) {
                sameCount += 1;
              }
            }
          }

          if (sameCount > 5) {
            lostPoint += (3 + sameCount - 5);
          }
        }
      };

      // LEVEL2

      for (var row = 0; row < moduleCount - 1; row += 1) {
        for (var col = 0; col < moduleCount - 1; col += 1) {
          var count = 0;
          if (qrcode.isDark(row, col) ) count += 1;
          if (qrcode.isDark(row + 1, col) ) count += 1;
          if (qrcode.isDark(row, col + 1) ) count += 1;
          if (qrcode.isDark(row + 1, col + 1) ) count += 1;
          if (count == 0 || count == 4) {
            lostPoint += 3;
          }
        }
      }

      // LEVEL3

      for (var row = 0; row < moduleCount; row += 1) {
        for (var col = 0; col < moduleCount - 6; col += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row, col + 1)
              &&  qrcode.isDark(row, col + 2)
              &&  qrcode.isDark(row, col + 3)
              &&  qrcode.isDark(row, col + 4)
              && !qrcode.isDark(row, col + 5)
              &&  qrcode.isDark(row, col + 6) ) {
            lostPoint += 40;
          }
        }
      }

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount - 6; row += 1) {
          if (qrcode.isDark(row, col)
              && !qrcode.isDark(row + 1, col)
              &&  qrcode.isDark(row + 2, col)
              &&  qrcode.isDark(row + 3, col)
              &&  qrcode.isDark(row + 4, col)
              && !qrcode.isDark(row + 5, col)
              &&  qrcode.isDark(row + 6, col) ) {
            lostPoint += 40;
          }
        }
      }

      // LEVEL4

      var darkCount = 0;

      for (var col = 0; col < moduleCount; col += 1) {
        for (var row = 0; row < moduleCount; row += 1) {
          if (qrcode.isDark(row, col) ) {
            darkCount += 1;
          }
        }
      }

      var ratio = Math.abs(100 * darkCount / moduleCount / moduleCount - 50) / 5;
      lostPoint += ratio * 10;

      return lostPoint;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // QRMath
  //---------------------------------------------------------------------

  var QRMath = function() {

    var EXP_TABLE = new Array(256);
    var LOG_TABLE = new Array(256);

    // initialize tables
    for (var i = 0; i < 8; i += 1) {
      EXP_TABLE[i] = 1 << i;
    }
    for (var i = 8; i < 256; i += 1) {
      EXP_TABLE[i] = EXP_TABLE[i - 4]
        ^ EXP_TABLE[i - 5]
        ^ EXP_TABLE[i - 6]
        ^ EXP_TABLE[i - 8];
    }
    for (var i = 0; i < 255; i += 1) {
      LOG_TABLE[EXP_TABLE[i] ] = i;
    }

    var _this = {};

    _this.glog = function(n) {

      if (n < 1) {
        throw 'glog(' + n + ')';
      }

      return LOG_TABLE[n];
    };

    _this.gexp = function(n) {

      while (n < 0) {
        n += 255;
      }

      while (n >= 256) {
        n -= 255;
      }

      return EXP_TABLE[n];
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrPolynomial
  //---------------------------------------------------------------------

  function qrPolynomial(num, shift) {

    if (typeof num.length == 'undefined') {
      throw num.length + '/' + shift;
    }

    var _num = function() {
      var offset = 0;
      while (offset < num.length && num[offset] == 0) {
        offset += 1;
      }
      var _num = new Array(num.length - offset + shift);
      for (var i = 0; i < num.length - offset; i += 1) {
        _num[i] = num[i + offset];
      }
      return _num;
    }();

    var _this = {};

    _this.getAt = function(index) {
      return _num[index];
    };

    _this.getLength = function() {
      return _num.length;
    };

    _this.multiply = function(e) {

      var num = new Array(_this.getLength() + e.getLength() - 1);

      for (var i = 0; i < _this.getLength(); i += 1) {
        for (var j = 0; j < e.getLength(); j += 1) {
          num[i + j] ^= QRMath.gexp(QRMath.glog(_this.getAt(i) ) + QRMath.glog(e.getAt(j) ) );
        }
      }

      return qrPolynomial(num, 0);
    };

    _this.mod = function(e) {

      if (_this.getLength() - e.getLength() < 0) {
        return _this;
      }

      var ratio = QRMath.glog(_this.getAt(0) ) - QRMath.glog(e.getAt(0) );

      var num = new Array(_this.getLength() );
      for (var i = 0; i < _this.getLength(); i += 1) {
        num[i] = _this.getAt(i);
      }

      for (var i = 0; i < e.getLength(); i += 1) {
        num[i] ^= QRMath.gexp(QRMath.glog(e.getAt(i) ) + ratio);
      }

      // recursive call
      return qrPolynomial(num, 0).mod(e);
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // QRRSBlock
  //---------------------------------------------------------------------

  var QRRSBlock = function() {

    var RS_BLOCK_TABLE = [

      // L
      // M
      // Q
      // H

      // 1
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],

      // 2
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],

      // 3
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],

      // 4
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],

      // 5
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],

      // 6
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],

      // 7
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],

      // 8
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],

      // 9
      [2, 146, 116],
      [3, 58, 36, 2, 59, 37],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],

      // 10
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],

      // 11
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],

      // 12
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],

      // 13
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],

      // 14
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],

      // 15
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],

      // 16
      [5, 122, 98, 1, 123, 99],
      [7, 73, 45, 3, 74, 46],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],

      // 17
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],

      // 18
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],

      // 19
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],

      // 20
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],

      // 21
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],

      // 22
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],

      // 23
      [4, 151, 121, 5, 152, 122],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],

      // 24
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],

      // 25
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],

      // 26
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],

      // 27
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],

      // 28
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],

      // 29
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],

      // 30
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],

      // 31
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],

      // 32
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],

      // 33
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],

      // 34
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],

      // 35
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],

      // 36
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],

      // 37
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],

      // 38
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],

      // 39
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],

      // 40
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ];

    var qrRSBlock = function(totalCount, dataCount) {
      var _this = {};
      _this.totalCount = totalCount;
      _this.dataCount = dataCount;
      return _this;
    };

    var _this = {};

    var getRsBlockTable = function(typeNumber, errorCorrectionLevel) {

      switch(errorCorrectionLevel) {
      case QRErrorCorrectionLevel.L :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 0];
      case QRErrorCorrectionLevel.M :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 1];
      case QRErrorCorrectionLevel.Q :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 2];
      case QRErrorCorrectionLevel.H :
        return RS_BLOCK_TABLE[(typeNumber - 1) * 4 + 3];
      default :
        return undefined;
      }
    };

    _this.getRSBlocks = function(typeNumber, errorCorrectionLevel) {

      var rsBlock = getRsBlockTable(typeNumber, errorCorrectionLevel);

      if (typeof rsBlock == 'undefined') {
        throw 'bad rs block @ typeNumber:' + typeNumber +
            '/errorCorrectionLevel:' + errorCorrectionLevel;
      }

      var length = rsBlock.length / 3;

      var list = [];

      for (var i = 0; i < length; i += 1) {

        var count = rsBlock[i * 3 + 0];
        var totalCount = rsBlock[i * 3 + 1];
        var dataCount = rsBlock[i * 3 + 2];

        for (var j = 0; j < count; j += 1) {
          list.push(qrRSBlock(totalCount, dataCount) );
        }
      }

      return list;
    };

    return _this;
  }();

  //---------------------------------------------------------------------
  // qrBitBuffer
  //---------------------------------------------------------------------

  var qrBitBuffer = function() {

    var _buffer = [];
    var _length = 0;

    var _this = {};

    _this.getBuffer = function() {
      return _buffer;
    };

    _this.getAt = function(index) {
      var bufIndex = Math.floor(index / 8);
      return ( (_buffer[bufIndex] >>> (7 - index % 8) ) & 1) == 1;
    };

    _this.put = function(num, length) {
      for (var i = 0; i < length; i += 1) {
        _this.putBit( ( (num >>> (length - i - 1) ) & 1) == 1);
      }
    };

    _this.getLengthInBits = function() {
      return _length;
    };

    _this.putBit = function(bit) {

      var bufIndex = Math.floor(_length / 8);
      if (_buffer.length <= bufIndex) {
        _buffer.push(0);
      }

      if (bit) {
        _buffer[bufIndex] |= (0x80 >>> (_length % 8) );
      }

      _length += 1;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrNumber
  //---------------------------------------------------------------------

  var qrNumber = function(data) {

    var _mode = QRMode.MODE_NUMBER;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var data = _data;

      var i = 0;

      while (i + 2 < data.length) {
        buffer.put(strToNum(data.substring(i, i + 3) ), 10);
        i += 3;
      }

      if (i < data.length) {
        if (data.length - i == 1) {
          buffer.put(strToNum(data.substring(i, i + 1) ), 4);
        } else if (data.length - i == 2) {
          buffer.put(strToNum(data.substring(i, i + 2) ), 7);
        }
      }
    };

    var strToNum = function(s) {
      var num = 0;
      for (var i = 0; i < s.length; i += 1) {
        num = num * 10 + chatToNum(s.charAt(i) );
      }
      return num;
    };

    var chatToNum = function(c) {
      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      }
      throw 'illegal char :' + c;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrAlphaNum
  //---------------------------------------------------------------------

  var qrAlphaNum = function(data) {

    var _mode = QRMode.MODE_ALPHA_NUM;
    var _data = data;

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _data.length;
    };

    _this.write = function(buffer) {

      var s = _data;

      var i = 0;

      while (i + 1 < s.length) {
        buffer.put(
          getCode(s.charAt(i) ) * 45 +
          getCode(s.charAt(i + 1) ), 11);
        i += 2;
      }

      if (i < s.length) {
        buffer.put(getCode(s.charAt(i) ), 6);
      }
    };

    var getCode = function(c) {

      if ('0' <= c && c <= '9') {
        return c.charCodeAt(0) - '0'.charCodeAt(0);
      } else if ('A' <= c && c <= 'Z') {
        return c.charCodeAt(0) - 'A'.charCodeAt(0) + 10;
      } else {
        switch (c) {
        case ' ' : return 36;
        case '$' : return 37;
        case '%' : return 38;
        case '*' : return 39;
        case '+' : return 40;
        case '-' : return 41;
        case '.' : return 42;
        case '/' : return 43;
        case ':' : return 44;
        default :
          throw 'illegal char :' + c;
        }
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qr8BitByte
  //---------------------------------------------------------------------

  var qr8BitByte = function(data) {

    var _mode = QRMode.MODE_8BIT_BYTE;
    var _data = data;
    var _bytes = qrcode.stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return _bytes.length;
    };

    _this.write = function(buffer) {
      for (var i = 0; i < _bytes.length; i += 1) {
        buffer.put(_bytes[i], 8);
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // qrKanji
  //---------------------------------------------------------------------

  var qrKanji = function(data) {

    var _mode = QRMode.MODE_KANJI;
    var _data = data;

    var stringToBytes = qrcode.stringToBytesFuncs['SJIS'];
    if (!stringToBytes) {
      throw 'sjis not supported.';
    }
    !function(c, code) {
      // self test for sjis support.
      var test = stringToBytes(c);
      if (test.length != 2 || ( (test[0] << 8) | test[1]) != code) {
        throw 'sjis not supported.';
      }
    }('\u53cb', 0x9746);

    var _bytes = stringToBytes(data);

    var _this = {};

    _this.getMode = function() {
      return _mode;
    };

    _this.getLength = function(buffer) {
      return ~~(_bytes.length / 2);
    };

    _this.write = function(buffer) {

      var data = _bytes;

      var i = 0;

      while (i + 1 < data.length) {

        var c = ( (0xff & data[i]) << 8) | (0xff & data[i + 1]);

        if (0x8140 <= c && c <= 0x9FFC) {
          c -= 0x8140;
        } else if (0xE040 <= c && c <= 0xEBBF) {
          c -= 0xC140;
        } else {
          throw 'illegal char at ' + (i + 1) + '/' + c;
        }

        c = ( (c >>> 8) & 0xff) * 0xC0 + (c & 0xff);

        buffer.put(c, 13);

        i += 2;
      }

      if (i < data.length) {
        throw 'illegal char at ' + (i + 1);
      }
    };

    return _this;
  };

  //=====================================================================
  // GIF Support etc.
  //

  //---------------------------------------------------------------------
  // byteArrayOutputStream
  //---------------------------------------------------------------------

  var byteArrayOutputStream = function() {

    var _bytes = [];

    var _this = {};

    _this.writeByte = function(b) {
      _bytes.push(b & 0xff);
    };

    _this.writeShort = function(i) {
      _this.writeByte(i);
      _this.writeByte(i >>> 8);
    };

    _this.writeBytes = function(b, off, len) {
      off = off || 0;
      len = len || b.length;
      for (var i = 0; i < len; i += 1) {
        _this.writeByte(b[i + off]);
      }
    };

    _this.writeString = function(s) {
      for (var i = 0; i < s.length; i += 1) {
        _this.writeByte(s.charCodeAt(i) );
      }
    };

    _this.toByteArray = function() {
      return _bytes;
    };

    _this.toString = function() {
      var s = '';
      s += '[';
      for (var i = 0; i < _bytes.length; i += 1) {
        if (i > 0) {
          s += ',';
        }
        s += _bytes[i];
      }
      s += ']';
      return s;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64EncodeOutputStream
  //---------------------------------------------------------------------

  var base64EncodeOutputStream = function() {

    var _buffer = 0;
    var _buflen = 0;
    var _length = 0;
    var _base64 = '';

    var _this = {};

    var writeEncoded = function(b) {
      _base64 += String.fromCharCode(encode(b & 0x3f) );
    };

    var encode = function(n) {
      if (n < 0) {
        // error.
      } else if (n < 26) {
        return 0x41 + n;
      } else if (n < 52) {
        return 0x61 + (n - 26);
      } else if (n < 62) {
        return 0x30 + (n - 52);
      } else if (n == 62) {
        return 0x2b;
      } else if (n == 63) {
        return 0x2f;
      }
      throw 'n:' + n;
    };

    _this.writeByte = function(n) {

      _buffer = (_buffer << 8) | (n & 0xff);
      _buflen += 8;
      _length += 1;

      while (_buflen >= 6) {
        writeEncoded(_buffer >>> (_buflen - 6) );
        _buflen -= 6;
      }
    };

    _this.flush = function() {

      if (_buflen > 0) {
        writeEncoded(_buffer << (6 - _buflen) );
        _buffer = 0;
        _buflen = 0;
      }

      if (_length % 3 != 0) {
        // padding
        var padlen = 3 - _length % 3;
        for (var i = 0; i < padlen; i += 1) {
          _base64 += '=';
        }
      }
    };

    _this.toString = function() {
      return _base64;
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // base64DecodeInputStream
  //---------------------------------------------------------------------

  var base64DecodeInputStream = function(str) {

    var _str = str;
    var _pos = 0;
    var _buffer = 0;
    var _buflen = 0;

    var _this = {};

    _this.read = function() {

      while (_buflen < 8) {

        if (_pos >= _str.length) {
          if (_buflen == 0) {
            return -1;
          }
          throw 'unexpected end of file./' + _buflen;
        }

        var c = _str.charAt(_pos);
        _pos += 1;

        if (c == '=') {
          _buflen = 0;
          return -1;
        } else if (c.match(/^\s$/) ) {
          // ignore if whitespace.
          continue;
        }

        _buffer = (_buffer << 6) | decode(c.charCodeAt(0) );
        _buflen += 6;
      }

      var n = (_buffer >>> (_buflen - 8) ) & 0xff;
      _buflen -= 8;
      return n;
    };

    var decode = function(c) {
      if (0x41 <= c && c <= 0x5a) {
        return c - 0x41;
      } else if (0x61 <= c && c <= 0x7a) {
        return c - 0x61 + 26;
      } else if (0x30 <= c && c <= 0x39) {
        return c - 0x30 + 52;
      } else if (c == 0x2b) {
        return 62;
      } else if (c == 0x2f) {
        return 63;
      } else {
        throw 'c:' + c;
      }
    };

    return _this;
  };

  //---------------------------------------------------------------------
  // gifImage (B/W)
  //---------------------------------------------------------------------

  var gifImage = function(width, height) {

    var _width = width;
    var _height = height;
    var _data = new Array(width * height);

    var _this = {};

    _this.setPixel = function(x, y, pixel) {
      _data[y * _width + x] = pixel;
    };

    _this.write = function(out) {

      //---------------------------------
      // GIF Signature

      out.writeString('GIF87a');

      //---------------------------------
      // Screen Descriptor

      out.writeShort(_width);
      out.writeShort(_height);

      out.writeByte(0x80); // 2bit
      out.writeByte(0);
      out.writeByte(0);

      //---------------------------------
      // Global Color Map

      // black
      out.writeByte(0x00);
      out.writeByte(0x00);
      out.writeByte(0x00);

      // white
      out.writeByte(0xff);
      out.writeByte(0xff);
      out.writeByte(0xff);

      //---------------------------------
      // Image Descriptor

      out.writeString(',');
      out.writeShort(0);
      out.writeShort(0);
      out.writeShort(_width);
      out.writeShort(_height);
      out.writeByte(0);

      //---------------------------------
      // Local Color Map

      //---------------------------------
      // Raster Data

      var lzwMinCodeSize = 2;
      var raster = getLZWRaster(lzwMinCodeSize);

      out.writeByte(lzwMinCodeSize);

      var offset = 0;

      while (raster.length - offset > 255) {
        out.writeByte(255);
        out.writeBytes(raster, offset, 255);
        offset += 255;
      }

      out.writeByte(raster.length - offset);
      out.writeBytes(raster, offset, raster.length - offset);
      out.writeByte(0x00);

      //---------------------------------
      // GIF Terminator
      out.writeString(';');
    };

    var bitOutputStream = function(out) {

      var _out = out;
      var _bitLength = 0;
      var _bitBuffer = 0;

      var _this = {};

      _this.write = function(data, length) {

        if ( (data >>> length) != 0) {
          throw 'length over';
        }

        while (_bitLength + length >= 8) {
          _out.writeByte(0xff & ( (data << _bitLength) | _bitBuffer) );
          length -= (8 - _bitLength);
          data >>>= (8 - _bitLength);
          _bitBuffer = 0;
          _bitLength = 0;
        }

        _bitBuffer = (data << _bitLength) | _bitBuffer;
        _bitLength = _bitLength + length;
      };

      _this.flush = function() {
        if (_bitLength > 0) {
          _out.writeByte(_bitBuffer);
        }
      };

      return _this;
    };

    var getLZWRaster = function(lzwMinCodeSize) {

      var clearCode = 1 << lzwMinCodeSize;
      var endCode = (1 << lzwMinCodeSize) + 1;
      var bitLength = lzwMinCodeSize + 1;

      // Setup LZWTable
      var table = lzwTable();

      for (var i = 0; i < clearCode; i += 1) {
        table.add(String.fromCharCode(i) );
      }
      table.add(String.fromCharCode(clearCode) );
      table.add(String.fromCharCode(endCode) );

      var byteOut = byteArrayOutputStream();
      var bitOut = bitOutputStream(byteOut);

      // clear code
      bitOut.write(clearCode, bitLength);

      var dataIndex = 0;

      var s = String.fromCharCode(_data[dataIndex]);
      dataIndex += 1;

      while (dataIndex < _data.length) {

        var c = String.fromCharCode(_data[dataIndex]);
        dataIndex += 1;

        if (table.contains(s + c) ) {

          s = s + c;

        } else {

          bitOut.write(table.indexOf(s), bitLength);

          if (table.size() < 0xfff) {

            if (table.size() == (1 << bitLength) ) {
              bitLength += 1;
            }

            table.add(s + c);
          }

          s = c;
        }
      }

      bitOut.write(table.indexOf(s), bitLength);

      // end code
      bitOut.write(endCode, bitLength);

      bitOut.flush();

      return byteOut.toByteArray();
    };

    var lzwTable = function() {

      var _map = {};
      var _size = 0;

      var _this = {};

      _this.add = function(key) {
        if (_this.contains(key) ) {
          throw 'dup key:' + key;
        }
        _map[key] = _size;
        _size += 1;
      };

      _this.size = function() {
        return _size;
      };

      _this.indexOf = function(key) {
        return _map[key];
      };

      _this.contains = function(key) {
        return typeof _map[key] != 'undefined';
      };

      return _this;
    };

    return _this;
  };

  var createDataURL = function(width, height, getPixel) {
    var gif = gifImage(width, height);
    for (var y = 0; y < height; y += 1) {
      for (var x = 0; x < width; x += 1) {
        gif.setPixel(x, y, getPixel(x, y) );
      }
    }

    var b = byteArrayOutputStream();
    gif.write(b);

    var base64 = base64EncodeOutputStream();
    var bytes = b.toByteArray();
    for (var i = 0; i < bytes.length; i += 1) {
      base64.writeByte(bytes[i]);
    }
    base64.flush();

    return 'data:image/gif;base64,' + base64;
  };

  //---------------------------------------------------------------------
  // returns qrcode function.

  return qrcode;
}();

// multibyte support
!function() {

  qrcode.stringToBytesFuncs['UTF-8'] = function(s) {
    // http://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array
    function toUTF8Array(str) {
      var utf8 = [];
      for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
          utf8.push(0xc0 | (charcode >> 6),
              0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
          utf8.push(0xe0 | (charcode >> 12),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
          i++;
          // UTF-16 encodes 0x10000-0x10FFFF by
          // subtracting 0x10000 and splitting the
          // 20 bits of 0x0-0xFFFFF into two halves
          charcode = 0x10000 + (((charcode & 0x3ff)<<10)
            | (str.charCodeAt(i) & 0x3ff));
          utf8.push(0xf0 | (charcode >>18),
              0x80 | ((charcode>>12) & 0x3f),
              0x80 | ((charcode>>6) & 0x3f),
              0x80 | (charcode & 0x3f));
        }
      }
      return utf8;
    }
    return toUTF8Array(s);
  };

}();

(function (factory) {
  if (true) {
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(function () {
    return qrcode;
}));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY2xpZW50L2luZGV4LnRzIiwid2VicGFjazovLy8uL2xpYi9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWFxdWV0dGUvZGlzdC9tYXF1ZXR0ZS51bWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3FyY29kZS1nZW5lcmF0b3IvcXJjb2RlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbEZBLDRCQUE0Qjs7Ozs7Ozs7OztBQUU1QixxR0FBZ0U7QUFDaEUsc0dBQTJDO0FBQzNDLGdFQU9nQjtBQUdoQjs7Ozs7R0FLRztBQUVILElBQUksS0FBSyxHQUFVO0lBQ2pCLE1BQU0sRUFBRSxPQUFPO0lBQ2YsSUFBSSxFQUFFLFNBQVM7Q0FDUCxDQUFDO0FBRVg7Ozs7OztH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QUFFQSx5QkFBeUIsT0FBTzs7QUFFaEM7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxQkFBcUIscUJBQXFCOztBQUUxQztBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixxQkFBcUI7QUFDMUM7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHFCQUFxQixnQkFBZ0I7QUFDckMsdUJBQXVCLHFCQUFxQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCLGdCQUFnQjtBQUNyQyx1QkFBdUIscUJBQXFCO0FBQzVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBLHFCQUFxQixxQkFBcUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLHFCQUFxQjtBQUMxQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7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QUVBO0FBQ0E7O0FBRUE7QUFDQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0EsbUJBQW1CLFNBQVM7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixTQUFTO0FBQzVCO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQix5QkFBeUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLHFCQUFxQix1QkFBdUI7QUFDNUMsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSxxQkFBcUIsdUJBQXVCO0FBQzVDO0FBQ0E7O0FBRUEscUJBQXFCLG1CQUFtQjtBQUN4QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLHFCQUFxQixZQUFZOztBQUVqQztBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCLFdBQVc7QUFDbEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHFCQUFxQixZQUFZO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLGNBQWM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxxQkFBcUIsbUJBQW1CO0FBQ3hDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUJBQXFCLGNBQWM7QUFDbkM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsbUJBQW1CO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixZQUFZO0FBQ25DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsMEJBQTBCO0FBQzFCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxxQkFBcUIsZUFBZTtBQUNwQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLFNBQVM7O0FBRVQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CLFlBQVk7QUFDL0IscUJBQXFCLFdBQVc7QUFDaEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGdCQUFnQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLENBQUM7O0FBRUQ7QUFDQSxNQUFNLElBQTBDO0FBQ2hELE1BQU0saUNBQU8sRUFBRSxvQ0FBRSxPQUFPO0FBQUE7QUFBQTtBQUFBLG9HQUFDO0FBQ3pCLEdBQUcsTUFBTSxFQUVOO0FBQ0gsQ0FBQztBQUNEO0FBQ0EsQ0FBQyIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2NsaWVudC9pbmRleC50c1wiKTtcbiIsIi8vIENsaWVudCBzaWRlIGZ1bmN0aW9uYWxpdHlcblxuaW1wb3J0IHsgUHJvamVjdG9yLCBWTm9kZSwgY3JlYXRlUHJvamVjdG9yLCBoIH0gZnJvbSBcIm1hcXVldHRlXCI7XG5pbXBvcnQgKiBhcyBxcmNvZGUgZnJvbSBcInFyY29kZS1nZW5lcmF0b3JcIjtcbmltcG9ydCB7XG4gIFBheW1lbnRNZXRob2QsXG4gIFByb2R1Y3QsXG4gIE1lc3NhZ2UsXG4gIFNlbGVjdGlvbixcbiAgU2l6ZSxcbiAgT3JkZXJcbn0gZnJvbSBcIi4uL2xpYlwiO1xuaW1wb3J0IHsgQXBwLCBCbGFuaywgQ2hlY2tvdXQsIEV2ZW50VCwgUGFnZSwgU3RhdGUgfSBmcm9tIFwiLi9Nb2RlbFwiO1xuXG4vKiBJTklUIFxuICpcbiAqIFdlIHN0YXJ0IG9uIHRoZSB3ZWxjb21lIHBhZ2Ugd2l0aCBhbiBlbXB0eSBjYXJ0LCBlbXB0eSBjYXRhbG9nLCBhbmQgbm90aGluZyBcbiAqIHNlbGVjdGVkLlxuICpcbiAqL1xuXG5sZXQgc3RhdGU6IFN0YXRlID0ge1xuICBfX2N0b3I6IFwiQmxhbmtcIixcbiAgcGFnZTogXCJ3ZWxjb21lXCJcbn0gYXMgQmxhbms7XG5cbi8qIFdFQlNPQ0tFVCBcbiAqXG4gKiBDb21tdW5pY2F0aW9uIHdpdGggdGhlIHNlcnZlciBpcyBoYW5kbGVkIGJ5IGEgd2Vic29ja2V0LiAgV2hlbiB3ZSBjb25uZWN0LCBcbiAqIHRoZSBzZXJ2ZXIgc2VuZHMgdXMgdGhlIGN1cnJlbnQgY2F0YWxvZy4gIFdoZW4gd2Ugc2VuZCBhbiBvcmRlciwgdGhlIHNlcnZlciBcbiAqIHNlbmRzIGJhY2sgYSBjb25maXJtYXRpb24gd2l0aCB0aGUgb3JkZXIgaWQuXG4gKlxuICovXG5cbmNvbnN0IHdzOiBXZWJTb2NrZXQgPSBuZXcgV2ViU29ja2V0KFwid3M6Ly9sb2NhbGhvc3Q6ODA4MVwiKTtcbmNvbnN0IHByb2plY3RvcjogUHJvamVjdG9yID0gY3JlYXRlUHJvamVjdG9yKCk7XG5cbndzLmFkZEV2ZW50TGlzdGVuZXIoXCJtZXNzYWdlXCIsIChlOiBNZXNzYWdlRXZlbnQpID0+IHtcbiAgY29uc3QgbXNnID0gSlNPTi5wYXJzZShlLmRhdGEpIGFzIE1lc3NhZ2U7XG4gIHN3aXRjaCAobXNnLl9fY3Rvcikge1xuICAgIGNhc2UgXCJQYXltZW50RGV0YWlsc1wiOiB7XG4gICAgICBldmVudCh7XG4gICAgICAgIF9fY3RvcjogXCJQYXltZW50RGV0YWlsc1wiLFxuICAgICAgICBhZGRyZXNzOiBtc2cuYWRkcmVzcyxcbiAgICAgICAgYW1vdW50OiBtc2cuYW1vdW50XG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiUHJvZHVjdHNcIjoge1xuICAgICAgZXZlbnQoe1xuICAgICAgICBfX2N0b3I6IFwiTG9hZFwiLFxuICAgICAgICBwcm9kdWN0czogbmV3IE1hcChtc2cuZGF0YS5tYXAocCA9PiBbcC5pZCwgcF0gYXMgW3N0cmluZywgUHJvZHVjdF0pKVxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcIkNvbmZpcm1hdGlvblwiOiB7XG4gICAgICBldmVudCh7XG4gICAgICAgIF9fY3RvcjogXCJHb3RPcmRlcklkXCIsXG4gICAgICAgIG9yZGVySWQ6IG1zZy5vcmRlcklkXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbiAgcHJvamVjdG9yLnNjaGVkdWxlUmVuZGVyKCk7XG59KTtcblxuLyogU1RFUFBFUiBcbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHVwZGF0ZXMgdGhlIHByb2dyYW0gc3RhdGUgZm9yIGVhY2ggZXZlbnQuXG4gKlxuICovXG5mdW5jdGlvbiBzdGVwKGV2OiBFdmVudFQsIHMwOiBTdGF0ZSk6IFN0YXRlIHtcbiAgc3dpdGNoIChldi5fX2N0b3IpIHtcbiAgICBjYXNlIFwiQ2hlY2tvdXRcIjoge1xuICAgICAgY29uc29sZS5sb2coXCJDSEVDS09VVFwiKTtcbiAgICAgIHMwID0ge1xuICAgICAgICBfX2N0b3I6IFwiQ2hlY2tvdXRcIixcbiAgICAgICAgY2FydDogKHMwIGFzIEFwcCkuY2FydCxcbiAgICAgICAgcGFnZTogXCJjaGVja291dFwiLFxuICAgICAgICBwYXltZW50TWV0aG9kOiBQYXltZW50TWV0aG9kLkNyZWRpdCxcbiAgICAgICAgcHJvZHVjdHM6IChzMCBhcyBBcHApLnByb2R1Y3RzLFxuICAgICAgICBzdHJlZXRBZGRyZXNzOiBcIlwiXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJMb2FkXCI6IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiTE9BRFwiKTtcbiAgICAgIHMwID0ge1xuICAgICAgICBfX2N0b3I6IFwiU2hvcHBpbmdcIixcbiAgICAgICAgY2FydDogbmV3IE1hcCgpLFxuICAgICAgICBwYWdlOiBcInN0b3JlXCIsXG4gICAgICAgIHByb2R1Y3RzOiBldi5wcm9kdWN0cyxcbiAgICAgICAgc2VsZWN0aW9uczogbmV3IE1hcCgpXG4gICAgICB9O1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJDYXJ0QWRkXCI6IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ0FSVEFERFwiKTtcbiAgICAgIGlmIChzMC5fX2N0b3IgPT09IFwiU2hvcHBpbmdcIikge1xuICAgICAgICBjb25zdCBzZWwgPSBzMC5zZWxlY3Rpb25zLmdldChldi5wcm9kdWN0KSBhcyBTZWxlY3Rpb247XG4gICAgICAgIGNvbnN0IGNhcnRLZXkgPSBldi5wcm9kdWN0ICsgXCI6XCIgKyBzZWwuc2l6ZTtcbiAgICAgICAgaWYgKHMwLmNhcnQuaGFzKGNhcnRLZXkpKSB7XG4gICAgICAgICAgKHMwLmNhcnQuZ2V0KGNhcnRLZXkpIGFzIFNlbGVjdGlvbikucXVhbnRpdHkgKz0gc2VsLnF1YW50aXR5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHMwLmNhcnQuc2V0KGNhcnRLZXksIHsgLi4uc2VsIH0pO1xuICAgICAgICB9XG4gICAgICAgIHMwLnNlbGVjdGlvbnMuZGVsZXRlKGV2LnByb2R1Y3QpO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGNhc2UgXCJDb25maXJtT2tcIjoge1xuICAgICAgY29uc29sZS5sb2coXCJDT05GSVJNT0tcIik7XG4gICAgICBzMCA9IHtcbiAgICAgICAgX19jdG9yOiBcIlNob3BwaW5nXCIsXG4gICAgICAgIGNhcnQ6IG5ldyBNYXAoKSxcbiAgICAgICAgcGFnZTogXCJzdG9yZVwiLFxuICAgICAgICBwcm9kdWN0czogKHMwIGFzIEFwcCkucHJvZHVjdHMsXG4gICAgICAgIHNlbGVjdGlvbnM6IG5ldyBNYXAoKVxuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiR290b1wiOiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkdPVE9cIiwgZXYucGFnZSk7XG4gICAgICBzMC5wYWdlID0gZXYucGFnZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiR290T3JkZXJJZFwiOiB7XG4gICAgICBjb25zb2xlLmxvZyhcIkdPVE9SREVSSURcIik7XG4gICAgICBzMCA9IHtcbiAgICAgICAgX19jdG9yOiBcIk9yZGVyU3VtbWFyeVwiLFxuICAgICAgICBjYXJ0OiAoczAgYXMgQXBwKS5jYXJ0LFxuICAgICAgICBvcmRlcklkOiBldi5vcmRlcklkLFxuICAgICAgICBwYWdlOiBcImNvbmZpcm1hdGlvblwiLFxuICAgICAgICBwcm9kdWN0czogKHMwIGFzIEFwcCkucHJvZHVjdHNcbiAgICAgIH07XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcIlF1YW50aXR5Q2xpY2tcIjoge1xuICAgICAgY29uc29sZS5sb2coXCJRVUFOVElUWUNMSUNLXCIpO1xuICAgICAgaWYgKHMwLl9fY3RvciA9PT0gXCJTaG9wcGluZ1wiICYmIHMwLnNlbGVjdGlvbnMuaGFzKGV2LnByb2R1Y3QpKSB7XG4gICAgICAgIGNvbnN0IHNlbCA9IHMwLnNlbGVjdGlvbnMuZ2V0KGV2LnByb2R1Y3QpIGFzIFNlbGVjdGlvbjtcbiAgICAgICAgc3dpdGNoIChldi5hY3Rpb24pIHtcbiAgICAgICAgICBjYXNlIFwidXBcIjoge1xuICAgICAgICAgICAgc2VsLnF1YW50aXR5ICs9IDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FzZSBcImRvd25cIjoge1xuICAgICAgICAgICAgc2VsLnF1YW50aXR5ID0gTWF0aC5tYXgoMCwgc2VsLnF1YW50aXR5IC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcIlBheW1lbnREZXRhaWxzXCI6IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiUEFZTUVOVERFVEFJTFNcIik7XG4gICAgICBzMCA9IHtcbiAgICAgICAgX19jdG9yOiBcIkJpdGNvaW5QYXltZW50XCIsXG4gICAgICAgIGFtb3VudDogZXYuYW1vdW50LFxuICAgICAgICBiaXRjb2luQWRkcmVzczogZXYuYWRkcmVzcyxcbiAgICAgICAgY2FydDogKHMwIGFzIEFwcCkuY2FydCxcbiAgICAgICAgcGFnZTogXCJwYXltZW50XCIsXG4gICAgICAgIHByb2R1Y3RzOiAoczAgYXMgQXBwKS5wcm9kdWN0c1xuICAgICAgfTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiVXBkYXRlRGV0YWlsc1wiOiB7XG4gICAgICBjb25zb2xlLmxvZyhcIlVQREFURURFVEFJTFNcIik7XG4gICAgICBpZiAoczAuX19jdG9yID09IFwiQ2hlY2tvdXRcIikge1xuICAgICAgICBzMC5zdHJlZXRBZGRyZXNzID0gZXYuc3RyZWV0QWRkcmVzcztcbiAgICAgIH1cbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjYXNlIFwiU2l6ZUNsaWNrXCI6IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiU0laRUNMSUNLXCIpO1xuICAgICAgaWYgKHMwLl9fY3RvciA9PT0gXCJTaG9wcGluZ1wiKSB7XG4gICAgICAgIGlmICghczAuc2VsZWN0aW9ucy5oYXMoZXYucHJvZHVjdCkpIHtcbiAgICAgICAgICBzMC5zZWxlY3Rpb25zLnNldChldi5wcm9kdWN0LCB7XG4gICAgICAgICAgICBwcm9kdWN0OiBzMC5wcm9kdWN0cy5nZXQoZXYucHJvZHVjdCkgYXMgUHJvZHVjdCxcbiAgICAgICAgICAgIHF1YW50aXR5OiAxLFxuICAgICAgICAgICAgc2l6ZTogZXYuc2l6ZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIChzMC5zZWxlY3Rpb25zLmdldChldi5wcm9kdWN0KSBhcyBTZWxlY3Rpb24pLnNpemUgPSBldi5zaXplO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgY2FzZSBcIlN1Ym1pdE9yZGVyXCI6IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiU1VCTUlUT1JERVJcIik7XG4gICAgICBjb25zdCBzcyA9IEFycmF5LmZyb20oKHMwIGFzIENoZWNrb3V0KS5jYXJ0LnZhbHVlcygpKSBhcyBTZWxlY3Rpb25bXTtcbiAgICAgIGNvbnN0IG9yZGVyOiBPcmRlciA9IHtcbiAgICAgICAgX19jdG9yOiBcIk9yZGVyXCIsXG4gICAgICAgIHBheW1lbnRNZXRob2Q6IGV2LnBheW1lbnRNZXRob2QsXG4gICAgICAgIHNlbGVjdGlvbnM6IHNzLFxuICAgICAgICBzdHJlZXRBZGRyZXNzOiAoczAgYXMgQ2hlY2tvdXQpLnN0cmVldEFkZHJlc3NcbiAgICAgIH07XG4gICAgICB3cy5zZW5kKEpTT04uc3RyaW5naWZ5KG9yZGVyKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzMDtcbn1cblxuZnVuY3Rpb24gZXZlbnQoZXY6IEV2ZW50VCk6IHZvaWQge1xuICBzdGF0ZSA9IHN0ZXAoZXYsIHN0YXRlKTtcbiAgcHJvamVjdG9yLnNjaGVkdWxlUmVuZGVyKCk7XG59XG5cbi8qIFZJRVdTICovXG5cbmZ1bmN0aW9uIHJlbmRlcigpOiBWTm9kZSB7XG4gIHN3aXRjaCAoc3RhdGUucGFnZSkge1xuICAgIGNhc2UgXCJ3ZWxjb21lXCI6IHtcbiAgICAgIHJldHVybiB3ZWxjb21lKCk7XG4gICAgfVxuICAgIGNhc2UgXCJzdG9yZVwiOiB7XG4gICAgICByZXR1cm4gc3RvcmUoKTtcbiAgICB9XG4gICAgY2FzZSBcImNhcnRcIjoge1xuICAgICAgcmV0dXJuIGNhcnQoKTtcbiAgICB9XG4gICAgY2FzZSBcInBheW1lbnRcIjoge1xuICAgICAgcmV0dXJuIHBheW1lbnQoKTtcbiAgICB9XG4gICAgY2FzZSBcImNoZWNrb3V0XCI6IHtcbiAgICAgIHJldHVybiBjaGVja291dCgpO1xuICAgIH1cbiAgICBjYXNlIFwiY29uZmlybWF0aW9uXCI6IHtcbiAgICAgIHJldHVybiBjb25maXJtYXRpb24oKTtcbiAgICB9XG4gIH1cbn1cblxuLy8gV2VsY29tZSFcbmZ1bmN0aW9uIHdlbGNvbWUoKTogVk5vZGUge1xuICByZXR1cm4gaChcImRpdi5jb250YWluZXJcIiwgW1xuICAgIFwiV2VsY29tZSB0byB0aGUgQml0Y29pbiAmIE9wZW4gQmxvY2tjaGFpbiBtZWV0dXAgc3RvcmUhXCJcbiAgXSk7XG59XG5cbi8vIFQtc2hpcnQgc3RvcmVcbmZ1bmN0aW9uIHN0b3JlKCk6IFZOb2RlIHtcbiAgY29uc3QgcHMgPSBbXSBhcyBWTm9kZVtdO1xuICBpZiAoc3RhdGUuX19jdG9yID09PSBcIlNob3BwaW5nXCIpIHtcbiAgICBjb25zdCBzZWxzID0gc3RhdGUuc2VsZWN0aW9ucztcbiAgICBzdGF0ZS5wcm9kdWN0cy5mb3JFYWNoKHAgPT4ge1xuICAgICAgcHMucHVzaChyZW5kZXJQcm9kdWN0KHAsIHNlbHMpKTtcbiAgICB9KTtcbiAgICBsZXQgY2FydFNpemUgPSAwO1xuICAgIHN0YXRlLmNhcnQuZm9yRWFjaChzID0+IChjYXJ0U2l6ZSArPSBzLnF1YW50aXR5KSk7XG4gICAgcmV0dXJuIGgoXCJkaXYuY29udGFpbmVyXCIsIFtcbiAgICAgIGgoXCJkaXYucm93XCIsIHsga2V5OiAxIH0sIFtoKFwiaDFcIiwgW1wiQml0Y29pbiAmIE9wZW4gQmxvY2tjaGFpbiBTdG9yZVwiXSldKSxcbiAgICAgIGgoXCJkaXYucm93Lm5hdlwiLCB7IGtleTogMiB9LCBbXG4gICAgICAgIGgoXCJkaXYuY29sXCIsIHsga2V5OiAxLCBvbmNsaWNrOiBnb3RvUGFnZShcImNhcnRcIikgfSwgW1xuICAgICAgICAgIGBWaWV3IGNhcnQgKCR7Y2FydFNpemV9KWBcbiAgICAgICAgXSlcbiAgICAgIF0pLFxuICAgICAgaChcImRpdi5yb3dcIiwgeyBrZXk6IDMgfSwgcHMpXG4gICAgXSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGVycm9yKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVuZGVyUHJvZHVjdChwOiBQcm9kdWN0LCBzZWxlY3Rpb25zOiBNYXA8c3RyaW5nLCBTZWxlY3Rpb24+KTogVk5vZGUge1xuICBjb25zdCBmID0gKGV2OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgZXZlbnQoe1xuICAgICAgX19jdG9yOiBcIkNhcnRBZGRcIixcbiAgICAgIHByb2R1Y3Q6IHAuaWRcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgY2hpbGRyZW4gPSBbXG4gICAgaChcImRpdi5yb3dcIiwgeyBrZXk6IFwiY2FwdGlvblwiIH0sIFtwLmNhcHRpb25dKSwgLy8gY2FwdGlvblxuICAgIGgoXCJkaXYucm93XCIsIHsga2V5OiBcImltYWdlXCIgfSwgW2goXCJpbWdcIiwgeyBzcmM6IGAke3AuaWR9LnN2Z2AgfSldKSwgLy8gaW1hZ2VcbiAgICBoKFwiZGl2LnJvd1wiLCB7IGtleTogXCJwcmljZVwiIH0sIFtcIiRcIiArIGRvbGxhcnMocC5wcmljZSkudG9TdHJpbmcoKV0pLCAvLyBwcmljZVxuICAgIHNpemVzKHAuaWQsIHNlbGVjdGlvbnMpLCAvLyBzaXplc1xuICAgIHF1YW50aXR5KHAuaWQsIHNlbGVjdGlvbnMpIC8vIHF1YW50aXR5XG4gIF07XG4gIGlmIChzZWxlY3Rpb25Db21wbGV0ZShwLmlkLCBzZWxlY3Rpb25zKSkge1xuICAgIGNoaWxkcmVuLnB1c2goaChcImRpdi5yb3dcIiwgeyBrZXk6IFwiYWRkXCIsIG9uY2xpY2s6IGYgfSwgW1wiQWRkIHRvIGNhcnRcIl0pKTtcbiAgfVxuICByZXR1cm4gaChcImRpdi5wcm9kdWN0XCIsIHsga2V5OiBwLmlkIH0sIFtoKFwiZGl2LmNvbnRhaW5lclwiLCBjaGlsZHJlbildKTtcbn1cblxuLy8gU2ltcGxlIHNpemUgc2VsZWN0b3JcbmZ1bmN0aW9uIHNpemVzKHBpZDogc3RyaW5nLCBzZWxlY3Rpb25zOiBNYXA8c3RyaW5nLCBTZWxlY3Rpb24+KTogVk5vZGUge1xuICBmdW5jdGlvbiBmKHM6IFNpemUpOiAoZTogTW91c2VFdmVudCkgPT4gdm9pZCB7XG4gICAgcmV0dXJuIGUgPT4ge1xuICAgICAgZXZlbnQoe1xuICAgICAgICBfX2N0b3I6IFwiU2l6ZUNsaWNrXCIsXG4gICAgICAgIHByb2R1Y3Q6IHBpZCxcbiAgICAgICAgc2l6ZTogc1xuICAgICAgfSk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gaChcbiAgICBcImRpdi5yb3dcIixcbiAgICB7IGtleTogXCJzaXplc1wiIH0sXG4gICAgKFtcIlNcIiwgXCJNXCIsIFwiTFwiXSBhcyBTaXplW10pLm1hcChzID0+IHtcbiAgICAgIGNvbnN0IGlzU2VsZWN0ZWQgPVxuICAgICAgICBzZWxlY3Rpb25zLmhhcyhwaWQpICYmIChzZWxlY3Rpb25zLmdldChwaWQpIGFzIFNlbGVjdGlvbikuc2l6ZSA9PT0gcztcbiAgICAgIHJldHVybiBoKFxuICAgICAgICBcImRpdi5jb2wtc21cIixcbiAgICAgICAgeyBrZXk6IHMsIG9uY2xpY2s6IGYocyksIGNsYXNzZXM6IHsgc2VsZWN0ZWQ6IGlzU2VsZWN0ZWQgfSB9LFxuICAgICAgICBbc11cbiAgICAgICk7XG4gICAgfSlcbiAgKTtcbn1cblxuLy8gU2ltcGxlIHF1YW50aXR5IHVwZGF0ZXI6IFwiKC0pIHEgKCspXCJcbmZ1bmN0aW9uIHF1YW50aXR5KHBpZDogc3RyaW5nLCBzZWxlY3Rpb25zOiBNYXA8c3RyaW5nLCBTZWxlY3Rpb24+KTogVk5vZGUge1xuICBjb25zdCB1cCA9IChldjogTW91c2VFdmVudCkgPT4ge1xuICAgIGV2ZW50KHtcbiAgICAgIF9fY3RvcjogXCJRdWFudGl0eUNsaWNrXCIsXG4gICAgICBwcm9kdWN0OiBwaWQsXG4gICAgICBhY3Rpb246IFwidXBcIlxuICAgIH0pO1xuICB9O1xuICBjb25zdCBkb3duID0gKGV2OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgZXZlbnQoe1xuICAgICAgX19jdG9yOiBcIlF1YW50aXR5Q2xpY2tcIixcbiAgICAgIHByb2R1Y3Q6IHBpZCxcbiAgICAgIGFjdGlvbjogXCJkb3duXCJcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgcSA9IHNlbGVjdGlvbnMuaGFzKHBpZClcbiAgICA/IChzZWxlY3Rpb25zLmdldChwaWQpIGFzIFNlbGVjdGlvbikucXVhbnRpdHlcbiAgICA6IDA7XG4gIHJldHVybiBoKFwiZGl2LnJvd1wiLCB7IGtleTogXCJxdWFudGl0eVwiIH0sIFtcbiAgICBoKFwiZGl2LmNvbC1zbVwiLCB7IGtleTogMSwgb25jbGljazogZG93biB9LCBbXCIoLSlcIl0pLFxuICAgIGgoXCJkaXYuY29sLXNtXCIsIHsga2V5OiAyIH0sIFtxLnRvU3RyaW5nKCldKSxcbiAgICBoKFwiZGl2LmNvbC1zbVwiLCB7IGtleTogMywgb25jbGljazogdXAgfSwgW1wiKCspXCJdKVxuICBdKTtcbn1cblxuLy8gU2hvcHBpbmcgY2FydFxuZnVuY3Rpb24gY2FydCgpOiBWTm9kZSB7XG4gIGlmIChzdGF0ZS5fX2N0b3IgPT09IFwiU2hvcHBpbmdcIikge1xuICAgIGxldCB0b3RhbCA9IDA7XG4gICAgY29uc3Qgcm93cyA9IFtdIGFzIFZOb2RlW107XG4gICAgc3RhdGUuY2FydC5mb3JFYWNoKHMgPT4ge1xuICAgICAgdG90YWwgKz0gcy5xdWFudGl0eSAqIHMucHJvZHVjdC5wcmljZTtcbiAgICAgIHJvd3MucHVzaChcbiAgICAgICAgaChcImRpdi5yb3dcIiwgeyBrZXk6IHMucHJvZHVjdC5pZCB9LCBbXG4gICAgICAgICAgY29scyhbXG4gICAgICAgICAgICBzLnByb2R1Y3QuY2FwdGlvbixcbiAgICAgICAgICAgIHMuc2l6ZSBhcyBzdHJpbmcsXG4gICAgICAgICAgICBzLnF1YW50aXR5LnRvU3RyaW5nKCksXG4gICAgICAgICAgICBkb2xsYXJzKHMucXVhbnRpdHkgKiBzLnByb2R1Y3QucHJpY2UpLnRvU3RyaW5nKClcbiAgICAgICAgICBdKVxuICAgICAgICBdKVxuICAgICAgKTtcbiAgICB9KTtcbiAgICBjb25zdCBpdGVtcyA9IFtcbiAgICAgIGgoXCJkaXYucm93XCIsIHsga2V5OiAxIH0sIFtoKFwiaDFcIiwgW1wiU2hvcHBpbmcgY2FydFwiXSldKSxcbiAgICAgIGgoXCJkaXYucm93XCIsIHsga2V5OiAyIH0sIGNvbHMoW1wiRGVzY1wiLCBcIlNpemVcIiwgXCJRdWFudGl0eVwiLCBcIlByaWNlXCJdKSksXG4gICAgICByb3dzLmxlbmd0aCA+IDAgPyByb3dzIDogXCJObyBpdGVtc1wiLFxuICAgICAgaChcImRpdi5yb3dcIiwgeyBrZXk6IDMgfSwgW1wiVG90YWw6ICRcIiArIGRvbGxhcnModG90YWwpLnRvU3RyaW5nKCldKSxcbiAgICAgIGgoXCJkaXYucm93XCIsIHsga2V5OiA0LCBvbmNsaWNrOiBnb3RvUGFnZShcInN0b3JlXCIpIH0sIFtcbiAgICAgICAgXCJDb250aW51ZSBzaG9wcGluZ1wiXG4gICAgICBdKVxuICAgIF07XG4gICAgY29uc3QgY2hlY2tvdXROb3cgPSAoKSA9PlxuICAgICAgZXZlbnQoe1xuICAgICAgICBfX2N0b3I6IFwiQ2hlY2tvdXRcIlxuICAgICAgfSk7XG4gICAgaWYgKHN0YXRlLmNhcnQuc2l6ZSA+IDApIHtcbiAgICAgIGl0ZW1zLnB1c2goaChcImRpdi5yb3dcIiwgeyBrZXk6IDUsIG9uY2xpY2s6IGNoZWNrb3V0Tm93IH0sIFtcIkNoZWNrb3V0XCJdKSk7XG4gICAgfVxuICAgIHJldHVybiBoKFwiZGl2LmNvbnRhaW5lclwiLCBpdGVtcyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGVycm9yKCk7XG4gIH1cbn1cblxuLy8gR2F0aGVyIHVzZXIgZGV0YWlsc1xuZnVuY3Rpb24gY2hlY2tvdXQoKTogVk5vZGUge1xuICBjb25zdCBjYXJkID0gKCkgPT5cbiAgICBldmVudCh7XG4gICAgICBfX2N0b3I6IFwiU3VibWl0T3JkZXJcIixcbiAgICAgIHBheW1lbnRNZXRob2Q6IFBheW1lbnRNZXRob2QuQ3JlZGl0XG4gICAgfSk7XG4gIGNvbnN0IGJpdGNvaW4gPSAoKSA9PlxuICAgIGV2ZW50KHtcbiAgICAgIF9fY3RvcjogXCJTdWJtaXRPcmRlclwiLFxuICAgICAgcGF5bWVudE1ldGhvZDogUGF5bWVudE1ldGhvZC5CaXRjb2luXG4gICAgfSk7XG4gIGNvbnN0IGYgPSAoZTogTW91c2VFdmVudCkgPT5cbiAgICBldmVudCh7XG4gICAgICBfX2N0b3I6IFwiVXBkYXRlRGV0YWlsc1wiLFxuICAgICAgc3RyZWV0QWRkcmVzczogKGUudGFyZ2V0IGFzIGFueSkudmFsdWVcbiAgICB9KTtcbiAgcmV0dXJuIGgoXCJkaXYuY29udGFpbmVyXCIsIFtcbiAgICBoKFwiZGl2LnJvd1wiLCB7IGtleTogMSB9LCBbaChcImgxXCIsIFtcIlNoaXBwaW5nIGFkZHJlc3NcIl0pXSksXG4gICAgaChcImRpdi5yb3dcIiwgeyBrZXk6IDIgfSwgW2goXCJpbnB1dFwiLCB7IG9uaW5wdXQ6IGYgfSwgW10pXSksXG4gICAgaChcImRpdi5yb3dcIiwgeyBrZXk6IDMsIG9uY2xpY2s6IGNhcmQgfSwgW1wiUGF5IHdpdGggY2FyZFwiXSksXG4gICAgaChcImRpdi5yb3dcIiwgeyBrZXk6IDQsIG9uY2xpY2s6IGJpdGNvaW4gfSwgW1wiUGF5IHdpdGggYml0Y29pblwiXSlcbiAgXSk7XG59XG5cbi8vIEJUQyBwYXltZW50IHBhZ2VcbmZ1bmN0aW9uIHBheW1lbnQoKTogVk5vZGUge1xuICBpZiAoc3RhdGUuX19jdG9yID09PSBcIkJpdGNvaW5QYXltZW50XCIpIHtcbiAgICBjb25zdCBiaXRjb2luVVJJID0gYGJpdGNvaW46JHtcbiAgICAgIHN0YXRlLmJpdGNvaW5BZGRyZXNzXG4gICAgfT9hbW91bnQ9JHtzdGF0ZS5hbW91bnQudG9TdHJpbmcoKX0mbWVzc2FnZT1CT0JDaGljYWdvYDtcbiAgICBjb25zdCBxciA9IHFyY29kZSgwLCBcIkhcIik7XG4gICAgcXIuYWRkRGF0YShiaXRjb2luVVJJKTtcbiAgICBxci5tYWtlKCk7XG4gICAgcmV0dXJuIGgoXCJkaXYuY29udGFpbmVyXCIsIFtcbiAgICAgIGgoXCJkaXYucm93XCIsIHsga2V5OiAxIH0sIFtcbiAgICAgICAgYFBsZWFzZSBzZW5kICR7c3RhdGUuYW1vdW50LnRvU3RyaW5nKCl9IEJUQyB0byAke1xuICAgICAgICAgIHN0YXRlLmJpdGNvaW5BZGRyZXNzXG4gICAgICAgIH0gdG8gY29tcGxldGUgeW91ciBvcmRlci5gXG4gICAgICBdKSxcbiAgICAgIGgoXCJkaXYucm93XCIsIHsga2V5OiAyLCBpbm5lckhUTUw6IHFyLmNyZWF0ZUltZ1RhZyg1KS50b1N0cmluZygpIH0sIFtdKSxcbiAgICAgIGgoXCJkaXYucm93XCIsIHsga2V5OiAzIH0sIFtoKFwiYVwiLCB7IGhyZWY6IGJpdGNvaW5VUkkgfSwgW2JpdGNvaW5VUkldKV0pXG4gICAgXSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGVycm9yKCk7XG4gIH1cbn1cblxuLy8gQ29uZmlybWF0aW9uXG5mdW5jdGlvbiBjb25maXJtYXRpb24oKTogVk5vZGUge1xuICBjb25zdCBmID0gKGV2OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgZXZlbnQoe1xuICAgICAgX19jdG9yOiBcIkNvbmZpcm1Pa1wiXG4gICAgfSk7XG4gIH07XG4gIGlmIChzdGF0ZS5fX2N0b3IgPT09IFwiT3JkZXJTdW1tYXJ5XCIpIHtcbiAgICBjb25zdCByb3dzID0gW10gYXMgVk5vZGVbXTtcbiAgICBzdGF0ZS5jYXJ0LmZvckVhY2gocyA9PlxuICAgICAgcm93cy5wdXNoKFxuICAgICAgICBoKFxuICAgICAgICAgIFwiZGl2LnJvd1wiLFxuICAgICAgICAgIHsga2V5OiBzLnByb2R1Y3QuaWQgfSxcbiAgICAgICAgICBjb2xzKFtzLnByb2R1Y3QuY2FwdGlvbiwgcy5zaXplIGFzIHN0cmluZywgcy5xdWFudGl0eS50b1N0cmluZygpXSlcbiAgICAgICAgKVxuICAgICAgKVxuICAgICk7XG4gICAgcmV0dXJuIGgoXCJkaXYuY29udGFpbmVyXCIsIFtcbiAgICAgIGgoXCJkaXYucm93XCIsIHsga2V5OiAxIH0sIFtcIlN1Y2Nlc3MhXCJdKSxcbiAgICAgIGgoXCJkaXYucm93XCIsIHsga2V5OiAyIH0sIFtgWW91ciBvcmRlciBpZCBpcyAke3N0YXRlLm9yZGVySWR9YF0pLFxuICAgICAgcm93cyxcbiAgICAgIGgoXCJkaXYucm93XCIsIHsga2V5OiAzIH0sIFtoKFwiZGl2LmJ1dHRvblwiLCB7IG9uY2xpY2s6IGYgfSwgW1wiT0tcIl0pXSlcbiAgICBdKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZXJyb3IoKTtcbiAgfVxufVxuXG4vLyBFcnJvcnNcbmZ1bmN0aW9uIGVycm9yKCk6IFZOb2RlIHtcbiAgcmV0dXJuIGgoXCJkaXYuY29udGFpbmVyXCIsIGgoXCJoMS5lcnJcIiwgW1wiVGhlcmUgaXMgYSBwcm9ibGVtLlwiXSkpO1xufVxuXG4vKiBIRUxQRVJTICovXG5cbmZ1bmN0aW9uIGNvbHMoeHM6IHN0cmluZ1tdKTogVk5vZGVbXSB7XG4gIHJldHVybiB4cy5tYXAoeCA9PiBoKFwiZGl2LmNvbC1zbVwiLCB7IGtleTogeC50b1N0cmluZygpIH0sIFt4XSkpO1xufVxuXG5mdW5jdGlvbiBkb2xsYXJzKGNzOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gY3MgLyAxMDA7XG59XG5mdW5jdGlvbiBnb3RvUGFnZShwOiBQYWdlKTogKGV2OiBNb3VzZUV2ZW50KSA9PiB2b2lkIHtcbiAgY29uc3QgZiA9IChldjogTW91c2VFdmVudCkgPT4ge1xuICAgIGV2ZW50KHtcbiAgICAgIF9fY3RvcjogXCJHb3RvXCIsXG4gICAgICBwYWdlOiBwXG4gICAgfSk7XG4gIH07XG4gIHJldHVybiBmO1xufVxuXG5mdW5jdGlvbiBzZWxlY3Rpb25Db21wbGV0ZShwaWQ6IHN0cmluZywgc3M6IE1hcDxzdHJpbmcsIFNlbGVjdGlvbj4pOiBib29sZWFuIHtcbiAgaWYgKHNzLmhhcyhwaWQpKSB7XG4gICAgY29uc3Qgc2VsID0gc3MuZ2V0KHBpZCkgYXMgU2VsZWN0aW9uO1xuICAgIHJldHVybiBzZWwuc2l6ZSAhPT0gbnVsbCAmJiBzZWwucXVhbnRpdHkgPiAwO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLy8gR08hXG5wcm9qZWN0b3IuYXBwZW5kKGRvY3VtZW50LmJvZHksIHJlbmRlcik7XG4iLCIvKiBEQVRBIE1PREVMICovXG5cbmV4cG9ydCB0eXBlIFNpemUgPSBcIlNcIiB8IFwiTVwiIHwgXCJMXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2VsZWN0aW9uIHtcbiAgcHJvZHVjdDogUHJvZHVjdDtcbiAgcXVhbnRpdHk6IG51bWJlcjtcbiAgc2l6ZTogU2l6ZTtcbn1cblxuZXhwb3J0IHR5cGUgTWVzc2FnZSA9IENvbmZpcm1hdGlvbiB8IE9yZGVyIHwgUGF5bWVudERldGFpbHMgfCBQcm9kdWN0cztcblxuZXhwb3J0IGludGVyZmFjZSBDb25maXJtYXRpb24ge1xuICBfX2N0b3I6IFwiQ29uZmlybWF0aW9uXCI7XG4gIG9yZGVySWQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQYXltZW50RGV0YWlscyB7XG4gIF9fY3RvcjogXCJQYXltZW50RGV0YWlsc1wiO1xuICBhZGRyZXNzOiBzdHJpbmc7XG4gIGFtb3VudDogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFByb2R1Y3RzIHtcbiAgX19jdG9yOiBcIlByb2R1Y3RzXCI7XG4gIGRhdGE6IFByb2R1Y3RbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQcm9kdWN0IHtcbiAgaWQ6IHN0cmluZztcbiAgY2FwdGlvbjogc3RyaW5nO1xuICBwcmljZTogbnVtYmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE9yZGVyIHtcbiAgX19jdG9yOiBcIk9yZGVyXCI7XG4gIHBheW1lbnRNZXRob2Q6IFBheW1lbnRNZXRob2Q7XG4gIHNlbGVjdGlvbnM6IFNlbGVjdGlvbltdO1xuICBzdHJlZXRBZGRyZXNzOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlybWF0aW9uIHtcbiAgX19jdG9yOiBcIkNvbmZpcm1hdGlvblwiO1xuICBvcmRlcklkOiBzdHJpbmc7XG59XG5cbi8qIENPTlNUQU5UUyAqL1xuXG5leHBvcnQgZW51bSBQYXltZW50TWV0aG9kIHtcbiAgQ3JlZGl0LFxuICBCaXRjb2luXG59XG5cbmV4cG9ydCBlbnVtIFN0YXR1cyB7XG4gIFJlY2VpdmVkLFxuICBQYWlkLFxuICBQcm9jZXNzaW5nLFxuICBTaGlwcGVkLFxuICBDb25maXJtaW5nXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaXplSW5kZXgoczogU2l6ZSk6IG51bWJlciB7XG4gIHN3aXRjaCAocykge1xuICAgIGNhc2UgXCJTXCI6XG4gICAgICByZXR1cm4gMDtcbiAgICBjYXNlIFwiTVwiOlxuICAgICAgcmV0dXJuIDE7XG4gICAgY2FzZSBcIkxcIjpcbiAgICAgIHJldHVybiAyO1xuICB9XG59XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICAgIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICAgIChnbG9iYWwgPSBnbG9iYWwgfHwgc2VsZiwgZmFjdG9yeShnbG9iYWwubWFxdWV0dGUgPSB7fSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZSBuby1odHRwLXN0cmluZyAqL1xyXG4gICAgdmFyIE5BTUVTUEFDRV9XMyA9ICdodHRwOi8vd3d3LnczLm9yZy8nO1xyXG4gICAgLyogdHNsaW50OmVuYWJsZSBuby1odHRwLXN0cmluZyAqL1xyXG4gICAgdmFyIE5BTUVTUEFDRV9TVkcgPSBOQU1FU1BBQ0VfVzMgKyBcIjIwMDAvc3ZnXCI7XHJcbiAgICB2YXIgTkFNRVNQQUNFX1hMSU5LID0gTkFNRVNQQUNFX1czICsgXCIxOTk5L3hsaW5rXCI7XHJcbiAgICB2YXIgZW1wdHlBcnJheSA9IFtdO1xyXG4gICAgdmFyIGV4dGVuZCA9IGZ1bmN0aW9uIChiYXNlLCBvdmVycmlkZXMpIHtcclxuICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgT2JqZWN0LmtleXMoYmFzZSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJlc3VsdFtrZXldID0gYmFzZVtrZXldO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGlmIChvdmVycmlkZXMpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMob3ZlcnJpZGVzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gb3ZlcnJpZGVzW2tleV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfTtcclxuICAgIHZhciBzYW1lID0gZnVuY3Rpb24gKHZub2RlMSwgdm5vZGUyKSB7XHJcbiAgICAgICAgaWYgKHZub2RlMS52bm9kZVNlbGVjdG9yICE9PSB2bm9kZTIudm5vZGVTZWxlY3Rvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2bm9kZTEucHJvcGVydGllcyAmJiB2bm9kZTIucHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBpZiAodm5vZGUxLnByb3BlcnRpZXMua2V5ICE9PSB2bm9kZTIucHJvcGVydGllcy5rZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdm5vZGUxLnByb3BlcnRpZXMuYmluZCA9PT0gdm5vZGUyLnByb3BlcnRpZXMuYmluZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICF2bm9kZTEucHJvcGVydGllcyAmJiAhdm5vZGUyLnByb3BlcnRpZXM7XHJcbiAgICB9O1xyXG4gICAgdmFyIGNoZWNrU3R5bGVWYWx1ZSA9IGZ1bmN0aW9uIChzdHlsZVZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBzdHlsZVZhbHVlICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0eWxlIHZhbHVlcyBtdXN0IGJlIHN0cmluZ3MnKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmFyIGZpbmRJbmRleE9mQ2hpbGQgPSBmdW5jdGlvbiAoY2hpbGRyZW4sIHNhbWVBcywgc3RhcnQpIHtcclxuICAgICAgICBpZiAoc2FtZUFzLnZub2RlU2VsZWN0b3IgIT09ICcnKSB7XHJcbiAgICAgICAgICAgIC8vIE5ldmVyIHNjYW4gZm9yIHRleHQtbm9kZXNcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChzYW1lKGNoaWxkcmVuW2ldLCBzYW1lQXMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfTtcclxuICAgIHZhciBjaGVja0Rpc3Rpbmd1aXNoYWJsZSA9IGZ1bmN0aW9uIChjaGlsZE5vZGVzLCBpbmRleFRvQ2hlY2ssIHBhcmVudFZOb2RlLCBvcGVyYXRpb24pIHtcclxuICAgICAgICB2YXIgY2hpbGROb2RlID0gY2hpbGROb2Rlc1tpbmRleFRvQ2hlY2tdO1xyXG4gICAgICAgIGlmIChjaGlsZE5vZGUudm5vZGVTZWxlY3RvciA9PT0gJycpIHtcclxuICAgICAgICAgICAgcmV0dXJuOyAvLyBUZXh0IG5vZGVzIG5lZWQgbm90IGJlIGRpc3Rpbmd1aXNoYWJsZVxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgcHJvcGVydGllcyA9IGNoaWxkTm9kZS5wcm9wZXJ0aWVzO1xyXG4gICAgICAgIHZhciBrZXkgPSBwcm9wZXJ0aWVzID8gKHByb3BlcnRpZXMua2V5ID09PSB1bmRlZmluZWQgPyBwcm9wZXJ0aWVzLmJpbmQgOiBwcm9wZXJ0aWVzLmtleSkgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgaWYgKCFrZXkpIHsgLy8gQSBrZXkgaXMganVzdCBhc3N1bWVkIHRvIGJlIHVuaXF1ZVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpICE9PSBpbmRleFRvQ2hlY2spIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbm9kZSA9IGNoaWxkTm9kZXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNhbWUobm9kZSwgY2hpbGROb2RlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocGFyZW50Vk5vZGUudm5vZGVTZWxlY3RvciArIFwiIGhhZCBhIFwiICsgY2hpbGROb2RlLnZub2RlU2VsZWN0b3IgKyBcIiBjaGlsZCBcIiArIChvcGVyYXRpb24gPT09ICdhZGRlZCcgPyBvcGVyYXRpb24gOiAncmVtb3ZlZCcpICsgXCIsIGJ1dCB0aGVyZSBpcyBub3cgbW9yZSB0aGFuIG9uZS4gWW91IG11c3QgYWRkIHVuaXF1ZSBrZXkgcHJvcGVydGllcyB0byBtYWtlIHRoZW0gZGlzdGluZ3Vpc2hhYmxlLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmFyIG5vZGVBZGRlZCA9IGZ1bmN0aW9uICh2Tm9kZSkge1xyXG4gICAgICAgIGlmICh2Tm9kZS5wcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgIHZhciBlbnRlckFuaW1hdGlvbiA9IHZOb2RlLnByb3BlcnRpZXMuZW50ZXJBbmltYXRpb247XHJcbiAgICAgICAgICAgIGlmIChlbnRlckFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICAgICAgZW50ZXJBbmltYXRpb24odk5vZGUuZG9tTm9kZSwgdk5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmFyIHJlbW92ZWROb2RlcyA9IFtdO1xyXG4gICAgdmFyIHJlcXVlc3RlZElkbGVDYWxsYmFjayA9IGZhbHNlO1xyXG4gICAgdmFyIHZpc2l0UmVtb3ZlZE5vZGUgPSBmdW5jdGlvbiAobm9kZSkge1xyXG4gICAgICAgIChub2RlLmNoaWxkcmVuIHx8IFtdKS5mb3JFYWNoKHZpc2l0UmVtb3ZlZE5vZGUpO1xyXG4gICAgICAgIGlmIChub2RlLnByb3BlcnRpZXMgJiYgbm9kZS5wcm9wZXJ0aWVzLmFmdGVyUmVtb3ZlZCkge1xyXG4gICAgICAgICAgICBub2RlLnByb3BlcnRpZXMuYWZ0ZXJSZW1vdmVkLmFwcGx5KG5vZGUucHJvcGVydGllcy5iaW5kIHx8IG5vZGUucHJvcGVydGllcywgW25vZGUuZG9tTm9kZV0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB2YXIgcHJvY2Vzc1BlbmRpbmdOb2RlUmVtb3ZhbHMgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmVxdWVzdGVkSWRsZUNhbGxiYWNrID0gZmFsc2U7XHJcbiAgICAgICAgcmVtb3ZlZE5vZGVzLmZvckVhY2godmlzaXRSZW1vdmVkTm9kZSk7XHJcbiAgICAgICAgcmVtb3ZlZE5vZGVzLmxlbmd0aCA9IDA7XHJcbiAgICB9O1xyXG4gICAgdmFyIHNjaGVkdWxlTm9kZVJlbW92YWwgPSBmdW5jdGlvbiAodk5vZGUpIHtcclxuICAgICAgICByZW1vdmVkTm9kZXMucHVzaCh2Tm9kZSk7XHJcbiAgICAgICAgaWYgKCFyZXF1ZXN0ZWRJZGxlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgcmVxdWVzdGVkSWRsZUNhbGxiYWNrID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmICdyZXF1ZXN0SWRsZUNhbGxiYWNrJyBpbiB3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrKHByb2Nlc3NQZW5kaW5nTm9kZVJlbW92YWxzLCB7IHRpbWVvdXQ6IDE2IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChwcm9jZXNzUGVuZGluZ05vZGVSZW1vdmFscywgMTYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBub2RlVG9SZW1vdmUgPSBmdW5jdGlvbiAodk5vZGUpIHtcclxuICAgICAgICB2YXIgZG9tTm9kZSA9IHZOb2RlLmRvbU5vZGU7XHJcbiAgICAgICAgaWYgKHZOb2RlLnByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgdmFyIGV4aXRBbmltYXRpb24gPSB2Tm9kZS5wcm9wZXJ0aWVzLmV4aXRBbmltYXRpb247XHJcbiAgICAgICAgICAgIGlmIChleGl0QW5pbWF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBkb21Ob2RlLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVtb3ZlRG9tTm9kZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tTm9kZS5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVOb2RlUmVtb3ZhbCh2Tm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGV4aXRBbmltYXRpb24oZG9tTm9kZSwgcmVtb3ZlRG9tTm9kZSwgdk5vZGUucHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRvbU5vZGUucGFyZW50Tm9kZSkge1xyXG4gICAgICAgICAgICBkb21Ob2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9tTm9kZSk7XHJcbiAgICAgICAgICAgIHNjaGVkdWxlTm9kZVJlbW92YWwodk5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB2YXIgc2V0UHJvcGVydGllcyA9IGZ1bmN0aW9uIChkb21Ob2RlLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIGlmICghcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBldmVudEhhbmRsZXJJbnRlcmNlcHRvciA9IHByb2plY3Rpb25PcHRpb25zLmV2ZW50SGFuZGxlckludGVyY2VwdG9yO1xyXG4gICAgICAgIHZhciBwcm9wTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcclxuICAgICAgICB2YXIgcHJvcENvdW50ID0gcHJvcE5hbWVzLmxlbmd0aDtcclxuICAgICAgICB2YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChpKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wTmFtZSA9IHByb3BOYW1lc1tpXTtcclxuICAgICAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xyXG4gICAgICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdjbGFzc05hbWUnKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Byb3BlcnR5IFwiY2xhc3NOYW1lXCIgaXMgbm90IHN1cHBvcnRlZCwgdXNlIFwiY2xhc3NcIi4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ2NsYXNzJykge1xyXG4gICAgICAgICAgICAgICAgdG9nZ2xlQ2xhc3Nlcyhkb21Ob2RlLCBwcm9wVmFsdWUsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lID09PSAnY2xhc3NlcycpIHtcclxuICAgICAgICAgICAgICAgIC8vIG9iamVjdCB3aXRoIHN0cmluZyBrZXlzIGFuZCBib29sZWFuIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgdmFyIGNsYXNzTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNsYXNzTmFtZUNvdW50ID0gY2xhc3NOYW1lcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNsYXNzTmFtZUNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gY2xhc3NOYW1lc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocHJvcFZhbHVlW2NsYXNzTmFtZV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lID09PSAnc3R5bGVzJykge1xyXG4gICAgICAgICAgICAgICAgLy8gb2JqZWN0IHdpdGggc3RyaW5nIGtleXMgYW5kIHN0cmluZyAoISkgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGVOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3R5bGVDb3VudCA9IHN0eWxlTmFtZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzdHlsZUNvdW50OyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3R5bGVOYW1lID0gc3R5bGVOYW1lc1tqXTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3R5bGVWYWx1ZSA9IHByb3BWYWx1ZVtzdHlsZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdHlsZVZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrU3R5bGVWYWx1ZShzdHlsZVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyKGRvbU5vZGUsIHN0eWxlTmFtZSwgc3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHByb3BOYW1lICE9PSAna2V5JyAmJiBwcm9wVmFsdWUgIT09IG51bGwgJiYgcHJvcFZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BOYW1lLmxhc3RJbmRleE9mKCdvbicsIDApID09PSAwKSB7IC8vIGxhc3RJbmRleE9mKCwwKT09PTAgLT4gc3RhcnRzV2l0aFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRIYW5kbGVySW50ZXJjZXB0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BWYWx1ZSA9IGV2ZW50SGFuZGxlckludGVyY2VwdG9yKHByb3BOYW1lLCBwcm9wVmFsdWUsIGRvbU5vZGUsIHByb3BlcnRpZXMpOyAvLyBpbnRlcmNlcHQgZXZlbnRoYW5kbGVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ29uaW5wdXQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZSBuby10aGlzLWtleXdvcmQgbm8taW52YWxpZC10aGlzIG9ubHktYXJyb3ctZnVuY3Rpb25zIG5vLXZvaWQtZXhwcmVzc2lvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWNvcmQgdGhlIGV2dC50YXJnZXQudmFsdWUsIGJlY2F1c2UgSUUgYW5kIEVkZ2Ugc29tZXRpbWVzIGRvIGEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGJldHdlZW4gY2hhbmdpbmcgdmFsdWUgYW5kIHJ1bm5pbmcgb25pbnB1dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvbGRQcm9wVmFsdWUgPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcFZhbHVlID0gZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRQcm9wVmFsdWUuYXBwbHkodGhpcywgW2V2dF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBldnQudGFyZ2V0WydvbmlucHV0LXZhbHVlJ10gPSBldnQudGFyZ2V0LnZhbHVlOyAvLyBtYXkgYmUgSFRNTFRleHRBcmVhRWxlbWVudCBhcyB3ZWxsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiB0c2xpbnQ6ZW5hYmxlICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZVtwcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocHJvamVjdGlvbk9wdGlvbnMubmFtZXNwYWNlID09PSBOQU1FU1BBQ0VfU1ZHKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BOYW1lID09PSAnaHJlZicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5zZXRBdHRyaWJ1dGVOUyhOQU1FU1BBQ0VfWExJTkssIHByb3BOYW1lLCBwcm9wVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIFNWRyBhdHRyaWJ1dGVzIGFyZSByZWFkLW9ubHkgaW4gRE9NLCBzby4uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZShwcm9wTmFtZSwgcHJvcFZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJyAmJiBwcm9wTmFtZSAhPT0gJ3ZhbHVlJyAmJiBwcm9wTmFtZSAhPT0gJ2lubmVySFRNTCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZShwcm9wTmFtZSwgcHJvcFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIF9sb29wXzEoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBhZGRDaGlsZHJlbiA9IGZ1bmN0aW9uIChkb21Ob2RlLCBjaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgICAgICBpZiAoIWNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBjaGlsZHJlbl8xID0gY2hpbGRyZW47IF9pIDwgY2hpbGRyZW5fMS5sZW5ndGg7IF9pKyspIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5fMVtfaV07XHJcbiAgICAgICAgICAgIGNyZWF0ZURvbShjaGlsZCwgZG9tTm9kZSwgdW5kZWZpbmVkLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuID0gZnVuY3Rpb24gKGRvbU5vZGUsIHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIGFkZENoaWxkcmVuKGRvbU5vZGUsIHZub2RlLmNoaWxkcmVuLCBwcm9qZWN0aW9uT3B0aW9ucyk7IC8vIGNoaWxkcmVuIGJlZm9yZSBwcm9wZXJ0aWVzLCBuZWVkZWQgZm9yIHZhbHVlIHByb3BlcnR5IG9mIDxzZWxlY3Q+LlxyXG4gICAgICAgIGlmICh2bm9kZS50ZXh0KSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUudGV4dENvbnRlbnQgPSB2bm9kZS50ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRQcm9wZXJ0aWVzKGRvbU5vZGUsIHZub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICBpZiAodm5vZGUucHJvcGVydGllcyAmJiB2bm9kZS5wcm9wZXJ0aWVzLmFmdGVyQ3JlYXRlKSB7XHJcbiAgICAgICAgICAgIHZub2RlLnByb3BlcnRpZXMuYWZ0ZXJDcmVhdGUuYXBwbHkodm5vZGUucHJvcGVydGllcy5iaW5kIHx8IHZub2RlLnByb3BlcnRpZXMsIFtkb21Ob2RlLCBwcm9qZWN0aW9uT3B0aW9ucywgdm5vZGUudm5vZGVTZWxlY3Rvciwgdm5vZGUucHJvcGVydGllcywgdm5vZGUuY2hpbGRyZW5dKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmFyIGNyZWF0ZURvbSA9IGZ1bmN0aW9uICh2bm9kZSwgcGFyZW50Tm9kZSwgaW5zZXJ0QmVmb3JlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIHZhciBkb21Ob2RlO1xyXG4gICAgICAgIHZhciBzdGFydCA9IDA7XHJcbiAgICAgICAgdmFyIHZub2RlU2VsZWN0b3IgPSB2bm9kZS52bm9kZVNlbGVjdG9yO1xyXG4gICAgICAgIHZhciBkb2MgPSBwYXJlbnROb2RlLm93bmVyRG9jdW1lbnQ7XHJcbiAgICAgICAgaWYgKHZub2RlU2VsZWN0b3IgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIGRvbU5vZGUgPSB2bm9kZS5kb21Ob2RlID0gZG9jLmNyZWF0ZVRleHROb2RlKHZub2RlLnRleHQpO1xyXG4gICAgICAgICAgICBpZiAoaW5zZXJ0QmVmb3JlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRvbU5vZGUsIGluc2VydEJlZm9yZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmFwcGVuZENoaWxkKGRvbU5vZGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8PSB2bm9kZVNlbGVjdG9yLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHZub2RlU2VsZWN0b3IuY2hhckF0KGkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT09IHZub2RlU2VsZWN0b3IubGVuZ3RoIHx8IGMgPT09ICcuJyB8fCBjID09PSAnIycpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHlwZSA9IHZub2RlU2VsZWN0b3IuY2hhckF0KHN0YXJ0IC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gdm5vZGVTZWxlY3Rvci5zbGljZShzdGFydCwgaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09ICcuJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmNsYXNzTGlzdC5hZGQoZm91bmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlID09PSAnIycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5pZCA9IGZvdW5kO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kID09PSAnc3ZnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSBleHRlbmQocHJvamVjdGlvbk9wdGlvbnMsIHsgbmFtZXNwYWNlOiBOQU1FU1BBQ0VfU1ZHIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9qZWN0aW9uT3B0aW9ucy5uYW1lc3BhY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZSA9IHZub2RlLmRvbU5vZGUgPSBkb2MuY3JlYXRlRWxlbWVudE5TKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSwgZm91bmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZSA9IHZub2RlLmRvbU5vZGUgPSAodm5vZGUuZG9tTm9kZSB8fCBkb2MuY3JlYXRlRWxlbWVudChmb3VuZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kID09PSAnaW5wdXQnICYmIHZub2RlLnByb3BlcnRpZXMgJiYgdm5vZGUucHJvcGVydGllcy50eXBlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJRTggYW5kIG9sZGVyIGRvbid0IHN1cHBvcnQgc2V0dGluZyBpbnB1dCB0eXBlIGFmdGVyIHRoZSBET00gTm9kZSBoYXMgYmVlbiBhZGRlZCB0byB0aGUgZG9jdW1lbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZSgndHlwZScsIHZub2RlLnByb3BlcnRpZXMudHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluc2VydEJlZm9yZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShkb21Ob2RlLCBpbnNlcnRCZWZvcmUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRvbU5vZGUucGFyZW50Tm9kZSAhPT0gcGFyZW50Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hcHBlbmRDaGlsZChkb21Ob2RlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IGkgKyAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGluaXRQcm9wZXJ0aWVzQW5kQ2hpbGRyZW4oZG9tTm9kZSwgdm5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdmFyIHVwZGF0ZURvbTtcclxuICAgIC8qKlxyXG4gICAgICogQWRkcyBvciByZW1vdmVzIGNsYXNzZXMgZnJvbSBhbiBFbGVtZW50XHJcbiAgICAgKiBAcGFyYW0gZG9tTm9kZSB0aGUgZWxlbWVudFxyXG4gICAgICogQHBhcmFtIGNsYXNzZXMgYSBzdHJpbmcgc2VwYXJhdGVkIGxpc3Qgb2YgY2xhc3Nlc1xyXG4gICAgICogQHBhcmFtIG9uIHRydWUgbWVhbnMgYWRkIGNsYXNzZXMsIGZhbHNlIG1lYW5zIHJlbW92ZVxyXG4gICAgICovXHJcbiAgICB2YXIgdG9nZ2xlQ2xhc3NlcyA9IGZ1bmN0aW9uIChkb21Ob2RlLCBjbGFzc2VzLCBvbikge1xyXG4gICAgICAgIGlmICghY2xhc3Nlcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsYXNzZXMuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uIChjbGFzc1RvVG9nZ2xlKSB7XHJcbiAgICAgICAgICAgIGlmIChjbGFzc1RvVG9nZ2xlKSB7XHJcbiAgICAgICAgICAgICAgICBkb21Ob2RlLmNsYXNzTGlzdC50b2dnbGUoY2xhc3NUb1RvZ2dsZSwgb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgdmFyIHVwZGF0ZVByb3BlcnRpZXMgPSBmdW5jdGlvbiAoZG9tTm9kZSwgcHJldmlvdXNQcm9wZXJ0aWVzLCBwcm9wZXJ0aWVzLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIGlmICghcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBwcm9wZXJ0aWVzVXBkYXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBwcm9wTmFtZXMgPSBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKTtcclxuICAgICAgICB2YXIgcHJvcENvdW50ID0gcHJvcE5hbWVzLmxlbmd0aDtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BDb3VudDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wTmFtZSA9IHByb3BOYW1lc1tpXTtcclxuICAgICAgICAgICAgLy8gYXNzdW1pbmcgdGhhdCBwcm9wZXJ0aWVzIHdpbGwgYmUgbnVsbGlmaWVkIGluc3RlYWQgb2YgbWlzc2luZyBpcyBieSBkZXNpZ25cclxuICAgICAgICAgICAgdmFyIHByb3BWYWx1ZSA9IHByb3BlcnRpZXNbcHJvcE5hbWVdO1xyXG4gICAgICAgICAgICB2YXIgcHJldmlvdXNWYWx1ZSA9IHByZXZpb3VzUHJvcGVydGllc1twcm9wTmFtZV07XHJcbiAgICAgICAgICAgIGlmIChwcm9wTmFtZSA9PT0gJ2NsYXNzJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByZXZpb3VzVmFsdWUgIT09IHByb3BWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZUNsYXNzZXMoZG9tTm9kZSwgcHJldmlvdXNWYWx1ZSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvZ2dsZUNsYXNzZXMoZG9tTm9kZSwgcHJvcFZhbHVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ2NsYXNzZXMnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2xhc3NMaXN0ID0gZG9tTm9kZS5jbGFzc0xpc3Q7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2xhc3NOYW1lcyA9IE9iamVjdC5rZXlzKHByb3BWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2xhc3NOYW1lQ291bnQgPSBjbGFzc05hbWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgY2xhc3NOYW1lQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSBjbGFzc05hbWVzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvbiA9ICEhcHJvcFZhbHVlW2NsYXNzTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzT24gPSAhIXByZXZpb3VzVmFsdWVbY2xhc3NOYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob24gPT09IHByZXZpb3VzT24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChwcm9wTmFtZSA9PT0gJ3N0eWxlcycpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHlsZU5hbWVzID0gT2JqZWN0LmtleXMocHJvcFZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHZhciBzdHlsZUNvdW50ID0gc3R5bGVOYW1lcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0eWxlQ291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdHlsZU5hbWUgPSBzdHlsZU5hbWVzW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdTdHlsZVZhbHVlID0gcHJvcFZhbHVlW3N0eWxlTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFN0eWxlVmFsdWUgPSBwcmV2aW91c1ZhbHVlW3N0eWxlTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1N0eWxlVmFsdWUgPT09IG9sZFN0eWxlVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXNVcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3U3R5bGVWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVja1N0eWxlVmFsdWUobmV3U3R5bGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zLnN0eWxlQXBwbHllcihkb21Ob2RlLCBzdHlsZU5hbWUsIG5ld1N0eWxlVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMuc3R5bGVBcHBseWVyKGRvbU5vZGUsIHN0eWxlTmFtZSwgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghcHJvcFZhbHVlICYmIHR5cGVvZiBwcmV2aW91c1ZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BWYWx1ZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BOYW1lID09PSAndmFsdWUnKSB7IC8vIHZhbHVlIGNhbiBiZSBtYW5pcHVsYXRlZCBieSB0aGUgdXNlciBkaXJlY3RseSBhbmQgdXNpbmcgZXZlbnQucHJldmVudERlZmF1bHQoKSBpcyBub3QgYW4gb3B0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRvbVZhbHVlID0gZG9tTm9kZVtwcm9wTmFtZV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbVZhbHVlICE9PSBwcm9wVmFsdWUgLy8gVGhlICd2YWx1ZScgaW4gdGhlIERPTSB0cmVlICE9PSBuZXdWYWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiAoZG9tTm9kZVsnb25pbnB1dC12YWx1ZSddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IGRvbVZhbHVlID09PSBkb21Ob2RlWydvbmlucHV0LXZhbHVlJ10gLy8gSWYgdGhlIGxhc3QgcmVwb3J0ZWQgdmFsdWUgdG8gJ29uaW5wdXQnIGRvZXMgbm90IG1hdGNoIGRvbVZhbHVlLCBkbyBub3RoaW5nIGFuZCB3YWl0IGZvciBvbmlucHV0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSAvLyBPbmx5IHVwZGF0ZSB0aGUgdmFsdWUgaWYgdGhlIHZkb20gY2hhbmdlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBlZGdlIGNhc2VzIGFyZSBkZXNjcmliZWQgaW4gdGhlIHRlc3RzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGVbcHJvcE5hbWVdID0gcHJvcFZhbHVlOyAvLyBSZXNldCB0aGUgdmFsdWUsIGV2ZW4gaWYgdGhlIHZpcnR1YWwgRE9NIGRpZCBub3QgY2hhbmdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGVbJ29uaW5wdXQtdmFsdWUnXSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICB9IC8vIGVsc2UgZG8gbm90IHVwZGF0ZSB0aGUgZG9tTm9kZSwgb3RoZXJ3aXNlIHRoZSBjdXJzb3IgcG9zaXRpb24gd291bGQgYmUgY2hhbmdlZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wVmFsdWUgIT09IHByZXZpb3VzVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc1VwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHByb3BWYWx1ZSAhPT0gcHJldmlvdXNWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0eXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZSAhPT0gJ2Z1bmN0aW9uJyB8fCAhcHJvamVjdGlvbk9wdGlvbnMuZXZlbnRIYW5kbGVySW50ZXJjZXB0b3IpIHsgLy8gRnVuY3Rpb24gdXBkYXRlcyBhcmUgZXhwZWN0ZWQgdG8gYmUgaGFuZGxlZCBieSB0aGUgRXZlbnRIYW5kbGVySW50ZXJjZXB0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb2plY3Rpb25PcHRpb25zLm5hbWVzcGFjZSA9PT0gTkFNRVNQQUNFX1NWRykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BOYW1lID09PSAnaHJlZicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnNldEF0dHJpYnV0ZU5TKE5BTUVTUEFDRV9YTElOSywgcHJvcE5hbWUsIHByb3BWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhbGwgU1ZHIGF0dHJpYnV0ZXMgYXJlIHJlYWQtb25seSBpbiBET00sIHNvLi4uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5zZXRBdHRyaWJ1dGUocHJvcE5hbWUsIHByb3BWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycgJiYgcHJvcE5hbWUgIT09ICdpbm5lckhUTUwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcE5hbWUgPT09ICdyb2xlJyAmJiBwcm9wVmFsdWUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5yZW1vdmVBdHRyaWJ1dGUocHJvcE5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5zZXRBdHRyaWJ1dGUocHJvcE5hbWUsIHByb3BWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoZG9tTm9kZVtwcm9wTmFtZV0gIT09IHByb3BWYWx1ZSkgeyAvLyBDb21wYXJpc29uIGlzIGhlcmUgZm9yIHNpZGUtZWZmZWN0cyBpbiBFZGdlIHdpdGggc2Nyb2xsTGVmdCBhbmQgc2Nyb2xsVG9wXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzVXBkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9wZXJ0aWVzVXBkYXRlZDtcclxuICAgIH07XHJcbiAgICB2YXIgdXBkYXRlQ2hpbGRyZW4gPSBmdW5jdGlvbiAodm5vZGUsIGRvbU5vZGUsIG9sZENoaWxkcmVuLCBuZXdDaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgICAgICBpZiAob2xkQ2hpbGRyZW4gPT09IG5ld0NoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb2xkQ2hpbGRyZW4gPSBvbGRDaGlsZHJlbiB8fCBlbXB0eUFycmF5O1xyXG4gICAgICAgIG5ld0NoaWxkcmVuID0gbmV3Q2hpbGRyZW4gfHwgZW1wdHlBcnJheTtcclxuICAgICAgICB2YXIgb2xkQ2hpbGRyZW5MZW5ndGggPSBvbGRDaGlsZHJlbi5sZW5ndGg7XHJcbiAgICAgICAgdmFyIG5ld0NoaWxkcmVuTGVuZ3RoID0gbmV3Q2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgIHZhciBvbGRJbmRleCA9IDA7XHJcbiAgICAgICAgdmFyIG5ld0luZGV4ID0gMDtcclxuICAgICAgICB2YXIgaTtcclxuICAgICAgICB2YXIgdGV4dFVwZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICB3aGlsZSAobmV3SW5kZXggPCBuZXdDaGlsZHJlbkxlbmd0aCkge1xyXG4gICAgICAgICAgICB2YXIgb2xkQ2hpbGQgPSAob2xkSW5kZXggPCBvbGRDaGlsZHJlbkxlbmd0aCkgPyBvbGRDaGlsZHJlbltvbGRJbmRleF0gOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHZhciBuZXdDaGlsZCA9IG5ld0NoaWxkcmVuW25ld0luZGV4XTtcclxuICAgICAgICAgICAgaWYgKG9sZENoaWxkICE9PSB1bmRlZmluZWQgJiYgc2FtZShvbGRDaGlsZCwgbmV3Q2hpbGQpKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0VXBkYXRlZCA9IHVwZGF0ZURvbShvbGRDaGlsZCwgbmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zKSB8fCB0ZXh0VXBkYXRlZDtcclxuICAgICAgICAgICAgICAgIG9sZEluZGV4Kys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmluZE9sZEluZGV4ID0gZmluZEluZGV4T2ZDaGlsZChvbGRDaGlsZHJlbiwgbmV3Q2hpbGQsIG9sZEluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZmluZE9sZEluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgcHJlY2VkaW5nIG1pc3NpbmcgY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSBvbGRJbmRleDsgaSA8IGZpbmRPbGRJbmRleDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGVUb1JlbW92ZShvbGRDaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpLCB2bm9kZSwgJ3JlbW92ZWQnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dFVwZGF0ZWQgPSB1cGRhdGVEb20ob2xkQ2hpbGRyZW5bZmluZE9sZEluZGV4XSwgbmV3Q2hpbGQsIHByb2plY3Rpb25PcHRpb25zKSB8fCB0ZXh0VXBkYXRlZDtcclxuICAgICAgICAgICAgICAgICAgICBvbGRJbmRleCA9IGZpbmRPbGRJbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBOZXcgY2hpbGRcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVEb20obmV3Q2hpbGQsIGRvbU5vZGUsIChvbGRJbmRleCA8IG9sZENoaWxkcmVuTGVuZ3RoKSA/IG9sZENoaWxkcmVuW29sZEluZGV4XS5kb21Ob2RlIDogdW5kZWZpbmVkLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZUFkZGVkKG5ld0NoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGVja0Rpc3Rpbmd1aXNoYWJsZShuZXdDaGlsZHJlbiwgbmV3SW5kZXgsIHZub2RlLCAnYWRkZWQnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBuZXdJbmRleCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2xkQ2hpbGRyZW5MZW5ndGggPiBvbGRJbmRleCkge1xyXG4gICAgICAgICAgICAvLyBSZW1vdmUgY2hpbGQgZnJhZ21lbnRzXHJcbiAgICAgICAgICAgIGZvciAoaSA9IG9sZEluZGV4OyBpIDwgb2xkQ2hpbGRyZW5MZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbm9kZVRvUmVtb3ZlKG9sZENoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgICAgIGNoZWNrRGlzdGluZ3Vpc2hhYmxlKG9sZENoaWxkcmVuLCBpLCB2bm9kZSwgJ3JlbW92ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGV4dFVwZGF0ZWQ7XHJcbiAgICB9O1xyXG4gICAgdXBkYXRlRG9tID0gZnVuY3Rpb24gKHByZXZpb3VzLCB2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgICAgICB2YXIgZG9tTm9kZSA9IHByZXZpb3VzLmRvbU5vZGU7XHJcbiAgICAgICAgdmFyIHRleHRVcGRhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHByZXZpb3VzID09PSB2bm9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIEJ5IGNvbnRyYWN0LCBWTm9kZSBvYmplY3RzIG1heSBub3QgYmUgbW9kaWZpZWQgYW55bW9yZSBhZnRlciBwYXNzaW5nIHRoZW0gdG8gbWFxdWV0dGVcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHVwZGF0ZWQgPSBmYWxzZTtcclxuICAgICAgICBpZiAodm5vZGUudm5vZGVTZWxlY3RvciA9PT0gJycpIHtcclxuICAgICAgICAgICAgaWYgKHZub2RlLnRleHQgIT09IHByZXZpb3VzLnRleHQpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdUZXh0Tm9kZSA9IGRvbU5vZGUub3duZXJEb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2bm9kZS50ZXh0KTtcclxuICAgICAgICAgICAgICAgIGRvbU5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3VGV4dE5vZGUsIGRvbU5vZGUpO1xyXG4gICAgICAgICAgICAgICAgdm5vZGUuZG9tTm9kZSA9IG5ld1RleHROb2RlO1xyXG4gICAgICAgICAgICAgICAgdGV4dFVwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRleHRVcGRhdGVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZub2RlLmRvbU5vZGUgPSBkb21Ob2RlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHZub2RlLnZub2RlU2VsZWN0b3IubGFzdEluZGV4T2YoJ3N2ZycsIDApID09PSAwKSB7IC8vIGxhc3RJbmRleE9mKG5lZWRsZSwwKT09PTAgbWVhbnMgU3RhcnRzV2l0aFxyXG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSBleHRlbmQocHJvamVjdGlvbk9wdGlvbnMsIHsgbmFtZXNwYWNlOiBOQU1FU1BBQ0VfU1ZHIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcmV2aW91cy50ZXh0ICE9PSB2bm9kZS50ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmICh2bm9kZS50ZXh0ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnJlbW92ZUNoaWxkKGRvbU5vZGUuZmlyc3RDaGlsZCk7IC8vIHRoZSBvbmx5IHRleHRub2RlIHByZXN1bWFibHlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUudGV4dENvbnRlbnQgPSB2bm9kZS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZub2RlLmRvbU5vZGUgPSBkb21Ob2RlO1xyXG4gICAgICAgICAgICB1cGRhdGVkID0gdXBkYXRlQ2hpbGRyZW4odm5vZGUsIGRvbU5vZGUsIHByZXZpb3VzLmNoaWxkcmVuLCB2bm9kZS5jaGlsZHJlbiwgcHJvamVjdGlvbk9wdGlvbnMpIHx8IHVwZGF0ZWQ7XHJcbiAgICAgICAgICAgIHVwZGF0ZWQgPSB1cGRhdGVQcm9wZXJ0aWVzKGRvbU5vZGUsIHByZXZpb3VzLnByb3BlcnRpZXMsIHZub2RlLnByb3BlcnRpZXMsIHByb2plY3Rpb25PcHRpb25zKSB8fCB1cGRhdGVkO1xyXG4gICAgICAgICAgICBpZiAodm5vZGUucHJvcGVydGllcyAmJiB2bm9kZS5wcm9wZXJ0aWVzLmFmdGVyVXBkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB2bm9kZS5wcm9wZXJ0aWVzLmFmdGVyVXBkYXRlLmFwcGx5KHZub2RlLnByb3BlcnRpZXMuYmluZCB8fCB2bm9kZS5wcm9wZXJ0aWVzLCBbZG9tTm9kZSwgcHJvamVjdGlvbk9wdGlvbnMsIHZub2RlLnZub2RlU2VsZWN0b3IsIHZub2RlLnByb3BlcnRpZXMsIHZub2RlLmNoaWxkcmVuXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHVwZGF0ZWQgJiYgdm5vZGUucHJvcGVydGllcyAmJiB2bm9kZS5wcm9wZXJ0aWVzLnVwZGF0ZUFuaW1hdGlvbikge1xyXG4gICAgICAgICAgICB2bm9kZS5wcm9wZXJ0aWVzLnVwZGF0ZUFuaW1hdGlvbihkb21Ob2RlLCB2bm9kZS5wcm9wZXJ0aWVzLCBwcmV2aW91cy5wcm9wZXJ0aWVzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRleHRVcGRhdGVkO1xyXG4gICAgfTtcclxuICAgIHZhciBjcmVhdGVQcm9qZWN0aW9uID0gZnVuY3Rpb24gKHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGdldExhc3RSZW5kZXI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZub2RlOyB9LFxyXG4gICAgICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uICh1cGRhdGVkVm5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2bm9kZS52bm9kZVNlbGVjdG9yICE9PSB1cGRhdGVkVm5vZGUudm5vZGVTZWxlY3Rvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHNlbGVjdG9yIGZvciB0aGUgcm9vdCBWTm9kZSBtYXkgbm90IGJlIGNoYW5nZWQuIChjb25zaWRlciB1c2luZyBkb20ubWVyZ2UgYW5kIGFkZCBvbmUgZXh0cmEgbGV2ZWwgdG8gdGhlIHZpcnR1YWwgRE9NKScpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHByZXZpb3VzVk5vZGUgPSB2bm9kZTtcclxuICAgICAgICAgICAgICAgIHZub2RlID0gdXBkYXRlZFZub2RlO1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlRG9tKHByZXZpb3VzVk5vZGUsIHVwZGF0ZWRWbm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkb21Ob2RlOiB2bm9kZS5kb21Ob2RlXHJcbiAgICAgICAgfTtcclxuICAgIH07XG5cbiAgICB2YXIgREVGQVVMVF9QUk9KRUNUSU9OX09QVElPTlMgPSB7XHJcbiAgICAgICAgbmFtZXNwYWNlOiB1bmRlZmluZWQsXHJcbiAgICAgICAgcGVyZm9ybWFuY2VMb2dnZXI6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfSxcclxuICAgICAgICBldmVudEhhbmRsZXJJbnRlcmNlcHRvcjogdW5kZWZpbmVkLFxyXG4gICAgICAgIHN0eWxlQXBwbHllcjogZnVuY3Rpb24gKGRvbU5vZGUsIHN0eWxlTmFtZSwgdmFsdWUpIHtcclxuICAgICAgICAgICAgLy8gUHJvdmlkZXMgYSBob29rIHRvIGFkZCB2ZW5kb3IgcHJlZml4ZXMgZm9yIGJyb3dzZXJzIHRoYXQgc3RpbGwgbmVlZCBpdC5cclxuICAgICAgICAgICAgZG9tTm9kZS5zdHlsZVtzdHlsZU5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHZhciBhcHBseURlZmF1bHRQcm9qZWN0aW9uT3B0aW9ucyA9IGZ1bmN0aW9uIChwcm9qZWN0b3JPcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZChERUZBVUxUX1BST0pFQ1RJT05fT1BUSU9OUywgcHJvamVjdG9yT3B0aW9ucyk7XHJcbiAgICB9O1xyXG4gICAgdmFyIGRvbSA9IHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGVzIGEgcmVhbCBET00gdHJlZSBmcm9tIGB2bm9kZWAuIFRoZSBbW1Byb2plY3Rpb25dXSBvYmplY3QgcmV0dXJuZWQgd2lsbCBjb250YWluIHRoZSByZXN1bHRpbmcgRE9NIE5vZGUgaW5cclxuICAgICAgICAgKiBpdHMgW1tQcm9qZWN0aW9uLmRvbU5vZGV8ZG9tTm9kZV1dIHByb3BlcnR5LlxyXG4gICAgICAgICAqIFRoaXMgaXMgYSBsb3ctbGV2ZWwgbWV0aG9kLiBVc2VycyB3aWxsIHR5cGljYWxseSB1c2UgYSBbW1Byb2plY3Rvcl1dIGluc3RlYWQuXHJcbiAgICAgICAgICogQHBhcmFtIHZub2RlIC0gVGhlIHJvb3Qgb2YgdGhlIHZpcnR1YWwgRE9NIHRyZWUgdGhhdCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgW1toXV0gZnVuY3Rpb24uIE5PVEU6IFtbVk5vZGVdXVxyXG4gICAgICAgICAqIG9iamVjdHMgbWF5IG9ubHkgYmUgcmVuZGVyZWQgb25jZS5cclxuICAgICAgICAgKiBAcGFyYW0gcHJvamVjdGlvbk9wdGlvbnMgLSBPcHRpb25zIHRvIGJlIHVzZWQgdG8gY3JlYXRlIGFuZCB1cGRhdGUgdGhlIHByb2plY3Rpb24uXHJcbiAgICAgICAgICogQHJldHVybnMgVGhlIFtbUHJvamVjdGlvbl1dIHdoaWNoIGFsc28gY29udGFpbnMgdGhlIERPTSBOb2RlIHRoYXQgd2FzIGNyZWF0ZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY3JlYXRlOiBmdW5jdGlvbiAodm5vZGUsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zID0gYXBwbHlEZWZhdWx0UHJvamVjdGlvbk9wdGlvbnMocHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICBjcmVhdGVEb20odm5vZGUsIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLCB1bmRlZmluZWQsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVByb2plY3Rpb24odm5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFwcGVuZHMgYSBuZXcgY2hpbGQgbm9kZSB0byB0aGUgRE9NIHdoaWNoIGlzIGdlbmVyYXRlZCBmcm9tIGEgW1tWTm9kZV1dLlxyXG4gICAgICAgICAqIFRoaXMgaXMgYSBsb3ctbGV2ZWwgbWV0aG9kLiBVc2VycyB3aWxsIHR5cGljYWxseSB1c2UgYSBbW1Byb2plY3Rvcl1dIGluc3RlYWQuXHJcbiAgICAgICAgICogQHBhcmFtIHBhcmVudE5vZGUgLSBUaGUgcGFyZW50IG5vZGUgZm9yIHRoZSBuZXcgY2hpbGQgbm9kZS5cclxuICAgICAgICAgKiBAcGFyYW0gdm5vZGUgLSBUaGUgcm9vdCBvZiB0aGUgdmlydHVhbCBET00gdHJlZSB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBbW2hdXSBmdW5jdGlvbi4gTk9URTogW1tWTm9kZV1dXHJcbiAgICAgICAgICogb2JqZWN0cyBtYXkgb25seSBiZSByZW5kZXJlZCBvbmNlLlxyXG4gICAgICAgICAqIEBwYXJhbSBwcm9qZWN0aW9uT3B0aW9ucyAtIE9wdGlvbnMgdG8gYmUgdXNlZCB0byBjcmVhdGUgYW5kIHVwZGF0ZSB0aGUgW1tQcm9qZWN0aW9uXV0uXHJcbiAgICAgICAgICogQHJldHVybnMgVGhlIFtbUHJvamVjdGlvbl1dIHRoYXQgd2FzIGNyZWF0ZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYXBwZW5kOiBmdW5jdGlvbiAocGFyZW50Tm9kZSwgdm5vZGUsIHByb2plY3Rpb25PcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHByb2plY3Rpb25PcHRpb25zID0gYXBwbHlEZWZhdWx0UHJvamVjdGlvbk9wdGlvbnMocHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICBjcmVhdGVEb20odm5vZGUsIHBhcmVudE5vZGUsIHVuZGVmaW5lZCwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlUHJvamVjdGlvbih2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSW5zZXJ0cyBhIG5ldyBET00gbm9kZSB3aGljaCBpcyBnZW5lcmF0ZWQgZnJvbSBhIFtbVk5vZGVdXS5cclxuICAgICAgICAgKiBUaGlzIGlzIGEgbG93LWxldmVsIG1ldGhvZC4gVXNlcnMgd2lsIHR5cGljYWxseSB1c2UgYSBbW1Byb2plY3Rvcl1dIGluc3RlYWQuXHJcbiAgICAgICAgICogQHBhcmFtIGJlZm9yZU5vZGUgLSBUaGUgbm9kZSB0aGF0IHRoZSBET00gTm9kZSBpcyBpbnNlcnRlZCBiZWZvcmUuXHJcbiAgICAgICAgICogQHBhcmFtIHZub2RlIC0gVGhlIHJvb3Qgb2YgdGhlIHZpcnR1YWwgRE9NIHRyZWUgdGhhdCB3YXMgY3JlYXRlZCB1c2luZyB0aGUgW1toXV0gZnVuY3Rpb24uXHJcbiAgICAgICAgICogTk9URTogW1tWTm9kZV1dIG9iamVjdHMgbWF5IG9ubHkgYmUgcmVuZGVyZWQgb25jZS5cclxuICAgICAgICAgKiBAcGFyYW0gcHJvamVjdGlvbk9wdGlvbnMgLSBPcHRpb25zIHRvIGJlIHVzZWQgdG8gY3JlYXRlIGFuZCB1cGRhdGUgdGhlIHByb2plY3Rpb24sIHNlZSBbW2NyZWF0ZVByb2plY3Rvcl1dLlxyXG4gICAgICAgICAqIEByZXR1cm5zIFRoZSBbW1Byb2plY3Rpb25dXSB0aGF0IHdhcyBjcmVhdGVkLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGluc2VydEJlZm9yZTogZnVuY3Rpb24gKGJlZm9yZU5vZGUsIHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IGFwcGx5RGVmYXVsdFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgY3JlYXRlRG9tKHZub2RlLCBiZWZvcmVOb2RlLnBhcmVudE5vZGUsIGJlZm9yZU5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZVByb2plY3Rpb24odm5vZGUsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1lcmdlcyBhIG5ldyBET00gbm9kZSB3aGljaCBpcyBnZW5lcmF0ZWQgZnJvbSBhIFtbVk5vZGVdXSB3aXRoIGFuIGV4aXN0aW5nIERPTSBOb2RlLlxyXG4gICAgICAgICAqIFRoaXMgbWVhbnMgdGhhdCB0aGUgdmlydHVhbCBET00gYW5kIHRoZSByZWFsIERPTSB3aWxsIGhhdmUgb25lIG92ZXJsYXBwaW5nIGVsZW1lbnQuXHJcbiAgICAgICAgICogVGhlcmVmb3JlIHRoZSBzZWxlY3RvciBmb3IgdGhlIHJvb3QgW1tWTm9kZV1dIHdpbGwgYmUgaWdub3JlZCwgYnV0IGl0cyBwcm9wZXJ0aWVzIGFuZCBjaGlsZHJlbiB3aWxsIGJlIGFwcGxpZWQgdG8gdGhlIEVsZW1lbnQgcHJvdmlkZWQuXHJcbiAgICAgICAgICogVGhpcyBpcyBhIGxvdy1sZXZlbCBtZXRob2QuIFVzZXJzIHdpbCB0eXBpY2FsbHkgdXNlIGEgW1tQcm9qZWN0b3JdXSBpbnN0ZWFkLlxyXG4gICAgICAgICAqIEBwYXJhbSBlbGVtZW50IC0gVGhlIGV4aXN0aW5nIGVsZW1lbnQgdG8gYWRvcHQgYXMgdGhlIHJvb3Qgb2YgdGhlIG5ldyB2aXJ0dWFsIERPTS4gRXhpc3RpbmcgYXR0cmlidXRlcyBhbmQgY2hpbGQgbm9kZXMgYXJlIHByZXNlcnZlZC5cclxuICAgICAgICAgKiBAcGFyYW0gdm5vZGUgLSBUaGUgcm9vdCBvZiB0aGUgdmlydHVhbCBET00gdHJlZSB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBbW2hdXSBmdW5jdGlvbi4gTk9URTogW1tWTm9kZV1dIG9iamVjdHNcclxuICAgICAgICAgKiBtYXkgb25seSBiZSByZW5kZXJlZCBvbmNlLlxyXG4gICAgICAgICAqIEBwYXJhbSBwcm9qZWN0aW9uT3B0aW9ucyAtIE9wdGlvbnMgdG8gYmUgdXNlZCB0byBjcmVhdGUgYW5kIHVwZGF0ZSB0aGUgcHJvamVjdGlvbiwgc2VlIFtbY3JlYXRlUHJvamVjdG9yXV0uXHJcbiAgICAgICAgICogQHJldHVybnMgVGhlIFtbUHJvamVjdGlvbl1dIHRoYXQgd2FzIGNyZWF0ZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbWVyZ2U6IGZ1bmN0aW9uIChlbGVtZW50LCB2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcHJvamVjdGlvbk9wdGlvbnMgPSBhcHBseURlZmF1bHRQcm9qZWN0aW9uT3B0aW9ucyhwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHZub2RlLmRvbU5vZGUgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICBpbml0UHJvcGVydGllc0FuZENoaWxkcmVuKGVsZW1lbnQsIHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVQcm9qZWN0aW9uKHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXBsYWNlcyBhbiBleGlzdGluZyBET00gbm9kZSB3aXRoIGEgbm9kZSBnZW5lcmF0ZWQgZnJvbSBhIFtbVk5vZGVdXS5cclxuICAgICAgICAgKiBUaGlzIGlzIGEgbG93LWxldmVsIG1ldGhvZC4gVXNlcnMgd2lsbCB0eXBpY2FsbHkgdXNlIGEgW1tQcm9qZWN0b3JdXSBpbnN0ZWFkLlxyXG4gICAgICAgICAqIEBwYXJhbSBlbGVtZW50IC0gVGhlIG5vZGUgZm9yIHRoZSBbW1ZOb2RlXV0gdG8gcmVwbGFjZS5cclxuICAgICAgICAgKiBAcGFyYW0gdm5vZGUgLSBUaGUgcm9vdCBvZiB0aGUgdmlydHVhbCBET00gdHJlZSB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBbW2hdXSBmdW5jdGlvbi4gTk9URTogW1tWTm9kZV1dXHJcbiAgICAgICAgICogb2JqZWN0cyBtYXkgb25seSBiZSByZW5kZXJlZCBvbmNlLlxyXG4gICAgICAgICAqIEBwYXJhbSBwcm9qZWN0aW9uT3B0aW9ucyAtIE9wdGlvbnMgdG8gYmUgdXNlZCB0byBjcmVhdGUgYW5kIHVwZGF0ZSB0aGUgW1tQcm9qZWN0aW9uXV0uXHJcbiAgICAgICAgICogQHJldHVybnMgVGhlIFtbUHJvamVjdGlvbl1dIHRoYXQgd2FzIGNyZWF0ZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVwbGFjZTogZnVuY3Rpb24gKGVsZW1lbnQsIHZub2RlLCBwcm9qZWN0aW9uT3B0aW9ucykge1xyXG4gICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucyA9IGFwcGx5RGVmYXVsdFByb2plY3Rpb25PcHRpb25zKHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgY3JlYXRlRG9tKHZub2RlLCBlbGVtZW50LnBhcmVudE5vZGUsIGVsZW1lbnQsIHByb2plY3Rpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlUHJvamVjdGlvbih2bm9kZSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XG5cbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZSBmdW5jdGlvbi1uYW1lICovXHJcbiAgICB2YXIgdG9UZXh0Vk5vZGUgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHZub2RlU2VsZWN0b3I6ICcnLFxyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHRleHQ6IGRhdGEudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgZG9tTm9kZTogbnVsbFxyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG4gICAgdmFyIGFwcGVuZENoaWxkcmVuID0gZnVuY3Rpb24gKHBhcmVudFNlbGVjdG9yLCBpbnNlcnRpb25zLCBtYWluKSB7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aF8xID0gaW5zZXJ0aW9ucy5sZW5ndGg7IGkgPCBsZW5ndGhfMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gaW5zZXJ0aW9uc1tpXTtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgIGFwcGVuZENoaWxkcmVuKHBhcmVudFNlbGVjdG9yLCBpdGVtLCBtYWluKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtICE9PSBudWxsICYmIGl0ZW0gIT09IHVuZGVmaW5lZCAmJiBpdGVtICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IHRvVGV4dFZOb2RlKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBtYWluLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgZnVuY3Rpb24gaChzZWxlY3RvciwgcHJvcGVydGllcywgY2hpbGRyZW4pIHtcclxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgICAgICBjaGlsZHJlbiA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKChwcm9wZXJ0aWVzICYmICh0eXBlb2YgcHJvcGVydGllcyA9PT0gJ3N0cmluZycgfHwgcHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eSgndm5vZGVTZWxlY3RvcicpKSkgfHxcclxuICAgICAgICAgICAgKGNoaWxkcmVuICYmICh0eXBlb2YgY2hpbGRyZW4gPT09ICdzdHJpbmcnIHx8IGNoaWxkcmVuLmhhc093blByb3BlcnR5KCd2bm9kZVNlbGVjdG9yJykpKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ggY2FsbGVkIHdpdGggaW52YWxpZCBhcmd1bWVudHMnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHRleHQ7XHJcbiAgICAgICAgdmFyIGZsYXR0ZW5lZENoaWxkcmVuO1xyXG4gICAgICAgIC8vIFJlY29nbml6ZSBhIGNvbW1vbiBzcGVjaWFsIGNhc2Ugd2hlcmUgdGhlcmUgaXMgb25seSBhIHNpbmdsZSB0ZXh0IG5vZGVcclxuICAgICAgICBpZiAoY2hpbGRyZW4gJiYgY2hpbGRyZW4ubGVuZ3RoID09PSAxICYmIHR5cGVvZiBjaGlsZHJlblswXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdGV4dCA9IGNoaWxkcmVuWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjaGlsZHJlbikge1xyXG4gICAgICAgICAgICBmbGF0dGVuZWRDaGlsZHJlbiA9IFtdO1xyXG4gICAgICAgICAgICBhcHBlbmRDaGlsZHJlbihzZWxlY3RvciwgY2hpbGRyZW4sIGZsYXR0ZW5lZENoaWxkcmVuKTtcclxuICAgICAgICAgICAgaWYgKGZsYXR0ZW5lZENoaWxkcmVuLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZmxhdHRlbmVkQ2hpbGRyZW4gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdm5vZGVTZWxlY3Rvcjogc2VsZWN0b3IsXHJcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHByb3BlcnRpZXMsXHJcbiAgICAgICAgICAgIGNoaWxkcmVuOiBmbGF0dGVuZWRDaGlsZHJlbixcclxuICAgICAgICAgICAgdGV4dDogKHRleHQgPT09ICcnKSA/IHVuZGVmaW5lZCA6IHRleHQsXHJcbiAgICAgICAgICAgIGRvbU5vZGU6IG51bGxcclxuICAgICAgICB9O1xyXG4gICAgfVxuXG4gICAgdmFyIGNyZWF0ZVBhcmVudE5vZGVQYXRoID0gZnVuY3Rpb24gKG5vZGUsIHJvb3ROb2RlKSB7XHJcbiAgICAgICAgdmFyIHBhcmVudE5vZGVQYXRoID0gW107XHJcbiAgICAgICAgd2hpbGUgKG5vZGUgIT09IHJvb3ROb2RlKSB7XHJcbiAgICAgICAgICAgIHBhcmVudE5vZGVQYXRoLnB1c2gobm9kZSk7XHJcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXJlbnROb2RlUGF0aDtcclxuICAgIH07XHJcbiAgICB2YXIgZmluZDtcclxuICAgIGlmIChBcnJheS5wcm90b3R5cGUuZmluZCkge1xyXG4gICAgICAgIGZpbmQgPSBmdW5jdGlvbiAoaXRlbXMsIHByZWRpY2F0ZSkgeyByZXR1cm4gaXRlbXMuZmluZChwcmVkaWNhdGUpOyB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZmluZCA9IGZ1bmN0aW9uIChpdGVtcywgcHJlZGljYXRlKSB7IHJldHVybiBpdGVtcy5maWx0ZXIocHJlZGljYXRlKVswXTsgfTtcclxuICAgIH1cclxuICAgIHZhciBmaW5kVk5vZGVCeVBhcmVudE5vZGVQYXRoID0gZnVuY3Rpb24gKHZub2RlLCBwYXJlbnROb2RlUGF0aCkge1xyXG4gICAgICAgIHZhciByZXN1bHQgPSB2bm9kZTtcclxuICAgICAgICBwYXJlbnROb2RlUGF0aC5mb3JFYWNoKGZ1bmN0aW9uIChub2RlKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IChyZXN1bHQgJiYgcmVzdWx0LmNoaWxkcmVuKSA/IGZpbmQocmVzdWx0LmNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHsgcmV0dXJuIGNoaWxkLmRvbU5vZGUgPT09IG5vZGU7IH0pIDogdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gICAgdmFyIGNyZWF0ZUV2ZW50SGFuZGxlckludGVyY2VwdG9yID0gZnVuY3Rpb24gKHByb2plY3RvciwgZ2V0UHJvamVjdGlvbiwgcGVyZm9ybWFuY2VMb2dnZXIpIHtcclxuICAgICAgICB2YXIgbW9kaWZpZWRFdmVudEhhbmRsZXIgPSBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIHBlcmZvcm1hbmNlTG9nZ2VyKCdkb21FdmVudCcsIGV2dCk7XHJcbiAgICAgICAgICAgIHZhciBwcm9qZWN0aW9uID0gZ2V0UHJvamVjdGlvbigpO1xyXG4gICAgICAgICAgICB2YXIgcGFyZW50Tm9kZVBhdGggPSBjcmVhdGVQYXJlbnROb2RlUGF0aChldnQuY3VycmVudFRhcmdldCwgcHJvamVjdGlvbi5kb21Ob2RlKTtcclxuICAgICAgICAgICAgcGFyZW50Tm9kZVBhdGgucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICB2YXIgbWF0Y2hpbmdWTm9kZSA9IGZpbmRWTm9kZUJ5UGFyZW50Tm9kZVBhdGgocHJvamVjdGlvbi5nZXRMYXN0UmVuZGVyKCksIHBhcmVudE5vZGVQYXRoKTtcclxuICAgICAgICAgICAgcHJvamVjdG9yLnNjaGVkdWxlUmVuZGVyKCk7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQ7XHJcbiAgICAgICAgICAgIGlmIChtYXRjaGluZ1ZOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZSBuby1pbnZhbGlkLXRoaXMgKi9cclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IG1hdGNoaW5nVk5vZGUucHJvcGVydGllc1tcIm9uXCIgKyBldnQudHlwZV0uYXBwbHkobWF0Y2hpbmdWTm9kZS5wcm9wZXJ0aWVzLmJpbmQgfHwgdGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIC8qIHRzbGludDplbmFibGUgbm8taW52YWxpZC10aGlzICovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGVyZm9ybWFuY2VMb2dnZXIoJ2RvbUV2ZW50UHJvY2Vzc2VkJywgZXZ0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAocHJvcGVydHlOYW1lLCBldmVudEhhbmRsZXIsIGRvbU5vZGUsIHByb3BlcnRpZXMpIHsgcmV0dXJuIG1vZGlmaWVkRXZlbnRIYW5kbGVyOyB9O1xyXG4gICAgfTtcclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlcyBhIFtbUHJvamVjdG9yXV0gaW5zdGFuY2UgdXNpbmcgdGhlIHByb3ZpZGVkIHByb2plY3Rpb25PcHRpb25zLlxyXG4gICAgICpcclxuICAgICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1tQcm9qZWN0b3JdXS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcHJvamVjdG9yT3B0aW9ucyAgIE9wdGlvbnMgdGhhdCBpbmZsdWVuY2UgaG93IHRoZSBET00gaXMgcmVuZGVyZWQgYW5kIHVwZGF0ZWQuXHJcbiAgICAgKi9cclxuICAgIHZhciBjcmVhdGVQcm9qZWN0b3IgPSBmdW5jdGlvbiAocHJvamVjdG9yT3B0aW9ucykge1xyXG4gICAgICAgIHZhciBwcm9qZWN0b3I7XHJcbiAgICAgICAgdmFyIHByb2plY3Rpb25PcHRpb25zID0gYXBwbHlEZWZhdWx0UHJvamVjdGlvbk9wdGlvbnMocHJvamVjdG9yT3B0aW9ucyk7XHJcbiAgICAgICAgdmFyIHBlcmZvcm1hbmNlTG9nZ2VyID0gcHJvamVjdGlvbk9wdGlvbnMucGVyZm9ybWFuY2VMb2dnZXI7XHJcbiAgICAgICAgdmFyIHJlbmRlckNvbXBsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgdmFyIHNjaGVkdWxlZDtcclxuICAgICAgICB2YXIgc3RvcHBlZCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBwcm9qZWN0aW9ucyA9IFtdO1xyXG4gICAgICAgIHZhciByZW5kZXJGdW5jdGlvbnMgPSBbXTsgLy8gbWF0Y2hlcyB0aGUgcHJvamVjdGlvbnMgYXJyYXlcclxuICAgICAgICB2YXIgYWRkUHJvamVjdGlvbiA9IGZ1bmN0aW9uIChcclxuICAgICAgICAvKiBvbmUgb2Y6IGRvbS5hcHBlbmQsIGRvbS5pbnNlcnRCZWZvcmUsIGRvbS5yZXBsYWNlLCBkb20ubWVyZ2UgKi9cclxuICAgICAgICBkb21GdW5jdGlvbiwgXHJcbiAgICAgICAgLyogdGhlIHBhcmFtZXRlciBvZiB0aGUgZG9tRnVuY3Rpb24gKi9cclxuICAgICAgICBub2RlLCByZW5kZXJGdW5jdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgcHJvamVjdGlvbjtcclxuICAgICAgICAgICAgdmFyIGdldFByb2plY3Rpb24gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBwcm9qZWN0aW9uOyB9O1xyXG4gICAgICAgICAgICBwcm9qZWN0aW9uT3B0aW9ucy5ldmVudEhhbmRsZXJJbnRlcmNlcHRvciA9IGNyZWF0ZUV2ZW50SGFuZGxlckludGVyY2VwdG9yKHByb2plY3RvciwgZ2V0UHJvamVjdGlvbiwgcGVyZm9ybWFuY2VMb2dnZXIpO1xyXG4gICAgICAgICAgICBwcm9qZWN0aW9uID0gZG9tRnVuY3Rpb24obm9kZSwgcmVuZGVyRnVuY3Rpb24oKSwgcHJvamVjdGlvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICBwcm9qZWN0aW9ucy5wdXNoKHByb2plY3Rpb24pO1xyXG4gICAgICAgICAgICByZW5kZXJGdW5jdGlvbnMucHVzaChyZW5kZXJGdW5jdGlvbik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2YXIgZG9SZW5kZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaWYgKCFyZW5kZXJDb21wbGV0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gVGhlIGxhc3QgcmVuZGVyIHRocmV3IGFuIGVycm9yLCBpdCBzaG91bGQgaGF2ZSBiZWVuIGxvZ2dlZCBpbiB0aGUgYnJvd3NlciBjb25zb2xlLlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlbmRlckNvbXBsZXRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBwZXJmb3JtYW5jZUxvZ2dlcigncmVuZGVyU3RhcnQnLCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb2plY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdXBkYXRlZFZub2RlID0gcmVuZGVyRnVuY3Rpb25zW2ldKCk7XHJcbiAgICAgICAgICAgICAgICBwZXJmb3JtYW5jZUxvZ2dlcigncmVuZGVyZWQnLCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdGlvbnNbaV0udXBkYXRlKHVwZGF0ZWRWbm9kZSk7XHJcbiAgICAgICAgICAgICAgICBwZXJmb3JtYW5jZUxvZ2dlcigncGF0Y2hlZCcsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcGVyZm9ybWFuY2VMb2dnZXIoJ3JlbmRlckRvbmUnLCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICByZW5kZXJDb21wbGV0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJvamVjdG9yID0ge1xyXG4gICAgICAgICAgICByZW5kZXJOb3c6IGRvUmVuZGVyLFxyXG4gICAgICAgICAgICBzY2hlZHVsZVJlbmRlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFzY2hlZHVsZWQgJiYgIXN0b3BwZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZG9SZW5kZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdG9wOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2NoZWR1bGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoc2NoZWR1bGVkKTtcclxuICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZWQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdG9wcGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVzdW1lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzdG9wcGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJDb21wbGV0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgcHJvamVjdG9yLnNjaGVkdWxlUmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFwcGVuZDogZnVuY3Rpb24gKHBhcmVudE5vZGUsIHJlbmRlckZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRQcm9qZWN0aW9uKGRvbS5hcHBlbmQsIHBhcmVudE5vZGUsIHJlbmRlckZ1bmN0aW9uKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgaW5zZXJ0QmVmb3JlOiBmdW5jdGlvbiAoYmVmb3JlTm9kZSwgcmVuZGVyRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGFkZFByb2plY3Rpb24oZG9tLmluc2VydEJlZm9yZSwgYmVmb3JlTm9kZSwgcmVuZGVyRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBtZXJnZTogZnVuY3Rpb24gKGRvbU5vZGUsIHJlbmRlckZ1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRQcm9qZWN0aW9uKGRvbS5tZXJnZSwgZG9tTm9kZSwgcmVuZGVyRnVuY3Rpb24pO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXBsYWNlOiBmdW5jdGlvbiAoZG9tTm9kZSwgcmVuZGVyRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGFkZFByb2plY3Rpb24oZG9tLnJlcGxhY2UsIGRvbU5vZGUsIHJlbmRlckZ1bmN0aW9uKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGV0YWNoOiBmdW5jdGlvbiAocmVuZGVyRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVuZGVyRnVuY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlbmRlckZ1bmN0aW9uc1tpXSA9PT0gcmVuZGVyRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyRnVuY3Rpb25zLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb2plY3Rpb25zLnNwbGljZShpLCAxKVswXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbmRlckZ1bmN0aW9uIHdhcyBub3QgZm91bmQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHByb2plY3RvcjtcclxuICAgIH07XG5cbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBbW0NhbGN1bGF0aW9uQ2FjaGVdXSBvYmplY3QsIHVzZWZ1bCBmb3IgY2FjaGluZyBbW1ZOb2RlXV0gdHJlZXMuXHJcbiAgICAgKiBJbiBwcmFjdGljZSwgY2FjaGluZyBvZiBbW1ZOb2RlXV0gdHJlZXMgaXMgbm90IG5lZWRlZCwgYmVjYXVzZSBhY2hpZXZpbmcgNjAgZnJhbWVzIHBlciBzZWNvbmQgaXMgYWxtb3N0IG5ldmVyIGEgcHJvYmxlbS5cclxuICAgICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgW1tDYWxjdWxhdGlvbkNhY2hlXV0uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIDxSZXN1bHQ+IFRoZSB0eXBlIG9mIHRoZSB2YWx1ZSB0aGF0IGlzIGNhY2hlZC5cclxuICAgICAqL1xyXG4gICAgdmFyIGNyZWF0ZUNhY2hlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBjYWNoZWRJbnB1dHM7XHJcbiAgICAgICAgdmFyIGNhY2hlZE91dGNvbWU7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaW52YWxpZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgY2FjaGVkT3V0Y29tZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIGNhY2hlZElucHV0cyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVzdWx0OiBmdW5jdGlvbiAoaW5wdXRzLCBjYWxjdWxhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlZElucHV0cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZWRJbnB1dHNbaV0gIT09IGlucHV0c1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FjaGVkT3V0Y29tZSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICghY2FjaGVkT3V0Y29tZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlZE91dGNvbWUgPSBjYWxjdWxhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlZElucHV0cyA9IGlucHV0cztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZWRPdXRjb21lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH07XG5cbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSB7QGxpbmsgTWFwcGluZ30gaW5zdGFuY2UgdGhhdCBrZWVwcyBhbiBhcnJheSBvZiByZXN1bHQgb2JqZWN0cyBzeW5jaHJvbml6ZWQgd2l0aCBhbiBhcnJheSBvZiBzb3VyY2Ugb2JqZWN0cy5cclxuICAgICAqIFNlZSB7QGxpbmsgaHR0cDovL21hcXVldHRlanMub3JnL2RvY3MvYXJyYXlzLmh0bWx8V29ya2luZyB3aXRoIGFycmF5c30uXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIDxTb3VyY2U+ICAgICAgIFRoZSB0eXBlIG9mIHNvdXJjZSBpdGVtcy4gQSBkYXRhYmFzZS1yZWNvcmQgZm9yIGluc3RhbmNlLlxyXG4gICAgICogQHBhcmFtIDxUYXJnZXQ+ICAgICAgIFRoZSB0eXBlIG9mIHRhcmdldCBpdGVtcy4gQSBbW01hcXVldHRlQ29tcG9uZW50XV0gZm9yIGluc3RhbmNlLlxyXG4gICAgICogQHBhcmFtIGdldFNvdXJjZUtleSAgIGBmdW5jdGlvbihzb3VyY2UpYCB0aGF0IG11c3QgcmV0dXJuIGEga2V5IHRvIGlkZW50aWZ5IGVhY2ggc291cmNlIG9iamVjdC4gVGhlIHJlc3VsdCBtdXN0IGVpdGhlciBiZSBhIHN0cmluZyBvciBhIG51bWJlci5cclxuICAgICAqIEBwYXJhbSBjcmVhdGVSZXN1bHQgICBgZnVuY3Rpb24oc291cmNlLCBpbmRleClgIHRoYXQgbXVzdCBjcmVhdGUgYSBuZXcgcmVzdWx0IG9iamVjdCBmcm9tIGEgZ2l2ZW4gc291cmNlLiBUaGlzIGZ1bmN0aW9uIGlzIGlkZW50aWNhbFxyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgIHRvIHRoZSBgY2FsbGJhY2tgIGFyZ3VtZW50IGluIGBBcnJheS5tYXAoY2FsbGJhY2spYC5cclxuICAgICAqIEBwYXJhbSB1cGRhdGVSZXN1bHQgICBgZnVuY3Rpb24oc291cmNlLCB0YXJnZXQsIGluZGV4KWAgdGhhdCB1cGRhdGVzIGEgcmVzdWx0IHRvIGFuIHVwZGF0ZWQgc291cmNlLlxyXG4gICAgICovXHJcbiAgICB2YXIgY3JlYXRlTWFwcGluZyA9IGZ1bmN0aW9uIChnZXRTb3VyY2VLZXksIGNyZWF0ZVJlc3VsdCwgdXBkYXRlUmVzdWx0KSB7XHJcbiAgICAgICAgdmFyIGtleXMgPSBbXTtcclxuICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3VsdHM6IHJlc3VsdHMsXHJcbiAgICAgICAgICAgIG1hcDogZnVuY3Rpb24gKG5ld1NvdXJjZXMpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdLZXlzID0gbmV3U291cmNlcy5tYXAoZ2V0U291cmNlS2V5KTtcclxuICAgICAgICAgICAgICAgIHZhciBvbGRUYXJnZXRzID0gcmVzdWx0cy5zbGljZSgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9sZEluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV3U291cmNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBuZXdTb3VyY2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2VLZXkgPSBuZXdLZXlzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2VLZXkgPT09IGtleXNbb2xkSW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbaV0gPSBvbGRUYXJnZXRzW29sZEluZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlUmVzdWx0KHNvdXJjZSwgb2xkVGFyZ2V0c1tvbGRJbmRleF0sIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbGRJbmRleCsrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAxOyBqIDwga2V5cy5sZW5ndGggKyAxOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZWFyY2hJbmRleCA9IChvbGRJbmRleCArIGopICUga2V5cy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoa2V5c1tzZWFyY2hJbmRleF0gPT09IHNvdXJjZUtleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbaV0gPSBvbGRUYXJnZXRzW3NlYXJjaEluZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVSZXN1bHQobmV3U291cmNlc1tpXSwgb2xkVGFyZ2V0c1tzZWFyY2hJbmRleF0sIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9sZEluZGV4ID0gc2VhcmNoSW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2ldID0gY3JlYXRlUmVzdWx0KHNvdXJjZSwgaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzLmxlbmd0aCA9IG5ld1NvdXJjZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAga2V5cyA9IG5ld0tleXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfTtcblxuICAgIGV4cG9ydHMuY3JlYXRlQ2FjaGUgPSBjcmVhdGVDYWNoZTtcbiAgICBleHBvcnRzLmNyZWF0ZU1hcHBpbmcgPSBjcmVhdGVNYXBwaW5nO1xuICAgIGV4cG9ydHMuY3JlYXRlUHJvamVjdG9yID0gY3JlYXRlUHJvamVjdG9yO1xuICAgIGV4cG9ydHMuZG9tID0gZG9tO1xuICAgIGV4cG9ydHMuaCA9IGg7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSk7XG4iLCIvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy9cbi8vIFFSIENvZGUgR2VuZXJhdG9yIGZvciBKYXZhU2NyaXB0XG4vL1xuLy8gQ29weXJpZ2h0IChjKSAyMDA5IEthenVoaWtvIEFyYXNlXG4vL1xuLy8gVVJMOiBodHRwOi8vd3d3LmQtcHJvamVjdC5jb20vXG4vL1xuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlOlxuLy8gIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4vL1xuLy8gVGhlIHdvcmQgJ1FSIENvZGUnIGlzIHJlZ2lzdGVyZWQgdHJhZGVtYXJrIG9mXG4vLyBERU5TTyBXQVZFIElOQ09SUE9SQVRFRFxuLy8gIGh0dHA6Ly93d3cuZGVuc28td2F2ZS5jb20vcXJjb2RlL2ZhcXBhdGVudC1lLmh0bWxcbi8vXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG52YXIgcXJjb2RlID0gZnVuY3Rpb24oKSB7XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcXJjb2RlXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIHFyY29kZVxuICAgKiBAcGFyYW0gdHlwZU51bWJlciAxIHRvIDQwXG4gICAqIEBwYXJhbSBlcnJvckNvcnJlY3Rpb25MZXZlbCAnTCcsJ00nLCdRJywnSCdcbiAgICovXG4gIHZhciBxcmNvZGUgPSBmdW5jdGlvbih0eXBlTnVtYmVyLCBlcnJvckNvcnJlY3Rpb25MZXZlbCkge1xuXG4gICAgdmFyIFBBRDAgPSAweEVDO1xuICAgIHZhciBQQUQxID0gMHgxMTtcblxuICAgIHZhciBfdHlwZU51bWJlciA9IHR5cGVOdW1iZXI7XG4gICAgdmFyIF9lcnJvckNvcnJlY3Rpb25MZXZlbCA9IFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWxbZXJyb3JDb3JyZWN0aW9uTGV2ZWxdO1xuICAgIHZhciBfbW9kdWxlcyA9IG51bGw7XG4gICAgdmFyIF9tb2R1bGVDb3VudCA9IDA7XG4gICAgdmFyIF9kYXRhQ2FjaGUgPSBudWxsO1xuICAgIHZhciBfZGF0YUxpc3QgPSBbXTtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgdmFyIG1ha2VJbXBsID0gZnVuY3Rpb24odGVzdCwgbWFza1BhdHRlcm4pIHtcblxuICAgICAgX21vZHVsZUNvdW50ID0gX3R5cGVOdW1iZXIgKiA0ICsgMTc7XG4gICAgICBfbW9kdWxlcyA9IGZ1bmN0aW9uKG1vZHVsZUNvdW50KSB7XG4gICAgICAgIHZhciBtb2R1bGVzID0gbmV3IEFycmF5KG1vZHVsZUNvdW50KTtcbiAgICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQ7IHJvdyArPSAxKSB7XG4gICAgICAgICAgbW9kdWxlc1tyb3ddID0gbmV3IEFycmF5KG1vZHVsZUNvdW50KTtcbiAgICAgICAgICBmb3IgKHZhciBjb2wgPSAwOyBjb2wgPCBtb2R1bGVDb3VudDsgY29sICs9IDEpIHtcbiAgICAgICAgICAgIG1vZHVsZXNbcm93XVtjb2xdID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1vZHVsZXM7XG4gICAgICB9KF9tb2R1bGVDb3VudCk7XG5cbiAgICAgIHNldHVwUG9zaXRpb25Qcm9iZVBhdHRlcm4oMCwgMCk7XG4gICAgICBzZXR1cFBvc2l0aW9uUHJvYmVQYXR0ZXJuKF9tb2R1bGVDb3VudCAtIDcsIDApO1xuICAgICAgc2V0dXBQb3NpdGlvblByb2JlUGF0dGVybigwLCBfbW9kdWxlQ291bnQgLSA3KTtcbiAgICAgIHNldHVwUG9zaXRpb25BZGp1c3RQYXR0ZXJuKCk7XG4gICAgICBzZXR1cFRpbWluZ1BhdHRlcm4oKTtcbiAgICAgIHNldHVwVHlwZUluZm8odGVzdCwgbWFza1BhdHRlcm4pO1xuXG4gICAgICBpZiAoX3R5cGVOdW1iZXIgPj0gNykge1xuICAgICAgICBzZXR1cFR5cGVOdW1iZXIodGVzdCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChfZGF0YUNhY2hlID09IG51bGwpIHtcbiAgICAgICAgX2RhdGFDYWNoZSA9IGNyZWF0ZURhdGEoX3R5cGVOdW1iZXIsIF9lcnJvckNvcnJlY3Rpb25MZXZlbCwgX2RhdGFMaXN0KTtcbiAgICAgIH1cblxuICAgICAgbWFwRGF0YShfZGF0YUNhY2hlLCBtYXNrUGF0dGVybik7XG4gICAgfTtcblxuICAgIHZhciBzZXR1cFBvc2l0aW9uUHJvYmVQYXR0ZXJuID0gZnVuY3Rpb24ocm93LCBjb2wpIHtcblxuICAgICAgZm9yICh2YXIgciA9IC0xOyByIDw9IDc7IHIgKz0gMSkge1xuXG4gICAgICAgIGlmIChyb3cgKyByIDw9IC0xIHx8IF9tb2R1bGVDb3VudCA8PSByb3cgKyByKSBjb250aW51ZTtcblxuICAgICAgICBmb3IgKHZhciBjID0gLTE7IGMgPD0gNzsgYyArPSAxKSB7XG5cbiAgICAgICAgICBpZiAoY29sICsgYyA8PSAtMSB8fCBfbW9kdWxlQ291bnQgPD0gY29sICsgYykgY29udGludWU7XG5cbiAgICAgICAgICBpZiAoICgwIDw9IHIgJiYgciA8PSA2ICYmIChjID09IDAgfHwgYyA9PSA2KSApXG4gICAgICAgICAgICAgIHx8ICgwIDw9IGMgJiYgYyA8PSA2ICYmIChyID09IDAgfHwgciA9PSA2KSApXG4gICAgICAgICAgICAgIHx8ICgyIDw9IHIgJiYgciA8PSA0ICYmIDIgPD0gYyAmJiBjIDw9IDQpICkge1xuICAgICAgICAgICAgX21vZHVsZXNbcm93ICsgcl1bY29sICsgY10gPSB0cnVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBfbW9kdWxlc1tyb3cgKyByXVtjb2wgKyBjXSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0QmVzdE1hc2tQYXR0ZXJuID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBtaW5Mb3N0UG9pbnQgPSAwO1xuICAgICAgdmFyIHBhdHRlcm4gPSAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDg7IGkgKz0gMSkge1xuXG4gICAgICAgIG1ha2VJbXBsKHRydWUsIGkpO1xuXG4gICAgICAgIHZhciBsb3N0UG9pbnQgPSBRUlV0aWwuZ2V0TG9zdFBvaW50KF90aGlzKTtcblxuICAgICAgICBpZiAoaSA9PSAwIHx8IG1pbkxvc3RQb2ludCA+IGxvc3RQb2ludCkge1xuICAgICAgICAgIG1pbkxvc3RQb2ludCA9IGxvc3RQb2ludDtcbiAgICAgICAgICBwYXR0ZXJuID0gaTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGF0dGVybjtcbiAgICB9O1xuXG4gICAgdmFyIHNldHVwVGltaW5nUGF0dGVybiA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICBmb3IgKHZhciByID0gODsgciA8IF9tb2R1bGVDb3VudCAtIDg7IHIgKz0gMSkge1xuICAgICAgICBpZiAoX21vZHVsZXNbcl1bNl0gIT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIF9tb2R1bGVzW3JdWzZdID0gKHIgJSAyID09IDApO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBjID0gODsgYyA8IF9tb2R1bGVDb3VudCAtIDg7IGMgKz0gMSkge1xuICAgICAgICBpZiAoX21vZHVsZXNbNl1bY10gIT0gbnVsbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIF9tb2R1bGVzWzZdW2NdID0gKGMgJSAyID09IDApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgc2V0dXBQb3NpdGlvbkFkanVzdFBhdHRlcm4gPSBmdW5jdGlvbigpIHtcblxuICAgICAgdmFyIHBvcyA9IFFSVXRpbC5nZXRQYXR0ZXJuUG9zaXRpb24oX3R5cGVOdW1iZXIpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBvcy5sZW5ndGg7IGkgKz0gMSkge1xuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcG9zLmxlbmd0aDsgaiArPSAxKSB7XG5cbiAgICAgICAgICB2YXIgcm93ID0gcG9zW2ldO1xuICAgICAgICAgIHZhciBjb2wgPSBwb3Nbal07XG5cbiAgICAgICAgICBpZiAoX21vZHVsZXNbcm93XVtjb2xdICE9IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAodmFyIHIgPSAtMjsgciA8PSAyOyByICs9IDEpIHtcblxuICAgICAgICAgICAgZm9yICh2YXIgYyA9IC0yOyBjIDw9IDI7IGMgKz0gMSkge1xuXG4gICAgICAgICAgICAgIGlmIChyID09IC0yIHx8IHIgPT0gMiB8fCBjID09IC0yIHx8IGMgPT0gMlxuICAgICAgICAgICAgICAgICAgfHwgKHIgPT0gMCAmJiBjID09IDApICkge1xuICAgICAgICAgICAgICAgIF9tb2R1bGVzW3JvdyArIHJdW2NvbCArIGNdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfbW9kdWxlc1tyb3cgKyByXVtjb2wgKyBjXSA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBzZXR1cFR5cGVOdW1iZXIgPSBmdW5jdGlvbih0ZXN0KSB7XG5cbiAgICAgIHZhciBiaXRzID0gUVJVdGlsLmdldEJDSFR5cGVOdW1iZXIoX3R5cGVOdW1iZXIpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE4OyBpICs9IDEpIHtcbiAgICAgICAgdmFyIG1vZCA9ICghdGVzdCAmJiAoIChiaXRzID4+IGkpICYgMSkgPT0gMSk7XG4gICAgICAgIF9tb2R1bGVzW01hdGguZmxvb3IoaSAvIDMpXVtpICUgMyArIF9tb2R1bGVDb3VudCAtIDggLSAzXSA9IG1vZDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxODsgaSArPSAxKSB7XG4gICAgICAgIHZhciBtb2QgPSAoIXRlc3QgJiYgKCAoYml0cyA+PiBpKSAmIDEpID09IDEpO1xuICAgICAgICBfbW9kdWxlc1tpICUgMyArIF9tb2R1bGVDb3VudCAtIDggLSAzXVtNYXRoLmZsb29yKGkgLyAzKV0gPSBtb2Q7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciBzZXR1cFR5cGVJbmZvID0gZnVuY3Rpb24odGVzdCwgbWFza1BhdHRlcm4pIHtcblxuICAgICAgdmFyIGRhdGEgPSAoX2Vycm9yQ29ycmVjdGlvbkxldmVsIDw8IDMpIHwgbWFza1BhdHRlcm47XG4gICAgICB2YXIgYml0cyA9IFFSVXRpbC5nZXRCQ0hUeXBlSW5mbyhkYXRhKTtcblxuICAgICAgLy8gdmVydGljYWxcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTU7IGkgKz0gMSkge1xuXG4gICAgICAgIHZhciBtb2QgPSAoIXRlc3QgJiYgKCAoYml0cyA+PiBpKSAmIDEpID09IDEpO1xuXG4gICAgICAgIGlmIChpIDwgNikge1xuICAgICAgICAgIF9tb2R1bGVzW2ldWzhdID0gbW9kO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPCA4KSB7XG4gICAgICAgICAgX21vZHVsZXNbaSArIDFdWzhdID0gbW9kO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9tb2R1bGVzW19tb2R1bGVDb3VudCAtIDE1ICsgaV1bOF0gPSBtb2Q7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gaG9yaXpvbnRhbFxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxNTsgaSArPSAxKSB7XG5cbiAgICAgICAgdmFyIG1vZCA9ICghdGVzdCAmJiAoIChiaXRzID4+IGkpICYgMSkgPT0gMSk7XG5cbiAgICAgICAgaWYgKGkgPCA4KSB7XG4gICAgICAgICAgX21vZHVsZXNbOF1bX21vZHVsZUNvdW50IC0gaSAtIDFdID0gbW9kO1xuICAgICAgICB9IGVsc2UgaWYgKGkgPCA5KSB7XG4gICAgICAgICAgX21vZHVsZXNbOF1bMTUgLSBpIC0gMSArIDFdID0gbW9kO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9tb2R1bGVzWzhdWzE1IC0gaSAtIDFdID0gbW9kO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGZpeGVkIG1vZHVsZVxuICAgICAgX21vZHVsZXNbX21vZHVsZUNvdW50IC0gOF1bOF0gPSAoIXRlc3QpO1xuICAgIH07XG5cbiAgICB2YXIgbWFwRGF0YSA9IGZ1bmN0aW9uKGRhdGEsIG1hc2tQYXR0ZXJuKSB7XG5cbiAgICAgIHZhciBpbmMgPSAtMTtcbiAgICAgIHZhciByb3cgPSBfbW9kdWxlQ291bnQgLSAxO1xuICAgICAgdmFyIGJpdEluZGV4ID0gNztcbiAgICAgIHZhciBieXRlSW5kZXggPSAwO1xuICAgICAgdmFyIG1hc2tGdW5jID0gUVJVdGlsLmdldE1hc2tGdW5jdGlvbihtYXNrUGF0dGVybik7XG5cbiAgICAgIGZvciAodmFyIGNvbCA9IF9tb2R1bGVDb3VudCAtIDE7IGNvbCA+IDA7IGNvbCAtPSAyKSB7XG5cbiAgICAgICAgaWYgKGNvbCA9PSA2KSBjb2wgLT0gMTtcblxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuXG4gICAgICAgICAgZm9yICh2YXIgYyA9IDA7IGMgPCAyOyBjICs9IDEpIHtcblxuICAgICAgICAgICAgaWYgKF9tb2R1bGVzW3Jvd11bY29sIC0gY10gPT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgIHZhciBkYXJrID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgaWYgKGJ5dGVJbmRleCA8IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgZGFyayA9ICggKCAoZGF0YVtieXRlSW5kZXhdID4+PiBiaXRJbmRleCkgJiAxKSA9PSAxKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciBtYXNrID0gbWFza0Z1bmMocm93LCBjb2wgLSBjKTtcblxuICAgICAgICAgICAgICBpZiAobWFzaykge1xuICAgICAgICAgICAgICAgIGRhcmsgPSAhZGFyaztcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIF9tb2R1bGVzW3Jvd11bY29sIC0gY10gPSBkYXJrO1xuICAgICAgICAgICAgICBiaXRJbmRleCAtPSAxO1xuXG4gICAgICAgICAgICAgIGlmIChiaXRJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgIGJ5dGVJbmRleCArPSAxO1xuICAgICAgICAgICAgICAgIGJpdEluZGV4ID0gNztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJvdyArPSBpbmM7XG5cbiAgICAgICAgICBpZiAocm93IDwgMCB8fCBfbW9kdWxlQ291bnQgPD0gcm93KSB7XG4gICAgICAgICAgICByb3cgLT0gaW5jO1xuICAgICAgICAgICAgaW5jID0gLWluYztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgY3JlYXRlQnl0ZXMgPSBmdW5jdGlvbihidWZmZXIsIHJzQmxvY2tzKSB7XG5cbiAgICAgIHZhciBvZmZzZXQgPSAwO1xuXG4gICAgICB2YXIgbWF4RGNDb3VudCA9IDA7XG4gICAgICB2YXIgbWF4RWNDb3VudCA9IDA7XG5cbiAgICAgIHZhciBkY2RhdGEgPSBuZXcgQXJyYXkocnNCbG9ja3MubGVuZ3RoKTtcbiAgICAgIHZhciBlY2RhdGEgPSBuZXcgQXJyYXkocnNCbG9ja3MubGVuZ3RoKTtcblxuICAgICAgZm9yICh2YXIgciA9IDA7IHIgPCByc0Jsb2Nrcy5sZW5ndGg7IHIgKz0gMSkge1xuXG4gICAgICAgIHZhciBkY0NvdW50ID0gcnNCbG9ja3Nbcl0uZGF0YUNvdW50O1xuICAgICAgICB2YXIgZWNDb3VudCA9IHJzQmxvY2tzW3JdLnRvdGFsQ291bnQgLSBkY0NvdW50O1xuXG4gICAgICAgIG1heERjQ291bnQgPSBNYXRoLm1heChtYXhEY0NvdW50LCBkY0NvdW50KTtcbiAgICAgICAgbWF4RWNDb3VudCA9IE1hdGgubWF4KG1heEVjQ291bnQsIGVjQ291bnQpO1xuXG4gICAgICAgIGRjZGF0YVtyXSA9IG5ldyBBcnJheShkY0NvdW50KTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRjZGF0YVtyXS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIGRjZGF0YVtyXVtpXSA9IDB4ZmYgJiBidWZmZXIuZ2V0QnVmZmVyKClbaSArIG9mZnNldF07XG4gICAgICAgIH1cbiAgICAgICAgb2Zmc2V0ICs9IGRjQ291bnQ7XG5cbiAgICAgICAgdmFyIHJzUG9seSA9IFFSVXRpbC5nZXRFcnJvckNvcnJlY3RQb2x5bm9taWFsKGVjQ291bnQpO1xuICAgICAgICB2YXIgcmF3UG9seSA9IHFyUG9seW5vbWlhbChkY2RhdGFbcl0sIHJzUG9seS5nZXRMZW5ndGgoKSAtIDEpO1xuXG4gICAgICAgIHZhciBtb2RQb2x5ID0gcmF3UG9seS5tb2QocnNQb2x5KTtcbiAgICAgICAgZWNkYXRhW3JdID0gbmV3IEFycmF5KHJzUG9seS5nZXRMZW5ndGgoKSAtIDEpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVjZGF0YVtyXS5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgIHZhciBtb2RJbmRleCA9IGkgKyBtb2RQb2x5LmdldExlbmd0aCgpIC0gZWNkYXRhW3JdLmxlbmd0aDtcbiAgICAgICAgICBlY2RhdGFbcl1baV0gPSAobW9kSW5kZXggPj0gMCk/IG1vZFBvbHkuZ2V0QXQobW9kSW5kZXgpIDogMDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgdG90YWxDb2RlQ291bnQgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByc0Jsb2Nrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB0b3RhbENvZGVDb3VudCArPSByc0Jsb2Nrc1tpXS50b3RhbENvdW50O1xuICAgICAgfVxuXG4gICAgICB2YXIgZGF0YSA9IG5ldyBBcnJheSh0b3RhbENvZGVDb3VudCk7XG4gICAgICB2YXIgaW5kZXggPSAwO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1heERjQ291bnQ7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKHZhciByID0gMDsgciA8IHJzQmxvY2tzLmxlbmd0aDsgciArPSAxKSB7XG4gICAgICAgICAgaWYgKGkgPCBkY2RhdGFbcl0ubGVuZ3RoKSB7XG4gICAgICAgICAgICBkYXRhW2luZGV4XSA9IGRjZGF0YVtyXVtpXTtcbiAgICAgICAgICAgIGluZGV4ICs9IDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWF4RWNDb3VudDsgaSArPSAxKSB7XG4gICAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgcnNCbG9ja3MubGVuZ3RoOyByICs9IDEpIHtcbiAgICAgICAgICBpZiAoaSA8IGVjZGF0YVtyXS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGRhdGFbaW5kZXhdID0gZWNkYXRhW3JdW2ldO1xuICAgICAgICAgICAgaW5kZXggKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfTtcblxuICAgIHZhciBjcmVhdGVEYXRhID0gZnVuY3Rpb24odHlwZU51bWJlciwgZXJyb3JDb3JyZWN0aW9uTGV2ZWwsIGRhdGFMaXN0KSB7XG5cbiAgICAgIHZhciByc0Jsb2NrcyA9IFFSUlNCbG9jay5nZXRSU0Jsb2Nrcyh0eXBlTnVtYmVyLCBlcnJvckNvcnJlY3Rpb25MZXZlbCk7XG5cbiAgICAgIHZhciBidWZmZXIgPSBxckJpdEJ1ZmZlcigpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGFMaXN0Lmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIHZhciBkYXRhID0gZGF0YUxpc3RbaV07XG4gICAgICAgIGJ1ZmZlci5wdXQoZGF0YS5nZXRNb2RlKCksIDQpO1xuICAgICAgICBidWZmZXIucHV0KGRhdGEuZ2V0TGVuZ3RoKCksIFFSVXRpbC5nZXRMZW5ndGhJbkJpdHMoZGF0YS5nZXRNb2RlKCksIHR5cGVOdW1iZXIpICk7XG4gICAgICAgIGRhdGEud3JpdGUoYnVmZmVyKTtcbiAgICAgIH1cblxuICAgICAgLy8gY2FsYyBudW0gbWF4IGRhdGEuXG4gICAgICB2YXIgdG90YWxEYXRhQ291bnQgPSAwO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByc0Jsb2Nrcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB0b3RhbERhdGFDb3VudCArPSByc0Jsb2Nrc1tpXS5kYXRhQ291bnQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgPiB0b3RhbERhdGFDb3VudCAqIDgpIHtcbiAgICAgICAgdGhyb3cgJ2NvZGUgbGVuZ3RoIG92ZXJmbG93LiAoJ1xuICAgICAgICAgICsgYnVmZmVyLmdldExlbmd0aEluQml0cygpXG4gICAgICAgICAgKyAnPidcbiAgICAgICAgICArIHRvdGFsRGF0YUNvdW50ICogOFxuICAgICAgICAgICsgJyknO1xuICAgICAgfVxuXG4gICAgICAvLyBlbmQgY29kZVxuICAgICAgaWYgKGJ1ZmZlci5nZXRMZW5ndGhJbkJpdHMoKSArIDQgPD0gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgIGJ1ZmZlci5wdXQoMCwgNCk7XG4gICAgICB9XG5cbiAgICAgIC8vIHBhZGRpbmdcbiAgICAgIHdoaWxlIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgJSA4ICE9IDApIHtcbiAgICAgICAgYnVmZmVyLnB1dEJpdChmYWxzZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIHBhZGRpbmdcbiAgICAgIHdoaWxlICh0cnVlKSB7XG5cbiAgICAgICAgaWYgKGJ1ZmZlci5nZXRMZW5ndGhJbkJpdHMoKSA+PSB0b3RhbERhdGFDb3VudCAqIDgpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBidWZmZXIucHV0KFBBRDAsIDgpO1xuXG4gICAgICAgIGlmIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgPj0gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgYnVmZmVyLnB1dChQQUQxLCA4KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNyZWF0ZUJ5dGVzKGJ1ZmZlciwgcnNCbG9ja3MpO1xuICAgIH07XG5cbiAgICBfdGhpcy5hZGREYXRhID0gZnVuY3Rpb24oZGF0YSwgbW9kZSkge1xuXG4gICAgICBtb2RlID0gbW9kZSB8fCAnQnl0ZSc7XG5cbiAgICAgIHZhciBuZXdEYXRhID0gbnVsbDtcblxuICAgICAgc3dpdGNoKG1vZGUpIHtcbiAgICAgIGNhc2UgJ051bWVyaWMnIDpcbiAgICAgICAgbmV3RGF0YSA9IHFyTnVtYmVyKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0FscGhhbnVtZXJpYycgOlxuICAgICAgICBuZXdEYXRhID0gcXJBbHBoYU51bShkYXRhKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdCeXRlJyA6XG4gICAgICAgIG5ld0RhdGEgPSBxcjhCaXRCeXRlKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0thbmppJyA6XG4gICAgICAgIG5ld0RhdGEgPSBxckthbmppKGRhdGEpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQgOlxuICAgICAgICB0aHJvdyAnbW9kZTonICsgbW9kZTtcbiAgICAgIH1cblxuICAgICAgX2RhdGFMaXN0LnB1c2gobmV3RGF0YSk7XG4gICAgICBfZGF0YUNhY2hlID0gbnVsbDtcbiAgICB9O1xuXG4gICAgX3RoaXMuaXNEYXJrID0gZnVuY3Rpb24ocm93LCBjb2wpIHtcbiAgICAgIGlmIChyb3cgPCAwIHx8IF9tb2R1bGVDb3VudCA8PSByb3cgfHwgY29sIDwgMCB8fCBfbW9kdWxlQ291bnQgPD0gY29sKSB7XG4gICAgICAgIHRocm93IHJvdyArICcsJyArIGNvbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBfbW9kdWxlc1tyb3ddW2NvbF07XG4gICAgfTtcblxuICAgIF90aGlzLmdldE1vZHVsZUNvdW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gX21vZHVsZUNvdW50O1xuICAgIH07XG5cbiAgICBfdGhpcy5tYWtlID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoX3R5cGVOdW1iZXIgPCAxKSB7XG4gICAgICAgIHZhciB0eXBlTnVtYmVyID0gMTtcblxuICAgICAgICBmb3IgKDsgdHlwZU51bWJlciA8IDQwOyB0eXBlTnVtYmVyKyspIHtcbiAgICAgICAgICB2YXIgcnNCbG9ja3MgPSBRUlJTQmxvY2suZ2V0UlNCbG9ja3ModHlwZU51bWJlciwgX2Vycm9yQ29ycmVjdGlvbkxldmVsKTtcbiAgICAgICAgICB2YXIgYnVmZmVyID0gcXJCaXRCdWZmZXIoKTtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX2RhdGFMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IF9kYXRhTGlzdFtpXTtcbiAgICAgICAgICAgIGJ1ZmZlci5wdXQoZGF0YS5nZXRNb2RlKCksIDQpO1xuICAgICAgICAgICAgYnVmZmVyLnB1dChkYXRhLmdldExlbmd0aCgpLCBRUlV0aWwuZ2V0TGVuZ3RoSW5CaXRzKGRhdGEuZ2V0TW9kZSgpLCB0eXBlTnVtYmVyKSApO1xuICAgICAgICAgICAgZGF0YS53cml0ZShidWZmZXIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHZhciB0b3RhbERhdGFDb3VudCA9IDA7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByc0Jsb2Nrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdG90YWxEYXRhQ291bnQgKz0gcnNCbG9ja3NbaV0uZGF0YUNvdW50O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChidWZmZXIuZ2V0TGVuZ3RoSW5CaXRzKCkgPD0gdG90YWxEYXRhQ291bnQgKiA4KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBfdHlwZU51bWJlciA9IHR5cGVOdW1iZXI7XG4gICAgICB9XG5cbiAgICAgIG1ha2VJbXBsKGZhbHNlLCBnZXRCZXN0TWFza1BhdHRlcm4oKSApO1xuICAgIH07XG5cbiAgICBfdGhpcy5jcmVhdGVUYWJsZVRhZyA9IGZ1bmN0aW9uKGNlbGxTaXplLCBtYXJnaW4pIHtcblxuICAgICAgY2VsbFNpemUgPSBjZWxsU2l6ZSB8fCAyO1xuICAgICAgbWFyZ2luID0gKHR5cGVvZiBtYXJnaW4gPT0gJ3VuZGVmaW5lZCcpPyBjZWxsU2l6ZSAqIDQgOiBtYXJnaW47XG5cbiAgICAgIHZhciBxckh0bWwgPSAnJztcblxuICAgICAgcXJIdG1sICs9ICc8dGFibGUgc3R5bGU9XCInO1xuICAgICAgcXJIdG1sICs9ICcgYm9yZGVyLXdpZHRoOiAwcHg7IGJvcmRlci1zdHlsZTogbm9uZTsnO1xuICAgICAgcXJIdG1sICs9ICcgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsnO1xuICAgICAgcXJIdG1sICs9ICcgcGFkZGluZzogMHB4OyBtYXJnaW46ICcgKyBtYXJnaW4gKyAncHg7JztcbiAgICAgIHFySHRtbCArPSAnXCI+JztcbiAgICAgIHFySHRtbCArPSAnPHRib2R5Pic7XG5cbiAgICAgIGZvciAodmFyIHIgPSAwOyByIDwgX3RoaXMuZ2V0TW9kdWxlQ291bnQoKTsgciArPSAxKSB7XG5cbiAgICAgICAgcXJIdG1sICs9ICc8dHI+JztcblxuICAgICAgICBmb3IgKHZhciBjID0gMDsgYyA8IF90aGlzLmdldE1vZHVsZUNvdW50KCk7IGMgKz0gMSkge1xuICAgICAgICAgIHFySHRtbCArPSAnPHRkIHN0eWxlPVwiJztcbiAgICAgICAgICBxckh0bWwgKz0gJyBib3JkZXItd2lkdGg6IDBweDsgYm9yZGVyLXN0eWxlOiBub25lOyc7XG4gICAgICAgICAgcXJIdG1sICs9ICcgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTsnO1xuICAgICAgICAgIHFySHRtbCArPSAnIHBhZGRpbmc6IDBweDsgbWFyZ2luOiAwcHg7JztcbiAgICAgICAgICBxckh0bWwgKz0gJyB3aWR0aDogJyArIGNlbGxTaXplICsgJ3B4Oyc7XG4gICAgICAgICAgcXJIdG1sICs9ICcgaGVpZ2h0OiAnICsgY2VsbFNpemUgKyAncHg7JztcbiAgICAgICAgICBxckh0bWwgKz0gJyBiYWNrZ3JvdW5kLWNvbG9yOiAnO1xuICAgICAgICAgIHFySHRtbCArPSBfdGhpcy5pc0RhcmsociwgYyk/ICcjMDAwMDAwJyA6ICcjZmZmZmZmJztcbiAgICAgICAgICBxckh0bWwgKz0gJzsnO1xuICAgICAgICAgIHFySHRtbCArPSAnXCIvPic7XG4gICAgICAgIH1cblxuICAgICAgICBxckh0bWwgKz0gJzwvdHI+JztcbiAgICAgIH1cblxuICAgICAgcXJIdG1sICs9ICc8L3Rib2R5Pic7XG4gICAgICBxckh0bWwgKz0gJzwvdGFibGU+JztcblxuICAgICAgcmV0dXJuIHFySHRtbDtcbiAgICB9O1xuXG4gICAgX3RoaXMuY3JlYXRlU3ZnVGFnID0gZnVuY3Rpb24oY2VsbFNpemUsIG1hcmdpbikge1xuXG4gICAgICB2YXIgb3B0cyA9IHt9O1xuICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gQ2FsbGVkIGJ5IG9wdGlvbnMuXG4gICAgICAgIG9wdHMgPSBhcmd1bWVudHNbMF07XG4gICAgICAgIC8vIG92ZXJ3cml0ZSBjZWxsU2l6ZSBhbmQgbWFyZ2luLlxuICAgICAgICBjZWxsU2l6ZSA9IG9wdHMuY2VsbFNpemU7XG4gICAgICAgIG1hcmdpbiA9IG9wdHMubWFyZ2luO1xuICAgICAgfVxuXG4gICAgICBjZWxsU2l6ZSA9IGNlbGxTaXplIHx8IDI7XG4gICAgICBtYXJnaW4gPSAodHlwZW9mIG1hcmdpbiA9PSAndW5kZWZpbmVkJyk/IGNlbGxTaXplICogNCA6IG1hcmdpbjtcbiAgICAgIHZhciBzaXplID0gX3RoaXMuZ2V0TW9kdWxlQ291bnQoKSAqIGNlbGxTaXplICsgbWFyZ2luICogMjtcbiAgICAgIHZhciBjLCBtYywgciwgbXIsIHFyU3ZnPScnLCByZWN0O1xuXG4gICAgICByZWN0ID0gJ2wnICsgY2VsbFNpemUgKyAnLDAgMCwnICsgY2VsbFNpemUgK1xuICAgICAgICAnIC0nICsgY2VsbFNpemUgKyAnLDAgMCwtJyArIGNlbGxTaXplICsgJ3ogJztcblxuICAgICAgcXJTdmcgKz0gJzxzdmcgdmVyc2lvbj1cIjEuMVwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIic7XG4gICAgICBxclN2ZyArPSAhb3B0cy5zY2FsYWJsZSA/ICcgd2lkdGg9XCInICsgc2l6ZSArICdweFwiIGhlaWdodD1cIicgKyBzaXplICsgJ3B4XCInIDogJyc7XG4gICAgICBxclN2ZyArPSAnIHZpZXdCb3g9XCIwIDAgJyArIHNpemUgKyAnICcgKyBzaXplICsgJ1wiICc7XG4gICAgICBxclN2ZyArPSAnIHByZXNlcnZlQXNwZWN0UmF0aW89XCJ4TWluWU1pbiBtZWV0XCI+JztcbiAgICAgIHFyU3ZnICs9ICc8cmVjdCB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgZmlsbD1cIndoaXRlXCIgY3g9XCIwXCIgY3k9XCIwXCIvPic7XG4gICAgICBxclN2ZyArPSAnPHBhdGggZD1cIic7XG5cbiAgICAgIGZvciAociA9IDA7IHIgPCBfdGhpcy5nZXRNb2R1bGVDb3VudCgpOyByICs9IDEpIHtcbiAgICAgICAgbXIgPSByICogY2VsbFNpemUgKyBtYXJnaW47XG4gICAgICAgIGZvciAoYyA9IDA7IGMgPCBfdGhpcy5nZXRNb2R1bGVDb3VudCgpOyBjICs9IDEpIHtcbiAgICAgICAgICBpZiAoX3RoaXMuaXNEYXJrKHIsIGMpICkge1xuICAgICAgICAgICAgbWMgPSBjKmNlbGxTaXplK21hcmdpbjtcbiAgICAgICAgICAgIHFyU3ZnICs9ICdNJyArIG1jICsgJywnICsgbXIgKyByZWN0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBxclN2ZyArPSAnXCIgc3Ryb2tlPVwidHJhbnNwYXJlbnRcIiBmaWxsPVwiYmxhY2tcIi8+JztcbiAgICAgIHFyU3ZnICs9ICc8L3N2Zz4nO1xuXG4gICAgICByZXR1cm4gcXJTdmc7XG4gICAgfTtcblxuICAgIF90aGlzLmNyZWF0ZURhdGFVUkwgPSBmdW5jdGlvbihjZWxsU2l6ZSwgbWFyZ2luKSB7XG5cbiAgICAgIGNlbGxTaXplID0gY2VsbFNpemUgfHwgMjtcbiAgICAgIG1hcmdpbiA9ICh0eXBlb2YgbWFyZ2luID09ICd1bmRlZmluZWQnKT8gY2VsbFNpemUgKiA0IDogbWFyZ2luO1xuXG4gICAgICB2YXIgc2l6ZSA9IF90aGlzLmdldE1vZHVsZUNvdW50KCkgKiBjZWxsU2l6ZSArIG1hcmdpbiAqIDI7XG4gICAgICB2YXIgbWluID0gbWFyZ2luO1xuICAgICAgdmFyIG1heCA9IHNpemUgLSBtYXJnaW47XG5cbiAgICAgIHJldHVybiBjcmVhdGVEYXRhVVJMKHNpemUsIHNpemUsIGZ1bmN0aW9uKHgsIHkpIHtcbiAgICAgICAgaWYgKG1pbiA8PSB4ICYmIHggPCBtYXggJiYgbWluIDw9IHkgJiYgeSA8IG1heCkge1xuICAgICAgICAgIHZhciBjID0gTWF0aC5mbG9vciggKHggLSBtaW4pIC8gY2VsbFNpemUpO1xuICAgICAgICAgIHZhciByID0gTWF0aC5mbG9vciggKHkgLSBtaW4pIC8gY2VsbFNpemUpO1xuICAgICAgICAgIHJldHVybiBfdGhpcy5pc0RhcmsociwgYyk/IDAgOiAxO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICB9ICk7XG4gICAgfTtcblxuICAgIF90aGlzLmNyZWF0ZUltZ1RhZyA9IGZ1bmN0aW9uKGNlbGxTaXplLCBtYXJnaW4sIGFsdCkge1xuXG4gICAgICBjZWxsU2l6ZSA9IGNlbGxTaXplIHx8IDI7XG4gICAgICBtYXJnaW4gPSAodHlwZW9mIG1hcmdpbiA9PSAndW5kZWZpbmVkJyk/IGNlbGxTaXplICogNCA6IG1hcmdpbjtcblxuICAgICAgdmFyIHNpemUgPSBfdGhpcy5nZXRNb2R1bGVDb3VudCgpICogY2VsbFNpemUgKyBtYXJnaW4gKiAyO1xuXG4gICAgICB2YXIgaW1nID0gJyc7XG4gICAgICBpbWcgKz0gJzxpbWcnO1xuICAgICAgaW1nICs9ICdcXHUwMDIwc3JjPVwiJztcbiAgICAgIGltZyArPSBfdGhpcy5jcmVhdGVEYXRhVVJMKGNlbGxTaXplLCBtYXJnaW4pO1xuICAgICAgaW1nICs9ICdcIic7XG4gICAgICBpbWcgKz0gJ1xcdTAwMjB3aWR0aD1cIic7XG4gICAgICBpbWcgKz0gc2l6ZTtcbiAgICAgIGltZyArPSAnXCInO1xuICAgICAgaW1nICs9ICdcXHUwMDIwaGVpZ2h0PVwiJztcbiAgICAgIGltZyArPSBzaXplO1xuICAgICAgaW1nICs9ICdcIic7XG4gICAgICBpZiAoYWx0KSB7XG4gICAgICAgIGltZyArPSAnXFx1MDAyMGFsdD1cIic7XG4gICAgICAgIGltZyArPSBhbHQ7XG4gICAgICAgIGltZyArPSAnXCInO1xuICAgICAgfVxuICAgICAgaW1nICs9ICcvPic7XG5cbiAgICAgIHJldHVybiBpbWc7XG4gICAgfTtcblxuICAgIHZhciBfY3JlYXRlSGFsZkFTQ0lJID0gZnVuY3Rpb24obWFyZ2luKSB7XG4gICAgICB2YXIgY2VsbFNpemUgPSAxO1xuICAgICAgbWFyZ2luID0gKHR5cGVvZiBtYXJnaW4gPT0gJ3VuZGVmaW5lZCcpPyBjZWxsU2l6ZSAqIDIgOiBtYXJnaW47XG5cbiAgICAgIHZhciBzaXplID0gX3RoaXMuZ2V0TW9kdWxlQ291bnQoKSAqIGNlbGxTaXplICsgbWFyZ2luICogMjtcbiAgICAgIHZhciBtaW4gPSBtYXJnaW47XG4gICAgICB2YXIgbWF4ID0gc2l6ZSAtIG1hcmdpbjtcblxuICAgICAgdmFyIHksIHgsIHIxLCByMiwgcDtcblxuICAgICAgdmFyIGJsb2NrcyA9IHtcbiAgICAgICAgJ+KWiOKWiCc6ICfilognLFxuICAgICAgICAn4paIICc6ICfiloAnLFxuICAgICAgICAnIOKWiCc6ICfiloQnLFxuICAgICAgICAnICAnOiAnICdcbiAgICAgIH07XG5cbiAgICAgIHZhciBibG9ja3NMYXN0TGluZU5vTWFyZ2luID0ge1xuICAgICAgICAn4paI4paIJzogJ+KWgCcsXG4gICAgICAgICfiloggJzogJ+KWgCcsXG4gICAgICAgICcg4paIJzogJyAnLFxuICAgICAgICAnICAnOiAnICdcbiAgICAgIH07XG5cbiAgICAgIHZhciBhc2NpaSA9ICcnO1xuICAgICAgZm9yICh5ID0gMDsgeSA8IHNpemU7IHkgKz0gMikge1xuICAgICAgICByMSA9IE1hdGguZmxvb3IoKHkgLSBtaW4pIC8gY2VsbFNpemUpO1xuICAgICAgICByMiA9IE1hdGguZmxvb3IoKHkgKyAxIC0gbWluKSAvIGNlbGxTaXplKTtcbiAgICAgICAgZm9yICh4ID0gMDsgeCA8IHNpemU7IHggKz0gMSkge1xuICAgICAgICAgIHAgPSAn4paIJztcblxuICAgICAgICAgIGlmIChtaW4gPD0geCAmJiB4IDwgbWF4ICYmIG1pbiA8PSB5ICYmIHkgPCBtYXggJiYgX3RoaXMuaXNEYXJrKHIxLCBNYXRoLmZsb29yKCh4IC0gbWluKSAvIGNlbGxTaXplKSkpIHtcbiAgICAgICAgICAgIHAgPSAnICc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG1pbiA8PSB4ICYmIHggPCBtYXggJiYgbWluIDw9IHkrMSAmJiB5KzEgPCBtYXggJiYgX3RoaXMuaXNEYXJrKHIyLCBNYXRoLmZsb29yKCh4IC0gbWluKSAvIGNlbGxTaXplKSkpIHtcbiAgICAgICAgICAgIHAgKz0gJyAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHAgKz0gJ+KWiCc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT3V0cHV0IDIgY2hhcmFjdGVycyBwZXIgcGl4ZWwsIHRvIGNyZWF0ZSBmdWxsIHNxdWFyZS4gMSBjaGFyYWN0ZXIgcGVyIHBpeGVscyBnaXZlcyBvbmx5IGhhbGYgd2lkdGggb2Ygc3F1YXJlLlxuICAgICAgICAgIGFzY2lpICs9IChtYXJnaW4gPCAxICYmIHkrMSA+PSBtYXgpID8gYmxvY2tzTGFzdExpbmVOb01hcmdpbltwXSA6IGJsb2Nrc1twXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFzY2lpICs9ICdcXG4nO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2l6ZSAlIDIgJiYgbWFyZ2luID4gMCkge1xuICAgICAgICByZXR1cm4gYXNjaWkuc3Vic3RyaW5nKDAsIGFzY2lpLmxlbmd0aCAtIHNpemUgLSAxKSArIEFycmF5KHNpemUrMSkuam9pbign4paAJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhc2NpaS5zdWJzdHJpbmcoMCwgYXNjaWkubGVuZ3RoLTEpO1xuICAgIH07XG5cbiAgICBfdGhpcy5jcmVhdGVBU0NJSSA9IGZ1bmN0aW9uKGNlbGxTaXplLCBtYXJnaW4pIHtcbiAgICAgIGNlbGxTaXplID0gY2VsbFNpemUgfHwgMTtcblxuICAgICAgaWYgKGNlbGxTaXplIDwgMikge1xuICAgICAgICByZXR1cm4gX2NyZWF0ZUhhbGZBU0NJSShtYXJnaW4pO1xuICAgICAgfVxuXG4gICAgICBjZWxsU2l6ZSAtPSAxO1xuICAgICAgbWFyZ2luID0gKHR5cGVvZiBtYXJnaW4gPT0gJ3VuZGVmaW5lZCcpPyBjZWxsU2l6ZSAqIDIgOiBtYXJnaW47XG5cbiAgICAgIHZhciBzaXplID0gX3RoaXMuZ2V0TW9kdWxlQ291bnQoKSAqIGNlbGxTaXplICsgbWFyZ2luICogMjtcbiAgICAgIHZhciBtaW4gPSBtYXJnaW47XG4gICAgICB2YXIgbWF4ID0gc2l6ZSAtIG1hcmdpbjtcblxuICAgICAgdmFyIHksIHgsIHIsIHA7XG5cbiAgICAgIHZhciB3aGl0ZSA9IEFycmF5KGNlbGxTaXplKzEpLmpvaW4oJ+KWiOKWiCcpO1xuICAgICAgdmFyIGJsYWNrID0gQXJyYXkoY2VsbFNpemUrMSkuam9pbignICAnKTtcblxuICAgICAgdmFyIGFzY2lpID0gJyc7XG4gICAgICB2YXIgbGluZSA9ICcnO1xuICAgICAgZm9yICh5ID0gMDsgeSA8IHNpemU7IHkgKz0gMSkge1xuICAgICAgICByID0gTWF0aC5mbG9vciggKHkgLSBtaW4pIC8gY2VsbFNpemUpO1xuICAgICAgICBsaW5lID0gJyc7XG4gICAgICAgIGZvciAoeCA9IDA7IHggPCBzaXplOyB4ICs9IDEpIHtcbiAgICAgICAgICBwID0gMTtcblxuICAgICAgICAgIGlmIChtaW4gPD0geCAmJiB4IDwgbWF4ICYmIG1pbiA8PSB5ICYmIHkgPCBtYXggJiYgX3RoaXMuaXNEYXJrKHIsIE1hdGguZmxvb3IoKHggLSBtaW4pIC8gY2VsbFNpemUpKSkge1xuICAgICAgICAgICAgcCA9IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT3V0cHV0IDIgY2hhcmFjdGVycyBwZXIgcGl4ZWwsIHRvIGNyZWF0ZSBmdWxsIHNxdWFyZS4gMSBjaGFyYWN0ZXIgcGVyIHBpeGVscyBnaXZlcyBvbmx5IGhhbGYgd2lkdGggb2Ygc3F1YXJlLlxuICAgICAgICAgIGxpbmUgKz0gcCA/IHdoaXRlIDogYmxhY2s7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHIgPSAwOyByIDwgY2VsbFNpemU7IHIgKz0gMSkge1xuICAgICAgICAgIGFzY2lpICs9IGxpbmUgKyAnXFxuJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYXNjaWkuc3Vic3RyaW5nKDAsIGFzY2lpLmxlbmd0aC0xKTtcbiAgICB9O1xuXG4gICAgX3RoaXMucmVuZGVyVG8yZENvbnRleHQgPSBmdW5jdGlvbihjb250ZXh0LCBjZWxsU2l6ZSkge1xuICAgICAgY2VsbFNpemUgPSBjZWxsU2l6ZSB8fCAyO1xuICAgICAgdmFyIGxlbmd0aCA9IF90aGlzLmdldE1vZHVsZUNvdW50KCk7XG4gICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBsZW5ndGg7IHJvdysrKSB7XG4gICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IGxlbmd0aDsgY29sKyspIHtcbiAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IF90aGlzLmlzRGFyayhyb3csIGNvbCkgPyAnYmxhY2snIDogJ3doaXRlJztcbiAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KHJvdyAqIGNlbGxTaXplLCBjb2wgKiBjZWxsU2l6ZSwgY2VsbFNpemUsIGNlbGxTaXplKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBxcmNvZGUuc3RyaW5nVG9CeXRlc1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHFyY29kZS5zdHJpbmdUb0J5dGVzRnVuY3MgPSB7XG4gICAgJ2RlZmF1bHQnIDogZnVuY3Rpb24ocykge1xuICAgICAgdmFyIGJ5dGVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgdmFyIGMgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgICAgIGJ5dGVzLnB1c2goYyAmIDB4ZmYpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGJ5dGVzO1xuICAgIH1cbiAgfTtcblxuICBxcmNvZGUuc3RyaW5nVG9CeXRlcyA9IHFyY29kZS5zdHJpbmdUb0J5dGVzRnVuY3NbJ2RlZmF1bHQnXTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBxcmNvZGUuY3JlYXRlU3RyaW5nVG9CeXRlc1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gdW5pY29kZURhdGEgYmFzZTY0IHN0cmluZyBvZiBieXRlIGFycmF5LlxuICAgKiBbMTZiaXQgVW5pY29kZV0sWzE2Yml0IEJ5dGVzXSwgLi4uXG4gICAqIEBwYXJhbSBudW1DaGFyc1xuICAgKi9cbiAgcXJjb2RlLmNyZWF0ZVN0cmluZ1RvQnl0ZXMgPSBmdW5jdGlvbih1bmljb2RlRGF0YSwgbnVtQ2hhcnMpIHtcblxuICAgIC8vIGNyZWF0ZSBjb252ZXJzaW9uIG1hcC5cblxuICAgIHZhciB1bmljb2RlTWFwID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBiaW4gPSBiYXNlNjREZWNvZGVJbnB1dFN0cmVhbSh1bmljb2RlRGF0YSk7XG4gICAgICB2YXIgcmVhZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYiA9IGJpbi5yZWFkKCk7XG4gICAgICAgIGlmIChiID09IC0xKSB0aHJvdyAnZW9mJztcbiAgICAgICAgcmV0dXJuIGI7XG4gICAgICB9O1xuXG4gICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgdmFyIHVuaWNvZGVNYXAgPSB7fTtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBiMCA9IGJpbi5yZWFkKCk7XG4gICAgICAgIGlmIChiMCA9PSAtMSkgYnJlYWs7XG4gICAgICAgIHZhciBiMSA9IHJlYWQoKTtcbiAgICAgICAgdmFyIGIyID0gcmVhZCgpO1xuICAgICAgICB2YXIgYjMgPSByZWFkKCk7XG4gICAgICAgIHZhciBrID0gU3RyaW5nLmZyb21DaGFyQ29kZSggKGIwIDw8IDgpIHwgYjEpO1xuICAgICAgICB2YXIgdiA9IChiMiA8PCA4KSB8IGIzO1xuICAgICAgICB1bmljb2RlTWFwW2tdID0gdjtcbiAgICAgICAgY291bnQgKz0gMTtcbiAgICAgIH1cbiAgICAgIGlmIChjb3VudCAhPSBudW1DaGFycykge1xuICAgICAgICB0aHJvdyBjb3VudCArICcgIT0gJyArIG51bUNoYXJzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdW5pY29kZU1hcDtcbiAgICB9KCk7XG5cbiAgICB2YXIgdW5rbm93bkNoYXIgPSAnPycuY2hhckNvZGVBdCgwKTtcblxuICAgIHJldHVybiBmdW5jdGlvbihzKSB7XG4gICAgICB2YXIgYnl0ZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICB2YXIgYyA9IHMuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGMgPCAxMjgpIHtcbiAgICAgICAgICBieXRlcy5wdXNoKGMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBiID0gdW5pY29kZU1hcFtzLmNoYXJBdChpKV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBiID09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZiAoIChiICYgMHhmZikgPT0gYikge1xuICAgICAgICAgICAgICAvLyAxYnl0ZVxuICAgICAgICAgICAgICBieXRlcy5wdXNoKGIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gMmJ5dGVzXG4gICAgICAgICAgICAgIGJ5dGVzLnB1c2goYiA+Pj4gOCk7XG4gICAgICAgICAgICAgIGJ5dGVzLnB1c2goYiAmIDB4ZmYpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBieXRlcy5wdXNoKHVua25vd25DaGFyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBieXRlcztcbiAgICB9O1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIFFSTW9kZVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBRUk1vZGUgPSB7XG4gICAgTU9ERV9OVU1CRVIgOiAgICAxIDw8IDAsXG4gICAgTU9ERV9BTFBIQV9OVU0gOiAxIDw8IDEsXG4gICAgTU9ERV84QklUX0JZVEUgOiAxIDw8IDIsXG4gICAgTU9ERV9LQU5KSSA6ICAgICAxIDw8IDNcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBRUkVycm9yQ29ycmVjdGlvbkxldmVsXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWwgPSB7XG4gICAgTCA6IDEsXG4gICAgTSA6IDAsXG4gICAgUSA6IDMsXG4gICAgSCA6IDJcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBRUk1hc2tQYXR0ZXJuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIFFSTWFza1BhdHRlcm4gPSB7XG4gICAgUEFUVEVSTjAwMCA6IDAsXG4gICAgUEFUVEVSTjAwMSA6IDEsXG4gICAgUEFUVEVSTjAxMCA6IDIsXG4gICAgUEFUVEVSTjAxMSA6IDMsXG4gICAgUEFUVEVSTjEwMCA6IDQsXG4gICAgUEFUVEVSTjEwMSA6IDUsXG4gICAgUEFUVEVSTjExMCA6IDYsXG4gICAgUEFUVEVSTjExMSA6IDdcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBRUlV0aWxcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgUVJVdGlsID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgUEFUVEVSTl9QT1NJVElPTl9UQUJMRSA9IFtcbiAgICAgIFtdLFxuICAgICAgWzYsIDE4XSxcbiAgICAgIFs2LCAyMl0sXG4gICAgICBbNiwgMjZdLFxuICAgICAgWzYsIDMwXSxcbiAgICAgIFs2LCAzNF0sXG4gICAgICBbNiwgMjIsIDM4XSxcbiAgICAgIFs2LCAyNCwgNDJdLFxuICAgICAgWzYsIDI2LCA0Nl0sXG4gICAgICBbNiwgMjgsIDUwXSxcbiAgICAgIFs2LCAzMCwgNTRdLFxuICAgICAgWzYsIDMyLCA1OF0sXG4gICAgICBbNiwgMzQsIDYyXSxcbiAgICAgIFs2LCAyNiwgNDYsIDY2XSxcbiAgICAgIFs2LCAyNiwgNDgsIDcwXSxcbiAgICAgIFs2LCAyNiwgNTAsIDc0XSxcbiAgICAgIFs2LCAzMCwgNTQsIDc4XSxcbiAgICAgIFs2LCAzMCwgNTYsIDgyXSxcbiAgICAgIFs2LCAzMCwgNTgsIDg2XSxcbiAgICAgIFs2LCAzNCwgNjIsIDkwXSxcbiAgICAgIFs2LCAyOCwgNTAsIDcyLCA5NF0sXG4gICAgICBbNiwgMjYsIDUwLCA3NCwgOThdLFxuICAgICAgWzYsIDMwLCA1NCwgNzgsIDEwMl0sXG4gICAgICBbNiwgMjgsIDU0LCA4MCwgMTA2XSxcbiAgICAgIFs2LCAzMiwgNTgsIDg0LCAxMTBdLFxuICAgICAgWzYsIDMwLCA1OCwgODYsIDExNF0sXG4gICAgICBbNiwgMzQsIDYyLCA5MCwgMTE4XSxcbiAgICAgIFs2LCAyNiwgNTAsIDc0LCA5OCwgMTIyXSxcbiAgICAgIFs2LCAzMCwgNTQsIDc4LCAxMDIsIDEyNl0sXG4gICAgICBbNiwgMjYsIDUyLCA3OCwgMTA0LCAxMzBdLFxuICAgICAgWzYsIDMwLCA1NiwgODIsIDEwOCwgMTM0XSxcbiAgICAgIFs2LCAzNCwgNjAsIDg2LCAxMTIsIDEzOF0sXG4gICAgICBbNiwgMzAsIDU4LCA4NiwgMTE0LCAxNDJdLFxuICAgICAgWzYsIDM0LCA2MiwgOTAsIDExOCwgMTQ2XSxcbiAgICAgIFs2LCAzMCwgNTQsIDc4LCAxMDIsIDEyNiwgMTUwXSxcbiAgICAgIFs2LCAyNCwgNTAsIDc2LCAxMDIsIDEyOCwgMTU0XSxcbiAgICAgIFs2LCAyOCwgNTQsIDgwLCAxMDYsIDEzMiwgMTU4XSxcbiAgICAgIFs2LCAzMiwgNTgsIDg0LCAxMTAsIDEzNiwgMTYyXSxcbiAgICAgIFs2LCAyNiwgNTQsIDgyLCAxMTAsIDEzOCwgMTY2XSxcbiAgICAgIFs2LCAzMCwgNTgsIDg2LCAxMTQsIDE0MiwgMTcwXVxuICAgIF07XG4gICAgdmFyIEcxNSA9ICgxIDw8IDEwKSB8ICgxIDw8IDgpIHwgKDEgPDwgNSkgfCAoMSA8PCA0KSB8ICgxIDw8IDIpIHwgKDEgPDwgMSkgfCAoMSA8PCAwKTtcbiAgICB2YXIgRzE4ID0gKDEgPDwgMTIpIHwgKDEgPDwgMTEpIHwgKDEgPDwgMTApIHwgKDEgPDwgOSkgfCAoMSA8PCA4KSB8ICgxIDw8IDUpIHwgKDEgPDwgMikgfCAoMSA8PCAwKTtcbiAgICB2YXIgRzE1X01BU0sgPSAoMSA8PCAxNCkgfCAoMSA8PCAxMikgfCAoMSA8PCAxMCkgfCAoMSA8PCA0KSB8ICgxIDw8IDEpO1xuXG4gICAgdmFyIF90aGlzID0ge307XG5cbiAgICB2YXIgZ2V0QkNIRGlnaXQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB2YXIgZGlnaXQgPSAwO1xuICAgICAgd2hpbGUgKGRhdGEgIT0gMCkge1xuICAgICAgICBkaWdpdCArPSAxO1xuICAgICAgICBkYXRhID4+Pj0gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBkaWdpdDtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0QkNIVHlwZUluZm8gPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB2YXIgZCA9IGRhdGEgPDwgMTA7XG4gICAgICB3aGlsZSAoZ2V0QkNIRGlnaXQoZCkgLSBnZXRCQ0hEaWdpdChHMTUpID49IDApIHtcbiAgICAgICAgZCBePSAoRzE1IDw8IChnZXRCQ0hEaWdpdChkKSAtIGdldEJDSERpZ2l0KEcxNSkgKSApO1xuICAgICAgfVxuICAgICAgcmV0dXJuICggKGRhdGEgPDwgMTApIHwgZCkgXiBHMTVfTUFTSztcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0QkNIVHlwZU51bWJlciA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZhciBkID0gZGF0YSA8PCAxMjtcbiAgICAgIHdoaWxlIChnZXRCQ0hEaWdpdChkKSAtIGdldEJDSERpZ2l0KEcxOCkgPj0gMCkge1xuICAgICAgICBkIF49IChHMTggPDwgKGdldEJDSERpZ2l0KGQpIC0gZ2V0QkNIRGlnaXQoRzE4KSApICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gKGRhdGEgPDwgMTIpIHwgZDtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0UGF0dGVyblBvc2l0aW9uID0gZnVuY3Rpb24odHlwZU51bWJlcikge1xuICAgICAgcmV0dXJuIFBBVFRFUk5fUE9TSVRJT05fVEFCTEVbdHlwZU51bWJlciAtIDFdO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRNYXNrRnVuY3Rpb24gPSBmdW5jdGlvbihtYXNrUGF0dGVybikge1xuXG4gICAgICBzd2l0Y2ggKG1hc2tQYXR0ZXJuKSB7XG5cbiAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMDAwIDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGksIGopIHsgcmV0dXJuIChpICsgaikgJSAyID09IDA7IH07XG4gICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjAwMSA6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpLCBqKSB7IHJldHVybiBpICUgMiA9PSAwOyB9O1xuICAgICAgY2FzZSBRUk1hc2tQYXR0ZXJuLlBBVFRFUk4wMTAgOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaSwgaikgeyByZXR1cm4gaiAlIDMgPT0gMDsgfTtcbiAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMDExIDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGksIGopIHsgcmV0dXJuIChpICsgaikgJSAzID09IDA7IH07XG4gICAgICBjYXNlIFFSTWFza1BhdHRlcm4uUEFUVEVSTjEwMCA6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihpLCBqKSB7IHJldHVybiAoTWF0aC5mbG9vcihpIC8gMikgKyBNYXRoLmZsb29yKGogLyAzKSApICUgMiA9PSAwOyB9O1xuICAgICAgY2FzZSBRUk1hc2tQYXR0ZXJuLlBBVFRFUk4xMDEgOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaSwgaikgeyByZXR1cm4gKGkgKiBqKSAlIDIgKyAoaSAqIGopICUgMyA9PSAwOyB9O1xuICAgICAgY2FzZSBRUk1hc2tQYXR0ZXJuLlBBVFRFUk4xMTAgOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaSwgaikgeyByZXR1cm4gKCAoaSAqIGopICUgMiArIChpICogaikgJSAzKSAlIDIgPT0gMDsgfTtcbiAgICAgIGNhc2UgUVJNYXNrUGF0dGVybi5QQVRURVJOMTExIDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGksIGopIHsgcmV0dXJuICggKGkgKiBqKSAlIDMgKyAoaSArIGopICUgMikgJSAyID09IDA7IH07XG5cbiAgICAgIGRlZmF1bHQgOlxuICAgICAgICB0aHJvdyAnYmFkIG1hc2tQYXR0ZXJuOicgKyBtYXNrUGF0dGVybjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0RXJyb3JDb3JyZWN0UG9seW5vbWlhbCA9IGZ1bmN0aW9uKGVycm9yQ29ycmVjdExlbmd0aCkge1xuICAgICAgdmFyIGEgPSBxclBvbHlub21pYWwoWzFdLCAwKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JDb3JyZWN0TGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYSA9IGEubXVsdGlwbHkocXJQb2x5bm9taWFsKFsxLCBRUk1hdGguZ2V4cChpKV0sIDApICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TGVuZ3RoSW5CaXRzID0gZnVuY3Rpb24obW9kZSwgdHlwZSkge1xuXG4gICAgICBpZiAoMSA8PSB0eXBlICYmIHR5cGUgPCAxMCkge1xuXG4gICAgICAgIC8vIDEgLSA5XG5cbiAgICAgICAgc3dpdGNoKG1vZGUpIHtcbiAgICAgICAgY2FzZSBRUk1vZGUuTU9ERV9OVU1CRVIgICAgOiByZXR1cm4gMTA7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfQUxQSEFfTlVNIDogcmV0dXJuIDk7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfOEJJVF9CWVRFIDogcmV0dXJuIDg7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfS0FOSkkgICAgIDogcmV0dXJuIDg7XG4gICAgICAgIGRlZmF1bHQgOlxuICAgICAgICAgIHRocm93ICdtb2RlOicgKyBtb2RlO1xuICAgICAgICB9XG5cbiAgICAgIH0gZWxzZSBpZiAodHlwZSA8IDI3KSB7XG5cbiAgICAgICAgLy8gMTAgLSAyNlxuXG4gICAgICAgIHN3aXRjaChtb2RlKSB7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfTlVNQkVSICAgIDogcmV0dXJuIDEyO1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0FMUEhBX05VTSA6IHJldHVybiAxMTtcbiAgICAgICAgY2FzZSBRUk1vZGUuTU9ERV84QklUX0JZVEUgOiByZXR1cm4gMTY7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfS0FOSkkgICAgIDogcmV0dXJuIDEwO1xuICAgICAgICBkZWZhdWx0IDpcbiAgICAgICAgICB0aHJvdyAnbW9kZTonICsgbW9kZTtcbiAgICAgICAgfVxuXG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPCA0MSkge1xuXG4gICAgICAgIC8vIDI3IC0gNDBcblxuICAgICAgICBzd2l0Y2gobW9kZSkge1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX05VTUJFUiAgICA6IHJldHVybiAxNDtcbiAgICAgICAgY2FzZSBRUk1vZGUuTU9ERV9BTFBIQV9OVU0gOiByZXR1cm4gMTM7XG4gICAgICAgIGNhc2UgUVJNb2RlLk1PREVfOEJJVF9CWVRFIDogcmV0dXJuIDE2O1xuICAgICAgICBjYXNlIFFSTW9kZS5NT0RFX0tBTkpJICAgICA6IHJldHVybiAxMjtcbiAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgdGhyb3cgJ21vZGU6JyArIG1vZGU7XG4gICAgICAgIH1cblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgJ3R5cGU6JyArIHR5cGU7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLmdldExvc3RQb2ludCA9IGZ1bmN0aW9uKHFyY29kZSkge1xuXG4gICAgICB2YXIgbW9kdWxlQ291bnQgPSBxcmNvZGUuZ2V0TW9kdWxlQ291bnQoKTtcblxuICAgICAgdmFyIGxvc3RQb2ludCA9IDA7XG5cbiAgICAgIC8vIExFVkVMMVxuXG4gICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBtb2R1bGVDb3VudDsgcm93ICs9IDEpIHtcbiAgICAgICAgZm9yICh2YXIgY29sID0gMDsgY29sIDwgbW9kdWxlQ291bnQ7IGNvbCArPSAxKSB7XG5cbiAgICAgICAgICB2YXIgc2FtZUNvdW50ID0gMDtcbiAgICAgICAgICB2YXIgZGFyayA9IHFyY29kZS5pc0Rhcmsocm93LCBjb2wpO1xuXG4gICAgICAgICAgZm9yICh2YXIgciA9IC0xOyByIDw9IDE7IHIgKz0gMSkge1xuXG4gICAgICAgICAgICBpZiAocm93ICsgciA8IDAgfHwgbW9kdWxlQ291bnQgPD0gcm93ICsgcikge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgYyA9IC0xOyBjIDw9IDE7IGMgKz0gMSkge1xuXG4gICAgICAgICAgICAgIGlmIChjb2wgKyBjIDwgMCB8fCBtb2R1bGVDb3VudCA8PSBjb2wgKyBjKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAociA9PSAwICYmIGMgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGRhcmsgPT0gcXJjb2RlLmlzRGFyayhyb3cgKyByLCBjb2wgKyBjKSApIHtcbiAgICAgICAgICAgICAgICBzYW1lQ291bnQgKz0gMTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChzYW1lQ291bnQgPiA1KSB7XG4gICAgICAgICAgICBsb3N0UG9pbnQgKz0gKDMgKyBzYW1lQ291bnQgLSA1KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIExFVkVMMlxuXG4gICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBtb2R1bGVDb3VudCAtIDE7IHJvdyArPSAxKSB7XG4gICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50IC0gMTsgY29sICs9IDEpIHtcbiAgICAgICAgICB2YXIgY291bnQgPSAwO1xuICAgICAgICAgIGlmIChxcmNvZGUuaXNEYXJrKHJvdywgY29sKSApIGNvdW50ICs9IDE7XG4gICAgICAgICAgaWYgKHFyY29kZS5pc0Rhcmsocm93ICsgMSwgY29sKSApIGNvdW50ICs9IDE7XG4gICAgICAgICAgaWYgKHFyY29kZS5pc0Rhcmsocm93LCBjb2wgKyAxKSApIGNvdW50ICs9IDE7XG4gICAgICAgICAgaWYgKHFyY29kZS5pc0Rhcmsocm93ICsgMSwgY29sICsgMSkgKSBjb3VudCArPSAxO1xuICAgICAgICAgIGlmIChjb3VudCA9PSAwIHx8IGNvdW50ID09IDQpIHtcbiAgICAgICAgICAgIGxvc3RQb2ludCArPSAzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBMRVZFTDNcblxuICAgICAgZm9yICh2YXIgcm93ID0gMDsgcm93IDwgbW9kdWxlQ291bnQ7IHJvdyArPSAxKSB7XG4gICAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50IC0gNjsgY29sICs9IDEpIHtcbiAgICAgICAgICBpZiAocXJjb2RlLmlzRGFyayhyb3csIGNvbClcbiAgICAgICAgICAgICAgJiYgIXFyY29kZS5pc0Rhcmsocm93LCBjb2wgKyAxKVxuICAgICAgICAgICAgICAmJiAgcXJjb2RlLmlzRGFyayhyb3csIGNvbCArIDIpXG4gICAgICAgICAgICAgICYmICBxcmNvZGUuaXNEYXJrKHJvdywgY29sICsgMylcbiAgICAgICAgICAgICAgJiYgIHFyY29kZS5pc0Rhcmsocm93LCBjb2wgKyA0KVxuICAgICAgICAgICAgICAmJiAhcXJjb2RlLmlzRGFyayhyb3csIGNvbCArIDUpXG4gICAgICAgICAgICAgICYmICBxcmNvZGUuaXNEYXJrKHJvdywgY29sICsgNikgKSB7XG4gICAgICAgICAgICBsb3N0UG9pbnQgKz0gNDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50OyBjb2wgKz0gMSkge1xuICAgICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBtb2R1bGVDb3VudCAtIDY7IHJvdyArPSAxKSB7XG4gICAgICAgICAgaWYgKHFyY29kZS5pc0Rhcmsocm93LCBjb2wpXG4gICAgICAgICAgICAgICYmICFxcmNvZGUuaXNEYXJrKHJvdyArIDEsIGNvbClcbiAgICAgICAgICAgICAgJiYgIHFyY29kZS5pc0Rhcmsocm93ICsgMiwgY29sKVxuICAgICAgICAgICAgICAmJiAgcXJjb2RlLmlzRGFyayhyb3cgKyAzLCBjb2wpXG4gICAgICAgICAgICAgICYmICBxcmNvZGUuaXNEYXJrKHJvdyArIDQsIGNvbClcbiAgICAgICAgICAgICAgJiYgIXFyY29kZS5pc0Rhcmsocm93ICsgNSwgY29sKVxuICAgICAgICAgICAgICAmJiAgcXJjb2RlLmlzRGFyayhyb3cgKyA2LCBjb2wpICkge1xuICAgICAgICAgICAgbG9zdFBvaW50ICs9IDQwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBMRVZFTDRcblxuICAgICAgdmFyIGRhcmtDb3VudCA9IDA7XG5cbiAgICAgIGZvciAodmFyIGNvbCA9IDA7IGNvbCA8IG1vZHVsZUNvdW50OyBjb2wgKz0gMSkge1xuICAgICAgICBmb3IgKHZhciByb3cgPSAwOyByb3cgPCBtb2R1bGVDb3VudDsgcm93ICs9IDEpIHtcbiAgICAgICAgICBpZiAocXJjb2RlLmlzRGFyayhyb3csIGNvbCkgKSB7XG4gICAgICAgICAgICBkYXJrQ291bnQgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHJhdGlvID0gTWF0aC5hYnMoMTAwICogZGFya0NvdW50IC8gbW9kdWxlQ291bnQgLyBtb2R1bGVDb3VudCAtIDUwKSAvIDU7XG4gICAgICBsb3N0UG9pbnQgKz0gcmF0aW8gKiAxMDtcblxuICAgICAgcmV0dXJuIGxvc3RQb2ludDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9KCk7XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUVJNYXRoXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIFFSTWF0aCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIEVYUF9UQUJMRSA9IG5ldyBBcnJheSgyNTYpO1xuICAgIHZhciBMT0dfVEFCTEUgPSBuZXcgQXJyYXkoMjU2KTtcblxuICAgIC8vIGluaXRpYWxpemUgdGFibGVzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCA4OyBpICs9IDEpIHtcbiAgICAgIEVYUF9UQUJMRVtpXSA9IDEgPDwgaTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDg7IGkgPCAyNTY7IGkgKz0gMSkge1xuICAgICAgRVhQX1RBQkxFW2ldID0gRVhQX1RBQkxFW2kgLSA0XVxuICAgICAgICBeIEVYUF9UQUJMRVtpIC0gNV1cbiAgICAgICAgXiBFWFBfVEFCTEVbaSAtIDZdXG4gICAgICAgIF4gRVhQX1RBQkxFW2kgLSA4XTtcbiAgICB9XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCAyNTU7IGkgKz0gMSkge1xuICAgICAgTE9HX1RBQkxFW0VYUF9UQUJMRVtpXSBdID0gaTtcbiAgICB9XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLmdsb2cgPSBmdW5jdGlvbihuKSB7XG5cbiAgICAgIGlmIChuIDwgMSkge1xuICAgICAgICB0aHJvdyAnZ2xvZygnICsgbiArICcpJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIExPR19UQUJMRVtuXTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V4cCA9IGZ1bmN0aW9uKG4pIHtcblxuICAgICAgd2hpbGUgKG4gPCAwKSB7XG4gICAgICAgIG4gKz0gMjU1O1xuICAgICAgfVxuXG4gICAgICB3aGlsZSAobiA+PSAyNTYpIHtcbiAgICAgICAgbiAtPSAyNTU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBFWFBfVEFCTEVbbl07XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfSgpO1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyUG9seW5vbWlhbFxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGZ1bmN0aW9uIHFyUG9seW5vbWlhbChudW0sIHNoaWZ0KSB7XG5cbiAgICBpZiAodHlwZW9mIG51bS5sZW5ndGggPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG51bS5sZW5ndGggKyAnLycgKyBzaGlmdDtcbiAgICB9XG5cbiAgICB2YXIgX251bSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9mZnNldCA9IDA7XG4gICAgICB3aGlsZSAob2Zmc2V0IDwgbnVtLmxlbmd0aCAmJiBudW1bb2Zmc2V0XSA9PSAwKSB7XG4gICAgICAgIG9mZnNldCArPSAxO1xuICAgICAgfVxuICAgICAgdmFyIF9udW0gPSBuZXcgQXJyYXkobnVtLmxlbmd0aCAtIG9mZnNldCArIHNoaWZ0KTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtLmxlbmd0aCAtIG9mZnNldDsgaSArPSAxKSB7XG4gICAgICAgIF9udW1baV0gPSBudW1baSArIG9mZnNldF07XG4gICAgICB9XG4gICAgICByZXR1cm4gX251bTtcbiAgICB9KCk7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLmdldEF0ID0gZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgIHJldHVybiBfbnVtW2luZGV4XTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gX251bS5sZW5ndGg7XG4gICAgfTtcblxuICAgIF90aGlzLm11bHRpcGx5ID0gZnVuY3Rpb24oZSkge1xuXG4gICAgICB2YXIgbnVtID0gbmV3IEFycmF5KF90aGlzLmdldExlbmd0aCgpICsgZS5nZXRMZW5ndGgoKSAtIDEpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF90aGlzLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBlLmdldExlbmd0aCgpOyBqICs9IDEpIHtcbiAgICAgICAgICBudW1baSArIGpdIF49IFFSTWF0aC5nZXhwKFFSTWF0aC5nbG9nKF90aGlzLmdldEF0KGkpICkgKyBRUk1hdGguZ2xvZyhlLmdldEF0KGopICkgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcXJQb2x5bm9taWFsKG51bSwgMCk7XG4gICAgfTtcblxuICAgIF90aGlzLm1vZCA9IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgaWYgKF90aGlzLmdldExlbmd0aCgpIC0gZS5nZXRMZW5ndGgoKSA8IDApIHtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgICAgfVxuXG4gICAgICB2YXIgcmF0aW8gPSBRUk1hdGguZ2xvZyhfdGhpcy5nZXRBdCgwKSApIC0gUVJNYXRoLmdsb2coZS5nZXRBdCgwKSApO1xuXG4gICAgICB2YXIgbnVtID0gbmV3IEFycmF5KF90aGlzLmdldExlbmd0aCgpICk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF90aGlzLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgbnVtW2ldID0gX3RoaXMuZ2V0QXQoaSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZS5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIG51bVtpXSBePSBRUk1hdGguZ2V4cChRUk1hdGguZ2xvZyhlLmdldEF0KGkpICkgKyByYXRpbyk7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlY3Vyc2l2ZSBjYWxsXG4gICAgICByZXR1cm4gcXJQb2x5bm9taWFsKG51bSwgMCkubW9kKGUpO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gUVJSU0Jsb2NrXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIFFSUlNCbG9jayA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIFJTX0JMT0NLX1RBQkxFID0gW1xuXG4gICAgICAvLyBMXG4gICAgICAvLyBNXG4gICAgICAvLyBRXG4gICAgICAvLyBIXG5cbiAgICAgIC8vIDFcbiAgICAgIFsxLCAyNiwgMTldLFxuICAgICAgWzEsIDI2LCAxNl0sXG4gICAgICBbMSwgMjYsIDEzXSxcbiAgICAgIFsxLCAyNiwgOV0sXG5cbiAgICAgIC8vIDJcbiAgICAgIFsxLCA0NCwgMzRdLFxuICAgICAgWzEsIDQ0LCAyOF0sXG4gICAgICBbMSwgNDQsIDIyXSxcbiAgICAgIFsxLCA0NCwgMTZdLFxuXG4gICAgICAvLyAzXG4gICAgICBbMSwgNzAsIDU1XSxcbiAgICAgIFsxLCA3MCwgNDRdLFxuICAgICAgWzIsIDM1LCAxN10sXG4gICAgICBbMiwgMzUsIDEzXSxcblxuICAgICAgLy8gNFxuICAgICAgWzEsIDEwMCwgODBdLFxuICAgICAgWzIsIDUwLCAzMl0sXG4gICAgICBbMiwgNTAsIDI0XSxcbiAgICAgIFs0LCAyNSwgOV0sXG5cbiAgICAgIC8vIDVcbiAgICAgIFsxLCAxMzQsIDEwOF0sXG4gICAgICBbMiwgNjcsIDQzXSxcbiAgICAgIFsyLCAzMywgMTUsIDIsIDM0LCAxNl0sXG4gICAgICBbMiwgMzMsIDExLCAyLCAzNCwgMTJdLFxuXG4gICAgICAvLyA2XG4gICAgICBbMiwgODYsIDY4XSxcbiAgICAgIFs0LCA0MywgMjddLFxuICAgICAgWzQsIDQzLCAxOV0sXG4gICAgICBbNCwgNDMsIDE1XSxcblxuICAgICAgLy8gN1xuICAgICAgWzIsIDk4LCA3OF0sXG4gICAgICBbNCwgNDksIDMxXSxcbiAgICAgIFsyLCAzMiwgMTQsIDQsIDMzLCAxNV0sXG4gICAgICBbNCwgMzksIDEzLCAxLCA0MCwgMTRdLFxuXG4gICAgICAvLyA4XG4gICAgICBbMiwgMTIxLCA5N10sXG4gICAgICBbMiwgNjAsIDM4LCAyLCA2MSwgMzldLFxuICAgICAgWzQsIDQwLCAxOCwgMiwgNDEsIDE5XSxcbiAgICAgIFs0LCA0MCwgMTQsIDIsIDQxLCAxNV0sXG5cbiAgICAgIC8vIDlcbiAgICAgIFsyLCAxNDYsIDExNl0sXG4gICAgICBbMywgNTgsIDM2LCAyLCA1OSwgMzddLFxuICAgICAgWzQsIDM2LCAxNiwgNCwgMzcsIDE3XSxcbiAgICAgIFs0LCAzNiwgMTIsIDQsIDM3LCAxM10sXG5cbiAgICAgIC8vIDEwXG4gICAgICBbMiwgODYsIDY4LCAyLCA4NywgNjldLFxuICAgICAgWzQsIDY5LCA0MywgMSwgNzAsIDQ0XSxcbiAgICAgIFs2LCA0MywgMTksIDIsIDQ0LCAyMF0sXG4gICAgICBbNiwgNDMsIDE1LCAyLCA0NCwgMTZdLFxuXG4gICAgICAvLyAxMVxuICAgICAgWzQsIDEwMSwgODFdLFxuICAgICAgWzEsIDgwLCA1MCwgNCwgODEsIDUxXSxcbiAgICAgIFs0LCA1MCwgMjIsIDQsIDUxLCAyM10sXG4gICAgICBbMywgMzYsIDEyLCA4LCAzNywgMTNdLFxuXG4gICAgICAvLyAxMlxuICAgICAgWzIsIDExNiwgOTIsIDIsIDExNywgOTNdLFxuICAgICAgWzYsIDU4LCAzNiwgMiwgNTksIDM3XSxcbiAgICAgIFs0LCA0NiwgMjAsIDYsIDQ3LCAyMV0sXG4gICAgICBbNywgNDIsIDE0LCA0LCA0MywgMTVdLFxuXG4gICAgICAvLyAxM1xuICAgICAgWzQsIDEzMywgMTA3XSxcbiAgICAgIFs4LCA1OSwgMzcsIDEsIDYwLCAzOF0sXG4gICAgICBbOCwgNDQsIDIwLCA0LCA0NSwgMjFdLFxuICAgICAgWzEyLCAzMywgMTEsIDQsIDM0LCAxMl0sXG5cbiAgICAgIC8vIDE0XG4gICAgICBbMywgMTQ1LCAxMTUsIDEsIDE0NiwgMTE2XSxcbiAgICAgIFs0LCA2NCwgNDAsIDUsIDY1LCA0MV0sXG4gICAgICBbMTEsIDM2LCAxNiwgNSwgMzcsIDE3XSxcbiAgICAgIFsxMSwgMzYsIDEyLCA1LCAzNywgMTNdLFxuXG4gICAgICAvLyAxNVxuICAgICAgWzUsIDEwOSwgODcsIDEsIDExMCwgODhdLFxuICAgICAgWzUsIDY1LCA0MSwgNSwgNjYsIDQyXSxcbiAgICAgIFs1LCA1NCwgMjQsIDcsIDU1LCAyNV0sXG4gICAgICBbMTEsIDM2LCAxMiwgNywgMzcsIDEzXSxcblxuICAgICAgLy8gMTZcbiAgICAgIFs1LCAxMjIsIDk4LCAxLCAxMjMsIDk5XSxcbiAgICAgIFs3LCA3MywgNDUsIDMsIDc0LCA0Nl0sXG4gICAgICBbMTUsIDQzLCAxOSwgMiwgNDQsIDIwXSxcbiAgICAgIFszLCA0NSwgMTUsIDEzLCA0NiwgMTZdLFxuXG4gICAgICAvLyAxN1xuICAgICAgWzEsIDEzNSwgMTA3LCA1LCAxMzYsIDEwOF0sXG4gICAgICBbMTAsIDc0LCA0NiwgMSwgNzUsIDQ3XSxcbiAgICAgIFsxLCA1MCwgMjIsIDE1LCA1MSwgMjNdLFxuICAgICAgWzIsIDQyLCAxNCwgMTcsIDQzLCAxNV0sXG5cbiAgICAgIC8vIDE4XG4gICAgICBbNSwgMTUwLCAxMjAsIDEsIDE1MSwgMTIxXSxcbiAgICAgIFs5LCA2OSwgNDMsIDQsIDcwLCA0NF0sXG4gICAgICBbMTcsIDUwLCAyMiwgMSwgNTEsIDIzXSxcbiAgICAgIFsyLCA0MiwgMTQsIDE5LCA0MywgMTVdLFxuXG4gICAgICAvLyAxOVxuICAgICAgWzMsIDE0MSwgMTEzLCA0LCAxNDIsIDExNF0sXG4gICAgICBbMywgNzAsIDQ0LCAxMSwgNzEsIDQ1XSxcbiAgICAgIFsxNywgNDcsIDIxLCA0LCA0OCwgMjJdLFxuICAgICAgWzksIDM5LCAxMywgMTYsIDQwLCAxNF0sXG5cbiAgICAgIC8vIDIwXG4gICAgICBbMywgMTM1LCAxMDcsIDUsIDEzNiwgMTA4XSxcbiAgICAgIFszLCA2NywgNDEsIDEzLCA2OCwgNDJdLFxuICAgICAgWzE1LCA1NCwgMjQsIDUsIDU1LCAyNV0sXG4gICAgICBbMTUsIDQzLCAxNSwgMTAsIDQ0LCAxNl0sXG5cbiAgICAgIC8vIDIxXG4gICAgICBbNCwgMTQ0LCAxMTYsIDQsIDE0NSwgMTE3XSxcbiAgICAgIFsxNywgNjgsIDQyXSxcbiAgICAgIFsxNywgNTAsIDIyLCA2LCA1MSwgMjNdLFxuICAgICAgWzE5LCA0NiwgMTYsIDYsIDQ3LCAxN10sXG5cbiAgICAgIC8vIDIyXG4gICAgICBbMiwgMTM5LCAxMTEsIDcsIDE0MCwgMTEyXSxcbiAgICAgIFsxNywgNzQsIDQ2XSxcbiAgICAgIFs3LCA1NCwgMjQsIDE2LCA1NSwgMjVdLFxuICAgICAgWzM0LCAzNywgMTNdLFxuXG4gICAgICAvLyAyM1xuICAgICAgWzQsIDE1MSwgMTIxLCA1LCAxNTIsIDEyMl0sXG4gICAgICBbNCwgNzUsIDQ3LCAxNCwgNzYsIDQ4XSxcbiAgICAgIFsxMSwgNTQsIDI0LCAxNCwgNTUsIDI1XSxcbiAgICAgIFsxNiwgNDUsIDE1LCAxNCwgNDYsIDE2XSxcblxuICAgICAgLy8gMjRcbiAgICAgIFs2LCAxNDcsIDExNywgNCwgMTQ4LCAxMThdLFxuICAgICAgWzYsIDczLCA0NSwgMTQsIDc0LCA0Nl0sXG4gICAgICBbMTEsIDU0LCAyNCwgMTYsIDU1LCAyNV0sXG4gICAgICBbMzAsIDQ2LCAxNiwgMiwgNDcsIDE3XSxcblxuICAgICAgLy8gMjVcbiAgICAgIFs4LCAxMzIsIDEwNiwgNCwgMTMzLCAxMDddLFxuICAgICAgWzgsIDc1LCA0NywgMTMsIDc2LCA0OF0sXG4gICAgICBbNywgNTQsIDI0LCAyMiwgNTUsIDI1XSxcbiAgICAgIFsyMiwgNDUsIDE1LCAxMywgNDYsIDE2XSxcblxuICAgICAgLy8gMjZcbiAgICAgIFsxMCwgMTQyLCAxMTQsIDIsIDE0MywgMTE1XSxcbiAgICAgIFsxOSwgNzQsIDQ2LCA0LCA3NSwgNDddLFxuICAgICAgWzI4LCA1MCwgMjIsIDYsIDUxLCAyM10sXG4gICAgICBbMzMsIDQ2LCAxNiwgNCwgNDcsIDE3XSxcblxuICAgICAgLy8gMjdcbiAgICAgIFs4LCAxNTIsIDEyMiwgNCwgMTUzLCAxMjNdLFxuICAgICAgWzIyLCA3MywgNDUsIDMsIDc0LCA0Nl0sXG4gICAgICBbOCwgNTMsIDIzLCAyNiwgNTQsIDI0XSxcbiAgICAgIFsxMiwgNDUsIDE1LCAyOCwgNDYsIDE2XSxcblxuICAgICAgLy8gMjhcbiAgICAgIFszLCAxNDcsIDExNywgMTAsIDE0OCwgMTE4XSxcbiAgICAgIFszLCA3MywgNDUsIDIzLCA3NCwgNDZdLFxuICAgICAgWzQsIDU0LCAyNCwgMzEsIDU1LCAyNV0sXG4gICAgICBbMTEsIDQ1LCAxNSwgMzEsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDI5XG4gICAgICBbNywgMTQ2LCAxMTYsIDcsIDE0NywgMTE3XSxcbiAgICAgIFsyMSwgNzMsIDQ1LCA3LCA3NCwgNDZdLFxuICAgICAgWzEsIDUzLCAyMywgMzcsIDU0LCAyNF0sXG4gICAgICBbMTksIDQ1LCAxNSwgMjYsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDMwXG4gICAgICBbNSwgMTQ1LCAxMTUsIDEwLCAxNDYsIDExNl0sXG4gICAgICBbMTksIDc1LCA0NywgMTAsIDc2LCA0OF0sXG4gICAgICBbMTUsIDU0LCAyNCwgMjUsIDU1LCAyNV0sXG4gICAgICBbMjMsIDQ1LCAxNSwgMjUsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDMxXG4gICAgICBbMTMsIDE0NSwgMTE1LCAzLCAxNDYsIDExNl0sXG4gICAgICBbMiwgNzQsIDQ2LCAyOSwgNzUsIDQ3XSxcbiAgICAgIFs0MiwgNTQsIDI0LCAxLCA1NSwgMjVdLFxuICAgICAgWzIzLCA0NSwgMTUsIDI4LCA0NiwgMTZdLFxuXG4gICAgICAvLyAzMlxuICAgICAgWzE3LCAxNDUsIDExNV0sXG4gICAgICBbMTAsIDc0LCA0NiwgMjMsIDc1LCA0N10sXG4gICAgICBbMTAsIDU0LCAyNCwgMzUsIDU1LCAyNV0sXG4gICAgICBbMTksIDQ1LCAxNSwgMzUsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDMzXG4gICAgICBbMTcsIDE0NSwgMTE1LCAxLCAxNDYsIDExNl0sXG4gICAgICBbMTQsIDc0LCA0NiwgMjEsIDc1LCA0N10sXG4gICAgICBbMjksIDU0LCAyNCwgMTksIDU1LCAyNV0sXG4gICAgICBbMTEsIDQ1LCAxNSwgNDYsIDQ2LCAxNl0sXG5cbiAgICAgIC8vIDM0XG4gICAgICBbMTMsIDE0NSwgMTE1LCA2LCAxNDYsIDExNl0sXG4gICAgICBbMTQsIDc0LCA0NiwgMjMsIDc1LCA0N10sXG4gICAgICBbNDQsIDU0LCAyNCwgNywgNTUsIDI1XSxcbiAgICAgIFs1OSwgNDYsIDE2LCAxLCA0NywgMTddLFxuXG4gICAgICAvLyAzNVxuICAgICAgWzEyLCAxNTEsIDEyMSwgNywgMTUyLCAxMjJdLFxuICAgICAgWzEyLCA3NSwgNDcsIDI2LCA3NiwgNDhdLFxuICAgICAgWzM5LCA1NCwgMjQsIDE0LCA1NSwgMjVdLFxuICAgICAgWzIyLCA0NSwgMTUsIDQxLCA0NiwgMTZdLFxuXG4gICAgICAvLyAzNlxuICAgICAgWzYsIDE1MSwgMTIxLCAxNCwgMTUyLCAxMjJdLFxuICAgICAgWzYsIDc1LCA0NywgMzQsIDc2LCA0OF0sXG4gICAgICBbNDYsIDU0LCAyNCwgMTAsIDU1LCAyNV0sXG4gICAgICBbMiwgNDUsIDE1LCA2NCwgNDYsIDE2XSxcblxuICAgICAgLy8gMzdcbiAgICAgIFsxNywgMTUyLCAxMjIsIDQsIDE1MywgMTIzXSxcbiAgICAgIFsyOSwgNzQsIDQ2LCAxNCwgNzUsIDQ3XSxcbiAgICAgIFs0OSwgNTQsIDI0LCAxMCwgNTUsIDI1XSxcbiAgICAgIFsyNCwgNDUsIDE1LCA0NiwgNDYsIDE2XSxcblxuICAgICAgLy8gMzhcbiAgICAgIFs0LCAxNTIsIDEyMiwgMTgsIDE1MywgMTIzXSxcbiAgICAgIFsxMywgNzQsIDQ2LCAzMiwgNzUsIDQ3XSxcbiAgICAgIFs0OCwgNTQsIDI0LCAxNCwgNTUsIDI1XSxcbiAgICAgIFs0MiwgNDUsIDE1LCAzMiwgNDYsIDE2XSxcblxuICAgICAgLy8gMzlcbiAgICAgIFsyMCwgMTQ3LCAxMTcsIDQsIDE0OCwgMTE4XSxcbiAgICAgIFs0MCwgNzUsIDQ3LCA3LCA3NiwgNDhdLFxuICAgICAgWzQzLCA1NCwgMjQsIDIyLCA1NSwgMjVdLFxuICAgICAgWzEwLCA0NSwgMTUsIDY3LCA0NiwgMTZdLFxuXG4gICAgICAvLyA0MFxuICAgICAgWzE5LCAxNDgsIDExOCwgNiwgMTQ5LCAxMTldLFxuICAgICAgWzE4LCA3NSwgNDcsIDMxLCA3NiwgNDhdLFxuICAgICAgWzM0LCA1NCwgMjQsIDM0LCA1NSwgMjVdLFxuICAgICAgWzIwLCA0NSwgMTUsIDYxLCA0NiwgMTZdXG4gICAgXTtcblxuICAgIHZhciBxclJTQmxvY2sgPSBmdW5jdGlvbih0b3RhbENvdW50LCBkYXRhQ291bnQpIHtcbiAgICAgIHZhciBfdGhpcyA9IHt9O1xuICAgICAgX3RoaXMudG90YWxDb3VudCA9IHRvdGFsQ291bnQ7XG4gICAgICBfdGhpcy5kYXRhQ291bnQgPSBkYXRhQ291bnQ7XG4gICAgICByZXR1cm4gX3RoaXM7XG4gICAgfTtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgdmFyIGdldFJzQmxvY2tUYWJsZSA9IGZ1bmN0aW9uKHR5cGVOdW1iZXIsIGVycm9yQ29ycmVjdGlvbkxldmVsKSB7XG5cbiAgICAgIHN3aXRjaChlcnJvckNvcnJlY3Rpb25MZXZlbCkge1xuICAgICAgY2FzZSBRUkVycm9yQ29ycmVjdGlvbkxldmVsLkwgOlxuICAgICAgICByZXR1cm4gUlNfQkxPQ0tfVEFCTEVbKHR5cGVOdW1iZXIgLSAxKSAqIDQgKyAwXTtcbiAgICAgIGNhc2UgUVJFcnJvckNvcnJlY3Rpb25MZXZlbC5NIDpcbiAgICAgICAgcmV0dXJuIFJTX0JMT0NLX1RBQkxFWyh0eXBlTnVtYmVyIC0gMSkgKiA0ICsgMV07XG4gICAgICBjYXNlIFFSRXJyb3JDb3JyZWN0aW9uTGV2ZWwuUSA6XG4gICAgICAgIHJldHVybiBSU19CTE9DS19UQUJMRVsodHlwZU51bWJlciAtIDEpICogNCArIDJdO1xuICAgICAgY2FzZSBRUkVycm9yQ29ycmVjdGlvbkxldmVsLkggOlxuICAgICAgICByZXR1cm4gUlNfQkxPQ0tfVEFCTEVbKHR5cGVOdW1iZXIgLSAxKSAqIDQgKyAzXTtcbiAgICAgIGRlZmF1bHQgOlxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy5nZXRSU0Jsb2NrcyA9IGZ1bmN0aW9uKHR5cGVOdW1iZXIsIGVycm9yQ29ycmVjdGlvbkxldmVsKSB7XG5cbiAgICAgIHZhciByc0Jsb2NrID0gZ2V0UnNCbG9ja1RhYmxlKHR5cGVOdW1iZXIsIGVycm9yQ29ycmVjdGlvbkxldmVsKTtcblxuICAgICAgaWYgKHR5cGVvZiByc0Jsb2NrID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93ICdiYWQgcnMgYmxvY2sgQCB0eXBlTnVtYmVyOicgKyB0eXBlTnVtYmVyICtcbiAgICAgICAgICAgICcvZXJyb3JDb3JyZWN0aW9uTGV2ZWw6JyArIGVycm9yQ29ycmVjdGlvbkxldmVsO1xuICAgICAgfVxuXG4gICAgICB2YXIgbGVuZ3RoID0gcnNCbG9jay5sZW5ndGggLyAzO1xuXG4gICAgICB2YXIgbGlzdCA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG5cbiAgICAgICAgdmFyIGNvdW50ID0gcnNCbG9ja1tpICogMyArIDBdO1xuICAgICAgICB2YXIgdG90YWxDb3VudCA9IHJzQmxvY2tbaSAqIDMgKyAxXTtcbiAgICAgICAgdmFyIGRhdGFDb3VudCA9IHJzQmxvY2tbaSAqIDMgKyAyXTtcblxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvdW50OyBqICs9IDEpIHtcbiAgICAgICAgICBsaXN0LnB1c2gocXJSU0Jsb2NrKHRvdGFsQ291bnQsIGRhdGFDb3VudCkgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gbGlzdDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9KCk7XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcXJCaXRCdWZmZXJcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgcXJCaXRCdWZmZXIgPSBmdW5jdGlvbigpIHtcblxuICAgIHZhciBfYnVmZmVyID0gW107XG4gICAgdmFyIF9sZW5ndGggPSAwO1xuXG4gICAgdmFyIF90aGlzID0ge307XG5cbiAgICBfdGhpcy5nZXRCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfYnVmZmVyO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRBdCA9IGZ1bmN0aW9uKGluZGV4KSB7XG4gICAgICB2YXIgYnVmSW5kZXggPSBNYXRoLmZsb29yKGluZGV4IC8gOCk7XG4gICAgICByZXR1cm4gKCAoX2J1ZmZlcltidWZJbmRleF0gPj4+ICg3IC0gaW5kZXggJSA4KSApICYgMSkgPT0gMTtcbiAgICB9O1xuXG4gICAgX3RoaXMucHV0ID0gZnVuY3Rpb24obnVtLCBsZW5ndGgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgX3RoaXMucHV0Qml0KCAoIChudW0gPj4+IChsZW5ndGggLSBpIC0gMSkgKSAmIDEpID09IDEpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy5nZXRMZW5ndGhJbkJpdHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfbGVuZ3RoO1xuICAgIH07XG5cbiAgICBfdGhpcy5wdXRCaXQgPSBmdW5jdGlvbihiaXQpIHtcblxuICAgICAgdmFyIGJ1ZkluZGV4ID0gTWF0aC5mbG9vcihfbGVuZ3RoIC8gOCk7XG4gICAgICBpZiAoX2J1ZmZlci5sZW5ndGggPD0gYnVmSW5kZXgpIHtcbiAgICAgICAgX2J1ZmZlci5wdXNoKDApO1xuICAgICAgfVxuXG4gICAgICBpZiAoYml0KSB7XG4gICAgICAgIF9idWZmZXJbYnVmSW5kZXhdIHw9ICgweDgwID4+PiAoX2xlbmd0aCAlIDgpICk7XG4gICAgICB9XG5cbiAgICAgIF9sZW5ndGggKz0gMTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyTnVtYmVyXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHFyTnVtYmVyID0gZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgdmFyIF9tb2RlID0gUVJNb2RlLk1PREVfTlVNQkVSO1xuICAgIHZhciBfZGF0YSA9IGRhdGE7XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLmdldE1vZGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBfbW9kZTtcbiAgICB9O1xuXG4gICAgX3RoaXMuZ2V0TGVuZ3RoID0gZnVuY3Rpb24oYnVmZmVyKSB7XG4gICAgICByZXR1cm4gX2RhdGEubGVuZ3RoO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuXG4gICAgICB2YXIgZGF0YSA9IF9kYXRhO1xuXG4gICAgICB2YXIgaSA9IDA7XG5cbiAgICAgIHdoaWxlIChpICsgMiA8IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgIGJ1ZmZlci5wdXQoc3RyVG9OdW0oZGF0YS5zdWJzdHJpbmcoaSwgaSArIDMpICksIDEwKTtcbiAgICAgICAgaSArPSAzO1xuICAgICAgfVxuXG4gICAgICBpZiAoaSA8IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgIGlmIChkYXRhLmxlbmd0aCAtIGkgPT0gMSkge1xuICAgICAgICAgIGJ1ZmZlci5wdXQoc3RyVG9OdW0oZGF0YS5zdWJzdHJpbmcoaSwgaSArIDEpICksIDQpO1xuICAgICAgICB9IGVsc2UgaWYgKGRhdGEubGVuZ3RoIC0gaSA9PSAyKSB7XG4gICAgICAgICAgYnVmZmVyLnB1dChzdHJUb051bShkYXRhLnN1YnN0cmluZyhpLCBpICsgMikgKSwgNyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdmFyIHN0clRvTnVtID0gZnVuY3Rpb24ocykge1xuICAgICAgdmFyIG51bSA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgbnVtID0gbnVtICogMTAgKyBjaGF0VG9OdW0ocy5jaGFyQXQoaSkgKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudW07XG4gICAgfTtcblxuICAgIHZhciBjaGF0VG9OdW0gPSBmdW5jdGlvbihjKSB7XG4gICAgICBpZiAoJzAnIDw9IGMgJiYgYyA8PSAnOScpIHtcbiAgICAgICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKSAtICcwJy5jaGFyQ29kZUF0KDApO1xuICAgICAgfVxuICAgICAgdGhyb3cgJ2lsbGVnYWwgY2hhciA6JyArIGM7XG4gICAgfTtcblxuICAgIHJldHVybiBfdGhpcztcbiAgfTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBxckFscGhhTnVtXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIHFyQWxwaGFOdW0gPSBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICB2YXIgX21vZGUgPSBRUk1vZGUuTU9ERV9BTFBIQV9OVU07XG4gICAgdmFyIF9kYXRhID0gZGF0YTtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgX3RoaXMuZ2V0TW9kZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9tb2RlO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRMZW5ndGggPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgICAgIHJldHVybiBfZGF0YS5sZW5ndGg7XG4gICAgfTtcblxuICAgIF90aGlzLndyaXRlID0gZnVuY3Rpb24oYnVmZmVyKSB7XG5cbiAgICAgIHZhciBzID0gX2RhdGE7XG5cbiAgICAgIHZhciBpID0gMDtcblxuICAgICAgd2hpbGUgKGkgKyAxIDwgcy5sZW5ndGgpIHtcbiAgICAgICAgYnVmZmVyLnB1dChcbiAgICAgICAgICBnZXRDb2RlKHMuY2hhckF0KGkpICkgKiA0NSArXG4gICAgICAgICAgZ2V0Q29kZShzLmNoYXJBdChpICsgMSkgKSwgMTEpO1xuICAgICAgICBpICs9IDI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpIDwgcy5sZW5ndGgpIHtcbiAgICAgICAgYnVmZmVyLnB1dChnZXRDb2RlKHMuY2hhckF0KGkpICksIDYpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgZ2V0Q29kZSA9IGZ1bmN0aW9uKGMpIHtcblxuICAgICAgaWYgKCcwJyA8PSBjICYmIGMgPD0gJzknKSB7XG4gICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCkgLSAnMCcuY2hhckNvZGVBdCgwKTtcbiAgICAgIH0gZWxzZSBpZiAoJ0EnIDw9IGMgJiYgYyA8PSAnWicpIHtcbiAgICAgICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKSAtICdBJy5jaGFyQ29kZUF0KDApICsgMTA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzd2l0Y2ggKGMpIHtcbiAgICAgICAgY2FzZSAnICcgOiByZXR1cm4gMzY7XG4gICAgICAgIGNhc2UgJyQnIDogcmV0dXJuIDM3O1xuICAgICAgICBjYXNlICclJyA6IHJldHVybiAzODtcbiAgICAgICAgY2FzZSAnKicgOiByZXR1cm4gMzk7XG4gICAgICAgIGNhc2UgJysnIDogcmV0dXJuIDQwO1xuICAgICAgICBjYXNlICctJyA6IHJldHVybiA0MTtcbiAgICAgICAgY2FzZSAnLicgOiByZXR1cm4gNDI7XG4gICAgICAgIGNhc2UgJy8nIDogcmV0dXJuIDQzO1xuICAgICAgICBjYXNlICc6JyA6IHJldHVybiA0NDtcbiAgICAgICAgZGVmYXVsdCA6XG4gICAgICAgICAgdGhyb3cgJ2lsbGVnYWwgY2hhciA6JyArIGM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHFyOEJpdEJ5dGVcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgcXI4Qml0Qnl0ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgIHZhciBfbW9kZSA9IFFSTW9kZS5NT0RFXzhCSVRfQllURTtcbiAgICB2YXIgX2RhdGEgPSBkYXRhO1xuICAgIHZhciBfYnl0ZXMgPSBxcmNvZGUuc3RyaW5nVG9CeXRlcyhkYXRhKTtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgX3RoaXMuZ2V0TW9kZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9tb2RlO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRMZW5ndGggPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgICAgIHJldHVybiBfYnl0ZXMubGVuZ3RoO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfYnl0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgYnVmZmVyLnB1dChfYnl0ZXNbaV0sIDgpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcXJLYW5qaVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIHZhciBxckthbmppID0gZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgdmFyIF9tb2RlID0gUVJNb2RlLk1PREVfS0FOSkk7XG4gICAgdmFyIF9kYXRhID0gZGF0YTtcblxuICAgIHZhciBzdHJpbmdUb0J5dGVzID0gcXJjb2RlLnN0cmluZ1RvQnl0ZXNGdW5jc1snU0pJUyddO1xuICAgIGlmICghc3RyaW5nVG9CeXRlcykge1xuICAgICAgdGhyb3cgJ3NqaXMgbm90IHN1cHBvcnRlZC4nO1xuICAgIH1cbiAgICAhZnVuY3Rpb24oYywgY29kZSkge1xuICAgICAgLy8gc2VsZiB0ZXN0IGZvciBzamlzIHN1cHBvcnQuXG4gICAgICB2YXIgdGVzdCA9IHN0cmluZ1RvQnl0ZXMoYyk7XG4gICAgICBpZiAodGVzdC5sZW5ndGggIT0gMiB8fCAoICh0ZXN0WzBdIDw8IDgpIHwgdGVzdFsxXSkgIT0gY29kZSkge1xuICAgICAgICB0aHJvdyAnc2ppcyBub3Qgc3VwcG9ydGVkLic7XG4gICAgICB9XG4gICAgfSgnXFx1NTNjYicsIDB4OTc0Nik7XG5cbiAgICB2YXIgX2J5dGVzID0gc3RyaW5nVG9CeXRlcyhkYXRhKTtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgX3RoaXMuZ2V0TW9kZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIF9tb2RlO1xuICAgIH07XG5cbiAgICBfdGhpcy5nZXRMZW5ndGggPSBmdW5jdGlvbihidWZmZXIpIHtcbiAgICAgIHJldHVybiB+fihfYnl0ZXMubGVuZ3RoIC8gMik7XG4gICAgfTtcblxuICAgIF90aGlzLndyaXRlID0gZnVuY3Rpb24oYnVmZmVyKSB7XG5cbiAgICAgIHZhciBkYXRhID0gX2J5dGVzO1xuXG4gICAgICB2YXIgaSA9IDA7XG5cbiAgICAgIHdoaWxlIChpICsgMSA8IGRhdGEubGVuZ3RoKSB7XG5cbiAgICAgICAgdmFyIGMgPSAoICgweGZmICYgZGF0YVtpXSkgPDwgOCkgfCAoMHhmZiAmIGRhdGFbaSArIDFdKTtcblxuICAgICAgICBpZiAoMHg4MTQwIDw9IGMgJiYgYyA8PSAweDlGRkMpIHtcbiAgICAgICAgICBjIC09IDB4ODE0MDtcbiAgICAgICAgfSBlbHNlIGlmICgweEUwNDAgPD0gYyAmJiBjIDw9IDB4RUJCRikge1xuICAgICAgICAgIGMgLT0gMHhDMTQwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93ICdpbGxlZ2FsIGNoYXIgYXQgJyArIChpICsgMSkgKyAnLycgKyBjO1xuICAgICAgICB9XG5cbiAgICAgICAgYyA9ICggKGMgPj4+IDgpICYgMHhmZikgKiAweEMwICsgKGMgJiAweGZmKTtcblxuICAgICAgICBidWZmZXIucHV0KGMsIDEzKTtcblxuICAgICAgICBpICs9IDI7XG4gICAgICB9XG5cbiAgICAgIGlmIChpIDwgZGF0YS5sZW5ndGgpIHtcbiAgICAgICAgdGhyb3cgJ2lsbGVnYWwgY2hhciBhdCAnICsgKGkgKyAxKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEdJRiBTdXBwb3J0IGV0Yy5cbiAgLy9cblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBieXRlQXJyYXlPdXRwdXRTdHJlYW1cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgYnl0ZUFycmF5T3V0cHV0U3RyZWFtID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgX2J5dGVzID0gW107XG5cbiAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgIF90aGlzLndyaXRlQnl0ZSA9IGZ1bmN0aW9uKGIpIHtcbiAgICAgIF9ieXRlcy5wdXNoKGIgJiAweGZmKTtcbiAgICB9O1xuXG4gICAgX3RoaXMud3JpdGVTaG9ydCA9IGZ1bmN0aW9uKGkpIHtcbiAgICAgIF90aGlzLndyaXRlQnl0ZShpKTtcbiAgICAgIF90aGlzLndyaXRlQnl0ZShpID4+PiA4KTtcbiAgICB9O1xuXG4gICAgX3RoaXMud3JpdGVCeXRlcyA9IGZ1bmN0aW9uKGIsIG9mZiwgbGVuKSB7XG4gICAgICBvZmYgPSBvZmYgfHwgMDtcbiAgICAgIGxlbiA9IGxlbiB8fCBiLmxlbmd0aDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgX3RoaXMud3JpdGVCeXRlKGJbaSArIG9mZl0pO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZVN0cmluZyA9IGZ1bmN0aW9uKHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBfdGhpcy53cml0ZUJ5dGUocy5jaGFyQ29kZUF0KGkpICk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLnRvQnl0ZUFycmF5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gX2J5dGVzO1xuICAgIH07XG5cbiAgICBfdGhpcy50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHMgPSAnJztcbiAgICAgIHMgKz0gJ1snO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfYnl0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgcyArPSAnLCc7XG4gICAgICAgIH1cbiAgICAgICAgcyArPSBfYnl0ZXNbaV07XG4gICAgICB9XG4gICAgICBzICs9ICddJztcbiAgICAgIHJldHVybiBzO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gYmFzZTY0RW5jb2RlT3V0cHV0U3RyZWFtXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIGJhc2U2NEVuY29kZU91dHB1dFN0cmVhbSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIF9idWZmZXIgPSAwO1xuICAgIHZhciBfYnVmbGVuID0gMDtcbiAgICB2YXIgX2xlbmd0aCA9IDA7XG4gICAgdmFyIF9iYXNlNjQgPSAnJztcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgdmFyIHdyaXRlRW5jb2RlZCA9IGZ1bmN0aW9uKGIpIHtcbiAgICAgIF9iYXNlNjQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShlbmNvZGUoYiAmIDB4M2YpICk7XG4gICAgfTtcblxuICAgIHZhciBlbmNvZGUgPSBmdW5jdGlvbihuKSB7XG4gICAgICBpZiAobiA8IDApIHtcbiAgICAgICAgLy8gZXJyb3IuXG4gICAgICB9IGVsc2UgaWYgKG4gPCAyNikge1xuICAgICAgICByZXR1cm4gMHg0MSArIG47XG4gICAgICB9IGVsc2UgaWYgKG4gPCA1Mikge1xuICAgICAgICByZXR1cm4gMHg2MSArIChuIC0gMjYpO1xuICAgICAgfSBlbHNlIGlmIChuIDwgNjIpIHtcbiAgICAgICAgcmV0dXJuIDB4MzAgKyAobiAtIDUyKTtcbiAgICAgIH0gZWxzZSBpZiAobiA9PSA2Mikge1xuICAgICAgICByZXR1cm4gMHgyYjtcbiAgICAgIH0gZWxzZSBpZiAobiA9PSA2Mykge1xuICAgICAgICByZXR1cm4gMHgyZjtcbiAgICAgIH1cbiAgICAgIHRocm93ICduOicgKyBuO1xuICAgIH07XG5cbiAgICBfdGhpcy53cml0ZUJ5dGUgPSBmdW5jdGlvbihuKSB7XG5cbiAgICAgIF9idWZmZXIgPSAoX2J1ZmZlciA8PCA4KSB8IChuICYgMHhmZik7XG4gICAgICBfYnVmbGVuICs9IDg7XG4gICAgICBfbGVuZ3RoICs9IDE7XG5cbiAgICAgIHdoaWxlIChfYnVmbGVuID49IDYpIHtcbiAgICAgICAgd3JpdGVFbmNvZGVkKF9idWZmZXIgPj4+IChfYnVmbGVuIC0gNikgKTtcbiAgICAgICAgX2J1ZmxlbiAtPSA2O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfdGhpcy5mbHVzaCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICBpZiAoX2J1ZmxlbiA+IDApIHtcbiAgICAgICAgd3JpdGVFbmNvZGVkKF9idWZmZXIgPDwgKDYgLSBfYnVmbGVuKSApO1xuICAgICAgICBfYnVmZmVyID0gMDtcbiAgICAgICAgX2J1ZmxlbiA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChfbGVuZ3RoICUgMyAhPSAwKSB7XG4gICAgICAgIC8vIHBhZGRpbmdcbiAgICAgICAgdmFyIHBhZGxlbiA9IDMgLSBfbGVuZ3RoICUgMztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWRsZW47IGkgKz0gMSkge1xuICAgICAgICAgIF9iYXNlNjQgKz0gJz0nO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIF90aGlzLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gX2Jhc2U2NDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIF90aGlzO1xuICB9O1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIGJhc2U2NERlY29kZUlucHV0U3RyZWFtXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgdmFyIGJhc2U2NERlY29kZUlucHV0U3RyZWFtID0gZnVuY3Rpb24oc3RyKSB7XG5cbiAgICB2YXIgX3N0ciA9IHN0cjtcbiAgICB2YXIgX3BvcyA9IDA7XG4gICAgdmFyIF9idWZmZXIgPSAwO1xuICAgIHZhciBfYnVmbGVuID0gMDtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgX3RoaXMucmVhZCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICB3aGlsZSAoX2J1ZmxlbiA8IDgpIHtcblxuICAgICAgICBpZiAoX3BvcyA+PSBfc3RyLmxlbmd0aCkge1xuICAgICAgICAgIGlmIChfYnVmbGVuID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhyb3cgJ3VuZXhwZWN0ZWQgZW5kIG9mIGZpbGUuLycgKyBfYnVmbGVuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGMgPSBfc3RyLmNoYXJBdChfcG9zKTtcbiAgICAgICAgX3BvcyArPSAxO1xuXG4gICAgICAgIGlmIChjID09ICc9Jykge1xuICAgICAgICAgIF9idWZsZW4gPSAwO1xuICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChjLm1hdGNoKC9eXFxzJC8pICkge1xuICAgICAgICAgIC8vIGlnbm9yZSBpZiB3aGl0ZXNwYWNlLlxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgX2J1ZmZlciA9IChfYnVmZmVyIDw8IDYpIHwgZGVjb2RlKGMuY2hhckNvZGVBdCgwKSApO1xuICAgICAgICBfYnVmbGVuICs9IDY7XG4gICAgICB9XG5cbiAgICAgIHZhciBuID0gKF9idWZmZXIgPj4+IChfYnVmbGVuIC0gOCkgKSAmIDB4ZmY7XG4gICAgICBfYnVmbGVuIC09IDg7XG4gICAgICByZXR1cm4gbjtcbiAgICB9O1xuXG4gICAgdmFyIGRlY29kZSA9IGZ1bmN0aW9uKGMpIHtcbiAgICAgIGlmICgweDQxIDw9IGMgJiYgYyA8PSAweDVhKSB7XG4gICAgICAgIHJldHVybiBjIC0gMHg0MTtcbiAgICAgIH0gZWxzZSBpZiAoMHg2MSA8PSBjICYmIGMgPD0gMHg3YSkge1xuICAgICAgICByZXR1cm4gYyAtIDB4NjEgKyAyNjtcbiAgICAgIH0gZWxzZSBpZiAoMHgzMCA8PSBjICYmIGMgPD0gMHgzOSkge1xuICAgICAgICByZXR1cm4gYyAtIDB4MzAgKyA1MjtcbiAgICAgIH0gZWxzZSBpZiAoYyA9PSAweDJiKSB7XG4gICAgICAgIHJldHVybiA2MjtcbiAgICAgIH0gZWxzZSBpZiAoYyA9PSAweDJmKSB7XG4gICAgICAgIHJldHVybiA2MztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93ICdjOicgKyBjO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gZ2lmSW1hZ2UgKEIvVylcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgZ2lmSW1hZ2UgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0KSB7XG5cbiAgICB2YXIgX3dpZHRoID0gd2lkdGg7XG4gICAgdmFyIF9oZWlnaHQgPSBoZWlnaHQ7XG4gICAgdmFyIF9kYXRhID0gbmV3IEFycmF5KHdpZHRoICogaGVpZ2h0KTtcblxuICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgX3RoaXMuc2V0UGl4ZWwgPSBmdW5jdGlvbih4LCB5LCBwaXhlbCkge1xuICAgICAgX2RhdGFbeSAqIF93aWR0aCArIHhdID0gcGl4ZWw7XG4gICAgfTtcblxuICAgIF90aGlzLndyaXRlID0gZnVuY3Rpb24ob3V0KSB7XG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBHSUYgU2lnbmF0dXJlXG5cbiAgICAgIG91dC53cml0ZVN0cmluZygnR0lGODdhJyk7XG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBTY3JlZW4gRGVzY3JpcHRvclxuXG4gICAgICBvdXQud3JpdGVTaG9ydChfd2lkdGgpO1xuICAgICAgb3V0LndyaXRlU2hvcnQoX2hlaWdodCk7XG5cbiAgICAgIG91dC53cml0ZUJ5dGUoMHg4MCk7IC8vIDJiaXRcbiAgICAgIG91dC53cml0ZUJ5dGUoMCk7XG4gICAgICBvdXQud3JpdGVCeXRlKDApO1xuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gR2xvYmFsIENvbG9yIE1hcFxuXG4gICAgICAvLyBibGFja1xuICAgICAgb3V0LndyaXRlQnl0ZSgweDAwKTtcbiAgICAgIG91dC53cml0ZUJ5dGUoMHgwMCk7XG4gICAgICBvdXQud3JpdGVCeXRlKDB4MDApO1xuXG4gICAgICAvLyB3aGl0ZVxuICAgICAgb3V0LndyaXRlQnl0ZSgweGZmKTtcbiAgICAgIG91dC53cml0ZUJ5dGUoMHhmZik7XG4gICAgICBvdXQud3JpdGVCeXRlKDB4ZmYpO1xuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gSW1hZ2UgRGVzY3JpcHRvclxuXG4gICAgICBvdXQud3JpdGVTdHJpbmcoJywnKTtcbiAgICAgIG91dC53cml0ZVNob3J0KDApO1xuICAgICAgb3V0LndyaXRlU2hvcnQoMCk7XG4gICAgICBvdXQud3JpdGVTaG9ydChfd2lkdGgpO1xuICAgICAgb3V0LndyaXRlU2hvcnQoX2hlaWdodCk7XG4gICAgICBvdXQud3JpdGVCeXRlKDApO1xuXG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgLy8gTG9jYWwgQ29sb3IgTWFwXG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBSYXN0ZXIgRGF0YVxuXG4gICAgICB2YXIgbHp3TWluQ29kZVNpemUgPSAyO1xuICAgICAgdmFyIHJhc3RlciA9IGdldExaV1Jhc3RlcihsendNaW5Db2RlU2l6ZSk7XG5cbiAgICAgIG91dC53cml0ZUJ5dGUobHp3TWluQ29kZVNpemUpO1xuXG4gICAgICB2YXIgb2Zmc2V0ID0gMDtcblxuICAgICAgd2hpbGUgKHJhc3Rlci5sZW5ndGggLSBvZmZzZXQgPiAyNTUpIHtcbiAgICAgICAgb3V0LndyaXRlQnl0ZSgyNTUpO1xuICAgICAgICBvdXQud3JpdGVCeXRlcyhyYXN0ZXIsIG9mZnNldCwgMjU1KTtcbiAgICAgICAgb2Zmc2V0ICs9IDI1NTtcbiAgICAgIH1cblxuICAgICAgb3V0LndyaXRlQnl0ZShyYXN0ZXIubGVuZ3RoIC0gb2Zmc2V0KTtcbiAgICAgIG91dC53cml0ZUJ5dGVzKHJhc3Rlciwgb2Zmc2V0LCByYXN0ZXIubGVuZ3RoIC0gb2Zmc2V0KTtcbiAgICAgIG91dC53cml0ZUJ5dGUoMHgwMCk7XG5cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAvLyBHSUYgVGVybWluYXRvclxuICAgICAgb3V0LndyaXRlU3RyaW5nKCc7Jyk7XG4gICAgfTtcblxuICAgIHZhciBiaXRPdXRwdXRTdHJlYW0gPSBmdW5jdGlvbihvdXQpIHtcblxuICAgICAgdmFyIF9vdXQgPSBvdXQ7XG4gICAgICB2YXIgX2JpdExlbmd0aCA9IDA7XG4gICAgICB2YXIgX2JpdEJ1ZmZlciA9IDA7XG5cbiAgICAgIHZhciBfdGhpcyA9IHt9O1xuXG4gICAgICBfdGhpcy53cml0ZSA9IGZ1bmN0aW9uKGRhdGEsIGxlbmd0aCkge1xuXG4gICAgICAgIGlmICggKGRhdGEgPj4+IGxlbmd0aCkgIT0gMCkge1xuICAgICAgICAgIHRocm93ICdsZW5ndGggb3Zlcic7XG4gICAgICAgIH1cblxuICAgICAgICB3aGlsZSAoX2JpdExlbmd0aCArIGxlbmd0aCA+PSA4KSB7XG4gICAgICAgICAgX291dC53cml0ZUJ5dGUoMHhmZiAmICggKGRhdGEgPDwgX2JpdExlbmd0aCkgfCBfYml0QnVmZmVyKSApO1xuICAgICAgICAgIGxlbmd0aCAtPSAoOCAtIF9iaXRMZW5ndGgpO1xuICAgICAgICAgIGRhdGEgPj4+PSAoOCAtIF9iaXRMZW5ndGgpO1xuICAgICAgICAgIF9iaXRCdWZmZXIgPSAwO1xuICAgICAgICAgIF9iaXRMZW5ndGggPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgX2JpdEJ1ZmZlciA9IChkYXRhIDw8IF9iaXRMZW5ndGgpIHwgX2JpdEJ1ZmZlcjtcbiAgICAgICAgX2JpdExlbmd0aCA9IF9iaXRMZW5ndGggKyBsZW5ndGg7XG4gICAgICB9O1xuXG4gICAgICBfdGhpcy5mbHVzaCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoX2JpdExlbmd0aCA+IDApIHtcbiAgICAgICAgICBfb3V0LndyaXRlQnl0ZShfYml0QnVmZmVyKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH07XG5cbiAgICB2YXIgZ2V0TFpXUmFzdGVyID0gZnVuY3Rpb24obHp3TWluQ29kZVNpemUpIHtcblxuICAgICAgdmFyIGNsZWFyQ29kZSA9IDEgPDwgbHp3TWluQ29kZVNpemU7XG4gICAgICB2YXIgZW5kQ29kZSA9ICgxIDw8IGx6d01pbkNvZGVTaXplKSArIDE7XG4gICAgICB2YXIgYml0TGVuZ3RoID0gbHp3TWluQ29kZVNpemUgKyAxO1xuXG4gICAgICAvLyBTZXR1cCBMWldUYWJsZVxuICAgICAgdmFyIHRhYmxlID0gbHp3VGFibGUoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjbGVhckNvZGU7IGkgKz0gMSkge1xuICAgICAgICB0YWJsZS5hZGQoU3RyaW5nLmZyb21DaGFyQ29kZShpKSApO1xuICAgICAgfVxuICAgICAgdGFibGUuYWRkKFN0cmluZy5mcm9tQ2hhckNvZGUoY2xlYXJDb2RlKSApO1xuICAgICAgdGFibGUuYWRkKFN0cmluZy5mcm9tQ2hhckNvZGUoZW5kQ29kZSkgKTtcblxuICAgICAgdmFyIGJ5dGVPdXQgPSBieXRlQXJyYXlPdXRwdXRTdHJlYW0oKTtcbiAgICAgIHZhciBiaXRPdXQgPSBiaXRPdXRwdXRTdHJlYW0oYnl0ZU91dCk7XG5cbiAgICAgIC8vIGNsZWFyIGNvZGVcbiAgICAgIGJpdE91dC53cml0ZShjbGVhckNvZGUsIGJpdExlbmd0aCk7XG5cbiAgICAgIHZhciBkYXRhSW5kZXggPSAwO1xuXG4gICAgICB2YXIgcyA9IFN0cmluZy5mcm9tQ2hhckNvZGUoX2RhdGFbZGF0YUluZGV4XSk7XG4gICAgICBkYXRhSW5kZXggKz0gMTtcblxuICAgICAgd2hpbGUgKGRhdGFJbmRleCA8IF9kYXRhLmxlbmd0aCkge1xuXG4gICAgICAgIHZhciBjID0gU3RyaW5nLmZyb21DaGFyQ29kZShfZGF0YVtkYXRhSW5kZXhdKTtcbiAgICAgICAgZGF0YUluZGV4ICs9IDE7XG5cbiAgICAgICAgaWYgKHRhYmxlLmNvbnRhaW5zKHMgKyBjKSApIHtcblxuICAgICAgICAgIHMgPSBzICsgYztcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgYml0T3V0LndyaXRlKHRhYmxlLmluZGV4T2YocyksIGJpdExlbmd0aCk7XG5cbiAgICAgICAgICBpZiAodGFibGUuc2l6ZSgpIDwgMHhmZmYpIHtcblxuICAgICAgICAgICAgaWYgKHRhYmxlLnNpemUoKSA9PSAoMSA8PCBiaXRMZW5ndGgpICkge1xuICAgICAgICAgICAgICBiaXRMZW5ndGggKz0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGFibGUuYWRkKHMgKyBjKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzID0gYztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBiaXRPdXQud3JpdGUodGFibGUuaW5kZXhPZihzKSwgYml0TGVuZ3RoKTtcblxuICAgICAgLy8gZW5kIGNvZGVcbiAgICAgIGJpdE91dC53cml0ZShlbmRDb2RlLCBiaXRMZW5ndGgpO1xuXG4gICAgICBiaXRPdXQuZmx1c2goKTtcblxuICAgICAgcmV0dXJuIGJ5dGVPdXQudG9CeXRlQXJyYXkoKTtcbiAgICB9O1xuXG4gICAgdmFyIGx6d1RhYmxlID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBfbWFwID0ge307XG4gICAgICB2YXIgX3NpemUgPSAwO1xuXG4gICAgICB2YXIgX3RoaXMgPSB7fTtcblxuICAgICAgX3RoaXMuYWRkID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIGlmIChfdGhpcy5jb250YWlucyhrZXkpICkge1xuICAgICAgICAgIHRocm93ICdkdXAga2V5OicgKyBrZXk7XG4gICAgICAgIH1cbiAgICAgICAgX21hcFtrZXldID0gX3NpemU7XG4gICAgICAgIF9zaXplICs9IDE7XG4gICAgICB9O1xuXG4gICAgICBfdGhpcy5zaXplID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBfc2l6ZTtcbiAgICAgIH07XG5cbiAgICAgIF90aGlzLmluZGV4T2YgPSBmdW5jdGlvbihrZXkpIHtcbiAgICAgICAgcmV0dXJuIF9tYXBba2V5XTtcbiAgICAgIH07XG5cbiAgICAgIF90aGlzLmNvbnRhaW5zID0gZnVuY3Rpb24oa2V5KSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgX21hcFtrZXldICE9ICd1bmRlZmluZWQnO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH07XG5cbiAgICByZXR1cm4gX3RoaXM7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZURhdGFVUkwgPSBmdW5jdGlvbih3aWR0aCwgaGVpZ2h0LCBnZXRQaXhlbCkge1xuICAgIHZhciBnaWYgPSBnaWZJbWFnZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICBmb3IgKHZhciB5ID0gMDsgeSA8IGhlaWdodDsgeSArPSAxKSB7XG4gICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHdpZHRoOyB4ICs9IDEpIHtcbiAgICAgICAgZ2lmLnNldFBpeGVsKHgsIHksIGdldFBpeGVsKHgsIHkpICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGIgPSBieXRlQXJyYXlPdXRwdXRTdHJlYW0oKTtcbiAgICBnaWYud3JpdGUoYik7XG5cbiAgICB2YXIgYmFzZTY0ID0gYmFzZTY0RW5jb2RlT3V0cHV0U3RyZWFtKCk7XG4gICAgdmFyIGJ5dGVzID0gYi50b0J5dGVBcnJheSgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGJhc2U2NC53cml0ZUJ5dGUoYnl0ZXNbaV0pO1xuICAgIH1cbiAgICBiYXNlNjQuZmx1c2goKTtcblxuICAgIHJldHVybiAnZGF0YTppbWFnZS9naWY7YmFzZTY0LCcgKyBiYXNlNjQ7XG4gIH07XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gcmV0dXJucyBxcmNvZGUgZnVuY3Rpb24uXG5cbiAgcmV0dXJuIHFyY29kZTtcbn0oKTtcblxuLy8gbXVsdGlieXRlIHN1cHBvcnRcbiFmdW5jdGlvbigpIHtcblxuICBxcmNvZGUuc3RyaW5nVG9CeXRlc0Z1bmNzWydVVEYtOCddID0gZnVuY3Rpb24ocykge1xuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTg3Mjk0MDUvaG93LXRvLWNvbnZlcnQtdXRmOC1zdHJpbmctdG8tYnl0ZS1hcnJheVxuICAgIGZ1bmN0aW9uIHRvVVRGOEFycmF5KHN0cikge1xuICAgICAgdmFyIHV0ZjggPSBbXTtcbiAgICAgIGZvciAodmFyIGk9MDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgY2hhcmNvZGUgPSBzdHIuY2hhckNvZGVBdChpKTtcbiAgICAgICAgaWYgKGNoYXJjb2RlIDwgMHg4MCkgdXRmOC5wdXNoKGNoYXJjb2RlKTtcbiAgICAgICAgZWxzZSBpZiAoY2hhcmNvZGUgPCAweDgwMCkge1xuICAgICAgICAgIHV0ZjgucHVzaCgweGMwIHwgKGNoYXJjb2RlID4+IDYpLFxuICAgICAgICAgICAgICAweDgwIHwgKGNoYXJjb2RlICYgMHgzZikpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNoYXJjb2RlIDwgMHhkODAwIHx8IGNoYXJjb2RlID49IDB4ZTAwMCkge1xuICAgICAgICAgIHV0ZjgucHVzaCgweGUwIHwgKGNoYXJjb2RlID4+IDEyKSxcbiAgICAgICAgICAgICAgMHg4MCB8ICgoY2hhcmNvZGU+PjYpICYgMHgzZiksXG4gICAgICAgICAgICAgIDB4ODAgfCAoY2hhcmNvZGUgJiAweDNmKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc3Vycm9nYXRlIHBhaXJcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgaSsrO1xuICAgICAgICAgIC8vIFVURi0xNiBlbmNvZGVzIDB4MTAwMDAtMHgxMEZGRkYgYnlcbiAgICAgICAgICAvLyBzdWJ0cmFjdGluZyAweDEwMDAwIGFuZCBzcGxpdHRpbmcgdGhlXG4gICAgICAgICAgLy8gMjAgYml0cyBvZiAweDAtMHhGRkZGRiBpbnRvIHR3byBoYWx2ZXNcbiAgICAgICAgICBjaGFyY29kZSA9IDB4MTAwMDAgKyAoKChjaGFyY29kZSAmIDB4M2ZmKTw8MTApXG4gICAgICAgICAgICB8IChzdHIuY2hhckNvZGVBdChpKSAmIDB4M2ZmKSk7XG4gICAgICAgICAgdXRmOC5wdXNoKDB4ZjAgfCAoY2hhcmNvZGUgPj4xOCksXG4gICAgICAgICAgICAgIDB4ODAgfCAoKGNoYXJjb2RlPj4xMikgJiAweDNmKSxcbiAgICAgICAgICAgICAgMHg4MCB8ICgoY2hhcmNvZGU+PjYpICYgMHgzZiksXG4gICAgICAgICAgICAgIDB4ODAgfCAoY2hhcmNvZGUgJiAweDNmKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB1dGY4O1xuICAgIH1cbiAgICByZXR1cm4gdG9VVEY4QXJyYXkocyk7XG4gIH07XG5cbn0oKTtcblxuKGZ1bmN0aW9uIChmYWN0b3J5KSB7XG4gIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgIGRlZmluZShbXSwgZmFjdG9yeSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfVxufShmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHFyY29kZTtcbn0pKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=
