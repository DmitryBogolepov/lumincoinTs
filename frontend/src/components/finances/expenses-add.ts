import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteType} from "../../types/open-route.type";

export class ExpensesAdd {
    titleElement:HTMLElement | null;
    readonly openNewRoute: OpenNewRouteType;
    constructor(openNewRoute:OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.titleElement = document.getElementById('title-value');
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        document.getElementById('create-button').addEventListener('click', this.addNewIncomeItem.bind(this))
    }

    private async addNewIncomeItem():Promise<void> {
        if (this.titleElement.value && this.titleElement.value.length > 0) {
            try {
                const result = await HttpUtils.request("/categories/expense", "POST", true, {
                    title:this.titleElement.value,
                });
                if (result.error || !result.response) {
                    return;
                }
            } catch (error) {
                console.error("Ошибка при запросе:", error);
            }
        }
        await this.openNewRoute('/expenses');
    }
}