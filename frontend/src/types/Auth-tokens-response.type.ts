export type AuthInfo = string | Record<string, string | null> | null;
export type UserInfo = Record<string, any> | null;
export interface RefreshTokenResponse {
    tokens?: {
        accessToken?: string;
    };
}
