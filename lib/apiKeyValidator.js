import { db } from './firebase';

export async function validateApiKey(apiKey) {
  if (!apiKey) {
    return { valid: false, error: 'API key required hai' };
  }

  try {
    // Firestore se API key check karo
    const apiKeyDoc = await db.collection('api_keys').doc(apiKey).get();

    if (!apiKeyDoc.exists) {
      return { valid: false, error: 'Invalid API key' };
    }

    const keyData = apiKeyDoc.data();

    // Check if key is active
    if (!keyData.isActive) {
      return { valid: false, error: 'API key is deactivated' };
    }

    // Check if key has expired
    if (keyData.expiresAt && new Date(keyData.expiresAt) < new Date()) {
      return { valid: false, error: 'API key has expired' };
    }

    // Update last used timestamp
    await db.collection('api_keys').doc(apiKey).update({
      lastUsedAt: new Date().toISOString(),
      requestCount: (keyData.requestCount || 0) + 1,
    });

    return { valid: true, keyData };
  } catch (error) {
    return { valid: false, error: 'API key validation failed' };
  }
}
