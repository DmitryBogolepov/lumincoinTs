import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class ExpensesChange {
    constructor(openNewRoute) {
        this.titleElement = document.getElementById("title-value");
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
        document.getElementById('change-button').addEventListener('click', this.changeExpensesItem.bind(this))
    }

    async changeExpensesItem() {
        if (this.titleElement.value && this.titleElement.value.length > 0) {
            try {
                const result = await HttpUtils.request("/categories/expense/1", "PUT", true, {
                    title:this.titleElement.value,
                });
                if (result.error || !result.response) {
                    return;
                }
            } catch (error) {
                console.error("Ошибка при запросе:", error);
            }
        }
    }
}