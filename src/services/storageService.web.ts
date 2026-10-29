export async function save(key: string, value: string) {
    localStorage.setItem(key, value);
}

export async function get(key: string): Promise<string | null> {
    return localStorage.getItem(key);
}

export async function remove(key: string) {
    localStorage.removeItem(key);
}
