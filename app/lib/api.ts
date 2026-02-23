const API_BASE = process.env.NEXT_PUBLIC_AFFILIATE_API_URL ?? "http://localhost:8085";

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("aff_token");
}

export function setToken(token: string) {
    localStorage.setItem("aff_token", token);
}

export function clearToken() {
    localStorage.removeItem("aff_token");
}

export async function affFetch<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "application/json");

    const token = getToken();
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers,
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${response.status}`);
    }

    return response.json();
}
