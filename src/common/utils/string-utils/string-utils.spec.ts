import {
    formatString,
    formatStringSimple,
    isBase64Str,
    isEmail,
    isNullOrEmpty,
    isPhoneNumber,
    randomString,
    serializeToQueryParameters,
    trimToNull
} from './string-utils';

describe('string-utils-isNullOrEmpty', () => {
    it('should return true if the string is null or undefined', () => {
        expect(isNullOrEmpty(null)).toBeTrue();
        expect(isNullOrEmpty(undefined)).toBeTrue();
    });

    it('should return true if the string is empty', () => {
        expect(isNullOrEmpty('')).toBeTrue();
    });

    it('should return false if the string is non-empty', () => {
        expect(isNullOrEmpty('test')).toBeFalse();
    });
});

describe('string-utils-trimToNull', () => {
    it('should return null if the string is null or undefined', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(trimToNull(null as any)).toBeNull();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(trimToNull(undefined as any)).toBeNull();
    });

    it('should return null if the trimmed string is empty', () => {
        expect(trimToNull('   ')).toBeNull();
    });

    it('should return the trimmed string if it is not empty', () => {
        expect(trimToNull('  test  ')).toBe('test');
        expect(trimToNull('test')).toBe('test');
    });
});

describe('string-utils-isBase64Str', () => {
    it('should return false if the string is null or undefined', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(isBase64Str(null as any)).toBeFalse();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(isBase64Str(undefined as any)).toBeFalse();
    });

    it('should return false if the string is not valid Base64', () => {
        expect(isBase64Str('not_base64')).toBeFalse();
    });

    it('should return true if the string is valid Base64', () => {
        expect(isBase64Str('dGVzdA==')).toBeTrue(); // 'test' in Base64
    });
});

describe('string-utils-randomString', () => {
    it('should return an empty string if length is null, undefined, or less than or equal to 0', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(randomString(null as any)).toBe('');
        expect(randomString(0)).toBe('');
        expect(randomString(-1)).toBe('');
    });

    it('should return a string of the specified length', () => {
        expect(randomString(10).length).toBe(10);
        expect(randomString(32).length).toBe(32);
    });

    it('should return different strings for multiple calls', () => {
        const str1 = randomString(10);
        const str2 = randomString(10);
        expect(str1).not.toBe(str2);
    });
});

describe('string-utils-serializeToQueryParameters', () => {
    it('should return an empty string if the object is empty', () => {
        expect(serializeToQueryParameters({})).toBe('');
    });

    it('should serialize the object into a query string', () => {
        expect(serializeToQueryParameters({key1: 'value1', key2: 'value2'})).toBe('key1=value1&key2=value2');
    });

    it('should encode special characters in keys and values', () => {
        expect(serializeToQueryParameters({'key@': 'value@'})).toBe('key%40=value%40');
    });
});

describe('string-utils-formatStringSimple', () => {

    it('format all params', () => {
        const placeholder = 'im a {} string, with {} params';
        const result = formatStringSimple(placeholder, 'funny', 'great');

        expect(result).toEqual('im a funny string, with great params');
    });

    it('return same placeholder', () => {
        const placeholder = 'im a {} string, with {} params';
        const result = formatStringSimple(placeholder);

        expect(result).toEqual('im a {} string, with {} params');
    });

    it('complex object as param', () => {
        const placeholder = 'im a {} string, with {} params';
        const result = formatStringSimple(placeholder, 'angry', JSON.stringify({hello: 'world'}));

        expect(result).toEqual('im a angry string, with {"hello":"world"} params');
    });

    it('should replace placeholders with corresponding parameters', () => {
        expect(formatStringSimple('project/{}/{}', '1234', 'resource')).toBe('project/1234/resource');
    });

    it('should return the original string if no parameters are provided', () => {
        expect(formatStringSimple('project/{}/{}')).toBe('project/{}/{}');
    });

    it('should replace only available placeholders', () => {
        expect(formatStringSimple('project/{}/{}', '1234')).toBe('project/1234/{}');
    });

    it('should return the original string if the string is null or empty', () => {
        expect(formatStringSimple('', '1234')).toBe('');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(formatStringSimple(null as any, '1234')).toBe(null as any);
    });

});

describe('string-utils-formatString', () => {

    it('format all params', () => {
        const placeholder = 'im a {par1} string, with {par2} params';
        const result = formatString(placeholder, {par1: 'funny', par2: 'great'});

        expect(result).toEqual('im a funny string, with great params');
    });

    it('return same placeholder', () => {
        const placeholder = 'im a {par1} string, with {par2} params';
        const result = formatStringSimple(placeholder);

        expect(result).toEqual('im a {par1} string, with {par2} params');
    });

    it('some params missing', () => {
        const placeholder = 'im a {par1} string, with {par2} params';
        const result = formatString(placeholder, {par1: 'funny', par3: 'great'});

        expect(result).toEqual('im a funny string, with {par2} params');
    });

    it('should replace placeholders with corresponding parameters', () => {
        expect(formatString('project/{projectId}/{api}', {projectId: '1234', api: 'resource'}))
            .toBe('project/1234/resource');
    });

    it('should return the original string if no parameters are provided', () => {
        expect(formatString('project/{projectId}/{api}')).toBe('project/{projectId}/{api}');
    });

    it('should replace only placeholders that have corresponding parameters', () => {
        expect(formatString('project/{projectId}/{api}', {projectId: '1234'})).toBe('project/1234/{api}');
    });

    it('should return the original string if the string is null or empty', () => {
        expect(formatString('', {projectId: '1234'})).toBe('');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(formatString(null as any, {projectId: '1234'})).toBe(null as any);
    });

});

describe('string-utils-isPhoneNumber', () => {
    it('should return false if the input is not a string', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(isPhoneNumber(123 as any)).toBeFalse();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(isPhoneNumber(null as any)).toBeFalse();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(isPhoneNumber(undefined as any)).toBeFalse();
    });

    it('should return false for an empty string', () => {
        expect(isPhoneNumber('')).toBeFalse();
    });

    it('should return false if the string does not start with a plus sign', () => {
        expect(isPhoneNumber('123456')).toBeFalse();
        expect(isPhoneNumber('0123456789')).toBeFalse();
    });

    it('should return false if the string does not contain any alphanumeric characters', () => {
        expect(isPhoneNumber('+')).toBeFalse();
        expect(isPhoneNumber('+!!')).toBeFalse();
    });

    it('should return true for a valid phone number under E.164 format', () => {
        expect(isPhoneNumber('+1234567890')).toBeTrue();
        expect(isPhoneNumber('+1aB34567890')).toBeTrue();
    });

    it('should return true for phone numbers with additional characters as long as they start with a plus sign and contain alphanumeric characters',
        () => {
            expect(isPhoneNumber('+123-456-7890')).toBeTrue();
            expect(isPhoneNumber('+1.234.567.890')).toBeTrue();
        });
});

describe('string-utils-isEmail', () => {
    it('should return false if the input is not a string', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(isEmail(123 as any)).toBeFalse();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(isEmail(null as any)).toBeFalse();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(isEmail(undefined as any)).toBeFalse();
    });

    it('should return false for an empty string', () => {
        expect(isEmail('')).toBeFalse();
    });

    it('should return false if the string does not contain the @ symbol', () => {
        expect(isEmail('noatsymbol')).toBeFalse();
    });

    it('should return false if there are no characters before the @ symbol', () => {
        expect(isEmail('@domain.com')).toBeFalse();
    });

    it('should return false if there are no characters after the @ symbol', () => {
        expect(isEmail('user@')).toBeFalse();
    });

    it('should return true for a valid email address', () => {
        expect(isEmail('user@domain.com')).toBeTrue();
        expect(isEmail('test.email@sub.domain.com')).toBeTrue();
    });
});