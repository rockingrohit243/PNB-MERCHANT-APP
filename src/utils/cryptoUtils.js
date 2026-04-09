import CryptoJS from 'crypto-js';

/**
 * YOUR SHARED KEYS:
 * Pass_key (Header & Encryption): QC62FQKXT2DQTO43LMWH5A44UKVPQ7LK5Y6HVHRQ3XTIKLDTB6HA
 */
const PAYLOAD_ENCRYPTION_KEY = 'a6T8tOCYiSzDTrcqPvCbJfy0wSQOVcfaevH0gtwCtoU=';

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

/**
 * Decrypts raw ResponseData string
 */
export function decryptResponseData(responseBody) {
  if (!responseBody || typeof responseBody !== 'string') {
    return responseBody;
  }

  const byteCipherText = CryptoJS.enc.Base64.parse(responseBody);
  
  // Extract the first 16 bytes as IV
  const iv = CryptoJS.lib.WordArray.create(byteCipherText.words.slice(0, 4), 16);
  
  // Extract the remaining bytes as the actual CipherText
  const cipherText = CryptoJS.lib.WordArray.create(
    byteCipherText.words.slice(4),
    byteCipherText.sigBytes - 16
  );

  const decodedKey = getDecodedKey();
  
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherText }, decodedKey, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * High-level helper to decode the entire API response object
 */
export function decodeApiResponse(apiResponse) {
  // Check if the response contains the encrypted key (case-sensitive check)
  const encryptedData = apiResponse?.responseData || apiResponse?.ResponseData;

  if (!encryptedData || typeof encryptedData !== 'string') {
    return apiResponse; // Return as-is if not encrypted
  }

  const decryptedString = decryptResponseData(encryptedData);

  try {
    return JSON.parse(decryptedString);
  } catch (e) {
    console.warn("Decrypted string is not valid JSON:", decryptedString);
    return decryptedString;
  }
}