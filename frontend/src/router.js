import {SignIn} from "./components/auth/sign-in.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Logout} from "./components/auth/logout";
import {Main} from "./components/main";
import {Income} from "./components/finances/income";
import {Expenses} from "./components/finances/expenses";
import {ExpensesAdd} from "./components/finances/expenses-add";
import {ExpensesChange} from "./components/finances/expenses-change";
import {IncomeAdd} from "./components/finances/income-add";
import {IncomeChange} from "./components/finances/income-change";
import {Create} from "./components/finances/create";
import {Change} from "./components/finances/Change";
import {IncomeExpense} from "./components/finances/income-expenses";
import {AuthUtils} from "./utils/auth-utils";
import {Layout} from "./components/layout";


export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: "Главная",
                filePathTemplate: '/templates/pages/main.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Main(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/sign-in',
                title: "Вход",
                filePathTemplate: '/templates/auth/sign-in.html',
                useLayout: false,
                load: () => {
                    new SignIn(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/sign-up',
                title: "Регистрация",
                filePathTemplate: '/templates/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new SignUp(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income',
                title: "Доходы",
                filePathTemplate: '/templates/pages/finance/income.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Income(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/incomeAdd',
                title: "Доходы",
                filePathTemplate: '/templates/pages/finance/income-add.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeAdd(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/incomeChange',
                title: "Доходы",
                filePathTemplate: '/templates/pages/finance/income-change.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeChange(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expenses',
                title: "Расходы",
                filePathTemplate: '/templates/pages/finance/expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Expenses(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expensesAdd',
                title: "Расходы",
                filePathTemplate: '/templates/pages/finance/expenses-add.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesAdd(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/expensesChange',
                title: "Расходы",
                filePathTemplate: '/templates/pages/finance/expenses-change.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpensesChange(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/create',
                title: "Создание дохода или расхода",
                filePathTemplate: '/templates/pages/finance/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Create(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/change',
                title: "Редактирование дохода или расхода",
                filePathTemplate: '/templates/pages/finance/change.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Change(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income-expenses',
                title: "Редактирование дохода или расхода",
                filePathTemplate: '/templates/pages/finance/income-expenses.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeExpense(this.openNewRoute.bind(this));
                },
            },
            {
                route:'/logout',
                load:() => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
        ]
    }
    initEvents() {
        window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
        window.addEventListener("popstate", this.activateRoute.bind(this));
        document.addEventListener("click", this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;

        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();
            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');

            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith("javascript:void(0)")) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRoute() {
        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if (!newRoute) {
                console.warn(`Маршрут ${urlRoute} не найден.`);
                return;
            }
            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                new Layout();
                const userInfo = JSON.parse(AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey));
                if (userInfo && newRoute.useLayout) {
                    const username = document.getElementById('user-name');
                    Layout.setUserData(userInfo,username);
                    const balanceElement = document.getElementById('balance');
                    const navLinksElement = document.querySelectorAll('.sidebar .nav-link');
                    Layout.linksLogic(navLinksElement, urlRoute)
                    if (balanceElement) {
                        await Layout.updateBalance(balanceElement);
                    }
                 }
            }
            if (newRoute.load && typeof newRoute.load === "function") {
                newRoute.load();
            }

        }
    }
}