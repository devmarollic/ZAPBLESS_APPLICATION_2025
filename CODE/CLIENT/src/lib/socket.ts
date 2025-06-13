
import { io } from 'socket.io-client';
import { ApplicationSettings } from './application_settings';
import { AuthenticationService } from './authentication_service';

function connectToSocket() {
    const token = AuthenticationService.getAccessToken();

    if (!token) return null;

    return io(ApplicationSettings.API_URL, {
        transports: ['websocket', 'polling', 'flashsocket'],
        query: {
            token: token
        },
    });
}

export default connectToSocket;
