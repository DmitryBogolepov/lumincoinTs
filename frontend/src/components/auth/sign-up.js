import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class SignUp {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.emailElement = document.getElementById('email');
        this.nameElement = document.getElementById('name');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('password-repeat');
        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    validateForm() {
        let isValid = true;
        if (this.nameElement.value) {
            this.nameElement.classList.remove('is-invalid');
        } else {
            this.nameElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.emailElement.value && this.emailElement.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
            this.passwordRepeatElement.classList.remove('is-invalid');
        } else {
            this.passwordRepeatElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async signUp() {
        if (this.validateForm()) {
            const fullName = this.nameElement.value.trim().split(' ');
            const firstName = fullName[0];
            const lastName = fullName.slice(1).join(' ');
            const result = await HttpUtils.request('/signup', 'POST', false, {
                name: firstName,
                lastName:lastName,
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value,
            });
            if (result.error || !result.response ) {
                return;
            }
            AuthUtils.setAuthInfo(null,null,result.response.user
            );
            this.openNewRoute("/sign-in");
        }
    }
}