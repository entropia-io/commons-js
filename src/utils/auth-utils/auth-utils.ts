function base64Decode(str: string): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';

    str = String(str).replace(/=+$/, '');

    if (str.length % 4 === 1) {
        throw new Error(
            '\'atob\' failed: The string to be decoded is not correctly encoded.'
        );
    }

    /* eslint-disable */
    for (
        // initialize result and counters
        let bc = 0, bs: any, buffer: any, idx = 0;
        // get next character
        (buffer = str.charAt(idx++));
        // character found in table? initialize bit storage and add its ascii value;
        ~buffer &&
        (
            (bs = bc % 4 ? bs * 64 + buffer : buffer),
                // and if not first of each 4 characters,
                // convert the first 8 bits to one ascii character
            bc++ % 4
        )
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
        // try to find character in table (0-63, not found => -1)
        buffer = chars.indexOf(buffer);
    }
    /* eslint-enable */

    return output;
}

function base64DecodeUnicode(str: string): string {
    return decodeURIComponent(
        Array.prototype.map
            .call(base64Decode(str), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
    );
}

function urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
        case 0: {
            break;
        }
        case 2: {
            output += '==';
            break;
        }
        case 3: {
            output += '=';
            break;
        }
        default: {
            throw Error('Illegal base64url string!');
        }
    }
    return base64DecodeUnicode(output);
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function decodeToken(token: string): any | null {
    // Return if there is no token
    if (!token) {
        return null;
    }

    // Split the token
    const parts = token.split('.');

    if (parts.length !== 3) {
        throw new Error(
            'The inspected token doesn\'t appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.');
    }

    // Decode the token using the Base64 decoder
    const decoded = urlBase64Decode(parts[1]);

    if (!decoded) {
        throw new Error('Cannot decode the token.');
    }

    return JSON.parse(decoded);
}

function getTokenExpirationDate(token: string): Date | null {
    // Get the decoded token
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodedToken: any = decodeToken(token);

    // Return if the decodedToken doesn't have an 'exp' field
    if (!Object.hasOwnProperty.call(decodedToken, 'exp')) {
        return null;
    }

    // Convert the expiration date
    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);

    return date;
}

export function isJWTExpired(token: string, offsetSeconds?: number): boolean {
    // Return if there is no token
    if (!token || token === '') {
        return true;
    }

    // Get the expiration date
    const date = getTokenExpirationDate(token);

    offsetSeconds = offsetSeconds || 0;

    if (date === null) {
        return true;
    }

    // Check if the token is expired
    return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
}