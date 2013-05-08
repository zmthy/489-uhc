var Signals = function () {
    "use strict";

    var Signal = function (source) {
        console.log("initialising signal with source: ", source)
        this.registeredListeners = []
        this._source = source
        this.__isSignal = true
    }

    Signal.prototype.registerListener = function(callback) {
        this.registeredListeners.push(function (value) {
            if(!callback || !callback.args) return
            UHCFunction.apply(callback, value)
        })
    }

    Signal.prototype.push = function(value, event) {
        for(var i = 0, len = this.registeredListeners.length; i < len; i++) {
            this.registeredListeners[i](value, event);
        }
    }

    Signal.prototype.pipe = function(transform) {
        console.log("constructing with transform", transform)
        var newSignal = new Signal(this)
        this.registeredListeners.push(function (value, event) {
            var res = UHCFunction.apply(transform, value, event)
            console.log("pushing res", window.res = res, window.transform = transform, window.value = value)
            newSignal.push(res, event)
        });
        return newSignal
    }

    Signal.prototype.__aN__ = function () {
        return this
    }

    Signal.prototype.source = function () {
        return this._source instanceof Signal ? this._source.source() : this._source;
    }

    function createEventedSignal (elem, event, key) {
        if(elem && elem[0] instanceof NodeList) elem = elem[0][0]
        if(elem && elem.length) elem = elem[0]
        if(!elem || !elem.addEventListener || !event || typeof event !== "string")
            return undefined
        var s = new Signal(elem)
        elem.addEventListener(event, function (e) {
            s.push({
                __eOrV__: elem[key || 'value'],
                __aN__: function() { return this.__eOrV__ }
            }, e)
        })
        return s
    }

    function bindToSignal (signal, callback) {
        console.log(signal, window.callback = callback)
        if(!signal || !callback || !callback.args) return undefined

        signal.registerListener(callback)
        return {
            _1: {
                __aN__ : signal.__aN__
            },
            __aN__: signal.__aN__
        }
    }

    function applicable (argument) {
        console.log("wrapping in applicable node", argument)
        if(!(argument instanceof _F_)) return {
            __aN__ : function () { return argument }
        }
        else return argument
    }

    function signalIO(signalVal) {
        var res = _e_(signalVal._1)
        if(res) UHCFunction.apply(res, [])
        console.log("doing some manual signal io", signalVal, window.sigval = res)
        return res
    }

    return {
        createEventedSignal: createEventedSignal,
        bindToSignal: bindToSignal,
        applicable:applicable,
        signalIO:signalIO
    }
}()