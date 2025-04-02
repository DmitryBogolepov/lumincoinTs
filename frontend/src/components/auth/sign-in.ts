import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";
import {OpenNewRouteType} from "../../types/open-route.type";
export class SignIn {
    readonly openNewRoute: OpenNewRouteType;
    emailElement:HTMLInputElement | null;
    passwordElement:HTMLInputElement | null;
    rememberMeElement:HTMLInputElement | null;
    constructor(openNewRout:OpenNewRouteType) {
        this.openNewRoute = openNewRoute;
        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/');
            return
        }
        this.emailElement = document.getElementById('email') as HTMLInputElement;
        this.passwordElement = document.getElementById('password') as HTMLInputElement;
        this.rememberMeElement = document.getElementById('remember-me') as HTMLInputElement;
        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    validateForm():boolean {
        let isValid:boolean = true;
        if (this.emailElement.value && this.emailElement.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
            isValid = false;
        }
        if (this.passwordElement.value) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
            isValid = false;
        }
        return isValid;
    }

    async login():Promise<void> {
        if (this.validateForm()) {
            const result = await HttpUtils.request('/login', 'POST', false, {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: this.rememberMeElement.checked,
            });
            if (result.error || !result.response ) {
                document.getElementById('common-error').style.display = 'block';
                return;
            }
            AuthUtils.setAuthInfo(
                result.response.tokens.accessToken,
                result.response.tokens.refreshToken,
                result.response.user
            );

            this.openNewRoute("/");
        }
    }
}