import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteType} from "../../types/open-route.type";

export class SignIn {
    readonly openNewRoute: OpenNewRouteType;
    emailElement: HTMLInputElement | null;
    passwordElement: HTMLInputElement | null;
    rememberMeElement: HTMLInputElement | null;

    constructor(openNewRoute: OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.rememberMeElement = document.getElementById('remember-me') as HTMLInputElement;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
            return;
        }
        const processButton:HTMLElement |null = document.getElementById('process-button');
        if(processButton) {
            processButton.addEventListener('click', this.login.bind(this));
        }
    }

    private validateForm(): boolean {
        let isValid: boolean = true;
        if (this.emailElement) {
            if (this.emailElement.value && this.emailElement.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                this.emailElement.classList.remove('is-invalid');
            } else {
                this.emailElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        if (this.passwordElement) {
            if (this.passwordElement.value) {
                this.passwordElement.classList.remove('is-invalid');
            } else {
                this.passwordElement.classList.add('is-invalid');
                isValid = false;
            }
        }
        return isValid;
    }

    private async login(): Promise<void> {
        if (this.validateForm()) {
            if (this.emailElement && this.passwordElement && this.rememberMeElement) {
                const result = await HttpUtils.request('/login', 'POST', false, {
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked,
                });
                if (result.error || !result.response) {
                    const commonError:HTMLElement | null = document.getElementById('common-error');
                    if(commonError) {
                        commonError.style.display = 'block';
                    }
                    return;
                }
                AuthUtils.setAuthInfo(
                    result.response.tokens.accessToken,
                    result.response.tokens.refreshToken,
                    result.response.user
                );

                await this.openNewRoute("/");
            }
        }
    }
}