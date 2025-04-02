import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class IncomeAdd {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.titleElement = document.getElementById("title-value");
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
        document.getElementById('create-button').addEventListener('click', this.addNewIncomeItem.bind(this))
    }
    async addNewIncomeItem() {
        if (this.titleElement.value && this.titleElement.value.length > 0) {
            try {
                const result = await HttpUtils.request("/categories/income", "POST", true, {
                    title:this.titleElement.value,
                });
                if (result.error || !result.response) {
                    return;
                }
            } catch (error) {
                console.error("Ошибка при запросе:", error);
            }
        }
        this.openNewRoute('/income');
    }
}