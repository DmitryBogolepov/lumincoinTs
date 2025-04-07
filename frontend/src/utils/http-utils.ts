import config from "../config/config";
import {AuthUtils} from "./auth-utils";
import {DefaultResponseType} from "../types/default-response.type";
import {ParamsType} from "../types/params.type";

export class HttpUtils {
    public static async request(url:string, method:string = "GET",useAuth:boolean = true, body?:Record<string, any> | null):Promise<any> {
        const result:DefaultResponseType = {
            error: false,
            response: null,
        };
        const params:ParamsType = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        };
        let token:string | null;
        if (useAuth) {
            token = AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) as string | null;
            if (token) {
                params.headers["x-auth-token"] = token;
            }
        }
        if (body) {
            params.body = JSON.stringify(body);
        }
        let response:any = null;
        try {
            response = await fetch(config.api + url, params);
            result.response = await response.json();
        } catch (e) {
            result.error = true;
            return result;
        }
        if (response.status < 200 || response.status >= 300) {
            result.error = true;
            if (useAuth && response.status === 401) {
                if (!token) {
                    result.redirect = '/sign-in';
                } else {
                    const updateTokenResult:boolean = await AuthUtils.updateRefreshToken();
                    if (updateTokenResult) {
                        return this.request(url,method,useAuth,body);
                    } else {
                        AuthUtils.removeAuthInfo();
                        result.redirect = '/sign-in';
                    }
                }

            }
        }
        return result;
    }
}