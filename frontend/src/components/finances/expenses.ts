import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Expenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
        this.initDeleteButtons();
        this.initEditButtons();
        this.getAllExpenses();
    }

    initDeleteButtons() {
        document.addEventListener("click", (event) => {
            const deleteButton = event.target.closest(".delete-btn");
            if (deleteButton) {
                event.preventDefault();
                this.currentDeleteTarget = deleteButton.closest(".action-card");
                this.currentDeleteId = this.currentDeleteTarget.dataset.id;
                const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
                deleteModal.show();
            }
        });
        document.getElementById("confirmDelete").addEventListener("click", async () => {
            if (this.currentDeleteTarget && this.currentDeleteId) {
                try {
                    const response = await HttpUtils.request(`/categories/expense/${this.currentDeleteId}`, "DELETE", true);
                    if (!response.error) {
                        this.currentDeleteTarget.remove();
                        const modalElement = document.getElementById("deleteModal");
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

    initEditButtons() {
        document.addEventListener("click", (event) => {
            const editButton = event.target.closest("#redact-btn");
            if (editButton) {
                event.preventDefault();
                const card = editButton.closest(".action-card");
                const id = card.dataset.id;
                if (id) {
                    this.openNewRoute(`/expensesChange?id=${id}`);
                }
            }
        });
    }

    async getAllExpenses() {
        try {
            const result = await HttpUtils.request('/categories/expense');
            if (!result.error && Array.isArray(result.response)) {
                this.renderCards(result.response);
            } else {
                console.error("Ошибка при загрузке данных:", result);
            }
        } catch (error) {
            console.error("Ошибка запроса:", error);
        }
    }

    renderCards(items) {
        const container = document.getElementById("cards-container");
        container.innerHTML = "";

        items.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("action-card", "d-flex", "justify-content-center");
            card.dataset.id = item.id;
            const title = document.createElement("div");
            title.classList.add("card-title");
            title.textContent = item.title;

            const btnContainer = document.createElement("div");
            btnContainer.classList.add("card-btns", "d-flex", "align-items-center");

            const editBtn = document.createElement("a");
            editBtn.href = "/expensesChange";
            editBtn.classList.add("change-btn", "btn", "btn-primary");
            editBtn.textContent = "Редактировать";
            editBtn.setAttribute("id", 'redact-btn');

            const deleteBtn = document.createElement("a");
            deleteBtn.href = "/expenses";
            deleteBtn.classList.add("delete-btn", "btn", "btn-danger");
            deleteBtn.textContent = "Удалить";

            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);

            card.appendChild(title);
            card.appendChild(btnContainer);

            container.appendChild(card);
        });
        const addCard = document.createElement("a");
        addCard.href = "/expensesAdd";
        addCard.classList.add("action-card", "d-flex", "justify-content-center", "align-items-center");
        addCard.id = "add-card";

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "15");
        svg.setAttribute("height", "15");
        svg.setAttribute("viewBox", "0 0 15 15");
        svg.setAttribute("fill", "none");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z");
        path.setAttribute("fill", "#CED4DA");

        svg.appendChild(path);
        addCard.appendChild(svg);

        container.appendChild(addCard);
    }
}