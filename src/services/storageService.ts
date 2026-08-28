import * as SecureStore from 'expo-secure-store';

export async function save(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}

export async function get(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
}

export async function remove(key: string) {
    return await SecureStore.deleteItemAsync(key);
}