import {SignIn} from "./components/auth/sign-in";
import {SignUp} from "./components/auth/sign-up";
import {Logout} from "./components/auth/logout";
import {Main} from "./components/main";
import {Income} from "./components/finances/income";
import {Expenses} from "./components/finances/expenses";
import {ExpensesAdd} from "./components/finances/expenses-add";
import {ExpensesChange} from "./components/finances/expenses-change";
import {IncomeAdd} from "./components/finances/income-add";
import {IncomeChange} from "./components/finances/income-change";
import {Create} from "./components/finances/create";
import {Change} from "./components/finances/change";
import {IncomeExpense} from "./components/finances/income-expenses";
import {AuthUtils} from "./utils/auth-utils";
import {Layout} from "./components/layout";
import {RouteType} from "./types/route.type";
import {AuthInfo} from "./types/Auth-tokens-response.type";


export class Router {
    readonly titlePageElement : HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;
    private routes:RouteType[];
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

    private initEvents(): void {
        window.addEventListener("DOMContentLoaded", (e) => this.activateRoute());
        window.addEventListener("popstate", (e) => this.activateRoute());
        document.addEventListener("click", this.clickHandler.bind(this));
    }

    public async openNewRoute(url:string):Promise<void> {
        const currentRoute:string = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(currentRoute);
    }

    async clickHandler(e:Event):Promise<void> {
        const target = e.target as HTMLElement;
        let element:HTMLAnchorElement | null = null;
        if (target.tagName === "A") {
            element = target as HTMLAnchorElement;

        } else if (target.parentElement?.tagName === "A") {
            element = target.parentElement as HTMLAnchorElement;
        }

        if (element) {
            e.preventDefault();
            const currentRoute = window.location.pathname;
            const url:string = element.href.replace(window.location.origin, '');

            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith("javascript:void(0)")) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRoute(previousRoute?: string):Promise<void> {
        const urlRoute:string = window.location.pathname;
        const newRoute:RouteType | undefined = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if (!newRoute) {
                console.warn(`Маршрут ${urlRoute} не найден.`);
                return;
            }
            if (newRoute.title) {
                if (this.titlePageElement) {
                    this.titlePageElement.innerText = newRoute.title;
                }
            }
            if (newRoute.filePathTemplate) {
                let contentBlock: HTMLElement | null = this.contentPageElement;

                if (newRoute.useLayout) {
                    if (this.contentPageElement) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.useLayout as string).then(response => response.text());
                        contentBlock = document.getElementById('content-layout');
                    }
                }
                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
                }
                new Layout();
                const userInfo: AuthInfo | string | null = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                if (userInfo && newRoute.useLayout) {
                    const username: HTMLElement | null = document.getElementById('user-name');
                    // Layout.setUserData(userInfo, username);
                    const balanceElement: HTMLElement | null = document.getElementById('balance');
                    const navLinksElement: NodeListOf<Element> = document.querySelectorAll('.sidebar .nav-link');
                    Layout.linksLogic(navLinksElement, urlRoute);
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