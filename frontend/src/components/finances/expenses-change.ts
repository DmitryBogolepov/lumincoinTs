import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class ExpensesChange {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.titleElement = document.getElementById("title-value");
        this.getItemText();
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
        const changeButton = document.getElementById("change-button");
        if (changeButton) {
            changeButton.addEventListener("click", this.changeExpensesItem.bind(this));
        } else {
            console.error("Кнопка редактирования не найдена!");
        }
    }

    async getItemText() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (!id) return;
        try {
            const result = await HttpUtils.request(`/categories/expense/${id}`, "GET");
            if (result.response && result.response.title) {
                this.titleElement.value = result.response.title;
            }
            if (result.error || !result.response) {
                return;
            }
            return result.title;
        } catch (e) {
            console.log(e)
        }
    }

    async changeExpensesItem() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (!id) return;
        if (this.titleElement.value && this.titleElement.value.length > 0) {
            try {
                const result = await HttpUtils.request(`/categories/expense/${id}`, "PUT", true, {
                    title:this.titleElement.value,
                });
                if (result.error || !result.response) {
                    return;
                }
            } catch (error) {
                console.error("Ошибка при запросе:", error);
            }
        }
        this.openNewRoute('/expenses');
    }
}