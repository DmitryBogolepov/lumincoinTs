export class Layout {
    constructor() {
        this.modal = document.getElementById("user-modal");
        this.userNameElement = document.getElementById('user-name');
        this.userBalanceElement = document.getElementById('balance');
        this.navLinksElement = document.querySelectorAll('.sidebar .nav-link')
        this.initModal();
    }

    static linksLogic() {
        this.navLinksElement.forEach(link => {
            if (link.getAttribute('href') === urlRoute) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }


    static setUserData(userInfo) {
        if (userInfo) {
            if (this.userNameElement) {
                this.userNameElement.innerText = `${userInfo.name} ${userInfo.lastName}`;
            }
        }
    }

    static initModal() {
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