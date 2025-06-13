
import { AuthenticationResult } from './authentication_result';
import { LoginConsts } from './login_constants';

export class AuthenticationService {

    public static authenticate(
        authenticationResult: AuthenticationResult,
        login: string): void {
        window.localStorage.setItem(LoginConsts.ACCESS_TOKEN_KEY, authenticationResult.session.access_token);
        if (authenticationResult.session.refresh_token) {
            window.localStorage.setItem(LoginConsts.REFRESH_TOKEN_KEY, authenticationResult.session.refresh_token);
        }
        window.localStorage.setItem(LoginConsts.USERNAME_KEY, login);
    }

    public static isAuthenticated(): boolean {
        return window.localStorage.getItem(LoginConsts.ACCESS_TOKEN_KEY) != null;
    }

    public static getUserId(): string | null {
        return window.localStorage.getItem(LoginConsts.USER_ID);
    }

    public static getUsername(): string | null {
        return window.localStorage.getItem(LoginConsts.USERNAME_KEY);
    }

    public static getAccessToken(): string | null {
        return window.localStorage.getItem(LoginConsts.ACCESS_TOKEN_KEY);
    }

    public static getRefreshToken(): string | null {
        return window.localStorage.getItem(LoginConsts.REFRESH_TOKEN_KEY);
    }

    public static updateTokens(accessToken: string, refreshToken: string): void {
        window.localStorage.setItem(LoginConsts.ACCESS_TOKEN_KEY, accessToken);
        window.localStorage.setItem(LoginConsts.REFRESH_TOKEN_KEY, refreshToken);
    }

    public static logOff(): void {
        window.localStorage.removeItem(LoginConsts.ACCESS_TOKEN_KEY);
        window.localStorage.removeItem(LoginConsts.REFRESH_TOKEN_KEY);
        window.localStorage.removeItem(LoginConsts.USERNAME_KEY);
        window.localStorage.removeItem(LoginConsts.USER_ID);
    }

    public static setUserId(userId: string): void {
        window.localStorage.setItem(LoginConsts.USER_ID, userId);
    }
}
