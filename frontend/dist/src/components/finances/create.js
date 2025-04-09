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
import flatpickr from "flatpickr";
var Create = /** @class */ (function () {
    function Create(openNewRoute) {
        this.categoriesList = [];
        this.openNewRoute = openNewRoute;
        this.typeElement = document.getElementById('type');
        this.categoryElement = document.getElementById('category');
        this.dateElement = document.getElementById('date');
        this.amountElement = document.getElementById('amount');
        this.commentaryElement = document.getElementById('commentary');
        this.initDatePicker();
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        this.setSelectValue();
        this.typeElement.addEventListener('change', this.onTypeChange.bind(this));
        document.getElementById('process-button').addEventListener('click', this.createNewInfo.bind(this));
    }
    Create.prototype.onTypeChange = function () {
        return __awaiter(this, void 0, void 0, function () {
            var selectedType, categories;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedType = this.typeElement.value.trim();
                        this.categoryElement.innerHTML = "";
                        this.categoriesList = [];
                        categories = [];
                        if (!(selectedType === "income")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getIncomeCategories()];
                    case 1:
                        categories = _a.sent();
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(selectedType === "expense")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getExpenseCategories()];
                    case 3:
                        categories = _a.sent();
                        _a.label = 4;
                    case 4:
                        categories.forEach(function (category) {
                            _this.categoriesList.push({ id: category.id, title: category.title });
                            var option = document.createElement('option');
                            option.value = category.title;
                            option.text = category.title;
                            _this.categoryElement.appendChild(option);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    Create.prototype.validateData = function (type, category, amount, date, comment) {
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
    Create.prototype.initDatePicker = function () {
        flatpickr(this.dateElement, {
            dateFormat: "Y-m-d",
            enableTime: false,
            defaultDate: new Date(),
        });
    };
    Create.prototype.setSelectValue = function () {
        return __awaiter(this, void 0, void 0, function () {
            var urlParams, type;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        urlParams = new URLSearchParams(window.location.search);
                        type = urlParams.get("type");
                        if (!type) return [3 /*break*/, 2];
                        this.typeElement.value = type;
                        return [4 /*yield*/, this.onTypeChange()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Create.prototype.createNewInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var type, categoryTitle, amount, date, comment, foundCategory, categoryId, isValid, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = this.typeElement.value.trim();
                        categoryTitle = this.categoryElement.value;
                        amount = Number(this.amountElement.value);
                        date = this.dateElement.value.trim();
                        comment = this.commentaryElement.value.trim();
                        if (type === "Доход") {
                            type = "income";
                        }
                        else if (type === "Расход") {
                            type = "expense";
                        }
                        foundCategory = this.categoriesList.find(function (c) { return c.title === categoryTitle; });
                        categoryId = foundCategory ? foundCategory.id : null;
                        if (!categoryId) {
                            console.error("Ошибка: Не удалось найти ID категории");
                            return [2 /*return*/];
                        }
                        isValid = this.validateData(type, categoryId, amount, date, comment);
                        if (!isValid) {
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, HttpUtils.request("/operations", "POST", true, {
                                type: type,
                                category_id: categoryId,
                                amount: amount,
                                date: date,
                                comment: comment,
                            })];
                    case 2:
                        result = _a.sent();
                        if (!(result.error || !result.response)) return [3 /*break*/, 3];
                        console.error("Ошибка при запросе:", result.error.value);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.openNewRoute("/income-expenses")];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error("Ошибка при запросе:", error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    Create.prototype.getIncomeCategories = function () {
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
    Create.prototype.getExpenseCategories = function () {
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
    return Create;
}());
export { Create };
