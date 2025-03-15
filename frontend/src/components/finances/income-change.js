import {AuthUtils} from "../../utils/auth-utils";

export class IncomeChange {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/sign-in');
        }
    }
}