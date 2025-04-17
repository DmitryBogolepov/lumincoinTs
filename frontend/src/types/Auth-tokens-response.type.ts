import {UserInfoType} from "./userInfo.type";

export type AuthInfo =  {
    accessTokenKey: string | null;
    refreshTokenKey: string | null;
    userInfoTokenKey: string | null;
}

export type ParsedAuthInfo = {
    accessTokenKey: string;
    refreshTokenKey: string;
    userInfoTokenKey: UserInfoType;
}