import { HttpsProxyAgent } from 'https-proxy-agent';

export function makeProxyAgent(proxy) {
    if (typeof proxy === 'string') {
        return new HttpsProxyAgent(proxy);
    }

    const { host, password, port, protocol, username } = proxy;
    let proxyUrl = `${protocol}://${host}:${port}`;

    if (username && password) {
        proxyUrl = `${protocol}://${username}:${password}@${host}:${port}`;
    }
    return new HttpsProxyAgent(proxyUrl);
}
