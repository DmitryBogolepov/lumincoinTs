import {SignIn} from "./components/auth/sign-in.js";
import {SignUp} from "./components/auth/sign-up.js";
import {Logout} from "./components/auth/logout";
import {FileUtils} from "./utils/file-utils";
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

    async activateRoute(e, oldRoute=null) {
        if( oldRoute ) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                });
            }
            if (currentRoute.unload && typeof currentRoute.unload === "function") {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);
        if (newRoute) {
            if (!newRoute) {
                console.warn(`Маршрут ${urlRoute} не найден.`);
                return;
            }
            if(newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style);
                });
            }

            if(newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/'+ script);
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title;
            }

            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('layout-fixed');
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('layout-fixed');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }
            // Не знал куда лучше вынести код который для сайдбара оставил пока тут
            document.querySelectorAll('.sidebar .nav-link').forEach(link => {
                if (link.getAttribute('href') === urlRoute) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });


            if (newRoute.load && typeof newRoute.load === "function") {
                newRoute.load();
            }
            this.initModal();
        }
    }
    initModal() {
        console.log("Инициализация модалки");
        const userAction = document.getElementById("user-click"); // Изменено на правильный идентификатор
        const modal = document.getElementById("user-modal");
        const closeModal = document.getElementById("close-modal");
        const logoutBtn = document.getElementById("logout");

        console.log("modal: ", modal); // Проверяем, существует ли модальное окно
        console.log("closeModal: ", closeModal); // Проверяем, существует ли кнопка закрытия
        console.log("logoutBtn: ", logoutBtn); // Проверяем, существует ли кнопка выхода

        if (userAction && modal) { // Проверяем, существует ли userAction
            userAction.addEventListener("click", function (event) {
                event.preventDefault();
                console.log("Открытие модалки");
                modal.style.display = "flex";
            });
        }

        if (closeModal && modal) {
            closeModal.addEventListener("click", function () {
                modal.style.display = "none";
            });
        }

        if (modal) {
            window.addEventListener("click", function (event) {
                if (event.target === modal) {
                    modal.style.display = "none";
                }
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener("click", function () {
                this.openNewRoute('/logout')
            });
        }
    }
}