export type AuthInfo = string | Record<string, string | null> | null;
export interface RefreshTokenResponse {
    tokens?: {
        accessToken?: string;
    };
}
