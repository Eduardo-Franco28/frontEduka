import * as SecureStore from 'expo-secure-store';

export async function saveStore(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}

export async function getStore(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
}