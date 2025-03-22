import config from "../config/config";

export class AuthUtils {
    static accessTokenKey = "accessToken";
    static refreshTokenKey = "refreshToken";
    static userInfoTokenKey = "userInfo";
    static setAuthInfo(accessToken, refreshToken, userInfo = null) {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
        if (userInfo) {
            localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
        }
    }

    static removeAuthInfo() {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.userInfoTokenKey);
    }

    static getAuthInfo(key = null) {
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
    static async updateRefreshToken() {
       let refreshToken = this.getAuthInfo(this.refreshTokenKey);
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
    // static async updateRefreshToken() {
    //     let result = false;
    //     const refreshToken = this.getAuthInfo(this.refreshTokenKey);
    //     console.log("Отправляемый refreshToken:", refreshToken);
    //     if (refreshToken) {
    //         const response = await fetch(config.api + '/refresh', {
    //             method: 'POST',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 refreshToken: refreshToken,
    //             })
    //         })
    //         if (response && response.status === 200) {
    //             const tokens = await response.json();
    //             if (tokens && !tokens.error) {
    //                 this.setAuthInfo(tokens.accessToken, tokens.refreshToken,);
    //                 result = true;
    //             }
    //         }
    //     }
    //     if (!result){
    //         this.removeAuthInfo();
    //     }
    //     return result;
    // }
}