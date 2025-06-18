import { ApplicationSettings } from './application_settings';
import { AuthenticationService } from './authentication_service';

export class HttpClient {
    private static isRefreshing = false;
    private static refreshSubscribers: Array<(token: string) => void> = [];

    public static async post<TResult>(resource: string, body: object): Promise<TResult> {
        const headers = HttpClient.GetHeaders();
        var requestOptions: RequestInit = {
            method: 'POST',
            body: JSON.stringify(body),
            redirect: 'follow',
            headers: headers
        };

        var url = ApplicationSettings.API_URL + resource;

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
                let body = await response.json();

                return Promise.reject(new Error(body.message));
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public static async postForm<TResult>(resource: string, body: FormData): Promise<TResult> {
        const headers = HttpClient.GetHeaders(null);
        var requestOptions: RequestInit = {
            method: 'POST',
            body: body,
            redirect: 'follow',
            headers: headers
        };

        var url = ApplicationSettings.API_URL + resource;

        try {
            const response = await fetch(url, requestOptions);
            if (response.status === 200) {
                return Promise.resolve(response.json());
            } else if (response.status === 401) {
                // Try to refresh token and retry the request
                const newToken = await HttpClient.refreshToken();
                if (newToken) {
                    // Retry with new token
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
        }
    }

    public static async put<TResult>(resource: string, body: object | null): Promise<TResult> {
        const headers = HttpClient.GetHeaders();
        var requestOptions: RequestInit = {
            method: 'PUT',
            body: body ? JSON.stringify(body) : null,
            redirect: 'follow',
            headers: headers
        };

        var url = ApplicationSettings.API_URL + resource;

        try {
            const response = await fetch(url, requestOptions);
            if (response.status === 200) {
                if (response.bodyUsed) {
                    return Promise.resolve(response.json());
                } else {
                    return response as any;
                }
            } else if (response.status === 401) {
                // Try to refresh token and retry the request
                const newToken = await HttpClient.refreshToken();
                if (newToken) {
                    // Retry with new token
                    headers['Authorization'] = 'Bearer ' + newToken;
                    requestOptions.headers = headers;
                    const retryResponse = await fetch(url, requestOptions);
                    if (retryResponse.status === 200) {
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
        }
    }

    public static async patch<TResult>(resource: string, body: object | null): Promise<TResult> {
        const headers = HttpClient.GetHeaders();
        var requestOptions: RequestInit = {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : null,
            redirect: 'follow',
            headers: headers
        };

        var url = ApplicationSettings.API_URL + resource;

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
        }
    }

    public static async delete<TResult>(resource: string): Promise<TResult> {
        const headers = HttpClient.GetHeaders();
        var requestOptions: RequestInit = {
            method: 'DELETE',
            redirect: 'follow',
            headers: headers
        };

        var url = ApplicationSettings.API_URL + resource;

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
        }
    }

    public static async get<TResult>(resource: string): Promise<TResult> {
        const headers = HttpClient.GetHeaders();
        var requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
            headers: headers
        };

        var url = ApplicationSettings.API_URL + resource;

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
        }
    }

    private static GetHeaders(contentType: null | string = 'application/json'): Record<string, string> {
        var token = AuthenticationService.getAccessToken();

        let headers: Record<string, string> = {};

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

            const response = await fetch(ApplicationSettings.API_URL + '/refresh-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                AuthenticationService.updateTokens(data.access_token, data.refresh_token);
                
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
