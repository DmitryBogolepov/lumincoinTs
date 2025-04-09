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
import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";
import flatpickr from "flatpickr";
import { Chart } from "chart.js";
import { registerables } from "chart.js";
var Main = /** @class */ (function () {
    function Main(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.incomeChart = null;
        this.expensesChart = null;
        this.startDate = null;
        this.endDate = null;
        this.currentPeriod = "all";
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        this.setupButtonListeners();
        this.initDatePickers();
        this.drawPie();
    }
    Main.prototype.setupButtonListeners = function () {
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
    Main.prototype.handleButtonClick = function (event, buttons) {
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
                        return [4 /*yield*/, this.updateCharts()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.drawPie()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.initDatePickers = function () {
        return __awaiter(this, void 0, void 0, function () {
            var startInput, endInput;
            var _this = this;
            return __generator(this, function (_a) {
                startInput = document.getElementById("start-interval");
                endInput = document.getElementById("end-interval");
                flatpickr(startInput, {
                    dateFormat: "Y-m-d",
                    onChange: function (selectedDates) {
                        _this.startDate = selectedDates[0];
                        _this.updateCharts();
                    }
                });
                flatpickr(endInput, {
                    dateFormat: "Y-m-d",
                    onChange: function (selectedDates) {
                        _this.endDate = selectedDates[0];
                        _this.updateCharts();
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    Main.prototype.updateCharts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var params, result, data, error_1;
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
                        return [4 /*yield*/, HttpUtils.request("/operations?".concat(params), "GET", true, null)];
                    case 2:
                        result = _a.sent();
                        data = result.response || [];
                        return [4 /*yield*/, this.drawPie(data)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error("Ошибка при обновлении графиков:", error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.drawPie = function () {
        return __awaiter(this, arguments, void 0, function (data) {
            var incomeItems, expenseItems, error_2;
            if (data === void 0) { data = null; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        if (!!data) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getAllData()];
                    case 1:
                        data = _a.sent();
                        _a.label = 2;
                    case 2:
                        incomeItems = data.filter(function (item) { return item.type === "income"; });
                        expenseItems = data.filter(function (item) { return item.type !== "income"; });
                        this.createChart("incomeChart", "Доходы", incomeItems, this.incomeChart);
                        this.createChart("expensesChart", "Расходы", expenseItems, this.expensesChart);
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Ошибка при загрузке данных:", error_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.getAllData = function () {
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
    Main.prototype.getRandomColor = function () {
        return "rgb(".concat(Math.floor(Math.random() * 256), ", ").concat(Math.floor(Math.random() * 256), ", ").concat(Math.floor(Math.random() * 256), ")");
    };
    Main.prototype.createChart = function (canvasId, label, items, existingChart) {
        var _this = this;
        var _a;
        Chart.register.apply(Chart, registerables);
        var ctx = (_a = document.getElementById(canvasId)) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx)
            return;
        if (existingChart) {
            existingChart.destroy();
        }
        var chart = new Chart(ctx, {
            type: "pie",
            data: {
                labels: items.map(function (item) { return item.comment || "Без названия"; }),
                datasets: [{
                        label: label,
                        data: items.map(function (item) { return item.amount; }),
                        backgroundColor: items.map(function () { return _this.getRandomColor(); }),
                        hoverOffset: 4
                    }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    }
                }
            }
        });
        if (label === "Доходы") {
            this.incomeChart = chart;
        }
        else {
            this.expensesChart = chart;
        }
    };
    return Main;
}());
export { Main };
