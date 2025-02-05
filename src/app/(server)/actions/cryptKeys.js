'use server'
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const keyLength = 32; // 256 bits = 32 bytes
const ivLength = 16; // 128 bits = 16 bytes

// Helper function to ensure key is correct length
function normalizeKey(key) {
    if (!key) {
        throw new Error('SECRET_KEY is not defined in environment variables');
    }
    
    // If key is hex string, convert to Buffer
    const keyBuffer = Buffer.from(key, 'hex');
    
    // If key is too short, hash it to get proper length
    if (keyBuffer.length < keyLength) {
        return crypto
            .createHash('sha256')
            .update(keyBuffer)
            .digest();
    }
    
    // If key is too long, truncate it
    if (keyBuffer.length > keyLength) {
        return keyBuffer.slice(0, keyLength);
    }
    
    return keyBuffer;
}

/**
 * Encrypts an API key using AES-256-CBC
 * @param {string} apiKey - The API key to encrypt
 * @returns {Promise<string>} The encrypted key with IV prepended
 * @throws {Error} If encryption fails
 */
export async function encryptAPIKey(apiKey) {
    try {
        if (!apiKey) {
            throw new Error('API key cannot be empty');
        }

        const normalizedKey = normalizeKey(process.env.SECRET_KEY);
        const iv = crypto.randomBytes(ivLength);

        const cipher = crypto.createCipheriv(algorithm, normalizedKey, iv);
        let encrypted = cipher.update(apiKey, 'utf-8', 'hex');
        encrypted += cipher.final('hex');

        // Return IV + encrypted data
        return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
        if (error.code === 'ERR_CRYPTO_INVALID_KEYLEN') {
            throw new Error('Invalid encryption key length. Please check your SECRET_KEY.');
        }
        if (error.code === 'ERR_CRYPTO_INVALID_IV') {
            throw new Error('Invalid initialization vector.');
        }
        if (error.code === 'ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE') {
            throw new Error('Invalid key type. Key must be a string or buffer.');
        }
        
        // Throw a generic error message to avoid leaking implementation details
        throw new Error('Encryption failed. Please check your inputs and try again.');
    }
}

/**
 * Decrypts an encrypted API key
 * @param {string} encryptedKey - The encrypted key with IV prepended
 * @returns {Promise<string>} The decrypted API key
 * @throws {Error} If decryption fails
 */
export async function decryptAPIKey(encryptedKey) {
    try {
        if (!encryptedKey || !encryptedKey.includes(':')) {
            throw new Error('Invalid encrypted key format');
        }

        const [ivHex, encrypted] = encryptedKey.split(':');
        
        if (!ivHex || !encrypted) {
            throw new Error('Invalid encrypted key format');
        }

        const normalizedKey = normalizeKey(process.env.SECRET_KEY);
        const iv = Buffer.from(ivHex, 'hex');

        if (iv.length !== ivLength) {
            throw new Error('Invalid IV length');
        }

        const decipher = crypto.createDecipheriv(algorithm, normalizedKey, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
        decrypted += decipher.final('utf-8');

        return decrypted;
    } catch (error) {
        if (error.code === 'ERR_CRYPTO_INVALID_KEYLEN') {
            throw new Error('Invalid decryption key length. Please check your SECRET_KEY.');
        }
        if (error.code === 'ERR_CRYPTO_INVALID_IV') {
            throw new Error('Invalid initialization vector in encrypted key.');
        }
        if (error.code === 'ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE') {
            throw new Error('Invalid key type. Key must be a string or buffer.');
        }
        
        // Throw a generic error message to avoid leaking implementation details
        throw new Error('Decryption failed. Please check your inputs and try again.');
    }
}