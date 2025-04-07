import {AuthUtils} from "../../utils/auth-utils";
import {HttpUtils} from "../../utils/http-utils";

export class Logout {
    readonly openNewRoute: (url: string) => Promise<void>;
    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) || !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)) {
            this.openNewRoute('/sign-in');
            return;
        }
        this.logout().then();
    }
    async logout():Promise<void> {
        try {
            await HttpUtils.request('/logout','POST',false,{
                refreshToken: AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey),
            });
        } catch (e) {
            console.error("Ошибка при выходе:", e);
        }
        AuthUtils.removeAuthInfo();
        await this.openNewRoute("/sign-in");
    }
}