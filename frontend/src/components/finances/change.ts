import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteType} from "../../types/open-route.type";

export class Change {
    readonly openNewRoute: OpenNewRouteType;
    constructor(openNewRoute:OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.typeElement = document.getElementById('type');
        this.categoryElement = document.getElementById('category');
        this.amountElement = document.getElementById('amount');
        this.dateElement = document.getElementById('date');
        this.commentaryElement = document.getElementById('commentary');
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
        this.loadData();
        this.typeElement.addEventListener('change', this.onTypeChange.bind(this));
        document.getElementById('process-button').addEventListener('click', this.createNewInfo.bind(this));
    }

    private async loadData():Promise<void> {
        const params = new URLSearchParams(window.location.search);
        const id:string = params.get("id");
        if (id) {
            try {
                const result = await HttpUtils.request(`/operations/${id}`, "GET", true);
                if (result.response) {
                    this.populateForm(result.response);
                }
            } catch (error) {
                console.error("Ошибка при загрузке данных операции:", error);
            }
        }
    }

    private populateForm(data):void {
        this.typeElement.value = data.type;
        this.amountElement.value = data.amount;
        this.dateElement.value = data.date;
        this.commentaryElement.value = data.comment || '';

        this.onTypeChange();
        this.categoryElement.value = data.category_id;
    }

    private async onTypeChange():Promise<void> {
        const selectedType = this.typeElement.value.trim();
        this.categoryElement.innerHTML = "";
        if (selectedType === "income") {
            const categories = await this.getIncomeCategories();
            categories.forEach(category => {
                let option = document.createElement('option');
                option.value = category.title;
                option.text = category.title;
                this.categoryElement.appendChild(option);
            });
        } else if (selectedType === "expense") {
            const categories = await this.getExpenseCategories();
            categories.forEach(category => {
                let option = document.createElement('option');
                option.value = category.title;
                option.text = category.title;
                this.categoryElement.appendChild(option);
            })
        }
    }

    private validateData(type, category, amount, date, comment):boolean {
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
        const type = this.typeElement.value.trim();
        const category_id:number = Number(this.categoryElement.value);
        const amount:number = Number(this.amountElement.value);
        const date = this.dateElement.value.trim();
        const comment = this.commentaryElement.value.trim();
        const params = new URLSearchParams(window.location.search);
        const id:string = params.get("id");
        if (!id) return;
        const isValid:boolean = this.validateData(type, category_id, amount, date, comment);
        if (!isValid) {
            alert("Ошибка валидации, проверьте введенные данные.");
            return;
        }
        try {
            const result = await HttpUtils.request(`/operations/${id}`, "PUT", true, {
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
    private async getIncomeCategories() {
        const categories =await HttpUtils.request("/categories/income");
        if (categories.error || !categories.response) {
            return;
        }
        return categories.response;
    }
    private async getExpenseCategories() {
        const categories =await HttpUtils.request("/categories/expense");
        if (categories.error || !categories.response) {
            return;
        }
        return categories.response;
    }
}