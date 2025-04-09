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
import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";
var SignUp = /** @class */ (function () {
    function SignUp(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }
        this.emailElement = document.getElementById('email');
        this.nameElement = document.getElementById('name');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }
    SignUp.prototype.validateForm = function () {
        var isValid = true;
        if (this.nameElement.value) {
            this.nameElement.classList.remove('is-invalid');
        }
        else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.emailElement.value && this.emailElement.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            this.emailElement.classList.remove('is-invalid');
        }
        else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        }
        else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        }
        else {
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    };
    SignUp.prototype.signUp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fullName, firstName, lastName, result, loginResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.validateForm()) return [3 /*break*/, 3];
                        fullName = this.nameElement.value.trim().split(' ');
                        firstName = fullName[0];
                        lastName = fullName.slice(1).join(' ');
                        return [4 /*yield*/, HttpUtils.request('/signup', 'POST', false, {
                                name: firstName,
                                lastName: lastName,
                                email: this.emailElement.value,
                                password: this.passwordElement.value,
                                passwordRepeat: this.passwordRepeatElement.value,
                            })];
                    case 1:
                        result = _a.sent();
                        if (result.error || !result.response) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, HttpUtils.request('/login', 'POST', false, {
                                email: this.emailElement.value,
                                password: this.passwordElement.value,
                            })];
                    case 2:
                        loginResult = _a.sent();
                        if (loginResult.error || !loginResult.response) {
                            return [2 /*return*/];
                        }
                        AuthUtils.setAuthInfo(loginResult.response.tokens.accessToken, loginResult.response.tokens.refreshToken, loginResult.response.user);
                        this.openNewRoute("/");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SignUp;
}());
export { SignUp };
