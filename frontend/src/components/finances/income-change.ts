import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class IncomeChange {
    constructor(openNewRoute) {
        this.titleElement = document.getElementById("title-value");
        this.openNewRoute = openNewRoute;
        this.getItemText();
        this.titleElement = document.getElementById("title-value");
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }

        const changeButton = document.getElementById("change-button");
        if (changeButton) {
            changeButton.addEventListener("click", this.changeIncomeItem.bind(this));
        } else {
            console.error("Кнопка редактирования не найдена!");
        }
    }

    async getItemText() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (!id) return;
        try {
            const result = await HttpUtils.request(`/categories/income/${id}`, "GET");
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

    async changeIncomeItem() {
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        if (this.titleElement.value && this.titleElement.value.length > 0) {
            try {
                const result = await HttpUtils.request(`/categories/income/${id}`, "PUT", true, {
                    title:this.titleElement.value,
                });
                if (result.error || !result.response) {
                    return;
                }
            } catch (error) {
                console.error("Ошибка при запросе:", error);
            }
        }
        this.openNewRoute("/income");
    }
}