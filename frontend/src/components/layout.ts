import {HttpUtils} from "../utils/http-utils";
import {DefaultResponseType} from "../types/default-response.type";
import {UserInfoType} from "../types/userInfo.type";

export class Layout {
    readonly modal:HTMLElement | null
    constructor() {
        this.modal = document.getElementById("user-modal");
        this.initModal();
    }

    public static linksLogic(navLinksElement:NodeListOf<Element>, urlRoute:string):void {
        navLinksElement.forEach(link => {
            if (link.getAttribute('href') === urlRoute) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        const categoryLink:HTMLElement | null = document.getElementById("categoryDropdown");
        const arrow:HTMLElement | null = document.getElementById("arrow");
        const block:HTMLElement | null = document.getElementById("dropdown-block");
        const dropdownLinks = document.querySelectorAll(".dropdown-item");
        let isDropdownActive:boolean = false;

        dropdownLinks.forEach(link => {
            if (link.getAttribute('href') === urlRoute) {
                link.classList.add('active');
                isDropdownActive = true;
            } else {
                link.classList.remove('active');
            }
        });
        if (block && categoryLink && arrow && dropdownLinks) {
            if (isDropdownActive) {
                block.classList.add("selected");
                categoryLink.classList.add('active');
                arrow.classList.add('rotated');
                dropdownLinks.forEach(link => (link as HTMLElement).style.display = "block");
            } else {
                block.classList.remove("selected");
                categoryLink.classList.remove('active');
                arrow.classList.remove('rotated');
                dropdownLinks.forEach(link => (link as HTMLElement).style.display = "none");
            }

            categoryLink.addEventListener("click", () => {
                const isSelected:boolean = block.classList.contains('selected');
                if (isSelected) {
                    block.classList.remove('selected');
                    categoryLink.classList.remove('active');
                    arrow.classList.remove('rotated');
                    dropdownLinks.forEach(link => (link as HTMLElement).style.display = "none");
                } else {
                    block.classList.add("selected");
                    categoryLink.classList.add('active');
                    arrow.classList.add('rotated');
                    dropdownLinks.forEach(link => (link as HTMLElement).style.display = "block");
                }
            });
        }
    }


    public static async updateBalance(balanceItem:HTMLElement):Promise<void> {
        try {
            const result:DefaultResponseType = await HttpUtils.request('/balance', 'GET', true,null);
            if (result.error) {
                balanceItem.innerText = "Ошибка загрузки";
            } else {
                balanceItem.innerText = `${result.response.balance.toString()} $`;
            }
        } catch (error) {
            balanceItem.innerText = "Ошибка загрузки";
        }
    }


    public static setUserData(userInfo:UserInfoType,userName:HTMLElement | null):void {
        if (userInfo) {
            if (userName) {
                userName.innerText = `${userInfo.name} ${userInfo.lastName}`;
            }
        }
    }

     private initModal():void {
        const userAction:HTMLElement | null = document.getElementById("user-click");
        const closeModal:HTMLElement | null = document.getElementById("close-modal");

        if (userAction && this.modal) {
            userAction.addEventListener("click", function (event:MouseEvent) {
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
            window.addEventListener("click", function (event:MouseEvent) {
                if (event.target === this.modal) {
                    this.modal.style.display = "none";
                }
            }.bind(this));
        }
    }
}