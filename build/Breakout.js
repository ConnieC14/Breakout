'use strict';var BREAKOUT=BREAKOUT||{};BREAKOUT.namespace=function(a){var a=a.split("."),c=BREAKOUT,d;"BREAKOUT"===a[0]&&(a=a.slice(1));for(d=0;d<a.length;d+=1)"undefined"===typeof c[a[d]]&&(c[a[d]]={}),c=c[a[d]];return c};BREAKOUT.inherit=function(a){function c(){}if(null==a)throw TypeError();if(Object.create)return Object.create(a);var d=typeof a;if("object"!==d&&"function"!==d)throw TypeError();c.prototype=a;return new c};
if(!Function.prototype.bind)Function.prototype.bind=function(a){if("function"!==typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var c=Array.prototype.slice.call(arguments,1),d=this,b=function(){},e=function(){return d.apply(this instanceof b?this:a||window,c.concat(Array.prototype.slice.call(arguments)))};b.prototype=this.prototype;e.prototype=new b;return e};BREAKOUT.namespace("BREAKOUT.Event");BREAKOUT.Event=function(){var a;a=function(a){this.type=a;this.target=null;this.name="Event"};a.CONNECTED="connected";a.CHANGE="change";a.COMPLETE="complete";return a}();BREAKOUT.namespace("BREAKOUT.EventDispatcher");
BREAKOUT.EventDispatcher=function(){var a;a=function(a){this._target=a||null;this._eventListeners={};this.name="EventDispatcher"};a.prototype={addEventListener:function(a,d){this._eventListeners[a]||(this._eventListeners[a]=[]);this._eventListeners[a].push(d)},removeEventListener:function(a,d){for(var b=0,e=this._eventListeners[a].length;b<e;b++)this._eventListeners[a][b]==d&&this._eventListeners[a].splice(b,1)},hasEventListener:function(a){return this._eventListeners[a]?!0:!1},dispatchEvent:function(a,
d){a.target=this._target;var b=!1,e;for(e in d)a[e.toString()]=d[e];if(this.hasEventListener(a.type)){e=0;for(var f=this._eventListeners[a.type].length;e<f;e++)try{this._eventListeners[a.type][e].call(this,a),b=!0}catch(i){}}return b}};return a}();BREAKOUT.namespace("BREAKOUT.IOBoardEvent");
BREAKOUT.IOBoardEvent=function(){var a,c=BREAKOUT.Event;a=function(a){this.name="IOBoardEvent";c.call(this,a)};a.ANALOG_DATA="analodData";a.DIGITAL_DATA="digitalData";a.FIRMWARE_VERSION="firmwareVersion";a.FIRMWARE_NAME="firmwareName";a.STRING_MESSAGE="stringMessage";a.SYSEX_MESSAGE="sysexMessage";a.CAPABILITY_RESPONSE="capabilityResponse";a.PIN_STATE_RESPONSE="pinStateResponse";a.ANALOG_MAPPING_RESPONSE="analogMappingResponse";a.READY="arduinoReady";a.prototype=BREAKOUT.inherit(c.prototype);return a.prototype.constructor=
a}();BREAKOUT.namespace("BREAKOUT.WSocketEvent");BREAKOUT.WSocketEvent=function(){var a,c=BREAKOUT.Event;a=function(a){this.name="WSocketEvent";c.call(this,a)};a.CONNECTED="webSocketConnected";a.MESSAGE="webSocketMessage";a.CLOSE="webSocketClosed";a.prototype=BREAKOUT.inherit(c.prototype);return a.prototype.constructor=a}();BREAKOUT.namespace("BREAKOUT.WSocketWrapper");
BREAKOUT.WSocketWrapper=function(){var a,c=BREAKOUT.EventDispatcher,d=BREAKOUT.WSocketEvent;a=function(a,d,f,i){this.name="WSocketWrapper";c.call(this,this);this._host=a;this._port=d;this._protocol=i||"default-protocol";this._useSocketIO=f||!1;this._socket=null;this._readyState="";this.init(this)};a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.prototype.init=function(a){if(a._useSocketIO){a._socket=io.connect("http://"+a._host+":"+a._port);try{a._socket.on("connect",function(){a.dispatchEvent(new d(d.CONNECTED));
a._socket.on("message",function(e){a.dispatchEvent(new d(d.MESSAGE),{message:e})})})}catch(e){console.log("Error "+e)}}else try{if("MozWebSocket"in window)a._socket=new MozWebSocket("ws://"+a._host+":"+a._port,a._protocol);else if("WebSocket"in window)a._socket=new WebSocket("ws://"+a._host+":"+a._port);else throw console.log("Websockets not supported by this browser"),"Websockets not supported by this browser";console.log("Starting up...");a._socket.onopen=function(){a.dispatchEvent(new d(d.CONNECTED));
a._socket.onmessage=function(e){a.dispatchEvent(new d(d.MESSAGE),{message:e.data})};a._socket.onclose=function(){a._readyState=a._socket.readyState;a.dispatchEvent(new d(d.CLOSE))}}}catch(f){console.log("Error "+f)}};a.prototype.send=function(a){this._socket.send(a)};a.prototype.__defineGetter__("readyState",function(){return this._readyState});return a}();BREAKOUT.namespace("BREAKOUT.filters.FilterBase");BREAKOUT.filters.FilterBase=function(){var a;a=function(){throw Error("Can't instantiate abstract classes");};a.prototype.processSample=function(){throw Error("Filter objects must implement the method processSample");};return a}();BREAKOUT.namespace("BREAKOUT.filters.Scaler");
BREAKOUT.filters.Scaler=function(){var a,c=BREAKOUT.filters.FilterBase;a=function(a,b,e,f,c,g){this.name="Scaler";this._inMin=a||0;this._inMax=b||1;this._outMin=e||0;this._outMax=f||1;this._type=c||this.LINEAR;this._limiter=g||!0};a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.prototype.processSample=function(a){var b=this._outMax-this._outMin,a=(a-this._inMin)/(this._inMax-this._inMin);this._limiter&&(a=Math.max(0,Math.min(1,a)));return b*this._type(a)+this._outMin};a.prototype.LINEAR=
function(a){return a};a.prototype.SQUARE=function(a){return a};a.prototype.SQUARE_ROOT=function(a){return a};a.prototype.CUBE=function(a){return a};a.prototype.CUBE_ROOT=function(a){return a};return a}();BREAKOUT.namespace("BREAKOUT.filters.Convolution");
BREAKOUT.filters.Convolution=function(){var a,c=BREAKOUT.filters.FilterBase;a=function(a){this.name="Convolution";this._buffer=[];this.coef=a};a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.prototype.__defineGetter__("coef",function(){return this._coef});a.prototype.__defineSetter__("coef",function(a){this._coef=a;this._buffer=Array(this._coef.length);for(var a=this._buffer.length,b=0;b<a;b++)this._buffer[b]=0});a.prototype.processSample=function(a){this._buffer.unshift(a);
this._buffer.pop();for(var a=0,b=this._buffer.length,e=0;e<b;e++)a+=this._coef[e]*this._buffer[e];return a};a.LPF=[1/3,1/3,1/3];a.HPF=[1/3,-2/3,1/3];a.MOVING_AVERAGE=[0.125,0.125,0.125,0.125,0.125,0.125,0.125,0.125];return a}();BREAKOUT.namespace("BREAKOUT.filters.TriggerPoint");
BREAKOUT.filters.TriggerPoint=function(){var a,c=BREAKOUT.filters.FilterBase;a=function(a){this.name="TriggerPoint";this._points={};this._range=[];void 0===a&&(a=[[0.5,0]]);if(a[0]instanceof Array)for(var b=a.length,e=0;e<b;e++)this._points[a[e][0]]=a[e][1];else"number"===typeof a[0]&&(this._points[a[0]]=a[1]);this.updateRange();this._lastStatus=0};a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.prototype.processSample=function(a){for(var b=this._lastStatus,e=this._range.length,
f=0;f<e;f++){var c=this._range[f];if(c[0]<=a&&a<=c[1]){b=f;break}}return this._lastStatus=b};a.prototype.addPoint=function(a,b){this._points[a]=b;this.updateRange()};a.prototype.removePoint=function(a){delete this._points[a];this.updateRange()};a.prototype.removeAllPoints=function(){this._points={};this.updateRange()};a.prototype.updateRange=function(){this._range=[];var a=this.getKeys(this._points),b=a[0];this._range.push([Number.NEGATIVE_INFINITY,b-this._points[b]]);for(var b=a.length-1,e=0;e<b;e++){var f=
a[e],c=a[e+1],f=1*f+this._points[f],c=c-this._points[c];if(f>=c)throw Error("The specified range overlaps...");this._range.push([f,c])}a=a[a.length-1];this._range.push([1*a+this._points[a],Number.POSITIVE_INFINITY])};a.prototype.getKeys=function(a){var b=[],e;for(e in a)b.push(e);return b.sort()};return a}();BREAKOUT.namespace("BREAKOUT.generators.GeneratorEvent");BREAKOUT.generators.GeneratorEvent=function(){var a,c=BREAKOUT.Event;a=function(a){c.call(this,a);this.name="GeneratorEvent"};a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.UPDATE="update";return a}();BREAKOUT.namespace("BREAKOUT.generators.GeneratorBase");
BREAKOUT.generators.GeneratorBase=function(){var a,c=BREAKOUT.EventDispatcher;a=function(){c.call(this,this);this.name="GeneratorBase"};a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.prototype.__defineGetter__("value",function(){return this._value});a.prototype.__defineSetter__("value",function(a){this._value=a});return a}();BREAKOUT.namespace("BREAKOUT.generators.Oscillator");
BREAKOUT.generators.Oscillator=function(){var a,c=BREAKOUT.generators.GeneratorBase,d=BREAKOUT.generators.GeneratorEvent;a=function(b,e,d,i,g,o){c.call(this);this._wave=b||a.SINE;this._freq=e||1;this._amplitude=d||1;this._offset=i||0;this._phase=g||0;this._times=o||0;if(0===e)throw Error("Frequency should be larger than 0");this._timer=null;this._delay=33;this.reset()};a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.prototype.__defineSetter__("serviceInterval",function(a){this._delay=
a;null!==this._timer&&this.start()});a.prototype.__defineGetter__("serviceInterval",function(){return this._delay});a.prototype.start=function(){null!==this._timer&&this.stop();this._timer=setInterval(this.autoUpdate.bind(this),this._delay);this._startTime=(new Date).getTime();this.autoUpdate(null)};a.prototype.stop=function(){clearInterval(this._timer);this._timer=null};a.prototype.reset=function(){this._time=0;this._lastVal=0.999};a.prototype.update=function(a){a=a||-1;this._time=0>a?this._time+
this._delay:this._time+a;this.computeValue()};a.prototype.autoUpdate=function(){this._time=(new Date).getTime()-this._startTime;this.computeValue()};a.prototype.computeValue=function(){var b=this._time/1E3;0!==this._times&&this._freq*b>=this._times?(this.stop(),this._value=this._wave!==a.LINEAR?this._offset:this._amplitude*this._wave(1,0)+this._offset):(b=this._freq*(b+this._phase),this._value=this._amplitude*this._wave(b,this._lastVal)+this._offset,this._lastVal=b);this.dispatchEvent(new d(d.UPDATE))};
a.SINE=function(a){return 0.5*(1+Math.sin(2*Math.PI*(a-0.25)))};a.SQUARE=function(a){return 0.5>=a%1?1:0};a.TRIANGLE=function(a){a%=1;return 0.5>=a?2*a:2-2*a};a.SAW=function(a){a%=1;return 0.5>=a?a+0.5:a-0.5};a.IMPULSE=function(a,e){return a%1<e%1?1:0};a.LINEAR=function(a){return 1>a?a:1};return a}();BREAKOUT.namespace("BREAKOUT.Pin");
BREAKOUT.Pin=function(){var a,c=BREAKOUT.EventDispatcher,d=BREAKOUT.Event,b=BREAKOUT.generators.GeneratorEvent;a=function(a,b){this.name="Pin";this._type=b;this._number=a;this._analogNumber=void 0;this._maxPWMValue=255;this._lastValue=this._value=-1;this._average=0;this._minimum=Math.pow(2,16);this._numSamples=this._sum=this._maximum=0;this._generator=this._filters=null;this._evtDispatcher=new c(this)};a.prototype={setAnalogNumber:function(a){this._analogNumber=a},get analogNumber(){return this._analogNumber},
get number(){return this._number},setMaxPWMValue:function(){this._maxPWMValue=value},get maxPWMValue(){return this._maxPWMValue},get average(){return this._average},get minimum(){return this._minimum},get maximum(){return this._maximum},get value(){return this._value},set value(a){this.calculateMinMaxAndMean(a);this._lastValue=this._value;this._preFilterValue=a;this._value=this.applyFilters(a);this.detectChange(this._lastValue,this._value)},get lastValue(){return this._lastValue},get preFilterValue(){return this._preFilterValue},
get filters(){return this._filters},set filters(a){this._filters=a},get generator(){return this._generator},getType:function(){return this._type},setType:function(e){if(0<=e&&e<a.TOTAL_PIN_MODES)this._type=e},getCapabilities:function(){return this._capabilities},setCapabilities:function(a){this._capabilities=a},detectChange:function(a,b){a!==b&&this.dispatchEvent(new d(d.CHANGE))},clearWeight:function(){this._sum=this._average;this._numSamples=1},calculateMinMaxAndMean:function(a){var b=Number.MAX_VALUE;
this._minimum=Math.min(a,this._minimum);this._maximum=Math.max(a,this._maximum);this._sum+=a;this._average=this._sum/++this._numSamples;this._numSamples>=b&&this.clearWeight()},clear:function(){this._minimum=this._maximum=this._average=this._lastValue=this._preFilterValue;this.clearWeight()},addFilter:function(a){if(null!==a){if(null===this._filters)this._filters=[];this._filters.push(a)}},addGenerator:function(a){this.removeGenerator();this._generator=a;this._generator.addEventListener(b.UPDATE,
this.autoSetValue.bind(this))},removeGenerator:function(){null!==this._generator&&this._generator.removeEventListener(b.UPDATE,this.autoSetValue);this._generator=null},setFilters:function(a){this.filters=a},removeAllFilters:function(){this._filters=null},autoSetValue:function(){this.value=this._generator.value},applyFilters:function(a){if(null===this._filters)return a;for(var b=this._filters.length,d=0;d<b;d++)a=this._filters[d].processSample(a);return a},addEventListener:function(a,b){this._evtDispatcher.addEventListener(a,
b)},removeEventListener:function(a,b){this._evtDispatcher.removeEventListener(a,b)},hasEventListener:function(a){return this._evtDispatcher.hasEventListener(a)},dispatchEvent:function(a,b){return this._evtDispatcher.dispatchEvent(a,b)}};a.HIGH=1;a.LOW=0;a.ON=1;a.OFF=0;a.DIN=0;a.DOUT=1;a.AIN=2;a.AOUT=3;a.PWM=3;a.SERVO=4;a.SHIFT=5;a.I2C=6;a.TOTAL_PIN_MODES=7;return a}();BREAKOUT.namespace("BREAKOUT.I2CBase");
BREAKOUT.I2CBase=function(){var a,c=BREAKOUT.Pin,d=BREAKOUT.EventDispatcher,b=BREAKOUT.IOBoardEvent;a=function(e,f,i){if(void 0!=e){this.name="I2CDevice";this.board=e;var g=i||0,i=g&255,g=g>>8&255;this._address=f;this._evtDispatcher=new d(this);f=e.getI2cPins();2==f.length?(e.getPin(f[0]).getType()!=c.I2C&&(e.getPin(f[0]).setType(c.I2C),e.getPin(f[1]).setType(c.I2C)),e.addEventListener(b.SYSEX_MESSAGE,this.onSysExMessage.bind(this)),e.sendSysex(a.I2C_CONFIG,[i,g])):console.log("Error, this board does not support i2c")}};
a.prototype={get address(){return this._address},onSysExMessage:function(b){var b=b.message,d=this.board.getValueFromTwo7bitBytes(b[1],b[2]),c=[];if(b[0]==a.I2C_REPLY&&d==this._address){for(var d=3,g=b.length;d<g;d+=2)c.push(this.board.getValueFromTwo7bitBytes(b[d],b[d+1]));this.handleI2C(c)}},sendI2CRequest:function(b){var d=[],c=b[0];d[0]=b[1];d[1]=c<<3;for(var c=2,g=b.length;c<g;c++)d.push(b[c]&127),d.push(b[c]>>7&127);this.board.sendSysex(a.I2C_REQUEST,d)},update:function(){},handleI2C:function(){},
addEventListener:function(a,b){this._evtDispatcher.addEventListener(a,b)},removeEventListener:function(a,b){this._evtDispatcher.removeEventListener(a,b)},hasEventListener:function(a){return this._evtDispatcher.hasEventListener(a)},dispatchEvent:function(a,b){return this._evtDispatcher.dispatchEvent(a,b)}};a.I2C_REQUEST=118;a.I2C_REPLY=119;a.I2C_CONFIG=120;a.WRITE=0;a.READ=1;a.READ_CONTINUOUS=2;a.STOP_READING=3;return a}();BREAKOUT.namespace("BREAKOUT.io.BlinkM");
BREAKOUT.io.BlinkM=function(){var a,c=BREAKOUT.I2CBase;a=function(a,b){this.name="BlinkM";c.call(this,a,b||9)};a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.prototype.goToRGBColorNow=function(a){this.sendI2CRequest([c.WRITE,this.address,110,a[0],a[1],a[2]])};a.prototype.fadeToRGBColor=function(a,b){b=b||-1;0<=b&&this.sendI2CRequest([c.WRITE,this.address,102,b]);this.sendI2CRequest([c.WRITE,this.address,99,a[0],a[1],a[2]])};a.prototype.fadeToRandomRGBColor=function(a,b){b=b||
-1;0<=b&&this.sendI2CRequest([c.WRITE,this.address,102,b]);this.sendI2CRequest([c.WRITE,this.address,67,a[0],a[1],a[2]])};a.prototype.fadeToHSBColor=function(a,b){b=b||-1;0<=b&&this.sendI2CRequest([c.WRITE,this.address,102,b]);this.sendI2CRequest([c.WRITE,this.address,104,a[0],a[1],a[2]])};a.prototype.fadeToRandomHSBColor=function(a,b){b=b||-1;0<=b&&this.sendI2CRequest([c.WRITE,this.address,102,b]);this.sendI2CRequest([c.WRITE,this.address,72,a[0],a[1],a[2]])};a.prototype.setFadeSpeed=function(a){this.sendI2CRequest([c.WRITE,
this.address,102,a])};a.prototype.playLightScript=function(a,b,e){this.sendI2CRequest([c.WRITE,this.address,112,a,b||1,e])};a.prototype.stopScript=function(){this.sendI2CRequest([c.WRITE,this.address,111])};a.prototype.handleI2C=function(a){console.log("BlinkM: "+a)};return a}();BREAKOUT.namespace("BREAKOUT.io.CompassHMC6352");
BREAKOUT.io.CompassHMC6352=function(){var a,c=BREAKOUT.I2CBase,d=BREAKOUT.Event;a=function(a,e){this._lastHeading=this._heading=0;this.name="CompassHMC6352";c.call(this,a,e||33);this.sendI2CRequest([c.WRITE,this.address,71,116,81]);this.sendI2CRequest([c.WRITE,this.address,65]);this.startReading()};a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.prototype.__defineGetter__("heading",function(){return this._heading});a.prototype.handleI2C=function(a){this._heading=Math.floor((a[1]<<
8|a[2])/10);this._heading!=this._lastHeading&&this.dispatchEvent(new d(d.CHANGE));this._lastHeading=this._heading};a.prototype.startReading=function(){this.sendI2CRequest([c.READ_CONTINUOUS,this.address,127,2])};a.prototype.stopReading=function(){this.sendI2CRequest([c.STOP_READING,this.address])};return a}();BREAKOUT.namespace("BREAKOUT.PhysicalInputBase");
BREAKOUT.PhysicalInputBase=function(){var a,c=BREAKOUT.EventDispatcher;a=function(){this.name="PhysicalInputBase";this._evtDispatcher=new c(this)};a.prototype={addEventListener:function(a,b){this._evtDispatcher.addEventListener(a,b)},removeEventListener:function(a,b){this._evtDispatcher.removeEventListener(a,b)},hasEventListener:function(a){return this._evtDispatcher.hasEventListener(a)},dispatchEvent:function(a,b){return this._evtDispatcher.dispatchEvent(a,b)}};return a}();BREAKOUT.namespace("BREAKOUT.io.ButtonEvent");BREAKOUT.io.ButtonEvent=function(){var a,c=BREAKOUT.Event;a=function(a){this.name="ButtonEvent";c.call(this,a)};a.PRESS="pressed";a.RELEASE="released";a.LONG_PRESS="longPress";a.SUSTAINED_PRESS="sustainedPress";a.prototype=BREAKOUT.inherit(c.prototype);return a.prototype.constructor=a}();BREAKOUT.namespace("BREAKOUT.io.Button");
BREAKOUT.io.Button=function(){var a,c=BREAKOUT.PhysicalInputBase,d=BREAKOUT.Event,b=BREAKOUT.Pin,e=BREAKOUT.io.ButtonEvent;a=function(e,i,g,o){c.call(this);this.name="Button";this._pin=i;i=i.number;this.buttonMode=g||a.PULL_DOWN;this._sustainedPressInterval=o||1E3;this._debounceInterval=20;this._repeatCount=0;this._timer=null;this._timeout=null;this._board=e;e.setDigitalPinMode(i,b.DIN);if(this.buttonMode===a.INTERNAL_PULL_UP)e.enablePullUp(i),this._pin.value=b.HIGH;this._pin.addEventListener(d.CHANGE,
this.onPinChange.bind(this))};a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.prototype.onPinChange=function(b){var b=b.target.value,e;if(this.buttonMode===a.PULL_DOWN)e=1===b?this.pressed:this.released;else if(this.buttonMode===a.PULL_UP||this.buttonMode===a.INTERNAL_PULL_UP)e=1===b?this.released:this.pressed;null!==this._timeout&&clearTimeout(this._timeout);this._timeout=setTimeout(e.bind(this),this._debounceInterval)};a.prototype.pressed=function(){this._timeout=null;this.dispatchEvent(new e(e.PRESS));
this._timer=setInterval(this.sustainedPress.bind(this),this._sustainedPressInterval)};a.prototype.released=function(){this._timeout=null;this.dispatchEvent(new e(e.RELEASE));if(null!=this._timer)clearInterval(this._timer),this._timer=null;this._repeatCount=0};a.prototype.sustainedPress=function(){0<this._repeatCount?this.dispatchEvent(new e(e.SUSTAINED_PRESS)):this.dispatchEvent(new e(e.LONG_PRESS));this._repeatCount++};a.prototype.__defineGetter__("debounceInterval",function(){return this._debounceInterval});
a.prototype.__defineSetter__("debounceInterval",function(a){this._debounceInterval=a});a.prototype.__defineGetter__("sustainedPressInterval",function(){return this._sustainedPressInterval});a.prototype.__defineSetter__("sustainedPressInterval",function(a){this._sustainedPressInterval=a});a.prototype.__defineGetter__("pinNumber",function(){return this._pin.number});a.PULL_DOWN=0;a.PULL_UP=1;a.INTERNAL_PULL_UP=2;return a}();BREAKOUT.namespace("BREAKOUT.io.Potentiometer");
BREAKOUT.io.Potentiometer=function(){var a,c=BREAKOUT.PhysicalInputBase,d=BREAKOUT.filters.Scaler,b=BREAKOUT.filters.Convolution,e=BREAKOUT.Event;a=function(a,d,g){c.call(this);this.name="Potentiometer";this._pin=d;g=g||!1;a.enableAnalogPin(this._pin.analogNumber);g&&this._pin.addFilter(new b(b.MOVING_AVERAGE));this._pin.addEventListener(e.CHANGE,this.onPinChange.bind(this))};a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.prototype.__defineGetter__("value",function(){return this._pin.value});
a.prototype.__defineGetter__("average",function(){return this._pin.average});a.prototype.__defineGetter__("preFilterValue",function(){return this._pin.preFilterValue});a.prototype.__defineGetter__("minimum",function(){return this._pin.minimum});a.prototype.__defineGetter__("maximum",function(){return this._pin.maximum});a.prototype.clear=function(){this._pin.clear()};a.prototype.setRange=function(a,b){this._pin.addFilter(new d(0,1,a||0,b||1,d.LINEAR))};a.prototype.onPinChange=function(){this.dispatchEvent(new e(e.CHANGE))};
return a}();BREAKOUT.namespace("BREAKOUT.io.RFIDEvent");BREAKOUT.io.RFIDEvent=function(){var a,c=BREAKOUT.Event;a=function(a,b){this._tag=b;c.call(this,a)};a.ADD_TAG="addTag";a.REMOVE_TAG="removeTag";a.prototype=BREAKOUT.inherit(c.prototype);a.prototype.constructor=a;a.prototype.__defineGetter__("tag",function(){return this._tag});return a}();BREAKOUT.namespace("BREAKOUT.io.ID12RFIDReader");
BREAKOUT.io.ID12RFIDReader=function(){var a,c=BREAKOUT.EventDispatcher,d=BREAKOUT.IOBoardEvent,b=BREAKOUT.io.RFIDEvent;a=function(a){this.name="ID12RFIDReader";this.ID12_READER=13;this.READ_EVENT=1;this.REMOVE_EVENT=2;this.board=a;this._evtDispatcher=new c(this);a.addEventListener(d.SYSEX_MESSAGE,this.onSysExMessage.bind(this))};a.prototype={onSysExMessage:function(a){a=a.message;a[0]==this.ID12_READER&&this.processRFIDData(a)},dec2hex:function(a){return(a+256).toString(16).substr(-2).toUpperCase()},
processRFIDData:function(a){for(var c=this.board.getValueFromTwo7bitBytes(a[1],a[2]),d="",g=3,o=a.length;g<o;g+=2)d+=this.dec2hex(this.board.getValueFromTwo7bitBytes(a[g],a[g+1]));c==this.READ_EVENT?this.dispatch(new b(b.ADD_TAG,d)):c==this.REMOVE_EVENT&&this.dispatch(new b(b.REMOVE_TAG,d))},dispatch:function(a){this.dispatchEvent(a)},addEventListener:function(a,b){this._evtDispatcher.addEventListener(a,b)},removeEventListener:function(a,b){this._evtDispatcher.removeEventListener(a,b)},hasEventListener:function(a){return this._evtDispatcher.hasEventListener(a)},
dispatchEvent:function(a,b){return this._evtDispatcher.dispatchEvent(a,b)}};return a}();BREAKOUT.namespace("BREAKOUT.io.Servo");BREAKOUT.io.Servo=function(){var a,c=BREAKOUT.Pin;a=function(a,b,c,f){this.name="Servo";this._pin=b;this._minAngle=c||0;this._maxAngle=f||180;a.sendServoAttach(b.number)};a.prototype={set angle(d){if(this._pin.getType()==c.SERVO)this._angle=d,this._pin.value=Math.max(0,Math.min(1,(this._angle-this._minAngle)/(this._maxAngle-this._minAngle)*a.COEF_TO_0_180))},get angle(){if(this._pin.getType()==c.SERVO)return this._angle}};a.COEF_TO_0_180=180/255;return a}();BREAKOUT.namespace("BREAKOUT.io.LED");
BREAKOUT.io.LED=function(){var a,c=BREAKOUT.Pin,d=BREAKOUT.generators.Oscillator;a=function(b,d,f){this.name="LED";this._driveMode=f||a.SOURCE_DRIVE;this._pin=d;this._onValue=1;this._offValue=0;if(this._driveMode===a.SOURCE_DRIVE)this._onValue=1,this._offValue=0;else if(this._driveMode===a.SYNC_DRIVE)this._onValue=0,this._offValue=1;else throw"driveMode should be LED.SOURCE_DRIVE or LED.SYNC_DRIVE";this._pin.getCapabilities()[c.PWM]?(b.setDigitalPinMode(this._pin.number,c.PWM),this._supportsPWM=!0):
(b.setDigitalPinMode(this._pin.number,c.DOUT),this._supportsPWM=!1)};a.prototype={get intensity(){return this._pin.value},set intensity(b){this._supportsPWM||(b=0.5>b?0:1);if(this._driveMode===a.SOURCE_DRIVE)this._pin.value=b;else if(this._driveMode===a.SYNC_DRIVE)this._pin.value=1-b},on:function(){this._pin.value=this._onValue},off:function(){this._pin.value=this._offValue},isOn:function(){return this._pin.value===this._onValue},toggle:function(){this._pin.value=1-this._pin.value},blink:function(a,
c,f){a=1E3/a;c=c||0;f=f||d.SQUARE;if(!this._supportsPWM&&f!==d.SQUARE)console.log("Warning: Only Oscillator.SQUARE may be used on a non-PWM pin."),console.log("Setting wave to Oscillator.SQUARE."),f=d.SQUARE;this._pin.addGenerator(new d(f,a,1,0,0,c));this._pin.generator.start()},stopBlinking:function(){null!==this._pin.generator&&this._pin.generator.stop();this.off()},fadeIn:function(a){this.fadeTo(1,a)},fadeOut:function(a){this.fadeTo(0,a)},fadeTo:function(a,c){if(this._supportsPWM){var f=1E3/(c||
1E3);this._pin.value!==a?(this._pin.addGenerator(new d(d.LINEAR,f,a-this._pin.value,this._pin.value,0,1)),this._pin.generator.start()):this._pin.removeGenerator()}else console.log("Warning: Fade methods can only be used for LEDs connected to PWM pins.")}};a.SOURCE_DRIVE=0;a.SYNC_DRIVE=1;return a}();BREAKOUT.namespace("BREAKOUT.io.RGBLED");
BREAKOUT.io.RGBLED=function(){var a,c=BREAKOUT.io.LED;a=function(d,b,e,f,i){this.name="RGBLED";if(void 0===i)i=a.COMMON_ANODE;this._redLED=new c(d,b,i);this._greenLED=new c(d,e,i);this._blueLED=new c(d,f,i)};a.prototype={setColor:function(a,b,c){this._redLED.intensity=a/255;this._greenLED.intensity=b/255;this._blueLED.intensity=c/255},fadeIn:function(a){a=a||1E3;this._redLED.fadeTo(1,a);this._greenLED.fadeTo(1,a);this._blueLED.fadeTo(1,a)},fadeOut:function(a){a=a||1E3;this._redLED.fadeTo(0,a);this._greenLED.fadeTo(0,
a);this._blueLED.fadeTo(0,a)},fadeTo:function(a,b,c,f){b/=255;c/=255;f=f||1E3;this._redLED.fadeTo(a/255,f);this._greenLED.fadeTo(b,f);this._blueLED.fadeTo(c,f)}};a.COMMON_ANODE=c.SYNC_DRIVE;a.COMMON_CATHODE=c.SOURCE_DRIVE;return a}();BREAKOUT.namespace("BREAKOUT.IOBoard");
BREAKOUT.IOBoard=function(){var a=BREAKOUT.Pin,c=BREAKOUT.EventDispatcher,d=BREAKOUT.Event,b=BREAKOUT.WSocketEvent,e=BREAKOUT.WSocketWrapper,f=BREAKOUT.IOBoardEvent;return function(i,g,o,K){function C(a){h.removeEventListener(f.FIRMWARE_VERSION,C);if(23<=10*a.version)h.send([k,L,l]);else throw Error("You must upload StandardFirmata version 2.3 or greater from Arduino version 1.0 or higher");}function M(){console.log("debug: startup");h.dispatchEvent(new f(f.READY));h.enableDigitalPins()}function D(a){a=
a.substring(0,1);return a.charCodeAt(0)}function E(b){var c=b.target.getType(),d=b.target.number,b=b.target.value;switch(c){case a.DOUT:F(d,b);break;case a.AOUT:G(d,b);break;case a.SERVO:c=h.getDigitalPin(d),c.getType()==a.SERVO&&c.lastValue!=b&&G(d,b)}}function w(b){if(b.getType()==a.DOUT||b.getType()==a.AOUT||b.getType()==a.SERVO)b.hasEventListener(d.CHANGE)||b.addEventListener(d.CHANGE,E);else if(b.hasEventListener(d.CHANGE))try{b.removeEventListener(d.CHANGE,E)}catch(c){console.log("debug: caught pin removeEventListener exception")}}
function G(a,b){var c=h.getDigitalPin(a).maxPWMValue,b=b*c,b=0>b?0:b,b=b>c?c:b;if(15<a||b>Math.pow(2,14)){var c=b,d=[];if(c>Math.pow(2,16))throw console.log("Extended Analog values > 16 bits are not currently supported by StandardFirmata"),"Extended Analog values > 16 bits are not currently supported by StandardFirmata";d[0]=k;d[1]=N;d[2]=a;d[3]=c&127;d[4]=c>>7&127;c>=Math.pow(2,14)&&(d[5]=c>>14&127);d.push(l);h.send(d)}else h.send([y|a&15,b&127,b>>7&127])}function F(b,c){var d=Math.floor(b/8);if(c==
a.HIGH)s[d]|=c<<b%8;else if(c==a.LOW)s[d]&=~(1<<b%8);else{console.log("Warning: Invalid value passed to sendDigital, value must be 0 or 1.");return}h.sendDigitalPort(d,s[d])}this.name="IOBoard";var y=224,k=240,l=247,N=111,L=107,h=this,m,z=0,A=0,r=[],n=[],p=0,s=[],t,B=[],H=[],I=[],q=[],u=0,J=19,v=0,x=new c(this);!o&&"number"===typeof g&&(g+="/websocket");m=new e(i,g,o,K);m.addEventListener(b.CONNECTED,function(){console.log("Socket Status: (open)");h.dispatchEvent(new d(d.CONNECTED));h.addEventListener(f.FIRMWARE_VERSION,
C);h.reportVersion()});m.addEventListener(b.MESSAGE,function(b){var b=b.message,b=1*b,c;if(0<p&&128>b){if(p--,r[p]=b,0==p)switch(z){case 144:var d=8*A;c=d+8;var b=r[1]|r[0]<<7,e={};c>=u&&(c=u);for(var g=0,i=d;i<c;i++){e=h.getDigitalPin(i);if(void 0==e)break;if(e.getType()==a.DIN&&(d=b>>g&1,d!=e.value))e.value=d,h.dispatchEvent(new f(f.DIGITAL_DATA),{pin:e});g++}break;case 249:v=r[1]+r[0]/10;h.dispatchEvent(new f(f.FIRMWARE_VERSION),{version:v});break;case y:c=h.getAnalogPin(A);if(void 0==c)break;
c.value=h.getValueFromTwo7bitBytes(r[1],r[0])/1023;c.value!=c.lastValue&&h.dispatchEvent(new f(f.ANALOG_DATA),{pin:c})}}else if(0>p)if(b==l){p=0;switch(n[0]){case 121:c=n;b="";for(g=3;g<c.length;g+=2)e=String.fromCharCode(c[g]),e+=String.fromCharCode(c[g+1]),b+=e;v=c[1]+c[2]/10;h.dispatchEvent(new f(f.FIRMWARE_NAME),{name:b,version:v});break;case 113:c=n;b="";for(g=1;g<c.length;g+=2)e=String.fromCharCode(c[g]),e+=String.fromCharCode(c[g+1]),b+=e.charAt(0);h.dispatchEvent(new f(f.STRING_MESSAGE),{message:b});
break;case 108:for(var b=n,e={},g=1,d=c=0,i=b.length,j;g<=i;)if(127==b[g]){H[c]=c;j=void 0;if(e[a.DOUT])j=a.DOUT;if(e[a.AIN])j=a.AIN,B[d++]=c;j=new a(c,j);j.setCapabilities(e);w(j);q[c]=j;j.getCapabilities()[a.I2C]&&I.push(j.number);e={};c++;g++}else e[b[g]]=b[g+1],g+=2;t=Math.ceil(c/8);console.log("debug: num ports = "+t);for(b=0;b<t;b++)s[b]=0;u=c;console.log("debug: num pins = "+u);h.send([k,105,l]);break;case 110:b=n;e=b.length;g=b[1];d=b[2];i=q[g];4<e?c=h.getValueFromTwo7bitBytes(b[3],b[4]):
3<e&&(c=b[3]);i.getType()!=d&&(i.setType(d),w(i));if(i.value!=c)i.value=c;h.dispatchEvent(new f(f.PIN_STATE_RESPONSE),{pin:g,type:d,value:c});break;case 106:c=n;b=c.length;for(e=1;e<b;e++)127!=c[e]&&(B[c[e]]=e-1,h.getPin(e-1).setAnalogNumber(c[e]));console.log("debug: system reset");h.send(255);setTimeout(M,500);console.log("debug: configured");break;default:h.dispatchEvent(new f(f.SYSEX_MESSAGE),{message:n})}n=[]}else n.push(b);else switch(240>b?(c=b&240,A=b&15):c=b,c){case 249:case 144:case y:p=
2;z=c;break;case k:p=-1,z=c}});m.addEventListener(b.CLOSE,function(){console.log("Socket Status: "+m.readyState+" (Closed)")});this.__defineGetter__("samplingInterval",function(){return J});this.__defineSetter__("samplingInterval",function(a){10<=a&&100>=a?(J=a,h.send([k,122,a&127,a>>7&127,l])):console.log("Warning: Sampling interval must be between 10 and 100")});this.getValueFromTwo7bitBytes=function(a,b){return b<<7|a};this.getSocket=function(){return m};this.reportVersion=function(){h.send(249)};
this.reportFirmware=function(){h.send([k,121,l])};this.disableDigitalPins=function(){for(var b=0;b<t;b++)h.sendDigitalPortReporting(b,a.OFF)};this.enableDigitalPins=function(){for(var b=0;b<t;b++)h.sendDigitalPortReporting(b,a.ON)};this.sendDigitalPortReporting=function(a,b){h.send([208|a,b])};this.enableAnalogPin=function(b){h.send([192|b,a.ON]);h.getAnalogPin(b).setType(a.AIN)};this.disableAnalogPin=function(b){h.send([192|b,a.OFF]);h.getAnalogPin(b).setType(a.AIN)};this.setDigitalPinMode=function(a,
b){h.getDigitalPin(a).setType(b);w(h.getDigitalPin(a));h.send([244,a,b])};this.enablePullUp=function(b){F(b,a.HIGH)};this.getFirmwareVersion=function(){return v};this.sendDigitalPort=function(a,b){h.send([144|a&15,b&127,b>>7])};this.sendString=function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(D(a[c])&127),b.push(D(a[c])>>7&127);this.sendSysex(113,b)};this.sendSysex=function(a,b){var c=[];c[0]=k;c[1]=a;for(var d=0,e=b.length;d<e;d++)c.push(b[d]);c.push(l);h.send(c)};this.sendServoAttach=function(b,
c,d){var c=c||544,d=d||2400,e=[];e[0]=k;e[1]=112;e[2]=b;e[3]=c%128;e[4]=c>>7;e[5]=d%128;e[6]=d>>7;e[7]=l;h.send(e);b=h.getDigitalPin(b);b.setType(a.SERVO);w(b)};this.queryPinState=function(a){h.send([k,109,a.number,l])};this.getPin=function(a){return q[a]};this.getAnalogPin=function(a){return q[B[a]]};this.getDigitalPin=function(a){return q[H[a]]};this.getPinCount=function(){return u};this.getI2cPins=function(){return I};this.reportCapabilities=function(){for(var a={"0":"input",1:"output",2:"analog",
3:"pwm",4:"servo",5:"shift",6:"i2c"},b=0,c=q.length;b<c;b++)for(var d in q[b].getCapabilities())console.log("pin "+b+"\tmode: "+a[d]+"\tresolution (# of bits): "+q[b].getCapabilities()[d])};this.send=function(a){m.send(a)};this.close=function(){console.log("socket = "+m);m.close()};this.addEventListener=function(a,b){x.addEventListener(a,b)};this.removeEventListener=function(a,b){x.removeEventListener(a,b)};this.hasEventListener=function(a){return x.hasEventListener(a)};this.dispatchEvent=function(a,
b){return x.dispatchEvent(a,b)}}}();
