import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteType} from "../../types/open-route.type";
import {CategoryRequestType} from "../../types/category-request.type";
import {ChangeFormType} from "../../types/change-form.type";
import {DefaultResponseType} from "../../types/default-response.type";

export class Change {
    readonly openNewRoute: OpenNewRouteType;
    private typeElement: HTMLSelectElement;
    private categoryElement: HTMLSelectElement;
    readonly dateElement: HTMLInputElement;
    private amountElement: HTMLInputElement;
    private commentaryElement: HTMLInputElement;
    constructor(openNewRoute:OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.typeElement = document.getElementById('type') as HTMLSelectElement;
        this.categoryElement = document.getElementById('category') as HTMLSelectElement;
        this.dateElement = document.getElementById('date') as HTMLInputElement;
        this.amountElement = document.getElementById('amount') as HTMLInputElement;
        this.commentaryElement = document.getElementById('commentary') as HTMLInputElement;
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        this.loadData();
        this.typeElement.addEventListener('change', this.onTypeChange.bind(this));
        const processButton:HTMLElement | null = document.getElementById('process-button');
        if(processButton) {
            processButton.addEventListener('click', this.createNewInfo.bind(this));
        }
    }

    private async loadData():Promise<void> {
        const params = new URLSearchParams(window.location.search);
        const id:string | null = params.get("id");
        if (id) {
            try {
                const result = await HttpUtils.request(`/operations/${id}`, "GET", true, null);
                if (result.response) {
                    this.populateForm(result.response);
                }
            } catch (error) {
                console.error("Ошибка при загрузке данных операции:", error);
            }
        }
    }

    private populateForm(data:ChangeFormType):void {
        this.typeElement.value = data.type;
        this.amountElement.value = data.amount.toString();
        this.dateElement.value = data.date;
        this.commentaryElement.value = data.comment || '';

        this.onTypeChange();
        this.categoryElement.value = data.category_id.toString();
    }

    private async onTypeChange():Promise<void> {
        const selectedType:string = this.typeElement.value.trim();
        this.categoryElement.innerHTML = "";
        if (selectedType === "income") {
            const categories:CategoryRequestType[] = await this.getIncomeCategories();
            categories.forEach(category => {
                let option:HTMLOptionElement | null = document.createElement('option');
                option.value = category.title;
                option.text = category.title;
                this.categoryElement.appendChild(option);
            });
        } else if (selectedType === "expense") {
            const categories:CategoryRequestType[] = await this.getExpenseCategories();
            categories.forEach(category => {
                let option:HTMLOptionElement | null = document.createElement('option');
                option.value = category.title;
                option.text = category.title;
                this.categoryElement.appendChild(option);
            })
        }
    }

    private validateData(type:string, category: number | null, amount:number, date:string, comment:string):boolean {
        let isValid:boolean = true;
        if (["income", "expense"].includes(type)) {
            this.typeElement.classList.remove('is-invalid');
        } else {
            this.typeElement.classList.add('is-invalid');
            isValid = false;
        }
        if (category || category !== null) {
            this.categoryElement.classList.remove('is-invalid');
        } else {
            this.categoryElement.classList.add('is-invalid');
            isValid = false;
        }

        if (!(isNaN(amount) || amount <= 0)) {
            this.amountElement.classList.remove('is-invalid');
        } else {
            this.amountElement.classList.add('is-invalid');
            isValid = false;
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            this.dateElement.classList.remove('is-invalid');
        } else {
            this.dateElement.classList.add('is-invalid');
            isValid = false;
        }

        if (comment !== null && comment.trim() !== '') {
            this.commentaryElement.classList.remove('is-invalid');
        } else {
            this.commentaryElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    private async createNewInfo():Promise<void> {
        const type:string = this.typeElement.value.trim();
        const category_id:number = Number(this.categoryElement.value);
        const amount:number = Number(this.amountElement.value);
        const date:string = this.dateElement.value.trim();
        const comment:string = this.commentaryElement.value.trim();
        const params:URLSearchParams = new URLSearchParams(window.location.search);
        const id:string | null= params.get("id");
        if (!id) return;
        const isValid:boolean = this.validateData(type, category_id, amount, date, comment);
        if (!isValid) {
            alert("Ошибка валидации, проверьте введенные данные.");
            return;
        }
        try {
            const result:DefaultResponseType= await HttpUtils.request(`/operations/${id}`, "PUT", true, {
                type,
                category_id,
                amount,
                date,
                comment,
            });
            if (result.error || !result.response) {
                alert("Произошла ошибка при отправке данных.");
                return;
            } else {
                await this.openNewRoute("/income-expenses")
            }
        } catch (error) {
            console.error("Ошибка при запросе:", error);
        }
    }
    private async getIncomeCategories(): Promise<CategoryRequestType[]> {
        const result = await HttpUtils.request("/categories/income", "GET", true, null);
        return result?.response || [];
    }

    private async getExpenseCategories(): Promise<CategoryRequestType[]> {
        const result = await HttpUtils.request("/categories/expense", "GET", true, null);
        return result?.response || [];
    }
}