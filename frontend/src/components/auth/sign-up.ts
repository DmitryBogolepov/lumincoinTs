import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteType} from "../../types/open-route.type";
import {DefaultResponseType} from "../../types/default-response.type";

export class SignUp {
    readonly openNewRoute: OpenNewRouteType;
    emailElement: HTMLInputElement | null;
    passwordElement: HTMLInputElement | null;
    nameElement: HTMLInputElement | null;
    passwordRepeatElement: HTMLInputElement | null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
            return;
        }

        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.nameElement = document.getElementById('name') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.passwordRepeatElement = document.getElementById('password-repeat') as HTMLInputElement;
        document.getElementById('process-button').addEventListener('click', this.signUp.bind(this));
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (this.nameElement) {
            if (this.nameElement.value) {
                this.nameElement.classList.remove('is-invalid');
            } else {
                this.nameElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        if (this.emailElement) {
            if (this.emailElement.value && this.emailElement.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                this.emailElement.classList.remove('is-invalid');
            } else {
                this.emailElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        if (this.passwordElement) {
            if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)) {
                this.passwordElement.classList.remove('is-invalid');
            } else {
                this.passwordElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        if (this.passwordRepeatElement && this.passwordElement) {
            if (this.passwordRepeatElement.value && this.passwordRepeatElement.value === this.passwordElement.value) {
                this.passwordRepeatElement.classList.remove('is-invalid');
            } else {
                this.passwordRepeatElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }

    async signUp(): Promise<void> {
        if (this.validateForm()) {
            if (this.nameElement && this.emailElement && this.passwordElement && this.passwordRepeatElement) {
                const fullName: string[] = this.nameElement.value.trim().split(' ');
                const firstName: string = fullName[0];
                const lastName: string = fullName.slice(1).join(' ');
                const result: DefaultResponseType = await HttpUtils.request('/signup', 'POST', false, {
                    name: firstName,
                    lastName: lastName,
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    passwordRepeat: this.passwordRepeatElement.value,
                });
                if (result.error || !result.response) {
                    return;
                }
                const loginResult: DefaultResponseType = await HttpUtils.request('/login', 'POST', false, {
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                });

                if (loginResult.error || !loginResult.response) {
                    return;
                }
                AuthUtils.setAuthInfo(
                    loginResult.response.tokens.accessToken,
                    loginResult.response.tokens.refreshToken,
                    loginResult.response.user
                );
                this.openNewRoute("/");
            }
        }
    }
}