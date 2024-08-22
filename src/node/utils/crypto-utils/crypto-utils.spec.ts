import * as crypto from 'crypto';
import {aesDecrypt, aesEncrypt} from './crypto-utils';

describe('AES Encryption/Decryption', () => {
    const secretKey = crypto.randomBytes(32).toString('hex').slice(0, 32); // 256-bit key
    const plainText = 'This is a secret message';

    it('should encrypt text correctly', () => {
        const encryptedText = aesEncrypt(plainText, secretKey);
        expect(encryptedText).toBeTruthy();
        expect(encryptedText).not.toEqual(plainText);
    });

    it('should decrypt text correctly', () => {
        const encryptedText = aesEncrypt(plainText, secretKey);
        const decryptedText = aesDecrypt(encryptedText, secretKey);
        expect(decryptedText).toEqual(plainText);
    });

    it('should not decrypt with a wrong key', () => {
        const encryptedText = aesEncrypt(plainText, secretKey);
        const wrongKey = crypto.randomBytes(32).toString('hex').slice(0, 32);
        expect(() => aesDecrypt(encryptedText, wrongKey)).toThrowError();
    });

    it('should throw an error with incorrect encrypted text format', () => {
        const incorrectEncryptedText = 'incorrect:format';
        expect(() => aesDecrypt(incorrectEncryptedText, secretKey)).toThrowError();
    });
});
