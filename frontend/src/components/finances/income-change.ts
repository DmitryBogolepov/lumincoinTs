import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteType} from "../../types/open-route.type";

export class IncomeChange {
    readonly openNewRoute: OpenNewRouteType;
    titleElement: HTMLInputElement | null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.titleElement = document.getElementById("title-value") as HTMLInputElement;
        this.getItemText();
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        const changeButton: HTMLElement | null = document.getElementById("change-button");
        if (changeButton) {
            changeButton.addEventListener("click", this.changeIncomeItem.bind(this));
        }
    }

    async getItemText(): Promise<string | undefined> {
        const params: URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = params.get("id");
        if (!id || !this.titleElement) return;
        if (!this.titleElement.value || this.titleElement.value.length === 0) {
            try {
                const result = await HttpUtils.request(`/categories/income/${id}`, "GET");
                if (result.response && result.response.title) {
                    console.log(this.titleElement.value);
                    this.titleElement.value = result.response.title;
                    return result.response.title;
                }
                return;
            } catch (e) {
                console.error("Ошибка при получении категории:", e);
            }
        }
    }

    async changeIncomeItem(): Promise<void> {
        const params:URLSearchParams = new URLSearchParams(window.location.search);
        const id: string | null = params.get("id");
        if (!this.titleElement) return;
        if (this.titleElement.value && this.titleElement.value.length > 0) {
            try {
                const result = await HttpUtils.request(`/categories/income/${id}`, "PUT", true, {
                    title: this.titleElement.value,
                });
                if (result.error || !result.response) {
                    return;
                }
            } catch (error) {
                console.error("Ошибка при запросе:", error);
            }
        }
        await this.openNewRoute("/income");
    }
}