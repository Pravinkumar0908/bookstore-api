import admin from 'firebase-admin';

// Initialize Firebase Admin
function initializeFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.apps[0];
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Initialize app
const app = initializeFirebaseAdmin();

// Export Firestore instance
const db = admin.firestore();

export { db, admin };
