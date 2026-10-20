import { API_URL } from "./apiUrl.ts";
export const loginUser = async (credentials) => {
    const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            username: credentials.email,
            password: credentials.password,
        }),
    });

    if (!response.ok) {
        if (response.status === 401) throw new Error('login.badCredentials');
        const data = await response.json();
        throw new Error(typeof data.detail === 'string' ? data.detail : 'login.genericError');
    }

    return response.json();
};


export const registerUser = async (userData) => {
    const response = await fetch(`${API_URL}/users/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: userData.username,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            is_botanist: userData.is_botanist
        }),
        credentials: 'include',
        mode: 'cors'
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(typeof error.detail === "string" ? error.detail : "register.genericError");
    }

    return response.json();
};