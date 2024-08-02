import {isNullOrEmpty} from '../string-utils';
import {isNotNullOrUndefined} from '../object-utils';

export function getStorageValue<T>(key: string): T | null {
    if (!isStorageSupported()) {
        return null;
    }
    const securedKey: string = btoa(key);
    let stringMetadata: string = sessionStorage.getItem(securedKey) as string;
    if (isNullOrEmpty(stringMetadata)) {
        stringMetadata = localStorage.getItem(securedKey) as string;
    }
    if (isNullOrEmpty(stringMetadata)) {
        return null;
    }
    return JSON.parse(atob(stringMetadata));
}

export function setStorageValue<T>(key: string, data: T, persist?: boolean): void {
    if (!isStorageSupported()) {
        return;
    }
    const securedKey: string = btoa(key);
    deleteStorageValue(securedKey);
    const securedData = btoa(JSON.stringify(data));
    if (persist) {
        localStorage.setItem(securedKey, securedData);
    } else {
        sessionStorage.setItem(securedKey, securedData);
    }
}

export function deleteStorageValue(key: string): void {
    if (!isStorageSupported()) {
        return;
    }
    const securedKey: string = btoa(key);
    localStorage.removeItem(securedKey);
    sessionStorage.removeItem(securedKey);
}

export function existStoreValue(key: string): boolean {
    if (!isStorageSupported()) {
        return false;
    }
    const securedKey: string = btoa(key);
    return isNotNullOrUndefined(sessionStorage.getItem(securedKey)) ||
        isNotNullOrUndefined(localStorage.getItem(securedKey));
}

export function isStorageSupported(): boolean {
    return (typeof (Storage) !== 'undefined');
}


export function clearStorage(): void {
    sessionStorage.clear();
    localStorage.clear();
}