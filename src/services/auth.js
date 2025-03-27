import { API_GATEWAY, API_ENDPOINTS } from '../config';

export const AuthService = {
    async getChallenge() {
        const response = await fetch(`http://45.83.143.192:8080${API_ENDPOINTS.AUTH.CHALLENGE}`);
        if (!response.ok) throw new Error('Failed to get challenge');
        return await response.json();
    },

    async pollForToken(challenge, timeout = 30000, interval = 2000) {
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            const poll = async () => {
                try {
                    if (Date.now() - startTime >= timeout) {
                        reject(new Error('Authorization timeout'));
                        return;
                    }

                    const response = await fetch(
                        `http://45.83.143.192:8080${API_ENDPOINTS.AUTH.TOKEN}?challenge=${challenge}`
                    );

                    if (response.ok) {
                        const data = await response.json();
                        if (data.token) {
                            resolve(data);
                            return;
                        }
                    }

                    setTimeout(poll, interval);
                } catch (error) {
                    reject(error);
                }
            };

            poll();
        });
    }
};