import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteType} from "../../types/open-route.type";

export class ExpensesChange {
    titleElement:HTMLInputElement | null;
    readonly openNewRoute: OpenNewRouteType;
    constructor(openNewRoute:OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.titleElement = document.getElementById("title-value") as HTMLInputElement;
        this.getItemText();
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        const changeButton = document.getElementById("change-button");
        if (changeButton) {
            changeButton.addEventListener("click", this.changeExpensesItem.bind(this));
        } else {
            console.error("Кнопка редактирования не найдена!");
        }
    }

    private async getItemText():Promise<string> {
        const params = new URLSearchParams(window.location.search);
        const id:string = params.get("id");
        if (!id) return;
        if (!this.titleElement) return;
        try {
            const result = await HttpUtils.request(`/categories/expense/${id}`, "GET", true);
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

    private async changeExpensesItem():Promise<void> {
        const params = new URLSearchParams(window.location.search);
        const id:string = params.get("id");
        if (!id) return;
        if (!this.titleElement) return;
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
        await this.openNewRoute('/expenses');
    }
}