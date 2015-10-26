"use strict";

function isSpace(t) {
    return " " === t || "	" === t || "\r" === t || "\n" === t
}

function isNewline(t) {
    return "\r" === t || "\n" === t
}

function isDigit(t) {
    return t >= "0" && "9" >= t || "." === t
}

function isAlpha(t) {
    return t >= "a" && "z" >= t || t >= "A" && "Z" >= t || "_" == t && "$" >= t
}

function isAlphaNum(t) {
    return t >= "a" && "z" >= t || t >= "A" && "Z" >= t || t >= "0" && "9" >= t || "_" === t || "$" === t
}

function isBinOp(t) {
    return "=" === t || "!" === t || "<" === t || ">" === t || "+" === t || "-" === t || "*" === t || "/" === t || "&" === t || "~" === t || "|" === t || "%" === t
}

function getClsFromPath(t) {
    for (var e = null, i = window, s = t.length, n = 0; s > n; n++)
        if (i = i[t[n]], !i) return null;
    return e
}

function _addClassInstance(t) {
    var e = t.prototype.__name__.split(".").slice(2),
        i = e.length - 1;
    if (t instanceof meta.Controller) return console.error("(meta.controller): Controller parent class should be meta.Controller"), void 0;
    for (var s, n = window, o = n, h = 0; i > h; h++) s = e[h], n = o[s], n || (n = {}, o[s] = n), o = n;
    var s = e[i];
    return n[s] ? (console.error("(meta.controller): Scope is already in use: " + e.join(".")), void 0) : (t.prototype.name = s, meta.engine.inited ? n[s] = new t : meta.cache.ctrlsToCreate ? meta.cache.ctrlsToCreate.push({
        cls: t,
        scope: n
    }) : meta.cache.ctrlsToCreate = [{
        cls: t,
        scope: n
    }], void 0)
}
var meta = {
    version: "0.8.2 nightly",
    importUrl: "http://meta2d.com/store/",
    device: null,
    resources: null,
    renderer: null,
    camera: null,
    input: null,
    channels: [],
    modules: {},
    flags: {
        webGL: !0,
        audioAPI: !0
    },
    time: {
        delta: 0,
        deltaF: 0,
        maxDelta: 250,
        scale: 1,
        curr: 0,
        fps: 0,
        current: 0,
        update: 0,
        accumulator: 0,
        frameIndex: 0,
        updateFreq: 100
    },
    cache: {
        width: 0,
        height: 0,
        metaTagsAdded: !1,
        timerIndex: 0,
        initFuncs: [],
        loadFuncs: [],
        readyFuncs: [],
        view: null,
        views: {},
        scripts: null,
        pendingScripts: null,
        numScriptsToLoad: 0,
        resolutions: null,
        currResolution: null,
        imageSmoothing: !0
    },
    set onInit(t) {
        this.cache.initFuncs.push(t), this.engine && this.engine.inited && t()
    },
    set onLoad(t) {
        this.cache.loadFuncs.push(t), this.engine && this.engine.loaded && t()
    },
    set onReady(t) {
        this.cache.readyFuncs.push(t), this.engine && this.engine.ready && t()
    },
    set onUpdate(t) {
        this.engine.updateFuncs.push(t)
    },
    set onRender(t) {
        this.engine.renderFuncs.push(t)
    },
    set debug(t) {
        this.cache.debug !== t && (this.cache.debug = t, t ? meta.emit(meta.Event.DEBUG, t, meta.Event.DEBUG) : meta.emit(meta.Event.DEBUG, t, meta.Event.DEBUG))
    },
    get debug() {
        return this.cache.debug
    }
};
"use strict",
function(t) {
    function e(t, i, s, a) {
        for (var r = null, l = window, u = t.split("."), c = u.length - 1, d = u[c], m = 0; c > m; m++) r = l, l = l[u[m]], l || (l = {}, r[u[m]] = l);
        var f = h[t],
            v = l[d],
            p = function t(e, i, s, o, h, a) {
                n || this.init && this.init(e, i, s, o, h, a)
            },
            _ = null,
            g = null;
        i ? (n = !0, _ = new i, g = _.__proto__, n = !1) : (n = !0, _ = new meta.class, n = !1);
        for (var y in s) {
            var x = Object.getOwnPropertyDescriptor(s, y);
            x.get || x.set ? Object.defineProperty(_, y, x) : i && "function" == typeof s[y] && "function" == typeof g[y] && o.test(s[y]) ? _[y] = function(t, e) {
                return function(i, s, n, o, h, a) {
                    var r = this._super;
                    this._super = g[t], this._fn = e;
                    var l = this._fn(i, s, n, o, h, a);
                    return this._super = r, l
                }
            }(y, s[y]) : _[y] = s[y]
        }
        if (p.prototype = _, p.prototype.__name__ = t, p.prototype.__lastName__ = d, p.prototype.constructor = _.init || null, l[d] = p, v)
            for (var y in v) p[y] = v[y];
        if (f) {
            var w = null,
                b = f.classes;
            for (c = b.length, m = 0; c > m; m++) w = b[m], e(w.name, p, w.prop, w.cb);
            delete h[t]
        }
        a && a(p, t)
    }

    function i() {
        this.classes = []
    }

    function s(t, e, i) {
        this.name = t, this.prop = e, this.cb = i
    }
    t.meta || (t.meta = {});
    var n = !1,
        o = /\b_super\b/,
        h = {};
    meta.class = function(t, e, i, s) {
        n || meta.class._construct(t, e, i, s)
    }, meta.class._construct = function(t, n, o, a) {
        if (!t) return console.error("(meta.class) Invalid class name"), void 0;
        o || (o = n, n = null), o || (o = {});
        var r = null;
        if (n) {
            for (var l = null, u = window, c = n.split("."), d = c.length - 1, m = 0; d > m; m++) l = u, u = u[c[m]], u || (u = {}, l[c[m]] = u);
            var f = c[d];
            if (r = u[f], !r) {
                var v = h[n];
                return v || (v = new i, h[n] = v), v.classes.push(new s(t, o, a)), void 0
            }
        }
        e(t, r, o, a)
    }, meta.classLoaded = function() {
        var t = 0,
            e = null,
            i = null,
            s = 0;
        for (var n in h)
            for (e = h[n], console.error("Undefined class: " + n), i = e.classes, s = i.length, t = 0; s > t; t++) console.error("Undefined class: " + i[t].name);
        e = {}
    }
}(void 0 !== typeof window ? window : global), "use strict", meta.engine = {
    create: function() {
        this._container = document.body, this._container.style.cssText = this.elementStyle, this.parseFlags(), this._createRenderer(), this._printInfo(), this.autoMetaTags && this._addMetaTags(), this.onResize = meta.createChannel(meta.Event.RESIZE), this.onAdapt = meta.createChannel(meta.Event.ADAPT), this.onBlur = meta.createChannel(meta.Event.BLUR), this.onFocus = meta.createChannel(meta.Event.FOCUS), this.onFullscreen = meta.createChannel(meta.Event.FULLSCREEN), this.onDebug = meta.createChannel(meta.Event.DEBUG);
        var t = this;
        this.cb = {
            resize: function(e) {
                t.updateResolution()
            },
            focus: function(e) {
                t.handleFocus(!0)
            },
            blur: function(e) {
                t.handleFocus(!1)
            }
        }, window.addEventListener("resize", this.cb.resize, !1), window.addEventListener("orientationchange", this.cb.resize, !1), meta.device.hidden && (this.cb.visibilityChange = function() {
            t.handleVisibilityChange()
        }, document.addEventListener(meta.device.visibilityChange, this.cb.visibilityChange)), window.addEventListener("focus", this.cb.focus), window.addEventListener("blur", this.cb.blur), meta.device.support.fullScreen && (this.cb.fullscreen = function() {
            t.onFullScreenChangeCB()
        }, document.addEventListener(meta.device.fullScreenOnChange, this.cb.fullscreen)), meta.camera = new meta.Camera, meta.world = new meta.World(0, 0), meta.resources = new Resource.Manager, meta.input = new Input.Manager, meta.debugger = new meta.Debugger;
        var e = meta.resources;
        e.onLoadingStart.add(this.onLoadingStart, this), e.onLoadingEnd.add(this.onLoadingEnd, this), this.sortAdaptions(), this.updateResolution(), this._initAll()
    },
    parseFlags: function() {
        for (var flag, flagName, flagValue, flagSepIndex, flags = window.location.hash.substr(1).split(","), num = flags.length, n = 0; num > n; n++) flag = flags[n], flagSepIndex = flag.indexOf("="), flagName = flag.substr(0, flagSepIndex).replace(/ /g, ""), flagValue = eval(flag.substr(flagSepIndex + 1).replace(/ /g, "")), meta.flags[flagName] = flagValue
    },
    _initAll: function() {
        this.time.current = Date.now();
        var t = meta.cache,
            e = new meta.View("master");
        t.views.master = e, t.view = e;
        for (var i, s = t.ctrlsToCreate, n = s.length, o = 0; n > o; o++) i = s[o], i.scope[i.cls.prototype.name] = new i.cls;
        for (t.ctrlsToCreate = null, n = t.initFuncs.length, o = 0; n > o; o++) t.initFuncs[o]();
        t.initFuncs = null, console.log(" "), this.inited = !0, this._loadAll()
    },
    _loadAll: function() {
        meta._loadAllScripts() || this._continueLoad()
    },
    _continueLoad: function() {
        this.loading = !0, this.meta.renderer.load();
        for (var t = meta.cache, e = t.loadFuncs.length, i = 0; e > i; i++) t.loadFuncs[i]();
        this.loadPlugins(), this.loaded = !0, meta.cache.view._parentVisible(!0), this._startMainLoop(), meta.resources.loading || this.onReady()
    },
    onReady: function() {
        this.flags |= this.Flag.READY, this.readyPlugins();
        for (var t = meta.cache.readyFuncs.length, e = 0; t > e; e++) meta.cache.readyFuncs[e]();
        meta.renderer.needRender = !0
    },
    loadPlugins: function() {
        for (var t = this.plugins.length, e = 0; t > e; e++) this.plugins[e].load()
    },
    readyPlugins: function() {
        for (var t = this.plugins.length, e = 0; t > e; e++) this.plugins[e].ready()
    },
    _startMainLoop: function() {
        var t = this;
        this._renderLoop = function() {
            t.render()
        }, this.render()
    },
    update: function(t) {
        var e, i;
        if (this._updateTimers(meta.time.delta), this.flags & this.Flag.READY && (i = this.controllersReady.length, i > 0 && !this.meta.resources.loading)) {
            var s;
            for (e = 0; e < this.controllersReady.length; e++) s = this.controllersReady[e], s.flags & s.Flag.LOADED && s.ready();
            this.controllersReady.length = 0
        }
        for (i = this.updateFuncs.length, e = 0; i > e; e++) this.updateFuncs[e](t);
        for (i = this.controllersUpdate.length, e = 0; i > e; e++) this.controllersUpdate[e].onUpdate(t);
        this.meta.renderer.update(t), this.meta.camera.update(t)
    },
    render: function() {
        this.time.frameIndex++;
        var t = Date.now();
        this.time.pause ? (this.time.delta = 0, this.time.deltaF = 0) : (this.time.delta = t - this.time.current, this.time.delta > this.time.maxDelta && (this.time.delta = this.time.maxDelta), this.time.delta *= this.time.scale, this.time.deltaF = this.time.delta / 1e3, this.time.accumulator += this.time.delta), t - this.time.fps >= 1e3 && (this.time.fps = t, this.fps = this._fpsCounter, this._fpsCounter = 0), this.update(this.time.deltaF), meta.renderer.render(this.time.deltaF);
        for (var e = this.renderFuncs.length, i = 0; e > i; i++) this.renderFuncs[i](this.time.tDeltaF);
        this._fpsCounter++, this.time.current = t, requestAnimationFrame(this._renderLoop)
    },
    _updateTimers: function(t) {
        var e, i, s, n = this.timers.length,
            o = this.timersRemove.length;
        if (o > 0) {
            var h = n - o;
            if (h > 0)
                for (var i, s = 0; o > s; s++) i = this.timers.indexOf(this.timersRemove[s]), h > i ? this.timers.splice(i, 1) : this.timers.pop();
            else this.timers.length = 0;
            n = h, this.timersRemove.length = 0
        }
        for (s = 0; n > s; s++)
            if (e = this.timers[s], !e.paused)
                for (e.tAccumulator += t; e.tAccumulator >= e.tDelta;)
                    if (e.tAccumulator -= e.tDelta, 0 !== e.numTimes && e.func.call(e.owner, e), e.tStart += e.tDelta, -1 !== e.numTimes && (e.numTimes--, e.numTimes <= 0)) {
                        n--, n > 0 && (this.timersRemove.push(e), e.__index = -1);
                        break
                    }
    },
    sortAdaptions: function() {
        var t = meta,
            e = t.cache.resolutions;
        if (e) {
            var i = e.length;
            if (!(1 >= i)) {
                e.sort(function(e, i) {
                    var s = t.math.length2(e.width, e.height),
                        n = t.math.length2(i.width, i.height);
                    return s - n
                });
                for (var s = e[0], n, o, h = 1; i > h; h++) o = e[h - 1], n = e[h], n.unitSize = n.height / s.height, n.zoomThreshold = o.unitSize + (n.unitSize - o.unitSize) / 100 * 33;
                meta.maxUnitSize = e[i - 1].unitSize, meta.maxUnitRatio = 1 / meta.maxUnitSize, t.camera.bounds(s.width, s.height)
            }
        }
    },
    adaptResolution: function() {
        var t = meta,
            e = t.cache.resolutions;
        if (!e) return !1;
        var i = e.length;
        if (1 > i) return !1;
        for (var s, n = e[0], o = t.camera.zoom, h = i - 1; h >= 0; h--)
            if (s = e[h], o >= s.zoomThreshold) {
                n = s;
                break
            }
        return n === t.cache.currResolution ? !0 : (t.cache.currResolution = n, t.unitSize = n.unitSize, t.unitRatio = 1 / t.unitSize, this.onAdapt.emit(n, meta.Event.ADAPT), !0)
    },
    onKeyTilde: function(t, e) {
        meta.debug = !meta.cache.debug, meta.renderer.needRender = !0
    },
    onLoadingStart: function(t, e) {
        meta.loading.load(), meta.device.support.consoleCSS ? console.log("%c(Loading started)", "background: #eee; font-weight: bold;") : console.log("(Loading started)")
    },
    onLoadingEnd: function(t, e) {
        meta.device.support.consoleCSS ? console.log("%c(Loading ended)", "background: #eee; font-weight: bold;") : console.log("(Loading ended)"), meta.loading.unload(), 0 === (this.flags & this.Flag.READY) && this.onReady(), meta.renderer.needRender = !0
    },
    onScriptLoadingEnd: function() {
        this._continueLoad()
    },
    updateLoading: function() {
        this.loading || this.scriptLoading || this._ready()
    },
    updateResolution: function() {
        this._resize(this.meta.cache.width, this.meta.cache.height)
    },
    resize: function(t, e) {
        var i = this.meta.cache;
        i.width = t || 0, i.height = e || 0, this._resize(i.width, i.height)
    },
    _resize: function() {
        var t = this.meta.cache.width,
            e = this.meta.cache.height,
            i = 0,
            s = 0;
        if (this._container === document.body ? (i = window.innerWidth, s = window.innerHeight) : (i = this.container.clientWidth, s = this.container.clientHeight), 0 === t && (t = i), 0 === e && (e = s), this._adapt) {
            this.zoom = 1;
            var n = i - t,
                o = s - e;
            o > n ? this.zoom = i / t : this.zoom = s / e, t *= this.zoom, e *= this.zoom
        }
        if (t = Math.round(t), e = Math.round(e), this.width !== t || this.height !== e || this._center) {
            var h = 1;
            this.width = Math.ceil(t * h), this.height = Math.ceil(e * h), this.canvas.width = this.width, this.canvas.height = this.height, this.canvas.style.width = t * this.scaleX + "px", this.canvas.style.height = e * this.scaleY + "px", this._center && (this.canvas.style.left = Math.floor(.5 * (window.innerWidth - t)) + "px", this.canvas.style.top = Math.floor(.5 * (window.innerHeight - e)) + "px"), this.ctx.imageSmoothingEnabled ? this.ctx.imageSmoothingEnabled = meta.cache.imageSmoothing : this.ctx[meta.device.vendor + "ImageSmoothingEnabled"] = meta.cache.imageSmoothing, this._updateOffset(), this.onResize.emit(this, meta.Event.RESIZE), meta.renderer.needRender = !0
        }
    },
    scale: function(t, e) {
        this.scaleX = t || 1, this.scaleY = e || this.scaleX, this._resize(this.meta.cache.width, this.meta.cache.height)
    },
    handleFocus: function(t) {
        this.focus !== t && (this.focus = t, this.enablePauseOnBlur && (this.pause = !t), t ? this.onFocus.emit(t, meta.Event.FOCUS) : this.onBlur.emit(t, meta.Event.BLUR))
    },
    handleVisibilityChange: function() {
        document[meta.device.hidden] ? this.handleFocus(!1) : this.handleFocus(!0)
    },
    onFullScreenChangeCB: function() {
        var t = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
        meta.device.fullscreen = !!t, this.onFullscreen.emit(meta.device.fullscreen, meta.Event.FULLSCREEN)
    },
    onCtxLost: function() {
        console.log("(Context lost)")
    },
    onCtxRestored: function() {
        console.log("(Context restored)")
    },
    _addMetaTags: function() {
        if (!this.metaTagsAdded) {
            var t = document.createElement("meta");
            t.setAttribute("http-equiv", "Content-Type"), t.setAttribute("content", "text/html; charset=utf-8"), document.head.appendChild(t);
            var e = document.createElement("meta");
            e.setAttribute("http-equiv", "encoding"), e.setAttribute("content", "utf-8"), document.head.appendChild(e);
            var i = "user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height",
                s = document.createElement("meta");
            s.setAttribute("name", "viewport"), s.setAttribute("content", i), document.head.appendChild(s);
            var n = document.createElement("meta");
            n.setAttribute("name", "apple-mobile-web-app-capable"), n.setAttribute("content", "yes"), document.head.appendChild(n);
            var o = document.createElement("meta");
            o.setAttribute("name", "apple-mobile-web-app-status-bar-style"), o.setAttribute("content", "black-translucent"), document.head.appendChild(o), this.metaTagsAdded = !0
        }
    },
    _createRenderer: function() {
        this.canvas = document.createElement("canvas"), this.canvas.setAttribute("id", "meta-canvas"), this.canvas.style.cssText = this.canvasStyle;
        var t = this.meta.cache.container;
        t ? t.appendChild(this.canvas) : document.body.appendChild(this.canvas), meta.renderer = new meta.CanvasRenderer
    },
    _updateOffset: function() {
        this.offsetLeft = 0, this.offsetTop = 0;
        var t = this._container;
        if (t.offsetParent)
            do this.offsetLeft += t.offsetLeft, this.offsetTop += t.offsetTop; while (t = t.offsetParent);
        var e = this._container.getBoundingClientRect();
        this.offsetLeft += e.left, this.offsetTop += e.top, e = this.canvas.getBoundingClientRect(), this.offsetLeft += e.left, this.offsetTop += e.top
    },
    _printInfo: function() {
        meta.device.support.consoleCSS ? (console.log("%c META v" + meta.version + " ", "background: #000; color: white; font-size: 12px; padding: 2px 0 1px 0;", "http://meta2d.com"), console.log("%cBrowser: %c" + meta.device.name + " " + meta.device.version + "	", "font-weight: bold; padding: 2px 0 1px 0;", "padding: 2px 0 1px 0;"), console.log("%cRenderer: %cCanvas ", "font-weight: bold; padding: 2px 0 2px 0;", "padding: 2px 0 2px 0;")) : (console.log("META v" + meta.version + " http://meta2d.com "), console.log("Browser: " + meta.device.name + " " + meta.device.version + "	"), console.log("Renderer: Canvas "))
    },
    fullscreen: function(t) {
        var e = meta.device;
        if (e.fullscreen !== t)
            if (t) {
                if (!e.support.fullScreen) return console.warn("(meta.engine.fullscreen): Device does not support fullscreen mode"), void 0;
                console.log(e.fullScreenRequest), document.documentElement[e.fullScreenRequest](Element.ALLOW_KEYBOARD_INPUT)
            } else console.log("exit"), document[meta.device.fullScreenExit]()
    },
    toggleFullscreen: function() {
        this.fullscreen(!meta.device.fullscreen)
    },
    set container(t) {
        this._container !== t && (this._container && this._container.removeChild(this.canvas), t ? this._container = t : this._container = document.body, this._container.appendChild(this.canvas), this.updateResolution())
    },
    get container() {
        return this._container
    },
    set imageSmoothing(t) {
        meta.cache.imageSmoothing = t, this.inited && this.updateResolution()
    },
    get imageSmoothing() {
        return meta.cache.imageSmoothing
    },
    set cursor(t) {
        this._container.style.cursor = t
    },
    get cursor() {
        return this._container.style.cursor
    },
    set center(t) {
        this._center = t, this.updateResolution()
    },
    get center() {
        return this._center
    },
    set adapt(t) {
        this._adapt = t, this.updateResolution()
    },
    get adapt() {
        return this._adapt
    },
    Flag: {
        LOADED: 4,
        READY: 8
    },
    onResize: null,
    onBlur: null,
    onFocus: null,
    onFullscreen: null,
    onDebug: null,
    elementStyle: "padding:0; margin:0;",
    canvasStyle: "position:absolute; overflow:hidden; translateZ(0); -webkit-backface-visibility:hidden; -webkit-perspective: 1000; -webkit-touch-callout: none; -webkit-user-select: none; zoom: 1;",
    meta: meta,
    time: meta.time,
    _container: null,
    width: 0,
    height: 0,
    offsetLeft: 0,
    offsetTop: 0,
    scaleX: 1,
    scaleY: 1,
    zoom: 1,
    ratio: 1,
    canvas: null,
    ctx: null,
    cb: null,
    autoInit: !0,
    autoMetaTags: !0,
    flags: 0,
    inited: !1,
    loading: !1,
    loaded: !1,
    ready: !1,
    focus: !1,
    pause: !1,
    webgl: !1,
    _center: !1,
    _adapt: !1,
    _updateLoop: null,
    _renderLoop: null,
    updateFuncs: [],
    renderFuncs: [],
    plugins: [],
    controllersReady: [],
    controllersUpdate: [],
    timers: [],
    timersRemove: [],
    fps: 0,
    _fpsCounter: 0,
    enablePauseOnBlur: !0,
    enableAdaptive: !0,
    unitSize: 1,
    unitRatio: 1,
    maxUnitSize: 1,
    maxUnitRatio: 1
}, "use strict", meta.Device = function() {
    this.name = "unknown", this.version = "0", this.versionBuffer = null, this.vendors = ["", "webkit", "moz", "ms", "o"], this.vendor = "", this.support = {}, this.audioFormats = [], this.mobile = !1, this.isPortrait = !1, this.audioAPI = !1, this.hidden = null, this.visibilityChange = null, this.fullScreenRequest = null, this.fullScreenExit = null, this.fullScreenOnChange = null, this.fullscreen = !1, this.load()
}, meta.Device.prototype = {
    load: function() {
        this.checkBrowser(), this.mobile = this.isMobileAgent(), this.checkConsoleCSS(), this.support.onloadedmetadata = "object" == typeof window.onloadedmetadata, this.support.onkeyup = "object" == typeof window.onkeyup, this.support.onkeydown = "object" == typeof window.onkeydown, this.support.canvas = this.isCanvasSupport(), this.support.webgl = this.isWebGLSupport(), this.modernize()
    },
    checkBrowser: function() {
        var t = {
                Chrome: [/Chrome\/(\S+)/],
                Firefox: [/Firefox\/(\S+)/],
                MSIE: [/MSIE (\S+);/],
                Opera: [/OPR\/(\S+)/, /Opera\/.*?Version\/(\S+)/, /Opera\/(\S+)/],
                Safari: [/Version\/(\S+).*?Safari\//]
            },
            e = navigator.userAgent,
            i, s, n, o = 2;
        for (i in t)
            for (; s = t[i].shift();)
                if (n = e.match(s)) {
                    this.version = n[1].match(new RegExp("[^.]+(?:.[^.]+){0," + --o + "}"))[0], this.name = i, this.versionBuffer = this.version.split(".");
                    for (var h = this.versionBuffer.length, a = 0; h > a; a++) this.versionBuffer[a] = parseInt(this.versionBuffer[a]);
                    break
                }
        null === this.versionBuffer || "unknown" === this.name ? console.warn("(meta.Device.checkBrowser) Could not detect browser.") : "Chrome" === this.name || "Safari" === this.name || "Opera" === this.name ? this.vendor = "webkit" : "Firefox" === this.name ? this.vendor = "moz" : "MSIE" === this.name && (this.vendor = "ms")
    },
    checkConsoleCSS: function() {
        this.mobile || "Chrome" !== this.name && "Opera" !== this.name ? this.support.consoleCSS = !1 : this.support.consoleCSS = !0
    },
    modernize: function() {
        Number.MAX_SAFE_INTEGER || (Number.MAX_SAFE_INTEGER = 9007199254740991), this.supportConsole(), this.supportPageVisibility(), this.supportFullScreen(), this.supportRequestAnimFrame(), this.supportPerformanceNow(), this.supportAudioFormats(), this.supportAudioAPI()
    },
    isMobileAgent: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    },
    isCanvasSupport: function() {
        return !!window.CanvasRenderingContext2D
    },
    isWebGLSupport: function() {
        var t = document.createElement("canvas"),
            e = t.getContext("webgl") || t.getContext("experimental-webgl");
        return !!e
    },
    supportConsole: function() {
        window.console || (window.console = {}, window.console.log = meta.emptyFuncParam, window.console.warn = meta.emptyFuncParam, window.console.error = meta.emptyFuncParam)
    },
    supportPageVisibility: function() {
        void 0 !== document.hidden ? (this.hidden = "hidden", this.visibilityChange = "visibilitychange") : void 0 !== document.hidden ? (this.hidden = "webkitHidden", this.visibilityChange = "webkitvisibilitychange") : void 0 !== document.hidden ? (this.hidden = "mozhidden", this.visibilityChange = "mozvisibilitychange") : void 0 !== document.hidden && (this.hidden = "mshidden", this.visibilityChange = "msvisibilitychange")
    },
    supportFullScreen: function() {
        this._fullScreenRequest(), this._fullScreenExit(), this._fullScreenOnChange(), this.support.fullScreen = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled || document.msFullscreenEnabled
    },
    _fullScreenRequest: function() {
        var t = document.documentElement;
        void 0 !== t.requestFullscreen ? this.fullScreenRequest = "requestFullscreen" : void 0 !== t.webkitRequestFullscreen ? this.fullScreenRequest = "webkitRequestFullscreen" : void 0 !== t.mozRequestFullScreen ? this.fullScreenRequest = "mozRequestFullScreen" : void 0 !== t.msRequestFullscreen && (this.fullScreenRequest = "msRequestFullscreen")
    },
    _fullScreenExit: function() {
        void 0 !== document.exitFullscreen ? this.fullScreenExit = "exitFullscreen" : void 0 !== document.webkitExitFullscreen ? this.fullScreenExit = "webkitExitFullscreen" : void 0 !== document.mozCancelFullScreen ? this.fullScreenExit = "mozCancelFullScreen" : void 0 !== document.msExitFullscreen && (this.fullScreenExit = "msExitFullscreen")
    },
    _fullScreenOnChange: function() {
        void 0 !== document.onfullscreenchange ? this.fullScreenOnChange = "fullscreenchange" : void 0 !== document.onwebkitfullscreenchange ? this.fullScreenOnChange = "webkitfullscreenchange" : void 0 !== document.onmozfullscreenchange ? this.fullScreenOnChange = "mozfullscreenchange" : void 0 !== document.onmsfullscreenchange && (this.fullScreenOnChange = "msfullscreenchange")
    },
    supportRequestAnimFrame: function() {
        window.requestAnimationFrame || (window.requestAnimationFrame = function() {
            return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(t, e) {
                window.setTimeout(t, 1e3 / 60)
            }
        }())
    },
    supportPerformanceNow: function() {
        void 0 === window.performance && (window.performance = {}), void 0 === window.performance.now && (window.performance.now = Date.now)
    },
    supportAudioFormats: function() {
        var t = document.createElement("audio");
        "" != t.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/i, "") && this.audioFormats.push("m4a"), t.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, "") && this.audioFormats.push("ogg"), t.canPlayType("audio/mpeg;").replace(/no/, "") && this.audioFormats.push("mp3"), t.canPlayType('audio/wav; codecs="1"').replace(/no/, "") && this.audioFormats.push("wav")
    },
    supportAudioAPI: function() {
        window.AudioContext || (window.AudioContext = window.webkitAudioContext || window.mozAudioContext || window.oAudioContext || window.msAudioContext), window.AudioContext && (this.audioAPI = !0)
    }
}, meta.device = new meta.Device, "use strict", meta.device.mobile && (window.onerror = function(t, e, i) {
    alert(e + ": " + i + " " + t)
}), "use strict", meta.emptyFunc = function() {}, meta.emptyFuncParam = function(t) {}, meta.loadTexture = function(t, e, i) {
    meta._preloadResource("Texture", t, e, i) || console.warn("(meta.preloadTexture) Unsupported parameter was passed.")
}, meta.loadSound = function(t, e, i) {
    meta._preloadResource("Sound", t, e, i) || console.warn("(meta.loadSound) Unsupported parameter was passed.")
}, meta.loadSpriteSheet = function(t, e, i) {
    meta._preloadResource("SpriteSheet", t, e, i) || console.warn("(meta.loadSpriteSheet) Unsupported parameter was passed.")
}, meta.loadFont = function(t, e, i) {
    meta._preloadResource("Font", t, e, i) || console.warn("(meta.loadFont) Unsupported parameter was passed.")
}, meta._preloadResource = function(t, e, i, s) {
    if (i) {
        var n = i.lastIndexOf("/");
        n !== i.length - 1 && (i += "/")
    } else i = "";
    if (e instanceof Array)
        for (var o = e.length, h = 0; o > h; h++) meta._addResource(t, e[h], i, s);
    else {
        if ("object" != typeof e && "string" != typeof e) return !1;
        meta._addResource(t, e, i, s)
    }
    return !0
}, meta._addResource = function(t, e, i, s) {
    var n;
    return "object" == typeof e ? (e.path && (e.path = i + e.path), n = new Resource[t](e, s)) : n = new Resource[t](i + e, s), n
}, meta.loadFile = function(t, e) {
    t instanceof File || console.warn("(meta.loadFile) Invalid file has been passed.");
    var i = new Resource.Texture(t, e);
    return i
}, meta.onDomLoad = function(t) {
    if ("interactive" === document.readyState || "complete" === document.readyState) return t(), void 0;
    var e = function(i) {
        t(), window.removeEventListener("DOMContentLoaded", e)
    };
    window.addEventListener("DOMContentLoaded", e)
}, meta.enumToString = function(t, e) {
    if (void 0 === t) return "unknown";
    for (var i in t)
        if (t[i] === e) return i;
    return "unknown"
}, meta.hexToRgb = function(t) {
    t.length < 6 && (t += t.substr(1, 4));
    var e = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
    return {
        r: parseInt(e[1], 16),
        g: parseInt(e[2], 16),
        b: parseInt(e[3], 16)
    }
}, meta.isUrl = function(t) {
    return -1 !== t.indexOf("http://") || -1 !== t.indexOf("https://") ? !0 : !1
}, meta.toUpperFirstChar = function(t) {
    return t.charAt(0).toUpperCase() + t.slice(1)
}, meta.serialize = function(t) {
    var e = [];
    for (var i in t) e.push(encodeURIComponent(i) + "=" + encodeURIComponent(t[i]));
    return e.join("&")
}, meta.info = function(t) {
    var e = new Entity.Text(t);
    e.anchor(.5), e.pivot(.5);
    var i = new Resource.SVG;
    i.fillStyle = "black", i.fillRect(0, 0, e.width + 10, e.height + 10);
    var s = new Entity.Geometry(i);
    s.z = 999999, s.pivot(.5), s.anchor(.5, 0), s.position(0, 20), s.attach(e), s.static = !0, meta.view.attach(s)
}, meta.adaptTo = function(t, e, i) {
    if (meta.engine && meta.engine.isInited) return console.warn("[meta.adaptTo]:", "Only usable before engine is initialized."), void 0;
    var s = meta.cache.resolutions;
    s || (s = [], meta.cache.resolutions = s);
    var n = i.charAt(i.length - 1);
    "/" !== n && (i += "/");
    var o = {
        width: t,
        height: e,
        path: i,
        unitSize: 1,
        zoomThreshold: 1
    };
    s.push(o)
}, meta.removeFromArray = function(t, e) {
    for (var i = e.length, s = 0; i > s; s++)
        if (t === e[s]) {
            e[s] = e[i - 1], e.pop();
            break
        }
}, meta.shuffleArray = function(t) {
    for (var e = meta.random, i = t.length, s, n; i;) n = e.number(0, --i), s = t[i], t[i] = t[n], t[n] = s;
    return t
}, meta.shuffleArrayRange = function(t, e, i) {
    for (var i = i || 0, s = meta.random, n, o; e > i;) o = s.number(0, --e), n = t[e], t[e] = t[o], t[o] = n;
    return t
}, meta.rotateArray = function(t) {
    for (var e = t[0], i = t.length - 1, s = 0; i > s; s++) t[s] = t[s + 1];
    t[i] = e
}, meta.nextPowerOfTwo = function(t) {
    return t--, t |= t >> 1, t |= t >> 2, t |= t >> 4, t |= t >> 8, t |= t >> 16, t++, t
}, meta.toHex = function(t) {
    var e = t.toString(16);
    return 1 == e.length ? "0" + e : e
}, meta.rgbToHex = function(t, e, i) {
    return "#" + ((1 << 24) + (t << 16) + (e << 8) + i).toString(16).slice(1)
}, "use strict", meta.Channel = function(t) {
    this.name = t, this.subs = [], this.numSubs = 0, this._emitting = !1, this._subsToRemove = null
}, meta.Channel.prototype = {
    emit: function(t, e) {
        this._emitting = !0;
        for (var i, s = 0; s < this.numSubs; s++) i = this.subs[s], i.func.call(i.owner, t, e);
        if (this._emitting = !1, this._subsToRemove) {
            for (var n = this._subsToRemove.length, o = 0; n > o; o++) this.remove(this._subsToRemove[o]);
            this._subsToRemove = null
        }
    },
    add: function(t, e, i) {
        if (i = i || 0, !t) return console.warn("(meta.Channel.subscribe) No callback function passed."), void 0;
        for (var s = 0; s < this.numSubs; s++)
            if (this.subs[s].owner === e) return console.warn("(meta.Channel.subscribe) Already subscribed to channel: " + this.name), void 0;
        var n = new meta.Subscriber(e, t, i);
        this.subs.push(n), this.numSubs++, i ? (this._havePriority = !0, this.subs.sort(this._sortFunc)) : this._havePriority && this.subs.sort(this._sortFunc)
    },
    remove: function(t) {
		if(t == null || t == undefined){
			meta.channels[this.name] = null
		}else{
			if (this._emitting) return this._subsToRemove || (this._subsToRemove = []), this._subsToRemove.push(t), void 0;
			for (var e, i = 0; i < this.numSubs; i++)
				if (e = this.subs[i], e.owner === t) {
					this.subs[i] = this.subs[this.numSubs - 1], this.subs.pop(), this.numSubs--;
					break
				}
			this._havePriority && this.subs.sort(this._sortFunc)
		}
    },
    removeAll: function() {
        this.subs = [], this.numSubs = 0
    },
    _sortFunc: function(t, e) {
        return t.priority > e.priority ? -1 : 1
    },
    _havePriority: !1
}, meta.Subscriber = function(t, e, i) {
    this.owner = t, this.func = e, this.priority = i
}, meta.createChannel = function(t) {
    if (!t) return console.warn("(meta.createChannel) No name was specified!"), null;
    var e = meta.channels[t];
    return e || (e = new meta.Channel(t), meta.channels[t] = e), e
}, meta.releaseChannel = function(t) {
    return t ? (meta.channels[t] && (meta.channels[t] = null), void 0) : (console.warn("(meta.releaseChannel) No name was specified!"), void 0)
}, meta.subscribe = function(t, e, i, s) {
    if ("object" != typeof i) return console.warn("(meta.subscribe) No owner passed."), void 0;
    if (!e) return console.warn("(meta.subscribe) No callback function passed."), void 0;
    if ("string" != typeof t) {
        if ("[object Array]" === Object.prototype.toString.call(t)) {
            for (var n = t.length, o = 0; n > o; o++) meta.subscribe(t[o], e, i, s);
            return
        }
        return console.warn("(meta.subscribe) Wrong type for channel object: " + typeof t), void 0
    }
    var h = meta.channels[t];
    if (h) t = h;
    else if (t = meta.createChannel(t), !t) return;
    t.add(e, i, s)
}, meta.unsubscribe = function(t, e) {
    if ("string" != typeof t) {
        if ("[object Array]" === Object.prototype.toString.call(t)) {
            for (var i = t.length, s = 0; i > s; s++) meta.unsubscribe(t[s], e);
            return
        }
        return console.warn("(meta.unsubscribe) Wrong type for channel object."), void 0
    }
    return t = meta.channels[t], t ? (t.remove(e), void 0) : (console.warn("(meta.unsubscribe) No name was specified!"), void 0)
}, meta.emit = function(t, e, i) {
    return "string" != typeof t || (t = meta.channels[t], t) ? (t.emit(e, i), void 0) : (console.warn("(meta.emit) No name was specified!"), void 0)
}, "use strict", meta.View = function(t) {
    this.name = t, this.entities = [], this.views = null, this.parentView = null, this._x = 0, this._y = 0, this._z = 0, this._tween = null, this.flags |= this.Flag.CHILD_VISIBLE
}, meta.View.prototype = {
    remove: function() {
        if ("master" === this.name) return console.warn("(meta.View.remove) Master view can't be removed"), void 0;
        if (this.parentView && this.parentView.detachView(this), this.views)
            for (var t = this.views.length, e = 0; t > e; e++) this.views[e].remove();
        this.visible = !1, this._unregisterFromEngine();
        for (var i, s = this.entities.length, n = 0; s > n; n++) i = this.entities[n], i._view = null, i.remove();
        this.entities.length = 0
    },
    attach: function(t) {
        return t instanceof Entity.Geometry ? t.removed ? (console.warn("(meta.View.add) Removed entity can not be added to the view."), void 0) : t._view ? (t._view === this ? console.warn("(meta.View.attach) Entity is already added to this view.") : console.warn("(meta.View.attach) Entity is already added to some other view."), void 0) : (t._view = this, t._viewNodeID = this.entities.length, (0 !== this._x || 0 !== this._y) && t.updatePos(), 0 !== this._z && t.updateZ(), this.flags & this.Flag.STATIC && (t.static = !0), this._attachChildren(t.children), this.entities.push(t), this.flags & this.Flag.VISIBLE && meta.renderer.addEntity(t, !1), void 0) : (console.warn("(meta.View.attach) Trying to add invalid entity"), void 0)
    },
    _attachChildren: function(t) {
        if (t)
            for (var e, i = t.length, s = 0; i > s; s++) e = t[s], e.removed || (e._view = this, this._attachChildren(e.children))
    },
    detach: function(t) {
        if (!t.isRemoved) {
            if (!t._view) return console.warn("(meta.View.detach) Entity does not have view."), void 0;
            if (t._view !== this) return console.warn("(meta.View.detach) Entity is part of other view: " + t.view.name), void 0;
            if (t._parent !== t._entityCtrl) return console.warn("(meta.View.detach) Entity children are not part of view."), void 0;
            t.isRemoved = !0, t.removeCore(), this.numEntities--;
            var e = this.entities[this.numEntities];
            e.core.viewIndex = this.numEntities, this.entities[this.numEntities] = e, this.entities.pop(), this.flags & this.Flag.VISIBLE && meta.renderer.removeEntities(t)
        }
    },
    attachView: function(t) {
        if (!t) return this.parentView ? (console.warn("(meta.View.attach) No view was passed."), void 0) : (meta.cache.view.attachView(this), void 0);
        if ("string" == typeof t) {
            var e = meta.cache.views[t];
            if (!e) return console.warn("(meta.View.attach) No such view found: " + t), void 0;
            t = e
        } else if (!(t instanceof meta.View)) return console.warn("(meta.View.attach) Trying to attach invalid view object."), void 0;
        return t.parentView ? (console.warn("(meta.View.attach) View is already part of other view."), void 0) : (this.views || (this.views = []), this.views.push(t), t.parentView = this, this.flags & this.Flag.VISIBLE && t._parentVisible(!0), void 0)
    },
    detachView: function(t) {
        if (!t) return this.parentView ? (this.parentView.detachView(this), void 0) : (console.warn("(meta.View.detachView) No view was passed."), void 0);
        if ("string" == typeof t) {
            var e = meta.cache.views[t];
            if (!e) return console.warn('(meta.View.detachView) No such view found: "' + t + '"'), void 0;
            t = e
        }
        if (!t.parentView) return console.warn("(meta.View.detachView) View has not parents to detach from"), void 0;
        if (t.parentView !== this) return console.warn("(meta.View.detachView) Detaching from wrong parent"), void 0;
        for (var i = this.views.length, s = 0; i > s; s++)
            if (this.views[s] === t) {
                this.views[s] = this.views[i - 1], this.views.pop();
                break
            }
        t.parentView = null, this.flags & this.Flag.CHILD_VISIBLE && t._parentVisible(!1)
    },
    detachViews: function() {
        if (this.views) {
            for (var t, e = this.views.length, i = 0; e > i; i++) t = this.views[i], t.parentView = null, t.flags & this.Flag.CHILD_VISIBLE && t._parentVisible(!1);
            this.views.length = 0
        }
    },
    _updateVisible: function() {
        var t = !1;
        if (this.flags & this.Flag.CHILD_VISIBLE && this.flags & this.Flag.PARENT_VISIBLE) {
            if (this.flags & this.Flag.VISIBLE) return;
            this.flags |= this.Flag.VISIBLE, t = !0, this.entities.length && meta.renderer.addEntities(this.entities)
        } else {
            if (0 === (this.flags & this.Flag.VISIBLE)) return;
            this.flags &= ~this.Flag.VISIBLE, t = !1, this.entities.length && meta.renderer.removeEntities(this.entities)
        }
        if (this.views)
            for (var e = this.views.length, i = 0; e > i; i++) this.views[i]._parentVisible(t)
    },
    _parentVisible: function(t) {
        t ? this.flags |= this.Flag.PARENT_VISIBLE : this.flags &= ~this.Flag.PARENT_VISIBLE,
            this._updateVisible()
    },
    set visible(t) {
        t ? this.flags |= this.Flag.CHILD_VISIBLE : this.flags &= ~this.Flag.CHILD_VISIBLE, this._updateVisible()
    },
    get visible() {
        return (this.flags & this.Flag.CHILD_VISIBLE) === this.Flag.CHILD_VISIBLE
    },
    set x(t) {
        if (this._x !== t) {
            this._x = t;
            for (var e = this.entities.length, i = 0; e > i; i++) this.entities[i].updatePos()
        }
    },
    set y(t) {
        if (this._y !== t) {
            this._y = t;
            for (var e = this.entities.length, i = 0; e > i; i++) this.entities[i].updatePos()
        }
    },
    set z(t) {
        this._z = t;
        for (var e = this.entities.length, i = 0; e > i; i++) this.entities[i].updateZ()
    },
    get x() {
        return this._x
    },
    get y() {
        return this._y
    },
    get z() {
        return this._z
    },
    get tween() {
        return this._tween || (this._tween = new meta.Tween(this)), this._tween
    },
    set static(t) {
        if (t) {
            if (this.flags & this.Flag.STATIC) return;
            this.flags |= this.Flag.STATIC
        } else {
            if (0 === (this.flags & this.Flag.STATIC)) return;
            this.flags &= ~this.Flag.STATIC
        }
        for (var e = this.entities.length, i = 0; e > i; i++) this.entities[i].static = t
    },
    get static() {
        return (this.flags & this.Flag.STATIC) === this.Flag.STATIC
    },
    Flag: {
        VISIBLE: 1,
        CHILD_VISIBLE: 2,
        PARENT_VISIBLE: 4,
        STATIC: 8
    },
    entitiesUI: null
}, meta.createView = function(t) {
    if (!t || "string" != typeof t) return console.error("(meta.createView) Invalid name of the view"), void 0;
    var e = meta.cache.views[t];
    return e ? (console.error("(meta.createView) View with a name - " + t + ", already exist"), void 0) : (e = new meta.View(t), meta.cache.views[t] = e, e)
}, meta.setView = function(t) {
    if (!t) return console.error("(meta.setView) No view passed"), void 0;
    var e = meta.cache;
    if ("string" == typeof t) {
        var i = t;
        t = e.views[i], t || (console.warn("(meta.setView) Creating an empty view, could be unintended - " + i), t = new meta.View(i), e.views[i] = t)
    }
    var s = e.view;
    return t === s ? (console.warn("(meta.setView) Cannot modify master view"), void 0) : t.parentView ? (console.warn("(meta.setView) View is already attached to master or other view"), void 0) : (e.view.detachViews(), e.view.attachView(t), void 0)
}, meta.getView = function(t) {
    if (!t) return console.error("(meta.getView) No name specified"), null;
    var e = meta.cache.views[t];
    return e || (e = new meta.View(t), meta.cache.views[t] = e), e
}, meta.attachView = function(t) {
    var e = meta.cache;
    if ("string" == typeof t) {
        var i = e.views[t];
        if (!i) return console.warn("(meta.attachView) No such view found: " + t), void 0;
        t = i
    }
    return t.parentView ? (console.warn("(meta.attachView) View already has parent attached"), void 0) : (e.view.attachView(t), void 0)
}, meta.detachView = function(t) {
    var e = meta.cache;
    if ("string" == typeof t) {
        var i = e.views[t];
        if (!t) return console.warn("(meta.detachView) No such view found: " + t), void 0;
        t = i
    }
    return t.parentView ? (e.view.detachView(t), void 0) : (console.warn("(meta.detachView) View does not have parent attached"), void 0)
}, Object.defineProperty(meta, "view", {
    set: function(t) {
        meta.setView(t)
    },
    get: function() {
        return meta.cache.view
    }
}), "use strict", meta.Camera = function() {
    this.volume = new meta.math.AABBext(0, 0, 0, 0), this.zoomBounds = null, this._wasResized = !1, this._autoZoom = !1, this._zoom = 1, this.prevZoom = 1, this.zoomRatio = 1, this._draggable = !1, this._dragging = !1, this._moved = !1, this._center = !1, this._centerX = !0, this._centerY = !0, this._worldBounds = !1, this._followEntity = null, this.onResize = meta.createChannel(meta.Event.CAMERA_RESIZE), this.onMove = meta.createChannel(meta.Event.CAMERA_MOVE), this.init()
}, meta.Camera.prototype = {
    init: function() {
        meta.engine.onResize.add(this._onResize, this), meta.subscribe(meta.Event.WORLD_RESIZE, this._onWorldResize, this), this.zoomBounds = {
            width: -1,
            height: -1,
            minWidth: -1,
            minHeight: -1,
            maxWidth: -1,
            maxHeight: -1
        }
    },
    release: function() {
        this.onMove.release(), meta.engine.onResize.remove(this), meta.world.onResize.remove(this)
    },
    update: function(t) {
        if (this._followEntity) {
            var e = this._followEntity.volume,
                i = Math.floor(e.x) - Math.floor(this.volume.width / 2),
                s = Math.floor(e.y) - Math.floor(this.volume.height / 2);
            this.position(i, s)
        }
    },
    updateView: function() {
        this._autoZoom ? this.updateAutoZoom() : this.updateZoom();
        var t = meta.world;
        if (!this._moved) {
            var e = 0,
                i = 0;
            this._center ? (e = this._centerX ? Math.floor((this.volume.width - t.width) / 2) : 0, i = this._centerY ? Math.floor((this.volume.height - t.height) / 2) : 0) : (e = 0, i = 0), this.volume.move(e, i)
        }
        this._wasResized && (this.onResize.emit(this, meta.Event.CAMERA_RESIZE), this._wasResized = !1), this.onMove.emit(this, meta.Event.CAMERA_MOVE)
    },
    updateZoom: function() {
        this.prevZoom !== this._zoom && (this.zoomRatio = 1 / this._zoom, this.volume.scale(this.zoomRatio, this.zoomRatio), this._wasResized = !0)
    },
    updateAutoZoom: function() {
        var t = meta.engine,
            e = this.zoomBounds.width,
            i = this.zoomBounds.height,
            s = t.width / e,
            n = t.height / i;
        this.prevZoom = this._zoom, this._zoom = s, s > n && (this._zoom = n), t.adaptResolution() && (e = this.zoomBounds.width, i = this.zoomBounds.height, s = t.width / e, n = t.height / i, this._zoom = s, s > n && (this._zoom = n), this.volume.resize(t.width, t.height)), this.updateZoom()
    },
    bounds: function(t, e) {
        this._autoZoom = !0, this._wasResized = !0, this.zoomBounds.width = t, this.zoomBounds.height = e, (0 !== this.volume.width || 0 !== this.volume.height) && this.updateView()
    },
    minBounds: function(t, e) {
        this._autoZoom = !0, this._wasResized = !0, this.zoomBounds.minWidth = t, this.zoomBounds.minHeight = e, this.updateView()
    },
    maxBounds: function(t, e) {
        this._autoZoom = !0, this._wasResized = !0, this.zoomBounds.maxWidth = t, this.zoomBounds.maxHeight = e, this.updateView()
    },
    _onInput: function(t, e) {
        var i = Input.Event;
        if (e === i.MOVE) this._drag(t);
        else if (e === i.DOWN) {
            if (256 !== t.keyCode) return;
            this._startDrag(t)
        } else if (e === i.UP) {
            if (256 !== t.keyCode) return;
            this._endDrag(t)
        }
    },
    _onResize: function(t, e) {
        this.volume.resize(t.width, t.height), this._prevZoom = this._zoom, this._zoom = meta.engine.zoom, this._wasResized = !0, this.updateView()
    },
    _onWorldResize: function(t, e) {
        this.updateView()
    },
    _startDrag: function(t) {
        this._draggable && (this._dragging = !0)
    },
    _endDrag: function(t) {
        this._dragging = !1
    },
    _drag: function(t) {
        if (this._dragging) {
            var e = meta,
                i = (t.screenX - t.prevScreenX) * this.zoomRatio,
                s = (t.screenY - t.prevScreenY) * this.zoomRatio;
            if (this._moved = !0, this._worldBounds) {
                var n = e.world.volume,
                    o = this.volume.minX - i,
                    h = this.volume.minY - s;
                o < n.minX ? i -= n.minX - o : o + this.volume.width > n.maxX && (i = this.volume.maxX - n.maxX), h < n.minY ? s -= n.minY - h : h + this.volume.height > n.maxY && (s = this.volume.maxY - n.maxY)
            }
            this.volume.move(-i, -s), this.onMove.emit(this, e.Event.CAMERA_MOVE), e.renderer.needRender = !0
        }
    },
    position: function(t, e) {
        (this.volume.x !== t || this.volume.y !== e) && (this.volume.position(t, e), this._moved = !0, this.updateView())
    },
    follow: function(t) {
        return t instanceof Entity.Geometry ? (this._followEntity = t, void 0) : (console.warn("(meta.Camera.follow): Invalid entity - should be part of Entity.Geometry"), void 0)
    },
    set x(t) {
        this.volume.x !== t && (this.volume.position(t, this.volume.y), this._moved = !0, this.updateView())
    },
    set y(t) {
        this.volume.y !== t && (this.volume.position(this.volume.x, t), this._moved = !0, this.updateView())
    },
    get x() {
        return this.volume.x
    },
    get y() {
        return this.volume.y
    },
    get width() {
        return this.volume.width
    },
    get height() {
        return this.volume.height
    },
    set zoom(t) {
        this._zoom !== t && (this.prevZoom = this._zoom, this._zoom = t, this.updateView())
    },
    get zoom() {
        return this._zoom
    },
    set enableBorderIgnore(t) {
        this._enableBorderIgnore = t, this.updateView()
    },
    get enableBorderIgnore() {
        return this._enableBorderIgnore
    },
    set draggable(t) {
        if (this._draggable !== t) {
            this._draggable = t;
            var e = [Input.Event.DOWN, Input.Event.UP, Input.Event.MOVE];
            t ? meta.subscribe(e, this._onInput, this) : (meta.unsubscribe(e, this), this._dragging = !1)
        }
    },
    get draggable() {
        return this._draggable
    },
    set autoZoom(t) {
        this._autoZoom !== t && (this._autoZoom = t, this._wasResized = !0, this.updateView())
    },
    get autoZoom() {
        return this._autoZoom
    },
    set worldBounds(t) {
        this._worldBounds !== t && (this._worldBounds = t, this._wasResized = !0, this.updateView())
    },
    get worldBounds() {
        return this._worldBounds
    },
    set center(t) {
        this._center = t, this.updateView()
    },
    set centerX(t) {
        this._centerX = t, this.updateView()
    },
    set centerY(t) {
        this._centerY = t, this.updateView()
    },
    get center() {
        return this._center
    },
    get centerX() {
        return this._centerX
    },
    get centerY() {
        return this._centerY
    }
}, "use strict", meta.class("meta.World", {
    init: function(t, e) {
        this.volume = new meta.math.AABB(0, 0, 0, 0), this.onResize = meta.createChannel(meta.Event.WORLD_RESIZE), meta.camera.onResize.add(this._updateBounds, this)
    },
    bounds: function(t, e, i, s) {
        this.volume.set(t, e, i - t, s - e), this.centerX = t + (i - t) / 2, this.centerY = e + (s - e) / 2, this._adapt = !1
    },
    _updateBounds: function(t, e) {
        this._adapt && (this.volume.set(0, 0, Math.ceil(t.width), Math.ceil(t.height)), this.centerX = t.width / 2, this.centerY = t.height / 2)
    },
    addWorldShape: function(t) {
        this.shapes ? this.shapes.push(t) : this.shapes = [t]
    },
    removeWorldShape: function(t) {
        for (var e = this.shapes.length, i = 0; e > i; i++)
            if (this.shapes[i] === t) {
                this.shapes[i] = this.shapes[e - 1], this.shapes.pop();
                break
            }
    },
    get randX() {
        return meta.random.number(this.volume.minX, this.volume.maxX)
    },
    get randY() {
        return meta.random.number(this.volume.minY, this.volume.maxY)
    },
    set adapt(t) {
        this._adapt = t, t && this._updateBounds(meta.camera, 0)
    },
    get adapt() {
        return this._adapt
    },
    get width() {
        return this.volume.width
    },
    get height() {
        return this.volume.height
    },
    onResize: null,
    volume: null,
    centerX: 0,
    centerY: 0,
    shapes: null,
    _adapt: !0,
    _screenBounds: !0
}), "use strict", meta.class("meta.Controller", {
    init: function() {
        this.view = meta.createView(this.__lastName__), this.onInit && this.onInit()
    },
    onInit: null,
    load: function() {
        this.flags & this.Flag.LOADED || (0 === (this.flags & this.Flag.FIRST_LOADED) && (this.onFirstLoad && this.onFirstLoad(), this.flags |= this.Flag.FIRST_LOADED), this.onLoad && this.onLoad(), meta.engine.controllersReady.push(this), meta.cache.view.attachView(this.view), this.flags |= this.Flag.LOADED)
    },
    unload: function() {
        if (0 !== (this.flags & this.Flag.LOADED)) {
            if (this.onUnload && this.onUnload(), this.onUpdate)
                for (var t = meta.engine.controllersUpdate, e = t.length, i = 0; e > i; i++)
                    if (t[i] === this) {
                        t.splice(i, 1);
                        break
                    }
            meta.cache.view.detachView(this.view), this.flags &= ~(this.Flag.LOADED | this.Flag.READY)
        }
    },
    onFirstLoad: null,
    onLoad: null,
    onUnload: null,
    onFirstReady: null,
    onReady: null,
    ready: function() {
        this.flags & this.Flag.READY || (0 === (this.flags & this.Flag.FIRST_READY) && (this.onFirstReady && this.onFirstReady(), this.flags |= this.Flag.FIRST_READY), this.onReady && this.onReady(), this.onUpdate && meta.engine.controllersUpdate.push(this), this.flags |= this.Flag.READY)
    },
    onUpdate: null,
    Flag: {
        LOADED: 1,
        READY: 2,
        FIRST_LOADED: 4,
        FIRST_READY: 8
    },
    name: "",
    view: null,
    flags: 0
}), meta.classes = {}, meta.controller = function(t, e, i) {
    i || ("object" == typeof e ? (i = e, e = "meta.Controller") : i = null), e || (e = "meta.Controller"), meta.class("meta.constrollers." + t, e, i, _addClassInstance)
}, meta.plugin = function(t, e, i) {
    meta.class("meta.plugins." + t, e, i, _addClassInstance)
}, meta.controller("Test", {}), "use strict", meta.Timer = function(t, e, i, s) {
    this.owner = t, this.id = meta.cache.timerIndex++, this.func = e, this.onRemove = null, this.tDelta = i, this.numTimes = s, void 0 === this.numTimes && (this.numTimes = -1), this.initNumTimes = this.numTimes, this.tAccumulator = 0, this.tStart = Date.now(), this.__index = -1
}, meta.Timer.prototype = {
    play: function() {
        -1 === this.__index && (this.__index = meta.engine.timers.push(this) - 1)
    },
    stop: function() {
        -1 !== this.__index && (meta.engine.timersRemove.push(this), this.__index = -1)
    },
    pause: function() {
        this.paused = !0
    },
    resume: function() {
        this.paused = !1, this.tStart = Date.now()
    },
    reset: function() {
        this.tAccumulator = 0, this.numTimes = this.initNumTimes, this.paused = !1, this.play()
    },
    onRemove: null,
    paused: !1
}, meta.createTimer = function(t, e, i, s) {
    if ("function" == typeof t && (s = i, i = e, e = t, t = window), !e) return console.warn("(meta.addTimer) Invalid function passed"), void 0;
    var n = new meta.Timer(t, e, i, s);
    return n
}, meta.addTimer = function(t, e, i, s) {
    var n = meta.createTimer(t, e, i, s);
    return n.play(), n
}, "use strict", meta.Event = {
    RESIZE: "resize",
    WORLD_RESIZE: "world-resize",
    CAMERA_MOVE: "camera-move",
    CAMERA_RESIZE: "camera-resize",
    BLUR: "blur",
    FOCUS: "focus",
    FULLSCREEN: "fullscreen",
    ADAPT: "adapt",
    DEBUG: "debug"
}, meta.Priority = {
    LOW: 0,
    MEDIUM: 5e3,
    HIGH: 1e4
}, meta.Cursor = {
    ALIAS: "alias",
    ALL_SCROLL: "all-scroll",
    CELL: "cell",
    CONTEXT_MENU: "context-menu",
    COL_RESIZE: "col-resize",
    COPY: "copy",
    CROSSHAIR: "crosshair",
    DEFAULT: "default",
    E_RESIZE: "e-resize",
    EW_RESIZE: "ew-resize",
    GRAB: "grab",
    GRABBING: "grabbing",
    HELP: "help",
    MOVE: "move",
    N_RESIZE: "n-resize",
    NE_RESIZE: "ne-resize",
    NESW_RESIZE: "nesw-resize",
    NS_RESIZE: "ns-reisize",
    NW_RESIZE: "nw-resize",
    NWSE_RESIZE: "nwse-resize",
    NO_DROP: "no-drop",
    NONE: "none",
    NOT_ALLOWED: "not-allowed",
    POINTER: "pointer",
    PROGRESS: "progress",
    ROW_RESIZE: "row-resize",
    S_RESIZE: "s-resize",
    SE_RESIZE: "se-resize",
    SW_RESIZE: "sw-resize",
    TEXT: "text",
    VERTICAL_TEXT: "vertical-text",
    W_RESIZE: "w-resize",
    WAIT: "wait",
    ZOOM_IN: "zoom-in",
    ZOOM_OUT: "zoom-out",
    INITIAL: "initial"
}, "use strict", "use strict", meta.ajax = function(params) {
    "html" === params.dataType ? params.responseType = "document" : "script" === params.dataType || "json" === params.dataType ? params.responseType = "text" : void 0 === params.dataType ? params.responseType = "GET" : params.responseType = params.dataType, void 0 === params.type && (params.type = "GET");
    var data = meta.serialize(params.data),
        xhr = new XMLHttpRequest;
    return xhr.open(params.type, params.url, !0), xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), xhr.onload = function() {
        4 === xhr.readyState && 200 === xhr.status ? void 0 !== params.success && ("document" === params.responseType ? params.success(xhr.responseXML) : "script" === params.dataType ? params.success(eval(xhr.responseText)) : "json" === params.dataType ? params.success(JSON.parse(xhr.responseText)) : params.success(xhr.responseText)) : void 0 !== params.error && params.error()
    }, xhr.send(data), xhr
}, "use strict", meta.Tokenizer = function() {
    this.currChar = 0, this.buffer = null, this.bufferLength = 0, this.cursor = 0, this.token = {
        type: 0,
        str: "",
        value: 0,
        line: 0
    }
}, meta.Tokenizer.prototype = {
    setup: function(t) {
        this.buffer = t, this.bufferLength = t.length, this.cursor = 0
    },
    nextToken: function() {
        for (this.token.type = 0, this.token.str = "", this.token.value = 0, this.nextChar(); isSpace(this.currChar);) this.nextChar();
        if (isAlpha(this.currChar)) {
            for (this.token.str += this.currChar, this.nextChar(); isAlphaNum(this.currChar);) this.token.str += this.currChar, this.nextChar();
            switch (this.cursor--, this.token.str) {
                case "true":
                    this.token.type = this.Type.BOOL, this.token.value = 1;
                    break;
                case "false":
                    this.token.type = this.Type.BOOL;
                    break;
                case "NaN":
                    this.token.type = this.Type.NUMBER, this.token.value = NaN;
                    break;
                default:
                    this.token.type = this.Type.NAME
            }
            return this.token
        }
        if (isDigit(this.currChar)) {
            for (this.token.str += this.currChar, this.nextChar(); isDigit(this.currChar);) this.token.str += this.currChar, this.nextChar();
            return this.cursor--, "." === this.token.str ? (this.token.type = this.Type.SYMBOL, this.token.value = this.token.str, this.token) : (this.token.type = this.Type.NUMBER, this.token.value = parseFloat(this.token.str), this.token)
        }
        if (isBinOp(this.currChar)) return this.token.str = this.currChar, this.token.type = this.Type.BINOP, this.token;
        if ('"' === this.currChar || "'" === this.currChar) {
            var t = this.currChar;
            this.nextChar();
            for (var e = this.peekChar();;) {
                if (this.currChar === t) {
                    this.currChar === e && (this.token.str += this.currChar, this.nextChar());
                    break
                }
                if ("\x00" === this.currChar) return this.token.type = this.Type.EOF, this.token;
                this.token.str += this.currChar, this.nextChar()
            }
            return this.token.type = this.Type.STRING, this.token
        }
        return "\x00" === this.currChar ? (this.token.type = this.Type.EOF, this.token) : (this.token.type = this.Type.SYMBOL, this.token.str = this.currChar, this.token)
    },
    nextChar: function() {
        this.currChar = this.peekChar(), this.cursor++, ("\n" === this.currChar || "\x00" === this.currChar) && this.token.line++
    },
    peekChar: function() {
        return this.cursor >= this.bufferLength ? "\x00" : this.buffer.charAt(this.cursor)
    },
    Type: {
        EOF: 0,
        NUMBER: 1,
        BOOL: 2,
        NAME: 3,
        STRING: 4,
        BINOP: 5,
        SYMBOL: 6
    }
}, meta.tokenizer = new meta.Tokenizer, "use strict", meta.math = {}, meta.math = {
    degToRad: function(t) {
        return t * Math.PI / 180
    },
    radToDeg: function(t) {
        return 180 * t / Math.PI
    },
    radiansToPoint: function(t, e, i, s) {
        var n = i - t,
            o = s - e;
        return Math.atan(n / o)
    },
    clamp: function(t, e, i) {
        return e > t ? e : t > i ? i : t
    },
    map: function(t, e, i, s, n) {
        return t == e ? s : (t - e) * (n - s) / (i - e) + s
    },
    length: function(t, e, i, s) {
        var n = i - t,
            o = s - e;
        return Math.sqrt(n * n + o * o)
    },
    length2: function(t, e) {
        return Math.sqrt(t * t + e * e)
    },
    limit: function(t, e) {
        return t > e ? e : -e > t ? -e : t
    },
    lerp: function(t, e, i) {
        return t + (e - t) * i
    },
    lookAt: function(t, e, i, s) {
        return Math.atan2(i - t, e - s)
    },
    lookAtEntity: function(t, e) {
        return meta.math.lookAt(t.x, t.y, e.x, e.y)
    },
    VolumeType: {
        AABB: 0,
        CIRCLE: 1,
        SEGMENT: 2
    }
}, "use strict", meta.math.Vector2 = function(t, e) {
    this.x = t, this.y = e
}, meta.math.Vector2.prototype = {
    reset: function() {
        this.x = 0, this.y = 0
    },
    set: function(t, e) {
        this.x = t, this.y = e
    },
    add: function(t) {
        this.x += t, this.y += t
    },
    sub: function(t) {
        this.x -= t, this.y -= t
    },
    mul: function(t) {
        this.x *= t, this.y *= t
    },
    div: function(t) {
        this.x /= t, this.y /= t
    },
    addVec2: function(t) {
        this.x += t.x, this.y += t.y
    },
    subVec2: function(t) {
        this.x -= t.x, this.y -= t.y
    },
    mulVec2: function(t) {
        this.x *= t.x, this.y *= t.y
    },
    divVec2: function(t) {
        this.x /= t.x, this.y /= t.y
    },
    length: function() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    },
    normalize: function() {
        var t = Math.sqrt(this.x * this.x + this.y * this.y);
        t > 0 ? (this.x /= t, this.y /= t) : (this.x = 0, this.y = 0)
    },
    dot: function(t) {
        return this.x * t.x + this.y * t.y
    },
    truncate: function(t) {
        var e = Math.sqrt(this.x * this.x + this.y * this.y);
        e > t && (this.x *= t / e, this.y *= t / e)
    },
    limit: function(t) {
        this.x > t ? this.x = t : this.x < -t && (this.x = -t), this.y > t ? this.y = t : this.y < -t && (this.y = -t)
    },
    clamp: function(t, e, i, s) {
        this.x = Math.min(Math.max(this.x, t), i), this.y = Math.min(Math.max(this.y, e), s)
    },
    lengthSq: function() {
        return this.x * this.x + this.y * this.y
    },
    heading: function() {
        var t = Math.atan2(-this.y, this.x);
        return -t + .5 * Math.PI
    },
    perp: function() {
        var t = this.x;
        this.x = -this.y, this.y = t
    },
    reflect: function(t) {
        var e = this.dot(t);
        this.x -= 2 * e * t.x, this.y -= 2 * e * t.y
    },
    print: function(t) {
        t ? console.log('[vec "' + t + '"] x: ' + this.x + " y: " + this.y) : console.log("[vec] x: " + this.x + " y: " + this.y)
    }
}, "use strict", meta.math.AABB = function(t, e, i, s) {
    this.x = t || 0, this.y = e || 0, this.width = i || 0, this.height = s || 0, this.halfWidth = this.width / 2, this.halfHeight = this.height / 2, this.pivotPosX = this.width * this.pivotX, this.pivotPosY = this.height * this.pivotY, this.minX = this.x, this.minY = this.y, this.maxX = this.x + this.width, this.maxY = this.y + this.height
}, meta.math.AABB.prototype = {
    set: function(t, e, i, s) {
        this.x = t || 0, this.y = e || 0, this.width = i || 0, this.height = s || 0, this.halfWidth = this.width / 2, this.halfHeight = this.height / 2, this.pivotPosX = this.width * this.pivotX, this.pivotPosY = this.height * this.pivotY, this.minX = this.x, this.minY = this.y, this.maxX = this.x + this.width, this.maxY = this.y + this.height
    },
    position: function(t, e) {
        this.x = t, this.y = e, this.minX = this.x - this.pivotPosX, this.minY = this.y - this.pivotPosY, this.maxX = this.minX + this.width, this.maxY = this.minY + this.height
    },
    move: function(t, e) {
        this.x += t, this.y += e, this.minX += t, this.minY += e, this.maxX += t, this.maxY += e
    },
    resize: function(t, e) {
        this.width = t, this.height = e, this.halfWidth = t / 2, this.halfHeight = e / 2, this.pivotPosX = this.width * this.pivotX, this.pivotPosY = this.height * this.pivotY, this.minX = this.x - this.pivotPosX, this.minY = this.y - this.pivotPosY, this.maxX = this.minX + this.width, this.maxY = this.minY + this.height
    },
    pivot: function(t, e) {
        void 0 === e && (e = t), this.pivotX = t, this.pivotY = e, this.pivotPosX = this.width * this.pivotX, this.pivotPosY = this.height * this.pivotY, this.minX = this.x - this.pivotPosX, this.minY = this.y - this.pivotPosY, this.maxX = this.minX + this.width, this.maxY = this.minY + this.height
    },
    vsAABB: function(t) {
        return this.maxX < t.minX || this.minX > t.maxX ? !1 : this.maxY < t.minY || this.minY > t.maxY ? !1 : !0
    },
    vsBorderAABB: function(t) {
        return this.maxX <= t.minX || this.minX >= t.maxX ? !1 : this.maxY <= t.minY || this.minY >= t.maxY ? !1 : !0
    },
    vsAABBIntersection: function(t) {
        return this.maxX < t.minX || this.minX > t.maxX ? 0 : this.maxY < t.minY || this.minY > t.maxY ? 0 : this.minX > t.minX || this.minY > t.minY ? 1 : this.maxX < t.maxX || this.maxY < t.maxY ? 1 : 2
    },
    vsPoint: function(t, e) {
        return this.minX > t || this.maxX < t ? !1 : this.minY > e || this.maxY < e ? !1 : !0
    },
    vsBorderPoint: function(t, e) {
        return this.minX >= t || this.maxX <= t ? !1 : this.minY >= e || this.maxY <= e ? !1 : !0
    },
    getSqrDistance: function(t, e) {
        var i, s = 0;
        return t < this.minX && (i = this.minX - t, s += i * i), t > this.maxX && (i = t - this.maxX, s += i * i), e < this.minY && (i = this.minY - e, s += i * i), e > this.maxY && (i = e - this.maxY, s += i * i), s
    },
    getDistanceVsAABB: function(t) {
        var e = this.minX + (this.maxX - this.minX) / 2,
            i = this.minY + (this.maxY - this.minY) / 2,
            s = t.minX + (t.maxY - t.minY) / 2,
            n = t.minY + (t.maxY - t.minY) / 2,
            o = s - e,
            h = n - i;
        return Math.sqrt(o * o + h * h)
    },
    isUndefined: function() {
        return void 0 === this.maxY
    },
    genCircle: function() {
        var t = this.maxX - this.minX,
            e = this.maxY - this.minY,
            i;
        return i = t > e ? t / 2 : e / 2, new meta.math.Circle(this.x, this.y, i)
    },
    print: function(t) {
        t ? console.log("(AABB) " + t + " minX: " + this.minX + " minY: " + this.minY + " maxX: " + this.maxX + " maxY: " + this.maxY) : console.log("(AABB) minX: " + this.minX + " minY: " + this.minY + " maxX: " + this.maxX + " maxY: " + this.maxY)
    },
    pivotX: 0,
    pivotY: 0,
    type: meta.math.VolumeType.AABB
}, "use strict", meta.math.AABBext = function() {
    this.x = 0, this.y = 0, this.width = 0, this.height = 0, this.halfWidth = 0, this.halfHeight = 0, this.initWidth = 0, this.initHeight = 0, this.minX = 0, this.minY = 0, this.maxX = 0, this.maxY = 0
}, meta.math.AABBext.prototype = {
    position: function(t, e) {
        this.x = t, this.y = e, this.minX = this.x - this.pivotPosX, this.minY = this.y - this.pivotPosY, this.maxX = this.minX + this.width, this.maxY = this.minY + this.height
    },
    move: function(t, e) {
        this.x += t, this.y += e, this.minX += t, this.minY += e, this.maxX += t, this.maxY += e
    },
    updatePos: function() {
        this.minX = this.x - this.pivotPosX, this.minY = this.y - this.pivotPosY, this.maxX = this.minX + this.width, this.maxY = this.minY + this.height
    },
    pivot: function(t, e) {
        void 0 === e && (e = t), this.pivotX = t, this.pivotY = e, this.initPivotPosX = this.initWidth * this.pivotX | 0, this.initPivotPosY = this.initHeight * this.pivotY | 0, this.updatePivotPos()
    },
    updatePivotPos: function() {
        this.scaleX > 0 ? this.pivotPosX = this.pivotX * this.width : this.pivotPosX = (1 - this.pivotX) * this.width, this.scaleY > 0 ? this.pivotPosY = this.pivotY * this.height : this.pivotPosY = (1 - this.pivotY) * this.height, this.minX = this.x - this.pivotPosX, this.minY = this.y - this.pivotPosY, this.maxX = this.minX + this.width, this.maxY = this.minY + this.height
    },
    resize: function(t, e) {
        this.initWidth = t, this.initHeight = e, this.initPivotPosX = t * this.pivotX | 0, this.initPivotPosY = e * this.pivotY | 0, this.width = t * Math.abs(this.scaleX) | 0, this.height = e * Math.abs(this.scaleY) | 0, this.halfWidth = this.width / 2, this.halfHeight = this.height / 2, this.updatePivotPos()
    },
    scale: function(t, e) {
        this.scaleX = t * this.flipX, this.scaleY = e * this.flipY, this.width = Math.floor(this.initWidth * t), this.height = Math.floor(this.initHeight * e), this.halfWidth = this.width / 2, this.halfHeight = this.height / 2, this.updatePosTransform()
    },
    flip: function(t, e) {
        void 0 === t ? (this.flipX = -this.flipX, this.scaleX *= -1) : this.flipX !== t && (this.flipX = t, this.scaleX *= -1), void 0 === e || this.flipY !== e && (this.flipY = e, this.scaleY *= -1), this.updatePosTransform()
    },
    rotate: function(t) {
        this.angle = t, this.sin = Math.sin(t), this.cos = Math.cos(t), this.m11 = this.cos * this.scaleX, this.m12 = this.sin * this.scaleX, this.m21 = -this.sin * this.scaleY, this.m22 = this.cos * this.scaleY, this.__transformed = 1
    },
    updatePosTransform: function() {
        this.scaleX > 0 ? this.pivotPosX = this.pivotX * this.width : this.pivotPosX = (1 - this.pivotX) * this.width, this.scaleY > 0 ? this.pivotPosY = this.pivotY * this.height : this.pivotPosY = (1 - this.pivotY) * this.height, this.minX = this.x - this.pivotPosX, this.minY = this.y - this.pivotPosY, this.maxX = this.minX + this.width, this.maxY = this.minY + this.height, this.m11 = this.cos * this.scaleX, this.m12 = this.sin * this.scaleX, this.m21 = -this.sin * this.scaleY, this.m22 = this.cos * this.scaleY, this.__transformed = 1
    },
    vsAABB: function(t) {
        return this.maxX <= t.minX || this.minX >= t.maxX ? !1 : this.maxY <= t.minY || this.minY >= t.maxY ? !1 : !0
    },
    vsAABBIntersection: function(t) {
        return this.maxX < t.minX || this.minX > t.maxX ? 0 : this.maxY < t.minY || this.minY > t.maxY ? 0 : this.minX >= t.minX || this.minY >= t.minY ? 1 : this.maxX <= t.maxX || this.maxY <= t.maxY ? 1 : 2
    },
    vsPoint: function(t, e) {
        return this.minX >= t || this.maxX <= t ? !1 : this.minY >= e || this.maxY <= e ? !1 : !0
    },
    getSqrDistance: function(t, e) {
        var i, s = 0;
        return t < this.minX && (i = this.minX - t, s += i * i), t > this.maxX && (i = t - this.maxX, s += i * i), e < this.minY && (i = this.minY - e, s += i * i), e > this.maxY && (i = e - this.maxY, s += i * i), s
    },
    getDistanceVsAABB: function(t) {
        var e = this.minX + (this.maxX - this.minX) / 2,
            i = this.minY + (this.maxY - this.minY) / 2,
            s = t.minX + (t.maxY - t.minY) / 2,
            n = t.minY + (t.maxY - t.minY) / 2,
            o = s - e,
            h = n - i;
        return Math.sqrt(o * o + h * h)
    },
    genCircle: function() {
        var t = this.maxX - this.minX,
            e = this.maxY - this.minY,
            i;
        return i = t > e ? t / 2 : e / 2, new meta.math.Circle(this.x, this.y, i)
    },
    print: function(t) {
        t ? console.log("(Volume) " + t + " minX: " + this.minX + " minY: " + this.minY + " maxX: " + this.maxX + " maxY: " + this.maxY) : console.log("(Volume) minX: " + this.minX + " minY: " + this.minY + " maxX: " + this.maxX + " maxY: " + this.maxY)
    },
    pivotX: 0,
    pivotY: 0,
    pivotPosX: 0,
    pivotPosY: 0,
    initPivotPosX: 0,
    initPivotPosY: 0,
    anchorPosX: 0,
    anchorPosY: 0,
    scaleX: 1,
    scaleY: 1,
    flipX: 1,
    flipY: 1,
    angle: 0,
    sin: 0,
    cos: 1,
    m11: 1,
    m12: 0,
    m21: 0,
    m22: 1,
    __transformed: 0,
    type: meta.math.VolumeType.AABB
}, "use strict", meta.math.Circle = function(t, e, i) {
    this.x = t, this.y = e, this.radius = i, this.minX = t - i, this.minY = e - i, this.maxX = t + i, this.maxY = e + i
}, meta.math.Circle.prototype = {
    position: function(t, e) {
        this.x = t, this.y = e, this.minX = t - this.radius, this.minY = e - this.radius, this.maxX = t + this.radius, this.maxY = e + this.radius
    },
    move: function(t, e) {
        this.x += t, this.y += e, this.minX += t, this.minY += e, this.maxX += t, this.maxY += e
    },
    vsPoint: function(t, e) {
        return 2 * (this.x - t) + 2 * (this.y - e) <= 2 * radius
    },
    vsAABB: function(t) {},
    vsCircle: function(t) {
        var e = t.x - this.x,
            i = t.y - this.y,
            s = this.radius + t.radius;
        return s * s > e * e + i * i ? !0 : !1
    },
    overlapCircle: function(t) {
        var e = Math.sqrt((this.x - t.x) * (this.y - t.y));
        return e > this.radius + t.radius ? 0 : e <= Math.abs(this.radius + t.radius) ? 1 : 2
    },
    genAABB: function() {
        return new meta.math.AABB(this.x - this.radius, this.y - this.radius, this.x + this.radius, this.y + this.radius)
    },
    print: function(t) {
        t ? console.log("[" + t + "] x:", this.x, "y:", this.y, "raidus:", this.radius) : console.log("x:", this.x, "y:", this.y, "raidus:", this.radius)
    },
    type: meta.math.VolumeType.CIRCLE
}, "use strict", meta.math.Matrix4 = function() {
    this.m = new Float32Array(16), this.m[0] = 1, this.m[5] = 1, this.m[10] = 1, this.m[15] = 1
}, meta.math.Matrix4.prototype = {
    reset: function() {
        this.m[0] = 1, this.m[1] = 0, this.m[2] = 0, this.m[3] = 0, this.m[4] = 0, this.m[5] = 1, this.m[6] = 0, this.m[7] = 0, this.m[8] = 0, this.m[9] = 0, this.m[10] = 1, this.m[11] = 0, this.m[12] = 0, this.m[13] = 0, this.m[14] = 0, this.m[15] = 1
    },
    scale: function(t, e, i) {
        this.m[0] = t, this.m[5] = e, this.m[10] = i
    },
    ortho: function(t, e, i, s, n, o) {
        this.m[0] = 2 / (e - t), this.m[1] = 0, this.m[2] = 0, this.m[3] = 0, this.m[4] = 0, this.m[5] = 2 / (s - i), this.m[6] = 0, this.m[7] = 0, this.m[8] = 0, this.m[9] = 0, this.m[10] = -2 / (o - n), this.m[11] = 0, this.m[12] = -(e + t) / (e - t), this.m[13] = -(s + i) / (s - i), this.m[14] = -(o + n) / (o - n), this.m[15] = 1
    }
}, "use strict", meta.math.Random = function() {
    this.seed = 0, this.a = 0, this.m = 0, this.q = 0, this.r = 0, this.oneOverM = 0, this.init()
}, meta.math.Random.prototype = {
    init: function() {
        this.setSeed(3456789012, !0)
    },
    generate: function() {
        var t = Math.floor(this.seed / this.q),
            e = this.seed % this.q,
            i = this.a * e - this.r * t;
        return i > 0 ? this.seed = i : this.seed = i + this.m, this.seed * this.oneOverM
    },
    number: function(t, e) {
        var i = this.generate();
        return Math.round((e - t) * i + t)
    },
    numberF: function(t, e) {
        var i = this.generate();
        return (e - t) * i + t
    },
    setSeed: function(t, e) {
        if (void 0 !== e && (e = !0), e === !0) {
            var i = new Date;
            this.seed = t + 16777215 * i.getSeconds() + 65535 * i.getMinutes()
        } else this.seed = t;
        this.a = 48271, this.m = 2147483647, this.q = Math.floor(this.m / this.a), this.r = this.m % this.a, this.oneOverM = 1 / this.m
    }
}, meta.random = new meta.math.Random, "use strict";
var Resource = {};
Resource.Event = {
    FAILED: "res-failed",
    UNLOADED: "res-unloaded",
    LOADED: "res-loaded",
    RESIZE: "res-resize",
    CHANGED: "res-changed",
    ADDED: "res-added",
    LOADING_START: "res-loading-started",
    LOADING_END: "res-loading-ended",
    LOADING_UPDATE: "red-loadig-update"
}, Resource.Type = {
    BASIC: 0,
    TEXTURE: 1,
    SOUND: 2,
    SPRITE_SHEET: 3,
    FONT: 4
}, Resource.TextureType = {
    UNKNOWN: -1,
    CANVAS: 0,
    WEBGL: 1
}, "use strict", meta.class("Resource.Manager", {
    init: function() {
        this.onAdded = meta.createChannel(Resource.Event.ADDED), this.onLoaded = meta.createChannel(Resource.Event.LOADED), this.onLoadingStart = meta.createChannel(Resource.Event.LOADING_START), this.onLoadingEnd = meta.createChannel(Resource.Event.LOADING_END), this.onLoadingUpdate = meta.createChannel(Resource.Event.LOADING_UPDATE), meta.audio = new Resource.AudioManager;
        var t = this;
        this._xhr = new XMLHttpRequest, this._xhr.onreadystatechange = function() {
            t._loadFileStateChange()
        }, meta.engine.onAdapt.add(this.onAdapt, this)
    },
    add: function(t) {
        if (!(t.flags & t.Flag.ADDED)) {
            t.flags |= t.Flag.ADDED;
            var e = this.resources[t.type];
            e || (e = {}, this.resources[t.type] = e);
            var i = t.path;
            if ("unknown" === t.name && i) {
                var s = i.lastIndexOf("."),
                    n = i.lastIndexOf("/");
                0 > s || i.length - s > 5 ? t.name = t.tag + i.slice(n + 1) : t.name = t.tag + i.slice(n + 1, s)
            }
            return e[t.name] ? (console.warn("(Resource.Manager.add) There is already a resource(" + meta.enumToString(Resource.Type, t.type) + ") added with a name: " + t.name), null) : (e[t.name] = t, this.onAdded.emit(t, Resource.Event.ADDED), t)
        }
    },
    remove: function(t) {
        var e = this.resources[t.type];
        return e && e[t.name] ? (e[t.name] = null, void 0) : (console.warn("(Resource.Manager.remove) Resource(" + meta.enumToString(Resource.Type, t.type) + ")(" + t.name + ") is not added to the manager."), void 0)
    },
    _updateLoading: function() {
        this.numToLoad--, this.onLoadingUpdate.emit(this, Resource.Event.LOADING_UPDATE), 0 === this.numToLoad && (this.numTotalToLoad = 0, this.loading = !1, this.onLoadingEnd.emit(this, Resource.Event.LOADING_END))
    },
    loadFile: function(t, e) {
        this.loading || (this.loading = !0, this.onLoadingStart.emit(this, Resource.Event.LOADING_START)), this.numToLoad++, this.numTotalToLoad++, this._xhrOnSuccess = e, this._xhr.open("GET", t, !0), this._xhr.send()
    },
    _loadFileStateChange: function() {
        4 === this._xhr.readyState && (200 === this._xhr.status && this._xhrOnSuccess && this._xhrOnSuccess(this._xhr.response), this._updateLoading())
    },
    addToLoad: function(t) {
        this.loading || (this.loading = !0, this.onLoadingStart.emit(this, Resource.Event.LOADING_START)), this.add(t), t.loading = !0, t.currStep = 0, this.numToLoad += t.steps, this.numTotalToLoad += t.steps
    },
    loadSuccess: function(t) {
        var e = this.resourcesInUse[t.type];
        e || (e = [], this.resourcesInUse[t.type] = e), t.currStep++, this.numLoaded++, t.loading = !1, t.inUse = !0, e.push(t), this.onLoaded.emit(t, Resource.Event.LOADED), this._updateLoading()
    },
    loadFailed: function(t) {
        this.numLoaded += t.steps - t.currStep, this._updateLoading(), t.loading = !1
    },
    nextStep: function(t) {
        t.currStep < t.steps && (t.currStep++, this.numLoaded++, this._updateLoading())
    },
    getResource: function(t, e) {
        var i = this.resources[e];
        if (!i) return null;
        var s = i[t];
        return s ? s : null
    },
    getTexture: function(t) {
        var e = this.resources[Resource.Type.TEXTURE];
        if (!e) return null;
        var i = e[t];
        return i ? i : null
    },
    getSound: function(t) {
        if (!t) return console.warn("[Resource.Manager.getSound]:", "No name specified."), null;
        var e = this.resources[Resource.Type.SOUND];
        if (!e) return null;
        var i = e[t];
        return i ? i : null
    },
    addToQueue: function(t) {
        this._syncQueue || (this._syncQueue = []), this._syncQueue.push(t)
    },
    loadNextFromQueue: function() {
        this.isSyncLoading = !1, this._syncQueue && this._syncQueue.length && (this._syncQueue[this._syncQueue.length - 1].forceLoad(!0), this._syncQueue.pop())
    },
    onAdapt: function(t, e) {
        var i = meta.unitRatio,
            s, n = this.resources[Resource.Type.TEXTURE];
        for (var o in n) s = n[o], s.unitRatio = i, s.load()
    },
    getUniqueID: function() {
        return ++this._uniqueID
    },
    _xhr: null,
    _xhrOnSuccess: null,
    resources: {},
    resourcesInUse: {},
    rootPath: "",
    numLoaded: 0,
    numToLoad: 0,
    numTotalToLoad: 0,
    _syncQueue: null,
    isSyncLoading: !1,
    _uniqueID: 0,
    loading: !1,
    onAdded: null,
    onLoaded: null,
    onLoadingStart: null,
    onLoadingEnd: null,
    onLoadingUpdate: null
}), "use strict", meta.class("Resource.AudioManager", {
    init: function() {
        var t = Resource.Sound.prototype;
        meta.device.audioAPI && meta.flags.audioAPI ? (this.context = new AudioContext, this.gainNode = this.context.createGain(), this.gainNode.connect(this.context.destination), this.gainNode.gain.value = this._volume, t._context = this.context, t._loadFromPath = t._loadFromPath_WebAudio, t._createInstance = t._createInstance_WebAudio, t.steps = 2, meta.device.support.consoleCSS ? console.log("%cAudio: %cWebAudio ", "font-weight: bold; padding: 2px 0 2px 0;", "padding: 2px 0 2px 0;") : console.log("Audio: WebAudio")) : (t._loadFromPath = t._loadFromPath_Audio, t._createInstance = t._createInstance_Audio, t._syncLoading = !0, meta.device.support.consoleCSS ? console.log("%cAudio: %c<audio> ", "font-weight: bold; padding: 2px 0 1px 0; width: 500px;", "padding: 2px 0 1px 0;") : console.log("Audio: <audio>"))
    },
    set volume(t) {
        if (this._volume = meta.math.clamp(t, 0, 1), !this._mute)
            if (meta.device.audioAPI) this.gainNode.gain.value = this._volume;
            else {
                var e = meta.resources.resources[Resource.Type.SOUND];
                for (var i in e) e[i].volume = this._volume
            }
    },
    get volume() {
        return this._volume
    },
    set mute(t) {
        if (this._mute !== t) {
            this._mute = t;
            var e;
            if (e = t ? 0 : this._volume, meta.device.audioAPI) this.gainNode.gain.value = e;
            else {
                var i = meta.resources.resources[Resource.Type.SOUND];
                for (var s in i) i[s].volume = e
            }
        }
    },
    get mute() {
        return this._mute
    },
    context: null,
    gainNode: null,
    _volume: .5,
    _mute: !1
}), "use strict", meta.class("Resource.Basic", {
    init: function(t, e) {
        this.id = meta.resources.getUniqueID(), e && (this.tag = e), this.onInit && this.onInit(t, e)
    },
    onInit: null,
    subscribe: function(t, e) {
        this.chn || (this.chn = meta.createChannel("__res" + this.id)), this.chn.add(t, e)
    },
    unsubscribe: function(t) {
        this.chn && (this.chn.remove(t), 0 === this.chn.numSubs && (this.chn.remove(), this.chn = null))
    },
    emit: function(t, e) {
        this.chn && this.chn.emit(t, e)
    },
    set loaded(t) {
        t ? this._loaded ? (this._loaded = t, this.emit(this, Resource.Event.CHANGED)) : (this._loaded = t, this.emit(this, Resource.Event.LOADED)) : this._loaded && (this._loaded = t, this.emit(this, Resource.Event.UNLOADED))
    },
    get loaded() {
        return this._loaded
    },
    Flag: {
        ADDED: 8
    },
    id: 0,
    flags: 0,
    type: Resource.Type.BASIC,
    name: "unknown",
    path: "",
    fullPath: "",
    tag: "",
    chn: null,
    _loaded: !1,
    loading: !1,
    used: !1,
    steps: 1,
    currStep: 0
}), "use strict", meta.class("Resource.Texture", "Resource.Basic", {
    onInit: function(t, e) {
        if (this.generate(), t instanceof File) this.loadFile(t);
        else {
            var i = typeof t;
            if ("string" === i) this.load(t);
            else if ("object" === i) {
                for (var s in t) this[s] = t[s];
                t.frames ? this.animated = !0 : (this.framesX > 1 || this.framesY > 1) && (this.frames = this.framesX * this.framesY, this.animated = !0), this.path && this.load(this.path)
            }
        }
    },
    remove: function() {},
    generate: function() {
        this.loaded = !0, this.canvas = document.createElement("canvas"), this.canvas.width = this.trueFullWidth, this.canvas.height = this.trueFullHeight, this.ctx = this.canvas.getContext("2d")
    },
    load: function(t) {
        if (!this.loading && (this.loaded = !1, t)) {
            this.path = t;
            var e = this.path.lastIndexOf(".");
            (-1 === e || this.path.length - e > 4) && (this.path += ".png"), meta.cache.currResolution ? this.fullPath = meta.resources.rootPath + meta.cache.currResolution.path + this.path : this.fullPath = meta.resources.rootPath + this.path;
            var i = this,
                s = new Image;
            s.onload = function() {
                return s.complete ? (i.createFromImg(s), meta.resources.loadSuccess(i), void 0) : (console.warn("(Resource.Texture.load) Could not load texture from - " + s.src), meta.resources.loadFailed(i), void 0)
            }, s.onerror = function(t) {
                meta.resources.loadFailed(i), i.emit(this, Resource.Event.FAILED)
            }, s.src = this.fullPath, meta.resources.addToLoad(this)
        }
    },
    loadFile: function(t) {
        if (!this.loading) {
            this.loaded = !1, this.path = window.URL.createObjectURL(t), this.fullPath = this.path;
            var e = this,
                i = new Image;
            i.onload = function() {
                return i.complete ? (e.createFromImg(i), meta.resources.loadSuccess(e), window.URL.revokeObjectURL(e.path), console.log(e.name), void 0) : (console.warn("(Resource.Texture.load) Could not load texture from - " + i.src), meta.resources.loadFailed(e), void 0)
            }, i.onerror = function(t) {
                meta.resources.loadFailed(e), e.emit(this, Resource.Event.FAILED)
            }, i.src = this.fullPath, meta.resources.addToLoad(this)
        }
    },
    createFromImg: function(t) {
        this._loaded && this.clear(), this.resizeSilently(t.width, t.height), this.ctx.drawImage(t, 0, 0), this.unitRatio = meta.unitRatio, this._reloading = !1, this.loaded = !0
    },
    _createCachedImg: function() {
        this._cachedImg || (this._cachedImg = document.createElement("canvas"), this._cachedImg.width = this.trueFullWidth, this._cachedImg.height = this.trueFullHeight, this._cachedCtx = this._cachedImg.getContext("2d"))
    },
    resize: function(t, e) {
        (this.trueFullWidth !== t || this.trueFullHeight !== e) && (this.resizeSilently(t, e), this.loaded = !0)
    },
    resizeSilently: function(t, e) {
        if (this.trueFullWidth !== t || this.trueFullHeight !== e) {
            this.flags |= this.TextureFlag.RESIZED, this.trueFullWidth = t, this.trueFullHeight = e, this.animated ? (this.trueWidth = t / this.framesX, this.trueHeight = e / this.framesY) : (this.trueWidth = t, this.trueHeight = e);
            var i = meta.engine.unitRatio;
            this.width = this.trueWidth * i + .5 | 0, this.height = this.trueHeight * i + .5 | 0, this.fullWidth = this.trueFullWidth * i + .5 | 0, this.fullHeight = this.trueFullHeight * i + .5 | 0, this.halfWidth = .5 * this.width, this.halfHeight = .5 * this.height, this._loaded && this.canvas.width > 1 && this.canvas.height > 1 ? (this._tmpImg.width = this.canvas.width, this._tmpImg.height = this.canvas.height, this._tmpCtx.drawImage(this.canvas, 0, 0), this.canvas.width = this.trueFullWidth, this.canvas.height = this.trueFullHeight, this.ctx.drawImage(this._tmpImg, 0, 0)) : (this.canvas.width = this.trueFullWidth, this.canvas.height = this.trueFullHeight)
        }
    },
    upResize: function(t, e) {
        t < this.trueFullWidth && (t = this.trueFullWidth), e < this.trueFullHeight && (e = this.trueFullHeight), this.resize(t, e)
    },
    draw: function(t, e, i) {
        this.fromAtlas ? t.drawImage(this.ptr.canvas, this._x, this._y, this.trueWidth, this.trueHeight, e, i, this.trueWidth, this.trueHeight) : t.drawImage(this.canvas, e, i)
    },
    drawFrame: function(t, e, i, s) {
        t.drawImage(this.canvas, this.trueWidth * (s % this.framesX), this.trueHeight * Math.floor(s / this.framesX), this.trueWidth, this.trueHeight, e, i, this.trueWidth, this.trueHeight)
    },
    clear: function() {
        this.ctx.clearRect(0, 0, this.trueFullWidth, this.trueFullHeight)
    },
    drawOver: function(t, e, i) {
        if (!t) return console.warn("(Resource.Texture.drawOver) No texture specified."), void 0;
        if (e = e || 0, i = i || 0, "string" == typeof t) {
            var s = meta.getTexture(t);
            if (!s) return console.warn("(Resource.Texture.drawOver) No such texture with name - " + t), void 0;
            t = s
        }
        if (t.textureType === Resource.TextureType.WEBGL) {
            if (!t._canvasCache) return t._canvasCache = new Resource.Texture(Resource.TextureType.CANVAS, t.path), t._canvasCache.load(), t = t._canvasCache, this._loadCache = {
                name: "drawOver",
                texture: t,
                x: e,
                y: i
            }, this.isLoaded = !1, t.subscribe(this.onTextureCacheEvent, this), void 0;
            t = t._canvasCache
        }
        var n = this.ctx;
        if (this.textureType && (this._createCachedImg(), n = this._cachedCtx), n.drawImage(t.image, e, i), this.textureType) {
            var o = meta.ctx;
            o.bindTexture(o.TEXTURE_2D, this.image), o.texImage2D(o.TEXTURE_2D, 0, o.RGBA, o.RGBA, o.UNSIGNED_BYTE, this._cachedImg)
        }
        this.isLoaded = !0
    },
    generateAlphaMask: function() {
        if (!this._isLoaded) return console.warn("[Resource.Texture.generateMask]:", "Texture is not loaded yet."), void 0;
        if (0 !== this.textureType) return console.warn("[Resource.Texture.generateMask]:", "Only canvas textures are supported currently."), void 0;
        var t = new Resource.Texture(Resource.TextureType.CANVAS);
        t.resize(this.trueFullWidth, this.trueFullHeight);
        for (var e = this.ctx.getImageData(0, 0, this.trueFullWidth, this.trueFullHeight), i = e.data, s = i.length, n = 0; s > n; n += 4) i[n] = 255, i[n + 1] = 255, i[n + 2] = 255;
        return t.ctx.putImageData(e, 0, 0), t.isLoaded = !0, t
    },
    onTextureCacheEvent: function(t, e) {
        e === Resource.Event.LOADED && (t.unsubscribe(this), "drawOver" === this._loadCache.name ? this.drawOver(this._loadCache.texture, this._loadCache.x, this._loadCache.y) : this[this._loadCache.name](this._loadCache.data), this._loadCache = null)
    },
    offset: function(t, e) {
        this.offsetX = t, this.offsetY = e, this._loaded && this.emit(this, Resource.Event.CHANGED)
    },
    getData: function() {
        return this.ctx.getImageData(0, 0, this.trueWidth, this.trueHeight).data
    },
    getPixelAt: function(t, e) {
        return this.ctx.getImageData(t, e, 1, 1).data
    },
    applyCanvas: function(t) {
        this.canvas = t, this.ctx = t.getContext("2d"), this.resize(t.width, t.height)
    },
    TextureFlag: {
        RESIZED: 1
    },
    type: Resource.Type.TEXTURE,
    ptr: null,
    canvas: null,
    ctx: null,
    flags: 0,
    _x: 0,
    _y: 0,
    width: 0,
    height: 0,
    _width: 0,
    _height: 0,
    fullWidth: 0,
    fullHeight: 0,
    _widthRatio: 0,
    _heightRatio: 0,
    offsetX: 0,
    offsetY: 0,
    unitRatio: 1,
    fps: 9,
    frames: 1,
    framesX: 1,
    framesY: 1,
    fromAtlas: !1,
    reloading: !1,
    _tmpImg: null,
    _tmpCtx: null,
    _cachedImg: null,
    _cachedCtx: null,
    _anim: null,
    _frames: null,
    _loadCache: null,
    _canvasCache: null
}), Resource.Texture.prototype._tmpImg = document.createElement("canvas"), Resource.Texture.prototype._tmpCtx = Resource.Texture.prototype._tmpImg.getContext("2d"), "use strict", meta.class("Resource.Sound", "Resource.Basic", {
    onInit: function(t, e) {
        this._instances = [];
        var i = this;
        meta.device.audioAPI ? (this._request = new XMLHttpRequest, this._request.responseType = "arraybuffer", this._request.onreadystatechange = function() {
            i._onStateChange()
        }, this._gainNode = meta.audio.context.createGain(), this._gainNode.connect(meta.audio.gainNode)) : (this._context = this._getInstance(), this._context.audio.addEventListener("error", function() {
            i.format ? i._onLoadFailed() : i._loadNextExtension()
        }), this._numInstancesUsed = 0), "string" == typeof t && this.load(t)
    },
    load: function(t) {
        if (!this.loading) {
            var e = t.lastIndexOf("."); - 1 !== e && t.length - e <= 5 ? (this.format = t.substr(e + 1, t.length - e - 1), this.path = meta.resources.rootPath + t.substr(0, e)) : this.path = meta.resources.rootPath + t, this.loading = !0, this.loaded = !1, meta.resources.addToLoad(this), this._loadNextExtension()
        }
    },
    _loadNextExtension: function() {
        var t, e = meta.device.audioFormats,
            i = e.length;
        if (this.format) {
            for (var s = !1, n = 0; i > n; n++)
                if (this.format === e[n]) {
                    s = !0;
                    break
                }
            if (!s) return console.log("(Resource.Sound) Trying to load unsupported sound format: " + this.format), this._onLoadFailed(), void 0;
            t = this.path + "." + this.format
        } else {
            if (this._requestFormat++, this._requestFormat > i) return this._onLoadFailed(), void 0;
            t = this.path + "." + meta.device.audioFormats[this._requestFormat - 1]
        }
        this._loadFromPath(t)
    },
    _loadFromPath: null,
    _loadFromPath_WebAudio: function(t) {
        this._request.open("GET", t, !0), this._request.send()
    },
    _loadFromPath_Audio: function(t) {
        this._context.audio.src = t, this._context.audio.load()
    },
    _onStateChange: function() {
        if (4 === this._request.readyState)
            if (200 === this._request.status) {
                meta.resources.nextStep(this);
                var t = this;
                this._context.decodeAudioData(this._request.response, function(e) {
                    t._onDecodeSuccess(e)
                }, function() {
                    t._onDecodeError()
                }), this._request = null
            } else this.format ? this._onLoadFailed() : this._loadNextExtension()
    },
    _onDecodeSuccess: function(t) {
        this.format || (this.path += "." + meta.device.audioFormats[this._requestFormat - 1]), this._buffer = t, this._loading = !1, this.loaded = !0, meta.resources.loadSuccess(this);
        for (var e, i = this._instances.length, s = 0; i > s; s++) e = this._instances[s], e.autoPlay && e.play()
    },
    _onDecodeError: function() {
        this.format || (this.path += "." + meta.device.audioFormats[this._requestFormat - 1]), console.warn("(Resource.Sound.load) Error decoding file: " + this.path), this._loading = !1, meta.resources.loadFailed(this)
    },
    _onLoadFailed: function() {
        if (!this.format) {
            var t = meta.device.audioFormats[this._requestFormat - 1];
            t && (this.path += "." + t)
        }
        console.warn("(Resource.Sound.load) Error loading file: " + this.path), this._loading = !1, meta.resources.loadFailed(this)
    },
    onEnd: null,
    play: function(t, e) {
        meta.device.audioAPI && (this._gainNode.gain.value = this._volume);
        var i = this._getInstance();
        i.play(t, e)
    },
    stop: function() {
        meta.device.audioAPI && (this._gainNode.gain.value = 0);
        for (var t = 0; t < this._numInstancesUsed; t++) this._instances[t].stop()
    },
    pause: function() {
        meta.device.audioAPI && (this._gainNode.gain.value = 0);
        for (var t = 0; t < this._numInstancesUsed; t++) this._instances[t].pause()
    },
    resume: function() {
        meta.device.audioAPI && (this._gainNode.gain.value = this._volume);
        for (var t = 0; t < this._numInstancesUsed; t++) this._instances[t].resume()
    },
    _createInstance: null,
    _createInstance_WebAudio: function() {
        return new Resource.AudioInstance(this)
    },
    _createInstance_Audio: function() {
        return new Resource.AudioInstance_Audio(this)
    },
    _getInstance: function() {
        this._instances.length === this._numInstancesUsed && this._instances.push(this._createInstance());
        var t = this._instances[this._numInstancesUsed];
        return t.id = this._numInstancesUsed, this._numInstancesUsed++, t
    },
    _clearInstance: function(t) {
        this._numInstancesUsed--;
        var e = this._instances[this._numInstancesUsed];
        e.id = t.id, this._instances[t.id] = e, this._instances[this._numInstancesUsed] = t
    },
    set volume(t) {
        if (this._volume !== t)
            if (this._volume = t, meta.device.audioAPI) this._gainNode.gain.value = t;
            else
                for (var e = this._instances.length, i = 0; e > i; i++) this._instances[i].volume = t
    },
    get volume() {
        return this._volume
    },
    get playing() {
        var t = this._instances[0];
        return t ? t.playing : !1
    },
    get paused() {
        var t = this._instances[0];
        return t ? t.paused : !1
    },
    get looping() {
        var t = this._instances[0];
        return t ? t.looping : !1
    },
    get duration() {
        if (meta.device.audioAPI) {
            if (this._buffer) return this._buffer.duration;
            var t = this._instances[0];
            return t ? t.audio.duration : 0
        }
        return 0
    },
    set currentTime(t) {
        var e = this._instances[0];
        e && (e.currentTime = t)
    },
    get currentTime() {
        var t = this._instances[0];
        return t ? t.currentTime : 0
    },
    type: Resource.Type.SOUND,
    format: "",
    _instances: null,
    _numInstancesUsed: 0,
    _context: null,
    _buffer: null,
    _request: null,
    _requestFormat: 0,
    _gainNode: null,
    _volume: 1
}), Resource.AudioInstance = function(t) {
    this.parent = t, this.id = -1, this.source = null, this.looping = !1, this.paused = !1, this.playing = !1, this.offset = 0, this.tStart = 0, this.tPaused = 0;
    var e = this;
    this.onEndFunc = function() {
        e.parent.onEnd && e.parent.onEnd(e.parent), e.paused || (e.looping ? (e.source.disconnect(), e.play(!0, 0)) : e.parent._clearInstance(e))
    }
}, Resource.AudioInstance.prototype = {
    play: function(t, e) {
        t = t || !1, e = e || 0, this.paused = !1, this.parent._loaded ? (this.playing = !0, this.autoPlay ? this.autoPlay = !1 : (this.looping = t, this.offset = e), this.source = meta.audio.context.createBufferSource(), this.source.buffer = this.parent._buffer, this.source.connect(this.parent._gainNode), this.source.onended = this.onEndFunc, this.offset < 0 ? this.offset = 0 : this.offset > this.source.buffer.duration && (this.offset = this.source.buffer.duration), this.source.start(0, this.offset), this.tStart = this.source.context.currentTime - this.offset) : (this.autoPlay = !0, this.looping = t, this.offset = e)
    },
    stop: function() {
        this.source && (this.paused = !1, this.looping = !1, this.source.stop(this.source.context.currentTime + .2))
    },
    pause: function() {
        this.paused || (this.paused = !0, this.playing ? this.tPaused = this.source.context.currentTime - this.tStart : this.tPaused = 0, this.source && (this.source.disconnect(this.parent._gainNode), this.source.stop(0)))
    },
    resume: function() {
        this.play(this.looping, this.tPaused)
    },
    set currentTime(t) {
        this.stop(), this.play(this.looping, t)
    },
    get currentTime() {
        return this.playing ? this.source.context.currentTime - this.tStart : 0
    },
    autoPlay: !1
}, Resource.AudioInstance_Audio = function(t) {
    this.parent = t, this.id = -1, this.looping = !1, this.paused = !1, this.playing = !1, this.offset = 0, this.audio = new Audio, this.audio.preload = "auto", this._canPlay = !1, this._metaLoaded = !1, this._loaded = !1;
    var e = this;
    this._canPlayFunc = function() {
        e.audio.removeEventListener("canplaythrough", e._canPlayFunc), e._canPlay = !0, meta.device.support.onloadedmetadata && e._metaLoaded && e._onLoaded()
    }, this._metaFunc = function() {
        e.audio.removeEventListener("loadedmetadata", e._metaFunc), e._metaLoaded = !0, e.canPlay && e._onLoaded()
    }, this._onEndedFunc = function() {
        e._onEnd()
    }, this._addEvents(t)
}, Resource.AudioInstance_Audio.prototype = {
    play: function(t, e) {
        t = t || !1, e = e || 0, this.paused = !1, this._loaded ? (this.playing = !0, this.autoPlay ? this.autoPlay = !1 : (this.looping = t, this.offset = e), this.audio.currentTime = this.offset, this.audio.play()) : (this.autoPlay = !0, this.looping = t, this.offset = e)
    },
    stop: function() {
        this.playing = !1, this.audio.pause(), this.parent._clearInstance(this)
    },
    pause: function() {
        this.playing = !1, this.audio.pause()
    },
    resume: function() {
        this.playing = !0, this.audio.play()
    },
    _addEvents: function() {
        this.audio.addEventListener("canplaythrough", this._canPlayFunc, !1), meta.device.support.onloadedmetadata && this.audio.addEventListener("loadedmetadata", this._metaFunc, !1), this.audio.addEventListener("ended", this._onEndedFunc, !1), this.parent._loaded && (this.audio.src = this.parent.fullPath, this.audio.load())
    },
    _onLoaded: function() {
        if (!this.parent._loaded) {
            this.parent.format || (this.parent.path += "." + meta.device.audioFormats[this.parent._requestFormat - 1]), this.parent._loading = !1, this.parent.loaded = !0, this.parent.fullPath = this.parent.path + "." + this.parent.format;
            for (var t, e = this.parent._instances, i = this.parent._instances.length, s = 1; i > s; s++) t = e[s], t.audio.src = this.parent.fullPath, t.audio.load();
            meta.resources.loadSuccess(parent), meta.resources.loadNextFromQueue()
        }
        this._loaded = !0, this.autoPlay && this.play(!1, 0)
    },
    _onEnd: function() {
        this.looping ? (this.audio.play(), this.audio.currentTime = 0) : this.playing && (this.playing = !1, this.parent._clearInstance(this))
    },
    set currentTime(t) {
        this.playing ? this.audio.currentTime = t || 0 : (this.audio.play(), this.audio.currentTime = t || 0, this.audio.pause())
    },
    get currentTime() {
        return this.audio.currentTime
    },
    set volume(t) {
        var e = t * meta.audio._volume;
        this.audio.volume = e
    },
    autoPlay: !1
}, "use strict", meta.class("Resource.SpriteSheet", "Resource.Basic", {
    onInit: function(t, e) {
        if ("string" == typeof t) e = t, t = void 0;
        else
            for (var i in t) this[i] = t[i];
        if (e) {
            var s = e.lastIndexOf("."); - 1 !== s && e.length - s <= 5 && (this.format = e.substr(s + 1, e.length - s - 1), e = e.substr(0, s)), this.path = meta.resources.rootPath + e, this.format || (this.format = "xml"), this.load(this.path)
        }
    },
    load: function() {
        if (!this.loading) {
            this.loading = !0, this.loaded = !1, this._isAtlasLoaded = !1, this.texture ? "string" == typeof this.texture && (this.texture = new Resource.Texture(this.texture)) : this.texture = new Resource.Texture(this.path), this.texture.subscribe(this._onTextureEvent, this);
            var t = this,
                e = this.path + "." + this.format;
            this._request = new XMLHttpRequest, this._request.open("GET", e, !0), this._request.onreadystatechange = function() {
                t._onStateChange()
            }, this._request.send(), meta.resources.addToLoad(this)
        }
    },
    loadData: function(t, e) {
        e = e || this.format, e || (e = "xml"), this.format = e;
        var i = !1;
        if ("xml" === e) {
            var s = new DOMParser,
                n = s.parseFromString(t, "text/xml");
            i = this.loadXML(n)
        } else if ("json" === e) {
            var o = JSON.parse(t);
            i = this.loadJSON(o)
        } else if ("plist" === e) {
            var s = new DOMParser,
                h = s.parseFromString(t, "text/xml");
            i = this.loadPlist(h)
        } else console.warn("(Resource.SpriteSheet.loadData):", "Trying to load an unsupported format - " + this.format);
        return this.loaded = i, i
    },
    loadXML: function(t) {
        if (!t) return console.warn("(Resource.SpriteSheet.loadXML) Invalid XML file."), !1;
        for (var e = t.documentElement.childNodes, i = e.length, s, n = 0; i > n; n++)
            if (s = e[n], "SubTexture" === s.nodeName) this._loadXML_Starling(s);
            else if ("sprite" === s.nodeName) this._loadXML_genericXML(s);
        else if ("dict" === s.nodeName) return this.loadPlist(t);
        return !0
    },
    _loadXML_Starling: function(t) {
        var e = new Resource.Texture;
        e.fromAtlas = !0, e.ptr = this.texture, e.name = t.getAttribute("name"), e.x = t.getAttribute("x"), e.y = t.getAttribute("y"), e.resize(t.getAttribute("width"), t.getAttribute("height")), e.loaded = !0, meta.resources.add(e)
    },
    _loadXML_genericXML: function(t) {
        var e = new Resource.Texture;
        e.fromAtlas = !0, e.ptr = this.texture, e.name = t.getAttribute("n"), e.x = t.getAttribute("x"), e.y = t.getAttribute("y"), e.resize(t.getAttribute("w"), t.getAttribute("h")), e.loaded = !0, meta.resources.add(e)
    },
    loadPlist: function(t) {
        if (!t) return console.warn("[Resource.SpriteSheet.loadPlist]:", "Invalid Plist file."), !1;
        for (var e = t.documentElement.childNodes, i = e.length, s, n = 0; i > n; n++)
            if (s = e[n], "dict" === s.nodeName) return this._loadPlist_dict(s)
    },
    _loadPlist_dict: function(t) {
        for (var e = t.childNodes, i = e.length, s = "", n = 0; i > n; n++)
            if (t = e[n], "key" === t.nodeName) s = t.textContent;
            else if ("dict" === t.nodeName) {
            if (!s) continue;
            "frames" === s && this._loadPlist_frames(t)
        }
    },
    _loadPlist_frames: function(t) {
        for (var e = t.childNodes, i = e.length, s = "", n = 0; i > n; n++) t = e[n], "key" === t.nodeName ? s = t.textContent : "dict" === t.nodeName && this._loadPlist_frame(t, s)
    },
    _loadPlist_frame: function(t, e) {
        var i = new Resource.Texture;
        i.fromAtlas = !0, i.ptr = this.texture, i.name = e;
        for (var s = t.childNodes, n = s.length, o = "", h, a = 0; n > a; a++)
            if (t = s[a], "key" === t.nodeName) o = t.textContent;
            else if ("string" === t.nodeName && "frame" === o) return h = t.textContent.match(/[0-9]+/g), i.x = parseInt(h[0]), i.y = parseInt(h[1]), i.resize(parseInt(h[2]), parseInt(h[3])), i.loaded = !0, meta.resources.add(i), void 0
    },
    loadJSON: function(t) {
        return t ? (t.frames instanceof Array ? this._loadJSON_array(t) : this._loadJSON_hash(t), !0) : (console.warn("[Resource.SpriteSheet.loadFromJSON]:", "Invalid JSON file."), !1)
    },
    _loadJSON_array: function(t) {
        for (var e, i, s = t.frames, n = s.length, o = 0; n > o; o++) e = s[o], i = new Resource.Texture, i.fromAtlas = !0, i.ptr = this.texture, i.name = e.filename, e = e.frame, i.x = e.x, i.y = e.y, i.resize(e.w, e.h), i.loaded = !0, meta.resources.add(i)
    },
    _loadJSON_hash: function(t) {
        var e, i, s = t.frames;
        for (var n in s) e = s[n].frame, i = new Resource.Texture, i.fromAtlas = !0, i.ptr = this.texture, i.name = n, i.x = e.x, i.y = e.y, i.resize(e.w, e.h), i.loaded = !0, meta.resources.add(i)
    },
    loadAtlas: function() {
        if ("object" != typeof this.atlas) return console.warn("[Resource.SpriteSheet.loadFromAtlas]:", "Incorrect atlas object, expected to be an Array."), !1;
        for (var t = [], e, i, s, n = this.atlas.length, o = 0; n > o; o++) e = this.atlas[o], s = e.name || this.params, s ? (e.x = e.x || this.params.x || 0, e.y = e.y || this.params.y || 0, e.width = e.width || this.params.width || 1, e.height = e.height || this.params.height || 1, t.push(e), i = new Resource.Texture, i.fromAtlas = !0, i.ptr = this.texture, i.name = s, i.x = e.x, i.y = e.y, i.resize(e.width, e.height), i.numFrames = e.numFrames || this.params.numFrames || 1, i.loaded = !0, meta.resources.add(i)) : console.warn("[Resource.SpriteSheet.loadFromAtlas]:", "No name defined for atlas item in " + this.name + " spritesheet.");
        return this.texture._frames = t, this.atlas = null, this.loaded = !0, !0
    },
    _onTextureEvent: function(t, e) {
        e === Resource.Event.LOADED && (this.texture.unsubscribe(this), this._isAtlasLoaded && (this.loadData(this._response, this.format), meta.resources.loadSuccess(this), this._response = null))
    },
    _onStateChange: function() {
        4 === this._request.readyState && (200 === this._request.status ? (this._isAtlasLoaded = !0, this._response = this._request.response, this._request = null, this.texture._loaded && (this.loadData(this._response, this.format), meta.resources.loadSuccess(this), this._response = null)) : (this._loaded = !1, this._request.onreadystatechange = null, this._request = null, meta.resources.loadFailed(this)))
    },
    type: Resource.Type.SPRITE_SHEET,
    format: "",
    atlas: null,
    params: null,
    texture: null,
    _request: null,
    _response: null,
    _isAtlasLoaded: !1
}), "use strict", meta.class("Resource.Font", "Resource.Basic", {
    onInit: function(t, e) {
        t && this.load(meta.resources.rootPath + t)
    },
    load: function(t) {
        if (!this.loading && (this.loaded = !1, t)) {
            this.path = t;
            var e = this.path.lastIndexOf("."); - 1 === e || this.path.length - e > 4 ? (this.path += ".fnt", this.format = "fnt") : this.format = this.path.substr(e + 1);
            var i = this["parse_" + this.format];
            if (!i) return console.warn("(Resource.Font.load) Unsupported format: " + this.format), void 0;
            this.chars = new Array(256), meta.resources.addToLoad(this), this.texture = new Resource.Texture(t), this.texture.subscribe(this._onTextureEvent, this);
            var s = this;
            meta.ajax({
                url: this.path,
                success: function(t) {
                    i.call(s, t)
                },
                error: function() {
                    s._onError()
                }
            })
        }
    },
    _onError: function() {
        meta.resources.loadFailed(this)
    },
    parse_fnt: function(t) {
        for (this.tokenizer.setup(t), this.tokenizer.nextToken(); 0 !== this.tokenizer.token.type;) this._parseToken_fnt();
        var e;
        for (var i in this.chars) e = this.chars[i], e.offsetY > this._minOffsetY && (e.offsetY -= this._minOffsetY);
        this._loadedFormat = !0, this.texture._loaded && (meta.resources.loadSuccess(this), this.loaded = !0)
    },
    _parseToken_fnt: function() {
        var t = this.tokenizer.token,
            e = t.line;
        switch (t.str) {
            case "char":
                for (var i = new this.Rect; t = this.tokenizer.nextToken(), t.line === e;) switch (t.str) {
                    case "id":
                        this.tokenizer.nextToken(), t = this.tokenizer.nextToken(), this.chars[t.value] = i;
                        break;
                    case "x":
                        this.tokenizer.nextToken(), t = this.tokenizer.nextToken(), i.x = t.value;
                        break;
                    case "y":
                        this.tokenizer.nextToken(), t = this.tokenizer.nextToken(), i.y = t.value;
                        break;
                    case "yoffset":
                        this.tokenizer.nextToken(), t = this.tokenizer.nextToken(), i.offsetY = t.value, t.value < this._minOffsetY && 0 !== t.value && (this._minOffsetY = t.value);
                        break;
                    case "width":
                        this.tokenizer.nextToken(), t = this.tokenizer.nextToken(), i.width = t.value;
                        break;
                    case "height":
                        this.tokenizer.nextToken(), t = this.tokenizer.nextToken(), i.height = t.value, this.height < t.value && (this.height = t.value);
                        break;
                    case "xadvance":
                        this.tokenizer.nextToken(), t = this.tokenizer.nextToken(), i.kerning = t.value
                }
                break;
            default:
                this.tokenizer.nextToken()
        }
    },
    _onTextureEvent: function(t, e) {
        switch (e) {
            case Resource.Event.LOADED:
                this._loadedFormat && (meta.resources.loadSuccess(this), this.loaded = !0);
                break;
            case Resource.Event.FAILED:
        }
    },
    Rect: function() {
        this.x = 0, this.y = 0, this.width = 0, this.height = 0, this.kerning = 0, this.offsetY = 0
    },
    tokenizer: meta.tokenizer,
    type: Resource.Type.FONT,
    format: "",
    texture: null,
    chars: null,
    height: 1,
    _loadedFormat: !1,
    _minOffsetY: Number.MAX_VALUE
}), "use strict", meta.class("Resource.SVG", "Resource.Texture", {
    fillRect: function(t, e, i, s) {
        0 === (this.flags & this.TextureFlag.RESIZED) && this.resizeSilently(i + t, s + e), this.ctx.fillStyle = this._fillStyle, this.ctx.fillRect(t, e, i, s), this.loaded = !0
    },
    line: function(t, e, i, s) {
        if (0 === (this.flags & this.TextureFlag.RESIZED)) {
            var n, o, h, a;
            i > t ? (n = t, o = i) : (n = i, o = t), s > e ? (h = e, a = s) : (h = s, a = e), this.resizeSilently(o, a)
        }
        this.ctx.strokeStyle = this._strokeStyle, this.ctx.lineWidth = this._lineWidth, this.ctx.beginPath(), this.ctx.moveTo(t, e), this.ctx.lineTo(i, s), this.ctx.stroke(), this.loaded = !0
    },
    rect: function(t, e, i, s) {
        var n;
        n = this._lineWidth % 2 === 1 ? .5 : 0, 0 === (this.flags & this.TextureFlag.RESIZED) && (n ? this.resizeSilently(i + t + 1, s + e + 1) : this.resizeSilently(i + t, s + e)), this.ctx.save(), this.ctx.translate(n, n), this.ctx.beginPath(), this.ctx.rect(t, e, i, s), this._fillStyle && (this.ctx.fillStyle = this._fillStyle, this.ctx.fill()), (this._strokeStyle || !this._fillStyle) && (this.ctx.lineWidth = this._lineWidth, this.ctx.strokeStyle = this._strokeStyle, this.ctx.stroke()), this.ctx.restore(), this.loaded = !0
    },
    circle: function(t) {
        var e = 2 * (t + this._lineWidth);
        0 === (this.flags & this.TextureFlag.RESIZED) && this.resizeSilently(e, e), this.ctx.beginPath(), this.ctx.arc(t + this._lineWidth, t + this._lineWidth, t, 0, 2 * Math.PI, !1), this.ctx.closePath(), this._fillStyle && (this.ctx.fillStyle = this._fillStyle, this.ctx.fill()), (this._strokeStyle || !this._fillStyle) && (this.ctx.lineWidth = this._lineWidth, this.ctx.strokeStyle = this._strokeStyle, this.ctx.stroke()), this.loaded = !0
    },
    tileAuto: function(t, e, i, s) {
        if ("string" == typeof t) {
            var n = meta.resources.getTexture(t);
            if (!n) return console.warn("(Resource.Texture.tileAuto): Could not get texture with name: " + t), void 0;
            t = n
        } else if (!t) return console.warn("(Resource.Texture.tileAuto): Invalid texture"), void 0;
        if (!t._loaded) {
            this.loaded = !1;
            var o = this;
            return t.subscribe(function(n, h) {
                o.tileAuto(t, e, i, s)
            }, this), void 0
        }
        i = i || 0, s = s || 0;
        var h = Math.ceil(this.fullWidth / t.fullWidth) || 1,
            a = Math.ceil(this.fullHeight / t.fullHeight) || 1,
            r = h * (t.fullWidth + i) + i,
            l = a * (t.fullHeight + s) + s,
            u = i,
            c = s;
        e && (u = .5 * -(r - this.fullWidth), c = .5 * -(l - this.fullHeight));
        for (var d = u, m = c, f = 0; h > f; f++) {
            for (var v = 0; a > v; v++) this.ctx.drawImage(t.canvas, d, m), m += t.trueHeight + s;
            d += t.trueWidth + i, m = c
        }
        this.loaded = !0
    },
    tile: function(t, e, i, s, n) {
        if ("string" == typeof t) {
            var o = meta.resources.getTexture(t);
            if (!o) return console.warn("(Resource.Texture.tile): Could not get texture with name: " + t), void 0;
            t = o
        } else if (!t) return console.warn("(Resource.Texture.tile): Invalid texture"), void 0;
        if (!t._loaded) {
            this.loaded = !1;
            var h = this;
            return t.subscribe(function(t, o) {
                h.tile(t, e, i, s, n)
            }, this), void 0
        }
        var a = e * (t.fullWidth + s) + s,
            r = i * (t.fullHeight + n) + n;
        this.resizeSilently(a, r);
        for (var l = s, u = n, c = l, d = u, m = 0; e > m; m++) {
            for (var f = 0; i > f; f++) this.ctx.drawImage(t.canvas, c, d), d += t.trueHeight + n;
            c += t.trueWidth + s, d = u
        }
        this.loaded = !0
    },
    shape: function(t) {
        var e = meta,
            i = 1,
            s = Number.POSITIVE_INFINITY,
            n = s,
            o = Number.NEGATIVE_INFINITY,
            h = o,
            a, r, l, u, c = t.length;
        for (r = 0; c > r; r += 2) l = t[r] * i | 0, u = t[r + 1] * i | 0, s > l && (s = l), n > u && (n = u), l > o && (o = l), u > h && (h = u), t[r] = l, t[r + 1] = u;
        s > 0 && (s = 0), n > 0 && (n = 0);
        var d = this.ctx,
            m = this._lineWidth / 2,
            f = -s + m,
            v = -n + m;
        for (0 === (this.flags & this.TextureFlag.RESIZED) && this.resizeSilently(o - s + this._lineWidth, h - n + this._lineWidth), d.lineWidth = this._lineWidth, this._lineCap && (d.lineCap = this._lineCap), this._lineDash && d.setLineDash(this._lineDash), d.beginPath(), d.moveTo(t[0] + f, t[1] + v), r = 2; c > r; r += 2) d.lineTo(t[r] + f, t[r + 1] + v);
        this.closePath && d.closePath(), this._fillStyle && (this.ctx.fillStyle = this._fillStyle, this.ctx.fill()), (this._strokeStyle || !this._fillStyle) && (this.ctx.lineWidth = this._lineWidth, this.ctx.strokeStyle = this._strokeStyle, this.ctx.stroke()), this.loaded = !0
    },
    arc: function(t, e, i, s) {
        if (0 === (this.flags & this.TextureFlag.RESIZED)) {
            var n = 2 * (t + this._lineWidth);
            this.resizeSilently(n, n)
        }
        this.ctx.beginPath(), this.ctx.arc(t + this._lineWidth, t + this._lineWidth, t, e, i, !1), this.closePath && this.ctx.closePath(), this._fillStyle && (this.ctx.fillStyle = this._fillStyle, this.ctx.fill()), (this._strokeStyle || !this._fillStyle) && (this.ctx.lineWidth = this._lineWidth, this.ctx.strokeStyle = this._strokeStyle, this.ctx.stroke()), this.loaded = !0
    },
    roundRect: function(t, e, i) {
        var s;
        s = this._lineWidth % 2 === 1 ? .5 : 0, 0 === (this.flags & this.TextureFlag.RESIZED) && (s ? this.resizeSilently(t + 1, e + 1) : this.resizeSilently(t, e));
        var n = Math.ceil(this._lineWidth / 2);
        this.ctx.save(), this.ctx.translate(s, s), this.ctx.beginPath(), this.ctx.moveTo(n + i, n), this.ctx.lineTo(t - n - i, n), this.ctx.quadraticCurveTo(t - n, n, t - n, n + i), this.ctx.lineTo(t - n, e - n - i), this.ctx.quadraticCurveTo(t - n, e - n, t - n - i, e - n), this.ctx.lineTo(n + i, e - n), this.ctx.quadraticCurveTo(n, e - n, n, e - n - i), this.ctx.lineTo(n, i + n), this.ctx.quadraticCurveTo(n, n, n + i, n), this.ctx.closePath(), this._fillStyle && (this.ctx.fillStyle = this._fillStyle, this.ctx.fill()), (this._strokeStyle || !this._fillStyle) && (this.ctx.lineWidth = this._lineWidth, this.ctx.strokeStyle = this._strokeStyle, this.ctx.stroke()), this.ctx.restore(), this.loaded = !0
    },
    gradient: function(t) {
        for (var e = this.ctx.createLinearGradient(0, 0, 0, this.fullHeight), i = t.length, s = 0; i > s; s += 2) e.addColorStop(t[s], t[s + 1]);
        this.ctx.clearRect(0, 0, this.fullWidth, this.fullHeight), this.ctx.fillStyle = e, this.ctx.fillRect(0, 0, this.fullWidth, this.fullHeight), this.loaded = !0
    },
    grid: function(t, e, i, s) {
        var n = t * i,
            o = e * s;
        0 === (this.flags & this.TextureFlag.RESIZED) && this.resizeSilently(n + this.lineWidth, o + this.lineWidth), this.ctx.strokeStyle = this.strokeStyle, this.ctx.lineWidth = this.lineWidth;
        var h = .5 * this.lineWidth;
        this.ctx.save(), this.ctx.translate(h, h);
        for (var a = 0, r = 0; t >= r; r++) this.ctx.moveTo(a, 0), this.ctx.lineTo(a, o), a += i;
        a = 0;
        for (var l = 0; e >= l; l++) this.ctx.moveTo(-h, a), this.ctx.lineTo(n + h, a), a += s;
        this.ctx.stroke(), this.ctx.restore(), this.loaded = !0
    },
    set lineWidth(t) {
        this._lineWidth = t, this.ctx.lineWidth = t
    },
    get lineWidth() {
        return this._lineWidth
    },
    set fillStyle(t) {
        this._fillStyle = t, this.ctx.fillStyle = t
    },
    get fillStyle() {
        return this._fillStyle
    },
    set strokeStyle(t) {
        this._strokeStyle = t, this.ctx.strokeStyle = t
    },
    get strokeStyle() {
        return this._strokeStyle
    },
    Cache: function(t, e) {
        this.name = t, this.data = e
    },
    _lineWidth: 2,
    _lineCap: "",
    _lineDash: "",
    _fillStyle: "",
    _strokeStyle: "",
    closePath: !1
}), "use strict";
var Input = {};
Input.Event = {
    KEY_DOWN: "keydown",
    KEY_UP: "keyup",
    DOWN: "inputDown",
    UP: "inputUp",
    MOVE: "inputMove",
    CLICK: "inpucClick",
    DBCLICK: "inputDbClick"
}, Input.Key = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    SHIFT: 16,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    NUM_0: 48,
    NUM_1: 49,
    NUM_2: 50,
    NUM_3: 51,
    NUM_4: 52,
    NUM_5: 53,
    NUM_6: 54,
    NUM_7: 55,
    NUM_8: 56,
    NUM_9: 57,
    A: 65,
    B: 66,
    C: 67,
    D: 68,
    E: 69,
    F: 70,
    G: 71,
    H: 72,
    I: 73,
    J: 74,
    K: 75,
    L: 76,
    M: 77,
    N: 78,
    O: 79,
    P: 80,
    Q: 81,
    R: 82,
    S: 83,
    T: 84,
    U: 85,
    V: 86,
    W: 87,
    X: 88,
    Y: 89,
    Z: 90,
    SQUARE_BRACKET_LEFT: 91,
    SQUARE_BRACKET_RIGHT: 91,
    PARENTHESES_LEFT: 91,
    PARENTHESES_RIGHT: 91,
    BRACES_LEFT: 91,
    BRACES_RIGHT: 92,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    DELETE: 127,
    PLUS: 187,
    MINUS: 189,
    TILDE: 192,
    APOSTROPHE: 222,
    BUTTON_LEFT: 256,
    BUTTON_MIDDLE: 257,
    BUTTON_RIGHT: 258
}, "use strict", meta.class("Input.Manager", {
    init: function() {
        var t = this.numKeys + this.numInputs + 1;
        this.keys = new Array(t), this.touches = [], this.pressed = {}, this.keybind = {}, this._event = {
            event: null,
            type: "",
            x: 0,
            y: 0,
            prevScreenX: 0,
            prevScreenY: 0,
            screenX: 0,
            screenY: 0,
            keyCode: 0,
            entity: null
        }, this._addEventListeners(), this._loadIgnoreKeys(), meta.engine.onBlur.add(this.resetInput, this), this.keyID = new Array(t);
        var e = Input.Key;
        for (var i in e) this.keyID[e[i]] = i
    },
    _addEventListeners: function() {
        this.onKeyDown = meta.createChannel(Input.Event.KEY_DOWN), this.onKeyUp = meta.createChannel(Input.Event.KEY_UP), this.onDown = meta.createChannel(Input.Event.DOWN), this.onUp = meta.createChannel(Input.Event.UP), this.onMove = meta.createChannel(Input.Event.MOVE), this.onClick = meta.createChannel(Input.Event.CLICK), this.onDbClick = meta.createChannel(Input.Event.DBCLICK);
        var t = this;
        window.addEventListener("mousedown", function(e) {
            t.handleMouseDown(e)
        }), window.addEventListener("mouseup", function(e) {
            t.handleMouseUp(e)
        }), window.addEventListener("mousemove", function(e) {
            t.handleMouseMove(e)
        }), window.addEventListener("dblclick", function(e) {
            t.handleMouseDbClick(e)
        }), window.addEventListener("touchstart", function(e) {
            t.handleTouchDown(e)
        }), window.addEventListener("touchend", function(e) {
            t.handleTouchUp(e)
        }), window.addEventListener("touchmove", function(e) {
            t.handleTouchMove(e)
        }), window.addEventListener("touchcancel", function(e) {
            t.handleTouchUp(e)
        }), window.addEventListener("touchleave", function(e) {
            t.handleTouchUp(e)
        }), meta.device.support.onkeydown && window.addEventListener("keydown", function(e) {
            t.handleKeyDown(e)
        }), meta.device.support.onkeyup && window.addEventListener("keyup", function(e) {
            t.handleKeyUp(e)
        })
    },
    handleKeyDown: function(t) {
        var e = t.keyCode;
        if (window.top && this._iframeKeys[e] && t.preventDefault(), void 0 !== this._cmdKeys[e] && this._numCmdKeys++, void 0 !== this._ignoreKeys[e] && this._numCmdKeys <= 0 && t.preventDefault(), !(this.blockInput || this.stickyKeys && this.keys[e])) {
            if ("Meta" === t.keyIdentifier) this.metaPressed = !0;
            else if (this.metaPressed) return;
            if (this.keys[e] = 1, this.pressed[this.keyID[e]] = 1, this._keybindMap && this._keybindMap[e])
                for (var i = this._keybindMap[e], s = i.length, n = 0; s > n; n++) this.keybind[i[n]] = 1;
            if (this._event.event = t, this._event.prevScreenX = 0, this._event.prevScreenY = 0, this._event.screenX = 0, this._event.screenY = 0, this._event.x = 0, this._event.y = 0, this._event.keyCode = e, this.onKeyDown.emit(this._event, Input.Event.KEY_DOWN), this._onDownCBS && this._onDownCBS[e])
                for (var o = this._onDownCBS[e], h = o.length, a = 0; h > a; a++) o[a](this._event, Input.Event.KEY_DOWN);
            if (this.keyRepeat) {
                if (!this._inputTimer) {
                    var r = this;
                    this._inputTimer = meta.addTimer(this, function() {
                        r._event.keyCode = r._repeatKey, r.onKeyDown.emit(r._event, Input.Event.KEY_DOWN)
                    }, this.keyRepeat)
                }
                this._repeatKey = e, this._inputTimer.resume(), this._inputTimer.tAccumulator = 0
            }
        }
    },
    handleKeyUp: function(t) {
        var e = t.keyCode;
        if (window.top && this._iframeKeys[e] && t.preventDefault(), void 0 !== this._cmdKeys[e] && this.keys[e] && this._numCmdKeys--, void 0 === this._ignoreKeys[e] && this._numCmdKeys <= 0 && t.preventDefault(), !this.blockInput) {
            if (this.metaPressed = !1, this.keys[e] = 0, this.pressed[this.keyID[e]] = 0, this._keybindMap && this._keybindMap[e])
                for (var i = this._keybindMap[e], s = i.length, n = 0; s > n; n++) this.keybind[i[n]] = 0;
            if (this._event.event = t, this._event.prevScreenX = 0, this._event.prevScreenY = 0, this._event.prevX = 0, this._event.prevY = 0, this._event.x = 0, this._event.y = 0, this._event.keyCode = e, this.onKeyUp.emit(this._event, Input.Event.KEY_UP), this._onUpCBS && this._onUpCBS[e])
                for (var o = this._onUpCBS[e], h = o.length, a = 0; h > a; a++) o[a](this._event, Input.Event.KEY_UP);
            this.keyRepeat && this._inputTimer && this._inputTimer.pause()
        }
    },
    handleMouseDown: function(t) {
        if (!this.blockInput) {
            var e = t.button + 256;
            if (this.keys[e] = 1, this.pressed[this.keyID[e]] = e, this._keybindMap && this._keybindMap[e])
                for (var i = this._keybindMap[e], s = i.length, n = 0; s > n; n++) this.keybind[i[n]] = 1;
            var o = meta,
                h = o.camera;
            if (this.screenX = (t.pageX - this.engine.offsetLeft) * this.engine.scaleX * this.engine.ratio, this.screenY = (t.pageY - this.engine.offsetTop) * this.engine.scaleY * this.engine.ratio, this.x = this.screenX * h.zoomRatio + h.volume.x | 0, this.y = this.screenY * h.zoomRatio + h.volume.y | 0, this._event.event = t, this._event.prevScreenX = this._event.screenX, this._event.prevScreenY = this._event.screenY, this._event.screenX = this.screenX, this._event.screenY = this.screenY, this._event.x = this.x, this._event.y = this.y, this._event.keyCode = e, this.onDown.emit(this._event, Input.Event.DOWN), this._onDownCBS && this._onDownCBS[e])
                for (var a = this._onDownCBS[e], r = a.length, l = 0; r > l; l++) a[l](this._event, Input.Event.KEY_DOWN);
            this._event.entity = null
        }
    },
    handleMouseUp: function(t) {
        if (!this.blockInput) {
            var e = t.button + 256;
            if (this.keys[e] = 0, this.pressed[this.keyID[e]] = 0, this._keybindMap && this._keybindMap[e])
                for (var i = this._keybindMap[e], s = i.length, n = 0; s > n; n++) this.keybind[i[n]] = 0;
            var o = meta,
                h = o.camera;
            if (this.screenX = (t.pageX - this.engine.offsetLeft) * this.engine.scaleX * this.engine.ratio, this.screenY = (t.pageY - this.engine.offsetTop) * this.engine.scaleY * this.engine.ratio, this.x = this.screenX * h.zoomRatio + h.volume.x | 0, this.y = this.screenY * h.zoomRatio + h.volume.y | 0, this._event.event = t, this._event.prevScreenX = this._event.screenX, this._event.prevScreenY = this._event.screenY, this._event.screenX = this.screenX, this._event.screenY = this.screenY, this._event.x = this.x, this._event.y = this.y, this._event.keyCode = e, this.onUp.emit(this._event, Input.Event.UP), this.onClick.emit(this._event, Input.Event.CLICK), this._onUpCBS && this._onUpCBS[e])
                for (var a = this._onUpCBS[e], r = a.length, l = 0; r > l; l++) a[l](this._event, Input.Event.UP);
            this._event.entity = null
        }
    },
    handleMouseMove: function(t) {
        if (t.preventDefault(), !this.blockInput) {
            var e = meta,
                i = e.camera;
            this.screenX = (t.pageX - this.engine.offsetLeft) * this.engine.scaleX * this.engine.ratio, this.screenY = (t.pageY - this.engine.offsetTop) * this.engine.scaleY * this.engine.ratio, this.x = this.screenX * i.zoomRatio + i.volume.x | 0, this.y = this.screenY * i.zoomRatio + i.volume.y | 0, this._event.event = t, this._event.prevScreenX = this._event.screenX, this._event.prevScreenY = this._event.screenY, this._event.screenX = this.screenX, this._event.screenY = this.screenY, this._event.x = this.x, this._event.y = this.y, this._event.keyCode = -1, this.onMove.emit(this._event, Input.Event.MOVE), this._event.entity = null
        }
    },
    handleMouseDbClick: function(t) {
        if (!this.blockInput) {
            var e = t.button;
            if (this.keys[e] = 0, this.pressed[this.keyID[e]] = 0, this._keybindMap && this._keybindMap[e])
                for (var i = this._keybindMap[e], s = i.length, n = 0; s > n; n++) this.keybind[i[n]] = 0;
            var o = meta,
                h = o.camera;
            if (this.screenX = (t.pageX - this.engine.offsetLeft) * this.engine.scaleX * this.engine.ratio, this.screenY = (t.pageY - this.engine.offsetTop) * this.engine.scaleY * this.engine.ratio, this.x = this.screenX * h.zoomRatio + h.volume.x | 0, this.y = this.screenY * h.zoomRatio + h.volume.y | 0, this._event.event = t, this._event.prevScreenX = this._event.screenX, this._event.prevScreenY = this._event.screenY, this._event.screenX = this.screenX, this._event.screenY = this.screenY, this._event.x = this.x, this._event.y = this.y, this._event.keyCode = e, this.onDbClick.emit(this._event, Input.Event.DBCLICK), this._onUpCBS && this._onUpCBS[e])
                for (var a = this._onUpCBS[e], r = a.length, l = 0; r > l; l++) a[l](this._event, Input.Event.UP);
            this._event.entity = null
        }
    },
    handleTouchDown: function(t) {
        t.preventDefault();
        for (var e = meta, i = e.camera, s, n, o, h, a, r, l = t.changedTouches, u = l.length, c = 0; u > c; c++) {
            r = this.touches.length - 1, s = t.changedTouches[c], this.touches.push(s.identifier), this.numTouches++, n = (s.pageX - this.engine.offsetLeft) * this.engine.scaleX * this.engine.ratio, o = (s.pageY - this.engine.offsetTop) * this.engine.scaleY * this.engine.ratio, h = n * i.zoomRatio + i.volume.x | 0, a = o * i.zoomRatio + i.volume.y | 0;
            var d = r + 256;
            if (this.keys[d] = 1, 3 > r && (this.pressed[this.keyID[d]] = 1, this._keybindMap && this._keybindMap[d]))
                for (var m = this._keybindMap[d], f = m.length, v = 0; f > v; v++) this.keybind[m[v]] = 1;
            if (this._event.event = t, this._event.prevScreenX = n, this._event.prevScreenY = o, this._event.screenX = n, this._event.screenY = o, this._event.x = h, this._event.y = a, this._event.keyCode = d, 0 === r && (this.screenX = n, this.screenY = o, this.x = h, this.y = a), this.onDown.emit(this._event, Input.Event.DOWN), this._onDownCBS && this._onDownCBS[d])
                for (var p = this._onDownCBS[d], _ = p.length, c = 0; _ > c; c++) p[c](this._event, Input.Event.DOWN);
            this._event.entity = null
        }
    },
    handleTouchUp: function(t) {
        t.preventDefault();
        for (var e = meta, i = e.camera, s, n, o, h, a, r, l = t.changedTouches, u = l.length, c = 0; u > c; c++)
            if (s = t.changedTouches[c], n = this._getTouchID(s.identifier), -1 !== n) {
                this.touches.splice(n, 1), this.numTouches--, o = (s.pageX - this.engine.offsetLeft) * this.engine.scaleX * this.engine.ratio, h = (s.pageY - this.engine.offsetTop) * this.engine.scaleY * this.engine.ratio, a = o * i.zoomRatio + i.volume.x | 0, r = h * i.zoomRatio + i.volume.y | 0;
                var d = n + 256;
                if (this.keys[d] = 0, 3 > n && (this.pressed[this.keyID[d]] = 0, this._keybindMap && this._keybindMap[d]))
                    for (var m = this._keybindMap[d], f = m.length, v = 0; f > v; v++) this.keybind[m[v]] = 0;
                if (this._event.event = t, 0 === n ? (this._event.prevScreenX = this._event.screenX, this._event.prevScreenY = this._event.screenY, this.screenX = o, this.screenY = h, this.x = a, this.y = r) : (this._event.prevScreenX = o, this._event.prevScreenY = h), this._event.screenX = o, this._event.screenY = h, this._event.x = a, this._event.y = r, this._event.keyCode = n, this.onDown.emit(this._event, Input.Event.UP), this.onClick.emit(this._event, Input.Event.CLICK), this._onUpCBS && this._onUpCBS[d])
                    for (var p = this._onUpCBS[d], _ = p.length, c = 0; _ > c; c++) p[c](this._event, Input.Event.UP);
                this._event.entity = null
            }
    },
    handleTouchMove: function(t) {
        t.preventDefault();
        for (var e = meta, i = e.camera, s, n, o, h, a, r, l = t.changedTouches, u = l.length, c = 0; u > c; c++)
            if (s = t.changedTouches[c], n = this._getTouchID(s.identifier), -1 !== n) {
                o = (s.pageX - this.engine.offsetLeft) * this.engine.scaleX * this.engine.ratio, h = (s.pageY - this.engine.offsetTop) * this.engine.scaleY * this.engine.ratio, a = o * i.zoomRatio + i.volume.x | 0, r = h * i.zoomRatio + i.volume.y | 0;
                var d = n + 256;
                this._event.event = t, 0 === n ? (this._event.prevScreenX = this._event.screenX, this._event.prevScreenY = this._event.screenY, this.inputX = a, this.inputY = r, this.screenX = o, this.screenY = h, this.x = a, this.y = r) : (this._event.prevScreenX = o, this._event.prevScreenY = h), this._event.screenX = o, this._event.screenY = h, this._event.x = a, this._event.y = r, this._event.keyCode = d, this.onMove.emit(this._event, Input.Event.MOVE), this._event.entity = null
            }
    },
    resetInput: function() {
        var t;
        this._event.event = null, this._event.prevX = 0, this._event.prevY = 0, this._event.x = 0, this._event.y = 0, this._event.keyCode = 0, this.metaPressed = !1;
        var e = this.numKeys + this.numInputs;
        for (t = 0; t < this.numTotalKeys; t++) this.keys[t] && (this.keys[t] = 0, this._event.keyCode = t, this.onKeyUp.emit(this._event, Input.Event.KEY_UP));
        if (this.pressed = {}, this.keybind = {}, this._numCmdKeys = 0, this.numTouches) {
            for (t = 0; t < this.numTouches; t++) this._event.keyCode = t, this.onUp.emit(this._event, Input.Event.UP);
            this.touches.length = 0, this.numTouches = 0
        }
    },
    getEvent: function() {
        return this._event.event = null, this._event.prevScreenX = this._event.screenX, this._event.prevScreenY = this._event.screenY, this._event.screenX = this.screenX, this._event.screenY = this.screenY, this._event.x = this.inputX, this._event.y = this.inputY, this._event.keyCode = -1, this._event
    },
    _loadIgnoreKeys: function() {
        this._ignoreKeys = [], this._ignoreKeys[8] = 1, this._ignoreKeys[9] = 1, this._ignoreKeys[13] = 1, this._ignoreKeys[17] = 1, this._ignoreKeys[91] = 1, this._ignoreKeys[38] = 1, this._ignoreKeys[39] = 1, this._ignoreKeys[40] = 1, this._ignoreKeys[37] = 1, this._ignoreKeys[124] = 1, this._ignoreKeys[125] = 1, this._ignoreKeys[126] = 1, this._cmdKeys = [], this._cmdKeys[91] = 1, this._cmdKeys[17] = 1, this._iframeKeys = [], this._iframeKeys[37] = 1, this._iframeKeys[38] = 1, this._iframeKeys[39] = 1, this._iframeKeys[40] = 1
    },
    _ignoreFKeys: function(t) {
        this._ignoreKeys[112] = t, this._ignoreKeys[113] = t, this._ignoreKeys[114] = t, this._ignoreKeys[115] = t, this._ignoreKeys[116] = t, this._ignoreKeys[117] = t, this._ignoreKeys[118] = t, this._ignoreKeys[119] = t, this._ignoreKeys[120] = t, this._ignoreKeys[121] = t, this._ignoreKeys[122] = t, this._ignoreKeys[123] = t
    },
    set ignoreFKeys(t) {
        t ? this._ignoreFKeys(1) : this._ignoreFKeys(0)
    },
    get ignoreFKeys() {
        return !!this._ignoreKeys[112]
    },
    _getTouchID: function(t) {
        for (var e = 0; e < this.numTouches; e++)
            if (this.touches[e] === t) return e;
        return -1
    },
    onDown: function(t, e) {
        if (!t) return console.warn("(Input.Manager::onChange): Invalid keys passed"), void 0;
        if (this._onDownCBS || (this._onDownCBS = {}), t instanceof Array)
            for (var i = t.length, s = 0; i > s; s++) this._onDownCBS[t[s]] ? this._onDownCBS[t[s]].push(e) : this._onDownCBS[t[s]] = [e];
        else this._onDownCBS[t] ? this._onDownCBS[t].push(e) : this._onDownCBS[t] = [e]
    },
    onUp: function(t, e) {
        if (!t) return console.warn("(Input.Manager::onChange): Invalid keys passed"), void 0;
        if (this._onUpCBS || (this._onUpCBS = {}), t instanceof Array)
            for (var i = t.length, s = 0; i > s; s++) this._onUpCBS[t[s]] ? this._onUpCBS[t[s]].push(e) : this._onUpCBS[t[s]] = [e];
        else this._onUpCBS[t] ? this._onUpCBS[t].push(e) : this._onUpCBS[t] = [e]
    },
    onChange: function(t, e) {
        return t ? (this.onDown(t, e), this.onUp(t, e), void 0) : (console.warn("(Input.Manager::onChange): Invalid keys passed"), void 0)
    },
    addKeybind: function(t, e) {
        this._keybindMap || (this._keybindMap = new Array(this.numKeys + this.numInputs + 1));
        for (var i, s = e.length, n = 0; s > n; n++) i = e[n], this._keybindMap[i] ? this._keybindMap[i].push(t) : this._keybindMap[i] = [t]
    },
    onKeyDown: null,
    onKeyUp: null,
    onMove: null,
    onClick: null,
    onDbClick: null,
    engine: meta.engine,
    keyID: null,
    keys: null,
    touches: null,
    pressed: null,
    keybind: null,
    _keybindMap: null,
    blockInput: !1,
    stickyKeys: !0,
    metaPressed: !1,
    keyRepeat: 0,
    _inputTimer: null,
    _repeatKey: 0,
    numKeys: 256,
    numInputs: 10,
    numTouches: 0,
    x: 0,
    y: 0,
    screenX: 0,
    screenY: 0,
    _event: null,
    _ignoreKeys: null,
    _cmdKeys: null,
    _iframeKeys: null,
    _numCmdKeys: 0,
    _onDownCBS: null,
    _onUpCBS: null
}), "use strict";
var Entity = {};
Entity.Event = {
    INPUT_UP: "entityUp",
    INPUT_DOWN: "entityDown",
    CLICK: "entityClick",
    DBCLICK: "entityDbClick",
    DRAG: "drag",
    DRAG_START: "dragStart",
    DRAG_END: "dragEnd",
    HOVER: "hover",
    HOVER_ENTER: "hoverEnter",
    HOVER_EXIT: "hoverExit",
    STATE_CHANGE: "stateChange"
}, "use strict", meta.class("Entity.Geometry", {
    init: function(t) {
        this.volume = new meta.math.AABBext, this.anim = new Component.Anim(this), this.initArg(t), this.onCreate && this.onCreate(t)
    },
    initArg: function(t) {
        if ("object" == typeof t)
            if (t instanceof Resource.Texture) this.texture = t;
            else
                for (var e in t) this[e] = t[e];
        else "string" == typeof t && (this.texture = t)
    },
    onCreate: null,
    createBody: function(t) {
        t || (t = Physics.Body), this.addComponent("body", t)
    },
    remove: function() {
        this.removed || (this.removed = !0, this.flags & this.Flag.ADDED ? this.renderer.removeEntity(this) : this._remove())
    },
    _remove: function() {
        this._texture && (this._texture.unsubscribe(this), this._texture = null), this.body && Physics.ctrl.remove(this.body), this.tween && this.tween.clear(), this.view && this.view.detach(this), this.onRemove && this.onRemove()
    },
    onRemove: null,
    update: null,
    draw: null,
    updatePos: function() {
        if (this.volume.x = this._x + this.totalOffsetX, this.volume.y = this._y + this.totalOffsetY, this.volume.updatePos(), this.children)
            for (var t, e = this.children.length, i = 0; e > i; i++) t = this.children[i], t.flags & this.Flag.IGNORE_PARENT_POS || (t._parentX = this.volume.x - this.volume.pivotPosX - this.offsetPosX, t._parentY = this.volume.y - this.volume.pivotPosY - this.offsetPosY, t.updateTotalOffset());
        this.renderer.needRender = !0
    },
    updateTotalOffset: function() {
        this.totalOffsetX = this.offsetPosX + this._parentX + this.anchorPosX, this.totalOffsetY = this.offsetPosY + this._parentY + this.anchorPosY, this._view && (this.totalOffsetX += this._view._x, this.totalOffsetY += this._view._y), this.updatePos()
    },
    position: function(t, e) {
        (this._x !== t || this._y !== e) && (this._x = t, this._y = e, this.updatePos())
    },
    move: function(t, e) {
        (0 !== t || 0 !== e) && (this._x += t, this._y += e, this.updatePos())
    },
    moveForward: function(t) {
        var e = this._x + t * Math.cos(this.volume.angle - 1.57079),
            i = this._y + t * Math.sin(this.volume.angle - 1.57079);
        (this._x !== e || this._y !== i) && (this._x = e, this._y = i, this.updatePos())
    },
    moveDirected: function(t, e) {
        var i = this._x + -t * Math.cos(this.volume.angle - 1.57079 + e),
            s = this._y + -t * Math.sin(this.volume.angle - 1.57079 + e);
        (this._x !== i || this._y !== s) && (this._x = i, this._y = s, this.updatePos())
    },
    strafe: function(t) {
        var e = this._x + -t * Math.cos(this._angleRad + Math.PI),
            i = this._y + -t * Math.sin(this._angleRad + Math.PI);
        (this._x !== e || this._y !== i) && (this._x = e, this._y = i, this.updatePos())
    },
    set x(t) {
        this._x = t, this.updatePos()
    },
    set y(t) {
        this._y = t, this.updatePos()
    },
    get x() {
        return this._x
    },
    get y() {
        return this._y
    },
    get absX() {
        return this.volume.x
    },
    get absY() {
        return this.volume.y
    },
    set z(t) {
        this._z !== t && (this._z = t, this.updateZ())
    },
    get z() {
        return this._z
    },
    updateZ: function() {
        if (this.totalZ = this._z + this._parentZ, this._view && (this.totalZ += this._view._z), this.children)
            for (var t, e = this.children.length, i = 0; e > i; i++) t = this.children[i], t._parentZ = this.totalZ + 1e-5, t.updateZ();
        this.renderer.needSortDepth = !0
    },
    offset: function(t, e) {
        (this._offsetX !== t || this._offsetY !== e) && (this._offsetX = t, this._offsetY = e, this._texture ? (this.offsetPosX = Math.round(this._offsetX + this._texture.offsetX), this.offsetPosY = Math.round(this._offsetY + this._texture.offsetY)) : (this.offsetPosX = Math.round(this._offsetX), this.offsetPosY = Math.round(this._offsetY)), this.updateTotalOffset())
    },
    set offsetX(t) {
        this._offsetX !== t && (this._offsetX = t, this._texture ? this.offsetPosX = Math.round((this._offsetX + this._texture.offsetX) * this.volume.scaleX) : this.offsetPosX = Math.round(this._offsetX * this.volume.scaleX), this.updatePos())
    },
    set offsetY(t) {
        this._offsetY !== t && (this._offsetY = t, this._texture ? this.offsetPosY = Math.round((this._offsetY + this._texture.offsetY) * this.volume.scaleY) : this.offsetPosY = Math.round(this._offsetY * this.volume.scaleX), this.updatePos())
    },
    get offsetX() {
        return this._offsetX
    },
    get offsetY() {
        return this._offsetY
    },
    pivot: function(t, e) {
        this.volume.pivot(t, e), this.renderer.needRender = !0
    },
    set pivotX(t) {
        this.volume.pivot(t, this.volume.pivotY), this.renderer.needRender = !0
    },
    set pivotY(t) {
        this.volume.pivot(this.volume.pivotX, t), this.renderer.needRender = !0
    },
    get pivotX() {
        return this.volume.pivotX
    },
    get pivotY() {
        return this.volume.pivotY
    },
    anchor: function(t, e) {
        void 0 === e && (e = t), this._anchorX = t, this._anchorY = e, this._updateAnchor()
    },
    _updateAnchor: function() {
        if (this._static) {
            var t = meta.engine;
            this.anchorPosX = this.parent.volume.width * t.zoom * this._anchorX, this.anchorPosY = this.parent.volume.height * t.zoom * this._anchorY
        } else this.anchorPosX = this.parent.volume.width * this._anchorX, this.anchorPosY = this.parent.volume.height * this._anchorY;
        this.updateTotalOffset()
    },
    set anchorX(t) {
        this._anchorX = t, this._updateAnchor()
    },
    set anchorY(t) {
        this._anchorY = t, this._updateAnchor()
    },
    get anchorX() {
        return this._anchorX
    },
    get anchroY() {
        return this._anchorY
    },
    set angle(t) {
        t = t * Math.PI / 180, this.volume.angle !== t && (this._angle = t, this.updateAngle())
    },
    set angleRad(t) {
        this._angle !== t && (this._angle = t, this.updateAngle())
    },
    get angle() {
        return 180 * this.volume.angle / Math.PI
    },
    get angleRad() {
        return this.volume.angle
    },
    updateAngle: function() {
        if (this.volume.rotate(this._angle + this._parentAngle), this.children)
            for (var t, e = this.children.length, i = 0; e > i; i++) t = this.children[i], t.flags & this.Flag.IGNORE_PARENT_ANGLE || (t._parentAngle = this.volume.angle, t.updateAngle());
        this.renderer.needRender = !0
    },
    scale: function(t, e) {
        void 0 === e && (e = t), this._scaleX = t, this._scaleY = e, this._updateScale()
    },
    _updateScale: function() {
        if (this.volume.scale(this._scaleX * this._parentScaleX, this._scaleY * this._parentScaleY), this._texture ? (this.totalOffsetX = Math.round((this._offsetX + this._texture.offsetX) * this.volume.scaleX), this.totalOffsetY = Math.round((this._offsetY + this._texture.offsetY) * this.volume.scaleY)) : (this.totalOffsetX = Math.round(this._offsetX * this.volume.scaleX), this.totalOffsetY = Math.round(this._offsetY * this.volume.scaleY)), this._updateAnchor(), this.children)
            for (var t, e = this.children.length, i = 0; e > i; i++) t = this.children[i], t.flags & this.Flag.IGNORE_PARENT_SCALE || (t._parentScaleX = this.volume.scaleX, t._parentScaleY = this.volume.scaleY, t._updateScale(), t._updateAnchor());
        this.renderer.needRender = !0
    },
    set scaleX(t) {
        this._scaleX !== t && (this._scaleX = t, this._updateScale())
    },
    set scaleY(t) {
        this._scaleY !== t && (this._scaleY = t, this._updateScale())
    },
    get scaleX() {
        return this._scaleX
    },
    get scaleY() {
        return this._scaleY
    },
    flip: function(t, e) {
        this.volume.flip(t, e), this.renderer.needRender = !0
    },
    set flipX(t) {
        this.flip(t, this.volume.flipY)
    },
    set flipY(t) {
        this.flip(this.volume.flipX, t)
    },
    get flipX() {
        return this.volume.flipX
    },
    get flipY() {
        return this.volume.flipY
    },
    set alpha(t) {
        this._alpha !== t && (this._alpha = t, this.updateAlpha())
    },
    get alpha() {
        return this._alpha
    },
    updateAlpha: function() {
        if (this.totalAlpha = this._alpha * this.parent.totalAlpha, this.totalAlpha < 0 ? this.totalAlpha = 0 : this.totalAlpha > 1 && (this.totalAlpha = 1), this.children)
            for (var t, e = this.children.length, i = 0; e > i; i++) t = this.children[i], t.flags & this.Flag.IGNORE_PARENT_ALPHA || t.updateAlpha();
        this.volume.__transformed = 1, this.renderer.needRender = !0
    },
    resize: function(t, e) {
        if (this.volume.width !== t || this.volume.height !== e) {
            if (this.volume.resize(t, e), this.updatePos(), this._updateResize(), this.children)
                for (var i = this.children.length, s = 0; i > s; s++) this.children[s]._updateResize();
            this.renderer.needRender = !0
        }
    },
    set width(t) {
        this.texture && (this.volume.width !== t ? this.flags |= this.Flag.DYNAMIC_CLIP : this.flags &= ~this.Flag.DYNAMIC_CLIP), this.resize(t, this.volume.height)
    },
    set height(t) {
        this.texture && (this.volume.height !== t ? this.flags |= this.Flag.DYNAMIC_CLIP : this.flags &= ~this.Flag.DYNAMIC_CLIP), this.resize(this.volume.width, t)
    },
    get width() {
        return this.volume.width
    },
    get height() {
        return this.volume.height
    },
    _updateResize: function() {
        this._updateAnchor(), this.onResize && this.onResize()
    },
    onResize: null,
    clip: function(t) {
        t instanceof Entity.Geometry ? this.clipVolume = t.volume : t instanceof meta.math.AABB ? this.clipVolume = t : this.clipVolume = null, this.renderer.needRender = !0
    },
    clipBounds: function(t, e) {
        this.clipVolume ? this.clipVolume.set(0, 0, t, e) : this.clipVolume = new meta.math.AABB(0, 0, t, e), this.flags |= this.Flag.CLIP_BOUNDS, this.renderer.needRender = !0
    },
    _onTextureEvent: function(t, e) {
        var i = Resource.Event;
        e === i.LOADED ? this.loaded = !0 : e === i.UNLOADED && (this.loaded = !1), this.updateFromTexture()
    },
    _onLoadingEnd: function(t, e) {
        var i = meta.resources.getTexture(this._textureName);
        i ? this.texture = i : console.warn("(Entity.Geometry) Unavailable texture - " + this._textureName), meta.resources.onLoadingEnd.remove(this)
    },
    updateFromTexture: function() {
        if (this._texture ? (this.volume.resize(this._texture.width, this._texture.height), this.totalOffsetX = Math.round((this._offsetX + this._texture.offsetX) * this.volume.scaleX), this.totalOffsetY = Math.round((this._offsetY + this._texture.offsetY) * this.volume.scaleY)) : (this.volume.resize(0, 0), this.totalOffsetX = Math.round(this._offsetX * this.volume.scaleX), this.totalOffsetY = Math.round(this._offsetY * this.volume.scaleY)), this._updateAnchor(), this.children)
            for (var t = this.children.length, e = 0; t > e; e++) this.children[e]._updateAnchor()
    },
    onTextureChange: null,
    set texture(t) {
        if (this._texture !== t) {
            if (this._texture && this._texture.unsubscribe(this), t) {
                if ("string" == typeof t) {
                    if (this._texture = meta.resources.getTexture(t), !this._texture) return meta.resources.loading ? (this._textureName = t, meta.resources.onLoadingEnd.add(this._onLoadingEnd, this)) : console.warn("(Entity.Geometry) Unavailable texture - " + t), void 0
                } else this._texture = t;
                this._texture.subscribe(this._onTextureEvent, this), this._texture._loaded && (this.updateFromTexture(), this.loaded = !0)
            } else this._texture = t, this.loaded = !1;
            this.anim.set(this._texture), this.onTextureChange && this.onTextureChange()
        }
    },
    get texture() {
        return this._texture
    },
    set updating(t) {
        if (t) {
            if (-1 !== this.__updateIndex) return;
            this.flags |= this.Flag.UPDATING, this.flags & this.Flag.ADDED && (this.__updateIndex = this.renderer.entitiesUpdate.push(this) - 1)
        } else {
            if (-1 === this.__updateIndex) return;
            this.flags &= ~this.Flag.UPDATING, this.flags & this.Flag.ADDED && (this.renderer.entitiesUpdateRemove.push(this), this.__updateIndex = -1)
        }
    },
    get updating() {
        return (this.flags & this.Flag.UPDATING) === this.Flag.UPDATING
    },
    attach: function(t) {
        return t ? t === this ? (console.warn("(Entity.Geometry.attach) Trying to attach themself"), void 0) : t.parent !== this.renderer.holder ? (console.warn("(Entity.Geometry.attach) Trying to attach entity that has already been attached to other entity"), void 0) : (t.parent = this, this.children ? (this.children.push(t), 0 === (t.flags & this.Flag.IGNORE_PARENT_POS) && (t._parentX = this.volume.x - this.volume.pivotPosX - this.offsetPosX, t._parentY = this.volume.y - this.volume.pivotPosY - this.offsetPosY, t.updateTotalOffset())) : (this.children = [t], this._updateScale()), this._static && (t._static = !0), this._debugger && (t._debugger = !0), this.updateZ(), 0 !== this.volume.angle && this.updateAngle(), 1 !== this.totalAlpha && this.updateAlpha(), this._visible || (t.visible = !1), t._view = this._view, this._view && this._view.flags & this._view.Flag.VISIBLE && this.renderer.addEntity(t), this.renderer.needRender = !0, void 0) : (console.warn("(Entity.Geometry.attach) Invalid entity passed"), void 0)
    },
    _detach: function(t) {
        t.parent = this.renderer.holder, 1 !== this.totalAlpha && t.updateAlpha()
    },
    detach: function(t) {
        this._detach(t), this._view && this._view.flags & this._view.Flag.VISIBLE && this.renderer.removeEntity(t)
    },
    detachAll: function() {
        if (this.children) {
            for (var t = this.children.length, e = 0; t > e; e++) this._detach(this.children[e]);
            this._view && this._view.flags & this._view.Flag.VISIBLE && this.renderer.removeEntities(this.children), this.children = null
        }
    },
    set visible(t) {
        if (this._visible !== t) {
            if (this._visible = t, this.children)
                for (var e = this.children.length, i = 0; e > i; i++) this.children[i].visible = t;
            this.renderer.needRender = !0
        }
    },
    get visible() {
        return this._visible
    },
    set static(t) {
        if (this._static !== t) {
            if (this._static = t, this.children)
                for (var e = this.children.length, i = 0; e > i; i++) this.children[i].static = t;
            this.renderer.needRender = !0
        }
    },
    get static() {
        return this._static
    },
    set state(t) {
        this._state !== t && (this.onStateExit && this.onStateExit(), this._state = t, this.onStateEnter && this.onStateEnter())
    },
    get state() {
        return this._state
    },
    onStateChange: null,
    set picking(t) {
        if (t) {
            if (-1 !== this.__pickIndex) return;
            this.flags |= this.Flag.PICKING, this.flags & this.Flag.ADDED && (this.__pickIndex = this.renderer.entitiesPicking.push(this) - 1)
        } else {
            if (-1 === this.__pickIndex) return;
            this.flags &= ~this.Flag.PICKING, this.flags & this.Flag.ADDED && (this.renderer.entitiesPickingRemove.push(this), this.__pickIndex = -1)
        }
    },
    get picking() {
        return (this.flags & this.Flag.PICKING) === this.Flag.PICKING
    },
    isPointInside: function(t, e) {
        if (1 == this.volume.__transformed) {
            var i = t - this.volume.x,
                s = e - this.volume.y;
            t = i * this.volume.cos + s * this.volume.sin + this.volume.x, e = s * this.volume.cos - i * this.volume.sin + this.volume.y
        }
        return this.volume.vsPoint(t, e)
    },
    isPointInsidePx: function(t, e) {
        var i = this.volume;
        if (1 == i.__transformed) {
            var s = t - i.x,
                n = e - i.y;
            t = s * i.cos + n * i.sin + i.x, e = n * i.cos - s * i.sin + i.y
        }
        if (!this.volume.vsPoint(t, e)) return !1;
        var s = (t - i.minX) / i.scaleX | 0,
            n = (e - i.minY) / i.scaleY | 0,
            o = this._texture.getPixelAt(s, n);
        return o[3] > 50 ? !0 : !1
    },
    onDown: null,
    onUp: null,
    onClick: null,
    onDbClick: null,
    onDrag: null,
    onDragStart: null,
    onDragEnd: null,
    onHover: null,
    onHoverEnter: null,
    onHoverExit: null,
    dragStart: function(t, e) {
        this._dragOffsetX = t - this.volume.x, this._dragOffsetY = e - this.volume.y
    },
    dragTo: function(t, e) {
        t -= this.totalOffsetX + this._dragOffsetX, e -= this.totalOffsetY + this._dragOffsetY, (this.volume.x !== t || this.volume.y !== e) && this.position(t, e)
    },
    addTimer: function(t, e, i) {
        var s = meta.addTimer(this, t, e, i);
        return this.timers ? this.timers.push(s) : this.timers = [s], s
    },
    set tween(t) {
        if (!t) return this._tween = null, void 0;
        if (this._tweenCache ? this._tweenCache.stop() : this._tweenCache = new meta.Tween.Cache(this), t instanceof meta.Tween.Link) this._tweenCache.tween = t.tween;
        else {
            if (!(t instanceof meta.Tween)) return console.warn("(Entity.Geometry.set::tween) Ivalid object! Should be meta.Tween or meta.Tween.Link object"), void 0;
            this._tweenCache.tween = t
        }
        var e = this._tweenCache.tween;
        e.autoPlay && (e.cache = this._tweenCache, e.play())
    },
    get tween() {
        return this._tweenCache || (this.tween = new meta.Tween), this._tweenCache.tween.cache = this._tweenCache, this._tweenCache.tween
    },
    addComponent: function(t, e, i) {
        t instanceof Object && (i = e, e = t, t = null);
        var s = new e(this);
        if (s.owner = this, t) {
            if (this[t]) return console.warn("(Entity.Geometry.addComponent) Already in use: " + t), null;
            this[t] = s
        }
        if (i)
            for (var n in i) s[n] = i[n];
        return this.components ? this.components.push(s) : this.components = [s], s.load && s.load(), this.loaded && s.ready && s.ready(), s
    },
    removeComponent: function(t) {
        var e = this[t];
        if (!e || "object" != typeof e) return console.warn("(Entity.Geometry.removeComponent) Invalid component in: " + t), void 0;
        for (var i = !1, s = this.components.length, n = 0; s > n; n++)
            if (this.components[n] === e) {
                this.components[n] = this.components[s - 1], this.components.pop(), i = !0;
                break
            }
        return i ? (e.unload && e.unload(), this[t] = null, void 0) : (console.warn("(Entity.Geometry.removeComponent) No such components added in: " + t), void 0)
    },
    removeAllComponents: function() {
        if (components)
            for (var t = this.components.length, e = 0; t > e; e++) this.removeComponent(this.components[e])
    },
    lookAt: function(t, e) {
        this.flags & this.Flag.IGNORE_PARENT_ANGLE ? this.angleRad = -Math.atan2(t - this.volume.x, e - this.volume.y) + Math.PI : this.angleRad = -Math.atan2(t - this.volume.x, e - this.volume.y) + Math.PI - this.parent.volume.angle
    },
    set ignoreParentPos(t) {
        t ? (this.flags |= this.Flag.IGNORE_PARENT_POS, this._parentX = 0, this._parentY = 0, this.updatePos()) : (this.flags &= ~this.Flag.IGNORE_PARENT_POS, this.parent.updatePos())
    },
    get ignoreParentPos() {
        return (this.flags & this.Flag.IGNORE_PARENT_POS) === this.Flag.IGNORE_PARENT_POS
    },
    set ignoreParentAngle(t) {
        t ? (this.flags |= this.Flag.IGNORE_PARENT_ANGLE, this._parentAngle = 0, this.updateAngle()) : (this.flags &= ~this.Flag.IGNORE_PARENT_ANGLE, this.parent.updateAngle())
    },
    get ignoreParentAngle() {
        return (this.flags & this.Flag.IGNORE_PARENT_ANGLE) === this.Flag.IGNORE_PARENT_ANGLE
    },
    set ignoreParentScale(t) {
        t ? (this.flags |= this.Flag.IGNORE_PARENT_SCALE, this._parentScaleX = 1, this._parentScaleY = 1, this._updateScale()) : (this.flags &= ~this.Flag.IGNORE_PARENT_SCALE, this.parent._updateScale())
    },
    get ignoreParentScale() {
        return (this.flags & this.Flag.IGNORE_PARENT_SCALE) === this.Flag.IGNORE_PARENT_SCALE
    },
    set debug(t) {
        if (t) {
            if (this.flags & this.Flag.DEBUG) return;
            this.renderer.numDebug++, this.flags |= this.Flag.DEBUG
        } else {
            if (0 === (this.flags & this.Flag.DEBUG)) return;
            this.renderer.numDebug--, this.flags &= ~this.Flag.DEBUG
        }
        this.renderer.needRender = !0
    },
    get debug() {
        return (this.flags & this.Flag.DEBUG) === this.Flag.DEBUG
    },
    Flag: {
        READY: 1,
        PICKING: 2,
        IGNORE_PARENT_POS: 4,
        IGNORE_PARENT_Z: 8,
        IGNORE_PARENT_ANGLE: 16,
        IGNORE_PARENT_ALPHA: 32,
        IGNORE_PARENT_SCALE: 64,
        UPDATING: 128,
        ADDED: 256,
        DEBUG: 512,
        CLIP_BOUNDS: 1024,
        WILL_REMOVE: 2048,
        DYNAMIC_CLIP: 4096
    },
    renderer: null,
    parent: null,
    _view: null,
    _texture: null,
    _x: 0,
    _y: 0,
    _parentX: 0,
    _parentY: 0,
    _z: 0,
    totalZ: 0,
    _parentZ: 0,
    _angle: 0,
    _parentAngle: 0,
    _alpha: 1,
    totalAlpha: 1,
    _scaleX: 1,
    _scaleY: 1,
    _parentScaleX: 1,
    _parentScaleY: 1,
    _offsetX: 0,
    _offsetY: 0,
    offsetPosX: 0,
    offsetPosY: 0,
    _anchorX: 0,
    _anchorY: 0,
    anchorPosX: 0,
    anchorPosY: 0,
    totalOffsetX: 0,
    totalOffsetY: 0,
    _dragOffsetX: 0,
    _dragOffsetY: 0,
    volume: null,
    clipVolume: null,
    loaded: !0,
    removed: !1,
    _visible: !0,
    _static: !1,
    _debugger: !1,
    children: null,
    anim: null,
    _state: "",
    timers: null,
    _tweenCache: null,
    components: null,
    hover: !1,
    pressed: !1,
    dragged: !1,
    __debug: !1,
    __updateIndex: -1,
    __pickIndex: -1,
    flags: 0
}), "use strict", meta.class("Entity.Text", "Entity.Geometry", {
    onCreate: function(t) {
        this.texture = new Resource.Texture, this._texture.resize(this._fontSize, this._fontSize), this._textBuffer = new Array(1), this.text = t
    },
    initArg: function() {},
    updateTxt: function() {
        var t, e, i, s = this._texture.ctx,
            n = 0,
            o = 0,
            h = 0,
            a = this._textBuffer.length;
        if (this._bitmapFont) {
            if (!this._bitmapFont.loaded) return;
            var r = this._bitmapFont.texture.canvas,
                l = this._bitmapFont.chars,
                u = null,
                c, d, m;
            for (i = this._bitmapFont.height, t = 0; a > t; t++) {
                for (m = this._textBuffer[t], c = m.length, d = 0, e = 0; c > e; e++) u = l[m.charCodeAt(e)], u && (d += u.kerning);
                d > n && (n = d)
            }
            for (this._texture.clear(), this._texture.resize(n, i * a), t = 0; a > t; t++) {
                for (m = this._textBuffer[t], c = m.length, e = 0; c > e; e++) u = l[m.charCodeAt(e)], u && (s.drawImage(r, u.x, u.y, u.width, u.height, o, h + u.offsetY, u.width, u.height), o += u.kerning);
                h += i, o = 0
            }
        } else {
            s.font = this._style + " " + this._fontSizePx + " " + this._font;
            var f;
            for (t = 0; a > t; t++) f = s.measureText(this._textBuffer[t]), f.width > n && (n = f.width);
            for (this._shadow && (n += 2 * this._shadowBlur, o += this._shadowBlur), i = 1.3 * this._fontSize, this._texture.resize(n, i * a), s.clearRect(0, 0, this.volume.initWidth, this.volume.initHeight), s.font = this._style + " " + this._fontSizePx + " " + this._font, s.fillStyle = this._color, s.textBaseline = "top", this._shadow && (s.shadowColor = this._shadowColor, s.shadowOffsetX = this._shadowOffsetX, s.shadowOffsetY = this._shadowOffsetY, s.shadowBlur = this._shadowBlur), this._outline && (s.lineWidth = this._outlineWidth, s.strokeStyle = this._outlineColor), t = 0; a > t; t++) s.fillText(this._textBuffer[t], o, h), this._outline && s.strokeText(this._textBuffer[t], h, h), h += i
        }
        this.renderer.needRender = !0
    },
    set text(t) {
        if (void 0 !== t)
            if ("number" == typeof t) this._text = t + "", this._textBuffer[0] = this._text;
            else {
                this._text = t;
                var e = t.indexOf("\n"); - 1 !== e ? this._textBuffer = t.split("\n") : this._textBuffer[0] = this._text
            } else this._text = "", this._textBuffer[0] = this._text;
        this.updateTxt()
    },
    get text() {
        return this._text
    },
    set font(t) {
        var e = meta.resources.getResource(t, Resource.Type.FONT);
        if (e) {
            if (this._bitmapFont = e, !e._loaded) return this._texture.clear(), e.subscribe(this._onFontEvent, this), void 0
        } else this._font = t, this._bitmapFont = null;
        this.updateTxt()
    },
    get font() {
        return this._font
    },
    set size(t) {
        this._fontSize = t, this._fontSizePx = t + "px", this.updateTxt()
    },
    get size() {
        return this._fontSize
    },
    set color(t) {
        this._color = t, this.updateTxt()
    },
    get color() {
        return this._color
    },
    set style(t) {
        this._style !== t && (this._style = t, this.updateTxt())
    },
    get style() {
        return this._style
    },
    set outlineColor(t) {
        this._outlineColor !== t && (this._outlineColor = t, this._outline = !0, this.updateTxt())
    },
    get outlineColor() {
        return this._outlineColor
    },
    set outlineWidth(t) {
        this._outlineWidth !== t && (this._outlineWidth = t, this._outline = !0, this.updateTxt())
    },
    get outlineWidth() {
        return this._outlineWidth
    },
    set outline(t) {
        this._outline !== t && (this._outline = t, this.updateTxt())
    },
    get outline() {
        return this._outline
    },
    set shadow(t) {
        this._shadow !== t && (this._shadow = t,
            this.updateTxt())
    },
    get shadow() {
        return this._shadow
    },
    set shadowColor(t) {
        this._shadowColor !== t && (this._shadowColor = t, this._shadow = !0, this.updateTxt())
    },
    get shadowColor() {
        return this._shadowColor
    },
    set shadowBlur(t) {
        this._shadowBlur !== t && (this._shadowBlur = t, this._shadow = !0, this.updateTxt())
    },
    get shadowBlur() {
        return this._shadowBlur
    },
    set shadowOffsetX(t) {
        this._shadowOffsetX !== t && (this._shadowOffsetX = t, this._shadow = !0, this.updateTxt())
    },
    set shadowOffsetY(t) {
        this._shadowOffsetY !== t && (this._shadowOffsetY = t, this._shadow = !0, this.updateTxt())
    },
    get shadowOffsetX() {
        return this._shadowOffsetY
    },
    get shadowOffsetY() {
        return this._shadowOffsetY
    },
    _onFontEvent: function(t, e) {
        this.updateTxt()
    },
    _bitmapFont: null,
    _text: "",
    _textBuffer: null,
    _font: "Tahoma",
    _fontSize: 12,
    _fontSizePx: "12px",
    _color: "#fff",
    _style: "",
    _outline: !1,
    _outlineColor: "#000",
    _outlineWidth: 1,
    _shadow: !0,
    _shadowColor: "#000",
    _shadowBlur: 3,
    _shadowOffsetX: 0,
    _shadowOffsetY: 0
}), "use strict", meta.class("Entity.Tiling", "Entity.Geometry", {
    onCreate: function(t) {
        var e = meta.camera.volume,
            i = new Resource.Texture;
        i.ctx.globalCompositeOperator = "copy", this.texture = i, this.tile(t)
    },
    draw: function(t) {
        var e = 0 | this.volume.minX,
            i = 0 | this.volume.minY;
        t.transform(this.volume.m11, this.volume.m12, this.volume.m21, this.volume.m22, 0 | this.volume.x, 0 | this.volume.y), t.beginPath(), t.rect(-this.volume.initPivotPosX, -this.volume.initPivotPosY, this.volume.width, this.volume.height), t.clip();
        for (var s = this.tileTexture.canvas, n = this.tileTexture.fullWidth, o = this.tileTexture.fullHeight, h = this._tileOffsetX, a = this._tileOffsetY, i = 0; i < this._drawTilesY; i++) {
            for (var e = 0; e < this._drawTilesX; e++) t.drawImage(s, h, a), h += n;
            h = this._tileOffsetX, a += o
        }
    },
    tile: function(t) {
        if (this.tileTexture && !this.tileTexture._loaded && this.tileTexture.unsubscribe(this), "string" == typeof t) {
            if (this.tileTexture = meta.resources.getTexture(t), !this.tileTexture) return console.warn("(Entity.Tiling.tile) Could not find texture with a name - " + t), void 0
        } else this.tileTexture = t;
        return this.tileTexture._loaded ? (this.updateTiling(), void 0) : (this.tileTexture.subscribe(this.onTextureEvent, this), void 0)
    },
    options: function(t) {
        this.tileX = t.tileX || 0, this.tileY = t.tileY || 0, void 0 !== t.wrap && (this.wrap = t.wrap);
        var e = t.follow || !1;
        e !== this.follow ? meta.subscribe(meta.Event.CAMERA_MOVE, this.onResize, this) : meta.unsubscribe(meta.Event.CAMERA_MOVE, this), this.follow = e, this.updateSize()
    },
    resize: function(t, e) {
        this._origWidth = t, this._origHeight = e, this._super(t, e), this.updateSize()
    },
    updateTiling: function() {
        if (this.tileTexture._loaded) {
            var t = this.tileTexture.fullWidth,
                e = this.tileTexture.fullHeight,
                i = this._scrollX,
                s = this._scrollY;
            if (this.follow) {
                var n = meta.camera.volume;
                i -= n.minX, s -= n.minY
            }
            0 === this.tileX ? i > 0 ? this._tileOffsetX = i % t - t : this._tileOffsetX = i % t : this._tileOffsetX = i, 0 === this.tileY ? s > 0 ? this._tileOffsetY = s % e - e : this._tileOffsetY = s % e : this._tileOffsetY = s, this._drawTilesX = Math.ceil((this._texture.fullWidth - this._tileOffsetX) / t), this._drawTilesY = Math.ceil((this._texture.fullHeight - this._tileOffsetY) / e), this._tileOffsetX -= this.volume.initPivotPosX, this._tileOffsetY -= this.volume.initPivotPosY, this.tileX > 0 && this._drawTilesX > this.tileX && (this._drawTilesX = this.tileX), this.tileY > 0 && this._drawTilesY > this.tileY && (this._drawTilesY = this.tileY), this.renderer.needRender = !0
        }
    },
    updateSize: function() {
        if (this.tileTexture && this.tileTexture._loaded) {
            var t = 1,
                e = 1;
            t = this._origWidth > 0 ? this._origWidth : 0 === this.tileX ? this.parent.width : this.tileTexture.fullWidth * this.tileX, e = this._origHeight > 0 ? this._origHeight : 0 === this.tileY ? this.parent.height : this.tileTexture.fullHeight * this.tileY, this._texture.resizeSilently(t, e), this.volume.resize(t, e), this.updateTiling()
        }
    },
    onTextureEvent: function(t, e) {
        e === Resource.Event.LOADED && (this.tileTexture.unsubscribe(this), this.updateSize())
    },
    onResize: function(t, e) {
        this.updateSize()
    },
    scroll: function(t, e) {
        this._scrollX = t, this._scrollY = e, this.updateTiling()
    },
    tileTexture: null,
    follow: !1,
    tileX: 0,
    tileY: 0,
    _scrollX: 0,
    _scrollY: 0,
    _tileScaleX: 1,
    _tileScaleY: 1,
    _drawTilesX: 0,
    _drawTilesY: 0,
    _tileOffsetX: 0,
    _tileOffsetY: 0,
    _origWidth: 0,
    _origHeight: 0
}), "use strict", meta.class("Entity.TilemapLayer", "Entity.Geometry", {
    draw: function(t) {
        if (this.parent.loaded) {
            var e = meta.camera.volume,
                i = Math.floor((e.minX - this.volume.minX) / this.tileWidth),
                s = Math.floor((e.minY - this.volume.minY) / this.tileHeight),
                n = Math.ceil((e.maxX - this.volume.minX) / this.tileWidth),
                o = Math.ceil((e.maxY - this.volume.minY) / this.tileHeight);
            0 > i && (i = 0), 0 > s && (s = 0), n > this.tilesX && (n = this.tilesX), o > this.tilesY && (o = this.tilesY);
            var h = Math.floor(this.volume.minX + i * this.tileWidth),
                a = Math.floor(this.volume.minY + s * this.tileHeight),
                r = 0,
                l, u = 0 | h,
                c = 0 | a;
            if (this._dataFlags)
                for (var d = 0, m = s; o > m; m++) {
                    r = i + m * this.tilesX;
                    for (var f = i; n > f; f++) {
                        if (l = this._dataInfo[r], l)
                            if (d = this._dataFlags[r], d) {
                                var v = 1,
                                    p = 1,
                                    _ = 0,
                                    g = 0;
                                t.save(), 536870912 & d ? (t.rotate(Math.PI / 2), 2147483648 & d && 1073741824 & d ? (v = -1, _ = this.tileWidth, g = this.tileHeight) : 2147483648 & d ? g = this.tileWidth : 1073741824 & d ? (v = -1, p = -1, _ = this.tileWidth) : p = -1) : (2147483648 & d && (v = -1, _ = this.tileWidth), 1073741824 & d && (p = -1, g = this.tileHeight)), t.scale(v, p), t.drawImage(l.canvas, l.posX, l.posY, this.tileWidth, this.tileHeight, u * v - _, c * p - g, this.tileWidth, this.tileHeight), t.restore()
                            } else t.drawImage(l.canvas, l.posX, l.posY, this.tileWidth, this.tileHeight, u, c, this.tileWidth, this.tileHeight);
                        r++, u += this.tileWidth
                    }
                    u = 0 | h, c += this.tileHeight
                } else
                    for (var m = s; o > m; m++) {
                        r = i + m * this.tilesX;
                        for (var f = i; n > f; f++) l = this._dataInfo[r++], l && t.drawImage(l.canvas, l.posX, l.posY, this.tileWidth, this.tileHeight, Math.floor(u), Math.floor(c), this.tileWidth, this.tileHeight), u += this.tileWidth;
                        u = h, c += this.tileHeight
                    }
        }
    },
    updateFromData: function() {
        this.totalTiles = this.tilesX * this.tilesY, this.resize(this.tilesX * this.tileWidth, this.tilesY * this.tileHeight);
        var t = this._data.length;
        this._dataInfo ? this._dataInfo.length !== t && (this._dataInfo.length = t) : this._dataInfo = new Array(t), this._tilesets = this.parent.tilesets, this._numTilesets = this._tilesets.length;
        for (var e = 0; t > e; e++) this._updateDataInfoCell(e);
        this.renderer.needRender = !0
    },
    _updateDataInfoCell: function(t) {
        var e = this._data[t];
        if (e) {
            if (536870912 & e || 1073741824 & e || 2147483648 & e) {
                this._dataFlags || (this._dataFlags = new Uint32Array(this._data.length));
                var i = 0;
                i |= 536870912 & e, i |= 1073741824 & e, i |= 2147483648 & e, this._dataFlags[t] = i, e &= 536870911
            }
            for (var s = this._tilesets[0], n = 1; n < this._numTilesets && !(e < this._tilesets[n].gid); n++) s = this._tilesets[n];
            this._dataInfo[t] = s.getCell(e)
        } else this._dataInfo[t] = null
    },
    setGid: function(t, e, i) {
        var s = t + e * this.tilesX;
        this._data[s] = i, this.parent.loaded && (this._updateDataInfoCell(s), this.renderer.needRender = !0)
    },
    getGid: function(t, e) {
        var i = t + e * this.tilesX;
        return 0 > i ? 0 : i >= this.totalTiles ? 0 : this.data[i]
    },
    gridFromWorldPos: function(t, e) {
        var i = Math.floor((t - this.volume.minX) / this.tileWidth),
            s = Math.floor((e - this.volume.minY) / this.tileHeight),
            n = i + s * this.tilesX;
        return 0 > n ? null : n >= this.totalTiles ? null : [i, s]
    },
    saveData: function() {
        if (!this.data) return console.warn("(Entity.Tilemap.saveData): No data available for saving"), void 0;
        this.savedData ? this.savedData.length !== this.totalTiles && (this.savedData.length = this.totalTiles) : this.savedData = new Uint32Array(this.totalTiles);
        for (var t = 0; t < this.totalTiles; t++) this.savedData[t] = this.data[t]
    },
    restoreData: function() {
        if (!this.savedData) return console.warn("(Entity.Tilemap.restoreData): No saved data available"), void 0;
        if (this.savedData.length !== this.totalTiles) return console.warn("(Entity.Tilemap.restoreData): Incompatible data saved"), this.savedData = null, void 0;
        for (var t = 0; t < this.totalTiles; t++) this.data[t] = this.savedData[t];
        this.updateFromData()
    },
    set data(t) {
        this._data = t, this.parent.loaded && this.updateFromData()
    },
    get data() {
        return this._data
    },
    name: "Undefined",
    tilesX: 0,
    tilesY: 0,
    totalTiles: 0,
    tileWidth: 0,
    tileHeight: 0,
    _data: null,
    _dataInfo: null,
    _dataFlags: null,
    _tilesets: null,
    _numTilesets: 0
}), meta.class("Entity.Tilemap", "Entity.Geometry", {
    initArg: function(t) {
        t && this.load(t)
    },
    load: function(t) {
        if (!t) return console.warn("(Entity.Tilemap.load): Invalid path specified"), void 0;
        var e = t.lastIndexOf(".") + 1,
            i = t.lastIndexOf("/"),
            s = t.substr(e);
        this.path = t, this.folderPath = t.substr(0, i + 1), this.loaded = !1, this.tilesets = [];
        var n = this,
            o = this["_parse_" + s];
        return o ? (meta.resources.loadFile(t, function(t) {
            o.call(n, t)
        }), void 0) : (console.warn("(Entity.Tilemap.load): Unsupported file format: " + s), void 0)
    },
    create: function(t, e, i, s) {
        this.tilesX = t, this.tilesY = e, this.tileWidth = i, this.tileHeight = s, this.resize(t * i, e * s), this.tilesets = [], this.detachAll()
    },
    createTileset: function(t, e, i, s) {
        if (1 > t) return console.warn("(Entity.Tilemap.createTileset): gid argument should be 1 or larger number"), void 0;
        var n = new meta.Tileset(this, t, e, i || 0, s || 0);
        this.tilesets.push(n)
    },
    createLayer: function(t, e, i, s) {
        var n = new Entity.TilemapLayer;
        return n.tilesX = t, n.tilesY = e, n.tileWidth = this.tileWidth, n.tileHeight = this.tileHeight, n.resize(t * this.tileWidth, e * this.tileHeight), this.attach(n), n.data = i, s && (n.name = s), n
    },
    finishLoading: function() {
        for (var t = this.children.length, e = 0; t > e; e++) this.children[e].updateFromData();
        this.loaded = !0
    },
    _parse_json: function(t) {
        var e = JSON.parse(t);
        this.create(e.width, e.height, e.tilewidth, e.tileheight);
        for (var i, s = e.tilesets, n = s.length, o = 0; n > o; o++) i = s[o], this.createTileset(i.firstgid, this.folderPath + i.image, i.tileWidth, i.tileHeight);
        var h, a, r = e.layers;
        for (n = r.length, o = 0; n > o; o++) a = r[o], h = this.createLayer(a.width, a.height, a.data, a.name), a.visible && (h.visible = a.visible);
        0 === this.numToLoad && (this.loaded = !0)
    },
    _parse_tmx: function(t) {
        var e = new DOMParser,
            i = e.parseFromString(t, "text/xml"),
            s = i.documentElement;
        this.create(parseInt(s.getAttribute("width")), parseInt(s.getAttribute("height")), parseInt(s.getAttribute("tilewidth")), parseInt(s.getAttribute("tilewidth")));
        for (var n = s.childNodes, o = n.length, h = 0; o > h; h++) s = n[h], 1 === s.nodeType && ("tileset" === s.nodeName ? this.createTileset(parseInt(s.getAttribute("firstgid")), this.folderPath + s.childNodes[1].getAttribute("source"), parseInt(s.getAttribute("tilewidth")), parseInt(s.getAttribute("tileheight"))) : "layer" === s.nodeName ? this._parse_tmx_layer(s) : "objectgroup" === s.nodeName);
        0 === this.numToLoad && (this.loaded = !0)
    },
    _parse_tmx_layer: function(t) {
        var e = t.getAttribute("name"),
            i = parseInt(t.getAttribute("width")),
            s = parseInt(t.getAttribute("height")),
            n = !0,
            o = t.getAttribute("visible");
        o && (n = parseInt(n));
        var h = t.firstElementChild,
            a = h.getAttribute("encoding"),
            r, l = i * s,
            u = new Uint32Array(l);
        if (a) {
            var c = null;
            if ("csv" !== a) return console.warn("(Entity.Tilemap._parse_tmx): Unsupported layer encoding used: " + a), void 0;
            if (c = h.textContent.split(","), c.length !== l) return console.warn("(Entity.Tilemap._parse_tmx): Layer resolution does not match with data size"), void 0;
            for (r = 0; l > r; r++) u[r] = parseInt(c[r])
        } else {
            var d = 0,
                m = h.childNodes;
            for (l = m.length, r = 0; l > r; r++) t = m[r], 1 === t.nodeType && (u[d++] = parseInt(t.getAttribute("gid")))
        }
        var f = this.createLayer(i, s, u, e);
        f.visible = n
    },
    getLayer: function(t) {
        if (!t) return null;
        if (!this.children) return null;
        for (var e = this.children.length, i = 0; e > i; i++)
            if (this.children[i].name === t) return this.children[i];
        return null
    },
    LayerFlag: {
        FLIP_HORIZONTALLY: 2147483648,
        FLIP_VERTICALLY: 1073741824,
        FLIP_DIAGONALLY: 536870912
    },
    tilesets: null,
    path: "",
    folderPath: "",
    numToLoad: 0,
    tilesX: 0,
    tilesY: 0,
    tileWidth: 0,
    tileHeight: 0
}), meta.Tileset = function(t, e, i, s, n) {
    this.parent = t, this.gid = e, this.tileWidth = s, this.tileHeight = n, this.tilesX = 0, this.tilesY = 0, this._texture = null, this.cells = null, this.texture = i
}, meta.Tileset.prototype = {
    _onTextureEvent: function(t, e) {
        e === Resource.Event.LOADED && (t.unsubscribe(this), this.updateTexture(), this.parent.numToLoad--, 0 === this.parent.numToLoad && this.parent.finishLoading())
    },
    updateTexture: function() {
        0 === this.tileWidth ? (this.tileWidth = this._texture.fullWidth, this.tilesX = 1) : this.tilesX = this._texture.fullWidth / this.tileWidth | 0, 0 === this.tileHeight ? (this.tileHeight = this._texture.fullHeight, this.tilesY = 1) : this.tilesY = this._texture.fullHeight / this.tileHeight | 0, this.cells = new Uint32Array(this.tilesX * this.tilesY)
    },
    getCell: function(t) {
        t -= this.gid;
        var e = this.cells[t];
        if (e) return e;
        var i = t % this.tilesX * this.tileWidth,
            s = (t / this.tilesX | 0) * this.tileHeight;
        return e = new this.Cell(this._texture.canvas, i, s), this.cells[t] = e, e
    },
    set texture(t) {
        if (t instanceof Resource.Texture) this._texture = t;
        else {
            var e = t.lastIndexOf("."),
                i = t.lastIndexOf("/"); - 1 === i && (i = 0);
            var s = t.substr(i + 1, e - i - 1),
                n = meta.resources.getTexture(s);
            n || (n = new Resource.Texture(t)), this._texture = n
        }
        this._texture.loaded ? this.updateTexture() : (this.parent.numToLoad++, this._texture.subscribe(this._onTextureEvent, this))
    },
    get texture() {
        return this._texture
    },
    Cell: function(t, e, i) {
        this.canvas = t, this.posX = e, this.posY = i
    }
}, "use strict", meta.class("Entity.ParticleEmitter", "Entity.Geometry", {
    onCreate: function() {
        this.particles = [], this.preset = "meteor"
    },
    update: function(t) {
        if (this.elapsed += t, this.elapsed > this.duration) return this.updating = !1, void 0;
        if (this.emissionRate > 0) {
            var e = 1 / this.emissionRate;
            this.emissionCounter += t;
            var i = Math.floor(this.emissionCounter / e);
            if (i > 0) {
                this.emissionCounter -= i * e, i > this.particles.length - this.numActive && (i = this.particles.length - this.numActive);
                for (var s = this.numActive + i, n = this.numActive; s > n; n++) this.initParticle(this.particles[n]);
                this.numActive = s
            }
        }
        for (var o, h = 0; h < this.numActive; h++) o = this.particles[h], o.life -= t, o.life <= 0 ? (this.numActive--, this.particles[h] = this.particles[this.numActive], this.particles[this.numActive] = o) : this.updateParticle(o, t);
        this.renderer.needRender = !0
    },
    initParticle: function(t) {
        t.x = meta.random.numberF(-1, 1) * this.xVar, t.y = meta.random.numberF(-1, 1) * this.yVar, t.life = this.life + meta.random.numberF(-1, 1) * this.lifeVar;
        var e = this.speed + meta.random.numberF(-1, 1) * this.speedVar,
            i = this.startAngle + meta.random.numberF(-1, 1) * this.startAngleVar;
        t.velX = Math.cos(Math.PI * i / 180) * e, t.vecY = -Math.sin(Math.PI * i / 180) * e, t.radialAccel = this.radialAccel + this.radialAccelVar * meta.random.numberF(-1, 1), t.tangentialAccel = this.tangentialAccel + this.tangentialAccelVar * meta.random.numberF(-1, 1), this._textureTinting && (t.color[0] = this.startColor[0] + this.startColorVar[0] * meta.random.numberF(-1, 1), t.color[1] = this.startColor[1] + this.startColorVar[1] * meta.random.numberF(-1, 1), t.color[2] = this.startColor[2] + this.startColorVar[2] * meta.random.numberF(-1, 1), t.color[3] = this.startColor[3] + this.startColorVar[3] * meta.random.numberF(-1, 1), this._endColor[0] = this.endColor[0] + this.endColorVar[0] * meta.random.numberF(-1, 1), this._endColor[1] = this.endColor[1] + this.endColorVar[1] * meta.random.numberF(-1, 1), this._endColor[2] = this.endColor[2] + this.endColorVar[2] * meta.random.numberF(-1, 1), this._endColor[3] = this.endColor[3] + this.endColorVar[3] * meta.random.numberF(-1, 1), t.colorDelta[0] = (this._endColor[0] - this.startColor[0]) / t.life, t.colorDelta[1] = (this._endColor[1] - this.startColor[1]) / t.life, t.colorDelta[2] = (this._endColor[2] - this.startColor[2]) / t.life, t.colorDelta[3] = (this._endColor[3] - this.startColor[3]) / t.life), t.scale = this.startScale + this.startScaleVar * meta.random.numberF(-1, 1);
        var s = this.endScale + this.endScaleVar * meta.random.numberF(-1, 1);
        t.scaleDelta = (s - t.scale) / t.life
    },
    updateParticle: function(t, e) {
        t.forcesX = this.gravityX * e, t.forcesY = this.gravityY * e, t.velX += t.forcesX, t.vecY += t.forcesY, t.x += t.velX * e, t.y += t.vecY * e, t.color && (t.color[0] += t.colorDelta[0] * e, t.color[1] += t.colorDelta[1] * e, t.color[2] += t.colorDelta[2] * e, t.color[3] += t.colorDelta[3] * e), t.scale += this.scaleDelta
    },
    draw: function(t) {
        if (this._texture.loaded) {
            var e = meta.time.deltaF,
                i = this.texture.canvas,
                s = this.volume.minX - .5 * i.width,
                n = this.volume.minY - .5 * i.height;
            this._textureAdditive ? t.globalCompositeOperation = "lighter" : t.globalCompositeOperation = "source-over";
            for (var o, h, a = 0; a < this.numActive; a++) o = this.particles[a], h = o.color, h[3] > 1 && (h[3] = 1), h[3] < 0 && (h[3] = 0), this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height), this._ctx.globalCompositeOperation = "source-over", this._ctx.globalAlpha = h[3], this._ctx.drawImage(i, 0, 0), this._ctx.globalCompositeOperation = "source-atop", this._ctx.fillStyle = "rgba(" + (0 | h[0]) + ", " + (0 | h[1]) + ", " + (0 | h[2]) + ", 1.0)", this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height), this._ctx.globalCompositeOperation = "source-over", this._ctx.globalAlpha = h[3], t.drawImage(this.texture.canvas, s + o.x, n + o.y)
        }
    },
    play: function() {
        this.updating = !0
    },
    pause: function() {
        this.updating = !1
    },
    togglePlay: function() {
        this.updating ? this.pause() : this.play()
    },
    reset: function() {
        this.numActive = 0, this.elapsed = 0
    },
    set texture(t) {
        t ? this._texture = t : (this._svgTexture || (this._svgTexture = new Resource.SVG, this._svgTexture.fillStyle = "white", this._svgTexture.circle(this._radius)), this._texture = this._svgTexture), this._texture.loaded ? this.updateTintCanvas() : this.texture.subscribe(this.onTextureEvent, this)
    },
    get texture() {
        return this._texture
    },
    updateTintCanvas: function() {
        this._canvas || (this._canvas = document.createElement("canvas"), this._ctx = this._canvas.getContext("2d")), this._canvas.width = this._texture.width, this._canvas.height = this._texture.height
    },
    onTextureEvent: function(t, e) {
        this.updateTintCanvas(), this._texture.unsubscribe(this)
    },
    set totalParticles(t) {
        var e = this.particles.length;
        this.particles.length = t;
        for (var i = e; t > i; i++) this.particles[i] = new this.Particle;
        this.numActive > t && (this.numActive = t)
    },
    get totalParticles() {
        return this.particles.length
    },
    set textureAdditive(t) {
        this._textureAdditive = t
    },
    get textureAdditive() {
        return this._textureAdditive
    },
    set textureTinting(t) {
        this._textureTinting = t
    },
    get textureTinting() {
        return this._textureTinting
    },
    set radius(t) {
        this._radius = t, this._texture === this._svgTexture && (this._svgTexture.clear(), this._svgTexture.circle(this._radius), this.updateTintCanvas())
    },
    get radius() {
        return this._radius
    },
    set preset(t) {
        var e = this.presets[t];
        for (var i in e) this[i] !== e[i] && (this[i] = e[i]);
        this.textureAdditive = this._textureAdditive
    },
    Particle: function() {
        this.life = 0, this.x = 0, this.y = 0, this.velX = 0, this.velY = 0, this.radialAccel = 0, this.tangentialAccel = 0, this.forcesX = 0, this.forcesY = 0, this.color = new Float32Array(4), this.colorDelta = new Float32Array(4), this.scale = 1, this.scaleDelta = 1
    },
    particles: null,
    numActive: 0,
    emissionRate: 0,
    emissionCounter: 0,
    elapsed: 0,
    duration: 1 / 0,
    life: 1,
    lifeVar: 0,
    xVar: 0,
    yVar: 0,
    speed: 0,
    speedVar: 0,
    startAngle: 0,
    startAngleVar: 0,
    startScale: 1,
    startScaleVar: 0,
    endScale: 1,
    endScaleVar: 0,
    gravityX: 0,
    gravityY: 0,
    radialAccel: 0,
    radialAccelVar: 0,
    tangentialAccel: 0,
    tangentialAccelVar: 0,
    startColor: null,
    startColorVar: null,
    endColor: null,
    endColorVar: null,
    _endColor: new Float32Array(4),
    _canvas: null,
    _ctx: null,
    _svgTexture: null,
    _radius: 10,
    _textureAdditive: !1,
    presets: {
        empty: {
            totalParticles: 50,
            emissionRate: 10,
            life: 1,
            lifeVar: 0
        },
        meteor: {
            totalParticles: 45,
            emissionRate: 40,
            life: 1,
            lifeVar: .1,
            xVar: 2,
            yVar: 2,
            speed: 15,
            speedVar: 5,
            angle: 90,
            angleVar: 360,
            gravityX: -200,
            gravityY: -200,
            radialAccel: 0,
            radialAccelVar: 0,
            tangentialAccel: 0,
            tangentialAccelVar: 0,
            startColor: [255, 42, 0, 1],
            startColorVar: [0, 0, 51, .1],
            endColor: [0, 0, 0, 1],
            endColorVar: [0, 0, 0, 0],
            scale: 1,
            scaleVar: 1,
            endScale: 1,
            endScaleVar: 1,
            textureAdditive: !0,
            radius: 10
        }
    }
}), "use strict";
var Component = {};
"use strict", Component.Anim = function(t) {
    this.owner = t
}, Component.Anim.prototype = {
    set: function(t) {
        return t ? (this.texture = t, t.frames > 1 ? (this.texture = t, this.fps = t.fps, this.__tAnim = 0, this.reverse ? this._frame = t.frames - 1 : this._frame = 0, this.autoPlay && meta.renderer.addAnim(this)) : -1 !== this.__index && meta.renderer.removeAnim(this), void 0) : (-1 !== this.__index && meta.renderer.removeAnim(this), this.texture = null, void 0)
    },
    play: function(t) {
        this.loop = t || !1, meta.renderer.addAnim(this)
    },
    pause: function() {
        meta.renderer.removeAnim(this)
    },
    resume: function() {
        meta.renderer.addAnim(this)
    },
    stop: function() {
        this.reverse ? this._frame = texture.frames - 1 : this._frame = 0, meta.renderer.removeAnim(this)
    },
    reset: function() {
        this.reverse ? this._frame = texture.frames - 1 : this._frame = 0, meta.renderer.addAnim(this)
    },
    onEnd: null,
    onCancel: null,
    update: function(t) {
        if (this.__tAnim += t, !(this.__tAnim < this.__delay)) {
            var e = this.__tAnim / this.__delay | 0;
            this.__tAnim -= e * this.__delay, this.reverse ? (this._frame -= e, this._frame < 0 && (this.pauseLastFrame ? (meta.renderer.removeAnim(this), this._frame = 0) : this.loop ? this._frame = (this.texture.frames + this._frame) % this.texture.frames : (meta.renderer.removeAnim(this), this._frame = this.texture.frames - 1), this.onEnd && this.onEnd.call(this.owner))) : (this._frame += e, this._frame >= this.texture.frames && (this.pauseLastFrame ? (meta.renderer.removeAnim(this), this._frame = this.texture.frames - 1) : this.loop ? this._frame = this._frame % this.texture.frames : (meta.renderer.removeAnim(this), this._frame = 0), this.onEnd && this.onEnd.call(this.owner))), this.owner.renderer.needRender = !0
        }
    },
    set frame(t) {
        this._frame = t, this.owner.renderer.needRender = !0
    },
    get frame() {
        return this._frame
    },
    set fps(t) {
        this._fps = t, this.__delay = 1 / (t * this._speed)
    },
    get fps() {
        return this._fps
    },
    set speed(t) {
        this._speed = t, this.__delay = 1 / (fps * this._speed)
    },
    get speed() {
        return this._speed
    },
    set paused(t) {
        t ? this.pause() : this.resume()
    },
    get paused() {
        return !0
    },
    loop: !0,
    reverse: !1,
    autoPlay: !0,
    pauseLastFrame: !1,
    _fps: 0,
    _speed: 1,
    _frame: 0,
    __index: -1,
    __delay: 0,
    __tAnim: 0
}, "use strict", meta.class("meta.Renderer", {
    init: function() {
        this.holder = new Entity.Geometry, this.staticHolder = new Entity.Geometry, this.entityFlags = Entity.Geometry.prototype.Flag, Entity.Geometry.prototype.renderer = this, Entity.Geometry.prototype.parent = this.holder
    },
    load: function() {
        this.engine = meta.engine, this.camera = meta.camera, this.cameraVolume = this.camera.volume, this.cameraDefault = this.camera, this.chn = {
            onDown: meta.createChannel(Entity.Event.INPUT_DOWN),
            onUp: meta.createChannel(Entity.Event.INPUT_UP),
            onClick: meta.createChannel(Entity.Event.CLICK),
            onDbClick: meta.createChannel(Entity.Event.DBCLICK),
            onDrag: meta.createChannel(Entity.Event.DRAG),
            onDragStart: meta.createChannel(Entity.Event.DRAG_START),
            onDragEnd: meta.createChannel(Entity.Event.DRAG_END),
            onHover: meta.createChannel(Entity.Event.HOVER),
            onHoverEnter: meta.createChannel(Entity.Event.HOVER_ENTER),
            onHoverExit: meta.createChannel(Entity.Event.HOVER_EXIT)
        }, meta.input.onDown.add(this.onInputDown, this, meta.Priority.HIGH), meta.input.onUp.add(this.onInputUp, this, meta.Priority.HIGH), meta.input.onMove.add(this.onInputMove, this, meta.Priority.HIGH), meta.input.onDbClick.add(this.onInputDbClick, this, meta.Priority.HIGH), meta.engine.onAdapt.add(this.onAdapt, this), meta.camera.onResize.add(this.onCameraResize, this), meta.camera.onMove.add(this.onCameraMove, this), this.holder.resize(this.camera.volume.width, this.camera.volume.height)
    },
    update: function(t) {
        this.entitiesRemove.length > 0 && (this._removeEntities(this.entitiesRemove), this.entitiesRemove.length = 0), this._removeUpdateEntities(), this._removeAnimEntities(), this._removePickingEntities(), this._removeTweens(), this.__updating = !0;
        for (var e = this.entitiesUpdate.length, i = 0; e > i; i++) this.entitiesUpdate[i].update(t);
        for (e = this.tweens.length, i = 0; e > i; i++) this.tweens[i].update(t);
        this.__updating = !1, this.needSortDepth && this.sort()
    },
    _removeEntities: function(t) {
        this._removeStartID = Number.MAX_SAFE_INTEGER, this._removeEntitiesGroup(t);
        for (var e, i = this._removeStartID + 1; i < this.numEntities; i++) e = this.entities[i], e && (this.entities[this._removeStartID++] = e);
        this.numEntities -= this._numRemove, this.entities.length = this.numEntities, this._numRemove = 0, this.needRender = !0
    },
    _removeEntitiesGroup: function(t) {
        var e, i, s = t.length;
        this._numRemove += s;
        for (var n = 0; s > n; n++)
            if (e = t[n], e) {
                for (i = 0; i < this.numEntities; i++)
                    if (this.entities[i] === e) {
                        this.entities[i] = null, i < this._removeStartID && (this._removeStartID = i);
                        break
                    } - 1 !== e.__updateIndex && (this.entitiesUpdateRemove.push(e), e.__updateIndex = -1), -1 !== e.__pickIndex && (this.entitiesPickingRemove.push(e), e.__pickIndex = -1), e.children && this._removeEntitiesGroup(e.children), e.removed && e._remove(), e.flags &= ~e.Flag.WILL_REMOVE
            }
    },
    _removeUpdateEntities: function() {
        var t = this.entitiesUpdateRemove.length;
        if (t > 0) {
            var e = this.entitiesUpdate.length,
                i = e - t;
            if (i > 0)
                for (var s, n = 0; t > n; n++) s = this.entitiesUpdate.indexOf(this.entitiesUpdateRemove[n]), i > s ? this.entitiesUpdate.splice(s, 1) : this.entitiesUpdate.pop();
            else this.entitiesUpdate.length = 0;
            this.entitiesUpdateRemove.length = 0
        }
    },
    _removeAnimEntities: function() {
        var t = this.entitiesAnimRemove.length;
        if (t > 0) {
            var e = this.entitiesAnim.length,
                i = e - t;
            if (i > 0)
                for (var s, n = 0; t > n; n++) s = this.entitiesAnim.indexOf(this.entitiesAnimRemove[n]), i > s ? this.entitiesAnim.splice(s, 1) : this.entitiesAnim.pop();
            else this.entitiesAnim.length = 0;
            this.entitiesAnimRemove.length = 0
        }
    },
    _removePickingEntities: function() {
        var t = this.entitiesPickingRemove.length;
        if (0 !== t) {
            var e = this.entitiesPicking.length,
                i = e - t;
            if (i > 0) {
                for (var s, n, o = Number.MAX_SAFE_INTEGER, h = 0; t > h; h++)
                    for (n = this.entitiesPickingRemove[h], s = 0; e > s; s++)
                        if (this.entitiesPicking[s] === n) {
                            this.entitiesPicking[s] = null, o > s && (o = s);
                            break
                        }
                var a;
                for (s = o + 1; e > s; s++) a = this.entitiesPicking[s], a && (this.entitiesPicking[o++] = a);
                this.entitiesPicking.length = i
            } else this.entitiesPicking.length = 0;
            this.entitiesPickingRemove.length = 0
        }
    },
    _removeTweens: function() {
        var t = this.tweensRemove.length;
        if (t > 0) {
            var e = this.tweens.length,
                i = e - t;
            if (i > 0)
                for (var s, n = 0; t > n; n++) s = this.tweens.indexOf(this.tweensRemove[n]), i > s ? this.tweens.splice(s, 1) : this.tweens.pop();
            else this.tweens.length = 0;
            this.tweensRemove.length = 0
        }
    },
    sort: function() {
        var t, e, i, s, n = this.entities.length;
        for (t = 0; n > t; t++)
            for (e = t; e > 0; e--) i = this.entities[e], s = this.entities[e - 1], i.totalZ < s.totalZ && (this.entities[e] = s, this.entities[e - 1] = i);
        for (n = this.entitiesPicking.length, t = 0; n > t; t++)
            for (e = t; e > 0; e--) i = this.entitiesPicking[e], s = this.entitiesPicking[e - 1], i.totalZ < s.totalZ && (this.entitiesPicking[e] = s, this.entitiesPicking[e - 1] = i);
        this.needSortDepth = !1, this.needRender = !0
    },
    addEntity: function(t, e) {
        if (t.flags |= t.Flag.ADDED, 0 === !t._z && (this.needSortDepth = !0), t.flags & t.Flag.UPDATING && (t.updating = !0), t.flags & t.Flag.PICKING && (t.picking = !0), t.__debug && this.numDebug++, t._updateAnchor(), e || t.flags & t.Flag.WILL_REMOVE) {
            var i = this.entitiesRemove.indexOf(t);
            this.entitiesRemove[i] = null, t.flags &= ~t.Flag.WILL_REMOVE, e = !0
        } else t._debugger || this.numEntities++, this.entities.push(t);
        if (t.children)
            for (var s = t.children, n = s.length, o = 0; n > o; o++) this.addEntity(s[o], e)
    },
    addEntities: function(t) {
        for (var e = t.length, i = 0; e > i; i++) this.addEntity(t[i], !1)
    },
    removeEntity: function(t) {
        t.flags & t.Flag.WILL_REMOVE || (t.flags |= t.Flag.WILL_REMOVE, t.flags &= ~t.Flag.ADDED, this.entitiesRemove.push(t))
    },
    removeEntities: function(t) {
        for (var e = t.length, i = 0; e > i; i++) this.removeEntity(t[i])
    },
    addAnim: function(t) {
        -1 === t.__index && (t.__index = this.entitiesAnim.push(t) - 1)
    },
    removeAnim: function(t) {
        -1 !== t.__index && (this.entitiesAnimRemove.push(t), t.__index = -1)
    },
    onInputDown: function(t, e) {
        this.enablePicking && (this._checkHover(t), this.hoverEntity && (t.entity = this.hoverEntity, this.pressedEntity = this.hoverEntity, this.pressedEntity.pressed = !0, this.pressedEntity._style && this.pressedEntity._onDown.call(this.pressedEntity, t), this.pressedEntity.onDown && this.pressedEntity.onDown.call(this.pressedEntity, t), this.chn.onDown.emit(t, Entity.Event.INPUT_DOWN)))
    },
    onInputUp: function(t, e) {
        this.enablePicking && (this._checkHover(t), this.hoverEntity && this.pressedEntity && (t.entity = this.hoverEntity, this.pressedEntity.pressed = !1, this.pressedEntity._style && this.pressedEntity._onUp.call(this.pressedEntity, e), this.pressedEntity.onUp && this.pressedEntity.onUp.call(this.pressedEntity, e), this.chn.onUp.emit(this.pressedEntity, Entity.Event.INPUT_UP), this.pressedEntity === this.hoverEntity && (this.pressedEntity._style && this.pressedEntity._onClick.call(this.pressedEntity, t), this.pressedEntity.onClick && this.pressedEntity.onClick.call(this.pressedEntity, t), this.chn.onClick.emit(t, Entity.Event.CLICK)), this.pressedEntity.dragged && (t.entity = this.pressedEntity, this.pressedEntity.dragged = !1, this.pressedEntity._style && this.pressedEntity._onDragEnd.call(this.pressedEntity, t), this.pressedEntity.onDragEnd && this.pressedEntity.onDragEnd.call(this.pressedEntity, t), this.chn.onDragEnd.emit(t, Entity.Event.DRAG_END), t.entity = this.hoverEntity), this.pressedEntity = null))
    },
    onInputMove: function(t, e) {
        return this.enablePicking ? (this._checkHover(t), this._checkDrag(t) ? (t.entity = this.hoverEntity, void 0) : (t.entity = this.hoverEntity, void 0)) : void 0
    },
    onInputDbClick: function(t, e) {
        this.enablePicking && (this._checkHover(t), this.hoverEntity ? (t.entity = this.hoverEntity, this.hoverEntity._style && this.hoverEntity._onDbClick.call(this.hoverEntity, t), this.hoverEntity.onDbClick && this.hoverEntity.onDbClick.call(this.hoverEntity, t), this.chn.onDbClick.emit(t, Entity.Event.DBCLICK)) : t.entity = null)
    },
    _checkHover: function(t) {
        for (var e, i = this.entitiesPicking.length, s = i - 1; s >= 0; s--)
            if (e = this.entitiesPicking[s], e.visible) {
                if (this.enablePixelPicking) {
                    if (e._static) {
                        if (!e.isPointInsidePx(t.screenX, t.screenY)) continue
                    } else if (!e.isPointInsidePx(t.x, t.y)) continue
                } else if (e._static) {
                    if (!e.isPointInside(t.screenX, t.screenY)) continue
                } else if (!e.isPointInside(t.x, t.y)) continue;
                return this.hoverEntity !== e ? (this.hoverEntity && (t.entity = this.hoverEntity, this.hoverEntity.hover = !1, this.hoverEntity._style && this.hoverEntity._onHoverExit.call(this.hoverEntity, t), this.hoverEntity.onHoverExit && this.hoverEntity.onHoverExit.call(this.hoverEntity, t), this.chn.onHoverExit.emit(t, Entity.Event.HOVER_EXIT)), t.entity = e, e.hover = !0, e._style && e._onHoverEnter.call(e, t), e.onHoverEnter && e.onHoverEnter.call(e, t), this.chn.onHoverEnter.emit(t, Entity.Event.HOVER_ENTER), this.hoverEntity = e) : (t.entity = e, e.onHover && e.onHover.call(e, t), this.chn.onHover.emit(t, Entity.Event.HOVER)), t.entity = null, void 0
            }
        this.hoverEntity && (t.entity = this.hoverEntity, this.hoverEntity.hover = !1, this.hoverEntity._style && this.hoverEntity._onHoverExit.call(this.hoverEntity, t), this.hoverEntity.onHoverExit && this.hoverEntity.onHoverExit.call(this.hoverEntity, t), this.chn.onHoverExit.emit(t, Entity.Event.HOVER_EXIT)), this.hoverEntity = null
    },
    _checkDrag: function(t) {
        return this.pressedEntity ? (t.entity = this.pressedEntity, this.pressedEntity.dragged ? (this.pressedEntity.onDrag && this.pressedEntity.onDrag.call(this.pressedEntity, t), this.chn.onDrag.emit(t, Entity.Event.DRAG)) : (this.pressedEntity.dragged = !0, this.pressedEntity._style && this.pressedEntity._onDragStart.call(this.pressedEntity, t), this.pressedEntity.onDragStart && this.pressedEntity.onDragStart.call(this.pressedEntity, t), this.chn.onDragStart.emit(t, Entity.Event.DRAG_START)), !1) : !0
    },
    onCameraResize: function(t, e) {
        this.holder.resize(t.width, t.height), this.staticHolder.resize(this.engine.width, this.engine.height);
        for (var i = this.entities.length, s = 0; i > s; s++) this.entities[s]._updateResize()
    },
    onCameraMove: function(t, e) {
        this.needRender = !0
    },
    onAdapt: function(t, e) {},
    getUniqueID: function() {
        return this.__uniqueID++
    },
    set bgColor(t) {
        this._bgColor = t, this.updateBgColor(), this.needRender = !0
    },
    get bgColor() {
        return this._bgColor
    },
    set transparent(t) {
        this._transparent = t, this.updateBgColor(), this.needRender = !0
    },
    get transparent() {
        return this._transparent
    },
    set needRender(t) {
        this._needRender = t
    },
    get needRender() {
        return this._needRender
    },
    addRender: function(t) {
        this._renderFuncs.push(t)
    },
    removeRender: function(t) {
        for (var e = this._renderFuncs.length, i = 0; e > i; i++)
            if (this._renderFuncs[i] === t) {
                this._renderFuncs[i] = this._renderFuncs[e - 1], this._renderFuncs.pop();
                break
            }
    },
    meta: meta,
    engine: null,
    chn: null,
    holder: null,
    staticHolder: null,
    entityFlags: null,
    camera: null,
    cameraVolume: null,
    cameraDefault: null,
    cameraUI: null,
    entities: [],
    entitiesRemove: [],
    numEntities: 0,
    _numRemove: 0,
    _removeStartID: 0,
    entitiesUpdate: [],
    entitiesUpdateRemove: [],
    entitiesAnim: [],
    entitiesAnimRemove: [],
    entitiesPicking: [],
    entitiesPickingRemove: [],
    hoverEntity: null,
    pressedEntity: null,
    enablePicking: !0,
    enablePixelPicking: !1,
    tweens: [],
    tweensRemove: [],
    _needRender: !0,
    needSortDepth: !1,
    _renderFuncs: [],
    currZ: 0,
    numDebug: 0,
    _bgColor: "#ddd",
    _transparent: !1,
    __uniqueID: 0,
    __updating: !1
}), "use strict", meta.class("meta.CanvasRenderer", "meta.Renderer", {
    init: function() {
        this._super(), this.ctx = meta.engine.canvas.getContext("2d"), meta.engine.ctx = this.ctx
    },
    render: function(t, e) {
        for (var i = this.entitiesAnim.length, s = 0; i > s; s++) this.entitiesAnim[s].update(t);
        if (this.needRender) {
            this.clear(), this.ctx.save();
            var n = this.camera._zoom;
            for (this.ctx.setTransform(n, 0, 0, n, -Math.floor(this.cameraVolume.x * n), -Math.floor(this.cameraVolume.y * n)), i = this.entities.length, s = 0; i > s; s++) this.drawEntity(this.entities[s]);
            var o = this._renderFuncs.length;
            for (s = 0; o > s; s++) this._renderFuncs[s].render(t);
            var h = null,
                a = this.meta.engine.flags & this.meta.engine.Flag.READY;
            if (a && (this.meta.cache.debug || this.numDebug > 0)) {
                for (this.ctx.save(), this.ctx.lineWidth = 2, this.ctx.strokeStyle = "red",
                    this.ctx.fillStyle = "red", s = 0; i > s; s++)
                    if (h = this.entities[s], h.flags & this.entityFlags.DEBUG || this.meta.cache.debug)
                        if (h._static) {
                            var n = this.camera._zoom;
                            h._debugger ? this.ctx.setTransform(1, 0, 0, 1, 0, 0) : this.ctx.setTransform(n, 0, 0, n, 0, 0), this.drawVolume(h), this.ctx.setTransform(n, 0, 0, n, -Math.floor(this.cameraVolume.x * n), -Math.floor(this.cameraVolume.y * n))
                        } else this.drawVolume(h);
                this.ctx.restore()
            }
            this.needRender = !1, this.ctx.restore()
        }
    },
    clear: function() {
        this._transparent ? this.ctx.clearRect(0, 0, this.engine.width, this.engine.height) : (this.ctx.fillStyle = this._bgColor, this.ctx.fillRect(0, 0, this.engine.width, this.engine.height))
    },
    drawEntity: function(t) {
        if (t._visible)
            if (t._static) {
                var e = this.camera._zoom;
                t._debugger ? this.ctx.setTransform(1, 0, 0, 1, 0, 0) : this.ctx.setTransform(e, 0, 0, e, 0, 0), t.draw ? (this.ctx.save(), t.draw(this.ctx), this.ctx.restore()) : this._drawEntity(t), this.ctx.setTransform(e, 0, 0, e, -Math.floor(this.cameraVolume.x * e), -Math.floor(this.cameraVolume.y * e))
            } else t.draw ? (this.ctx.save(), t.draw(this.ctx), this.ctx.restore()) : this._drawEntity(t)
    },
    _drawEntity: function(t) {
        var e = t._texture;
        if (e && t._texture._loaded) {
            var i = t.volume,
                s = t.anim;
            if (t.clipVolume && (this.ctx.save(), this.ctx.beginPath(), t.flags & this.entityFlags.CLIP_BOUNDS ? this.ctx.rect(Math.floor(t.volume.minX), Math.floor(t.volume.minY), t.clipVolume.width, t.clipVolume.height) : this.ctx.rect(Math.floor(t.clipVolume.minX), Math.floor(t.clipVolume.minY), t.clipVolume.width, t.clipVolume.height), this.ctx.closePath(), this.ctx.clip()), t.flags & t.Flag.DYNAMIC_CLIP) return i.width > 0 && i.height > 0 && this.ctx.drawImage(e.canvas, 0, 0, i.width, i.height, Math.floor(i.minX), Math.floor(i.minY), i.width, i.height), void 0;
            if (i.__transformed) {
                this.ctx.globalAlpha = t.totalAlpha, this.ctx.transform(i.m11, i.m12, i.m21, i.m22, Math.floor(i.x), Math.floor(i.y)), e.frames > 1 ? e.drawFrame(this.ctx, -i.initPivotPosX, -i.initPivotPosY, s._frame) : e.fromAtlas ? this.ctx.drawImage(e.ptr.canvas, e.x, e.y, e.fullWidth, e.fullHeight, -i.initPivotPosX, -i.initPivotPosY, e.fullWidth, e.fullHeight) : this.ctx.drawImage(e.canvas, -i.initPivotPosX, -i.initPivotPosY), this.ctx.globalAlpha = 1;
                var n = this.camera._zoom;
                this.ctx.setTransform(n, 0, 0, n, -Math.floor(this.camera.volume.x * n), -Math.floor(this.camera.volume.y * n))
            } else e.frames > 1 ? e.drawFrame(this.ctx, Math.floor(i.minX), Math.floor(i.minY), s._frame) : e.fromAtlas ? this.ctx.drawImage(e.ptr.canvas, e.x, e.y, e.fullWidth, e.fullHeight, Math.floor(i.minX), Math.floor(i.minY), e.fullWidth, e.fullHeight) : this.ctx.drawImage(e.canvas, Math.floor(i.minX), Math.floor(i.minY));
            t.clipVolume && this.ctx.restore()
        }
    },
    drawVolume: function(t) {
        if (t._visible && !t._debugger) {
            var e = t.volume;
            0 === e.__type ? this._drawVolume(e) : (this.ctx.save(), this.ctx.translate(Math.floor(e.x), Math.floor(e.y)), this.ctx.rotate(t.volume.angle), this.ctx.translate(-Math.floor(e.x), -Math.floor(e.y)), this._drawVolume(e), this.ctx.restore())
        }
    },
    _drawVolume: function(t) {
        var e = Math.floor(t.minX),
            i = Math.floor(t.minY),
            s = Math.ceil(t.maxX),
            n = Math.ceil(t.maxY - 1);
        this.ctx.beginPath(), this.ctx.moveTo(e, i), this.ctx.lineTo(s, i), this.ctx.lineTo(s, n), this.ctx.lineTo(e, n), this.ctx.lineTo(e, i - 1), this.ctx.stroke(), this.ctx.fillRect(t.x - 3, t.y - 3, 6, 6)
    },
    updateBgColor: function() {}
}), "use strict", meta.Debugger = function() {
    this.holder = null, this.txt = null, this.fps = 0, this.memory = 0, this.numEntities = 0, this.created = !1, this.init()
}, meta.Debugger.prototype = {
    init: function() {
        meta.engine.onDebug.add(this.onDebug, this)
    },
    create: function() {
        this.view = meta.getView("debugger"), this.view.static = !0, this.view.z = 1e6;
        var t = new Resource.SVG;
        t.fillStyle = "#000", t.fillRect(0, 0, 200, 290), this.holder = new Entity.Geometry(t), this.holder.parent = meta.renderer.staticHolder, this.holder.anchor(0, 1), this.holder.position(0, -290), this.holder.alpha = .8, this.holder.z = 1e4, this.holder.debugger = !0, this.view.attach(this.holder);
        var e = new Entity.Text;
        e.position(10, 10), e.text = "fps: 60", this.holder.attach(e);
        var i = new Entity.Text;
        i.position(10, 25), this.holder.attach(i);
        var s = new Entity.Text;
        s.position(10, 40), s.text = "entities: 0", this.holder.attach(s);
        var n = new Entity.Text;
        n.position(10, 65), this.holder.attach(n);
        var o = new Entity.Text;
        o.text = "world:", o.position(10, 90), this.holder.attach(o);
        var h = new Entity.Text;
        h.position(20, 105), this.holder.attach(h);
        var a = new Entity.Text;
        a.position(20, 120), this.holder.attach(a);
        var r = new Entity.Text;
        r.position(20, 135), this.holder.attach(r);
        var l = new Entity.Text;
        l.text = "camera:", l.position(10, 155), this.holder.attach(l);
        var u = new Entity.Text;
        u.position(20, 170), this.holder.attach(u);
        var c = new Entity.Text;
        c.position(20, 185), this.holder.attach(c);
        var d = new Entity.Text;
        d.position(20, 200), this.holder.attach(d);
        var m = new Entity.Text;
        m.position(20, 215), this.holder.attach(m);
        var f = new Entity.Text;
        f.text = "cursor:", f.position(10, 235), this.holder.attach(f);
        var v = new Entity.Text;
        v.position(20, 250), this.holder.attach(v);
        var p = new Entity.Text;
        p.position(20, 265), this.holder.attach(p), this.txt = {
            fps: e,
            memory: i,
            entities: s,
            resolution: n,
            worldBoundsMin: h,
            worldBoundsMax: a,
            worldResolution: r,
            cameraBoundsMin: u,
            cameraBoundsMax: c,
            cameraResolution: d,
            cameraZoom: m,
            world: v,
            screen: p
        }, this.created = !0
    },
    load: function() {
        this.view.active = !0;
        var t = this;
        this.timer = meta.addTimer(this, function() {
            t.updateTxt()
        }, 1e3), meta.input.onInputMove.add(this.onInputMove, this), meta.engine.onResize.add(this.onResize, this), meta.world.onResize.add(this.onWorldResize, this), meta.camera.onResize.add(this.onCameraResize, this), meta.camera.onMove.add(this.onCameraMova, this), this.updateTxt(), this.onCameraMove(meta.camera, 0), this.onCameraResize(meta.camera, 0), this.onResize(meta.engine), this.onWorldResize(meta.world, 0), this.onInputMove(Input.ctrl, 0)
    },
    unload: function() {
        meta.input.onInputMove.remove(this), meta.engine.onResize.remove(this), meta.world.onResize.remove(tthis), meta.camera.onResize.remove(this), meta.camera.onMove.remove(this), this.timer.stop(), this.view.active = !1
    },
    updateTxt: function() {
        var t = meta.engine.fps;
        t !== this.fps && (this.txt.fps.text = "fps: " + t, this.fps = t);
        var e = (window.performance.memory.usedJSHeapSize / 1048576).toFixed(2);
        e !== this.memory && (this.txt.memory.text = "memory: " + e + "mb", this.memory = e);
        var i = meta.renderer.numEntities;
        i !== this.numEntities && (this.txt.entities.text = "entities: " + i, this.numEntities = i)
    },
    onDebug: function(t, e) {
        t ? (this.created || this.create(), this.load()) : this.unload()
    },
    onInputMove: function(t, e) {
        this.txt.world.text = "world: " + t.x + ", " + t.y, this.txt.screen.text = "screen: " + t.screenX + ", " + t.screenY
    },
    onCameraMove: function(t, e) {
        var i = t.volume;
        this.txt.cameraBoundsMin.text = "boundsMin: " + Math.round(i.minX) + ", " + Math.round(i.minY), this.txt.cameraBoundsMax.text = "boundsMax: " + Math.round(i.maxX) + ", " + Math.round(i.maxY), this.txt.cameraResolution.text = "width: " + i.width + ", height: " + i.height
    },
    onCameraResize: function(t, e) {
        this.txt.cameraZoom.text = "zoom: " + t.zoom.toFixed(3)
    },
    onResize: function(t, e) {
        this.txt.resolution.text = "width: " + t.width + ", height: " + t.height
    },
    onWorldResize: function(t, e) {
        var i = t.volume;
        this.txt.worldBoundsMin.text = "boundsMin: " + Math.round(i.minX) + ", " + Math.round(i.minY), this.txt.worldBoundsMax.text = "boundsMax: " + Math.round(i.maxX) + ", " + Math.round(i.maxY), this.txt.worldResolution.text = "width: " + i.width + ", height: " + i.height
    }
}, "use strict", meta.class("Entity.SVG", "Entity.Geometry", {set lineWidth(t) {
        this._lineWidth = t, this.renderer.needRender = !0
    },
    get lineWidth() {
        return this._lineWidth
    },
    set strokeStyle(t) {
        this._strokeStyle = t, this.renderer.needRender = !0
    },
    get strokeStyle() {
        return this._strokeStyle
    },
    set fillStyle(t) {
        this._fillStyle = t, this.renderer.needRender = !0
    },
    get fillStyle() {
        return this._fillStyle
    },
    _lineWidth: 2,
    _strokeStyle: "",
    _fillStyle: ""
}), "use strict", meta.class("Entity.Line", "Entity.SVG", {
    draw: function(t) {
        this.globalAlpha = this._alpha, t.lineWidth = this._lineWidth, t.strokeStyle = this._strokeStyle, t.beginPath(), t.moveTo(this.volume.x, this.volume.y), t.lineTo(this.toX, this.toY), t.stroke(), this.globalAlpha = 1
    },
    to: function(t, e) {
        (this.toX !== t || this.toY !== e) && (this.toX = t, this.toY = e, this.renderer.needRender = !0)
    },
    toX: 0,
    toY: 0
}), "use strict", meta.class("Entity.Rect", "Entity.SVG", {
    draw: function(t) {
        t.beginPath(), t.rect(this.volume.minX, this.volume.minY, this.volume.width, this.volume.height), this._fillStyle && (t.fillStyle = this._fillStyle, t.fill()), (this._strokeStyle || !this._fillStyle) && (t.lineWidth = this._lineWidth, t.strokeStyle = this._strokeStyle, t.stroke())
    }
}), "use strict", meta.class("Entity.Circle", "Entity.SVG", {
    init: function() {
        this.pivot(.5), this.volume.resize(2 * this.radius, 2 * this._radius)
    },
    draw: function(t) {
        t.globalAlpha = this._alpha, t.beginPath(), t.arc(this.volume.x, this.volume.y, this.radius, 0, 2 * Math.PI, !1), this._fillStyle && (t.fillStyle = this._fillStyle, t.fill()), (this._strokeStyle || !this._fillStyle) && (t.lineWidth = this._lineWidth, t.strokeStyle = this._strokeStyle, t.stroke())
    },
    set radius(t) {
        this._radius = t, this.volume.resize(2 * t, 2 * t), this.updateTotalOffset()
    },
    get radius() {
        return this._radius
    },
    _radius: 20
}), "use strict", meta.class("Entity.Gradient", "Entity.Geometry", {
    init: function() {
        this.clear()
    },
    draw: function(t) {
        t.fillStyle = this._gradient, t.fillRect(0 | this.volume.minX, 0 | this.volume.minY, 0 | this.volume.width, 0 | this.volume.height)
    },
    clear: function() {
        this._gradient = meta.engine.ctx.createLinearGradient(0, 0, 0, this.volume.height), this._points = []
    },
    colorStops: function(t) {
        for (var e = meta.engine.ctx.createLinearGradient(0, 0, 0, this.volume.height), i = t.length, s = 0; i > s; s += 2) e.addColorStop(t[s], t[s + 1]);
        this._gradient = e, this.renderer.needDraw = !0
    },
    _updateResize: function() {
        this._gradient = meta.engine.ctx.createLinearGradient(0, 0, 0, this.volume.height), this._super()
    },
    set gradient(t) {
        t || (t = meta.engine.ctx.createLinearGradient(0, 0, 0, this.volume.height)), this._gradient = t, this.renderer.needDraw = !0
    },
    get gradient() {
        return this._gradient
    },
    Point: function(t, e) {
        this.point = t, this.hex = e
    },
    _gradient: null,
    _points: null
}), "use strict", meta.plugin("Physics", {
    init: function() {
        this.manifold = new this.Manifold, meta.engine.onDebug.add(this.onDebug, this)
    },
    update: function(t) {
        for (var e = null, i = null, s = this.bodies.length, n = 0; s > n; n++) e = this.bodies[n], e.updateBody(t), this.bodyVsWorld(e);
        var o, h = 0;
        for (n = 0; s > n; n++) {
            for (e = this.bodies[n], h = n + 1; s > h; h++) i = this.bodies[h], (0 !== e._mass || 0 !== i._mass) && this.bodyVsBody(e, i) && (e.colliding = !0, i.colliding = !0, e.owner.onCollision && (this.manifold.entity = i.owner, e.owner.onCollision(this.manifold)), i.owner.onCollision && (this.manifold.entity = e.owner, i.owner.onCollision(this.manifold)));
            o = e.owner, o.position(e.volume.x - o.totalOffsetX, e.volume.y - o.totalOffsetY)
        }
    },
    bodyVsWorld: function(t) {
        if (t.worldBounds) {
            var e = meta.world,
                i = t.volume,
                s = i.x,
                n = i.y,
                o = !1,
                h = meta.world.shapes;
            if (h)
                for (var a, r = h.length, l = 0; r > l; l++) {
                    a = h[l];
                    var u = a.x - i.x,
                        c = a.y - i.y,
                        d = a.radius - i.radius,
                        m = u * u + c * c;
                    if (m >= d * d) {
                        var f = Math.sqrt(m);
                        0 !== f ? (this.manifold.penetration = d - f, this.manifold.normal.x = -u / f, this.manifold.normal.y = -c / f) : (this.manifold.penetration = volume1.radius, this.manifold.normal.x = 1, this.manifold.normal.y = 0), i.move(this.manifold.penetration * this.manifold.normal.x, this.manifold.penetration * this.manifold.normal.y);
                        var v = t.velocity.dot(this.manifold.normal);
                        t.velocity.x -= 2 * v * this.manifold.normal.x, t.velocity.y -= 2 * v * this.manifold.normal.y
                    }
                }
            i.minX < 0 ? (s = i.x - i.minX, this.manifold.normal.x = 1, o = !0, t.bouncing ? t.velocity.x *= -1 : t.velocity.x = 0) : i.maxX > e.width ? (s += e.width - i.maxX, this.manifold.normal.x = -1, o = !0, t.bouncing ? t.velocity.x *= -1 : t.velocity.x = 0) : this.manifold.normal.x = 0, i.minY < 0 ? (n = i.y - i.minY, this.manifold.normal.y = 1, o = !0, t.bouncing ? t.velocity.y *= -1 : t.velocity.y = 0) : i.maxY > e.height ? (n += e.height - i.maxY, this.manifold.normal.y = -1, o = !0, t.bouncing ? t.velocity.y *= -1 : t.velocity.y = 0) : this.manifold.normal.y = 0, o && (i.position(s, n), t.owner.onCollision && (this.manifold.entity = null, t.colliding = !0, t.owner.onCollision.call(t.owner, this.manifold)))
        }
    },
    bodyVsBody: function(t, e) {
        var i = t.volume.type,
            s = e.volume.type;
        if (0 === i) {
            if (0 === s) return this.boxVsBox(t, e);
            if (1 === s) return this.boxVsCircle(t, e)
        } else if (1 === i) {
            if (0 === s) return this.boxVsCircle(e, t);
            if (1 === s) return this.circleVsCircle(t, e)
        }
        return !1
    },
    boxVsBox: function(t, e) {
        var i = t.volume,
            s = e.volume,
            n = s.minX + s.halfWidth - (i.minX + i.halfWidth),
            o = i.halfWidth + s.halfWidth - Math.abs(n);
        if (0 >= o) return !1;
        var h = s.minY + s.halfHeight - (i.minY + i.halfHeight),
            a = i.halfHeight + s.halfHeight - Math.abs(h);
        return 0 >= a ? !1 : (a > o ? (0 > n ? this.manifold.normal.set(-1, 0) : this.manifold.normal.set(1, 0), this.manifold.penetration = o) : (0 > h ? this.manifold.normal.set(0, -1) : this.manifold.normal.set(0, 1), this.manifold.penetration = a), 0 === e._mass && i.move(-this.manifold.penetration * this.manifold.normal.x, -this.manifold.penetration * this.manifold.normal.y), 0 === t._mass && s.move(this.manifold.penetration * this.manifold.normal.x, this.manifold.penetration * this.manifold.normal.y), !0)
    },
    circleVsCircle: function(t, e) {
        var i = t.volume,
            s = e.volume,
            n = s.x - i.x,
            o = s.y - i.y,
            h = i.radius + s.radius,
            a = n * n + o * o;
        if (a > h * h) return !1;
        var r = Math.sqrt(a);
        0 !== r ? (this.manifold.penetration = h - r, this.manifold.normal.x = -n / r, this.manifold.normal.y = -o / r) : (this.manifold.penetration = i.radius, this.manifold.normal.x = 1, this.manifold.normal.y = 0);
        var l = 1 / (t._mass + e._mass),
            u = this.manifold.penetration * t._mass * l;
        return i.move(u * this.manifold.normal.x, u * this.manifold.normal.y), u = this.manifold.penetration * e._mass * l, s.move(u * -this.manifold.normal.x, u * -this.manifold.normal.y), t.velocity.reflect(this.manifold.normal), e.velocity.reflect(this.manifold.normal), !0
    },
    boxVsCircle: function(t, e) {
        var i = t.volume,
            s = e.volume,
            n = s.x - (i.minX + i.halfWidth),
            o = s.y - (i.minY + i.halfHeight),
            h = .5 * (i.maxX - i.minX),
            a = .5 * (i.maxY - i.minY),
            r = Math.min(Math.max(n, -h), h),
            l = Math.min(Math.max(o, -a), a);
        if (n === r && o === l) Math.abs(n) > Math.abs(o) ? (this.manifold.normal.y = 0, 0 > n ? (this.manifold.normal.x = -1, this.manifold.penetration = i.halfWidth + n + s.radius) : (this.manifold.normal.x = 1, this.manifold.penetration = i.halfWidth - n + s.radius)) : (this.manifold.normal.x = 0, 0 > o ? (this.manifold.normal.y = -1, this.manifold.penetration = i.halfHeight + o + s.radius) : (this.manifold.normal.y = 1, this.manifold.penetration = i.halfHeight - o + s.radius));
        else {
            var u = n - r,
                c = o - l,
                d = u * u + c * c;
            if (d > s.radius * s.radius) return !1;
            this.manifold.penetration = Math.sqrt(d) - s.radius, this.manifold.normal.x = -u, this.manifold.normal.y = -c, this.manifold.normal.normalize()
        }
        var m = 1 / (t._mass + e._mass),
            f = this.manifold.penetration * t._mass * m;
        return i.move(f * -this.manifold.normal.x, f * -this.manifold.normal.y), f = this.manifold.penetration * e._mass * m, s.move(f * this.manifold.normal.x, f * this.manifold.normal.y), t.bouncing && t.velocity.reflect(this.manifold.normal), e.bouncing && e.velocity.reflect(this.manifold.normal), !0
    },
    render: function(t) {
        var e = meta.renderer.ctx;
        e.save(), e.fillStyle = this.debugColor, e.globalAlpha = .4;
        for (var i = this.bodies.length, s = 0; i > s; s++) this.drawVolume(e, this.bodies[s].volume);
        e.restore()
    },
    drawVolume: function(t, e) {
        0 === e.type ? t.fillRect(Math.floor(e.minX), Math.floor(e.minY), e.width, e.height) : 1 === e.type && (t.beginPath(), t.arc(Math.floor(e.x), Math.floor(e.y), e.radius, 0, 2 * Math.PI, !1), t.fill())
    },
    add: function(t) {
        return t ? -1 !== t.__index ? (console.warn("(Physics) Body is already in use"), void 0) : (t.__index = this.bodies.length, this.bodies.push(t), void 0) : (console.warn("(Physics) Invalid body passed"), void 0)
    },
    remove: function(t) {
        if (!t) return console.warn("(Physics) Invalid body passed"), void 0;
        if (-1 === t.__index) return console.warn("(Physics) Body is not in use"), void 0;
        var e = this.bodies[this.bodies.length - 1];
        e.__index = t.__index, this.bodies[t.__index] = e, this.bodies.pop()
    },
    onDebug: function(t, e) {
        t ? meta.renderer.addRender(this) : meta.renderer.removeRender(this)
    },
    Manifold: function() {
        this.entity = null, this.normal = new meta.math.Vector2(0, 0), this.penetration = 0
    },
    bodies: [],
    gravity: new meta.math.Vector2(0, 0),
    wind: new meta.math.Vector2(0, 0),
    friction: 25,
    manifold: null,
    _relativeVel: new meta.math.Vector2(0, 0),
    _impulseX: 0,
    _impulseY: 0,
    _percent: .8,
    _slop: .01,
    debugColor: "#00ff00"
}), "use strict", meta.class("Physics.Body", {
    init: function() {
        this.velocity = new meta.math.Vector2(0, 0), this.acceleration = new meta.math.Vector2(0, 0), this.speed = new meta.math.Vector2(0, 0)
    },
    load: function() {
        this._volume = this.owner.volume, Physics.bodies.push(this)
    },
    unload: function() {},
    updateItem: function(t) {
        if (this.colliding = !1, this.volume.position(this.owner.volume.x, this.owner.volume.y), this.haveTarget) {
            var e = meta.math.length(this.volume.x, this.volume.y, this.targetX, this.targetY);
            e <= this.speed * t ? (this.volume.position(this.targetX, this.targetY), this.stop()) : (this._vec.x = this.targetX - this.volume.x, this._vec.y = this.targetY - this.volume.y, this._vec.normalize(), this.velocity.x = this._vec.x * this.speed, this.velocity.y = this._vec.y * this.speed)
        }
        this.velocity.x += this.acceleration.x * t, this.velocity.y += this.acceleration.y * t, this.volume.move(this.velocity.x * t, this.velocity.y * t), this.acceleration.x = 0, this.acceleration.y = 0
    },
    applyForce: function(t) {
        this.acceleration.x += t.x / this.invMass, this.acceleration.y += t.y / this.invMass
    },
    moveTo: function(t, e, i, s) {
        this.targetX = t, this.targetY = e, this.haveTarget = !0, this.speed = i || 600, this.moveToCB = s || null
    },
    stop: function() {
        this.speed = 0, this.velocity.x = 0, this.velocity.y = 0, this.haveTarget && (this.haveTarget = !1, this.moveToCB && (this.moveToCB.call(this.owner), this.moveToCB = null)), this.onStop && this.onStop.call(this.owner)
    },
    onStop: null,
    set volume(t) {
        t instanceof meta.math.Circle ? this.type = 1 : this.type = 0, this._volume = t, this._volume.position(this.owner.volume.x, this.owner.volume.y)
    },
    get volume() {
        return this._volume
    },
    set mass(t) {
        this._mass = t, 0 === t ? this.invMass = 0 : this.invMass = 1 / t
    },
    get mass() {
        return this._mass
    },
    type: 0,
    _volume: null,
    _mass: 1,
    invMass: 1,
    restitution: .6,
    velocity: null,
    moveX: 0,
    moveY: 0,
    worldBounds: !1,
    ghost: !1,
    bouncing: !1,
    colliding: !1,
    targetX: 0,
    targetY: 0,
    haveTarget: !1,
    moveToCB: null,
    maxSpeed: Number.MAX_VALUE,
    acceleration: null,
    accelerationMod: 1,
    _vec: new meta.math.Vector2(0, 0)
}), "use strict", meta.class("UI.Controller", "meta.Controller", {
    onFirstReady: function() {
        var t = new Resource.Texture;
        t.fillRect({
            color: "#111",
            width: 120,
            height: 30
        });
        var e = new Resource.Texture;
        e.fillRect({
            color: "#ff0000",
            width: 120,
            height: 30
        }), this.coreStyle = {
            button: {
                "*:hover": {
                    cursor: "pointer"
                },
                "*:pressed, *:drag": {
                    cursor: "pointer",
                    offsetX: 1,
                    offsetY: 1
                }
            },
            checkbox: {
                "*:hover": {
                    cursor: "pointer"
                },
                "*:pressed, *:drag": {
                    cursor: "pointer",
                    offsetX: 1,
                    offsetY: 1
                }
            }
        }, this.style = {
            button: {
                "*": {
                    texture: t
                },
                "*:hover": {
                    texture: e,
                    cursor: "pointer"
                },
                "*:pressed": {
                    texture: e,
                    cursor: "pointer",
                    offsetX: 1,
                    offsetY: 1
                }
            },
            checkbox: {
                "*": {
                    texture: t
                },
                "*:hover": {
                    texture: e,
                    cursor: "pointer"
                },
                "*:pressed": {
                    texture: e,
                    cursor: "pointer",
                    offsetX: 1,
                    offsetY: 1
                },
                "[off]": {
                    texture: t
                },
                "[on]": {
                    texture: e
                }
            }
        }
    },
    coreStyle: null,
    style: null
}), "use strict", meta.class("UI.Button", "Entity.Geometry", {
    onCreate: function() {
        this.picking = !0
    },
    onHoverEnter: function(t) {
        meta.engine.cursor = "pointer"
    },
    onHoverExit: function(t) {
        meta.engine.cursor = "auto"
    },
    onDown: function() {
        this.move(this.pressOffset, this.pressOffset)
    },
    onUp: function() {
        this.move(-this.pressOffset, -this.pressOffset)
    },
    _createLabel: function(t) {
        t || (t = ""), this._label = new Entity.Text(t), this._label.pivot(.5), this._label.anchor(.5), this._label.pickable = !1, this._label.size = 12, this._label.color = "#ffffff", this.attach(this._label)
    },
    set text(t) {
        this._label ? this._label.text = t : this._createLabel(t)
    },
    get text() {
        return this._label ? this._label.text : ""
    },
    get label() {
        return this._label || this._createLabel(), this._label
    },
    _label: null,
    pressOffset: 2
}), "use strict", meta.class("UI.Checkbox", "Entity.Geometry", {
    _initParams: function(t) {
        t ? this.style = meta.createStyle(t, UI.ctrl.coreStyle.checkbox) : this.style = UI.ctrl.style.checkbox;
        var e = this,
            i = new Entity.Geometry;
        i.style = this._style.childStyle, i.anchor(.5), i.pickable = !1, i.onChange = function() {
            e._onChildChange(this)
        }, this.attach(i), this.state = "off", this._onClick = this.toggle
    },
    toggle: function() {
        var t = this.children[0];
        this.group ? t.state = "on" : "on" === t.state ? t.state = "off" : t.state = "on"
    },
    _onChange: function() {
        this.children[0].state = this._state, this.group && "on" === this._state && this.group._onStateChange(this)
    },
    _onChildChange: function(t) {
        this.state = this.children[0]._state
    },
    set checked(t) {
        this.state = t ? "on" : "off"
    },
    get checked() {
        return "on" === this._state
    },
    set text(t) {
        this._text ? this._text.setText(t) : (this._text = new Entity.Text(t), this._text.size = 12, this._text.color = "#ffffff", this.attach(this._text), this._text.anchor(.5), this._text.pickable = !1)
    },
    get text() {
        return this._text ? this._text._text : ""
    },
    _text: null,
    group: null,
    value: ""
}), "use strict", meta.class("UI.ProgressBar", "Entity.Geometry", {
    init: function(t, e) {
        this._super(t);
        var i = new Entity.Geometry(e);
        this.attach(i), this.updateUnits()
    },
    updateProgress: function() {
        var t = Math.floor(this._fillWidth / 100 * this._value),
            e = this.children[0];
        e.width = t
    },
    updateUnits: function() {
        var t = this.children[0]._texture;
        t._loaded && (this._fillWidth = t.fullWidth)
    },
    set min(t) {
        this._min !== t && (this._min = t, this.updateProgress())
    },
    set max(t) {
        this._max !== t && (this._max = t, this.updateProgress())
    },
    set value(t) {
        t < this._min ? t = this._min : t > this._max && (t = this._max), this._value !== t && (this._value = t, this.updateProgress())
    },
    set percents(t) {
        var e = this._max - this._min,
            i = e / 100 * t
    },
    get min() {
        return this._min
    },
    get max() {
        return this._max
    },
    get value() {
        return this._value
    },
    get percents() {
        return this._percents
    },
    set fillTexture(t) {
        this.children[0].texture = t, this.updateProgress()
    },
    get fillTexture() {
        return this.children[0]._texture
    },
    _min: 0,
    _max: 100,
    _value: 100,
    _unit: 1,
    _fillWidth: 1
}), "use strict", meta.class("UI.Group", "Entity.Geometry", {
    add: function(t) {
        t.group && t.detach(), this.children || (t.state = "on", this._value = t.value), this.attach(t), t.group = this
    },
    _onStateChange: function(t) {
        this.prevValue = this._value, this._value = t.value;
        for (var e, i = this.children.length, s = 0; i > s; s++) e = this.children[s], e !== t && (this.children[s].state = "off");
        this.onChange(this)
    },
    set value(t) {
        if (this.children)
            for (var e = this.children.length, i = 0; e > i; i++)
                if (this.children[i].value === t) {
                    this.children[i].state = "on";
                    break
                }
    },
    get value() {
        return this._value
    },
    prevValue: "",
    _value: ""
}), "use strict", meta.Tween = function() {
    this.cache = null, this.chain = []
}, meta.Tween.prototype = {
    play: function() {
        if (this.cache) {
            var t = this.cache;
            if (!t.owner) return this;
            if (t.owner.removed) return this;
            t.paused = !1, t.numRepeat = this.numRepeat, this.next(), this._play()
        } else this.autoPlay = !0;
        return this
    },
    _play: function() {
        -1 === this.cache.__index && (this.cache.__index = meta.renderer.tweens.push(this.cache) - 1, this._group && this._group.activeUsers++)
    },
    stop: function(t) {
        return -1 !== this.cache.__index ? (this.cache.link = null, this.cache.index = 0, meta.renderer.tweensRemove.push(this.cache), this.cache.__index = -1, t && t(this.cache.owner), this._group && (this._group.activeUsers--, 0 === this._group.activeUsers && this._group.callback && this._group.callback()), this) : void 0
    },
    paused: function(t) {
        return void 0 === t && (t = !0), this.cache.paused = t, this
    },
    resume: function() {
        return this.cache.paused = !1, this
    },
    clear: function() {
        return this.stop(null), this.chain.length = 0, this._group && (this._group.users--, this._group = null), this
    },
    reset: function() {
        var t = this.cache;
        if (t.index = 0, t.link = this.chain[0], !t.link) return this;
        for (var e in t.link.startValues) t.owner[e] = t.link.startValues[e];
        return this.stop(!1), this
    },
    next: function() {
        var t = !1,
            e = this.cache;
        if (e.index === this.chain.length) {
            if (0 === e.numRepeat) return this.stop(), this.onDone && this.onDone.call(this.cache), this;
            if (e.index = 0, -1 !== e.numRepeat && (e.numRepeat--, 0 === e.numRepeat)) return this.stop(), this.onDone && this.onDone.call(this.cache), this;
            t = !0
        }
        e._done = !1;
        var i, s = this.chain[e.index++],
            n = e.owner;
        if (t)
            for (i in s.startValues) n[i] = s.startValues[i];
        else
            for (i in s.endValues) s.startValues[i] = n[i];
        return s._onStart && s._onStart.call(this), e._tStart = meta.time.current, e._tFrame = 0, e.link = s, this
    },
    repeat: function(t) {
        return void 0 === t && (t = -1), this.numRepeat = t, this
    },
    set reverse(t) {
        return void 0 === t && (t = !0), this.cache.reverse = t, this
    },
    get reverse() {
        return this.cache.reverse
    },
    update: function(t) {
        var e = this.cache;
        if (!e.link) return this.stop(!1), void 0;
        e._tFrame += meta.time.delta;
        var i = e.link,
            s = (meta.time.current - e._tStart) / i.duration;
        if (s > 1 && (s = 1), e._done) {
            if (e.tFrameDelay < i.tDelay) return
        } else i.endValues && (i.update(s), i._onTick && i._onTick.call(this.cache));
        if (1 === s) {
            if (!e._done) return e._done = !0, void 0;
            i._onDone && i._onDone.call(this.cache), this.next()
        }
    },
    to: function(t, e, i) {
        var s = new meta.Tween.Link(this, t, e, i);
        return this.chain.push(s), s
    },
    wait: function(t, e) {
        var i = new meta.Tween.Link(this, null, t, e);
        return this.chain.push(i), i
    },
    group: function(t) {
        return t ? this._group ? (console.warn("(meta.Tween.group) Tween already is part of a group."), this) : ("object" == typeof t && (this._group = t), this._group.users++, this) : (console.warn("(meta.Tween.group) No group name specified."), this)
    },
    autoPlay: !1,
    _group: null,
    _removeFlag: 0,
    numRepeat: 0
}, meta.Tween.Cache = function(t) {
    this.owner = t, this.tween = null, this.link = null, this.index = 0, this.numRepeat = 0, this._tStart = 0, this._tFrame = 0, this.onDone = null, this._done = !1, this.__index = -1
}, meta.Tween.Cache.prototype = {
    update: function(t) {
        this.tween.cache = this, this.tween.update(t), this.tween.cache = null
    },
    stop: function() {
        this.tween.cache = this, this.tween.stop(), this.tween.cache = null
    },
    paused: !1,
    reverse: !1,
    _flags: 0
}, meta.Tween.Group = function(t, e) {
    "function" == typeof t && (e = t, t = ""), this.name = t, this.users = 0, this.activeUsers = 0, this.callback = e || null
}, "use strict", meta.Tween.Easing = {
    linear: function(t) {
        return t
    },
    quadIn: function(t) {
        return t * t
    },
    quadOut: function(t) {
        return t * (2 - t)
    },
    quadInOut: function(t) {
        return (t *= 2) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1)
    },
    cubicIn: function(t) {
        return t * t * t
    },
    cubicOut: function(t) {
        return --t * t * t + 1
    },
    cubicInOut: function(t) {
        return (t *= 2) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2)
    },
    quartIn: function(t) {
        return t * t * t * t
    },
    quartOut: function(t) {
        return 1 - --t * t * t * t
    },
    quartInOut: function(t) {
        return (t *= 2) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2)
    },
    quintIn: function(t) {
        return t * t * t * t * t
    },
    quintOut: function(t) {
        return --t * t * t * t * t + 1
    },
    quintIntOut: function(t) {
        return (t *= 2) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2)
    },
    sineIn: function(t) {
        return 1 - Math.cos(t * Math.PI / 2)
    },
    sineOut: function(t) {
        return Math.sin(t * Math.PI / 2)
    },
    sineIntOut: function(t) {
        return .5 * (1 - Math.cos(Math.PI * t))
    },
    expoIn: function(t) {
        return 0 === t ? 0 : Math.pow(1024, t - 1)
    },
    expoOut: function(t) {
        return 1 === t ? 1 : 1 - Math.pow(2, -10 * t)
    },
    expoInOut: function(t) {
        return 0 === t ? 0 : 1 === t ? 1 : (t *= 2) < 1 ? .5 * Math.pow(1024, t - 1) : .5 * (-Math.pow(2, -10 * (t - 1)) + 2)
    },
    circIn: function(t) {
        return 1 - Math.sqrt(1 - t * t)
    },
    circOut: function(t) {
        return Math.sqrt(1 - --t * t)
    },
    circInOut: function(t) {
        return (t *= 2) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
    },
    elasticIn: function(t) {
        var e, i = .1,
            s = .4;
        return 0 === t ? 0 : 1 === t ? 1 : (!i || 1 > i ? (i = 1, e = s / 4) : e = s * Math.asin(1 / i) / (2 * Math.PI), -(i * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t - e) * Math.PI / s)))
    },
    elasticOut: function(t) {
        var e, i = .1,
            s = .4;
        return 0 === t ? 0 : 1 === t ? 1 : (!i || 1 > i ? (i = 1, e = s / 4) : e = s * Math.asin(1 / i) / (2 * Math.PI), i * Math.pow(2, -10 * t) * Math.sin(2 * (t - e) * Math.PI / s) + 1)
    },
    elasticInOut: function(t) {
        var e, i = .1,
            s = .4;
        return 0 === t ? 0 : 1 === t ? 1 : (!i || 1 > i ? (i = 1, e = s / 4) : e = s * Math.asin(1 / i) / (2 * Math.PI), (t *= 2) < 1 ? -.5 * i * Math.pow(2, 10 * (t -= 1)) * Math.sin(2 * (t - e) * Math.PI / s) : i * Math.pow(2, -10 * (t -= 1)) * Math.sin(2 * (t - e) * Math.PI / s) * .5 + 1)
    },
    backIn: function(t) {
        var e = 1.70158;
        return t * t * ((e + 1) * t - e)
    },
    backOut: function(t) {
        var e = 1.70158;
        return --t * t * ((e + 1) * t + e) + 1
    },
    backInOut: function(t) {
        var e = 2.5949095;
        return (t *= 2) < 1 ? .5 * t * t * ((e + 1) * t - e) : .5 * ((t -= 2) * t * ((e + 1) * t + e) + 2)
    },
    bounceIn: function(t) {
        return 1 - meta.Tween.Easing.bounceOut(1 - t)
    },
    bounceOut: function(t) {
        return 1 / 2.75 > t ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
    },
    bounceInOut: function(t) {
        return .5 > t ? .5 * meta.Tween.Easing.bounceIn(2 * t) : .5 * meta.Tween.Easing.bounceOut(2 * t - 1) + .5
    }
}, "use strict", meta.Tween.Link = function t(e, i, s, n) {
    this.tween = e, this.startValues = {}, this.endValues = i, this.duration = s, this._onDone = n || null
}, meta.Tween.Link.prototype = {
    play: function() {
        return this.tween.play(), this
    },
    stop: function() {
        return this.tween.stop(), this
    },
    paused: function(t) {
        return this.tween.paused(t), this
    },
    resume: function() {
        return this.tween.resume(), this
    },
    clear: function() {
        return this.tween.clear(), this
    },
    reset: function() {
        return this.tween.reset(), this
    },
    update: function(t) {
        var e = this._easing(t),
            i, s, n, o = this.tween.cache.owner;
        for (var h in this.endValues) i = this.startValues[h], s = this.endValues[h], "string" == typeof i && (s = i + parseFloat(s, 4)), n = i + (s - i) * e, this.rounding && (n = Math.round(n)), o[h] = n
    },
    next: function() {
        return this.tween.next(), this
    },
    wait: function(t, e) {
        return this.tween.wait(t, e)
    },
    frameDelay: function(t) {
        return this.tFrameDelay = t, this
    },
    round: function(t) {
        return void 0 === t && (t = !0), this.isRounding = t, this
    },
    repeat: function(t) {
        return this.tween.repeat(t), this
    },
    reverse: function(t) {
        return this.tween.reverse(t), this
    },
    easing: function(t) {
        return "function" == typeof t ? this._easing = t : this._easing = meta.Tween.Easing[t], void 0 === this._easing && (this._easing = meta.Tween.Easing.linear), this
    },
    onStart: function(t) {
        return this._onStart = t, this
    },
    onDone: function(t) {
        return this.tween.onDone = t, this
    },
    onTick: function(t) {
        return this._onTick = t, this
    },
    to: function(t, e, i) {
        return this.tween.to(t, e, i)
    },
    group: function(t) {
        return this.tween.group(t)
    },
    _easing: meta.Tween.Easing.linear,
    _onStart: null,
    _onDone: null,
    _onTick: null,
    tFrameDelay: 0,
    rounding: !1
}, "use strict", meta.controller("meta.loading", {
    onFirstLoad: function() {
        this.view.z = Number.MAX_SAFE_INTEGER, this.view.static = !0;
        var t = new Resource.SVG;
        t.fillStyle = "#030303", t.fillRect(0, 0, meta.camera.width, meta.camera.height), this.bg = new Entity.Geometry(t), this.view.attach(this.bg);
        var e = new Entity.Text;
        e.color = "white", e.text = "LOADING", e.pivot(.5), e.anchor(.5), e.position(0, -8), this.view.attach(e);
        var i = new Resource.SVG;
        i.fillStyle = "#222", i.fillRect(0, 0, 100, 3);
        var s = new Entity.Geometry(i);
        s.pivot(.5), s.anchor(.5), s.position(0, 5), this.view.attach(s);
        var n = new Resource.SVG;
        n.fillStyle = "white", n.fillRect(0, 0, 100, 3), this.progress = new Entity.Geometry(n), this.progress.clipBounds(0, 3), this.progress.pivot(.5), this.progress.anchor(.5), this.progress.position(0, 5), this.view.attach(this.progress)
    },
    onLoad: function() {
        meta.camera.onResize.add(this.onResize, this), meta.resources.onLoadingUpdate.add(this.onResourceLoaded, this)
    },
    onUnload: function() {
        meta.camera.onResize.remove(this), meta.resources.onLoadingUpdate.remove(this)
    },
    onResize: function(t) {
        this.bg.texture.resizeSilently(t.width, t.height), this.bg.texture.fillRect(0, 0, t.width, t.height)
    },
    onResourceLoaded: function(t) {
        var e = Math.min(100 / t.numTotalToLoad * (t.numTotalToLoad - t.numToLoad), 100);
        this.progress.clipBounds(e, 3)
    },
    bg: null,
    progress: null
}), "use strict", meta.createEngine = function() {
    meta.onDomLoad(function() {
        meta.classLoaded(), meta.engine.autoInit && meta.engine.create()
    })
}, meta.createEngine(), meta.loadScript = function(t, e) {
    meta.engine && meta.engine.isLoaded ? meta._loadScript({
        s: t,
        c: e
    }) : (meta.cache.scripts || (meta.cache.scripts = []), meta.cache.scripts.push({
        s: t,
        c: e
    }))
}, meta._loadScript = function(t) {
    var e = document.createElement("script"),
        i = document.scripts[0];
    "async" in i ? (e.async = !1, e.onload = t.c, e.src = t.s, document.head.appendChild(e)) : i.readyState ? (meta.cache.pendingScripts || (meta.cache.pendingScripts = []), meta.cache.pendingScripts.push(e), e.onreadystatechange = meta._onReadyStateChange, e.src = t.s) : document.write("<script src='" + src + "' defer></script>")
}, meta._onReadyStateChange = function() {
    for (var t, e = meta.cache.pendingScripts; e[0] && "loaded" === e[0].s.readyState;) t = e.shift(), t.s.onreadystatechange = null, document.scripts[0].parentNode.insertBefore(t.s, firstScript), t.c && t.c()
}, meta._loadAllScripts = function() {
    var t = meta.cache.scripts;
    if (!t) return !1;
    var e = t.length;
    if (0 === e) return !1;
    var i = function() {
            var t = meta.cache;
            t.numScriptsToLoad--;
            var e = meta.cache.scripts,
                s = e.length;
            if (s > 0) {
                t.numScriptsToLoad += s, t.scripts = [];
                for (var n, o = 0; s > o; o++) n = e[o], n.c = i, meta._loadScript(n)
            }
            0 === t.numScriptsToLoad && (t.scripts = null, meta.engine.onScriptLoadingEnd())
        },
        s, n = meta.cache;
    n.numScriptsToLoad += t.length, n.scripts = [];
    for (var o = 0; e > o; o++) s = t[o], s.c = i, meta._loadScript(s);
    return !0
}, meta.import = function(t) {
    if (t) {
        var e = t.split("/"),
            i = e[0];
        meta.isUrl(t) || (t = meta.importUrl + t + "/" + t + ".js"), meta.loadScript(t, null)
    }
};
