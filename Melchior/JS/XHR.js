var XHR = function () {
    "use strict";

    var XHR = function () { }
    var XMLHttpFactories = [
        function () {return new XMLHttpRequest()},
        function () {return new ActiveXObject("Msxml2.XMLHTTP")},
        function () {return new ActiveXObject("Msxml3.XMLHTTP")},
        function () {return new ActiveXObject("Microsoft.XMLHTTP")}
    ]

    function createXMLHttpRequest() {
        var xmlHttpRequest = false;
        for (var i=0;i<XMLHttpFactories.length;i++) {
            try {
                xmlHttpRequest = XMLHttpFactories[i]()
            }
            catch (e) {
                continue
            }
            break
        }
        if(window.debug) console.log("found browser xhr:" , xmlHttpRequest)
        return xmlHttpRequest
    }


    XHR.prototype.getXHR = function (method, resource) {
        if(!method || !resource) return
        var req = createXMLHttpRequest()
        if (!req) return

        req.open(method, resource, true /*async*/)

        if(method !== "GET") req.setRequestHeader("Content-type","application/x-www-form-encoded")
        return req
    }

    XHR.prototype.pipeXHRSignal = function (method, resource, signal) {        
        var outSignal = new Signals.Signal(signal), thus = this
        if(window.debug) console.log("creating an XHR signal w/", method, resource, window.signal = signal)
        signal.registerListener(function(value) {
            var req = thus.getXHR(method, resource)
            if(window.debug) console.log("requesting", resource, method, req)
            req.onreadystatechange = function() {
                if(window.debug) console.log("xhr got", req.response)
                if(window.debug) console.log("req.readystate", req.readystate)
                if(req.readyState === 4)
                    outSignal.push(req.response)
            }
            req.send(value) //should this send now?
        })
        
        return outSignal
    }

    XHR.prototype.createXHRSignal = function (method, resource) {
        var outSignal = new Signal(this), req = this.getXHR(method, resource)
        req.onreadystatechange = function() {
            outSignal.push(req.readyState) //TODO -- what should this be? response...?
        }
        req.send()
        return outSignal
    }

    return new XHR()
}()