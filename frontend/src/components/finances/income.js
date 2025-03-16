import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Income {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
        this.initDeleteButtons();
        this.getAllIncomes();
    }

    initDeleteButtons() {
        document.addEventListener("click", (event) => {
            const deleteButton = event.target.closest(".delete-btn");
            if (deleteButton) {
                event.preventDefault();
                this.currentDeleteTarget = deleteButton.closest(".action-card");
                const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
                deleteModal.show();
            }
        });
        document.getElementById("confirmDelete").addEventListener("click", () => {
            if (this.currentDeleteTarget) {
                this.currentDeleteTarget.remove();
            }
            const modalElement = document.getElementById("deleteModal");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
        });
    }

    async getAllIncomes() {
        try {
            const result = await HttpUtils.request('/categories/income'); // Дожидаемся ответа

            if (!result.error && Array.isArray(result.response)) {
                this.renderCards(result.response); // Передаем массив в renderCards
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

            const title = document.createElement("div");
            title.classList.add("card-title");
            title.textContent = item.title;

            const btnContainer = document.createElement("div");
            btnContainer.classList.add("card-btns", "d-flex", "align-items-center");

            const editBtn = document.createElement("a");
            editBtn.href = "/incomeChange";
            editBtn.classList.add("change-btn", "btn", "btn-primary");
            editBtn.textContent = "Редактировать";

            const deleteBtn = document.createElement("a");
            deleteBtn.href = "#";
            deleteBtn.classList.add("delete-btn", "btn", "btn-danger");
            deleteBtn.textContent = "Удалить";

            btnContainer.appendChild(editBtn);
            btnContainer.appendChild(deleteBtn);

            card.appendChild(title);
            card.appendChild(btnContainer);

            container.appendChild(card);
        });
    }
}