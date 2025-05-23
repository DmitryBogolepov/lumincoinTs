import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import flatpickr from "flatpickr";

import {OpenNewRouteType} from "../../types/open-route.type";
import {CategoryRequestType} from "../../types/category-request.type";
import {DefaultResponseType} from "../../types/default-response.type";
import * as bootstrap from "bootstrap";
import {Modal} from "bootstrap";
import {TableDataType} from "../../types/table-data.type";

export class IncomeExpense {
    readonly openNewRoute: OpenNewRouteType;
    private startDate: Date | null;
    private endDate: Date | null;
    private currentPeriod: string;
    private categories: CategoryRequestType[];
    private currentDeleteId!: string | null;
    private currentDeleteTarget!: HTMLElement | null;
    private deleteModalInstance: Modal | null = null;
    readonly intervalBlock:HTMLElement | null;
    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.currentPeriod = "day";
        this.startDate = null;
        this.endDate = null;
        this.categories = [];
        this.intervalBlock =document.getElementById('interval-block');
        if(this.intervalBlock)this.intervalBlock.style.display ="none";
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

    async loadCategories(): Promise<void> {
        try {
            const incomeResult: DefaultResponseType = await HttpUtils.request("/categories/income", "GET", true);
            const expenseResult: DefaultResponseType = await HttpUtils.request("/categories/expense", "GET", true);

            if (!incomeResult.error && incomeResult.response) {
                this.categories.push(
                    ...incomeResult.response.map((cat: CategoryRequestType[]) => ({...cat, type: 'income'}))
                );
            }

            if (!expenseResult.error && expenseResult.response) {
                this.categories.push(
                    ...expenseResult.response.map((cat: CategoryRequestType[]) => ({...cat, type: 'expense'}))
                );
            }
        } catch (error) {
            console.error("Ошибка при загрузке категорий:", error);
        }
    }

    setupButtonListeners(): void {
        const buttons: NodeListOf<Element> = document.querySelectorAll(".buttons-layout a");

        buttons.forEach(button => {
            button.addEventListener("click", async (event: Event): Promise<void> => {
                await this.handleButtonClick(event as MouseEvent, buttons);
            });
        });
        if (buttons.length > 0) {
            buttons[0].classList.add("active");
        }
    }

    async handleButtonClick(event: MouseEvent, buttons: NodeListOf<Element>): Promise<void> {
        event.preventDefault();
        buttons.forEach(button => button.classList.remove('active'));
        interface FlatpickrInput extends HTMLInputElement {
            _flatpickr: flatpickr.Instance;
        }
        buttons.forEach(btn => btn.classList.remove("btn-secondary"));
        buttons.forEach(btn => btn.classList.add("btn-outline-secondary"));
        const target:HTMLElement = event.currentTarget as HTMLElement;
        target.classList.add("btn-secondary");
        target.classList.remove("btn-outline-secondary");
        const buttonText:string = target.innerText;
        const startInput:  HTMLInputElement | null = document.getElementById("start-interval")as FlatpickrInput;
        const endInput:  HTMLInputElement | null = document.getElementById("end-interval")as FlatpickrInput;
        if (this.intervalBlock)this.intervalBlock.style.display = "none"
        if (startInput && endInput) {
            startInput.disabled =false;
            endInput.disabled = false;
        }
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
                if (this.intervalBlock) {
                    this.intervalBlock.style.display = "block";
                }
                break;
            default:
                this.currentPeriod = "all";
                break;
        }

        if (this.currentPeriod === "interval") {
            startInput.disabled = true;
            endInput.disabled = true;
            (startInput as FlatpickrInput)._flatpickr.set('clickOpens', true);
            (endInput as FlatpickrInput)._flatpickr.set('clickOpens', true);
            await this.updateTable();
        } else {
            await this.drawTable();
        }
    }



    async initDatePickers(): Promise<void> {
        const startInput:  HTMLInputElement | null = document.getElementById("start-interval")as HTMLInputElement;
        const endInput:  HTMLInputElement | null = document.getElementById("end-interval")as HTMLInputElement;

        if (!startInput || !endInput) return;
        flatpickr(startInput, {
            dateFormat: "d.m.Y",
            minDate:this.startDate ||undefined,
            clickOpens: false,
            onChange: async (selectedDates: Date[]): Promise<void> => {
                this.startDate = selectedDates[0];
                await this.updateTable();
            }
        });

        flatpickr(endInput, {
            dateFormat: "d.m.Y",
            clickOpens: false,
            onChange: async (selectedDates: Date[]): Promise<void> => {
                this.endDate = selectedDates[0];
                await this.updateTable();
            }
        });
    }

    async updateTable(): Promise<void> {
        if (this.startDate && this.endDate) {
            const formatDate = (date:Date):string => {
                const year:number = date.getFullYear();
                const month:string = String(date.getMonth()+1).padStart(2, '0');
                const day:string = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`
            };
            const params:URLSearchParams = new URLSearchParams({
                period: this.currentPeriod,
                dateFrom: formatDate(this.startDate),
                dateTo: formatDate(this.endDate)
            });

            try {
                const result = await HttpUtils.request(`/operations?${params}`, "GET", true);
                const data:TableDataType[] = result.response || [];
                await this.drawTable(data);
            } catch (error) {
                console.error("Ошибка при обновлении таблицы:", error);
            }
        }
    }

    async getAllData() {
        try {
            const params:URLSearchParams = new URLSearchParams({
                period: this.currentPeriod || "all",
            });
            if (this.currentPeriod === "interval" && this.startDate && this.endDate) {
                const formatDate = (date:Date):string => {
                    const year:number = date.getFullYear();
                    const month:string = String(date.getMonth()+1).padStart(2, '0');
                    const day:string = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`
                };
                params.append('dateFrom', formatDate(this.startDate));
                params.append('dateTo', formatDate(this.endDate));
            }
            const result = await HttpUtils.request(`/operations?${params}`, "GET", true);
            return result.response || [];
        } catch (error) {
            console.error("Ошибка запроса:", error);
            return [];
        }
    }

    async drawTable(data?: TableDataType[]): Promise<void> {
        if (!data) {
            data = await this.getAllData();
        }
        const tbody = document.querySelector(".table tbody");

        if(tbody) {
            tbody.innerHTML = "";
            (data as TableDataType[]).forEach((item: TableDataType, index: number): void => {
                let typeText: string = "";
                let typeColor: string = "";

                if (item.type === "income") {
                    typeText = "Доход";
                    typeColor = "text-success";
                } else if (item.type === "expense") {
                    typeText = "Расход";
                    typeColor = "text-danger";
                } else {
                    typeText = "Неизвестно";
                    typeColor = "text-muted";
                }
                const categoryText:string = item.category || '—';

                const row: HTMLTableRowElement | null = document.createElement("tr");
                row.classList.add("table-row");
                row.setAttribute("data-id", item.id);
                row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td class="${typeColor}">${typeText}</td>
                <td>${categoryText}</td>
                <td>${item.amount}</td>
                <td>${this.formatDateToDMY(item.date)}</td>
                <td>${item.comment || '—'}</td>
                <td>
                    <a href="javascript:void(0)" class="delete-btn delete-icon text-decoration-none">
                        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z" fill="black"/>
                            <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z" fill="black"/>
                            <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z" fill="black"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z" fill="black"/>
                        </svg>
                    </a>
                    <a href="/change?id=${item.id}" class="redact-icon text-decoration-none">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z" fill="black"/>
                        </svg>
                    </a>
                </td>
            `;
                tbody.appendChild(row);
            });
        }
    }

    private formatDateToDMY(dateStr: string): string {
        const date:Date = new Date(dateStr);
        const day:string = String(date.getDate()).padStart(2, "0");
        const month:string = String(date.getMonth() + 1).padStart(2, "0");
        const year:number = date.getFullYear();
        return `${day}.${month}.${year}`;
    }


    private initDeleteButtons(): void {
        document.addEventListener("click", (event: MouseEvent): void => {
            const target:HTMLElement = event.target as HTMLAnchorElement;
            const deleteButton = target.closest("a.delete-btn");
            if (deleteButton) {
                event.preventDefault();
                const actionCard:HTMLElement | null = deleteButton.closest(".table-row");
                if (actionCard) {
                    this.currentDeleteTarget = actionCard;
                    this.currentDeleteId = actionCard.dataset?.id || null;
                    const modalElement:HTMLElement | null = document.getElementById("deleteModal");
                    if (modalElement) {
                        if (this.deleteModalInstance) {
                            this.deleteModalInstance.dispose();
                        }
                        modalElement.addEventListener('hidden.bs.modal', () => {
                            const backDrops = document.querySelectorAll('.modal-backdrop');
                            backDrops.forEach(backdrop => {
                                backdrop.remove();
                            });
                            document.body.classList.remove('modal-open');
                            document.body.style.overflow = "";
                            document.body.style.paddingRight = "";
                        })
                        this.deleteModalInstance = new bootstrap.Modal(modalElement);
                        this.deleteModalInstance.show();
                    }
                }
            }
        });
        const confirmDelete:HTMLElement | null = document.getElementById("confirmDelete")
        if (confirmDelete) {
            confirmDelete.addEventListener("click", async (): Promise<void> => {
                if (this.currentDeleteTarget) {
                    try {
                        const response: DefaultResponseType = await HttpUtils.request(`/operations/${this.currentDeleteId}`, "DELETE", true);
                        if (!response.error) {
                            this.currentDeleteTarget.remove();
                            const modalElement: HTMLElement | null = document.getElementById("deleteModal");
                            if (modalElement && this.deleteModalInstance) {
                                modalElement.addEventListener(
                                    'hidden.bs.modal',
                                    () => {
                                        this.deleteModalInstance?.dispose();
                                        this.deleteModalInstance = null;
                                        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                                    },
                                    { once: true }
                                );
                                (document.activeElement as HTMLElement)?.blur();
                                this.deleteModalInstance.hide();
                            }
                        } else {
                            console.error("Ошибка удаления:", response);
                        }
                    } catch (error) {
                        console.error("Ошибка запроса:", error);
                    }
                }
            });
        }
    }

}
