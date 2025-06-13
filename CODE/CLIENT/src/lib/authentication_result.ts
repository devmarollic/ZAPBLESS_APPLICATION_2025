
export interface AuthenticationResult {
    session: {
        access_token: string;
        refresh_token: string;
        id?: string;
    };
    user: {
        user_metadata: {
            id: string;
            first_name: string;
            last_name: string;
            email: string;
        }
    };
}
