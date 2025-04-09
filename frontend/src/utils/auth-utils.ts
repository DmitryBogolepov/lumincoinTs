import config from "../config/config";
import {AuthInfo} from "../types/Auth-tokens-response.type";
import {UserInfoType} from "../types/userInfo.type";

export class AuthUtils {
    static accessTokenKey:string = "accessToken";
    static refreshTokenKey:string = "refreshToken";
    static userInfoTokenKey:string = "userInfo";
    static setAuthInfo(accessToken:string, refreshToken:string, userInfo:UserInfoType):void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    public static removeAuthInfo():void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    public static getAuthInfo(key?:string):AuthInfo {
        if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
            return localStorage.getItem(key);
        } else {
            return {
                [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
                [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
                [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
            }
        }
    }
    static async updateRefreshToken():Promise<boolean> {
       let refreshToken:AuthInfo = this.getAuthInfo(this.refreshTokenKey) as string | null;
        if (!refreshToken) {
            return false;
        }
        try {
            const response = await fetch(config.api + "/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken })
            });
            const data = await response.json();
            if (data.tokens && data.tokens.accessToken) {
                localStorage.setItem("accessToken", data.tokens.accessToken);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Ошибка сети при обновлении токена:", error);
            return false;
        }
    }
}