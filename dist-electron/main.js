import { ipcMain as p, screen as Rt, BrowserWindow as Te, app as P, desktopCapturer as es, shell as ts, dialog as Ie, nativeImage as ss, Tray as rs, Menu as is } from "electron";
import { fileURLToPath as Lt } from "node:url";
import m from "node:path";
import W from "node:fs/promises";
import { WritableStream as It } from "stream/web";
import ns from "events";
import os from "https";
import as from "http";
import ls from "net";
import cs from "tls";
import Ke from "crypto";
import le, { Readable as fs } from "stream";
import hs from "url";
import ds from "zlib";
import us from "buffer";
import * as je from "fs";
import { createReadStream as ps } from "fs";
import { spawn as ms } from "child_process";
import * as Ut from "path";
import * as _s from "os";
const oe = m.dirname(Lt(import.meta.url)), gs = m.join(oe, ".."), Y = process.env.VITE_DEV_SERVER_URL, He = m.join(gs, "dist");
let K = null;
p.on("hud-overlay-hide", () => {
  K && !K.isDestroyed() && K.minimize();
});
function ys() {
  const s = Rt.getPrimaryDisplay(), { workArea: e } = s, t = 500, i = 350, r = Math.floor(e.x + (e.width - t) / 2), n = Math.floor(e.y + e.height - i - 5), o = new Te({
    width: t,
    height: i,
    minWidth: 500,
    maxWidth: 500,
    minHeight: 350,
    maxHeight: 350,
    x: r,
    y: n,
    frame: !1,
    transparent: !0,
    resizable: !1,
    alwaysOnTop: !0,
    skipTaskbar: !0,
    hasShadow: !1,
    webPreferences: {
      preload: m.join(oe, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      backgroundThrottling: !1
    }
  });
  return o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), o.webContents.setWindowOpenHandler(({ url: a }) => a.includes("windowType=mic-settings") ? {
    action: "allow",
    overrideBrowserWindowOptions: {
      width: 340,
      height: 520,
      frame: !1,
      transparent: !0,
      resizable: !1,
      alwaysOnTop: !0,
      skipTaskbar: !0,
      parent: o,
      modal: !1,
      webPreferences: {
        preload: m.join(oe, "preload.mjs"),
        nodeIntegration: !1,
        contextIsolation: !0
      }
    }
  } : { action: "deny" }), K = o, o.on("closed", () => {
    K === o && (K = null);
  }), Y ? o.loadURL(Y + "?windowType=hud-overlay") : o.loadFile(m.join(He, "index.html"), {
    query: { windowType: "hud-overlay" }
  }), o;
}
function Ss() {
  const s = process.platform === "darwin", e = new Te({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    ...s && {
      titleBarStyle: "hiddenInset",
      trafficLightPosition: { x: 12, y: 12 }
    },
    transparent: !1,
    resizable: !0,
    alwaysOnTop: !1,
    skipTaskbar: !1,
    title: "OpenScreen",
    backgroundColor: "#000000",
    webPreferences: {
      preload: m.join(oe, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0,
      webSecurity: !1,
      backgroundThrottling: !1
    }
  });
  return e.maximize(), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Y ? e.loadURL(Y + "?windowType=editor") : e.loadFile(m.join(He, "index.html"), {
    query: { windowType: "editor" }
  }), e;
}
function ws() {
  const { width: s, height: e } = Rt.getPrimaryDisplay().workAreaSize, t = new Te({
    width: 620,
    height: 420,
    minHeight: 350,
    maxHeight: 500,
    x: Math.round((s - 620) / 2),
    y: Math.round((e - 420) / 2),
    frame: !1,
    resizable: !1,
    alwaysOnTop: !0,
    transparent: !0,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: m.join(oe, "preload.mjs"),
      nodeIntegration: !1,
      contextIsolation: !0
    }
  });
  return Y ? t.loadURL(Y + "?windowType=source-selector") : t.loadFile(m.join(He, "index.html"), {
    query: { windowType: "source-selector" }
  }), t;
}
const Es = "presets.json", vs = 1;
function Ve() {
  return m.join(P.getPath("userData"), Es);
}
function Ue() {
  return {
    version: vs,
    defaultPresetId: null,
    presets: []
  };
}
async function X() {
  try {
    const s = Ve(), e = await W.readFile(s, "utf-8"), t = JSON.parse(e);
    return !t.presets || !Array.isArray(t.presets) ? (console.warn("Invalid presets file, creating new store"), Ue()) : t;
  } catch (s) {
    if (s.code === "ENOENT")
      return Ue();
    console.error("Failed to read presets file:", s);
    try {
      const e = Ve(), t = e + ".backup." + Date.now();
      await W.rename(e, t), console.log("Backed up corrupt presets file to:", t);
    } catch {
    }
    return Ue();
  }
}
async function ce(s) {
  const e = Ve();
  await W.writeFile(e, JSON.stringify(s, null, 2), "utf-8");
}
async function bs() {
  try {
    const s = await X();
    return {
      success: !0,
      presets: s.presets,
      defaultPresetId: s.defaultPresetId
    };
  } catch (s) {
    return console.error("Failed to get presets:", s), {
      success: !1,
      presets: [],
      defaultPresetId: null
    };
  }
}
async function xs(s) {
  try {
    const e = await X(), t = {
      ...s,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    return t.isDefault && (e.presets = e.presets.map((i) => ({ ...i, isDefault: !1 })), e.defaultPresetId = t.id), e.presets.push(t), await ce(e), { success: !0, preset: t };
  } catch (e) {
    return console.error("Failed to save preset:", e), { success: !1, error: String(e) };
  }
}
async function Ts(s, e) {
  try {
    const t = await X(), i = t.presets.findIndex((r) => r.id === s);
    return i === -1 ? { success: !1, error: "Preset not found" } : (e.isDefault === !0 ? (t.presets = t.presets.map((r) => ({ ...r, isDefault: !1 })), t.defaultPresetId = s) : e.isDefault === !1 && t.defaultPresetId === s && (t.defaultPresetId = null), t.presets[i] = { ...t.presets[i], ...e }, await ce(t), { success: !0, preset: t.presets[i] });
  } catch (t) {
    return console.error("Failed to update preset:", t), { success: !1, error: String(t) };
  }
}
async function ks(s) {
  try {
    const e = await X(), t = e.presets.findIndex((i) => i.id === s);
    return t === -1 ? { success: !1, error: "Preset not found" } : (e.defaultPresetId === s && (e.defaultPresetId = null), e.presets.splice(t, 1), await ce(e), { success: !0 });
  } catch (e) {
    return console.error("Failed to delete preset:", e), { success: !1, error: String(e) };
  }
}
async function Os(s) {
  try {
    const e = await X(), t = e.presets.find((r) => r.id === s);
    if (!t)
      return { success: !1, error: "Preset not found" };
    const i = {
      ...t,
      id: crypto.randomUUID(),
      name: `Copy of ${t.name}`,
      createdAt: Date.now(),
      isDefault: !1
      // Duplicates should never be default
    };
    return e.presets.push(i), await ce(e), { success: !0, preset: i };
  } catch (e) {
    return console.error("Failed to duplicate preset:", e), { success: !1, error: String(e) };
  }
}
async function Ps(s) {
  try {
    const e = await X();
    if (e.presets = e.presets.map((t) => ({ ...t, isDefault: !1 })), e.defaultPresetId = null, s) {
      const t = e.presets.find((i) => i.id === s);
      if (!t)
        return { success: !1, error: "Preset not found" };
      t.isDefault = !0, e.defaultPresetId = s;
    }
    return await ce(e), { success: !0 };
  } catch (e) {
    return console.error("Failed to set default preset:", e), { success: !1, error: String(e) };
  }
}
function Rs(s) {
  return s && s.__esModule && Object.prototype.hasOwnProperty.call(s, "default") ? s.default : s;
}
var we = { exports: {} };
const Nt = ["nodebuffer", "arraybuffer", "fragments"], Bt = typeof Blob < "u";
Bt && Nt.push("blob");
var D = {
  BINARY_TYPES: Nt,
  CLOSE_TIMEOUT: 3e4,
  EMPTY_BUFFER: Buffer.alloc(0),
  GUID: "258EAFA5-E914-47DA-95CA-C5AB0DC85B11",
  hasBlob: Bt,
  kForOnEventAttribute: Symbol("kIsForOnEventAttribute"),
  kListener: Symbol("kListener"),
  kStatusCode: Symbol("status-code"),
  kWebSocket: Symbol("websocket"),
  NOOP: () => {
  }
}, Ls, Is;
const { EMPTY_BUFFER: Us } = D, qe = Buffer[Symbol.species];
function Ns(s, e) {
  if (s.length === 0) return Us;
  if (s.length === 1) return s[0];
  const t = Buffer.allocUnsafe(e);
  let i = 0;
  for (let r = 0; r < s.length; r++) {
    const n = s[r];
    t.set(n, i), i += n.length;
  }
  return i < e ? new qe(t.buffer, t.byteOffset, i) : t;
}
function Ct(s, e, t, i, r) {
  for (let n = 0; n < r; n++)
    t[i + n] = s[n] ^ e[n & 3];
}
function At(s, e) {
  for (let t = 0; t < s.length; t++)
    s[t] ^= e[t & 3];
}
function Bs(s) {
  return s.length === s.buffer.byteLength ? s.buffer : s.buffer.slice(s.byteOffset, s.byteOffset + s.length);
}
function Ge(s) {
  if (Ge.readOnly = !0, Buffer.isBuffer(s)) return s;
  let e;
  return s instanceof ArrayBuffer ? e = new qe(s) : ArrayBuffer.isView(s) ? e = new qe(s.buffer, s.byteOffset, s.byteLength) : (e = Buffer.from(s), Ge.readOnly = !1), e;
}
we.exports = {
  concat: Ns,
  mask: Ct,
  toArrayBuffer: Bs,
  toBuffer: Ge,
  unmask: At
};
if (!process.env.WS_NO_BUFFER_UTIL)
  try {
    const s = require("bufferutil");
    Is = we.exports.mask = function(e, t, i, r, n) {
      n < 48 ? Ct(e, t, i, r, n) : s.mask(e, t, i, r, n);
    }, Ls = we.exports.unmask = function(e, t) {
      e.length < 32 ? At(e, t) : s.unmask(e, t);
    };
  } catch {
  }
var ke = we.exports;
const tt = Symbol("kDone"), Ne = Symbol("kRun");
let Cs = class {
  /**
   * Creates a new `Limiter`.
   *
   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
   *     to run concurrently
   */
  constructor(e) {
    this[tt] = () => {
      this.pending--, this[Ne]();
    }, this.concurrency = e || 1 / 0, this.jobs = [], this.pending = 0;
  }
  /**
   * Adds a job to the queue.
   *
   * @param {Function} job The job to run
   * @public
   */
  add(e) {
    this.jobs.push(e), this[Ne]();
  }
  /**
   * Removes a job from the queue and runs it if possible.
   *
   * @private
   */
  [Ne]() {
    if (this.pending !== this.concurrency && this.jobs.length) {
      const e = this.jobs.shift();
      this.pending++, e(this[tt]);
    }
  }
};
var As = Cs;
const te = ds, st = ke, Ds = As, { kStatusCode: Dt } = D, $s = Buffer[Symbol.species], Fs = Buffer.from([0, 0, 255, 255]), Ee = Symbol("permessage-deflate"), U = Symbol("total-length"), q = Symbol("callback"), C = Symbol("buffers"), H = Symbol("error");
let de, Ms = class {
  /**
   * Creates a PerMessageDeflate instance.
   *
   * @param {Object} [options] Configuration options
   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
   *     for, or request, a custom client window size
   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
   *     acknowledge disabling of client context takeover
   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
   *     calls to zlib
   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
   *     use of a custom server window size
   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
   *     disabling of server context takeover
   * @param {Number} [options.threshold=1024] Size (in bytes) below which
   *     messages should not be compressed if context takeover is disabled
   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
   *     deflate
   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
   *     inflate
   * @param {Boolean} [isServer=false] Create the instance in either server or
   *     client mode
   * @param {Number} [maxPayload=0] The maximum allowed message length
   */
  constructor(e, t, i) {
    if (this._maxPayload = i | 0, this._options = e || {}, this._threshold = this._options.threshold !== void 0 ? this._options.threshold : 1024, this._isServer = !!t, this._deflate = null, this._inflate = null, this.params = null, !de) {
      const r = this._options.concurrencyLimit !== void 0 ? this._options.concurrencyLimit : 10;
      de = new Ds(r);
    }
  }
  /**
   * @type {String}
   */
  static get extensionName() {
    return "permessage-deflate";
  }
  /**
   * Create an extension negotiation offer.
   *
   * @return {Object} Extension parameters
   * @public
   */
  offer() {
    const e = {};
    return this._options.serverNoContextTakeover && (e.server_no_context_takeover = !0), this._options.clientNoContextTakeover && (e.client_no_context_takeover = !0), this._options.serverMaxWindowBits && (e.server_max_window_bits = this._options.serverMaxWindowBits), this._options.clientMaxWindowBits ? e.client_max_window_bits = this._options.clientMaxWindowBits : this._options.clientMaxWindowBits == null && (e.client_max_window_bits = !0), e;
  }
  /**
   * Accept an extension negotiation offer/response.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Object} Accepted configuration
   * @public
   */
  accept(e) {
    return e = this.normalizeParams(e), this.params = this._isServer ? this.acceptAsServer(e) : this.acceptAsClient(e), this.params;
  }
  /**
   * Releases all resources used by the extension.
   *
   * @public
   */
  cleanup() {
    if (this._inflate && (this._inflate.close(), this._inflate = null), this._deflate) {
      const e = this._deflate[q];
      this._deflate.close(), this._deflate = null, e && e(
        new Error(
          "The deflate stream was closed while data was being processed"
        )
      );
    }
  }
  /**
   *  Accept an extension negotiation offer.
   *
   * @param {Array} offers The extension negotiation offers
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsServer(e) {
    const t = this._options, i = e.find((r) => !(t.serverNoContextTakeover === !1 && r.server_no_context_takeover || r.server_max_window_bits && (t.serverMaxWindowBits === !1 || typeof t.serverMaxWindowBits == "number" && t.serverMaxWindowBits > r.server_max_window_bits) || typeof t.clientMaxWindowBits == "number" && !r.client_max_window_bits));
    if (!i)
      throw new Error("None of the extension offers can be accepted");
    return t.serverNoContextTakeover && (i.server_no_context_takeover = !0), t.clientNoContextTakeover && (i.client_no_context_takeover = !0), typeof t.serverMaxWindowBits == "number" && (i.server_max_window_bits = t.serverMaxWindowBits), typeof t.clientMaxWindowBits == "number" ? i.client_max_window_bits = t.clientMaxWindowBits : (i.client_max_window_bits === !0 || t.clientMaxWindowBits === !1) && delete i.client_max_window_bits, i;
  }
  /**
   * Accept the extension negotiation response.
   *
   * @param {Array} response The extension negotiation response
   * @return {Object} Accepted configuration
   * @private
   */
  acceptAsClient(e) {
    const t = e[0];
    if (this._options.clientNoContextTakeover === !1 && t.client_no_context_takeover)
      throw new Error('Unexpected parameter "client_no_context_takeover"');
    if (!t.client_max_window_bits)
      typeof this._options.clientMaxWindowBits == "number" && (t.client_max_window_bits = this._options.clientMaxWindowBits);
    else if (this._options.clientMaxWindowBits === !1 || typeof this._options.clientMaxWindowBits == "number" && t.client_max_window_bits > this._options.clientMaxWindowBits)
      throw new Error(
        'Unexpected or invalid parameter "client_max_window_bits"'
      );
    return t;
  }
  /**
   * Normalize parameters.
   *
   * @param {Array} configurations The extension negotiation offers/reponse
   * @return {Array} The offers/response with normalized parameters
   * @private
   */
  normalizeParams(e) {
    return e.forEach((t) => {
      Object.keys(t).forEach((i) => {
        let r = t[i];
        if (r.length > 1)
          throw new Error(`Parameter "${i}" must have only a single value`);
        if (r = r[0], i === "client_max_window_bits") {
          if (r !== !0) {
            const n = +r;
            if (!Number.isInteger(n) || n < 8 || n > 15)
              throw new TypeError(
                `Invalid value for parameter "${i}": ${r}`
              );
            r = n;
          } else if (!this._isServer)
            throw new TypeError(
              `Invalid value for parameter "${i}": ${r}`
            );
        } else if (i === "server_max_window_bits") {
          const n = +r;
          if (!Number.isInteger(n) || n < 8 || n > 15)
            throw new TypeError(
              `Invalid value for parameter "${i}": ${r}`
            );
          r = n;
        } else if (i === "client_no_context_takeover" || i === "server_no_context_takeover") {
          if (r !== !0)
            throw new TypeError(
              `Invalid value for parameter "${i}": ${r}`
            );
        } else
          throw new Error(`Unknown parameter "${i}"`);
        t[i] = r;
      });
    }), e;
  }
  /**
   * Decompress data. Concurrency limited.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  decompress(e, t, i) {
    de.add((r) => {
      this._decompress(e, t, (n, o) => {
        r(), i(n, o);
      });
    });
  }
  /**
   * Compress data. Concurrency limited.
   *
   * @param {(Buffer|String)} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @public
   */
  compress(e, t, i) {
    de.add((r) => {
      this._compress(e, t, (n, o) => {
        r(), i(n, o);
      });
    });
  }
  /**
   * Decompress data.
   *
   * @param {Buffer} data Compressed data
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _decompress(e, t, i) {
    const r = this._isServer ? "client" : "server";
    if (!this._inflate) {
      const n = `${r}_max_window_bits`, o = typeof this.params[n] != "number" ? te.Z_DEFAULT_WINDOWBITS : this.params[n];
      this._inflate = te.createInflateRaw({
        ...this._options.zlibInflateOptions,
        windowBits: o
      }), this._inflate[Ee] = this, this._inflate[U] = 0, this._inflate[C] = [], this._inflate.on("error", js), this._inflate.on("data", $t);
    }
    this._inflate[q] = i, this._inflate.write(e), t && this._inflate.write(Fs), this._inflate.flush(() => {
      const n = this._inflate[H];
      if (n) {
        this._inflate.close(), this._inflate = null, i(n);
        return;
      }
      const o = st.concat(
        this._inflate[C],
        this._inflate[U]
      );
      this._inflate._readableState.endEmitted ? (this._inflate.close(), this._inflate = null) : (this._inflate[U] = 0, this._inflate[C] = [], t && this.params[`${r}_no_context_takeover`] && this._inflate.reset()), i(null, o);
    });
  }
  /**
   * Compress data.
   *
   * @param {(Buffer|String)} data Data to compress
   * @param {Boolean} fin Specifies whether or not this is the last fragment
   * @param {Function} callback Callback
   * @private
   */
  _compress(e, t, i) {
    const r = this._isServer ? "server" : "client";
    if (!this._deflate) {
      const n = `${r}_max_window_bits`, o = typeof this.params[n] != "number" ? te.Z_DEFAULT_WINDOWBITS : this.params[n];
      this._deflate = te.createDeflateRaw({
        ...this._options.zlibDeflateOptions,
        windowBits: o
      }), this._deflate[U] = 0, this._deflate[C] = [], this._deflate.on("data", Ws);
    }
    this._deflate[q] = i, this._deflate.write(e), this._deflate.flush(te.Z_SYNC_FLUSH, () => {
      if (!this._deflate)
        return;
      let n = st.concat(
        this._deflate[C],
        this._deflate[U]
      );
      t && (n = new $s(n.buffer, n.byteOffset, n.length - 4)), this._deflate[q] = null, this._deflate[U] = 0, this._deflate[C] = [], t && this.params[`${r}_no_context_takeover`] && this._deflate.reset(), i(null, n);
    });
  }
};
var Ye = Ms;
function Ws(s) {
  this[C].push(s), this[U] += s.length;
}
function $t(s) {
  if (this[U] += s.length, this[Ee]._maxPayload < 1 || this[U] <= this[Ee]._maxPayload) {
    this[C].push(s);
    return;
  }
  this[H] = new RangeError("Max payload size exceeded"), this[H].code = "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH", this[H][Dt] = 1009, this.removeListener("data", $t), this.reset();
}
function js(s) {
  if (this[Ee]._inflate = null, this[H]) {
    this[q](this[H]);
    return;
  }
  s[Dt] = 1007, this[q](s);
}
var ve = { exports: {} }, rt;
const { isUtf8: it } = us, { hasBlob: Vs } = D, qs = [
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  // 0 - 15
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  // 16 - 31
  0,
  1,
  0,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  1,
  1,
  0,
  1,
  1,
  0,
  // 32 - 47
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  0,
  0,
  0,
  // 48 - 63
  0,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  // 64 - 79
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  0,
  0,
  1,
  1,
  // 80 - 95
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  // 96 - 111
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  1,
  0,
  1,
  0,
  1,
  0
  // 112 - 127
];
function Gs(s) {
  return s >= 1e3 && s <= 1014 && s !== 1004 && s !== 1005 && s !== 1006 || s >= 3e3 && s <= 4999;
}
function Je(s) {
  const e = s.length;
  let t = 0;
  for (; t < e; )
    if (!(s[t] & 128))
      t++;
    else if ((s[t] & 224) === 192) {
      if (t + 1 === e || (s[t + 1] & 192) !== 128 || (s[t] & 254) === 192)
        return !1;
      t += 2;
    } else if ((s[t] & 240) === 224) {
      if (t + 2 >= e || (s[t + 1] & 192) !== 128 || (s[t + 2] & 192) !== 128 || s[t] === 224 && (s[t + 1] & 224) === 128 || // Overlong
      s[t] === 237 && (s[t + 1] & 224) === 160)
        return !1;
      t += 3;
    } else if ((s[t] & 248) === 240) {
      if (t + 3 >= e || (s[t + 1] & 192) !== 128 || (s[t + 2] & 192) !== 128 || (s[t + 3] & 192) !== 128 || s[t] === 240 && (s[t + 1] & 240) === 128 || // Overlong
      s[t] === 244 && s[t + 1] > 143 || s[t] > 244)
        return !1;
      t += 4;
    } else
      return !1;
  return !0;
}
function Js(s) {
  return Vs && typeof s == "object" && typeof s.arrayBuffer == "function" && typeof s.type == "string" && typeof s.stream == "function" && (s[Symbol.toStringTag] === "Blob" || s[Symbol.toStringTag] === "File");
}
ve.exports = {
  isBlob: Js,
  isValidStatusCode: Gs,
  isValidUTF8: Je,
  tokenChars: qs
};
if (it)
  rt = ve.exports.isValidUTF8 = function(s) {
    return s.length < 24 ? Je(s) : it(s);
  };
else if (!process.env.WS_NO_UTF_8_VALIDATE)
  try {
    const s = require("utf-8-validate");
    rt = ve.exports.isValidUTF8 = function(e) {
      return e.length < 32 ? Je(e) : s(e);
    };
  } catch {
  }
var fe = ve.exports;
const { Writable: zs } = le, nt = Ye, {
  BINARY_TYPES: Ks,
  EMPTY_BUFFER: ot,
  kStatusCode: Hs,
  kWebSocket: Ys
} = D, { concat: Be, toArrayBuffer: Xs, unmask: Zs } = ke, { isValidStatusCode: Qs, isValidUTF8: at } = fe, ue = Buffer[Symbol.species], T = 0, lt = 1, ct = 2, ft = 3, Ce = 4, Ae = 5, pe = 6;
let er = class extends zs {
  /**
   * Creates a Receiver instance.
   *
   * @param {Object} [options] Options object
   * @param {Boolean} [options.allowSynchronousEvents=true] Specifies whether
   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
   *     multiple times in the same tick
   * @param {String} [options.binaryType=nodebuffer] The type for binary data
   * @param {Object} [options.extensions] An object containing the negotiated
   *     extensions
   * @param {Boolean} [options.isServer=false] Specifies whether to operate in
   *     client or server mode
   * @param {Number} [options.maxPayload=0] The maximum allowed message length
   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
   *     not to skip UTF-8 validation for text and close messages
   */
  constructor(e = {}) {
    super(), this._allowSynchronousEvents = e.allowSynchronousEvents !== void 0 ? e.allowSynchronousEvents : !0, this._binaryType = e.binaryType || Ks[0], this._extensions = e.extensions || {}, this._isServer = !!e.isServer, this._maxPayload = e.maxPayload | 0, this._skipUTF8Validation = !!e.skipUTF8Validation, this[Ys] = void 0, this._bufferedBytes = 0, this._buffers = [], this._compressed = !1, this._payloadLength = 0, this._mask = void 0, this._fragmented = 0, this._masked = !1, this._fin = !1, this._opcode = 0, this._totalPayloadLength = 0, this._messageLength = 0, this._fragments = [], this._errored = !1, this._loop = !1, this._state = T;
  }
  /**
   * Implements `Writable.prototype._write()`.
   *
   * @param {Buffer} chunk The chunk of data to write
   * @param {String} encoding The character encoding of `chunk`
   * @param {Function} cb Callback
   * @private
   */
  _write(e, t, i) {
    if (this._opcode === 8 && this._state == T) return i();
    this._bufferedBytes += e.length, this._buffers.push(e), this.startLoop(i);
  }
  /**
   * Consumes `n` bytes from the buffered data.
   *
   * @param {Number} n The number of bytes to consume
   * @return {Buffer} The consumed bytes
   * @private
   */
  consume(e) {
    if (this._bufferedBytes -= e, e === this._buffers[0].length) return this._buffers.shift();
    if (e < this._buffers[0].length) {
      const i = this._buffers[0];
      return this._buffers[0] = new ue(
        i.buffer,
        i.byteOffset + e,
        i.length - e
      ), new ue(i.buffer, i.byteOffset, e);
    }
    const t = Buffer.allocUnsafe(e);
    do {
      const i = this._buffers[0], r = t.length - e;
      e >= i.length ? t.set(this._buffers.shift(), r) : (t.set(new Uint8Array(i.buffer, i.byteOffset, e), r), this._buffers[0] = new ue(
        i.buffer,
        i.byteOffset + e,
        i.length - e
      )), e -= i.length;
    } while (e > 0);
    return t;
  }
  /**
   * Starts the parsing loop.
   *
   * @param {Function} cb Callback
   * @private
   */
  startLoop(e) {
    this._loop = !0;
    do
      switch (this._state) {
        case T:
          this.getInfo(e);
          break;
        case lt:
          this.getPayloadLength16(e);
          break;
        case ct:
          this.getPayloadLength64(e);
          break;
        case ft:
          this.getMask();
          break;
        case Ce:
          this.getData(e);
          break;
        case Ae:
        case pe:
          this._loop = !1;
          return;
      }
    while (this._loop);
    this._errored || e();
  }
  /**
   * Reads the first two bytes of a frame.
   *
   * @param {Function} cb Callback
   * @private
   */
  getInfo(e) {
    if (this._bufferedBytes < 2) {
      this._loop = !1;
      return;
    }
    const t = this.consume(2);
    if (t[0] & 48) {
      const r = this.createError(
        RangeError,
        "RSV2 and RSV3 must be clear",
        !0,
        1002,
        "WS_ERR_UNEXPECTED_RSV_2_3"
      );
      e(r);
      return;
    }
    const i = (t[0] & 64) === 64;
    if (i && !this._extensions[nt.extensionName]) {
      const r = this.createError(
        RangeError,
        "RSV1 must be clear",
        !0,
        1002,
        "WS_ERR_UNEXPECTED_RSV_1"
      );
      e(r);
      return;
    }
    if (this._fin = (t[0] & 128) === 128, this._opcode = t[0] & 15, this._payloadLength = t[1] & 127, this._opcode === 0) {
      if (i) {
        const r = this.createError(
          RangeError,
          "RSV1 must be clear",
          !0,
          1002,
          "WS_ERR_UNEXPECTED_RSV_1"
        );
        e(r);
        return;
      }
      if (!this._fragmented) {
        const r = this.createError(
          RangeError,
          "invalid opcode 0",
          !0,
          1002,
          "WS_ERR_INVALID_OPCODE"
        );
        e(r);
        return;
      }
      this._opcode = this._fragmented;
    } else if (this._opcode === 1 || this._opcode === 2) {
      if (this._fragmented) {
        const r = this.createError(
          RangeError,
          `invalid opcode ${this._opcode}`,
          !0,
          1002,
          "WS_ERR_INVALID_OPCODE"
        );
        e(r);
        return;
      }
      this._compressed = i;
    } else if (this._opcode > 7 && this._opcode < 11) {
      if (!this._fin) {
        const r = this.createError(
          RangeError,
          "FIN must be set",
          !0,
          1002,
          "WS_ERR_EXPECTED_FIN"
        );
        e(r);
        return;
      }
      if (i) {
        const r = this.createError(
          RangeError,
          "RSV1 must be clear",
          !0,
          1002,
          "WS_ERR_UNEXPECTED_RSV_1"
        );
        e(r);
        return;
      }
      if (this._payloadLength > 125 || this._opcode === 8 && this._payloadLength === 1) {
        const r = this.createError(
          RangeError,
          `invalid payload length ${this._payloadLength}`,
          !0,
          1002,
          "WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH"
        );
        e(r);
        return;
      }
    } else {
      const r = this.createError(
        RangeError,
        `invalid opcode ${this._opcode}`,
        !0,
        1002,
        "WS_ERR_INVALID_OPCODE"
      );
      e(r);
      return;
    }
    if (!this._fin && !this._fragmented && (this._fragmented = this._opcode), this._masked = (t[1] & 128) === 128, this._isServer) {
      if (!this._masked) {
        const r = this.createError(
          RangeError,
          "MASK must be set",
          !0,
          1002,
          "WS_ERR_EXPECTED_MASK"
        );
        e(r);
        return;
      }
    } else if (this._masked) {
      const r = this.createError(
        RangeError,
        "MASK must be clear",
        !0,
        1002,
        "WS_ERR_UNEXPECTED_MASK"
      );
      e(r);
      return;
    }
    this._payloadLength === 126 ? this._state = lt : this._payloadLength === 127 ? this._state = ct : this.haveLength(e);
  }
  /**
   * Gets extended payload length (7+16).
   *
   * @param {Function} cb Callback
   * @private
   */
  getPayloadLength16(e) {
    if (this._bufferedBytes < 2) {
      this._loop = !1;
      return;
    }
    this._payloadLength = this.consume(2).readUInt16BE(0), this.haveLength(e);
  }
  /**
   * Gets extended payload length (7+64).
   *
   * @param {Function} cb Callback
   * @private
   */
  getPayloadLength64(e) {
    if (this._bufferedBytes < 8) {
      this._loop = !1;
      return;
    }
    const t = this.consume(8), i = t.readUInt32BE(0);
    if (i > Math.pow(2, 21) - 1) {
      const r = this.createError(
        RangeError,
        "Unsupported WebSocket frame: payload length > 2^53 - 1",
        !1,
        1009,
        "WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH"
      );
      e(r);
      return;
    }
    this._payloadLength = i * Math.pow(2, 32) + t.readUInt32BE(4), this.haveLength(e);
  }
  /**
   * Payload length has been read.
   *
   * @param {Function} cb Callback
   * @private
   */
  haveLength(e) {
    if (this._payloadLength && this._opcode < 8 && (this._totalPayloadLength += this._payloadLength, this._totalPayloadLength > this._maxPayload && this._maxPayload > 0)) {
      const t = this.createError(
        RangeError,
        "Max payload size exceeded",
        !1,
        1009,
        "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
      );
      e(t);
      return;
    }
    this._masked ? this._state = ft : this._state = Ce;
  }
  /**
   * Reads mask bytes.
   *
   * @private
   */
  getMask() {
    if (this._bufferedBytes < 4) {
      this._loop = !1;
      return;
    }
    this._mask = this.consume(4), this._state = Ce;
  }
  /**
   * Reads data bytes.
   *
   * @param {Function} cb Callback
   * @private
   */
  getData(e) {
    let t = ot;
    if (this._payloadLength) {
      if (this._bufferedBytes < this._payloadLength) {
        this._loop = !1;
        return;
      }
      t = this.consume(this._payloadLength), this._masked && this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3] && Zs(t, this._mask);
    }
    if (this._opcode > 7) {
      this.controlMessage(t, e);
      return;
    }
    if (this._compressed) {
      this._state = Ae, this.decompress(t, e);
      return;
    }
    t.length && (this._messageLength = this._totalPayloadLength, this._fragments.push(t)), this.dataMessage(e);
  }
  /**
   * Decompresses data.
   *
   * @param {Buffer} data Compressed data
   * @param {Function} cb Callback
   * @private
   */
  decompress(e, t) {
    this._extensions[nt.extensionName].decompress(e, this._fin, (r, n) => {
      if (r) return t(r);
      if (n.length) {
        if (this._messageLength += n.length, this._messageLength > this._maxPayload && this._maxPayload > 0) {
          const o = this.createError(
            RangeError,
            "Max payload size exceeded",
            !1,
            1009,
            "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH"
          );
          t(o);
          return;
        }
        this._fragments.push(n);
      }
      this.dataMessage(t), this._state === T && this.startLoop(t);
    });
  }
  /**
   * Handles a data message.
   *
   * @param {Function} cb Callback
   * @private
   */
  dataMessage(e) {
    if (!this._fin) {
      this._state = T;
      return;
    }
    const t = this._messageLength, i = this._fragments;
    if (this._totalPayloadLength = 0, this._messageLength = 0, this._fragmented = 0, this._fragments = [], this._opcode === 2) {
      let r;
      this._binaryType === "nodebuffer" ? r = Be(i, t) : this._binaryType === "arraybuffer" ? r = Xs(Be(i, t)) : this._binaryType === "blob" ? r = new Blob(i) : r = i, this._allowSynchronousEvents ? (this.emit("message", r, !0), this._state = T) : (this._state = pe, setImmediate(() => {
        this.emit("message", r, !0), this._state = T, this.startLoop(e);
      }));
    } else {
      const r = Be(i, t);
      if (!this._skipUTF8Validation && !at(r)) {
        const n = this.createError(
          Error,
          "invalid UTF-8 sequence",
          !0,
          1007,
          "WS_ERR_INVALID_UTF8"
        );
        e(n);
        return;
      }
      this._state === Ae || this._allowSynchronousEvents ? (this.emit("message", r, !1), this._state = T) : (this._state = pe, setImmediate(() => {
        this.emit("message", r, !1), this._state = T, this.startLoop(e);
      }));
    }
  }
  /**
   * Handles a control message.
   *
   * @param {Buffer} data Data to handle
   * @return {(Error|RangeError|undefined)} A possible error
   * @private
   */
  controlMessage(e, t) {
    if (this._opcode === 8) {
      if (e.length === 0)
        this._loop = !1, this.emit("conclude", 1005, ot), this.end();
      else {
        const i = e.readUInt16BE(0);
        if (!Qs(i)) {
          const n = this.createError(
            RangeError,
            `invalid status code ${i}`,
            !0,
            1002,
            "WS_ERR_INVALID_CLOSE_CODE"
          );
          t(n);
          return;
        }
        const r = new ue(
          e.buffer,
          e.byteOffset + 2,
          e.length - 2
        );
        if (!this._skipUTF8Validation && !at(r)) {
          const n = this.createError(
            Error,
            "invalid UTF-8 sequence",
            !0,
            1007,
            "WS_ERR_INVALID_UTF8"
          );
          t(n);
          return;
        }
        this._loop = !1, this.emit("conclude", i, r), this.end();
      }
      this._state = T;
      return;
    }
    this._allowSynchronousEvents ? (this.emit(this._opcode === 9 ? "ping" : "pong", e), this._state = T) : (this._state = pe, setImmediate(() => {
      this.emit(this._opcode === 9 ? "ping" : "pong", e), this._state = T, this.startLoop(t);
    }));
  }
  /**
   * Builds an error object.
   *
   * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
   * @param {String} message The error message
   * @param {Boolean} prefix Specifies whether or not to add a default prefix to
   *     `message`
   * @param {Number} statusCode The status code
   * @param {String} errorCode The exposed error code
   * @return {(Error|RangeError)} The error
   * @private
   */
  createError(e, t, i, r, n) {
    this._loop = !1, this._errored = !0;
    const o = new e(
      i ? `Invalid WebSocket frame: ${t}` : t
    );
    return Error.captureStackTrace(o, this.createError), o.code = n, o[Hs] = r, o;
  }
};
var tr = er;
const { Duplex: ji } = le, { randomFillSync: sr } = Ke, ht = Ye, { EMPTY_BUFFER: rr, kWebSocket: ir, NOOP: nr } = D, { isBlob: j, isValidStatusCode: or } = fe, { mask: dt, toBuffer: $ } = ke, k = Symbol("kByteLength"), ar = Buffer.alloc(4), ye = 8 * 1024;
let F, V = ye;
const O = 0, lr = 1, cr = 2;
let fr = class M {
  /**
   * Creates a Sender instance.
   *
   * @param {Duplex} socket The connection socket
   * @param {Object} [extensions] An object containing the negotiated extensions
   * @param {Function} [generateMask] The function used to generate the masking
   *     key
   */
  constructor(e, t, i) {
    this._extensions = t || {}, i && (this._generateMask = i, this._maskBuffer = Buffer.alloc(4)), this._socket = e, this._firstFragment = !0, this._compress = !1, this._bufferedBytes = 0, this._queue = [], this._state = O, this.onerror = nr, this[ir] = void 0;
  }
  /**
   * Frames a piece of data according to the HyBi WebSocket protocol.
   *
   * @param {(Buffer|String)} data The data to frame
   * @param {Object} options Options object
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
   *     key
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @return {(Buffer|String)[]} The framed data
   * @public
   */
  static frame(e, t) {
    let i, r = !1, n = 2, o = !1;
    t.mask && (i = t.maskBuffer || ar, t.generateMask ? t.generateMask(i) : (V === ye && (F === void 0 && (F = Buffer.alloc(ye)), sr(F, 0, ye), V = 0), i[0] = F[V++], i[1] = F[V++], i[2] = F[V++], i[3] = F[V++]), o = (i[0] | i[1] | i[2] | i[3]) === 0, n = 6);
    let a;
    typeof e == "string" ? (!t.mask || o) && t[k] !== void 0 ? a = t[k] : (e = Buffer.from(e), a = e.length) : (a = e.length, r = t.mask && t.readOnly && !o);
    let c = a;
    a >= 65536 ? (n += 8, c = 127) : a > 125 && (n += 2, c = 126);
    const l = Buffer.allocUnsafe(r ? a + n : n);
    return l[0] = t.fin ? t.opcode | 128 : t.opcode, t.rsv1 && (l[0] |= 64), l[1] = c, c === 126 ? l.writeUInt16BE(a, 2) : c === 127 && (l[2] = l[3] = 0, l.writeUIntBE(a, 4, 6)), t.mask ? (l[1] |= 128, l[n - 4] = i[0], l[n - 3] = i[1], l[n - 2] = i[2], l[n - 1] = i[3], o ? [l, e] : r ? (dt(e, i, l, n, a), [l]) : (dt(e, i, e, 0, a), [l, e])) : [l, e];
  }
  /**
   * Sends a close message to the other peer.
   *
   * @param {Number} [code] The status code component of the body
   * @param {(String|Buffer)} [data] The message component of the body
   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
   * @param {Function} [cb] Callback
   * @public
   */
  close(e, t, i, r) {
    let n;
    if (e === void 0)
      n = rr;
    else {
      if (typeof e != "number" || !or(e))
        throw new TypeError("First argument must be a valid error code number");
      if (t === void 0 || !t.length)
        n = Buffer.allocUnsafe(2), n.writeUInt16BE(e, 0);
      else {
        const a = Buffer.byteLength(t);
        if (a > 123)
          throw new RangeError("The message must not be greater than 123 bytes");
        n = Buffer.allocUnsafe(2 + a), n.writeUInt16BE(e, 0), typeof t == "string" ? n.write(t, 2) : n.set(t, 2);
      }
    }
    const o = {
      [k]: n.length,
      fin: !0,
      generateMask: this._generateMask,
      mask: i,
      maskBuffer: this._maskBuffer,
      opcode: 8,
      readOnly: !1,
      rsv1: !1
    };
    this._state !== O ? this.enqueue([this.dispatch, n, !1, o, r]) : this.sendFrame(M.frame(n, o), r);
  }
  /**
   * Sends a ping message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback
   * @public
   */
  ping(e, t, i) {
    let r, n;
    if (typeof e == "string" ? (r = Buffer.byteLength(e), n = !1) : j(e) ? (r = e.size, n = !1) : (e = $(e), r = e.length, n = $.readOnly), r > 125)
      throw new RangeError("The data size must not be greater than 125 bytes");
    const o = {
      [k]: r,
      fin: !0,
      generateMask: this._generateMask,
      mask: t,
      maskBuffer: this._maskBuffer,
      opcode: 9,
      readOnly: n,
      rsv1: !1
    };
    j(e) ? this._state !== O ? this.enqueue([this.getBlobData, e, !1, o, i]) : this.getBlobData(e, !1, o, i) : this._state !== O ? this.enqueue([this.dispatch, e, !1, o, i]) : this.sendFrame(M.frame(e, o), i);
  }
  /**
   * Sends a pong message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback
   * @public
   */
  pong(e, t, i) {
    let r, n;
    if (typeof e == "string" ? (r = Buffer.byteLength(e), n = !1) : j(e) ? (r = e.size, n = !1) : (e = $(e), r = e.length, n = $.readOnly), r > 125)
      throw new RangeError("The data size must not be greater than 125 bytes");
    const o = {
      [k]: r,
      fin: !0,
      generateMask: this._generateMask,
      mask: t,
      maskBuffer: this._maskBuffer,
      opcode: 10,
      readOnly: n,
      rsv1: !1
    };
    j(e) ? this._state !== O ? this.enqueue([this.getBlobData, e, !1, o, i]) : this.getBlobData(e, !1, o, i) : this._state !== O ? this.enqueue([this.dispatch, e, !1, o, i]) : this.sendFrame(M.frame(e, o), i);
  }
  /**
   * Sends a data message to the other peer.
   *
   * @param {*} data The message to send
   * @param {Object} options Options object
   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
   *     or text
   * @param {Boolean} [options.compress=false] Specifies whether or not to
   *     compress `data`
   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
   *     last one
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Function} [cb] Callback
   * @public
   */
  send(e, t, i) {
    const r = this._extensions[ht.extensionName];
    let n = t.binary ? 2 : 1, o = t.compress, a, c;
    typeof e == "string" ? (a = Buffer.byteLength(e), c = !1) : j(e) ? (a = e.size, c = !1) : (e = $(e), a = e.length, c = $.readOnly), this._firstFragment ? (this._firstFragment = !1, o && r && r.params[r._isServer ? "server_no_context_takeover" : "client_no_context_takeover"] && (o = a >= r._threshold), this._compress = o) : (o = !1, n = 0), t.fin && (this._firstFragment = !0);
    const l = {
      [k]: a,
      fin: t.fin,
      generateMask: this._generateMask,
      mask: t.mask,
      maskBuffer: this._maskBuffer,
      opcode: n,
      readOnly: c,
      rsv1: o
    };
    j(e) ? this._state !== O ? this.enqueue([this.getBlobData, e, this._compress, l, i]) : this.getBlobData(e, this._compress, l, i) : this._state !== O ? this.enqueue([this.dispatch, e, this._compress, l, i]) : this.dispatch(e, this._compress, l, i);
  }
  /**
   * Gets the contents of a blob as binary data.
   *
   * @param {Blob} blob The blob
   * @param {Boolean} [compress=false] Specifies whether or not to compress
   *     the data
   * @param {Object} options Options object
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
   *     key
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @param {Function} [cb] Callback
   * @private
   */
  getBlobData(e, t, i, r) {
    this._bufferedBytes += i[k], this._state = cr, e.arrayBuffer().then((n) => {
      if (this._socket.destroyed) {
        const a = new Error(
          "The socket was closed while the blob was being read"
        );
        process.nextTick(ze, this, a, r);
        return;
      }
      this._bufferedBytes -= i[k];
      const o = $(n);
      t ? this.dispatch(o, t, i, r) : (this._state = O, this.sendFrame(M.frame(o, i), r), this.dequeue());
    }).catch((n) => {
      process.nextTick(dr, this, n, r);
    });
  }
  /**
   * Dispatches a message.
   *
   * @param {(Buffer|String)} data The message to send
   * @param {Boolean} [compress=false] Specifies whether or not to compress
   *     `data`
   * @param {Object} options Options object
   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
   *     FIN bit
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
   *     `data`
   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
   *     key
   * @param {Number} options.opcode The opcode
   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
   *     modified
   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
   *     RSV1 bit
   * @param {Function} [cb] Callback
   * @private
   */
  dispatch(e, t, i, r) {
    if (!t) {
      this.sendFrame(M.frame(e, i), r);
      return;
    }
    const n = this._extensions[ht.extensionName];
    this._bufferedBytes += i[k], this._state = lr, n.compress(e, i.fin, (o, a) => {
      if (this._socket.destroyed) {
        const c = new Error(
          "The socket was closed while data was being compressed"
        );
        ze(this, c, r);
        return;
      }
      this._bufferedBytes -= i[k], this._state = O, i.readOnly = !1, this.sendFrame(M.frame(a, i), r), this.dequeue();
    });
  }
  /**
   * Executes queued send operations.
   *
   * @private
   */
  dequeue() {
    for (; this._state === O && this._queue.length; ) {
      const e = this._queue.shift();
      this._bufferedBytes -= e[3][k], Reflect.apply(e[0], this, e.slice(1));
    }
  }
  /**
   * Enqueues a send operation.
   *
   * @param {Array} params Send operation parameters.
   * @private
   */
  enqueue(e) {
    this._bufferedBytes += e[3][k], this._queue.push(e);
  }
  /**
   * Sends a frame.
   *
   * @param {(Buffer | String)[]} list The frame to send
   * @param {Function} [cb] Callback
   * @private
   */
  sendFrame(e, t) {
    e.length === 2 ? (this._socket.cork(), this._socket.write(e[0]), this._socket.write(e[1], t), this._socket.uncork()) : this._socket.write(e[0], t);
  }
};
var hr = fr;
function ze(s, e, t) {
  typeof t == "function" && t(e);
  for (let i = 0; i < s._queue.length; i++) {
    const r = s._queue[i], n = r[r.length - 1];
    typeof n == "function" && n(e);
  }
}
function dr(s, e, t) {
  ze(s, e, t), s.onerror(e);
}
const { kForOnEventAttribute: se, kListener: De } = D, ut = Symbol("kCode"), pt = Symbol("kData"), mt = Symbol("kError"), _t = Symbol("kMessage"), gt = Symbol("kReason"), G = Symbol("kTarget"), yt = Symbol("kType"), St = Symbol("kWasClean");
class Z {
  /**
   * Create a new `Event`.
   *
   * @param {String} type The name of the event
   * @throws {TypeError} If the `type` argument is not specified
   */
  constructor(e) {
    this[G] = null, this[yt] = e;
  }
  /**
   * @type {*}
   */
  get target() {
    return this[G];
  }
  /**
   * @type {String}
   */
  get type() {
    return this[yt];
  }
}
Object.defineProperty(Z.prototype, "target", { enumerable: !0 });
Object.defineProperty(Z.prototype, "type", { enumerable: !0 });
class Oe extends Z {
  /**
   * Create a new `CloseEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {Number} [options.code=0] The status code explaining why the
   *     connection was closed
   * @param {String} [options.reason=''] A human-readable string explaining why
   *     the connection was closed
   * @param {Boolean} [options.wasClean=false] Indicates whether or not the
   *     connection was cleanly closed
   */
  constructor(e, t = {}) {
    super(e), this[ut] = t.code === void 0 ? 0 : t.code, this[gt] = t.reason === void 0 ? "" : t.reason, this[St] = t.wasClean === void 0 ? !1 : t.wasClean;
  }
  /**
   * @type {Number}
   */
  get code() {
    return this[ut];
  }
  /**
   * @type {String}
   */
  get reason() {
    return this[gt];
  }
  /**
   * @type {Boolean}
   */
  get wasClean() {
    return this[St];
  }
}
Object.defineProperty(Oe.prototype, "code", { enumerable: !0 });
Object.defineProperty(Oe.prototype, "reason", { enumerable: !0 });
Object.defineProperty(Oe.prototype, "wasClean", { enumerable: !0 });
class Xe extends Z {
  /**
   * Create a new `ErrorEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {*} [options.error=null] The error that generated this event
   * @param {String} [options.message=''] The error message
   */
  constructor(e, t = {}) {
    super(e), this[mt] = t.error === void 0 ? null : t.error, this[_t] = t.message === void 0 ? "" : t.message;
  }
  /**
   * @type {*}
   */
  get error() {
    return this[mt];
  }
  /**
   * @type {String}
   */
  get message() {
    return this[_t];
  }
}
Object.defineProperty(Xe.prototype, "error", { enumerable: !0 });
Object.defineProperty(Xe.prototype, "message", { enumerable: !0 });
class Ft extends Z {
  /**
   * Create a new `MessageEvent`.
   *
   * @param {String} type The name of the event
   * @param {Object} [options] A dictionary object that allows for setting
   *     attributes via object members of the same name
   * @param {*} [options.data=null] The message content
   */
  constructor(e, t = {}) {
    super(e), this[pt] = t.data === void 0 ? null : t.data;
  }
  /**
   * @type {*}
   */
  get data() {
    return this[pt];
  }
}
Object.defineProperty(Ft.prototype, "data", { enumerable: !0 });
const ur = {
  /**
   * Register an event listener.
   *
   * @param {String} type A string representing the event type to listen for
   * @param {(Function|Object)} handler The listener to add
   * @param {Object} [options] An options object specifies characteristics about
   *     the event listener
   * @param {Boolean} [options.once=false] A `Boolean` indicating that the
   *     listener should be invoked at most once after being added. If `true`,
   *     the listener would be automatically removed when invoked.
   * @public
   */
  addEventListener(s, e, t = {}) {
    for (const r of this.listeners(s))
      if (!t[se] && r[De] === e && !r[se])
        return;
    let i;
    if (s === "message")
      i = function(n, o) {
        const a = new Ft("message", {
          data: o ? n : n.toString()
        });
        a[G] = this, me(e, this, a);
      };
    else if (s === "close")
      i = function(n, o) {
        const a = new Oe("close", {
          code: n,
          reason: o.toString(),
          wasClean: this._closeFrameReceived && this._closeFrameSent
        });
        a[G] = this, me(e, this, a);
      };
    else if (s === "error")
      i = function(n) {
        const o = new Xe("error", {
          error: n,
          message: n.message
        });
        o[G] = this, me(e, this, o);
      };
    else if (s === "open")
      i = function() {
        const n = new Z("open");
        n[G] = this, me(e, this, n);
      };
    else
      return;
    i[se] = !!t[se], i[De] = e, t.once ? this.once(s, i) : this.on(s, i);
  },
  /**
   * Remove an event listener.
   *
   * @param {String} type A string representing the event type to remove
   * @param {(Function|Object)} handler The listener to remove
   * @public
   */
  removeEventListener(s, e) {
    for (const t of this.listeners(s))
      if (t[De] === e && !t[se]) {
        this.removeListener(s, t);
        break;
      }
  }
};
var pr = {
  EventTarget: ur
};
function me(s, e, t) {
  typeof s == "object" && s.handleEvent ? s.handleEvent.call(s, t) : s.call(e, t);
}
const { tokenChars: re } = fe;
function R(s, e, t) {
  s[e] === void 0 ? s[e] = [t] : s[e].push(t);
}
function mr(s) {
  const e = /* @__PURE__ */ Object.create(null);
  let t = /* @__PURE__ */ Object.create(null), i = !1, r = !1, n = !1, o, a, c = -1, l = -1, h = -1, d = 0;
  for (; d < s.length; d++)
    if (l = s.charCodeAt(d), o === void 0)
      if (h === -1 && re[l] === 1)
        c === -1 && (c = d);
      else if (d !== 0 && (l === 32 || l === 9))
        h === -1 && c !== -1 && (h = d);
      else if (l === 59 || l === 44) {
        if (c === -1)
          throw new SyntaxError(`Unexpected character at index ${d}`);
        h === -1 && (h = d);
        const g = s.slice(c, h);
        l === 44 ? (R(e, g, t), t = /* @__PURE__ */ Object.create(null)) : o = g, c = h = -1;
      } else
        throw new SyntaxError(`Unexpected character at index ${d}`);
    else if (a === void 0)
      if (h === -1 && re[l] === 1)
        c === -1 && (c = d);
      else if (l === 32 || l === 9)
        h === -1 && c !== -1 && (h = d);
      else if (l === 59 || l === 44) {
        if (c === -1)
          throw new SyntaxError(`Unexpected character at index ${d}`);
        h === -1 && (h = d), R(t, s.slice(c, h), !0), l === 44 && (R(e, o, t), t = /* @__PURE__ */ Object.create(null), o = void 0), c = h = -1;
      } else if (l === 61 && c !== -1 && h === -1)
        a = s.slice(c, d), c = h = -1;
      else
        throw new SyntaxError(`Unexpected character at index ${d}`);
    else if (r) {
      if (re[l] !== 1)
        throw new SyntaxError(`Unexpected character at index ${d}`);
      c === -1 ? c = d : i || (i = !0), r = !1;
    } else if (n)
      if (re[l] === 1)
        c === -1 && (c = d);
      else if (l === 34 && c !== -1)
        n = !1, h = d;
      else if (l === 92)
        r = !0;
      else
        throw new SyntaxError(`Unexpected character at index ${d}`);
    else if (l === 34 && s.charCodeAt(d - 1) === 61)
      n = !0;
    else if (h === -1 && re[l] === 1)
      c === -1 && (c = d);
    else if (c !== -1 && (l === 32 || l === 9))
      h === -1 && (h = d);
    else if (l === 59 || l === 44) {
      if (c === -1)
        throw new SyntaxError(`Unexpected character at index ${d}`);
      h === -1 && (h = d);
      let g = s.slice(c, h);
      i && (g = g.replace(/\\/g, ""), i = !1), R(t, a, g), l === 44 && (R(e, o, t), t = /* @__PURE__ */ Object.create(null), o = void 0), a = void 0, c = h = -1;
    } else
      throw new SyntaxError(`Unexpected character at index ${d}`);
  if (c === -1 || n || l === 32 || l === 9)
    throw new SyntaxError("Unexpected end of input");
  h === -1 && (h = d);
  const E = s.slice(c, h);
  return o === void 0 ? R(e, E, t) : (a === void 0 ? R(t, E, !0) : i ? R(t, a, E.replace(/\\/g, "")) : R(t, a, E), R(e, o, t)), e;
}
function _r(s) {
  return Object.keys(s).map((e) => {
    let t = s[e];
    return Array.isArray(t) || (t = [t]), t.map((i) => [e].concat(
      Object.keys(i).map((r) => {
        let n = i[r];
        return Array.isArray(n) || (n = [n]), n.map((o) => o === !0 ? r : `${r}=${o}`).join("; ");
      })
    ).join("; ")).join(", ");
  }).join(", ");
}
var gr = { format: _r, parse: mr };
const yr = ns, Sr = os, wr = as, Mt = ls, Er = cs, { randomBytes: vr, createHash: br } = Ke, { Duplex: Vi, Readable: qi } = le, { URL: $e } = hs, A = Ye, xr = tr, Tr = hr, { isBlob: kr } = fe, {
  BINARY_TYPES: wt,
  CLOSE_TIMEOUT: Or,
  EMPTY_BUFFER: _e,
  GUID: Pr,
  kForOnEventAttribute: Fe,
  kListener: Rr,
  kStatusCode: Lr,
  kWebSocket: S,
  NOOP: Wt
} = D, {
  EventTarget: { addEventListener: Ir, removeEventListener: Ur }
} = pr, { format: Nr, parse: Br } = gr, { toBuffer: Cr } = ke, jt = Symbol("kAborted"), Me = [8, 13], N = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"], Ar = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;
class f extends yr {
  /**
   * Create a new `WebSocket`.
   *
   * @param {(String|URL)} address The URL to which to connect
   * @param {(String|String[])} [protocols] The subprotocols
   * @param {Object} [options] Connection options
   */
  constructor(e, t, i) {
    super(), this._binaryType = wt[0], this._closeCode = 1006, this._closeFrameReceived = !1, this._closeFrameSent = !1, this._closeMessage = _e, this._closeTimer = null, this._errorEmitted = !1, this._extensions = {}, this._paused = !1, this._protocol = "", this._readyState = f.CONNECTING, this._receiver = null, this._sender = null, this._socket = null, e !== null ? (this._bufferedAmount = 0, this._isServer = !1, this._redirects = 0, t === void 0 ? t = [] : Array.isArray(t) || (typeof t == "object" && t !== null ? (i = t, t = []) : t = [t]), Vt(this, e, t, i)) : (this._autoPong = i.autoPong, this._closeTimeout = i.closeTimeout, this._isServer = !0);
  }
  /**
   * For historical reasons, the custom "nodebuffer" type is used by the default
   * instead of "blob".
   *
   * @type {String}
   */
  get binaryType() {
    return this._binaryType;
  }
  set binaryType(e) {
    wt.includes(e) && (this._binaryType = e, this._receiver && (this._receiver._binaryType = e));
  }
  /**
   * @type {Number}
   */
  get bufferedAmount() {
    return this._socket ? this._socket._writableState.length + this._sender._bufferedBytes : this._bufferedAmount;
  }
  /**
   * @type {String}
   */
  get extensions() {
    return Object.keys(this._extensions).join();
  }
  /**
   * @type {Boolean}
   */
  get isPaused() {
    return this._paused;
  }
  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onclose() {
    return null;
  }
  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onerror() {
    return null;
  }
  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onopen() {
    return null;
  }
  /**
   * @type {Function}
   */
  /* istanbul ignore next */
  get onmessage() {
    return null;
  }
  /**
   * @type {String}
   */
  get protocol() {
    return this._protocol;
  }
  /**
   * @type {Number}
   */
  get readyState() {
    return this._readyState;
  }
  /**
   * @type {String}
   */
  get url() {
    return this._url;
  }
  /**
   * Set up the socket and the internal resources.
   *
   * @param {Duplex} socket The network socket between the server and client
   * @param {Buffer} head The first packet of the upgraded stream
   * @param {Object} options Options object
   * @param {Boolean} [options.allowSynchronousEvents=false] Specifies whether
   *     any of the `'message'`, `'ping'`, and `'pong'` events can be emitted
   *     multiple times in the same tick
   * @param {Function} [options.generateMask] The function used to generate the
   *     masking key
   * @param {Number} [options.maxPayload=0] The maximum allowed message size
   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
   *     not to skip UTF-8 validation for text and close messages
   * @private
   */
  setSocket(e, t, i) {
    const r = new xr({
      allowSynchronousEvents: i.allowSynchronousEvents,
      binaryType: this.binaryType,
      extensions: this._extensions,
      isServer: this._isServer,
      maxPayload: i.maxPayload,
      skipUTF8Validation: i.skipUTF8Validation
    }), n = new Tr(e, this._extensions, i.generateMask);
    this._receiver = r, this._sender = n, this._socket = e, r[S] = this, n[S] = this, e[S] = this, r.on("conclude", Mr), r.on("drain", Wr), r.on("error", jr), r.on("message", Vr), r.on("ping", qr), r.on("pong", Gr), n.onerror = Jr, e.setTimeout && e.setTimeout(0), e.setNoDelay && e.setNoDelay(), t.length > 0 && e.unshift(t), e.on("close", Jt), e.on("data", Pe), e.on("end", zt), e.on("error", Kt), this._readyState = f.OPEN, this.emit("open");
  }
  /**
   * Emit the `'close'` event.
   *
   * @private
   */
  emitClose() {
    if (!this._socket) {
      this._readyState = f.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
      return;
    }
    this._extensions[A.extensionName] && this._extensions[A.extensionName].cleanup(), this._receiver.removeAllListeners(), this._readyState = f.CLOSED, this.emit("close", this._closeCode, this._closeMessage);
  }
  /**
   * Start a closing handshake.
   *
   *          +----------+   +-----------+   +----------+
   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
   *    |     +----------+   +-----------+   +----------+     |
   *          +----------+   +-----------+         |
   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
   *          +----------+   +-----------+   |
   *    |           |                        |   +---+        |
   *                +------------------------+-->|fin| - - - -
   *    |         +---+                      |   +---+
   *     - - - - -|fin|<---------------------+
   *              +---+
   *
   * @param {Number} [code] Status code explaining why the connection is closing
   * @param {(String|Buffer)} [data] The reason why the connection is
   *     closing
   * @public
   */
  close(e, t) {
    if (this.readyState !== f.CLOSED) {
      if (this.readyState === f.CONNECTING) {
        x(this, this._req, "WebSocket was closed before the connection was established");
        return;
      }
      if (this.readyState === f.CLOSING) {
        this._closeFrameSent && (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end();
        return;
      }
      this._readyState = f.CLOSING, this._sender.close(e, t, !this._isServer, (i) => {
        i || (this._closeFrameSent = !0, (this._closeFrameReceived || this._receiver._writableState.errorEmitted) && this._socket.end());
      }), Gt(this);
    }
  }
  /**
   * Pause the socket.
   *
   * @public
   */
  pause() {
    this.readyState === f.CONNECTING || this.readyState === f.CLOSED || (this._paused = !0, this._socket.pause());
  }
  /**
   * Send a ping.
   *
   * @param {*} [data] The data to send
   * @param {Boolean} [mask] Indicates whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when the ping is sent
   * @public
   */
  ping(e, t, i) {
    if (this.readyState === f.CONNECTING)
      throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
    if (typeof e == "function" ? (i = e, e = t = void 0) : typeof t == "function" && (i = t, t = void 0), typeof e == "number" && (e = e.toString()), this.readyState !== f.OPEN) {
      We(this, e, i);
      return;
    }
    t === void 0 && (t = !this._isServer), this._sender.ping(e || _e, t, i);
  }
  /**
   * Send a pong.
   *
   * @param {*} [data] The data to send
   * @param {Boolean} [mask] Indicates whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when the pong is sent
   * @public
   */
  pong(e, t, i) {
    if (this.readyState === f.CONNECTING)
      throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
    if (typeof e == "function" ? (i = e, e = t = void 0) : typeof t == "function" && (i = t, t = void 0), typeof e == "number" && (e = e.toString()), this.readyState !== f.OPEN) {
      We(this, e, i);
      return;
    }
    t === void 0 && (t = !this._isServer), this._sender.pong(e || _e, t, i);
  }
  /**
   * Resume the socket.
   *
   * @public
   */
  resume() {
    this.readyState === f.CONNECTING || this.readyState === f.CLOSED || (this._paused = !1, this._receiver._writableState.needDrain || this._socket.resume());
  }
  /**
   * Send a data message.
   *
   * @param {*} data The message to send
   * @param {Object} [options] Options object
   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
   *     text
   * @param {Boolean} [options.compress] Specifies whether or not to compress
   *     `data`
   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
   *     last one
   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
   * @param {Function} [cb] Callback which is executed when data is written out
   * @public
   */
  send(e, t, i) {
    if (this.readyState === f.CONNECTING)
      throw new Error("WebSocket is not open: readyState 0 (CONNECTING)");
    if (typeof t == "function" && (i = t, t = {}), typeof e == "number" && (e = e.toString()), this.readyState !== f.OPEN) {
      We(this, e, i);
      return;
    }
    const r = {
      binary: typeof e != "string",
      mask: !this._isServer,
      compress: !0,
      fin: !0,
      ...t
    };
    this._extensions[A.extensionName] || (r.compress = !1), this._sender.send(e || _e, r, i);
  }
  /**
   * Forcibly close the connection.
   *
   * @public
   */
  terminate() {
    if (this.readyState !== f.CLOSED) {
      if (this.readyState === f.CONNECTING) {
        x(this, this._req, "WebSocket was closed before the connection was established");
        return;
      }
      this._socket && (this._readyState = f.CLOSING, this._socket.destroy());
    }
  }
}
Object.defineProperty(f, "CONNECTING", {
  enumerable: !0,
  value: N.indexOf("CONNECTING")
});
Object.defineProperty(f.prototype, "CONNECTING", {
  enumerable: !0,
  value: N.indexOf("CONNECTING")
});
Object.defineProperty(f, "OPEN", {
  enumerable: !0,
  value: N.indexOf("OPEN")
});
Object.defineProperty(f.prototype, "OPEN", {
  enumerable: !0,
  value: N.indexOf("OPEN")
});
Object.defineProperty(f, "CLOSING", {
  enumerable: !0,
  value: N.indexOf("CLOSING")
});
Object.defineProperty(f.prototype, "CLOSING", {
  enumerable: !0,
  value: N.indexOf("CLOSING")
});
Object.defineProperty(f, "CLOSED", {
  enumerable: !0,
  value: N.indexOf("CLOSED")
});
Object.defineProperty(f.prototype, "CLOSED", {
  enumerable: !0,
  value: N.indexOf("CLOSED")
});
[
  "binaryType",
  "bufferedAmount",
  "extensions",
  "isPaused",
  "protocol",
  "readyState",
  "url"
].forEach((s) => {
  Object.defineProperty(f.prototype, s, { enumerable: !0 });
});
["open", "error", "close", "message"].forEach((s) => {
  Object.defineProperty(f.prototype, `on${s}`, {
    enumerable: !0,
    get() {
      for (const e of this.listeners(s))
        if (e[Fe]) return e[Rr];
      return null;
    },
    set(e) {
      for (const t of this.listeners(s))
        if (t[Fe]) {
          this.removeListener(s, t);
          break;
        }
      typeof e == "function" && this.addEventListener(s, e, {
        [Fe]: !0
      });
    }
  });
});
f.prototype.addEventListener = Ir;
f.prototype.removeEventListener = Ur;
var Dr = f;
function Vt(s, e, t, i) {
  const r = {
    allowSynchronousEvents: !0,
    autoPong: !0,
    closeTimeout: Or,
    protocolVersion: Me[1],
    maxPayload: 104857600,
    skipUTF8Validation: !1,
    perMessageDeflate: !0,
    followRedirects: !1,
    maxRedirects: 10,
    ...i,
    socketPath: void 0,
    hostname: void 0,
    protocol: void 0,
    timeout: void 0,
    method: "GET",
    host: void 0,
    path: void 0,
    port: void 0
  };
  if (s._autoPong = r.autoPong, s._closeTimeout = r.closeTimeout, !Me.includes(r.protocolVersion))
    throw new RangeError(
      `Unsupported protocol version: ${r.protocolVersion} (supported versions: ${Me.join(", ")})`
    );
  let n;
  if (e instanceof $e)
    n = e;
  else
    try {
      n = new $e(e);
    } catch {
      throw new SyntaxError(`Invalid URL: ${e}`);
    }
  n.protocol === "http:" ? n.protocol = "ws:" : n.protocol === "https:" && (n.protocol = "wss:"), s._url = n.href;
  const o = n.protocol === "wss:", a = n.protocol === "ws+unix:";
  let c;
  if (n.protocol !== "ws:" && !o && !a ? c = `The URL's protocol must be one of "ws:", "wss:", "http:", "https:", or "ws+unix:"` : a && !n.pathname ? c = "The URL's pathname is empty" : n.hash && (c = "The URL contains a fragment identifier"), c) {
    const u = new SyntaxError(c);
    if (s._redirects === 0)
      throw u;
    Se(s, u);
    return;
  }
  const l = o ? 443 : 80, h = vr(16).toString("base64"), d = o ? Sr.request : wr.request, E = /* @__PURE__ */ new Set();
  let g;
  if (r.createConnection = r.createConnection || (o ? Fr : $r), r.defaultPort = r.defaultPort || l, r.port = n.port || l, r.host = n.hostname.startsWith("[") ? n.hostname.slice(1, -1) : n.hostname, r.headers = {
    ...r.headers,
    "Sec-WebSocket-Version": r.protocolVersion,
    "Sec-WebSocket-Key": h,
    Connection: "Upgrade",
    Upgrade: "websocket"
  }, r.path = n.pathname + n.search, r.timeout = r.handshakeTimeout, r.perMessageDeflate && (g = new A(
    r.perMessageDeflate !== !0 ? r.perMessageDeflate : {},
    !1,
    r.maxPayload
  ), r.headers["Sec-WebSocket-Extensions"] = Nr({
    [A.extensionName]: g.offer()
  })), t.length) {
    for (const u of t) {
      if (typeof u != "string" || !Ar.test(u) || E.has(u))
        throw new SyntaxError(
          "An invalid or duplicated subprotocol was specified"
        );
      E.add(u);
    }
    r.headers["Sec-WebSocket-Protocol"] = t.join(",");
  }
  if (r.origin && (r.protocolVersion < 13 ? r.headers["Sec-WebSocket-Origin"] = r.origin : r.headers.Origin = r.origin), (n.username || n.password) && (r.auth = `${n.username}:${n.password}`), a) {
    const u = r.path.split(":");
    r.socketPath = u[0], r.path = u[1];
  }
  let _;
  if (r.followRedirects) {
    if (s._redirects === 0) {
      s._originalIpc = a, s._originalSecure = o, s._originalHostOrSocketPath = a ? r.socketPath : n.host;
      const u = i && i.headers;
      if (i = { ...i, headers: {} }, u)
        for (const [w, L] of Object.entries(u))
          i.headers[w.toLowerCase()] = L;
    } else if (s.listenerCount("redirect") === 0) {
      const u = a ? s._originalIpc ? r.socketPath === s._originalHostOrSocketPath : !1 : s._originalIpc ? !1 : n.host === s._originalHostOrSocketPath;
      (!u || s._originalSecure && !o) && (delete r.headers.authorization, delete r.headers.cookie, u || delete r.headers.host, r.auth = void 0);
    }
    r.auth && !i.headers.authorization && (i.headers.authorization = "Basic " + Buffer.from(r.auth).toString("base64")), _ = s._req = d(r), s._redirects && s.emit("redirect", s.url, _);
  } else
    _ = s._req = d(r);
  r.timeout && _.on("timeout", () => {
    x(s, _, "Opening handshake has timed out");
  }), _.on("error", (u) => {
    _ === null || _[jt] || (_ = s._req = null, Se(s, u));
  }), _.on("response", (u) => {
    const w = u.headers.location, L = u.statusCode;
    if (w && r.followRedirects && L >= 300 && L < 400) {
      if (++s._redirects > r.maxRedirects) {
        x(s, _, "Maximum redirects exceeded");
        return;
      }
      _.abort();
      let B;
      try {
        B = new $e(w, e);
      } catch {
        const I = new SyntaxError(`Invalid URL: ${w}`);
        Se(s, I);
        return;
      }
      Vt(s, B, t, i);
    } else s.emit("unexpected-response", _, u) || x(
      s,
      _,
      `Unexpected server response: ${u.statusCode}`
    );
  }), _.on("upgrade", (u, w, L) => {
    if (s.emit("upgrade", u), s.readyState !== f.CONNECTING) return;
    _ = s._req = null;
    const B = u.headers.upgrade;
    if (B === void 0 || B.toLowerCase() !== "websocket") {
      x(s, w, "Invalid Upgrade header");
      return;
    }
    const Q = br("sha1").update(h + Pr).digest("base64");
    if (u.headers["sec-websocket-accept"] !== Q) {
      x(s, w, "Invalid Sec-WebSocket-Accept header");
      return;
    }
    const I = u.headers["sec-websocket-protocol"];
    let ee;
    if (I !== void 0 ? E.size ? E.has(I) || (ee = "Server sent an invalid subprotocol") : ee = "Server sent a subprotocol but none was requested" : E.size && (ee = "Server sent no subprotocol"), ee) {
      x(s, w, ee);
      return;
    }
    I && (s._protocol = I);
    const Qe = u.headers["sec-websocket-extensions"];
    if (Qe !== void 0) {
      if (!g) {
        x(s, w, "Server sent a Sec-WebSocket-Extensions header but no extension was requested");
        return;
      }
      let Re;
      try {
        Re = Br(Qe);
      } catch {
        x(s, w, "Invalid Sec-WebSocket-Extensions header");
        return;
      }
      const et = Object.keys(Re);
      if (et.length !== 1 || et[0] !== A.extensionName) {
        x(s, w, "Server indicated an extension that was not requested");
        return;
      }
      try {
        g.accept(Re[A.extensionName]);
      } catch {
        x(s, w, "Invalid Sec-WebSocket-Extensions header");
        return;
      }
      s._extensions[A.extensionName] = g;
    }
    s.setSocket(w, L, {
      allowSynchronousEvents: r.allowSynchronousEvents,
      generateMask: r.generateMask,
      maxPayload: r.maxPayload,
      skipUTF8Validation: r.skipUTF8Validation
    });
  }), r.finishRequest ? r.finishRequest(_, s) : _.end();
}
function Se(s, e) {
  s._readyState = f.CLOSING, s._errorEmitted = !0, s.emit("error", e), s.emitClose();
}
function $r(s) {
  return s.path = s.socketPath, Mt.connect(s);
}
function Fr(s) {
  return s.path = void 0, !s.servername && s.servername !== "" && (s.servername = Mt.isIP(s.host) ? "" : s.host), Er.connect(s);
}
function x(s, e, t) {
  s._readyState = f.CLOSING;
  const i = new Error(t);
  Error.captureStackTrace(i, x), e.setHeader ? (e[jt] = !0, e.abort(), e.socket && !e.socket.destroyed && e.socket.destroy(), process.nextTick(Se, s, i)) : (e.destroy(i), e.once("error", s.emit.bind(s, "error")), e.once("close", s.emitClose.bind(s)));
}
function We(s, e, t) {
  if (e) {
    const i = kr(e) ? e.size : Cr(e).length;
    s._socket ? s._sender._bufferedBytes += i : s._bufferedAmount += i;
  }
  if (t) {
    const i = new Error(
      `WebSocket is not open: readyState ${s.readyState} (${N[s.readyState]})`
    );
    process.nextTick(t, i);
  }
}
function Mr(s, e) {
  const t = this[S];
  t._closeFrameReceived = !0, t._closeMessage = e, t._closeCode = s, t._socket[S] !== void 0 && (t._socket.removeListener("data", Pe), process.nextTick(qt, t._socket), s === 1005 ? t.close() : t.close(s, e));
}
function Wr() {
  const s = this[S];
  s.isPaused || s._socket.resume();
}
function jr(s) {
  const e = this[S];
  e._socket[S] !== void 0 && (e._socket.removeListener("data", Pe), process.nextTick(qt, e._socket), e.close(s[Lr])), e._errorEmitted || (e._errorEmitted = !0, e.emit("error", s));
}
function Et() {
  this[S].emitClose();
}
function Vr(s, e) {
  this[S].emit("message", s, e);
}
function qr(s) {
  const e = this[S];
  e._autoPong && e.pong(s, !this._isServer, Wt), e.emit("ping", s);
}
function Gr(s) {
  this[S].emit("pong", s);
}
function qt(s) {
  s.resume();
}
function Jr(s) {
  const e = this[S];
  e.readyState !== f.CLOSED && (e.readyState === f.OPEN && (e._readyState = f.CLOSING, Gt(e)), this._socket.end(), e._errorEmitted || (e._errorEmitted = !0, e.emit("error", s)));
}
function Gt(s) {
  s._closeTimer = setTimeout(
    s._socket.destroy.bind(s._socket),
    s._closeTimeout
  );
}
function Jt() {
  const s = this[S];
  if (this.removeListener("close", Jt), this.removeListener("data", Pe), this.removeListener("end", zt), s._readyState = f.CLOSING, !this._readableState.endEmitted && !s._closeFrameReceived && !s._receiver._writableState.errorEmitted && this._readableState.length !== 0) {
    const e = this.read(this._readableState.length);
    s._receiver.write(e);
  }
  s._receiver.end(), this[S] = void 0, clearTimeout(s._closeTimer), s._receiver._writableState.finished || s._receiver._writableState.errorEmitted ? s.emitClose() : (s._receiver.on("error", Et), s._receiver.on("finish", Et));
}
function Pe(s) {
  this[S]._receiver.write(s) || this.pause();
}
function zt() {
  const s = this[S];
  s._readyState = f.CLOSING, s._receiver.end(), this.end();
}
function Kt() {
  const s = this[S];
  this.removeListener("error", Kt), this.on("error", Wt), s && (s._readyState = f.CLOSING, this.destroy());
}
const zr = /* @__PURE__ */ Rs(Dr), { Duplex: Gi } = le, { tokenChars: Ji } = fe, { Duplex: zi } = le, { createHash: Ki } = Ke, { CLOSE_TIMEOUT: Hi, GUID: Yi, kWebSocket: Xi } = D, ie = {
  cache: "no-store"
}, Kr = (s) => ae + (s === !1 ? "" : " AssemblyAI/1.0 (" + Object.entries({ ...be, ...s }).map(([e, t]) => t ? `${e}=${t.name}/${t.version}` : "").join(" ") + ")");
let ae = "";
typeof navigator < "u" && navigator.userAgent && (ae += navigator.userAgent);
const be = {
  sdk: { name: "JavaScript", version: "4.22.1" }
};
typeof process < "u" && (process.versions.node && ae.indexOf("Node") === -1 && (be.runtime_env = {
  name: "Node",
  version: process.versions.node
}), process.versions.bun && ae.indexOf("Bun") === -1 && (be.runtime_env = {
  name: "Bun",
  version: process.versions.bun
}));
typeof Deno < "u" && process.versions.bun && ae.indexOf("Deno") === -1 && (be.runtime_env = { name: "Deno", version: Deno.version.deno });
class he {
  /**
   * Create a new service.
   * @param params - The parameters to use for the service.
   */
  constructor(e) {
    this.params = e, e.userAgent === !1 ? this.userAgent = void 0 : this.userAgent = Kr(e.userAgent || {});
  }
  async fetch(e, t) {
    t = { ...ie, ...t };
    let i = {
      Authorization: this.params.apiKey,
      "Content-Type": "application/json"
    };
    ie != null && ie.headers && (i = { ...i, ...ie.headers }), t != null && t.headers && (i = { ...i, ...t.headers }), this.userAgent && (i["User-Agent"] = this.userAgent), t.headers = i, e.startsWith("http") || (e = this.params.baseUrl + e);
    const r = await fetch(e, t);
    if (r.status >= 400) {
      let n;
      const o = await r.text();
      if (o) {
        try {
          n = JSON.parse(o);
        } catch {
        }
        throw n != null && n.error ? new Error(n.error) : new Error(o);
      }
      throw new Error(`HTTP Error: ${r.status} ${r.statusText}`);
    }
    return r;
  }
  async fetchJson(e, t) {
    return (await this.fetch(e, t)).json();
  }
}
class Hr extends he {
  summary(e, t) {
    return this.fetchJson("/lemur/v3/generate/summary", {
      method: "POST",
      body: JSON.stringify(e),
      signal: t
    });
  }
  questionAnswer(e, t) {
    return this.fetchJson("/lemur/v3/generate/question-answer", {
      method: "POST",
      body: JSON.stringify(e),
      signal: t
    });
  }
  actionItems(e, t) {
    return this.fetchJson("/lemur/v3/generate/action-items", {
      method: "POST",
      body: JSON.stringify(e),
      signal: t
    });
  }
  task(e, t) {
    return this.fetchJson("/lemur/v3/generate/task", {
      method: "POST",
      body: JSON.stringify(e),
      signal: t
    });
  }
  getResponse(e, t) {
    return this.fetchJson(`/lemur/v3/${e}`, { signal: t });
  }
  /**
   * Delete the data for a previously submitted LeMUR request.
   * @param id - ID of the LeMUR request
   * @param signal - Optional AbortSignal to cancel the request
   */
  purgeRequestData(e, t) {
    return this.fetchJson(`/lemur/v3/${e}`, {
      method: "DELETE",
      signal: t
    });
  }
}
const xe = (s, e) => new zr(s, e), y = {
  BadSampleRate: 4e3,
  AuthFailed: 4001,
  InsufficientFunds: 4002,
  FreeTierUser: 4003,
  NonexistentSessionId: 4004,
  SessionExpired: 4008,
  ClosedSession: 4010,
  RateLimited: 4029,
  UniqueSessionViolation: 4030,
  SessionTimeout: 4031,
  AudioTooShort: 4032,
  AudioTooLong: 4033,
  AudioTooSmallToTranscode: 4034,
  /**
   * @deprecated Don't use
   */
  BadJson: 4100,
  BadSchema: 4101,
  TooManyStreams: 4102,
  Reconnected: 4103,
  /**
   * @deprecated Don't use
   */
  ReconnectAttemptsExhausted: 1013,
  WordBoostParameterParsingFailed: 4104
}, vt = {
  [y.BadSampleRate]: "Sample rate must be a positive integer",
  [y.AuthFailed]: "Not Authorized",
  [y.InsufficientFunds]: "Insufficient funds",
  [y.FreeTierUser]: "This feature is paid-only and requires you to add a credit card. Please visit https://app.assemblyai.com/ to add a credit card to your account.",
  [y.NonexistentSessionId]: "Session ID does not exist",
  [y.SessionExpired]: "Session has expired",
  [y.ClosedSession]: "Session is closed",
  [y.RateLimited]: "Rate limited",
  [y.UniqueSessionViolation]: "Unique session violation",
  [y.SessionTimeout]: "Session Timeout",
  [y.AudioTooShort]: "Audio too short",
  [y.AudioTooLong]: "Audio too long",
  [y.AudioTooSmallToTranscode]: "Audio too small to transcode",
  [y.BadJson]: "Bad JSON",
  [y.BadSchema]: "Bad schema",
  [y.TooManyStreams]: "Too many streams",
  [y.Reconnected]: "This session has been reconnected. This WebSocket is no longer valid.",
  [y.ReconnectAttemptsExhausted]: "Reconnect attempts exhausted",
  [y.WordBoostParameterParsingFailed]: "Could not parse word boost parameter"
};
class Yr extends Error {
}
const v = {
  BadSampleRate: 4e3,
  AuthFailed: 4001,
  InsufficientFunds: 4002,
  FreeTierUser: 4003,
  NonexistentSessionId: 4004,
  SessionExpired: 4008,
  ClosedSession: 4010,
  RateLimited: 4029,
  UniqueSessionViolation: 4030,
  SessionTimeout: 4031,
  AudioTooShort: 4032,
  AudioTooLong: 4033,
  AudioTooSmallToTranscode: 4034,
  BadSchema: 4101,
  TooManyStreams: 4102,
  Reconnected: 4103
}, bt = {
  [v.BadSampleRate]: "Sample rate must be a positive integer",
  [v.AuthFailed]: "Not Authorized",
  [v.InsufficientFunds]: "Insufficient funds",
  [v.FreeTierUser]: "This feature is paid-only and requires you to add a credit card. Please visit https://app.assemblyai.com/ to add a credit card to your account.",
  [v.NonexistentSessionId]: "Session ID does not exist",
  [v.SessionExpired]: "Session has expired",
  [v.ClosedSession]: "Session is closed",
  [v.RateLimited]: "Rate limited",
  [v.UniqueSessionViolation]: "Unique session violation",
  [v.SessionTimeout]: "Session Timeout",
  [v.AudioTooShort]: "Audio too short",
  [v.AudioTooLong]: "Audio too long",
  [v.AudioTooSmallToTranscode]: "Audio too small to transcode",
  [v.BadSchema]: "Bad schema",
  [v.TooManyStreams]: "Too many streams",
  [v.Reconnected]: "This session has been reconnected. This WebSocket is no longer valid."
};
class Xr extends Error {
}
const Zr = "wss://api.assemblyai.com/v2/realtime/ws", Qr = '{"force_end_utterance":true}', xt = '{"terminate_session":true}';
class ei {
  /**
   * Create a new RealtimeTranscriber.
   * @param params - Parameters to configure the RealtimeTranscriber
   */
  constructor(e) {
    if (this.listeners = {}, this.realtimeUrl = e.realtimeUrl ?? Zr, this.sampleRate = e.sampleRate ?? 16e3, this.wordBoost = e.wordBoost, this.encoding = e.encoding, this.endUtteranceSilenceThreshold = e.endUtteranceSilenceThreshold, this.disablePartialTranscripts = e.disablePartialTranscripts, "token" in e && e.token && (this.token = e.token), "apiKey" in e && e.apiKey && (this.apiKey = e.apiKey), !(this.token || this.apiKey))
      throw new Error("API key or temporary token is required.");
  }
  connectionUrl() {
    const e = new URL(this.realtimeUrl);
    if (e.protocol !== "wss:")
      throw new Error("Invalid protocol, must be wss");
    const t = new URLSearchParams();
    return this.token && t.set("token", this.token), t.set("sample_rate", this.sampleRate.toString()), this.wordBoost && this.wordBoost.length > 0 && t.set("word_boost", JSON.stringify(this.wordBoost)), this.encoding && t.set("encoding", this.encoding), t.set("enable_extra_session_information", "true"), this.disablePartialTranscripts && t.set("disable_partial_transcripts", this.disablePartialTranscripts.toString()), e.search = t.toString(), e;
  }
  /**
   * Add a listener for an event.
   * @param event - The event to listen for.
   * @param listener - The function to call when the event is emitted.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(e, t) {
    this.listeners[e] = t;
  }
  /**
   * Connect to the server and begin a new session.
   * @returns A promise that resolves when the connection is established and the session begins.
   */
  connect() {
    return new Promise((e) => {
      if (this.socket)
        throw new Error("Already connected");
      const t = this.connectionUrl();
      this.token ? this.socket = xe(t.toString()) : this.socket = xe(t.toString(), {
        headers: { Authorization: this.apiKey }
      }), this.socket.binaryType = "arraybuffer", this.socket.onopen = () => {
        this.endUtteranceSilenceThreshold === void 0 || this.endUtteranceSilenceThreshold === null || this.configureEndUtteranceSilenceThreshold(this.endUtteranceSilenceThreshold);
      }, this.socket.onclose = ({ code: i, reason: r }) => {
        var n, o;
        r || i in vt && (r = vt[i]), (o = (n = this.listeners).close) == null || o.call(n, i, r);
      }, this.socket.onerror = (i) => {
        var r, n, o, a;
        i.error ? (n = (r = this.listeners).error) == null || n.call(r, i.error) : (a = (o = this.listeners).error) == null || a.call(o, new Error(i.message));
      }, this.socket.onmessage = ({ data: i }) => {
        var n, o, a, c, l, h, d, E, g, _, u, w, L, B, Q;
        const r = JSON.parse(i.toString());
        if ("error" in r) {
          (o = (n = this.listeners).error) == null || o.call(n, new Yr(r.error));
          return;
        }
        switch (r.message_type) {
          case "SessionBegins": {
            const I = {
              sessionId: r.session_id,
              expiresAt: new Date(r.expires_at)
            };
            e(I), (c = (a = this.listeners).open) == null || c.call(a, I);
            break;
          }
          case "PartialTranscript": {
            r.created = new Date(r.created), (h = (l = this.listeners).transcript) == null || h.call(l, r), (E = (d = this.listeners)["transcript.partial"]) == null || E.call(d, r);
            break;
          }
          case "FinalTranscript": {
            r.created = new Date(r.created), (_ = (g = this.listeners).transcript) == null || _.call(g, r), (w = (u = this.listeners)["transcript.final"]) == null || w.call(u, r);
            break;
          }
          case "SessionInformation": {
            (B = (L = this.listeners).session_information) == null || B.call(L, r);
            break;
          }
          case "SessionTerminated": {
            (Q = this.sessionTerminatedResolve) == null || Q.call(this);
            break;
          }
        }
      };
    });
  }
  /**
   * Send audio data to the server.
   * @param audio - The audio data to send to the server.
   */
  sendAudio(e) {
    this.send(e);
  }
  /**
   * Create a writable stream that can be used to send audio data to the server.
   * @returns A writable stream that can be used to send audio data to the server.
   */
  stream() {
    return new It({
      write: (e) => {
        this.sendAudio(e);
      }
    });
  }
  /**
   * Manually end an utterance
   */
  forceEndUtterance() {
    this.send(Qr);
  }
  /**
   * Configure the threshold for how long to wait before ending an utterance. Default is 700ms.
   * @param threshold - The duration of the end utterance silence threshold in milliseconds.
   * This value must be an integer between 0 and 20_000.
   */
  configureEndUtteranceSilenceThreshold(e) {
    this.send(`{"end_utterance_silence_threshold":${e}}`);
  }
  send(e) {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN)
      throw new Error("Socket is not open for communication");
    this.socket.send(e);
  }
  /**
   * Close the connection to the server.
   * @param waitForSessionTermination - If true, the method will wait for the session to be terminated before closing the connection.
   * While waiting for the session to be terminated, you will receive the final transcript and session information.
   */
  async close(e = !0) {
    var t;
    if (this.socket) {
      if (this.socket.readyState === this.socket.OPEN)
        if (e) {
          const i = new Promise((r) => {
            this.sessionTerminatedResolve = r;
          });
          this.socket.send(xt), await i;
        } else
          this.socket.send(xt);
      (t = this.socket) != null && t.removeAllListeners && this.socket.removeAllListeners(), this.socket.close();
    }
    this.listeners = {}, this.socket = void 0;
  }
}
class ti extends he {
  constructor(e) {
    super(e), this.rtFactoryParams = e;
  }
  /**
   * @deprecated Use transcriber(...) instead
   */
  createService(e) {
    return this.transcriber(e);
  }
  transcriber(e) {
    const t = { ...e };
    return !t.token && !t.apiKey && (t.apiKey = this.rtFactoryParams.apiKey), new ei(t);
  }
  async createTemporaryToken(e) {
    return (await this.fetchJson("/v2/realtime/token", {
      method: "POST",
      body: JSON.stringify(e)
    })).token;
  }
}
function Tt(s) {
  return s.startsWith("http") || s.startsWith("https") || s.startsWith("data:") ? null : s.startsWith("file://") ? s.substring(7) : s.startsWith("file:") ? s.substring(5) : s;
}
class si extends he {
  constructor(e, t) {
    super(e), this.files = t;
  }
  /**
   * Transcribe an audio file. This will create a transcript and wait until the transcript status is "completed" or "error".
   * @param params - The parameters to transcribe an audio file.
   * @param options - The options to transcribe an audio file.
   * @returns A promise that resolves to the transcript. The transcript status is "completed" or "error".
   */
  async transcribe(e, t) {
    const i = await this.submit(e);
    return await this.waitUntilReady(i.id, t);
  }
  /**
   * Submits a transcription job for an audio file. This will not wait until the transcript status is "completed" or "error".
   * @param params - The parameters to start the transcription of an audio file.
   * @returns A promise that resolves to the queued transcript.
   */
  async submit(e) {
    let t, i;
    if ("audio" in e) {
      const { audio: n, ...o } = e;
      if (typeof n == "string") {
        const a = Tt(n);
        a !== null ? t = await this.files.upload(a) : n.startsWith("data:") ? t = await this.files.upload(n) : t = n;
      } else
        t = await this.files.upload(n);
      i = { ...o, audio_url: t };
    } else
      i = e;
    return await this.fetchJson("/v2/transcript", {
      method: "POST",
      body: JSON.stringify(i)
    });
  }
  /**
   * Create a transcript.
   * @param params - The parameters to create a transcript.
   * @param options - The options used for creating the new transcript.
   * @returns A promise that resolves to the transcript.
   * @deprecated Use `transcribe` instead to transcribe a audio file that includes polling, or `submit` to transcribe a audio file without polling.
   */
  async create(e, t) {
    const i = Tt(e.audio_url);
    if (i !== null) {
      const n = await this.files.upload(i);
      e.audio_url = n;
    }
    const r = await this.fetchJson("/v2/transcript", {
      method: "POST",
      body: JSON.stringify(e)
    });
    return (t == null ? void 0 : t.poll) ?? !0 ? await this.waitUntilReady(r.id, t) : r;
  }
  /**
   * Wait until the transcript ready, either the status is "completed" or "error".
   * @param transcriptId - The ID of the transcript.
   * @param options - The options to wait until the transcript is ready.
   * @returns A promise that resolves to the transcript. The transcript status is "completed" or "error".
   */
  async waitUntilReady(e, t) {
    const i = (t == null ? void 0 : t.pollingInterval) ?? 3e3, r = (t == null ? void 0 : t.pollingTimeout) ?? -1, n = Date.now();
    for (; ; ) {
      const o = await this.get(e);
      if (o.status === "completed" || o.status === "error")
        return o;
      if (r > 0 && Date.now() - n > r)
        throw new Error("Polling timeout");
      await new Promise((a) => setTimeout(a, i));
    }
  }
  /**
   * Retrieve a transcript.
   * @param id - The identifier of the transcript.
   * @returns A promise that resolves to the transcript.
   */
  get(e) {
    return this.fetchJson(`/v2/transcript/${e}`);
  }
  /**
   * Retrieves a page of transcript listings.
   * @param params - The parameters to filter the transcript list by, or the URL to retrieve the transcript list from.
   */
  async list(e) {
    let t = "/v2/transcript";
    typeof e == "string" ? t = e : e && (t = `${t}?${new URLSearchParams(Object.keys(e).map((r) => {
      var n;
      return [
        r,
        ((n = e[r]) == null ? void 0 : n.toString()) || ""
      ];
    }))}`);
    const i = await this.fetchJson(t);
    for (const r of i.transcripts)
      r.created = new Date(r.created), r.completed && (r.completed = new Date(r.completed));
    return i;
  }
  /**
   * Delete a transcript
   * @param id - The identifier of the transcript.
   * @returns A promise that resolves to the transcript.
   */
  delete(e) {
    return this.fetchJson(`/v2/transcript/${e}`, { method: "DELETE" });
  }
  /**
   * Search through the transcript for a specific set of keywords.
   * You can search for individual words, numbers, or phrases containing up to five words or numbers.
   * @param id - The identifier of the transcript.
   * @param words - Keywords to search for.
   * @returns A promise that resolves to the sentences.
   */
  wordSearch(e, t) {
    const i = new URLSearchParams({ words: t.join(",") });
    return this.fetchJson(`/v2/transcript/${e}/word-search?${i.toString()}`);
  }
  /**
   * Retrieve all sentences of a transcript.
   * @param id - The identifier of the transcript.
   * @returns A promise that resolves to the sentences.
   */
  sentences(e) {
    return this.fetchJson(`/v2/transcript/${e}/sentences`);
  }
  /**
   * Retrieve all paragraphs of a transcript.
   * @param id - The identifier of the transcript.
   * @returns A promise that resolves to the paragraphs.
   */
  paragraphs(e) {
    return this.fetchJson(`/v2/transcript/${e}/paragraphs`);
  }
  /**
   * Retrieve subtitles of a transcript.
   * @param id - The identifier of the transcript.
   * @param format - The format of the subtitles.
   * @param chars_per_caption - The maximum number of characters per caption.
   * @returns A promise that resolves to the subtitles text.
   */
  async subtitles(e, t = "srt", i) {
    let r = `/v2/transcript/${e}/${t}`;
    if (i) {
      const o = new URLSearchParams();
      o.set("chars_per_caption", i.toString()), r += `?${o.toString()}`;
    }
    return await (await this.fetch(r)).text();
  }
  /**
   * Retrieve the redacted audio URL of a transcript.
   * @param id - The identifier of the transcript.
   * @returns A promise that resolves to the details of the redacted audio.
   * @deprecated Use `redactedAudio` instead.
   */
  redactions(e) {
    return this.redactedAudio(e);
  }
  /**
   * Retrieve the redacted audio URL of a transcript.
   * @param id - The identifier of the transcript.
   * @returns A promise that resolves to the details of the redacted audio.
   */
  redactedAudio(e) {
    return this.fetchJson(`/v2/transcript/${e}/redacted-audio`);
  }
  /**
   * Retrieve the redacted audio file of a transcript.
   * @param id - The identifier of the transcript.
   * @returns A promise that resolves to the fetch HTTP response of the redacted audio file.
   */
  async redactedAudioFile(e) {
    const { redacted_audio_url: t, status: i } = await this.redactedAudio(e);
    if (i !== "redacted_audio_ready")
      throw new Error(`Redacted audio status is ${i}`);
    const r = await fetch(t);
    if (!r.ok)
      throw new Error(`Failed to fetch redacted audio: ${r.statusText}`);
    return {
      arrayBuffer: r.arrayBuffer.bind(r),
      blob: r.blob.bind(r),
      body: r.body,
      bodyUsed: r.bodyUsed
    };
  }
}
const ri = async (s) => fs.toWeb(ps(s));
class ii extends he {
  /**
   * Upload a local file to AssemblyAI.
   * @param input - The local file path to upload, or a stream or buffer of the file to upload.
   * @returns A promise that resolves to the uploaded file URL.
   */
  async upload(e) {
    let t;
    return typeof e == "string" ? e.startsWith("data:") ? t = ni(e) : t = await ri(e) : t = e, (await this.fetchJson("/v2/upload", {
      method: "POST",
      body: t,
      headers: {
        "Content-Type": "application/octet-stream"
      },
      duplex: "half"
    })).upload_url;
  }
}
function ni(s) {
  const e = s.split(","), t = e[0].match(/:(.*?);/)[1], i = atob(e[1]);
  let r = i.length;
  const n = new Uint8Array(r);
  for (; r--; )
    n[r] = i.charCodeAt(r);
  return new Blob([n], { type: t });
}
const oi = "wss://streaming.assemblyai.com/v3/ws", kt = '{"type":"Terminate"}';
class ai {
  constructor(e) {
    if (this.listeners = {}, this.params = {
      ...e,
      websocketBaseUrl: e.websocketBaseUrl || oi
    }, "token" in e && e.token && (this.token = e.token), "apiKey" in e && e.apiKey && (this.apiKey = e.apiKey), !(this.token || this.apiKey))
      throw new Error("API key or temporary token is required.");
  }
  connectionUrl() {
    const e = new URL(this.params.websocketBaseUrl ?? "");
    if (e.protocol !== "wss:")
      throw new Error("Invalid protocol, must be wss");
    const t = new URLSearchParams();
    return this.token && t.set("token", this.token), t.set("sample_rate", this.params.sampleRate.toString()), this.params.endOfTurnConfidenceThreshold && t.set("end_of_turn_confidence_threshold", this.params.endOfTurnConfidenceThreshold.toString()), this.params.minEndOfTurnSilenceWhenConfident && t.set("min_end_of_turn_silence_when_confident", this.params.minEndOfTurnSilenceWhenConfident.toString()), this.params.maxTurnSilence && t.set("max_turn_silence", this.params.maxTurnSilence.toString()), this.params.vadThreshold !== void 0 && t.set("vad_threshold", this.params.vadThreshold.toString()), this.params.formatTurns && t.set("format_turns", this.params.formatTurns.toString()), this.params.encoding && t.set("encoding", this.params.encoding.toString()), this.params.keytermsPrompt ? t.set("keyterms_prompt", JSON.stringify(this.params.keytermsPrompt)) : this.params.keyterms && (console.warn("[Deprecation Warning] `keyterms` is deprecated and will be removed in a future release. Please use `keytermsPrompt` instead."), t.set("keyterms_prompt", JSON.stringify(this.params.keyterms))), this.params.filterProfanity && t.set("filter_profanity", this.params.filterProfanity.toString()), this.params.speechModel && t.set("speech_model", this.params.speechModel.toString()), this.params.languageDetection !== void 0 && t.set("language_detection", this.params.languageDetection.toString()), this.params.inactivityTimeout !== void 0 && t.set("inactivity_timeout", this.params.inactivityTimeout.toString()), e.search = t.toString(), e;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(e, t) {
    this.listeners[e] = t;
  }
  connect() {
    return new Promise((e) => {
      if (this.socket)
        throw new Error("Already connected");
      const t = this.connectionUrl();
      this.token ? this.socket = xe(t.toString()) : this.socket = xe(t.toString(), {
        headers: { Authorization: this.apiKey }
      }), this.socket.binaryType = "arraybuffer", this.socket.onopen = () => {
      }, this.socket.onclose = ({ code: i, reason: r }) => {
        var n, o;
        r || i in bt && (r = bt[i]), (o = (n = this.listeners).close) == null || o.call(n, i, r);
      }, this.socket.onerror = (i) => {
        var r, n, o, a;
        i.error ? (n = (r = this.listeners).error) == null || n.call(r, i.error) : (a = (o = this.listeners).error) == null || a.call(o, new Error(i.message));
      }, this.socket.onmessage = ({ data: i }) => {
        var n, o, a, c, l, h, d;
        const r = JSON.parse(i.toString());
        if ("error" in r) {
          (o = (n = this.listeners).error) == null || o.call(n, new Xr(r.error));
          return;
        }
        switch (r.type) {
          case "Begin": {
            e(r), (c = (a = this.listeners).open) == null || c.call(a, r);
            break;
          }
          case "Turn": {
            (h = (l = this.listeners).turn) == null || h.call(l, r);
            break;
          }
          case "Termination": {
            (d = this.sessionTerminatedResolve) == null || d.call(this);
            break;
          }
        }
      };
    });
  }
  stream() {
    return new It({
      write: (e) => {
        this.sendAudio(e);
      }
    });
  }
  sendAudio(e) {
    this.send(e);
  }
  send(e) {
    if (!this.socket || this.socket.readyState !== this.socket.OPEN)
      throw new Error("Socket is not open for communication");
    this.socket.send(e);
  }
  async close(e = !0) {
    var t;
    if (this.socket) {
      if (this.socket.readyState === this.socket.OPEN)
        if (e) {
          const i = new Promise((r) => {
            this.sessionTerminatedResolve = r;
          });
          this.socket.send(kt), await i;
        } else
          this.socket.send(kt);
      (t = this.socket) != null && t.removeAllListeners && this.socket.removeAllListeners(), this.socket.close();
    }
    this.listeners = {}, this.socket = void 0;
  }
}
class li extends he {
  constructor(e) {
    super(e), this.baseServiceParams = e;
  }
  transcriber(e) {
    const t = { ...e };
    return !t.token && !t.apiKey && (t.apiKey = this.baseServiceParams.apiKey), new ai(t);
  }
  async createTemporaryToken(e) {
    const t = new URLSearchParams();
    Object.entries(e).forEach(([o, a]) => {
      a != null && t.append(o, String(a));
    });
    const i = t.toString(), r = i ? `/v3/token?${i}` : "/v3/token";
    return (await this.fetchJson(r, {
      method: "GET"
    })).token;
  }
}
const ci = "https://api.assemblyai.com", fi = "https://streaming.assemblyai.com";
class hi {
  /**
   * Create a new AssemblyAI client.
   * @param params - The parameters for the service, including the API key and base URL, if any.
   */
  constructor(e) {
    e.baseUrl = e.baseUrl || ci, e.baseUrl && e.baseUrl.endsWith("/") && (e.baseUrl = e.baseUrl.slice(0, -1)), this.files = new ii(e), this.transcripts = new si(e, this.files), this.lemur = new Hr(e), this.realtime = new ti(e), this.streaming = new li({
      ...e,
      baseUrl: e.streamingBaseUrl || fi
    });
  }
}
function di() {
  const { app: s } = require("electron");
  if (s.isPackaged) {
    const t = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg", i = Ut.join(process.resourcesPath, "bin", t);
    if (je.existsSync(i))
      return i;
  }
  return process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
}
async function ui(s) {
  const e = _s.tmpdir(), t = Ut.join(e, `audio-${Date.now()}.wav`), i = di();
  return new Promise((r, n) => {
    const o = ms(i, [
      "-i",
      s,
      "-vn",
      // No video
      "-acodec",
      "pcm_s16le",
      // WAV format
      "-ar",
      "16000",
      // 16kHz sample rate (optimal for speech recognition)
      "-ac",
      "1",
      // Mono audio
      "-y",
      // Overwrite output file
      t
    ]);
    let a = "";
    o.stderr.on("data", (c) => {
      a += c.toString();
    }), o.on("close", (c) => {
      c === 0 ? r(t) : n(new Error(`FFmpeg exited with code ${c}: ${a}`));
    }), o.on("error", (c) => {
      n(new Error(`Failed to spawn ffmpeg: ${c.message}. Make sure ffmpeg is installed and in PATH.`));
    });
  });
}
async function pi(s, e) {
  try {
    if (!s.videoPath)
      return { success: !1, error: "Video path is required" };
    if (!s.apiKey)
      return { success: !1, error: "AssemblyAI API key is required" };
    if (!je.existsSync(s.videoPath))
      return { success: !1, error: `Video file not found: ${s.videoPath}` };
    e == null || e({
      status: "extracting",
      progress: 10,
      message: "Extracting audio from video..."
    });
    let t;
    try {
      t = await ui(s.videoPath);
    } catch (a) {
      return {
        success: !1,
        error: `Failed to extract audio: ${a instanceof Error ? a.message : String(a)}`
      };
    }
    e == null || e({
      status: "uploading",
      progress: 20,
      message: "Uploading audio to AssemblyAI..."
    });
    const i = new hi({ apiKey: s.apiKey });
    e == null || e({
      status: "transcribing",
      progress: 30,
      message: "Transcribing audio (this may take a few minutes)..."
    });
    const r = {
      audio: t
    };
    s.language && s.language !== "auto" && (r.language_code = s.language);
    const n = await i.transcripts.transcribe(r);
    e == null || e({
      status: "processing",
      progress: 90,
      message: "Processing transcription results..."
    });
    try {
      je.unlinkSync(t);
    } catch {
      console.warn("Failed to cleanup temp audio file:", t);
    }
    if (n.status === "error")
      return {
        success: !1,
        error: n.error || "Transcription failed"
      };
    const o = (n.words || []).map((a) => ({
      text: a.text,
      startMs: a.start,
      endMs: a.end,
      confidence: a.confidence
    }));
    return e == null || e({
      status: "complete",
      progress: 100,
      message: `Transcription complete! ${o.length} words detected.`
    }), {
      success: !0,
      words: o
    };
  } catch (t) {
    return console.error("Transcription error:", t), {
      success: !1,
      error: t instanceof Error ? t.message : "Unknown transcription error"
    };
  }
}
let ge = null;
function mi(s, e, t, i, r) {
  p.handle("get-sources", async (o, a) => (await es.getSources(a)).map((l) => ({
    id: l.id,
    name: l.name,
    display_id: l.display_id,
    thumbnail: l.thumbnail ? l.thumbnail.toDataURL() : null,
    appIcon: l.appIcon ? l.appIcon.toDataURL() : null
  }))), p.handle("select-source", (o, a) => {
    ge = a;
    const c = i();
    return c && c.close(), ge;
  }), p.handle("get-selected-source", () => ge), p.handle("open-source-selector", () => {
    const o = i();
    if (o) {
      o.focus();
      return;
    }
    e();
  }), p.handle("switch-to-editor", () => {
    const o = t();
    o && o.close(), s();
  }), p.handle("store-recorded-video", async (o, a, c) => {
    try {
      const l = m.join(J, c);
      return await W.writeFile(l, Buffer.from(a)), n = l, {
        success: !0,
        path: l,
        message: "Video stored successfully"
      };
    } catch (l) {
      return console.error("Failed to store video:", l), {
        success: !1,
        message: "Failed to store video",
        error: String(l)
      };
    }
  }), p.handle("get-recorded-video-path", async () => {
    try {
      const a = (await W.readdir(J)).filter((h) => h.endsWith(".webm"));
      if (a.length === 0)
        return { success: !1, message: "No recorded video found" };
      const c = a.sort().reverse()[0];
      return { success: !0, path: m.join(J, c) };
    } catch (o) {
      return console.error("Failed to get video path:", o), { success: !1, message: "Failed to get video path", error: String(o) };
    }
  }), p.handle("set-recording-state", (o, a) => {
    r && r(a, (ge || { name: "Screen" }).name);
  }), p.handle("open-external-url", async (o, a) => {
    try {
      return await ts.openExternal(a), { success: !0 };
    } catch (c) {
      return console.error("Failed to open URL:", c), { success: !1, error: String(c) };
    }
  }), p.handle("get-asset-base-path", () => {
    try {
      return P.isPackaged ? m.join(process.resourcesPath, "assets") : m.join(P.getAppPath(), "public", "assets");
    } catch (o) {
      return console.error("Failed to resolve asset base path:", o), null;
    }
  }), p.handle("save-exported-video", async (o, a, c) => {
    try {
      const l = t(), h = c.toLowerCase().endsWith(".gif"), d = h ? [{ name: "GIF Image", extensions: ["gif"] }] : [{ name: "MP4 Video", extensions: ["mp4"] }], E = {
        title: h ? "Save Exported GIF" : "Save Exported Video",
        defaultPath: m.join(P.getPath("downloads"), c),
        filters: d,
        properties: ["createDirectory", "showOverwriteConfirmation"]
      }, g = l ? await Ie.showSaveDialog(l, E) : await Ie.showSaveDialog(E);
      return g.canceled || !g.filePath ? {
        success: !1,
        cancelled: !0,
        message: "Export cancelled"
      } : (await W.writeFile(g.filePath, Buffer.from(a)), {
        success: !0,
        path: g.filePath,
        message: "Video exported successfully"
      });
    } catch (l) {
      return console.error("Failed to save exported video:", l), {
        success: !1,
        message: "Failed to save exported video",
        error: String(l)
      };
    }
  }), p.handle("open-video-file-picker", async () => {
    try {
      const o = await Ie.showOpenDialog({
        title: "Select Video File",
        defaultPath: J,
        filters: [
          { name: "Video Files", extensions: ["webm", "mp4", "mov", "avi", "mkv"] },
          { name: "All Files", extensions: ["*"] }
        ],
        properties: ["openFile"]
      });
      return o.canceled || o.filePaths.length === 0 ? { success: !1, cancelled: !0 } : {
        success: !0,
        path: o.filePaths[0]
      };
    } catch (o) {
      return console.error("Failed to open file picker:", o), {
        success: !1,
        message: "Failed to open file picker",
        error: String(o)
      };
    }
  });
  let n = null;
  p.handle("set-current-video-path", (o, a) => (n = a, { success: !0 })), p.handle("get-current-video-path", () => n ? { success: !0, path: n } : { success: !1 }), p.handle("clear-current-video-path", () => (n = null, { success: !0 })), p.handle("get-platform", () => process.platform), p.handle("presets:get", async () => await bs()), p.handle("presets:save", async (o, a) => await xs(a)), p.handle("presets:update", async (o, a, c) => await Ts(a, c)), p.handle("presets:delete", async (o, a) => await ks(a)), p.handle("presets:duplicate", async (o, a) => await Os(a)), p.handle("presets:setDefault", async (o, a) => await Ps(a)), p.handle("transcribe-video", async (o, a) => await pi(a, (c) => {
    const l = t();
    l && !l.isDestroyed() && l.webContents.send("transcription-progress", c);
  }));
}
const _i = m.dirname(Lt(import.meta.url)), J = m.join(P.getPath("userData"), "recordings");
async function gi() {
  try {
    await W.mkdir(J, { recursive: !0 }), console.log("RECORDINGS_DIR:", J), console.log("User Data Path:", P.getPath("userData"));
  } catch (s) {
    console.error("Failed to create recordings directory:", s);
  }
}
process.env.APP_ROOT = m.join(_i, "..");
const yi = process.env.VITE_DEV_SERVER_URL, Zi = m.join(process.env.APP_ROOT, "dist-electron"), Ht = m.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = yi ? m.join(process.env.APP_ROOT, "public") : Ht;
let b = null, ne = null, z = null, Yt = "";
const Xt = Zt("openscreen.png"), Si = Zt("rec-button.png");
function Ze() {
  b = ys();
}
function Ot() {
  z = new rs(Xt);
}
function Zt(s) {
  return ss.createFromPath(m.join(process.env.VITE_PUBLIC || Ht, s)).resize({
    width: 24,
    height: 24,
    quality: "best"
  });
}
function Pt(s = !1) {
  if (!z) return;
  const e = s ? Si : Xt, t = s ? `Recording: ${Yt}` : "OpenScreen", i = s ? [
    {
      label: "Stop Recording",
      click: () => {
        b && !b.isDestroyed() && b.webContents.send("stop-recording-from-tray");
      }
    }
  ] : [
    {
      label: "Open",
      click: () => {
        b && !b.isDestroyed() ? b.isMinimized() && b.restore() : Ze();
      }
    },
    {
      label: "Quit",
      click: () => {
        P.quit();
      }
    }
  ];
  z.setImage(e), z.setToolTip(t), z.setContextMenu(is.buildFromTemplate(i));
}
function wi() {
  b && (b.close(), b = null), b = Ss();
}
function Ei() {
  return ne = ws(), ne.on("closed", () => {
    ne = null;
  }), ne;
}
P.on("window-all-closed", () => {
});
P.on("activate", () => {
  Te.getAllWindows().length === 0 && Ze();
});
P.whenReady().then(async () => {
  const { ipcMain: s } = await import("electron");
  s.on("hud-overlay-close", () => {
    P.quit();
  }), Ot(), Pt(), await gi(), mi(
    wi,
    Ei,
    () => b,
    () => ne,
    (e, t) => {
      Yt = t, z || Ot(), Pt(e), e || b && b.restore();
    }
  ), Ze();
});
export {
  Zi as MAIN_DIST,
  J as RECORDINGS_DIR,
  Ht as RENDERER_DIST,
  yi as VITE_DEV_SERVER_URL
};
