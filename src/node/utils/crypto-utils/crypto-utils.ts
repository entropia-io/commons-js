import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';

// 256-bit key
const iv = crypto.randomBytes(16);

// Encrypt function
export function aesEncrypt(text: string, secretKey: string): string {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

// Decrypt function
export function aesDecrypt(encryptedText: string, secretKey: string): string {
    const textParts = encryptedText.split(':');
    const iv = Buffer.from(textParts.shift() as string, 'hex');
    const encrypted = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}