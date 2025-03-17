import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";

export class Main {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
        this.setupButtonListeners();
        this.drawPie();
    }

    setupButtonListeners() {
        const buttons = document.querySelectorAll(".buttons-layout a");
        buttons.forEach(button => {
            button.addEventListener("click", (event) => {
                this.handleButtonClick(event, buttons);
            });
        });
    }

    handleButtonClick(event, buttons) {
        buttons.forEach(btn => btn.classList.remove("btn-secondary"));
        buttons.forEach(btn => btn.classList.add("btn-outline-secondary"));
        event.currentTarget.classList.add("btn-secondary");
        event.currentTarget.classList.remove("btn-outline-secondary");
    }

    async drawPie() {
        try {
            const data = await this.getAllData();

            const incomeItems = data.filter(item => item.type === "income");
            const expenseItems = data.filter(item => item.type !== "income");

            this.createChart("incomeChart", "Доходы", incomeItems);

            this.createChart("expensesChart", "Расходы", expenseItems);

        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    }

    async getAllData() {
        try {
            const result = await HttpUtils.request('/operations');
            return result.response || [];
        } catch (error) {
            console.error("Ошибка запроса:", error);
            return [];
        }
    }

    getRandomColor() {
        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }

    createChart(canvasId, label, items) {
        const ctx = document.getElementById(canvasId)?.getContext("2d");
        if (!ctx) return;

        new Chart(ctx, {
            type: "pie",
            data: {
                labels: items.map(item => item.comment || "Без названия"),
                datasets: [{
                    label: label,
                    data: items.map(item => item.amount),
                    backgroundColor: items.map(() => this.getRandomColor()),
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
    }
}