import {HttpUtils} from "../utils/http-utils";

export class Layout {
    constructor() {
        this.modal = document.getElementById("user-modal");

        this.initModal();
    }

    static linksLogic(navLinksElement, urlRoute) {
        navLinksElement.forEach(link => {
            if (link.getAttribute('href') === urlRoute) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        const categoryLink = document.getElementById("categoryDropdown");
        const arrow = document.getElementById("arrow");
        const block = document.getElementById("dropdown-block");
        const dropdownLinks = document.querySelectorAll(".dropdown-item");
        let isDropdownActive = false;

        dropdownLinks.forEach(link => {
            if (link.getAttribute('href') === urlRoute) {
                link.classList.add('active');
                isDropdownActive = true;
            } else {
                link.classList.remove('active');
            }
        });

        if (isDropdownActive) {
            block.classList.add("selected");
            categoryLink.classList.add('active');
            arrow.classList.add('rotated');
            dropdownLinks.forEach(link => link.style.display = "block");
        } else {
            block.classList.remove("selected");
            categoryLink.classList.remove('active');
            arrow.classList.remove('rotated');
            dropdownLinks.forEach(link => link.style.display = "none");
        }

        categoryLink.addEventListener("click", () => {
            const isSelected = block.classList.contains('selected');
            if (isSelected) {
                block.classList.remove('selected');
                categoryLink.classList.remove('active');
                arrow.classList.remove('rotated');
                dropdownLinks.forEach(link => link.style.display = "none");
            } else {
                block.classList.add("selected");
                categoryLink.classList.add('active');
                arrow.classList.add('rotated');
                dropdownLinks.forEach(link => link.style.display = "block");
            }
        });
    }


    static async updateBalance(balanceItem) {
        try {
            const result = await HttpUtils.request('/balance', 'GET', true);
            if (result.error) {
                balanceItem.innerText = "Ошибка загрузки";
            } else {
                balanceItem.innerText = `${result.response.balance.toString()} $`;
            }
        } catch (error) {
            balanceItem.innerText = "Ошибка загрузки";
        }
    }


    static setUserData(userInfo,userName) {
        if (userInfo) {
            if (userName) {
                userName.innerText = `${userInfo.name} ${userInfo.lastName}`;
            }
        }
    }

     initModal() {
        const userAction = document.getElementById("user-click");
        const closeModal = document.getElementById("close-modal");

        if (userAction && this.modal) {
            userAction.addEventListener("click", function (event) {
                event.preventDefault();
                this.modal.style.display = "flex";
            }.bind(this));
        }

        if (closeModal && this.modal) {
            closeModal.addEventListener("click", function () {
                this.modal.style.display = "none";
            }.bind(this));
        }

        if (this.modal) {
            window.addEventListener("click", function (event) {
                if (event.target === this.modal) {
                    this.modal.style.display = "none";
                }
            }.bind(this));
        }
    }
}