import { BASE_URL } from './config';

export const apiService = {
    async get(endpoint) {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`GET ${endpoint} failed with status ${response.status}`);
        }
        return response.json();
    },

    async post(endpoint, data) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`POST ${endpoint} failed with status ${response.status}`);
        }
        return response.json();
    },

    async delete(endpoint) {
        const response = await fetch(`${BASE_URL}${endpoint}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`DELETE ${endpoint} failed with status ${response.status}`);
        }
        return response.json();
    },
    async patch(endpoint, data) {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
};
