import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Change {
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
        document.getElementById('process-button').addEventListener('click', this.createNewInfo.bind(this));
    }

    validateData(type, category_id, amount, date, comment) {
        let isValid = true;
        if (["income", "expenses"].includes(type)) {
            this.typeElement.classList.remove('is-invalid');
        } else {
            this.typeElement.classList.add('is-invalid');
            isValid = false;
        }

        if (!(isNaN(category_id) || category_id <= 0)) {
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
        const type = this.typeElement.value.trim();
        const category_id = Number(this.categoryElement.value);
        const amount = Number(this.amountElement.value);
        const date = this.dateElement.value.trim();
        const comment = this.commentaryElement.value.trim();

        const isValid = this.validateData(type, category_id, amount, date, comment);
        if (!isValid) {
            alert("Ошибка валидации, проверьте введенные данные.");
            return;
        }
        try {
            const result = await HttpUtils.request("/operations", "PUT", true, {
                type,
                category_id,
                amount,
                date,
                comment,
            });
            if (result.error || !result.response) {
                alert("Произошла ошибка при отправке данных.");
                return;
            }
        } catch (error) {
            console.error("Ошибка при запросе:", error);
        }
    }
}