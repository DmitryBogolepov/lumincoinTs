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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import config from "../config/config";
import { AuthUtils } from "./auth-utils";
var HttpUtils = /** @class */ (function () {
    function HttpUtils() {
    }
    HttpUtils.request = function (url_1) {
        return __awaiter(this, arguments, void 0, function (url, method, useAuth, body) {
            var result, params, token, response, _a, e_1, updateTokenResult;
            if (method === void 0) { method = "GET"; }
            if (useAuth === void 0) { useAuth = true; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        result = {
                            error: false,
                            response: null,
                        };
                        params = {
                            method: method,
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                            },
                        };
                        if (useAuth) {
                            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey);
                            if (token) {
                                params.headers["x-auth-token"] = token;
                            }
                        }
                        if (body) {
                            params.body = JSON.stringify(body);
                        }
                        response = null;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch(config.api + url, params)];
                    case 2:
                        response = _b.sent();
                        _a = result;
                        return [4 /*yield*/, response.json()];
                    case 3:
                        _a.response = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _b.sent();
                        result.error = true;
                        return [2 /*return*/, result];
                    case 5:
                        if (!(response.status < 200 || response.status >= 300)) return [3 /*break*/, 8];
                        result.error = true;
                        if (!(useAuth && response.status === 401)) return [3 /*break*/, 8];
                        if (!!token) return [3 /*break*/, 6];
                        result.redirect = '/sign-in';
                        return [3 /*break*/, 8];
                    case 6: return [4 /*yield*/, AuthUtils.updateRefreshToken()];
                    case 7:
                        updateTokenResult = _b.sent();
                        if (updateTokenResult) {
                            return [2 /*return*/, this.request(url, method, useAuth, body)];
                        }
                        else {
                            AuthUtils.removeAuthInfo();
                            result.redirect = '/sign-in';
                        }
                        _b.label = 8;
                    case 8: return [2 /*return*/, result];
                }
            });
        });
    };
    return HttpUtils;
}());
export { HttpUtils };
