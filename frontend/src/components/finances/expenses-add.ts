import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteType} from "../../types/open-route.type";
import {DefaultResponseType} from "../../types/default-response.type";

export class ExpensesAdd {
    titleElement: HTMLInputElement | null;
    readonly openNewRoute: OpenNewRouteType;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.titleElement = document.getElementById('title-value') as HTMLInputElement;
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        document.getElementById('create-button').addEventListener('click', this.addNewIncomeItem.bind(this))
    }

    private async addNewIncomeItem(): Promise<void> {
        if (this.titleElement) {
            if (this.titleElement.value && this.titleElement.value.length > 0) {
                try {
                    const result: DefaultResponseType = await HttpUtils.request("/categories/expense", "POST", true, {
                        title: this.titleElement.value,
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

}