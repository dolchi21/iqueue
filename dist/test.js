"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
//@ts-ignore
var promise_queue_1 = __importDefault(require("promise-queue"));
var _1 = __importDefault(require("./"));
var State = /** @class */ (function () {
    function State() {
        this.max = 0;
        this.media = {};
        this.iqueue = {
            count: 0,
            ms: 0
        };
        this.errors = 0;
        this.time = {
            start: Date.now(),
            end: Date.now(),
            ms: 0
        };
    }
    return State;
}());
function file(name, data) {
    return __awaiter(this, void 0, void 0, function () {
        var str;
        return __generator(this, function (_a) {
            if (!data)
                return [2 /*return*/, new Promise(function (resolve, reject) { return fs_1.default.readFile(name, function (err, data) {
                        if (err)
                            return reject(err);
                        resolve(JSON.parse(data.toString()));
                    }); })];
            str = JSON.stringify(data, null, 2);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    fs_1.default.writeFile(name, str, function (err) {
                        if (err)
                            return reject(err);
                        resolve();
                    });
                })];
        });
    });
}
function task() {
    return __awaiter(this, void 0, void 0, function () {
        var url, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = 'https://web02.cobranzas.com/api/';
                    return [4 /*yield*/, axios_1.default.get(url, {
                            headers: {
                                cobranzas: '123'
                            }
                        })];
                case 1:
                    res = _a.sent();
                    return [2 /*return*/, res.data];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var queue, media, state, tasks, iqueue, i, t;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (process.argv[2])
                        return [2 /*return*/, analize()];
                    queue = new promise_queue_1.default(5);
                    media = {};
                    state = new State();
                    tasks = [];
                    iqueue = new _1.default(queue);
                    for (i = 0; i < 10000; i++) {
                        t = iqueue.add(function () { return __awaiter(_this, void 0, void 0, function () {
                            var key, start;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        key = queue.maxPendingPromises;
                                        start = Date.now();
                                        return [4 /*yield*/, task()];
                                    case 1:
                                        _a.sent();
                                        if (!media[key])
                                            media[key] = {
                                                count: 0,
                                                ms: 0,
                                            };
                                        media[key].count++;
                                        media[key].ms += Date.now() - start;
                                        return [2 /*return*/, 123];
                                }
                            });
                        }); });
                        t.then(function () {
                            if (state.max < queue.maxPendingPromises)
                                state.max = queue.maxPendingPromises;
                            state.time.end = Date.now();
                            state.time.ms = state.time.end - state.time.start;
                            console.log(queue.getQueueLength(), queue.maxPendingPromises, __assign(__assign({}, state), iqueue.state));
                            return file('state.json', __assign(__assign({}, state), { iqueue: iqueue.state }));
                        }).catch(function (err) {
                            state.errors++;
                            console.error(err);
                        });
                        tasks.push(t);
                    }
                    return [4 /*yield*/, file('state.json', __assign(__assign({}, state), { iqueue: iqueue.state }))];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Promise.all(tasks)];
                case 2:
                    _a.sent();
                    state.time.end = Date.now();
                    state.time.ms = state.time.end - state.time.start;
                    return [4 /*yield*/, file('state.json', __assign(__assign({}, state), { iqueue: iqueue.state, media: media }))];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function analize(num) {
    if (num === void 0) { num = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var state, r;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, file('state' + num + '.json')];
                case 1:
                    state = _a.sent();
                    r = Object.entries(state.media).map(function (pair) {
                        var _a = pair[1], count = _a.count, ms = _a.ms;
                        return {
                            key: pair[0],
                            value: ms / count
                        };
                    }).sort(function (a, b) {
                        return a.value - b.value;
                    }).filter(function (e, i) { return i < 20; });
                    console.log(r);
                    console.log('ms', state.iqueue.ms, state.iqueue.ms / state.iqueue.count);
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(function (err) {
});
