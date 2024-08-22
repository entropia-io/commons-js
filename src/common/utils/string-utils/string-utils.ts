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

/**
 * Formats a string of form 'project/{}/{}' and replaces
 * with corresponding arguments ['1234', 'resource']
 * and returns output: 'project/1234/resource'.
 *
 * @param str - The original string where the param need to be
 *     replaced.
 * @param params - The optional parameters to replace in the
 *     string.
 * @returns The resulting formatted string.
 */
export function formatStringSimple(str: string, ...params: string[]): string {
    if (!isNullOrEmpty(str) && !!params && params.length > 0) {
        return str.replace(/{}/g, () => params.shift() ?? '{}');
    }
    return str;
}

/**
 * Formats a string of form 'project/{projectId}/{api}' and replaces
 * with corresponding arguments {projectId: '1234', api: 'resource'}
 * and returns output: 'project/1234/resource'.
 *
 * @param str - The original string where the param need to be
 *     replaced.
 * @param params - The optional parameters to replace in the
 *     string.
 * @returns The resulting formatted string.
 */
export function formatString(str: string, params?: object): string {
    if (isNullOrEmpty(str)) {
        return str;
    }
    let formatted = str;
    Object.keys(params || {}).forEach((key) => {
        formatted = formatted.replace(
            new RegExp('{' + key + '}', 'g'),
            (params as Record<string, string>)[key]);
    });
    return formatted;
}

/**
 * Check if a string is a valid phone number under E.164 format.<br/>
 * <b>Conditions:</b>
 * <ul>
 * <li>The phone number string must be non-empty and starts with a plus sign.</li>
 * <li>The phone number string must contain at least one alphanumeric character.</li>
 * </ul>
 * @param str the string to be evaluated
 */

export function isPhoneNumber(str: string): boolean {
    if (typeof str !== 'string') {
        return false;
    }
    // Phone number validation is very lax here. Backend will enforce E.164
    // spec compliance and will normalize accordingly.
    //
    const re1 = /^\+/;
    //
    const re2 = /[\da-zA-Z]+/;
    return re1.test(str) && re2.test(str);
}

/**
 * Check if a string is a valid email address
 * <b>Conditions:</b>
 * <ul>
 * <li>There must at least one character before the @ symbol and another after.</li>
 * </ul>
 * @param str the string to be evaluated
 */
export function isEmail(str: string): boolean {
    if (typeof str !== 'string') {
        return false;
    }
    const re = /^[^@]+@[^@]+$/;
    return re.test(str);
}