import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteType} from "../../types/open-route.type";

export class IncomeAdd {
    titleElement:HTMLInputElement | null;
    readonly openNewRoute: OpenNewRouteType;
    constructor(openNewRoute:OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.titleElement = document.getElementById("title-value") as HTMLInputElement;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return ;
        }
        const createButton:HTMLElement | null = document.getElementById('create-button');
        if(createButton) {
            createButton.addEventListener('click', this.addNewIncomeItem.bind(this));
        }
    }
    async addNewIncomeItem():Promise<void> {
        if (!this.titleElement) return;
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
        await this.openNewRoute('/income');
    }
}