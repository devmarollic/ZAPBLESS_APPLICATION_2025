import { ApplicationSettings } from './application_settings';
import { AuthenticationService } from './authentication_service';

export class HttpClient {
    private static isRefreshing = false;
    private static refreshSubscribers: Array<(token: string) => void> = [];
    private static currentUrl: string = ApplicationSettings.API_URL;

    public static setUrl(url: string) {
        this.currentUrl = url;

        return this;
    }

    public static getMemberUrl() {
        return this.setUrl(ApplicationSettings.MEMBER_API_URL);
    }

    public static getWhatsappUrl() {
        return this.setUrl(ApplicationSettings.WHATSAPP_API_URL);
    }

    public static getMinistryUrl() {
        return this.setUrl(ApplicationSettings.MINISTRY_API_URL);
    }

    public static getEventUrl() {
        return this.setUrl(ApplicationSettings.EVENT_API_URL);
    }

    public static async post<TResult>(resource: string, body: object): Promise<TResult> {
        const headers = HttpClient.GetHeaders();
        const requestOptions: RequestInit = {
            method: 'POST',
            body: JSON.stringify(body),
            redirect: 'follow',
            headers: headers
        };

        const url = this.currentUrl + resource;

        try {
            const response = await fetch(url, requestOptions);
            if (response.status === 200 || response.status === 201) {
                return Promise.resolve(response.json());
            } else if (response.status === 401) {
                const newToken = await HttpClient.refreshToken();
                if (newToken) {
                    headers['Authorization'] = 'Bearer ' + newToken;
                    requestOptions.headers = headers;
                    const retryResponse = await fetch(url, requestOptions);
                    if (retryResponse.status === 200 || retryResponse.status === 201) {
                        return Promise.resolve(retryResponse.json());
                    }
                }

                return Promise.reject(new Error('Authentication failed'));
            } else {
                const body = await response.json();
                return Promise.reject(new Error(body.message));
            }
        } catch (error) {
            return Promise.reject(error);
        } finally {
            this.currentUrl = ApplicationSettings.API_URL;
        }
    }

    public static async postForm<TResult>(resource: string, body: FormData): Promise<TResult> {
        const headers = HttpClient.GetHeaders(null);
        const requestOptions: RequestInit = {
            method: 'POST',
            body: body,
            redirect: 'follow',
            headers: headers
        };

        const url = this.currentUrl + resource;

        try {
            const response = await fetch(url, requestOptions);
            if (response.status === 200) {
                return Promise.resolve(response.json());
            } else if (response.status === 401) {
                const newToken = await HttpClient.refreshToken();
                if (newToken) {
                    headers['Authorization'] = 'Bearer ' + newToken;
                    requestOptions.headers = headers;
                    const retryResponse = await fetch(url, requestOptions);
                    if (retryResponse.status === 200) {
                        return Promise.resolve(retryResponse.json());
                    }
                }
                return Promise.reject(new Error('Authentication failed'));
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        } catch (error) {
            return Promise.reject(error);
        } finally {
            this.currentUrl = ApplicationSettings.API_URL;
        }
    }

    public static async put<TResult>(resource: string, body: object | null): Promise<TResult> {
        const headers = HttpClient.GetHeaders();
        const requestOptions: RequestInit = {
            method: 'PUT',
            body: body ? JSON.stringify(body) : null,
            redirect: 'follow',
            headers: headers
        };

        const url = this.currentUrl + resource;

        try {
            const response = await fetch(url, requestOptions);
            if (response.status === 200 || response.status === 204) {
                if (response.bodyUsed) {
                    return Promise.resolve(response.json());
                } else {
                    return response as any;
                }
            } else if (response.status === 401) {
                const newToken = await HttpClient.refreshToken();
                if (newToken) {
                    headers['Authorization'] = 'Bearer ' + newToken;
                    requestOptions.headers = headers;
                    const retryResponse = await fetch(url, requestOptions);
                    if (retryResponse.status === 200 || retryResponse.status === 204) {
                        if (retryResponse.bodyUsed) {
                            return Promise.resolve(retryResponse.json());
                        } else {
                            return retryResponse as any;
                        }
                    }
                }
                return Promise.reject(new Error('Authentication failed'));
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        } catch (error) {
            return Promise.reject(error);
        } finally {
            this.currentUrl = ApplicationSettings.API_URL;
        }
    }

    public static async patch<TResult>(resource: string, body: object | null): Promise<TResult> {
        const headers = HttpClient.GetHeaders();
        const requestOptions: RequestInit = {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : null,
            redirect: 'follow',
            headers: headers
        };

        const url = this.currentUrl + resource;

        try {
            const response = await fetch(url, requestOptions);
            if (response.status === 200 || response.status === 204) {
                if (response.bodyUsed) {
                    return Promise.resolve(response.json());
                } else {
                    return response as any;
                }
            } else if (response.status === 401) {
                const newToken = await HttpClient.refreshToken();
                if (newToken) {
                    headers['Authorization'] = 'Bearer ' + newToken;
                    requestOptions.headers = headers;
                    const retryResponse = await fetch(url, requestOptions);
                    if (retryResponse.status === 200 || retryResponse.status === 204) {
                        if (retryResponse.bodyUsed) {
                            return Promise.resolve(retryResponse.json());
                        } else {
                            return retryResponse as any;
                        }
                    }
                }
                return Promise.reject(new Error('Authentication failed'));
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        } catch (error) {
            return Promise.reject(error);
        } finally {
            this.currentUrl = ApplicationSettings.API_URL;
        }
    }

    public static async delete<TResult>(resource: string): Promise<TResult> {
        const headers = HttpClient.GetHeaders();
        const requestOptions: RequestInit = {
            method: 'DELETE',
            redirect: 'follow',
            headers: headers,
            body: JSON.stringify({})
        };

        const url = this.currentUrl + resource;

        try {
            const response = await fetch(url, requestOptions);
            if (response.status === 200 || response.status === 204) {
                if (response.bodyUsed) {
                    return Promise.resolve(response.json());
                } else {
                    return response as any;
                }
            } else if (response.status === 401) {
                const newToken = await HttpClient.refreshToken();
                if (newToken) {
                    headers['Authorization'] = 'Bearer ' + newToken;
                    requestOptions.headers = headers;
                    const retryResponse = await fetch(url, requestOptions);
                    if (retryResponse.status === 200 || retryResponse.status === 204) {
                        if (retryResponse.bodyUsed) {
                            return Promise.resolve(retryResponse.json());
                        } else {
                            return retryResponse as any;
                        }
                    }
                }
                return Promise.reject(new Error('Authentication failed'));
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        } catch (error) {
            return Promise.reject(error);
        } finally {
            this.currentUrl = ApplicationSettings.API_URL;
        }
    }

    public static async get<TResult>(resource: string): Promise<TResult> {
        const headers = HttpClient.GetHeaders();
        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
            headers: headers
        };

        const url = this.currentUrl + resource;

        try {
            const response = await fetch(url, requestOptions);
            if (response.status === 200 || response.status === 204) {
                return Promise.resolve(response.json());
            } else if (response.status === 401) {
                const newToken = await HttpClient.refreshToken();
                if (newToken) {
                    headers['Authorization'] = 'Bearer ' + newToken;
                    requestOptions.headers = headers;
                    const retryResponse = await fetch(url, requestOptions);
                    if (retryResponse.status === 200 || retryResponse.status === 204) {
                        return Promise.resolve(retryResponse.json());
                    }
                }
                return Promise.reject(new Error('Authentication failed'));
            } else {
                return Promise.reject(new Error(response.statusText));
            }
        } catch (error) {
            return Promise.reject(error);
        } finally {
            this.currentUrl = ApplicationSettings.API_URL;
        }
    }

    private static GetHeaders(contentType: null | string = 'application/json'): Record<string, string> {
        const token = AuthenticationService.getAccessToken();

        const headers: Record<string, string> = {};

        if (token != null) {
            headers['Authorization'] = 'Bearer ' + token;
        }

        if (contentType != null) {
            headers['Content-Type'] = contentType;
        }

        headers['ngrok-skip-browser-warning'] = 'true';

        return headers;
    }

    private static async refreshToken(): Promise<string | null> {
        if (HttpClient.isRefreshing) {
            return new Promise<string>((resolve) => {
                HttpClient.refreshSubscribers.push(resolve);
            });
        }

        HttpClient.isRefreshing = true;

        try {
            const refreshToken = AuthenticationService.getRefreshToken();
            if (!refreshToken) {
                AuthenticationService.logOff();

                return null;
            }

            const response = await fetch(ApplicationSettings.API_URL + '/login/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                AuthenticationService.updateTokens(data?.session?.access_token, data?.session?.refresh_token);

                HttpClient.refreshSubscribers.forEach(callback => callback(data.access_token));
                HttpClient.refreshSubscribers = [];

                return data.access_token;
            } else {
                AuthenticationService.logOff();
                return null;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            AuthenticationService.logOff();
            return null;
        } finally {
            HttpClient.isRefreshing = false;
        }
    }
}
