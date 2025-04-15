import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import flatpickr from "flatpickr";
import {OpenNewRouteType} from "../../types/open-route.type";
import {CategoryRequestType} from "../../types/category-request.type";
export class Create {
    private typeElement: HTMLSelectElement;
    private categoryElement: HTMLSelectElement;
    readonly dateElement: HTMLInputElement;
    private amountElement: HTMLInputElement;
    private commentaryElement: HTMLInputElement;
    private categoriesList: CategoryRequestType[] = [];
    readonly openNewRoute: OpenNewRouteType;
    constructor(openNewRoute:OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.typeElement = document.getElementById('type') as HTMLSelectElement;
        this.categoryElement = document.getElementById('category') as HTMLSelectElement;
        this.dateElement = document.getElementById('date') as HTMLInputElement;
        this.amountElement = document.getElementById('amount') as HTMLInputElement;
        this.commentaryElement = document.getElementById('commentary') as HTMLInputElement;
        this.initDatePicker();
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        this.setSelectValue();
        this.typeElement.addEventListener('change', this.onTypeChange.bind(this));
        document.getElementById('process-button').addEventListener('click', this.createNewInfo.bind(this));
    }

    private async onTypeChange():Promise<void> {
        const selectedType:string = this.typeElement.value.trim();
        this.categoryElement.innerHTML = "";
        this.categoriesList = [];
        let categories:CategoryRequestType[] = [];

        if (selectedType === "income") {
            categories = await this.getIncomeCategories();
        } else if (selectedType === "expense") {
            categories = await this.getExpenseCategories();
        }

        categories.forEach(category => {
            this.categoriesList.push({ id: category.id, title: category.title });
            let option:HTMLOptionElement = document.createElement('option');
            option.value = category.title;
            option.text = category.title;
            this.categoryElement.appendChild(option);
        });
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

    private initDatePicker():void {
        flatpickr(this.dateElement, {
            dateFormat: "Y-m-d",
            enableTime: false,
            defaultDate: new Date(),
        });
    }


    private async setSelectValue():Promise<void> {
        const urlParams = new URLSearchParams(window.location.search);
        const type:string = urlParams.get("type");
        if (type) {
            this.typeElement.value = type;
            await this.onTypeChange();
        }
    }

    private async createNewInfo():Promise<void> {
        let type:string = this.typeElement.value.trim();
        const categoryTitle:string = this.categoryElement.value;
        const amount:number = Number(this.amountElement.value);
        const date:string = this.dateElement.value.trim();
        const comment:string = this.commentaryElement.value.trim();
        if (type === "Доход") {
            type = "income";
        } else if (type === "Расход") {
            type = "expense";
        }

        const foundCategory = this.categoriesList.find(c => c.title === categoryTitle);
        const categoryId:number = foundCategory ? foundCategory.id : null;
        if (!categoryId) {
            console.error("Ошибка: Не удалось найти ID категории");
            return;
        }

        const isValid:boolean = this.validateData(type, categoryId, amount, date, comment);
        if (!isValid) {
            return;
        }
        try {
            const result = await HttpUtils.request("/operations", "POST", true, {
                type,
                category_id:categoryId,
                amount,
                date,
                comment,
            });
            if (result.error || !result.response) {
                console.error("Ошибка при запросе:", result.error.value);
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