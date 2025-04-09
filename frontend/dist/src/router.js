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
import { SignIn } from "./components/auth/sign-in.js";
import { SignUp } from "./components/auth/sign-up.js";
import { Logout } from "./components/auth/logout";
import { Main } from "./components/main";
import { Income } from "./components/finances/income";
import { Expenses } from "./components/finances/expenses";
import { ExpensesAdd } from "./components/finances/expenses-add";
import { ExpensesChange } from "./components/finances/expenses-change";
import { IncomeAdd } from "./components/finances/income-add";
import { IncomeChange } from "./components/finances/income-change";
import { Create } from "./components/finances/create";
import { Change } from "./components/finances/change";
import { IncomeExpense } from "./components/finances/income-expenses";
import { AuthUtils } from "./utils/auth-utils";
import { Layout } from "./components/layout";
var Router = /** @class */ (function () {
    function Router() {
        var _this = this;
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: "Главная",
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: function () {
                    new Main(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/sign-in',
                title: "Вход",
                filePathTemplate: '/templates/auth/sign-in.html',
                useLayout: false,
                load: function () {
                    new SignIn(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/sign-up',
                title: "Регистрация",
                filePathTemplate: '/templates/auth/sign-up.html',
                useLayout: false,
                load: function () {
                    new SignUp(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/income',
                title: "Доходы",
                filePathTemplate: '/templates/pages/finance/income.html',
                useLayout: '/templates/layout.html',
                load: function () {
                    new Income(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/incomeAdd',
                title: "Доходы",
                filePathTemplate: '/templates/pages/finance/income-add.html',
                useLayout: '/templates/layout.html',
                load: function () {
                    new IncomeAdd(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/incomeChange',
                title: "Доходы",
                filePathTemplate: '/templates/pages/finance/income-change.html',
                useLayout: '/templates/layout.html',
                load: function () {
                    new IncomeChange(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/expenses',
                title: "Расходы",
                filePathTemplate: '/templates/pages/finance/expenses.html',
                useLayout: '/templates/layout.html',
                load: function () {
                    new Expenses(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/expensesAdd',
                title: "Расходы",
                filePathTemplate: '/templates/pages/finance/expenses-add.html',
                useLayout: '/templates/layout.html',
                load: function () {
                    new ExpensesAdd(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/expensesChange',
                title: "Расходы",
                filePathTemplate: '/templates/pages/finance/expenses-change.html',
                useLayout: '/templates/layout.html',
                load: function () {
                    new ExpensesChange(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/create',
                title: "Создание дохода или расхода",
                filePathTemplate: '/templates/pages/finance/create.html',
                useLayout: '/templates/layout.html',
                load: function () {
                    new Create(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/change',
                title: "Редактирование дохода или расхода",
                filePathTemplate: '/templates/pages/finance/change.html',
                useLayout: '/templates/layout.html',
                load: function () {
                    new Change(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/income-expenses',
                title: "Редактирование дохода или расхода",
                filePathTemplate: '/templates/pages/finance/income-expenses.html',
                useLayout: '/templates/layout.html',
                load: function () {
                    new IncomeExpense(_this.openNewRoute.bind(_this));
                },
            },
            {
                route: '/logout',
                load: function () {
                    new Logout(_this.openNewRoute.bind(_this));
                }
            },
        ];
    }
    Router.prototype.initEvents = function () {
        window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
        window.addEventListener("popstate", this.activateRoute.bind(this));
        document.addEventListener("click", this.clickHandler.bind(this));
    };
    Router.prototype.openNewRoute = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var currentRoute;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        currentRoute = window.location.pathname;
                        history.pushState({}, '', url);
                        return [4 /*yield*/, this.activateRoute(currentRoute)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Router.prototype.clickHandler = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            var target, element, currentRoute, url;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        target = e.target;
                        element = null;
                        if (target.tagName === "A") {
                            element = target;
                        }
                        else if (((_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.tagName) === "A") {
                            element = target.parentElement;
                        }
                        if (!element) return [3 /*break*/, 2];
                        e.preventDefault();
                        currentRoute = window.location.pathname;
                        url = element.href.replace(window.location.origin, '');
                        if (!url || (currentRoute === url.replace('#', '')) || url.startsWith("javascript:void(0)")) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.openNewRoute(url)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Router.prototype.activateRoute = function (previousRoute) {
        return __awaiter(this, void 0, void 0, function () {
            var urlRoute, newRoute, contentBlock, _a, _b, userInfo, username, balanceElement, navLinksElement;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        urlRoute = window.location.pathname;
                        newRoute = this.routes.find(function (item) { return item.route === urlRoute; });
                        if (!newRoute) return [3 /*break*/, 6];
                        if (!newRoute) {
                            console.warn("\u041C\u0430\u0440\u0448\u0440\u0443\u0442 ".concat(urlRoute, " \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D."));
                            return [2 /*return*/];
                        }
                        if (newRoute.title) {
                            this.titlePageElement.innerText = newRoute.title;
                        }
                        if (!newRoute.filePathTemplate) return [3 /*break*/, 5];
                        contentBlock = this.contentPageElement;
                        if (!newRoute.useLayout) return [3 /*break*/, 2];
                        _a = this.contentPageElement;
                        return [4 /*yield*/, fetch(newRoute.useLayout).then(function (response) { return response.text(); })];
                    case 1:
                        _a.innerHTML = _c.sent();
                        contentBlock = document.getElementById('content-layout');
                        _c.label = 2;
                    case 2:
                        _b = contentBlock;
                        return [4 /*yield*/, fetch(newRoute.filePathTemplate).then(function (response) { return response.text(); })];
                    case 3:
                        _b.innerHTML = _c.sent();
                        new Layout();
                        userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                        if (!(userInfo && newRoute.useLayout)) return [3 /*break*/, 5];
                        username = document.getElementById('user-name');
                        Layout.setUserData(userInfo, username);
                        balanceElement = document.getElementById('balance');
                        navLinksElement = document.querySelectorAll('.sidebar .nav-link');
                        Layout.linksLogic(navLinksElement, urlRoute);
                        if (!balanceElement) return [3 /*break*/, 5];
                        return [4 /*yield*/, Layout.updateBalance(balanceElement)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        if (newRoute.load && typeof newRoute.load === "function") {
                            newRoute.load();
                        }
                        _c.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return Router;
}());
export { Router };
