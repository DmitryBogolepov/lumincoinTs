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
var Change = /** @class */ (function () {
    function Change(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.typeElement = document.getElementById('type');
        this.categoryElement = document.getElementById('category');
        this.dateElement = document.getElementById('date');
        this.amountElement = document.getElementById('amount');
        this.commentaryElement = document.getElementById('commentary');
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        this.loadData();
        this.typeElement.addEventListener('change', this.onTypeChange.bind(this));
        document.getElementById('process-button').addEventListener('click', this.createNewInfo.bind(this));
    }
    Change.prototype.loadData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, id, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        params = new URLSearchParams(window.location.search);
                        id = params.get("id");
                        if (!id) return [3 /*break*/, 4];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, HttpUtils.request("/operations/".concat(id), "GET", true, null)];
                    case 2:
                        result = _a.sent();
                        if (result.response) {
                            this.populateForm(result.response);
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Ошибка при загрузке данных операции:", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Change.prototype.populateForm = function (data) {
        this.typeElement.value = data.type;
        this.amountElement.value = data.amount.toString();
        this.dateElement.value = data.date;
        this.commentaryElement.value = data.comment || '';
        this.onTypeChange();
        this.categoryElement.value = data.category_id.toString();
    };
    Change.prototype.onTypeChange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selectedType, categories, categories;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedType = this.typeElement.value.trim();
                        this.categoryElement.innerHTML = "";
                        if (!(selectedType === "income")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getIncomeCategories()];
                    case 1:
                        categories = _a.sent();
                        categories.forEach(function (category) {
                            var option = document.createElement('option');
                            option.value = category.title;
                            option.text = category.title;
                            _this.categoryElement.appendChild(option);
                        });
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(selectedType === "expense")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getExpenseCategories()];
                    case 3:
                        categories = _a.sent();
                        categories.forEach(function (category) {
                            var option = document.createElement('option');
                            option.value = category.title;
                            option.text = category.title;
                            _this.categoryElement.appendChild(option);
                        });
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Change.prototype.validateData = function (type, category, amount, date, comment) {
        var isValid = true;
        if (["income", "expense"].includes(type)) {
            this.typeElement.classList.remove('is-invalid');
        }
        else {
            this.typeElement.classList.add('is-invalid');
            isValid = false;
        }
        if (category || category !== null) {
            this.categoryElement.classList.remove('is-invalid');
        }
        else {
            this.categoryElement.classList.add('is-invalid');
            isValid = false;
        }
        if (!(isNaN(amount) || amount <= 0)) {
            this.amountElement.classList.remove('is-invalid');
        }
        else {
            this.amountElement.classList.add('is-invalid');
            isValid = false;
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            this.dateElement.classList.remove('is-invalid');
        }
        else {
            this.dateElement.classList.add('is-invalid');
            isValid = false;
        }
        if (comment !== null && comment.trim() !== '') {
            this.commentaryElement.classList.remove('is-invalid');
        }
        else {
            this.commentaryElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    };
    Change.prototype.createNewInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var type, category_id, amount, date, comment, params, id, isValid, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = this.typeElement.value.trim();
                        category_id = Number(this.categoryElement.value);
                        amount = Number(this.amountElement.value);
                        date = this.dateElement.value.trim();
                        comment = this.commentaryElement.value.trim();
                        params = new URLSearchParams(window.location.search);
                        id = params.get("id");
                        if (!id)
                            return [2 /*return*/];
                        isValid = this.validateData(type, category_id, amount, date, comment);
                        if (!isValid) {
                            alert("Ошибка валидации, проверьте введенные данные.");
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, HttpUtils.request("/operations/".concat(id), "PUT", true, {
                                type: type,
                                category_id: category_id,
                                amount: amount,
                                date: date,
                                comment: comment,
                            })];
                    case 2:
                        result = _a.sent();
                        if (!(result.error || !result.response)) return [3 /*break*/, 3];
                        alert("Произошла ошибка при отправке данных.");
                        return [2 /*return*/];
                    case 3: return [4 /*yield*/, this.openNewRoute("/income-expenses")];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.error("Ошибка при запросе:", error_2);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Change.prototype.getIncomeCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, HttpUtils.request("/categories/income", "GET", true, null)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.response) || []];
                }
            });
        });
    };
    Change.prototype.getExpenseCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, HttpUtils.request("/categories/expense", "GET", true, null)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, (result === null || result === void 0 ? void 0 : result.response) || []];
                }
            });
        });
    };
    return Change;
}());
export { Change };
