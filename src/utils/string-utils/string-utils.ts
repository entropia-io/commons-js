import {isNullOrUndefined} from '../object-utils'

export function isNullOrEmpty(str: string | null | undefined): boolean {
    return isNullOrUndefined(str) ? true : str.length === 0;
}

export function trimToNull(str: string): string | null {
    if (isNullOrUndefined(str)) {
        return null;
    }
    const trimmedStr = str.trim();
    return trimmedStr.length > 0 ? trimmedStr : null;
}

export function isBase64Str(text: string): boolean {
    if (isNullOrUndefined(text)) {
        return false;
    }
    try {
        atob(text);
    } catch (e) {
        return false;
    }
    return true;
}


// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export function randomString(length: number = 32): string {
    if (isNullOrUndefined(length) || isNaN(length) || length <= 0) {
        return '';
    }
    let randomStr = '';
    do {
        randomStr += Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    } while (randomStr.length < length);
    return randomStr.substring(0, length);
}


export function serializeToQueryParameters(object: Record<string, string>): string {
    const str: string[] = [];
    for (const property in object) {
        if (Object.hasOwnProperty.call(object, property)) {
            str.push(encodeURIComponent(property) + '=' + encodeURIComponent(object[property]));
        }
    }
    return str.join('&');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function stringFormat(str: string, ...args: string[]): string {
    if (!isNullOrEmpty(str) && !!args && args.length > 0) {
        return str.replace(/{}/g, () => args.shift() ?? '');
    }
    return str;
}
