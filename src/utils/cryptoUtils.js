import CryptoJS from 'crypto-js';
import { AUTH_CONFIG } from '../config/auth';


const PAYLOAD_ENCRYPTION_KEY = AUTH_CONFIG.payloadEncryptionKey;;

/**
 * Helper to decode the static Pass_key from Base64 for CryptoJS
 */
function getDecodedKey() {
  if (!PAYLOAD_ENCRYPTION_KEY) {
    throw new Error('Encryption Key is missing. Ensure the Pass_key is provided.');
  }
  // This treats the Pass_key as a Base64 encoded string to extract the raw bytes
  return CryptoJS.enc.Base64.parse(PAYLOAD_ENCRYPTION_KEY);
}

/**
 * Encrypts request body into requestData format
 * Format: Base64(IV + CipherText)
 */
export function encryptRequestData(requestBody) {
  const serializedBody = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody ?? {});
  
  const iv = CryptoJS.lib.WordArray.random(16); // 128-bit IV
  const decodedKey = getDecodedKey();

  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(serializedBody), decodedKey, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  // Prepend IV to the ciphertext as per iServeU/PNB requirements
  const combined = iv.concat(encrypted.ciphertext);

  return CryptoJS.enc.Base64.stringify(combined);
}

export function decryptResponseData(responseBody) {
  // Log 1: The Raw Input
  
  if (!responseBody || typeof responseBody !== 'string') return responseBody;

  try {
    const fullWordArray = CryptoJS.enc.Base64.parse(responseBody);
    
    // Log 2: Total Byte Length

    // Extract IV (First 16 bytes)
    const iv = CryptoJS.lib.WordArray.create(fullWordArray.words.slice(0, 4), 16);

    // Extract CipherText (Rest)
    const cipherText = CryptoJS.lib.WordArray.create(
      fullWordArray.words.slice(4),
      fullWordArray.sigBytes - 16
    );

    const decodedKey = getDecodedKey();

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: cipherText }, 
      decodedKey, 
      {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
      }
    );

    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

    // Log 3: The Result
    if (!decryptedString) {
      console.error("%c [CRYPTO] Decryption Failed! Result is empty.", "color: red;");
      return null;
    }

    return decryptedString;

  } catch (error) {
    console.error("[CRYPTO] Internal Decryption Error:", error.message);
    return null;
  }
}

/**
 * High-level helper to decode the entire API response object
 */
export function decodeApiResponse(apiResponse) {
  // Postman shows the key is "ResponseData"
  const encryptedValue = apiResponse?.ResponseData || apiResponse?.responseData;

  if (!encryptedValue) {
    console.warn("No encrypted field found in response:", apiResponse);
    return apiResponse;
  }

  try {
    // We send the raw string "value" to our decrypter
    const decryptedString = decryptResponseData(encryptedValue);
    
    // Parse the final JSON string into an object
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Critical Decryption/Parsing Error:", error.message);
    return null;
  }
}