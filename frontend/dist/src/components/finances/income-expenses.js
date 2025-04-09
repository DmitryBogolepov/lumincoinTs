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
import * as bootstrap from "../../../dist/js/bootstrap.min";
var IncomeExpense = /** @class */ (function () {
    function IncomeExpense(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.currentPeriod = "all";
        this.startDate = null;
        this.endDate = null;
        this.categories = [];
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        this.loadCategories();
        this.setupButtonListeners();
        this.initDatePickers();
        this.drawTable();
        this.initDeleteButtons();
    }
    IncomeExpense.prototype.loadCategories = function () {
        return __awaiter(this, void 0, void 0, function () {
            var incomeResult, expenseResult, error_1;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, HttpUtils.request("/categories/income", "GET", true)];
                    case 1:
                        incomeResult = _c.sent();
                        return [4 /*yield*/, HttpUtils.request("/categories/expense", "GET", true)];
                    case 2:
                        expenseResult = _c.sent();
                        if (!incomeResult.error && incomeResult.response) {
                            (_a = this.categories).push.apply(_a, incomeResult.response.map(function (cat) { return (__assign(__assign({}, cat), { type: 'income' })); }));
                        }
                        if (!expenseResult.error && expenseResult.response) {
                            (_b = this.categories).push.apply(_b, expenseResult.response.map(function (cat) { return (__assign(__assign({}, cat), { type: 'expense' })); }));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _c.sent();
                        console.error("Ошибка при загрузке категорий:", error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IncomeExpense.prototype.setupButtonListeners = function () {
        var _this = this;
        var buttons = document.querySelectorAll(".buttons-layout a");
        buttons.forEach(function (button) {
            button.addEventListener("click", function (event) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.handleButtonClick(event, buttons)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    IncomeExpense.prototype.handleButtonClick = function (event, buttons) {
        return __awaiter(this, void 0, void 0, function () {
            var target, buttonText;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        buttons.forEach(function (btn) { return btn.classList.remove("btn-secondary"); });
                        buttons.forEach(function (btn) { return btn.classList.add("btn-outline-secondary"); });
                        target = event.currentTarget;
                        target.classList.add("btn-secondary");
                        target.classList.remove("btn-outline-secondary");
                        buttonText = target.innerText;
                        switch (buttonText) {
                            case "Сегодня":
                                this.currentPeriod = "day";
                                break;
                            case "Неделя":
                                this.currentPeriod = "week";
                                break;
                            case "Месяц":
                                this.currentPeriod = "month";
                                break;
                            case "Год":
                                this.currentPeriod = "year";
                                break;
                            case "Все":
                                this.currentPeriod = "all";
                                break;
                            case "Интервал":
                                this.currentPeriod = "interval";
                                break;
                            default:
                                this.currentPeriod = "all";
                                break;
                        }
                        if (!(this.currentPeriod === "interval")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.updateTable()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.drawTable()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    IncomeExpense.prototype.initDatePickers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startInput, endInput;
            var _this = this;
            return __generator(this, function (_a) {
                startInput = document.getElementById("start-interval");
                endInput = document.getElementById("end-interval");
                flatpickr(startInput, {
                    dateFormat: "Y-m-d",
                    onChange: function (selectedDates) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.startDate = selectedDates[0];
                                    return [4 /*yield*/, this.updateTable()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }
                });
                flatpickr(endInput, {
                    dateFormat: "Y-m-d",
                    onChange: function (selectedDates) {
                        _this.endDate = selectedDates[0];
                        _this.updateTable();
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    IncomeExpense.prototype.updateTable = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.startDate && this.endDate)) return [3 /*break*/, 5];
                        params = new URLSearchParams({
                            period: this.currentPeriod,
                            dateFrom: this.startDate.toISOString().split("T")[0],
                            dateTo: this.endDate.toISOString().split("T")[0]
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, HttpUtils.request("/operations?".concat(params), "GET", true)];
                    case 2:
                        result = _a.sent();
                        data = result.response || [];
                        return [4 /*yield*/, this.drawTable(data)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _a.sent();
                        console.error("Ошибка при обновлении таблицы:", error_2);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    IncomeExpense.prototype.getAllData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        params = new URLSearchParams({
                            period: this.currentPeriod || "all",
                        });
                        if (this.currentPeriod === "interval") {
                            params.append("dateFrom", this.startDate.toISOString().split("T")[0]);
                            params.append("dateTo", this.endDate.toISOString().split("T")[0]);
                        }
                        return [4 /*yield*/, HttpUtils.request("/operations?".concat(params), "GET", true)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.response || []];
                    case 2:
                        error_3 = _a.sent();
                        console.error("Ошибка запроса:", error_3);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    IncomeExpense.prototype.drawTable = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var tbody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!data) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllData()];
                    case 1:
                        data = _a.sent();
                        _a.label = 2;
                    case 2:
                        tbody = document.querySelector(".table tbody");
                        tbody.innerHTML = "";
                        data.forEach(function (item, index) {
                            var typeText = "";
                            var typeColor = "";
                            if (item.type === "income") {
                                typeText = "Доход";
                                typeColor = "text-success";
                            }
                            else if (item.type === "expense") {
                                typeText = "Расход";
                                typeColor = "text-danger";
                            }
                            else {
                                typeText = "Неизвестно";
                                typeColor = "text-muted";
                            }
                            var categoryText = item.category || '—';
                            var row = document.createElement("tr");
                            row.classList.add("table-row");
                            row.setAttribute("data-id", item.id);
                            row.innerHTML = "\n                <th scope=\"row\">".concat(index + 1, "</th>\n                <td class=\"").concat(typeColor, "\">").concat(typeText, "</td>\n                <td>").concat(categoryText, "</td>\n                <td>").concat(item.amount, "</td>\n                <td>").concat(item.date, "</td>\n                <td>").concat(item.comment || '—', "</td>\n                <td>\n                    <a href=\"javascript:void(0)\" class=\"delete-btn delete-icon text-decoration-none\">\n                        <svg width=\"14\" height=\"15\" viewBox=\"0 0 14 15\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                            <path d=\"M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z\" fill=\"black\"/>\n                            <path d=\"M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z\" fill=\"black\"/>\n                            <path d=\"M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z\" fill=\"black\"/>\n                            <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z\" fill=\"black\"/>\n                        </svg>\n                    </a>\n                    <a href=\"/change?id=").concat(item.id, "\" class=\"redact-icon text-decoration-none\">\n                        <svg width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n                            <path d=\"M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z\" fill=\"black\"/>\n                        </svg>\n                    </a>\n                </td>\n            ");
                            tbody.appendChild(row);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    IncomeExpense.prototype.initDeleteButtons = function () {
        var _this = this;
        document.addEventListener("click", function (event) {
            var target = event.target;
            var deleteButton = target.closest(".delete-btn");
            if (deleteButton) {
                event.preventDefault();
                _this.currentDeleteTarget = deleteButton.closest(".table-row");
                _this.currentDeleteId = _this.currentDeleteTarget.dataset.id;
                var deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
                deleteModal.show();
            }
        });
        document.getElementById("confirmDelete").addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
            var response, modalElement, modalInstance, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.currentDeleteTarget) return [3 /*break*/, 7];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, HttpUtils.request("/operations/".concat(this.currentDeleteId), "DELETE", true)];
                    case 2:
                        response = _a.sent();
                        if (!!response.error) return [3 /*break*/, 4];
                        modalElement = document.getElementById("deleteModal");
                        modalInstance = bootstrap.Modal.getInstance(modalElement);
                        modalInstance.hide();
                        return [4 /*yield*/, this.drawTable()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        console.error("Ошибка удаления:", response);
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_4 = _a.sent();
                        console.error("Ошибка запроса:", error_4);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); });
    };
    return IncomeExpense;
}());
export { IncomeExpense };
