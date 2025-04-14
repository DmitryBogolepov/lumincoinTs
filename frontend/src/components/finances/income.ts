import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteType} from "../../types/open-route.type";
import * as bootstrap from "../../../node_modules/bootstrap/dist/js/bootstrap.min";
import {DefaultResponseType} from "../../types/default-response.type";
import {CategoryRequestType} from "../../types/category-request.type";
export class Income {
    readonly openNewRoute: OpenNewRouteType;
    private currentDeleteTarget: HTMLElement | null = null;
    private currentDeleteId: string | null = null;
    constructor(openNewRoute:OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/sign-in');
            return ;
        }
        this.initDeleteButtons();
        this.initEditButtons();
        this.getAllIncomes();
    }

    private initDeleteButtons():void {
        document.addEventListener("click", (event:MouseEvent):void => {
            const target = event.target as HTMLElement;
            const deleteButton = target.closest(".delete-btn");
            if (deleteButton) {
                event.preventDefault();
                this.currentDeleteTarget = deleteButton.closest(".action-card");
                this.currentDeleteId = this.currentDeleteTarget.dataset.id;
                const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
                deleteModal.show();
            }
        });
        document.getElementById("confirmDelete").addEventListener("click", async ():Promise<void> => {
            if (this.currentDeleteTarget && this.currentDeleteId) {
                try {
                    const response:DefaultResponseType = await HttpUtils.request(`/categories/income/${this.currentDeleteId}`, "DELETE", true,null);
                    if (!response.error) {
                        this.currentDeleteTarget.remove();
                        const modalElement:HTMLElement | null = document.getElementById("deleteModal");
                        const modalInstance = bootstrap.Modal.getInstance(modalElement);
                        modalInstance.hide();
                    } else {
                        console.error("Ошибка удаления:", response);
                    }
                } catch (error) {
                    console.error("Ошибка запроса:", error);
                }
            }
        });
    }

    private async initEditButtons():Promise<void> {
        document.addEventListener("click",async (event:MouseEvent):Promise<void>=> {
            const editButton = (event.target as HTMLElement).closest(".redact-btn");
            if (editButton) {
                event.preventDefault();
                const card = editButton.closest(".action-card") as HTMLElement;
                const id:string | number = card.dataset.id;
                if (id) {
                    await this.openNewRoute(`/incomeChange?id=${id}`);
                }
            }
        });
    }

    private async getAllIncomes():Promise<void> {
        try {
            const result:DefaultResponseType = await HttpUtils.request("/categories/income", "GET", true, null);
            if (!result.error && Array.isArray(result.response)) {
                this.renderCards(result.response);
            } else {
                console.error("Ошибка при загрузке данных:", result);
            }
        } catch (error) {
            console.error("Ошибка запроса:", error);
        }
    }

    private renderCards(items:CategoryRequestType[]):void {
        const container:HTMLElement | null = document.getElementById("cards-container");
        container.innerHTML = "";

        items.forEach(item => {
            const card:HTMLDivElement = document.createElement("div");
            card.classList.add("action-card", "d-flex", "justify-content-center");
            card.dataset.id = item.id.toString();
            const title:HTMLDivElement = document.createElement("div");
            title.classList.add("card-title");
            title.textContent = item.title;

            const btnContainer:HTMLDivElement = document.createElement("div");
            btnContainer.classList.add("card-btns", "d-flex", "align-items-center");

            const editBtn:HTMLAnchorElement = document.createElement("a");
            editBtn.href = "javascript:void(0);";
            editBtn.classList.add("change-btn", "btn", "btn-primary", "redact-btn");
            editBtn.textContent = "Редактировать";

            const deleteBtn:HTMLAnchorElement = document.createElement("a");
            deleteBtn.href = "#";
            deleteBtn.classList.add("delete-btn", "btn", "btn-danger");
            deleteBtn.textContent = "Удалить";

            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);

            card.appendChild(title);
            card.appendChild(btnContainer);

            container.appendChild(card);
        });
        const addCard:HTMLAnchorElement = document.createElement("a");
        addCard.href = "/incomeAdd";
        addCard.classList.add("action-card", "d-flex", "justify-content-center", "align-items-center");
        addCard.id = "add-card";

        const svg:SVGSVGElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "15");
        svg.setAttribute("height", "15");
        svg.setAttribute("viewBox", "0 0 15 15");
        svg.setAttribute("fill", "none");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        const path:SVGPathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z");
        path.setAttribute("fill", "#CED4DA");

        svg.appendChild(path);
        addCard.appendChild(svg);

        container.appendChild(addCard);
    }
}