import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";
import flatpickr from "flatpickr";
import {Chart} from "chart.js";
import {registerables} from "chart.js";
import {OpenNewRouteType} from "../types/open-route.type";
import {DefaultResponseType} from "../types/default-response.type";

export class Main {
    readonly openNewRoute: OpenNewRouteType;
    private startDate : Date;
    private endDate : Date;
    readonly currentPeriod:string;
    constructor(openNewRoute:OpenNewRouteType) {
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

    private setupButtonListeners():void {
        const buttons = document.querySelectorAll(".buttons-layout a");
        buttons.forEach(button => {
            button.addEventListener("click", async (event) => {
                await this.handleButtonClick(event, buttons);
            });
        });
    }
    private async handleButtonClick(event, buttons) {
        buttons.forEach(btn => btn.classList.remove("btn-secondary"));
        buttons.forEach(btn => btn.classList.add("btn-outline-secondary"));
        event.currentTarget.classList.add("btn-secondary");
        event.currentTarget.classList.remove("btn-outline-secondary");
        const buttonText = event.currentTarget.innerText;
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
        if (this.currentPeriod === "interval") {
            await this.updateCharts();
        } else {
            await this.drawPie();
        }
    }

    private async initDatePickers():Promise<void> {
        const startInput:HTMLElement | null = document.getElementById("start-interval");
        const endInput:HTMLElement | null = document.getElementById("end-interval");

        flatpickr(startInput, {
            dateFormat: "Y-m-d",
            onChange: (selectedDates:Date[]):void => {
                this.startDate = selectedDates[0];
                this.updateCharts();
            }
        });


        flatpickr(endInput, {
            dateFormat: "Y-m-d",
            onChange: (selectedDates:Date[]):void => {
                this.endDate = selectedDates[0];
                this.updateCharts();
            }
        });
    }

    async updateCharts():Promise<void> {
        if (this.startDate && this.endDate) {
            const params = new URLSearchParams({
                period: this.currentPeriod,
                dateFrom: this.startDate.toISOString().split("T")[0],
                dateTo: this.endDate.toISOString().split("T")[0]
            });

            try {
                const result:DefaultResponseType = await HttpUtils.request(`/operations?${params}`, "GET", true,null);
                const data = result.response || [];
                await this.drawPie(data);
            } catch (error) {
                console.error("Ошибка при обновлении графиков:", error);
            }
        }
    }

    async drawPie(data = null):Promise<void> {
        try {
            if (!data) {
                data = await this.getAllData();
            }

            const incomeItems = data.filter(item => item.type === "income");
            const expenseItems = data.filter(item => item.type !== "income");

            this.createChart("incomeChart", "Доходы", incomeItems, this.incomeChart);
            this.createChart("expensesChart", "Расходы", expenseItems, this.expensesChart);
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    }

    async getAllData() {
        try {
            const params = new URLSearchParams({
                period: this.currentPeriod || "all",
            });

            if (this.currentPeriod === "interval") {
                params.append("dateFrom", this.startDate.toISOString().split("T")[0]);
                params.append("dateTo", this.endDate.toISOString().split("T")[0]);
            }
            const result = await HttpUtils.request(`/operations?${params}`, "GET", true);
            return result.response || [];
        } catch (error) {
            console.error("Ошибка запроса:", error);
            return [];
        }
    }

    getRandomColor():string {
        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }

    createChart(canvasId, label, items, existingChart) {
        Chart.register(...registerables);
        const ctx = document.getElementById(canvasId)?.getContext("2d");
        if (!ctx) return;
        if (existingChart) {
            existingChart.destroy();
        }
        const chart = new Chart(ctx, {
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
        if (label === "Доходы") {
            this.incomeChart = chart;
        } else {
            this.expensesChart = chart;
        }
    }
}