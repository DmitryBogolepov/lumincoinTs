import {AuthUtils} from "../utils/auth-utils";
import {HttpUtils} from "../utils/http-utils";
import flatpickr from "flatpickr";
import {Chart, ChartType} from "chart.js";
import {registerables} from "chart.js";
import {OpenNewRouteType} from "../types/open-route.type";
import {DefaultResponseType} from "../types/default-response.type";
import {DataType} from "../types/data.type";

export class Main {
    readonly openNewRoute: OpenNewRouteType;
    private startDate : Date |null;
    private endDate : Date|null;
    private currentPeriod:string;
    private incomeChart: Chart | null;
    private expensesChart: Chart | null;
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
        const buttons:NodeListOf<Element> = document.querySelectorAll(".buttons-layout a");
        buttons.forEach(button => {
            button.addEventListener("click", async (event:Event):Promise<void> => {
                await this.handleButtonClick(event as MouseEvent, buttons);
            });
        });
    }
    private async handleButtonClick(event:MouseEvent, buttons:NodeListOf<Element>):Promise<void> {
        buttons.forEach(btn => btn.classList.remove("btn-secondary"));
        buttons.forEach(btn => btn.classList.add("btn-outline-secondary"));
        const target = event.currentTarget as HTMLElement;
        target.classList.add("btn-secondary");
        target.classList.remove("btn-outline-secondary");
        const buttonText:string = target.innerText;
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

    private async initDatePickers(): Promise<void> {
        const startInput: HTMLElement | null = document.getElementById("start-interval");
        const endInput: HTMLElement | null = document.getElementById("end-interval");
        if (startInput && endInput) {
            flatpickr(startInput, {
                dateFormat: "d.m.Y",
                onChange: (selectedDates: Date[]): void => {
                    this.startDate = selectedDates[0];
                    this.updateCharts();
                }
            });

            flatpickr(endInput, {
                dateFormat: "d.m.Y",
                onChange: (selectedDates: Date[]): void => {
                    this.endDate = selectedDates[0];
                    this.updateCharts();
                }
            });
        }
    }

    async updateCharts():Promise<void> {
        if (this.startDate && this.endDate) {
            const params :URLSearchParams= new URLSearchParams({
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

    async drawPie(data:DataType[] | null = null):Promise<void> {
        try {
            if (!data) {
                data = await this.getAllData();
                if (data?.filter) {
                    const incomeItems:DataType[] = data.filter(item => item.type === "income");
                    const expenseItems:DataType[] = data.filter(item => item.type !== "income");
                    this.createChart("incomeChart", "Доходы", incomeItems, this.incomeChart);
                    this.createChart("expensesChart", "Расходы", expenseItems, this.expensesChart);
                }
            }
        } catch (error) {
            console.error("Ошибка при загрузке данных:", error);
        }
    }

    async getAllData():Promise<DataType[]> {
        try {
            const params:URLSearchParams = new URLSearchParams({
                period: this.currentPeriod || "all",
            });

            if (this.currentPeriod === "interval" && this.endDate && this.startDate) {
                params.append("dateFrom", this.startDate.toISOString().split("T")[0]);
                params.append("dateTo", this.endDate.toISOString().split("T")[0]);
            }
            const result: DefaultResponseType = await HttpUtils.request(`/operations?${params}`, "GET", true);
            return result.response || [];
        } catch (error) {
            console.error("Ошибка запроса:", error);
            return [];
        }
    }

    getRandomColor():string {
        return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    }

    createChart(canvasId: string,
                label: string,
                items: DataType[],
                existingChart: Chart | null) {
        Chart.register(...registerables);
        const ctx:CanvasRenderingContext2D | null = (document.getElementById(canvasId) as HTMLCanvasElement)?.getContext("2d");
        if (!ctx) return;
        if (existingChart) {
            existingChart.destroy();
        }
        const chart:Chart<ChartType> = new Chart(ctx, {
            type: "pie",
            data: {
                labels: items.map(item => item.comment || "Без названия"),
                datasets: [{
                    label: label,
                    data: items.map(item => item.amount),
                    backgroundColor: items.map(():string => this.getRandomColor()),
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