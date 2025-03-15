import {AuthUtils} from "../../utils/auth-utils";

export class Create {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
    }
}