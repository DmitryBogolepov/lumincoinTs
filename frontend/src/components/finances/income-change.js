import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class IncomeChange {
    constructor(openNewRoute) {
        this.titleElement = document.getElementById("title-value");
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
        document.getElementById('change-button').addEventListener('click', this.changeIncomeItem.bind(this))
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