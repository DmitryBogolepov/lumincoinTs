import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Create {
    constructor(openNewRoute) {
        this.typeElement = document.getElementById('type');
        this.categoryElement = document.getElementById('category');
        this.amountElement = document.getElementById('amount');
        this.dateElement = document.getElementById('date');
        this.commentaryElement = document.getElementById('commentary');
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
        this.typeElement.addEventListener('change', this.onTypeChange.bind(this));
        document.getElementById('process-button').addEventListener('click', this.createNewInfo.bind(this));
    }

    async onTypeChange() {
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

    validateData(type, category, amount, date, comment) {
        let isValid = true;
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



    async createNewInfo() {
        let type = this.typeElement.value.trim();
        const category = this.categoryElement.value;
        const amount = Number(this.amountElement.value);
        const date = this.dateElement.value.trim();
        const comment = this.commentaryElement.value.trim();
        if (type === "Доход") {
            type = "income";
        } else if (type === "Расход") {
            type = "expense";
        }
        const isValid = this.validateData(type, category, amount, date, comment);
        if (!isValid) {
            return;
        }
        try {
            const result = await HttpUtils.request("/operations", "POST", true, {
                type,
                category,
                amount,
                date,
                comment,
            });
            if (result.error || !result.response) {
                console.error("Ошибка при запросе:", result.error.value);
                return;
            }
        } catch (error) {
            console.error("Ошибка при запросе:", error);
        }
    }

    async getIncomeCategories() {
        const categories =await HttpUtils.request("/categories/income");
        if (categories.error || !categories.response) {
            return;
        }
        return categories.response;
    }
    async getExpenseCategories() {
        const categories =await HttpUtils.request("/categories/expense");
        if (categories.error || !categories.response) {
            return;
        }
        return categories.response;
    }
}