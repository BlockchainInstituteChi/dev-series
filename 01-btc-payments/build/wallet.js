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
/******/ 	return __webpack_require__(__webpack_require__.s = "./wallet/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/base-x/src/index.js":
/*!******************************************!*\
  !*** ./node_modules/base-x/src/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
// @ts-ignore
var _Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
function base (ALPHABET) {
  if (ALPHABET.length >= 255) { throw new TypeError('Alphabet too long') }
  var BASE_MAP = new Uint8Array(256)
  BASE_MAP.fill(255)
  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i)
    var xc = x.charCodeAt(0)
    if (BASE_MAP[xc] !== 255) { throw new TypeError(x + ' is ambiguous') }
    BASE_MAP[xc] = i
  }
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)
  var FACTOR = Math.log(BASE) / Math.log(256) // log(BASE) / log(256), rounded up
  var iFACTOR = Math.log(256) / Math.log(BASE) // log(256) / log(BASE), rounded up
  function encode (source) {
    if (!_Buffer.isBuffer(source)) { throw new TypeError('Expected Buffer') }
    if (source.length === 0) { return '' }
        // Skip & count leading zeroes.
    var zeroes = 0
    var length = 0
    var pbegin = 0
    var pend = source.length
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++
      zeroes++
    }
        // Allocate enough space in big-endian base58 representation.
    var size = ((pend - pbegin) * iFACTOR + 1) >>> 0
    var b58 = new Uint8Array(size)
        // Process the bytes.
    while (pbegin !== pend) {
      var carry = source[pbegin]
            // Apply "b58 = b58 * 256 + ch".
      var i = 0
      for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
        carry += (256 * b58[it1]) >>> 0
        b58[it1] = (carry % BASE) >>> 0
        carry = (carry / BASE) >>> 0
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i
      pbegin++
    }
        // Skip leading zeroes in base58 result.
    var it2 = size - length
    while (it2 !== size && b58[it2] === 0) {
      it2++
    }
        // Translate the result into a string.
    var str = LEADER.repeat(zeroes)
    for (; it2 < size; ++it2) { str += ALPHABET.charAt(b58[it2]) }
    return str
  }
  function decodeUnsafe (source) {
    if (typeof source !== 'string') { throw new TypeError('Expected String') }
    if (source.length === 0) { return _Buffer.alloc(0) }
    var psz = 0
        // Skip leading spaces.
    if (source[psz] === ' ') { return }
        // Skip and count leading '1's.
    var zeroes = 0
    var length = 0
    while (source[psz] === LEADER) {
      zeroes++
      psz++
    }
        // Allocate enough space in big-endian base256 representation.
    var size = (((source.length - psz) * FACTOR) + 1) >>> 0 // log(58) / log(256), rounded up.
    var b256 = new Uint8Array(size)
        // Process the characters.
    while (source[psz]) {
            // Decode character
      var carry = BASE_MAP[source.charCodeAt(psz)]
            // Invalid character
      if (carry === 255) { return }
      var i = 0
      for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
        carry += (BASE * b256[it3]) >>> 0
        b256[it3] = (carry % 256) >>> 0
        carry = (carry / 256) >>> 0
      }
      if (carry !== 0) { throw new Error('Non-zero carry') }
      length = i
      psz++
    }
        // Skip trailing spaces.
    if (source[psz] === ' ') { return }
        // Skip leading zeroes in b256.
    var it4 = size - length
    while (it4 !== size && b256[it4] === 0) {
      it4++
    }
    var vch = _Buffer.allocUnsafe(zeroes + (size - it4))
    vch.fill(0x00, 0, zeroes)
    var j = zeroes
    while (it4 !== size) {
      vch[j++] = b256[it4++]
    }
    return vch
  }
  function decode (string) {
    var buffer = decodeUnsafe(string)
    if (buffer) { return buffer }
    throw new Error('Non-base' + BASE + ' character')
  }
  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}
module.exports = base


/***/ }),

/***/ "./node_modules/bech32/index.js":
/*!**************************************!*\
  !*** ./node_modules/bech32/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

// pre-compute lookup table
var ALPHABET_MAP = {}
for (var z = 0; z < ALPHABET.length; z++) {
  var x = ALPHABET.charAt(z)

  if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
  ALPHABET_MAP[x] = z
}

function polymodStep (pre) {
  var b = pre >> 25
  return ((pre & 0x1FFFFFF) << 5) ^
    (-((b >> 0) & 1) & 0x3b6a57b2) ^
    (-((b >> 1) & 1) & 0x26508e6d) ^
    (-((b >> 2) & 1) & 0x1ea119fa) ^
    (-((b >> 3) & 1) & 0x3d4233dd) ^
    (-((b >> 4) & 1) & 0x2a1462b3)
}

function prefixChk (prefix) {
  var chk = 1
  for (var i = 0; i < prefix.length; ++i) {
    var c = prefix.charCodeAt(i)
    if (c < 33 || c > 126) throw new Error('Invalid prefix (' + prefix + ')')

    chk = polymodStep(chk) ^ (c >> 5)
  }
  chk = polymodStep(chk)

  for (i = 0; i < prefix.length; ++i) {
    var v = prefix.charCodeAt(i)
    chk = polymodStep(chk) ^ (v & 0x1f)
  }
  return chk
}

function encode (prefix, words, LIMIT) {
  LIMIT = LIMIT || 90
  if ((prefix.length + 7 + words.length) > LIMIT) throw new TypeError('Exceeds length limit')

  prefix = prefix.toLowerCase()

  // determine chk mod
  var chk = prefixChk(prefix)
  var result = prefix + '1'
  for (var i = 0; i < words.length; ++i) {
    var x = words[i]
    if ((x >> 5) !== 0) throw new Error('Non 5-bit word')

    chk = polymodStep(chk) ^ x
    result += ALPHABET.charAt(x)
  }

  for (i = 0; i < 6; ++i) {
    chk = polymodStep(chk)
  }
  chk ^= 1

  for (i = 0; i < 6; ++i) {
    var v = (chk >> ((5 - i) * 5)) & 0x1f
    result += ALPHABET.charAt(v)
  }

  return result
}

function decode (str, LIMIT) {
  LIMIT = LIMIT || 90
  if (str.length < 8) throw new TypeError(str + ' too short')
  if (str.length > LIMIT) throw new TypeError('Exceeds length limit')

  // don't allow mixed case
  var lowered = str.toLowerCase()
  var uppered = str.toUpperCase()
  if (str !== lowered && str !== uppered) throw new Error('Mixed-case string ' + str)
  str = lowered

  var split = str.lastIndexOf('1')
  if (split === -1) throw new Error('No separator character for ' + str)
  if (split === 0) throw new Error('Missing prefix for ' + str)

  var prefix = str.slice(0, split)
  var wordChars = str.slice(split + 1)
  if (wordChars.length < 6) throw new Error('Data too short')

  var chk = prefixChk(prefix)
  var words = []
  for (var i = 0; i < wordChars.length; ++i) {
    var c = wordChars.charAt(i)
    var v = ALPHABET_MAP[c]
    if (v === undefined) throw new Error('Unknown character ' + c)
    chk = polymodStep(chk) ^ v

    // not in the checksum?
    if (i + 6 >= wordChars.length) continue
    words.push(v)
  }

  if (chk !== 1) throw new Error('Invalid checksum for ' + str)
  return { prefix: prefix, words: words }
}

function convert (data, inBits, outBits, pad) {
  var value = 0
  var bits = 0
  var maxV = (1 << outBits) - 1

  var result = []
  for (var i = 0; i < data.length; ++i) {
    value = (value << inBits) | data[i]
    bits += inBits

    while (bits >= outBits) {
      bits -= outBits
      result.push((value >> bits) & maxV)
    }
  }

  if (pad) {
    if (bits > 0) {
      result.push((value << (outBits - bits)) & maxV)
    }
  } else {
    if (bits >= inBits) throw new Error('Excess padding')
    if ((value << (outBits - bits)) & maxV) throw new Error('Non-zero padding')
  }

  return result
}

function toWords (bytes) {
  return convert(bytes, 8, 5, true)
}

function fromWords (words) {
  return convert(words, 5, 8, false)
}

module.exports = {
  decode: decode,
  encode: encode,
  toWords: toWords,
  fromWords: fromWords
}


/***/ }),

/***/ "./node_modules/bigi/lib/bigi.js":
/*!***************************************!*\
  !*** ./node_modules/bigi/lib/bigi.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// (public) Constructor
function BigInteger(a, b, c) {
  if (!(this instanceof BigInteger))
    return new BigInteger(a, b, c)

  if (a != null) {
    if ("number" == typeof a) this.fromNumber(a, b, c)
    else if (b == null && "string" != typeof a) this.fromString(a, 256)
    else this.fromString(a, b)
  }
}

var proto = BigInteger.prototype

// duck-typed isBigInteger
proto.__bigi = __webpack_require__(/*! ../package.json */ "./node_modules/bigi/package.json").version
BigInteger.isBigInteger = function (obj, check_ver) {
  return obj && obj.__bigi && (!check_ver || obj.__bigi === proto.__bigi)
}

// Bits per digit
var dbits

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i, x, w, j, c, n) {
  while (--n >= 0) {
    var v = x * this[i++] + w[j] + c
    c = Math.floor(v / 0x4000000)
    w[j++] = v & 0x3ffffff
  }
  return c
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i, x, w, j, c, n) {
  var xl = x & 0x7fff,
    xh = x >> 15
  while (--n >= 0) {
    var l = this[i] & 0x7fff
    var h = this[i++] >> 15
    var m = xh * l + h * xl
    l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff)
    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30)
    w[j++] = l & 0x3fffffff
  }
  return c
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i, x, w, j, c, n) {
  var xl = x & 0x3fff,
    xh = x >> 14
  while (--n >= 0) {
    var l = this[i] & 0x3fff
    var h = this[i++] >> 14
    var m = xh * l + h * xl
    l = xl * l + ((m & 0x3fff) << 14) + w[j] + c
    c = (l >> 28) + (m >> 14) + xh * h
    w[j++] = l & 0xfffffff
  }
  return c
}

// wtf?
BigInteger.prototype.am = am1
dbits = 26

BigInteger.prototype.DB = dbits
BigInteger.prototype.DM = ((1 << dbits) - 1)
var DV = BigInteger.prototype.DV = (1 << dbits)

var BI_FP = 52
BigInteger.prototype.FV = Math.pow(2, BI_FP)
BigInteger.prototype.F1 = BI_FP - dbits
BigInteger.prototype.F2 = 2 * dbits - BI_FP

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz"
var BI_RC = new Array()
var rr, vv
rr = "0".charCodeAt(0)
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv
rr = "a".charCodeAt(0)
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv
rr = "A".charCodeAt(0)
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv

function int2char(n) {
  return BI_RM.charAt(n)
}

function intAt(s, i) {
  var c = BI_RC[s.charCodeAt(i)]
  return (c == null) ? -1 : c
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for (var i = this.t - 1; i >= 0; --i) r[i] = this[i]
  r.t = this.t
  r.s = this.s
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1
  this.s = (x < 0) ? -1 : 0
  if (x > 0) this[0] = x
  else if (x < -1) this[0] = x + DV
  else this.t = 0
}

// return bigint initialized to value
function nbv(i) {
  var r = new BigInteger()
  r.fromInt(i)
  return r
}

// (protected) set from string and radix
function bnpFromString(s, b) {
  var self = this

  var k
  if (b == 16) k = 4
  else if (b == 8) k = 3
  else if (b == 256) k = 8; // byte array
  else if (b == 2) k = 1
  else if (b == 32) k = 5
  else if (b == 4) k = 2
  else {
    self.fromRadix(s, b)
    return
  }
  self.t = 0
  self.s = 0
  var i = s.length,
    mi = false,
    sh = 0
  while (--i >= 0) {
    var x = (k == 8) ? s[i] & 0xff : intAt(s, i)
    if (x < 0) {
      if (s.charAt(i) == "-") mi = true
      continue
    }
    mi = false
    if (sh == 0)
      self[self.t++] = x
    else if (sh + k > self.DB) {
      self[self.t - 1] |= (x & ((1 << (self.DB - sh)) - 1)) << sh
      self[self.t++] = (x >> (self.DB - sh))
    } else
      self[self.t - 1] |= x << sh
    sh += k
    if (sh >= self.DB) sh -= self.DB
  }
  if (k == 8 && (s[0] & 0x80) != 0) {
    self.s = -1
    if (sh > 0) self[self.t - 1] |= ((1 << (self.DB - sh)) - 1) << sh
  }
  self.clamp()
  if (mi) BigInteger.ZERO.subTo(self, self)
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s & this.DM
  while (this.t > 0 && this[this.t - 1] == c)--this.t
}

// (public) return string representation in given radix
function bnToString(b) {
  var self = this
  if (self.s < 0) return "-" + self.negate()
    .toString(b)
  var k
  if (b == 16) k = 4
  else if (b == 8) k = 3
  else if (b == 2) k = 1
  else if (b == 32) k = 5
  else if (b == 4) k = 2
  else return self.toRadix(b)
  var km = (1 << k) - 1,
    d, m = false,
    r = "",
    i = self.t
  var p = self.DB - (i * self.DB) % k
  if (i-- > 0) {
    if (p < self.DB && (d = self[i] >> p) > 0) {
      m = true
      r = int2char(d)
    }
    while (i >= 0) {
      if (p < k) {
        d = (self[i] & ((1 << p) - 1)) << (k - p)
        d |= self[--i] >> (p += self.DB - k)
      } else {
        d = (self[i] >> (p -= k)) & km
        if (p <= 0) {
          p += self.DB
          --i
        }
      }
      if (d > 0) m = true
      if (m) r += int2char(d)
    }
  }
  return m ? r : "0"
}

// (public) -this
function bnNegate() {
  var r = new BigInteger()
  BigInteger.ZERO.subTo(this, r)
  return r
}

// (public) |this|
function bnAbs() {
  return (this.s < 0) ? this.negate() : this
}

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s - a.s
  if (r != 0) return r
  var i = this.t
  r = i - a.t
  if (r != 0) return (this.s < 0) ? -r : r
  while (--i >= 0)
    if ((r = this[i] - a[i]) != 0) return r
  return 0
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1,
    t
  if ((t = x >>> 16) != 0) {
    x = t
    r += 16
  }
  if ((t = x >> 8) != 0) {
    x = t
    r += 8
  }
  if ((t = x >> 4) != 0) {
    x = t
    r += 4
  }
  if ((t = x >> 2) != 0) {
    x = t
    r += 2
  }
  if ((t = x >> 1) != 0) {
    x = t
    r += 1
  }
  return r
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if (this.t <= 0) return 0
  return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM))
}

// (public) return the number of bytes in "this"
function bnByteLength() {
  return this.bitLength() >> 3
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n, r) {
  var i
  for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i]
  for (i = n - 1; i >= 0; --i) r[i] = 0
  r.t = this.t + n
  r.s = this.s
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n, r) {
  for (var i = n; i < this.t; ++i) r[i - n] = this[i]
  r.t = Math.max(this.t - n, 0)
  r.s = this.s
}

// (protected) r = this << n
function bnpLShiftTo(n, r) {
  var self = this
  var bs = n % self.DB
  var cbs = self.DB - bs
  var bm = (1 << cbs) - 1
  var ds = Math.floor(n / self.DB),
    c = (self.s << bs) & self.DM,
    i
  for (i = self.t - 1; i >= 0; --i) {
    r[i + ds + 1] = (self[i] >> cbs) | c
    c = (self[i] & bm) << bs
  }
  for (i = ds - 1; i >= 0; --i) r[i] = 0
  r[ds] = c
  r.t = self.t + ds + 1
  r.s = self.s
  r.clamp()
}

// (protected) r = this >> n
function bnpRShiftTo(n, r) {
  var self = this
  r.s = self.s
  var ds = Math.floor(n / self.DB)
  if (ds >= self.t) {
    r.t = 0
    return
  }
  var bs = n % self.DB
  var cbs = self.DB - bs
  var bm = (1 << bs) - 1
  r[0] = self[ds] >> bs
  for (var i = ds + 1; i < self.t; ++i) {
    r[i - ds - 1] |= (self[i] & bm) << cbs
    r[i - ds] = self[i] >> bs
  }
  if (bs > 0) r[self.t - ds - 1] |= (self.s & bm) << cbs
  r.t = self.t - ds
  r.clamp()
}

// (protected) r = this - a
function bnpSubTo(a, r) {
  var self = this
  var i = 0,
    c = 0,
    m = Math.min(a.t, self.t)
  while (i < m) {
    c += self[i] - a[i]
    r[i++] = c & self.DM
    c >>= self.DB
  }
  if (a.t < self.t) {
    c -= a.s
    while (i < self.t) {
      c += self[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c += self.s
  } else {
    c += self.s
    while (i < a.t) {
      c -= a[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c -= a.s
  }
  r.s = (c < 0) ? -1 : 0
  if (c < -1) r[i++] = self.DV + c
  else if (c > 0) r[i++] = c
  r.t = i
  r.clamp()
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a, r) {
  var x = this.abs(),
    y = a.abs()
  var i = x.t
  r.t = i + y.t
  while (--i >= 0) r[i] = 0
  for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t)
  r.s = 0
  r.clamp()
  if (this.s != a.s) BigInteger.ZERO.subTo(r, r)
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs()
  var i = r.t = 2 * x.t
  while (--i >= 0) r[i] = 0
  for (i = 0; i < x.t - 1; ++i) {
    var c = x.am(i, x[i], r, 2 * i, 0, 1)
    if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
      r[i + x.t] -= x.DV
      r[i + x.t + 1] = 1
    }
  }
  if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1)
  r.s = 0
  r.clamp()
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m, q, r) {
  var self = this
  var pm = m.abs()
  if (pm.t <= 0) return
  var pt = self.abs()
  if (pt.t < pm.t) {
    if (q != null) q.fromInt(0)
    if (r != null) self.copyTo(r)
    return
  }
  if (r == null) r = new BigInteger()
  var y = new BigInteger(),
    ts = self.s,
    ms = m.s
  var nsh = self.DB - nbits(pm[pm.t - 1]); // normalize modulus
  if (nsh > 0) {
    pm.lShiftTo(nsh, y)
    pt.lShiftTo(nsh, r)
  } else {
    pm.copyTo(y)
    pt.copyTo(r)
  }
  var ys = y.t
  var y0 = y[ys - 1]
  if (y0 == 0) return
  var yt = y0 * (1 << self.F1) + ((ys > 1) ? y[ys - 2] >> self.F2 : 0)
  var d1 = self.FV / yt,
    d2 = (1 << self.F1) / yt,
    e = 1 << self.F2
  var i = r.t,
    j = i - ys,
    t = (q == null) ? new BigInteger() : q
  y.dlShiftTo(j, t)
  if (r.compareTo(t) >= 0) {
    r[r.t++] = 1
    r.subTo(t, r)
  }
  BigInteger.ONE.dlShiftTo(ys, t)
  t.subTo(y, y); // "negative" y so we can replace sub with am later
  while (y.t < ys) y[y.t++] = 0
  while (--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i] == y0) ? self.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2)
    if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
      y.dlShiftTo(j, t)
      r.subTo(t, r)
      while (r[i] < --qd) r.subTo(t, r)
    }
  }
  if (q != null) {
    r.drShiftTo(ys, q)
    if (ts != ms) BigInteger.ZERO.subTo(q, q)
  }
  r.t = ys
  r.clamp()
  if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
  if (ts < 0) BigInteger.ZERO.subTo(r, r)
}

// (public) this mod a
function bnMod(a) {
  var r = new BigInteger()
  this.abs()
    .divRemTo(a, null, r)
  if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r)
  return r
}

// Modular reduction using "classic" algorithm
function Classic(m) {
  this.m = m
}

function cConvert(x) {
  if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m)
  else return x
}

function cRevert(x) {
  return x
}

function cReduce(x) {
  x.divRemTo(this.m, null, x)
}

function cMulTo(x, y, r) {
  x.multiplyTo(y, r)
  this.reduce(r)
}

function cSqrTo(x, r) {
  x.squareTo(r)
  this.reduce(r)
}

Classic.prototype.convert = cConvert
Classic.prototype.revert = cRevert
Classic.prototype.reduce = cReduce
Classic.prototype.mulTo = cMulTo
Classic.prototype.sqrTo = cSqrTo

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if (this.t < 1) return 0
  var x = this[0]
  if ((x & 1) == 0) return 0
  var y = x & 3; // y == 1/x mod 2^2
  y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
  y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
  y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y > 0) ? this.DV - y : -y
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m
  this.mp = m.invDigit()
  this.mpl = this.mp & 0x7fff
  this.mph = this.mp >> 15
  this.um = (1 << (m.DB - 15)) - 1
  this.mt2 = 2 * m.t
}

// xR mod m
function montConvert(x) {
  var r = new BigInteger()
  x.abs()
    .dlShiftTo(this.m.t, r)
  r.divRemTo(this.m, null, r)
  if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r)
  return r
}

// x/R mod m
function montRevert(x) {
  var r = new BigInteger()
  x.copyTo(r)
  this.reduce(r)
  return r
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while (x.t <= this.mt2) // pad x so am has enough room later
    x[x.t++] = 0
  for (var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i] & 0x7fff
    var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM
    // use am to combine the multiply-shift-add into one call
    j = i + this.m.t
    x[j] += this.m.am(0, u0, x, i, 0, this.m.t)
    // propagate carry
    while (x[j] >= x.DV) {
      x[j] -= x.DV
      x[++j]++
    }
  }
  x.clamp()
  x.drShiftTo(this.m.t, x)
  if (x.compareTo(this.m) >= 0) x.subTo(this.m, x)
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x, r) {
  x.squareTo(r)
  this.reduce(r)
}

// r = "xy/R mod m"; x,y != r
function montMulTo(x, y, r) {
  x.multiplyTo(y, r)
  this.reduce(r)
}

Montgomery.prototype.convert = montConvert
Montgomery.prototype.revert = montRevert
Montgomery.prototype.reduce = montReduce
Montgomery.prototype.mulTo = montMulTo
Montgomery.prototype.sqrTo = montSqrTo

// (protected) true iff this is even
function bnpIsEven() {
  return ((this.t > 0) ? (this[0] & 1) : this.s) == 0
}

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e, z) {
  if (e > 0xffffffff || e < 1) return BigInteger.ONE
  var r = new BigInteger(),
    r2 = new BigInteger(),
    g = z.convert(this),
    i = nbits(e) - 1
  g.copyTo(r)
  while (--i >= 0) {
    z.sqrTo(r, r2)
    if ((e & (1 << i)) > 0) z.mulTo(r2, g, r)
    else {
      var t = r
      r = r2
      r2 = t
    }
  }
  return z.revert(r)
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e, m) {
  var z
  if (e < 256 || m.isEven()) z = new Classic(m)
  else z = new Montgomery(m)
  return this.exp(e, z)
}

// protected
proto.copyTo = bnpCopyTo
proto.fromInt = bnpFromInt
proto.fromString = bnpFromString
proto.clamp = bnpClamp
proto.dlShiftTo = bnpDLShiftTo
proto.drShiftTo = bnpDRShiftTo
proto.lShiftTo = bnpLShiftTo
proto.rShiftTo = bnpRShiftTo
proto.subTo = bnpSubTo
proto.multiplyTo = bnpMultiplyTo
proto.squareTo = bnpSquareTo
proto.divRemTo = bnpDivRemTo
proto.invDigit = bnpInvDigit
proto.isEven = bnpIsEven
proto.exp = bnpExp

// public
proto.toString = bnToString
proto.negate = bnNegate
proto.abs = bnAbs
proto.compareTo = bnCompareTo
proto.bitLength = bnBitLength
proto.byteLength = bnByteLength
proto.mod = bnMod
proto.modPowInt = bnModPowInt

// (public)
function bnClone() {
  var r = new BigInteger()
  this.copyTo(r)
  return r
}

// (public) return value as integer
function bnIntValue() {
  if (this.s < 0) {
    if (this.t == 1) return this[0] - this.DV
    else if (this.t == 0) return -1
  } else if (this.t == 1) return this[0]
  else if (this.t == 0) return 0
  // assumes 16 < DB < 32
  return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0]
}

// (public) return value as byte
function bnByteValue() {
  return (this.t == 0) ? this.s : (this[0] << 24) >> 24
}

// (public) return value as short (assumes DB>=16)
function bnShortValue() {
  return (this.t == 0) ? this.s : (this[0] << 16) >> 16
}

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) {
  return Math.floor(Math.LN2 * this.DB / Math.log(r))
}

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if (this.s < 0) return -1
  else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0
  else return 1
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if (b == null) b = 10
  if (this.signum() == 0 || b < 2 || b > 36) return "0"
  var cs = this.chunkSize(b)
  var a = Math.pow(b, cs)
  var d = nbv(a),
    y = new BigInteger(),
    z = new BigInteger(),
    r = ""
  this.divRemTo(d, y, z)
  while (y.signum() > 0) {
    r = (a + z.intValue())
      .toString(b)
      .substr(1) + r
    y.divRemTo(d, y, z)
  }
  return z.intValue()
    .toString(b) + r
}

// (protected) convert from radix string
function bnpFromRadix(s, b) {
  var self = this
  self.fromInt(0)
  if (b == null) b = 10
  var cs = self.chunkSize(b)
  var d = Math.pow(b, cs),
    mi = false,
    j = 0,
    w = 0
  for (var i = 0; i < s.length; ++i) {
    var x = intAt(s, i)
    if (x < 0) {
      if (s.charAt(i) == "-" && self.signum() == 0) mi = true
      continue
    }
    w = b * w + x
    if (++j >= cs) {
      self.dMultiply(d)
      self.dAddOffset(w, 0)
      j = 0
      w = 0
    }
  }
  if (j > 0) {
    self.dMultiply(Math.pow(b, j))
    self.dAddOffset(w, 0)
  }
  if (mi) BigInteger.ZERO.subTo(self, self)
}

// (protected) alternate constructor
function bnpFromNumber(a, b, c) {
  var self = this
  if ("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if (a < 2) self.fromInt(1)
    else {
      self.fromNumber(a, c)
      if (!self.testBit(a - 1)) // force MSB set
        self.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, self)
      if (self.isEven()) self.dAddOffset(1, 0); // force odd
      while (!self.isProbablePrime(b)) {
        self.dAddOffset(2, 0)
        if (self.bitLength() > a) self.subTo(BigInteger.ONE.shiftLeft(a - 1), self)
      }
    }
  } else {
    // new BigInteger(int,RNG)
    var x = new Array(),
      t = a & 7
    x.length = (a >> 3) + 1
    b.nextBytes(x)
    if (t > 0) x[0] &= ((1 << t) - 1)
    else x[0] = 0
    self.fromString(x, 256)
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var self = this
  var i = self.t,
    r = new Array()
  r[0] = self.s
  var p = self.DB - (i * self.DB) % 8,
    d, k = 0
  if (i-- > 0) {
    if (p < self.DB && (d = self[i] >> p) != (self.s & self.DM) >> p)
      r[k++] = d | (self.s << (self.DB - p))
    while (i >= 0) {
      if (p < 8) {
        d = (self[i] & ((1 << p) - 1)) << (8 - p)
        d |= self[--i] >> (p += self.DB - 8)
      } else {
        d = (self[i] >> (p -= 8)) & 0xff
        if (p <= 0) {
          p += self.DB
          --i
        }
      }
      if ((d & 0x80) != 0) d |= -256
      if (k === 0 && (self.s & 0x80) != (d & 0x80))++k
      if (k > 0 || d != self.s) r[k++] = d
    }
  }
  return r
}

function bnEquals(a) {
  return (this.compareTo(a) == 0)
}

function bnMin(a) {
  return (this.compareTo(a) < 0) ? this : a
}

function bnMax(a) {
  return (this.compareTo(a) > 0) ? this : a
}

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a, op, r) {
  var self = this
  var i, f, m = Math.min(a.t, self.t)
  for (i = 0; i < m; ++i) r[i] = op(self[i], a[i])
  if (a.t < self.t) {
    f = a.s & self.DM
    for (i = m; i < self.t; ++i) r[i] = op(self[i], f)
    r.t = self.t
  } else {
    f = self.s & self.DM
    for (i = m; i < a.t; ++i) r[i] = op(f, a[i])
    r.t = a.t
  }
  r.s = op(self.s, a.s)
  r.clamp()
}

// (public) this & a
function op_and(x, y) {
  return x & y
}

function bnAnd(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_and, r)
  return r
}

// (public) this | a
function op_or(x, y) {
  return x | y
}

function bnOr(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_or, r)
  return r
}

// (public) this ^ a
function op_xor(x, y) {
  return x ^ y
}

function bnXor(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_xor, r)
  return r
}

// (public) this & ~a
function op_andnot(x, y) {
  return x & ~y
}

function bnAndNot(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_andnot, r)
  return r
}

// (public) ~this
function bnNot() {
  var r = new BigInteger()
  for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i]
  r.t = this.t
  r.s = ~this.s
  return r
}

// (public) this << n
function bnShiftLeft(n) {
  var r = new BigInteger()
  if (n < 0) this.rShiftTo(-n, r)
  else this.lShiftTo(n, r)
  return r
}

// (public) this >> n
function bnShiftRight(n) {
  var r = new BigInteger()
  if (n < 0) this.lShiftTo(-n, r)
  else this.rShiftTo(n, r)
  return r
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if (x == 0) return -1
  var r = 0
  if ((x & 0xffff) == 0) {
    x >>= 16
    r += 16
  }
  if ((x & 0xff) == 0) {
    x >>= 8
    r += 8
  }
  if ((x & 0xf) == 0) {
    x >>= 4
    r += 4
  }
  if ((x & 3) == 0) {
    x >>= 2
    r += 2
  }
  if ((x & 1) == 0)++r
  return r
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for (var i = 0; i < this.t; ++i)
    if (this[i] != 0) return i * this.DB + lbit(this[i])
  if (this.s < 0) return this.t * this.DB
  return -1
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0
  while (x != 0) {
    x &= x - 1
    ++r
  }
  return r
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0,
    x = this.s & this.DM
  for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x)
  return r
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n / this.DB)
  if (j >= this.t) return (this.s != 0)
  return ((this[j] & (1 << (n % this.DB))) != 0)
}

// (protected) this op (1<<n)
function bnpChangeBit(n, op) {
  var r = BigInteger.ONE.shiftLeft(n)
  this.bitwiseTo(r, op, r)
  return r
}

// (public) this | (1<<n)
function bnSetBit(n) {
  return this.changeBit(n, op_or)
}

// (public) this & ~(1<<n)
function bnClearBit(n) {
  return this.changeBit(n, op_andnot)
}

// (public) this ^ (1<<n)
function bnFlipBit(n) {
  return this.changeBit(n, op_xor)
}

// (protected) r = this + a
function bnpAddTo(a, r) {
  var self = this

  var i = 0,
    c = 0,
    m = Math.min(a.t, self.t)
  while (i < m) {
    c += self[i] + a[i]
    r[i++] = c & self.DM
    c >>= self.DB
  }
  if (a.t < self.t) {
    c += a.s
    while (i < self.t) {
      c += self[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c += self.s
  } else {
    c += self.s
    while (i < a.t) {
      c += a[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c += a.s
  }
  r.s = (c < 0) ? -1 : 0
  if (c > 0) r[i++] = c
  else if (c < -1) r[i++] = self.DV + c
  r.t = i
  r.clamp()
}

// (public) this + a
function bnAdd(a) {
  var r = new BigInteger()
  this.addTo(a, r)
  return r
}

// (public) this - a
function bnSubtract(a) {
  var r = new BigInteger()
  this.subTo(a, r)
  return r
}

// (public) this * a
function bnMultiply(a) {
  var r = new BigInteger()
  this.multiplyTo(a, r)
  return r
}

// (public) this^2
function bnSquare() {
  var r = new BigInteger()
  this.squareTo(r)
  return r
}

// (public) this / a
function bnDivide(a) {
  var r = new BigInteger()
  this.divRemTo(a, r, null)
  return r
}

// (public) this % a
function bnRemainder(a) {
  var r = new BigInteger()
  this.divRemTo(a, null, r)
  return r
}

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = new BigInteger(),
    r = new BigInteger()
  this.divRemTo(a, q, r)
  return new Array(q, r)
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0, n - 1, this, 0, 0, this.t)
  ++this.t
  this.clamp()
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n, w) {
  if (n == 0) return
  while (this.t <= w) this[this.t++] = 0
  this[w] += n
  while (this[w] >= this.DV) {
    this[w] -= this.DV
    if (++w >= this.t) this[this.t++] = 0
    ++this[w]
  }
}

// A "null" reducer
function NullExp() {}

function nNop(x) {
  return x
}

function nMulTo(x, y, r) {
  x.multiplyTo(y, r)
}

function nSqrTo(x, r) {
  x.squareTo(r)
}

NullExp.prototype.convert = nNop
NullExp.prototype.revert = nNop
NullExp.prototype.mulTo = nMulTo
NullExp.prototype.sqrTo = nSqrTo

// (public) this^e
function bnPow(e) {
  return this.exp(e, new NullExp())
}

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a, n, r) {
  var i = Math.min(this.t + a.t, n)
  r.s = 0; // assumes a,this >= 0
  r.t = i
  while (i > 0) r[--i] = 0
  var j
  for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t)
  for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i)
  r.clamp()
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a, n, r) {
  --n
  var i = r.t = this.t + a.t - n
  r.s = 0; // assumes a,this >= 0
  while (--i >= 0) r[i] = 0
  for (i = Math.max(n - this.t, 0); i < a.t; ++i)
    r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n)
  r.clamp()
  r.drShiftTo(1, r)
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = new BigInteger()
  this.q3 = new BigInteger()
  BigInteger.ONE.dlShiftTo(2 * m.t, this.r2)
  this.mu = this.r2.divide(m)
  this.m = m
}

function barrettConvert(x) {
  if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m)
  else if (x.compareTo(this.m) < 0) return x
  else {
    var r = new BigInteger()
    x.copyTo(r)
    this.reduce(r)
    return r
  }
}

function barrettRevert(x) {
  return x
}

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  var self = this
  x.drShiftTo(self.m.t - 1, self.r2)
  if (x.t > self.m.t + 1) {
    x.t = self.m.t + 1
    x.clamp()
  }
  self.mu.multiplyUpperTo(self.r2, self.m.t + 1, self.q3)
  self.m.multiplyLowerTo(self.q3, self.m.t + 1, self.r2)
  while (x.compareTo(self.r2) < 0) x.dAddOffset(1, self.m.t + 1)
  x.subTo(self.r2, x)
  while (x.compareTo(self.m) >= 0) x.subTo(self.m, x)
}

// r = x^2 mod m; x != r
function barrettSqrTo(x, r) {
  x.squareTo(r)
  this.reduce(r)
}

// r = x*y mod m; x,y != r
function barrettMulTo(x, y, r) {
  x.multiplyTo(y, r)
  this.reduce(r)
}

Barrett.prototype.convert = barrettConvert
Barrett.prototype.revert = barrettRevert
Barrett.prototype.reduce = barrettReduce
Barrett.prototype.mulTo = barrettMulTo
Barrett.prototype.sqrTo = barrettSqrTo

// (public) this^e % m (HAC 14.85)
function bnModPow(e, m) {
  var i = e.bitLength(),
    k, r = nbv(1),
    z
  if (i <= 0) return r
  else if (i < 18) k = 1
  else if (i < 48) k = 3
  else if (i < 144) k = 4
  else if (i < 768) k = 5
  else k = 6
  if (i < 8)
    z = new Classic(m)
  else if (m.isEven())
    z = new Barrett(m)
  else
    z = new Montgomery(m)

  // precomputation
  var g = new Array(),
    n = 3,
    k1 = k - 1,
    km = (1 << k) - 1
  g[1] = z.convert(this)
  if (k > 1) {
    var g2 = new BigInteger()
    z.sqrTo(g[1], g2)
    while (n <= km) {
      g[n] = new BigInteger()
      z.mulTo(g2, g[n - 2], g[n])
      n += 2
    }
  }

  var j = e.t - 1,
    w, is1 = true,
    r2 = new BigInteger(),
    t
  i = nbits(e[j]) - 1
  while (j >= 0) {
    if (i >= k1) w = (e[j] >> (i - k1)) & km
    else {
      w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i)
      if (j > 0) w |= e[j - 1] >> (this.DB + i - k1)
    }

    n = k
    while ((w & 1) == 0) {
      w >>= 1
      --n
    }
    if ((i -= n) < 0) {
      i += this.DB
      --j
    }
    if (is1) { // ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r)
      is1 = false
    } else {
      while (n > 1) {
        z.sqrTo(r, r2)
        z.sqrTo(r2, r)
        n -= 2
      }
      if (n > 0) z.sqrTo(r, r2)
      else {
        t = r
        r = r2
        r2 = t
      }
      z.mulTo(r2, g[w], r)
    }

    while (j >= 0 && (e[j] & (1 << i)) == 0) {
      z.sqrTo(r, r2)
      t = r
      r = r2
      r2 = t
      if (--i < 0) {
        i = this.DB - 1
        --j
      }
    }
  }
  return z.revert(r)
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s < 0) ? this.negate() : this.clone()
  var y = (a.s < 0) ? a.negate() : a.clone()
  if (x.compareTo(y) < 0) {
    var t = x
    x = y
    y = t
  }
  var i = x.getLowestSetBit(),
    g = y.getLowestSetBit()
  if (g < 0) return x
  if (i < g) g = i
  if (g > 0) {
    x.rShiftTo(g, x)
    y.rShiftTo(g, y)
  }
  while (x.signum() > 0) {
    if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x)
    if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y)
    if (x.compareTo(y) >= 0) {
      x.subTo(y, x)
      x.rShiftTo(1, x)
    } else {
      y.subTo(x, y)
      y.rShiftTo(1, y)
    }
  }
  if (g > 0) y.lShiftTo(g, y)
  return y
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if (n <= 0) return 0
  var d = this.DV % n,
    r = (this.s < 0) ? n - 1 : 0
  if (this.t > 0)
    if (d == 0) r = this[0] % n
    else
      for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n
  return r
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven()
  if (this.signum() === 0) throw new Error('division by zero')
  if ((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO
  var u = m.clone(),
    v = this.clone()
  var a = nbv(1),
    b = nbv(0),
    c = nbv(0),
    d = nbv(1)
  while (u.signum() != 0) {
    while (u.isEven()) {
      u.rShiftTo(1, u)
      if (ac) {
        if (!a.isEven() || !b.isEven()) {
          a.addTo(this, a)
          b.subTo(m, b)
        }
        a.rShiftTo(1, a)
      } else if (!b.isEven()) b.subTo(m, b)
      b.rShiftTo(1, b)
    }
    while (v.isEven()) {
      v.rShiftTo(1, v)
      if (ac) {
        if (!c.isEven() || !d.isEven()) {
          c.addTo(this, c)
          d.subTo(m, d)
        }
        c.rShiftTo(1, c)
      } else if (!d.isEven()) d.subTo(m, d)
      d.rShiftTo(1, d)
    }
    if (u.compareTo(v) >= 0) {
      u.subTo(v, u)
      if (ac) a.subTo(c, a)
      b.subTo(d, b)
    } else {
      v.subTo(u, v)
      if (ac) c.subTo(a, c)
      d.subTo(b, d)
    }
  }
  if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO
  while (d.compareTo(m) >= 0) d.subTo(m, d)
  while (d.signum() < 0) d.addTo(m, d)
  return d
}

var lowprimes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
  157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
  239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
  331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419,
  421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
  509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607,
  613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701,
  709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811,
  821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911,
  919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997
]

var lplim = (1 << 26) / lowprimes[lowprimes.length - 1]

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs()
  if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
    for (i = 0; i < lowprimes.length; ++i)
      if (x[0] == lowprimes[i]) return true
    return false
  }
  if (x.isEven()) return false
  i = 1
  while (i < lowprimes.length) {
    var m = lowprimes[i],
      j = i + 1
    while (j < lowprimes.length && m < lplim) m *= lowprimes[j++]
    m = x.modInt(m)
    while (i < j) if (m % lowprimes[i++] == 0) return false
  }
  return x.millerRabin(t)
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE)
  var k = n1.getLowestSetBit()
  if (k <= 0) return false
  var r = n1.shiftRight(k)
  t = (t + 1) >> 1
  if (t > lowprimes.length) t = lowprimes.length
  var a = new BigInteger(null)
  var j, bases = []
  for (var i = 0; i < t; ++i) {
    for (;;) {
      j = lowprimes[Math.floor(Math.random() * lowprimes.length)]
      if (bases.indexOf(j) == -1) break
    }
    bases.push(j)
    a.fromInt(j)
    var y = a.modPow(r, this)
    if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1
      while (j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2, this)
        if (y.compareTo(BigInteger.ONE) == 0) return false
      }
      if (y.compareTo(n1) != 0) return false
    }
  }
  return true
}

// protected
proto.chunkSize = bnpChunkSize
proto.toRadix = bnpToRadix
proto.fromRadix = bnpFromRadix
proto.fromNumber = bnpFromNumber
proto.bitwiseTo = bnpBitwiseTo
proto.changeBit = bnpChangeBit
proto.addTo = bnpAddTo
proto.dMultiply = bnpDMultiply
proto.dAddOffset = bnpDAddOffset
proto.multiplyLowerTo = bnpMultiplyLowerTo
proto.multiplyUpperTo = bnpMultiplyUpperTo
proto.modInt = bnpModInt
proto.millerRabin = bnpMillerRabin

// public
proto.clone = bnClone
proto.intValue = bnIntValue
proto.byteValue = bnByteValue
proto.shortValue = bnShortValue
proto.signum = bnSigNum
proto.toByteArray = bnToByteArray
proto.equals = bnEquals
proto.min = bnMin
proto.max = bnMax
proto.and = bnAnd
proto.or = bnOr
proto.xor = bnXor
proto.andNot = bnAndNot
proto.not = bnNot
proto.shiftLeft = bnShiftLeft
proto.shiftRight = bnShiftRight
proto.getLowestSetBit = bnGetLowestSetBit
proto.bitCount = bnBitCount
proto.testBit = bnTestBit
proto.setBit = bnSetBit
proto.clearBit = bnClearBit
proto.flipBit = bnFlipBit
proto.add = bnAdd
proto.subtract = bnSubtract
proto.multiply = bnMultiply
proto.divide = bnDivide
proto.remainder = bnRemainder
proto.divideAndRemainder = bnDivideAndRemainder
proto.modPow = bnModPow
proto.modInverse = bnModInverse
proto.pow = bnPow
proto.gcd = bnGCD
proto.isProbablePrime = bnIsProbablePrime

// JSBN-specific extension
proto.square = bnSquare

// constants
BigInteger.ZERO = nbv(0)
BigInteger.ONE = nbv(1)
BigInteger.valueOf = nbv

module.exports = BigInteger


/***/ }),

/***/ "./node_modules/bigi/lib/convert.js":
/*!******************************************!*\
  !*** ./node_modules/bigi/lib/convert.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// FIXME: Kind of a weird way to throw exceptions, consider removing
var assert = __webpack_require__(/*! assert */ "assert")
var BigInteger = __webpack_require__(/*! ./bigi */ "./node_modules/bigi/lib/bigi.js")

/**
 * Turns a byte array into a big integer.
 *
 * This function will interpret a byte array as a big integer in big
 * endian notation.
 */
BigInteger.fromByteArrayUnsigned = function(byteArray) {
  // BigInteger expects a DER integer conformant byte array
  if (byteArray[0] & 0x80) {
    return new BigInteger([0].concat(byteArray))
  }

  return new BigInteger(byteArray)
}

/**
 * Returns a byte array representation of the big integer.
 *
 * This returns the absolute of the contained value in big endian
 * form. A value of zero results in an empty array.
 */
BigInteger.prototype.toByteArrayUnsigned = function() {
  var byteArray = this.toByteArray()
  return byteArray[0] === 0 ? byteArray.slice(1) : byteArray
}

BigInteger.fromDERInteger = function(byteArray) {
  return new BigInteger(byteArray)
}

/*
 * Converts BigInteger to a DER integer representation.
 *
 * The format for this value uses the most significant bit as a sign
 * bit.  If the most significant bit is already set and the integer is
 * positive, a 0x00 is prepended.
 *
 * Examples:
 *
 *      0 =>     0x00
 *      1 =>     0x01
 *     -1 =>     0xff
 *    127 =>     0x7f
 *   -127 =>     0x81
 *    128 =>   0x0080
 *   -128 =>     0x80
 *    255 =>   0x00ff
 *   -255 =>   0xff01
 *  16300 =>   0x3fac
 * -16300 =>   0xc054
 *  62300 => 0x00f35c
 * -62300 => 0xff0ca4
*/
BigInteger.prototype.toDERInteger = BigInteger.prototype.toByteArray

BigInteger.fromBuffer = function(buffer) {
  // BigInteger expects a DER integer conformant byte array
  if (buffer[0] & 0x80) {
    var byteArray = Array.prototype.slice.call(buffer)

    return new BigInteger([0].concat(byteArray))
  }

  return new BigInteger(buffer)
}

BigInteger.fromHex = function(hex) {
  if (hex === '') return BigInteger.ZERO

  assert.equal(hex, hex.match(/^[A-Fa-f0-9]+/), 'Invalid hex string')
  assert.equal(hex.length % 2, 0, 'Incomplete hex')
  return new BigInteger(hex, 16)
}

BigInteger.prototype.toBuffer = function(size) {
  var byteArray = this.toByteArrayUnsigned()
  var zeros = []

  var padding = size - byteArray.length
  while (zeros.length < padding) zeros.push(0)

  return new Buffer(zeros.concat(byteArray))
}

BigInteger.prototype.toHex = function(size) {
  return this.toBuffer(size).toString('hex')
}


/***/ }),

/***/ "./node_modules/bigi/lib/index.js":
/*!****************************************!*\
  !*** ./node_modules/bigi/lib/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var BigInteger = __webpack_require__(/*! ./bigi */ "./node_modules/bigi/lib/bigi.js")

//addons
__webpack_require__(/*! ./convert */ "./node_modules/bigi/lib/convert.js")

module.exports = BigInteger

/***/ }),

/***/ "./node_modules/bigi/package.json":
/*!****************************************!*\
  !*** ./node_modules/bigi/package.json ***!
  \****************************************/
/*! exports provided: _args, _from, _id, _inCache, _installable, _location, _nodeVersion, _npmOperationalInternal, _npmUser, _npmVersion, _phantomChildren, _requested, _requiredBy, _resolved, _shasum, _shrinkwrap, _spec, _where, bugs, dependencies, description, devDependencies, directories, dist, gitHead, homepage, keywords, main, maintainers, name, optionalDependencies, readme, repository, scripts, testling, version, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"_args\":[[\"bigi@^1.4.0\",\"/home/ubuntu/dev-series-1/01-btc-payments/node_modules/bitcoinjs-lib\"]],\"_from\":\"bigi@>=1.4.0 <2.0.0\",\"_id\":\"bigi@1.4.2\",\"_inCache\":true,\"_installable\":true,\"_location\":\"/bigi\",\"_nodeVersion\":\"6.1.0\",\"_npmOperationalInternal\":{\"host\":\"packages-12-west.internal.npmjs.com\",\"tmp\":\"tmp/bigi-1.4.2.tgz_1469584192413_0.6801238611806184\"},\"_npmUser\":{\"email\":\"jprichardson@gmail.com\",\"name\":\"jprichardson\"},\"_npmVersion\":\"3.8.6\",\"_phantomChildren\":{},\"_requested\":{\"name\":\"bigi\",\"raw\":\"bigi@^1.4.0\",\"rawSpec\":\"^1.4.0\",\"scope\":null,\"spec\":\">=1.4.0 <2.0.0\",\"type\":\"range\"},\"_requiredBy\":[\"/bitcoinjs-lib\",\"/ecurve\"],\"_resolved\":\"https://registry.npmjs.org/bigi/-/bigi-1.4.2.tgz\",\"_shasum\":\"9c665a95f88b8b08fc05cfd731f561859d725825\",\"_shrinkwrap\":null,\"_spec\":\"bigi@^1.4.0\",\"_where\":\"/home/ubuntu/dev-series-1/01-btc-payments/node_modules/bitcoinjs-lib\",\"bugs\":{\"url\":\"https://github.com/cryptocoinjs/bigi/issues\"},\"dependencies\":{},\"description\":\"Big integers.\",\"devDependencies\":{\"coveralls\":\"^2.11.2\",\"istanbul\":\"^0.3.5\",\"jshint\":\"^2.5.1\",\"mocha\":\"^2.1.0\",\"mochify\":\"^2.1.0\"},\"directories\":{},\"dist\":{\"shasum\":\"9c665a95f88b8b08fc05cfd731f561859d725825\",\"tarball\":\"https://registry.npmjs.org/bigi/-/bigi-1.4.2.tgz\"},\"gitHead\":\"c25308081c896ff84702303722bf5ecd8b3f78e3\",\"homepage\":\"https://github.com/cryptocoinjs/bigi#readme\",\"keywords\":[\"arbitrary\",\"arithmetic\",\"big\",\"bigint\",\"biginteger\",\"bignumber\",\"bitcoin\",\"cryptography\",\"decimal\",\"float\",\"int\",\"integer\",\"math\",\"number\",\"precision\"],\"main\":\"./lib/index.js\",\"maintainers\":[{\"name\":\"midnightlightning\",\"email\":\"boydb@midnightdesign.ws\"},{\"name\":\"sidazhang\",\"email\":\"sidazhang89@gmail.com\"},{\"name\":\"nadav\",\"email\":\"npm@shesek.info\"},{\"name\":\"jprichardson\",\"email\":\"jprichardson@gmail.com\"}],\"name\":\"bigi\",\"optionalDependencies\":{},\"readme\":\"ERROR: No README data found!\",\"repository\":{\"type\":\"git\",\"url\":\"git+https://github.com/cryptocoinjs/bigi.git\"},\"scripts\":{\"browser-test\":\"mochify --wd -R spec\",\"coverage\":\"istanbul cover ./node_modules/.bin/_mocha -- --reporter list test/*.js\",\"coveralls\":\"npm run-script coverage && node ./node_modules/.bin/coveralls < coverage/lcov.info\",\"jshint\":\"jshint --config jshint.json lib/*.js ; true\",\"test\":\"_mocha -- test/*.js\",\"unit\":\"mocha\"},\"testling\":{\"browsers\":[\"android-browser/4.2..latest\",\"chrome/latest\",\"firefox/latest\",\"ie/9..latest\",\"iphone/6.0..latest\",\"safari/6.0..latest\"],\"files\":\"test/*.js\",\"harness\":\"mocha\"},\"version\":\"1.4.2\"}");

/***/ }),

/***/ "./node_modules/bip66/index.js":
/*!*************************************!*\
  !*** ./node_modules/bip66/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Reference https://github.com/bitcoin/bips/blob/master/bip-0066.mediawiki
// Format: 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
// NOTE: SIGHASH byte ignored AND restricted, truncate before use

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer

function check (buffer) {
  if (buffer.length < 8) return false
  if (buffer.length > 72) return false
  if (buffer[0] !== 0x30) return false
  if (buffer[1] !== buffer.length - 2) return false
  if (buffer[2] !== 0x02) return false

  var lenR = buffer[3]
  if (lenR === 0) return false
  if (5 + lenR >= buffer.length) return false
  if (buffer[4 + lenR] !== 0x02) return false

  var lenS = buffer[5 + lenR]
  if (lenS === 0) return false
  if ((6 + lenR + lenS) !== buffer.length) return false

  if (buffer[4] & 0x80) return false
  if (lenR > 1 && (buffer[4] === 0x00) && !(buffer[5] & 0x80)) return false

  if (buffer[lenR + 6] & 0x80) return false
  if (lenS > 1 && (buffer[lenR + 6] === 0x00) && !(buffer[lenR + 7] & 0x80)) return false
  return true
}

function decode (buffer) {
  if (buffer.length < 8) throw new Error('DER sequence length is too short')
  if (buffer.length > 72) throw new Error('DER sequence length is too long')
  if (buffer[0] !== 0x30) throw new Error('Expected DER sequence')
  if (buffer[1] !== buffer.length - 2) throw new Error('DER sequence length is invalid')
  if (buffer[2] !== 0x02) throw new Error('Expected DER integer')

  var lenR = buffer[3]
  if (lenR === 0) throw new Error('R length is zero')
  if (5 + lenR >= buffer.length) throw new Error('R length is too long')
  if (buffer[4 + lenR] !== 0x02) throw new Error('Expected DER integer (2)')

  var lenS = buffer[5 + lenR]
  if (lenS === 0) throw new Error('S length is zero')
  if ((6 + lenR + lenS) !== buffer.length) throw new Error('S length is invalid')

  if (buffer[4] & 0x80) throw new Error('R value is negative')
  if (lenR > 1 && (buffer[4] === 0x00) && !(buffer[5] & 0x80)) throw new Error('R value excessively padded')

  if (buffer[lenR + 6] & 0x80) throw new Error('S value is negative')
  if (lenS > 1 && (buffer[lenR + 6] === 0x00) && !(buffer[lenR + 7] & 0x80)) throw new Error('S value excessively padded')

  // non-BIP66 - extract R, S values
  return {
    r: buffer.slice(4, 4 + lenR),
    s: buffer.slice(6 + lenR)
  }
}

/*
 * Expects r and s to be positive DER integers.
 *
 * The DER format uses the most significant bit as a sign bit (& 0x80).
 * If the significant bit is set AND the integer is positive, a 0x00 is prepended.
 *
 * Examples:
 *
 *      0 =>     0x00
 *      1 =>     0x01
 *     -1 =>     0xff
 *    127 =>     0x7f
 *   -127 =>     0x81
 *    128 =>   0x0080
 *   -128 =>     0x80
 *    255 =>   0x00ff
 *   -255 =>   0xff01
 *  16300 =>   0x3fac
 * -16300 =>   0xc054
 *  62300 => 0x00f35c
 * -62300 => 0xff0ca4
*/
function encode (r, s) {
  var lenR = r.length
  var lenS = s.length
  if (lenR === 0) throw new Error('R length is zero')
  if (lenS === 0) throw new Error('S length is zero')
  if (lenR > 33) throw new Error('R length is too long')
  if (lenS > 33) throw new Error('S length is too long')
  if (r[0] & 0x80) throw new Error('R value is negative')
  if (s[0] & 0x80) throw new Error('S value is negative')
  if (lenR > 1 && (r[0] === 0x00) && !(r[1] & 0x80)) throw new Error('R value excessively padded')
  if (lenS > 1 && (s[0] === 0x00) && !(s[1] & 0x80)) throw new Error('S value excessively padded')

  var signature = Buffer.allocUnsafe(6 + lenR + lenS)

  // 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
  signature[0] = 0x30
  signature[1] = signature.length - 2
  signature[2] = 0x02
  signature[3] = r.length
  r.copy(signature, 4)
  signature[4 + lenR] = 0x02
  signature[5 + lenR] = s.length
  s.copy(signature, 6 + lenR)

  return signature
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}


/***/ }),

/***/ "./node_modules/bitcoin-ops/index.json":
/*!*********************************************!*\
  !*** ./node_modules/bitcoin-ops/index.json ***!
  \*********************************************/
/*! exports provided: OP_FALSE, OP_0, OP_PUSHDATA1, OP_PUSHDATA2, OP_PUSHDATA4, OP_1NEGATE, OP_RESERVED, OP_TRUE, OP_1, OP_2, OP_3, OP_4, OP_5, OP_6, OP_7, OP_8, OP_9, OP_10, OP_11, OP_12, OP_13, OP_14, OP_15, OP_16, OP_NOP, OP_VER, OP_IF, OP_NOTIF, OP_VERIF, OP_VERNOTIF, OP_ELSE, OP_ENDIF, OP_VERIFY, OP_RETURN, OP_TOALTSTACK, OP_FROMALTSTACK, OP_2DROP, OP_2DUP, OP_3DUP, OP_2OVER, OP_2ROT, OP_2SWAP, OP_IFDUP, OP_DEPTH, OP_DROP, OP_DUP, OP_NIP, OP_OVER, OP_PICK, OP_ROLL, OP_ROT, OP_SWAP, OP_TUCK, OP_CAT, OP_SUBSTR, OP_LEFT, OP_RIGHT, OP_SIZE, OP_INVERT, OP_AND, OP_OR, OP_XOR, OP_EQUAL, OP_EQUALVERIFY, OP_RESERVED1, OP_RESERVED2, OP_1ADD, OP_1SUB, OP_2MUL, OP_2DIV, OP_NEGATE, OP_ABS, OP_NOT, OP_0NOTEQUAL, OP_ADD, OP_SUB, OP_MUL, OP_DIV, OP_MOD, OP_LSHIFT, OP_RSHIFT, OP_BOOLAND, OP_BOOLOR, OP_NUMEQUAL, OP_NUMEQUALVERIFY, OP_NUMNOTEQUAL, OP_LESSTHAN, OP_GREATERTHAN, OP_LESSTHANOREQUAL, OP_GREATERTHANOREQUAL, OP_MIN, OP_MAX, OP_WITHIN, OP_RIPEMD160, OP_SHA1, OP_SHA256, OP_HASH160, OP_HASH256, OP_CODESEPARATOR, OP_CHECKSIG, OP_CHECKSIGVERIFY, OP_CHECKMULTISIG, OP_CHECKMULTISIGVERIFY, OP_NOP1, OP_NOP2, OP_CHECKLOCKTIMEVERIFY, OP_NOP3, OP_CHECKSEQUENCEVERIFY, OP_NOP4, OP_NOP5, OP_NOP6, OP_NOP7, OP_NOP8, OP_NOP9, OP_NOP10, OP_PUBKEYHASH, OP_PUBKEY, OP_INVALIDOPCODE, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"OP_FALSE\":0,\"OP_0\":0,\"OP_PUSHDATA1\":76,\"OP_PUSHDATA2\":77,\"OP_PUSHDATA4\":78,\"OP_1NEGATE\":79,\"OP_RESERVED\":80,\"OP_TRUE\":81,\"OP_1\":81,\"OP_2\":82,\"OP_3\":83,\"OP_4\":84,\"OP_5\":85,\"OP_6\":86,\"OP_7\":87,\"OP_8\":88,\"OP_9\":89,\"OP_10\":90,\"OP_11\":91,\"OP_12\":92,\"OP_13\":93,\"OP_14\":94,\"OP_15\":95,\"OP_16\":96,\"OP_NOP\":97,\"OP_VER\":98,\"OP_IF\":99,\"OP_NOTIF\":100,\"OP_VERIF\":101,\"OP_VERNOTIF\":102,\"OP_ELSE\":103,\"OP_ENDIF\":104,\"OP_VERIFY\":105,\"OP_RETURN\":106,\"OP_TOALTSTACK\":107,\"OP_FROMALTSTACK\":108,\"OP_2DROP\":109,\"OP_2DUP\":110,\"OP_3DUP\":111,\"OP_2OVER\":112,\"OP_2ROT\":113,\"OP_2SWAP\":114,\"OP_IFDUP\":115,\"OP_DEPTH\":116,\"OP_DROP\":117,\"OP_DUP\":118,\"OP_NIP\":119,\"OP_OVER\":120,\"OP_PICK\":121,\"OP_ROLL\":122,\"OP_ROT\":123,\"OP_SWAP\":124,\"OP_TUCK\":125,\"OP_CAT\":126,\"OP_SUBSTR\":127,\"OP_LEFT\":128,\"OP_RIGHT\":129,\"OP_SIZE\":130,\"OP_INVERT\":131,\"OP_AND\":132,\"OP_OR\":133,\"OP_XOR\":134,\"OP_EQUAL\":135,\"OP_EQUALVERIFY\":136,\"OP_RESERVED1\":137,\"OP_RESERVED2\":138,\"OP_1ADD\":139,\"OP_1SUB\":140,\"OP_2MUL\":141,\"OP_2DIV\":142,\"OP_NEGATE\":143,\"OP_ABS\":144,\"OP_NOT\":145,\"OP_0NOTEQUAL\":146,\"OP_ADD\":147,\"OP_SUB\":148,\"OP_MUL\":149,\"OP_DIV\":150,\"OP_MOD\":151,\"OP_LSHIFT\":152,\"OP_RSHIFT\":153,\"OP_BOOLAND\":154,\"OP_BOOLOR\":155,\"OP_NUMEQUAL\":156,\"OP_NUMEQUALVERIFY\":157,\"OP_NUMNOTEQUAL\":158,\"OP_LESSTHAN\":159,\"OP_GREATERTHAN\":160,\"OP_LESSTHANOREQUAL\":161,\"OP_GREATERTHANOREQUAL\":162,\"OP_MIN\":163,\"OP_MAX\":164,\"OP_WITHIN\":165,\"OP_RIPEMD160\":166,\"OP_SHA1\":167,\"OP_SHA256\":168,\"OP_HASH160\":169,\"OP_HASH256\":170,\"OP_CODESEPARATOR\":171,\"OP_CHECKSIG\":172,\"OP_CHECKSIGVERIFY\":173,\"OP_CHECKMULTISIG\":174,\"OP_CHECKMULTISIGVERIFY\":175,\"OP_NOP1\":176,\"OP_NOP2\":177,\"OP_CHECKLOCKTIMEVERIFY\":177,\"OP_NOP3\":178,\"OP_CHECKSEQUENCEVERIFY\":178,\"OP_NOP4\":179,\"OP_NOP5\":180,\"OP_NOP6\":181,\"OP_NOP7\":182,\"OP_NOP8\":183,\"OP_NOP9\":184,\"OP_NOP10\":185,\"OP_PUBKEYHASH\":253,\"OP_PUBKEY\":254,\"OP_INVALIDOPCODE\":255}");

/***/ }),

/***/ "./node_modules/bitcoin-ops/map.js":
/*!*****************************************!*\
  !*** ./node_modules/bitcoin-ops/map.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var OPS = __webpack_require__(/*! ./index.json */ "./node_modules/bitcoin-ops/index.json")

var map = {}
for (var op in OPS) {
  var code = OPS[op]
  map[code] = op
}

module.exports = map


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/address.js":
/*!***************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/address.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
var bech32 = __webpack_require__(/*! bech32 */ "./node_modules/bech32/index.js")
var bs58check = __webpack_require__(/*! bs58check */ "./node_modules/bs58check/index.js")
var bscript = __webpack_require__(/*! ./script */ "./node_modules/bitcoinjs-lib/src/script.js")
var btemplates = __webpack_require__(/*! ./templates */ "./node_modules/bitcoinjs-lib/src/templates/index.js")
var networks = __webpack_require__(/*! ./networks */ "./node_modules/bitcoinjs-lib/src/networks.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var types = __webpack_require__(/*! ./types */ "./node_modules/bitcoinjs-lib/src/types.js")

function fromBase58Check (address) {
  var payload = bs58check.decode(address)

  // TODO: 4.0.0, move to "toOutputScript"
  if (payload.length < 21) throw new TypeError(address + ' is too short')
  if (payload.length > 21) throw new TypeError(address + ' is too long')

  var version = payload.readUInt8(0)
  var hash = payload.slice(1)

  return { version: version, hash: hash }
}

function fromBech32 (address) {
  var result = bech32.decode(address)
  var data = bech32.fromWords(result.words.slice(1))

  return {
    version: result.words[0],
    prefix: result.prefix,
    data: Buffer.from(data)
  }
}

function toBase58Check (hash, version) {
  typeforce(types.tuple(types.Hash160bit, types.UInt8), arguments)

  var payload = Buffer.allocUnsafe(21)
  payload.writeUInt8(version, 0)
  hash.copy(payload, 1)

  return bs58check.encode(payload)
}

function toBech32 (data, version, prefix) {
  var words = bech32.toWords(data)
  words.unshift(version)

  return bech32.encode(prefix, words)
}

function fromOutputScript (outputScript, network) {
  network = network || networks.bitcoin

  if (btemplates.pubKeyHash.output.check(outputScript)) return toBase58Check(bscript.compile(outputScript).slice(3, 23), network.pubKeyHash)
  if (btemplates.scriptHash.output.check(outputScript)) return toBase58Check(bscript.compile(outputScript).slice(2, 22), network.scriptHash)
  if (btemplates.witnessPubKeyHash.output.check(outputScript)) return toBech32(bscript.compile(outputScript).slice(2, 22), 0, network.bech32)
  if (btemplates.witnessScriptHash.output.check(outputScript)) return toBech32(bscript.compile(outputScript).slice(2, 34), 0, network.bech32)

  throw new Error(bscript.toASM(outputScript) + ' has no matching Address')
}

function toOutputScript (address, network) {
  network = network || networks.bitcoin

  var decode
  try {
    decode = fromBase58Check(address)
  } catch (e) {}

  if (decode) {
    if (decode.version === network.pubKeyHash) return btemplates.pubKeyHash.output.encode(decode.hash)
    if (decode.version === network.scriptHash) return btemplates.scriptHash.output.encode(decode.hash)
  } else {
    try {
      decode = fromBech32(address)
    } catch (e) {}

    if (decode) {
      if (decode.prefix !== network.bech32) throw new Error(address + ' has an invalid prefix')
      if (decode.version === 0) {
        if (decode.data.length === 20) return btemplates.witnessPubKeyHash.output.encode(decode.data)
        if (decode.data.length === 32) return btemplates.witnessScriptHash.output.encode(decode.data)
      }
    }
  }

  throw new Error(address + ' has no matching Script')
}

module.exports = {
  fromBase58Check: fromBase58Check,
  fromBech32: fromBech32,
  fromOutputScript: fromOutputScript,
  toBase58Check: toBase58Check,
  toBech32: toBech32,
  toOutputScript: toOutputScript
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/block.js":
/*!*************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/block.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
var bcrypto = __webpack_require__(/*! ./crypto */ "./node_modules/bitcoinjs-lib/src/crypto.js")
var fastMerkleRoot = __webpack_require__(/*! merkle-lib/fastRoot */ "./node_modules/merkle-lib/fastRoot.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var types = __webpack_require__(/*! ./types */ "./node_modules/bitcoinjs-lib/src/types.js")
var varuint = __webpack_require__(/*! varuint-bitcoin */ "./node_modules/varuint-bitcoin/index.js")

var Transaction = __webpack_require__(/*! ./transaction */ "./node_modules/bitcoinjs-lib/src/transaction.js")

function Block () {
  this.version = 1
  this.prevHash = null
  this.merkleRoot = null
  this.timestamp = 0
  this.bits = 0
  this.nonce = 0
}

Block.fromBuffer = function (buffer) {
  if (buffer.length < 80) throw new Error('Buffer too small (< 80 bytes)')

  var offset = 0
  function readSlice (n) {
    offset += n
    return buffer.slice(offset - n, offset)
  }

  function readUInt32 () {
    var i = buffer.readUInt32LE(offset)
    offset += 4
    return i
  }

  function readInt32 () {
    var i = buffer.readInt32LE(offset)
    offset += 4
    return i
  }

  var block = new Block()
  block.version = readInt32()
  block.prevHash = readSlice(32)
  block.merkleRoot = readSlice(32)
  block.timestamp = readUInt32()
  block.bits = readUInt32()
  block.nonce = readUInt32()

  if (buffer.length === 80) return block

  function readVarInt () {
    var vi = varuint.decode(buffer, offset)
    offset += varuint.decode.bytes
    return vi
  }

  function readTransaction () {
    var tx = Transaction.fromBuffer(buffer.slice(offset), true)
    offset += tx.byteLength()
    return tx
  }

  var nTransactions = readVarInt()
  block.transactions = []

  for (var i = 0; i < nTransactions; ++i) {
    var tx = readTransaction()
    block.transactions.push(tx)
  }

  return block
}

Block.prototype.byteLength = function (headersOnly) {
  if (headersOnly || !this.transactions) return 80

  return 80 + varuint.encodingLength(this.transactions.length) + this.transactions.reduce(function (a, x) {
    return a + x.byteLength()
  }, 0)
}

Block.fromHex = function (hex) {
  return Block.fromBuffer(Buffer.from(hex, 'hex'))
}

Block.prototype.getHash = function () {
  return bcrypto.hash256(this.toBuffer(true))
}

Block.prototype.getId = function () {
  return this.getHash().reverse().toString('hex')
}

Block.prototype.getUTCDate = function () {
  var date = new Date(0) // epoch
  date.setUTCSeconds(this.timestamp)

  return date
}

// TODO: buffer, offset compatibility
Block.prototype.toBuffer = function (headersOnly) {
  var buffer = Buffer.allocUnsafe(this.byteLength(headersOnly))

  var offset = 0
  function writeSlice (slice) {
    slice.copy(buffer, offset)
    offset += slice.length
  }

  function writeInt32 (i) {
    buffer.writeInt32LE(i, offset)
    offset += 4
  }
  function writeUInt32 (i) {
    buffer.writeUInt32LE(i, offset)
    offset += 4
  }

  writeInt32(this.version)
  writeSlice(this.prevHash)
  writeSlice(this.merkleRoot)
  writeUInt32(this.timestamp)
  writeUInt32(this.bits)
  writeUInt32(this.nonce)

  if (headersOnly || !this.transactions) return buffer

  varuint.encode(this.transactions.length, buffer, offset)
  offset += varuint.encode.bytes

  this.transactions.forEach(function (tx) {
    var txSize = tx.byteLength() // TODO: extract from toBuffer?
    tx.toBuffer(buffer, offset)
    offset += txSize
  })

  return buffer
}

Block.prototype.toHex = function (headersOnly) {
  return this.toBuffer(headersOnly).toString('hex')
}

Block.calculateTarget = function (bits) {
  var exponent = ((bits & 0xff000000) >> 24) - 3
  var mantissa = bits & 0x007fffff
  var target = Buffer.alloc(32, 0)
  target.writeUInt32BE(mantissa, 28 - exponent)
  return target
}

Block.calculateMerkleRoot = function (transactions) {
  typeforce([{ getHash: types.Function }], transactions)
  if (transactions.length === 0) throw TypeError('Cannot compute merkle root for zero transactions')

  var hashes = transactions.map(function (transaction) {
    return transaction.getHash()
  })

  return fastMerkleRoot(hashes, bcrypto.hash256)
}

Block.prototype.checkMerkleRoot = function () {
  if (!this.transactions) return false

  var actualMerkleRoot = Block.calculateMerkleRoot(this.transactions)
  return this.merkleRoot.compare(actualMerkleRoot) === 0
}

Block.prototype.checkProofOfWork = function () {
  var hash = this.getHash().reverse()
  var target = Block.calculateTarget(this.bits)

  return hash.compare(target) <= 0
}

module.exports = Block


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/bufferutils.js":
/*!*******************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/bufferutils.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var pushdata = __webpack_require__(/*! pushdata-bitcoin */ "./node_modules/pushdata-bitcoin/index.js")
var varuint = __webpack_require__(/*! varuint-bitcoin */ "./node_modules/varuint-bitcoin/index.js")

// https://github.com/feross/buffer/blob/master/index.js#L1127
function verifuint (value, max) {
  if (typeof value !== 'number') throw new Error('cannot write a non-number as a number')
  if (value < 0) throw new Error('specified a negative value for writing an unsigned value')
  if (value > max) throw new Error('RangeError: value out of range')
  if (Math.floor(value) !== value) throw new Error('value has a fractional component')
}

function readUInt64LE (buffer, offset) {
  var a = buffer.readUInt32LE(offset)
  var b = buffer.readUInt32LE(offset + 4)
  b *= 0x100000000

  verifuint(b + a, 0x001fffffffffffff)

  return b + a
}

function writeUInt64LE (buffer, value, offset) {
  verifuint(value, 0x001fffffffffffff)

  buffer.writeInt32LE(value & -1, offset)
  buffer.writeUInt32LE(Math.floor(value / 0x100000000), offset + 4)
  return offset + 8
}

// TODO: remove in 4.0.0?
function readVarInt (buffer, offset) {
  var result = varuint.decode(buffer, offset)

  return {
    number: result,
    size: varuint.decode.bytes
  }
}

// TODO: remove in 4.0.0?
function writeVarInt (buffer, number, offset) {
  varuint.encode(number, buffer, offset)
  return varuint.encode.bytes
}

module.exports = {
  pushDataSize: pushdata.encodingLength,
  readPushDataInt: pushdata.decode,
  readUInt64LE: readUInt64LE,
  readVarInt: readVarInt,
  varIntBuffer: varuint.encode,
  varIntSize: varuint.encodingLength,
  writePushDataInt: pushdata.encode,
  writeUInt64LE: writeUInt64LE,
  writeVarInt: writeVarInt
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/crypto.js":
/*!**************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/crypto.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var createHash = __webpack_require__(/*! create-hash */ "./node_modules/create-hash/index.js")

function ripemd160 (buffer) {
  return createHash('rmd160').update(buffer).digest()
}

function sha1 (buffer) {
  return createHash('sha1').update(buffer).digest()
}

function sha256 (buffer) {
  return createHash('sha256').update(buffer).digest()
}

function hash160 (buffer) {
  return ripemd160(sha256(buffer))
}

function hash256 (buffer) {
  return sha256(sha256(buffer))
}

module.exports = {
  hash160: hash160,
  hash256: hash256,
  ripemd160: ripemd160,
  sha1: sha1,
  sha256: sha256
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/ecdsa.js":
/*!*************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/ecdsa.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
var createHmac = __webpack_require__(/*! create-hmac */ "./node_modules/create-hmac/index.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var types = __webpack_require__(/*! ./types */ "./node_modules/bitcoinjs-lib/src/types.js")

var BigInteger = __webpack_require__(/*! bigi */ "./node_modules/bigi/lib/index.js")
var ECSignature = __webpack_require__(/*! ./ecsignature */ "./node_modules/bitcoinjs-lib/src/ecsignature.js")

var ZERO = Buffer.alloc(1, 0)
var ONE = Buffer.alloc(1, 1)

var ecurve = __webpack_require__(/*! ecurve */ "./node_modules/ecurve/lib/index.js")
var secp256k1 = ecurve.getCurveByName('secp256k1')

// https://tools.ietf.org/html/rfc6979#section-3.2
function deterministicGenerateK (hash, x, checkSig) {
  typeforce(types.tuple(
    types.Hash256bit,
    types.Buffer256bit,
    types.Function
  ), arguments)

  // Step A, ignored as hash already provided
  // Step B
  // Step C
  var k = Buffer.alloc(32, 0)
  var v = Buffer.alloc(32, 1)

  // Step D
  k = createHmac('sha256', k)
    .update(v)
    .update(ZERO)
    .update(x)
    .update(hash)
    .digest()

  // Step E
  v = createHmac('sha256', k).update(v).digest()

  // Step F
  k = createHmac('sha256', k)
    .update(v)
    .update(ONE)
    .update(x)
    .update(hash)
    .digest()

  // Step G
  v = createHmac('sha256', k).update(v).digest()

  // Step H1/H2a, ignored as tlen === qlen (256 bit)
  // Step H2b
  v = createHmac('sha256', k).update(v).digest()

  var T = BigInteger.fromBuffer(v)

  // Step H3, repeat until T is within the interval [1, n - 1] and is suitable for ECDSA
  while (T.signum() <= 0 || T.compareTo(secp256k1.n) >= 0 || !checkSig(T)) {
    k = createHmac('sha256', k)
      .update(v)
      .update(ZERO)
      .digest()

    v = createHmac('sha256', k).update(v).digest()

    // Step H1/H2a, again, ignored as tlen === qlen (256 bit)
    // Step H2b again
    v = createHmac('sha256', k).update(v).digest()
    T = BigInteger.fromBuffer(v)
  }

  return T
}

var N_OVER_TWO = secp256k1.n.shiftRight(1)

function sign (hash, d) {
  typeforce(types.tuple(types.Hash256bit, types.BigInt), arguments)

  var x = d.toBuffer(32)
  var e = BigInteger.fromBuffer(hash)
  var n = secp256k1.n
  var G = secp256k1.G

  var r, s
  deterministicGenerateK(hash, x, function (k) {
    var Q = G.multiply(k)

    if (secp256k1.isInfinity(Q)) return false

    r = Q.affineX.mod(n)
    if (r.signum() === 0) return false

    s = k.modInverse(n).multiply(e.add(d.multiply(r))).mod(n)
    if (s.signum() === 0) return false

    return true
  })

  // enforce low S values, see bip62: 'low s values in signatures'
  if (s.compareTo(N_OVER_TWO) > 0) {
    s = n.subtract(s)
  }

  return new ECSignature(r, s)
}

function verify (hash, signature, Q) {
  typeforce(types.tuple(
    types.Hash256bit,
    types.ECSignature,
    types.ECPoint
  ), arguments)

  var n = secp256k1.n
  var G = secp256k1.G

  var r = signature.r
  var s = signature.s

  // 1.4.1 Enforce r and s are both integers in the interval [1, n − 1]
  if (r.signum() <= 0 || r.compareTo(n) >= 0) return false
  if (s.signum() <= 0 || s.compareTo(n) >= 0) return false

  // 1.4.2 H = Hash(M), already done by the user
  // 1.4.3 e = H
  var e = BigInteger.fromBuffer(hash)

  // Compute s^-1
  var sInv = s.modInverse(n)

  // 1.4.4 Compute u1 = es^−1 mod n
  //               u2 = rs^−1 mod n
  var u1 = e.multiply(sInv).mod(n)
  var u2 = r.multiply(sInv).mod(n)

  // 1.4.5 Compute R = (xR, yR)
  //               R = u1G + u2Q
  var R = G.multiplyTwo(u1, Q, u2)

  // 1.4.5 (cont.) Enforce R is not at infinity
  if (secp256k1.isInfinity(R)) return false

  // 1.4.6 Convert the field element R.x to an integer
  var xR = R.affineX

  // 1.4.7 Set v = xR mod n
  var v = xR.mod(n)

  // 1.4.8 If v = r, output "valid", and if v != r, output "invalid"
  return v.equals(r)
}

module.exports = {
  deterministicGenerateK: deterministicGenerateK,
  sign: sign,
  verify: verify,

  // TODO: remove
  __curve: secp256k1
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/ecpair.js":
/*!**************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/ecpair.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var baddress = __webpack_require__(/*! ./address */ "./node_modules/bitcoinjs-lib/src/address.js")
var bcrypto = __webpack_require__(/*! ./crypto */ "./node_modules/bitcoinjs-lib/src/crypto.js")
var ecdsa = __webpack_require__(/*! ./ecdsa */ "./node_modules/bitcoinjs-lib/src/ecdsa.js")
var randomBytes = __webpack_require__(/*! randombytes */ "./node_modules/randombytes/index.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var types = __webpack_require__(/*! ./types */ "./node_modules/bitcoinjs-lib/src/types.js")
var wif = __webpack_require__(/*! wif */ "./node_modules/wif/index.js")

var NETWORKS = __webpack_require__(/*! ./networks */ "./node_modules/bitcoinjs-lib/src/networks.js")
var BigInteger = __webpack_require__(/*! bigi */ "./node_modules/bigi/lib/index.js")

var ecurve = __webpack_require__(/*! ecurve */ "./node_modules/ecurve/lib/index.js")
var secp256k1 = ecdsa.__curve

function ECPair (d, Q, options) {
  if (options) {
    typeforce({
      compressed: types.maybe(types.Boolean),
      network: types.maybe(types.Network)
    }, options)
  }

  options = options || {}

  if (d) {
    if (d.signum() <= 0) throw new Error('Private key must be greater than 0')
    if (d.compareTo(secp256k1.n) >= 0) throw new Error('Private key must be less than the curve order')
    if (Q) throw new TypeError('Unexpected publicKey parameter')

    this.d = d
  } else {
    typeforce(types.ECPoint, Q)

    this.__Q = Q
  }

  this.compressed = options.compressed === undefined ? true : options.compressed
  this.network = options.network || NETWORKS.bitcoin
}

Object.defineProperty(ECPair.prototype, 'Q', {
  get: function () {
    if (!this.__Q && this.d) {
      this.__Q = secp256k1.G.multiply(this.d)
    }

    return this.__Q
  }
})

ECPair.fromPublicKeyBuffer = function (buffer, network) {
  var Q = ecurve.Point.decodeFrom(secp256k1, buffer)

  return new ECPair(null, Q, {
    compressed: Q.compressed,
    network: network
  })
}

ECPair.fromWIF = function (string, network) {
  var decoded = wif.decode(string)
  var version = decoded.version

  // list of networks?
  if (types.Array(network)) {
    network = network.filter(function (x) {
      return version === x.wif
    }).pop()

    if (!network) throw new Error('Unknown network version')

  // otherwise, assume a network object (or default to bitcoin)
  } else {
    network = network || NETWORKS.bitcoin

    if (version !== network.wif) throw new Error('Invalid network version')
  }

  var d = BigInteger.fromBuffer(decoded.privateKey)

  return new ECPair(d, null, {
    compressed: decoded.compressed,
    network: network
  })
}

ECPair.makeRandom = function (options) {
  options = options || {}

  var rng = options.rng || randomBytes

  var d
  do {
    var buffer = rng(32)
    typeforce(types.Buffer256bit, buffer)

    d = BigInteger.fromBuffer(buffer)
  } while (d.signum() <= 0 || d.compareTo(secp256k1.n) >= 0)

  return new ECPair(d, null, options)
}

ECPair.prototype.getAddress = function () {
  return baddress.toBase58Check(bcrypto.hash160(this.getPublicKeyBuffer()), this.getNetwork().pubKeyHash)
}

ECPair.prototype.getNetwork = function () {
  return this.network
}

ECPair.prototype.getPublicKeyBuffer = function () {
  return this.Q.getEncoded(this.compressed)
}

ECPair.prototype.sign = function (hash) {
  if (!this.d) throw new Error('Missing private key')

  return ecdsa.sign(hash, this.d)
}

ECPair.prototype.toWIF = function () {
  if (!this.d) throw new Error('Missing private key')

  return wif.encode(this.network.wif, this.d.toBuffer(32), this.compressed)
}

ECPair.prototype.verify = function (hash, signature) {
  return ecdsa.verify(hash, signature, this.Q)
}

module.exports = ECPair


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/ecsignature.js":
/*!*******************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/ecsignature.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var bip66 = __webpack_require__(/*! bip66 */ "./node_modules/bip66/index.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var types = __webpack_require__(/*! ./types */ "./node_modules/bitcoinjs-lib/src/types.js")

var BigInteger = __webpack_require__(/*! bigi */ "./node_modules/bigi/lib/index.js")

function ECSignature (r, s) {
  typeforce(types.tuple(types.BigInt, types.BigInt), arguments)

  this.r = r
  this.s = s
}

ECSignature.parseCompact = function (buffer) {
  typeforce(types.BufferN(65), buffer)

  var flagByte = buffer.readUInt8(0) - 27
  if (flagByte !== (flagByte & 7)) throw new Error('Invalid signature parameter')

  var compressed = !!(flagByte & 4)
  var recoveryParam = flagByte & 3
  var signature = ECSignature.fromRSBuffer(buffer.slice(1))

  return {
    compressed: compressed,
    i: recoveryParam,
    signature: signature
  }
}

ECSignature.fromRSBuffer = function (buffer) {
  typeforce(types.BufferN(64), buffer)

  var r = BigInteger.fromBuffer(buffer.slice(0, 32))
  var s = BigInteger.fromBuffer(buffer.slice(32, 64))
  return new ECSignature(r, s)
}

ECSignature.fromDER = function (buffer) {
  var decode = bip66.decode(buffer)
  var r = BigInteger.fromDERInteger(decode.r)
  var s = BigInteger.fromDERInteger(decode.s)

  return new ECSignature(r, s)
}

// BIP62: 1 byte hashType flag (only 0x01, 0x02, 0x03, 0x81, 0x82 and 0x83 are allowed)
ECSignature.parseScriptSignature = function (buffer) {
  var hashType = buffer.readUInt8(buffer.length - 1)
  var hashTypeMod = hashType & ~0x80

  if (hashTypeMod <= 0x00 || hashTypeMod >= 0x04) throw new Error('Invalid hashType ' + hashType)

  return {
    signature: ECSignature.fromDER(buffer.slice(0, -1)),
    hashType: hashType
  }
}

ECSignature.prototype.toCompact = function (i, compressed) {
  if (compressed) {
    i += 4
  }

  i += 27

  var buffer = Buffer.alloc(65)
  buffer.writeUInt8(i, 0)
  this.toRSBuffer(buffer, 1)
  return buffer
}

ECSignature.prototype.toDER = function () {
  var r = Buffer.from(this.r.toDERInteger())
  var s = Buffer.from(this.s.toDERInteger())

  return bip66.encode(r, s)
}

ECSignature.prototype.toRSBuffer = function (buffer, offset) {
  buffer = buffer || Buffer.alloc(64)
  this.r.toBuffer(32).copy(buffer, offset)
  this.s.toBuffer(32).copy(buffer, offset + 32)
  return buffer
}

ECSignature.prototype.toScriptSignature = function (hashType) {
  var hashTypeMod = hashType & ~0x80
  if (hashTypeMod <= 0 || hashTypeMod >= 4) throw new Error('Invalid hashType ' + hashType)

  var hashTypeBuffer = Buffer.alloc(1)
  hashTypeBuffer.writeUInt8(hashType, 0)

  return Buffer.concat([this.toDER(), hashTypeBuffer])
}

module.exports = ECSignature


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/hdnode.js":
/*!**************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/hdnode.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
var base58check = __webpack_require__(/*! bs58check */ "./node_modules/bs58check/index.js")
var bcrypto = __webpack_require__(/*! ./crypto */ "./node_modules/bitcoinjs-lib/src/crypto.js")
var createHmac = __webpack_require__(/*! create-hmac */ "./node_modules/create-hmac/index.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var types = __webpack_require__(/*! ./types */ "./node_modules/bitcoinjs-lib/src/types.js")
var NETWORKS = __webpack_require__(/*! ./networks */ "./node_modules/bitcoinjs-lib/src/networks.js")

var BigInteger = __webpack_require__(/*! bigi */ "./node_modules/bigi/lib/index.js")
var ECPair = __webpack_require__(/*! ./ecpair */ "./node_modules/bitcoinjs-lib/src/ecpair.js")

var ecurve = __webpack_require__(/*! ecurve */ "./node_modules/ecurve/lib/index.js")
var curve = ecurve.getCurveByName('secp256k1')

function HDNode (keyPair, chainCode) {
  typeforce(types.tuple('ECPair', types.Buffer256bit), arguments)

  if (!keyPair.compressed) throw new TypeError('BIP32 only allows compressed keyPairs')

  this.keyPair = keyPair
  this.chainCode = chainCode
  this.depth = 0
  this.index = 0
  this.parentFingerprint = 0x00000000
}

HDNode.HIGHEST_BIT = 0x80000000
HDNode.LENGTH = 78
HDNode.MASTER_SECRET = Buffer.from('Bitcoin seed', 'utf8')

HDNode.fromSeedBuffer = function (seed, network) {
  typeforce(types.tuple(types.Buffer, types.maybe(types.Network)), arguments)

  if (seed.length < 16) throw new TypeError('Seed should be at least 128 bits')
  if (seed.length > 64) throw new TypeError('Seed should be at most 512 bits')

  var I = createHmac('sha512', HDNode.MASTER_SECRET).update(seed).digest()
  var IL = I.slice(0, 32)
  var IR = I.slice(32)

  // In case IL is 0 or >= n, the master key is invalid
  // This is handled by the ECPair constructor
  var pIL = BigInteger.fromBuffer(IL)
  var keyPair = new ECPair(pIL, null, {
    network: network
  })

  return new HDNode(keyPair, IR)
}

HDNode.fromSeedHex = function (hex, network) {
  return HDNode.fromSeedBuffer(Buffer.from(hex, 'hex'), network)
}

HDNode.fromBase58 = function (string, networks) {
  var buffer = base58check.decode(string)
  if (buffer.length !== 78) throw new Error('Invalid buffer length')

  // 4 bytes: version bytes
  var version = buffer.readUInt32BE(0)
  var network

  // list of networks?
  if (Array.isArray(networks)) {
    network = networks.filter(function (x) {
      return version === x.bip32.private ||
             version === x.bip32.public
    }).pop()

    if (!network) throw new Error('Unknown network version')

  // otherwise, assume a network object (or default to bitcoin)
  } else {
    network = networks || NETWORKS.bitcoin
  }

  if (version !== network.bip32.private &&
    version !== network.bip32.public) throw new Error('Invalid network version')

  // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 descendants, ...
  var depth = buffer[4]

  // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
  var parentFingerprint = buffer.readUInt32BE(5)
  if (depth === 0) {
    if (parentFingerprint !== 0x00000000) throw new Error('Invalid parent fingerprint')
  }

  // 4 bytes: child number. This is the number i in xi = xpar/i, with xi the key being serialized.
  // This is encoded in MSB order. (0x00000000 if master key)
  var index = buffer.readUInt32BE(9)
  if (depth === 0 && index !== 0) throw new Error('Invalid index')

  // 32 bytes: the chain code
  var chainCode = buffer.slice(13, 45)
  var keyPair

  // 33 bytes: private key data (0x00 + k)
  if (version === network.bip32.private) {
    if (buffer.readUInt8(45) !== 0x00) throw new Error('Invalid private key')

    var d = BigInteger.fromBuffer(buffer.slice(46, 78))
    keyPair = new ECPair(d, null, { network: network })

  // 33 bytes: public key data (0x02 + X or 0x03 + X)
  } else {
    var Q = ecurve.Point.decodeFrom(curve, buffer.slice(45, 78))
    // Q.compressed is assumed, if somehow this assumption is broken, `new HDNode` will throw

    // Verify that the X coordinate in the public point corresponds to a point on the curve.
    // If not, the extended public key is invalid.
    curve.validate(Q)

    keyPair = new ECPair(null, Q, { network: network })
  }

  var hd = new HDNode(keyPair, chainCode)
  hd.depth = depth
  hd.index = index
  hd.parentFingerprint = parentFingerprint

  return hd
}

HDNode.prototype.getAddress = function () {
  return this.keyPair.getAddress()
}

HDNode.prototype.getIdentifier = function () {
  return bcrypto.hash160(this.keyPair.getPublicKeyBuffer())
}

HDNode.prototype.getFingerprint = function () {
  return this.getIdentifier().slice(0, 4)
}

HDNode.prototype.getNetwork = function () {
  return this.keyPair.getNetwork()
}

HDNode.prototype.getPublicKeyBuffer = function () {
  return this.keyPair.getPublicKeyBuffer()
}

HDNode.prototype.neutered = function () {
  var neuteredKeyPair = new ECPair(null, this.keyPair.Q, {
    network: this.keyPair.network
  })

  var neutered = new HDNode(neuteredKeyPair, this.chainCode)
  neutered.depth = this.depth
  neutered.index = this.index
  neutered.parentFingerprint = this.parentFingerprint

  return neutered
}

HDNode.prototype.sign = function (hash) {
  return this.keyPair.sign(hash)
}

HDNode.prototype.verify = function (hash, signature) {
  return this.keyPair.verify(hash, signature)
}

HDNode.prototype.toBase58 = function (__isPrivate) {
  if (__isPrivate !== undefined) throw new TypeError('Unsupported argument in 2.0.0')

  // Version
  var network = this.keyPair.network
  var version = (!this.isNeutered()) ? network.bip32.private : network.bip32.public
  var buffer = Buffer.allocUnsafe(78)

  // 4 bytes: version bytes
  buffer.writeUInt32BE(version, 0)

  // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 descendants, ....
  buffer.writeUInt8(this.depth, 4)

  // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
  buffer.writeUInt32BE(this.parentFingerprint, 5)

  // 4 bytes: child number. This is the number i in xi = xpar/i, with xi the key being serialized.
  // This is encoded in big endian. (0x00000000 if master key)
  buffer.writeUInt32BE(this.index, 9)

  // 32 bytes: the chain code
  this.chainCode.copy(buffer, 13)

  // 33 bytes: the public key or private key data
  if (!this.isNeutered()) {
    // 0x00 + k for private keys
    buffer.writeUInt8(0, 45)
    this.keyPair.d.toBuffer(32).copy(buffer, 46)

  // 33 bytes: the public key
  } else {
    // X9.62 encoding for public keys
    this.keyPair.getPublicKeyBuffer().copy(buffer, 45)
  }

  return base58check.encode(buffer)
}

// https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions
HDNode.prototype.derive = function (index) {
  typeforce(types.UInt32, index)

  var isHardened = index >= HDNode.HIGHEST_BIT
  var data = Buffer.allocUnsafe(37)

  // Hardened child
  if (isHardened) {
    if (this.isNeutered()) throw new TypeError('Could not derive hardened child key')

    // data = 0x00 || ser256(kpar) || ser32(index)
    data[0] = 0x00
    this.keyPair.d.toBuffer(32).copy(data, 1)
    data.writeUInt32BE(index, 33)

  // Normal child
  } else {
    // data = serP(point(kpar)) || ser32(index)
    //      = serP(Kpar) || ser32(index)
    this.keyPair.getPublicKeyBuffer().copy(data, 0)
    data.writeUInt32BE(index, 33)
  }

  var I = createHmac('sha512', this.chainCode).update(data).digest()
  var IL = I.slice(0, 32)
  var IR = I.slice(32)

  var pIL = BigInteger.fromBuffer(IL)

  // In case parse256(IL) >= n, proceed with the next value for i
  if (pIL.compareTo(curve.n) >= 0) {
    return this.derive(index + 1)
  }

  // Private parent key -> private child key
  var derivedKeyPair
  if (!this.isNeutered()) {
    // ki = parse256(IL) + kpar (mod n)
    var ki = pIL.add(this.keyPair.d).mod(curve.n)

    // In case ki == 0, proceed with the next value for i
    if (ki.signum() === 0) {
      return this.derive(index + 1)
    }

    derivedKeyPair = new ECPair(ki, null, {
      network: this.keyPair.network
    })

  // Public parent key -> public child key
  } else {
    // Ki = point(parse256(IL)) + Kpar
    //    = G*IL + Kpar
    var Ki = curve.G.multiply(pIL).add(this.keyPair.Q)

    // In case Ki is the point at infinity, proceed with the next value for i
    if (curve.isInfinity(Ki)) {
      return this.derive(index + 1)
    }

    derivedKeyPair = new ECPair(null, Ki, {
      network: this.keyPair.network
    })
  }

  var hd = new HDNode(derivedKeyPair, IR)
  hd.depth = this.depth + 1
  hd.index = index
  hd.parentFingerprint = this.getFingerprint().readUInt32BE(0)

  return hd
}

HDNode.prototype.deriveHardened = function (index) {
  typeforce(types.UInt31, index)

  // Only derives hardened private keys by default
  return this.derive(index + HDNode.HIGHEST_BIT)
}

// Private === not neutered
// Public === neutered
HDNode.prototype.isNeutered = function () {
  return !(this.keyPair.d)
}

HDNode.prototype.derivePath = function (path) {
  typeforce(types.BIP32Path, path)

  var splitPath = path.split('/')
  if (splitPath[0] === 'm') {
    if (this.parentFingerprint) {
      throw new Error('Not a master node')
    }

    splitPath = splitPath.slice(1)
  }

  return splitPath.reduce(function (prevHd, indexStr) {
    var index
    if (indexStr.slice(-1) === "'") {
      index = parseInt(indexStr.slice(0, -1), 10)
      return prevHd.deriveHardened(index)
    } else {
      index = parseInt(indexStr, 10)
      return prevHd.derive(index)
    }
  }, this)
}

module.exports = HDNode


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/index.js":
/*!*************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var script = __webpack_require__(/*! ./script */ "./node_modules/bitcoinjs-lib/src/script.js")

var templates = __webpack_require__(/*! ./templates */ "./node_modules/bitcoinjs-lib/src/templates/index.js")
for (var key in templates) {
  script[key] = templates[key]
}

module.exports = {
  bufferutils: __webpack_require__(/*! ./bufferutils */ "./node_modules/bitcoinjs-lib/src/bufferutils.js"), // TODO: remove in 4.0.0

  Block: __webpack_require__(/*! ./block */ "./node_modules/bitcoinjs-lib/src/block.js"),
  ECPair: __webpack_require__(/*! ./ecpair */ "./node_modules/bitcoinjs-lib/src/ecpair.js"),
  ECSignature: __webpack_require__(/*! ./ecsignature */ "./node_modules/bitcoinjs-lib/src/ecsignature.js"),
  HDNode: __webpack_require__(/*! ./hdnode */ "./node_modules/bitcoinjs-lib/src/hdnode.js"),
  Transaction: __webpack_require__(/*! ./transaction */ "./node_modules/bitcoinjs-lib/src/transaction.js"),
  TransactionBuilder: __webpack_require__(/*! ./transaction_builder */ "./node_modules/bitcoinjs-lib/src/transaction_builder.js"),

  address: __webpack_require__(/*! ./address */ "./node_modules/bitcoinjs-lib/src/address.js"),
  crypto: __webpack_require__(/*! ./crypto */ "./node_modules/bitcoinjs-lib/src/crypto.js"),
  networks: __webpack_require__(/*! ./networks */ "./node_modules/bitcoinjs-lib/src/networks.js"),
  opcodes: __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json"),
  script: script
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/networks.js":
/*!****************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/networks.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731

module.exports = {
  bitcoin: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  testnet: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  litecoin: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
  }
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/script.js":
/*!**************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/script.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
var bip66 = __webpack_require__(/*! bip66 */ "./node_modules/bip66/index.js")
var pushdata = __webpack_require__(/*! pushdata-bitcoin */ "./node_modules/pushdata-bitcoin/index.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var types = __webpack_require__(/*! ./types */ "./node_modules/bitcoinjs-lib/src/types.js")
var scriptNumber = __webpack_require__(/*! ./script_number */ "./node_modules/bitcoinjs-lib/src/script_number.js")

var OPS = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")
var REVERSE_OPS = __webpack_require__(/*! bitcoin-ops/map */ "./node_modules/bitcoin-ops/map.js")
var OP_INT_BASE = OPS.OP_RESERVED // OP_1 - 1

function isOPInt (value) {
  return types.Number(value) &&
    ((value === OPS.OP_0) ||
    (value >= OPS.OP_1 && value <= OPS.OP_16) ||
    (value === OPS.OP_1NEGATE))
}

function isPushOnlyChunk (value) {
  return types.Buffer(value) || isOPInt(value)
}

function isPushOnly (value) {
  return types.Array(value) && value.every(isPushOnlyChunk)
}

function asMinimalOP (buffer) {
  if (buffer.length === 0) return OPS.OP_0
  if (buffer.length !== 1) return
  if (buffer[0] >= 1 && buffer[0] <= 16) return OP_INT_BASE + buffer[0]
  if (buffer[0] === 0x81) return OPS.OP_1NEGATE
}

function compile (chunks) {
  // TODO: remove me
  if (Buffer.isBuffer(chunks)) return chunks

  typeforce(types.Array, chunks)

  var bufferSize = chunks.reduce(function (accum, chunk) {
    // data chunk
    if (Buffer.isBuffer(chunk)) {
      // adhere to BIP62.3, minimal push policy
      if (chunk.length === 1 && asMinimalOP(chunk) !== undefined) {
        return accum + 1
      }

      return accum + pushdata.encodingLength(chunk.length) + chunk.length
    }

    // opcode
    return accum + 1
  }, 0.0)

  var buffer = Buffer.allocUnsafe(bufferSize)
  var offset = 0

  chunks.forEach(function (chunk) {
    // data chunk
    if (Buffer.isBuffer(chunk)) {
      // adhere to BIP62.3, minimal push policy
      var opcode = asMinimalOP(chunk)
      if (opcode !== undefined) {
        buffer.writeUInt8(opcode, offset)
        offset += 1
        return
      }

      offset += pushdata.encode(buffer, chunk.length, offset)
      chunk.copy(buffer, offset)
      offset += chunk.length

    // opcode
    } else {
      buffer.writeUInt8(chunk, offset)
      offset += 1
    }
  })

  if (offset !== buffer.length) throw new Error('Could not decode chunks')
  return buffer
}

function decompile (buffer) {
  // TODO: remove me
  if (types.Array(buffer)) return buffer

  typeforce(types.Buffer, buffer)

  var chunks = []
  var i = 0

  while (i < buffer.length) {
    var opcode = buffer[i]

    // data chunk
    if ((opcode > OPS.OP_0) && (opcode <= OPS.OP_PUSHDATA4)) {
      var d = pushdata.decode(buffer, i)

      // did reading a pushDataInt fail? empty script
      if (d === null) return []
      i += d.size

      // attempt to read too much data? empty script
      if (i + d.number > buffer.length) return []

      var data = buffer.slice(i, i + d.number)
      i += d.number

      // decompile minimally
      var op = asMinimalOP(data)
      if (op !== undefined) {
        chunks.push(op)
      } else {
        chunks.push(data)
      }

    // opcode
    } else {
      chunks.push(opcode)

      i += 1
    }
  }

  return chunks
}

function toASM (chunks) {
  if (Buffer.isBuffer(chunks)) {
    chunks = decompile(chunks)
  }

  return chunks.map(function (chunk) {
    // data?
    if (Buffer.isBuffer(chunk)) {
      var op = asMinimalOP(chunk)
      if (op === undefined) return chunk.toString('hex')
      chunk = op
    }

    // opcode!
    return REVERSE_OPS[chunk]
  }).join(' ')
}

function fromASM (asm) {
  typeforce(types.String, asm)

  return compile(asm.split(' ').map(function (chunkStr) {
    // opcode?
    if (OPS[chunkStr] !== undefined) return OPS[chunkStr]
    typeforce(types.Hex, chunkStr)

    // data!
    return Buffer.from(chunkStr, 'hex')
  }))
}

function toStack (chunks) {
  chunks = decompile(chunks)
  typeforce(isPushOnly, chunks)

  return chunks.map(function (op) {
    if (Buffer.isBuffer(op)) return op
    if (op === OPS.OP_0) return Buffer.allocUnsafe(0)

    return scriptNumber.encode(op - OP_INT_BASE)
  })
}

function isCanonicalPubKey (buffer) {
  if (!Buffer.isBuffer(buffer)) return false
  if (buffer.length < 33) return false

  switch (buffer[0]) {
    case 0x02:
    case 0x03:
      return buffer.length === 33
    case 0x04:
      return buffer.length === 65
  }

  return false
}

function isDefinedHashType (hashType) {
  var hashTypeMod = hashType & ~0x80

// return hashTypeMod > SIGHASH_ALL && hashTypeMod < SIGHASH_SINGLE
  return hashTypeMod > 0x00 && hashTypeMod < 0x04
}

function isCanonicalSignature (buffer) {
  if (!Buffer.isBuffer(buffer)) return false
  if (!isDefinedHashType(buffer[buffer.length - 1])) return false

  return bip66.check(buffer.slice(0, -1))
}

module.exports = {
  compile: compile,
  decompile: decompile,
  fromASM: fromASM,
  toASM: toASM,
  toStack: toStack,

  number: __webpack_require__(/*! ./script_number */ "./node_modules/bitcoinjs-lib/src/script_number.js"),

  isCanonicalPubKey: isCanonicalPubKey,
  isCanonicalSignature: isCanonicalSignature,
  isPushOnly: isPushOnly,
  isDefinedHashType: isDefinedHashType
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/script_number.js":
/*!*********************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/script_number.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer

function decode (buffer, maxLength, minimal) {
  maxLength = maxLength || 4
  minimal = minimal === undefined ? true : minimal

  var length = buffer.length
  if (length === 0) return 0
  if (length > maxLength) throw new TypeError('Script number overflow')
  if (minimal) {
    if ((buffer[length - 1] & 0x7f) === 0) {
      if (length <= 1 || (buffer[length - 2] & 0x80) === 0) throw new Error('Non-minimally encoded script number')
    }
  }

  // 40-bit
  if (length === 5) {
    var a = buffer.readUInt32LE(0)
    var b = buffer.readUInt8(4)

    if (b & 0x80) return -(((b & ~0x80) * 0x100000000) + a)
    return (b * 0x100000000) + a
  }

  var result = 0

  // 32-bit / 24-bit / 16-bit / 8-bit
  for (var i = 0; i < length; ++i) {
    result |= buffer[i] << (8 * i)
  }

  if (buffer[length - 1] & 0x80) return -(result & ~(0x80 << (8 * (length - 1))))
  return result
}

function scriptNumSize (i) {
  return i > 0x7fffffff ? 5
  : i > 0x7fffff ? 4
  : i > 0x7fff ? 3
  : i > 0x7f ? 2
  : i > 0x00 ? 1
  : 0
}

function encode (number) {
  var value = Math.abs(number)
  var size = scriptNumSize(value)
  var buffer = Buffer.allocUnsafe(size)
  var negative = number < 0

  for (var i = 0; i < size; ++i) {
    buffer.writeUInt8(value & 0xff, i)
    value >>= 8
  }

  if (buffer[size - 1] & 0x80) {
    buffer.writeUInt8(negative ? 0x80 : 0x00, size - 1)
  } else if (negative) {
    buffer[size - 1] |= 0x80
  }

  return buffer
}

module.exports = {
  decode: decode,
  encode: encode
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/index.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var decompile = __webpack_require__(/*! ../script */ "./node_modules/bitcoinjs-lib/src/script.js").decompile
var multisig = __webpack_require__(/*! ./multisig */ "./node_modules/bitcoinjs-lib/src/templates/multisig/index.js")
var nullData = __webpack_require__(/*! ./nulldata */ "./node_modules/bitcoinjs-lib/src/templates/nulldata.js")
var pubKey = __webpack_require__(/*! ./pubkey */ "./node_modules/bitcoinjs-lib/src/templates/pubkey/index.js")
var pubKeyHash = __webpack_require__(/*! ./pubkeyhash */ "./node_modules/bitcoinjs-lib/src/templates/pubkeyhash/index.js")
var scriptHash = __webpack_require__(/*! ./scripthash */ "./node_modules/bitcoinjs-lib/src/templates/scripthash/index.js")
var witnessPubKeyHash = __webpack_require__(/*! ./witnesspubkeyhash */ "./node_modules/bitcoinjs-lib/src/templates/witnesspubkeyhash/index.js")
var witnessScriptHash = __webpack_require__(/*! ./witnessscripthash */ "./node_modules/bitcoinjs-lib/src/templates/witnessscripthash/index.js")
var witnessCommitment = __webpack_require__(/*! ./witnesscommitment */ "./node_modules/bitcoinjs-lib/src/templates/witnesscommitment/index.js")

var types = {
  MULTISIG: 'multisig',
  NONSTANDARD: 'nonstandard',
  NULLDATA: 'nulldata',
  P2PK: 'pubkey',
  P2PKH: 'pubkeyhash',
  P2SH: 'scripthash',
  P2WPKH: 'witnesspubkeyhash',
  P2WSH: 'witnessscripthash',
  WITNESS_COMMITMENT: 'witnesscommitment'
}

function classifyOutput (script) {
  if (witnessPubKeyHash.output.check(script)) return types.P2WPKH
  if (witnessScriptHash.output.check(script)) return types.P2WSH
  if (pubKeyHash.output.check(script)) return types.P2PKH
  if (scriptHash.output.check(script)) return types.P2SH

  // XXX: optimization, below functions .decompile before use
  var chunks = decompile(script)
  if (multisig.output.check(chunks)) return types.MULTISIG
  if (pubKey.output.check(chunks)) return types.P2PK
  if (witnessCommitment.output.check(chunks)) return types.WITNESS_COMMITMENT
  if (nullData.output.check(chunks)) return types.NULLDATA

  return types.NONSTANDARD
}

function classifyInput (script, allowIncomplete) {
  // XXX: optimization, below functions .decompile before use
  var chunks = decompile(script)

  if (pubKeyHash.input.check(chunks)) return types.P2PKH
  if (scriptHash.input.check(chunks, allowIncomplete)) return types.P2SH
  if (multisig.input.check(chunks, allowIncomplete)) return types.MULTISIG
  if (pubKey.input.check(chunks)) return types.P2PK

  return types.NONSTANDARD
}

function classifyWitness (script, allowIncomplete) {
  // XXX: optimization, below functions .decompile before use
  var chunks = decompile(script)

  if (witnessPubKeyHash.input.check(chunks)) return types.P2WPKH
  if (witnessScriptHash.input.check(chunks, allowIncomplete)) return types.P2WSH

  return types.NONSTANDARD
}

module.exports = {
  classifyInput: classifyInput,
  classifyOutput: classifyOutput,
  classifyWitness: classifyWitness,
  multisig: multisig,
  nullData: nullData,
  pubKey: pubKey,
  pubKeyHash: pubKeyHash,
  scriptHash: scriptHash,
  witnessPubKeyHash: witnessPubKeyHash,
  witnessScriptHash: witnessScriptHash,
  witnessCommitment: witnessCommitment,
  types: types
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/multisig/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/multisig/index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  input: __webpack_require__(/*! ./input */ "./node_modules/bitcoinjs-lib/src/templates/multisig/input.js"),
  output: __webpack_require__(/*! ./output */ "./node_modules/bitcoinjs-lib/src/templates/multisig/output.js")
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/multisig/input.js":
/*!********************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/multisig/input.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// OP_0 [signatures ...]

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var p2mso = __webpack_require__(/*! ./output */ "./node_modules/bitcoinjs-lib/src/templates/multisig/output.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var OPS = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")

function partialSignature (value) {
  return value === OPS.OP_0 || bscript.isCanonicalSignature(value)
}

function check (script, allowIncomplete) {
  var chunks = bscript.decompile(script)
  if (chunks.length < 2) return false
  if (chunks[0] !== OPS.OP_0) return false

  if (allowIncomplete) {
    return chunks.slice(1).every(partialSignature)
  }

  return chunks.slice(1).every(bscript.isCanonicalSignature)
}
check.toJSON = function () { return 'multisig input' }

var EMPTY_BUFFER = Buffer.allocUnsafe(0)

function encodeStack (signatures, scriptPubKey) {
  typeforce([partialSignature], signatures)

  if (scriptPubKey) {
    var scriptData = p2mso.decode(scriptPubKey)

    if (signatures.length < scriptData.m) {
      throw new TypeError('Not enough signatures provided')
    }

    if (signatures.length > scriptData.pubKeys.length) {
      throw new TypeError('Too many signatures provided')
    }
  }

  return [].concat(EMPTY_BUFFER, signatures.map(function (sig) {
    if (sig === OPS.OP_0) {
      return EMPTY_BUFFER
    }
    return sig
  }))
}

function encode (signatures, scriptPubKey) {
  return bscript.compile(encodeStack(signatures, scriptPubKey))
}

function decodeStack (stack, allowIncomplete) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack, allowIncomplete)
  return stack.slice(1)
}

function decode (buffer, allowIncomplete) {
  var stack = bscript.decompile(buffer)
  return decodeStack(stack, allowIncomplete)
}

module.exports = {
  check: check,
  decode: decode,
  decodeStack: decodeStack,
  encode: encode,
  encodeStack: encodeStack
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/multisig/output.js":
/*!*********************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/multisig/output.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// m [pubKeys ...] n OP_CHECKMULTISIG

var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var types = __webpack_require__(/*! ../../types */ "./node_modules/bitcoinjs-lib/src/types.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var OPS = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")
var OP_INT_BASE = OPS.OP_RESERVED // OP_1 - 1

function check (script, allowIncomplete) {
  var chunks = bscript.decompile(script)

  if (chunks.length < 4) return false
  if (chunks[chunks.length - 1] !== OPS.OP_CHECKMULTISIG) return false
  if (!types.Number(chunks[0])) return false
  if (!types.Number(chunks[chunks.length - 2])) return false
  var m = chunks[0] - OP_INT_BASE
  var n = chunks[chunks.length - 2] - OP_INT_BASE

  if (m <= 0) return false
  if (n > 16) return false
  if (m > n) return false
  if (n !== chunks.length - 3) return false
  if (allowIncomplete) return true

  var keys = chunks.slice(1, -2)
  return keys.every(bscript.isCanonicalPubKey)
}
check.toJSON = function () { return 'multi-sig output' }

function encode (m, pubKeys) {
  typeforce({
    m: types.Number,
    pubKeys: [bscript.isCanonicalPubKey]
  }, {
    m: m,
    pubKeys: pubKeys
  })

  var n = pubKeys.length
  if (n < m) throw new TypeError('Not enough pubKeys provided')

  return bscript.compile([].concat(
    OP_INT_BASE + m,
    pubKeys,
    OP_INT_BASE + n,
    OPS.OP_CHECKMULTISIG
  ))
}

function decode (buffer, allowIncomplete) {
  var chunks = bscript.decompile(buffer)
  typeforce(check, chunks, allowIncomplete)

  return {
    m: chunks[0] - OP_INT_BASE,
    pubKeys: chunks.slice(1, -2)
  }
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/nulldata.js":
/*!**************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/nulldata.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// OP_RETURN {data}

var bscript = __webpack_require__(/*! ../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var types = __webpack_require__(/*! ../types */ "./node_modules/bitcoinjs-lib/src/types.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var OPS = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length > 1 &&
    buffer[0] === OPS.OP_RETURN
}
check.toJSON = function () { return 'null data output' }

function encode (data) {
  typeforce(types.Buffer, data)

  return bscript.compile([OPS.OP_RETURN, data])
}

function decode (buffer) {
  typeforce(check, buffer)

  return buffer.slice(2)
}

module.exports = {
  output: {
    check: check,
    decode: decode,
    encode: encode
  }
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/pubkey/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/pubkey/index.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  input: __webpack_require__(/*! ./input */ "./node_modules/bitcoinjs-lib/src/templates/pubkey/input.js"),
  output: __webpack_require__(/*! ./output */ "./node_modules/bitcoinjs-lib/src/templates/pubkey/output.js")
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/pubkey/input.js":
/*!******************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/pubkey/input.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// {signature}

var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")

function check (script) {
  var chunks = bscript.decompile(script)

  return chunks.length === 1 &&
    bscript.isCanonicalSignature(chunks[0])
}
check.toJSON = function () { return 'pubKey input' }

function encodeStack (signature) {
  typeforce(bscript.isCanonicalSignature, signature)
  return [signature]
}

function encode (signature) {
  return bscript.compile(encodeStack(signature))
}

function decodeStack (stack) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack)
  return stack[0]
}

function decode (buffer) {
  var stack = bscript.decompile(buffer)
  return decodeStack(stack)
}

module.exports = {
  check: check,
  decode: decode,
  decodeStack: decodeStack,
  encode: encode,
  encodeStack: encodeStack
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/pubkey/output.js":
/*!*******************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/pubkey/output.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// {pubKey} OP_CHECKSIG

var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var OPS = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")

function check (script) {
  var chunks = bscript.decompile(script)

  return chunks.length === 2 &&
    bscript.isCanonicalPubKey(chunks[0]) &&
    chunks[1] === OPS.OP_CHECKSIG
}
check.toJSON = function () { return 'pubKey output' }

function encode (pubKey) {
  typeforce(bscript.isCanonicalPubKey, pubKey)

  return bscript.compile([pubKey, OPS.OP_CHECKSIG])
}

function decode (buffer) {
  var chunks = bscript.decompile(buffer)
  typeforce(check, chunks)

  return chunks[0]
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/pubkeyhash/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/pubkeyhash/index.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  input: __webpack_require__(/*! ./input */ "./node_modules/bitcoinjs-lib/src/templates/pubkeyhash/input.js"),
  output: __webpack_require__(/*! ./output */ "./node_modules/bitcoinjs-lib/src/templates/pubkeyhash/output.js")
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/pubkeyhash/input.js":
/*!**********************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/pubkeyhash/input.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// {signature} {pubKey}

var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")

function check (script) {
  var chunks = bscript.decompile(script)

  return chunks.length === 2 &&
    bscript.isCanonicalSignature(chunks[0]) &&
    bscript.isCanonicalPubKey(chunks[1])
}
check.toJSON = function () { return 'pubKeyHash input' }

function encodeStack (signature, pubKey) {
  typeforce({
    signature: bscript.isCanonicalSignature,
    pubKey: bscript.isCanonicalPubKey
  }, {
    signature: signature,
    pubKey: pubKey
  })

  return [signature, pubKey]
}

function encode (signature, pubKey) {
  return bscript.compile(encodeStack(signature, pubKey))
}

function decodeStack (stack) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack)

  return {
    signature: stack[0],
    pubKey: stack[1]
  }
}

function decode (buffer) {
  var stack = bscript.decompile(buffer)
  return decodeStack(stack)
}

module.exports = {
  check: check,
  decode: decode,
  decodeStack: decodeStack,
  encode: encode,
  encodeStack: encodeStack
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/pubkeyhash/output.js":
/*!***********************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/pubkeyhash/output.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// OP_DUP OP_HASH160 {pubKeyHash} OP_EQUALVERIFY OP_CHECKSIG

var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var types = __webpack_require__(/*! ../../types */ "./node_modules/bitcoinjs-lib/src/types.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var OPS = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length === 25 &&
    buffer[0] === OPS.OP_DUP &&
    buffer[1] === OPS.OP_HASH160 &&
    buffer[2] === 0x14 &&
    buffer[23] === OPS.OP_EQUALVERIFY &&
    buffer[24] === OPS.OP_CHECKSIG
}
check.toJSON = function () { return 'pubKeyHash output' }

function encode (pubKeyHash) {
  typeforce(types.Hash160bit, pubKeyHash)

  return bscript.compile([
    OPS.OP_DUP,
    OPS.OP_HASH160,
    pubKeyHash,
    OPS.OP_EQUALVERIFY,
    OPS.OP_CHECKSIG
  ])
}

function decode (buffer) {
  typeforce(check, buffer)

  return buffer.slice(3, 23)
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/scripthash/index.js":
/*!**********************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/scripthash/index.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  input: __webpack_require__(/*! ./input */ "./node_modules/bitcoinjs-lib/src/templates/scripthash/input.js"),
  output: __webpack_require__(/*! ./output */ "./node_modules/bitcoinjs-lib/src/templates/scripthash/output.js")
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/scripthash/input.js":
/*!**********************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/scripthash/input.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// <scriptSig> {serialized scriptPubKey script}

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")

var p2ms = __webpack_require__(/*! ../multisig/ */ "./node_modules/bitcoinjs-lib/src/templates/multisig/index.js")
var p2pk = __webpack_require__(/*! ../pubkey/ */ "./node_modules/bitcoinjs-lib/src/templates/pubkey/index.js")
var p2pkh = __webpack_require__(/*! ../pubkeyhash/ */ "./node_modules/bitcoinjs-lib/src/templates/pubkeyhash/index.js")
var p2wpkho = __webpack_require__(/*! ../witnesspubkeyhash/output */ "./node_modules/bitcoinjs-lib/src/templates/witnesspubkeyhash/output.js")
var p2wsho = __webpack_require__(/*! ../witnessscripthash/output */ "./node_modules/bitcoinjs-lib/src/templates/witnessscripthash/output.js")

function check (script, allowIncomplete) {
  var chunks = bscript.decompile(script)
  if (chunks.length < 1) return false

  var lastChunk = chunks[chunks.length - 1]
  if (!Buffer.isBuffer(lastChunk)) return false

  var scriptSigChunks = bscript.decompile(bscript.compile(chunks.slice(0, -1)))
  var redeemScriptChunks = bscript.decompile(lastChunk)

  // is redeemScript a valid script?
  if (redeemScriptChunks.length === 0) return false

  // is redeemScriptSig push only?
  if (!bscript.isPushOnly(scriptSigChunks)) return false

  // is witness?
  if (chunks.length === 1) {
    return p2wsho.check(redeemScriptChunks) ||
      p2wpkho.check(redeemScriptChunks)
  }

  // match types
  if (p2pkh.input.check(scriptSigChunks) &&
    p2pkh.output.check(redeemScriptChunks)) return true

  if (p2ms.input.check(scriptSigChunks, allowIncomplete) &&
    p2ms.output.check(redeemScriptChunks)) return true

  if (p2pk.input.check(scriptSigChunks) &&
    p2pk.output.check(redeemScriptChunks)) return true

  return false
}
check.toJSON = function () { return 'scriptHash input' }

function encodeStack (redeemScriptStack, redeemScript) {
  var serializedScriptPubKey = bscript.compile(redeemScript)

  return [].concat(redeemScriptStack, serializedScriptPubKey)
}

function encode (redeemScriptSig, redeemScript) {
  var redeemScriptStack = bscript.decompile(redeemScriptSig)

  return bscript.compile(encodeStack(redeemScriptStack, redeemScript))
}

function decodeStack (stack) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack)

  return {
    redeemScriptStack: stack.slice(0, -1),
    redeemScript: stack[stack.length - 1]
  }
}

function decode (buffer) {
  var stack = bscript.decompile(buffer)
  var result = decodeStack(stack)
  result.redeemScriptSig = bscript.compile(result.redeemScriptStack)
  delete result.redeemScriptStack
  return result
}

module.exports = {
  check: check,
  decode: decode,
  decodeStack: decodeStack,
  encode: encode,
  encodeStack: encodeStack
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/scripthash/output.js":
/*!***********************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/scripthash/output.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// OP_HASH160 {scriptHash} OP_EQUAL

var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var types = __webpack_require__(/*! ../../types */ "./node_modules/bitcoinjs-lib/src/types.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var OPS = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length === 23 &&
    buffer[0] === OPS.OP_HASH160 &&
    buffer[1] === 0x14 &&
    buffer[22] === OPS.OP_EQUAL
}
check.toJSON = function () { return 'scriptHash output' }

function encode (scriptHash) {
  typeforce(types.Hash160bit, scriptHash)

  return bscript.compile([OPS.OP_HASH160, scriptHash, OPS.OP_EQUAL])
}

function decode (buffer) {
  typeforce(check, buffer)

  return buffer.slice(2, 22)
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/witnesscommitment/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/witnesscommitment/index.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  output: __webpack_require__(/*! ./output */ "./node_modules/bitcoinjs-lib/src/templates/witnesscommitment/output.js")
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/witnesscommitment/output.js":
/*!******************************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/witnesscommitment/output.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// OP_RETURN {aa21a9ed} {commitment}

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var types = __webpack_require__(/*! ../../types */ "./node_modules/bitcoinjs-lib/src/types.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var OPS = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")

var HEADER = Buffer.from('aa21a9ed', 'hex')

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length > 37 &&
    buffer[0] === OPS.OP_RETURN &&
    buffer[1] === 0x24 &&
    buffer.slice(2, 6).equals(HEADER)
}

check.toJSON = function () { return 'Witness commitment output' }

function encode (commitment) {
  typeforce(types.Hash256bit, commitment)

  var buffer = Buffer.allocUnsafe(36)
  HEADER.copy(buffer, 0)
  commitment.copy(buffer, 4)

  return bscript.compile([OPS.OP_RETURN, buffer])
}

function decode (buffer) {
  typeforce(check, buffer)

  return bscript.decompile(buffer)[1].slice(4, 36)
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/witnesspubkeyhash/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/witnesspubkeyhash/index.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  input: __webpack_require__(/*! ./input */ "./node_modules/bitcoinjs-lib/src/templates/witnesspubkeyhash/input.js"),
  output: __webpack_require__(/*! ./output */ "./node_modules/bitcoinjs-lib/src/templates/witnesspubkeyhash/output.js")
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/witnesspubkeyhash/input.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/witnesspubkeyhash/input.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// {signature} {pubKey}

var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")

function isCompressedCanonicalPubKey (pubKey) {
  return bscript.isCanonicalPubKey(pubKey) && pubKey.length === 33
}

function check (script) {
  var chunks = bscript.decompile(script)

  return chunks.length === 2 &&
    bscript.isCanonicalSignature(chunks[0]) &&
    isCompressedCanonicalPubKey(chunks[1])
}
check.toJSON = function () { return 'witnessPubKeyHash input' }

function encodeStack (signature, pubKey) {
  typeforce({
    signature: bscript.isCanonicalSignature,
    pubKey: isCompressedCanonicalPubKey
  }, {
    signature: signature,
    pubKey: pubKey
  })

  return [signature, pubKey]
}

function decodeStack (stack) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack)

  return {
    signature: stack[0],
    pubKey: stack[1]
  }
}

module.exports = {
  check: check,
  decodeStack: decodeStack,
  encodeStack: encodeStack
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/witnesspubkeyhash/output.js":
/*!******************************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/witnesspubkeyhash/output.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// OP_0 {pubKeyHash}

var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var types = __webpack_require__(/*! ../../types */ "./node_modules/bitcoinjs-lib/src/types.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var OPS = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length === 22 &&
    buffer[0] === OPS.OP_0 &&
    buffer[1] === 0x14
}
check.toJSON = function () { return 'Witness pubKeyHash output' }

function encode (pubKeyHash) {
  typeforce(types.Hash160bit, pubKeyHash)

  return bscript.compile([OPS.OP_0, pubKeyHash])
}

function decode (buffer) {
  typeforce(check, buffer)

  return buffer.slice(2)
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/witnessscripthash/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/witnessscripthash/index.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  input: __webpack_require__(/*! ./input */ "./node_modules/bitcoinjs-lib/src/templates/witnessscripthash/input.js"),
  output: __webpack_require__(/*! ./output */ "./node_modules/bitcoinjs-lib/src/templates/witnessscripthash/output.js")
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/witnessscripthash/input.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/witnessscripthash/input.js ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// <scriptSig> {serialized scriptPubKey script}

var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var types = __webpack_require__(/*! ../../types */ "./node_modules/bitcoinjs-lib/src/types.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")

var p2ms = __webpack_require__(/*! ../multisig/ */ "./node_modules/bitcoinjs-lib/src/templates/multisig/index.js")
var p2pk = __webpack_require__(/*! ../pubkey/ */ "./node_modules/bitcoinjs-lib/src/templates/pubkey/index.js")
var p2pkh = __webpack_require__(/*! ../pubkeyhash/ */ "./node_modules/bitcoinjs-lib/src/templates/pubkeyhash/index.js")

function check (chunks, allowIncomplete) {
  typeforce(types.Array, chunks)
  if (chunks.length < 1) return false

  var witnessScript = chunks[chunks.length - 1]
  if (!Buffer.isBuffer(witnessScript)) return false

  var witnessScriptChunks = bscript.decompile(witnessScript)

  // is witnessScript a valid script?
  if (witnessScriptChunks.length === 0) return false

  var witnessRawScriptSig = bscript.compile(chunks.slice(0, -1))

  // match types
  if (p2pkh.input.check(witnessRawScriptSig) &&
    p2pkh.output.check(witnessScriptChunks)) return true

  if (p2ms.input.check(witnessRawScriptSig, allowIncomplete) &&
    p2ms.output.check(witnessScriptChunks)) return true

  if (p2pk.input.check(witnessRawScriptSig) &&
    p2pk.output.check(witnessScriptChunks)) return true

  return false
}
check.toJSON = function () { return 'witnessScriptHash input' }

function encodeStack (witnessData, witnessScript) {
  typeforce({
    witnessData: [types.Buffer],
    witnessScript: types.Buffer
  }, {
    witnessData: witnessData,
    witnessScript: witnessScript
  })

  return [].concat(witnessData, witnessScript)
}

function decodeStack (stack) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack)
  return {
    witnessData: stack.slice(0, -1),
    witnessScript: stack[stack.length - 1]
  }
}

module.exports = {
  check: check,
  decodeStack: decodeStack,
  encodeStack: encodeStack
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/templates/witnessscripthash/output.js":
/*!******************************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/templates/witnessscripthash/output.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// OP_0 {scriptHash}

var bscript = __webpack_require__(/*! ../../script */ "./node_modules/bitcoinjs-lib/src/script.js")
var types = __webpack_require__(/*! ../../types */ "./node_modules/bitcoinjs-lib/src/types.js")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var OPS = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length === 34 &&
    buffer[0] === OPS.OP_0 &&
    buffer[1] === 0x20
}
check.toJSON = function () { return 'Witness scriptHash output' }

function encode (scriptHash) {
  typeforce(types.Hash256bit, scriptHash)

  return bscript.compile([OPS.OP_0, scriptHash])
}

function decode (buffer) {
  typeforce(check, buffer)

  return buffer.slice(2)
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/transaction.js":
/*!*******************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/transaction.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
var bcrypto = __webpack_require__(/*! ./crypto */ "./node_modules/bitcoinjs-lib/src/crypto.js")
var bscript = __webpack_require__(/*! ./script */ "./node_modules/bitcoinjs-lib/src/script.js")
var bufferutils = __webpack_require__(/*! ./bufferutils */ "./node_modules/bitcoinjs-lib/src/bufferutils.js")
var opcodes = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var types = __webpack_require__(/*! ./types */ "./node_modules/bitcoinjs-lib/src/types.js")
var varuint = __webpack_require__(/*! varuint-bitcoin */ "./node_modules/varuint-bitcoin/index.js")

function varSliceSize (someScript) {
  var length = someScript.length

  return varuint.encodingLength(length) + length
}

function vectorSize (someVector) {
  var length = someVector.length

  return varuint.encodingLength(length) + someVector.reduce(function (sum, witness) {
    return sum + varSliceSize(witness)
  }, 0)
}

function Transaction () {
  this.version = 1
  this.locktime = 0
  this.ins = []
  this.outs = []
}

Transaction.DEFAULT_SEQUENCE = 0xffffffff
Transaction.SIGHASH_ALL = 0x01
Transaction.SIGHASH_NONE = 0x02
Transaction.SIGHASH_SINGLE = 0x03
Transaction.SIGHASH_ANYONECANPAY = 0x80
Transaction.ADVANCED_TRANSACTION_MARKER = 0x00
Transaction.ADVANCED_TRANSACTION_FLAG = 0x01

var EMPTY_SCRIPT = Buffer.allocUnsafe(0)
var EMPTY_WITNESS = []
var ZERO = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex')
var ONE = Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex')
var VALUE_UINT64_MAX = Buffer.from('ffffffffffffffff', 'hex')
var BLANK_OUTPUT = {
  script: EMPTY_SCRIPT,
  valueBuffer: VALUE_UINT64_MAX
}

Transaction.fromBuffer = function (buffer, __noStrict) {
  var offset = 0
  function readSlice (n) {
    offset += n
    return buffer.slice(offset - n, offset)
  }

  function readUInt32 () {
    var i = buffer.readUInt32LE(offset)
    offset += 4
    return i
  }

  function readInt32 () {
    var i = buffer.readInt32LE(offset)
    offset += 4
    return i
  }

  function readUInt64 () {
    var i = bufferutils.readUInt64LE(buffer, offset)
    offset += 8
    return i
  }

  function readVarInt () {
    var vi = varuint.decode(buffer, offset)
    offset += varuint.decode.bytes
    return vi
  }

  function readVarSlice () {
    return readSlice(readVarInt())
  }

  function readVector () {
    var count = readVarInt()
    var vector = []
    for (var i = 0; i < count; i++) vector.push(readVarSlice())
    return vector
  }

  var tx = new Transaction()
  tx.version = readInt32()

  var marker = buffer.readUInt8(offset)
  var flag = buffer.readUInt8(offset + 1)

  var hasWitnesses = false
  if (marker === Transaction.ADVANCED_TRANSACTION_MARKER &&
      flag === Transaction.ADVANCED_TRANSACTION_FLAG) {
    offset += 2
    hasWitnesses = true
  }

  var vinLen = readVarInt()
  for (var i = 0; i < vinLen; ++i) {
    tx.ins.push({
      hash: readSlice(32),
      index: readUInt32(),
      script: readVarSlice(),
      sequence: readUInt32(),
      witness: EMPTY_WITNESS
    })
  }

  var voutLen = readVarInt()
  for (i = 0; i < voutLen; ++i) {
    tx.outs.push({
      value: readUInt64(),
      script: readVarSlice()
    })
  }

  if (hasWitnesses) {
    for (i = 0; i < vinLen; ++i) {
      tx.ins[i].witness = readVector()
    }

    // was this pointless?
    if (!tx.hasWitnesses()) throw new Error('Transaction has superfluous witness data')
  }

  tx.locktime = readUInt32()

  if (__noStrict) return tx
  if (offset !== buffer.length) throw new Error('Transaction has unexpected data')

  return tx
}

Transaction.fromHex = function (hex) {
  return Transaction.fromBuffer(Buffer.from(hex, 'hex'))
}

Transaction.isCoinbaseHash = function (buffer) {
  typeforce(types.Hash256bit, buffer)
  for (var i = 0; i < 32; ++i) {
    if (buffer[i] !== 0) return false
  }
  return true
}

Transaction.prototype.isCoinbase = function () {
  return this.ins.length === 1 && Transaction.isCoinbaseHash(this.ins[0].hash)
}

Transaction.prototype.addInput = function (hash, index, sequence, scriptSig) {
  typeforce(types.tuple(
    types.Hash256bit,
    types.UInt32,
    types.maybe(types.UInt32),
    types.maybe(types.Buffer)
  ), arguments)

  if (types.Null(sequence)) {
    sequence = Transaction.DEFAULT_SEQUENCE
  }

  // Add the input and return the input's index
  return (this.ins.push({
    hash: hash,
    index: index,
    script: scriptSig || EMPTY_SCRIPT,
    sequence: sequence,
    witness: EMPTY_WITNESS
  }) - 1)
}

Transaction.prototype.addOutput = function (scriptPubKey, value) {
  typeforce(types.tuple(types.Buffer, types.Satoshi), arguments)

  // Add the output and return the output's index
  return (this.outs.push({
    script: scriptPubKey,
    value: value
  }) - 1)
}

Transaction.prototype.hasWitnesses = function () {
  return this.ins.some(function (x) {
    return x.witness.length !== 0
  })
}

Transaction.prototype.weight = function () {
  var base = this.__byteLength(false)
  var total = this.__byteLength(true)
  return base * 3 + total
}

Transaction.prototype.virtualSize = function () {
  return Math.ceil(this.weight() / 4)
}

Transaction.prototype.byteLength = function () {
  return this.__byteLength(true)
}

Transaction.prototype.__byteLength = function (__allowWitness) {
  var hasWitnesses = __allowWitness && this.hasWitnesses()

  return (
    (hasWitnesses ? 10 : 8) +
    varuint.encodingLength(this.ins.length) +
    varuint.encodingLength(this.outs.length) +
    this.ins.reduce(function (sum, input) { return sum + 40 + varSliceSize(input.script) }, 0) +
    this.outs.reduce(function (sum, output) { return sum + 8 + varSliceSize(output.script) }, 0) +
    (hasWitnesses ? this.ins.reduce(function (sum, input) { return sum + vectorSize(input.witness) }, 0) : 0)
  )
}

Transaction.prototype.clone = function () {
  var newTx = new Transaction()
  newTx.version = this.version
  newTx.locktime = this.locktime

  newTx.ins = this.ins.map(function (txIn) {
    return {
      hash: txIn.hash,
      index: txIn.index,
      script: txIn.script,
      sequence: txIn.sequence,
      witness: txIn.witness
    }
  })

  newTx.outs = this.outs.map(function (txOut) {
    return {
      script: txOut.script,
      value: txOut.value
    }
  })

  return newTx
}

/**
 * Hash transaction for signing a specific input.
 *
 * Bitcoin uses a different hash for each signed transaction input.
 * This method copies the transaction, makes the necessary changes based on the
 * hashType, and then hashes the result.
 * This hash can then be used to sign the provided transaction input.
 */
Transaction.prototype.hashForSignature = function (inIndex, prevOutScript, hashType) {
  typeforce(types.tuple(types.UInt32, types.Buffer, /* types.UInt8 */ types.Number), arguments)

  // https://github.com/bitcoin/bitcoin/blob/master/src/test/sighash_tests.cpp#L29
  if (inIndex >= this.ins.length) return ONE

  // ignore OP_CODESEPARATOR
  var ourScript = bscript.compile(bscript.decompile(prevOutScript).filter(function (x) {
    return x !== opcodes.OP_CODESEPARATOR
  }))

  var txTmp = this.clone()

  // SIGHASH_NONE: ignore all outputs? (wildcard payee)
  if ((hashType & 0x1f) === Transaction.SIGHASH_NONE) {
    txTmp.outs = []

    // ignore sequence numbers (except at inIndex)
    txTmp.ins.forEach(function (input, i) {
      if (i === inIndex) return

      input.sequence = 0
    })

  // SIGHASH_SINGLE: ignore all outputs, except at the same index?
  } else if ((hashType & 0x1f) === Transaction.SIGHASH_SINGLE) {
    // https://github.com/bitcoin/bitcoin/blob/master/src/test/sighash_tests.cpp#L60
    if (inIndex >= this.outs.length) return ONE

    // truncate outputs after
    txTmp.outs.length = inIndex + 1

    // "blank" outputs before
    for (var i = 0; i < inIndex; i++) {
      txTmp.outs[i] = BLANK_OUTPUT
    }

    // ignore sequence numbers (except at inIndex)
    txTmp.ins.forEach(function (input, y) {
      if (y === inIndex) return

      input.sequence = 0
    })
  }

  // SIGHASH_ANYONECANPAY: ignore inputs entirely?
  if (hashType & Transaction.SIGHASH_ANYONECANPAY) {
    txTmp.ins = [txTmp.ins[inIndex]]
    txTmp.ins[0].script = ourScript

  // SIGHASH_ALL: only ignore input scripts
  } else {
    // "blank" others input scripts
    txTmp.ins.forEach(function (input) { input.script = EMPTY_SCRIPT })
    txTmp.ins[inIndex].script = ourScript
  }

  // serialize and hash
  var buffer = Buffer.allocUnsafe(txTmp.__byteLength(false) + 4)
  buffer.writeInt32LE(hashType, buffer.length - 4)
  txTmp.__toBuffer(buffer, 0, false)

  return bcrypto.hash256(buffer)
}

Transaction.prototype.hashForWitnessV0 = function (inIndex, prevOutScript, value, hashType) {
  typeforce(types.tuple(types.UInt32, types.Buffer, types.Satoshi, types.UInt32), arguments)

  var tbuffer, toffset
  function writeSlice (slice) { toffset += slice.copy(tbuffer, toffset) }
  function writeUInt32 (i) { toffset = tbuffer.writeUInt32LE(i, toffset) }
  function writeUInt64 (i) { toffset = bufferutils.writeUInt64LE(tbuffer, i, toffset) }
  function writeVarInt (i) {
    varuint.encode(i, tbuffer, toffset)
    toffset += varuint.encode.bytes
  }
  function writeVarSlice (slice) { writeVarInt(slice.length); writeSlice(slice) }

  var hashOutputs = ZERO
  var hashPrevouts = ZERO
  var hashSequence = ZERO

  if (!(hashType & Transaction.SIGHASH_ANYONECANPAY)) {
    tbuffer = Buffer.allocUnsafe(36 * this.ins.length)
    toffset = 0

    this.ins.forEach(function (txIn) {
      writeSlice(txIn.hash)
      writeUInt32(txIn.index)
    })

    hashPrevouts = bcrypto.hash256(tbuffer)
  }

  if (!(hashType & Transaction.SIGHASH_ANYONECANPAY) &&
       (hashType & 0x1f) !== Transaction.SIGHASH_SINGLE &&
       (hashType & 0x1f) !== Transaction.SIGHASH_NONE) {
    tbuffer = Buffer.allocUnsafe(4 * this.ins.length)
    toffset = 0

    this.ins.forEach(function (txIn) {
      writeUInt32(txIn.sequence)
    })

    hashSequence = bcrypto.hash256(tbuffer)
  }

  if ((hashType & 0x1f) !== Transaction.SIGHASH_SINGLE &&
      (hashType & 0x1f) !== Transaction.SIGHASH_NONE) {
    var txOutsSize = this.outs.reduce(function (sum, output) {
      return sum + 8 + varSliceSize(output.script)
    }, 0)

    tbuffer = Buffer.allocUnsafe(txOutsSize)
    toffset = 0

    this.outs.forEach(function (out) {
      writeUInt64(out.value)
      writeVarSlice(out.script)
    })

    hashOutputs = bcrypto.hash256(tbuffer)
  } else if ((hashType & 0x1f) === Transaction.SIGHASH_SINGLE && inIndex < this.outs.length) {
    var output = this.outs[inIndex]

    tbuffer = Buffer.allocUnsafe(8 + varSliceSize(output.script))
    toffset = 0
    writeUInt64(output.value)
    writeVarSlice(output.script)

    hashOutputs = bcrypto.hash256(tbuffer)
  }

  tbuffer = Buffer.allocUnsafe(156 + varSliceSize(prevOutScript))
  toffset = 0

  var input = this.ins[inIndex]
  writeUInt32(this.version)
  writeSlice(hashPrevouts)
  writeSlice(hashSequence)
  writeSlice(input.hash)
  writeUInt32(input.index)
  writeVarSlice(prevOutScript)
  writeUInt64(value)
  writeUInt32(input.sequence)
  writeSlice(hashOutputs)
  writeUInt32(this.locktime)
  writeUInt32(hashType)
  return bcrypto.hash256(tbuffer)
}

Transaction.prototype.getHash = function () {
  return bcrypto.hash256(this.__toBuffer(undefined, undefined, false))
}

Transaction.prototype.getId = function () {
  // transaction hash's are displayed in reverse order
  return this.getHash().reverse().toString('hex')
}

Transaction.prototype.toBuffer = function (buffer, initialOffset) {
  return this.__toBuffer(buffer, initialOffset, true)
}

Transaction.prototype.__toBuffer = function (buffer, initialOffset, __allowWitness) {
  if (!buffer) buffer = Buffer.allocUnsafe(this.__byteLength(__allowWitness))

  var offset = initialOffset || 0
  function writeSlice (slice) { offset += slice.copy(buffer, offset) }
  function writeUInt8 (i) { offset = buffer.writeUInt8(i, offset) }
  function writeUInt32 (i) { offset = buffer.writeUInt32LE(i, offset) }
  function writeInt32 (i) { offset = buffer.writeInt32LE(i, offset) }
  function writeUInt64 (i) { offset = bufferutils.writeUInt64LE(buffer, i, offset) }
  function writeVarInt (i) {
    varuint.encode(i, buffer, offset)
    offset += varuint.encode.bytes
  }
  function writeVarSlice (slice) { writeVarInt(slice.length); writeSlice(slice) }
  function writeVector (vector) { writeVarInt(vector.length); vector.forEach(writeVarSlice) }

  writeInt32(this.version)

  var hasWitnesses = __allowWitness && this.hasWitnesses()

  if (hasWitnesses) {
    writeUInt8(Transaction.ADVANCED_TRANSACTION_MARKER)
    writeUInt8(Transaction.ADVANCED_TRANSACTION_FLAG)
  }

  writeVarInt(this.ins.length)

  this.ins.forEach(function (txIn) {
    writeSlice(txIn.hash)
    writeUInt32(txIn.index)
    writeVarSlice(txIn.script)
    writeUInt32(txIn.sequence)
  })

  writeVarInt(this.outs.length)
  this.outs.forEach(function (txOut) {
    if (!txOut.valueBuffer) {
      writeUInt64(txOut.value)
    } else {
      writeSlice(txOut.valueBuffer)
    }

    writeVarSlice(txOut.script)
  })

  if (hasWitnesses) {
    this.ins.forEach(function (input) {
      writeVector(input.witness)
    })
  }

  writeUInt32(this.locktime)

  // avoid slicing unless necessary
  if (initialOffset !== undefined) return buffer.slice(initialOffset, offset)
  return buffer
}

Transaction.prototype.toHex = function () {
  return this.toBuffer().toString('hex')
}

Transaction.prototype.setInputScript = function (index, scriptSig) {
  typeforce(types.tuple(types.Number, types.Buffer), arguments)

  this.ins[index].script = scriptSig
}

Transaction.prototype.setWitness = function (index, witness) {
  typeforce(types.tuple(types.Number, [types.Buffer]), arguments)

  this.ins[index].witness = witness
}

module.exports = Transaction


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/transaction_builder.js":
/*!***************************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/transaction_builder.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
var baddress = __webpack_require__(/*! ./address */ "./node_modules/bitcoinjs-lib/src/address.js")
var bcrypto = __webpack_require__(/*! ./crypto */ "./node_modules/bitcoinjs-lib/src/crypto.js")
var bscript = __webpack_require__(/*! ./script */ "./node_modules/bitcoinjs-lib/src/script.js")
var btemplates = __webpack_require__(/*! ./templates */ "./node_modules/bitcoinjs-lib/src/templates/index.js")
var networks = __webpack_require__(/*! ./networks */ "./node_modules/bitcoinjs-lib/src/networks.js")
var ops = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")
var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")
var types = __webpack_require__(/*! ./types */ "./node_modules/bitcoinjs-lib/src/types.js")
var scriptTypes = btemplates.types
var SIGNABLE = [btemplates.types.P2PKH, btemplates.types.P2PK, btemplates.types.MULTISIG]
var P2SH = SIGNABLE.concat([btemplates.types.P2WPKH, btemplates.types.P2WSH])

var ECPair = __webpack_require__(/*! ./ecpair */ "./node_modules/bitcoinjs-lib/src/ecpair.js")
var ECSignature = __webpack_require__(/*! ./ecsignature */ "./node_modules/bitcoinjs-lib/src/ecsignature.js")
var Transaction = __webpack_require__(/*! ./transaction */ "./node_modules/bitcoinjs-lib/src/transaction.js")

function supportedType (type) {
  return SIGNABLE.indexOf(type) !== -1
}

function supportedP2SHType (type) {
  return P2SH.indexOf(type) !== -1
}

function extractChunks (type, chunks, script) {
  var pubKeys = []
  var signatures = []
  switch (type) {
    case scriptTypes.P2PKH:
      // if (redeemScript) throw new Error('Nonstandard... P2SH(P2PKH)')
      pubKeys = chunks.slice(1)
      signatures = chunks.slice(0, 1)
      break

    case scriptTypes.P2PK:
      pubKeys[0] = script ? btemplates.pubKey.output.decode(script) : undefined
      signatures = chunks.slice(0, 1)
      break

    case scriptTypes.MULTISIG:
      if (script) {
        var multisig = btemplates.multisig.output.decode(script)
        pubKeys = multisig.pubKeys
      }

      signatures = chunks.slice(1).map(function (chunk) {
        return chunk.length === 0 ? undefined : chunk
      })
      break
  }

  return {
    pubKeys: pubKeys,
    signatures: signatures
  }
}
function expandInput (scriptSig, witnessStack) {
  if (scriptSig.length === 0 && witnessStack.length === 0) return {}

  var prevOutScript
  var prevOutType
  var scriptType
  var script
  var redeemScript
  var witnessScript
  var witnessScriptType
  var redeemScriptType
  var witness = false
  var p2wsh = false
  var p2sh = false
  var witnessProgram
  var chunks

  var scriptSigChunks = bscript.decompile(scriptSig)
  var sigType = btemplates.classifyInput(scriptSigChunks, true)
  if (sigType === scriptTypes.P2SH) {
    p2sh = true
    redeemScript = scriptSigChunks[scriptSigChunks.length - 1]
    redeemScriptType = btemplates.classifyOutput(redeemScript)
    prevOutScript = btemplates.scriptHash.output.encode(bcrypto.hash160(redeemScript))
    prevOutType = scriptTypes.P2SH
    script = redeemScript
  }

  var classifyWitness = btemplates.classifyWitness(witnessStack, true)
  if (classifyWitness === scriptTypes.P2WSH) {
    witnessScript = witnessStack[witnessStack.length - 1]
    witnessScriptType = btemplates.classifyOutput(witnessScript)
    p2wsh = true
    witness = true
    if (scriptSig.length === 0) {
      prevOutScript = btemplates.witnessScriptHash.output.encode(bcrypto.sha256(witnessScript))
      prevOutType = scriptTypes.P2WSH
      if (redeemScript !== undefined) {
        throw new Error('Redeem script given when unnecessary')
      }
      // bare witness
    } else {
      if (!redeemScript) {
        throw new Error('No redeemScript provided for P2WSH, but scriptSig non-empty')
      }
      witnessProgram = btemplates.witnessScriptHash.output.encode(bcrypto.sha256(witnessScript))
      if (!redeemScript.equals(witnessProgram)) {
        throw new Error('Redeem script didn\'t match witnessScript')
      }
    }

    if (!supportedType(btemplates.classifyOutput(witnessScript))) {
      throw new Error('unsupported witness script')
    }

    script = witnessScript
    scriptType = witnessScriptType
    chunks = witnessStack.slice(0, -1)
  } else if (classifyWitness === scriptTypes.P2WPKH) {
    witness = true
    var key = witnessStack[witnessStack.length - 1]
    var keyHash = bcrypto.hash160(key)
    if (scriptSig.length === 0) {
      prevOutScript = btemplates.witnessPubKeyHash.output.encode(keyHash)
      prevOutType = scriptTypes.P2WPKH
      if (typeof redeemScript !== 'undefined') {
        throw new Error('Redeem script given when unnecessary')
      }
    } else {
      if (!redeemScript) {
        throw new Error('No redeemScript provided for P2WPKH, but scriptSig wasn\'t empty')
      }
      witnessProgram = btemplates.witnessPubKeyHash.output.encode(keyHash)
      if (!redeemScript.equals(witnessProgram)) {
        throw new Error('Redeem script did not have the right witness program')
      }
    }

    scriptType = scriptTypes.P2PKH
    chunks = witnessStack
  } else if (redeemScript) {
    if (!supportedP2SHType(redeemScriptType)) {
      throw new Error('Bad redeemscript!')
    }

    script = redeemScript
    scriptType = redeemScriptType
    chunks = scriptSigChunks.slice(0, -1)
  } else {
    prevOutType = scriptType = btemplates.classifyInput(scriptSig)
    chunks = scriptSigChunks
  }

  var expanded = extractChunks(scriptType, chunks, script)

  var result = {
    pubKeys: expanded.pubKeys,
    signatures: expanded.signatures,
    prevOutScript: prevOutScript,
    prevOutType: prevOutType,
    signType: scriptType,
    signScript: script,
    witness: Boolean(witness)
  }

  if (p2sh) {
    result.redeemScript = redeemScript
    result.redeemScriptType = redeemScriptType
  }

  if (p2wsh) {
    result.witnessScript = witnessScript
    result.witnessScriptType = witnessScriptType
  }

  return result
}

// could be done in expandInput, but requires the original Transaction for hashForSignature
function fixMultisigOrder (input, transaction, vin) {
  if (input.redeemScriptType !== scriptTypes.MULTISIG || !input.redeemScript) return
  if (input.pubKeys.length === input.signatures.length) return

  var unmatched = input.signatures.concat()

  input.signatures = input.pubKeys.map(function (pubKey) {
    var keyPair = ECPair.fromPublicKeyBuffer(pubKey)
    var match

    // check for a signature
    unmatched.some(function (signature, i) {
      // skip if undefined || OP_0
      if (!signature) return false

      // TODO: avoid O(n) hashForSignature
      var parsed = ECSignature.parseScriptSignature(signature)
      var hash = transaction.hashForSignature(vin, input.redeemScript, parsed.hashType)

      // skip if signature does not match pubKey
      if (!keyPair.verify(hash, parsed.signature)) return false

      // remove matched signature from unmatched
      unmatched[i] = undefined
      match = signature

      return true
    })

    return match
  })
}

function expandOutput (script, scriptType, ourPubKey) {
  typeforce(types.Buffer, script)

  var scriptChunks = bscript.decompile(script)
  if (!scriptType) {
    scriptType = btemplates.classifyOutput(script)
  }

  var pubKeys = []

  switch (scriptType) {
    // does our hash160(pubKey) match the output scripts?
    case scriptTypes.P2PKH:
      if (!ourPubKey) break

      var pkh1 = scriptChunks[2]
      var pkh2 = bcrypto.hash160(ourPubKey)
      if (pkh1.equals(pkh2)) pubKeys = [ourPubKey]
      break

    // does our hash160(pubKey) match the output scripts?
    case scriptTypes.P2WPKH:
      if (!ourPubKey) break

      var wpkh1 = scriptChunks[1]
      var wpkh2 = bcrypto.hash160(ourPubKey)
      if (wpkh1.equals(wpkh2)) pubKeys = [ourPubKey]
      break

    case scriptTypes.P2PK:
      pubKeys = scriptChunks.slice(0, 1)
      break

    case scriptTypes.MULTISIG:
      pubKeys = scriptChunks.slice(1, -2)
      break

    default: return { scriptType: scriptType }
  }

  return {
    pubKeys: pubKeys,
    scriptType: scriptType,
    signatures: pubKeys.map(function () { return undefined })
  }
}

function checkP2SHInput (input, redeemScriptHash) {
  if (input.prevOutType) {
    if (input.prevOutType !== scriptTypes.P2SH) throw new Error('PrevOutScript must be P2SH')

    var prevOutScriptScriptHash = bscript.decompile(input.prevOutScript)[1]
    if (!prevOutScriptScriptHash.equals(redeemScriptHash)) throw new Error('Inconsistent hash160(RedeemScript)')
  }
}

function checkP2WSHInput (input, witnessScriptHash) {
  if (input.prevOutType) {
    if (input.prevOutType !== scriptTypes.P2WSH) throw new Error('PrevOutScript must be P2WSH')

    var scriptHash = bscript.decompile(input.prevOutScript)[1]
    if (!scriptHash.equals(witnessScriptHash)) throw new Error('Inconsistent sha25(WitnessScript)')
  }
}

function prepareInput (input, kpPubKey, redeemScript, witnessValue, witnessScript) {
  var expanded
  var prevOutType
  var prevOutScript

  var p2sh = false
  var p2shType
  var redeemScriptHash

  var witness = false
  var p2wsh = false
  var witnessType
  var witnessScriptHash

  var signType
  var signScript

  if (redeemScript && witnessScript) {
    redeemScriptHash = bcrypto.hash160(redeemScript)
    witnessScriptHash = bcrypto.sha256(witnessScript)
    checkP2SHInput(input, redeemScriptHash)

    if (!redeemScript.equals(btemplates.witnessScriptHash.output.encode(witnessScriptHash))) throw new Error('Witness script inconsistent with redeem script')

    expanded = expandOutput(witnessScript, undefined, kpPubKey)
    if (!expanded.pubKeys) throw new Error('WitnessScript not supported "' + bscript.toASM(redeemScript) + '"')

    prevOutType = btemplates.types.P2SH
    prevOutScript = btemplates.scriptHash.output.encode(redeemScriptHash)
    p2sh = witness = p2wsh = true
    p2shType = btemplates.types.P2WSH
    signType = witnessType = expanded.scriptType
    signScript = witnessScript
  } else if (redeemScript) {
    redeemScriptHash = bcrypto.hash160(redeemScript)
    checkP2SHInput(input, redeemScriptHash)

    expanded = expandOutput(redeemScript, undefined, kpPubKey)
    if (!expanded.pubKeys) throw new Error('RedeemScript not supported "' + bscript.toASM(redeemScript) + '"')

    prevOutType = btemplates.types.P2SH
    prevOutScript = btemplates.scriptHash.output.encode(redeemScriptHash)
    p2sh = true
    signType = p2shType = expanded.scriptType
    signScript = redeemScript
    witness = signType === btemplates.types.P2WPKH
  } else if (witnessScript) {
    witnessScriptHash = bcrypto.sha256(witnessScript)
    checkP2WSHInput(input, witnessScriptHash)

    expanded = expandOutput(witnessScript, undefined, kpPubKey)
    if (!expanded.pubKeys) throw new Error('WitnessScript not supported "' + bscript.toASM(redeemScript) + '"')

    prevOutType = btemplates.types.P2WSH
    prevOutScript = btemplates.witnessScriptHash.output.encode(witnessScriptHash)
    witness = p2wsh = true
    signType = witnessType = expanded.scriptType
    signScript = witnessScript
  } else if (input.prevOutType) {
    // embedded scripts are not possible without a redeemScript
    if (input.prevOutType === scriptTypes.P2SH ||
      input.prevOutType === scriptTypes.P2WSH) {
      throw new Error('PrevOutScript is ' + input.prevOutType + ', requires redeemScript')
    }

    prevOutType = input.prevOutType
    prevOutScript = input.prevOutScript
    expanded = expandOutput(input.prevOutScript, input.prevOutType, kpPubKey)
    if (!expanded.pubKeys) return

    witness = (input.prevOutType === scriptTypes.P2WPKH)
    signType = prevOutType
    signScript = prevOutScript
  } else {
    prevOutScript = btemplates.pubKeyHash.output.encode(bcrypto.hash160(kpPubKey))
    expanded = expandOutput(prevOutScript, scriptTypes.P2PKH, kpPubKey)

    prevOutType = scriptTypes.P2PKH
    witness = false
    signType = prevOutType
    signScript = prevOutScript
  }

  if (signType === scriptTypes.P2WPKH) {
    signScript = btemplates.pubKeyHash.output.encode(btemplates.witnessPubKeyHash.output.decode(signScript))
  }

  if (p2sh) {
    input.redeemScript = redeemScript
    input.redeemScriptType = p2shType
  }

  if (p2wsh) {
    input.witnessScript = witnessScript
    input.witnessScriptType = witnessType
  }

  input.pubKeys = expanded.pubKeys
  input.signatures = expanded.signatures
  input.signScript = signScript
  input.signType = signType
  input.prevOutScript = prevOutScript
  input.prevOutType = prevOutType
  input.witness = witness
}

function buildStack (type, signatures, pubKeys, allowIncomplete) {
  if (type === scriptTypes.P2PKH) {
    if (signatures.length === 1 && Buffer.isBuffer(signatures[0]) && pubKeys.length === 1) return btemplates.pubKeyHash.input.encodeStack(signatures[0], pubKeys[0])
  } else if (type === scriptTypes.P2PK) {
    if (signatures.length === 1 && Buffer.isBuffer(signatures[0])) return btemplates.pubKey.input.encodeStack(signatures[0])
  } else if (type === scriptTypes.MULTISIG) {
    if (signatures.length > 0) {
      signatures = signatures.map(function (signature) {
        return signature || ops.OP_0
      })
      if (!allowIncomplete) {
        // remove blank signatures
        signatures = signatures.filter(function (x) { return x !== ops.OP_0 })
      }

      return btemplates.multisig.input.encodeStack(signatures)
    }
  } else {
    throw new Error('Not yet supported')
  }

  if (!allowIncomplete) throw new Error('Not enough signatures provided')
  return []
}

function buildInput (input, allowIncomplete) {
  var scriptType = input.prevOutType
  var sig = []
  var witness = []

  if (supportedType(scriptType)) {
    sig = buildStack(scriptType, input.signatures, input.pubKeys, allowIncomplete)
  }

  var p2sh = false
  if (scriptType === btemplates.types.P2SH) {
    // We can remove this error later when we have a guarantee prepareInput
    // rejects unsignable scripts - it MUST be signable at this point.
    if (!allowIncomplete && !supportedP2SHType(input.redeemScriptType)) {
      throw new Error('Impossible to sign this type')
    }

    if (supportedType(input.redeemScriptType)) {
      sig = buildStack(input.redeemScriptType, input.signatures, input.pubKeys, allowIncomplete)
    }

    // If it wasn't SIGNABLE, it's witness, defer to that
    if (input.redeemScriptType) {
      p2sh = true
      scriptType = input.redeemScriptType
    }
  }

  switch (scriptType) {
    // P2WPKH is a special case of P2PKH
    case btemplates.types.P2WPKH:
      witness = buildStack(btemplates.types.P2PKH, input.signatures, input.pubKeys, allowIncomplete)
      break

    case btemplates.types.P2WSH:
      // We can remove this check later
      if (!allowIncomplete && !supportedType(input.witnessScriptType)) {
        throw new Error('Impossible to sign this type')
      }

      if (supportedType(input.witnessScriptType)) {
        witness = buildStack(input.witnessScriptType, input.signatures, input.pubKeys, allowIncomplete)
        witness.push(input.witnessScript)
        scriptType = input.witnessScriptType
      }

      break
  }

  // append redeemScript if necessary
  if (p2sh) {
    sig.push(input.redeemScript)
  }

  return {
    type: scriptType,
    script: bscript.compile(sig),
    witness: witness
  }
}

function TransactionBuilder (network, maximumFeeRate) {
  this.prevTxMap = {}
  this.network = network || networks.bitcoin

  // WARNING: This is __NOT__ to be relied on, its just another potential safety mechanism (safety in-depth)
  this.maximumFeeRate = maximumFeeRate || 2500

  this.inputs = []
  this.tx = new Transaction()
}

TransactionBuilder.prototype.setLockTime = function (locktime) {
  typeforce(types.UInt32, locktime)

  // if any signatures exist, throw
  if (this.inputs.some(function (input) {
    if (!input.signatures) return false

    return input.signatures.some(function (s) { return s })
  })) {
    throw new Error('No, this would invalidate signatures')
  }

  this.tx.locktime = locktime
}

TransactionBuilder.prototype.setVersion = function (version) {
  typeforce(types.UInt32, version)

  // XXX: this might eventually become more complex depending on what the versions represent
  this.tx.version = version
}

TransactionBuilder.fromTransaction = function (transaction, network) {
  var txb = new TransactionBuilder(network)

  // Copy transaction fields
  txb.setVersion(transaction.version)
  txb.setLockTime(transaction.locktime)

  // Copy outputs (done first to avoid signature invalidation)
  transaction.outs.forEach(function (txOut) {
    txb.addOutput(txOut.script, txOut.value)
  })

  // Copy inputs
  transaction.ins.forEach(function (txIn) {
    txb.__addInputUnsafe(txIn.hash, txIn.index, {
      sequence: txIn.sequence,
      script: txIn.script,
      witness: txIn.witness
    })
  })

  // fix some things not possible through the public API
  txb.inputs.forEach(function (input, i) {
    fixMultisigOrder(input, transaction, i)
  })

  return txb
}

TransactionBuilder.prototype.addInput = function (txHash, vout, sequence, prevOutScript) {
  if (!this.__canModifyInputs()) {
    throw new Error('No, this would invalidate signatures')
  }

  var value

  // is it a hex string?
  if (typeof txHash === 'string') {
    // transaction hashs's are displayed in reverse order, un-reverse it
    txHash = Buffer.from(txHash, 'hex').reverse()

  // is it a Transaction object?
  } else if (txHash instanceof Transaction) {
    var txOut = txHash.outs[vout]
    prevOutScript = txOut.script
    value = txOut.value

    txHash = txHash.getHash()
  }

  return this.__addInputUnsafe(txHash, vout, {
    sequence: sequence,
    prevOutScript: prevOutScript,
    value: value
  })
}

TransactionBuilder.prototype.__addInputUnsafe = function (txHash, vout, options) {
  if (Transaction.isCoinbaseHash(txHash)) {
    throw new Error('coinbase inputs not supported')
  }

  var prevTxOut = txHash.toString('hex') + ':' + vout
  if (this.prevTxMap[prevTxOut] !== undefined) throw new Error('Duplicate TxOut: ' + prevTxOut)

  var input = {}

  // derive what we can from the scriptSig
  if (options.script !== undefined) {
    input = expandInput(options.script, options.witness || [])
  }

  // if an input value was given, retain it
  if (options.value !== undefined) {
    input.value = options.value
  }

  // derive what we can from the previous transactions output script
  if (!input.prevOutScript && options.prevOutScript) {
    var prevOutType

    if (!input.pubKeys && !input.signatures) {
      var expanded = expandOutput(options.prevOutScript)

      if (expanded.pubKeys) {
        input.pubKeys = expanded.pubKeys
        input.signatures = expanded.signatures
      }

      prevOutType = expanded.scriptType
    }

    input.prevOutScript = options.prevOutScript
    input.prevOutType = prevOutType || btemplates.classifyOutput(options.prevOutScript)
  }

  var vin = this.tx.addInput(txHash, vout, options.sequence, options.scriptSig)
  this.inputs[vin] = input
  this.prevTxMap[prevTxOut] = vin
  return vin
}

TransactionBuilder.prototype.addOutput = function (scriptPubKey, value) {
  if (!this.__canModifyOutputs()) {
    throw new Error('No, this would invalidate signatures')
  }

  // Attempt to get a script if it's a base58 address string
  if (typeof scriptPubKey === 'string') {
    scriptPubKey = baddress.toOutputScript(scriptPubKey, this.network)
  }

  return this.tx.addOutput(scriptPubKey, value)
}

TransactionBuilder.prototype.build = function () {
  return this.__build(false)
}
TransactionBuilder.prototype.buildIncomplete = function () {
  return this.__build(true)
}

TransactionBuilder.prototype.__build = function (allowIncomplete) {
  if (!allowIncomplete) {
    if (!this.tx.ins.length) throw new Error('Transaction has no inputs')
    if (!this.tx.outs.length) throw new Error('Transaction has no outputs')
  }

  var tx = this.tx.clone()
  // Create script signatures from inputs
  this.inputs.forEach(function (input, i) {
    var scriptType = input.witnessScriptType || input.redeemScriptType || input.prevOutType
    if (!scriptType && !allowIncomplete) throw new Error('Transaction is not complete')
    var result = buildInput(input, allowIncomplete)

    // skip if no result
    if (!allowIncomplete) {
      if (!supportedType(result.type) && result.type !== btemplates.types.P2WPKH) {
        throw new Error(result.type + ' not supported')
      }
    }

    tx.setInputScript(i, result.script)
    tx.setWitness(i, result.witness)
  })

  if (!allowIncomplete) {
    // do not rely on this, its merely a last resort
    if (this.__overMaximumFees(tx.virtualSize())) {
      throw new Error('Transaction has absurd fees')
    }
  }

  return tx
}

function canSign (input) {
  return input.prevOutScript !== undefined &&
    input.signScript !== undefined &&
    input.pubKeys !== undefined &&
    input.signatures !== undefined &&
    input.signatures.length === input.pubKeys.length &&
    input.pubKeys.length > 0 &&
    (
      input.witness === false ||
      (input.witness === true && input.value !== undefined)
    )
}

TransactionBuilder.prototype.sign = function (vin, keyPair, redeemScript, hashType, witnessValue, witnessScript) {
  // TODO: remove keyPair.network matching in 4.0.0
  if (keyPair.network && keyPair.network !== this.network) throw new TypeError('Inconsistent network')
  if (!this.inputs[vin]) throw new Error('No input at index: ' + vin)
  hashType = hashType || Transaction.SIGHASH_ALL

  var input = this.inputs[vin]

  // if redeemScript was previously provided, enforce consistency
  if (input.redeemScript !== undefined &&
      redeemScript &&
      !input.redeemScript.equals(redeemScript)) {
    throw new Error('Inconsistent redeemScript')
  }

  var kpPubKey = keyPair.publicKey || keyPair.getPublicKeyBuffer()
  if (!canSign(input)) {
    if (witnessValue !== undefined) {
      if (input.value !== undefined && input.value !== witnessValue) throw new Error('Input didn\'t match witnessValue')
      typeforce(types.Satoshi, witnessValue)
      input.value = witnessValue
    }

    if (!canSign(input)) prepareInput(input, kpPubKey, redeemScript, witnessValue, witnessScript)
    if (!canSign(input)) throw Error(input.prevOutType + ' not supported')
  }

  // ready to sign
  var signatureHash
  if (input.witness) {
    signatureHash = this.tx.hashForWitnessV0(vin, input.signScript, input.value, hashType)
  } else {
    signatureHash = this.tx.hashForSignature(vin, input.signScript, hashType)
  }

  // enforce in order signing of public keys
  var signed = input.pubKeys.some(function (pubKey, i) {
    if (!kpPubKey.equals(pubKey)) return false
    if (input.signatures[i]) throw new Error('Signature already exists')
    if (kpPubKey.length !== 33 &&
      input.signType === scriptTypes.P2WPKH) throw new Error('BIP143 rejects uncompressed public keys in P2WPKH or P2WSH')

    var signature = keyPair.sign(signatureHash)
    if (Buffer.isBuffer(signature)) signature = ECSignature.fromRSBuffer(signature)

    input.signatures[i] = signature.toScriptSignature(hashType)
    return true
  })

  if (!signed) throw new Error('Key pair cannot sign for this input')
}

function signatureHashType (buffer) {
  return buffer.readUInt8(buffer.length - 1)
}

TransactionBuilder.prototype.__canModifyInputs = function () {
  return this.inputs.every(function (input) {
    // any signatures?
    if (input.signatures === undefined) return true

    return input.signatures.every(function (signature) {
      if (!signature) return true
      var hashType = signatureHashType(signature)

      // if SIGHASH_ANYONECANPAY is set, signatures would not
      // be invalidated by more inputs
      return hashType & Transaction.SIGHASH_ANYONECANPAY
    })
  })
}

TransactionBuilder.prototype.__canModifyOutputs = function () {
  var nInputs = this.tx.ins.length
  var nOutputs = this.tx.outs.length

  return this.inputs.every(function (input) {
    if (input.signatures === undefined) return true

    return input.signatures.every(function (signature) {
      if (!signature) return true
      var hashType = signatureHashType(signature)

      var hashTypeMod = hashType & 0x1f
      if (hashTypeMod === Transaction.SIGHASH_NONE) return true
      if (hashTypeMod === Transaction.SIGHASH_SINGLE) {
        // if SIGHASH_SINGLE is set, and nInputs > nOutputs
        // some signatures would be invalidated by the addition
        // of more outputs
        return nInputs <= nOutputs
      }
    })
  })
}

TransactionBuilder.prototype.__overMaximumFees = function (bytes) {
  // not all inputs will have .value defined
  var incoming = this.inputs.reduce(function (a, x) { return a + (x.value >>> 0) }, 0)

  // but all outputs do, and if we have any input value
  // we can immediately determine if the outputs are too small
  var outgoing = this.tx.outs.reduce(function (a, x) { return a + x.value }, 0)
  var fee = incoming - outgoing
  var feeRate = fee / bytes

  return feeRate > this.maximumFeeRate
}

module.exports = TransactionBuilder


/***/ }),

/***/ "./node_modules/bitcoinjs-lib/src/types.js":
/*!*************************************************!*\
  !*** ./node_modules/bitcoinjs-lib/src/types.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var typeforce = __webpack_require__(/*! typeforce */ "./node_modules/typeforce/index.js")

var UINT31_MAX = Math.pow(2, 31) - 1
function UInt31 (value) {
  return typeforce.UInt32(value) && value <= UINT31_MAX
}

function BIP32Path (value) {
  return typeforce.String(value) && value.match(/^(m\/)?(\d+'?\/)*\d+'?$/)
}
BIP32Path.toJSON = function () { return 'BIP32 derivation path' }

var SATOSHI_MAX = 21 * 1e14
function Satoshi (value) {
  return typeforce.UInt53(value) && value <= SATOSHI_MAX
}

// external dependent types
var BigInt = typeforce.quacksLike('BigInteger')
var ECPoint = typeforce.quacksLike('Point')

// exposed, external API
var ECSignature = typeforce.compile({ r: BigInt, s: BigInt })
var Network = typeforce.compile({
  messagePrefix: typeforce.oneOf(typeforce.Buffer, typeforce.String),
  bip32: {
    public: typeforce.UInt32,
    private: typeforce.UInt32
  },
  pubKeyHash: typeforce.UInt8,
  scriptHash: typeforce.UInt8,
  wif: typeforce.UInt8
})

// extend typeforce types with ours
var types = {
  BigInt: BigInt,
  BIP32Path: BIP32Path,
  Buffer256bit: typeforce.BufferN(32),
  ECPoint: ECPoint,
  ECSignature: ECSignature,
  Hash160bit: typeforce.BufferN(20),
  Hash256bit: typeforce.BufferN(32),
  Network: Network,
  Satoshi: Satoshi,
  UInt31: UInt31
}

for (var typeName in typeforce) {
  types[typeName] = typeforce[typeName]
}

module.exports = types


/***/ }),

/***/ "./node_modules/bs58/index.js":
/*!************************************!*\
  !*** ./node_modules/bs58/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var basex = __webpack_require__(/*! base-x */ "./node_modules/base-x/src/index.js")
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

module.exports = basex(ALPHABET)


/***/ }),

/***/ "./node_modules/bs58check/base.js":
/*!****************************************!*\
  !*** ./node_modules/bs58check/base.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base58 = __webpack_require__(/*! bs58 */ "./node_modules/bs58/index.js")
var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer

module.exports = function (checksumFn) {
  // Encode a buffer as a base58-check encoded string
  function encode (payload) {
    var checksum = checksumFn(payload)

    return base58.encode(Buffer.concat([
      payload,
      checksum
    ], payload.length + 4))
  }

  function decodeRaw (buffer) {
    var payload = buffer.slice(0, -4)
    var checksum = buffer.slice(-4)
    var newChecksum = checksumFn(payload)

    if (checksum[0] ^ newChecksum[0] |
        checksum[1] ^ newChecksum[1] |
        checksum[2] ^ newChecksum[2] |
        checksum[3] ^ newChecksum[3]) return

    return payload
  }

  // Decode a base58-check encoded string to a buffer, no result if checksum is wrong
  function decodeUnsafe (string) {
    var buffer = base58.decodeUnsafe(string)
    if (!buffer) return

    return decodeRaw(buffer)
  }

  function decode (string) {
    var buffer = base58.decode(string)
    var payload = decodeRaw(buffer, checksumFn)
    if (!payload) throw new Error('Invalid checksum')
    return payload
  }

  return {
    encode: encode,
    decode: decode,
    decodeUnsafe: decodeUnsafe
  }
}


/***/ }),

/***/ "./node_modules/bs58check/index.js":
/*!*****************************************!*\
  !*** ./node_modules/bs58check/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createHash = __webpack_require__(/*! create-hash */ "./node_modules/create-hash/index.js")
var bs58checkBase = __webpack_require__(/*! ./base */ "./node_modules/bs58check/base.js")

// SHA256(SHA256(buffer))
function sha256x2 (buffer) {
  var tmp = createHash('sha256').update(buffer).digest()
  return createHash('sha256').update(tmp).digest()
}

module.exports = bs58checkBase(sha256x2)


/***/ }),

/***/ "./node_modules/create-hash/index.js":
/*!*******************************************!*\
  !*** ./node_modules/create-hash/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! crypto */ "crypto").createHash


/***/ }),

/***/ "./node_modules/create-hmac/index.js":
/*!*******************************************!*\
  !*** ./node_modules/create-hmac/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! crypto */ "crypto").createHmac


/***/ }),

/***/ "./node_modules/ecurve/lib/curve.js":
/*!******************************************!*\
  !*** ./node_modules/ecurve/lib/curve.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(/*! assert */ "assert")
var BigInteger = __webpack_require__(/*! bigi */ "./node_modules/bigi/lib/index.js")

var Point = __webpack_require__(/*! ./point */ "./node_modules/ecurve/lib/point.js")

function Curve (p, a, b, Gx, Gy, n, h) {
  this.p = p
  this.a = a
  this.b = b
  this.G = Point.fromAffine(this, Gx, Gy)
  this.n = n
  this.h = h

  this.infinity = new Point(this, null, null, BigInteger.ZERO)

  // result caching
  this.pOverFour = p.add(BigInteger.ONE).shiftRight(2)

  // determine size of p in bytes
  this.pLength = Math.floor((this.p.bitLength() + 7) / 8)
}

Curve.prototype.pointFromX = function (isOdd, x) {
  var alpha = x.pow(3).add(this.a.multiply(x)).add(this.b).mod(this.p)
  var beta = alpha.modPow(this.pOverFour, this.p) // XXX: not compatible with all curves

  var y = beta
  if (beta.isEven() ^ !isOdd) {
    y = this.p.subtract(y) // -y % p
  }

  return Point.fromAffine(this, x, y)
}

Curve.prototype.isInfinity = function (Q) {
  if (Q === this.infinity) return true

  return Q.z.signum() === 0 && Q.y.signum() !== 0
}

Curve.prototype.isOnCurve = function (Q) {
  if (this.isInfinity(Q)) return true

  var x = Q.affineX
  var y = Q.affineY
  var a = this.a
  var b = this.b
  var p = this.p

  // Check that xQ and yQ are integers in the interval [0, p - 1]
  if (x.signum() < 0 || x.compareTo(p) >= 0) return false
  if (y.signum() < 0 || y.compareTo(p) >= 0) return false

  // and check that y^2 = x^3 + ax + b (mod p)
  var lhs = y.square().mod(p)
  var rhs = x.pow(3).add(a.multiply(x)).add(b).mod(p)
  return lhs.equals(rhs)
}

/**
 * Validate an elliptic curve point.
 *
 * See SEC 1, section 3.2.2.1: Elliptic Curve Public Key Validation Primitive
 */
Curve.prototype.validate = function (Q) {
  // Check Q != O
  assert(!this.isInfinity(Q), 'Point is at infinity')
  assert(this.isOnCurve(Q), 'Point is not on the curve')

  // Check nQ = O (where Q is a scalar multiple of G)
  var nQ = Q.multiply(this.n)
  assert(this.isInfinity(nQ), 'Point is not a scalar multiple of G')

  return true
}

module.exports = Curve


/***/ }),

/***/ "./node_modules/ecurve/lib/curves.json":
/*!*********************************************!*\
  !*** ./node_modules/ecurve/lib/curves.json ***!
  \*********************************************/
/*! exports provided: secp128r1, secp160k1, secp160r1, secp192k1, secp192r1, secp256k1, secp256r1, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"secp128r1\":{\"p\":\"fffffffdffffffffffffffffffffffff\",\"a\":\"fffffffdfffffffffffffffffffffffc\",\"b\":\"e87579c11079f43dd824993c2cee5ed3\",\"n\":\"fffffffe0000000075a30d1b9038a115\",\"h\":\"01\",\"Gx\":\"161ff7528b899b2d0c28607ca52c5b86\",\"Gy\":\"cf5ac8395bafeb13c02da292dded7a83\"},\"secp160k1\":{\"p\":\"fffffffffffffffffffffffffffffffeffffac73\",\"a\":\"00\",\"b\":\"07\",\"n\":\"0100000000000000000001b8fa16dfab9aca16b6b3\",\"h\":\"01\",\"Gx\":\"3b4c382ce37aa192a4019e763036f4f5dd4d7ebb\",\"Gy\":\"938cf935318fdced6bc28286531733c3f03c4fee\"},\"secp160r1\":{\"p\":\"ffffffffffffffffffffffffffffffff7fffffff\",\"a\":\"ffffffffffffffffffffffffffffffff7ffffffc\",\"b\":\"1c97befc54bd7a8b65acf89f81d4d4adc565fa45\",\"n\":\"0100000000000000000001f4c8f927aed3ca752257\",\"h\":\"01\",\"Gx\":\"4a96b5688ef573284664698968c38bb913cbfc82\",\"Gy\":\"23a628553168947d59dcc912042351377ac5fb32\"},\"secp192k1\":{\"p\":\"fffffffffffffffffffffffffffffffffffffffeffffee37\",\"a\":\"00\",\"b\":\"03\",\"n\":\"fffffffffffffffffffffffe26f2fc170f69466a74defd8d\",\"h\":\"01\",\"Gx\":\"db4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d\",\"Gy\":\"9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d\"},\"secp192r1\":{\"p\":\"fffffffffffffffffffffffffffffffeffffffffffffffff\",\"a\":\"fffffffffffffffffffffffffffffffefffffffffffffffc\",\"b\":\"64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1\",\"n\":\"ffffffffffffffffffffffff99def836146bc9b1b4d22831\",\"h\":\"01\",\"Gx\":\"188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012\",\"Gy\":\"07192b95ffc8da78631011ed6b24cdd573f977a11e794811\"},\"secp256k1\":{\"p\":\"fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f\",\"a\":\"00\",\"b\":\"07\",\"n\":\"fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141\",\"h\":\"01\",\"Gx\":\"79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798\",\"Gy\":\"483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8\"},\"secp256r1\":{\"p\":\"ffffffff00000001000000000000000000000000ffffffffffffffffffffffff\",\"a\":\"ffffffff00000001000000000000000000000000fffffffffffffffffffffffc\",\"b\":\"5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b\",\"n\":\"ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551\",\"h\":\"01\",\"Gx\":\"6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296\",\"Gy\":\"4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5\"}}");

/***/ }),

/***/ "./node_modules/ecurve/lib/index.js":
/*!******************************************!*\
  !*** ./node_modules/ecurve/lib/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var Point = __webpack_require__(/*! ./point */ "./node_modules/ecurve/lib/point.js")
var Curve = __webpack_require__(/*! ./curve */ "./node_modules/ecurve/lib/curve.js")

var getCurveByName = __webpack_require__(/*! ./names */ "./node_modules/ecurve/lib/names.js")

module.exports = {
  Curve: Curve,
  Point: Point,
  getCurveByName: getCurveByName
}


/***/ }),

/***/ "./node_modules/ecurve/lib/names.js":
/*!******************************************!*\
  !*** ./node_modules/ecurve/lib/names.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var BigInteger = __webpack_require__(/*! bigi */ "./node_modules/bigi/lib/index.js")

var curves = __webpack_require__(/*! ./curves.json */ "./node_modules/ecurve/lib/curves.json")
var Curve = __webpack_require__(/*! ./curve */ "./node_modules/ecurve/lib/curve.js")

function getCurveByName (name) {
  var curve = curves[name]
  if (!curve) return null

  var p = new BigInteger(curve.p, 16)
  var a = new BigInteger(curve.a, 16)
  var b = new BigInteger(curve.b, 16)
  var n = new BigInteger(curve.n, 16)
  var h = new BigInteger(curve.h, 16)
  var Gx = new BigInteger(curve.Gx, 16)
  var Gy = new BigInteger(curve.Gy, 16)

  return new Curve(p, a, b, Gx, Gy, n, h)
}

module.exports = getCurveByName


/***/ }),

/***/ "./node_modules/ecurve/lib/point.js":
/*!******************************************!*\
  !*** ./node_modules/ecurve/lib/point.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var assert = __webpack_require__(/*! assert */ "assert")
var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer
var BigInteger = __webpack_require__(/*! bigi */ "./node_modules/bigi/lib/index.js")

var THREE = BigInteger.valueOf(3)

function Point (curve, x, y, z) {
  assert.notStrictEqual(z, undefined, 'Missing Z coordinate')

  this.curve = curve
  this.x = x
  this.y = y
  this.z = z
  this._zInv = null

  this.compressed = true
}

Object.defineProperty(Point.prototype, 'zInv', {
  get: function () {
    if (this._zInv === null) {
      this._zInv = this.z.modInverse(this.curve.p)
    }

    return this._zInv
  }
})

Object.defineProperty(Point.prototype, 'affineX', {
  get: function () {
    return this.x.multiply(this.zInv).mod(this.curve.p)
  }
})

Object.defineProperty(Point.prototype, 'affineY', {
  get: function () {
    return this.y.multiply(this.zInv).mod(this.curve.p)
  }
})

Point.fromAffine = function (curve, x, y) {
  return new Point(curve, x, y, BigInteger.ONE)
}

Point.prototype.equals = function (other) {
  if (other === this) return true
  if (this.curve.isInfinity(this)) return this.curve.isInfinity(other)
  if (this.curve.isInfinity(other)) return this.curve.isInfinity(this)

  // u = Y2 * Z1 - Y1 * Z2
  var u = other.y.multiply(this.z).subtract(this.y.multiply(other.z)).mod(this.curve.p)

  if (u.signum() !== 0) return false

  // v = X2 * Z1 - X1 * Z2
  var v = other.x.multiply(this.z).subtract(this.x.multiply(other.z)).mod(this.curve.p)

  return v.signum() === 0
}

Point.prototype.negate = function () {
  var y = this.curve.p.subtract(this.y)

  return new Point(this.curve, this.x, y, this.z)
}

Point.prototype.add = function (b) {
  if (this.curve.isInfinity(this)) return b
  if (this.curve.isInfinity(b)) return this

  var x1 = this.x
  var y1 = this.y
  var x2 = b.x
  var y2 = b.y

  // u = Y2 * Z1 - Y1 * Z2
  var u = y2.multiply(this.z).subtract(y1.multiply(b.z)).mod(this.curve.p)
  // v = X2 * Z1 - X1 * Z2
  var v = x2.multiply(this.z).subtract(x1.multiply(b.z)).mod(this.curve.p)

  if (v.signum() === 0) {
    if (u.signum() === 0) {
      return this.twice() // this == b, so double
    }

    return this.curve.infinity // this = -b, so infinity
  }

  var v2 = v.square()
  var v3 = v2.multiply(v)
  var x1v2 = x1.multiply(v2)
  var zu2 = u.square().multiply(this.z)

  // x3 = v * (z2 * (z1 * u^2 - 2 * x1 * v^2) - v^3)
  var x3 = zu2.subtract(x1v2.shiftLeft(1)).multiply(b.z).subtract(v3).multiply(v).mod(this.curve.p)
  // y3 = z2 * (3 * x1 * u * v^2 - y1 * v^3 - z1 * u^3) + u * v^3
  var y3 = x1v2.multiply(THREE).multiply(u).subtract(y1.multiply(v3)).subtract(zu2.multiply(u)).multiply(b.z).add(u.multiply(v3)).mod(this.curve.p)
  // z3 = v^3 * z1 * z2
  var z3 = v3.multiply(this.z).multiply(b.z).mod(this.curve.p)

  return new Point(this.curve, x3, y3, z3)
}

Point.prototype.twice = function () {
  if (this.curve.isInfinity(this)) return this
  if (this.y.signum() === 0) return this.curve.infinity

  var x1 = this.x
  var y1 = this.y

  var y1z1 = y1.multiply(this.z).mod(this.curve.p)
  var y1sqz1 = y1z1.multiply(y1).mod(this.curve.p)
  var a = this.curve.a

  // w = 3 * x1^2 + a * z1^2
  var w = x1.square().multiply(THREE)

  if (a.signum() !== 0) {
    w = w.add(this.z.square().multiply(a))
  }

  w = w.mod(this.curve.p)
  // x3 = 2 * y1 * z1 * (w^2 - 8 * x1 * y1^2 * z1)
  var x3 = w.square().subtract(x1.shiftLeft(3).multiply(y1sqz1)).shiftLeft(1).multiply(y1z1).mod(this.curve.p)
  // y3 = 4 * y1^2 * z1 * (3 * w * x1 - 2 * y1^2 * z1) - w^3
  var y3 = w.multiply(THREE).multiply(x1).subtract(y1sqz1.shiftLeft(1)).shiftLeft(2).multiply(y1sqz1).subtract(w.pow(3)).mod(this.curve.p)
  // z3 = 8 * (y1 * z1)^3
  var z3 = y1z1.pow(3).shiftLeft(3).mod(this.curve.p)

  return new Point(this.curve, x3, y3, z3)
}

// Simple NAF (Non-Adjacent Form) multiplication algorithm
// TODO: modularize the multiplication algorithm
Point.prototype.multiply = function (k) {
  if (this.curve.isInfinity(this)) return this
  if (k.signum() === 0) return this.curve.infinity

  var e = k
  var h = e.multiply(THREE)

  var neg = this.negate()
  var R = this

  for (var i = h.bitLength() - 2; i > 0; --i) {
    var hBit = h.testBit(i)
    var eBit = e.testBit(i)

    R = R.twice()

    if (hBit !== eBit) {
      R = R.add(hBit ? this : neg)
    }
  }

  return R
}

// Compute this*j + x*k (simultaneous multiplication)
Point.prototype.multiplyTwo = function (j, x, k) {
  var i = Math.max(j.bitLength(), k.bitLength()) - 1
  var R = this.curve.infinity
  var both = this.add(x)

  while (i >= 0) {
    var jBit = j.testBit(i)
    var kBit = k.testBit(i)

    R = R.twice()

    if (jBit) {
      if (kBit) {
        R = R.add(both)
      } else {
        R = R.add(this)
      }
    } else if (kBit) {
      R = R.add(x)
    }
    --i
  }

  return R
}

Point.prototype.getEncoded = function (compressed) {
  if (compressed == null) compressed = this.compressed
  if (this.curve.isInfinity(this)) return Buffer.alloc(1, 0) // Infinity point encoded is simply '00'

  var x = this.affineX
  var y = this.affineY
  var byteLength = this.curve.pLength
  var buffer

  // 0x02/0x03 | X
  if (compressed) {
    buffer = Buffer.allocUnsafe(1 + byteLength)
    buffer.writeUInt8(y.isEven() ? 0x02 : 0x03, 0)

  // 0x04 | X | Y
  } else {
    buffer = Buffer.allocUnsafe(1 + byteLength + byteLength)
    buffer.writeUInt8(0x04, 0)

    y.toBuffer(byteLength).copy(buffer, 1 + byteLength)
  }

  x.toBuffer(byteLength).copy(buffer, 1)

  return buffer
}

Point.decodeFrom = function (curve, buffer) {
  var type = buffer.readUInt8(0)
  var compressed = (type !== 4)

  var byteLength = Math.floor((curve.p.bitLength() + 7) / 8)
  var x = BigInteger.fromBuffer(buffer.slice(1, 1 + byteLength))

  var Q
  if (compressed) {
    assert.equal(buffer.length, byteLength + 1, 'Invalid sequence length')
    assert(type === 0x02 || type === 0x03, 'Invalid sequence tag')

    var isOdd = (type === 0x03)
    Q = curve.pointFromX(isOdd, x)
  } else {
    assert.equal(buffer.length, 1 + byteLength + byteLength, 'Invalid sequence length')

    var y = BigInteger.fromBuffer(buffer.slice(1 + byteLength))
    Q = Point.fromAffine(curve, x, y)
  }

  Q.compressed = compressed
  return Q
}

Point.prototype.toString = function () {
  if (this.curve.isInfinity(this)) return '(INFINITY)'

  return '(' + this.affineX.toString() + ',' + this.affineY.toString() + ')'
}

module.exports = Point


/***/ }),

/***/ "./node_modules/merkle-lib/fastRoot.js":
/*!*********************************************!*\
  !*** ./node_modules/merkle-lib/fastRoot.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// constant-space merkle root calculation algorithm
module.exports = function fastRoot (values, digestFn) {
  if (!Array.isArray(values)) throw TypeError('Expected values Array')
  if (typeof digestFn !== 'function') throw TypeError('Expected digest Function')

  var length = values.length
  var results = values.concat()

  while (length > 1) {
    var j = 0

    for (var i = 0; i < length; i += 2, ++j) {
      var left = results[i]
      var right = i + 1 === length ? left : results[i + 1]
      var data = Buffer.concat([left, right])

      results[j] = digestFn(data)
    }

    length = j
  }

  return results[0]
}


/***/ }),

/***/ "./node_modules/pushdata-bitcoin/index.js":
/*!************************************************!*\
  !*** ./node_modules/pushdata-bitcoin/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var OPS = __webpack_require__(/*! bitcoin-ops */ "./node_modules/bitcoin-ops/index.json")

function encodingLength (i) {
  return i < OPS.OP_PUSHDATA1 ? 1
  : i <= 0xff ? 2
  : i <= 0xffff ? 3
  : 5
}

function encode (buffer, number, offset) {
  var size = encodingLength(number)

  // ~6 bit
  if (size === 1) {
    buffer.writeUInt8(number, offset)

  // 8 bit
  } else if (size === 2) {
    buffer.writeUInt8(OPS.OP_PUSHDATA1, offset)
    buffer.writeUInt8(number, offset + 1)

  // 16 bit
  } else if (size === 3) {
    buffer.writeUInt8(OPS.OP_PUSHDATA2, offset)
    buffer.writeUInt16LE(number, offset + 1)

  // 32 bit
  } else {
    buffer.writeUInt8(OPS.OP_PUSHDATA4, offset)
    buffer.writeUInt32LE(number, offset + 1)
  }

  return size
}

function decode (buffer, offset) {
  var opcode = buffer.readUInt8(offset)
  var number, size

  // ~6 bit
  if (opcode < OPS.OP_PUSHDATA1) {
    number = opcode
    size = 1

  // 8 bit
  } else if (opcode === OPS.OP_PUSHDATA1) {
    if (offset + 2 > buffer.length) return null
    number = buffer.readUInt8(offset + 1)
    size = 2

  // 16 bit
  } else if (opcode === OPS.OP_PUSHDATA2) {
    if (offset + 3 > buffer.length) return null
    number = buffer.readUInt16LE(offset + 1)
    size = 3

  // 32 bit
  } else {
    if (offset + 5 > buffer.length) return null
    if (opcode !== OPS.OP_PUSHDATA4) throw new Error('Unexpected opcode')

    number = buffer.readUInt32LE(offset + 1)
    size = 5
  }

  return {
    opcode: opcode,
    number: number,
    size: size
  }
}

module.exports = {
  encodingLength: encodingLength,
  encode: encode,
  decode: decode
}


/***/ }),

/***/ "./node_modules/randombytes/index.js":
/*!*******************************************!*\
  !*** ./node_modules/randombytes/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! crypto */ "crypto").randomBytes


/***/ }),

/***/ "./node_modules/safe-buffer/index.js":
/*!*******************************************!*\
  !*** ./node_modules/safe-buffer/index.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(/*! buffer */ "buffer")
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),

/***/ "./node_modules/typeforce/errors.js":
/*!******************************************!*\
  !*** ./node_modules/typeforce/errors.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var native = __webpack_require__(/*! ./native */ "./node_modules/typeforce/native.js")

function getTypeName (fn) {
  return fn.name || fn.toString().match(/function (.*?)\s*\(/)[1]
}

function getValueTypeName (value) {
  return native.Nil(value) ? '' : getTypeName(value.constructor)
}

function getValue (value) {
  if (native.Function(value)) return ''
  if (native.String(value)) return JSON.stringify(value)
  if (value && native.Object(value)) return ''
  return value
}

function captureStackTrace (e, t) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(e, t)
  }
}

function tfJSON (type) {
  if (native.Function(type)) return type.toJSON ? type.toJSON() : getTypeName(type)
  if (native.Array(type)) return 'Array'
  if (type && native.Object(type)) return 'Object'

  return type !== undefined ? type : ''
}

function tfErrorString (type, value, valueTypeName) {
  var valueJson = getValue(value)

  return 'Expected ' + tfJSON(type) + ', got' +
    (valueTypeName !== '' ? ' ' + valueTypeName : '') +
    (valueJson !== '' ? ' ' + valueJson : '')
}

function TfTypeError (type, value, valueTypeName) {
  valueTypeName = valueTypeName || getValueTypeName(value)
  this.message = tfErrorString(type, value, valueTypeName)

  captureStackTrace(this, TfTypeError)
  this.__type = type
  this.__value = value
  this.__valueTypeName = valueTypeName
}

TfTypeError.prototype = Object.create(Error.prototype)
TfTypeError.prototype.constructor = TfTypeError

function tfPropertyErrorString (type, label, name, value, valueTypeName) {
  var description = '" of type '
  if (label === 'key') description = '" with key type '

  return tfErrorString('property "' + tfJSON(name) + description + tfJSON(type), value, valueTypeName)
}

function TfPropertyTypeError (type, property, label, value, valueTypeName) {
  if (type) {
    valueTypeName = valueTypeName || getValueTypeName(value)
    this.message = tfPropertyErrorString(type, label, property, value, valueTypeName)
  } else {
    this.message = 'Unexpected property "' + property + '"'
  }

  captureStackTrace(this, TfTypeError)
  this.__label = label
  this.__property = property
  this.__type = type
  this.__value = value
  this.__valueTypeName = valueTypeName
}

TfPropertyTypeError.prototype = Object.create(Error.prototype)
TfPropertyTypeError.prototype.constructor = TfTypeError

function tfCustomError (expected, actual) {
  return new TfTypeError(expected, {}, actual)
}

function tfSubError (e, property, label) {
  // sub child?
  if (e instanceof TfPropertyTypeError) {
    property = property + '.' + e.__property

    e = new TfPropertyTypeError(
      e.__type, property, e.__label, e.__value, e.__valueTypeName
    )

  // child?
  } else if (e instanceof TfTypeError) {
    e = new TfPropertyTypeError(
      e.__type, property, label, e.__value, e.__valueTypeName
    )
  }

  captureStackTrace(e)
  return e
}

module.exports = {
  TfTypeError: TfTypeError,
  TfPropertyTypeError: TfPropertyTypeError,
  tfCustomError: tfCustomError,
  tfSubError: tfSubError,
  tfJSON: tfJSON,
  getValueTypeName: getValueTypeName
}


/***/ }),

/***/ "./node_modules/typeforce/extra.js":
/*!*****************************************!*\
  !*** ./node_modules/typeforce/extra.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE = __webpack_require__(/*! ./native */ "./node_modules/typeforce/native.js")
var ERRORS = __webpack_require__(/*! ./errors */ "./node_modules/typeforce/errors.js")

function _Buffer (value) {
  return Buffer.isBuffer(value)
}

function Hex (value) {
  return typeof value === 'string' && /^([0-9a-f]{2})+$/i.test(value)
}

function _LengthN (type, length) {
  var name = type.toJSON()

  function Length (value) {
    if (!type(value)) return false
    if (value.length === length) return true

    throw ERRORS.tfCustomError(name + '(Length: ' + length + ')', name + '(Length: ' + value.length + ')')
  }
  Length.toJSON = function () { return name }

  return Length
}

var _ArrayN = _LengthN.bind(null, NATIVE.Array)
var _BufferN = _LengthN.bind(null, _Buffer)
var _HexN = _LengthN.bind(null, Hex)
var _StringN = _LengthN.bind(null, NATIVE.String)

function Range (a, b, f) {
  f = f || NATIVE.Number
  function _range (value, strict) {
    return f(value, strict) && (value > a) && (value < b)
  }
  _range.toJSON = function () {
    return `${f.toJSON()} between [${a}, ${b}]`
  }
  return _range
}

var INT53_MAX = Math.pow(2, 53) - 1

function Finite (value) {
  return typeof value === 'number' && isFinite(value)
}
function Int8 (value) { return ((value << 24) >> 24) === value }
function Int16 (value) { return ((value << 16) >> 16) === value }
function Int32 (value) { return (value | 0) === value }
function Int53 (value) {
  return typeof value === 'number' &&
    value >= -INT53_MAX &&
    value <= INT53_MAX &&
    Math.floor(value) === value
}
function UInt8 (value) { return (value & 0xff) === value }
function UInt16 (value) { return (value & 0xffff) === value }
function UInt32 (value) { return (value >>> 0) === value }
function UInt53 (value) {
  return typeof value === 'number' &&
    value >= 0 &&
    value <= INT53_MAX &&
    Math.floor(value) === value
}

var types = {
  ArrayN: _ArrayN,
  Buffer: _Buffer,
  BufferN: _BufferN,
  Finite: Finite,
  Hex: Hex,
  HexN: _HexN,
  Int8: Int8,
  Int16: Int16,
  Int32: Int32,
  Int53: Int53,
  Range: Range,
  StringN: _StringN,
  UInt8: UInt8,
  UInt16: UInt16,
  UInt32: UInt32,
  UInt53: UInt53
}

for (var typeName in types) {
  types[typeName].toJSON = function (t) {
    return t
  }.bind(null, typeName)
}

module.exports = types


/***/ }),

/***/ "./node_modules/typeforce/index.js":
/*!*****************************************!*\
  !*** ./node_modules/typeforce/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var ERRORS = __webpack_require__(/*! ./errors */ "./node_modules/typeforce/errors.js")
var NATIVE = __webpack_require__(/*! ./native */ "./node_modules/typeforce/native.js")

// short-hand
var tfJSON = ERRORS.tfJSON
var TfTypeError = ERRORS.TfTypeError
var TfPropertyTypeError = ERRORS.TfPropertyTypeError
var tfSubError = ERRORS.tfSubError
var getValueTypeName = ERRORS.getValueTypeName

var TYPES = {
  arrayOf: function arrayOf (type, options) {
    type = compile(type)
    options = options || {}

    function _arrayOf (array, strict) {
      if (!NATIVE.Array(array)) return false
      if (NATIVE.Nil(array)) return false
      if (options.minLength !== undefined && array.length < options.minLength) return false
      if (options.maxLength !== undefined && array.length > options.maxLength) return false
      if (options.length !== undefined && array.length !== options.length) return false

      return array.every(function (value, i) {
        try {
          return typeforce(type, value, strict)
        } catch (e) {
          throw tfSubError(e, i)
        }
      })
    }
    _arrayOf.toJSON = function () {
      var str = '[' + tfJSON(type) + ']'
      if (options.length !== undefined) {
        str += '{' + options.length + '}'
      } else if (options.minLength !== undefined || options.maxLength !== undefined) {
        str += '{' +
          (options.minLength === undefined ? 0 : options.minLength) + ',' +
          (options.maxLength === undefined ? Infinity : options.maxLength) + '}'
      }
      return str
    }

    return _arrayOf
  },

  maybe: function maybe (type) {
    type = compile(type)

    function _maybe (value, strict) {
      return NATIVE.Nil(value) || type(value, strict, maybe)
    }
    _maybe.toJSON = function () { return '?' + tfJSON(type) }

    return _maybe
  },

  map: function map (propertyType, propertyKeyType) {
    propertyType = compile(propertyType)
    if (propertyKeyType) propertyKeyType = compile(propertyKeyType)

    function _map (value, strict) {
      if (!NATIVE.Object(value)) return false
      if (NATIVE.Nil(value)) return false

      for (var propertyName in value) {
        try {
          if (propertyKeyType) {
            typeforce(propertyKeyType, propertyName, strict)
          }
        } catch (e) {
          throw tfSubError(e, propertyName, 'key')
        }

        try {
          var propertyValue = value[propertyName]
          typeforce(propertyType, propertyValue, strict)
        } catch (e) {
          throw tfSubError(e, propertyName)
        }
      }

      return true
    }

    if (propertyKeyType) {
      _map.toJSON = function () {
        return '{' + tfJSON(propertyKeyType) + ': ' + tfJSON(propertyType) + '}'
      }
    } else {
      _map.toJSON = function () { return '{' + tfJSON(propertyType) + '}' }
    }

    return _map
  },

  object: function object (uncompiled) {
    var type = {}

    for (var typePropertyName in uncompiled) {
      type[typePropertyName] = compile(uncompiled[typePropertyName])
    }

    function _object (value, strict) {
      if (!NATIVE.Object(value)) return false
      if (NATIVE.Nil(value)) return false

      var propertyName

      try {
        for (propertyName in type) {
          var propertyType = type[propertyName]
          var propertyValue = value[propertyName]

          typeforce(propertyType, propertyValue, strict)
        }
      } catch (e) {
        throw tfSubError(e, propertyName)
      }

      if (strict) {
        for (propertyName in value) {
          if (type[propertyName]) continue

          throw new TfPropertyTypeError(undefined, propertyName)
        }
      }

      return true
    }
    _object.toJSON = function () { return tfJSON(type) }

    return _object
  },

  anyOf: function anyOf () {
    var types = [].slice.call(arguments).map(compile)

    function _anyOf (value, strict) {
      return types.some(function (type) {
        try {
          return typeforce(type, value, strict)
        } catch (e) {
          return false
        }
      })
    }
    _anyOf.toJSON = function () { return types.map(tfJSON).join('|') }

    return _anyOf
  },

  allOf: function allOf () {
    var types = [].slice.call(arguments).map(compile)

    function _allOf (value, strict) {
      return types.every(function (type) {
        try {
          return typeforce(type, value, strict)
        } catch (e) {
          return false
        }
      })
    }
    _allOf.toJSON = function () { return types.map(tfJSON).join(' & ') }

    return _allOf
  },

  quacksLike: function quacksLike (type) {
    function _quacksLike (value) {
      return type === getValueTypeName(value)
    }
    _quacksLike.toJSON = function () { return type }

    return _quacksLike
  },

  tuple: function tuple () {
    var types = [].slice.call(arguments).map(compile)

    function _tuple (values, strict) {
      if (NATIVE.Nil(values)) return false
      if (NATIVE.Nil(values.length)) return false
      if (strict && (values.length !== types.length)) return false

      return types.every(function (type, i) {
        try {
          return typeforce(type, values[i], strict)
        } catch (e) {
          throw tfSubError(e, i)
        }
      })
    }
    _tuple.toJSON = function () { return '(' + types.map(tfJSON).join(', ') + ')' }

    return _tuple
  },

  value: function value (expected) {
    function _value (actual) {
      return actual === expected
    }
    _value.toJSON = function () { return expected }

    return _value
  }
}

// TODO: deprecate
TYPES.oneOf = TYPES.anyOf

function compile (type) {
  if (NATIVE.String(type)) {
    if (type[0] === '?') return TYPES.maybe(type.slice(1))

    return NATIVE[type] || TYPES.quacksLike(type)
  } else if (type && NATIVE.Object(type)) {
    if (NATIVE.Array(type)) {
      if (type.length !== 1) throw new TypeError('Expected compile() parameter of type Array of length 1')
      return TYPES.arrayOf(type[0])
    }

    return TYPES.object(type)
  } else if (NATIVE.Function(type)) {
    return type
  }

  return TYPES.value(type)
}

function typeforce (type, value, strict, surrogate) {
  if (NATIVE.Function(type)) {
    if (type(value, strict)) return true

    throw new TfTypeError(surrogate || type, value)
  }

  // JIT
  return typeforce(compile(type), value, strict)
}

// assign types to typeforce function
for (var typeName in NATIVE) {
  typeforce[typeName] = NATIVE[typeName]
}

for (typeName in TYPES) {
  typeforce[typeName] = TYPES[typeName]
}

var EXTRA = __webpack_require__(/*! ./extra */ "./node_modules/typeforce/extra.js")
for (typeName in EXTRA) {
  typeforce[typeName] = EXTRA[typeName]
}

typeforce.compile = compile
typeforce.TfTypeError = TfTypeError
typeforce.TfPropertyTypeError = TfPropertyTypeError

module.exports = typeforce


/***/ }),

/***/ "./node_modules/typeforce/native.js":
/*!******************************************!*\
  !*** ./node_modules/typeforce/native.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var types = {
  Array: function (value) { return value !== null && value !== undefined && value.constructor === Array },
  Boolean: function (value) { return typeof value === 'boolean' },
  Function: function (value) { return typeof value === 'function' },
  Nil: function (value) { return value === undefined || value === null },
  Number: function (value) { return typeof value === 'number' },
  Object: function (value) { return typeof value === 'object' },
  String: function (value) { return typeof value === 'string' },
  '': function () { return true }
}

// TODO: deprecate
types.Null = types.Nil

for (var typeName in types) {
  types[typeName].toJSON = function (t) {
    return t
  }.bind(null, typeName)
}

module.exports = types


/***/ }),

/***/ "./node_modules/varuint-bitcoin/index.js":
/*!***********************************************!*\
  !*** ./node_modules/varuint-bitcoin/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Buffer = __webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer

// Number.MAX_SAFE_INTEGER
var MAX_SAFE_INTEGER = 9007199254740991

function checkUInt53 (n) {
  if (n < 0 || n > MAX_SAFE_INTEGER || n % 1 !== 0) throw new RangeError('value out of range')
}

function encode (number, buffer, offset) {
  checkUInt53(number)

  if (!buffer) buffer = Buffer.allocUnsafe(encodingLength(number))
  if (!Buffer.isBuffer(buffer)) throw new TypeError('buffer must be a Buffer instance')
  if (!offset) offset = 0

  // 8 bit
  if (number < 0xfd) {
    buffer.writeUInt8(number, offset)
    encode.bytes = 1

  // 16 bit
  } else if (number <= 0xffff) {
    buffer.writeUInt8(0xfd, offset)
    buffer.writeUInt16LE(number, offset + 1)
    encode.bytes = 3

  // 32 bit
  } else if (number <= 0xffffffff) {
    buffer.writeUInt8(0xfe, offset)
    buffer.writeUInt32LE(number, offset + 1)
    encode.bytes = 5

  // 64 bit
  } else {
    buffer.writeUInt8(0xff, offset)
    buffer.writeUInt32LE(number >>> 0, offset + 1)
    buffer.writeUInt32LE((number / 0x100000000) | 0, offset + 5)
    encode.bytes = 9
  }

  return buffer
}

function decode (buffer, offset) {
  if (!Buffer.isBuffer(buffer)) throw new TypeError('buffer must be a Buffer instance')
  if (!offset) offset = 0

  var first = buffer.readUInt8(offset)

  // 8 bit
  if (first < 0xfd) {
    decode.bytes = 1
    return first

  // 16 bit
  } else if (first === 0xfd) {
    decode.bytes = 3
    return buffer.readUInt16LE(offset + 1)

  // 32 bit
  } else if (first === 0xfe) {
    decode.bytes = 5
    return buffer.readUInt32LE(offset + 1)

  // 64 bit
  } else {
    decode.bytes = 9
    var lo = buffer.readUInt32LE(offset + 1)
    var hi = buffer.readUInt32LE(offset + 5)
    var number = hi * 0x0100000000 + lo
    checkUInt53(number)

    return number
  }
}

function encodingLength (number) {
  checkUInt53(number)

  return (
    number < 0xfd ? 1
  : number <= 0xffff ? 3
  : number <= 0xffffffff ? 5
  : 9
  )
}

module.exports = { encode: encode, decode: decode, encodingLength: encodingLength }


/***/ }),

/***/ "./node_modules/wif/index.js":
/*!***********************************!*\
  !*** ./node_modules/wif/index.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var bs58check = __webpack_require__(/*! bs58check */ "./node_modules/bs58check/index.js")

function decodeRaw (buffer, version) {
  // check version only if defined
  if (version !== undefined && buffer[0] !== version) throw new Error('Invalid network version')

  // uncompressed
  if (buffer.length === 33) {
    return {
      version: buffer[0],
      privateKey: buffer.slice(1, 33),
      compressed: false
    }
  }

  // invalid length
  if (buffer.length !== 34) throw new Error('Invalid WIF length')

  // invalid compression flag
  if (buffer[33] !== 0x01) throw new Error('Invalid compression flag')

  return {
    version: buffer[0],
    privateKey: buffer.slice(1, 33),
    compressed: true
  }
}

function encodeRaw (version, privateKey, compressed) {
  var result = new Buffer(compressed ? 34 : 33)

  result.writeUInt8(version, 0)
  privateKey.copy(result, 1)

  if (compressed) {
    result[33] = 0x01
  }

  return result
}

function decode (string, version) {
  return decodeRaw(bs58check.decode(string), version)
}

function encode (version, privateKey, compressed) {
  if (typeof version === 'number') return bs58check.encode(encodeRaw(version, privateKey, compressed))

  return bs58check.encode(
    encodeRaw(
      version.version,
      version.privateKey,
      version.compressed
    )
  )
}

module.exports = {
  decode: decode,
  decodeRaw: decodeRaw,
  encode: encode,
  encodeRaw: encodeRaw
}


/***/ }),

/***/ "./wallet/index.ts":
/*!*************************!*\
  !*** ./wallet/index.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// WALLET
//
// Subcommands:
// - new
// - derive-pubkey
// - derive-privkey
// - spend
Object.defineProperty(exports, "__esModule", { value: true });
var bitcoinjs_lib_1 = __webpack_require__(/*! bitcoinjs-lib */ "./node_modules/bitcoinjs-lib/src/index.js");
var crypto_1 = __webpack_require__(/*! crypto */ "crypto");
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


/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2Jhc2UteC9zcmMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JlY2gzMi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmlnaS9saWIvYmlnaS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmlnaS9saWIvY29udmVydC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYmlnaS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpcDY2L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luLW9wcy9tYXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpdGNvaW5qcy1saWIvc3JjL2FkZHJlc3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpdGNvaW5qcy1saWIvc3JjL2Jsb2NrLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy9idWZmZXJ1dGlscy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvY3J5cHRvLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy9lY2RzYS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvZWNwYWlyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy9lY3NpZ25hdHVyZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvaGRub2RlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvbmV0d29ya3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpdGNvaW5qcy1saWIvc3JjL3NjcmlwdC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvc2NyaXB0X251bWJlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvdGVtcGxhdGVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy90ZW1wbGF0ZXMvbXVsdGlzaWcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpdGNvaW5qcy1saWIvc3JjL3RlbXBsYXRlcy9tdWx0aXNpZy9pbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvdGVtcGxhdGVzL211bHRpc2lnL291dHB1dC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvdGVtcGxhdGVzL251bGxkYXRhLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy90ZW1wbGF0ZXMvcHVia2V5L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy90ZW1wbGF0ZXMvcHVia2V5L2lucHV0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy90ZW1wbGF0ZXMvcHVia2V5L291dHB1dC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvdGVtcGxhdGVzL3B1YmtleWhhc2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpdGNvaW5qcy1saWIvc3JjL3RlbXBsYXRlcy9wdWJrZXloYXNoL2lucHV0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy90ZW1wbGF0ZXMvcHVia2V5aGFzaC9vdXRwdXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpdGNvaW5qcy1saWIvc3JjL3RlbXBsYXRlcy9zY3JpcHRoYXNoL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy90ZW1wbGF0ZXMvc2NyaXB0aGFzaC9pbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvdGVtcGxhdGVzL3NjcmlwdGhhc2gvb3V0cHV0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy90ZW1wbGF0ZXMvd2l0bmVzc2NvbW1pdG1lbnQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpdGNvaW5qcy1saWIvc3JjL3RlbXBsYXRlcy93aXRuZXNzY29tbWl0bWVudC9vdXRwdXQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpdGNvaW5qcy1saWIvc3JjL3RlbXBsYXRlcy93aXRuZXNzcHVia2V5aGFzaC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvdGVtcGxhdGVzL3dpdG5lc3NwdWJrZXloYXNoL2lucHV0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy90ZW1wbGF0ZXMvd2l0bmVzc3B1YmtleWhhc2gvb3V0cHV0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iaXRjb2luanMtbGliL3NyYy90ZW1wbGF0ZXMvd2l0bmVzc3NjcmlwdGhhc2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpdGNvaW5qcy1saWIvc3JjL3RlbXBsYXRlcy93aXRuZXNzc2NyaXB0aGFzaC9pbnB1dC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvdGVtcGxhdGVzL3dpdG5lc3NzY3JpcHRoYXNoL291dHB1dC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYml0Y29pbmpzLWxpYi9zcmMvdHJhbnNhY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpdGNvaW5qcy1saWIvc3JjL3RyYW5zYWN0aW9uX2J1aWxkZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2JpdGNvaW5qcy1saWIvc3JjL3R5cGVzLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iczU4L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9iczU4Y2hlY2svYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYnM1OGNoZWNrL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jcmVhdGUtaGFzaC9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY3JlYXRlLWhtYWMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VjdXJ2ZS9saWIvY3VydmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VjdXJ2ZS9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VjdXJ2ZS9saWIvbmFtZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2VjdXJ2ZS9saWIvcG9pbnQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL21lcmtsZS1saWIvZmFzdFJvb3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3B1c2hkYXRhLWJpdGNvaW4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JhbmRvbWJ5dGVzL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9zYWZlLWJ1ZmZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdHlwZWZvcmNlL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvdHlwZWZvcmNlL2V4dHJhLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy90eXBlZm9yY2UvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3R5cGVmb3JjZS9uYXRpdmUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3ZhcnVpbnQtYml0Y29pbi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvd2lmL2luZGV4LmpzIiwid2VicGFjazovLy8uL3dhbGxldC9pbmRleC50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhc3NlcnRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJidWZmZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJjcnlwdG9cIiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLFNBQVM7QUFDckI7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQSxhQUFhLFNBQVM7O0FBRXRCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMEJBQTBCLFFBQVE7QUFDbEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0JBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQTtBQUNBLGVBQWUsWUFBWTtBQUMzQjtBQUNBLEdBQUc7QUFDSDtBQUNBLGVBQWUsU0FBUztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLE9BQU87QUFDL0IsNEJBQTRCLE9BQU87QUFDbkM7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0EsbUNBQW1DLFNBQVM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixRQUFRO0FBQ3RDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHNCQUFzQjtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7Ozs7Ozs7Ozs7O0FDM1RBLGFBQWEsbUJBQU8sQ0FBQyw0REFBVTs7QUFFL0IsZ0JBQWdCLG1CQUFPLENBQUMsd0VBQWE7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLHNFQUFlOztBQUV0QyxTQUFTLG1CQUFPLENBQUMsMERBQVM7QUFDMUIsVUFBVSxtQkFBTyxDQUFDLDREQUFVO0FBQzVCLGVBQWUsbUJBQU8sQ0FBQyxzRUFBZTtBQUN0QyxVQUFVLG1CQUFPLENBQUMsNERBQVU7QUFDNUIsZUFBZSxtQkFBTyxDQUFDLHNFQUFlO0FBQ3RDLHNCQUFzQixtQkFBTyxDQUFDLHNGQUF1Qjs7QUFFckQsV0FBVyxtQkFBTyxDQUFDLDhEQUFXO0FBQzlCLFVBQVUsbUJBQU8sQ0FBQyw0REFBVTtBQUM1QixZQUFZLG1CQUFPLENBQUMsZ0VBQVk7QUFDaEMsV0FBVyxtQkFBTyxDQUFDLDBEQUFhO0FBQ2hDO0FBQ0E7Ozs7Ozs7Ozs7OztBQ3RCQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDcENBLGFBQWEsbUJBQU8sQ0FBQyx3REFBYTtBQUNsQyxZQUFZLG1CQUFPLENBQUMsNENBQU87QUFDM0IsZUFBZSxtQkFBTyxDQUFDLGtFQUFrQjtBQUN6QyxnQkFBZ0IsbUJBQU8sQ0FBQyxvREFBVztBQUNuQyxZQUFZLG1CQUFPLENBQUMsMERBQVM7QUFDN0IsbUJBQW1CLG1CQUFPLENBQUMsMEVBQWlCOztBQUU1QyxVQUFVLG1CQUFPLENBQUMsMERBQWE7QUFDL0Isa0JBQWtCLG1CQUFPLENBQUMsMERBQWlCO0FBQzNDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBVSxtQkFBTyxDQUFDLDBFQUFpQjs7QUFFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDck5BLGFBQWEsbUJBQU8sQ0FBQyx3REFBYTs7QUFFbEM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FB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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEscUJBQXFCO0FBQ3JCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QyxtQkFBbUI7QUFDNUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLHFEQUFxRCx3QkFBd0I7QUFDN0U7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsK0NBQStDLFdBQVc7QUFDMUQsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNB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QUMsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDekMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbkQsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdEMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQy9EO1lBQ0QsT0FBTyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDOzs7Ozs7Ozs7Ozs7QUM3RkQsbUM7Ozs7Ozs7Ozs7O0FDQUEsbUM7Ozs7Ozs7Ozs7O0FDQUEsbUMiLCJmaWxlIjoid2FsbGV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi93YWxsZXQvaW5kZXgudHNcIik7XG4iLCIndXNlIHN0cmljdCdcbi8vIGJhc2UteCBlbmNvZGluZyAvIGRlY29kaW5nXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTggYmFzZS14IGNvbnRyaWJ1dG9yc1xuLy8gQ29weXJpZ2h0IChjKSAyMDE0LTIwMTggVGhlIEJpdGNvaW4gQ29yZSBkZXZlbG9wZXJzIChiYXNlNTguY3BwKVxuLy8gRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBzb2Z0d2FyZSBsaWNlbnNlLCBzZWUgdGhlIGFjY29tcGFueWluZ1xuLy8gZmlsZSBMSUNFTlNFIG9yIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwLlxuLy8gQHRzLWlnbm9yZVxudmFyIF9CdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxuZnVuY3Rpb24gYmFzZSAoQUxQSEFCRVQpIHtcbiAgaWYgKEFMUEhBQkVULmxlbmd0aCA+PSAyNTUpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQWxwaGFiZXQgdG9vIGxvbmcnKSB9XG4gIHZhciBCQVNFX01BUCA9IG5ldyBVaW50OEFycmF5KDI1NilcbiAgQkFTRV9NQVAuZmlsbCgyNTUpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgQUxQSEFCRVQubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgeCA9IEFMUEhBQkVULmNoYXJBdChpKVxuICAgIHZhciB4YyA9IHguY2hhckNvZGVBdCgwKVxuICAgIGlmIChCQVNFX01BUFt4Y10gIT09IDI1NSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKHggKyAnIGlzIGFtYmlndW91cycpIH1cbiAgICBCQVNFX01BUFt4Y10gPSBpXG4gIH1cbiAgdmFyIEJBU0UgPSBBTFBIQUJFVC5sZW5ndGhcbiAgdmFyIExFQURFUiA9IEFMUEhBQkVULmNoYXJBdCgwKVxuICB2YXIgRkFDVE9SID0gTWF0aC5sb2coQkFTRSkgLyBNYXRoLmxvZygyNTYpIC8vIGxvZyhCQVNFKSAvIGxvZygyNTYpLCByb3VuZGVkIHVwXG4gIHZhciBpRkFDVE9SID0gTWF0aC5sb2coMjU2KSAvIE1hdGgubG9nKEJBU0UpIC8vIGxvZygyNTYpIC8gbG9nKEJBU0UpLCByb3VuZGVkIHVwXG4gIGZ1bmN0aW9uIGVuY29kZSAoc291cmNlKSB7XG4gICAgaWYgKCFfQnVmZmVyLmlzQnVmZmVyKHNvdXJjZSkpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgQnVmZmVyJykgfVxuICAgIGlmIChzb3VyY2UubGVuZ3RoID09PSAwKSB7IHJldHVybiAnJyB9XG4gICAgICAgIC8vIFNraXAgJiBjb3VudCBsZWFkaW5nIHplcm9lcy5cbiAgICB2YXIgemVyb2VzID0gMFxuICAgIHZhciBsZW5ndGggPSAwXG4gICAgdmFyIHBiZWdpbiA9IDBcbiAgICB2YXIgcGVuZCA9IHNvdXJjZS5sZW5ndGhcbiAgICB3aGlsZSAocGJlZ2luICE9PSBwZW5kICYmIHNvdXJjZVtwYmVnaW5dID09PSAwKSB7XG4gICAgICBwYmVnaW4rK1xuICAgICAgemVyb2VzKytcbiAgICB9XG4gICAgICAgIC8vIEFsbG9jYXRlIGVub3VnaCBzcGFjZSBpbiBiaWctZW5kaWFuIGJhc2U1OCByZXByZXNlbnRhdGlvbi5cbiAgICB2YXIgc2l6ZSA9ICgocGVuZCAtIHBiZWdpbikgKiBpRkFDVE9SICsgMSkgPj4+IDBcbiAgICB2YXIgYjU4ID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSlcbiAgICAgICAgLy8gUHJvY2VzcyB0aGUgYnl0ZXMuXG4gICAgd2hpbGUgKHBiZWdpbiAhPT0gcGVuZCkge1xuICAgICAgdmFyIGNhcnJ5ID0gc291cmNlW3BiZWdpbl1cbiAgICAgICAgICAgIC8vIEFwcGx5IFwiYjU4ID0gYjU4ICogMjU2ICsgY2hcIi5cbiAgICAgIHZhciBpID0gMFxuICAgICAgZm9yICh2YXIgaXQxID0gc2l6ZSAtIDE7IChjYXJyeSAhPT0gMCB8fCBpIDwgbGVuZ3RoKSAmJiAoaXQxICE9PSAtMSk7IGl0MS0tLCBpKyspIHtcbiAgICAgICAgY2FycnkgKz0gKDI1NiAqIGI1OFtpdDFdKSA+Pj4gMFxuICAgICAgICBiNThbaXQxXSA9IChjYXJyeSAlIEJBU0UpID4+PiAwXG4gICAgICAgIGNhcnJ5ID0gKGNhcnJ5IC8gQkFTRSkgPj4+IDBcbiAgICAgIH1cbiAgICAgIGlmIChjYXJyeSAhPT0gMCkgeyB0aHJvdyBuZXcgRXJyb3IoJ05vbi16ZXJvIGNhcnJ5JykgfVxuICAgICAgbGVuZ3RoID0gaVxuICAgICAgcGJlZ2luKytcbiAgICB9XG4gICAgICAgIC8vIFNraXAgbGVhZGluZyB6ZXJvZXMgaW4gYmFzZTU4IHJlc3VsdC5cbiAgICB2YXIgaXQyID0gc2l6ZSAtIGxlbmd0aFxuICAgIHdoaWxlIChpdDIgIT09IHNpemUgJiYgYjU4W2l0Ml0gPT09IDApIHtcbiAgICAgIGl0MisrXG4gICAgfVxuICAgICAgICAvLyBUcmFuc2xhdGUgdGhlIHJlc3VsdCBpbnRvIGEgc3RyaW5nLlxuICAgIHZhciBzdHIgPSBMRUFERVIucmVwZWF0KHplcm9lcylcbiAgICBmb3IgKDsgaXQyIDwgc2l6ZTsgKytpdDIpIHsgc3RyICs9IEFMUEhBQkVULmNoYXJBdChiNThbaXQyXSkgfVxuICAgIHJldHVybiBzdHJcbiAgfVxuICBmdW5jdGlvbiBkZWNvZGVVbnNhZmUgKHNvdXJjZSkge1xuICAgIGlmICh0eXBlb2Ygc291cmNlICE9PSAnc3RyaW5nJykgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBTdHJpbmcnKSB9XG4gICAgaWYgKHNvdXJjZS5sZW5ndGggPT09IDApIHsgcmV0dXJuIF9CdWZmZXIuYWxsb2MoMCkgfVxuICAgIHZhciBwc3ogPSAwXG4gICAgICAgIC8vIFNraXAgbGVhZGluZyBzcGFjZXMuXG4gICAgaWYgKHNvdXJjZVtwc3pdID09PSAnICcpIHsgcmV0dXJuIH1cbiAgICAgICAgLy8gU2tpcCBhbmQgY291bnQgbGVhZGluZyAnMSdzLlxuICAgIHZhciB6ZXJvZXMgPSAwXG4gICAgdmFyIGxlbmd0aCA9IDBcbiAgICB3aGlsZSAoc291cmNlW3Bzel0gPT09IExFQURFUikge1xuICAgICAgemVyb2VzKytcbiAgICAgIHBzeisrXG4gICAgfVxuICAgICAgICAvLyBBbGxvY2F0ZSBlbm91Z2ggc3BhY2UgaW4gYmlnLWVuZGlhbiBiYXNlMjU2IHJlcHJlc2VudGF0aW9uLlxuICAgIHZhciBzaXplID0gKCgoc291cmNlLmxlbmd0aCAtIHBzeikgKiBGQUNUT1IpICsgMSkgPj4+IDAgLy8gbG9nKDU4KSAvIGxvZygyNTYpLCByb3VuZGVkIHVwLlxuICAgIHZhciBiMjU2ID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSlcbiAgICAgICAgLy8gUHJvY2VzcyB0aGUgY2hhcmFjdGVycy5cbiAgICB3aGlsZSAoc291cmNlW3Bzel0pIHtcbiAgICAgICAgICAgIC8vIERlY29kZSBjaGFyYWN0ZXJcbiAgICAgIHZhciBjYXJyeSA9IEJBU0VfTUFQW3NvdXJjZS5jaGFyQ29kZUF0KHBzeildXG4gICAgICAgICAgICAvLyBJbnZhbGlkIGNoYXJhY3RlclxuICAgICAgaWYgKGNhcnJ5ID09PSAyNTUpIHsgcmV0dXJuIH1cbiAgICAgIHZhciBpID0gMFxuICAgICAgZm9yICh2YXIgaXQzID0gc2l6ZSAtIDE7IChjYXJyeSAhPT0gMCB8fCBpIDwgbGVuZ3RoKSAmJiAoaXQzICE9PSAtMSk7IGl0My0tLCBpKyspIHtcbiAgICAgICAgY2FycnkgKz0gKEJBU0UgKiBiMjU2W2l0M10pID4+PiAwXG4gICAgICAgIGIyNTZbaXQzXSA9IChjYXJyeSAlIDI1NikgPj4+IDBcbiAgICAgICAgY2FycnkgPSAoY2FycnkgLyAyNTYpID4+PiAwXG4gICAgICB9XG4gICAgICBpZiAoY2FycnkgIT09IDApIHsgdGhyb3cgbmV3IEVycm9yKCdOb24temVybyBjYXJyeScpIH1cbiAgICAgIGxlbmd0aCA9IGlcbiAgICAgIHBzeisrXG4gICAgfVxuICAgICAgICAvLyBTa2lwIHRyYWlsaW5nIHNwYWNlcy5cbiAgICBpZiAoc291cmNlW3Bzel0gPT09ICcgJykgeyByZXR1cm4gfVxuICAgICAgICAvLyBTa2lwIGxlYWRpbmcgemVyb2VzIGluIGIyNTYuXG4gICAgdmFyIGl0NCA9IHNpemUgLSBsZW5ndGhcbiAgICB3aGlsZSAoaXQ0ICE9PSBzaXplICYmIGIyNTZbaXQ0XSA9PT0gMCkge1xuICAgICAgaXQ0KytcbiAgICB9XG4gICAgdmFyIHZjaCA9IF9CdWZmZXIuYWxsb2NVbnNhZmUoemVyb2VzICsgKHNpemUgLSBpdDQpKVxuICAgIHZjaC5maWxsKDB4MDAsIDAsIHplcm9lcylcbiAgICB2YXIgaiA9IHplcm9lc1xuICAgIHdoaWxlIChpdDQgIT09IHNpemUpIHtcbiAgICAgIHZjaFtqKytdID0gYjI1NltpdDQrK11cbiAgICB9XG4gICAgcmV0dXJuIHZjaFxuICB9XG4gIGZ1bmN0aW9uIGRlY29kZSAoc3RyaW5nKSB7XG4gICAgdmFyIGJ1ZmZlciA9IGRlY29kZVVuc2FmZShzdHJpbmcpXG4gICAgaWYgKGJ1ZmZlcikgeyByZXR1cm4gYnVmZmVyIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vbi1iYXNlJyArIEJBU0UgKyAnIGNoYXJhY3RlcicpXG4gIH1cbiAgcmV0dXJuIHtcbiAgICBlbmNvZGU6IGVuY29kZSxcbiAgICBkZWNvZGVVbnNhZmU6IGRlY29kZVVuc2FmZSxcbiAgICBkZWNvZGU6IGRlY29kZVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VcbiIsIid1c2Ugc3RyaWN0J1xudmFyIEFMUEhBQkVUID0gJ3FwenJ5OXg4Z2YydHZkdzBzM2puNTRraGNlNm11YTdsJ1xuXG4vLyBwcmUtY29tcHV0ZSBsb29rdXAgdGFibGVcbnZhciBBTFBIQUJFVF9NQVAgPSB7fVxuZm9yICh2YXIgeiA9IDA7IHogPCBBTFBIQUJFVC5sZW5ndGg7IHorKykge1xuICB2YXIgeCA9IEFMUEhBQkVULmNoYXJBdCh6KVxuXG4gIGlmIChBTFBIQUJFVF9NQVBbeF0gIT09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IFR5cGVFcnJvcih4ICsgJyBpcyBhbWJpZ3VvdXMnKVxuICBBTFBIQUJFVF9NQVBbeF0gPSB6XG59XG5cbmZ1bmN0aW9uIHBvbHltb2RTdGVwIChwcmUpIHtcbiAgdmFyIGIgPSBwcmUgPj4gMjVcbiAgcmV0dXJuICgocHJlICYgMHgxRkZGRkZGKSA8PCA1KSBeXG4gICAgKC0oKGIgPj4gMCkgJiAxKSAmIDB4M2I2YTU3YjIpIF5cbiAgICAoLSgoYiA+PiAxKSAmIDEpICYgMHgyNjUwOGU2ZCkgXlxuICAgICgtKChiID4+IDIpICYgMSkgJiAweDFlYTExOWZhKSBeXG4gICAgKC0oKGIgPj4gMykgJiAxKSAmIDB4M2Q0MjMzZGQpIF5cbiAgICAoLSgoYiA+PiA0KSAmIDEpICYgMHgyYTE0NjJiMylcbn1cblxuZnVuY3Rpb24gcHJlZml4Q2hrIChwcmVmaXgpIHtcbiAgdmFyIGNoayA9IDFcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmVmaXgubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYyA9IHByZWZpeC5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGMgPCAzMyB8fCBjID4gMTI2KSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgcHJlZml4ICgnICsgcHJlZml4ICsgJyknKVxuXG4gICAgY2hrID0gcG9seW1vZFN0ZXAoY2hrKSBeIChjID4+IDUpXG4gIH1cbiAgY2hrID0gcG9seW1vZFN0ZXAoY2hrKVxuXG4gIGZvciAoaSA9IDA7IGkgPCBwcmVmaXgubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgdiA9IHByZWZpeC5jaGFyQ29kZUF0KGkpXG4gICAgY2hrID0gcG9seW1vZFN0ZXAoY2hrKSBeICh2ICYgMHgxZilcbiAgfVxuICByZXR1cm4gY2hrXG59XG5cbmZ1bmN0aW9uIGVuY29kZSAocHJlZml4LCB3b3JkcywgTElNSVQpIHtcbiAgTElNSVQgPSBMSU1JVCB8fCA5MFxuICBpZiAoKHByZWZpeC5sZW5ndGggKyA3ICsgd29yZHMubGVuZ3RoKSA+IExJTUlUKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdFeGNlZWRzIGxlbmd0aCBsaW1pdCcpXG5cbiAgcHJlZml4ID0gcHJlZml4LnRvTG93ZXJDYXNlKClcblxuICAvLyBkZXRlcm1pbmUgY2hrIG1vZFxuICB2YXIgY2hrID0gcHJlZml4Q2hrKHByZWZpeClcbiAgdmFyIHJlc3VsdCA9IHByZWZpeCArICcxJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHdvcmRzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHggPSB3b3Jkc1tpXVxuICAgIGlmICgoeCA+PiA1KSAhPT0gMCkgdGhyb3cgbmV3IEVycm9yKCdOb24gNS1iaXQgd29yZCcpXG5cbiAgICBjaGsgPSBwb2x5bW9kU3RlcChjaGspIF4geFxuICAgIHJlc3VsdCArPSBBTFBIQUJFVC5jaGFyQXQoeClcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCA2OyArK2kpIHtcbiAgICBjaGsgPSBwb2x5bW9kU3RlcChjaGspXG4gIH1cbiAgY2hrIF49IDFcblxuICBmb3IgKGkgPSAwOyBpIDwgNjsgKytpKSB7XG4gICAgdmFyIHYgPSAoY2hrID4+ICgoNSAtIGkpICogNSkpICYgMHgxZlxuICAgIHJlc3VsdCArPSBBTFBIQUJFVC5jaGFyQXQodilcbiAgfVxuXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gZGVjb2RlIChzdHIsIExJTUlUKSB7XG4gIExJTUlUID0gTElNSVQgfHwgOTBcbiAgaWYgKHN0ci5sZW5ndGggPCA4KSB0aHJvdyBuZXcgVHlwZUVycm9yKHN0ciArICcgdG9vIHNob3J0JylcbiAgaWYgKHN0ci5sZW5ndGggPiBMSU1JVCkgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhjZWVkcyBsZW5ndGggbGltaXQnKVxuXG4gIC8vIGRvbid0IGFsbG93IG1peGVkIGNhc2VcbiAgdmFyIGxvd2VyZWQgPSBzdHIudG9Mb3dlckNhc2UoKVxuICB2YXIgdXBwZXJlZCA9IHN0ci50b1VwcGVyQ2FzZSgpXG4gIGlmIChzdHIgIT09IGxvd2VyZWQgJiYgc3RyICE9PSB1cHBlcmVkKSB0aHJvdyBuZXcgRXJyb3IoJ01peGVkLWNhc2Ugc3RyaW5nICcgKyBzdHIpXG4gIHN0ciA9IGxvd2VyZWRcblxuICB2YXIgc3BsaXQgPSBzdHIubGFzdEluZGV4T2YoJzEnKVxuICBpZiAoc3BsaXQgPT09IC0xKSB0aHJvdyBuZXcgRXJyb3IoJ05vIHNlcGFyYXRvciBjaGFyYWN0ZXIgZm9yICcgKyBzdHIpXG4gIGlmIChzcGxpdCA9PT0gMCkgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHByZWZpeCBmb3IgJyArIHN0cilcblxuICB2YXIgcHJlZml4ID0gc3RyLnNsaWNlKDAsIHNwbGl0KVxuICB2YXIgd29yZENoYXJzID0gc3RyLnNsaWNlKHNwbGl0ICsgMSlcbiAgaWYgKHdvcmRDaGFycy5sZW5ndGggPCA2KSB0aHJvdyBuZXcgRXJyb3IoJ0RhdGEgdG9vIHNob3J0JylcblxuICB2YXIgY2hrID0gcHJlZml4Q2hrKHByZWZpeClcbiAgdmFyIHdvcmRzID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB3b3JkQ2hhcnMubGVuZ3RoOyArK2kpIHtcbiAgICB2YXIgYyA9IHdvcmRDaGFycy5jaGFyQXQoaSlcbiAgICB2YXIgdiA9IEFMUEhBQkVUX01BUFtjXVxuICAgIGlmICh2ID09PSB1bmRlZmluZWQpIHRocm93IG5ldyBFcnJvcignVW5rbm93biBjaGFyYWN0ZXIgJyArIGMpXG4gICAgY2hrID0gcG9seW1vZFN0ZXAoY2hrKSBeIHZcblxuICAgIC8vIG5vdCBpbiB0aGUgY2hlY2tzdW0/XG4gICAgaWYgKGkgKyA2ID49IHdvcmRDaGFycy5sZW5ndGgpIGNvbnRpbnVlXG4gICAgd29yZHMucHVzaCh2KVxuICB9XG5cbiAgaWYgKGNoayAhPT0gMSkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNoZWNrc3VtIGZvciAnICsgc3RyKVxuICByZXR1cm4geyBwcmVmaXg6IHByZWZpeCwgd29yZHM6IHdvcmRzIH1cbn1cblxuZnVuY3Rpb24gY29udmVydCAoZGF0YSwgaW5CaXRzLCBvdXRCaXRzLCBwYWQpIHtcbiAgdmFyIHZhbHVlID0gMFxuICB2YXIgYml0cyA9IDBcbiAgdmFyIG1heFYgPSAoMSA8PCBvdXRCaXRzKSAtIDFcblxuICB2YXIgcmVzdWx0ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgKytpKSB7XG4gICAgdmFsdWUgPSAodmFsdWUgPDwgaW5CaXRzKSB8IGRhdGFbaV1cbiAgICBiaXRzICs9IGluQml0c1xuXG4gICAgd2hpbGUgKGJpdHMgPj0gb3V0Qml0cykge1xuICAgICAgYml0cyAtPSBvdXRCaXRzXG4gICAgICByZXN1bHQucHVzaCgodmFsdWUgPj4gYml0cykgJiBtYXhWKVxuICAgIH1cbiAgfVxuXG4gIGlmIChwYWQpIHtcbiAgICBpZiAoYml0cyA+IDApIHtcbiAgICAgIHJlc3VsdC5wdXNoKCh2YWx1ZSA8PCAob3V0Qml0cyAtIGJpdHMpKSAmIG1heFYpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChiaXRzID49IGluQml0cykgdGhyb3cgbmV3IEVycm9yKCdFeGNlc3MgcGFkZGluZycpXG4gICAgaWYgKCh2YWx1ZSA8PCAob3V0Qml0cyAtIGJpdHMpKSAmIG1heFYpIHRocm93IG5ldyBFcnJvcignTm9uLXplcm8gcGFkZGluZycpXG4gIH1cblxuICByZXR1cm4gcmVzdWx0XG59XG5cbmZ1bmN0aW9uIHRvV29yZHMgKGJ5dGVzKSB7XG4gIHJldHVybiBjb252ZXJ0KGJ5dGVzLCA4LCA1LCB0cnVlKVxufVxuXG5mdW5jdGlvbiBmcm9tV29yZHMgKHdvcmRzKSB7XG4gIHJldHVybiBjb252ZXJ0KHdvcmRzLCA1LCA4LCBmYWxzZSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlY29kZTogZGVjb2RlLFxuICBlbmNvZGU6IGVuY29kZSxcbiAgdG9Xb3JkczogdG9Xb3JkcyxcbiAgZnJvbVdvcmRzOiBmcm9tV29yZHNcbn1cbiIsIi8vIChwdWJsaWMpIENvbnN0cnVjdG9yXG5mdW5jdGlvbiBCaWdJbnRlZ2VyKGEsIGIsIGMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJpZ0ludGVnZXIpKVxuICAgIHJldHVybiBuZXcgQmlnSW50ZWdlcihhLCBiLCBjKVxuXG4gIGlmIChhICE9IG51bGwpIHtcbiAgICBpZiAoXCJudW1iZXJcIiA9PSB0eXBlb2YgYSkgdGhpcy5mcm9tTnVtYmVyKGEsIGIsIGMpXG4gICAgZWxzZSBpZiAoYiA9PSBudWxsICYmIFwic3RyaW5nXCIgIT0gdHlwZW9mIGEpIHRoaXMuZnJvbVN0cmluZyhhLCAyNTYpXG4gICAgZWxzZSB0aGlzLmZyb21TdHJpbmcoYSwgYilcbiAgfVxufVxuXG52YXIgcHJvdG8gPSBCaWdJbnRlZ2VyLnByb3RvdHlwZVxuXG4vLyBkdWNrLXR5cGVkIGlzQmlnSW50ZWdlclxucHJvdG8uX19iaWdpID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvblxuQmlnSW50ZWdlci5pc0JpZ0ludGVnZXIgPSBmdW5jdGlvbiAob2JqLCBjaGVja192ZXIpIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmouX19iaWdpICYmICghY2hlY2tfdmVyIHx8IG9iai5fX2JpZ2kgPT09IHByb3RvLl9fYmlnaSlcbn1cblxuLy8gQml0cyBwZXIgZGlnaXRcbnZhciBkYml0c1xuXG4vLyBhbTogQ29tcHV0ZSB3X2ogKz0gKHgqdGhpc19pKSwgcHJvcGFnYXRlIGNhcnJpZXMsXG4vLyBjIGlzIGluaXRpYWwgY2FycnksIHJldHVybnMgZmluYWwgY2FycnkuXG4vLyBjIDwgMypkdmFsdWUsIHggPCAyKmR2YWx1ZSwgdGhpc19pIDwgZHZhbHVlXG4vLyBXZSBuZWVkIHRvIHNlbGVjdCB0aGUgZmFzdGVzdCBvbmUgdGhhdCB3b3JrcyBpbiB0aGlzIGVudmlyb25tZW50LlxuXG4vLyBhbTE6IHVzZSBhIHNpbmdsZSBtdWx0IGFuZCBkaXZpZGUgdG8gZ2V0IHRoZSBoaWdoIGJpdHMsXG4vLyBtYXggZGlnaXQgYml0cyBzaG91bGQgYmUgMjYgYmVjYXVzZVxuLy8gbWF4IGludGVybmFsIHZhbHVlID0gMipkdmFsdWVeMi0yKmR2YWx1ZSAoPCAyXjUzKVxuZnVuY3Rpb24gYW0xKGksIHgsIHcsIGosIGMsIG4pIHtcbiAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgdmFyIHYgPSB4ICogdGhpc1tpKytdICsgd1tqXSArIGNcbiAgICBjID0gTWF0aC5mbG9vcih2IC8gMHg0MDAwMDAwKVxuICAgIHdbaisrXSA9IHYgJiAweDNmZmZmZmZcbiAgfVxuICByZXR1cm4gY1xufVxuLy8gYW0yIGF2b2lkcyBhIGJpZyBtdWx0LWFuZC1leHRyYWN0IGNvbXBsZXRlbHkuXG4vLyBNYXggZGlnaXQgYml0cyBzaG91bGQgYmUgPD0gMzAgYmVjYXVzZSB3ZSBkbyBiaXR3aXNlIG9wc1xuLy8gb24gdmFsdWVzIHVwIHRvIDIqaGR2YWx1ZV4yLWhkdmFsdWUtMSAoPCAyXjMxKVxuZnVuY3Rpb24gYW0yKGksIHgsIHcsIGosIGMsIG4pIHtcbiAgdmFyIHhsID0geCAmIDB4N2ZmZixcbiAgICB4aCA9IHggPj4gMTVcbiAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgdmFyIGwgPSB0aGlzW2ldICYgMHg3ZmZmXG4gICAgdmFyIGggPSB0aGlzW2krK10gPj4gMTVcbiAgICB2YXIgbSA9IHhoICogbCArIGggKiB4bFxuICAgIGwgPSB4bCAqIGwgKyAoKG0gJiAweDdmZmYpIDw8IDE1KSArIHdbal0gKyAoYyAmIDB4M2ZmZmZmZmYpXG4gICAgYyA9IChsID4+PiAzMCkgKyAobSA+Pj4gMTUpICsgeGggKiBoICsgKGMgPj4+IDMwKVxuICAgIHdbaisrXSA9IGwgJiAweDNmZmZmZmZmXG4gIH1cbiAgcmV0dXJuIGNcbn1cbi8vIEFsdGVybmF0ZWx5LCBzZXQgbWF4IGRpZ2l0IGJpdHMgdG8gMjggc2luY2Ugc29tZVxuLy8gYnJvd3NlcnMgc2xvdyBkb3duIHdoZW4gZGVhbGluZyB3aXRoIDMyLWJpdCBudW1iZXJzLlxuZnVuY3Rpb24gYW0zKGksIHgsIHcsIGosIGMsIG4pIHtcbiAgdmFyIHhsID0geCAmIDB4M2ZmZixcbiAgICB4aCA9IHggPj4gMTRcbiAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgdmFyIGwgPSB0aGlzW2ldICYgMHgzZmZmXG4gICAgdmFyIGggPSB0aGlzW2krK10gPj4gMTRcbiAgICB2YXIgbSA9IHhoICogbCArIGggKiB4bFxuICAgIGwgPSB4bCAqIGwgKyAoKG0gJiAweDNmZmYpIDw8IDE0KSArIHdbal0gKyBjXG4gICAgYyA9IChsID4+IDI4KSArIChtID4+IDE0KSArIHhoICogaFxuICAgIHdbaisrXSA9IGwgJiAweGZmZmZmZmZcbiAgfVxuICByZXR1cm4gY1xufVxuXG4vLyB3dGY/XG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5hbSA9IGFtMVxuZGJpdHMgPSAyNlxuXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5EQiA9IGRiaXRzXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5ETSA9ICgoMSA8PCBkYml0cykgLSAxKVxudmFyIERWID0gQmlnSW50ZWdlci5wcm90b3R5cGUuRFYgPSAoMSA8PCBkYml0cylcblxudmFyIEJJX0ZQID0gNTJcbkJpZ0ludGVnZXIucHJvdG90eXBlLkZWID0gTWF0aC5wb3coMiwgQklfRlApXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS5GMSA9IEJJX0ZQIC0gZGJpdHNcbkJpZ0ludGVnZXIucHJvdG90eXBlLkYyID0gMiAqIGRiaXRzIC0gQklfRlBcblxuLy8gRGlnaXQgY29udmVyc2lvbnNcbnZhciBCSV9STSA9IFwiMDEyMzQ1Njc4OWFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6XCJcbnZhciBCSV9SQyA9IG5ldyBBcnJheSgpXG52YXIgcnIsIHZ2XG5yciA9IFwiMFwiLmNoYXJDb2RlQXQoMClcbmZvciAodnYgPSAwOyB2diA8PSA5OyArK3Z2KSBCSV9SQ1tycisrXSA9IHZ2XG5yciA9IFwiYVwiLmNoYXJDb2RlQXQoMClcbmZvciAodnYgPSAxMDsgdnYgPCAzNjsgKyt2dikgQklfUkNbcnIrK10gPSB2dlxucnIgPSBcIkFcIi5jaGFyQ29kZUF0KDApXG5mb3IgKHZ2ID0gMTA7IHZ2IDwgMzY7ICsrdnYpIEJJX1JDW3JyKytdID0gdnZcblxuZnVuY3Rpb24gaW50MmNoYXIobikge1xuICByZXR1cm4gQklfUk0uY2hhckF0KG4pXG59XG5cbmZ1bmN0aW9uIGludEF0KHMsIGkpIHtcbiAgdmFyIGMgPSBCSV9SQ1tzLmNoYXJDb2RlQXQoaSldXG4gIHJldHVybiAoYyA9PSBudWxsKSA/IC0xIDogY1xufVxuXG4vLyAocHJvdGVjdGVkKSBjb3B5IHRoaXMgdG8gclxuZnVuY3Rpb24gYm5wQ29weVRvKHIpIHtcbiAgZm9yICh2YXIgaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSByW2ldID0gdGhpc1tpXVxuICByLnQgPSB0aGlzLnRcbiAgci5zID0gdGhpcy5zXG59XG5cbi8vIChwcm90ZWN0ZWQpIHNldCBmcm9tIGludGVnZXIgdmFsdWUgeCwgLURWIDw9IHggPCBEVlxuZnVuY3Rpb24gYm5wRnJvbUludCh4KSB7XG4gIHRoaXMudCA9IDFcbiAgdGhpcy5zID0gKHggPCAwKSA/IC0xIDogMFxuICBpZiAoeCA+IDApIHRoaXNbMF0gPSB4XG4gIGVsc2UgaWYgKHggPCAtMSkgdGhpc1swXSA9IHggKyBEVlxuICBlbHNlIHRoaXMudCA9IDBcbn1cblxuLy8gcmV0dXJuIGJpZ2ludCBpbml0aWFsaXplZCB0byB2YWx1ZVxuZnVuY3Rpb24gbmJ2KGkpIHtcbiAgdmFyIHIgPSBuZXcgQmlnSW50ZWdlcigpXG4gIHIuZnJvbUludChpKVxuICByZXR1cm4gclxufVxuXG4vLyAocHJvdGVjdGVkKSBzZXQgZnJvbSBzdHJpbmcgYW5kIHJhZGl4XG5mdW5jdGlvbiBibnBGcm9tU3RyaW5nKHMsIGIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgdmFyIGtcbiAgaWYgKGIgPT0gMTYpIGsgPSA0XG4gIGVsc2UgaWYgKGIgPT0gOCkgayA9IDNcbiAgZWxzZSBpZiAoYiA9PSAyNTYpIGsgPSA4OyAvLyBieXRlIGFycmF5XG4gIGVsc2UgaWYgKGIgPT0gMikgayA9IDFcbiAgZWxzZSBpZiAoYiA9PSAzMikgayA9IDVcbiAgZWxzZSBpZiAoYiA9PSA0KSBrID0gMlxuICBlbHNlIHtcbiAgICBzZWxmLmZyb21SYWRpeChzLCBiKVxuICAgIHJldHVyblxuICB9XG4gIHNlbGYudCA9IDBcbiAgc2VsZi5zID0gMFxuICB2YXIgaSA9IHMubGVuZ3RoLFxuICAgIG1pID0gZmFsc2UsXG4gICAgc2ggPSAwXG4gIHdoaWxlICgtLWkgPj0gMCkge1xuICAgIHZhciB4ID0gKGsgPT0gOCkgPyBzW2ldICYgMHhmZiA6IGludEF0KHMsIGkpXG4gICAgaWYgKHggPCAwKSB7XG4gICAgICBpZiAocy5jaGFyQXQoaSkgPT0gXCItXCIpIG1pID0gdHJ1ZVxuICAgICAgY29udGludWVcbiAgICB9XG4gICAgbWkgPSBmYWxzZVxuICAgIGlmIChzaCA9PSAwKVxuICAgICAgc2VsZltzZWxmLnQrK10gPSB4XG4gICAgZWxzZSBpZiAoc2ggKyBrID4gc2VsZi5EQikge1xuICAgICAgc2VsZltzZWxmLnQgLSAxXSB8PSAoeCAmICgoMSA8PCAoc2VsZi5EQiAtIHNoKSkgLSAxKSkgPDwgc2hcbiAgICAgIHNlbGZbc2VsZi50KytdID0gKHggPj4gKHNlbGYuREIgLSBzaCkpXG4gICAgfSBlbHNlXG4gICAgICBzZWxmW3NlbGYudCAtIDFdIHw9IHggPDwgc2hcbiAgICBzaCArPSBrXG4gICAgaWYgKHNoID49IHNlbGYuREIpIHNoIC09IHNlbGYuREJcbiAgfVxuICBpZiAoayA9PSA4ICYmIChzWzBdICYgMHg4MCkgIT0gMCkge1xuICAgIHNlbGYucyA9IC0xXG4gICAgaWYgKHNoID4gMCkgc2VsZltzZWxmLnQgLSAxXSB8PSAoKDEgPDwgKHNlbGYuREIgLSBzaCkpIC0gMSkgPDwgc2hcbiAgfVxuICBzZWxmLmNsYW1wKClcbiAgaWYgKG1pKSBCaWdJbnRlZ2VyLlpFUk8uc3ViVG8oc2VsZiwgc2VsZilcbn1cblxuLy8gKHByb3RlY3RlZCkgY2xhbXAgb2ZmIGV4Y2VzcyBoaWdoIHdvcmRzXG5mdW5jdGlvbiBibnBDbGFtcCgpIHtcbiAgdmFyIGMgPSB0aGlzLnMgJiB0aGlzLkRNXG4gIHdoaWxlICh0aGlzLnQgPiAwICYmIHRoaXNbdGhpcy50IC0gMV0gPT0gYyktLXRoaXMudFxufVxuXG4vLyAocHVibGljKSByZXR1cm4gc3RyaW5nIHJlcHJlc2VudGF0aW9uIGluIGdpdmVuIHJhZGl4XG5mdW5jdGlvbiBiblRvU3RyaW5nKGIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIGlmIChzZWxmLnMgPCAwKSByZXR1cm4gXCItXCIgKyBzZWxmLm5lZ2F0ZSgpXG4gICAgLnRvU3RyaW5nKGIpXG4gIHZhciBrXG4gIGlmIChiID09IDE2KSBrID0gNFxuICBlbHNlIGlmIChiID09IDgpIGsgPSAzXG4gIGVsc2UgaWYgKGIgPT0gMikgayA9IDFcbiAgZWxzZSBpZiAoYiA9PSAzMikgayA9IDVcbiAgZWxzZSBpZiAoYiA9PSA0KSBrID0gMlxuICBlbHNlIHJldHVybiBzZWxmLnRvUmFkaXgoYilcbiAgdmFyIGttID0gKDEgPDwgaykgLSAxLFxuICAgIGQsIG0gPSBmYWxzZSxcbiAgICByID0gXCJcIixcbiAgICBpID0gc2VsZi50XG4gIHZhciBwID0gc2VsZi5EQiAtIChpICogc2VsZi5EQikgJSBrXG4gIGlmIChpLS0gPiAwKSB7XG4gICAgaWYgKHAgPCBzZWxmLkRCICYmIChkID0gc2VsZltpXSA+PiBwKSA+IDApIHtcbiAgICAgIG0gPSB0cnVlXG4gICAgICByID0gaW50MmNoYXIoZClcbiAgICB9XG4gICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgaWYgKHAgPCBrKSB7XG4gICAgICAgIGQgPSAoc2VsZltpXSAmICgoMSA8PCBwKSAtIDEpKSA8PCAoayAtIHApXG4gICAgICAgIGQgfD0gc2VsZlstLWldID4+IChwICs9IHNlbGYuREIgLSBrKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZCA9IChzZWxmW2ldID4+IChwIC09IGspKSAmIGttXG4gICAgICAgIGlmIChwIDw9IDApIHtcbiAgICAgICAgICBwICs9IHNlbGYuREJcbiAgICAgICAgICAtLWlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGQgPiAwKSBtID0gdHJ1ZVxuICAgICAgaWYgKG0pIHIgKz0gaW50MmNoYXIoZClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG0gPyByIDogXCIwXCJcbn1cblxuLy8gKHB1YmxpYykgLXRoaXNcbmZ1bmN0aW9uIGJuTmVnYXRlKCkge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHRoaXMsIHIpXG4gIHJldHVybiByXG59XG5cbi8vIChwdWJsaWMpIHx0aGlzfFxuZnVuY3Rpb24gYm5BYnMoKSB7XG4gIHJldHVybiAodGhpcy5zIDwgMCkgPyB0aGlzLm5lZ2F0ZSgpIDogdGhpc1xufVxuXG4vLyAocHVibGljKSByZXR1cm4gKyBpZiB0aGlzID4gYSwgLSBpZiB0aGlzIDwgYSwgMCBpZiBlcXVhbFxuZnVuY3Rpb24gYm5Db21wYXJlVG8oYSkge1xuICB2YXIgciA9IHRoaXMucyAtIGEuc1xuICBpZiAociAhPSAwKSByZXR1cm4gclxuICB2YXIgaSA9IHRoaXMudFxuICByID0gaSAtIGEudFxuICBpZiAociAhPSAwKSByZXR1cm4gKHRoaXMucyA8IDApID8gLXIgOiByXG4gIHdoaWxlICgtLWkgPj0gMClcbiAgICBpZiAoKHIgPSB0aGlzW2ldIC0gYVtpXSkgIT0gMCkgcmV0dXJuIHJcbiAgcmV0dXJuIDBcbn1cblxuLy8gcmV0dXJucyBiaXQgbGVuZ3RoIG9mIHRoZSBpbnRlZ2VyIHhcbmZ1bmN0aW9uIG5iaXRzKHgpIHtcbiAgdmFyIHIgPSAxLFxuICAgIHRcbiAgaWYgKCh0ID0geCA+Pj4gMTYpICE9IDApIHtcbiAgICB4ID0gdFxuICAgIHIgKz0gMTZcbiAgfVxuICBpZiAoKHQgPSB4ID4+IDgpICE9IDApIHtcbiAgICB4ID0gdFxuICAgIHIgKz0gOFxuICB9XG4gIGlmICgodCA9IHggPj4gNCkgIT0gMCkge1xuICAgIHggPSB0XG4gICAgciArPSA0XG4gIH1cbiAgaWYgKCh0ID0geCA+PiAyKSAhPSAwKSB7XG4gICAgeCA9IHRcbiAgICByICs9IDJcbiAgfVxuICBpZiAoKHQgPSB4ID4+IDEpICE9IDApIHtcbiAgICB4ID0gdFxuICAgIHIgKz0gMVxuICB9XG4gIHJldHVybiByXG59XG5cbi8vIChwdWJsaWMpIHJldHVybiB0aGUgbnVtYmVyIG9mIGJpdHMgaW4gXCJ0aGlzXCJcbmZ1bmN0aW9uIGJuQml0TGVuZ3RoKCkge1xuICBpZiAodGhpcy50IDw9IDApIHJldHVybiAwXG4gIHJldHVybiB0aGlzLkRCICogKHRoaXMudCAtIDEpICsgbmJpdHModGhpc1t0aGlzLnQgLSAxXSBeICh0aGlzLnMgJiB0aGlzLkRNKSlcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHRoZSBudW1iZXIgb2YgYnl0ZXMgaW4gXCJ0aGlzXCJcbmZ1bmN0aW9uIGJuQnl0ZUxlbmd0aCgpIHtcbiAgcmV0dXJuIHRoaXMuYml0TGVuZ3RoKCkgPj4gM1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA8PCBuKkRCXG5mdW5jdGlvbiBibnBETFNoaWZ0VG8obiwgcikge1xuICB2YXIgaVxuICBmb3IgKGkgPSB0aGlzLnQgLSAxOyBpID49IDA7IC0taSkgcltpICsgbl0gPSB0aGlzW2ldXG4gIGZvciAoaSA9IG4gLSAxOyBpID49IDA7IC0taSkgcltpXSA9IDBcbiAgci50ID0gdGhpcy50ICsgblxuICByLnMgPSB0aGlzLnNcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgPj4gbipEQlxuZnVuY3Rpb24gYm5wRFJTaGlmdFRvKG4sIHIpIHtcbiAgZm9yICh2YXIgaSA9IG47IGkgPCB0aGlzLnQ7ICsraSkgcltpIC0gbl0gPSB0aGlzW2ldXG4gIHIudCA9IE1hdGgubWF4KHRoaXMudCAtIG4sIDApXG4gIHIucyA9IHRoaXMuc1xufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA8PCBuXG5mdW5jdGlvbiBibnBMU2hpZnRUbyhuLCByKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgYnMgPSBuICUgc2VsZi5EQlxuICB2YXIgY2JzID0gc2VsZi5EQiAtIGJzXG4gIHZhciBibSA9ICgxIDw8IGNicykgLSAxXG4gIHZhciBkcyA9IE1hdGguZmxvb3IobiAvIHNlbGYuREIpLFxuICAgIGMgPSAoc2VsZi5zIDw8IGJzKSAmIHNlbGYuRE0sXG4gICAgaVxuICBmb3IgKGkgPSBzZWxmLnQgLSAxOyBpID49IDA7IC0taSkge1xuICAgIHJbaSArIGRzICsgMV0gPSAoc2VsZltpXSA+PiBjYnMpIHwgY1xuICAgIGMgPSAoc2VsZltpXSAmIGJtKSA8PCBic1xuICB9XG4gIGZvciAoaSA9IGRzIC0gMTsgaSA+PSAwOyAtLWkpIHJbaV0gPSAwXG4gIHJbZHNdID0gY1xuICByLnQgPSBzZWxmLnQgKyBkcyArIDFcbiAgci5zID0gc2VsZi5zXG4gIHIuY2xhbXAoKVxufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyA+PiBuXG5mdW5jdGlvbiBibnBSU2hpZnRUbyhuLCByKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICByLnMgPSBzZWxmLnNcbiAgdmFyIGRzID0gTWF0aC5mbG9vcihuIC8gc2VsZi5EQilcbiAgaWYgKGRzID49IHNlbGYudCkge1xuICAgIHIudCA9IDBcbiAgICByZXR1cm5cbiAgfVxuICB2YXIgYnMgPSBuICUgc2VsZi5EQlxuICB2YXIgY2JzID0gc2VsZi5EQiAtIGJzXG4gIHZhciBibSA9ICgxIDw8IGJzKSAtIDFcbiAgclswXSA9IHNlbGZbZHNdID4+IGJzXG4gIGZvciAodmFyIGkgPSBkcyArIDE7IGkgPCBzZWxmLnQ7ICsraSkge1xuICAgIHJbaSAtIGRzIC0gMV0gfD0gKHNlbGZbaV0gJiBibSkgPDwgY2JzXG4gICAgcltpIC0gZHNdID0gc2VsZltpXSA+PiBic1xuICB9XG4gIGlmIChicyA+IDApIHJbc2VsZi50IC0gZHMgLSAxXSB8PSAoc2VsZi5zICYgYm0pIDw8IGNic1xuICByLnQgPSBzZWxmLnQgLSBkc1xuICByLmNsYW1wKClcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IHRoaXMgLSBhXG5mdW5jdGlvbiBibnBTdWJUbyhhLCByKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgaSA9IDAsXG4gICAgYyA9IDAsXG4gICAgbSA9IE1hdGgubWluKGEudCwgc2VsZi50KVxuICB3aGlsZSAoaSA8IG0pIHtcbiAgICBjICs9IHNlbGZbaV0gLSBhW2ldXG4gICAgcltpKytdID0gYyAmIHNlbGYuRE1cbiAgICBjID4+PSBzZWxmLkRCXG4gIH1cbiAgaWYgKGEudCA8IHNlbGYudCkge1xuICAgIGMgLT0gYS5zXG4gICAgd2hpbGUgKGkgPCBzZWxmLnQpIHtcbiAgICAgIGMgKz0gc2VsZltpXVxuICAgICAgcltpKytdID0gYyAmIHNlbGYuRE1cbiAgICAgIGMgPj49IHNlbGYuREJcbiAgICB9XG4gICAgYyArPSBzZWxmLnNcbiAgfSBlbHNlIHtcbiAgICBjICs9IHNlbGYuc1xuICAgIHdoaWxlIChpIDwgYS50KSB7XG4gICAgICBjIC09IGFbaV1cbiAgICAgIHJbaSsrXSA9IGMgJiBzZWxmLkRNXG4gICAgICBjID4+PSBzZWxmLkRCXG4gICAgfVxuICAgIGMgLT0gYS5zXG4gIH1cbiAgci5zID0gKGMgPCAwKSA/IC0xIDogMFxuICBpZiAoYyA8IC0xKSByW2krK10gPSBzZWxmLkRWICsgY1xuICBlbHNlIGlmIChjID4gMCkgcltpKytdID0gY1xuICByLnQgPSBpXG4gIHIuY2xhbXAoKVxufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyAqIGEsIHIgIT0gdGhpcyxhIChIQUMgMTQuMTIpXG4vLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXG5mdW5jdGlvbiBibnBNdWx0aXBseVRvKGEsIHIpIHtcbiAgdmFyIHggPSB0aGlzLmFicygpLFxuICAgIHkgPSBhLmFicygpXG4gIHZhciBpID0geC50XG4gIHIudCA9IGkgKyB5LnRcbiAgd2hpbGUgKC0taSA+PSAwKSByW2ldID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgeS50OyArK2kpIHJbaSArIHgudF0gPSB4LmFtKDAsIHlbaV0sIHIsIGksIDAsIHgudClcbiAgci5zID0gMFxuICByLmNsYW1wKClcbiAgaWYgKHRoaXMucyAhPSBhLnMpIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyhyLCByKVxufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpc14yLCByICE9IHRoaXMgKEhBQyAxNC4xNilcbmZ1bmN0aW9uIGJucFNxdWFyZVRvKHIpIHtcbiAgdmFyIHggPSB0aGlzLmFicygpXG4gIHZhciBpID0gci50ID0gMiAqIHgudFxuICB3aGlsZSAoLS1pID49IDApIHJbaV0gPSAwXG4gIGZvciAoaSA9IDA7IGkgPCB4LnQgLSAxOyArK2kpIHtcbiAgICB2YXIgYyA9IHguYW0oaSwgeFtpXSwgciwgMiAqIGksIDAsIDEpXG4gICAgaWYgKChyW2kgKyB4LnRdICs9IHguYW0oaSArIDEsIDIgKiB4W2ldLCByLCAyICogaSArIDEsIGMsIHgudCAtIGkgLSAxKSkgPj0geC5EVikge1xuICAgICAgcltpICsgeC50XSAtPSB4LkRWXG4gICAgICByW2kgKyB4LnQgKyAxXSA9IDFcbiAgICB9XG4gIH1cbiAgaWYgKHIudCA+IDApIHJbci50IC0gMV0gKz0geC5hbShpLCB4W2ldLCByLCAyICogaSwgMCwgMSlcbiAgci5zID0gMFxuICByLmNsYW1wKClcbn1cblxuLy8gKHByb3RlY3RlZCkgZGl2aWRlIHRoaXMgYnkgbSwgcXVvdGllbnQgYW5kIHJlbWFpbmRlciB0byBxLCByIChIQUMgMTQuMjApXG4vLyByICE9IHEsIHRoaXMgIT0gbS4gIHEgb3IgciBtYXkgYmUgbnVsbC5cbmZ1bmN0aW9uIGJucERpdlJlbVRvKG0sIHEsIHIpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG4gIHZhciBwbSA9IG0uYWJzKClcbiAgaWYgKHBtLnQgPD0gMCkgcmV0dXJuXG4gIHZhciBwdCA9IHNlbGYuYWJzKClcbiAgaWYgKHB0LnQgPCBwbS50KSB7XG4gICAgaWYgKHEgIT0gbnVsbCkgcS5mcm9tSW50KDApXG4gICAgaWYgKHIgIT0gbnVsbCkgc2VsZi5jb3B5VG8ocilcbiAgICByZXR1cm5cbiAgfVxuICBpZiAociA9PSBudWxsKSByID0gbmV3IEJpZ0ludGVnZXIoKVxuICB2YXIgeSA9IG5ldyBCaWdJbnRlZ2VyKCksXG4gICAgdHMgPSBzZWxmLnMsXG4gICAgbXMgPSBtLnNcbiAgdmFyIG5zaCA9IHNlbGYuREIgLSBuYml0cyhwbVtwbS50IC0gMV0pOyAvLyBub3JtYWxpemUgbW9kdWx1c1xuICBpZiAobnNoID4gMCkge1xuICAgIHBtLmxTaGlmdFRvKG5zaCwgeSlcbiAgICBwdC5sU2hpZnRUbyhuc2gsIHIpXG4gIH0gZWxzZSB7XG4gICAgcG0uY29weVRvKHkpXG4gICAgcHQuY29weVRvKHIpXG4gIH1cbiAgdmFyIHlzID0geS50XG4gIHZhciB5MCA9IHlbeXMgLSAxXVxuICBpZiAoeTAgPT0gMCkgcmV0dXJuXG4gIHZhciB5dCA9IHkwICogKDEgPDwgc2VsZi5GMSkgKyAoKHlzID4gMSkgPyB5W3lzIC0gMl0gPj4gc2VsZi5GMiA6IDApXG4gIHZhciBkMSA9IHNlbGYuRlYgLyB5dCxcbiAgICBkMiA9ICgxIDw8IHNlbGYuRjEpIC8geXQsXG4gICAgZSA9IDEgPDwgc2VsZi5GMlxuICB2YXIgaSA9IHIudCxcbiAgICBqID0gaSAtIHlzLFxuICAgIHQgPSAocSA9PSBudWxsKSA/IG5ldyBCaWdJbnRlZ2VyKCkgOiBxXG4gIHkuZGxTaGlmdFRvKGosIHQpXG4gIGlmIChyLmNvbXBhcmVUbyh0KSA+PSAwKSB7XG4gICAgcltyLnQrK10gPSAxXG4gICAgci5zdWJUbyh0LCByKVxuICB9XG4gIEJpZ0ludGVnZXIuT05FLmRsU2hpZnRUbyh5cywgdClcbiAgdC5zdWJUbyh5LCB5KTsgLy8gXCJuZWdhdGl2ZVwiIHkgc28gd2UgY2FuIHJlcGxhY2Ugc3ViIHdpdGggYW0gbGF0ZXJcbiAgd2hpbGUgKHkudCA8IHlzKSB5W3kudCsrXSA9IDBcbiAgd2hpbGUgKC0taiA+PSAwKSB7XG4gICAgLy8gRXN0aW1hdGUgcXVvdGllbnQgZGlnaXRcbiAgICB2YXIgcWQgPSAoclstLWldID09IHkwKSA/IHNlbGYuRE0gOiBNYXRoLmZsb29yKHJbaV0gKiBkMSArIChyW2kgLSAxXSArIGUpICogZDIpXG4gICAgaWYgKChyW2ldICs9IHkuYW0oMCwgcWQsIHIsIGosIDAsIHlzKSkgPCBxZCkgeyAvLyBUcnkgaXQgb3V0XG4gICAgICB5LmRsU2hpZnRUbyhqLCB0KVxuICAgICAgci5zdWJUbyh0LCByKVxuICAgICAgd2hpbGUgKHJbaV0gPCAtLXFkKSByLnN1YlRvKHQsIHIpXG4gICAgfVxuICB9XG4gIGlmIChxICE9IG51bGwpIHtcbiAgICByLmRyU2hpZnRUbyh5cywgcSlcbiAgICBpZiAodHMgIT0gbXMpIEJpZ0ludGVnZXIuWkVSTy5zdWJUbyhxLCBxKVxuICB9XG4gIHIudCA9IHlzXG4gIHIuY2xhbXAoKVxuICBpZiAobnNoID4gMCkgci5yU2hpZnRUbyhuc2gsIHIpOyAvLyBEZW5vcm1hbGl6ZSByZW1haW5kZXJcbiAgaWYgKHRzIDwgMCkgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHIsIHIpXG59XG5cbi8vIChwdWJsaWMpIHRoaXMgbW9kIGFcbmZ1bmN0aW9uIGJuTW9kKGEpIHtcbiAgdmFyIHIgPSBuZXcgQmlnSW50ZWdlcigpXG4gIHRoaXMuYWJzKClcbiAgICAuZGl2UmVtVG8oYSwgbnVsbCwgcilcbiAgaWYgKHRoaXMucyA8IDAgJiYgci5jb21wYXJlVG8oQmlnSW50ZWdlci5aRVJPKSA+IDApIGEuc3ViVG8ociwgcilcbiAgcmV0dXJuIHJcbn1cblxuLy8gTW9kdWxhciByZWR1Y3Rpb24gdXNpbmcgXCJjbGFzc2ljXCIgYWxnb3JpdGhtXG5mdW5jdGlvbiBDbGFzc2ljKG0pIHtcbiAgdGhpcy5tID0gbVxufVxuXG5mdW5jdGlvbiBjQ29udmVydCh4KSB7XG4gIGlmICh4LnMgPCAwIHx8IHguY29tcGFyZVRvKHRoaXMubSkgPj0gMCkgcmV0dXJuIHgubW9kKHRoaXMubSlcbiAgZWxzZSByZXR1cm4geFxufVxuXG5mdW5jdGlvbiBjUmV2ZXJ0KHgpIHtcbiAgcmV0dXJuIHhcbn1cblxuZnVuY3Rpb24gY1JlZHVjZSh4KSB7XG4gIHguZGl2UmVtVG8odGhpcy5tLCBudWxsLCB4KVxufVxuXG5mdW5jdGlvbiBjTXVsVG8oeCwgeSwgcikge1xuICB4Lm11bHRpcGx5VG8oeSwgcilcbiAgdGhpcy5yZWR1Y2Uocilcbn1cblxuZnVuY3Rpb24gY1NxclRvKHgsIHIpIHtcbiAgeC5zcXVhcmVUbyhyKVxuICB0aGlzLnJlZHVjZShyKVxufVxuXG5DbGFzc2ljLnByb3RvdHlwZS5jb252ZXJ0ID0gY0NvbnZlcnRcbkNsYXNzaWMucHJvdG90eXBlLnJldmVydCA9IGNSZXZlcnRcbkNsYXNzaWMucHJvdG90eXBlLnJlZHVjZSA9IGNSZWR1Y2VcbkNsYXNzaWMucHJvdG90eXBlLm11bFRvID0gY011bFRvXG5DbGFzc2ljLnByb3RvdHlwZS5zcXJUbyA9IGNTcXJUb1xuXG4vLyAocHJvdGVjdGVkKSByZXR1cm4gXCItMS90aGlzICUgMl5EQlwiOyB1c2VmdWwgZm9yIE1vbnQuIHJlZHVjdGlvblxuLy8ganVzdGlmaWNhdGlvbjpcbi8vICAgICAgICAgeHkgPT0gMSAobW9kIG0pXG4vLyAgICAgICAgIHh5ID0gIDEra21cbi8vICAgeHkoMi14eSkgPSAoMStrbSkoMS1rbSlcbi8vIHhbeSgyLXh5KV0gPSAxLWteMm1eMlxuLy8geFt5KDIteHkpXSA9PSAxIChtb2QgbV4yKVxuLy8gaWYgeSBpcyAxL3ggbW9kIG0sIHRoZW4geSgyLXh5KSBpcyAxL3ggbW9kIG1eMlxuLy8gc2hvdWxkIHJlZHVjZSB4IGFuZCB5KDIteHkpIGJ5IG1eMiBhdCBlYWNoIHN0ZXAgdG8ga2VlcCBzaXplIGJvdW5kZWQuXG4vLyBKUyBtdWx0aXBseSBcIm92ZXJmbG93c1wiIGRpZmZlcmVudGx5IGZyb20gQy9DKyssIHNvIGNhcmUgaXMgbmVlZGVkIGhlcmUuXG5mdW5jdGlvbiBibnBJbnZEaWdpdCgpIHtcbiAgaWYgKHRoaXMudCA8IDEpIHJldHVybiAwXG4gIHZhciB4ID0gdGhpc1swXVxuICBpZiAoKHggJiAxKSA9PSAwKSByZXR1cm4gMFxuICB2YXIgeSA9IHggJiAzOyAvLyB5ID09IDEveCBtb2QgMl4yXG4gIHkgPSAoeSAqICgyIC0gKHggJiAweGYpICogeSkpICYgMHhmOyAvLyB5ID09IDEveCBtb2QgMl40XG4gIHkgPSAoeSAqICgyIC0gKHggJiAweGZmKSAqIHkpKSAmIDB4ZmY7IC8vIHkgPT0gMS94IG1vZCAyXjhcbiAgeSA9ICh5ICogKDIgLSAoKCh4ICYgMHhmZmZmKSAqIHkpICYgMHhmZmZmKSkpICYgMHhmZmZmOyAvLyB5ID09IDEveCBtb2QgMl4xNlxuICAvLyBsYXN0IHN0ZXAgLSBjYWxjdWxhdGUgaW52ZXJzZSBtb2QgRFYgZGlyZWN0bHlcbiAgLy8gYXNzdW1lcyAxNiA8IERCIDw9IDMyIGFuZCBhc3N1bWVzIGFiaWxpdHkgdG8gaGFuZGxlIDQ4LWJpdCBpbnRzXG4gIHkgPSAoeSAqICgyIC0geCAqIHkgJSB0aGlzLkRWKSkgJSB0aGlzLkRWOyAvLyB5ID09IDEveCBtb2QgMl5kYml0c1xuICAvLyB3ZSByZWFsbHkgd2FudCB0aGUgbmVnYXRpdmUgaW52ZXJzZSwgYW5kIC1EViA8IHkgPCBEVlxuICByZXR1cm4gKHkgPiAwKSA/IHRoaXMuRFYgLSB5IDogLXlcbn1cblxuLy8gTW9udGdvbWVyeSByZWR1Y3Rpb25cbmZ1bmN0aW9uIE1vbnRnb21lcnkobSkge1xuICB0aGlzLm0gPSBtXG4gIHRoaXMubXAgPSBtLmludkRpZ2l0KClcbiAgdGhpcy5tcGwgPSB0aGlzLm1wICYgMHg3ZmZmXG4gIHRoaXMubXBoID0gdGhpcy5tcCA+PiAxNVxuICB0aGlzLnVtID0gKDEgPDwgKG0uREIgLSAxNSkpIC0gMVxuICB0aGlzLm10MiA9IDIgKiBtLnRcbn1cblxuLy8geFIgbW9kIG1cbmZ1bmN0aW9uIG1vbnRDb252ZXJ0KHgpIHtcbiAgdmFyIHIgPSBuZXcgQmlnSW50ZWdlcigpXG4gIHguYWJzKClcbiAgICAuZGxTaGlmdFRvKHRoaXMubS50LCByKVxuICByLmRpdlJlbVRvKHRoaXMubSwgbnVsbCwgcilcbiAgaWYgKHgucyA8IDAgJiYgci5jb21wYXJlVG8oQmlnSW50ZWdlci5aRVJPKSA+IDApIHRoaXMubS5zdWJUbyhyLCByKVxuICByZXR1cm4gclxufVxuXG4vLyB4L1IgbW9kIG1cbmZ1bmN0aW9uIG1vbnRSZXZlcnQoeCkge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgeC5jb3B5VG8ocilcbiAgdGhpcy5yZWR1Y2UocilcbiAgcmV0dXJuIHJcbn1cblxuLy8geCA9IHgvUiBtb2QgbSAoSEFDIDE0LjMyKVxuZnVuY3Rpb24gbW9udFJlZHVjZSh4KSB7XG4gIHdoaWxlICh4LnQgPD0gdGhpcy5tdDIpIC8vIHBhZCB4IHNvIGFtIGhhcyBlbm91Z2ggcm9vbSBsYXRlclxuICAgIHhbeC50KytdID0gMFxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubS50OyArK2kpIHtcbiAgICAvLyBmYXN0ZXIgd2F5IG9mIGNhbGN1bGF0aW5nIHUwID0geFtpXSptcCBtb2QgRFZcbiAgICB2YXIgaiA9IHhbaV0gJiAweDdmZmZcbiAgICB2YXIgdTAgPSAoaiAqIHRoaXMubXBsICsgKCgoaiAqIHRoaXMubXBoICsgKHhbaV0gPj4gMTUpICogdGhpcy5tcGwpICYgdGhpcy51bSkgPDwgMTUpKSAmIHguRE1cbiAgICAvLyB1c2UgYW0gdG8gY29tYmluZSB0aGUgbXVsdGlwbHktc2hpZnQtYWRkIGludG8gb25lIGNhbGxcbiAgICBqID0gaSArIHRoaXMubS50XG4gICAgeFtqXSArPSB0aGlzLm0uYW0oMCwgdTAsIHgsIGksIDAsIHRoaXMubS50KVxuICAgIC8vIHByb3BhZ2F0ZSBjYXJyeVxuICAgIHdoaWxlICh4W2pdID49IHguRFYpIHtcbiAgICAgIHhbal0gLT0geC5EVlxuICAgICAgeFsrK2pdKytcbiAgICB9XG4gIH1cbiAgeC5jbGFtcCgpXG4gIHguZHJTaGlmdFRvKHRoaXMubS50LCB4KVxuICBpZiAoeC5jb21wYXJlVG8odGhpcy5tKSA+PSAwKSB4LnN1YlRvKHRoaXMubSwgeClcbn1cblxuLy8gciA9IFwieF4yL1IgbW9kIG1cIjsgeCAhPSByXG5mdW5jdGlvbiBtb250U3FyVG8oeCwgcikge1xuICB4LnNxdWFyZVRvKHIpXG4gIHRoaXMucmVkdWNlKHIpXG59XG5cbi8vIHIgPSBcInh5L1IgbW9kIG1cIjsgeCx5ICE9IHJcbmZ1bmN0aW9uIG1vbnRNdWxUbyh4LCB5LCByKSB7XG4gIHgubXVsdGlwbHlUbyh5LCByKVxuICB0aGlzLnJlZHVjZShyKVxufVxuXG5Nb250Z29tZXJ5LnByb3RvdHlwZS5jb252ZXJ0ID0gbW9udENvbnZlcnRcbk1vbnRnb21lcnkucHJvdG90eXBlLnJldmVydCA9IG1vbnRSZXZlcnRcbk1vbnRnb21lcnkucHJvdG90eXBlLnJlZHVjZSA9IG1vbnRSZWR1Y2Vcbk1vbnRnb21lcnkucHJvdG90eXBlLm11bFRvID0gbW9udE11bFRvXG5Nb250Z29tZXJ5LnByb3RvdHlwZS5zcXJUbyA9IG1vbnRTcXJUb1xuXG4vLyAocHJvdGVjdGVkKSB0cnVlIGlmZiB0aGlzIGlzIGV2ZW5cbmZ1bmN0aW9uIGJucElzRXZlbigpIHtcbiAgcmV0dXJuICgodGhpcy50ID4gMCkgPyAodGhpc1swXSAmIDEpIDogdGhpcy5zKSA9PSAwXG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXNeZSwgZSA8IDJeMzIsIGRvaW5nIHNxciBhbmQgbXVsIHdpdGggXCJyXCIgKEhBQyAxNC43OSlcbmZ1bmN0aW9uIGJucEV4cChlLCB6KSB7XG4gIGlmIChlID4gMHhmZmZmZmZmZiB8fCBlIDwgMSkgcmV0dXJuIEJpZ0ludGVnZXIuT05FXG4gIHZhciByID0gbmV3IEJpZ0ludGVnZXIoKSxcbiAgICByMiA9IG5ldyBCaWdJbnRlZ2VyKCksXG4gICAgZyA9IHouY29udmVydCh0aGlzKSxcbiAgICBpID0gbmJpdHMoZSkgLSAxXG4gIGcuY29weVRvKHIpXG4gIHdoaWxlICgtLWkgPj0gMCkge1xuICAgIHouc3FyVG8ociwgcjIpXG4gICAgaWYgKChlICYgKDEgPDwgaSkpID4gMCkgei5tdWxUbyhyMiwgZywgcilcbiAgICBlbHNlIHtcbiAgICAgIHZhciB0ID0gclxuICAgICAgciA9IHIyXG4gICAgICByMiA9IHRcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHoucmV2ZXJ0KHIpXG59XG5cbi8vIChwdWJsaWMpIHRoaXNeZSAlIG0sIDAgPD0gZSA8IDJeMzJcbmZ1bmN0aW9uIGJuTW9kUG93SW50KGUsIG0pIHtcbiAgdmFyIHpcbiAgaWYgKGUgPCAyNTYgfHwgbS5pc0V2ZW4oKSkgeiA9IG5ldyBDbGFzc2ljKG0pXG4gIGVsc2UgeiA9IG5ldyBNb250Z29tZXJ5KG0pXG4gIHJldHVybiB0aGlzLmV4cChlLCB6KVxufVxuXG4vLyBwcm90ZWN0ZWRcbnByb3RvLmNvcHlUbyA9IGJucENvcHlUb1xucHJvdG8uZnJvbUludCA9IGJucEZyb21JbnRcbnByb3RvLmZyb21TdHJpbmcgPSBibnBGcm9tU3RyaW5nXG5wcm90by5jbGFtcCA9IGJucENsYW1wXG5wcm90by5kbFNoaWZ0VG8gPSBibnBETFNoaWZ0VG9cbnByb3RvLmRyU2hpZnRUbyA9IGJucERSU2hpZnRUb1xucHJvdG8ubFNoaWZ0VG8gPSBibnBMU2hpZnRUb1xucHJvdG8uclNoaWZ0VG8gPSBibnBSU2hpZnRUb1xucHJvdG8uc3ViVG8gPSBibnBTdWJUb1xucHJvdG8ubXVsdGlwbHlUbyA9IGJucE11bHRpcGx5VG9cbnByb3RvLnNxdWFyZVRvID0gYm5wU3F1YXJlVG9cbnByb3RvLmRpdlJlbVRvID0gYm5wRGl2UmVtVG9cbnByb3RvLmludkRpZ2l0ID0gYm5wSW52RGlnaXRcbnByb3RvLmlzRXZlbiA9IGJucElzRXZlblxucHJvdG8uZXhwID0gYm5wRXhwXG5cbi8vIHB1YmxpY1xucHJvdG8udG9TdHJpbmcgPSBiblRvU3RyaW5nXG5wcm90by5uZWdhdGUgPSBibk5lZ2F0ZVxucHJvdG8uYWJzID0gYm5BYnNcbnByb3RvLmNvbXBhcmVUbyA9IGJuQ29tcGFyZVRvXG5wcm90by5iaXRMZW5ndGggPSBibkJpdExlbmd0aFxucHJvdG8uYnl0ZUxlbmd0aCA9IGJuQnl0ZUxlbmd0aFxucHJvdG8ubW9kID0gYm5Nb2RcbnByb3RvLm1vZFBvd0ludCA9IGJuTW9kUG93SW50XG5cbi8vIChwdWJsaWMpXG5mdW5jdGlvbiBibkNsb25lKCkge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgdGhpcy5jb3B5VG8ocilcbiAgcmV0dXJuIHJcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIGludGVnZXJcbmZ1bmN0aW9uIGJuSW50VmFsdWUoKSB7XG4gIGlmICh0aGlzLnMgPCAwKSB7XG4gICAgaWYgKHRoaXMudCA9PSAxKSByZXR1cm4gdGhpc1swXSAtIHRoaXMuRFZcbiAgICBlbHNlIGlmICh0aGlzLnQgPT0gMCkgcmV0dXJuIC0xXG4gIH0gZWxzZSBpZiAodGhpcy50ID09IDEpIHJldHVybiB0aGlzWzBdXG4gIGVsc2UgaWYgKHRoaXMudCA9PSAwKSByZXR1cm4gMFxuICAvLyBhc3N1bWVzIDE2IDwgREIgPCAzMlxuICByZXR1cm4gKCh0aGlzWzFdICYgKCgxIDw8ICgzMiAtIHRoaXMuREIpKSAtIDEpKSA8PCB0aGlzLkRCKSB8IHRoaXNbMF1cbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIHZhbHVlIGFzIGJ5dGVcbmZ1bmN0aW9uIGJuQnl0ZVZhbHVlKCkge1xuICByZXR1cm4gKHRoaXMudCA9PSAwKSA/IHRoaXMucyA6ICh0aGlzWzBdIDw8IDI0KSA+PiAyNFxufVxuXG4vLyAocHVibGljKSByZXR1cm4gdmFsdWUgYXMgc2hvcnQgKGFzc3VtZXMgREI+PTE2KVxuZnVuY3Rpb24gYm5TaG9ydFZhbHVlKCkge1xuICByZXR1cm4gKHRoaXMudCA9PSAwKSA/IHRoaXMucyA6ICh0aGlzWzBdIDw8IDE2KSA+PiAxNlxufVxuXG4vLyAocHJvdGVjdGVkKSByZXR1cm4geCBzLnQuIHJeeCA8IERWXG5mdW5jdGlvbiBibnBDaHVua1NpemUocikge1xuICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLkxOMiAqIHRoaXMuREIgLyBNYXRoLmxvZyhyKSlcbn1cblxuLy8gKHB1YmxpYykgMCBpZiB0aGlzID09IDAsIDEgaWYgdGhpcyA+IDBcbmZ1bmN0aW9uIGJuU2lnTnVtKCkge1xuICBpZiAodGhpcy5zIDwgMCkgcmV0dXJuIC0xXG4gIGVsc2UgaWYgKHRoaXMudCA8PSAwIHx8ICh0aGlzLnQgPT0gMSAmJiB0aGlzWzBdIDw9IDApKSByZXR1cm4gMFxuICBlbHNlIHJldHVybiAxXG59XG5cbi8vIChwcm90ZWN0ZWQpIGNvbnZlcnQgdG8gcmFkaXggc3RyaW5nXG5mdW5jdGlvbiBibnBUb1JhZGl4KGIpIHtcbiAgaWYgKGIgPT0gbnVsbCkgYiA9IDEwXG4gIGlmICh0aGlzLnNpZ251bSgpID09IDAgfHwgYiA8IDIgfHwgYiA+IDM2KSByZXR1cm4gXCIwXCJcbiAgdmFyIGNzID0gdGhpcy5jaHVua1NpemUoYilcbiAgdmFyIGEgPSBNYXRoLnBvdyhiLCBjcylcbiAgdmFyIGQgPSBuYnYoYSksXG4gICAgeSA9IG5ldyBCaWdJbnRlZ2VyKCksXG4gICAgeiA9IG5ldyBCaWdJbnRlZ2VyKCksXG4gICAgciA9IFwiXCJcbiAgdGhpcy5kaXZSZW1UbyhkLCB5LCB6KVxuICB3aGlsZSAoeS5zaWdudW0oKSA+IDApIHtcbiAgICByID0gKGEgKyB6LmludFZhbHVlKCkpXG4gICAgICAudG9TdHJpbmcoYilcbiAgICAgIC5zdWJzdHIoMSkgKyByXG4gICAgeS5kaXZSZW1UbyhkLCB5LCB6KVxuICB9XG4gIHJldHVybiB6LmludFZhbHVlKClcbiAgICAudG9TdHJpbmcoYikgKyByXG59XG5cbi8vIChwcm90ZWN0ZWQpIGNvbnZlcnQgZnJvbSByYWRpeCBzdHJpbmdcbmZ1bmN0aW9uIGJucEZyb21SYWRpeChzLCBiKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBzZWxmLmZyb21JbnQoMClcbiAgaWYgKGIgPT0gbnVsbCkgYiA9IDEwXG4gIHZhciBjcyA9IHNlbGYuY2h1bmtTaXplKGIpXG4gIHZhciBkID0gTWF0aC5wb3coYiwgY3MpLFxuICAgIG1pID0gZmFsc2UsXG4gICAgaiA9IDAsXG4gICAgdyA9IDBcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLmxlbmd0aDsgKytpKSB7XG4gICAgdmFyIHggPSBpbnRBdChzLCBpKVxuICAgIGlmICh4IDwgMCkge1xuICAgICAgaWYgKHMuY2hhckF0KGkpID09IFwiLVwiICYmIHNlbGYuc2lnbnVtKCkgPT0gMCkgbWkgPSB0cnVlXG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgICB3ID0gYiAqIHcgKyB4XG4gICAgaWYgKCsraiA+PSBjcykge1xuICAgICAgc2VsZi5kTXVsdGlwbHkoZClcbiAgICAgIHNlbGYuZEFkZE9mZnNldCh3LCAwKVxuICAgICAgaiA9IDBcbiAgICAgIHcgPSAwXG4gICAgfVxuICB9XG4gIGlmIChqID4gMCkge1xuICAgIHNlbGYuZE11bHRpcGx5KE1hdGgucG93KGIsIGopKVxuICAgIHNlbGYuZEFkZE9mZnNldCh3LCAwKVxuICB9XG4gIGlmIChtaSkgQmlnSW50ZWdlci5aRVJPLnN1YlRvKHNlbGYsIHNlbGYpXG59XG5cbi8vIChwcm90ZWN0ZWQpIGFsdGVybmF0ZSBjb25zdHJ1Y3RvclxuZnVuY3Rpb24gYm5wRnJvbU51bWJlcihhLCBiLCBjKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICBpZiAoXCJudW1iZXJcIiA9PSB0eXBlb2YgYikge1xuICAgIC8vIG5ldyBCaWdJbnRlZ2VyKGludCxpbnQsUk5HKVxuICAgIGlmIChhIDwgMikgc2VsZi5mcm9tSW50KDEpXG4gICAgZWxzZSB7XG4gICAgICBzZWxmLmZyb21OdW1iZXIoYSwgYylcbiAgICAgIGlmICghc2VsZi50ZXN0Qml0KGEgLSAxKSkgLy8gZm9yY2UgTVNCIHNldFxuICAgICAgICBzZWxmLmJpdHdpc2VUbyhCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQoYSAtIDEpLCBvcF9vciwgc2VsZilcbiAgICAgIGlmIChzZWxmLmlzRXZlbigpKSBzZWxmLmRBZGRPZmZzZXQoMSwgMCk7IC8vIGZvcmNlIG9kZFxuICAgICAgd2hpbGUgKCFzZWxmLmlzUHJvYmFibGVQcmltZShiKSkge1xuICAgICAgICBzZWxmLmRBZGRPZmZzZXQoMiwgMClcbiAgICAgICAgaWYgKHNlbGYuYml0TGVuZ3RoKCkgPiBhKSBzZWxmLnN1YlRvKEJpZ0ludGVnZXIuT05FLnNoaWZ0TGVmdChhIC0gMSksIHNlbGYpXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIG5ldyBCaWdJbnRlZ2VyKGludCxSTkcpXG4gICAgdmFyIHggPSBuZXcgQXJyYXkoKSxcbiAgICAgIHQgPSBhICYgN1xuICAgIHgubGVuZ3RoID0gKGEgPj4gMykgKyAxXG4gICAgYi5uZXh0Qnl0ZXMoeClcbiAgICBpZiAodCA+IDApIHhbMF0gJj0gKCgxIDw8IHQpIC0gMSlcbiAgICBlbHNlIHhbMF0gPSAwXG4gICAgc2VsZi5mcm9tU3RyaW5nKHgsIDI1NilcbiAgfVxufVxuXG4vLyAocHVibGljKSBjb252ZXJ0IHRvIGJpZ2VuZGlhbiBieXRlIGFycmF5XG5mdW5jdGlvbiBiblRvQnl0ZUFycmF5KCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgdmFyIGkgPSBzZWxmLnQsXG4gICAgciA9IG5ldyBBcnJheSgpXG4gIHJbMF0gPSBzZWxmLnNcbiAgdmFyIHAgPSBzZWxmLkRCIC0gKGkgKiBzZWxmLkRCKSAlIDgsXG4gICAgZCwgayA9IDBcbiAgaWYgKGktLSA+IDApIHtcbiAgICBpZiAocCA8IHNlbGYuREIgJiYgKGQgPSBzZWxmW2ldID4+IHApICE9IChzZWxmLnMgJiBzZWxmLkRNKSA+PiBwKVxuICAgICAgcltrKytdID0gZCB8IChzZWxmLnMgPDwgKHNlbGYuREIgLSBwKSlcbiAgICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgICBpZiAocCA8IDgpIHtcbiAgICAgICAgZCA9IChzZWxmW2ldICYgKCgxIDw8IHApIC0gMSkpIDw8ICg4IC0gcClcbiAgICAgICAgZCB8PSBzZWxmWy0taV0gPj4gKHAgKz0gc2VsZi5EQiAtIDgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkID0gKHNlbGZbaV0gPj4gKHAgLT0gOCkpICYgMHhmZlxuICAgICAgICBpZiAocCA8PSAwKSB7XG4gICAgICAgICAgcCArPSBzZWxmLkRCXG4gICAgICAgICAgLS1pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICgoZCAmIDB4ODApICE9IDApIGQgfD0gLTI1NlxuICAgICAgaWYgKGsgPT09IDAgJiYgKHNlbGYucyAmIDB4ODApICE9IChkICYgMHg4MCkpKytrXG4gICAgICBpZiAoayA+IDAgfHwgZCAhPSBzZWxmLnMpIHJbaysrXSA9IGRcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuZnVuY3Rpb24gYm5FcXVhbHMoYSkge1xuICByZXR1cm4gKHRoaXMuY29tcGFyZVRvKGEpID09IDApXG59XG5cbmZ1bmN0aW9uIGJuTWluKGEpIHtcbiAgcmV0dXJuICh0aGlzLmNvbXBhcmVUbyhhKSA8IDApID8gdGhpcyA6IGFcbn1cblxuZnVuY3Rpb24gYm5NYXgoYSkge1xuICByZXR1cm4gKHRoaXMuY29tcGFyZVRvKGEpID4gMCkgPyB0aGlzIDogYVxufVxuXG4vLyAocHJvdGVjdGVkKSByID0gdGhpcyBvcCBhIChiaXR3aXNlKVxuZnVuY3Rpb24gYm5wQml0d2lzZVRvKGEsIG9wLCByKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuICB2YXIgaSwgZiwgbSA9IE1hdGgubWluKGEudCwgc2VsZi50KVxuICBmb3IgKGkgPSAwOyBpIDwgbTsgKytpKSByW2ldID0gb3Aoc2VsZltpXSwgYVtpXSlcbiAgaWYgKGEudCA8IHNlbGYudCkge1xuICAgIGYgPSBhLnMgJiBzZWxmLkRNXG4gICAgZm9yIChpID0gbTsgaSA8IHNlbGYudDsgKytpKSByW2ldID0gb3Aoc2VsZltpXSwgZilcbiAgICByLnQgPSBzZWxmLnRcbiAgfSBlbHNlIHtcbiAgICBmID0gc2VsZi5zICYgc2VsZi5ETVxuICAgIGZvciAoaSA9IG07IGkgPCBhLnQ7ICsraSkgcltpXSA9IG9wKGYsIGFbaV0pXG4gICAgci50ID0gYS50XG4gIH1cbiAgci5zID0gb3Aoc2VsZi5zLCBhLnMpXG4gIHIuY2xhbXAoKVxufVxuXG4vLyAocHVibGljKSB0aGlzICYgYVxuZnVuY3Rpb24gb3BfYW5kKHgsIHkpIHtcbiAgcmV0dXJuIHggJiB5XG59XG5cbmZ1bmN0aW9uIGJuQW5kKGEpIHtcbiAgdmFyIHIgPSBuZXcgQmlnSW50ZWdlcigpXG4gIHRoaXMuYml0d2lzZVRvKGEsIG9wX2FuZCwgcilcbiAgcmV0dXJuIHJcbn1cblxuLy8gKHB1YmxpYykgdGhpcyB8IGFcbmZ1bmN0aW9uIG9wX29yKHgsIHkpIHtcbiAgcmV0dXJuIHggfCB5XG59XG5cbmZ1bmN0aW9uIGJuT3IoYSkge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgdGhpcy5iaXR3aXNlVG8oYSwgb3Bfb3IsIHIpXG4gIHJldHVybiByXG59XG5cbi8vIChwdWJsaWMpIHRoaXMgXiBhXG5mdW5jdGlvbiBvcF94b3IoeCwgeSkge1xuICByZXR1cm4geCBeIHlcbn1cblxuZnVuY3Rpb24gYm5Yb3IoYSkge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgdGhpcy5iaXR3aXNlVG8oYSwgb3BfeG9yLCByKVxuICByZXR1cm4gclxufVxuXG4vLyAocHVibGljKSB0aGlzICYgfmFcbmZ1bmN0aW9uIG9wX2FuZG5vdCh4LCB5KSB7XG4gIHJldHVybiB4ICYgfnlcbn1cblxuZnVuY3Rpb24gYm5BbmROb3QoYSkge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgdGhpcy5iaXR3aXNlVG8oYSwgb3BfYW5kbm90LCByKVxuICByZXR1cm4gclxufVxuXG4vLyAocHVibGljKSB+dGhpc1xuZnVuY3Rpb24gYm5Ob3QoKSB7XG4gIHZhciByID0gbmV3IEJpZ0ludGVnZXIoKVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudDsgKytpKSByW2ldID0gdGhpcy5ETSAmIH50aGlzW2ldXG4gIHIudCA9IHRoaXMudFxuICByLnMgPSB+dGhpcy5zXG4gIHJldHVybiByXG59XG5cbi8vIChwdWJsaWMpIHRoaXMgPDwgblxuZnVuY3Rpb24gYm5TaGlmdExlZnQobikge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgaWYgKG4gPCAwKSB0aGlzLnJTaGlmdFRvKC1uLCByKVxuICBlbHNlIHRoaXMubFNoaWZ0VG8obiwgcilcbiAgcmV0dXJuIHJcbn1cblxuLy8gKHB1YmxpYykgdGhpcyA+PiBuXG5mdW5jdGlvbiBiblNoaWZ0UmlnaHQobikge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgaWYgKG4gPCAwKSB0aGlzLmxTaGlmdFRvKC1uLCByKVxuICBlbHNlIHRoaXMuclNoaWZ0VG8obiwgcilcbiAgcmV0dXJuIHJcbn1cblxuLy8gcmV0dXJuIGluZGV4IG9mIGxvd2VzdCAxLWJpdCBpbiB4LCB4IDwgMl4zMVxuZnVuY3Rpb24gbGJpdCh4KSB7XG4gIGlmICh4ID09IDApIHJldHVybiAtMVxuICB2YXIgciA9IDBcbiAgaWYgKCh4ICYgMHhmZmZmKSA9PSAwKSB7XG4gICAgeCA+Pj0gMTZcbiAgICByICs9IDE2XG4gIH1cbiAgaWYgKCh4ICYgMHhmZikgPT0gMCkge1xuICAgIHggPj49IDhcbiAgICByICs9IDhcbiAgfVxuICBpZiAoKHggJiAweGYpID09IDApIHtcbiAgICB4ID4+PSA0XG4gICAgciArPSA0XG4gIH1cbiAgaWYgKCh4ICYgMykgPT0gMCkge1xuICAgIHggPj49IDJcbiAgICByICs9IDJcbiAgfVxuICBpZiAoKHggJiAxKSA9PSAwKSsrclxuICByZXR1cm4gclxufVxuXG4vLyAocHVibGljKSByZXR1cm5zIGluZGV4IG9mIGxvd2VzdCAxLWJpdCAob3IgLTEgaWYgbm9uZSlcbmZ1bmN0aW9uIGJuR2V0TG93ZXN0U2V0Qml0KCkge1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudDsgKytpKVxuICAgIGlmICh0aGlzW2ldICE9IDApIHJldHVybiBpICogdGhpcy5EQiArIGxiaXQodGhpc1tpXSlcbiAgaWYgKHRoaXMucyA8IDApIHJldHVybiB0aGlzLnQgKiB0aGlzLkRCXG4gIHJldHVybiAtMVxufVxuXG4vLyByZXR1cm4gbnVtYmVyIG9mIDEgYml0cyBpbiB4XG5mdW5jdGlvbiBjYml0KHgpIHtcbiAgdmFyIHIgPSAwXG4gIHdoaWxlICh4ICE9IDApIHtcbiAgICB4ICY9IHggLSAxXG4gICAgKytyXG4gIH1cbiAgcmV0dXJuIHJcbn1cblxuLy8gKHB1YmxpYykgcmV0dXJuIG51bWJlciBvZiBzZXQgYml0c1xuZnVuY3Rpb24gYm5CaXRDb3VudCgpIHtcbiAgdmFyIHIgPSAwLFxuICAgIHggPSB0aGlzLnMgJiB0aGlzLkRNXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy50OyArK2kpIHIgKz0gY2JpdCh0aGlzW2ldIF4geClcbiAgcmV0dXJuIHJcbn1cblxuLy8gKHB1YmxpYykgdHJ1ZSBpZmYgbnRoIGJpdCBpcyBzZXRcbmZ1bmN0aW9uIGJuVGVzdEJpdChuKSB7XG4gIHZhciBqID0gTWF0aC5mbG9vcihuIC8gdGhpcy5EQilcbiAgaWYgKGogPj0gdGhpcy50KSByZXR1cm4gKHRoaXMucyAhPSAwKVxuICByZXR1cm4gKCh0aGlzW2pdICYgKDEgPDwgKG4gJSB0aGlzLkRCKSkpICE9IDApXG59XG5cbi8vIChwcm90ZWN0ZWQpIHRoaXMgb3AgKDE8PG4pXG5mdW5jdGlvbiBibnBDaGFuZ2VCaXQobiwgb3ApIHtcbiAgdmFyIHIgPSBCaWdJbnRlZ2VyLk9ORS5zaGlmdExlZnQobilcbiAgdGhpcy5iaXR3aXNlVG8ociwgb3AsIHIpXG4gIHJldHVybiByXG59XG5cbi8vIChwdWJsaWMpIHRoaXMgfCAoMTw8bilcbmZ1bmN0aW9uIGJuU2V0Qml0KG4pIHtcbiAgcmV0dXJuIHRoaXMuY2hhbmdlQml0KG4sIG9wX29yKVxufVxuXG4vLyAocHVibGljKSB0aGlzICYgfigxPDxuKVxuZnVuY3Rpb24gYm5DbGVhckJpdChuKSB7XG4gIHJldHVybiB0aGlzLmNoYW5nZUJpdChuLCBvcF9hbmRub3QpXG59XG5cbi8vIChwdWJsaWMpIHRoaXMgXiAoMTw8bilcbmZ1bmN0aW9uIGJuRmxpcEJpdChuKSB7XG4gIHJldHVybiB0aGlzLmNoYW5nZUJpdChuLCBvcF94b3IpXG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSB0aGlzICsgYVxuZnVuY3Rpb24gYm5wQWRkVG8oYSwgcikge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICB2YXIgaSA9IDAsXG4gICAgYyA9IDAsXG4gICAgbSA9IE1hdGgubWluKGEudCwgc2VsZi50KVxuICB3aGlsZSAoaSA8IG0pIHtcbiAgICBjICs9IHNlbGZbaV0gKyBhW2ldXG4gICAgcltpKytdID0gYyAmIHNlbGYuRE1cbiAgICBjID4+PSBzZWxmLkRCXG4gIH1cbiAgaWYgKGEudCA8IHNlbGYudCkge1xuICAgIGMgKz0gYS5zXG4gICAgd2hpbGUgKGkgPCBzZWxmLnQpIHtcbiAgICAgIGMgKz0gc2VsZltpXVxuICAgICAgcltpKytdID0gYyAmIHNlbGYuRE1cbiAgICAgIGMgPj49IHNlbGYuREJcbiAgICB9XG4gICAgYyArPSBzZWxmLnNcbiAgfSBlbHNlIHtcbiAgICBjICs9IHNlbGYuc1xuICAgIHdoaWxlIChpIDwgYS50KSB7XG4gICAgICBjICs9IGFbaV1cbiAgICAgIHJbaSsrXSA9IGMgJiBzZWxmLkRNXG4gICAgICBjID4+PSBzZWxmLkRCXG4gICAgfVxuICAgIGMgKz0gYS5zXG4gIH1cbiAgci5zID0gKGMgPCAwKSA/IC0xIDogMFxuICBpZiAoYyA+IDApIHJbaSsrXSA9IGNcbiAgZWxzZSBpZiAoYyA8IC0xKSByW2krK10gPSBzZWxmLkRWICsgY1xuICByLnQgPSBpXG4gIHIuY2xhbXAoKVxufVxuXG4vLyAocHVibGljKSB0aGlzICsgYVxuZnVuY3Rpb24gYm5BZGQoYSkge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgdGhpcy5hZGRUbyhhLCByKVxuICByZXR1cm4gclxufVxuXG4vLyAocHVibGljKSB0aGlzIC0gYVxuZnVuY3Rpb24gYm5TdWJ0cmFjdChhKSB7XG4gIHZhciByID0gbmV3IEJpZ0ludGVnZXIoKVxuICB0aGlzLnN1YlRvKGEsIHIpXG4gIHJldHVybiByXG59XG5cbi8vIChwdWJsaWMpIHRoaXMgKiBhXG5mdW5jdGlvbiBibk11bHRpcGx5KGEpIHtcbiAgdmFyIHIgPSBuZXcgQmlnSW50ZWdlcigpXG4gIHRoaXMubXVsdGlwbHlUbyhhLCByKVxuICByZXR1cm4gclxufVxuXG4vLyAocHVibGljKSB0aGlzXjJcbmZ1bmN0aW9uIGJuU3F1YXJlKCkge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgdGhpcy5zcXVhcmVUbyhyKVxuICByZXR1cm4gclxufVxuXG4vLyAocHVibGljKSB0aGlzIC8gYVxuZnVuY3Rpb24gYm5EaXZpZGUoYSkge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgdGhpcy5kaXZSZW1UbyhhLCByLCBudWxsKVxuICByZXR1cm4gclxufVxuXG4vLyAocHVibGljKSB0aGlzICUgYVxuZnVuY3Rpb24gYm5SZW1haW5kZXIoYSkge1xuICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgdGhpcy5kaXZSZW1UbyhhLCBudWxsLCByKVxuICByZXR1cm4gclxufVxuXG4vLyAocHVibGljKSBbdGhpcy9hLHRoaXMlYV1cbmZ1bmN0aW9uIGJuRGl2aWRlQW5kUmVtYWluZGVyKGEpIHtcbiAgdmFyIHEgPSBuZXcgQmlnSW50ZWdlcigpLFxuICAgIHIgPSBuZXcgQmlnSW50ZWdlcigpXG4gIHRoaXMuZGl2UmVtVG8oYSwgcSwgcilcbiAgcmV0dXJuIG5ldyBBcnJheShxLCByKVxufVxuXG4vLyAocHJvdGVjdGVkKSB0aGlzICo9IG4sIHRoaXMgPj0gMCwgMSA8IG4gPCBEVlxuZnVuY3Rpb24gYm5wRE11bHRpcGx5KG4pIHtcbiAgdGhpc1t0aGlzLnRdID0gdGhpcy5hbSgwLCBuIC0gMSwgdGhpcywgMCwgMCwgdGhpcy50KVxuICArK3RoaXMudFxuICB0aGlzLmNsYW1wKClcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyArPSBuIDw8IHcgd29yZHMsIHRoaXMgPj0gMFxuZnVuY3Rpb24gYm5wREFkZE9mZnNldChuLCB3KSB7XG4gIGlmIChuID09IDApIHJldHVyblxuICB3aGlsZSAodGhpcy50IDw9IHcpIHRoaXNbdGhpcy50KytdID0gMFxuICB0aGlzW3ddICs9IG5cbiAgd2hpbGUgKHRoaXNbd10gPj0gdGhpcy5EVikge1xuICAgIHRoaXNbd10gLT0gdGhpcy5EVlxuICAgIGlmICgrK3cgPj0gdGhpcy50KSB0aGlzW3RoaXMudCsrXSA9IDBcbiAgICArK3RoaXNbd11cbiAgfVxufVxuXG4vLyBBIFwibnVsbFwiIHJlZHVjZXJcbmZ1bmN0aW9uIE51bGxFeHAoKSB7fVxuXG5mdW5jdGlvbiBuTm9wKHgpIHtcbiAgcmV0dXJuIHhcbn1cblxuZnVuY3Rpb24gbk11bFRvKHgsIHksIHIpIHtcbiAgeC5tdWx0aXBseVRvKHksIHIpXG59XG5cbmZ1bmN0aW9uIG5TcXJUbyh4LCByKSB7XG4gIHguc3F1YXJlVG8ocilcbn1cblxuTnVsbEV4cC5wcm90b3R5cGUuY29udmVydCA9IG5Ob3Bcbk51bGxFeHAucHJvdG90eXBlLnJldmVydCA9IG5Ob3Bcbk51bGxFeHAucHJvdG90eXBlLm11bFRvID0gbk11bFRvXG5OdWxsRXhwLnByb3RvdHlwZS5zcXJUbyA9IG5TcXJUb1xuXG4vLyAocHVibGljKSB0aGlzXmVcbmZ1bmN0aW9uIGJuUG93KGUpIHtcbiAgcmV0dXJuIHRoaXMuZXhwKGUsIG5ldyBOdWxsRXhwKCkpXG59XG5cbi8vIChwcm90ZWN0ZWQpIHIgPSBsb3dlciBuIHdvcmRzIG9mIFwidGhpcyAqIGFcIiwgYS50IDw9IG5cbi8vIFwidGhpc1wiIHNob3VsZCBiZSB0aGUgbGFyZ2VyIG9uZSBpZiBhcHByb3ByaWF0ZS5cbmZ1bmN0aW9uIGJucE11bHRpcGx5TG93ZXJUbyhhLCBuLCByKSB7XG4gIHZhciBpID0gTWF0aC5taW4odGhpcy50ICsgYS50LCBuKVxuICByLnMgPSAwOyAvLyBhc3N1bWVzIGEsdGhpcyA+PSAwXG4gIHIudCA9IGlcbiAgd2hpbGUgKGkgPiAwKSByWy0taV0gPSAwXG4gIHZhciBqXG4gIGZvciAoaiA9IHIudCAtIHRoaXMudDsgaSA8IGo7ICsraSkgcltpICsgdGhpcy50XSA9IHRoaXMuYW0oMCwgYVtpXSwgciwgaSwgMCwgdGhpcy50KVxuICBmb3IgKGogPSBNYXRoLm1pbihhLnQsIG4pOyBpIDwgajsgKytpKSB0aGlzLmFtKDAsIGFbaV0sIHIsIGksIDAsIG4gLSBpKVxuICByLmNsYW1wKClcbn1cblxuLy8gKHByb3RlY3RlZCkgciA9IFwidGhpcyAqIGFcIiB3aXRob3V0IGxvd2VyIG4gd29yZHMsIG4gPiAwXG4vLyBcInRoaXNcIiBzaG91bGQgYmUgdGhlIGxhcmdlciBvbmUgaWYgYXBwcm9wcmlhdGUuXG5mdW5jdGlvbiBibnBNdWx0aXBseVVwcGVyVG8oYSwgbiwgcikge1xuICAtLW5cbiAgdmFyIGkgPSByLnQgPSB0aGlzLnQgKyBhLnQgLSBuXG4gIHIucyA9IDA7IC8vIGFzc3VtZXMgYSx0aGlzID49IDBcbiAgd2hpbGUgKC0taSA+PSAwKSByW2ldID0gMFxuICBmb3IgKGkgPSBNYXRoLm1heChuIC0gdGhpcy50LCAwKTsgaSA8IGEudDsgKytpKVxuICAgIHJbdGhpcy50ICsgaSAtIG5dID0gdGhpcy5hbShuIC0gaSwgYVtpXSwgciwgMCwgMCwgdGhpcy50ICsgaSAtIG4pXG4gIHIuY2xhbXAoKVxuICByLmRyU2hpZnRUbygxLCByKVxufVxuXG4vLyBCYXJyZXR0IG1vZHVsYXIgcmVkdWN0aW9uXG5mdW5jdGlvbiBCYXJyZXR0KG0pIHtcbiAgLy8gc2V0dXAgQmFycmV0dFxuICB0aGlzLnIyID0gbmV3IEJpZ0ludGVnZXIoKVxuICB0aGlzLnEzID0gbmV3IEJpZ0ludGVnZXIoKVxuICBCaWdJbnRlZ2VyLk9ORS5kbFNoaWZ0VG8oMiAqIG0udCwgdGhpcy5yMilcbiAgdGhpcy5tdSA9IHRoaXMucjIuZGl2aWRlKG0pXG4gIHRoaXMubSA9IG1cbn1cblxuZnVuY3Rpb24gYmFycmV0dENvbnZlcnQoeCkge1xuICBpZiAoeC5zIDwgMCB8fCB4LnQgPiAyICogdGhpcy5tLnQpIHJldHVybiB4Lm1vZCh0aGlzLm0pXG4gIGVsc2UgaWYgKHguY29tcGFyZVRvKHRoaXMubSkgPCAwKSByZXR1cm4geFxuICBlbHNlIHtcbiAgICB2YXIgciA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgICB4LmNvcHlUbyhyKVxuICAgIHRoaXMucmVkdWNlKHIpXG4gICAgcmV0dXJuIHJcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXJyZXR0UmV2ZXJ0KHgpIHtcbiAgcmV0dXJuIHhcbn1cblxuLy8geCA9IHggbW9kIG0gKEhBQyAxNC40MilcbmZ1bmN0aW9uIGJhcnJldHRSZWR1Y2UoeCkge1xuICB2YXIgc2VsZiA9IHRoaXNcbiAgeC5kclNoaWZ0VG8oc2VsZi5tLnQgLSAxLCBzZWxmLnIyKVxuICBpZiAoeC50ID4gc2VsZi5tLnQgKyAxKSB7XG4gICAgeC50ID0gc2VsZi5tLnQgKyAxXG4gICAgeC5jbGFtcCgpXG4gIH1cbiAgc2VsZi5tdS5tdWx0aXBseVVwcGVyVG8oc2VsZi5yMiwgc2VsZi5tLnQgKyAxLCBzZWxmLnEzKVxuICBzZWxmLm0ubXVsdGlwbHlMb3dlclRvKHNlbGYucTMsIHNlbGYubS50ICsgMSwgc2VsZi5yMilcbiAgd2hpbGUgKHguY29tcGFyZVRvKHNlbGYucjIpIDwgMCkgeC5kQWRkT2Zmc2V0KDEsIHNlbGYubS50ICsgMSlcbiAgeC5zdWJUbyhzZWxmLnIyLCB4KVxuICB3aGlsZSAoeC5jb21wYXJlVG8oc2VsZi5tKSA+PSAwKSB4LnN1YlRvKHNlbGYubSwgeClcbn1cblxuLy8gciA9IHheMiBtb2QgbTsgeCAhPSByXG5mdW5jdGlvbiBiYXJyZXR0U3FyVG8oeCwgcikge1xuICB4LnNxdWFyZVRvKHIpXG4gIHRoaXMucmVkdWNlKHIpXG59XG5cbi8vIHIgPSB4KnkgbW9kIG07IHgseSAhPSByXG5mdW5jdGlvbiBiYXJyZXR0TXVsVG8oeCwgeSwgcikge1xuICB4Lm11bHRpcGx5VG8oeSwgcilcbiAgdGhpcy5yZWR1Y2Uocilcbn1cblxuQmFycmV0dC5wcm90b3R5cGUuY29udmVydCA9IGJhcnJldHRDb252ZXJ0XG5CYXJyZXR0LnByb3RvdHlwZS5yZXZlcnQgPSBiYXJyZXR0UmV2ZXJ0XG5CYXJyZXR0LnByb3RvdHlwZS5yZWR1Y2UgPSBiYXJyZXR0UmVkdWNlXG5CYXJyZXR0LnByb3RvdHlwZS5tdWxUbyA9IGJhcnJldHRNdWxUb1xuQmFycmV0dC5wcm90b3R5cGUuc3FyVG8gPSBiYXJyZXR0U3FyVG9cblxuLy8gKHB1YmxpYykgdGhpc15lICUgbSAoSEFDIDE0Ljg1KVxuZnVuY3Rpb24gYm5Nb2RQb3coZSwgbSkge1xuICB2YXIgaSA9IGUuYml0TGVuZ3RoKCksXG4gICAgaywgciA9IG5idigxKSxcbiAgICB6XG4gIGlmIChpIDw9IDApIHJldHVybiByXG4gIGVsc2UgaWYgKGkgPCAxOCkgayA9IDFcbiAgZWxzZSBpZiAoaSA8IDQ4KSBrID0gM1xuICBlbHNlIGlmIChpIDwgMTQ0KSBrID0gNFxuICBlbHNlIGlmIChpIDwgNzY4KSBrID0gNVxuICBlbHNlIGsgPSA2XG4gIGlmIChpIDwgOClcbiAgICB6ID0gbmV3IENsYXNzaWMobSlcbiAgZWxzZSBpZiAobS5pc0V2ZW4oKSlcbiAgICB6ID0gbmV3IEJhcnJldHQobSlcbiAgZWxzZVxuICAgIHogPSBuZXcgTW9udGdvbWVyeShtKVxuXG4gIC8vIHByZWNvbXB1dGF0aW9uXG4gIHZhciBnID0gbmV3IEFycmF5KCksXG4gICAgbiA9IDMsXG4gICAgazEgPSBrIC0gMSxcbiAgICBrbSA9ICgxIDw8IGspIC0gMVxuICBnWzFdID0gei5jb252ZXJ0KHRoaXMpXG4gIGlmIChrID4gMSkge1xuICAgIHZhciBnMiA9IG5ldyBCaWdJbnRlZ2VyKClcbiAgICB6LnNxclRvKGdbMV0sIGcyKVxuICAgIHdoaWxlIChuIDw9IGttKSB7XG4gICAgICBnW25dID0gbmV3IEJpZ0ludGVnZXIoKVxuICAgICAgei5tdWxUbyhnMiwgZ1tuIC0gMl0sIGdbbl0pXG4gICAgICBuICs9IDJcbiAgICB9XG4gIH1cblxuICB2YXIgaiA9IGUudCAtIDEsXG4gICAgdywgaXMxID0gdHJ1ZSxcbiAgICByMiA9IG5ldyBCaWdJbnRlZ2VyKCksXG4gICAgdFxuICBpID0gbmJpdHMoZVtqXSkgLSAxXG4gIHdoaWxlIChqID49IDApIHtcbiAgICBpZiAoaSA+PSBrMSkgdyA9IChlW2pdID4+IChpIC0gazEpKSAmIGttXG4gICAgZWxzZSB7XG4gICAgICB3ID0gKGVbal0gJiAoKDEgPDwgKGkgKyAxKSkgLSAxKSkgPDwgKGsxIC0gaSlcbiAgICAgIGlmIChqID4gMCkgdyB8PSBlW2ogLSAxXSA+PiAodGhpcy5EQiArIGkgLSBrMSlcbiAgICB9XG5cbiAgICBuID0ga1xuICAgIHdoaWxlICgodyAmIDEpID09IDApIHtcbiAgICAgIHcgPj49IDFcbiAgICAgIC0tblxuICAgIH1cbiAgICBpZiAoKGkgLT0gbikgPCAwKSB7XG4gICAgICBpICs9IHRoaXMuREJcbiAgICAgIC0talxuICAgIH1cbiAgICBpZiAoaXMxKSB7IC8vIHJldCA9PSAxLCBkb24ndCBib3RoZXIgc3F1YXJpbmcgb3IgbXVsdGlwbHlpbmcgaXRcbiAgICAgIGdbd10uY29weVRvKHIpXG4gICAgICBpczEgPSBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAobiA+IDEpIHtcbiAgICAgICAgei5zcXJUbyhyLCByMilcbiAgICAgICAgei5zcXJUbyhyMiwgcilcbiAgICAgICAgbiAtPSAyXG4gICAgICB9XG4gICAgICBpZiAobiA+IDApIHouc3FyVG8ociwgcjIpXG4gICAgICBlbHNlIHtcbiAgICAgICAgdCA9IHJcbiAgICAgICAgciA9IHIyXG4gICAgICAgIHIyID0gdFxuICAgICAgfVxuICAgICAgei5tdWxUbyhyMiwgZ1t3XSwgcilcbiAgICB9XG5cbiAgICB3aGlsZSAoaiA+PSAwICYmIChlW2pdICYgKDEgPDwgaSkpID09IDApIHtcbiAgICAgIHouc3FyVG8ociwgcjIpXG4gICAgICB0ID0gclxuICAgICAgciA9IHIyXG4gICAgICByMiA9IHRcbiAgICAgIGlmICgtLWkgPCAwKSB7XG4gICAgICAgIGkgPSB0aGlzLkRCIC0gMVxuICAgICAgICAtLWpcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHoucmV2ZXJ0KHIpXG59XG5cbi8vIChwdWJsaWMpIGdjZCh0aGlzLGEpIChIQUMgMTQuNTQpXG5mdW5jdGlvbiBibkdDRChhKSB7XG4gIHZhciB4ID0gKHRoaXMucyA8IDApID8gdGhpcy5uZWdhdGUoKSA6IHRoaXMuY2xvbmUoKVxuICB2YXIgeSA9IChhLnMgPCAwKSA/IGEubmVnYXRlKCkgOiBhLmNsb25lKClcbiAgaWYgKHguY29tcGFyZVRvKHkpIDwgMCkge1xuICAgIHZhciB0ID0geFxuICAgIHggPSB5XG4gICAgeSA9IHRcbiAgfVxuICB2YXIgaSA9IHguZ2V0TG93ZXN0U2V0Qml0KCksXG4gICAgZyA9IHkuZ2V0TG93ZXN0U2V0Qml0KClcbiAgaWYgKGcgPCAwKSByZXR1cm4geFxuICBpZiAoaSA8IGcpIGcgPSBpXG4gIGlmIChnID4gMCkge1xuICAgIHguclNoaWZ0VG8oZywgeClcbiAgICB5LnJTaGlmdFRvKGcsIHkpXG4gIH1cbiAgd2hpbGUgKHguc2lnbnVtKCkgPiAwKSB7XG4gICAgaWYgKChpID0geC5nZXRMb3dlc3RTZXRCaXQoKSkgPiAwKSB4LnJTaGlmdFRvKGksIHgpXG4gICAgaWYgKChpID0geS5nZXRMb3dlc3RTZXRCaXQoKSkgPiAwKSB5LnJTaGlmdFRvKGksIHkpXG4gICAgaWYgKHguY29tcGFyZVRvKHkpID49IDApIHtcbiAgICAgIHguc3ViVG8oeSwgeClcbiAgICAgIHguclNoaWZ0VG8oMSwgeClcbiAgICB9IGVsc2Uge1xuICAgICAgeS5zdWJUbyh4LCB5KVxuICAgICAgeS5yU2hpZnRUbygxLCB5KVxuICAgIH1cbiAgfVxuICBpZiAoZyA+IDApIHkubFNoaWZ0VG8oZywgeSlcbiAgcmV0dXJuIHlcbn1cblxuLy8gKHByb3RlY3RlZCkgdGhpcyAlIG4sIG4gPCAyXjI2XG5mdW5jdGlvbiBibnBNb2RJbnQobikge1xuICBpZiAobiA8PSAwKSByZXR1cm4gMFxuICB2YXIgZCA9IHRoaXMuRFYgJSBuLFxuICAgIHIgPSAodGhpcy5zIDwgMCkgPyBuIC0gMSA6IDBcbiAgaWYgKHRoaXMudCA+IDApXG4gICAgaWYgKGQgPT0gMCkgciA9IHRoaXNbMF0gJSBuXG4gICAgZWxzZVxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudCAtIDE7IGkgPj0gMDsgLS1pKSByID0gKGQgKiByICsgdGhpc1tpXSkgJSBuXG4gIHJldHVybiByXG59XG5cbi8vIChwdWJsaWMpIDEvdGhpcyAlIG0gKEhBQyAxNC42MSlcbmZ1bmN0aW9uIGJuTW9kSW52ZXJzZShtKSB7XG4gIHZhciBhYyA9IG0uaXNFdmVuKClcbiAgaWYgKHRoaXMuc2lnbnVtKCkgPT09IDApIHRocm93IG5ldyBFcnJvcignZGl2aXNpb24gYnkgemVybycpXG4gIGlmICgodGhpcy5pc0V2ZW4oKSAmJiBhYykgfHwgbS5zaWdudW0oKSA9PSAwKSByZXR1cm4gQmlnSW50ZWdlci5aRVJPXG4gIHZhciB1ID0gbS5jbG9uZSgpLFxuICAgIHYgPSB0aGlzLmNsb25lKClcbiAgdmFyIGEgPSBuYnYoMSksXG4gICAgYiA9IG5idigwKSxcbiAgICBjID0gbmJ2KDApLFxuICAgIGQgPSBuYnYoMSlcbiAgd2hpbGUgKHUuc2lnbnVtKCkgIT0gMCkge1xuICAgIHdoaWxlICh1LmlzRXZlbigpKSB7XG4gICAgICB1LnJTaGlmdFRvKDEsIHUpXG4gICAgICBpZiAoYWMpIHtcbiAgICAgICAgaWYgKCFhLmlzRXZlbigpIHx8ICFiLmlzRXZlbigpKSB7XG4gICAgICAgICAgYS5hZGRUbyh0aGlzLCBhKVxuICAgICAgICAgIGIuc3ViVG8obSwgYilcbiAgICAgICAgfVxuICAgICAgICBhLnJTaGlmdFRvKDEsIGEpXG4gICAgICB9IGVsc2UgaWYgKCFiLmlzRXZlbigpKSBiLnN1YlRvKG0sIGIpXG4gICAgICBiLnJTaGlmdFRvKDEsIGIpXG4gICAgfVxuICAgIHdoaWxlICh2LmlzRXZlbigpKSB7XG4gICAgICB2LnJTaGlmdFRvKDEsIHYpXG4gICAgICBpZiAoYWMpIHtcbiAgICAgICAgaWYgKCFjLmlzRXZlbigpIHx8ICFkLmlzRXZlbigpKSB7XG4gICAgICAgICAgYy5hZGRUbyh0aGlzLCBjKVxuICAgICAgICAgIGQuc3ViVG8obSwgZClcbiAgICAgICAgfVxuICAgICAgICBjLnJTaGlmdFRvKDEsIGMpXG4gICAgICB9IGVsc2UgaWYgKCFkLmlzRXZlbigpKSBkLnN1YlRvKG0sIGQpXG4gICAgICBkLnJTaGlmdFRvKDEsIGQpXG4gICAgfVxuICAgIGlmICh1LmNvbXBhcmVUbyh2KSA+PSAwKSB7XG4gICAgICB1LnN1YlRvKHYsIHUpXG4gICAgICBpZiAoYWMpIGEuc3ViVG8oYywgYSlcbiAgICAgIGIuc3ViVG8oZCwgYilcbiAgICB9IGVsc2Uge1xuICAgICAgdi5zdWJUbyh1LCB2KVxuICAgICAgaWYgKGFjKSBjLnN1YlRvKGEsIGMpXG4gICAgICBkLnN1YlRvKGIsIGQpXG4gICAgfVxuICB9XG4gIGlmICh2LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgIT0gMCkgcmV0dXJuIEJpZ0ludGVnZXIuWkVST1xuICB3aGlsZSAoZC5jb21wYXJlVG8obSkgPj0gMCkgZC5zdWJUbyhtLCBkKVxuICB3aGlsZSAoZC5zaWdudW0oKSA8IDApIGQuYWRkVG8obSwgZClcbiAgcmV0dXJuIGRcbn1cblxudmFyIGxvd3ByaW1lcyA9IFtcbiAgMiwgMywgNSwgNywgMTEsIDEzLCAxNywgMTksIDIzLCAyOSwgMzEsIDM3LCA0MSwgNDMsIDQ3LCA1MywgNTksIDYxLCA2NywgNzEsXG4gIDczLCA3OSwgODMsIDg5LCA5NywgMTAxLCAxMDMsIDEwNywgMTA5LCAxMTMsIDEyNywgMTMxLCAxMzcsIDEzOSwgMTQ5LCAxNTEsXG4gIDE1NywgMTYzLCAxNjcsIDE3MywgMTc5LCAxODEsIDE5MSwgMTkzLCAxOTcsIDE5OSwgMjExLCAyMjMsIDIyNywgMjI5LCAyMzMsXG4gIDIzOSwgMjQxLCAyNTEsIDI1NywgMjYzLCAyNjksIDI3MSwgMjc3LCAyODEsIDI4MywgMjkzLCAzMDcsIDMxMSwgMzEzLCAzMTcsXG4gIDMzMSwgMzM3LCAzNDcsIDM0OSwgMzUzLCAzNTksIDM2NywgMzczLCAzNzksIDM4MywgMzg5LCAzOTcsIDQwMSwgNDA5LCA0MTksXG4gIDQyMSwgNDMxLCA0MzMsIDQzOSwgNDQzLCA0NDksIDQ1NywgNDYxLCA0NjMsIDQ2NywgNDc5LCA0ODcsIDQ5MSwgNDk5LCA1MDMsXG4gIDUwOSwgNTIxLCA1MjMsIDU0MSwgNTQ3LCA1NTcsIDU2MywgNTY5LCA1NzEsIDU3NywgNTg3LCA1OTMsIDU5OSwgNjAxLCA2MDcsXG4gIDYxMywgNjE3LCA2MTksIDYzMSwgNjQxLCA2NDMsIDY0NywgNjUzLCA2NTksIDY2MSwgNjczLCA2NzcsIDY4MywgNjkxLCA3MDEsXG4gIDcwOSwgNzE5LCA3MjcsIDczMywgNzM5LCA3NDMsIDc1MSwgNzU3LCA3NjEsIDc2OSwgNzczLCA3ODcsIDc5NywgODA5LCA4MTEsXG4gIDgyMSwgODIzLCA4MjcsIDgyOSwgODM5LCA4NTMsIDg1NywgODU5LCA4NjMsIDg3NywgODgxLCA4ODMsIDg4NywgOTA3LCA5MTEsXG4gIDkxOSwgOTI5LCA5MzcsIDk0MSwgOTQ3LCA5NTMsIDk2NywgOTcxLCA5NzcsIDk4MywgOTkxLCA5OTdcbl1cblxudmFyIGxwbGltID0gKDEgPDwgMjYpIC8gbG93cHJpbWVzW2xvd3ByaW1lcy5sZW5ndGggLSAxXVxuXG4vLyAocHVibGljKSB0ZXN0IHByaW1hbGl0eSB3aXRoIGNlcnRhaW50eSA+PSAxLS41XnRcbmZ1bmN0aW9uIGJuSXNQcm9iYWJsZVByaW1lKHQpIHtcbiAgdmFyIGksIHggPSB0aGlzLmFicygpXG4gIGlmICh4LnQgPT0gMSAmJiB4WzBdIDw9IGxvd3ByaW1lc1tsb3dwcmltZXMubGVuZ3RoIC0gMV0pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbG93cHJpbWVzLmxlbmd0aDsgKytpKVxuICAgICAgaWYgKHhbMF0gPT0gbG93cHJpbWVzW2ldKSByZXR1cm4gdHJ1ZVxuICAgIHJldHVybiBmYWxzZVxuICB9XG4gIGlmICh4LmlzRXZlbigpKSByZXR1cm4gZmFsc2VcbiAgaSA9IDFcbiAgd2hpbGUgKGkgPCBsb3dwcmltZXMubGVuZ3RoKSB7XG4gICAgdmFyIG0gPSBsb3dwcmltZXNbaV0sXG4gICAgICBqID0gaSArIDFcbiAgICB3aGlsZSAoaiA8IGxvd3ByaW1lcy5sZW5ndGggJiYgbSA8IGxwbGltKSBtICo9IGxvd3ByaW1lc1tqKytdXG4gICAgbSA9IHgubW9kSW50KG0pXG4gICAgd2hpbGUgKGkgPCBqKSBpZiAobSAlIGxvd3ByaW1lc1tpKytdID09IDApIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiB4Lm1pbGxlclJhYmluKHQpXG59XG5cbi8vIChwcm90ZWN0ZWQpIHRydWUgaWYgcHJvYmFibHkgcHJpbWUgKEhBQyA0LjI0LCBNaWxsZXItUmFiaW4pXG5mdW5jdGlvbiBibnBNaWxsZXJSYWJpbih0KSB7XG4gIHZhciBuMSA9IHRoaXMuc3VidHJhY3QoQmlnSW50ZWdlci5PTkUpXG4gIHZhciBrID0gbjEuZ2V0TG93ZXN0U2V0Qml0KClcbiAgaWYgKGsgPD0gMCkgcmV0dXJuIGZhbHNlXG4gIHZhciByID0gbjEuc2hpZnRSaWdodChrKVxuICB0ID0gKHQgKyAxKSA+PiAxXG4gIGlmICh0ID4gbG93cHJpbWVzLmxlbmd0aCkgdCA9IGxvd3ByaW1lcy5sZW5ndGhcbiAgdmFyIGEgPSBuZXcgQmlnSW50ZWdlcihudWxsKVxuICB2YXIgaiwgYmFzZXMgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHQ7ICsraSkge1xuICAgIGZvciAoOzspIHtcbiAgICAgIGogPSBsb3dwcmltZXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbG93cHJpbWVzLmxlbmd0aCldXG4gICAgICBpZiAoYmFzZXMuaW5kZXhPZihqKSA9PSAtMSkgYnJlYWtcbiAgICB9XG4gICAgYmFzZXMucHVzaChqKVxuICAgIGEuZnJvbUludChqKVxuICAgIHZhciB5ID0gYS5tb2RQb3cociwgdGhpcylcbiAgICBpZiAoeS5jb21wYXJlVG8oQmlnSW50ZWdlci5PTkUpICE9IDAgJiYgeS5jb21wYXJlVG8objEpICE9IDApIHtcbiAgICAgIHZhciBqID0gMVxuICAgICAgd2hpbGUgKGorKyA8IGsgJiYgeS5jb21wYXJlVG8objEpICE9IDApIHtcbiAgICAgICAgeSA9IHkubW9kUG93SW50KDIsIHRoaXMpXG4gICAgICAgIGlmICh5LmNvbXBhcmVUbyhCaWdJbnRlZ2VyLk9ORSkgPT0gMCkgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICBpZiAoeS5jb21wYXJlVG8objEpICE9IDApIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG4vLyBwcm90ZWN0ZWRcbnByb3RvLmNodW5rU2l6ZSA9IGJucENodW5rU2l6ZVxucHJvdG8udG9SYWRpeCA9IGJucFRvUmFkaXhcbnByb3RvLmZyb21SYWRpeCA9IGJucEZyb21SYWRpeFxucHJvdG8uZnJvbU51bWJlciA9IGJucEZyb21OdW1iZXJcbnByb3RvLmJpdHdpc2VUbyA9IGJucEJpdHdpc2VUb1xucHJvdG8uY2hhbmdlQml0ID0gYm5wQ2hhbmdlQml0XG5wcm90by5hZGRUbyA9IGJucEFkZFRvXG5wcm90by5kTXVsdGlwbHkgPSBibnBETXVsdGlwbHlcbnByb3RvLmRBZGRPZmZzZXQgPSBibnBEQWRkT2Zmc2V0XG5wcm90by5tdWx0aXBseUxvd2VyVG8gPSBibnBNdWx0aXBseUxvd2VyVG9cbnByb3RvLm11bHRpcGx5VXBwZXJUbyA9IGJucE11bHRpcGx5VXBwZXJUb1xucHJvdG8ubW9kSW50ID0gYm5wTW9kSW50XG5wcm90by5taWxsZXJSYWJpbiA9IGJucE1pbGxlclJhYmluXG5cbi8vIHB1YmxpY1xucHJvdG8uY2xvbmUgPSBibkNsb25lXG5wcm90by5pbnRWYWx1ZSA9IGJuSW50VmFsdWVcbnByb3RvLmJ5dGVWYWx1ZSA9IGJuQnl0ZVZhbHVlXG5wcm90by5zaG9ydFZhbHVlID0gYm5TaG9ydFZhbHVlXG5wcm90by5zaWdudW0gPSBiblNpZ051bVxucHJvdG8udG9CeXRlQXJyYXkgPSBiblRvQnl0ZUFycmF5XG5wcm90by5lcXVhbHMgPSBibkVxdWFsc1xucHJvdG8ubWluID0gYm5NaW5cbnByb3RvLm1heCA9IGJuTWF4XG5wcm90by5hbmQgPSBibkFuZFxucHJvdG8ub3IgPSBibk9yXG5wcm90by54b3IgPSBiblhvclxucHJvdG8uYW5kTm90ID0gYm5BbmROb3RcbnByb3RvLm5vdCA9IGJuTm90XG5wcm90by5zaGlmdExlZnQgPSBiblNoaWZ0TGVmdFxucHJvdG8uc2hpZnRSaWdodCA9IGJuU2hpZnRSaWdodFxucHJvdG8uZ2V0TG93ZXN0U2V0Qml0ID0gYm5HZXRMb3dlc3RTZXRCaXRcbnByb3RvLmJpdENvdW50ID0gYm5CaXRDb3VudFxucHJvdG8udGVzdEJpdCA9IGJuVGVzdEJpdFxucHJvdG8uc2V0Qml0ID0gYm5TZXRCaXRcbnByb3RvLmNsZWFyQml0ID0gYm5DbGVhckJpdFxucHJvdG8uZmxpcEJpdCA9IGJuRmxpcEJpdFxucHJvdG8uYWRkID0gYm5BZGRcbnByb3RvLnN1YnRyYWN0ID0gYm5TdWJ0cmFjdFxucHJvdG8ubXVsdGlwbHkgPSBibk11bHRpcGx5XG5wcm90by5kaXZpZGUgPSBibkRpdmlkZVxucHJvdG8ucmVtYWluZGVyID0gYm5SZW1haW5kZXJcbnByb3RvLmRpdmlkZUFuZFJlbWFpbmRlciA9IGJuRGl2aWRlQW5kUmVtYWluZGVyXG5wcm90by5tb2RQb3cgPSBibk1vZFBvd1xucHJvdG8ubW9kSW52ZXJzZSA9IGJuTW9kSW52ZXJzZVxucHJvdG8ucG93ID0gYm5Qb3dcbnByb3RvLmdjZCA9IGJuR0NEXG5wcm90by5pc1Byb2JhYmxlUHJpbWUgPSBibklzUHJvYmFibGVQcmltZVxuXG4vLyBKU0JOLXNwZWNpZmljIGV4dGVuc2lvblxucHJvdG8uc3F1YXJlID0gYm5TcXVhcmVcblxuLy8gY29uc3RhbnRzXG5CaWdJbnRlZ2VyLlpFUk8gPSBuYnYoMClcbkJpZ0ludGVnZXIuT05FID0gbmJ2KDEpXG5CaWdJbnRlZ2VyLnZhbHVlT2YgPSBuYnZcblxubW9kdWxlLmV4cG9ydHMgPSBCaWdJbnRlZ2VyXG4iLCIvLyBGSVhNRTogS2luZCBvZiBhIHdlaXJkIHdheSB0byB0aHJvdyBleGNlcHRpb25zLCBjb25zaWRlciByZW1vdmluZ1xudmFyIGFzc2VydCA9IHJlcXVpcmUoJ2Fzc2VydCcpXG52YXIgQmlnSW50ZWdlciA9IHJlcXVpcmUoJy4vYmlnaScpXG5cbi8qKlxuICogVHVybnMgYSBieXRlIGFycmF5IGludG8gYSBiaWcgaW50ZWdlci5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHdpbGwgaW50ZXJwcmV0IGEgYnl0ZSBhcnJheSBhcyBhIGJpZyBpbnRlZ2VyIGluIGJpZ1xuICogZW5kaWFuIG5vdGF0aW9uLlxuICovXG5CaWdJbnRlZ2VyLmZyb21CeXRlQXJyYXlVbnNpZ25lZCA9IGZ1bmN0aW9uKGJ5dGVBcnJheSkge1xuICAvLyBCaWdJbnRlZ2VyIGV4cGVjdHMgYSBERVIgaW50ZWdlciBjb25mb3JtYW50IGJ5dGUgYXJyYXlcbiAgaWYgKGJ5dGVBcnJheVswXSAmIDB4ODApIHtcbiAgICByZXR1cm4gbmV3IEJpZ0ludGVnZXIoWzBdLmNvbmNhdChieXRlQXJyYXkpKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBCaWdJbnRlZ2VyKGJ5dGVBcnJheSlcbn1cblxuLyoqXG4gKiBSZXR1cm5zIGEgYnl0ZSBhcnJheSByZXByZXNlbnRhdGlvbiBvZiB0aGUgYmlnIGludGVnZXIuXG4gKlxuICogVGhpcyByZXR1cm5zIHRoZSBhYnNvbHV0ZSBvZiB0aGUgY29udGFpbmVkIHZhbHVlIGluIGJpZyBlbmRpYW5cbiAqIGZvcm0uIEEgdmFsdWUgb2YgemVybyByZXN1bHRzIGluIGFuIGVtcHR5IGFycmF5LlxuICovXG5CaWdJbnRlZ2VyLnByb3RvdHlwZS50b0J5dGVBcnJheVVuc2lnbmVkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBieXRlQXJyYXkgPSB0aGlzLnRvQnl0ZUFycmF5KClcbiAgcmV0dXJuIGJ5dGVBcnJheVswXSA9PT0gMCA/IGJ5dGVBcnJheS5zbGljZSgxKSA6IGJ5dGVBcnJheVxufVxuXG5CaWdJbnRlZ2VyLmZyb21ERVJJbnRlZ2VyID0gZnVuY3Rpb24oYnl0ZUFycmF5KSB7XG4gIHJldHVybiBuZXcgQmlnSW50ZWdlcihieXRlQXJyYXkpXG59XG5cbi8qXG4gKiBDb252ZXJ0cyBCaWdJbnRlZ2VyIHRvIGEgREVSIGludGVnZXIgcmVwcmVzZW50YXRpb24uXG4gKlxuICogVGhlIGZvcm1hdCBmb3IgdGhpcyB2YWx1ZSB1c2VzIHRoZSBtb3N0IHNpZ25pZmljYW50IGJpdCBhcyBhIHNpZ25cbiAqIGJpdC4gIElmIHRoZSBtb3N0IHNpZ25pZmljYW50IGJpdCBpcyBhbHJlYWR5IHNldCBhbmQgdGhlIGludGVnZXIgaXNcbiAqIHBvc2l0aXZlLCBhIDB4MDAgaXMgcHJlcGVuZGVkLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgMCA9PiAgICAgMHgwMFxuICogICAgICAxID0+ICAgICAweDAxXG4gKiAgICAgLTEgPT4gICAgIDB4ZmZcbiAqICAgIDEyNyA9PiAgICAgMHg3ZlxuICogICAtMTI3ID0+ICAgICAweDgxXG4gKiAgICAxMjggPT4gICAweDAwODBcbiAqICAgLTEyOCA9PiAgICAgMHg4MFxuICogICAgMjU1ID0+ICAgMHgwMGZmXG4gKiAgIC0yNTUgPT4gICAweGZmMDFcbiAqICAxNjMwMCA9PiAgIDB4M2ZhY1xuICogLTE2MzAwID0+ICAgMHhjMDU0XG4gKiAgNjIzMDAgPT4gMHgwMGYzNWNcbiAqIC02MjMwMCA9PiAweGZmMGNhNFxuKi9cbkJpZ0ludGVnZXIucHJvdG90eXBlLnRvREVSSW50ZWdlciA9IEJpZ0ludGVnZXIucHJvdG90eXBlLnRvQnl0ZUFycmF5XG5cbkJpZ0ludGVnZXIuZnJvbUJ1ZmZlciA9IGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAvLyBCaWdJbnRlZ2VyIGV4cGVjdHMgYSBERVIgaW50ZWdlciBjb25mb3JtYW50IGJ5dGUgYXJyYXlcbiAgaWYgKGJ1ZmZlclswXSAmIDB4ODApIHtcbiAgICB2YXIgYnl0ZUFycmF5ID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYnVmZmVyKVxuXG4gICAgcmV0dXJuIG5ldyBCaWdJbnRlZ2VyKFswXS5jb25jYXQoYnl0ZUFycmF5KSlcbiAgfVxuXG4gIHJldHVybiBuZXcgQmlnSW50ZWdlcihidWZmZXIpXG59XG5cbkJpZ0ludGVnZXIuZnJvbUhleCA9IGZ1bmN0aW9uKGhleCkge1xuICBpZiAoaGV4ID09PSAnJykgcmV0dXJuIEJpZ0ludGVnZXIuWkVST1xuXG4gIGFzc2VydC5lcXVhbChoZXgsIGhleC5tYXRjaCgvXltBLUZhLWYwLTldKy8pLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgYXNzZXJ0LmVxdWFsKGhleC5sZW5ndGggJSAyLCAwLCAnSW5jb21wbGV0ZSBoZXgnKVxuICByZXR1cm4gbmV3IEJpZ0ludGVnZXIoaGV4LCAxNilcbn1cblxuQmlnSW50ZWdlci5wcm90b3R5cGUudG9CdWZmZXIgPSBmdW5jdGlvbihzaXplKSB7XG4gIHZhciBieXRlQXJyYXkgPSB0aGlzLnRvQnl0ZUFycmF5VW5zaWduZWQoKVxuICB2YXIgemVyb3MgPSBbXVxuXG4gIHZhciBwYWRkaW5nID0gc2l6ZSAtIGJ5dGVBcnJheS5sZW5ndGhcbiAgd2hpbGUgKHplcm9zLmxlbmd0aCA8IHBhZGRpbmcpIHplcm9zLnB1c2goMClcblxuICByZXR1cm4gbmV3IEJ1ZmZlcih6ZXJvcy5jb25jYXQoYnl0ZUFycmF5KSlcbn1cblxuQmlnSW50ZWdlci5wcm90b3R5cGUudG9IZXggPSBmdW5jdGlvbihzaXplKSB7XG4gIHJldHVybiB0aGlzLnRvQnVmZmVyKHNpemUpLnRvU3RyaW5nKCdoZXgnKVxufVxuIiwidmFyIEJpZ0ludGVnZXIgPSByZXF1aXJlKCcuL2JpZ2knKVxuXG4vL2FkZG9uc1xucmVxdWlyZSgnLi9jb252ZXJ0JylcblxubW9kdWxlLmV4cG9ydHMgPSBCaWdJbnRlZ2VyIiwiLy8gUmVmZXJlbmNlIGh0dHBzOi8vZ2l0aHViLmNvbS9iaXRjb2luL2JpcHMvYmxvYi9tYXN0ZXIvYmlwLTAwNjYubWVkaWF3aWtpXG4vLyBGb3JtYXQ6IDB4MzAgW3RvdGFsLWxlbmd0aF0gMHgwMiBbUi1sZW5ndGhdIFtSXSAweDAyIFtTLWxlbmd0aF0gW1NdXG4vLyBOT1RFOiBTSUdIQVNIIGJ5dGUgaWdub3JlZCBBTkQgcmVzdHJpY3RlZCwgdHJ1bmNhdGUgYmVmb3JlIHVzZVxuXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcblxuZnVuY3Rpb24gY2hlY2sgKGJ1ZmZlcikge1xuICBpZiAoYnVmZmVyLmxlbmd0aCA8IDgpIHJldHVybiBmYWxzZVxuICBpZiAoYnVmZmVyLmxlbmd0aCA+IDcyKSByZXR1cm4gZmFsc2VcbiAgaWYgKGJ1ZmZlclswXSAhPT0gMHgzMCkgcmV0dXJuIGZhbHNlXG4gIGlmIChidWZmZXJbMV0gIT09IGJ1ZmZlci5sZW5ndGggLSAyKSByZXR1cm4gZmFsc2VcbiAgaWYgKGJ1ZmZlclsyXSAhPT0gMHgwMikgcmV0dXJuIGZhbHNlXG5cbiAgdmFyIGxlblIgPSBidWZmZXJbM11cbiAgaWYgKGxlblIgPT09IDApIHJldHVybiBmYWxzZVxuICBpZiAoNSArIGxlblIgPj0gYnVmZmVyLmxlbmd0aCkgcmV0dXJuIGZhbHNlXG4gIGlmIChidWZmZXJbNCArIGxlblJdICE9PSAweDAyKSByZXR1cm4gZmFsc2VcblxuICB2YXIgbGVuUyA9IGJ1ZmZlcls1ICsgbGVuUl1cbiAgaWYgKGxlblMgPT09IDApIHJldHVybiBmYWxzZVxuICBpZiAoKDYgKyBsZW5SICsgbGVuUykgIT09IGJ1ZmZlci5sZW5ndGgpIHJldHVybiBmYWxzZVxuXG4gIGlmIChidWZmZXJbNF0gJiAweDgwKSByZXR1cm4gZmFsc2VcbiAgaWYgKGxlblIgPiAxICYmIChidWZmZXJbNF0gPT09IDB4MDApICYmICEoYnVmZmVyWzVdICYgMHg4MCkpIHJldHVybiBmYWxzZVxuXG4gIGlmIChidWZmZXJbbGVuUiArIDZdICYgMHg4MCkgcmV0dXJuIGZhbHNlXG4gIGlmIChsZW5TID4gMSAmJiAoYnVmZmVyW2xlblIgKyA2XSA9PT0gMHgwMCkgJiYgIShidWZmZXJbbGVuUiArIDddICYgMHg4MCkpIHJldHVybiBmYWxzZVxuICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiBkZWNvZGUgKGJ1ZmZlcikge1xuICBpZiAoYnVmZmVyLmxlbmd0aCA8IDgpIHRocm93IG5ldyBFcnJvcignREVSIHNlcXVlbmNlIGxlbmd0aCBpcyB0b28gc2hvcnQnKVxuICBpZiAoYnVmZmVyLmxlbmd0aCA+IDcyKSB0aHJvdyBuZXcgRXJyb3IoJ0RFUiBzZXF1ZW5jZSBsZW5ndGggaXMgdG9vIGxvbmcnKVxuICBpZiAoYnVmZmVyWzBdICE9PSAweDMwKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIERFUiBzZXF1ZW5jZScpXG4gIGlmIChidWZmZXJbMV0gIT09IGJ1ZmZlci5sZW5ndGggLSAyKSB0aHJvdyBuZXcgRXJyb3IoJ0RFUiBzZXF1ZW5jZSBsZW5ndGggaXMgaW52YWxpZCcpXG4gIGlmIChidWZmZXJbMl0gIT09IDB4MDIpIHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgREVSIGludGVnZXInKVxuXG4gIHZhciBsZW5SID0gYnVmZmVyWzNdXG4gIGlmIChsZW5SID09PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ1IgbGVuZ3RoIGlzIHplcm8nKVxuICBpZiAoNSArIGxlblIgPj0gYnVmZmVyLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdSIGxlbmd0aCBpcyB0b28gbG9uZycpXG4gIGlmIChidWZmZXJbNCArIGxlblJdICE9PSAweDAyKSB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIERFUiBpbnRlZ2VyICgyKScpXG5cbiAgdmFyIGxlblMgPSBidWZmZXJbNSArIGxlblJdXG4gIGlmIChsZW5TID09PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ1MgbGVuZ3RoIGlzIHplcm8nKVxuICBpZiAoKDYgKyBsZW5SICsgbGVuUykgIT09IGJ1ZmZlci5sZW5ndGgpIHRocm93IG5ldyBFcnJvcignUyBsZW5ndGggaXMgaW52YWxpZCcpXG5cbiAgaWYgKGJ1ZmZlcls0XSAmIDB4ODApIHRocm93IG5ldyBFcnJvcignUiB2YWx1ZSBpcyBuZWdhdGl2ZScpXG4gIGlmIChsZW5SID4gMSAmJiAoYnVmZmVyWzRdID09PSAweDAwKSAmJiAhKGJ1ZmZlcls1XSAmIDB4ODApKSB0aHJvdyBuZXcgRXJyb3IoJ1IgdmFsdWUgZXhjZXNzaXZlbHkgcGFkZGVkJylcblxuICBpZiAoYnVmZmVyW2xlblIgKyA2XSAmIDB4ODApIHRocm93IG5ldyBFcnJvcignUyB2YWx1ZSBpcyBuZWdhdGl2ZScpXG4gIGlmIChsZW5TID4gMSAmJiAoYnVmZmVyW2xlblIgKyA2XSA9PT0gMHgwMCkgJiYgIShidWZmZXJbbGVuUiArIDddICYgMHg4MCkpIHRocm93IG5ldyBFcnJvcignUyB2YWx1ZSBleGNlc3NpdmVseSBwYWRkZWQnKVxuXG4gIC8vIG5vbi1CSVA2NiAtIGV4dHJhY3QgUiwgUyB2YWx1ZXNcbiAgcmV0dXJuIHtcbiAgICByOiBidWZmZXIuc2xpY2UoNCwgNCArIGxlblIpLFxuICAgIHM6IGJ1ZmZlci5zbGljZSg2ICsgbGVuUilcbiAgfVxufVxuXG4vKlxuICogRXhwZWN0cyByIGFuZCBzIHRvIGJlIHBvc2l0aXZlIERFUiBpbnRlZ2Vycy5cbiAqXG4gKiBUaGUgREVSIGZvcm1hdCB1c2VzIHRoZSBtb3N0IHNpZ25pZmljYW50IGJpdCBhcyBhIHNpZ24gYml0ICgmIDB4ODApLlxuICogSWYgdGhlIHNpZ25pZmljYW50IGJpdCBpcyBzZXQgQU5EIHRoZSBpbnRlZ2VyIGlzIHBvc2l0aXZlLCBhIDB4MDAgaXMgcHJlcGVuZGVkLlxuICpcbiAqIEV4YW1wbGVzOlxuICpcbiAqICAgICAgMCA9PiAgICAgMHgwMFxuICogICAgICAxID0+ICAgICAweDAxXG4gKiAgICAgLTEgPT4gICAgIDB4ZmZcbiAqICAgIDEyNyA9PiAgICAgMHg3ZlxuICogICAtMTI3ID0+ICAgICAweDgxXG4gKiAgICAxMjggPT4gICAweDAwODBcbiAqICAgLTEyOCA9PiAgICAgMHg4MFxuICogICAgMjU1ID0+ICAgMHgwMGZmXG4gKiAgIC0yNTUgPT4gICAweGZmMDFcbiAqICAxNjMwMCA9PiAgIDB4M2ZhY1xuICogLTE2MzAwID0+ICAgMHhjMDU0XG4gKiAgNjIzMDAgPT4gMHgwMGYzNWNcbiAqIC02MjMwMCA9PiAweGZmMGNhNFxuKi9cbmZ1bmN0aW9uIGVuY29kZSAociwgcykge1xuICB2YXIgbGVuUiA9IHIubGVuZ3RoXG4gIHZhciBsZW5TID0gcy5sZW5ndGhcbiAgaWYgKGxlblIgPT09IDApIHRocm93IG5ldyBFcnJvcignUiBsZW5ndGggaXMgemVybycpXG4gIGlmIChsZW5TID09PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ1MgbGVuZ3RoIGlzIHplcm8nKVxuICBpZiAobGVuUiA+IDMzKSB0aHJvdyBuZXcgRXJyb3IoJ1IgbGVuZ3RoIGlzIHRvbyBsb25nJylcbiAgaWYgKGxlblMgPiAzMykgdGhyb3cgbmV3IEVycm9yKCdTIGxlbmd0aCBpcyB0b28gbG9uZycpXG4gIGlmIChyWzBdICYgMHg4MCkgdGhyb3cgbmV3IEVycm9yKCdSIHZhbHVlIGlzIG5lZ2F0aXZlJylcbiAgaWYgKHNbMF0gJiAweDgwKSB0aHJvdyBuZXcgRXJyb3IoJ1MgdmFsdWUgaXMgbmVnYXRpdmUnKVxuICBpZiAobGVuUiA+IDEgJiYgKHJbMF0gPT09IDB4MDApICYmICEoclsxXSAmIDB4ODApKSB0aHJvdyBuZXcgRXJyb3IoJ1IgdmFsdWUgZXhjZXNzaXZlbHkgcGFkZGVkJylcbiAgaWYgKGxlblMgPiAxICYmIChzWzBdID09PSAweDAwKSAmJiAhKHNbMV0gJiAweDgwKSkgdGhyb3cgbmV3IEVycm9yKCdTIHZhbHVlIGV4Y2Vzc2l2ZWx5IHBhZGRlZCcpXG5cbiAgdmFyIHNpZ25hdHVyZSA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSg2ICsgbGVuUiArIGxlblMpXG5cbiAgLy8gMHgzMCBbdG90YWwtbGVuZ3RoXSAweDAyIFtSLWxlbmd0aF0gW1JdIDB4MDIgW1MtbGVuZ3RoXSBbU11cbiAgc2lnbmF0dXJlWzBdID0gMHgzMFxuICBzaWduYXR1cmVbMV0gPSBzaWduYXR1cmUubGVuZ3RoIC0gMlxuICBzaWduYXR1cmVbMl0gPSAweDAyXG4gIHNpZ25hdHVyZVszXSA9IHIubGVuZ3RoXG4gIHIuY29weShzaWduYXR1cmUsIDQpXG4gIHNpZ25hdHVyZVs0ICsgbGVuUl0gPSAweDAyXG4gIHNpZ25hdHVyZVs1ICsgbGVuUl0gPSBzLmxlbmd0aFxuICBzLmNvcHkoc2lnbmF0dXJlLCA2ICsgbGVuUilcblxuICByZXR1cm4gc2lnbmF0dXJlXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVjazogY2hlY2ssXG4gIGRlY29kZTogZGVjb2RlLFxuICBlbmNvZGU6IGVuY29kZVxufVxuIiwidmFyIE9QUyA9IHJlcXVpcmUoJy4vaW5kZXguanNvbicpXG5cbnZhciBtYXAgPSB7fVxuZm9yICh2YXIgb3AgaW4gT1BTKSB7XG4gIHZhciBjb2RlID0gT1BTW29wXVxuICBtYXBbY29kZV0gPSBvcFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcFxuIiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgYmVjaDMyID0gcmVxdWlyZSgnYmVjaDMyJylcbnZhciBiczU4Y2hlY2sgPSByZXF1aXJlKCdiczU4Y2hlY2snKVxudmFyIGJzY3JpcHQgPSByZXF1aXJlKCcuL3NjcmlwdCcpXG52YXIgYnRlbXBsYXRlcyA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzJylcbnZhciBuZXR3b3JrcyA9IHJlcXVpcmUoJy4vbmV0d29ya3MnKVxudmFyIHR5cGVmb3JjZSA9IHJlcXVpcmUoJ3R5cGVmb3JjZScpXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuL3R5cGVzJylcblxuZnVuY3Rpb24gZnJvbUJhc2U1OENoZWNrIChhZGRyZXNzKSB7XG4gIHZhciBwYXlsb2FkID0gYnM1OGNoZWNrLmRlY29kZShhZGRyZXNzKVxuXG4gIC8vIFRPRE86IDQuMC4wLCBtb3ZlIHRvIFwidG9PdXRwdXRTY3JpcHRcIlxuICBpZiAocGF5bG9hZC5sZW5ndGggPCAyMSkgdGhyb3cgbmV3IFR5cGVFcnJvcihhZGRyZXNzICsgJyBpcyB0b28gc2hvcnQnKVxuICBpZiAocGF5bG9hZC5sZW5ndGggPiAyMSkgdGhyb3cgbmV3IFR5cGVFcnJvcihhZGRyZXNzICsgJyBpcyB0b28gbG9uZycpXG5cbiAgdmFyIHZlcnNpb24gPSBwYXlsb2FkLnJlYWRVSW50OCgwKVxuICB2YXIgaGFzaCA9IHBheWxvYWQuc2xpY2UoMSlcblxuICByZXR1cm4geyB2ZXJzaW9uOiB2ZXJzaW9uLCBoYXNoOiBoYXNoIH1cbn1cblxuZnVuY3Rpb24gZnJvbUJlY2gzMiAoYWRkcmVzcykge1xuICB2YXIgcmVzdWx0ID0gYmVjaDMyLmRlY29kZShhZGRyZXNzKVxuICB2YXIgZGF0YSA9IGJlY2gzMi5mcm9tV29yZHMocmVzdWx0LndvcmRzLnNsaWNlKDEpKVxuXG4gIHJldHVybiB7XG4gICAgdmVyc2lvbjogcmVzdWx0LndvcmRzWzBdLFxuICAgIHByZWZpeDogcmVzdWx0LnByZWZpeCxcbiAgICBkYXRhOiBCdWZmZXIuZnJvbShkYXRhKVxuICB9XG59XG5cbmZ1bmN0aW9uIHRvQmFzZTU4Q2hlY2sgKGhhc2gsIHZlcnNpb24pIHtcbiAgdHlwZWZvcmNlKHR5cGVzLnR1cGxlKHR5cGVzLkhhc2gxNjBiaXQsIHR5cGVzLlVJbnQ4KSwgYXJndW1lbnRzKVxuXG4gIHZhciBwYXlsb2FkID0gQnVmZmVyLmFsbG9jVW5zYWZlKDIxKVxuICBwYXlsb2FkLndyaXRlVUludDgodmVyc2lvbiwgMClcbiAgaGFzaC5jb3B5KHBheWxvYWQsIDEpXG5cbiAgcmV0dXJuIGJzNThjaGVjay5lbmNvZGUocGF5bG9hZClcbn1cblxuZnVuY3Rpb24gdG9CZWNoMzIgKGRhdGEsIHZlcnNpb24sIHByZWZpeCkge1xuICB2YXIgd29yZHMgPSBiZWNoMzIudG9Xb3JkcyhkYXRhKVxuICB3b3Jkcy51bnNoaWZ0KHZlcnNpb24pXG5cbiAgcmV0dXJuIGJlY2gzMi5lbmNvZGUocHJlZml4LCB3b3Jkcylcbn1cblxuZnVuY3Rpb24gZnJvbU91dHB1dFNjcmlwdCAob3V0cHV0U2NyaXB0LCBuZXR3b3JrKSB7XG4gIG5ldHdvcmsgPSBuZXR3b3JrIHx8IG5ldHdvcmtzLmJpdGNvaW5cblxuICBpZiAoYnRlbXBsYXRlcy5wdWJLZXlIYXNoLm91dHB1dC5jaGVjayhvdXRwdXRTY3JpcHQpKSByZXR1cm4gdG9CYXNlNThDaGVjayhic2NyaXB0LmNvbXBpbGUob3V0cHV0U2NyaXB0KS5zbGljZSgzLCAyMyksIG5ldHdvcmsucHViS2V5SGFzaClcbiAgaWYgKGJ0ZW1wbGF0ZXMuc2NyaXB0SGFzaC5vdXRwdXQuY2hlY2sob3V0cHV0U2NyaXB0KSkgcmV0dXJuIHRvQmFzZTU4Q2hlY2soYnNjcmlwdC5jb21waWxlKG91dHB1dFNjcmlwdCkuc2xpY2UoMiwgMjIpLCBuZXR3b3JrLnNjcmlwdEhhc2gpXG4gIGlmIChidGVtcGxhdGVzLndpdG5lc3NQdWJLZXlIYXNoLm91dHB1dC5jaGVjayhvdXRwdXRTY3JpcHQpKSByZXR1cm4gdG9CZWNoMzIoYnNjcmlwdC5jb21waWxlKG91dHB1dFNjcmlwdCkuc2xpY2UoMiwgMjIpLCAwLCBuZXR3b3JrLmJlY2gzMilcbiAgaWYgKGJ0ZW1wbGF0ZXMud2l0bmVzc1NjcmlwdEhhc2gub3V0cHV0LmNoZWNrKG91dHB1dFNjcmlwdCkpIHJldHVybiB0b0JlY2gzMihic2NyaXB0LmNvbXBpbGUob3V0cHV0U2NyaXB0KS5zbGljZSgyLCAzNCksIDAsIG5ldHdvcmsuYmVjaDMyKVxuXG4gIHRocm93IG5ldyBFcnJvcihic2NyaXB0LnRvQVNNKG91dHB1dFNjcmlwdCkgKyAnIGhhcyBubyBtYXRjaGluZyBBZGRyZXNzJylcbn1cblxuZnVuY3Rpb24gdG9PdXRwdXRTY3JpcHQgKGFkZHJlc3MsIG5ldHdvcmspIHtcbiAgbmV0d29yayA9IG5ldHdvcmsgfHwgbmV0d29ya3MuYml0Y29pblxuXG4gIHZhciBkZWNvZGVcbiAgdHJ5IHtcbiAgICBkZWNvZGUgPSBmcm9tQmFzZTU4Q2hlY2soYWRkcmVzcylcbiAgfSBjYXRjaCAoZSkge31cblxuICBpZiAoZGVjb2RlKSB7XG4gICAgaWYgKGRlY29kZS52ZXJzaW9uID09PSBuZXR3b3JrLnB1YktleUhhc2gpIHJldHVybiBidGVtcGxhdGVzLnB1YktleUhhc2gub3V0cHV0LmVuY29kZShkZWNvZGUuaGFzaClcbiAgICBpZiAoZGVjb2RlLnZlcnNpb24gPT09IG5ldHdvcmsuc2NyaXB0SGFzaCkgcmV0dXJuIGJ0ZW1wbGF0ZXMuc2NyaXB0SGFzaC5vdXRwdXQuZW5jb2RlKGRlY29kZS5oYXNoKVxuICB9IGVsc2Uge1xuICAgIHRyeSB7XG4gICAgICBkZWNvZGUgPSBmcm9tQmVjaDMyKGFkZHJlc3MpXG4gICAgfSBjYXRjaCAoZSkge31cblxuICAgIGlmIChkZWNvZGUpIHtcbiAgICAgIGlmIChkZWNvZGUucHJlZml4ICE9PSBuZXR3b3JrLmJlY2gzMikgdGhyb3cgbmV3IEVycm9yKGFkZHJlc3MgKyAnIGhhcyBhbiBpbnZhbGlkIHByZWZpeCcpXG4gICAgICBpZiAoZGVjb2RlLnZlcnNpb24gPT09IDApIHtcbiAgICAgICAgaWYgKGRlY29kZS5kYXRhLmxlbmd0aCA9PT0gMjApIHJldHVybiBidGVtcGxhdGVzLndpdG5lc3NQdWJLZXlIYXNoLm91dHB1dC5lbmNvZGUoZGVjb2RlLmRhdGEpXG4gICAgICAgIGlmIChkZWNvZGUuZGF0YS5sZW5ndGggPT09IDMyKSByZXR1cm4gYnRlbXBsYXRlcy53aXRuZXNzU2NyaXB0SGFzaC5vdXRwdXQuZW5jb2RlKGRlY29kZS5kYXRhKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBFcnJvcihhZGRyZXNzICsgJyBoYXMgbm8gbWF0Y2hpbmcgU2NyaXB0Jylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGZyb21CYXNlNThDaGVjazogZnJvbUJhc2U1OENoZWNrLFxuICBmcm9tQmVjaDMyOiBmcm9tQmVjaDMyLFxuICBmcm9tT3V0cHV0U2NyaXB0OiBmcm9tT3V0cHV0U2NyaXB0LFxuICB0b0Jhc2U1OENoZWNrOiB0b0Jhc2U1OENoZWNrLFxuICB0b0JlY2gzMjogdG9CZWNoMzIsXG4gIHRvT3V0cHV0U2NyaXB0OiB0b091dHB1dFNjcmlwdFxufVxuIiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgYmNyeXB0byA9IHJlcXVpcmUoJy4vY3J5cHRvJylcbnZhciBmYXN0TWVya2xlUm9vdCA9IHJlcXVpcmUoJ21lcmtsZS1saWIvZmFzdFJvb3QnKVxudmFyIHR5cGVmb3JjZSA9IHJlcXVpcmUoJ3R5cGVmb3JjZScpXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuL3R5cGVzJylcbnZhciB2YXJ1aW50ID0gcmVxdWlyZSgndmFydWludC1iaXRjb2luJylcblxudmFyIFRyYW5zYWN0aW9uID0gcmVxdWlyZSgnLi90cmFuc2FjdGlvbicpXG5cbmZ1bmN0aW9uIEJsb2NrICgpIHtcbiAgdGhpcy52ZXJzaW9uID0gMVxuICB0aGlzLnByZXZIYXNoID0gbnVsbFxuICB0aGlzLm1lcmtsZVJvb3QgPSBudWxsXG4gIHRoaXMudGltZXN0YW1wID0gMFxuICB0aGlzLmJpdHMgPSAwXG4gIHRoaXMubm9uY2UgPSAwXG59XG5cbkJsb2NrLmZyb21CdWZmZXIgPSBmdW5jdGlvbiAoYnVmZmVyKSB7XG4gIGlmIChidWZmZXIubGVuZ3RoIDwgODApIHRocm93IG5ldyBFcnJvcignQnVmZmVyIHRvbyBzbWFsbCAoPCA4MCBieXRlcyknKVxuXG4gIHZhciBvZmZzZXQgPSAwXG4gIGZ1bmN0aW9uIHJlYWRTbGljZSAobikge1xuICAgIG9mZnNldCArPSBuXG4gICAgcmV0dXJuIGJ1ZmZlci5zbGljZShvZmZzZXQgLSBuLCBvZmZzZXQpXG4gIH1cblxuICBmdW5jdGlvbiByZWFkVUludDMyICgpIHtcbiAgICB2YXIgaSA9IGJ1ZmZlci5yZWFkVUludDMyTEUob2Zmc2V0KVxuICAgIG9mZnNldCArPSA0XG4gICAgcmV0dXJuIGlcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRJbnQzMiAoKSB7XG4gICAgdmFyIGkgPSBidWZmZXIucmVhZEludDMyTEUob2Zmc2V0KVxuICAgIG9mZnNldCArPSA0XG4gICAgcmV0dXJuIGlcbiAgfVxuXG4gIHZhciBibG9jayA9IG5ldyBCbG9jaygpXG4gIGJsb2NrLnZlcnNpb24gPSByZWFkSW50MzIoKVxuICBibG9jay5wcmV2SGFzaCA9IHJlYWRTbGljZSgzMilcbiAgYmxvY2subWVya2xlUm9vdCA9IHJlYWRTbGljZSgzMilcbiAgYmxvY2sudGltZXN0YW1wID0gcmVhZFVJbnQzMigpXG4gIGJsb2NrLmJpdHMgPSByZWFkVUludDMyKClcbiAgYmxvY2subm9uY2UgPSByZWFkVUludDMyKClcblxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gODApIHJldHVybiBibG9ja1xuXG4gIGZ1bmN0aW9uIHJlYWRWYXJJbnQgKCkge1xuICAgIHZhciB2aSA9IHZhcnVpbnQuZGVjb2RlKGJ1ZmZlciwgb2Zmc2V0KVxuICAgIG9mZnNldCArPSB2YXJ1aW50LmRlY29kZS5ieXRlc1xuICAgIHJldHVybiB2aVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZFRyYW5zYWN0aW9uICgpIHtcbiAgICB2YXIgdHggPSBUcmFuc2FjdGlvbi5mcm9tQnVmZmVyKGJ1ZmZlci5zbGljZShvZmZzZXQpLCB0cnVlKVxuICAgIG9mZnNldCArPSB0eC5ieXRlTGVuZ3RoKClcbiAgICByZXR1cm4gdHhcbiAgfVxuXG4gIHZhciBuVHJhbnNhY3Rpb25zID0gcmVhZFZhckludCgpXG4gIGJsb2NrLnRyYW5zYWN0aW9ucyA9IFtdXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuVHJhbnNhY3Rpb25zOyArK2kpIHtcbiAgICB2YXIgdHggPSByZWFkVHJhbnNhY3Rpb24oKVxuICAgIGJsb2NrLnRyYW5zYWN0aW9ucy5wdXNoKHR4KVxuICB9XG5cbiAgcmV0dXJuIGJsb2NrXG59XG5cbkJsb2NrLnByb3RvdHlwZS5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKGhlYWRlcnNPbmx5KSB7XG4gIGlmIChoZWFkZXJzT25seSB8fCAhdGhpcy50cmFuc2FjdGlvbnMpIHJldHVybiA4MFxuXG4gIHJldHVybiA4MCArIHZhcnVpbnQuZW5jb2RpbmdMZW5ndGgodGhpcy50cmFuc2FjdGlvbnMubGVuZ3RoKSArIHRoaXMudHJhbnNhY3Rpb25zLnJlZHVjZShmdW5jdGlvbiAoYSwgeCkge1xuICAgIHJldHVybiBhICsgeC5ieXRlTGVuZ3RoKClcbiAgfSwgMClcbn1cblxuQmxvY2suZnJvbUhleCA9IGZ1bmN0aW9uIChoZXgpIHtcbiAgcmV0dXJuIEJsb2NrLmZyb21CdWZmZXIoQnVmZmVyLmZyb20oaGV4LCAnaGV4JykpXG59XG5cbkJsb2NrLnByb3RvdHlwZS5nZXRIYXNoID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gYmNyeXB0by5oYXNoMjU2KHRoaXMudG9CdWZmZXIodHJ1ZSkpXG59XG5cbkJsb2NrLnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuZ2V0SGFzaCgpLnJldmVyc2UoKS50b1N0cmluZygnaGV4Jylcbn1cblxuQmxvY2sucHJvdG90eXBlLmdldFVUQ0RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBkYXRlID0gbmV3IERhdGUoMCkgLy8gZXBvY2hcbiAgZGF0ZS5zZXRVVENTZWNvbmRzKHRoaXMudGltZXN0YW1wKVxuXG4gIHJldHVybiBkYXRlXG59XG5cbi8vIFRPRE86IGJ1ZmZlciwgb2Zmc2V0IGNvbXBhdGliaWxpdHlcbkJsb2NrLnByb3RvdHlwZS50b0J1ZmZlciA9IGZ1bmN0aW9uIChoZWFkZXJzT25seSkge1xuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKHRoaXMuYnl0ZUxlbmd0aChoZWFkZXJzT25seSkpXG5cbiAgdmFyIG9mZnNldCA9IDBcbiAgZnVuY3Rpb24gd3JpdGVTbGljZSAoc2xpY2UpIHtcbiAgICBzbGljZS5jb3B5KGJ1ZmZlciwgb2Zmc2V0KVxuICAgIG9mZnNldCArPSBzbGljZS5sZW5ndGhcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyaXRlSW50MzIgKGkpIHtcbiAgICBidWZmZXIud3JpdGVJbnQzMkxFKGksIG9mZnNldClcbiAgICBvZmZzZXQgKz0gNFxuICB9XG4gIGZ1bmN0aW9uIHdyaXRlVUludDMyIChpKSB7XG4gICAgYnVmZmVyLndyaXRlVUludDMyTEUoaSwgb2Zmc2V0KVxuICAgIG9mZnNldCArPSA0XG4gIH1cblxuICB3cml0ZUludDMyKHRoaXMudmVyc2lvbilcbiAgd3JpdGVTbGljZSh0aGlzLnByZXZIYXNoKVxuICB3cml0ZVNsaWNlKHRoaXMubWVya2xlUm9vdClcbiAgd3JpdGVVSW50MzIodGhpcy50aW1lc3RhbXApXG4gIHdyaXRlVUludDMyKHRoaXMuYml0cylcbiAgd3JpdGVVSW50MzIodGhpcy5ub25jZSlcblxuICBpZiAoaGVhZGVyc09ubHkgfHwgIXRoaXMudHJhbnNhY3Rpb25zKSByZXR1cm4gYnVmZmVyXG5cbiAgdmFydWludC5lbmNvZGUodGhpcy50cmFuc2FjdGlvbnMubGVuZ3RoLCBidWZmZXIsIG9mZnNldClcbiAgb2Zmc2V0ICs9IHZhcnVpbnQuZW5jb2RlLmJ5dGVzXG5cbiAgdGhpcy50cmFuc2FjdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAodHgpIHtcbiAgICB2YXIgdHhTaXplID0gdHguYnl0ZUxlbmd0aCgpIC8vIFRPRE86IGV4dHJhY3QgZnJvbSB0b0J1ZmZlcj9cbiAgICB0eC50b0J1ZmZlcihidWZmZXIsIG9mZnNldClcbiAgICBvZmZzZXQgKz0gdHhTaXplXG4gIH0pXG5cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5CbG9jay5wcm90b3R5cGUudG9IZXggPSBmdW5jdGlvbiAoaGVhZGVyc09ubHkpIHtcbiAgcmV0dXJuIHRoaXMudG9CdWZmZXIoaGVhZGVyc09ubHkpLnRvU3RyaW5nKCdoZXgnKVxufVxuXG5CbG9jay5jYWxjdWxhdGVUYXJnZXQgPSBmdW5jdGlvbiAoYml0cykge1xuICB2YXIgZXhwb25lbnQgPSAoKGJpdHMgJiAweGZmMDAwMDAwKSA+PiAyNCkgLSAzXG4gIHZhciBtYW50aXNzYSA9IGJpdHMgJiAweDAwN2ZmZmZmXG4gIHZhciB0YXJnZXQgPSBCdWZmZXIuYWxsb2MoMzIsIDApXG4gIHRhcmdldC53cml0ZVVJbnQzMkJFKG1hbnRpc3NhLCAyOCAtIGV4cG9uZW50KVxuICByZXR1cm4gdGFyZ2V0XG59XG5cbkJsb2NrLmNhbGN1bGF0ZU1lcmtsZVJvb3QgPSBmdW5jdGlvbiAodHJhbnNhY3Rpb25zKSB7XG4gIHR5cGVmb3JjZShbeyBnZXRIYXNoOiB0eXBlcy5GdW5jdGlvbiB9XSwgdHJhbnNhY3Rpb25zKVxuICBpZiAodHJhbnNhY3Rpb25zLmxlbmd0aCA9PT0gMCkgdGhyb3cgVHlwZUVycm9yKCdDYW5ub3QgY29tcHV0ZSBtZXJrbGUgcm9vdCBmb3IgemVybyB0cmFuc2FjdGlvbnMnKVxuXG4gIHZhciBoYXNoZXMgPSB0cmFuc2FjdGlvbnMubWFwKGZ1bmN0aW9uICh0cmFuc2FjdGlvbikge1xuICAgIHJldHVybiB0cmFuc2FjdGlvbi5nZXRIYXNoKClcbiAgfSlcblxuICByZXR1cm4gZmFzdE1lcmtsZVJvb3QoaGFzaGVzLCBiY3J5cHRvLmhhc2gyNTYpXG59XG5cbkJsb2NrLnByb3RvdHlwZS5jaGVja01lcmtsZVJvb3QgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICghdGhpcy50cmFuc2FjdGlvbnMpIHJldHVybiBmYWxzZVxuXG4gIHZhciBhY3R1YWxNZXJrbGVSb290ID0gQmxvY2suY2FsY3VsYXRlTWVya2xlUm9vdCh0aGlzLnRyYW5zYWN0aW9ucylcbiAgcmV0dXJuIHRoaXMubWVya2xlUm9vdC5jb21wYXJlKGFjdHVhbE1lcmtsZVJvb3QpID09PSAwXG59XG5cbkJsb2NrLnByb3RvdHlwZS5jaGVja1Byb29mT2ZXb3JrID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaGFzaCA9IHRoaXMuZ2V0SGFzaCgpLnJldmVyc2UoKVxuICB2YXIgdGFyZ2V0ID0gQmxvY2suY2FsY3VsYXRlVGFyZ2V0KHRoaXMuYml0cylcblxuICByZXR1cm4gaGFzaC5jb21wYXJlKHRhcmdldCkgPD0gMFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJsb2NrXG4iLCJ2YXIgcHVzaGRhdGEgPSByZXF1aXJlKCdwdXNoZGF0YS1iaXRjb2luJylcbnZhciB2YXJ1aW50ID0gcmVxdWlyZSgndmFydWludC1iaXRjb2luJylcblxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvYmxvYi9tYXN0ZXIvaW5kZXguanMjTDExMjdcbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJykgdGhyb3cgbmV3IEVycm9yKCdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgaWYgKHZhbHVlIDwgMCkgdGhyb3cgbmV3IEVycm9yKCdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGlmICh2YWx1ZSA+IG1heCkgdGhyb3cgbmV3IEVycm9yKCdSYW5nZUVycm9yOiB2YWx1ZSBvdXQgb2YgcmFuZ2UnKVxuICBpZiAoTWF0aC5mbG9vcih2YWx1ZSkgIT09IHZhbHVlKSB0aHJvdyBuZXcgRXJyb3IoJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gcmVhZFVJbnQ2NExFIChidWZmZXIsIG9mZnNldCkge1xuICB2YXIgYSA9IGJ1ZmZlci5yZWFkVUludDMyTEUob2Zmc2V0KVxuICB2YXIgYiA9IGJ1ZmZlci5yZWFkVUludDMyTEUob2Zmc2V0ICsgNClcbiAgYiAqPSAweDEwMDAwMDAwMFxuXG4gIHZlcmlmdWludChiICsgYSwgMHgwMDFmZmZmZmZmZmZmZmZmKVxuXG4gIHJldHVybiBiICsgYVxufVxuXG5mdW5jdGlvbiB3cml0ZVVJbnQ2NExFIChidWZmZXIsIHZhbHVlLCBvZmZzZXQpIHtcbiAgdmVyaWZ1aW50KHZhbHVlLCAweDAwMWZmZmZmZmZmZmZmZmYpXG5cbiAgYnVmZmVyLndyaXRlSW50MzJMRSh2YWx1ZSAmIC0xLCBvZmZzZXQpXG4gIGJ1ZmZlci53cml0ZVVJbnQzMkxFKE1hdGguZmxvb3IodmFsdWUgLyAweDEwMDAwMDAwMCksIG9mZnNldCArIDQpXG4gIHJldHVybiBvZmZzZXQgKyA4XG59XG5cbi8vIFRPRE86IHJlbW92ZSBpbiA0LjAuMD9cbmZ1bmN0aW9uIHJlYWRWYXJJbnQgKGJ1ZmZlciwgb2Zmc2V0KSB7XG4gIHZhciByZXN1bHQgPSB2YXJ1aW50LmRlY29kZShidWZmZXIsIG9mZnNldClcblxuICByZXR1cm4ge1xuICAgIG51bWJlcjogcmVzdWx0LFxuICAgIHNpemU6IHZhcnVpbnQuZGVjb2RlLmJ5dGVzXG4gIH1cbn1cblxuLy8gVE9ETzogcmVtb3ZlIGluIDQuMC4wP1xuZnVuY3Rpb24gd3JpdGVWYXJJbnQgKGJ1ZmZlciwgbnVtYmVyLCBvZmZzZXQpIHtcbiAgdmFydWludC5lbmNvZGUobnVtYmVyLCBidWZmZXIsIG9mZnNldClcbiAgcmV0dXJuIHZhcnVpbnQuZW5jb2RlLmJ5dGVzXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwdXNoRGF0YVNpemU6IHB1c2hkYXRhLmVuY29kaW5nTGVuZ3RoLFxuICByZWFkUHVzaERhdGFJbnQ6IHB1c2hkYXRhLmRlY29kZSxcbiAgcmVhZFVJbnQ2NExFOiByZWFkVUludDY0TEUsXG4gIHJlYWRWYXJJbnQ6IHJlYWRWYXJJbnQsXG4gIHZhckludEJ1ZmZlcjogdmFydWludC5lbmNvZGUsXG4gIHZhckludFNpemU6IHZhcnVpbnQuZW5jb2RpbmdMZW5ndGgsXG4gIHdyaXRlUHVzaERhdGFJbnQ6IHB1c2hkYXRhLmVuY29kZSxcbiAgd3JpdGVVSW50NjRMRTogd3JpdGVVSW50NjRMRSxcbiAgd3JpdGVWYXJJbnQ6IHdyaXRlVmFySW50XG59XG4iLCJ2YXIgY3JlYXRlSGFzaCA9IHJlcXVpcmUoJ2NyZWF0ZS1oYXNoJylcblxuZnVuY3Rpb24gcmlwZW1kMTYwIChidWZmZXIpIHtcbiAgcmV0dXJuIGNyZWF0ZUhhc2goJ3JtZDE2MCcpLnVwZGF0ZShidWZmZXIpLmRpZ2VzdCgpXG59XG5cbmZ1bmN0aW9uIHNoYTEgKGJ1ZmZlcikge1xuICByZXR1cm4gY3JlYXRlSGFzaCgnc2hhMScpLnVwZGF0ZShidWZmZXIpLmRpZ2VzdCgpXG59XG5cbmZ1bmN0aW9uIHNoYTI1NiAoYnVmZmVyKSB7XG4gIHJldHVybiBjcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoYnVmZmVyKS5kaWdlc3QoKVxufVxuXG5mdW5jdGlvbiBoYXNoMTYwIChidWZmZXIpIHtcbiAgcmV0dXJuIHJpcGVtZDE2MChzaGEyNTYoYnVmZmVyKSlcbn1cblxuZnVuY3Rpb24gaGFzaDI1NiAoYnVmZmVyKSB7XG4gIHJldHVybiBzaGEyNTYoc2hhMjU2KGJ1ZmZlcikpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBoYXNoMTYwOiBoYXNoMTYwLFxuICBoYXNoMjU2OiBoYXNoMjU2LFxuICByaXBlbWQxNjA6IHJpcGVtZDE2MCxcbiAgc2hhMTogc2hhMSxcbiAgc2hhMjU2OiBzaGEyNTZcbn1cbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxudmFyIGNyZWF0ZUhtYWMgPSByZXF1aXJlKCdjcmVhdGUtaG1hYycpXG52YXIgdHlwZWZvcmNlID0gcmVxdWlyZSgndHlwZWZvcmNlJylcbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKVxuXG52YXIgQmlnSW50ZWdlciA9IHJlcXVpcmUoJ2JpZ2knKVxudmFyIEVDU2lnbmF0dXJlID0gcmVxdWlyZSgnLi9lY3NpZ25hdHVyZScpXG5cbnZhciBaRVJPID0gQnVmZmVyLmFsbG9jKDEsIDApXG52YXIgT05FID0gQnVmZmVyLmFsbG9jKDEsIDEpXG5cbnZhciBlY3VydmUgPSByZXF1aXJlKCdlY3VydmUnKVxudmFyIHNlY3AyNTZrMSA9IGVjdXJ2ZS5nZXRDdXJ2ZUJ5TmFtZSgnc2VjcDI1NmsxJylcblxuLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzY5Nzkjc2VjdGlvbi0zLjJcbmZ1bmN0aW9uIGRldGVybWluaXN0aWNHZW5lcmF0ZUsgKGhhc2gsIHgsIGNoZWNrU2lnKSB7XG4gIHR5cGVmb3JjZSh0eXBlcy50dXBsZShcbiAgICB0eXBlcy5IYXNoMjU2Yml0LFxuICAgIHR5cGVzLkJ1ZmZlcjI1NmJpdCxcbiAgICB0eXBlcy5GdW5jdGlvblxuICApLCBhcmd1bWVudHMpXG5cbiAgLy8gU3RlcCBBLCBpZ25vcmVkIGFzIGhhc2ggYWxyZWFkeSBwcm92aWRlZFxuICAvLyBTdGVwIEJcbiAgLy8gU3RlcCBDXG4gIHZhciBrID0gQnVmZmVyLmFsbG9jKDMyLCAwKVxuICB2YXIgdiA9IEJ1ZmZlci5hbGxvYygzMiwgMSlcblxuICAvLyBTdGVwIERcbiAgayA9IGNyZWF0ZUhtYWMoJ3NoYTI1NicsIGspXG4gICAgLnVwZGF0ZSh2KVxuICAgIC51cGRhdGUoWkVSTylcbiAgICAudXBkYXRlKHgpXG4gICAgLnVwZGF0ZShoYXNoKVxuICAgIC5kaWdlc3QoKVxuXG4gIC8vIFN0ZXAgRVxuICB2ID0gY3JlYXRlSG1hYygnc2hhMjU2JywgaykudXBkYXRlKHYpLmRpZ2VzdCgpXG5cbiAgLy8gU3RlcCBGXG4gIGsgPSBjcmVhdGVIbWFjKCdzaGEyNTYnLCBrKVxuICAgIC51cGRhdGUodilcbiAgICAudXBkYXRlKE9ORSlcbiAgICAudXBkYXRlKHgpXG4gICAgLnVwZGF0ZShoYXNoKVxuICAgIC5kaWdlc3QoKVxuXG4gIC8vIFN0ZXAgR1xuICB2ID0gY3JlYXRlSG1hYygnc2hhMjU2JywgaykudXBkYXRlKHYpLmRpZ2VzdCgpXG5cbiAgLy8gU3RlcCBIMS9IMmEsIGlnbm9yZWQgYXMgdGxlbiA9PT0gcWxlbiAoMjU2IGJpdClcbiAgLy8gU3RlcCBIMmJcbiAgdiA9IGNyZWF0ZUhtYWMoJ3NoYTI1NicsIGspLnVwZGF0ZSh2KS5kaWdlc3QoKVxuXG4gIHZhciBUID0gQmlnSW50ZWdlci5mcm9tQnVmZmVyKHYpXG5cbiAgLy8gU3RlcCBIMywgcmVwZWF0IHVudGlsIFQgaXMgd2l0aGluIHRoZSBpbnRlcnZhbCBbMSwgbiAtIDFdIGFuZCBpcyBzdWl0YWJsZSBmb3IgRUNEU0FcbiAgd2hpbGUgKFQuc2lnbnVtKCkgPD0gMCB8fCBULmNvbXBhcmVUbyhzZWNwMjU2azEubikgPj0gMCB8fCAhY2hlY2tTaWcoVCkpIHtcbiAgICBrID0gY3JlYXRlSG1hYygnc2hhMjU2JywgaylcbiAgICAgIC51cGRhdGUodilcbiAgICAgIC51cGRhdGUoWkVSTylcbiAgICAgIC5kaWdlc3QoKVxuXG4gICAgdiA9IGNyZWF0ZUhtYWMoJ3NoYTI1NicsIGspLnVwZGF0ZSh2KS5kaWdlc3QoKVxuXG4gICAgLy8gU3RlcCBIMS9IMmEsIGFnYWluLCBpZ25vcmVkIGFzIHRsZW4gPT09IHFsZW4gKDI1NiBiaXQpXG4gICAgLy8gU3RlcCBIMmIgYWdhaW5cbiAgICB2ID0gY3JlYXRlSG1hYygnc2hhMjU2JywgaykudXBkYXRlKHYpLmRpZ2VzdCgpXG4gICAgVCA9IEJpZ0ludGVnZXIuZnJvbUJ1ZmZlcih2KVxuICB9XG5cbiAgcmV0dXJuIFRcbn1cblxudmFyIE5fT1ZFUl9UV08gPSBzZWNwMjU2azEubi5zaGlmdFJpZ2h0KDEpXG5cbmZ1bmN0aW9uIHNpZ24gKGhhc2gsIGQpIHtcbiAgdHlwZWZvcmNlKHR5cGVzLnR1cGxlKHR5cGVzLkhhc2gyNTZiaXQsIHR5cGVzLkJpZ0ludCksIGFyZ3VtZW50cylcblxuICB2YXIgeCA9IGQudG9CdWZmZXIoMzIpXG4gIHZhciBlID0gQmlnSW50ZWdlci5mcm9tQnVmZmVyKGhhc2gpXG4gIHZhciBuID0gc2VjcDI1NmsxLm5cbiAgdmFyIEcgPSBzZWNwMjU2azEuR1xuXG4gIHZhciByLCBzXG4gIGRldGVybWluaXN0aWNHZW5lcmF0ZUsoaGFzaCwgeCwgZnVuY3Rpb24gKGspIHtcbiAgICB2YXIgUSA9IEcubXVsdGlwbHkoaylcblxuICAgIGlmIChzZWNwMjU2azEuaXNJbmZpbml0eShRKSkgcmV0dXJuIGZhbHNlXG5cbiAgICByID0gUS5hZmZpbmVYLm1vZChuKVxuICAgIGlmIChyLnNpZ251bSgpID09PSAwKSByZXR1cm4gZmFsc2VcblxuICAgIHMgPSBrLm1vZEludmVyc2UobikubXVsdGlwbHkoZS5hZGQoZC5tdWx0aXBseShyKSkpLm1vZChuKVxuICAgIGlmIChzLnNpZ251bSgpID09PSAwKSByZXR1cm4gZmFsc2VcblxuICAgIHJldHVybiB0cnVlXG4gIH0pXG5cbiAgLy8gZW5mb3JjZSBsb3cgUyB2YWx1ZXMsIHNlZSBiaXA2MjogJ2xvdyBzIHZhbHVlcyBpbiBzaWduYXR1cmVzJ1xuICBpZiAocy5jb21wYXJlVG8oTl9PVkVSX1RXTykgPiAwKSB7XG4gICAgcyA9IG4uc3VidHJhY3QocylcbiAgfVxuXG4gIHJldHVybiBuZXcgRUNTaWduYXR1cmUociwgcylcbn1cblxuZnVuY3Rpb24gdmVyaWZ5IChoYXNoLCBzaWduYXR1cmUsIFEpIHtcbiAgdHlwZWZvcmNlKHR5cGVzLnR1cGxlKFxuICAgIHR5cGVzLkhhc2gyNTZiaXQsXG4gICAgdHlwZXMuRUNTaWduYXR1cmUsXG4gICAgdHlwZXMuRUNQb2ludFxuICApLCBhcmd1bWVudHMpXG5cbiAgdmFyIG4gPSBzZWNwMjU2azEublxuICB2YXIgRyA9IHNlY3AyNTZrMS5HXG5cbiAgdmFyIHIgPSBzaWduYXR1cmUuclxuICB2YXIgcyA9IHNpZ25hdHVyZS5zXG5cbiAgLy8gMS40LjEgRW5mb3JjZSByIGFuZCBzIGFyZSBib3RoIGludGVnZXJzIGluIHRoZSBpbnRlcnZhbCBbMSwgbiDiiJIgMV1cbiAgaWYgKHIuc2lnbnVtKCkgPD0gMCB8fCByLmNvbXBhcmVUbyhuKSA+PSAwKSByZXR1cm4gZmFsc2VcbiAgaWYgKHMuc2lnbnVtKCkgPD0gMCB8fCBzLmNvbXBhcmVUbyhuKSA+PSAwKSByZXR1cm4gZmFsc2VcblxuICAvLyAxLjQuMiBIID0gSGFzaChNKSwgYWxyZWFkeSBkb25lIGJ5IHRoZSB1c2VyXG4gIC8vIDEuNC4zIGUgPSBIXG4gIHZhciBlID0gQmlnSW50ZWdlci5mcm9tQnVmZmVyKGhhc2gpXG5cbiAgLy8gQ29tcHV0ZSBzXi0xXG4gIHZhciBzSW52ID0gcy5tb2RJbnZlcnNlKG4pXG5cbiAgLy8gMS40LjQgQ29tcHV0ZSB1MSA9IGVzXuKIkjEgbW9kIG5cbiAgLy8gICAgICAgICAgICAgICB1MiA9IHJzXuKIkjEgbW9kIG5cbiAgdmFyIHUxID0gZS5tdWx0aXBseShzSW52KS5tb2QobilcbiAgdmFyIHUyID0gci5tdWx0aXBseShzSW52KS5tb2QobilcblxuICAvLyAxLjQuNSBDb21wdXRlIFIgPSAoeFIsIHlSKVxuICAvLyAgICAgICAgICAgICAgIFIgPSB1MUcgKyB1MlFcbiAgdmFyIFIgPSBHLm11bHRpcGx5VHdvKHUxLCBRLCB1MilcblxuICAvLyAxLjQuNSAoY29udC4pIEVuZm9yY2UgUiBpcyBub3QgYXQgaW5maW5pdHlcbiAgaWYgKHNlY3AyNTZrMS5pc0luZmluaXR5KFIpKSByZXR1cm4gZmFsc2VcblxuICAvLyAxLjQuNiBDb252ZXJ0IHRoZSBmaWVsZCBlbGVtZW50IFIueCB0byBhbiBpbnRlZ2VyXG4gIHZhciB4UiA9IFIuYWZmaW5lWFxuXG4gIC8vIDEuNC43IFNldCB2ID0geFIgbW9kIG5cbiAgdmFyIHYgPSB4Ui5tb2QobilcblxuICAvLyAxLjQuOCBJZiB2ID0gciwgb3V0cHV0IFwidmFsaWRcIiwgYW5kIGlmIHYgIT0gciwgb3V0cHV0IFwiaW52YWxpZFwiXG4gIHJldHVybiB2LmVxdWFscyhyKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZGV0ZXJtaW5pc3RpY0dlbmVyYXRlSzogZGV0ZXJtaW5pc3RpY0dlbmVyYXRlSyxcbiAgc2lnbjogc2lnbixcbiAgdmVyaWZ5OiB2ZXJpZnksXG5cbiAgLy8gVE9ETzogcmVtb3ZlXG4gIF9fY3VydmU6IHNlY3AyNTZrMVxufVxuIiwidmFyIGJhZGRyZXNzID0gcmVxdWlyZSgnLi9hZGRyZXNzJylcbnZhciBiY3J5cHRvID0gcmVxdWlyZSgnLi9jcnlwdG8nKVxudmFyIGVjZHNhID0gcmVxdWlyZSgnLi9lY2RzYScpXG52YXIgcmFuZG9tQnl0ZXMgPSByZXF1aXJlKCdyYW5kb21ieXRlcycpXG52YXIgdHlwZWZvcmNlID0gcmVxdWlyZSgndHlwZWZvcmNlJylcbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKVxudmFyIHdpZiA9IHJlcXVpcmUoJ3dpZicpXG5cbnZhciBORVRXT1JLUyA9IHJlcXVpcmUoJy4vbmV0d29ya3MnKVxudmFyIEJpZ0ludGVnZXIgPSByZXF1aXJlKCdiaWdpJylcblxudmFyIGVjdXJ2ZSA9IHJlcXVpcmUoJ2VjdXJ2ZScpXG52YXIgc2VjcDI1NmsxID0gZWNkc2EuX19jdXJ2ZVxuXG5mdW5jdGlvbiBFQ1BhaXIgKGQsIFEsIG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMpIHtcbiAgICB0eXBlZm9yY2Uoe1xuICAgICAgY29tcHJlc3NlZDogdHlwZXMubWF5YmUodHlwZXMuQm9vbGVhbiksXG4gICAgICBuZXR3b3JrOiB0eXBlcy5tYXliZSh0eXBlcy5OZXR3b3JrKVxuICAgIH0sIG9wdGlvbnMpXG4gIH1cblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gIGlmIChkKSB7XG4gICAgaWYgKGQuc2lnbnVtKCkgPD0gMCkgdGhyb3cgbmV3IEVycm9yKCdQcml2YXRlIGtleSBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwJylcbiAgICBpZiAoZC5jb21wYXJlVG8oc2VjcDI1NmsxLm4pID49IDApIHRocm93IG5ldyBFcnJvcignUHJpdmF0ZSBrZXkgbXVzdCBiZSBsZXNzIHRoYW4gdGhlIGN1cnZlIG9yZGVyJylcbiAgICBpZiAoUSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5leHBlY3RlZCBwdWJsaWNLZXkgcGFyYW1ldGVyJylcblxuICAgIHRoaXMuZCA9IGRcbiAgfSBlbHNlIHtcbiAgICB0eXBlZm9yY2UodHlwZXMuRUNQb2ludCwgUSlcblxuICAgIHRoaXMuX19RID0gUVxuICB9XG5cbiAgdGhpcy5jb21wcmVzc2VkID0gb3B0aW9ucy5jb21wcmVzc2VkID09PSB1bmRlZmluZWQgPyB0cnVlIDogb3B0aW9ucy5jb21wcmVzc2VkXG4gIHRoaXMubmV0d29yayA9IG9wdGlvbnMubmV0d29yayB8fCBORVRXT1JLUy5iaXRjb2luXG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShFQ1BhaXIucHJvdG90eXBlLCAnUScsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCF0aGlzLl9fUSAmJiB0aGlzLmQpIHtcbiAgICAgIHRoaXMuX19RID0gc2VjcDI1NmsxLkcubXVsdGlwbHkodGhpcy5kKVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9fUVxuICB9XG59KVxuXG5FQ1BhaXIuZnJvbVB1YmxpY0tleUJ1ZmZlciA9IGZ1bmN0aW9uIChidWZmZXIsIG5ldHdvcmspIHtcbiAgdmFyIFEgPSBlY3VydmUuUG9pbnQuZGVjb2RlRnJvbShzZWNwMjU2azEsIGJ1ZmZlcilcblxuICByZXR1cm4gbmV3IEVDUGFpcihudWxsLCBRLCB7XG4gICAgY29tcHJlc3NlZDogUS5jb21wcmVzc2VkLFxuICAgIG5ldHdvcms6IG5ldHdvcmtcbiAgfSlcbn1cblxuRUNQYWlyLmZyb21XSUYgPSBmdW5jdGlvbiAoc3RyaW5nLCBuZXR3b3JrKSB7XG4gIHZhciBkZWNvZGVkID0gd2lmLmRlY29kZShzdHJpbmcpXG4gIHZhciB2ZXJzaW9uID0gZGVjb2RlZC52ZXJzaW9uXG5cbiAgLy8gbGlzdCBvZiBuZXR3b3Jrcz9cbiAgaWYgKHR5cGVzLkFycmF5KG5ldHdvcmspKSB7XG4gICAgbmV0d29yayA9IG5ldHdvcmsuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG4gICAgICByZXR1cm4gdmVyc2lvbiA9PT0geC53aWZcbiAgICB9KS5wb3AoKVxuXG4gICAgaWYgKCFuZXR3b3JrKSB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbmV0d29yayB2ZXJzaW9uJylcblxuICAvLyBvdGhlcndpc2UsIGFzc3VtZSBhIG5ldHdvcmsgb2JqZWN0IChvciBkZWZhdWx0IHRvIGJpdGNvaW4pXG4gIH0gZWxzZSB7XG4gICAgbmV0d29yayA9IG5ldHdvcmsgfHwgTkVUV09SS1MuYml0Y29pblxuXG4gICAgaWYgKHZlcnNpb24gIT09IG5ldHdvcmsud2lmKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbmV0d29yayB2ZXJzaW9uJylcbiAgfVxuXG4gIHZhciBkID0gQmlnSW50ZWdlci5mcm9tQnVmZmVyKGRlY29kZWQucHJpdmF0ZUtleSlcblxuICByZXR1cm4gbmV3IEVDUGFpcihkLCBudWxsLCB7XG4gICAgY29tcHJlc3NlZDogZGVjb2RlZC5jb21wcmVzc2VkLFxuICAgIG5ldHdvcms6IG5ldHdvcmtcbiAgfSlcbn1cblxuRUNQYWlyLm1ha2VSYW5kb20gPSBmdW5jdGlvbiAob3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuXG4gIHZhciBybmcgPSBvcHRpb25zLnJuZyB8fCByYW5kb21CeXRlc1xuXG4gIHZhciBkXG4gIGRvIHtcbiAgICB2YXIgYnVmZmVyID0gcm5nKDMyKVxuICAgIHR5cGVmb3JjZSh0eXBlcy5CdWZmZXIyNTZiaXQsIGJ1ZmZlcilcblxuICAgIGQgPSBCaWdJbnRlZ2VyLmZyb21CdWZmZXIoYnVmZmVyKVxuICB9IHdoaWxlIChkLnNpZ251bSgpIDw9IDAgfHwgZC5jb21wYXJlVG8oc2VjcDI1NmsxLm4pID49IDApXG5cbiAgcmV0dXJuIG5ldyBFQ1BhaXIoZCwgbnVsbCwgb3B0aW9ucylcbn1cblxuRUNQYWlyLnByb3RvdHlwZS5nZXRBZGRyZXNzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gYmFkZHJlc3MudG9CYXNlNThDaGVjayhiY3J5cHRvLmhhc2gxNjAodGhpcy5nZXRQdWJsaWNLZXlCdWZmZXIoKSksIHRoaXMuZ2V0TmV0d29yaygpLnB1YktleUhhc2gpXG59XG5cbkVDUGFpci5wcm90b3R5cGUuZ2V0TmV0d29yayA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMubmV0d29ya1xufVxuXG5FQ1BhaXIucHJvdG90eXBlLmdldFB1YmxpY0tleUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuUS5nZXRFbmNvZGVkKHRoaXMuY29tcHJlc3NlZClcbn1cblxuRUNQYWlyLnByb3RvdHlwZS5zaWduID0gZnVuY3Rpb24gKGhhc2gpIHtcbiAgaWYgKCF0aGlzLmQpIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBwcml2YXRlIGtleScpXG5cbiAgcmV0dXJuIGVjZHNhLnNpZ24oaGFzaCwgdGhpcy5kKVxufVxuXG5FQ1BhaXIucHJvdG90eXBlLnRvV0lGID0gZnVuY3Rpb24gKCkge1xuICBpZiAoIXRoaXMuZCkgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHByaXZhdGUga2V5JylcblxuICByZXR1cm4gd2lmLmVuY29kZSh0aGlzLm5ldHdvcmsud2lmLCB0aGlzLmQudG9CdWZmZXIoMzIpLCB0aGlzLmNvbXByZXNzZWQpXG59XG5cbkVDUGFpci5wcm90b3R5cGUudmVyaWZ5ID0gZnVuY3Rpb24gKGhhc2gsIHNpZ25hdHVyZSkge1xuICByZXR1cm4gZWNkc2EudmVyaWZ5KGhhc2gsIHNpZ25hdHVyZSwgdGhpcy5RKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEVDUGFpclxuIiwidmFyIGJpcDY2ID0gcmVxdWlyZSgnYmlwNjYnKVxudmFyIHR5cGVmb3JjZSA9IHJlcXVpcmUoJ3R5cGVmb3JjZScpXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuL3R5cGVzJylcblxudmFyIEJpZ0ludGVnZXIgPSByZXF1aXJlKCdiaWdpJylcblxuZnVuY3Rpb24gRUNTaWduYXR1cmUgKHIsIHMpIHtcbiAgdHlwZWZvcmNlKHR5cGVzLnR1cGxlKHR5cGVzLkJpZ0ludCwgdHlwZXMuQmlnSW50KSwgYXJndW1lbnRzKVxuXG4gIHRoaXMuciA9IHJcbiAgdGhpcy5zID0gc1xufVxuXG5FQ1NpZ25hdHVyZS5wYXJzZUNvbXBhY3QgPSBmdW5jdGlvbiAoYnVmZmVyKSB7XG4gIHR5cGVmb3JjZSh0eXBlcy5CdWZmZXJOKDY1KSwgYnVmZmVyKVxuXG4gIHZhciBmbGFnQnl0ZSA9IGJ1ZmZlci5yZWFkVUludDgoMCkgLSAyN1xuICBpZiAoZmxhZ0J5dGUgIT09IChmbGFnQnl0ZSAmIDcpKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc2lnbmF0dXJlIHBhcmFtZXRlcicpXG5cbiAgdmFyIGNvbXByZXNzZWQgPSAhIShmbGFnQnl0ZSAmIDQpXG4gIHZhciByZWNvdmVyeVBhcmFtID0gZmxhZ0J5dGUgJiAzXG4gIHZhciBzaWduYXR1cmUgPSBFQ1NpZ25hdHVyZS5mcm9tUlNCdWZmZXIoYnVmZmVyLnNsaWNlKDEpKVxuXG4gIHJldHVybiB7XG4gICAgY29tcHJlc3NlZDogY29tcHJlc3NlZCxcbiAgICBpOiByZWNvdmVyeVBhcmFtLFxuICAgIHNpZ25hdHVyZTogc2lnbmF0dXJlXG4gIH1cbn1cblxuRUNTaWduYXR1cmUuZnJvbVJTQnVmZmVyID0gZnVuY3Rpb24gKGJ1ZmZlcikge1xuICB0eXBlZm9yY2UodHlwZXMuQnVmZmVyTig2NCksIGJ1ZmZlcilcblxuICB2YXIgciA9IEJpZ0ludGVnZXIuZnJvbUJ1ZmZlcihidWZmZXIuc2xpY2UoMCwgMzIpKVxuICB2YXIgcyA9IEJpZ0ludGVnZXIuZnJvbUJ1ZmZlcihidWZmZXIuc2xpY2UoMzIsIDY0KSlcbiAgcmV0dXJuIG5ldyBFQ1NpZ25hdHVyZShyLCBzKVxufVxuXG5FQ1NpZ25hdHVyZS5mcm9tREVSID0gZnVuY3Rpb24gKGJ1ZmZlcikge1xuICB2YXIgZGVjb2RlID0gYmlwNjYuZGVjb2RlKGJ1ZmZlcilcbiAgdmFyIHIgPSBCaWdJbnRlZ2VyLmZyb21ERVJJbnRlZ2VyKGRlY29kZS5yKVxuICB2YXIgcyA9IEJpZ0ludGVnZXIuZnJvbURFUkludGVnZXIoZGVjb2RlLnMpXG5cbiAgcmV0dXJuIG5ldyBFQ1NpZ25hdHVyZShyLCBzKVxufVxuXG4vLyBCSVA2MjogMSBieXRlIGhhc2hUeXBlIGZsYWcgKG9ubHkgMHgwMSwgMHgwMiwgMHgwMywgMHg4MSwgMHg4MiBhbmQgMHg4MyBhcmUgYWxsb3dlZClcbkVDU2lnbmF0dXJlLnBhcnNlU2NyaXB0U2lnbmF0dXJlID0gZnVuY3Rpb24gKGJ1ZmZlcikge1xuICB2YXIgaGFzaFR5cGUgPSBidWZmZXIucmVhZFVJbnQ4KGJ1ZmZlci5sZW5ndGggLSAxKVxuICB2YXIgaGFzaFR5cGVNb2QgPSBoYXNoVHlwZSAmIH4weDgwXG5cbiAgaWYgKGhhc2hUeXBlTW9kIDw9IDB4MDAgfHwgaGFzaFR5cGVNb2QgPj0gMHgwNCkgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGhhc2hUeXBlICcgKyBoYXNoVHlwZSlcblxuICByZXR1cm4ge1xuICAgIHNpZ25hdHVyZTogRUNTaWduYXR1cmUuZnJvbURFUihidWZmZXIuc2xpY2UoMCwgLTEpKSxcbiAgICBoYXNoVHlwZTogaGFzaFR5cGVcbiAgfVxufVxuXG5FQ1NpZ25hdHVyZS5wcm90b3R5cGUudG9Db21wYWN0ID0gZnVuY3Rpb24gKGksIGNvbXByZXNzZWQpIHtcbiAgaWYgKGNvbXByZXNzZWQpIHtcbiAgICBpICs9IDRcbiAgfVxuXG4gIGkgKz0gMjdcblxuICB2YXIgYnVmZmVyID0gQnVmZmVyLmFsbG9jKDY1KVxuICBidWZmZXIud3JpdGVVSW50OChpLCAwKVxuICB0aGlzLnRvUlNCdWZmZXIoYnVmZmVyLCAxKVxuICByZXR1cm4gYnVmZmVyXG59XG5cbkVDU2lnbmF0dXJlLnByb3RvdHlwZS50b0RFUiA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHIgPSBCdWZmZXIuZnJvbSh0aGlzLnIudG9ERVJJbnRlZ2VyKCkpXG4gIHZhciBzID0gQnVmZmVyLmZyb20odGhpcy5zLnRvREVSSW50ZWdlcigpKVxuXG4gIHJldHVybiBiaXA2Ni5lbmNvZGUociwgcylcbn1cblxuRUNTaWduYXR1cmUucHJvdG90eXBlLnRvUlNCdWZmZXIgPSBmdW5jdGlvbiAoYnVmZmVyLCBvZmZzZXQpIHtcbiAgYnVmZmVyID0gYnVmZmVyIHx8IEJ1ZmZlci5hbGxvYyg2NClcbiAgdGhpcy5yLnRvQnVmZmVyKDMyKS5jb3B5KGJ1ZmZlciwgb2Zmc2V0KVxuICB0aGlzLnMudG9CdWZmZXIoMzIpLmNvcHkoYnVmZmVyLCBvZmZzZXQgKyAzMilcbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5FQ1NpZ25hdHVyZS5wcm90b3R5cGUudG9TY3JpcHRTaWduYXR1cmUgPSBmdW5jdGlvbiAoaGFzaFR5cGUpIHtcbiAgdmFyIGhhc2hUeXBlTW9kID0gaGFzaFR5cGUgJiB+MHg4MFxuICBpZiAoaGFzaFR5cGVNb2QgPD0gMCB8fCBoYXNoVHlwZU1vZCA+PSA0KSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaGFzaFR5cGUgJyArIGhhc2hUeXBlKVxuXG4gIHZhciBoYXNoVHlwZUJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygxKVxuICBoYXNoVHlwZUJ1ZmZlci53cml0ZVVJbnQ4KGhhc2hUeXBlLCAwKVxuXG4gIHJldHVybiBCdWZmZXIuY29uY2F0KFt0aGlzLnRvREVSKCksIGhhc2hUeXBlQnVmZmVyXSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFQ1NpZ25hdHVyZVxuIiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgYmFzZTU4Y2hlY2sgPSByZXF1aXJlKCdiczU4Y2hlY2snKVxudmFyIGJjcnlwdG8gPSByZXF1aXJlKCcuL2NyeXB0bycpXG52YXIgY3JlYXRlSG1hYyA9IHJlcXVpcmUoJ2NyZWF0ZS1obWFjJylcbnZhciB0eXBlZm9yY2UgPSByZXF1aXJlKCd0eXBlZm9yY2UnKVxudmFyIHR5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpXG52YXIgTkVUV09SS1MgPSByZXF1aXJlKCcuL25ldHdvcmtzJylcblxudmFyIEJpZ0ludGVnZXIgPSByZXF1aXJlKCdiaWdpJylcbnZhciBFQ1BhaXIgPSByZXF1aXJlKCcuL2VjcGFpcicpXG5cbnZhciBlY3VydmUgPSByZXF1aXJlKCdlY3VydmUnKVxudmFyIGN1cnZlID0gZWN1cnZlLmdldEN1cnZlQnlOYW1lKCdzZWNwMjU2azEnKVxuXG5mdW5jdGlvbiBIRE5vZGUgKGtleVBhaXIsIGNoYWluQ29kZSkge1xuICB0eXBlZm9yY2UodHlwZXMudHVwbGUoJ0VDUGFpcicsIHR5cGVzLkJ1ZmZlcjI1NmJpdCksIGFyZ3VtZW50cylcblxuICBpZiAoIWtleVBhaXIuY29tcHJlc3NlZCkgdGhyb3cgbmV3IFR5cGVFcnJvcignQklQMzIgb25seSBhbGxvd3MgY29tcHJlc3NlZCBrZXlQYWlycycpXG5cbiAgdGhpcy5rZXlQYWlyID0ga2V5UGFpclxuICB0aGlzLmNoYWluQ29kZSA9IGNoYWluQ29kZVxuICB0aGlzLmRlcHRoID0gMFxuICB0aGlzLmluZGV4ID0gMFxuICB0aGlzLnBhcmVudEZpbmdlcnByaW50ID0gMHgwMDAwMDAwMFxufVxuXG5IRE5vZGUuSElHSEVTVF9CSVQgPSAweDgwMDAwMDAwXG5IRE5vZGUuTEVOR1RIID0gNzhcbkhETm9kZS5NQVNURVJfU0VDUkVUID0gQnVmZmVyLmZyb20oJ0JpdGNvaW4gc2VlZCcsICd1dGY4JylcblxuSEROb2RlLmZyb21TZWVkQnVmZmVyID0gZnVuY3Rpb24gKHNlZWQsIG5ldHdvcmspIHtcbiAgdHlwZWZvcmNlKHR5cGVzLnR1cGxlKHR5cGVzLkJ1ZmZlciwgdHlwZXMubWF5YmUodHlwZXMuTmV0d29yaykpLCBhcmd1bWVudHMpXG5cbiAgaWYgKHNlZWQubGVuZ3RoIDwgMTYpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1NlZWQgc2hvdWxkIGJlIGF0IGxlYXN0IDEyOCBiaXRzJylcbiAgaWYgKHNlZWQubGVuZ3RoID4gNjQpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1NlZWQgc2hvdWxkIGJlIGF0IG1vc3QgNTEyIGJpdHMnKVxuXG4gIHZhciBJID0gY3JlYXRlSG1hYygnc2hhNTEyJywgSEROb2RlLk1BU1RFUl9TRUNSRVQpLnVwZGF0ZShzZWVkKS5kaWdlc3QoKVxuICB2YXIgSUwgPSBJLnNsaWNlKDAsIDMyKVxuICB2YXIgSVIgPSBJLnNsaWNlKDMyKVxuXG4gIC8vIEluIGNhc2UgSUwgaXMgMCBvciA+PSBuLCB0aGUgbWFzdGVyIGtleSBpcyBpbnZhbGlkXG4gIC8vIFRoaXMgaXMgaGFuZGxlZCBieSB0aGUgRUNQYWlyIGNvbnN0cnVjdG9yXG4gIHZhciBwSUwgPSBCaWdJbnRlZ2VyLmZyb21CdWZmZXIoSUwpXG4gIHZhciBrZXlQYWlyID0gbmV3IEVDUGFpcihwSUwsIG51bGwsIHtcbiAgICBuZXR3b3JrOiBuZXR3b3JrXG4gIH0pXG5cbiAgcmV0dXJuIG5ldyBIRE5vZGUoa2V5UGFpciwgSVIpXG59XG5cbkhETm9kZS5mcm9tU2VlZEhleCA9IGZ1bmN0aW9uIChoZXgsIG5ldHdvcmspIHtcbiAgcmV0dXJuIEhETm9kZS5mcm9tU2VlZEJ1ZmZlcihCdWZmZXIuZnJvbShoZXgsICdoZXgnKSwgbmV0d29yaylcbn1cblxuSEROb2RlLmZyb21CYXNlNTggPSBmdW5jdGlvbiAoc3RyaW5nLCBuZXR3b3Jrcykge1xuICB2YXIgYnVmZmVyID0gYmFzZTU4Y2hlY2suZGVjb2RlKHN0cmluZylcbiAgaWYgKGJ1ZmZlci5sZW5ndGggIT09IDc4KSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgYnVmZmVyIGxlbmd0aCcpXG5cbiAgLy8gNCBieXRlczogdmVyc2lvbiBieXRlc1xuICB2YXIgdmVyc2lvbiA9IGJ1ZmZlci5yZWFkVUludDMyQkUoMClcbiAgdmFyIG5ldHdvcmtcblxuICAvLyBsaXN0IG9mIG5ldHdvcmtzP1xuICBpZiAoQXJyYXkuaXNBcnJheShuZXR3b3JrcykpIHtcbiAgICBuZXR3b3JrID0gbmV0d29ya3MuZmlsdGVyKGZ1bmN0aW9uICh4KSB7XG4gICAgICByZXR1cm4gdmVyc2lvbiA9PT0geC5iaXAzMi5wcml2YXRlIHx8XG4gICAgICAgICAgICAgdmVyc2lvbiA9PT0geC5iaXAzMi5wdWJsaWNcbiAgICB9KS5wb3AoKVxuXG4gICAgaWYgKCFuZXR3b3JrKSB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbmV0d29yayB2ZXJzaW9uJylcblxuICAvLyBvdGhlcndpc2UsIGFzc3VtZSBhIG5ldHdvcmsgb2JqZWN0IChvciBkZWZhdWx0IHRvIGJpdGNvaW4pXG4gIH0gZWxzZSB7XG4gICAgbmV0d29yayA9IG5ldHdvcmtzIHx8IE5FVFdPUktTLmJpdGNvaW5cbiAgfVxuXG4gIGlmICh2ZXJzaW9uICE9PSBuZXR3b3JrLmJpcDMyLnByaXZhdGUgJiZcbiAgICB2ZXJzaW9uICE9PSBuZXR3b3JrLmJpcDMyLnB1YmxpYykgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG5ldHdvcmsgdmVyc2lvbicpXG5cbiAgLy8gMSBieXRlOiBkZXB0aDogMHgwMCBmb3IgbWFzdGVyIG5vZGVzLCAweDAxIGZvciBsZXZlbC0xIGRlc2NlbmRhbnRzLCAuLi5cbiAgdmFyIGRlcHRoID0gYnVmZmVyWzRdXG5cbiAgLy8gNCBieXRlczogdGhlIGZpbmdlcnByaW50IG9mIHRoZSBwYXJlbnQncyBrZXkgKDB4MDAwMDAwMDAgaWYgbWFzdGVyIGtleSlcbiAgdmFyIHBhcmVudEZpbmdlcnByaW50ID0gYnVmZmVyLnJlYWRVSW50MzJCRSg1KVxuICBpZiAoZGVwdGggPT09IDApIHtcbiAgICBpZiAocGFyZW50RmluZ2VycHJpbnQgIT09IDB4MDAwMDAwMDApIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwYXJlbnQgZmluZ2VycHJpbnQnKVxuICB9XG5cbiAgLy8gNCBieXRlczogY2hpbGQgbnVtYmVyLiBUaGlzIGlzIHRoZSBudW1iZXIgaSBpbiB4aSA9IHhwYXIvaSwgd2l0aCB4aSB0aGUga2V5IGJlaW5nIHNlcmlhbGl6ZWQuXG4gIC8vIFRoaXMgaXMgZW5jb2RlZCBpbiBNU0Igb3JkZXIuICgweDAwMDAwMDAwIGlmIG1hc3RlciBrZXkpXG4gIHZhciBpbmRleCA9IGJ1ZmZlci5yZWFkVUludDMyQkUoOSlcbiAgaWYgKGRlcHRoID09PSAwICYmIGluZGV4ICE9PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaW5kZXgnKVxuXG4gIC8vIDMyIGJ5dGVzOiB0aGUgY2hhaW4gY29kZVxuICB2YXIgY2hhaW5Db2RlID0gYnVmZmVyLnNsaWNlKDEzLCA0NSlcbiAgdmFyIGtleVBhaXJcblxuICAvLyAzMyBieXRlczogcHJpdmF0ZSBrZXkgZGF0YSAoMHgwMCArIGspXG4gIGlmICh2ZXJzaW9uID09PSBuZXR3b3JrLmJpcDMyLnByaXZhdGUpIHtcbiAgICBpZiAoYnVmZmVyLnJlYWRVSW50OCg0NSkgIT09IDB4MDApIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBwcml2YXRlIGtleScpXG5cbiAgICB2YXIgZCA9IEJpZ0ludGVnZXIuZnJvbUJ1ZmZlcihidWZmZXIuc2xpY2UoNDYsIDc4KSlcbiAgICBrZXlQYWlyID0gbmV3IEVDUGFpcihkLCBudWxsLCB7IG5ldHdvcms6IG5ldHdvcmsgfSlcblxuICAvLyAzMyBieXRlczogcHVibGljIGtleSBkYXRhICgweDAyICsgWCBvciAweDAzICsgWClcbiAgfSBlbHNlIHtcbiAgICB2YXIgUSA9IGVjdXJ2ZS5Qb2ludC5kZWNvZGVGcm9tKGN1cnZlLCBidWZmZXIuc2xpY2UoNDUsIDc4KSlcbiAgICAvLyBRLmNvbXByZXNzZWQgaXMgYXNzdW1lZCwgaWYgc29tZWhvdyB0aGlzIGFzc3VtcHRpb24gaXMgYnJva2VuLCBgbmV3IEhETm9kZWAgd2lsbCB0aHJvd1xuXG4gICAgLy8gVmVyaWZ5IHRoYXQgdGhlIFggY29vcmRpbmF0ZSBpbiB0aGUgcHVibGljIHBvaW50IGNvcnJlc3BvbmRzIHRvIGEgcG9pbnQgb24gdGhlIGN1cnZlLlxuICAgIC8vIElmIG5vdCwgdGhlIGV4dGVuZGVkIHB1YmxpYyBrZXkgaXMgaW52YWxpZC5cbiAgICBjdXJ2ZS52YWxpZGF0ZShRKVxuXG4gICAga2V5UGFpciA9IG5ldyBFQ1BhaXIobnVsbCwgUSwgeyBuZXR3b3JrOiBuZXR3b3JrIH0pXG4gIH1cblxuICB2YXIgaGQgPSBuZXcgSEROb2RlKGtleVBhaXIsIGNoYWluQ29kZSlcbiAgaGQuZGVwdGggPSBkZXB0aFxuICBoZC5pbmRleCA9IGluZGV4XG4gIGhkLnBhcmVudEZpbmdlcnByaW50ID0gcGFyZW50RmluZ2VycHJpbnRcblxuICByZXR1cm4gaGRcbn1cblxuSEROb2RlLnByb3RvdHlwZS5nZXRBZGRyZXNzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5rZXlQYWlyLmdldEFkZHJlc3MoKVxufVxuXG5IRE5vZGUucHJvdG90eXBlLmdldElkZW50aWZpZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBiY3J5cHRvLmhhc2gxNjAodGhpcy5rZXlQYWlyLmdldFB1YmxpY0tleUJ1ZmZlcigpKVxufVxuXG5IRE5vZGUucHJvdG90eXBlLmdldEZpbmdlcnByaW50ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5nZXRJZGVudGlmaWVyKCkuc2xpY2UoMCwgNClcbn1cblxuSEROb2RlLnByb3RvdHlwZS5nZXROZXR3b3JrID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5rZXlQYWlyLmdldE5ldHdvcmsoKVxufVxuXG5IRE5vZGUucHJvdG90eXBlLmdldFB1YmxpY0tleUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMua2V5UGFpci5nZXRQdWJsaWNLZXlCdWZmZXIoKVxufVxuXG5IRE5vZGUucHJvdG90eXBlLm5ldXRlcmVkID0gZnVuY3Rpb24gKCkge1xuICB2YXIgbmV1dGVyZWRLZXlQYWlyID0gbmV3IEVDUGFpcihudWxsLCB0aGlzLmtleVBhaXIuUSwge1xuICAgIG5ldHdvcms6IHRoaXMua2V5UGFpci5uZXR3b3JrXG4gIH0pXG5cbiAgdmFyIG5ldXRlcmVkID0gbmV3IEhETm9kZShuZXV0ZXJlZEtleVBhaXIsIHRoaXMuY2hhaW5Db2RlKVxuICBuZXV0ZXJlZC5kZXB0aCA9IHRoaXMuZGVwdGhcbiAgbmV1dGVyZWQuaW5kZXggPSB0aGlzLmluZGV4XG4gIG5ldXRlcmVkLnBhcmVudEZpbmdlcnByaW50ID0gdGhpcy5wYXJlbnRGaW5nZXJwcmludFxuXG4gIHJldHVybiBuZXV0ZXJlZFxufVxuXG5IRE5vZGUucHJvdG90eXBlLnNpZ24gPSBmdW5jdGlvbiAoaGFzaCkge1xuICByZXR1cm4gdGhpcy5rZXlQYWlyLnNpZ24oaGFzaClcbn1cblxuSEROb2RlLnByb3RvdHlwZS52ZXJpZnkgPSBmdW5jdGlvbiAoaGFzaCwgc2lnbmF0dXJlKSB7XG4gIHJldHVybiB0aGlzLmtleVBhaXIudmVyaWZ5KGhhc2gsIHNpZ25hdHVyZSlcbn1cblxuSEROb2RlLnByb3RvdHlwZS50b0Jhc2U1OCA9IGZ1bmN0aW9uIChfX2lzUHJpdmF0ZSkge1xuICBpZiAoX19pc1ByaXZhdGUgIT09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5zdXBwb3J0ZWQgYXJndW1lbnQgaW4gMi4wLjAnKVxuXG4gIC8vIFZlcnNpb25cbiAgdmFyIG5ldHdvcmsgPSB0aGlzLmtleVBhaXIubmV0d29ya1xuICB2YXIgdmVyc2lvbiA9ICghdGhpcy5pc05ldXRlcmVkKCkpID8gbmV0d29yay5iaXAzMi5wcml2YXRlIDogbmV0d29yay5iaXAzMi5wdWJsaWNcbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSg3OClcblxuICAvLyA0IGJ5dGVzOiB2ZXJzaW9uIGJ5dGVzXG4gIGJ1ZmZlci53cml0ZVVJbnQzMkJFKHZlcnNpb24sIDApXG5cbiAgLy8gMSBieXRlOiBkZXB0aDogMHgwMCBmb3IgbWFzdGVyIG5vZGVzLCAweDAxIGZvciBsZXZlbC0xIGRlc2NlbmRhbnRzLCAuLi4uXG4gIGJ1ZmZlci53cml0ZVVJbnQ4KHRoaXMuZGVwdGgsIDQpXG5cbiAgLy8gNCBieXRlczogdGhlIGZpbmdlcnByaW50IG9mIHRoZSBwYXJlbnQncyBrZXkgKDB4MDAwMDAwMDAgaWYgbWFzdGVyIGtleSlcbiAgYnVmZmVyLndyaXRlVUludDMyQkUodGhpcy5wYXJlbnRGaW5nZXJwcmludCwgNSlcblxuICAvLyA0IGJ5dGVzOiBjaGlsZCBudW1iZXIuIFRoaXMgaXMgdGhlIG51bWJlciBpIGluIHhpID0geHBhci9pLCB3aXRoIHhpIHRoZSBrZXkgYmVpbmcgc2VyaWFsaXplZC5cbiAgLy8gVGhpcyBpcyBlbmNvZGVkIGluIGJpZyBlbmRpYW4uICgweDAwMDAwMDAwIGlmIG1hc3RlciBrZXkpXG4gIGJ1ZmZlci53cml0ZVVJbnQzMkJFKHRoaXMuaW5kZXgsIDkpXG5cbiAgLy8gMzIgYnl0ZXM6IHRoZSBjaGFpbiBjb2RlXG4gIHRoaXMuY2hhaW5Db2RlLmNvcHkoYnVmZmVyLCAxMylcblxuICAvLyAzMyBieXRlczogdGhlIHB1YmxpYyBrZXkgb3IgcHJpdmF0ZSBrZXkgZGF0YVxuICBpZiAoIXRoaXMuaXNOZXV0ZXJlZCgpKSB7XG4gICAgLy8gMHgwMCArIGsgZm9yIHByaXZhdGUga2V5c1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KDAsIDQ1KVxuICAgIHRoaXMua2V5UGFpci5kLnRvQnVmZmVyKDMyKS5jb3B5KGJ1ZmZlciwgNDYpXG5cbiAgLy8gMzMgYnl0ZXM6IHRoZSBwdWJsaWMga2V5XG4gIH0gZWxzZSB7XG4gICAgLy8gWDkuNjIgZW5jb2RpbmcgZm9yIHB1YmxpYyBrZXlzXG4gICAgdGhpcy5rZXlQYWlyLmdldFB1YmxpY0tleUJ1ZmZlcigpLmNvcHkoYnVmZmVyLCA0NSlcbiAgfVxuXG4gIHJldHVybiBiYXNlNThjaGVjay5lbmNvZGUoYnVmZmVyKVxufVxuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYml0Y29pbi9iaXBzL2Jsb2IvbWFzdGVyL2JpcC0wMDMyLm1lZGlhd2lraSNjaGlsZC1rZXktZGVyaXZhdGlvbi1ja2QtZnVuY3Rpb25zXG5IRE5vZGUucHJvdG90eXBlLmRlcml2ZSA9IGZ1bmN0aW9uIChpbmRleCkge1xuICB0eXBlZm9yY2UodHlwZXMuVUludDMyLCBpbmRleClcblxuICB2YXIgaXNIYXJkZW5lZCA9IGluZGV4ID49IEhETm9kZS5ISUdIRVNUX0JJVFxuICB2YXIgZGF0YSA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgzNylcblxuICAvLyBIYXJkZW5lZCBjaGlsZFxuICBpZiAoaXNIYXJkZW5lZCkge1xuICAgIGlmICh0aGlzLmlzTmV1dGVyZWQoKSkgdGhyb3cgbmV3IFR5cGVFcnJvcignQ291bGQgbm90IGRlcml2ZSBoYXJkZW5lZCBjaGlsZCBrZXknKVxuXG4gICAgLy8gZGF0YSA9IDB4MDAgfHwgc2VyMjU2KGtwYXIpIHx8IHNlcjMyKGluZGV4KVxuICAgIGRhdGFbMF0gPSAweDAwXG4gICAgdGhpcy5rZXlQYWlyLmQudG9CdWZmZXIoMzIpLmNvcHkoZGF0YSwgMSlcbiAgICBkYXRhLndyaXRlVUludDMyQkUoaW5kZXgsIDMzKVxuXG4gIC8vIE5vcm1hbCBjaGlsZFxuICB9IGVsc2Uge1xuICAgIC8vIGRhdGEgPSBzZXJQKHBvaW50KGtwYXIpKSB8fCBzZXIzMihpbmRleClcbiAgICAvLyAgICAgID0gc2VyUChLcGFyKSB8fCBzZXIzMihpbmRleClcbiAgICB0aGlzLmtleVBhaXIuZ2V0UHVibGljS2V5QnVmZmVyKCkuY29weShkYXRhLCAwKVxuICAgIGRhdGEud3JpdGVVSW50MzJCRShpbmRleCwgMzMpXG4gIH1cblxuICB2YXIgSSA9IGNyZWF0ZUhtYWMoJ3NoYTUxMicsIHRoaXMuY2hhaW5Db2RlKS51cGRhdGUoZGF0YSkuZGlnZXN0KClcbiAgdmFyIElMID0gSS5zbGljZSgwLCAzMilcbiAgdmFyIElSID0gSS5zbGljZSgzMilcblxuICB2YXIgcElMID0gQmlnSW50ZWdlci5mcm9tQnVmZmVyKElMKVxuXG4gIC8vIEluIGNhc2UgcGFyc2UyNTYoSUwpID49IG4sIHByb2NlZWQgd2l0aCB0aGUgbmV4dCB2YWx1ZSBmb3IgaVxuICBpZiAocElMLmNvbXBhcmVUbyhjdXJ2ZS5uKSA+PSAwKSB7XG4gICAgcmV0dXJuIHRoaXMuZGVyaXZlKGluZGV4ICsgMSlcbiAgfVxuXG4gIC8vIFByaXZhdGUgcGFyZW50IGtleSAtPiBwcml2YXRlIGNoaWxkIGtleVxuICB2YXIgZGVyaXZlZEtleVBhaXJcbiAgaWYgKCF0aGlzLmlzTmV1dGVyZWQoKSkge1xuICAgIC8vIGtpID0gcGFyc2UyNTYoSUwpICsga3BhciAobW9kIG4pXG4gICAgdmFyIGtpID0gcElMLmFkZCh0aGlzLmtleVBhaXIuZCkubW9kKGN1cnZlLm4pXG5cbiAgICAvLyBJbiBjYXNlIGtpID09IDAsIHByb2NlZWQgd2l0aCB0aGUgbmV4dCB2YWx1ZSBmb3IgaVxuICAgIGlmIChraS5zaWdudW0oKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVyaXZlKGluZGV4ICsgMSlcbiAgICB9XG5cbiAgICBkZXJpdmVkS2V5UGFpciA9IG5ldyBFQ1BhaXIoa2ksIG51bGwsIHtcbiAgICAgIG5ldHdvcms6IHRoaXMua2V5UGFpci5uZXR3b3JrXG4gICAgfSlcblxuICAvLyBQdWJsaWMgcGFyZW50IGtleSAtPiBwdWJsaWMgY2hpbGQga2V5XG4gIH0gZWxzZSB7XG4gICAgLy8gS2kgPSBwb2ludChwYXJzZTI1NihJTCkpICsgS3BhclxuICAgIC8vICAgID0gRypJTCArIEtwYXJcbiAgICB2YXIgS2kgPSBjdXJ2ZS5HLm11bHRpcGx5KHBJTCkuYWRkKHRoaXMua2V5UGFpci5RKVxuXG4gICAgLy8gSW4gY2FzZSBLaSBpcyB0aGUgcG9pbnQgYXQgaW5maW5pdHksIHByb2NlZWQgd2l0aCB0aGUgbmV4dCB2YWx1ZSBmb3IgaVxuICAgIGlmIChjdXJ2ZS5pc0luZmluaXR5KEtpKSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVyaXZlKGluZGV4ICsgMSlcbiAgICB9XG5cbiAgICBkZXJpdmVkS2V5UGFpciA9IG5ldyBFQ1BhaXIobnVsbCwgS2ksIHtcbiAgICAgIG5ldHdvcms6IHRoaXMua2V5UGFpci5uZXR3b3JrXG4gICAgfSlcbiAgfVxuXG4gIHZhciBoZCA9IG5ldyBIRE5vZGUoZGVyaXZlZEtleVBhaXIsIElSKVxuICBoZC5kZXB0aCA9IHRoaXMuZGVwdGggKyAxXG4gIGhkLmluZGV4ID0gaW5kZXhcbiAgaGQucGFyZW50RmluZ2VycHJpbnQgPSB0aGlzLmdldEZpbmdlcnByaW50KCkucmVhZFVJbnQzMkJFKDApXG5cbiAgcmV0dXJuIGhkXG59XG5cbkhETm9kZS5wcm90b3R5cGUuZGVyaXZlSGFyZGVuZWQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgdHlwZWZvcmNlKHR5cGVzLlVJbnQzMSwgaW5kZXgpXG5cbiAgLy8gT25seSBkZXJpdmVzIGhhcmRlbmVkIHByaXZhdGUga2V5cyBieSBkZWZhdWx0XG4gIHJldHVybiB0aGlzLmRlcml2ZShpbmRleCArIEhETm9kZS5ISUdIRVNUX0JJVClcbn1cblxuLy8gUHJpdmF0ZSA9PT0gbm90IG5ldXRlcmVkXG4vLyBQdWJsaWMgPT09IG5ldXRlcmVkXG5IRE5vZGUucHJvdG90eXBlLmlzTmV1dGVyZWQgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAhKHRoaXMua2V5UGFpci5kKVxufVxuXG5IRE5vZGUucHJvdG90eXBlLmRlcml2ZVBhdGggPSBmdW5jdGlvbiAocGF0aCkge1xuICB0eXBlZm9yY2UodHlwZXMuQklQMzJQYXRoLCBwYXRoKVxuXG4gIHZhciBzcGxpdFBhdGggPSBwYXRoLnNwbGl0KCcvJylcbiAgaWYgKHNwbGl0UGF0aFswXSA9PT0gJ20nKSB7XG4gICAgaWYgKHRoaXMucGFyZW50RmluZ2VycHJpbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgbWFzdGVyIG5vZGUnKVxuICAgIH1cblxuICAgIHNwbGl0UGF0aCA9IHNwbGl0UGF0aC5zbGljZSgxKVxuICB9XG5cbiAgcmV0dXJuIHNwbGl0UGF0aC5yZWR1Y2UoZnVuY3Rpb24gKHByZXZIZCwgaW5kZXhTdHIpIHtcbiAgICB2YXIgaW5kZXhcbiAgICBpZiAoaW5kZXhTdHIuc2xpY2UoLTEpID09PSBcIidcIikge1xuICAgICAgaW5kZXggPSBwYXJzZUludChpbmRleFN0ci5zbGljZSgwLCAtMSksIDEwKVxuICAgICAgcmV0dXJuIHByZXZIZC5kZXJpdmVIYXJkZW5lZChpbmRleClcbiAgICB9IGVsc2Uge1xuICAgICAgaW5kZXggPSBwYXJzZUludChpbmRleFN0ciwgMTApXG4gICAgICByZXR1cm4gcHJldkhkLmRlcml2ZShpbmRleClcbiAgICB9XG4gIH0sIHRoaXMpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gSEROb2RlXG4iLCJ2YXIgc2NyaXB0ID0gcmVxdWlyZSgnLi9zY3JpcHQnKVxuXG52YXIgdGVtcGxhdGVzID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMnKVxuZm9yICh2YXIga2V5IGluIHRlbXBsYXRlcykge1xuICBzY3JpcHRba2V5XSA9IHRlbXBsYXRlc1trZXldXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBidWZmZXJ1dGlsczogcmVxdWlyZSgnLi9idWZmZXJ1dGlscycpLCAvLyBUT0RPOiByZW1vdmUgaW4gNC4wLjBcblxuICBCbG9jazogcmVxdWlyZSgnLi9ibG9jaycpLFxuICBFQ1BhaXI6IHJlcXVpcmUoJy4vZWNwYWlyJyksXG4gIEVDU2lnbmF0dXJlOiByZXF1aXJlKCcuL2Vjc2lnbmF0dXJlJyksXG4gIEhETm9kZTogcmVxdWlyZSgnLi9oZG5vZGUnKSxcbiAgVHJhbnNhY3Rpb246IHJlcXVpcmUoJy4vdHJhbnNhY3Rpb24nKSxcbiAgVHJhbnNhY3Rpb25CdWlsZGVyOiByZXF1aXJlKCcuL3RyYW5zYWN0aW9uX2J1aWxkZXInKSxcblxuICBhZGRyZXNzOiByZXF1aXJlKCcuL2FkZHJlc3MnKSxcbiAgY3J5cHRvOiByZXF1aXJlKCcuL2NyeXB0bycpLFxuICBuZXR3b3JrczogcmVxdWlyZSgnLi9uZXR3b3JrcycpLFxuICBvcGNvZGVzOiByZXF1aXJlKCdiaXRjb2luLW9wcycpLFxuICBzY3JpcHQ6IHNjcmlwdFxufVxuIiwiLy8gaHR0cHM6Ly9lbi5iaXRjb2luLml0L3dpa2kvTGlzdF9vZl9hZGRyZXNzX3ByZWZpeGVzXG4vLyBEb2dlY29pbiBCSVAzMiBpcyBhIHByb3Bvc2VkIHN0YW5kYXJkOiBodHRwczovL2JpdGNvaW50YWxrLm9yZy9pbmRleC5waHA/dG9waWM9NDA5NzMxXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBiaXRjb2luOiB7XG4gICAgbWVzc2FnZVByZWZpeDogJ1xceDE4Qml0Y29pbiBTaWduZWQgTWVzc2FnZTpcXG4nLFxuICAgIGJlY2gzMjogJ2JjJyxcbiAgICBiaXAzMjoge1xuICAgICAgcHVibGljOiAweDA0ODhiMjFlLFxuICAgICAgcHJpdmF0ZTogMHgwNDg4YWRlNFxuICAgIH0sXG4gICAgcHViS2V5SGFzaDogMHgwMCxcbiAgICBzY3JpcHRIYXNoOiAweDA1LFxuICAgIHdpZjogMHg4MFxuICB9LFxuICB0ZXN0bmV0OiB7XG4gICAgbWVzc2FnZVByZWZpeDogJ1xceDE4Qml0Y29pbiBTaWduZWQgTWVzc2FnZTpcXG4nLFxuICAgIGJlY2gzMjogJ3RiJyxcbiAgICBiaXAzMjoge1xuICAgICAgcHVibGljOiAweDA0MzU4N2NmLFxuICAgICAgcHJpdmF0ZTogMHgwNDM1ODM5NFxuICAgIH0sXG4gICAgcHViS2V5SGFzaDogMHg2ZixcbiAgICBzY3JpcHRIYXNoOiAweGM0LFxuICAgIHdpZjogMHhlZlxuICB9LFxuICBsaXRlY29pbjoge1xuICAgIG1lc3NhZ2VQcmVmaXg6ICdcXHgxOUxpdGVjb2luIFNpZ25lZCBNZXNzYWdlOlxcbicsXG4gICAgYmlwMzI6IHtcbiAgICAgIHB1YmxpYzogMHgwMTlkYTQ2MixcbiAgICAgIHByaXZhdGU6IDB4MDE5ZDljZmVcbiAgICB9LFxuICAgIHB1YktleUhhc2g6IDB4MzAsXG4gICAgc2NyaXB0SGFzaDogMHgzMixcbiAgICB3aWY6IDB4YjBcbiAgfVxufVxuIiwidmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgYmlwNjYgPSByZXF1aXJlKCdiaXA2NicpXG52YXIgcHVzaGRhdGEgPSByZXF1aXJlKCdwdXNoZGF0YS1iaXRjb2luJylcbnZhciB0eXBlZm9yY2UgPSByZXF1aXJlKCd0eXBlZm9yY2UnKVxudmFyIHR5cGVzID0gcmVxdWlyZSgnLi90eXBlcycpXG52YXIgc2NyaXB0TnVtYmVyID0gcmVxdWlyZSgnLi9zY3JpcHRfbnVtYmVyJylcblxudmFyIE9QUyA9IHJlcXVpcmUoJ2JpdGNvaW4tb3BzJylcbnZhciBSRVZFUlNFX09QUyA9IHJlcXVpcmUoJ2JpdGNvaW4tb3BzL21hcCcpXG52YXIgT1BfSU5UX0JBU0UgPSBPUFMuT1BfUkVTRVJWRUQgLy8gT1BfMSAtIDFcblxuZnVuY3Rpb24gaXNPUEludCAodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVzLk51bWJlcih2YWx1ZSkgJiZcbiAgICAoKHZhbHVlID09PSBPUFMuT1BfMCkgfHxcbiAgICAodmFsdWUgPj0gT1BTLk9QXzEgJiYgdmFsdWUgPD0gT1BTLk9QXzE2KSB8fFxuICAgICh2YWx1ZSA9PT0gT1BTLk9QXzFORUdBVEUpKVxufVxuXG5mdW5jdGlvbiBpc1B1c2hPbmx5Q2h1bmsgKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlcy5CdWZmZXIodmFsdWUpIHx8IGlzT1BJbnQodmFsdWUpXG59XG5cbmZ1bmN0aW9uIGlzUHVzaE9ubHkgKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlcy5BcnJheSh2YWx1ZSkgJiYgdmFsdWUuZXZlcnkoaXNQdXNoT25seUNodW5rKVxufVxuXG5mdW5jdGlvbiBhc01pbmltYWxPUCAoYnVmZmVyKSB7XG4gIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSByZXR1cm4gT1BTLk9QXzBcbiAgaWYgKGJ1ZmZlci5sZW5ndGggIT09IDEpIHJldHVyblxuICBpZiAoYnVmZmVyWzBdID49IDEgJiYgYnVmZmVyWzBdIDw9IDE2KSByZXR1cm4gT1BfSU5UX0JBU0UgKyBidWZmZXJbMF1cbiAgaWYgKGJ1ZmZlclswXSA9PT0gMHg4MSkgcmV0dXJuIE9QUy5PUF8xTkVHQVRFXG59XG5cbmZ1bmN0aW9uIGNvbXBpbGUgKGNodW5rcykge1xuICAvLyBUT0RPOiByZW1vdmUgbWVcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihjaHVua3MpKSByZXR1cm4gY2h1bmtzXG5cbiAgdHlwZWZvcmNlKHR5cGVzLkFycmF5LCBjaHVua3MpXG5cbiAgdmFyIGJ1ZmZlclNpemUgPSBjaHVua3MucmVkdWNlKGZ1bmN0aW9uIChhY2N1bSwgY2h1bmspIHtcbiAgICAvLyBkYXRhIGNodW5rXG4gICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihjaHVuaykpIHtcbiAgICAgIC8vIGFkaGVyZSB0byBCSVA2Mi4zLCBtaW5pbWFsIHB1c2ggcG9saWN5XG4gICAgICBpZiAoY2h1bmsubGVuZ3RoID09PSAxICYmIGFzTWluaW1hbE9QKGNodW5rKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBhY2N1bSArIDFcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFjY3VtICsgcHVzaGRhdGEuZW5jb2RpbmdMZW5ndGgoY2h1bmsubGVuZ3RoKSArIGNodW5rLmxlbmd0aFxuICAgIH1cblxuICAgIC8vIG9wY29kZVxuICAgIHJldHVybiBhY2N1bSArIDFcbiAgfSwgMC4wKVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUoYnVmZmVyU2l6ZSlcbiAgdmFyIG9mZnNldCA9IDBcblxuICBjaHVua3MuZm9yRWFjaChmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAvLyBkYXRhIGNodW5rXG4gICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihjaHVuaykpIHtcbiAgICAgIC8vIGFkaGVyZSB0byBCSVA2Mi4zLCBtaW5pbWFsIHB1c2ggcG9saWN5XG4gICAgICB2YXIgb3Bjb2RlID0gYXNNaW5pbWFsT1AoY2h1bmspXG4gICAgICBpZiAob3Bjb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgYnVmZmVyLndyaXRlVUludDgob3Bjb2RlLCBvZmZzZXQpXG4gICAgICAgIG9mZnNldCArPSAxXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBvZmZzZXQgKz0gcHVzaGRhdGEuZW5jb2RlKGJ1ZmZlciwgY2h1bmsubGVuZ3RoLCBvZmZzZXQpXG4gICAgICBjaHVuay5jb3B5KGJ1ZmZlciwgb2Zmc2V0KVxuICAgICAgb2Zmc2V0ICs9IGNodW5rLmxlbmd0aFxuXG4gICAgLy8gb3Bjb2RlXG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlci53cml0ZVVJbnQ4KGNodW5rLCBvZmZzZXQpXG4gICAgICBvZmZzZXQgKz0gMVxuICAgIH1cbiAgfSlcblxuICBpZiAob2Zmc2V0ICE9PSBidWZmZXIubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBkZWNvZGUgY2h1bmtzJylcbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBkZWNvbXBpbGUgKGJ1ZmZlcikge1xuICAvLyBUT0RPOiByZW1vdmUgbWVcbiAgaWYgKHR5cGVzLkFycmF5KGJ1ZmZlcikpIHJldHVybiBidWZmZXJcblxuICB0eXBlZm9yY2UodHlwZXMuQnVmZmVyLCBidWZmZXIpXG5cbiAgdmFyIGNodW5rcyA9IFtdXG4gIHZhciBpID0gMFxuXG4gIHdoaWxlIChpIDwgYnVmZmVyLmxlbmd0aCkge1xuICAgIHZhciBvcGNvZGUgPSBidWZmZXJbaV1cblxuICAgIC8vIGRhdGEgY2h1bmtcbiAgICBpZiAoKG9wY29kZSA+IE9QUy5PUF8wKSAmJiAob3Bjb2RlIDw9IE9QUy5PUF9QVVNIREFUQTQpKSB7XG4gICAgICB2YXIgZCA9IHB1c2hkYXRhLmRlY29kZShidWZmZXIsIGkpXG5cbiAgICAgIC8vIGRpZCByZWFkaW5nIGEgcHVzaERhdGFJbnQgZmFpbD8gZW1wdHkgc2NyaXB0XG4gICAgICBpZiAoZCA9PT0gbnVsbCkgcmV0dXJuIFtdXG4gICAgICBpICs9IGQuc2l6ZVxuXG4gICAgICAvLyBhdHRlbXB0IHRvIHJlYWQgdG9vIG11Y2ggZGF0YT8gZW1wdHkgc2NyaXB0XG4gICAgICBpZiAoaSArIGQubnVtYmVyID4gYnVmZmVyLmxlbmd0aCkgcmV0dXJuIFtdXG5cbiAgICAgIHZhciBkYXRhID0gYnVmZmVyLnNsaWNlKGksIGkgKyBkLm51bWJlcilcbiAgICAgIGkgKz0gZC5udW1iZXJcblxuICAgICAgLy8gZGVjb21waWxlIG1pbmltYWxseVxuICAgICAgdmFyIG9wID0gYXNNaW5pbWFsT1AoZGF0YSlcbiAgICAgIGlmIChvcCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNodW5rcy5wdXNoKG9wKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2h1bmtzLnB1c2goZGF0YSlcbiAgICAgIH1cblxuICAgIC8vIG9wY29kZVxuICAgIH0gZWxzZSB7XG4gICAgICBjaHVua3MucHVzaChvcGNvZGUpXG5cbiAgICAgIGkgKz0gMVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjaHVua3Ncbn1cblxuZnVuY3Rpb24gdG9BU00gKGNodW5rcykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKGNodW5rcykpIHtcbiAgICBjaHVua3MgPSBkZWNvbXBpbGUoY2h1bmtzKVxuICB9XG5cbiAgcmV0dXJuIGNodW5rcy5tYXAoZnVuY3Rpb24gKGNodW5rKSB7XG4gICAgLy8gZGF0YT9cbiAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKGNodW5rKSkge1xuICAgICAgdmFyIG9wID0gYXNNaW5pbWFsT1AoY2h1bmspXG4gICAgICBpZiAob3AgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGNodW5rLnRvU3RyaW5nKCdoZXgnKVxuICAgICAgY2h1bmsgPSBvcFxuICAgIH1cblxuICAgIC8vIG9wY29kZSFcbiAgICByZXR1cm4gUkVWRVJTRV9PUFNbY2h1bmtdXG4gIH0pLmpvaW4oJyAnKVxufVxuXG5mdW5jdGlvbiBmcm9tQVNNIChhc20pIHtcbiAgdHlwZWZvcmNlKHR5cGVzLlN0cmluZywgYXNtKVxuXG4gIHJldHVybiBjb21waWxlKGFzbS5zcGxpdCgnICcpLm1hcChmdW5jdGlvbiAoY2h1bmtTdHIpIHtcbiAgICAvLyBvcGNvZGU/XG4gICAgaWYgKE9QU1tjaHVua1N0cl0gIT09IHVuZGVmaW5lZCkgcmV0dXJuIE9QU1tjaHVua1N0cl1cbiAgICB0eXBlZm9yY2UodHlwZXMuSGV4LCBjaHVua1N0cilcblxuICAgIC8vIGRhdGEhXG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKGNodW5rU3RyLCAnaGV4JylcbiAgfSkpXG59XG5cbmZ1bmN0aW9uIHRvU3RhY2sgKGNodW5rcykge1xuICBjaHVua3MgPSBkZWNvbXBpbGUoY2h1bmtzKVxuICB0eXBlZm9yY2UoaXNQdXNoT25seSwgY2h1bmtzKVxuXG4gIHJldHVybiBjaHVua3MubWFwKGZ1bmN0aW9uIChvcCkge1xuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIob3ApKSByZXR1cm4gb3BcbiAgICBpZiAob3AgPT09IE9QUy5PUF8wKSByZXR1cm4gQnVmZmVyLmFsbG9jVW5zYWZlKDApXG5cbiAgICByZXR1cm4gc2NyaXB0TnVtYmVyLmVuY29kZShvcCAtIE9QX0lOVF9CQVNFKVxuICB9KVxufVxuXG5mdW5jdGlvbiBpc0Nhbm9uaWNhbFB1YktleSAoYnVmZmVyKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZmZlcikpIHJldHVybiBmYWxzZVxuICBpZiAoYnVmZmVyLmxlbmd0aCA8IDMzKSByZXR1cm4gZmFsc2VcblxuICBzd2l0Y2ggKGJ1ZmZlclswXSkge1xuICAgIGNhc2UgMHgwMjpcbiAgICBjYXNlIDB4MDM6XG4gICAgICByZXR1cm4gYnVmZmVyLmxlbmd0aCA9PT0gMzNcbiAgICBjYXNlIDB4MDQ6XG4gICAgICByZXR1cm4gYnVmZmVyLmxlbmd0aCA9PT0gNjVcbiAgfVxuXG4gIHJldHVybiBmYWxzZVxufVxuXG5mdW5jdGlvbiBpc0RlZmluZWRIYXNoVHlwZSAoaGFzaFR5cGUpIHtcbiAgdmFyIGhhc2hUeXBlTW9kID0gaGFzaFR5cGUgJiB+MHg4MFxuXG4vLyByZXR1cm4gaGFzaFR5cGVNb2QgPiBTSUdIQVNIX0FMTCAmJiBoYXNoVHlwZU1vZCA8IFNJR0hBU0hfU0lOR0xFXG4gIHJldHVybiBoYXNoVHlwZU1vZCA+IDB4MDAgJiYgaGFzaFR5cGVNb2QgPCAweDA0XG59XG5cbmZ1bmN0aW9uIGlzQ2Fub25pY2FsU2lnbmF0dXJlIChidWZmZXIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmZmVyKSkgcmV0dXJuIGZhbHNlXG4gIGlmICghaXNEZWZpbmVkSGFzaFR5cGUoYnVmZmVyW2J1ZmZlci5sZW5ndGggLSAxXSkpIHJldHVybiBmYWxzZVxuXG4gIHJldHVybiBiaXA2Ni5jaGVjayhidWZmZXIuc2xpY2UoMCwgLTEpKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY29tcGlsZTogY29tcGlsZSxcbiAgZGVjb21waWxlOiBkZWNvbXBpbGUsXG4gIGZyb21BU006IGZyb21BU00sXG4gIHRvQVNNOiB0b0FTTSxcbiAgdG9TdGFjazogdG9TdGFjayxcblxuICBudW1iZXI6IHJlcXVpcmUoJy4vc2NyaXB0X251bWJlcicpLFxuXG4gIGlzQ2Fub25pY2FsUHViS2V5OiBpc0Nhbm9uaWNhbFB1YktleSxcbiAgaXNDYW5vbmljYWxTaWduYXR1cmU6IGlzQ2Fub25pY2FsU2lnbmF0dXJlLFxuICBpc1B1c2hPbmx5OiBpc1B1c2hPbmx5LFxuICBpc0RlZmluZWRIYXNoVHlwZTogaXNEZWZpbmVkSGFzaFR5cGVcbn1cbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxuXG5mdW5jdGlvbiBkZWNvZGUgKGJ1ZmZlciwgbWF4TGVuZ3RoLCBtaW5pbWFsKSB7XG4gIG1heExlbmd0aCA9IG1heExlbmd0aCB8fCA0XG4gIG1pbmltYWwgPSBtaW5pbWFsID09PSB1bmRlZmluZWQgPyB0cnVlIDogbWluaW1hbFxuXG4gIHZhciBsZW5ndGggPSBidWZmZXIubGVuZ3RoXG4gIGlmIChsZW5ndGggPT09IDApIHJldHVybiAwXG4gIGlmIChsZW5ndGggPiBtYXhMZW5ndGgpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1NjcmlwdCBudW1iZXIgb3ZlcmZsb3cnKVxuICBpZiAobWluaW1hbCkge1xuICAgIGlmICgoYnVmZmVyW2xlbmd0aCAtIDFdICYgMHg3ZikgPT09IDApIHtcbiAgICAgIGlmIChsZW5ndGggPD0gMSB8fCAoYnVmZmVyW2xlbmd0aCAtIDJdICYgMHg4MCkgPT09IDApIHRocm93IG5ldyBFcnJvcignTm9uLW1pbmltYWxseSBlbmNvZGVkIHNjcmlwdCBudW1iZXInKVxuICAgIH1cbiAgfVxuXG4gIC8vIDQwLWJpdFxuICBpZiAobGVuZ3RoID09PSA1KSB7XG4gICAgdmFyIGEgPSBidWZmZXIucmVhZFVJbnQzMkxFKDApXG4gICAgdmFyIGIgPSBidWZmZXIucmVhZFVJbnQ4KDQpXG5cbiAgICBpZiAoYiAmIDB4ODApIHJldHVybiAtKCgoYiAmIH4weDgwKSAqIDB4MTAwMDAwMDAwKSArIGEpXG4gICAgcmV0dXJuIChiICogMHgxMDAwMDAwMDApICsgYVxuICB9XG5cbiAgdmFyIHJlc3VsdCA9IDBcblxuICAvLyAzMi1iaXQgLyAyNC1iaXQgLyAxNi1iaXQgLyA4LWJpdFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgcmVzdWx0IHw9IGJ1ZmZlcltpXSA8PCAoOCAqIGkpXG4gIH1cblxuICBpZiAoYnVmZmVyW2xlbmd0aCAtIDFdICYgMHg4MCkgcmV0dXJuIC0ocmVzdWx0ICYgfigweDgwIDw8ICg4ICogKGxlbmd0aCAtIDEpKSkpXG4gIHJldHVybiByZXN1bHRcbn1cblxuZnVuY3Rpb24gc2NyaXB0TnVtU2l6ZSAoaSkge1xuICByZXR1cm4gaSA+IDB4N2ZmZmZmZmYgPyA1XG4gIDogaSA+IDB4N2ZmZmZmID8gNFxuICA6IGkgPiAweDdmZmYgPyAzXG4gIDogaSA+IDB4N2YgPyAyXG4gIDogaSA+IDB4MDAgPyAxXG4gIDogMFxufVxuXG5mdW5jdGlvbiBlbmNvZGUgKG51bWJlcikge1xuICB2YXIgdmFsdWUgPSBNYXRoLmFicyhudW1iZXIpXG4gIHZhciBzaXplID0gc2NyaXB0TnVtU2l6ZSh2YWx1ZSlcbiAgdmFyIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShzaXplKVxuICB2YXIgbmVnYXRpdmUgPSBudW1iZXIgPCAwXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaXplOyArK2kpIHtcbiAgICBidWZmZXIud3JpdGVVSW50OCh2YWx1ZSAmIDB4ZmYsIGkpXG4gICAgdmFsdWUgPj49IDhcbiAgfVxuXG4gIGlmIChidWZmZXJbc2l6ZSAtIDFdICYgMHg4MCkge1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KG5lZ2F0aXZlID8gMHg4MCA6IDB4MDAsIHNpemUgLSAxKVxuICB9IGVsc2UgaWYgKG5lZ2F0aXZlKSB7XG4gICAgYnVmZmVyW3NpemUgLSAxXSB8PSAweDgwXG4gIH1cblxuICByZXR1cm4gYnVmZmVyXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBkZWNvZGU6IGRlY29kZSxcbiAgZW5jb2RlOiBlbmNvZGVcbn1cbiIsInZhciBkZWNvbXBpbGUgPSByZXF1aXJlKCcuLi9zY3JpcHQnKS5kZWNvbXBpbGVcbnZhciBtdWx0aXNpZyA9IHJlcXVpcmUoJy4vbXVsdGlzaWcnKVxudmFyIG51bGxEYXRhID0gcmVxdWlyZSgnLi9udWxsZGF0YScpXG52YXIgcHViS2V5ID0gcmVxdWlyZSgnLi9wdWJrZXknKVxudmFyIHB1YktleUhhc2ggPSByZXF1aXJlKCcuL3B1YmtleWhhc2gnKVxudmFyIHNjcmlwdEhhc2ggPSByZXF1aXJlKCcuL3NjcmlwdGhhc2gnKVxudmFyIHdpdG5lc3NQdWJLZXlIYXNoID0gcmVxdWlyZSgnLi93aXRuZXNzcHVia2V5aGFzaCcpXG52YXIgd2l0bmVzc1NjcmlwdEhhc2ggPSByZXF1aXJlKCcuL3dpdG5lc3NzY3JpcHRoYXNoJylcbnZhciB3aXRuZXNzQ29tbWl0bWVudCA9IHJlcXVpcmUoJy4vd2l0bmVzc2NvbW1pdG1lbnQnKVxuXG52YXIgdHlwZXMgPSB7XG4gIE1VTFRJU0lHOiAnbXVsdGlzaWcnLFxuICBOT05TVEFOREFSRDogJ25vbnN0YW5kYXJkJyxcbiAgTlVMTERBVEE6ICdudWxsZGF0YScsXG4gIFAyUEs6ICdwdWJrZXknLFxuICBQMlBLSDogJ3B1YmtleWhhc2gnLFxuICBQMlNIOiAnc2NyaXB0aGFzaCcsXG4gIFAyV1BLSDogJ3dpdG5lc3NwdWJrZXloYXNoJyxcbiAgUDJXU0g6ICd3aXRuZXNzc2NyaXB0aGFzaCcsXG4gIFdJVE5FU1NfQ09NTUlUTUVOVDogJ3dpdG5lc3Njb21taXRtZW50J1xufVxuXG5mdW5jdGlvbiBjbGFzc2lmeU91dHB1dCAoc2NyaXB0KSB7XG4gIGlmICh3aXRuZXNzUHViS2V5SGFzaC5vdXRwdXQuY2hlY2soc2NyaXB0KSkgcmV0dXJuIHR5cGVzLlAyV1BLSFxuICBpZiAod2l0bmVzc1NjcmlwdEhhc2gub3V0cHV0LmNoZWNrKHNjcmlwdCkpIHJldHVybiB0eXBlcy5QMldTSFxuICBpZiAocHViS2V5SGFzaC5vdXRwdXQuY2hlY2soc2NyaXB0KSkgcmV0dXJuIHR5cGVzLlAyUEtIXG4gIGlmIChzY3JpcHRIYXNoLm91dHB1dC5jaGVjayhzY3JpcHQpKSByZXR1cm4gdHlwZXMuUDJTSFxuXG4gIC8vIFhYWDogb3B0aW1pemF0aW9uLCBiZWxvdyBmdW5jdGlvbnMgLmRlY29tcGlsZSBiZWZvcmUgdXNlXG4gIHZhciBjaHVua3MgPSBkZWNvbXBpbGUoc2NyaXB0KVxuICBpZiAobXVsdGlzaWcub3V0cHV0LmNoZWNrKGNodW5rcykpIHJldHVybiB0eXBlcy5NVUxUSVNJR1xuICBpZiAocHViS2V5Lm91dHB1dC5jaGVjayhjaHVua3MpKSByZXR1cm4gdHlwZXMuUDJQS1xuICBpZiAod2l0bmVzc0NvbW1pdG1lbnQub3V0cHV0LmNoZWNrKGNodW5rcykpIHJldHVybiB0eXBlcy5XSVRORVNTX0NPTU1JVE1FTlRcbiAgaWYgKG51bGxEYXRhLm91dHB1dC5jaGVjayhjaHVua3MpKSByZXR1cm4gdHlwZXMuTlVMTERBVEFcblxuICByZXR1cm4gdHlwZXMuTk9OU1RBTkRBUkRcbn1cblxuZnVuY3Rpb24gY2xhc3NpZnlJbnB1dCAoc2NyaXB0LCBhbGxvd0luY29tcGxldGUpIHtcbiAgLy8gWFhYOiBvcHRpbWl6YXRpb24sIGJlbG93IGZ1bmN0aW9ucyAuZGVjb21waWxlIGJlZm9yZSB1c2VcbiAgdmFyIGNodW5rcyA9IGRlY29tcGlsZShzY3JpcHQpXG5cbiAgaWYgKHB1YktleUhhc2guaW5wdXQuY2hlY2soY2h1bmtzKSkgcmV0dXJuIHR5cGVzLlAyUEtIXG4gIGlmIChzY3JpcHRIYXNoLmlucHV0LmNoZWNrKGNodW5rcywgYWxsb3dJbmNvbXBsZXRlKSkgcmV0dXJuIHR5cGVzLlAyU0hcbiAgaWYgKG11bHRpc2lnLmlucHV0LmNoZWNrKGNodW5rcywgYWxsb3dJbmNvbXBsZXRlKSkgcmV0dXJuIHR5cGVzLk1VTFRJU0lHXG4gIGlmIChwdWJLZXkuaW5wdXQuY2hlY2soY2h1bmtzKSkgcmV0dXJuIHR5cGVzLlAyUEtcblxuICByZXR1cm4gdHlwZXMuTk9OU1RBTkRBUkRcbn1cblxuZnVuY3Rpb24gY2xhc3NpZnlXaXRuZXNzIChzY3JpcHQsIGFsbG93SW5jb21wbGV0ZSkge1xuICAvLyBYWFg6IG9wdGltaXphdGlvbiwgYmVsb3cgZnVuY3Rpb25zIC5kZWNvbXBpbGUgYmVmb3JlIHVzZVxuICB2YXIgY2h1bmtzID0gZGVjb21waWxlKHNjcmlwdClcblxuICBpZiAod2l0bmVzc1B1YktleUhhc2guaW5wdXQuY2hlY2soY2h1bmtzKSkgcmV0dXJuIHR5cGVzLlAyV1BLSFxuICBpZiAod2l0bmVzc1NjcmlwdEhhc2guaW5wdXQuY2hlY2soY2h1bmtzLCBhbGxvd0luY29tcGxldGUpKSByZXR1cm4gdHlwZXMuUDJXU0hcblxuICByZXR1cm4gdHlwZXMuTk9OU1RBTkRBUkRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNsYXNzaWZ5SW5wdXQ6IGNsYXNzaWZ5SW5wdXQsXG4gIGNsYXNzaWZ5T3V0cHV0OiBjbGFzc2lmeU91dHB1dCxcbiAgY2xhc3NpZnlXaXRuZXNzOiBjbGFzc2lmeVdpdG5lc3MsXG4gIG11bHRpc2lnOiBtdWx0aXNpZyxcbiAgbnVsbERhdGE6IG51bGxEYXRhLFxuICBwdWJLZXk6IHB1YktleSxcbiAgcHViS2V5SGFzaDogcHViS2V5SGFzaCxcbiAgc2NyaXB0SGFzaDogc2NyaXB0SGFzaCxcbiAgd2l0bmVzc1B1YktleUhhc2g6IHdpdG5lc3NQdWJLZXlIYXNoLFxuICB3aXRuZXNzU2NyaXB0SGFzaDogd2l0bmVzc1NjcmlwdEhhc2gsXG4gIHdpdG5lc3NDb21taXRtZW50OiB3aXRuZXNzQ29tbWl0bWVudCxcbiAgdHlwZXM6IHR5cGVzXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5wdXQ6IHJlcXVpcmUoJy4vaW5wdXQnKSxcbiAgb3V0cHV0OiByZXF1aXJlKCcuL291dHB1dCcpXG59XG4iLCIvLyBPUF8wIFtzaWduYXR1cmVzIC4uLl1cblxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgYnNjcmlwdCA9IHJlcXVpcmUoJy4uLy4uL3NjcmlwdCcpXG52YXIgcDJtc28gPSByZXF1aXJlKCcuL291dHB1dCcpXG52YXIgdHlwZWZvcmNlID0gcmVxdWlyZSgndHlwZWZvcmNlJylcbnZhciBPUFMgPSByZXF1aXJlKCdiaXRjb2luLW9wcycpXG5cbmZ1bmN0aW9uIHBhcnRpYWxTaWduYXR1cmUgKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gT1BTLk9QXzAgfHwgYnNjcmlwdC5pc0Nhbm9uaWNhbFNpZ25hdHVyZSh2YWx1ZSlcbn1cblxuZnVuY3Rpb24gY2hlY2sgKHNjcmlwdCwgYWxsb3dJbmNvbXBsZXRlKSB7XG4gIHZhciBjaHVua3MgPSBic2NyaXB0LmRlY29tcGlsZShzY3JpcHQpXG4gIGlmIChjaHVua3MubGVuZ3RoIDwgMikgcmV0dXJuIGZhbHNlXG4gIGlmIChjaHVua3NbMF0gIT09IE9QUy5PUF8wKSByZXR1cm4gZmFsc2VcblxuICBpZiAoYWxsb3dJbmNvbXBsZXRlKSB7XG4gICAgcmV0dXJuIGNodW5rcy5zbGljZSgxKS5ldmVyeShwYXJ0aWFsU2lnbmF0dXJlKVxuICB9XG5cbiAgcmV0dXJuIGNodW5rcy5zbGljZSgxKS5ldmVyeShic2NyaXB0LmlzQ2Fub25pY2FsU2lnbmF0dXJlKVxufVxuY2hlY2sudG9KU09OID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ211bHRpc2lnIGlucHV0JyB9XG5cbnZhciBFTVBUWV9CVUZGRVIgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMClcblxuZnVuY3Rpb24gZW5jb2RlU3RhY2sgKHNpZ25hdHVyZXMsIHNjcmlwdFB1YktleSkge1xuICB0eXBlZm9yY2UoW3BhcnRpYWxTaWduYXR1cmVdLCBzaWduYXR1cmVzKVxuXG4gIGlmIChzY3JpcHRQdWJLZXkpIHtcbiAgICB2YXIgc2NyaXB0RGF0YSA9IHAybXNvLmRlY29kZShzY3JpcHRQdWJLZXkpXG5cbiAgICBpZiAoc2lnbmF0dXJlcy5sZW5ndGggPCBzY3JpcHREYXRhLm0pIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vdCBlbm91Z2ggc2lnbmF0dXJlcyBwcm92aWRlZCcpXG4gICAgfVxuXG4gICAgaWYgKHNpZ25hdHVyZXMubGVuZ3RoID4gc2NyaXB0RGF0YS5wdWJLZXlzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVG9vIG1hbnkgc2lnbmF0dXJlcyBwcm92aWRlZCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIFtdLmNvbmNhdChFTVBUWV9CVUZGRVIsIHNpZ25hdHVyZXMubWFwKGZ1bmN0aW9uIChzaWcpIHtcbiAgICBpZiAoc2lnID09PSBPUFMuT1BfMCkge1xuICAgICAgcmV0dXJuIEVNUFRZX0JVRkZFUlxuICAgIH1cbiAgICByZXR1cm4gc2lnXG4gIH0pKVxufVxuXG5mdW5jdGlvbiBlbmNvZGUgKHNpZ25hdHVyZXMsIHNjcmlwdFB1YktleSkge1xuICByZXR1cm4gYnNjcmlwdC5jb21waWxlKGVuY29kZVN0YWNrKHNpZ25hdHVyZXMsIHNjcmlwdFB1YktleSkpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVN0YWNrIChzdGFjaywgYWxsb3dJbmNvbXBsZXRlKSB7XG4gIHR5cGVmb3JjZSh0eXBlZm9yY2UuQXJyYXksIHN0YWNrKVxuICB0eXBlZm9yY2UoY2hlY2ssIHN0YWNrLCBhbGxvd0luY29tcGxldGUpXG4gIHJldHVybiBzdGFjay5zbGljZSgxKVxufVxuXG5mdW5jdGlvbiBkZWNvZGUgKGJ1ZmZlciwgYWxsb3dJbmNvbXBsZXRlKSB7XG4gIHZhciBzdGFjayA9IGJzY3JpcHQuZGVjb21waWxlKGJ1ZmZlcilcbiAgcmV0dXJuIGRlY29kZVN0YWNrKHN0YWNrLCBhbGxvd0luY29tcGxldGUpXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVjazogY2hlY2ssXG4gIGRlY29kZTogZGVjb2RlLFxuICBkZWNvZGVTdGFjazogZGVjb2RlU3RhY2ssXG4gIGVuY29kZTogZW5jb2RlLFxuICBlbmNvZGVTdGFjazogZW5jb2RlU3RhY2tcbn1cbiIsIi8vIG0gW3B1YktleXMgLi4uXSBuIE9QX0NIRUNLTVVMVElTSUdcblxudmFyIGJzY3JpcHQgPSByZXF1aXJlKCcuLi8uLi9zY3JpcHQnKVxudmFyIHR5cGVzID0gcmVxdWlyZSgnLi4vLi4vdHlwZXMnKVxudmFyIHR5cGVmb3JjZSA9IHJlcXVpcmUoJ3R5cGVmb3JjZScpXG52YXIgT1BTID0gcmVxdWlyZSgnYml0Y29pbi1vcHMnKVxudmFyIE9QX0lOVF9CQVNFID0gT1BTLk9QX1JFU0VSVkVEIC8vIE9QXzEgLSAxXG5cbmZ1bmN0aW9uIGNoZWNrIChzY3JpcHQsIGFsbG93SW5jb21wbGV0ZSkge1xuICB2YXIgY2h1bmtzID0gYnNjcmlwdC5kZWNvbXBpbGUoc2NyaXB0KVxuXG4gIGlmIChjaHVua3MubGVuZ3RoIDwgNCkgcmV0dXJuIGZhbHNlXG4gIGlmIChjaHVua3NbY2h1bmtzLmxlbmd0aCAtIDFdICE9PSBPUFMuT1BfQ0hFQ0tNVUxUSVNJRykgcmV0dXJuIGZhbHNlXG4gIGlmICghdHlwZXMuTnVtYmVyKGNodW5rc1swXSkpIHJldHVybiBmYWxzZVxuICBpZiAoIXR5cGVzLk51bWJlcihjaHVua3NbY2h1bmtzLmxlbmd0aCAtIDJdKSkgcmV0dXJuIGZhbHNlXG4gIHZhciBtID0gY2h1bmtzWzBdIC0gT1BfSU5UX0JBU0VcbiAgdmFyIG4gPSBjaHVua3NbY2h1bmtzLmxlbmd0aCAtIDJdIC0gT1BfSU5UX0JBU0VcblxuICBpZiAobSA8PSAwKSByZXR1cm4gZmFsc2VcbiAgaWYgKG4gPiAxNikgcmV0dXJuIGZhbHNlXG4gIGlmIChtID4gbikgcmV0dXJuIGZhbHNlXG4gIGlmIChuICE9PSBjaHVua3MubGVuZ3RoIC0gMykgcmV0dXJuIGZhbHNlXG4gIGlmIChhbGxvd0luY29tcGxldGUpIHJldHVybiB0cnVlXG5cbiAgdmFyIGtleXMgPSBjaHVua3Muc2xpY2UoMSwgLTIpXG4gIHJldHVybiBrZXlzLmV2ZXJ5KGJzY3JpcHQuaXNDYW5vbmljYWxQdWJLZXkpXG59XG5jaGVjay50b0pTT04gPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnbXVsdGktc2lnIG91dHB1dCcgfVxuXG5mdW5jdGlvbiBlbmNvZGUgKG0sIHB1YktleXMpIHtcbiAgdHlwZWZvcmNlKHtcbiAgICBtOiB0eXBlcy5OdW1iZXIsXG4gICAgcHViS2V5czogW2JzY3JpcHQuaXNDYW5vbmljYWxQdWJLZXldXG4gIH0sIHtcbiAgICBtOiBtLFxuICAgIHB1YktleXM6IHB1YktleXNcbiAgfSlcblxuICB2YXIgbiA9IHB1YktleXMubGVuZ3RoXG4gIGlmIChuIDwgbSkgdGhyb3cgbmV3IFR5cGVFcnJvcignTm90IGVub3VnaCBwdWJLZXlzIHByb3ZpZGVkJylcblxuICByZXR1cm4gYnNjcmlwdC5jb21waWxlKFtdLmNvbmNhdChcbiAgICBPUF9JTlRfQkFTRSArIG0sXG4gICAgcHViS2V5cyxcbiAgICBPUF9JTlRfQkFTRSArIG4sXG4gICAgT1BTLk9QX0NIRUNLTVVMVElTSUdcbiAgKSlcbn1cblxuZnVuY3Rpb24gZGVjb2RlIChidWZmZXIsIGFsbG93SW5jb21wbGV0ZSkge1xuICB2YXIgY2h1bmtzID0gYnNjcmlwdC5kZWNvbXBpbGUoYnVmZmVyKVxuICB0eXBlZm9yY2UoY2hlY2ssIGNodW5rcywgYWxsb3dJbmNvbXBsZXRlKVxuXG4gIHJldHVybiB7XG4gICAgbTogY2h1bmtzWzBdIC0gT1BfSU5UX0JBU0UsXG4gICAgcHViS2V5czogY2h1bmtzLnNsaWNlKDEsIC0yKVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVjazogY2hlY2ssXG4gIGRlY29kZTogZGVjb2RlLFxuICBlbmNvZGU6IGVuY29kZVxufVxuIiwiLy8gT1BfUkVUVVJOIHtkYXRhfVxuXG52YXIgYnNjcmlwdCA9IHJlcXVpcmUoJy4uL3NjcmlwdCcpXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuLi90eXBlcycpXG52YXIgdHlwZWZvcmNlID0gcmVxdWlyZSgndHlwZWZvcmNlJylcbnZhciBPUFMgPSByZXF1aXJlKCdiaXRjb2luLW9wcycpXG5cbmZ1bmN0aW9uIGNoZWNrIChzY3JpcHQpIHtcbiAgdmFyIGJ1ZmZlciA9IGJzY3JpcHQuY29tcGlsZShzY3JpcHQpXG5cbiAgcmV0dXJuIGJ1ZmZlci5sZW5ndGggPiAxICYmXG4gICAgYnVmZmVyWzBdID09PSBPUFMuT1BfUkVUVVJOXG59XG5jaGVjay50b0pTT04gPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnbnVsbCBkYXRhIG91dHB1dCcgfVxuXG5mdW5jdGlvbiBlbmNvZGUgKGRhdGEpIHtcbiAgdHlwZWZvcmNlKHR5cGVzLkJ1ZmZlciwgZGF0YSlcblxuICByZXR1cm4gYnNjcmlwdC5jb21waWxlKFtPUFMuT1BfUkVUVVJOLCBkYXRhXSlcbn1cblxuZnVuY3Rpb24gZGVjb2RlIChidWZmZXIpIHtcbiAgdHlwZWZvcmNlKGNoZWNrLCBidWZmZXIpXG5cbiAgcmV0dXJuIGJ1ZmZlci5zbGljZSgyKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgb3V0cHV0OiB7XG4gICAgY2hlY2s6IGNoZWNrLFxuICAgIGRlY29kZTogZGVjb2RlLFxuICAgIGVuY29kZTogZW5jb2RlXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBpbnB1dDogcmVxdWlyZSgnLi9pbnB1dCcpLFxuICBvdXRwdXQ6IHJlcXVpcmUoJy4vb3V0cHV0Jylcbn1cbiIsIi8vIHtzaWduYXR1cmV9XG5cbnZhciBic2NyaXB0ID0gcmVxdWlyZSgnLi4vLi4vc2NyaXB0JylcbnZhciB0eXBlZm9yY2UgPSByZXF1aXJlKCd0eXBlZm9yY2UnKVxuXG5mdW5jdGlvbiBjaGVjayAoc2NyaXB0KSB7XG4gIHZhciBjaHVua3MgPSBic2NyaXB0LmRlY29tcGlsZShzY3JpcHQpXG5cbiAgcmV0dXJuIGNodW5rcy5sZW5ndGggPT09IDEgJiZcbiAgICBic2NyaXB0LmlzQ2Fub25pY2FsU2lnbmF0dXJlKGNodW5rc1swXSlcbn1cbmNoZWNrLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdwdWJLZXkgaW5wdXQnIH1cblxuZnVuY3Rpb24gZW5jb2RlU3RhY2sgKHNpZ25hdHVyZSkge1xuICB0eXBlZm9yY2UoYnNjcmlwdC5pc0Nhbm9uaWNhbFNpZ25hdHVyZSwgc2lnbmF0dXJlKVxuICByZXR1cm4gW3NpZ25hdHVyZV1cbn1cblxuZnVuY3Rpb24gZW5jb2RlIChzaWduYXR1cmUpIHtcbiAgcmV0dXJuIGJzY3JpcHQuY29tcGlsZShlbmNvZGVTdGFjayhzaWduYXR1cmUpKVxufVxuXG5mdW5jdGlvbiBkZWNvZGVTdGFjayAoc3RhY2spIHtcbiAgdHlwZWZvcmNlKHR5cGVmb3JjZS5BcnJheSwgc3RhY2spXG4gIHR5cGVmb3JjZShjaGVjaywgc3RhY2spXG4gIHJldHVybiBzdGFja1swXVxufVxuXG5mdW5jdGlvbiBkZWNvZGUgKGJ1ZmZlcikge1xuICB2YXIgc3RhY2sgPSBic2NyaXB0LmRlY29tcGlsZShidWZmZXIpXG4gIHJldHVybiBkZWNvZGVTdGFjayhzdGFjaylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrOiBjaGVjayxcbiAgZGVjb2RlOiBkZWNvZGUsXG4gIGRlY29kZVN0YWNrOiBkZWNvZGVTdGFjayxcbiAgZW5jb2RlOiBlbmNvZGUsXG4gIGVuY29kZVN0YWNrOiBlbmNvZGVTdGFja1xufVxuIiwiLy8ge3B1YktleX0gT1BfQ0hFQ0tTSUdcblxudmFyIGJzY3JpcHQgPSByZXF1aXJlKCcuLi8uLi9zY3JpcHQnKVxudmFyIHR5cGVmb3JjZSA9IHJlcXVpcmUoJ3R5cGVmb3JjZScpXG52YXIgT1BTID0gcmVxdWlyZSgnYml0Y29pbi1vcHMnKVxuXG5mdW5jdGlvbiBjaGVjayAoc2NyaXB0KSB7XG4gIHZhciBjaHVua3MgPSBic2NyaXB0LmRlY29tcGlsZShzY3JpcHQpXG5cbiAgcmV0dXJuIGNodW5rcy5sZW5ndGggPT09IDIgJiZcbiAgICBic2NyaXB0LmlzQ2Fub25pY2FsUHViS2V5KGNodW5rc1swXSkgJiZcbiAgICBjaHVua3NbMV0gPT09IE9QUy5PUF9DSEVDS1NJR1xufVxuY2hlY2sudG9KU09OID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ3B1YktleSBvdXRwdXQnIH1cblxuZnVuY3Rpb24gZW5jb2RlIChwdWJLZXkpIHtcbiAgdHlwZWZvcmNlKGJzY3JpcHQuaXNDYW5vbmljYWxQdWJLZXksIHB1YktleSlcblxuICByZXR1cm4gYnNjcmlwdC5jb21waWxlKFtwdWJLZXksIE9QUy5PUF9DSEVDS1NJR10pXG59XG5cbmZ1bmN0aW9uIGRlY29kZSAoYnVmZmVyKSB7XG4gIHZhciBjaHVua3MgPSBic2NyaXB0LmRlY29tcGlsZShidWZmZXIpXG4gIHR5cGVmb3JjZShjaGVjaywgY2h1bmtzKVxuXG4gIHJldHVybiBjaHVua3NbMF1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrOiBjaGVjayxcbiAgZGVjb2RlOiBkZWNvZGUsXG4gIGVuY29kZTogZW5jb2RlXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5wdXQ6IHJlcXVpcmUoJy4vaW5wdXQnKSxcbiAgb3V0cHV0OiByZXF1aXJlKCcuL291dHB1dCcpXG59XG4iLCIvLyB7c2lnbmF0dXJlfSB7cHViS2V5fVxuXG52YXIgYnNjcmlwdCA9IHJlcXVpcmUoJy4uLy4uL3NjcmlwdCcpXG52YXIgdHlwZWZvcmNlID0gcmVxdWlyZSgndHlwZWZvcmNlJylcblxuZnVuY3Rpb24gY2hlY2sgKHNjcmlwdCkge1xuICB2YXIgY2h1bmtzID0gYnNjcmlwdC5kZWNvbXBpbGUoc2NyaXB0KVxuXG4gIHJldHVybiBjaHVua3MubGVuZ3RoID09PSAyICYmXG4gICAgYnNjcmlwdC5pc0Nhbm9uaWNhbFNpZ25hdHVyZShjaHVua3NbMF0pICYmXG4gICAgYnNjcmlwdC5pc0Nhbm9uaWNhbFB1YktleShjaHVua3NbMV0pXG59XG5jaGVjay50b0pTT04gPSBmdW5jdGlvbiAoKSB7IHJldHVybiAncHViS2V5SGFzaCBpbnB1dCcgfVxuXG5mdW5jdGlvbiBlbmNvZGVTdGFjayAoc2lnbmF0dXJlLCBwdWJLZXkpIHtcbiAgdHlwZWZvcmNlKHtcbiAgICBzaWduYXR1cmU6IGJzY3JpcHQuaXNDYW5vbmljYWxTaWduYXR1cmUsXG4gICAgcHViS2V5OiBic2NyaXB0LmlzQ2Fub25pY2FsUHViS2V5XG4gIH0sIHtcbiAgICBzaWduYXR1cmU6IHNpZ25hdHVyZSxcbiAgICBwdWJLZXk6IHB1YktleVxuICB9KVxuXG4gIHJldHVybiBbc2lnbmF0dXJlLCBwdWJLZXldXG59XG5cbmZ1bmN0aW9uIGVuY29kZSAoc2lnbmF0dXJlLCBwdWJLZXkpIHtcbiAgcmV0dXJuIGJzY3JpcHQuY29tcGlsZShlbmNvZGVTdGFjayhzaWduYXR1cmUsIHB1YktleSkpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVN0YWNrIChzdGFjaykge1xuICB0eXBlZm9yY2UodHlwZWZvcmNlLkFycmF5LCBzdGFjaylcbiAgdHlwZWZvcmNlKGNoZWNrLCBzdGFjaylcblxuICByZXR1cm4ge1xuICAgIHNpZ25hdHVyZTogc3RhY2tbMF0sXG4gICAgcHViS2V5OiBzdGFja1sxXVxuICB9XG59XG5cbmZ1bmN0aW9uIGRlY29kZSAoYnVmZmVyKSB7XG4gIHZhciBzdGFjayA9IGJzY3JpcHQuZGVjb21waWxlKGJ1ZmZlcilcbiAgcmV0dXJuIGRlY29kZVN0YWNrKHN0YWNrKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2s6IGNoZWNrLFxuICBkZWNvZGU6IGRlY29kZSxcbiAgZGVjb2RlU3RhY2s6IGRlY29kZVN0YWNrLFxuICBlbmNvZGU6IGVuY29kZSxcbiAgZW5jb2RlU3RhY2s6IGVuY29kZVN0YWNrXG59XG4iLCIvLyBPUF9EVVAgT1BfSEFTSDE2MCB7cHViS2V5SGFzaH0gT1BfRVFVQUxWRVJJRlkgT1BfQ0hFQ0tTSUdcblxudmFyIGJzY3JpcHQgPSByZXF1aXJlKCcuLi8uLi9zY3JpcHQnKVxudmFyIHR5cGVzID0gcmVxdWlyZSgnLi4vLi4vdHlwZXMnKVxudmFyIHR5cGVmb3JjZSA9IHJlcXVpcmUoJ3R5cGVmb3JjZScpXG52YXIgT1BTID0gcmVxdWlyZSgnYml0Y29pbi1vcHMnKVxuXG5mdW5jdGlvbiBjaGVjayAoc2NyaXB0KSB7XG4gIHZhciBidWZmZXIgPSBic2NyaXB0LmNvbXBpbGUoc2NyaXB0KVxuXG4gIHJldHVybiBidWZmZXIubGVuZ3RoID09PSAyNSAmJlxuICAgIGJ1ZmZlclswXSA9PT0gT1BTLk9QX0RVUCAmJlxuICAgIGJ1ZmZlclsxXSA9PT0gT1BTLk9QX0hBU0gxNjAgJiZcbiAgICBidWZmZXJbMl0gPT09IDB4MTQgJiZcbiAgICBidWZmZXJbMjNdID09PSBPUFMuT1BfRVFVQUxWRVJJRlkgJiZcbiAgICBidWZmZXJbMjRdID09PSBPUFMuT1BfQ0hFQ0tTSUdcbn1cbmNoZWNrLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdwdWJLZXlIYXNoIG91dHB1dCcgfVxuXG5mdW5jdGlvbiBlbmNvZGUgKHB1YktleUhhc2gpIHtcbiAgdHlwZWZvcmNlKHR5cGVzLkhhc2gxNjBiaXQsIHB1YktleUhhc2gpXG5cbiAgcmV0dXJuIGJzY3JpcHQuY29tcGlsZShbXG4gICAgT1BTLk9QX0RVUCxcbiAgICBPUFMuT1BfSEFTSDE2MCxcbiAgICBwdWJLZXlIYXNoLFxuICAgIE9QUy5PUF9FUVVBTFZFUklGWSxcbiAgICBPUFMuT1BfQ0hFQ0tTSUdcbiAgXSlcbn1cblxuZnVuY3Rpb24gZGVjb2RlIChidWZmZXIpIHtcbiAgdHlwZWZvcmNlKGNoZWNrLCBidWZmZXIpXG5cbiAgcmV0dXJuIGJ1ZmZlci5zbGljZSgzLCAyMylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrOiBjaGVjayxcbiAgZGVjb2RlOiBkZWNvZGUsXG4gIGVuY29kZTogZW5jb2RlXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5wdXQ6IHJlcXVpcmUoJy4vaW5wdXQnKSxcbiAgb3V0cHV0OiByZXF1aXJlKCcuL291dHB1dCcpXG59XG4iLCIvLyA8c2NyaXB0U2lnPiB7c2VyaWFsaXplZCBzY3JpcHRQdWJLZXkgc2NyaXB0fVxuXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcbnZhciBic2NyaXB0ID0gcmVxdWlyZSgnLi4vLi4vc2NyaXB0JylcbnZhciB0eXBlZm9yY2UgPSByZXF1aXJlKCd0eXBlZm9yY2UnKVxuXG52YXIgcDJtcyA9IHJlcXVpcmUoJy4uL211bHRpc2lnLycpXG52YXIgcDJwayA9IHJlcXVpcmUoJy4uL3B1YmtleS8nKVxudmFyIHAycGtoID0gcmVxdWlyZSgnLi4vcHVia2V5aGFzaC8nKVxudmFyIHAyd3BraG8gPSByZXF1aXJlKCcuLi93aXRuZXNzcHVia2V5aGFzaC9vdXRwdXQnKVxudmFyIHAyd3NobyA9IHJlcXVpcmUoJy4uL3dpdG5lc3NzY3JpcHRoYXNoL291dHB1dCcpXG5cbmZ1bmN0aW9uIGNoZWNrIChzY3JpcHQsIGFsbG93SW5jb21wbGV0ZSkge1xuICB2YXIgY2h1bmtzID0gYnNjcmlwdC5kZWNvbXBpbGUoc2NyaXB0KVxuICBpZiAoY2h1bmtzLmxlbmd0aCA8IDEpIHJldHVybiBmYWxzZVxuXG4gIHZhciBsYXN0Q2h1bmsgPSBjaHVua3NbY2h1bmtzLmxlbmd0aCAtIDFdXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGxhc3RDaHVuaykpIHJldHVybiBmYWxzZVxuXG4gIHZhciBzY3JpcHRTaWdDaHVua3MgPSBic2NyaXB0LmRlY29tcGlsZShic2NyaXB0LmNvbXBpbGUoY2h1bmtzLnNsaWNlKDAsIC0xKSkpXG4gIHZhciByZWRlZW1TY3JpcHRDaHVua3MgPSBic2NyaXB0LmRlY29tcGlsZShsYXN0Q2h1bmspXG5cbiAgLy8gaXMgcmVkZWVtU2NyaXB0IGEgdmFsaWQgc2NyaXB0P1xuICBpZiAocmVkZWVtU2NyaXB0Q2h1bmtzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlXG5cbiAgLy8gaXMgcmVkZWVtU2NyaXB0U2lnIHB1c2ggb25seT9cbiAgaWYgKCFic2NyaXB0LmlzUHVzaE9ubHkoc2NyaXB0U2lnQ2h1bmtzKSkgcmV0dXJuIGZhbHNlXG5cbiAgLy8gaXMgd2l0bmVzcz9cbiAgaWYgKGNodW5rcy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gcDJ3c2hvLmNoZWNrKHJlZGVlbVNjcmlwdENodW5rcykgfHxcbiAgICAgIHAyd3BraG8uY2hlY2socmVkZWVtU2NyaXB0Q2h1bmtzKVxuICB9XG5cbiAgLy8gbWF0Y2ggdHlwZXNcbiAgaWYgKHAycGtoLmlucHV0LmNoZWNrKHNjcmlwdFNpZ0NodW5rcykgJiZcbiAgICBwMnBraC5vdXRwdXQuY2hlY2socmVkZWVtU2NyaXB0Q2h1bmtzKSkgcmV0dXJuIHRydWVcblxuICBpZiAocDJtcy5pbnB1dC5jaGVjayhzY3JpcHRTaWdDaHVua3MsIGFsbG93SW5jb21wbGV0ZSkgJiZcbiAgICBwMm1zLm91dHB1dC5jaGVjayhyZWRlZW1TY3JpcHRDaHVua3MpKSByZXR1cm4gdHJ1ZVxuXG4gIGlmIChwMnBrLmlucHV0LmNoZWNrKHNjcmlwdFNpZ0NodW5rcykgJiZcbiAgICBwMnBrLm91dHB1dC5jaGVjayhyZWRlZW1TY3JpcHRDaHVua3MpKSByZXR1cm4gdHJ1ZVxuXG4gIHJldHVybiBmYWxzZVxufVxuY2hlY2sudG9KU09OID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ3NjcmlwdEhhc2ggaW5wdXQnIH1cblxuZnVuY3Rpb24gZW5jb2RlU3RhY2sgKHJlZGVlbVNjcmlwdFN0YWNrLCByZWRlZW1TY3JpcHQpIHtcbiAgdmFyIHNlcmlhbGl6ZWRTY3JpcHRQdWJLZXkgPSBic2NyaXB0LmNvbXBpbGUocmVkZWVtU2NyaXB0KVxuXG4gIHJldHVybiBbXS5jb25jYXQocmVkZWVtU2NyaXB0U3RhY2ssIHNlcmlhbGl6ZWRTY3JpcHRQdWJLZXkpXG59XG5cbmZ1bmN0aW9uIGVuY29kZSAocmVkZWVtU2NyaXB0U2lnLCByZWRlZW1TY3JpcHQpIHtcbiAgdmFyIHJlZGVlbVNjcmlwdFN0YWNrID0gYnNjcmlwdC5kZWNvbXBpbGUocmVkZWVtU2NyaXB0U2lnKVxuXG4gIHJldHVybiBic2NyaXB0LmNvbXBpbGUoZW5jb2RlU3RhY2socmVkZWVtU2NyaXB0U3RhY2ssIHJlZGVlbVNjcmlwdCkpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVN0YWNrIChzdGFjaykge1xuICB0eXBlZm9yY2UodHlwZWZvcmNlLkFycmF5LCBzdGFjaylcbiAgdHlwZWZvcmNlKGNoZWNrLCBzdGFjaylcblxuICByZXR1cm4ge1xuICAgIHJlZGVlbVNjcmlwdFN0YWNrOiBzdGFjay5zbGljZSgwLCAtMSksXG4gICAgcmVkZWVtU2NyaXB0OiBzdGFja1tzdGFjay5sZW5ndGggLSAxXVxuICB9XG59XG5cbmZ1bmN0aW9uIGRlY29kZSAoYnVmZmVyKSB7XG4gIHZhciBzdGFjayA9IGJzY3JpcHQuZGVjb21waWxlKGJ1ZmZlcilcbiAgdmFyIHJlc3VsdCA9IGRlY29kZVN0YWNrKHN0YWNrKVxuICByZXN1bHQucmVkZWVtU2NyaXB0U2lnID0gYnNjcmlwdC5jb21waWxlKHJlc3VsdC5yZWRlZW1TY3JpcHRTdGFjaylcbiAgZGVsZXRlIHJlc3VsdC5yZWRlZW1TY3JpcHRTdGFja1xuICByZXR1cm4gcmVzdWx0XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVjazogY2hlY2ssXG4gIGRlY29kZTogZGVjb2RlLFxuICBkZWNvZGVTdGFjazogZGVjb2RlU3RhY2ssXG4gIGVuY29kZTogZW5jb2RlLFxuICBlbmNvZGVTdGFjazogZW5jb2RlU3RhY2tcbn1cbiIsIi8vIE9QX0hBU0gxNjAge3NjcmlwdEhhc2h9IE9QX0VRVUFMXG5cbnZhciBic2NyaXB0ID0gcmVxdWlyZSgnLi4vLi4vc2NyaXB0JylcbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4uLy4uL3R5cGVzJylcbnZhciB0eXBlZm9yY2UgPSByZXF1aXJlKCd0eXBlZm9yY2UnKVxudmFyIE9QUyA9IHJlcXVpcmUoJ2JpdGNvaW4tb3BzJylcblxuZnVuY3Rpb24gY2hlY2sgKHNjcmlwdCkge1xuICB2YXIgYnVmZmVyID0gYnNjcmlwdC5jb21waWxlKHNjcmlwdClcblxuICByZXR1cm4gYnVmZmVyLmxlbmd0aCA9PT0gMjMgJiZcbiAgICBidWZmZXJbMF0gPT09IE9QUy5PUF9IQVNIMTYwICYmXG4gICAgYnVmZmVyWzFdID09PSAweDE0ICYmXG4gICAgYnVmZmVyWzIyXSA9PT0gT1BTLk9QX0VRVUFMXG59XG5jaGVjay50b0pTT04gPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnc2NyaXB0SGFzaCBvdXRwdXQnIH1cblxuZnVuY3Rpb24gZW5jb2RlIChzY3JpcHRIYXNoKSB7XG4gIHR5cGVmb3JjZSh0eXBlcy5IYXNoMTYwYml0LCBzY3JpcHRIYXNoKVxuXG4gIHJldHVybiBic2NyaXB0LmNvbXBpbGUoW09QUy5PUF9IQVNIMTYwLCBzY3JpcHRIYXNoLCBPUFMuT1BfRVFVQUxdKVxufVxuXG5mdW5jdGlvbiBkZWNvZGUgKGJ1ZmZlcikge1xuICB0eXBlZm9yY2UoY2hlY2ssIGJ1ZmZlcilcblxuICByZXR1cm4gYnVmZmVyLnNsaWNlKDIsIDIyKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2s6IGNoZWNrLFxuICBkZWNvZGU6IGRlY29kZSxcbiAgZW5jb2RlOiBlbmNvZGVcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBvdXRwdXQ6IHJlcXVpcmUoJy4vb3V0cHV0Jylcbn1cbiIsIi8vIE9QX1JFVFVSTiB7YWEyMWE5ZWR9IHtjb21taXRtZW50fVxuXG52YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcbnZhciBic2NyaXB0ID0gcmVxdWlyZSgnLi4vLi4vc2NyaXB0JylcbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4uLy4uL3R5cGVzJylcbnZhciB0eXBlZm9yY2UgPSByZXF1aXJlKCd0eXBlZm9yY2UnKVxudmFyIE9QUyA9IHJlcXVpcmUoJ2JpdGNvaW4tb3BzJylcblxudmFyIEhFQURFUiA9IEJ1ZmZlci5mcm9tKCdhYTIxYTllZCcsICdoZXgnKVxuXG5mdW5jdGlvbiBjaGVjayAoc2NyaXB0KSB7XG4gIHZhciBidWZmZXIgPSBic2NyaXB0LmNvbXBpbGUoc2NyaXB0KVxuXG4gIHJldHVybiBidWZmZXIubGVuZ3RoID4gMzcgJiZcbiAgICBidWZmZXJbMF0gPT09IE9QUy5PUF9SRVRVUk4gJiZcbiAgICBidWZmZXJbMV0gPT09IDB4MjQgJiZcbiAgICBidWZmZXIuc2xpY2UoMiwgNikuZXF1YWxzKEhFQURFUilcbn1cblxuY2hlY2sudG9KU09OID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ1dpdG5lc3MgY29tbWl0bWVudCBvdXRwdXQnIH1cblxuZnVuY3Rpb24gZW5jb2RlIChjb21taXRtZW50KSB7XG4gIHR5cGVmb3JjZSh0eXBlcy5IYXNoMjU2Yml0LCBjb21taXRtZW50KVxuXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMzYpXG4gIEhFQURFUi5jb3B5KGJ1ZmZlciwgMClcbiAgY29tbWl0bWVudC5jb3B5KGJ1ZmZlciwgNClcblxuICByZXR1cm4gYnNjcmlwdC5jb21waWxlKFtPUFMuT1BfUkVUVVJOLCBidWZmZXJdKVxufVxuXG5mdW5jdGlvbiBkZWNvZGUgKGJ1ZmZlcikge1xuICB0eXBlZm9yY2UoY2hlY2ssIGJ1ZmZlcilcblxuICByZXR1cm4gYnNjcmlwdC5kZWNvbXBpbGUoYnVmZmVyKVsxXS5zbGljZSg0LCAzNilcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrOiBjaGVjayxcbiAgZGVjb2RlOiBkZWNvZGUsXG4gIGVuY29kZTogZW5jb2RlXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5wdXQ6IHJlcXVpcmUoJy4vaW5wdXQnKSxcbiAgb3V0cHV0OiByZXF1aXJlKCcuL291dHB1dCcpXG59XG4iLCIvLyB7c2lnbmF0dXJlfSB7cHViS2V5fVxuXG52YXIgYnNjcmlwdCA9IHJlcXVpcmUoJy4uLy4uL3NjcmlwdCcpXG52YXIgdHlwZWZvcmNlID0gcmVxdWlyZSgndHlwZWZvcmNlJylcblxuZnVuY3Rpb24gaXNDb21wcmVzc2VkQ2Fub25pY2FsUHViS2V5IChwdWJLZXkpIHtcbiAgcmV0dXJuIGJzY3JpcHQuaXNDYW5vbmljYWxQdWJLZXkocHViS2V5KSAmJiBwdWJLZXkubGVuZ3RoID09PSAzM1xufVxuXG5mdW5jdGlvbiBjaGVjayAoc2NyaXB0KSB7XG4gIHZhciBjaHVua3MgPSBic2NyaXB0LmRlY29tcGlsZShzY3JpcHQpXG5cbiAgcmV0dXJuIGNodW5rcy5sZW5ndGggPT09IDIgJiZcbiAgICBic2NyaXB0LmlzQ2Fub25pY2FsU2lnbmF0dXJlKGNodW5rc1swXSkgJiZcbiAgICBpc0NvbXByZXNzZWRDYW5vbmljYWxQdWJLZXkoY2h1bmtzWzFdKVxufVxuY2hlY2sudG9KU09OID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ3dpdG5lc3NQdWJLZXlIYXNoIGlucHV0JyB9XG5cbmZ1bmN0aW9uIGVuY29kZVN0YWNrIChzaWduYXR1cmUsIHB1YktleSkge1xuICB0eXBlZm9yY2Uoe1xuICAgIHNpZ25hdHVyZTogYnNjcmlwdC5pc0Nhbm9uaWNhbFNpZ25hdHVyZSxcbiAgICBwdWJLZXk6IGlzQ29tcHJlc3NlZENhbm9uaWNhbFB1YktleVxuICB9LCB7XG4gICAgc2lnbmF0dXJlOiBzaWduYXR1cmUsXG4gICAgcHViS2V5OiBwdWJLZXlcbiAgfSlcblxuICByZXR1cm4gW3NpZ25hdHVyZSwgcHViS2V5XVxufVxuXG5mdW5jdGlvbiBkZWNvZGVTdGFjayAoc3RhY2spIHtcbiAgdHlwZWZvcmNlKHR5cGVmb3JjZS5BcnJheSwgc3RhY2spXG4gIHR5cGVmb3JjZShjaGVjaywgc3RhY2spXG5cbiAgcmV0dXJuIHtcbiAgICBzaWduYXR1cmU6IHN0YWNrWzBdLFxuICAgIHB1YktleTogc3RhY2tbMV1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2s6IGNoZWNrLFxuICBkZWNvZGVTdGFjazogZGVjb2RlU3RhY2ssXG4gIGVuY29kZVN0YWNrOiBlbmNvZGVTdGFja1xufVxuIiwiLy8gT1BfMCB7cHViS2V5SGFzaH1cblxudmFyIGJzY3JpcHQgPSByZXF1aXJlKCcuLi8uLi9zY3JpcHQnKVxudmFyIHR5cGVzID0gcmVxdWlyZSgnLi4vLi4vdHlwZXMnKVxudmFyIHR5cGVmb3JjZSA9IHJlcXVpcmUoJ3R5cGVmb3JjZScpXG52YXIgT1BTID0gcmVxdWlyZSgnYml0Y29pbi1vcHMnKVxuXG5mdW5jdGlvbiBjaGVjayAoc2NyaXB0KSB7XG4gIHZhciBidWZmZXIgPSBic2NyaXB0LmNvbXBpbGUoc2NyaXB0KVxuXG4gIHJldHVybiBidWZmZXIubGVuZ3RoID09PSAyMiAmJlxuICAgIGJ1ZmZlclswXSA9PT0gT1BTLk9QXzAgJiZcbiAgICBidWZmZXJbMV0gPT09IDB4MTRcbn1cbmNoZWNrLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdXaXRuZXNzIHB1YktleUhhc2ggb3V0cHV0JyB9XG5cbmZ1bmN0aW9uIGVuY29kZSAocHViS2V5SGFzaCkge1xuICB0eXBlZm9yY2UodHlwZXMuSGFzaDE2MGJpdCwgcHViS2V5SGFzaClcblxuICByZXR1cm4gYnNjcmlwdC5jb21waWxlKFtPUFMuT1BfMCwgcHViS2V5SGFzaF0pXG59XG5cbmZ1bmN0aW9uIGRlY29kZSAoYnVmZmVyKSB7XG4gIHR5cGVmb3JjZShjaGVjaywgYnVmZmVyKVxuXG4gIHJldHVybiBidWZmZXIuc2xpY2UoMilcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNoZWNrOiBjaGVjayxcbiAgZGVjb2RlOiBkZWNvZGUsXG4gIGVuY29kZTogZW5jb2RlXG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgaW5wdXQ6IHJlcXVpcmUoJy4vaW5wdXQnKSxcbiAgb3V0cHV0OiByZXF1aXJlKCcuL291dHB1dCcpXG59XG4iLCIvLyA8c2NyaXB0U2lnPiB7c2VyaWFsaXplZCBzY3JpcHRQdWJLZXkgc2NyaXB0fVxuXG52YXIgYnNjcmlwdCA9IHJlcXVpcmUoJy4uLy4uL3NjcmlwdCcpXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuLi8uLi90eXBlcycpXG52YXIgdHlwZWZvcmNlID0gcmVxdWlyZSgndHlwZWZvcmNlJylcblxudmFyIHAybXMgPSByZXF1aXJlKCcuLi9tdWx0aXNpZy8nKVxudmFyIHAycGsgPSByZXF1aXJlKCcuLi9wdWJrZXkvJylcbnZhciBwMnBraCA9IHJlcXVpcmUoJy4uL3B1YmtleWhhc2gvJylcblxuZnVuY3Rpb24gY2hlY2sgKGNodW5rcywgYWxsb3dJbmNvbXBsZXRlKSB7XG4gIHR5cGVmb3JjZSh0eXBlcy5BcnJheSwgY2h1bmtzKVxuICBpZiAoY2h1bmtzLmxlbmd0aCA8IDEpIHJldHVybiBmYWxzZVxuXG4gIHZhciB3aXRuZXNzU2NyaXB0ID0gY2h1bmtzW2NodW5rcy5sZW5ndGggLSAxXVxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih3aXRuZXNzU2NyaXB0KSkgcmV0dXJuIGZhbHNlXG5cbiAgdmFyIHdpdG5lc3NTY3JpcHRDaHVua3MgPSBic2NyaXB0LmRlY29tcGlsZSh3aXRuZXNzU2NyaXB0KVxuXG4gIC8vIGlzIHdpdG5lc3NTY3JpcHQgYSB2YWxpZCBzY3JpcHQ/XG4gIGlmICh3aXRuZXNzU2NyaXB0Q2h1bmtzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIGZhbHNlXG5cbiAgdmFyIHdpdG5lc3NSYXdTY3JpcHRTaWcgPSBic2NyaXB0LmNvbXBpbGUoY2h1bmtzLnNsaWNlKDAsIC0xKSlcblxuICAvLyBtYXRjaCB0eXBlc1xuICBpZiAocDJwa2guaW5wdXQuY2hlY2sod2l0bmVzc1Jhd1NjcmlwdFNpZykgJiZcbiAgICBwMnBraC5vdXRwdXQuY2hlY2sod2l0bmVzc1NjcmlwdENodW5rcykpIHJldHVybiB0cnVlXG5cbiAgaWYgKHAybXMuaW5wdXQuY2hlY2sod2l0bmVzc1Jhd1NjcmlwdFNpZywgYWxsb3dJbmNvbXBsZXRlKSAmJlxuICAgIHAybXMub3V0cHV0LmNoZWNrKHdpdG5lc3NTY3JpcHRDaHVua3MpKSByZXR1cm4gdHJ1ZVxuXG4gIGlmIChwMnBrLmlucHV0LmNoZWNrKHdpdG5lc3NSYXdTY3JpcHRTaWcpICYmXG4gICAgcDJway5vdXRwdXQuY2hlY2sod2l0bmVzc1NjcmlwdENodW5rcykpIHJldHVybiB0cnVlXG5cbiAgcmV0dXJuIGZhbHNlXG59XG5jaGVjay50b0pTT04gPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnd2l0bmVzc1NjcmlwdEhhc2ggaW5wdXQnIH1cblxuZnVuY3Rpb24gZW5jb2RlU3RhY2sgKHdpdG5lc3NEYXRhLCB3aXRuZXNzU2NyaXB0KSB7XG4gIHR5cGVmb3JjZSh7XG4gICAgd2l0bmVzc0RhdGE6IFt0eXBlcy5CdWZmZXJdLFxuICAgIHdpdG5lc3NTY3JpcHQ6IHR5cGVzLkJ1ZmZlclxuICB9LCB7XG4gICAgd2l0bmVzc0RhdGE6IHdpdG5lc3NEYXRhLFxuICAgIHdpdG5lc3NTY3JpcHQ6IHdpdG5lc3NTY3JpcHRcbiAgfSlcblxuICByZXR1cm4gW10uY29uY2F0KHdpdG5lc3NEYXRhLCB3aXRuZXNzU2NyaXB0KVxufVxuXG5mdW5jdGlvbiBkZWNvZGVTdGFjayAoc3RhY2spIHtcbiAgdHlwZWZvcmNlKHR5cGVmb3JjZS5BcnJheSwgc3RhY2spXG4gIHR5cGVmb3JjZShjaGVjaywgc3RhY2spXG4gIHJldHVybiB7XG4gICAgd2l0bmVzc0RhdGE6IHN0YWNrLnNsaWNlKDAsIC0xKSxcbiAgICB3aXRuZXNzU2NyaXB0OiBzdGFja1tzdGFjay5sZW5ndGggLSAxXVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBjaGVjazogY2hlY2ssXG4gIGRlY29kZVN0YWNrOiBkZWNvZGVTdGFjayxcbiAgZW5jb2RlU3RhY2s6IGVuY29kZVN0YWNrXG59XG4iLCIvLyBPUF8wIHtzY3JpcHRIYXNofVxuXG52YXIgYnNjcmlwdCA9IHJlcXVpcmUoJy4uLy4uL3NjcmlwdCcpXG52YXIgdHlwZXMgPSByZXF1aXJlKCcuLi8uLi90eXBlcycpXG52YXIgdHlwZWZvcmNlID0gcmVxdWlyZSgndHlwZWZvcmNlJylcbnZhciBPUFMgPSByZXF1aXJlKCdiaXRjb2luLW9wcycpXG5cbmZ1bmN0aW9uIGNoZWNrIChzY3JpcHQpIHtcbiAgdmFyIGJ1ZmZlciA9IGJzY3JpcHQuY29tcGlsZShzY3JpcHQpXG5cbiAgcmV0dXJuIGJ1ZmZlci5sZW5ndGggPT09IDM0ICYmXG4gICAgYnVmZmVyWzBdID09PSBPUFMuT1BfMCAmJlxuICAgIGJ1ZmZlclsxXSA9PT0gMHgyMFxufVxuY2hlY2sudG9KU09OID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJ1dpdG5lc3Mgc2NyaXB0SGFzaCBvdXRwdXQnIH1cblxuZnVuY3Rpb24gZW5jb2RlIChzY3JpcHRIYXNoKSB7XG4gIHR5cGVmb3JjZSh0eXBlcy5IYXNoMjU2Yml0LCBzY3JpcHRIYXNoKVxuXG4gIHJldHVybiBic2NyaXB0LmNvbXBpbGUoW09QUy5PUF8wLCBzY3JpcHRIYXNoXSlcbn1cblxuZnVuY3Rpb24gZGVjb2RlIChidWZmZXIpIHtcbiAgdHlwZWZvcmNlKGNoZWNrLCBidWZmZXIpXG5cbiAgcmV0dXJuIGJ1ZmZlci5zbGljZSgyKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgY2hlY2s6IGNoZWNrLFxuICBkZWNvZGU6IGRlY29kZSxcbiAgZW5jb2RlOiBlbmNvZGVcbn1cbiIsInZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlclxudmFyIGJjcnlwdG8gPSByZXF1aXJlKCcuL2NyeXB0bycpXG52YXIgYnNjcmlwdCA9IHJlcXVpcmUoJy4vc2NyaXB0JylcbnZhciBidWZmZXJ1dGlscyA9IHJlcXVpcmUoJy4vYnVmZmVydXRpbHMnKVxudmFyIG9wY29kZXMgPSByZXF1aXJlKCdiaXRjb2luLW9wcycpXG52YXIgdHlwZWZvcmNlID0gcmVxdWlyZSgndHlwZWZvcmNlJylcbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKVxudmFyIHZhcnVpbnQgPSByZXF1aXJlKCd2YXJ1aW50LWJpdGNvaW4nKVxuXG5mdW5jdGlvbiB2YXJTbGljZVNpemUgKHNvbWVTY3JpcHQpIHtcbiAgdmFyIGxlbmd0aCA9IHNvbWVTY3JpcHQubGVuZ3RoXG5cbiAgcmV0dXJuIHZhcnVpbnQuZW5jb2RpbmdMZW5ndGgobGVuZ3RoKSArIGxlbmd0aFxufVxuXG5mdW5jdGlvbiB2ZWN0b3JTaXplIChzb21lVmVjdG9yKSB7XG4gIHZhciBsZW5ndGggPSBzb21lVmVjdG9yLmxlbmd0aFxuXG4gIHJldHVybiB2YXJ1aW50LmVuY29kaW5nTGVuZ3RoKGxlbmd0aCkgKyBzb21lVmVjdG9yLnJlZHVjZShmdW5jdGlvbiAoc3VtLCB3aXRuZXNzKSB7XG4gICAgcmV0dXJuIHN1bSArIHZhclNsaWNlU2l6ZSh3aXRuZXNzKVxuICB9LCAwKVxufVxuXG5mdW5jdGlvbiBUcmFuc2FjdGlvbiAoKSB7XG4gIHRoaXMudmVyc2lvbiA9IDFcbiAgdGhpcy5sb2NrdGltZSA9IDBcbiAgdGhpcy5pbnMgPSBbXVxuICB0aGlzLm91dHMgPSBbXVxufVxuXG5UcmFuc2FjdGlvbi5ERUZBVUxUX1NFUVVFTkNFID0gMHhmZmZmZmZmZlxuVHJhbnNhY3Rpb24uU0lHSEFTSF9BTEwgPSAweDAxXG5UcmFuc2FjdGlvbi5TSUdIQVNIX05PTkUgPSAweDAyXG5UcmFuc2FjdGlvbi5TSUdIQVNIX1NJTkdMRSA9IDB4MDNcblRyYW5zYWN0aW9uLlNJR0hBU0hfQU5ZT05FQ0FOUEFZID0gMHg4MFxuVHJhbnNhY3Rpb24uQURWQU5DRURfVFJBTlNBQ1RJT05fTUFSS0VSID0gMHgwMFxuVHJhbnNhY3Rpb24uQURWQU5DRURfVFJBTlNBQ1RJT05fRkxBRyA9IDB4MDFcblxudmFyIEVNUFRZX1NDUklQVCA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgwKVxudmFyIEVNUFRZX1dJVE5FU1MgPSBbXVxudmFyIFpFUk8gPSBCdWZmZXIuZnJvbSgnMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMCcsICdoZXgnKVxudmFyIE9ORSA9IEJ1ZmZlci5mcm9tKCcwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxJywgJ2hleCcpXG52YXIgVkFMVUVfVUlOVDY0X01BWCA9IEJ1ZmZlci5mcm9tKCdmZmZmZmZmZmZmZmZmZmZmJywgJ2hleCcpXG52YXIgQkxBTktfT1VUUFVUID0ge1xuICBzY3JpcHQ6IEVNUFRZX1NDUklQVCxcbiAgdmFsdWVCdWZmZXI6IFZBTFVFX1VJTlQ2NF9NQVhcbn1cblxuVHJhbnNhY3Rpb24uZnJvbUJ1ZmZlciA9IGZ1bmN0aW9uIChidWZmZXIsIF9fbm9TdHJpY3QpIHtcbiAgdmFyIG9mZnNldCA9IDBcbiAgZnVuY3Rpb24gcmVhZFNsaWNlIChuKSB7XG4gICAgb2Zmc2V0ICs9IG5cbiAgICByZXR1cm4gYnVmZmVyLnNsaWNlKG9mZnNldCAtIG4sIG9mZnNldClcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRVSW50MzIgKCkge1xuICAgIHZhciBpID0gYnVmZmVyLnJlYWRVSW50MzJMRShvZmZzZXQpXG4gICAgb2Zmc2V0ICs9IDRcbiAgICByZXR1cm4gaVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEludDMyICgpIHtcbiAgICB2YXIgaSA9IGJ1ZmZlci5yZWFkSW50MzJMRShvZmZzZXQpXG4gICAgb2Zmc2V0ICs9IDRcbiAgICByZXR1cm4gaVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZFVJbnQ2NCAoKSB7XG4gICAgdmFyIGkgPSBidWZmZXJ1dGlscy5yZWFkVUludDY0TEUoYnVmZmVyLCBvZmZzZXQpXG4gICAgb2Zmc2V0ICs9IDhcbiAgICByZXR1cm4gaVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZFZhckludCAoKSB7XG4gICAgdmFyIHZpID0gdmFydWludC5kZWNvZGUoYnVmZmVyLCBvZmZzZXQpXG4gICAgb2Zmc2V0ICs9IHZhcnVpbnQuZGVjb2RlLmJ5dGVzXG4gICAgcmV0dXJuIHZpXG4gIH1cblxuICBmdW5jdGlvbiByZWFkVmFyU2xpY2UgKCkge1xuICAgIHJldHVybiByZWFkU2xpY2UocmVhZFZhckludCgpKVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZFZlY3RvciAoKSB7XG4gICAgdmFyIGNvdW50ID0gcmVhZFZhckludCgpXG4gICAgdmFyIHZlY3RvciA9IFtdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb3VudDsgaSsrKSB2ZWN0b3IucHVzaChyZWFkVmFyU2xpY2UoKSlcbiAgICByZXR1cm4gdmVjdG9yXG4gIH1cblxuICB2YXIgdHggPSBuZXcgVHJhbnNhY3Rpb24oKVxuICB0eC52ZXJzaW9uID0gcmVhZEludDMyKClcblxuICB2YXIgbWFya2VyID0gYnVmZmVyLnJlYWRVSW50OChvZmZzZXQpXG4gIHZhciBmbGFnID0gYnVmZmVyLnJlYWRVSW50OChvZmZzZXQgKyAxKVxuXG4gIHZhciBoYXNXaXRuZXNzZXMgPSBmYWxzZVxuICBpZiAobWFya2VyID09PSBUcmFuc2FjdGlvbi5BRFZBTkNFRF9UUkFOU0FDVElPTl9NQVJLRVIgJiZcbiAgICAgIGZsYWcgPT09IFRyYW5zYWN0aW9uLkFEVkFOQ0VEX1RSQU5TQUNUSU9OX0ZMQUcpIHtcbiAgICBvZmZzZXQgKz0gMlxuICAgIGhhc1dpdG5lc3NlcyA9IHRydWVcbiAgfVxuXG4gIHZhciB2aW5MZW4gPSByZWFkVmFySW50KClcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aW5MZW47ICsraSkge1xuICAgIHR4Lmlucy5wdXNoKHtcbiAgICAgIGhhc2g6IHJlYWRTbGljZSgzMiksXG4gICAgICBpbmRleDogcmVhZFVJbnQzMigpLFxuICAgICAgc2NyaXB0OiByZWFkVmFyU2xpY2UoKSxcbiAgICAgIHNlcXVlbmNlOiByZWFkVUludDMyKCksXG4gICAgICB3aXRuZXNzOiBFTVBUWV9XSVRORVNTXG4gICAgfSlcbiAgfVxuXG4gIHZhciB2b3V0TGVuID0gcmVhZFZhckludCgpXG4gIGZvciAoaSA9IDA7IGkgPCB2b3V0TGVuOyArK2kpIHtcbiAgICB0eC5vdXRzLnB1c2goe1xuICAgICAgdmFsdWU6IHJlYWRVSW50NjQoKSxcbiAgICAgIHNjcmlwdDogcmVhZFZhclNsaWNlKClcbiAgICB9KVxuICB9XG5cbiAgaWYgKGhhc1dpdG5lc3Nlcykge1xuICAgIGZvciAoaSA9IDA7IGkgPCB2aW5MZW47ICsraSkge1xuICAgICAgdHguaW5zW2ldLndpdG5lc3MgPSByZWFkVmVjdG9yKClcbiAgICB9XG5cbiAgICAvLyB3YXMgdGhpcyBwb2ludGxlc3M/XG4gICAgaWYgKCF0eC5oYXNXaXRuZXNzZXMoKSkgdGhyb3cgbmV3IEVycm9yKCdUcmFuc2FjdGlvbiBoYXMgc3VwZXJmbHVvdXMgd2l0bmVzcyBkYXRhJylcbiAgfVxuXG4gIHR4LmxvY2t0aW1lID0gcmVhZFVJbnQzMigpXG5cbiAgaWYgKF9fbm9TdHJpY3QpIHJldHVybiB0eFxuICBpZiAob2Zmc2V0ICE9PSBidWZmZXIubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RyYW5zYWN0aW9uIGhhcyB1bmV4cGVjdGVkIGRhdGEnKVxuXG4gIHJldHVybiB0eFxufVxuXG5UcmFuc2FjdGlvbi5mcm9tSGV4ID0gZnVuY3Rpb24gKGhleCkge1xuICByZXR1cm4gVHJhbnNhY3Rpb24uZnJvbUJ1ZmZlcihCdWZmZXIuZnJvbShoZXgsICdoZXgnKSlcbn1cblxuVHJhbnNhY3Rpb24uaXNDb2luYmFzZUhhc2ggPSBmdW5jdGlvbiAoYnVmZmVyKSB7XG4gIHR5cGVmb3JjZSh0eXBlcy5IYXNoMjU2Yml0LCBidWZmZXIpXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgMzI7ICsraSkge1xuICAgIGlmIChidWZmZXJbaV0gIT09IDApIHJldHVybiBmYWxzZVxuICB9XG4gIHJldHVybiB0cnVlXG59XG5cblRyYW5zYWN0aW9uLnByb3RvdHlwZS5pc0NvaW5iYXNlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5pbnMubGVuZ3RoID09PSAxICYmIFRyYW5zYWN0aW9uLmlzQ29pbmJhc2VIYXNoKHRoaXMuaW5zWzBdLmhhc2gpXG59XG5cblRyYW5zYWN0aW9uLnByb3RvdHlwZS5hZGRJbnB1dCA9IGZ1bmN0aW9uIChoYXNoLCBpbmRleCwgc2VxdWVuY2UsIHNjcmlwdFNpZykge1xuICB0eXBlZm9yY2UodHlwZXMudHVwbGUoXG4gICAgdHlwZXMuSGFzaDI1NmJpdCxcbiAgICB0eXBlcy5VSW50MzIsXG4gICAgdHlwZXMubWF5YmUodHlwZXMuVUludDMyKSxcbiAgICB0eXBlcy5tYXliZSh0eXBlcy5CdWZmZXIpXG4gICksIGFyZ3VtZW50cylcblxuICBpZiAodHlwZXMuTnVsbChzZXF1ZW5jZSkpIHtcbiAgICBzZXF1ZW5jZSA9IFRyYW5zYWN0aW9uLkRFRkFVTFRfU0VRVUVOQ0VcbiAgfVxuXG4gIC8vIEFkZCB0aGUgaW5wdXQgYW5kIHJldHVybiB0aGUgaW5wdXQncyBpbmRleFxuICByZXR1cm4gKHRoaXMuaW5zLnB1c2goe1xuICAgIGhhc2g6IGhhc2gsXG4gICAgaW5kZXg6IGluZGV4LFxuICAgIHNjcmlwdDogc2NyaXB0U2lnIHx8IEVNUFRZX1NDUklQVCxcbiAgICBzZXF1ZW5jZTogc2VxdWVuY2UsXG4gICAgd2l0bmVzczogRU1QVFlfV0lUTkVTU1xuICB9KSAtIDEpXG59XG5cblRyYW5zYWN0aW9uLnByb3RvdHlwZS5hZGRPdXRwdXQgPSBmdW5jdGlvbiAoc2NyaXB0UHViS2V5LCB2YWx1ZSkge1xuICB0eXBlZm9yY2UodHlwZXMudHVwbGUodHlwZXMuQnVmZmVyLCB0eXBlcy5TYXRvc2hpKSwgYXJndW1lbnRzKVxuXG4gIC8vIEFkZCB0aGUgb3V0cHV0IGFuZCByZXR1cm4gdGhlIG91dHB1dCdzIGluZGV4XG4gIHJldHVybiAodGhpcy5vdXRzLnB1c2goe1xuICAgIHNjcmlwdDogc2NyaXB0UHViS2V5LFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9KSAtIDEpXG59XG5cblRyYW5zYWN0aW9uLnByb3RvdHlwZS5oYXNXaXRuZXNzZXMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLmlucy5zb21lKGZ1bmN0aW9uICh4KSB7XG4gICAgcmV0dXJuIHgud2l0bmVzcy5sZW5ndGggIT09IDBcbiAgfSlcbn1cblxuVHJhbnNhY3Rpb24ucHJvdG90eXBlLndlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGJhc2UgPSB0aGlzLl9fYnl0ZUxlbmd0aChmYWxzZSlcbiAgdmFyIHRvdGFsID0gdGhpcy5fX2J5dGVMZW5ndGgodHJ1ZSlcbiAgcmV0dXJuIGJhc2UgKiAzICsgdG90YWxcbn1cblxuVHJhbnNhY3Rpb24ucHJvdG90eXBlLnZpcnR1YWxTaXplID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gTWF0aC5jZWlsKHRoaXMud2VpZ2h0KCkgLyA0KVxufVxuXG5UcmFuc2FjdGlvbi5wcm90b3R5cGUuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuX19ieXRlTGVuZ3RoKHRydWUpXG59XG5cblRyYW5zYWN0aW9uLnByb3RvdHlwZS5fX2J5dGVMZW5ndGggPSBmdW5jdGlvbiAoX19hbGxvd1dpdG5lc3MpIHtcbiAgdmFyIGhhc1dpdG5lc3NlcyA9IF9fYWxsb3dXaXRuZXNzICYmIHRoaXMuaGFzV2l0bmVzc2VzKClcblxuICByZXR1cm4gKFxuICAgIChoYXNXaXRuZXNzZXMgPyAxMCA6IDgpICtcbiAgICB2YXJ1aW50LmVuY29kaW5nTGVuZ3RoKHRoaXMuaW5zLmxlbmd0aCkgK1xuICAgIHZhcnVpbnQuZW5jb2RpbmdMZW5ndGgodGhpcy5vdXRzLmxlbmd0aCkgK1xuICAgIHRoaXMuaW5zLnJlZHVjZShmdW5jdGlvbiAoc3VtLCBpbnB1dCkgeyByZXR1cm4gc3VtICsgNDAgKyB2YXJTbGljZVNpemUoaW5wdXQuc2NyaXB0KSB9LCAwKSArXG4gICAgdGhpcy5vdXRzLnJlZHVjZShmdW5jdGlvbiAoc3VtLCBvdXRwdXQpIHsgcmV0dXJuIHN1bSArIDggKyB2YXJTbGljZVNpemUob3V0cHV0LnNjcmlwdCkgfSwgMCkgK1xuICAgIChoYXNXaXRuZXNzZXMgPyB0aGlzLmlucy5yZWR1Y2UoZnVuY3Rpb24gKHN1bSwgaW5wdXQpIHsgcmV0dXJuIHN1bSArIHZlY3RvclNpemUoaW5wdXQud2l0bmVzcykgfSwgMCkgOiAwKVxuICApXG59XG5cblRyYW5zYWN0aW9uLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5ld1R4ID0gbmV3IFRyYW5zYWN0aW9uKClcbiAgbmV3VHgudmVyc2lvbiA9IHRoaXMudmVyc2lvblxuICBuZXdUeC5sb2NrdGltZSA9IHRoaXMubG9ja3RpbWVcblxuICBuZXdUeC5pbnMgPSB0aGlzLmlucy5tYXAoZnVuY3Rpb24gKHR4SW4pIHtcbiAgICByZXR1cm4ge1xuICAgICAgaGFzaDogdHhJbi5oYXNoLFxuICAgICAgaW5kZXg6IHR4SW4uaW5kZXgsXG4gICAgICBzY3JpcHQ6IHR4SW4uc2NyaXB0LFxuICAgICAgc2VxdWVuY2U6IHR4SW4uc2VxdWVuY2UsXG4gICAgICB3aXRuZXNzOiB0eEluLndpdG5lc3NcbiAgICB9XG4gIH0pXG5cbiAgbmV3VHgub3V0cyA9IHRoaXMub3V0cy5tYXAoZnVuY3Rpb24gKHR4T3V0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjcmlwdDogdHhPdXQuc2NyaXB0LFxuICAgICAgdmFsdWU6IHR4T3V0LnZhbHVlXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBuZXdUeFxufVxuXG4vKipcbiAqIEhhc2ggdHJhbnNhY3Rpb24gZm9yIHNpZ25pbmcgYSBzcGVjaWZpYyBpbnB1dC5cbiAqXG4gKiBCaXRjb2luIHVzZXMgYSBkaWZmZXJlbnQgaGFzaCBmb3IgZWFjaCBzaWduZWQgdHJhbnNhY3Rpb24gaW5wdXQuXG4gKiBUaGlzIG1ldGhvZCBjb3BpZXMgdGhlIHRyYW5zYWN0aW9uLCBtYWtlcyB0aGUgbmVjZXNzYXJ5IGNoYW5nZXMgYmFzZWQgb24gdGhlXG4gKiBoYXNoVHlwZSwgYW5kIHRoZW4gaGFzaGVzIHRoZSByZXN1bHQuXG4gKiBUaGlzIGhhc2ggY2FuIHRoZW4gYmUgdXNlZCB0byBzaWduIHRoZSBwcm92aWRlZCB0cmFuc2FjdGlvbiBpbnB1dC5cbiAqL1xuVHJhbnNhY3Rpb24ucHJvdG90eXBlLmhhc2hGb3JTaWduYXR1cmUgPSBmdW5jdGlvbiAoaW5JbmRleCwgcHJldk91dFNjcmlwdCwgaGFzaFR5cGUpIHtcbiAgdHlwZWZvcmNlKHR5cGVzLnR1cGxlKHR5cGVzLlVJbnQzMiwgdHlwZXMuQnVmZmVyLCAvKiB0eXBlcy5VSW50OCAqLyB0eXBlcy5OdW1iZXIpLCBhcmd1bWVudHMpXG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2JpdGNvaW4vYml0Y29pbi9ibG9iL21hc3Rlci9zcmMvdGVzdC9zaWdoYXNoX3Rlc3RzLmNwcCNMMjlcbiAgaWYgKGluSW5kZXggPj0gdGhpcy5pbnMubGVuZ3RoKSByZXR1cm4gT05FXG5cbiAgLy8gaWdub3JlIE9QX0NPREVTRVBBUkFUT1JcbiAgdmFyIG91clNjcmlwdCA9IGJzY3JpcHQuY29tcGlsZShic2NyaXB0LmRlY29tcGlsZShwcmV2T3V0U2NyaXB0KS5maWx0ZXIoZnVuY3Rpb24gKHgpIHtcbiAgICByZXR1cm4geCAhPT0gb3Bjb2Rlcy5PUF9DT0RFU0VQQVJBVE9SXG4gIH0pKVxuXG4gIHZhciB0eFRtcCA9IHRoaXMuY2xvbmUoKVxuXG4gIC8vIFNJR0hBU0hfTk9ORTogaWdub3JlIGFsbCBvdXRwdXRzPyAod2lsZGNhcmQgcGF5ZWUpXG4gIGlmICgoaGFzaFR5cGUgJiAweDFmKSA9PT0gVHJhbnNhY3Rpb24uU0lHSEFTSF9OT05FKSB7XG4gICAgdHhUbXAub3V0cyA9IFtdXG5cbiAgICAvLyBpZ25vcmUgc2VxdWVuY2UgbnVtYmVycyAoZXhjZXB0IGF0IGluSW5kZXgpXG4gICAgdHhUbXAuaW5zLmZvckVhY2goZnVuY3Rpb24gKGlucHV0LCBpKSB7XG4gICAgICBpZiAoaSA9PT0gaW5JbmRleCkgcmV0dXJuXG5cbiAgICAgIGlucHV0LnNlcXVlbmNlID0gMFxuICAgIH0pXG5cbiAgLy8gU0lHSEFTSF9TSU5HTEU6IGlnbm9yZSBhbGwgb3V0cHV0cywgZXhjZXB0IGF0IHRoZSBzYW1lIGluZGV4P1xuICB9IGVsc2UgaWYgKChoYXNoVHlwZSAmIDB4MWYpID09PSBUcmFuc2FjdGlvbi5TSUdIQVNIX1NJTkdMRSkge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9iaXRjb2luL2JpdGNvaW4vYmxvYi9tYXN0ZXIvc3JjL3Rlc3Qvc2lnaGFzaF90ZXN0cy5jcHAjTDYwXG4gICAgaWYgKGluSW5kZXggPj0gdGhpcy5vdXRzLmxlbmd0aCkgcmV0dXJuIE9ORVxuXG4gICAgLy8gdHJ1bmNhdGUgb3V0cHV0cyBhZnRlclxuICAgIHR4VG1wLm91dHMubGVuZ3RoID0gaW5JbmRleCArIDFcblxuICAgIC8vIFwiYmxhbmtcIiBvdXRwdXRzIGJlZm9yZVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaW5JbmRleDsgaSsrKSB7XG4gICAgICB0eFRtcC5vdXRzW2ldID0gQkxBTktfT1VUUFVUXG4gICAgfVxuXG4gICAgLy8gaWdub3JlIHNlcXVlbmNlIG51bWJlcnMgKGV4Y2VwdCBhdCBpbkluZGV4KVxuICAgIHR4VG1wLmlucy5mb3JFYWNoKGZ1bmN0aW9uIChpbnB1dCwgeSkge1xuICAgICAgaWYgKHkgPT09IGluSW5kZXgpIHJldHVyblxuXG4gICAgICBpbnB1dC5zZXF1ZW5jZSA9IDBcbiAgICB9KVxuICB9XG5cbiAgLy8gU0lHSEFTSF9BTllPTkVDQU5QQVk6IGlnbm9yZSBpbnB1dHMgZW50aXJlbHk/XG4gIGlmIChoYXNoVHlwZSAmIFRyYW5zYWN0aW9uLlNJR0hBU0hfQU5ZT05FQ0FOUEFZKSB7XG4gICAgdHhUbXAuaW5zID0gW3R4VG1wLmluc1tpbkluZGV4XV1cbiAgICB0eFRtcC5pbnNbMF0uc2NyaXB0ID0gb3VyU2NyaXB0XG5cbiAgLy8gU0lHSEFTSF9BTEw6IG9ubHkgaWdub3JlIGlucHV0IHNjcmlwdHNcbiAgfSBlbHNlIHtcbiAgICAvLyBcImJsYW5rXCIgb3RoZXJzIGlucHV0IHNjcmlwdHNcbiAgICB0eFRtcC5pbnMuZm9yRWFjaChmdW5jdGlvbiAoaW5wdXQpIHsgaW5wdXQuc2NyaXB0ID0gRU1QVFlfU0NSSVBUIH0pXG4gICAgdHhUbXAuaW5zW2luSW5kZXhdLnNjcmlwdCA9IG91clNjcmlwdFxuICB9XG5cbiAgLy8gc2VyaWFsaXplIGFuZCBoYXNoXG4gIHZhciBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUodHhUbXAuX19ieXRlTGVuZ3RoKGZhbHNlKSArIDQpXG4gIGJ1ZmZlci53cml0ZUludDMyTEUoaGFzaFR5cGUsIGJ1ZmZlci5sZW5ndGggLSA0KVxuICB0eFRtcC5fX3RvQnVmZmVyKGJ1ZmZlciwgMCwgZmFsc2UpXG5cbiAgcmV0dXJuIGJjcnlwdG8uaGFzaDI1NihidWZmZXIpXG59XG5cblRyYW5zYWN0aW9uLnByb3RvdHlwZS5oYXNoRm9yV2l0bmVzc1YwID0gZnVuY3Rpb24gKGluSW5kZXgsIHByZXZPdXRTY3JpcHQsIHZhbHVlLCBoYXNoVHlwZSkge1xuICB0eXBlZm9yY2UodHlwZXMudHVwbGUodHlwZXMuVUludDMyLCB0eXBlcy5CdWZmZXIsIHR5cGVzLlNhdG9zaGksIHR5cGVzLlVJbnQzMiksIGFyZ3VtZW50cylcblxuICB2YXIgdGJ1ZmZlciwgdG9mZnNldFxuICBmdW5jdGlvbiB3cml0ZVNsaWNlIChzbGljZSkgeyB0b2Zmc2V0ICs9IHNsaWNlLmNvcHkodGJ1ZmZlciwgdG9mZnNldCkgfVxuICBmdW5jdGlvbiB3cml0ZVVJbnQzMiAoaSkgeyB0b2Zmc2V0ID0gdGJ1ZmZlci53cml0ZVVJbnQzMkxFKGksIHRvZmZzZXQpIH1cbiAgZnVuY3Rpb24gd3JpdGVVSW50NjQgKGkpIHsgdG9mZnNldCA9IGJ1ZmZlcnV0aWxzLndyaXRlVUludDY0TEUodGJ1ZmZlciwgaSwgdG9mZnNldCkgfVxuICBmdW5jdGlvbiB3cml0ZVZhckludCAoaSkge1xuICAgIHZhcnVpbnQuZW5jb2RlKGksIHRidWZmZXIsIHRvZmZzZXQpXG4gICAgdG9mZnNldCArPSB2YXJ1aW50LmVuY29kZS5ieXRlc1xuICB9XG4gIGZ1bmN0aW9uIHdyaXRlVmFyU2xpY2UgKHNsaWNlKSB7IHdyaXRlVmFySW50KHNsaWNlLmxlbmd0aCk7IHdyaXRlU2xpY2Uoc2xpY2UpIH1cblxuICB2YXIgaGFzaE91dHB1dHMgPSBaRVJPXG4gIHZhciBoYXNoUHJldm91dHMgPSBaRVJPXG4gIHZhciBoYXNoU2VxdWVuY2UgPSBaRVJPXG5cbiAgaWYgKCEoaGFzaFR5cGUgJiBUcmFuc2FjdGlvbi5TSUdIQVNIX0FOWU9ORUNBTlBBWSkpIHtcbiAgICB0YnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKDM2ICogdGhpcy5pbnMubGVuZ3RoKVxuICAgIHRvZmZzZXQgPSAwXG5cbiAgICB0aGlzLmlucy5mb3JFYWNoKGZ1bmN0aW9uICh0eEluKSB7XG4gICAgICB3cml0ZVNsaWNlKHR4SW4uaGFzaClcbiAgICAgIHdyaXRlVUludDMyKHR4SW4uaW5kZXgpXG4gICAgfSlcblxuICAgIGhhc2hQcmV2b3V0cyA9IGJjcnlwdG8uaGFzaDI1Nih0YnVmZmVyKVxuICB9XG5cbiAgaWYgKCEoaGFzaFR5cGUgJiBUcmFuc2FjdGlvbi5TSUdIQVNIX0FOWU9ORUNBTlBBWSkgJiZcbiAgICAgICAoaGFzaFR5cGUgJiAweDFmKSAhPT0gVHJhbnNhY3Rpb24uU0lHSEFTSF9TSU5HTEUgJiZcbiAgICAgICAoaGFzaFR5cGUgJiAweDFmKSAhPT0gVHJhbnNhY3Rpb24uU0lHSEFTSF9OT05FKSB7XG4gICAgdGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSg0ICogdGhpcy5pbnMubGVuZ3RoKVxuICAgIHRvZmZzZXQgPSAwXG5cbiAgICB0aGlzLmlucy5mb3JFYWNoKGZ1bmN0aW9uICh0eEluKSB7XG4gICAgICB3cml0ZVVJbnQzMih0eEluLnNlcXVlbmNlKVxuICAgIH0pXG5cbiAgICBoYXNoU2VxdWVuY2UgPSBiY3J5cHRvLmhhc2gyNTYodGJ1ZmZlcilcbiAgfVxuXG4gIGlmICgoaGFzaFR5cGUgJiAweDFmKSAhPT0gVHJhbnNhY3Rpb24uU0lHSEFTSF9TSU5HTEUgJiZcbiAgICAgIChoYXNoVHlwZSAmIDB4MWYpICE9PSBUcmFuc2FjdGlvbi5TSUdIQVNIX05PTkUpIHtcbiAgICB2YXIgdHhPdXRzU2l6ZSA9IHRoaXMub3V0cy5yZWR1Y2UoZnVuY3Rpb24gKHN1bSwgb3V0cHV0KSB7XG4gICAgICByZXR1cm4gc3VtICsgOCArIHZhclNsaWNlU2l6ZShvdXRwdXQuc2NyaXB0KVxuICAgIH0sIDApXG5cbiAgICB0YnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKHR4T3V0c1NpemUpXG4gICAgdG9mZnNldCA9IDBcblxuICAgIHRoaXMub3V0cy5mb3JFYWNoKGZ1bmN0aW9uIChvdXQpIHtcbiAgICAgIHdyaXRlVUludDY0KG91dC52YWx1ZSlcbiAgICAgIHdyaXRlVmFyU2xpY2Uob3V0LnNjcmlwdClcbiAgICB9KVxuXG4gICAgaGFzaE91dHB1dHMgPSBiY3J5cHRvLmhhc2gyNTYodGJ1ZmZlcilcbiAgfSBlbHNlIGlmICgoaGFzaFR5cGUgJiAweDFmKSA9PT0gVHJhbnNhY3Rpb24uU0lHSEFTSF9TSU5HTEUgJiYgaW5JbmRleCA8IHRoaXMub3V0cy5sZW5ndGgpIHtcbiAgICB2YXIgb3V0cHV0ID0gdGhpcy5vdXRzW2luSW5kZXhdXG5cbiAgICB0YnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKDggKyB2YXJTbGljZVNpemUob3V0cHV0LnNjcmlwdCkpXG4gICAgdG9mZnNldCA9IDBcbiAgICB3cml0ZVVJbnQ2NChvdXRwdXQudmFsdWUpXG4gICAgd3JpdGVWYXJTbGljZShvdXRwdXQuc2NyaXB0KVxuXG4gICAgaGFzaE91dHB1dHMgPSBiY3J5cHRvLmhhc2gyNTYodGJ1ZmZlcilcbiAgfVxuXG4gIHRidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMTU2ICsgdmFyU2xpY2VTaXplKHByZXZPdXRTY3JpcHQpKVxuICB0b2Zmc2V0ID0gMFxuXG4gIHZhciBpbnB1dCA9IHRoaXMuaW5zW2luSW5kZXhdXG4gIHdyaXRlVUludDMyKHRoaXMudmVyc2lvbilcbiAgd3JpdGVTbGljZShoYXNoUHJldm91dHMpXG4gIHdyaXRlU2xpY2UoaGFzaFNlcXVlbmNlKVxuICB3cml0ZVNsaWNlKGlucHV0Lmhhc2gpXG4gIHdyaXRlVUludDMyKGlucHV0LmluZGV4KVxuICB3cml0ZVZhclNsaWNlKHByZXZPdXRTY3JpcHQpXG4gIHdyaXRlVUludDY0KHZhbHVlKVxuICB3cml0ZVVJbnQzMihpbnB1dC5zZXF1ZW5jZSlcbiAgd3JpdGVTbGljZShoYXNoT3V0cHV0cylcbiAgd3JpdGVVSW50MzIodGhpcy5sb2NrdGltZSlcbiAgd3JpdGVVSW50MzIoaGFzaFR5cGUpXG4gIHJldHVybiBiY3J5cHRvLmhhc2gyNTYodGJ1ZmZlcilcbn1cblxuVHJhbnNhY3Rpb24ucHJvdG90eXBlLmdldEhhc2ggPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBiY3J5cHRvLmhhc2gyNTYodGhpcy5fX3RvQnVmZmVyKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBmYWxzZSkpXG59XG5cblRyYW5zYWN0aW9uLnByb3RvdHlwZS5nZXRJZCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gdHJhbnNhY3Rpb24gaGFzaCdzIGFyZSBkaXNwbGF5ZWQgaW4gcmV2ZXJzZSBvcmRlclxuICByZXR1cm4gdGhpcy5nZXRIYXNoKCkucmV2ZXJzZSgpLnRvU3RyaW5nKCdoZXgnKVxufVxuXG5UcmFuc2FjdGlvbi5wcm90b3R5cGUudG9CdWZmZXIgPSBmdW5jdGlvbiAoYnVmZmVyLCBpbml0aWFsT2Zmc2V0KSB7XG4gIHJldHVybiB0aGlzLl9fdG9CdWZmZXIoYnVmZmVyLCBpbml0aWFsT2Zmc2V0LCB0cnVlKVxufVxuXG5UcmFuc2FjdGlvbi5wcm90b3R5cGUuX190b0J1ZmZlciA9IGZ1bmN0aW9uIChidWZmZXIsIGluaXRpYWxPZmZzZXQsIF9fYWxsb3dXaXRuZXNzKSB7XG4gIGlmICghYnVmZmVyKSBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUodGhpcy5fX2J5dGVMZW5ndGgoX19hbGxvd1dpdG5lc3MpKVxuXG4gIHZhciBvZmZzZXQgPSBpbml0aWFsT2Zmc2V0IHx8IDBcbiAgZnVuY3Rpb24gd3JpdGVTbGljZSAoc2xpY2UpIHsgb2Zmc2V0ICs9IHNsaWNlLmNvcHkoYnVmZmVyLCBvZmZzZXQpIH1cbiAgZnVuY3Rpb24gd3JpdGVVSW50OCAoaSkgeyBvZmZzZXQgPSBidWZmZXIud3JpdGVVSW50OChpLCBvZmZzZXQpIH1cbiAgZnVuY3Rpb24gd3JpdGVVSW50MzIgKGkpIHsgb2Zmc2V0ID0gYnVmZmVyLndyaXRlVUludDMyTEUoaSwgb2Zmc2V0KSB9XG4gIGZ1bmN0aW9uIHdyaXRlSW50MzIgKGkpIHsgb2Zmc2V0ID0gYnVmZmVyLndyaXRlSW50MzJMRShpLCBvZmZzZXQpIH1cbiAgZnVuY3Rpb24gd3JpdGVVSW50NjQgKGkpIHsgb2Zmc2V0ID0gYnVmZmVydXRpbHMud3JpdGVVSW50NjRMRShidWZmZXIsIGksIG9mZnNldCkgfVxuICBmdW5jdGlvbiB3cml0ZVZhckludCAoaSkge1xuICAgIHZhcnVpbnQuZW5jb2RlKGksIGJ1ZmZlciwgb2Zmc2V0KVxuICAgIG9mZnNldCArPSB2YXJ1aW50LmVuY29kZS5ieXRlc1xuICB9XG4gIGZ1bmN0aW9uIHdyaXRlVmFyU2xpY2UgKHNsaWNlKSB7IHdyaXRlVmFySW50KHNsaWNlLmxlbmd0aCk7IHdyaXRlU2xpY2Uoc2xpY2UpIH1cbiAgZnVuY3Rpb24gd3JpdGVWZWN0b3IgKHZlY3RvcikgeyB3cml0ZVZhckludCh2ZWN0b3IubGVuZ3RoKTsgdmVjdG9yLmZvckVhY2god3JpdGVWYXJTbGljZSkgfVxuXG4gIHdyaXRlSW50MzIodGhpcy52ZXJzaW9uKVxuXG4gIHZhciBoYXNXaXRuZXNzZXMgPSBfX2FsbG93V2l0bmVzcyAmJiB0aGlzLmhhc1dpdG5lc3NlcygpXG5cbiAgaWYgKGhhc1dpdG5lc3Nlcykge1xuICAgIHdyaXRlVUludDgoVHJhbnNhY3Rpb24uQURWQU5DRURfVFJBTlNBQ1RJT05fTUFSS0VSKVxuICAgIHdyaXRlVUludDgoVHJhbnNhY3Rpb24uQURWQU5DRURfVFJBTlNBQ1RJT05fRkxBRylcbiAgfVxuXG4gIHdyaXRlVmFySW50KHRoaXMuaW5zLmxlbmd0aClcblxuICB0aGlzLmlucy5mb3JFYWNoKGZ1bmN0aW9uICh0eEluKSB7XG4gICAgd3JpdGVTbGljZSh0eEluLmhhc2gpXG4gICAgd3JpdGVVSW50MzIodHhJbi5pbmRleClcbiAgICB3cml0ZVZhclNsaWNlKHR4SW4uc2NyaXB0KVxuICAgIHdyaXRlVUludDMyKHR4SW4uc2VxdWVuY2UpXG4gIH0pXG5cbiAgd3JpdGVWYXJJbnQodGhpcy5vdXRzLmxlbmd0aClcbiAgdGhpcy5vdXRzLmZvckVhY2goZnVuY3Rpb24gKHR4T3V0KSB7XG4gICAgaWYgKCF0eE91dC52YWx1ZUJ1ZmZlcikge1xuICAgICAgd3JpdGVVSW50NjQodHhPdXQudmFsdWUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHdyaXRlU2xpY2UodHhPdXQudmFsdWVCdWZmZXIpXG4gICAgfVxuXG4gICAgd3JpdGVWYXJTbGljZSh0eE91dC5zY3JpcHQpXG4gIH0pXG5cbiAgaWYgKGhhc1dpdG5lc3Nlcykge1xuICAgIHRoaXMuaW5zLmZvckVhY2goZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgICB3cml0ZVZlY3RvcihpbnB1dC53aXRuZXNzKVxuICAgIH0pXG4gIH1cblxuICB3cml0ZVVJbnQzMih0aGlzLmxvY2t0aW1lKVxuXG4gIC8vIGF2b2lkIHNsaWNpbmcgdW5sZXNzIG5lY2Vzc2FyeVxuICBpZiAoaW5pdGlhbE9mZnNldCAhPT0gdW5kZWZpbmVkKSByZXR1cm4gYnVmZmVyLnNsaWNlKGluaXRpYWxPZmZzZXQsIG9mZnNldClcbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5UcmFuc2FjdGlvbi5wcm90b3R5cGUudG9IZXggPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnRvQnVmZmVyKCkudG9TdHJpbmcoJ2hleCcpXG59XG5cblRyYW5zYWN0aW9uLnByb3RvdHlwZS5zZXRJbnB1dFNjcmlwdCA9IGZ1bmN0aW9uIChpbmRleCwgc2NyaXB0U2lnKSB7XG4gIHR5cGVmb3JjZSh0eXBlcy50dXBsZSh0eXBlcy5OdW1iZXIsIHR5cGVzLkJ1ZmZlciksIGFyZ3VtZW50cylcblxuICB0aGlzLmluc1tpbmRleF0uc2NyaXB0ID0gc2NyaXB0U2lnXG59XG5cblRyYW5zYWN0aW9uLnByb3RvdHlwZS5zZXRXaXRuZXNzID0gZnVuY3Rpb24gKGluZGV4LCB3aXRuZXNzKSB7XG4gIHR5cGVmb3JjZSh0eXBlcy50dXBsZSh0eXBlcy5OdW1iZXIsIFt0eXBlcy5CdWZmZXJdKSwgYXJndW1lbnRzKVxuXG4gIHRoaXMuaW5zW2luZGV4XS53aXRuZXNzID0gd2l0bmVzc1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYW5zYWN0aW9uXG4iLCJ2YXIgQnVmZmVyID0gcmVxdWlyZSgnc2FmZS1idWZmZXInKS5CdWZmZXJcbnZhciBiYWRkcmVzcyA9IHJlcXVpcmUoJy4vYWRkcmVzcycpXG52YXIgYmNyeXB0byA9IHJlcXVpcmUoJy4vY3J5cHRvJylcbnZhciBic2NyaXB0ID0gcmVxdWlyZSgnLi9zY3JpcHQnKVxudmFyIGJ0ZW1wbGF0ZXMgPSByZXF1aXJlKCcuL3RlbXBsYXRlcycpXG52YXIgbmV0d29ya3MgPSByZXF1aXJlKCcuL25ldHdvcmtzJylcbnZhciBvcHMgPSByZXF1aXJlKCdiaXRjb2luLW9wcycpXG52YXIgdHlwZWZvcmNlID0gcmVxdWlyZSgndHlwZWZvcmNlJylcbnZhciB0eXBlcyA9IHJlcXVpcmUoJy4vdHlwZXMnKVxudmFyIHNjcmlwdFR5cGVzID0gYnRlbXBsYXRlcy50eXBlc1xudmFyIFNJR05BQkxFID0gW2J0ZW1wbGF0ZXMudHlwZXMuUDJQS0gsIGJ0ZW1wbGF0ZXMudHlwZXMuUDJQSywgYnRlbXBsYXRlcy50eXBlcy5NVUxUSVNJR11cbnZhciBQMlNIID0gU0lHTkFCTEUuY29uY2F0KFtidGVtcGxhdGVzLnR5cGVzLlAyV1BLSCwgYnRlbXBsYXRlcy50eXBlcy5QMldTSF0pXG5cbnZhciBFQ1BhaXIgPSByZXF1aXJlKCcuL2VjcGFpcicpXG52YXIgRUNTaWduYXR1cmUgPSByZXF1aXJlKCcuL2Vjc2lnbmF0dXJlJylcbnZhciBUcmFuc2FjdGlvbiA9IHJlcXVpcmUoJy4vdHJhbnNhY3Rpb24nKVxuXG5mdW5jdGlvbiBzdXBwb3J0ZWRUeXBlICh0eXBlKSB7XG4gIHJldHVybiBTSUdOQUJMRS5pbmRleE9mKHR5cGUpICE9PSAtMVxufVxuXG5mdW5jdGlvbiBzdXBwb3J0ZWRQMlNIVHlwZSAodHlwZSkge1xuICByZXR1cm4gUDJTSC5pbmRleE9mKHR5cGUpICE9PSAtMVxufVxuXG5mdW5jdGlvbiBleHRyYWN0Q2h1bmtzICh0eXBlLCBjaHVua3MsIHNjcmlwdCkge1xuICB2YXIgcHViS2V5cyA9IFtdXG4gIHZhciBzaWduYXR1cmVzID0gW11cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBzY3JpcHRUeXBlcy5QMlBLSDpcbiAgICAgIC8vIGlmIChyZWRlZW1TY3JpcHQpIHRocm93IG5ldyBFcnJvcignTm9uc3RhbmRhcmQuLi4gUDJTSChQMlBLSCknKVxuICAgICAgcHViS2V5cyA9IGNodW5rcy5zbGljZSgxKVxuICAgICAgc2lnbmF0dXJlcyA9IGNodW5rcy5zbGljZSgwLCAxKVxuICAgICAgYnJlYWtcblxuICAgIGNhc2Ugc2NyaXB0VHlwZXMuUDJQSzpcbiAgICAgIHB1YktleXNbMF0gPSBzY3JpcHQgPyBidGVtcGxhdGVzLnB1YktleS5vdXRwdXQuZGVjb2RlKHNjcmlwdCkgOiB1bmRlZmluZWRcbiAgICAgIHNpZ25hdHVyZXMgPSBjaHVua3Muc2xpY2UoMCwgMSlcbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlIHNjcmlwdFR5cGVzLk1VTFRJU0lHOlxuICAgICAgaWYgKHNjcmlwdCkge1xuICAgICAgICB2YXIgbXVsdGlzaWcgPSBidGVtcGxhdGVzLm11bHRpc2lnLm91dHB1dC5kZWNvZGUoc2NyaXB0KVxuICAgICAgICBwdWJLZXlzID0gbXVsdGlzaWcucHViS2V5c1xuICAgICAgfVxuXG4gICAgICBzaWduYXR1cmVzID0gY2h1bmtzLnNsaWNlKDEpLm1hcChmdW5jdGlvbiAoY2h1bmspIHtcbiAgICAgICAgcmV0dXJuIGNodW5rLmxlbmd0aCA9PT0gMCA/IHVuZGVmaW5lZCA6IGNodW5rXG4gICAgICB9KVxuICAgICAgYnJlYWtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcHViS2V5czogcHViS2V5cyxcbiAgICBzaWduYXR1cmVzOiBzaWduYXR1cmVzXG4gIH1cbn1cbmZ1bmN0aW9uIGV4cGFuZElucHV0IChzY3JpcHRTaWcsIHdpdG5lc3NTdGFjaykge1xuICBpZiAoc2NyaXB0U2lnLmxlbmd0aCA9PT0gMCAmJiB3aXRuZXNzU3RhY2subGVuZ3RoID09PSAwKSByZXR1cm4ge31cblxuICB2YXIgcHJldk91dFNjcmlwdFxuICB2YXIgcHJldk91dFR5cGVcbiAgdmFyIHNjcmlwdFR5cGVcbiAgdmFyIHNjcmlwdFxuICB2YXIgcmVkZWVtU2NyaXB0XG4gIHZhciB3aXRuZXNzU2NyaXB0XG4gIHZhciB3aXRuZXNzU2NyaXB0VHlwZVxuICB2YXIgcmVkZWVtU2NyaXB0VHlwZVxuICB2YXIgd2l0bmVzcyA9IGZhbHNlXG4gIHZhciBwMndzaCA9IGZhbHNlXG4gIHZhciBwMnNoID0gZmFsc2VcbiAgdmFyIHdpdG5lc3NQcm9ncmFtXG4gIHZhciBjaHVua3NcblxuICB2YXIgc2NyaXB0U2lnQ2h1bmtzID0gYnNjcmlwdC5kZWNvbXBpbGUoc2NyaXB0U2lnKVxuICB2YXIgc2lnVHlwZSA9IGJ0ZW1wbGF0ZXMuY2xhc3NpZnlJbnB1dChzY3JpcHRTaWdDaHVua3MsIHRydWUpXG4gIGlmIChzaWdUeXBlID09PSBzY3JpcHRUeXBlcy5QMlNIKSB7XG4gICAgcDJzaCA9IHRydWVcbiAgICByZWRlZW1TY3JpcHQgPSBzY3JpcHRTaWdDaHVua3Nbc2NyaXB0U2lnQ2h1bmtzLmxlbmd0aCAtIDFdXG4gICAgcmVkZWVtU2NyaXB0VHlwZSA9IGJ0ZW1wbGF0ZXMuY2xhc3NpZnlPdXRwdXQocmVkZWVtU2NyaXB0KVxuICAgIHByZXZPdXRTY3JpcHQgPSBidGVtcGxhdGVzLnNjcmlwdEhhc2gub3V0cHV0LmVuY29kZShiY3J5cHRvLmhhc2gxNjAocmVkZWVtU2NyaXB0KSlcbiAgICBwcmV2T3V0VHlwZSA9IHNjcmlwdFR5cGVzLlAyU0hcbiAgICBzY3JpcHQgPSByZWRlZW1TY3JpcHRcbiAgfVxuXG4gIHZhciBjbGFzc2lmeVdpdG5lc3MgPSBidGVtcGxhdGVzLmNsYXNzaWZ5V2l0bmVzcyh3aXRuZXNzU3RhY2ssIHRydWUpXG4gIGlmIChjbGFzc2lmeVdpdG5lc3MgPT09IHNjcmlwdFR5cGVzLlAyV1NIKSB7XG4gICAgd2l0bmVzc1NjcmlwdCA9IHdpdG5lc3NTdGFja1t3aXRuZXNzU3RhY2subGVuZ3RoIC0gMV1cbiAgICB3aXRuZXNzU2NyaXB0VHlwZSA9IGJ0ZW1wbGF0ZXMuY2xhc3NpZnlPdXRwdXQod2l0bmVzc1NjcmlwdClcbiAgICBwMndzaCA9IHRydWVcbiAgICB3aXRuZXNzID0gdHJ1ZVxuICAgIGlmIChzY3JpcHRTaWcubGVuZ3RoID09PSAwKSB7XG4gICAgICBwcmV2T3V0U2NyaXB0ID0gYnRlbXBsYXRlcy53aXRuZXNzU2NyaXB0SGFzaC5vdXRwdXQuZW5jb2RlKGJjcnlwdG8uc2hhMjU2KHdpdG5lc3NTY3JpcHQpKVxuICAgICAgcHJldk91dFR5cGUgPSBzY3JpcHRUeXBlcy5QMldTSFxuICAgICAgaWYgKHJlZGVlbVNjcmlwdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignUmVkZWVtIHNjcmlwdCBnaXZlbiB3aGVuIHVubmVjZXNzYXJ5JylcbiAgICAgIH1cbiAgICAgIC8vIGJhcmUgd2l0bmVzc1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoIXJlZGVlbVNjcmlwdCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHJlZGVlbVNjcmlwdCBwcm92aWRlZCBmb3IgUDJXU0gsIGJ1dCBzY3JpcHRTaWcgbm9uLWVtcHR5JylcbiAgICAgIH1cbiAgICAgIHdpdG5lc3NQcm9ncmFtID0gYnRlbXBsYXRlcy53aXRuZXNzU2NyaXB0SGFzaC5vdXRwdXQuZW5jb2RlKGJjcnlwdG8uc2hhMjU2KHdpdG5lc3NTY3JpcHQpKVxuICAgICAgaWYgKCFyZWRlZW1TY3JpcHQuZXF1YWxzKHdpdG5lc3NQcm9ncmFtKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZGVlbSBzY3JpcHQgZGlkblxcJ3QgbWF0Y2ggd2l0bmVzc1NjcmlwdCcpXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFzdXBwb3J0ZWRUeXBlKGJ0ZW1wbGF0ZXMuY2xhc3NpZnlPdXRwdXQod2l0bmVzc1NjcmlwdCkpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Vuc3VwcG9ydGVkIHdpdG5lc3Mgc2NyaXB0JylcbiAgICB9XG5cbiAgICBzY3JpcHQgPSB3aXRuZXNzU2NyaXB0XG4gICAgc2NyaXB0VHlwZSA9IHdpdG5lc3NTY3JpcHRUeXBlXG4gICAgY2h1bmtzID0gd2l0bmVzc1N0YWNrLnNsaWNlKDAsIC0xKVxuICB9IGVsc2UgaWYgKGNsYXNzaWZ5V2l0bmVzcyA9PT0gc2NyaXB0VHlwZXMuUDJXUEtIKSB7XG4gICAgd2l0bmVzcyA9IHRydWVcbiAgICB2YXIga2V5ID0gd2l0bmVzc1N0YWNrW3dpdG5lc3NTdGFjay5sZW5ndGggLSAxXVxuICAgIHZhciBrZXlIYXNoID0gYmNyeXB0by5oYXNoMTYwKGtleSlcbiAgICBpZiAoc2NyaXB0U2lnLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcHJldk91dFNjcmlwdCA9IGJ0ZW1wbGF0ZXMud2l0bmVzc1B1YktleUhhc2gub3V0cHV0LmVuY29kZShrZXlIYXNoKVxuICAgICAgcHJldk91dFR5cGUgPSBzY3JpcHRUeXBlcy5QMldQS0hcbiAgICAgIGlmICh0eXBlb2YgcmVkZWVtU2NyaXB0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZGVlbSBzY3JpcHQgZ2l2ZW4gd2hlbiB1bm5lY2Vzc2FyeScpXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICghcmVkZWVtU2NyaXB0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTm8gcmVkZWVtU2NyaXB0IHByb3ZpZGVkIGZvciBQMldQS0gsIGJ1dCBzY3JpcHRTaWcgd2FzblxcJ3QgZW1wdHknKVxuICAgICAgfVxuICAgICAgd2l0bmVzc1Byb2dyYW0gPSBidGVtcGxhdGVzLndpdG5lc3NQdWJLZXlIYXNoLm91dHB1dC5lbmNvZGUoa2V5SGFzaClcbiAgICAgIGlmICghcmVkZWVtU2NyaXB0LmVxdWFscyh3aXRuZXNzUHJvZ3JhbSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWRlZW0gc2NyaXB0IGRpZCBub3QgaGF2ZSB0aGUgcmlnaHQgd2l0bmVzcyBwcm9ncmFtJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzY3JpcHRUeXBlID0gc2NyaXB0VHlwZXMuUDJQS0hcbiAgICBjaHVua3MgPSB3aXRuZXNzU3RhY2tcbiAgfSBlbHNlIGlmIChyZWRlZW1TY3JpcHQpIHtcbiAgICBpZiAoIXN1cHBvcnRlZFAyU0hUeXBlKHJlZGVlbVNjcmlwdFR5cGUpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCByZWRlZW1zY3JpcHQhJylcbiAgICB9XG5cbiAgICBzY3JpcHQgPSByZWRlZW1TY3JpcHRcbiAgICBzY3JpcHRUeXBlID0gcmVkZWVtU2NyaXB0VHlwZVxuICAgIGNodW5rcyA9IHNjcmlwdFNpZ0NodW5rcy5zbGljZSgwLCAtMSlcbiAgfSBlbHNlIHtcbiAgICBwcmV2T3V0VHlwZSA9IHNjcmlwdFR5cGUgPSBidGVtcGxhdGVzLmNsYXNzaWZ5SW5wdXQoc2NyaXB0U2lnKVxuICAgIGNodW5rcyA9IHNjcmlwdFNpZ0NodW5rc1xuICB9XG5cbiAgdmFyIGV4cGFuZGVkID0gZXh0cmFjdENodW5rcyhzY3JpcHRUeXBlLCBjaHVua3MsIHNjcmlwdClcblxuICB2YXIgcmVzdWx0ID0ge1xuICAgIHB1YktleXM6IGV4cGFuZGVkLnB1YktleXMsXG4gICAgc2lnbmF0dXJlczogZXhwYW5kZWQuc2lnbmF0dXJlcyxcbiAgICBwcmV2T3V0U2NyaXB0OiBwcmV2T3V0U2NyaXB0LFxuICAgIHByZXZPdXRUeXBlOiBwcmV2T3V0VHlwZSxcbiAgICBzaWduVHlwZTogc2NyaXB0VHlwZSxcbiAgICBzaWduU2NyaXB0OiBzY3JpcHQsXG4gICAgd2l0bmVzczogQm9vbGVhbih3aXRuZXNzKVxuICB9XG5cbiAgaWYgKHAyc2gpIHtcbiAgICByZXN1bHQucmVkZWVtU2NyaXB0ID0gcmVkZWVtU2NyaXB0XG4gICAgcmVzdWx0LnJlZGVlbVNjcmlwdFR5cGUgPSByZWRlZW1TY3JpcHRUeXBlXG4gIH1cblxuICBpZiAocDJ3c2gpIHtcbiAgICByZXN1bHQud2l0bmVzc1NjcmlwdCA9IHdpdG5lc3NTY3JpcHRcbiAgICByZXN1bHQud2l0bmVzc1NjcmlwdFR5cGUgPSB3aXRuZXNzU2NyaXB0VHlwZVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG4vLyBjb3VsZCBiZSBkb25lIGluIGV4cGFuZElucHV0LCBidXQgcmVxdWlyZXMgdGhlIG9yaWdpbmFsIFRyYW5zYWN0aW9uIGZvciBoYXNoRm9yU2lnbmF0dXJlXG5mdW5jdGlvbiBmaXhNdWx0aXNpZ09yZGVyIChpbnB1dCwgdHJhbnNhY3Rpb24sIHZpbikge1xuICBpZiAoaW5wdXQucmVkZWVtU2NyaXB0VHlwZSAhPT0gc2NyaXB0VHlwZXMuTVVMVElTSUcgfHwgIWlucHV0LnJlZGVlbVNjcmlwdCkgcmV0dXJuXG4gIGlmIChpbnB1dC5wdWJLZXlzLmxlbmd0aCA9PT0gaW5wdXQuc2lnbmF0dXJlcy5sZW5ndGgpIHJldHVyblxuXG4gIHZhciB1bm1hdGNoZWQgPSBpbnB1dC5zaWduYXR1cmVzLmNvbmNhdCgpXG5cbiAgaW5wdXQuc2lnbmF0dXJlcyA9IGlucHV0LnB1YktleXMubWFwKGZ1bmN0aW9uIChwdWJLZXkpIHtcbiAgICB2YXIga2V5UGFpciA9IEVDUGFpci5mcm9tUHVibGljS2V5QnVmZmVyKHB1YktleSlcbiAgICB2YXIgbWF0Y2hcblxuICAgIC8vIGNoZWNrIGZvciBhIHNpZ25hdHVyZVxuICAgIHVubWF0Y2hlZC5zb21lKGZ1bmN0aW9uIChzaWduYXR1cmUsIGkpIHtcbiAgICAgIC8vIHNraXAgaWYgdW5kZWZpbmVkIHx8IE9QXzBcbiAgICAgIGlmICghc2lnbmF0dXJlKSByZXR1cm4gZmFsc2VcblxuICAgICAgLy8gVE9ETzogYXZvaWQgTyhuKSBoYXNoRm9yU2lnbmF0dXJlXG4gICAgICB2YXIgcGFyc2VkID0gRUNTaWduYXR1cmUucGFyc2VTY3JpcHRTaWduYXR1cmUoc2lnbmF0dXJlKVxuICAgICAgdmFyIGhhc2ggPSB0cmFuc2FjdGlvbi5oYXNoRm9yU2lnbmF0dXJlKHZpbiwgaW5wdXQucmVkZWVtU2NyaXB0LCBwYXJzZWQuaGFzaFR5cGUpXG5cbiAgICAgIC8vIHNraXAgaWYgc2lnbmF0dXJlIGRvZXMgbm90IG1hdGNoIHB1YktleVxuICAgICAgaWYgKCFrZXlQYWlyLnZlcmlmeShoYXNoLCBwYXJzZWQuc2lnbmF0dXJlKSkgcmV0dXJuIGZhbHNlXG5cbiAgICAgIC8vIHJlbW92ZSBtYXRjaGVkIHNpZ25hdHVyZSBmcm9tIHVubWF0Y2hlZFxuICAgICAgdW5tYXRjaGVkW2ldID0gdW5kZWZpbmVkXG4gICAgICBtYXRjaCA9IHNpZ25hdHVyZVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH0pXG5cbiAgICByZXR1cm4gbWF0Y2hcbiAgfSlcbn1cblxuZnVuY3Rpb24gZXhwYW5kT3V0cHV0IChzY3JpcHQsIHNjcmlwdFR5cGUsIG91clB1YktleSkge1xuICB0eXBlZm9yY2UodHlwZXMuQnVmZmVyLCBzY3JpcHQpXG5cbiAgdmFyIHNjcmlwdENodW5rcyA9IGJzY3JpcHQuZGVjb21waWxlKHNjcmlwdClcbiAgaWYgKCFzY3JpcHRUeXBlKSB7XG4gICAgc2NyaXB0VHlwZSA9IGJ0ZW1wbGF0ZXMuY2xhc3NpZnlPdXRwdXQoc2NyaXB0KVxuICB9XG5cbiAgdmFyIHB1YktleXMgPSBbXVxuXG4gIHN3aXRjaCAoc2NyaXB0VHlwZSkge1xuICAgIC8vIGRvZXMgb3VyIGhhc2gxNjAocHViS2V5KSBtYXRjaCB0aGUgb3V0cHV0IHNjcmlwdHM/XG4gICAgY2FzZSBzY3JpcHRUeXBlcy5QMlBLSDpcbiAgICAgIGlmICghb3VyUHViS2V5KSBicmVha1xuXG4gICAgICB2YXIgcGtoMSA9IHNjcmlwdENodW5rc1syXVxuICAgICAgdmFyIHBraDIgPSBiY3J5cHRvLmhhc2gxNjAob3VyUHViS2V5KVxuICAgICAgaWYgKHBraDEuZXF1YWxzKHBraDIpKSBwdWJLZXlzID0gW291clB1YktleV1cbiAgICAgIGJyZWFrXG5cbiAgICAvLyBkb2VzIG91ciBoYXNoMTYwKHB1YktleSkgbWF0Y2ggdGhlIG91dHB1dCBzY3JpcHRzP1xuICAgIGNhc2Ugc2NyaXB0VHlwZXMuUDJXUEtIOlxuICAgICAgaWYgKCFvdXJQdWJLZXkpIGJyZWFrXG5cbiAgICAgIHZhciB3cGtoMSA9IHNjcmlwdENodW5rc1sxXVxuICAgICAgdmFyIHdwa2gyID0gYmNyeXB0by5oYXNoMTYwKG91clB1YktleSlcbiAgICAgIGlmICh3cGtoMS5lcXVhbHMod3BraDIpKSBwdWJLZXlzID0gW291clB1YktleV1cbiAgICAgIGJyZWFrXG5cbiAgICBjYXNlIHNjcmlwdFR5cGVzLlAyUEs6XG4gICAgICBwdWJLZXlzID0gc2NyaXB0Q2h1bmtzLnNsaWNlKDAsIDEpXG4gICAgICBicmVha1xuXG4gICAgY2FzZSBzY3JpcHRUeXBlcy5NVUxUSVNJRzpcbiAgICAgIHB1YktleXMgPSBzY3JpcHRDaHVua3Muc2xpY2UoMSwgLTIpXG4gICAgICBicmVha1xuXG4gICAgZGVmYXVsdDogcmV0dXJuIHsgc2NyaXB0VHlwZTogc2NyaXB0VHlwZSB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHB1YktleXM6IHB1YktleXMsXG4gICAgc2NyaXB0VHlwZTogc2NyaXB0VHlwZSxcbiAgICBzaWduYXR1cmVzOiBwdWJLZXlzLm1hcChmdW5jdGlvbiAoKSB7IHJldHVybiB1bmRlZmluZWQgfSlcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1AyU0hJbnB1dCAoaW5wdXQsIHJlZGVlbVNjcmlwdEhhc2gpIHtcbiAgaWYgKGlucHV0LnByZXZPdXRUeXBlKSB7XG4gICAgaWYgKGlucHV0LnByZXZPdXRUeXBlICE9PSBzY3JpcHRUeXBlcy5QMlNIKSB0aHJvdyBuZXcgRXJyb3IoJ1ByZXZPdXRTY3JpcHQgbXVzdCBiZSBQMlNIJylcblxuICAgIHZhciBwcmV2T3V0U2NyaXB0U2NyaXB0SGFzaCA9IGJzY3JpcHQuZGVjb21waWxlKGlucHV0LnByZXZPdXRTY3JpcHQpWzFdXG4gICAgaWYgKCFwcmV2T3V0U2NyaXB0U2NyaXB0SGFzaC5lcXVhbHMocmVkZWVtU2NyaXB0SGFzaCkpIHRocm93IG5ldyBFcnJvcignSW5jb25zaXN0ZW50IGhhc2gxNjAoUmVkZWVtU2NyaXB0KScpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tQMldTSElucHV0IChpbnB1dCwgd2l0bmVzc1NjcmlwdEhhc2gpIHtcbiAgaWYgKGlucHV0LnByZXZPdXRUeXBlKSB7XG4gICAgaWYgKGlucHV0LnByZXZPdXRUeXBlICE9PSBzY3JpcHRUeXBlcy5QMldTSCkgdGhyb3cgbmV3IEVycm9yKCdQcmV2T3V0U2NyaXB0IG11c3QgYmUgUDJXU0gnKVxuXG4gICAgdmFyIHNjcmlwdEhhc2ggPSBic2NyaXB0LmRlY29tcGlsZShpbnB1dC5wcmV2T3V0U2NyaXB0KVsxXVxuICAgIGlmICghc2NyaXB0SGFzaC5lcXVhbHMod2l0bmVzc1NjcmlwdEhhc2gpKSB0aHJvdyBuZXcgRXJyb3IoJ0luY29uc2lzdGVudCBzaGEyNShXaXRuZXNzU2NyaXB0KScpXG4gIH1cbn1cblxuZnVuY3Rpb24gcHJlcGFyZUlucHV0IChpbnB1dCwga3BQdWJLZXksIHJlZGVlbVNjcmlwdCwgd2l0bmVzc1ZhbHVlLCB3aXRuZXNzU2NyaXB0KSB7XG4gIHZhciBleHBhbmRlZFxuICB2YXIgcHJldk91dFR5cGVcbiAgdmFyIHByZXZPdXRTY3JpcHRcblxuICB2YXIgcDJzaCA9IGZhbHNlXG4gIHZhciBwMnNoVHlwZVxuICB2YXIgcmVkZWVtU2NyaXB0SGFzaFxuXG4gIHZhciB3aXRuZXNzID0gZmFsc2VcbiAgdmFyIHAyd3NoID0gZmFsc2VcbiAgdmFyIHdpdG5lc3NUeXBlXG4gIHZhciB3aXRuZXNzU2NyaXB0SGFzaFxuXG4gIHZhciBzaWduVHlwZVxuICB2YXIgc2lnblNjcmlwdFxuXG4gIGlmIChyZWRlZW1TY3JpcHQgJiYgd2l0bmVzc1NjcmlwdCkge1xuICAgIHJlZGVlbVNjcmlwdEhhc2ggPSBiY3J5cHRvLmhhc2gxNjAocmVkZWVtU2NyaXB0KVxuICAgIHdpdG5lc3NTY3JpcHRIYXNoID0gYmNyeXB0by5zaGEyNTYod2l0bmVzc1NjcmlwdClcbiAgICBjaGVja1AyU0hJbnB1dChpbnB1dCwgcmVkZWVtU2NyaXB0SGFzaClcblxuICAgIGlmICghcmVkZWVtU2NyaXB0LmVxdWFscyhidGVtcGxhdGVzLndpdG5lc3NTY3JpcHRIYXNoLm91dHB1dC5lbmNvZGUod2l0bmVzc1NjcmlwdEhhc2gpKSkgdGhyb3cgbmV3IEVycm9yKCdXaXRuZXNzIHNjcmlwdCBpbmNvbnNpc3RlbnQgd2l0aCByZWRlZW0gc2NyaXB0JylcblxuICAgIGV4cGFuZGVkID0gZXhwYW5kT3V0cHV0KHdpdG5lc3NTY3JpcHQsIHVuZGVmaW5lZCwga3BQdWJLZXkpXG4gICAgaWYgKCFleHBhbmRlZC5wdWJLZXlzKSB0aHJvdyBuZXcgRXJyb3IoJ1dpdG5lc3NTY3JpcHQgbm90IHN1cHBvcnRlZCBcIicgKyBic2NyaXB0LnRvQVNNKHJlZGVlbVNjcmlwdCkgKyAnXCInKVxuXG4gICAgcHJldk91dFR5cGUgPSBidGVtcGxhdGVzLnR5cGVzLlAyU0hcbiAgICBwcmV2T3V0U2NyaXB0ID0gYnRlbXBsYXRlcy5zY3JpcHRIYXNoLm91dHB1dC5lbmNvZGUocmVkZWVtU2NyaXB0SGFzaClcbiAgICBwMnNoID0gd2l0bmVzcyA9IHAyd3NoID0gdHJ1ZVxuICAgIHAyc2hUeXBlID0gYnRlbXBsYXRlcy50eXBlcy5QMldTSFxuICAgIHNpZ25UeXBlID0gd2l0bmVzc1R5cGUgPSBleHBhbmRlZC5zY3JpcHRUeXBlXG4gICAgc2lnblNjcmlwdCA9IHdpdG5lc3NTY3JpcHRcbiAgfSBlbHNlIGlmIChyZWRlZW1TY3JpcHQpIHtcbiAgICByZWRlZW1TY3JpcHRIYXNoID0gYmNyeXB0by5oYXNoMTYwKHJlZGVlbVNjcmlwdClcbiAgICBjaGVja1AyU0hJbnB1dChpbnB1dCwgcmVkZWVtU2NyaXB0SGFzaClcblxuICAgIGV4cGFuZGVkID0gZXhwYW5kT3V0cHV0KHJlZGVlbVNjcmlwdCwgdW5kZWZpbmVkLCBrcFB1YktleSlcbiAgICBpZiAoIWV4cGFuZGVkLnB1YktleXMpIHRocm93IG5ldyBFcnJvcignUmVkZWVtU2NyaXB0IG5vdCBzdXBwb3J0ZWQgXCInICsgYnNjcmlwdC50b0FTTShyZWRlZW1TY3JpcHQpICsgJ1wiJylcblxuICAgIHByZXZPdXRUeXBlID0gYnRlbXBsYXRlcy50eXBlcy5QMlNIXG4gICAgcHJldk91dFNjcmlwdCA9IGJ0ZW1wbGF0ZXMuc2NyaXB0SGFzaC5vdXRwdXQuZW5jb2RlKHJlZGVlbVNjcmlwdEhhc2gpXG4gICAgcDJzaCA9IHRydWVcbiAgICBzaWduVHlwZSA9IHAyc2hUeXBlID0gZXhwYW5kZWQuc2NyaXB0VHlwZVxuICAgIHNpZ25TY3JpcHQgPSByZWRlZW1TY3JpcHRcbiAgICB3aXRuZXNzID0gc2lnblR5cGUgPT09IGJ0ZW1wbGF0ZXMudHlwZXMuUDJXUEtIXG4gIH0gZWxzZSBpZiAod2l0bmVzc1NjcmlwdCkge1xuICAgIHdpdG5lc3NTY3JpcHRIYXNoID0gYmNyeXB0by5zaGEyNTYod2l0bmVzc1NjcmlwdClcbiAgICBjaGVja1AyV1NISW5wdXQoaW5wdXQsIHdpdG5lc3NTY3JpcHRIYXNoKVxuXG4gICAgZXhwYW5kZWQgPSBleHBhbmRPdXRwdXQod2l0bmVzc1NjcmlwdCwgdW5kZWZpbmVkLCBrcFB1YktleSlcbiAgICBpZiAoIWV4cGFuZGVkLnB1YktleXMpIHRocm93IG5ldyBFcnJvcignV2l0bmVzc1NjcmlwdCBub3Qgc3VwcG9ydGVkIFwiJyArIGJzY3JpcHQudG9BU00ocmVkZWVtU2NyaXB0KSArICdcIicpXG5cbiAgICBwcmV2T3V0VHlwZSA9IGJ0ZW1wbGF0ZXMudHlwZXMuUDJXU0hcbiAgICBwcmV2T3V0U2NyaXB0ID0gYnRlbXBsYXRlcy53aXRuZXNzU2NyaXB0SGFzaC5vdXRwdXQuZW5jb2RlKHdpdG5lc3NTY3JpcHRIYXNoKVxuICAgIHdpdG5lc3MgPSBwMndzaCA9IHRydWVcbiAgICBzaWduVHlwZSA9IHdpdG5lc3NUeXBlID0gZXhwYW5kZWQuc2NyaXB0VHlwZVxuICAgIHNpZ25TY3JpcHQgPSB3aXRuZXNzU2NyaXB0XG4gIH0gZWxzZSBpZiAoaW5wdXQucHJldk91dFR5cGUpIHtcbiAgICAvLyBlbWJlZGRlZCBzY3JpcHRzIGFyZSBub3QgcG9zc2libGUgd2l0aG91dCBhIHJlZGVlbVNjcmlwdFxuICAgIGlmIChpbnB1dC5wcmV2T3V0VHlwZSA9PT0gc2NyaXB0VHlwZXMuUDJTSCB8fFxuICAgICAgaW5wdXQucHJldk91dFR5cGUgPT09IHNjcmlwdFR5cGVzLlAyV1NIKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ByZXZPdXRTY3JpcHQgaXMgJyArIGlucHV0LnByZXZPdXRUeXBlICsgJywgcmVxdWlyZXMgcmVkZWVtU2NyaXB0JylcbiAgICB9XG5cbiAgICBwcmV2T3V0VHlwZSA9IGlucHV0LnByZXZPdXRUeXBlXG4gICAgcHJldk91dFNjcmlwdCA9IGlucHV0LnByZXZPdXRTY3JpcHRcbiAgICBleHBhbmRlZCA9IGV4cGFuZE91dHB1dChpbnB1dC5wcmV2T3V0U2NyaXB0LCBpbnB1dC5wcmV2T3V0VHlwZSwga3BQdWJLZXkpXG4gICAgaWYgKCFleHBhbmRlZC5wdWJLZXlzKSByZXR1cm5cblxuICAgIHdpdG5lc3MgPSAoaW5wdXQucHJldk91dFR5cGUgPT09IHNjcmlwdFR5cGVzLlAyV1BLSClcbiAgICBzaWduVHlwZSA9IHByZXZPdXRUeXBlXG4gICAgc2lnblNjcmlwdCA9IHByZXZPdXRTY3JpcHRcbiAgfSBlbHNlIHtcbiAgICBwcmV2T3V0U2NyaXB0ID0gYnRlbXBsYXRlcy5wdWJLZXlIYXNoLm91dHB1dC5lbmNvZGUoYmNyeXB0by5oYXNoMTYwKGtwUHViS2V5KSlcbiAgICBleHBhbmRlZCA9IGV4cGFuZE91dHB1dChwcmV2T3V0U2NyaXB0LCBzY3JpcHRUeXBlcy5QMlBLSCwga3BQdWJLZXkpXG5cbiAgICBwcmV2T3V0VHlwZSA9IHNjcmlwdFR5cGVzLlAyUEtIXG4gICAgd2l0bmVzcyA9IGZhbHNlXG4gICAgc2lnblR5cGUgPSBwcmV2T3V0VHlwZVxuICAgIHNpZ25TY3JpcHQgPSBwcmV2T3V0U2NyaXB0XG4gIH1cblxuICBpZiAoc2lnblR5cGUgPT09IHNjcmlwdFR5cGVzLlAyV1BLSCkge1xuICAgIHNpZ25TY3JpcHQgPSBidGVtcGxhdGVzLnB1YktleUhhc2gub3V0cHV0LmVuY29kZShidGVtcGxhdGVzLndpdG5lc3NQdWJLZXlIYXNoLm91dHB1dC5kZWNvZGUoc2lnblNjcmlwdCkpXG4gIH1cblxuICBpZiAocDJzaCkge1xuICAgIGlucHV0LnJlZGVlbVNjcmlwdCA9IHJlZGVlbVNjcmlwdFxuICAgIGlucHV0LnJlZGVlbVNjcmlwdFR5cGUgPSBwMnNoVHlwZVxuICB9XG5cbiAgaWYgKHAyd3NoKSB7XG4gICAgaW5wdXQud2l0bmVzc1NjcmlwdCA9IHdpdG5lc3NTY3JpcHRcbiAgICBpbnB1dC53aXRuZXNzU2NyaXB0VHlwZSA9IHdpdG5lc3NUeXBlXG4gIH1cblxuICBpbnB1dC5wdWJLZXlzID0gZXhwYW5kZWQucHViS2V5c1xuICBpbnB1dC5zaWduYXR1cmVzID0gZXhwYW5kZWQuc2lnbmF0dXJlc1xuICBpbnB1dC5zaWduU2NyaXB0ID0gc2lnblNjcmlwdFxuICBpbnB1dC5zaWduVHlwZSA9IHNpZ25UeXBlXG4gIGlucHV0LnByZXZPdXRTY3JpcHQgPSBwcmV2T3V0U2NyaXB0XG4gIGlucHV0LnByZXZPdXRUeXBlID0gcHJldk91dFR5cGVcbiAgaW5wdXQud2l0bmVzcyA9IHdpdG5lc3Ncbn1cblxuZnVuY3Rpb24gYnVpbGRTdGFjayAodHlwZSwgc2lnbmF0dXJlcywgcHViS2V5cywgYWxsb3dJbmNvbXBsZXRlKSB7XG4gIGlmICh0eXBlID09PSBzY3JpcHRUeXBlcy5QMlBLSCkge1xuICAgIGlmIChzaWduYXR1cmVzLmxlbmd0aCA9PT0gMSAmJiBCdWZmZXIuaXNCdWZmZXIoc2lnbmF0dXJlc1swXSkgJiYgcHViS2V5cy5sZW5ndGggPT09IDEpIHJldHVybiBidGVtcGxhdGVzLnB1YktleUhhc2guaW5wdXQuZW5jb2RlU3RhY2soc2lnbmF0dXJlc1swXSwgcHViS2V5c1swXSlcbiAgfSBlbHNlIGlmICh0eXBlID09PSBzY3JpcHRUeXBlcy5QMlBLKSB7XG4gICAgaWYgKHNpZ25hdHVyZXMubGVuZ3RoID09PSAxICYmIEJ1ZmZlci5pc0J1ZmZlcihzaWduYXR1cmVzWzBdKSkgcmV0dXJuIGJ0ZW1wbGF0ZXMucHViS2V5LmlucHV0LmVuY29kZVN0YWNrKHNpZ25hdHVyZXNbMF0pXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gc2NyaXB0VHlwZXMuTVVMVElTSUcpIHtcbiAgICBpZiAoc2lnbmF0dXJlcy5sZW5ndGggPiAwKSB7XG4gICAgICBzaWduYXR1cmVzID0gc2lnbmF0dXJlcy5tYXAoZnVuY3Rpb24gKHNpZ25hdHVyZSkge1xuICAgICAgICByZXR1cm4gc2lnbmF0dXJlIHx8IG9wcy5PUF8wXG4gICAgICB9KVxuICAgICAgaWYgKCFhbGxvd0luY29tcGxldGUpIHtcbiAgICAgICAgLy8gcmVtb3ZlIGJsYW5rIHNpZ25hdHVyZXNcbiAgICAgICAgc2lnbmF0dXJlcyA9IHNpZ25hdHVyZXMuZmlsdGVyKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4ICE9PSBvcHMuT1BfMCB9KVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gYnRlbXBsYXRlcy5tdWx0aXNpZy5pbnB1dC5lbmNvZGVTdGFjayhzaWduYXR1cmVzKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCB5ZXQgc3VwcG9ydGVkJylcbiAgfVxuXG4gIGlmICghYWxsb3dJbmNvbXBsZXRlKSB0aHJvdyBuZXcgRXJyb3IoJ05vdCBlbm91Z2ggc2lnbmF0dXJlcyBwcm92aWRlZCcpXG4gIHJldHVybiBbXVxufVxuXG5mdW5jdGlvbiBidWlsZElucHV0IChpbnB1dCwgYWxsb3dJbmNvbXBsZXRlKSB7XG4gIHZhciBzY3JpcHRUeXBlID0gaW5wdXQucHJldk91dFR5cGVcbiAgdmFyIHNpZyA9IFtdXG4gIHZhciB3aXRuZXNzID0gW11cblxuICBpZiAoc3VwcG9ydGVkVHlwZShzY3JpcHRUeXBlKSkge1xuICAgIHNpZyA9IGJ1aWxkU3RhY2soc2NyaXB0VHlwZSwgaW5wdXQuc2lnbmF0dXJlcywgaW5wdXQucHViS2V5cywgYWxsb3dJbmNvbXBsZXRlKVxuICB9XG5cbiAgdmFyIHAyc2ggPSBmYWxzZVxuICBpZiAoc2NyaXB0VHlwZSA9PT0gYnRlbXBsYXRlcy50eXBlcy5QMlNIKSB7XG4gICAgLy8gV2UgY2FuIHJlbW92ZSB0aGlzIGVycm9yIGxhdGVyIHdoZW4gd2UgaGF2ZSBhIGd1YXJhbnRlZSBwcmVwYXJlSW5wdXRcbiAgICAvLyByZWplY3RzIHVuc2lnbmFibGUgc2NyaXB0cyAtIGl0IE1VU1QgYmUgc2lnbmFibGUgYXQgdGhpcyBwb2ludC5cbiAgICBpZiAoIWFsbG93SW5jb21wbGV0ZSAmJiAhc3VwcG9ydGVkUDJTSFR5cGUoaW5wdXQucmVkZWVtU2NyaXB0VHlwZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW1wb3NzaWJsZSB0byBzaWduIHRoaXMgdHlwZScpXG4gICAgfVxuXG4gICAgaWYgKHN1cHBvcnRlZFR5cGUoaW5wdXQucmVkZWVtU2NyaXB0VHlwZSkpIHtcbiAgICAgIHNpZyA9IGJ1aWxkU3RhY2soaW5wdXQucmVkZWVtU2NyaXB0VHlwZSwgaW5wdXQuc2lnbmF0dXJlcywgaW5wdXQucHViS2V5cywgYWxsb3dJbmNvbXBsZXRlKVxuICAgIH1cblxuICAgIC8vIElmIGl0IHdhc24ndCBTSUdOQUJMRSwgaXQncyB3aXRuZXNzLCBkZWZlciB0byB0aGF0XG4gICAgaWYgKGlucHV0LnJlZGVlbVNjcmlwdFR5cGUpIHtcbiAgICAgIHAyc2ggPSB0cnVlXG4gICAgICBzY3JpcHRUeXBlID0gaW5wdXQucmVkZWVtU2NyaXB0VHlwZVxuICAgIH1cbiAgfVxuXG4gIHN3aXRjaCAoc2NyaXB0VHlwZSkge1xuICAgIC8vIFAyV1BLSCBpcyBhIHNwZWNpYWwgY2FzZSBvZiBQMlBLSFxuICAgIGNhc2UgYnRlbXBsYXRlcy50eXBlcy5QMldQS0g6XG4gICAgICB3aXRuZXNzID0gYnVpbGRTdGFjayhidGVtcGxhdGVzLnR5cGVzLlAyUEtILCBpbnB1dC5zaWduYXR1cmVzLCBpbnB1dC5wdWJLZXlzLCBhbGxvd0luY29tcGxldGUpXG4gICAgICBicmVha1xuXG4gICAgY2FzZSBidGVtcGxhdGVzLnR5cGVzLlAyV1NIOlxuICAgICAgLy8gV2UgY2FuIHJlbW92ZSB0aGlzIGNoZWNrIGxhdGVyXG4gICAgICBpZiAoIWFsbG93SW5jb21wbGV0ZSAmJiAhc3VwcG9ydGVkVHlwZShpbnB1dC53aXRuZXNzU2NyaXB0VHlwZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbXBvc3NpYmxlIHRvIHNpZ24gdGhpcyB0eXBlJylcbiAgICAgIH1cblxuICAgICAgaWYgKHN1cHBvcnRlZFR5cGUoaW5wdXQud2l0bmVzc1NjcmlwdFR5cGUpKSB7XG4gICAgICAgIHdpdG5lc3MgPSBidWlsZFN0YWNrKGlucHV0LndpdG5lc3NTY3JpcHRUeXBlLCBpbnB1dC5zaWduYXR1cmVzLCBpbnB1dC5wdWJLZXlzLCBhbGxvd0luY29tcGxldGUpXG4gICAgICAgIHdpdG5lc3MucHVzaChpbnB1dC53aXRuZXNzU2NyaXB0KVxuICAgICAgICBzY3JpcHRUeXBlID0gaW5wdXQud2l0bmVzc1NjcmlwdFR5cGVcbiAgICAgIH1cblxuICAgICAgYnJlYWtcbiAgfVxuXG4gIC8vIGFwcGVuZCByZWRlZW1TY3JpcHQgaWYgbmVjZXNzYXJ5XG4gIGlmIChwMnNoKSB7XG4gICAgc2lnLnB1c2goaW5wdXQucmVkZWVtU2NyaXB0KVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBzY3JpcHRUeXBlLFxuICAgIHNjcmlwdDogYnNjcmlwdC5jb21waWxlKHNpZyksXG4gICAgd2l0bmVzczogd2l0bmVzc1xuICB9XG59XG5cbmZ1bmN0aW9uIFRyYW5zYWN0aW9uQnVpbGRlciAobmV0d29yaywgbWF4aW11bUZlZVJhdGUpIHtcbiAgdGhpcy5wcmV2VHhNYXAgPSB7fVxuICB0aGlzLm5ldHdvcmsgPSBuZXR3b3JrIHx8IG5ldHdvcmtzLmJpdGNvaW5cblxuICAvLyBXQVJOSU5HOiBUaGlzIGlzIF9fTk9UX18gdG8gYmUgcmVsaWVkIG9uLCBpdHMganVzdCBhbm90aGVyIHBvdGVudGlhbCBzYWZldHkgbWVjaGFuaXNtIChzYWZldHkgaW4tZGVwdGgpXG4gIHRoaXMubWF4aW11bUZlZVJhdGUgPSBtYXhpbXVtRmVlUmF0ZSB8fCAyNTAwXG5cbiAgdGhpcy5pbnB1dHMgPSBbXVxuICB0aGlzLnR4ID0gbmV3IFRyYW5zYWN0aW9uKClcbn1cblxuVHJhbnNhY3Rpb25CdWlsZGVyLnByb3RvdHlwZS5zZXRMb2NrVGltZSA9IGZ1bmN0aW9uIChsb2NrdGltZSkge1xuICB0eXBlZm9yY2UodHlwZXMuVUludDMyLCBsb2NrdGltZSlcblxuICAvLyBpZiBhbnkgc2lnbmF0dXJlcyBleGlzdCwgdGhyb3dcbiAgaWYgKHRoaXMuaW5wdXRzLnNvbWUoZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgaWYgKCFpbnB1dC5zaWduYXR1cmVzKSByZXR1cm4gZmFsc2VcblxuICAgIHJldHVybiBpbnB1dC5zaWduYXR1cmVzLnNvbWUoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHMgfSlcbiAgfSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vLCB0aGlzIHdvdWxkIGludmFsaWRhdGUgc2lnbmF0dXJlcycpXG4gIH1cblxuICB0aGlzLnR4LmxvY2t0aW1lID0gbG9ja3RpbWVcbn1cblxuVHJhbnNhY3Rpb25CdWlsZGVyLnByb3RvdHlwZS5zZXRWZXJzaW9uID0gZnVuY3Rpb24gKHZlcnNpb24pIHtcbiAgdHlwZWZvcmNlKHR5cGVzLlVJbnQzMiwgdmVyc2lvbilcblxuICAvLyBYWFg6IHRoaXMgbWlnaHQgZXZlbnR1YWxseSBiZWNvbWUgbW9yZSBjb21wbGV4IGRlcGVuZGluZyBvbiB3aGF0IHRoZSB2ZXJzaW9ucyByZXByZXNlbnRcbiAgdGhpcy50eC52ZXJzaW9uID0gdmVyc2lvblxufVxuXG5UcmFuc2FjdGlvbkJ1aWxkZXIuZnJvbVRyYW5zYWN0aW9uID0gZnVuY3Rpb24gKHRyYW5zYWN0aW9uLCBuZXR3b3JrKSB7XG4gIHZhciB0eGIgPSBuZXcgVHJhbnNhY3Rpb25CdWlsZGVyKG5ldHdvcmspXG5cbiAgLy8gQ29weSB0cmFuc2FjdGlvbiBmaWVsZHNcbiAgdHhiLnNldFZlcnNpb24odHJhbnNhY3Rpb24udmVyc2lvbilcbiAgdHhiLnNldExvY2tUaW1lKHRyYW5zYWN0aW9uLmxvY2t0aW1lKVxuXG4gIC8vIENvcHkgb3V0cHV0cyAoZG9uZSBmaXJzdCB0byBhdm9pZCBzaWduYXR1cmUgaW52YWxpZGF0aW9uKVxuICB0cmFuc2FjdGlvbi5vdXRzLmZvckVhY2goZnVuY3Rpb24gKHR4T3V0KSB7XG4gICAgdHhiLmFkZE91dHB1dCh0eE91dC5zY3JpcHQsIHR4T3V0LnZhbHVlKVxuICB9KVxuXG4gIC8vIENvcHkgaW5wdXRzXG4gIHRyYW5zYWN0aW9uLmlucy5mb3JFYWNoKGZ1bmN0aW9uICh0eEluKSB7XG4gICAgdHhiLl9fYWRkSW5wdXRVbnNhZmUodHhJbi5oYXNoLCB0eEluLmluZGV4LCB7XG4gICAgICBzZXF1ZW5jZTogdHhJbi5zZXF1ZW5jZSxcbiAgICAgIHNjcmlwdDogdHhJbi5zY3JpcHQsXG4gICAgICB3aXRuZXNzOiB0eEluLndpdG5lc3NcbiAgICB9KVxuICB9KVxuXG4gIC8vIGZpeCBzb21lIHRoaW5ncyBub3QgcG9zc2libGUgdGhyb3VnaCB0aGUgcHVibGljIEFQSVxuICB0eGIuaW5wdXRzLmZvckVhY2goZnVuY3Rpb24gKGlucHV0LCBpKSB7XG4gICAgZml4TXVsdGlzaWdPcmRlcihpbnB1dCwgdHJhbnNhY3Rpb24sIGkpXG4gIH0pXG5cbiAgcmV0dXJuIHR4YlxufVxuXG5UcmFuc2FjdGlvbkJ1aWxkZXIucHJvdG90eXBlLmFkZElucHV0ID0gZnVuY3Rpb24gKHR4SGFzaCwgdm91dCwgc2VxdWVuY2UsIHByZXZPdXRTY3JpcHQpIHtcbiAgaWYgKCF0aGlzLl9fY2FuTW9kaWZ5SW5wdXRzKCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vLCB0aGlzIHdvdWxkIGludmFsaWRhdGUgc2lnbmF0dXJlcycpXG4gIH1cblxuICB2YXIgdmFsdWVcblxuICAvLyBpcyBpdCBhIGhleCBzdHJpbmc/XG4gIGlmICh0eXBlb2YgdHhIYXNoID09PSAnc3RyaW5nJykge1xuICAgIC8vIHRyYW5zYWN0aW9uIGhhc2hzJ3MgYXJlIGRpc3BsYXllZCBpbiByZXZlcnNlIG9yZGVyLCB1bi1yZXZlcnNlIGl0XG4gICAgdHhIYXNoID0gQnVmZmVyLmZyb20odHhIYXNoLCAnaGV4JykucmV2ZXJzZSgpXG5cbiAgLy8gaXMgaXQgYSBUcmFuc2FjdGlvbiBvYmplY3Q/XG4gIH0gZWxzZSBpZiAodHhIYXNoIGluc3RhbmNlb2YgVHJhbnNhY3Rpb24pIHtcbiAgICB2YXIgdHhPdXQgPSB0eEhhc2gub3V0c1t2b3V0XVxuICAgIHByZXZPdXRTY3JpcHQgPSB0eE91dC5zY3JpcHRcbiAgICB2YWx1ZSA9IHR4T3V0LnZhbHVlXG5cbiAgICB0eEhhc2ggPSB0eEhhc2guZ2V0SGFzaCgpXG4gIH1cblxuICByZXR1cm4gdGhpcy5fX2FkZElucHV0VW5zYWZlKHR4SGFzaCwgdm91dCwge1xuICAgIHNlcXVlbmNlOiBzZXF1ZW5jZSxcbiAgICBwcmV2T3V0U2NyaXB0OiBwcmV2T3V0U2NyaXB0LFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9KVxufVxuXG5UcmFuc2FjdGlvbkJ1aWxkZXIucHJvdG90eXBlLl9fYWRkSW5wdXRVbnNhZmUgPSBmdW5jdGlvbiAodHhIYXNoLCB2b3V0LCBvcHRpb25zKSB7XG4gIGlmIChUcmFuc2FjdGlvbi5pc0NvaW5iYXNlSGFzaCh0eEhhc2gpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjb2luYmFzZSBpbnB1dHMgbm90IHN1cHBvcnRlZCcpXG4gIH1cblxuICB2YXIgcHJldlR4T3V0ID0gdHhIYXNoLnRvU3RyaW5nKCdoZXgnKSArICc6JyArIHZvdXRcbiAgaWYgKHRoaXMucHJldlR4TWFwW3ByZXZUeE91dF0gIT09IHVuZGVmaW5lZCkgdGhyb3cgbmV3IEVycm9yKCdEdXBsaWNhdGUgVHhPdXQ6ICcgKyBwcmV2VHhPdXQpXG5cbiAgdmFyIGlucHV0ID0ge31cblxuICAvLyBkZXJpdmUgd2hhdCB3ZSBjYW4gZnJvbSB0aGUgc2NyaXB0U2lnXG4gIGlmIChvcHRpb25zLnNjcmlwdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaW5wdXQgPSBleHBhbmRJbnB1dChvcHRpb25zLnNjcmlwdCwgb3B0aW9ucy53aXRuZXNzIHx8IFtdKVxuICB9XG5cbiAgLy8gaWYgYW4gaW5wdXQgdmFsdWUgd2FzIGdpdmVuLCByZXRhaW4gaXRcbiAgaWYgKG9wdGlvbnMudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgIGlucHV0LnZhbHVlID0gb3B0aW9ucy52YWx1ZVxuICB9XG5cbiAgLy8gZGVyaXZlIHdoYXQgd2UgY2FuIGZyb20gdGhlIHByZXZpb3VzIHRyYW5zYWN0aW9ucyBvdXRwdXQgc2NyaXB0XG4gIGlmICghaW5wdXQucHJldk91dFNjcmlwdCAmJiBvcHRpb25zLnByZXZPdXRTY3JpcHQpIHtcbiAgICB2YXIgcHJldk91dFR5cGVcblxuICAgIGlmICghaW5wdXQucHViS2V5cyAmJiAhaW5wdXQuc2lnbmF0dXJlcykge1xuICAgICAgdmFyIGV4cGFuZGVkID0gZXhwYW5kT3V0cHV0KG9wdGlvbnMucHJldk91dFNjcmlwdClcblxuICAgICAgaWYgKGV4cGFuZGVkLnB1YktleXMpIHtcbiAgICAgICAgaW5wdXQucHViS2V5cyA9IGV4cGFuZGVkLnB1YktleXNcbiAgICAgICAgaW5wdXQuc2lnbmF0dXJlcyA9IGV4cGFuZGVkLnNpZ25hdHVyZXNcbiAgICAgIH1cblxuICAgICAgcHJldk91dFR5cGUgPSBleHBhbmRlZC5zY3JpcHRUeXBlXG4gICAgfVxuXG4gICAgaW5wdXQucHJldk91dFNjcmlwdCA9IG9wdGlvbnMucHJldk91dFNjcmlwdFxuICAgIGlucHV0LnByZXZPdXRUeXBlID0gcHJldk91dFR5cGUgfHwgYnRlbXBsYXRlcy5jbGFzc2lmeU91dHB1dChvcHRpb25zLnByZXZPdXRTY3JpcHQpXG4gIH1cblxuICB2YXIgdmluID0gdGhpcy50eC5hZGRJbnB1dCh0eEhhc2gsIHZvdXQsIG9wdGlvbnMuc2VxdWVuY2UsIG9wdGlvbnMuc2NyaXB0U2lnKVxuICB0aGlzLmlucHV0c1t2aW5dID0gaW5wdXRcbiAgdGhpcy5wcmV2VHhNYXBbcHJldlR4T3V0XSA9IHZpblxuICByZXR1cm4gdmluXG59XG5cblRyYW5zYWN0aW9uQnVpbGRlci5wcm90b3R5cGUuYWRkT3V0cHV0ID0gZnVuY3Rpb24gKHNjcmlwdFB1YktleSwgdmFsdWUpIHtcbiAgaWYgKCF0aGlzLl9fY2FuTW9kaWZ5T3V0cHV0cygpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdObywgdGhpcyB3b3VsZCBpbnZhbGlkYXRlIHNpZ25hdHVyZXMnKVxuICB9XG5cbiAgLy8gQXR0ZW1wdCB0byBnZXQgYSBzY3JpcHQgaWYgaXQncyBhIGJhc2U1OCBhZGRyZXNzIHN0cmluZ1xuICBpZiAodHlwZW9mIHNjcmlwdFB1YktleSA9PT0gJ3N0cmluZycpIHtcbiAgICBzY3JpcHRQdWJLZXkgPSBiYWRkcmVzcy50b091dHB1dFNjcmlwdChzY3JpcHRQdWJLZXksIHRoaXMubmV0d29yaylcbiAgfVxuXG4gIHJldHVybiB0aGlzLnR4LmFkZE91dHB1dChzY3JpcHRQdWJLZXksIHZhbHVlKVxufVxuXG5UcmFuc2FjdGlvbkJ1aWxkZXIucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5fX2J1aWxkKGZhbHNlKVxufVxuVHJhbnNhY3Rpb25CdWlsZGVyLnByb3RvdHlwZS5idWlsZEluY29tcGxldGUgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLl9fYnVpbGQodHJ1ZSlcbn1cblxuVHJhbnNhY3Rpb25CdWlsZGVyLnByb3RvdHlwZS5fX2J1aWxkID0gZnVuY3Rpb24gKGFsbG93SW5jb21wbGV0ZSkge1xuICBpZiAoIWFsbG93SW5jb21wbGV0ZSkge1xuICAgIGlmICghdGhpcy50eC5pbnMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1RyYW5zYWN0aW9uIGhhcyBubyBpbnB1dHMnKVxuICAgIGlmICghdGhpcy50eC5vdXRzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdUcmFuc2FjdGlvbiBoYXMgbm8gb3V0cHV0cycpXG4gIH1cblxuICB2YXIgdHggPSB0aGlzLnR4LmNsb25lKClcbiAgLy8gQ3JlYXRlIHNjcmlwdCBzaWduYXR1cmVzIGZyb20gaW5wdXRzXG4gIHRoaXMuaW5wdXRzLmZvckVhY2goZnVuY3Rpb24gKGlucHV0LCBpKSB7XG4gICAgdmFyIHNjcmlwdFR5cGUgPSBpbnB1dC53aXRuZXNzU2NyaXB0VHlwZSB8fCBpbnB1dC5yZWRlZW1TY3JpcHRUeXBlIHx8IGlucHV0LnByZXZPdXRUeXBlXG4gICAgaWYgKCFzY3JpcHRUeXBlICYmICFhbGxvd0luY29tcGxldGUpIHRocm93IG5ldyBFcnJvcignVHJhbnNhY3Rpb24gaXMgbm90IGNvbXBsZXRlJylcbiAgICB2YXIgcmVzdWx0ID0gYnVpbGRJbnB1dChpbnB1dCwgYWxsb3dJbmNvbXBsZXRlKVxuXG4gICAgLy8gc2tpcCBpZiBubyByZXN1bHRcbiAgICBpZiAoIWFsbG93SW5jb21wbGV0ZSkge1xuICAgICAgaWYgKCFzdXBwb3J0ZWRUeXBlKHJlc3VsdC50eXBlKSAmJiByZXN1bHQudHlwZSAhPT0gYnRlbXBsYXRlcy50eXBlcy5QMldQS0gpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlc3VsdC50eXBlICsgJyBub3Qgc3VwcG9ydGVkJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0eC5zZXRJbnB1dFNjcmlwdChpLCByZXN1bHQuc2NyaXB0KVxuICAgIHR4LnNldFdpdG5lc3MoaSwgcmVzdWx0LndpdG5lc3MpXG4gIH0pXG5cbiAgaWYgKCFhbGxvd0luY29tcGxldGUpIHtcbiAgICAvLyBkbyBub3QgcmVseSBvbiB0aGlzLCBpdHMgbWVyZWx5IGEgbGFzdCByZXNvcnRcbiAgICBpZiAodGhpcy5fX292ZXJNYXhpbXVtRmVlcyh0eC52aXJ0dWFsU2l6ZSgpKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUcmFuc2FjdGlvbiBoYXMgYWJzdXJkIGZlZXMnKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0eFxufVxuXG5mdW5jdGlvbiBjYW5TaWduIChpbnB1dCkge1xuICByZXR1cm4gaW5wdXQucHJldk91dFNjcmlwdCAhPT0gdW5kZWZpbmVkICYmXG4gICAgaW5wdXQuc2lnblNjcmlwdCAhPT0gdW5kZWZpbmVkICYmXG4gICAgaW5wdXQucHViS2V5cyAhPT0gdW5kZWZpbmVkICYmXG4gICAgaW5wdXQuc2lnbmF0dXJlcyAhPT0gdW5kZWZpbmVkICYmXG4gICAgaW5wdXQuc2lnbmF0dXJlcy5sZW5ndGggPT09IGlucHV0LnB1YktleXMubGVuZ3RoICYmXG4gICAgaW5wdXQucHViS2V5cy5sZW5ndGggPiAwICYmXG4gICAgKFxuICAgICAgaW5wdXQud2l0bmVzcyA9PT0gZmFsc2UgfHxcbiAgICAgIChpbnB1dC53aXRuZXNzID09PSB0cnVlICYmIGlucHV0LnZhbHVlICE9PSB1bmRlZmluZWQpXG4gICAgKVxufVxuXG5UcmFuc2FjdGlvbkJ1aWxkZXIucHJvdG90eXBlLnNpZ24gPSBmdW5jdGlvbiAodmluLCBrZXlQYWlyLCByZWRlZW1TY3JpcHQsIGhhc2hUeXBlLCB3aXRuZXNzVmFsdWUsIHdpdG5lc3NTY3JpcHQpIHtcbiAgLy8gVE9ETzogcmVtb3ZlIGtleVBhaXIubmV0d29yayBtYXRjaGluZyBpbiA0LjAuMFxuICBpZiAoa2V5UGFpci5uZXR3b3JrICYmIGtleVBhaXIubmV0d29yayAhPT0gdGhpcy5uZXR3b3JrKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbmNvbnNpc3RlbnQgbmV0d29yaycpXG4gIGlmICghdGhpcy5pbnB1dHNbdmluXSkgdGhyb3cgbmV3IEVycm9yKCdObyBpbnB1dCBhdCBpbmRleDogJyArIHZpbilcbiAgaGFzaFR5cGUgPSBoYXNoVHlwZSB8fCBUcmFuc2FjdGlvbi5TSUdIQVNIX0FMTFxuXG4gIHZhciBpbnB1dCA9IHRoaXMuaW5wdXRzW3Zpbl1cblxuICAvLyBpZiByZWRlZW1TY3JpcHQgd2FzIHByZXZpb3VzbHkgcHJvdmlkZWQsIGVuZm9yY2UgY29uc2lzdGVuY3lcbiAgaWYgKGlucHV0LnJlZGVlbVNjcmlwdCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICByZWRlZW1TY3JpcHQgJiZcbiAgICAgICFpbnB1dC5yZWRlZW1TY3JpcHQuZXF1YWxzKHJlZGVlbVNjcmlwdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29uc2lzdGVudCByZWRlZW1TY3JpcHQnKVxuICB9XG5cbiAgdmFyIGtwUHViS2V5ID0ga2V5UGFpci5wdWJsaWNLZXkgfHwga2V5UGFpci5nZXRQdWJsaWNLZXlCdWZmZXIoKVxuICBpZiAoIWNhblNpZ24oaW5wdXQpKSB7XG4gICAgaWYgKHdpdG5lc3NWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoaW5wdXQudmFsdWUgIT09IHVuZGVmaW5lZCAmJiBpbnB1dC52YWx1ZSAhPT0gd2l0bmVzc1ZhbHVlKSB0aHJvdyBuZXcgRXJyb3IoJ0lucHV0IGRpZG5cXCd0IG1hdGNoIHdpdG5lc3NWYWx1ZScpXG4gICAgICB0eXBlZm9yY2UodHlwZXMuU2F0b3NoaSwgd2l0bmVzc1ZhbHVlKVxuICAgICAgaW5wdXQudmFsdWUgPSB3aXRuZXNzVmFsdWVcbiAgICB9XG5cbiAgICBpZiAoIWNhblNpZ24oaW5wdXQpKSBwcmVwYXJlSW5wdXQoaW5wdXQsIGtwUHViS2V5LCByZWRlZW1TY3JpcHQsIHdpdG5lc3NWYWx1ZSwgd2l0bmVzc1NjcmlwdClcbiAgICBpZiAoIWNhblNpZ24oaW5wdXQpKSB0aHJvdyBFcnJvcihpbnB1dC5wcmV2T3V0VHlwZSArICcgbm90IHN1cHBvcnRlZCcpXG4gIH1cblxuICAvLyByZWFkeSB0byBzaWduXG4gIHZhciBzaWduYXR1cmVIYXNoXG4gIGlmIChpbnB1dC53aXRuZXNzKSB7XG4gICAgc2lnbmF0dXJlSGFzaCA9IHRoaXMudHguaGFzaEZvcldpdG5lc3NWMCh2aW4sIGlucHV0LnNpZ25TY3JpcHQsIGlucHV0LnZhbHVlLCBoYXNoVHlwZSlcbiAgfSBlbHNlIHtcbiAgICBzaWduYXR1cmVIYXNoID0gdGhpcy50eC5oYXNoRm9yU2lnbmF0dXJlKHZpbiwgaW5wdXQuc2lnblNjcmlwdCwgaGFzaFR5cGUpXG4gIH1cblxuICAvLyBlbmZvcmNlIGluIG9yZGVyIHNpZ25pbmcgb2YgcHVibGljIGtleXNcbiAgdmFyIHNpZ25lZCA9IGlucHV0LnB1YktleXMuc29tZShmdW5jdGlvbiAocHViS2V5LCBpKSB7XG4gICAgaWYgKCFrcFB1YktleS5lcXVhbHMocHViS2V5KSkgcmV0dXJuIGZhbHNlXG4gICAgaWYgKGlucHV0LnNpZ25hdHVyZXNbaV0pIHRocm93IG5ldyBFcnJvcignU2lnbmF0dXJlIGFscmVhZHkgZXhpc3RzJylcbiAgICBpZiAoa3BQdWJLZXkubGVuZ3RoICE9PSAzMyAmJlxuICAgICAgaW5wdXQuc2lnblR5cGUgPT09IHNjcmlwdFR5cGVzLlAyV1BLSCkgdGhyb3cgbmV3IEVycm9yKCdCSVAxNDMgcmVqZWN0cyB1bmNvbXByZXNzZWQgcHVibGljIGtleXMgaW4gUDJXUEtIIG9yIFAyV1NIJylcblxuICAgIHZhciBzaWduYXR1cmUgPSBrZXlQYWlyLnNpZ24oc2lnbmF0dXJlSGFzaClcbiAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHNpZ25hdHVyZSkpIHNpZ25hdHVyZSA9IEVDU2lnbmF0dXJlLmZyb21SU0J1ZmZlcihzaWduYXR1cmUpXG5cbiAgICBpbnB1dC5zaWduYXR1cmVzW2ldID0gc2lnbmF0dXJlLnRvU2NyaXB0U2lnbmF0dXJlKGhhc2hUeXBlKVxuICAgIHJldHVybiB0cnVlXG4gIH0pXG5cbiAgaWYgKCFzaWduZWQpIHRocm93IG5ldyBFcnJvcignS2V5IHBhaXIgY2Fubm90IHNpZ24gZm9yIHRoaXMgaW5wdXQnKVxufVxuXG5mdW5jdGlvbiBzaWduYXR1cmVIYXNoVHlwZSAoYnVmZmVyKSB7XG4gIHJldHVybiBidWZmZXIucmVhZFVJbnQ4KGJ1ZmZlci5sZW5ndGggLSAxKVxufVxuXG5UcmFuc2FjdGlvbkJ1aWxkZXIucHJvdG90eXBlLl9fY2FuTW9kaWZ5SW5wdXRzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5pbnB1dHMuZXZlcnkoZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgLy8gYW55IHNpZ25hdHVyZXM/XG4gICAgaWYgKGlucHV0LnNpZ25hdHVyZXMgPT09IHVuZGVmaW5lZCkgcmV0dXJuIHRydWVcblxuICAgIHJldHVybiBpbnB1dC5zaWduYXR1cmVzLmV2ZXJ5KGZ1bmN0aW9uIChzaWduYXR1cmUpIHtcbiAgICAgIGlmICghc2lnbmF0dXJlKSByZXR1cm4gdHJ1ZVxuICAgICAgdmFyIGhhc2hUeXBlID0gc2lnbmF0dXJlSGFzaFR5cGUoc2lnbmF0dXJlKVxuXG4gICAgICAvLyBpZiBTSUdIQVNIX0FOWU9ORUNBTlBBWSBpcyBzZXQsIHNpZ25hdHVyZXMgd291bGQgbm90XG4gICAgICAvLyBiZSBpbnZhbGlkYXRlZCBieSBtb3JlIGlucHV0c1xuICAgICAgcmV0dXJuIGhhc2hUeXBlICYgVHJhbnNhY3Rpb24uU0lHSEFTSF9BTllPTkVDQU5QQVlcbiAgICB9KVxuICB9KVxufVxuXG5UcmFuc2FjdGlvbkJ1aWxkZXIucHJvdG90eXBlLl9fY2FuTW9kaWZ5T3V0cHV0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG5JbnB1dHMgPSB0aGlzLnR4Lmlucy5sZW5ndGhcbiAgdmFyIG5PdXRwdXRzID0gdGhpcy50eC5vdXRzLmxlbmd0aFxuXG4gIHJldHVybiB0aGlzLmlucHV0cy5ldmVyeShmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBpZiAoaW5wdXQuc2lnbmF0dXJlcyA9PT0gdW5kZWZpbmVkKSByZXR1cm4gdHJ1ZVxuXG4gICAgcmV0dXJuIGlucHV0LnNpZ25hdHVyZXMuZXZlcnkoZnVuY3Rpb24gKHNpZ25hdHVyZSkge1xuICAgICAgaWYgKCFzaWduYXR1cmUpIHJldHVybiB0cnVlXG4gICAgICB2YXIgaGFzaFR5cGUgPSBzaWduYXR1cmVIYXNoVHlwZShzaWduYXR1cmUpXG5cbiAgICAgIHZhciBoYXNoVHlwZU1vZCA9IGhhc2hUeXBlICYgMHgxZlxuICAgICAgaWYgKGhhc2hUeXBlTW9kID09PSBUcmFuc2FjdGlvbi5TSUdIQVNIX05PTkUpIHJldHVybiB0cnVlXG4gICAgICBpZiAoaGFzaFR5cGVNb2QgPT09IFRyYW5zYWN0aW9uLlNJR0hBU0hfU0lOR0xFKSB7XG4gICAgICAgIC8vIGlmIFNJR0hBU0hfU0lOR0xFIGlzIHNldCwgYW5kIG5JbnB1dHMgPiBuT3V0cHV0c1xuICAgICAgICAvLyBzb21lIHNpZ25hdHVyZXMgd291bGQgYmUgaW52YWxpZGF0ZWQgYnkgdGhlIGFkZGl0aW9uXG4gICAgICAgIC8vIG9mIG1vcmUgb3V0cHV0c1xuICAgICAgICByZXR1cm4gbklucHV0cyA8PSBuT3V0cHV0c1xuICAgICAgfVxuICAgIH0pXG4gIH0pXG59XG5cblRyYW5zYWN0aW9uQnVpbGRlci5wcm90b3R5cGUuX19vdmVyTWF4aW11bUZlZXMgPSBmdW5jdGlvbiAoYnl0ZXMpIHtcbiAgLy8gbm90IGFsbCBpbnB1dHMgd2lsbCBoYXZlIC52YWx1ZSBkZWZpbmVkXG4gIHZhciBpbmNvbWluZyA9IHRoaXMuaW5wdXRzLnJlZHVjZShmdW5jdGlvbiAoYSwgeCkgeyByZXR1cm4gYSArICh4LnZhbHVlID4+PiAwKSB9LCAwKVxuXG4gIC8vIGJ1dCBhbGwgb3V0cHV0cyBkbywgYW5kIGlmIHdlIGhhdmUgYW55IGlucHV0IHZhbHVlXG4gIC8vIHdlIGNhbiBpbW1lZGlhdGVseSBkZXRlcm1pbmUgaWYgdGhlIG91dHB1dHMgYXJlIHRvbyBzbWFsbFxuICB2YXIgb3V0Z29pbmcgPSB0aGlzLnR4Lm91dHMucmVkdWNlKGZ1bmN0aW9uIChhLCB4KSB7IHJldHVybiBhICsgeC52YWx1ZSB9LCAwKVxuICB2YXIgZmVlID0gaW5jb21pbmcgLSBvdXRnb2luZ1xuICB2YXIgZmVlUmF0ZSA9IGZlZSAvIGJ5dGVzXG5cbiAgcmV0dXJuIGZlZVJhdGUgPiB0aGlzLm1heGltdW1GZWVSYXRlXG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhbnNhY3Rpb25CdWlsZGVyXG4iLCJ2YXIgdHlwZWZvcmNlID0gcmVxdWlyZSgndHlwZWZvcmNlJylcblxudmFyIFVJTlQzMV9NQVggPSBNYXRoLnBvdygyLCAzMSkgLSAxXG5mdW5jdGlvbiBVSW50MzEgKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlZm9yY2UuVUludDMyKHZhbHVlKSAmJiB2YWx1ZSA8PSBVSU5UMzFfTUFYXG59XG5cbmZ1bmN0aW9uIEJJUDMyUGF0aCAodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVmb3JjZS5TdHJpbmcodmFsdWUpICYmIHZhbHVlLm1hdGNoKC9eKG1cXC8pPyhcXGQrJz9cXC8pKlxcZCsnPyQvKVxufVxuQklQMzJQYXRoLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICdCSVAzMiBkZXJpdmF0aW9uIHBhdGgnIH1cblxudmFyIFNBVE9TSElfTUFYID0gMjEgKiAxZTE0XG5mdW5jdGlvbiBTYXRvc2hpICh2YWx1ZSkge1xuICByZXR1cm4gdHlwZWZvcmNlLlVJbnQ1Myh2YWx1ZSkgJiYgdmFsdWUgPD0gU0FUT1NISV9NQVhcbn1cblxuLy8gZXh0ZXJuYWwgZGVwZW5kZW50IHR5cGVzXG52YXIgQmlnSW50ID0gdHlwZWZvcmNlLnF1YWNrc0xpa2UoJ0JpZ0ludGVnZXInKVxudmFyIEVDUG9pbnQgPSB0eXBlZm9yY2UucXVhY2tzTGlrZSgnUG9pbnQnKVxuXG4vLyBleHBvc2VkLCBleHRlcm5hbCBBUElcbnZhciBFQ1NpZ25hdHVyZSA9IHR5cGVmb3JjZS5jb21waWxlKHsgcjogQmlnSW50LCBzOiBCaWdJbnQgfSlcbnZhciBOZXR3b3JrID0gdHlwZWZvcmNlLmNvbXBpbGUoe1xuICBtZXNzYWdlUHJlZml4OiB0eXBlZm9yY2Uub25lT2YodHlwZWZvcmNlLkJ1ZmZlciwgdHlwZWZvcmNlLlN0cmluZyksXG4gIGJpcDMyOiB7XG4gICAgcHVibGljOiB0eXBlZm9yY2UuVUludDMyLFxuICAgIHByaXZhdGU6IHR5cGVmb3JjZS5VSW50MzJcbiAgfSxcbiAgcHViS2V5SGFzaDogdHlwZWZvcmNlLlVJbnQ4LFxuICBzY3JpcHRIYXNoOiB0eXBlZm9yY2UuVUludDgsXG4gIHdpZjogdHlwZWZvcmNlLlVJbnQ4XG59KVxuXG4vLyBleHRlbmQgdHlwZWZvcmNlIHR5cGVzIHdpdGggb3Vyc1xudmFyIHR5cGVzID0ge1xuICBCaWdJbnQ6IEJpZ0ludCxcbiAgQklQMzJQYXRoOiBCSVAzMlBhdGgsXG4gIEJ1ZmZlcjI1NmJpdDogdHlwZWZvcmNlLkJ1ZmZlck4oMzIpLFxuICBFQ1BvaW50OiBFQ1BvaW50LFxuICBFQ1NpZ25hdHVyZTogRUNTaWduYXR1cmUsXG4gIEhhc2gxNjBiaXQ6IHR5cGVmb3JjZS5CdWZmZXJOKDIwKSxcbiAgSGFzaDI1NmJpdDogdHlwZWZvcmNlLkJ1ZmZlck4oMzIpLFxuICBOZXR3b3JrOiBOZXR3b3JrLFxuICBTYXRvc2hpOiBTYXRvc2hpLFxuICBVSW50MzE6IFVJbnQzMVxufVxuXG5mb3IgKHZhciB0eXBlTmFtZSBpbiB0eXBlZm9yY2UpIHtcbiAgdHlwZXNbdHlwZU5hbWVdID0gdHlwZWZvcmNlW3R5cGVOYW1lXVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVzXG4iLCJ2YXIgYmFzZXggPSByZXF1aXJlKCdiYXNlLXgnKVxudmFyIEFMUEhBQkVUID0gJzEyMzQ1Njc4OUFCQ0RFRkdISktMTU5QUVJTVFVWV1hZWmFiY2RlZmdoaWprbW5vcHFyc3R1dnd4eXonXG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZXgoQUxQSEFCRVQpXG4iLCIndXNlIHN0cmljdCdcblxudmFyIGJhc2U1OCA9IHJlcXVpcmUoJ2JzNTgnKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNoZWNrc3VtRm4pIHtcbiAgLy8gRW5jb2RlIGEgYnVmZmVyIGFzIGEgYmFzZTU4LWNoZWNrIGVuY29kZWQgc3RyaW5nXG4gIGZ1bmN0aW9uIGVuY29kZSAocGF5bG9hZCkge1xuICAgIHZhciBjaGVja3N1bSA9IGNoZWNrc3VtRm4ocGF5bG9hZClcblxuICAgIHJldHVybiBiYXNlNTguZW5jb2RlKEJ1ZmZlci5jb25jYXQoW1xuICAgICAgcGF5bG9hZCxcbiAgICAgIGNoZWNrc3VtXG4gICAgXSwgcGF5bG9hZC5sZW5ndGggKyA0KSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlY29kZVJhdyAoYnVmZmVyKSB7XG4gICAgdmFyIHBheWxvYWQgPSBidWZmZXIuc2xpY2UoMCwgLTQpXG4gICAgdmFyIGNoZWNrc3VtID0gYnVmZmVyLnNsaWNlKC00KVxuICAgIHZhciBuZXdDaGVja3N1bSA9IGNoZWNrc3VtRm4ocGF5bG9hZClcblxuICAgIGlmIChjaGVja3N1bVswXSBeIG5ld0NoZWNrc3VtWzBdIHxcbiAgICAgICAgY2hlY2tzdW1bMV0gXiBuZXdDaGVja3N1bVsxXSB8XG4gICAgICAgIGNoZWNrc3VtWzJdIF4gbmV3Q2hlY2tzdW1bMl0gfFxuICAgICAgICBjaGVja3N1bVszXSBeIG5ld0NoZWNrc3VtWzNdKSByZXR1cm5cblxuICAgIHJldHVybiBwYXlsb2FkXG4gIH1cblxuICAvLyBEZWNvZGUgYSBiYXNlNTgtY2hlY2sgZW5jb2RlZCBzdHJpbmcgdG8gYSBidWZmZXIsIG5vIHJlc3VsdCBpZiBjaGVja3N1bSBpcyB3cm9uZ1xuICBmdW5jdGlvbiBkZWNvZGVVbnNhZmUgKHN0cmluZykge1xuICAgIHZhciBidWZmZXIgPSBiYXNlNTguZGVjb2RlVW5zYWZlKHN0cmluZylcbiAgICBpZiAoIWJ1ZmZlcikgcmV0dXJuXG5cbiAgICByZXR1cm4gZGVjb2RlUmF3KGJ1ZmZlcilcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlY29kZSAoc3RyaW5nKSB7XG4gICAgdmFyIGJ1ZmZlciA9IGJhc2U1OC5kZWNvZGUoc3RyaW5nKVxuICAgIHZhciBwYXlsb2FkID0gZGVjb2RlUmF3KGJ1ZmZlciwgY2hlY2tzdW1GbilcbiAgICBpZiAoIXBheWxvYWQpIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjaGVja3N1bScpXG4gICAgcmV0dXJuIHBheWxvYWRcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZW5jb2RlOiBlbmNvZGUsXG4gICAgZGVjb2RlOiBkZWNvZGUsXG4gICAgZGVjb2RlVW5zYWZlOiBkZWNvZGVVbnNhZmVcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbnZhciBjcmVhdGVIYXNoID0gcmVxdWlyZSgnY3JlYXRlLWhhc2gnKVxudmFyIGJzNThjaGVja0Jhc2UgPSByZXF1aXJlKCcuL2Jhc2UnKVxuXG4vLyBTSEEyNTYoU0hBMjU2KGJ1ZmZlcikpXG5mdW5jdGlvbiBzaGEyNTZ4MiAoYnVmZmVyKSB7XG4gIHZhciB0bXAgPSBjcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoYnVmZmVyKS5kaWdlc3QoKVxuICByZXR1cm4gY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKHRtcCkuZGlnZXN0KClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiczU4Y2hlY2tCYXNlKHNoYTI1NngyKVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdjcnlwdG8nKS5jcmVhdGVIYXNoXG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJ2NyeXB0bycpLmNyZWF0ZUhtYWNcbiIsInZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKVxudmFyIEJpZ0ludGVnZXIgPSByZXF1aXJlKCdiaWdpJylcblxudmFyIFBvaW50ID0gcmVxdWlyZSgnLi9wb2ludCcpXG5cbmZ1bmN0aW9uIEN1cnZlIChwLCBhLCBiLCBHeCwgR3ksIG4sIGgpIHtcbiAgdGhpcy5wID0gcFxuICB0aGlzLmEgPSBhXG4gIHRoaXMuYiA9IGJcbiAgdGhpcy5HID0gUG9pbnQuZnJvbUFmZmluZSh0aGlzLCBHeCwgR3kpXG4gIHRoaXMubiA9IG5cbiAgdGhpcy5oID0gaFxuXG4gIHRoaXMuaW5maW5pdHkgPSBuZXcgUG9pbnQodGhpcywgbnVsbCwgbnVsbCwgQmlnSW50ZWdlci5aRVJPKVxuXG4gIC8vIHJlc3VsdCBjYWNoaW5nXG4gIHRoaXMucE92ZXJGb3VyID0gcC5hZGQoQmlnSW50ZWdlci5PTkUpLnNoaWZ0UmlnaHQoMilcblxuICAvLyBkZXRlcm1pbmUgc2l6ZSBvZiBwIGluIGJ5dGVzXG4gIHRoaXMucExlbmd0aCA9IE1hdGguZmxvb3IoKHRoaXMucC5iaXRMZW5ndGgoKSArIDcpIC8gOClcbn1cblxuQ3VydmUucHJvdG90eXBlLnBvaW50RnJvbVggPSBmdW5jdGlvbiAoaXNPZGQsIHgpIHtcbiAgdmFyIGFscGhhID0geC5wb3coMykuYWRkKHRoaXMuYS5tdWx0aXBseSh4KSkuYWRkKHRoaXMuYikubW9kKHRoaXMucClcbiAgdmFyIGJldGEgPSBhbHBoYS5tb2RQb3codGhpcy5wT3ZlckZvdXIsIHRoaXMucCkgLy8gWFhYOiBub3QgY29tcGF0aWJsZSB3aXRoIGFsbCBjdXJ2ZXNcblxuICB2YXIgeSA9IGJldGFcbiAgaWYgKGJldGEuaXNFdmVuKCkgXiAhaXNPZGQpIHtcbiAgICB5ID0gdGhpcy5wLnN1YnRyYWN0KHkpIC8vIC15ICUgcFxuICB9XG5cbiAgcmV0dXJuIFBvaW50LmZyb21BZmZpbmUodGhpcywgeCwgeSlcbn1cblxuQ3VydmUucHJvdG90eXBlLmlzSW5maW5pdHkgPSBmdW5jdGlvbiAoUSkge1xuICBpZiAoUSA9PT0gdGhpcy5pbmZpbml0eSkgcmV0dXJuIHRydWVcblxuICByZXR1cm4gUS56LnNpZ251bSgpID09PSAwICYmIFEueS5zaWdudW0oKSAhPT0gMFxufVxuXG5DdXJ2ZS5wcm90b3R5cGUuaXNPbkN1cnZlID0gZnVuY3Rpb24gKFEpIHtcbiAgaWYgKHRoaXMuaXNJbmZpbml0eShRKSkgcmV0dXJuIHRydWVcblxuICB2YXIgeCA9IFEuYWZmaW5lWFxuICB2YXIgeSA9IFEuYWZmaW5lWVxuICB2YXIgYSA9IHRoaXMuYVxuICB2YXIgYiA9IHRoaXMuYlxuICB2YXIgcCA9IHRoaXMucFxuXG4gIC8vIENoZWNrIHRoYXQgeFEgYW5kIHlRIGFyZSBpbnRlZ2VycyBpbiB0aGUgaW50ZXJ2YWwgWzAsIHAgLSAxXVxuICBpZiAoeC5zaWdudW0oKSA8IDAgfHwgeC5jb21wYXJlVG8ocCkgPj0gMCkgcmV0dXJuIGZhbHNlXG4gIGlmICh5LnNpZ251bSgpIDwgMCB8fCB5LmNvbXBhcmVUbyhwKSA+PSAwKSByZXR1cm4gZmFsc2VcblxuICAvLyBhbmQgY2hlY2sgdGhhdCB5XjIgPSB4XjMgKyBheCArIGIgKG1vZCBwKVxuICB2YXIgbGhzID0geS5zcXVhcmUoKS5tb2QocClcbiAgdmFyIHJocyA9IHgucG93KDMpLmFkZChhLm11bHRpcGx5KHgpKS5hZGQoYikubW9kKHApXG4gIHJldHVybiBsaHMuZXF1YWxzKHJocylcbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBhbiBlbGxpcHRpYyBjdXJ2ZSBwb2ludC5cbiAqXG4gKiBTZWUgU0VDIDEsIHNlY3Rpb24gMy4yLjIuMTogRWxsaXB0aWMgQ3VydmUgUHVibGljIEtleSBWYWxpZGF0aW9uIFByaW1pdGl2ZVxuICovXG5DdXJ2ZS5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbiAoUSkge1xuICAvLyBDaGVjayBRICE9IE9cbiAgYXNzZXJ0KCF0aGlzLmlzSW5maW5pdHkoUSksICdQb2ludCBpcyBhdCBpbmZpbml0eScpXG4gIGFzc2VydCh0aGlzLmlzT25DdXJ2ZShRKSwgJ1BvaW50IGlzIG5vdCBvbiB0aGUgY3VydmUnKVxuXG4gIC8vIENoZWNrIG5RID0gTyAod2hlcmUgUSBpcyBhIHNjYWxhciBtdWx0aXBsZSBvZiBHKVxuICB2YXIgblEgPSBRLm11bHRpcGx5KHRoaXMubilcbiAgYXNzZXJ0KHRoaXMuaXNJbmZpbml0eShuUSksICdQb2ludCBpcyBub3QgYSBzY2FsYXIgbXVsdGlwbGUgb2YgRycpXG5cbiAgcmV0dXJuIHRydWVcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDdXJ2ZVxuIiwidmFyIFBvaW50ID0gcmVxdWlyZSgnLi9wb2ludCcpXG52YXIgQ3VydmUgPSByZXF1aXJlKCcuL2N1cnZlJylcblxudmFyIGdldEN1cnZlQnlOYW1lID0gcmVxdWlyZSgnLi9uYW1lcycpXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBDdXJ2ZTogQ3VydmUsXG4gIFBvaW50OiBQb2ludCxcbiAgZ2V0Q3VydmVCeU5hbWU6IGdldEN1cnZlQnlOYW1lXG59XG4iLCJ2YXIgQmlnSW50ZWdlciA9IHJlcXVpcmUoJ2JpZ2knKVxuXG52YXIgY3VydmVzID0gcmVxdWlyZSgnLi9jdXJ2ZXMuanNvbicpXG52YXIgQ3VydmUgPSByZXF1aXJlKCcuL2N1cnZlJylcblxuZnVuY3Rpb24gZ2V0Q3VydmVCeU5hbWUgKG5hbWUpIHtcbiAgdmFyIGN1cnZlID0gY3VydmVzW25hbWVdXG4gIGlmICghY3VydmUpIHJldHVybiBudWxsXG5cbiAgdmFyIHAgPSBuZXcgQmlnSW50ZWdlcihjdXJ2ZS5wLCAxNilcbiAgdmFyIGEgPSBuZXcgQmlnSW50ZWdlcihjdXJ2ZS5hLCAxNilcbiAgdmFyIGIgPSBuZXcgQmlnSW50ZWdlcihjdXJ2ZS5iLCAxNilcbiAgdmFyIG4gPSBuZXcgQmlnSW50ZWdlcihjdXJ2ZS5uLCAxNilcbiAgdmFyIGggPSBuZXcgQmlnSW50ZWdlcihjdXJ2ZS5oLCAxNilcbiAgdmFyIEd4ID0gbmV3IEJpZ0ludGVnZXIoY3VydmUuR3gsIDE2KVxuICB2YXIgR3kgPSBuZXcgQmlnSW50ZWdlcihjdXJ2ZS5HeSwgMTYpXG5cbiAgcmV0dXJuIG5ldyBDdXJ2ZShwLCBhLCBiLCBHeCwgR3ksIG4sIGgpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0Q3VydmVCeU5hbWVcbiIsInZhciBhc3NlcnQgPSByZXF1aXJlKCdhc3NlcnQnKVxudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG52YXIgQmlnSW50ZWdlciA9IHJlcXVpcmUoJ2JpZ2knKVxuXG52YXIgVEhSRUUgPSBCaWdJbnRlZ2VyLnZhbHVlT2YoMylcblxuZnVuY3Rpb24gUG9pbnQgKGN1cnZlLCB4LCB5LCB6KSB7XG4gIGFzc2VydC5ub3RTdHJpY3RFcXVhbCh6LCB1bmRlZmluZWQsICdNaXNzaW5nIFogY29vcmRpbmF0ZScpXG5cbiAgdGhpcy5jdXJ2ZSA9IGN1cnZlXG4gIHRoaXMueCA9IHhcbiAgdGhpcy55ID0geVxuICB0aGlzLnogPSB6XG4gIHRoaXMuX3pJbnYgPSBudWxsXG5cbiAgdGhpcy5jb21wcmVzc2VkID0gdHJ1ZVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUG9pbnQucHJvdG90eXBlLCAnekludicsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMuX3pJbnYgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3pJbnYgPSB0aGlzLnoubW9kSW52ZXJzZSh0aGlzLmN1cnZlLnApXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3pJbnZcbiAgfVxufSlcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KFBvaW50LnByb3RvdHlwZSwgJ2FmZmluZVgnLCB7XG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLngubXVsdGlwbHkodGhpcy56SW52KS5tb2QodGhpcy5jdXJ2ZS5wKVxuICB9XG59KVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUG9pbnQucHJvdG90eXBlLCAnYWZmaW5lWScsIHtcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMueS5tdWx0aXBseSh0aGlzLnpJbnYpLm1vZCh0aGlzLmN1cnZlLnApXG4gIH1cbn0pXG5cblBvaW50LmZyb21BZmZpbmUgPSBmdW5jdGlvbiAoY3VydmUsIHgsIHkpIHtcbiAgcmV0dXJuIG5ldyBQb2ludChjdXJ2ZSwgeCwgeSwgQmlnSW50ZWdlci5PTkUpXG59XG5cblBvaW50LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiAob3RoZXIpIHtcbiAgaWYgKG90aGVyID09PSB0aGlzKSByZXR1cm4gdHJ1ZVxuICBpZiAodGhpcy5jdXJ2ZS5pc0luZmluaXR5KHRoaXMpKSByZXR1cm4gdGhpcy5jdXJ2ZS5pc0luZmluaXR5KG90aGVyKVxuICBpZiAodGhpcy5jdXJ2ZS5pc0luZmluaXR5KG90aGVyKSkgcmV0dXJuIHRoaXMuY3VydmUuaXNJbmZpbml0eSh0aGlzKVxuXG4gIC8vIHUgPSBZMiAqIFoxIC0gWTEgKiBaMlxuICB2YXIgdSA9IG90aGVyLnkubXVsdGlwbHkodGhpcy56KS5zdWJ0cmFjdCh0aGlzLnkubXVsdGlwbHkob3RoZXIueikpLm1vZCh0aGlzLmN1cnZlLnApXG5cbiAgaWYgKHUuc2lnbnVtKCkgIT09IDApIHJldHVybiBmYWxzZVxuXG4gIC8vIHYgPSBYMiAqIFoxIC0gWDEgKiBaMlxuICB2YXIgdiA9IG90aGVyLngubXVsdGlwbHkodGhpcy56KS5zdWJ0cmFjdCh0aGlzLngubXVsdGlwbHkob3RoZXIueikpLm1vZCh0aGlzLmN1cnZlLnApXG5cbiAgcmV0dXJuIHYuc2lnbnVtKCkgPT09IDBcbn1cblxuUG9pbnQucHJvdG90eXBlLm5lZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHkgPSB0aGlzLmN1cnZlLnAuc3VidHJhY3QodGhpcy55KVxuXG4gIHJldHVybiBuZXcgUG9pbnQodGhpcy5jdXJ2ZSwgdGhpcy54LCB5LCB0aGlzLnopXG59XG5cblBvaW50LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoYikge1xuICBpZiAodGhpcy5jdXJ2ZS5pc0luZmluaXR5KHRoaXMpKSByZXR1cm4gYlxuICBpZiAodGhpcy5jdXJ2ZS5pc0luZmluaXR5KGIpKSByZXR1cm4gdGhpc1xuXG4gIHZhciB4MSA9IHRoaXMueFxuICB2YXIgeTEgPSB0aGlzLnlcbiAgdmFyIHgyID0gYi54XG4gIHZhciB5MiA9IGIueVxuXG4gIC8vIHUgPSBZMiAqIFoxIC0gWTEgKiBaMlxuICB2YXIgdSA9IHkyLm11bHRpcGx5KHRoaXMueikuc3VidHJhY3QoeTEubXVsdGlwbHkoYi56KSkubW9kKHRoaXMuY3VydmUucClcbiAgLy8gdiA9IFgyICogWjEgLSBYMSAqIFoyXG4gIHZhciB2ID0geDIubXVsdGlwbHkodGhpcy56KS5zdWJ0cmFjdCh4MS5tdWx0aXBseShiLnopKS5tb2QodGhpcy5jdXJ2ZS5wKVxuXG4gIGlmICh2LnNpZ251bSgpID09PSAwKSB7XG4gICAgaWYgKHUuc2lnbnVtKCkgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnR3aWNlKCkgLy8gdGhpcyA9PSBiLCBzbyBkb3VibGVcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5jdXJ2ZS5pbmZpbml0eSAvLyB0aGlzID0gLWIsIHNvIGluZmluaXR5XG4gIH1cblxuICB2YXIgdjIgPSB2LnNxdWFyZSgpXG4gIHZhciB2MyA9IHYyLm11bHRpcGx5KHYpXG4gIHZhciB4MXYyID0geDEubXVsdGlwbHkodjIpXG4gIHZhciB6dTIgPSB1LnNxdWFyZSgpLm11bHRpcGx5KHRoaXMueilcblxuICAvLyB4MyA9IHYgKiAoejIgKiAoejEgKiB1XjIgLSAyICogeDEgKiB2XjIpIC0gdl4zKVxuICB2YXIgeDMgPSB6dTIuc3VidHJhY3QoeDF2Mi5zaGlmdExlZnQoMSkpLm11bHRpcGx5KGIueikuc3VidHJhY3QodjMpLm11bHRpcGx5KHYpLm1vZCh0aGlzLmN1cnZlLnApXG4gIC8vIHkzID0gejIgKiAoMyAqIHgxICogdSAqIHZeMiAtIHkxICogdl4zIC0gejEgKiB1XjMpICsgdSAqIHZeM1xuICB2YXIgeTMgPSB4MXYyLm11bHRpcGx5KFRIUkVFKS5tdWx0aXBseSh1KS5zdWJ0cmFjdCh5MS5tdWx0aXBseSh2MykpLnN1YnRyYWN0KHp1Mi5tdWx0aXBseSh1KSkubXVsdGlwbHkoYi56KS5hZGQodS5tdWx0aXBseSh2MykpLm1vZCh0aGlzLmN1cnZlLnApXG4gIC8vIHozID0gdl4zICogejEgKiB6MlxuICB2YXIgejMgPSB2My5tdWx0aXBseSh0aGlzLnopLm11bHRpcGx5KGIueikubW9kKHRoaXMuY3VydmUucClcblxuICByZXR1cm4gbmV3IFBvaW50KHRoaXMuY3VydmUsIHgzLCB5MywgejMpXG59XG5cblBvaW50LnByb3RvdHlwZS50d2ljZSA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHRoaXMuY3VydmUuaXNJbmZpbml0eSh0aGlzKSkgcmV0dXJuIHRoaXNcbiAgaWYgKHRoaXMueS5zaWdudW0oKSA9PT0gMCkgcmV0dXJuIHRoaXMuY3VydmUuaW5maW5pdHlcblxuICB2YXIgeDEgPSB0aGlzLnhcbiAgdmFyIHkxID0gdGhpcy55XG5cbiAgdmFyIHkxejEgPSB5MS5tdWx0aXBseSh0aGlzLnopLm1vZCh0aGlzLmN1cnZlLnApXG4gIHZhciB5MXNxejEgPSB5MXoxLm11bHRpcGx5KHkxKS5tb2QodGhpcy5jdXJ2ZS5wKVxuICB2YXIgYSA9IHRoaXMuY3VydmUuYVxuXG4gIC8vIHcgPSAzICogeDFeMiArIGEgKiB6MV4yXG4gIHZhciB3ID0geDEuc3F1YXJlKCkubXVsdGlwbHkoVEhSRUUpXG5cbiAgaWYgKGEuc2lnbnVtKCkgIT09IDApIHtcbiAgICB3ID0gdy5hZGQodGhpcy56LnNxdWFyZSgpLm11bHRpcGx5KGEpKVxuICB9XG5cbiAgdyA9IHcubW9kKHRoaXMuY3VydmUucClcbiAgLy8geDMgPSAyICogeTEgKiB6MSAqICh3XjIgLSA4ICogeDEgKiB5MV4yICogejEpXG4gIHZhciB4MyA9IHcuc3F1YXJlKCkuc3VidHJhY3QoeDEuc2hpZnRMZWZ0KDMpLm11bHRpcGx5KHkxc3F6MSkpLnNoaWZ0TGVmdCgxKS5tdWx0aXBseSh5MXoxKS5tb2QodGhpcy5jdXJ2ZS5wKVxuICAvLyB5MyA9IDQgKiB5MV4yICogejEgKiAoMyAqIHcgKiB4MSAtIDIgKiB5MV4yICogejEpIC0gd14zXG4gIHZhciB5MyA9IHcubXVsdGlwbHkoVEhSRUUpLm11bHRpcGx5KHgxKS5zdWJ0cmFjdCh5MXNxejEuc2hpZnRMZWZ0KDEpKS5zaGlmdExlZnQoMikubXVsdGlwbHkoeTFzcXoxKS5zdWJ0cmFjdCh3LnBvdygzKSkubW9kKHRoaXMuY3VydmUucClcbiAgLy8gejMgPSA4ICogKHkxICogejEpXjNcbiAgdmFyIHozID0geTF6MS5wb3coMykuc2hpZnRMZWZ0KDMpLm1vZCh0aGlzLmN1cnZlLnApXG5cbiAgcmV0dXJuIG5ldyBQb2ludCh0aGlzLmN1cnZlLCB4MywgeTMsIHozKVxufVxuXG4vLyBTaW1wbGUgTkFGIChOb24tQWRqYWNlbnQgRm9ybSkgbXVsdGlwbGljYXRpb24gYWxnb3JpdGhtXG4vLyBUT0RPOiBtb2R1bGFyaXplIHRoZSBtdWx0aXBsaWNhdGlvbiBhbGdvcml0aG1cblBvaW50LnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uIChrKSB7XG4gIGlmICh0aGlzLmN1cnZlLmlzSW5maW5pdHkodGhpcykpIHJldHVybiB0aGlzXG4gIGlmIChrLnNpZ251bSgpID09PSAwKSByZXR1cm4gdGhpcy5jdXJ2ZS5pbmZpbml0eVxuXG4gIHZhciBlID0ga1xuICB2YXIgaCA9IGUubXVsdGlwbHkoVEhSRUUpXG5cbiAgdmFyIG5lZyA9IHRoaXMubmVnYXRlKClcbiAgdmFyIFIgPSB0aGlzXG5cbiAgZm9yICh2YXIgaSA9IGguYml0TGVuZ3RoKCkgLSAyOyBpID4gMDsgLS1pKSB7XG4gICAgdmFyIGhCaXQgPSBoLnRlc3RCaXQoaSlcbiAgICB2YXIgZUJpdCA9IGUudGVzdEJpdChpKVxuXG4gICAgUiA9IFIudHdpY2UoKVxuXG4gICAgaWYgKGhCaXQgIT09IGVCaXQpIHtcbiAgICAgIFIgPSBSLmFkZChoQml0ID8gdGhpcyA6IG5lZylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gUlxufVxuXG4vLyBDb21wdXRlIHRoaXMqaiArIHgqayAoc2ltdWx0YW5lb3VzIG11bHRpcGxpY2F0aW9uKVxuUG9pbnQucHJvdG90eXBlLm11bHRpcGx5VHdvID0gZnVuY3Rpb24gKGosIHgsIGspIHtcbiAgdmFyIGkgPSBNYXRoLm1heChqLmJpdExlbmd0aCgpLCBrLmJpdExlbmd0aCgpKSAtIDFcbiAgdmFyIFIgPSB0aGlzLmN1cnZlLmluZmluaXR5XG4gIHZhciBib3RoID0gdGhpcy5hZGQoeClcblxuICB3aGlsZSAoaSA+PSAwKSB7XG4gICAgdmFyIGpCaXQgPSBqLnRlc3RCaXQoaSlcbiAgICB2YXIga0JpdCA9IGsudGVzdEJpdChpKVxuXG4gICAgUiA9IFIudHdpY2UoKVxuXG4gICAgaWYgKGpCaXQpIHtcbiAgICAgIGlmIChrQml0KSB7XG4gICAgICAgIFIgPSBSLmFkZChib3RoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgUiA9IFIuYWRkKHRoaXMpXG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChrQml0KSB7XG4gICAgICBSID0gUi5hZGQoeClcbiAgICB9XG4gICAgLS1pXG4gIH1cblxuICByZXR1cm4gUlxufVxuXG5Qb2ludC5wcm90b3R5cGUuZ2V0RW5jb2RlZCA9IGZ1bmN0aW9uIChjb21wcmVzc2VkKSB7XG4gIGlmIChjb21wcmVzc2VkID09IG51bGwpIGNvbXByZXNzZWQgPSB0aGlzLmNvbXByZXNzZWRcbiAgaWYgKHRoaXMuY3VydmUuaXNJbmZpbml0eSh0aGlzKSkgcmV0dXJuIEJ1ZmZlci5hbGxvYygxLCAwKSAvLyBJbmZpbml0eSBwb2ludCBlbmNvZGVkIGlzIHNpbXBseSAnMDAnXG5cbiAgdmFyIHggPSB0aGlzLmFmZmluZVhcbiAgdmFyIHkgPSB0aGlzLmFmZmluZVlcbiAgdmFyIGJ5dGVMZW5ndGggPSB0aGlzLmN1cnZlLnBMZW5ndGhcbiAgdmFyIGJ1ZmZlclxuXG4gIC8vIDB4MDIvMHgwMyB8IFhcbiAgaWYgKGNvbXByZXNzZWQpIHtcbiAgICBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUoMSArIGJ5dGVMZW5ndGgpXG4gICAgYnVmZmVyLndyaXRlVUludDgoeS5pc0V2ZW4oKSA/IDB4MDIgOiAweDAzLCAwKVxuXG4gIC8vIDB4MDQgfCBYIHwgWVxuICB9IGVsc2Uge1xuICAgIGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgxICsgYnl0ZUxlbmd0aCArIGJ5dGVMZW5ndGgpXG4gICAgYnVmZmVyLndyaXRlVUludDgoMHgwNCwgMClcblxuICAgIHkudG9CdWZmZXIoYnl0ZUxlbmd0aCkuY29weShidWZmZXIsIDEgKyBieXRlTGVuZ3RoKVxuICB9XG5cbiAgeC50b0J1ZmZlcihieXRlTGVuZ3RoKS5jb3B5KGJ1ZmZlciwgMSlcblxuICByZXR1cm4gYnVmZmVyXG59XG5cblBvaW50LmRlY29kZUZyb20gPSBmdW5jdGlvbiAoY3VydmUsIGJ1ZmZlcikge1xuICB2YXIgdHlwZSA9IGJ1ZmZlci5yZWFkVUludDgoMClcbiAgdmFyIGNvbXByZXNzZWQgPSAodHlwZSAhPT0gNClcblxuICB2YXIgYnl0ZUxlbmd0aCA9IE1hdGguZmxvb3IoKGN1cnZlLnAuYml0TGVuZ3RoKCkgKyA3KSAvIDgpXG4gIHZhciB4ID0gQmlnSW50ZWdlci5mcm9tQnVmZmVyKGJ1ZmZlci5zbGljZSgxLCAxICsgYnl0ZUxlbmd0aCkpXG5cbiAgdmFyIFFcbiAgaWYgKGNvbXByZXNzZWQpIHtcbiAgICBhc3NlcnQuZXF1YWwoYnVmZmVyLmxlbmd0aCwgYnl0ZUxlbmd0aCArIDEsICdJbnZhbGlkIHNlcXVlbmNlIGxlbmd0aCcpXG4gICAgYXNzZXJ0KHR5cGUgPT09IDB4MDIgfHwgdHlwZSA9PT0gMHgwMywgJ0ludmFsaWQgc2VxdWVuY2UgdGFnJylcblxuICAgIHZhciBpc09kZCA9ICh0eXBlID09PSAweDAzKVxuICAgIFEgPSBjdXJ2ZS5wb2ludEZyb21YKGlzT2RkLCB4KVxuICB9IGVsc2Uge1xuICAgIGFzc2VydC5lcXVhbChidWZmZXIubGVuZ3RoLCAxICsgYnl0ZUxlbmd0aCArIGJ5dGVMZW5ndGgsICdJbnZhbGlkIHNlcXVlbmNlIGxlbmd0aCcpXG5cbiAgICB2YXIgeSA9IEJpZ0ludGVnZXIuZnJvbUJ1ZmZlcihidWZmZXIuc2xpY2UoMSArIGJ5dGVMZW5ndGgpKVxuICAgIFEgPSBQb2ludC5mcm9tQWZmaW5lKGN1cnZlLCB4LCB5KVxuICB9XG5cbiAgUS5jb21wcmVzc2VkID0gY29tcHJlc3NlZFxuICByZXR1cm4gUVxufVxuXG5Qb2ludC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0aGlzLmN1cnZlLmlzSW5maW5pdHkodGhpcykpIHJldHVybiAnKElORklOSVRZKSdcblxuICByZXR1cm4gJygnICsgdGhpcy5hZmZpbmVYLnRvU3RyaW5nKCkgKyAnLCcgKyB0aGlzLmFmZmluZVkudG9TdHJpbmcoKSArICcpJ1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBvaW50XG4iLCIvLyBjb25zdGFudC1zcGFjZSBtZXJrbGUgcm9vdCBjYWxjdWxhdGlvbiBhbGdvcml0aG1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmFzdFJvb3QgKHZhbHVlcywgZGlnZXN0Rm4pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlcykpIHRocm93IFR5cGVFcnJvcignRXhwZWN0ZWQgdmFsdWVzIEFycmF5JylcbiAgaWYgKHR5cGVvZiBkaWdlc3RGbiAhPT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKCdFeHBlY3RlZCBkaWdlc3QgRnVuY3Rpb24nKVxuXG4gIHZhciBsZW5ndGggPSB2YWx1ZXMubGVuZ3RoXG4gIHZhciByZXN1bHRzID0gdmFsdWVzLmNvbmNhdCgpXG5cbiAgd2hpbGUgKGxlbmd0aCA+IDEpIHtcbiAgICB2YXIgaiA9IDBcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDIsICsraikge1xuICAgICAgdmFyIGxlZnQgPSByZXN1bHRzW2ldXG4gICAgICB2YXIgcmlnaHQgPSBpICsgMSA9PT0gbGVuZ3RoID8gbGVmdCA6IHJlc3VsdHNbaSArIDFdXG4gICAgICB2YXIgZGF0YSA9IEJ1ZmZlci5jb25jYXQoW2xlZnQsIHJpZ2h0XSlcblxuICAgICAgcmVzdWx0c1tqXSA9IGRpZ2VzdEZuKGRhdGEpXG4gICAgfVxuXG4gICAgbGVuZ3RoID0galxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHNbMF1cbn1cbiIsInZhciBPUFMgPSByZXF1aXJlKCdiaXRjb2luLW9wcycpXG5cbmZ1bmN0aW9uIGVuY29kaW5nTGVuZ3RoIChpKSB7XG4gIHJldHVybiBpIDwgT1BTLk9QX1BVU0hEQVRBMSA/IDFcbiAgOiBpIDw9IDB4ZmYgPyAyXG4gIDogaSA8PSAweGZmZmYgPyAzXG4gIDogNVxufVxuXG5mdW5jdGlvbiBlbmNvZGUgKGJ1ZmZlciwgbnVtYmVyLCBvZmZzZXQpIHtcbiAgdmFyIHNpemUgPSBlbmNvZGluZ0xlbmd0aChudW1iZXIpXG5cbiAgLy8gfjYgYml0XG4gIGlmIChzaXplID09PSAxKSB7XG4gICAgYnVmZmVyLndyaXRlVUludDgobnVtYmVyLCBvZmZzZXQpXG5cbiAgLy8gOCBiaXRcbiAgfSBlbHNlIGlmIChzaXplID09PSAyKSB7XG4gICAgYnVmZmVyLndyaXRlVUludDgoT1BTLk9QX1BVU0hEQVRBMSwgb2Zmc2V0KVxuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KG51bWJlciwgb2Zmc2V0ICsgMSlcblxuICAvLyAxNiBiaXRcbiAgfSBlbHNlIGlmIChzaXplID09PSAzKSB7XG4gICAgYnVmZmVyLndyaXRlVUludDgoT1BTLk9QX1BVU0hEQVRBMiwgb2Zmc2V0KVxuICAgIGJ1ZmZlci53cml0ZVVJbnQxNkxFKG51bWJlciwgb2Zmc2V0ICsgMSlcblxuICAvLyAzMiBiaXRcbiAgfSBlbHNlIHtcbiAgICBidWZmZXIud3JpdGVVSW50OChPUFMuT1BfUFVTSERBVEE0LCBvZmZzZXQpXG4gICAgYnVmZmVyLndyaXRlVUludDMyTEUobnVtYmVyLCBvZmZzZXQgKyAxKVxuICB9XG5cbiAgcmV0dXJuIHNpemVcbn1cblxuZnVuY3Rpb24gZGVjb2RlIChidWZmZXIsIG9mZnNldCkge1xuICB2YXIgb3Bjb2RlID0gYnVmZmVyLnJlYWRVSW50OChvZmZzZXQpXG4gIHZhciBudW1iZXIsIHNpemVcblxuICAvLyB+NiBiaXRcbiAgaWYgKG9wY29kZSA8IE9QUy5PUF9QVVNIREFUQTEpIHtcbiAgICBudW1iZXIgPSBvcGNvZGVcbiAgICBzaXplID0gMVxuXG4gIC8vIDggYml0XG4gIH0gZWxzZSBpZiAob3Bjb2RlID09PSBPUFMuT1BfUFVTSERBVEExKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPiBidWZmZXIubGVuZ3RoKSByZXR1cm4gbnVsbFxuICAgIG51bWJlciA9IGJ1ZmZlci5yZWFkVUludDgob2Zmc2V0ICsgMSlcbiAgICBzaXplID0gMlxuXG4gIC8vIDE2IGJpdFxuICB9IGVsc2UgaWYgKG9wY29kZSA9PT0gT1BTLk9QX1BVU0hEQVRBMikge1xuICAgIGlmIChvZmZzZXQgKyAzID4gYnVmZmVyLmxlbmd0aCkgcmV0dXJuIG51bGxcbiAgICBudW1iZXIgPSBidWZmZXIucmVhZFVJbnQxNkxFKG9mZnNldCArIDEpXG4gICAgc2l6ZSA9IDNcblxuICAvLyAzMiBiaXRcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgNSA+IGJ1ZmZlci5sZW5ndGgpIHJldHVybiBudWxsXG4gICAgaWYgKG9wY29kZSAhPT0gT1BTLk9QX1BVU0hEQVRBNCkgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIG9wY29kZScpXG5cbiAgICBudW1iZXIgPSBidWZmZXIucmVhZFVJbnQzMkxFKG9mZnNldCArIDEpXG4gICAgc2l6ZSA9IDVcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb3Bjb2RlOiBvcGNvZGUsXG4gICAgbnVtYmVyOiBudW1iZXIsXG4gICAgc2l6ZTogc2l6ZVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBlbmNvZGluZ0xlbmd0aDogZW5jb2RpbmdMZW5ndGgsXG4gIGVuY29kZTogZW5jb2RlLFxuICBkZWNvZGU6IGRlY29kZVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCdjcnlwdG8nKS5yYW5kb21CeXRlc1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm9kZS9uby1kZXByZWNhdGVkLWFwaSAqL1xudmFyIGJ1ZmZlciA9IHJlcXVpcmUoJ2J1ZmZlcicpXG52YXIgQnVmZmVyID0gYnVmZmVyLkJ1ZmZlclxuXG4vLyBhbHRlcm5hdGl2ZSB0byB1c2luZyBPYmplY3Qua2V5cyBmb3Igb2xkIGJyb3dzZXJzXG5mdW5jdGlvbiBjb3B5UHJvcHMgKHNyYywgZHN0KSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICBkc3Rba2V5XSA9IHNyY1trZXldXG4gIH1cbn1cbmlmIChCdWZmZXIuZnJvbSAmJiBCdWZmZXIuYWxsb2MgJiYgQnVmZmVyLmFsbG9jVW5zYWZlICYmIEJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSBidWZmZXJcbn0gZWxzZSB7XG4gIC8vIENvcHkgcHJvcGVydGllcyBmcm9tIHJlcXVpcmUoJ2J1ZmZlcicpXG4gIGNvcHlQcm9wcyhidWZmZXIsIGV4cG9ydHMpXG4gIGV4cG9ydHMuQnVmZmVyID0gU2FmZUJ1ZmZlclxufVxuXG5mdW5jdGlvbiBTYWZlQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gQnVmZmVyKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG4vLyBDb3B5IHN0YXRpYyBtZXRob2RzIGZyb20gQnVmZmVyXG5jb3B5UHJvcHMoQnVmZmVyLCBTYWZlQnVmZmVyKVxuXG5TYWZlQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG4gIHJldHVybiBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cblNhZmVCdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9XG4gIHZhciBidWYgPSBCdWZmZXIoc2l6ZSlcbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICBidWYuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLmZpbGwoZmlsbClcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYnVmLmZpbGwoMClcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cblNhZmVCdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlcihzaXplKVxufVxuXG5TYWZlQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfVxuICByZXR1cm4gYnVmZmVyLlNsb3dCdWZmZXIoc2l6ZSlcbn1cbiIsInZhciBuYXRpdmUgPSByZXF1aXJlKCcuL25hdGl2ZScpXG5cbmZ1bmN0aW9uIGdldFR5cGVOYW1lIChmbikge1xuICByZXR1cm4gZm4ubmFtZSB8fCBmbi50b1N0cmluZygpLm1hdGNoKC9mdW5jdGlvbiAoLio/KVxccypcXCgvKVsxXVxufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZVR5cGVOYW1lICh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlLk5pbCh2YWx1ZSkgPyAnJyA6IGdldFR5cGVOYW1lKHZhbHVlLmNvbnN0cnVjdG9yKVxufVxuXG5mdW5jdGlvbiBnZXRWYWx1ZSAodmFsdWUpIHtcbiAgaWYgKG5hdGl2ZS5GdW5jdGlvbih2YWx1ZSkpIHJldHVybiAnJ1xuICBpZiAobmF0aXZlLlN0cmluZyh2YWx1ZSkpIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSlcbiAgaWYgKHZhbHVlICYmIG5hdGl2ZS5PYmplY3QodmFsdWUpKSByZXR1cm4gJydcbiAgcmV0dXJuIHZhbHVlXG59XG5cbmZ1bmN0aW9uIGNhcHR1cmVTdGFja1RyYWNlIChlLCB0KSB7XG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKGUsIHQpXG4gIH1cbn1cblxuZnVuY3Rpb24gdGZKU09OICh0eXBlKSB7XG4gIGlmIChuYXRpdmUuRnVuY3Rpb24odHlwZSkpIHJldHVybiB0eXBlLnRvSlNPTiA/IHR5cGUudG9KU09OKCkgOiBnZXRUeXBlTmFtZSh0eXBlKVxuICBpZiAobmF0aXZlLkFycmF5KHR5cGUpKSByZXR1cm4gJ0FycmF5J1xuICBpZiAodHlwZSAmJiBuYXRpdmUuT2JqZWN0KHR5cGUpKSByZXR1cm4gJ09iamVjdCdcblxuICByZXR1cm4gdHlwZSAhPT0gdW5kZWZpbmVkID8gdHlwZSA6ICcnXG59XG5cbmZ1bmN0aW9uIHRmRXJyb3JTdHJpbmcgKHR5cGUsIHZhbHVlLCB2YWx1ZVR5cGVOYW1lKSB7XG4gIHZhciB2YWx1ZUpzb24gPSBnZXRWYWx1ZSh2YWx1ZSlcblxuICByZXR1cm4gJ0V4cGVjdGVkICcgKyB0ZkpTT04odHlwZSkgKyAnLCBnb3QnICtcbiAgICAodmFsdWVUeXBlTmFtZSAhPT0gJycgPyAnICcgKyB2YWx1ZVR5cGVOYW1lIDogJycpICtcbiAgICAodmFsdWVKc29uICE9PSAnJyA/ICcgJyArIHZhbHVlSnNvbiA6ICcnKVxufVxuXG5mdW5jdGlvbiBUZlR5cGVFcnJvciAodHlwZSwgdmFsdWUsIHZhbHVlVHlwZU5hbWUpIHtcbiAgdmFsdWVUeXBlTmFtZSA9IHZhbHVlVHlwZU5hbWUgfHwgZ2V0VmFsdWVUeXBlTmFtZSh2YWx1ZSlcbiAgdGhpcy5tZXNzYWdlID0gdGZFcnJvclN0cmluZyh0eXBlLCB2YWx1ZSwgdmFsdWVUeXBlTmFtZSlcblxuICBjYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBUZlR5cGVFcnJvcilcbiAgdGhpcy5fX3R5cGUgPSB0eXBlXG4gIHRoaXMuX192YWx1ZSA9IHZhbHVlXG4gIHRoaXMuX192YWx1ZVR5cGVOYW1lID0gdmFsdWVUeXBlTmFtZVxufVxuXG5UZlR5cGVFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSlcblRmVHlwZUVycm9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRmVHlwZUVycm9yXG5cbmZ1bmN0aW9uIHRmUHJvcGVydHlFcnJvclN0cmluZyAodHlwZSwgbGFiZWwsIG5hbWUsIHZhbHVlLCB2YWx1ZVR5cGVOYW1lKSB7XG4gIHZhciBkZXNjcmlwdGlvbiA9ICdcIiBvZiB0eXBlICdcbiAgaWYgKGxhYmVsID09PSAna2V5JykgZGVzY3JpcHRpb24gPSAnXCIgd2l0aCBrZXkgdHlwZSAnXG5cbiAgcmV0dXJuIHRmRXJyb3JTdHJpbmcoJ3Byb3BlcnR5IFwiJyArIHRmSlNPTihuYW1lKSArIGRlc2NyaXB0aW9uICsgdGZKU09OKHR5cGUpLCB2YWx1ZSwgdmFsdWVUeXBlTmFtZSlcbn1cblxuZnVuY3Rpb24gVGZQcm9wZXJ0eVR5cGVFcnJvciAodHlwZSwgcHJvcGVydHksIGxhYmVsLCB2YWx1ZSwgdmFsdWVUeXBlTmFtZSkge1xuICBpZiAodHlwZSkge1xuICAgIHZhbHVlVHlwZU5hbWUgPSB2YWx1ZVR5cGVOYW1lIHx8IGdldFZhbHVlVHlwZU5hbWUodmFsdWUpXG4gICAgdGhpcy5tZXNzYWdlID0gdGZQcm9wZXJ0eUVycm9yU3RyaW5nKHR5cGUsIGxhYmVsLCBwcm9wZXJ0eSwgdmFsdWUsIHZhbHVlVHlwZU5hbWUpXG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tZXNzYWdlID0gJ1VuZXhwZWN0ZWQgcHJvcGVydHkgXCInICsgcHJvcGVydHkgKyAnXCInXG4gIH1cblxuICBjYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBUZlR5cGVFcnJvcilcbiAgdGhpcy5fX2xhYmVsID0gbGFiZWxcbiAgdGhpcy5fX3Byb3BlcnR5ID0gcHJvcGVydHlcbiAgdGhpcy5fX3R5cGUgPSB0eXBlXG4gIHRoaXMuX192YWx1ZSA9IHZhbHVlXG4gIHRoaXMuX192YWx1ZVR5cGVOYW1lID0gdmFsdWVUeXBlTmFtZVxufVxuXG5UZlByb3BlcnR5VHlwZUVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKVxuVGZQcm9wZXJ0eVR5cGVFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUZlR5cGVFcnJvclxuXG5mdW5jdGlvbiB0ZkN1c3RvbUVycm9yIChleHBlY3RlZCwgYWN0dWFsKSB7XG4gIHJldHVybiBuZXcgVGZUeXBlRXJyb3IoZXhwZWN0ZWQsIHt9LCBhY3R1YWwpXG59XG5cbmZ1bmN0aW9uIHRmU3ViRXJyb3IgKGUsIHByb3BlcnR5LCBsYWJlbCkge1xuICAvLyBzdWIgY2hpbGQ/XG4gIGlmIChlIGluc3RhbmNlb2YgVGZQcm9wZXJ0eVR5cGVFcnJvcikge1xuICAgIHByb3BlcnR5ID0gcHJvcGVydHkgKyAnLicgKyBlLl9fcHJvcGVydHlcblxuICAgIGUgPSBuZXcgVGZQcm9wZXJ0eVR5cGVFcnJvcihcbiAgICAgIGUuX190eXBlLCBwcm9wZXJ0eSwgZS5fX2xhYmVsLCBlLl9fdmFsdWUsIGUuX192YWx1ZVR5cGVOYW1lXG4gICAgKVxuXG4gIC8vIGNoaWxkP1xuICB9IGVsc2UgaWYgKGUgaW5zdGFuY2VvZiBUZlR5cGVFcnJvcikge1xuICAgIGUgPSBuZXcgVGZQcm9wZXJ0eVR5cGVFcnJvcihcbiAgICAgIGUuX190eXBlLCBwcm9wZXJ0eSwgbGFiZWwsIGUuX192YWx1ZSwgZS5fX3ZhbHVlVHlwZU5hbWVcbiAgICApXG4gIH1cblxuICBjYXB0dXJlU3RhY2tUcmFjZShlKVxuICByZXR1cm4gZVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgVGZUeXBlRXJyb3I6IFRmVHlwZUVycm9yLFxuICBUZlByb3BlcnR5VHlwZUVycm9yOiBUZlByb3BlcnR5VHlwZUVycm9yLFxuICB0ZkN1c3RvbUVycm9yOiB0ZkN1c3RvbUVycm9yLFxuICB0ZlN1YkVycm9yOiB0ZlN1YkVycm9yLFxuICB0ZkpTT046IHRmSlNPTixcbiAgZ2V0VmFsdWVUeXBlTmFtZTogZ2V0VmFsdWVUeXBlTmFtZVxufVxuIiwidmFyIE5BVElWRSA9IHJlcXVpcmUoJy4vbmF0aXZlJylcbnZhciBFUlJPUlMgPSByZXF1aXJlKCcuL2Vycm9ycycpXG5cbmZ1bmN0aW9uIF9CdWZmZXIgKHZhbHVlKSB7XG4gIHJldHVybiBCdWZmZXIuaXNCdWZmZXIodmFsdWUpXG59XG5cbmZ1bmN0aW9uIEhleCAodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgL14oWzAtOWEtZl17Mn0pKyQvaS50ZXN0KHZhbHVlKVxufVxuXG5mdW5jdGlvbiBfTGVuZ3RoTiAodHlwZSwgbGVuZ3RoKSB7XG4gIHZhciBuYW1lID0gdHlwZS50b0pTT04oKVxuXG4gIGZ1bmN0aW9uIExlbmd0aCAodmFsdWUpIHtcbiAgICBpZiAoIXR5cGUodmFsdWUpKSByZXR1cm4gZmFsc2VcbiAgICBpZiAodmFsdWUubGVuZ3RoID09PSBsZW5ndGgpIHJldHVybiB0cnVlXG5cbiAgICB0aHJvdyBFUlJPUlMudGZDdXN0b21FcnJvcihuYW1lICsgJyhMZW5ndGg6ICcgKyBsZW5ndGggKyAnKScsIG5hbWUgKyAnKExlbmd0aDogJyArIHZhbHVlLmxlbmd0aCArICcpJylcbiAgfVxuICBMZW5ndGgudG9KU09OID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gbmFtZSB9XG5cbiAgcmV0dXJuIExlbmd0aFxufVxuXG52YXIgX0FycmF5TiA9IF9MZW5ndGhOLmJpbmQobnVsbCwgTkFUSVZFLkFycmF5KVxudmFyIF9CdWZmZXJOID0gX0xlbmd0aE4uYmluZChudWxsLCBfQnVmZmVyKVxudmFyIF9IZXhOID0gX0xlbmd0aE4uYmluZChudWxsLCBIZXgpXG52YXIgX1N0cmluZ04gPSBfTGVuZ3RoTi5iaW5kKG51bGwsIE5BVElWRS5TdHJpbmcpXG5cbmZ1bmN0aW9uIFJhbmdlIChhLCBiLCBmKSB7XG4gIGYgPSBmIHx8IE5BVElWRS5OdW1iZXJcbiAgZnVuY3Rpb24gX3JhbmdlICh2YWx1ZSwgc3RyaWN0KSB7XG4gICAgcmV0dXJuIGYodmFsdWUsIHN0cmljdCkgJiYgKHZhbHVlID4gYSkgJiYgKHZhbHVlIDwgYilcbiAgfVxuICBfcmFuZ2UudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBgJHtmLnRvSlNPTigpfSBiZXR3ZWVuIFske2F9LCAke2J9XWBcbiAgfVxuICByZXR1cm4gX3JhbmdlXG59XG5cbnZhciBJTlQ1M19NQVggPSBNYXRoLnBvdygyLCA1MykgLSAxXG5cbmZ1bmN0aW9uIEZpbml0ZSAodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUodmFsdWUpXG59XG5mdW5jdGlvbiBJbnQ4ICh2YWx1ZSkgeyByZXR1cm4gKCh2YWx1ZSA8PCAyNCkgPj4gMjQpID09PSB2YWx1ZSB9XG5mdW5jdGlvbiBJbnQxNiAodmFsdWUpIHsgcmV0dXJuICgodmFsdWUgPDwgMTYpID4+IDE2KSA9PT0gdmFsdWUgfVxuZnVuY3Rpb24gSW50MzIgKHZhbHVlKSB7IHJldHVybiAodmFsdWUgfCAwKSA9PT0gdmFsdWUgfVxuZnVuY3Rpb24gSW50NTMgKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPj0gLUlOVDUzX01BWCAmJlxuICAgIHZhbHVlIDw9IElOVDUzX01BWCAmJlxuICAgIE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZVxufVxuZnVuY3Rpb24gVUludDggKHZhbHVlKSB7IHJldHVybiAodmFsdWUgJiAweGZmKSA9PT0gdmFsdWUgfVxuZnVuY3Rpb24gVUludDE2ICh2YWx1ZSkgeyByZXR1cm4gKHZhbHVlICYgMHhmZmZmKSA9PT0gdmFsdWUgfVxuZnVuY3Rpb24gVUludDMyICh2YWx1ZSkgeyByZXR1cm4gKHZhbHVlID4+PiAwKSA9PT0gdmFsdWUgfVxuZnVuY3Rpb24gVUludDUzICh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID49IDAgJiZcbiAgICB2YWx1ZSA8PSBJTlQ1M19NQVggJiZcbiAgICBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWVcbn1cblxudmFyIHR5cGVzID0ge1xuICBBcnJheU46IF9BcnJheU4sXG4gIEJ1ZmZlcjogX0J1ZmZlcixcbiAgQnVmZmVyTjogX0J1ZmZlck4sXG4gIEZpbml0ZTogRmluaXRlLFxuICBIZXg6IEhleCxcbiAgSGV4TjogX0hleE4sXG4gIEludDg6IEludDgsXG4gIEludDE2OiBJbnQxNixcbiAgSW50MzI6IEludDMyLFxuICBJbnQ1MzogSW50NTMsXG4gIFJhbmdlOiBSYW5nZSxcbiAgU3RyaW5nTjogX1N0cmluZ04sXG4gIFVJbnQ4OiBVSW50OCxcbiAgVUludDE2OiBVSW50MTYsXG4gIFVJbnQzMjogVUludDMyLFxuICBVSW50NTM6IFVJbnQ1M1xufVxuXG5mb3IgKHZhciB0eXBlTmFtZSBpbiB0eXBlcykge1xuICB0eXBlc1t0eXBlTmFtZV0udG9KU09OID0gZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdFxuICB9LmJpbmQobnVsbCwgdHlwZU5hbWUpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZXNcbiIsInZhciBFUlJPUlMgPSByZXF1aXJlKCcuL2Vycm9ycycpXG52YXIgTkFUSVZFID0gcmVxdWlyZSgnLi9uYXRpdmUnKVxuXG4vLyBzaG9ydC1oYW5kXG52YXIgdGZKU09OID0gRVJST1JTLnRmSlNPTlxudmFyIFRmVHlwZUVycm9yID0gRVJST1JTLlRmVHlwZUVycm9yXG52YXIgVGZQcm9wZXJ0eVR5cGVFcnJvciA9IEVSUk9SUy5UZlByb3BlcnR5VHlwZUVycm9yXG52YXIgdGZTdWJFcnJvciA9IEVSUk9SUy50ZlN1YkVycm9yXG52YXIgZ2V0VmFsdWVUeXBlTmFtZSA9IEVSUk9SUy5nZXRWYWx1ZVR5cGVOYW1lXG5cbnZhciBUWVBFUyA9IHtcbiAgYXJyYXlPZjogZnVuY3Rpb24gYXJyYXlPZiAodHlwZSwgb3B0aW9ucykge1xuICAgIHR5cGUgPSBjb21waWxlKHR5cGUpXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cblxuICAgIGZ1bmN0aW9uIF9hcnJheU9mIChhcnJheSwgc3RyaWN0KSB7XG4gICAgICBpZiAoIU5BVElWRS5BcnJheShhcnJheSkpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKE5BVElWRS5OaWwoYXJyYXkpKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmIChvcHRpb25zLm1pbkxlbmd0aCAhPT0gdW5kZWZpbmVkICYmIGFycmF5Lmxlbmd0aCA8IG9wdGlvbnMubWluTGVuZ3RoKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmIChvcHRpb25zLm1heExlbmd0aCAhPT0gdW5kZWZpbmVkICYmIGFycmF5Lmxlbmd0aCA+IG9wdGlvbnMubWF4TGVuZ3RoKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmIChvcHRpb25zLmxlbmd0aCAhPT0gdW5kZWZpbmVkICYmIGFycmF5Lmxlbmd0aCAhPT0gb3B0aW9ucy5sZW5ndGgpIHJldHVybiBmYWxzZVxuXG4gICAgICByZXR1cm4gYXJyYXkuZXZlcnkoZnVuY3Rpb24gKHZhbHVlLCBpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVmb3JjZSh0eXBlLCB2YWx1ZSwgc3RyaWN0KVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgdGhyb3cgdGZTdWJFcnJvcihlLCBpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBfYXJyYXlPZi50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RyID0gJ1snICsgdGZKU09OKHR5cGUpICsgJ10nXG4gICAgICBpZiAob3B0aW9ucy5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzdHIgKz0gJ3snICsgb3B0aW9ucy5sZW5ndGggKyAnfSdcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5taW5MZW5ndGggIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zLm1heExlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHN0ciArPSAneycgK1xuICAgICAgICAgIChvcHRpb25zLm1pbkxlbmd0aCA9PT0gdW5kZWZpbmVkID8gMCA6IG9wdGlvbnMubWluTGVuZ3RoKSArICcsJyArXG4gICAgICAgICAgKG9wdGlvbnMubWF4TGVuZ3RoID09PSB1bmRlZmluZWQgPyBJbmZpbml0eSA6IG9wdGlvbnMubWF4TGVuZ3RoKSArICd9J1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0clxuICAgIH1cblxuICAgIHJldHVybiBfYXJyYXlPZlxuICB9LFxuXG4gIG1heWJlOiBmdW5jdGlvbiBtYXliZSAodHlwZSkge1xuICAgIHR5cGUgPSBjb21waWxlKHR5cGUpXG5cbiAgICBmdW5jdGlvbiBfbWF5YmUgKHZhbHVlLCBzdHJpY3QpIHtcbiAgICAgIHJldHVybiBOQVRJVkUuTmlsKHZhbHVlKSB8fCB0eXBlKHZhbHVlLCBzdHJpY3QsIG1heWJlKVxuICAgIH1cbiAgICBfbWF5YmUudG9KU09OID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJz8nICsgdGZKU09OKHR5cGUpIH1cblxuICAgIHJldHVybiBfbWF5YmVcbiAgfSxcblxuICBtYXA6IGZ1bmN0aW9uIG1hcCAocHJvcGVydHlUeXBlLCBwcm9wZXJ0eUtleVR5cGUpIHtcbiAgICBwcm9wZXJ0eVR5cGUgPSBjb21waWxlKHByb3BlcnR5VHlwZSlcbiAgICBpZiAocHJvcGVydHlLZXlUeXBlKSBwcm9wZXJ0eUtleVR5cGUgPSBjb21waWxlKHByb3BlcnR5S2V5VHlwZSlcblxuICAgIGZ1bmN0aW9uIF9tYXAgKHZhbHVlLCBzdHJpY3QpIHtcbiAgICAgIGlmICghTkFUSVZFLk9iamVjdCh2YWx1ZSkpIHJldHVybiBmYWxzZVxuICAgICAgaWYgKE5BVElWRS5OaWwodmFsdWUpKSByZXR1cm4gZmFsc2VcblxuICAgICAgZm9yICh2YXIgcHJvcGVydHlOYW1lIGluIHZhbHVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHByb3BlcnR5S2V5VHlwZSkge1xuICAgICAgICAgICAgdHlwZWZvcmNlKHByb3BlcnR5S2V5VHlwZSwgcHJvcGVydHlOYW1lLCBzdHJpY3QpXG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgdGhyb3cgdGZTdWJFcnJvcihlLCBwcm9wZXJ0eU5hbWUsICdrZXknKVxuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IHZhbHVlW3Byb3BlcnR5TmFtZV1cbiAgICAgICAgICB0eXBlZm9yY2UocHJvcGVydHlUeXBlLCBwcm9wZXJ0eVZhbHVlLCBzdHJpY3QpXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICB0aHJvdyB0ZlN1YkVycm9yKGUsIHByb3BlcnR5TmFtZSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChwcm9wZXJ0eUtleVR5cGUpIHtcbiAgICAgIF9tYXAudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gJ3snICsgdGZKU09OKHByb3BlcnR5S2V5VHlwZSkgKyAnOiAnICsgdGZKU09OKHByb3BlcnR5VHlwZSkgKyAnfSdcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgX21hcC50b0pTT04gPSBmdW5jdGlvbiAoKSB7IHJldHVybiAneycgKyB0ZkpTT04ocHJvcGVydHlUeXBlKSArICd9JyB9XG4gICAgfVxuXG4gICAgcmV0dXJuIF9tYXBcbiAgfSxcblxuICBvYmplY3Q6IGZ1bmN0aW9uIG9iamVjdCAodW5jb21waWxlZCkge1xuICAgIHZhciB0eXBlID0ge31cblxuICAgIGZvciAodmFyIHR5cGVQcm9wZXJ0eU5hbWUgaW4gdW5jb21waWxlZCkge1xuICAgICAgdHlwZVt0eXBlUHJvcGVydHlOYW1lXSA9IGNvbXBpbGUodW5jb21waWxlZFt0eXBlUHJvcGVydHlOYW1lXSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfb2JqZWN0ICh2YWx1ZSwgc3RyaWN0KSB7XG4gICAgICBpZiAoIU5BVElWRS5PYmplY3QodmFsdWUpKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmIChOQVRJVkUuTmlsKHZhbHVlKSkgcmV0dXJuIGZhbHNlXG5cbiAgICAgIHZhciBwcm9wZXJ0eU5hbWVcblxuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChwcm9wZXJ0eU5hbWUgaW4gdHlwZSkge1xuICAgICAgICAgIHZhciBwcm9wZXJ0eVR5cGUgPSB0eXBlW3Byb3BlcnR5TmFtZV1cbiAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZSA9IHZhbHVlW3Byb3BlcnR5TmFtZV1cblxuICAgICAgICAgIHR5cGVmb3JjZShwcm9wZXJ0eVR5cGUsIHByb3BlcnR5VmFsdWUsIHN0cmljdClcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aHJvdyB0ZlN1YkVycm9yKGUsIHByb3BlcnR5TmFtZSlcbiAgICAgIH1cblxuICAgICAgaWYgKHN0cmljdCkge1xuICAgICAgICBmb3IgKHByb3BlcnR5TmFtZSBpbiB2YWx1ZSkge1xuICAgICAgICAgIGlmICh0eXBlW3Byb3BlcnR5TmFtZV0pIGNvbnRpbnVlXG5cbiAgICAgICAgICB0aHJvdyBuZXcgVGZQcm9wZXJ0eVR5cGVFcnJvcih1bmRlZmluZWQsIHByb3BlcnR5TmFtZSlcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBfb2JqZWN0LnRvSlNPTiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRmSlNPTih0eXBlKSB9XG5cbiAgICByZXR1cm4gX29iamVjdFxuICB9LFxuXG4gIGFueU9mOiBmdW5jdGlvbiBhbnlPZiAoKSB7XG4gICAgdmFyIHR5cGVzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMpLm1hcChjb21waWxlKVxuXG4gICAgZnVuY3Rpb24gX2FueU9mICh2YWx1ZSwgc3RyaWN0KSB7XG4gICAgICByZXR1cm4gdHlwZXMuc29tZShmdW5jdGlvbiAodHlwZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiB0eXBlZm9yY2UodHlwZSwgdmFsdWUsIHN0cmljdClcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBfYW55T2YudG9KU09OID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdHlwZXMubWFwKHRmSlNPTikuam9pbignfCcpIH1cblxuICAgIHJldHVybiBfYW55T2ZcbiAgfSxcblxuICBhbGxPZjogZnVuY3Rpb24gYWxsT2YgKCkge1xuICAgIHZhciB0eXBlcyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzKS5tYXAoY29tcGlsZSlcblxuICAgIGZ1bmN0aW9uIF9hbGxPZiAodmFsdWUsIHN0cmljdCkge1xuICAgICAgcmV0dXJuIHR5cGVzLmV2ZXJ5KGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIHR5cGVmb3JjZSh0eXBlLCB2YWx1ZSwgc3RyaWN0KVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIF9hbGxPZi50b0pTT04gPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlcy5tYXAodGZKU09OKS5qb2luKCcgJiAnKSB9XG5cbiAgICByZXR1cm4gX2FsbE9mXG4gIH0sXG5cbiAgcXVhY2tzTGlrZTogZnVuY3Rpb24gcXVhY2tzTGlrZSAodHlwZSkge1xuICAgIGZ1bmN0aW9uIF9xdWFja3NMaWtlICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHR5cGUgPT09IGdldFZhbHVlVHlwZU5hbWUodmFsdWUpXG4gICAgfVxuICAgIF9xdWFja3NMaWtlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHR5cGUgfVxuXG4gICAgcmV0dXJuIF9xdWFja3NMaWtlXG4gIH0sXG5cbiAgdHVwbGU6IGZ1bmN0aW9uIHR1cGxlICgpIHtcbiAgICB2YXIgdHlwZXMgPSBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykubWFwKGNvbXBpbGUpXG5cbiAgICBmdW5jdGlvbiBfdHVwbGUgKHZhbHVlcywgc3RyaWN0KSB7XG4gICAgICBpZiAoTkFUSVZFLk5pbCh2YWx1ZXMpKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmIChOQVRJVkUuTmlsKHZhbHVlcy5sZW5ndGgpKSByZXR1cm4gZmFsc2VcbiAgICAgIGlmIChzdHJpY3QgJiYgKHZhbHVlcy5sZW5ndGggIT09IHR5cGVzLmxlbmd0aCkpIHJldHVybiBmYWxzZVxuXG4gICAgICByZXR1cm4gdHlwZXMuZXZlcnkoZnVuY3Rpb24gKHR5cGUsIGkpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gdHlwZWZvcmNlKHR5cGUsIHZhbHVlc1tpXSwgc3RyaWN0KVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgdGhyb3cgdGZTdWJFcnJvcihlLCBpKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgICBfdHVwbGUudG9KU09OID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJygnICsgdHlwZXMubWFwKHRmSlNPTikuam9pbignLCAnKSArICcpJyB9XG5cbiAgICByZXR1cm4gX3R1cGxlXG4gIH0sXG5cbiAgdmFsdWU6IGZ1bmN0aW9uIHZhbHVlIChleHBlY3RlZCkge1xuICAgIGZ1bmN0aW9uIF92YWx1ZSAoYWN0dWFsKSB7XG4gICAgICByZXR1cm4gYWN0dWFsID09PSBleHBlY3RlZFxuICAgIH1cbiAgICBfdmFsdWUudG9KU09OID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gZXhwZWN0ZWQgfVxuXG4gICAgcmV0dXJuIF92YWx1ZVxuICB9XG59XG5cbi8vIFRPRE86IGRlcHJlY2F0ZVxuVFlQRVMub25lT2YgPSBUWVBFUy5hbnlPZlxuXG5mdW5jdGlvbiBjb21waWxlICh0eXBlKSB7XG4gIGlmIChOQVRJVkUuU3RyaW5nKHR5cGUpKSB7XG4gICAgaWYgKHR5cGVbMF0gPT09ICc/JykgcmV0dXJuIFRZUEVTLm1heWJlKHR5cGUuc2xpY2UoMSkpXG5cbiAgICByZXR1cm4gTkFUSVZFW3R5cGVdIHx8IFRZUEVTLnF1YWNrc0xpa2UodHlwZSlcbiAgfSBlbHNlIGlmICh0eXBlICYmIE5BVElWRS5PYmplY3QodHlwZSkpIHtcbiAgICBpZiAoTkFUSVZFLkFycmF5KHR5cGUpKSB7XG4gICAgICBpZiAodHlwZS5sZW5ndGggIT09IDEpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIGNvbXBpbGUoKSBwYXJhbWV0ZXIgb2YgdHlwZSBBcnJheSBvZiBsZW5ndGggMScpXG4gICAgICByZXR1cm4gVFlQRVMuYXJyYXlPZih0eXBlWzBdKVxuICAgIH1cblxuICAgIHJldHVybiBUWVBFUy5vYmplY3QodHlwZSlcbiAgfSBlbHNlIGlmIChOQVRJVkUuRnVuY3Rpb24odHlwZSkpIHtcbiAgICByZXR1cm4gdHlwZVxuICB9XG5cbiAgcmV0dXJuIFRZUEVTLnZhbHVlKHR5cGUpXG59XG5cbmZ1bmN0aW9uIHR5cGVmb3JjZSAodHlwZSwgdmFsdWUsIHN0cmljdCwgc3Vycm9nYXRlKSB7XG4gIGlmIChOQVRJVkUuRnVuY3Rpb24odHlwZSkpIHtcbiAgICBpZiAodHlwZSh2YWx1ZSwgc3RyaWN0KSkgcmV0dXJuIHRydWVcblxuICAgIHRocm93IG5ldyBUZlR5cGVFcnJvcihzdXJyb2dhdGUgfHwgdHlwZSwgdmFsdWUpXG4gIH1cblxuICAvLyBKSVRcbiAgcmV0dXJuIHR5cGVmb3JjZShjb21waWxlKHR5cGUpLCB2YWx1ZSwgc3RyaWN0KVxufVxuXG4vLyBhc3NpZ24gdHlwZXMgdG8gdHlwZWZvcmNlIGZ1bmN0aW9uXG5mb3IgKHZhciB0eXBlTmFtZSBpbiBOQVRJVkUpIHtcbiAgdHlwZWZvcmNlW3R5cGVOYW1lXSA9IE5BVElWRVt0eXBlTmFtZV1cbn1cblxuZm9yICh0eXBlTmFtZSBpbiBUWVBFUykge1xuICB0eXBlZm9yY2VbdHlwZU5hbWVdID0gVFlQRVNbdHlwZU5hbWVdXG59XG5cbnZhciBFWFRSQSA9IHJlcXVpcmUoJy4vZXh0cmEnKVxuZm9yICh0eXBlTmFtZSBpbiBFWFRSQSkge1xuICB0eXBlZm9yY2VbdHlwZU5hbWVdID0gRVhUUkFbdHlwZU5hbWVdXG59XG5cbnR5cGVmb3JjZS5jb21waWxlID0gY29tcGlsZVxudHlwZWZvcmNlLlRmVHlwZUVycm9yID0gVGZUeXBlRXJyb3JcbnR5cGVmb3JjZS5UZlByb3BlcnR5VHlwZUVycm9yID0gVGZQcm9wZXJ0eVR5cGVFcnJvclxuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVmb3JjZVxuIiwidmFyIHR5cGVzID0ge1xuICBBcnJheTogZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLmNvbnN0cnVjdG9yID09PSBBcnJheSB9LFxuICBCb29sZWFuOiBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nIH0sXG4gIEZ1bmN0aW9uOiBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyB9LFxuICBOaWw6IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbCB9LFxuICBOdW1iZXI6IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyB9LFxuICBPYmplY3Q6IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyB9LFxuICBTdHJpbmc6IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyB9LFxuICAnJzogZnVuY3Rpb24gKCkgeyByZXR1cm4gdHJ1ZSB9XG59XG5cbi8vIFRPRE86IGRlcHJlY2F0ZVxudHlwZXMuTnVsbCA9IHR5cGVzLk5pbFxuXG5mb3IgKHZhciB0eXBlTmFtZSBpbiB0eXBlcykge1xuICB0eXBlc1t0eXBlTmFtZV0udG9KU09OID0gZnVuY3Rpb24gKHQpIHtcbiAgICByZXR1cm4gdFxuICB9LmJpbmQobnVsbCwgdHlwZU5hbWUpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHlwZXNcbiIsIid1c2Ugc3RyaWN0J1xudmFyIEJ1ZmZlciA9IHJlcXVpcmUoJ3NhZmUtYnVmZmVyJykuQnVmZmVyXG5cbi8vIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTFcblxuZnVuY3Rpb24gY2hlY2tVSW50NTMgKG4pIHtcbiAgaWYgKG4gPCAwIHx8IG4gPiBNQVhfU0FGRV9JTlRFR0VSIHx8IG4gJSAxICE9PSAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndmFsdWUgb3V0IG9mIHJhbmdlJylcbn1cblxuZnVuY3Rpb24gZW5jb2RlIChudW1iZXIsIGJ1ZmZlciwgb2Zmc2V0KSB7XG4gIGNoZWNrVUludDUzKG51bWJlcilcblxuICBpZiAoIWJ1ZmZlcikgYnVmZmVyID0gQnVmZmVyLmFsbG9jVW5zYWZlKGVuY29kaW5nTGVuZ3RoKG51bWJlcikpXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZmZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2J1ZmZlciBtdXN0IGJlIGEgQnVmZmVyIGluc3RhbmNlJylcbiAgaWYgKCFvZmZzZXQpIG9mZnNldCA9IDBcblxuICAvLyA4IGJpdFxuICBpZiAobnVtYmVyIDwgMHhmZCkge1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KG51bWJlciwgb2Zmc2V0KVxuICAgIGVuY29kZS5ieXRlcyA9IDFcblxuICAvLyAxNiBiaXRcbiAgfSBlbHNlIGlmIChudW1iZXIgPD0gMHhmZmZmKSB7XG4gICAgYnVmZmVyLndyaXRlVUludDgoMHhmZCwgb2Zmc2V0KVxuICAgIGJ1ZmZlci53cml0ZVVJbnQxNkxFKG51bWJlciwgb2Zmc2V0ICsgMSlcbiAgICBlbmNvZGUuYnl0ZXMgPSAzXG5cbiAgLy8gMzIgYml0XG4gIH0gZWxzZSBpZiAobnVtYmVyIDw9IDB4ZmZmZmZmZmYpIHtcbiAgICBidWZmZXIud3JpdGVVSW50OCgweGZlLCBvZmZzZXQpXG4gICAgYnVmZmVyLndyaXRlVUludDMyTEUobnVtYmVyLCBvZmZzZXQgKyAxKVxuICAgIGVuY29kZS5ieXRlcyA9IDVcblxuICAvLyA2NCBiaXRcbiAgfSBlbHNlIHtcbiAgICBidWZmZXIud3JpdGVVSW50OCgweGZmLCBvZmZzZXQpXG4gICAgYnVmZmVyLndyaXRlVUludDMyTEUobnVtYmVyID4+PiAwLCBvZmZzZXQgKyAxKVxuICAgIGJ1ZmZlci53cml0ZVVJbnQzMkxFKChudW1iZXIgLyAweDEwMDAwMDAwMCkgfCAwLCBvZmZzZXQgKyA1KVxuICAgIGVuY29kZS5ieXRlcyA9IDlcbiAgfVxuXG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gZGVjb2RlIChidWZmZXIsIG9mZnNldCkge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWZmZXIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdidWZmZXIgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICghb2Zmc2V0KSBvZmZzZXQgPSAwXG5cbiAgdmFyIGZpcnN0ID0gYnVmZmVyLnJlYWRVSW50OChvZmZzZXQpXG5cbiAgLy8gOCBiaXRcbiAgaWYgKGZpcnN0IDwgMHhmZCkge1xuICAgIGRlY29kZS5ieXRlcyA9IDFcbiAgICByZXR1cm4gZmlyc3RcblxuICAvLyAxNiBiaXRcbiAgfSBlbHNlIGlmIChmaXJzdCA9PT0gMHhmZCkge1xuICAgIGRlY29kZS5ieXRlcyA9IDNcbiAgICByZXR1cm4gYnVmZmVyLnJlYWRVSW50MTZMRShvZmZzZXQgKyAxKVxuXG4gIC8vIDMyIGJpdFxuICB9IGVsc2UgaWYgKGZpcnN0ID09PSAweGZlKSB7XG4gICAgZGVjb2RlLmJ5dGVzID0gNVxuICAgIHJldHVybiBidWZmZXIucmVhZFVJbnQzMkxFKG9mZnNldCArIDEpXG5cbiAgLy8gNjQgYml0XG4gIH0gZWxzZSB7XG4gICAgZGVjb2RlLmJ5dGVzID0gOVxuICAgIHZhciBsbyA9IGJ1ZmZlci5yZWFkVUludDMyTEUob2Zmc2V0ICsgMSlcbiAgICB2YXIgaGkgPSBidWZmZXIucmVhZFVJbnQzMkxFKG9mZnNldCArIDUpXG4gICAgdmFyIG51bWJlciA9IGhpICogMHgwMTAwMDAwMDAwICsgbG9cbiAgICBjaGVja1VJbnQ1MyhudW1iZXIpXG5cbiAgICByZXR1cm4gbnVtYmVyXG4gIH1cbn1cblxuZnVuY3Rpb24gZW5jb2RpbmdMZW5ndGggKG51bWJlcikge1xuICBjaGVja1VJbnQ1MyhudW1iZXIpXG5cbiAgcmV0dXJuIChcbiAgICBudW1iZXIgPCAweGZkID8gMVxuICA6IG51bWJlciA8PSAweGZmZmYgPyAzXG4gIDogbnVtYmVyIDw9IDB4ZmZmZmZmZmYgPyA1XG4gIDogOVxuICApXG59XG5cbm1vZHVsZS5leHBvcnRzID0geyBlbmNvZGU6IGVuY29kZSwgZGVjb2RlOiBkZWNvZGUsIGVuY29kaW5nTGVuZ3RoOiBlbmNvZGluZ0xlbmd0aCB9XG4iLCJ2YXIgYnM1OGNoZWNrID0gcmVxdWlyZSgnYnM1OGNoZWNrJylcblxuZnVuY3Rpb24gZGVjb2RlUmF3IChidWZmZXIsIHZlcnNpb24pIHtcbiAgLy8gY2hlY2sgdmVyc2lvbiBvbmx5IGlmIGRlZmluZWRcbiAgaWYgKHZlcnNpb24gIT09IHVuZGVmaW5lZCAmJiBidWZmZXJbMF0gIT09IHZlcnNpb24pIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBuZXR3b3JrIHZlcnNpb24nKVxuXG4gIC8vIHVuY29tcHJlc3NlZFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMzMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmVyc2lvbjogYnVmZmVyWzBdLFxuICAgICAgcHJpdmF0ZUtleTogYnVmZmVyLnNsaWNlKDEsIDMzKSxcbiAgICAgIGNvbXByZXNzZWQ6IGZhbHNlXG4gICAgfVxuICB9XG5cbiAgLy8gaW52YWxpZCBsZW5ndGhcbiAgaWYgKGJ1ZmZlci5sZW5ndGggIT09IDM0KSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgV0lGIGxlbmd0aCcpXG5cbiAgLy8gaW52YWxpZCBjb21wcmVzc2lvbiBmbGFnXG4gIGlmIChidWZmZXJbMzNdICE9PSAweDAxKSB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29tcHJlc3Npb24gZmxhZycpXG5cbiAgcmV0dXJuIHtcbiAgICB2ZXJzaW9uOiBidWZmZXJbMF0sXG4gICAgcHJpdmF0ZUtleTogYnVmZmVyLnNsaWNlKDEsIDMzKSxcbiAgICBjb21wcmVzc2VkOiB0cnVlXG4gIH1cbn1cblxuZnVuY3Rpb24gZW5jb2RlUmF3ICh2ZXJzaW9uLCBwcml2YXRlS2V5LCBjb21wcmVzc2VkKSB7XG4gIHZhciByZXN1bHQgPSBuZXcgQnVmZmVyKGNvbXByZXNzZWQgPyAzNCA6IDMzKVxuXG4gIHJlc3VsdC53cml0ZVVJbnQ4KHZlcnNpb24sIDApXG4gIHByaXZhdGVLZXkuY29weShyZXN1bHQsIDEpXG5cbiAgaWYgKGNvbXByZXNzZWQpIHtcbiAgICByZXN1bHRbMzNdID0gMHgwMVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdFxufVxuXG5mdW5jdGlvbiBkZWNvZGUgKHN0cmluZywgdmVyc2lvbikge1xuICByZXR1cm4gZGVjb2RlUmF3KGJzNThjaGVjay5kZWNvZGUoc3RyaW5nKSwgdmVyc2lvbilcbn1cblxuZnVuY3Rpb24gZW5jb2RlICh2ZXJzaW9uLCBwcml2YXRlS2V5LCBjb21wcmVzc2VkKSB7XG4gIGlmICh0eXBlb2YgdmVyc2lvbiA9PT0gJ251bWJlcicpIHJldHVybiBiczU4Y2hlY2suZW5jb2RlKGVuY29kZVJhdyh2ZXJzaW9uLCBwcml2YXRlS2V5LCBjb21wcmVzc2VkKSlcblxuICByZXR1cm4gYnM1OGNoZWNrLmVuY29kZShcbiAgICBlbmNvZGVSYXcoXG4gICAgICB2ZXJzaW9uLnZlcnNpb24sXG4gICAgICB2ZXJzaW9uLnByaXZhdGVLZXksXG4gICAgICB2ZXJzaW9uLmNvbXByZXNzZWRcbiAgICApXG4gIClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGRlY29kZTogZGVjb2RlLFxuICBkZWNvZGVSYXc6IGRlY29kZVJhdyxcbiAgZW5jb2RlOiBlbmNvZGUsXG4gIGVuY29kZVJhdzogZW5jb2RlUmF3XG59XG4iLCIvLyBXQUxMRVRcbi8vXG4vLyBTdWJjb21tYW5kczpcbi8vIC0gbmV3XG4vLyAtIGRlcml2ZS1wdWJrZXlcbi8vIC0gZGVyaXZlLXByaXZrZXlcbi8vIC0gc3BlbmRcblxuaW1wb3J0IHsgSEROb2RlLCBUcmFuc2FjdGlvbkJ1aWxkZXIsIG5ldHdvcmtzIH0gZnJvbSBcImJpdGNvaW5qcy1saWJcIjtcbmltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSBcImNyeXB0b1wiO1xuXG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuL1R5cGVzXCI7XG5cbi8qIENPTkZJRyAqL1xuXG5jb25zdCBuZXR3b3JrID0gbmV0d29ya3MudGVzdG5ldDtcblxuLyogUFJPR1JBTSAqL1xuXG5pZiAodHlwZW9mIHByb2Nlc3MuYXJndlsyXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICBwcm9jZXNzLnN0ZGVyci53cml0ZShcIlNlZSByZWFkbWUgZm9yIHVzYWdlXCIpO1xuICBwcm9jZXNzLmV4aXQoMSk7XG59XG5cbmNvbnN0IGNtZCA9IHByb2Nlc3MuYXJndlsyXTtcblxuc3dpdGNoIChjbWQpIHtcbiAgY2FzZSBcIm5ld1wiOiB7XG4gICAgLy8gR2VuZXJhdGUgYSBicmFuZCBuZXcgd2FsbGV0XG4gICAgbmV3V2FsbGV0KCk7XG4gICAgYnJlYWs7XG4gIH1cbiAgY2FzZSBcInNwZW5kXCI6IHtcbiAgICAvLyBHZW5lcmF0ZSBhIHJhdyB0cmFuc2FjdGlvblxuICAgIHNwZW5kKCk7XG4gICAgYnJlYWs7XG4gIH1cbiAgY2FzZSBcImRlcml2ZS1wdWJrZXlcIjoge1xuICAgIGRlcml2ZUtleShmYWxzZSk7XG4gICAgYnJlYWs7XG4gIH1cbiAgY2FzZSBcImRlcml2ZS1wcml2a2V5XCI6IHtcbiAgICBkZXJpdmVLZXkodHJ1ZSk7XG4gICAgYnJlYWs7XG4gIH1cbiAgZGVmYXVsdDoge1xuICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKFwiVW5yZWNvZ25pemVkIGNvbW1hbmQ6IFwiICsgY21kKTtcbiAgICBwcm9jZXNzLmV4aXQoMik7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVyaXZlS2V5KHByaXY6IGJvb2xlYW4pIHtcbiAgLy8gUmVhZCBkZXJpdmF0aW9uIHBhdGh3YXkgZnJvbSBzdGRpblxuICBsZXQgZGF0YSA9IFwiXCI7XG4gIHByb2Nlc3Muc3RkaW4ub24oXCJkYXRhXCIsIGNodW5rID0+IHtcbiAgICBkYXRhICs9IGNodW5rO1xuICB9KTtcbiAgcHJvY2Vzcy5zdGRpbi5vbihcImVuZFwiLCAoKSA9PiB7XG4gICAgY29uc3QgeyB3YWxsZXQ1OCwgcGF0aHMgfSA9IEpTT04ucGFyc2UoZGF0YSkgYXMgSW5wdXQuRGVyaXZlO1xuICAgIGNvbnN0IHdhbGxldCA9IEhETm9kZS5mcm9tQmFzZTU4KHdhbGxldDU4LCBuZXR3b3JrKTtcbiAgICBjb25zdCBiNThzID0gcGF0aHMubWFwKHBhdGggPT4ge1xuICAgICAgY29uc3QgbmV3S2V5ID0gd2FsbGV0LmRlcml2ZVBhdGgocGF0aCk7XG4gICAgICByZXR1cm4gcHJpdiA/IG5ld0tleS50b0Jhc2U1OCgpIDogbmV3S2V5Lm5ldXRlcmVkKCkudG9CYXNlNTgoKTtcbiAgICB9KTtcbiAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShKU09OLnN0cmluZ2lmeShiNThzKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBuZXdXYWxsZXQoKSB7XG4gIGNvbnN0IHdhbGxldCA9IEhETm9kZS5mcm9tU2VlZEJ1ZmZlcihyYW5kb21CeXRlcyg2NCksIG5ldHdvcmspO1xuICBwcm9jZXNzLnN0ZG91dC53cml0ZShKU09OLnN0cmluZ2lmeSh3YWxsZXQudG9CYXNlNTgoKSkpO1xufVxuXG5mdW5jdGlvbiBzcGVuZCgpIHtcbiAgbGV0IGRhdGEgPSBcIlwiO1xuICBwcm9jZXNzLnN0ZGluLm9uKFwiZGF0YVwiLCBjaHVuayA9PiB7XG4gICAgZGF0YSArPSBjaHVuaztcbiAgfSk7XG4gIHByb2Nlc3Muc3RkaW4ub24oXCJlbmRcIiwgKCkgPT4ge1xuICAgIGNvbnN0IHNwID0gSlNPTi5wYXJzZShkYXRhKSBhcyBJbnB1dC5TcGVuZDtcbiAgICBjb25zdCB3YWxsZXQgPSBIRE5vZGUuZnJvbUJhc2U1OChzcC53YWxsZXQ1OCwgbmV0d29yayk7XG4gICAgY29uc3Qgc2lnbmVkID0gc3AudHhzLm1hcCh0eCA9PiB7XG4gICAgICBsZXQgdHhiID0gbmV3IFRyYW5zYWN0aW9uQnVpbGRlcihuZXR3b3JrKTtcbiAgICAgIHR4Lm91dHB1dHMuZm9yRWFjaChvdXQgPT4gdHhiLmFkZE91dHB1dChvdXQuYWRkcmVzcywgb3V0LmFtb3VudCkpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0eC5pbnB1dHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdHhJZCA9IEJ1ZmZlci5mcm9tKHR4LmlucHV0c1tpXS50eElkLCBcImhleFwiKTtcbiAgICAgICAgdHhiLmFkZElucHV0KHR4SWQsIHR4LmlucHV0c1tpXS52b3V0KTtcbiAgICAgICAgdHhiLnNpZ24oaSwgd2FsbGV0LmRlcml2ZVBhdGgodHguaW5wdXRzW2ldLmZ1bGxQYXRoKS5rZXlQYWlyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0eGIuYnVpbGQoKS50b0hleCgpO1xuICAgIH0pO1xuICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKEpTT04uc3RyaW5naWZ5KHNpZ25lZCkpO1xuICB9KTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImFzc2VydFwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJidWZmZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY3J5cHRvXCIpOyJdLCJzb3VyY2VSb290IjoiIn0=