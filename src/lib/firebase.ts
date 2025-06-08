
// This is a mock Firebase initialization.
// In a real application, you would initialize Firebase using your project's configuration.
// import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
// import { getFirestore, type Firestore } from "firebase/firestore";
// import { getAuth, type Auth } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// let app: FirebaseApp;
// let db: Firestore;
// let auth: Auth;

// if (typeof window !== "undefined" && !getApps().length) {
//   app = initializeApp(firebaseConfig);
//   db = getFirestore(app);
//   auth = getAuth(app);
// } else if (getApps().length > 0) {
//   app = getApps()[0];
//   db = getFirestore(app);
//   auth = getAuth(app);
// }


// Mock implementation
console.log("Firebase SDK would be initialized here.");

const mockDb = {
  collection: (path: string) => ({
    doc: (id?: string) => ({
      id: id || `mock-${Math.random().toString(36).substring(7)}`,
      set: async (data: any) => {
        console.log(`Mock Firestore: set data in ${path}/${id || 'new_doc'}`, data);
        return Promise.resolve();
      },
      get: async () => {
        console.log(`Mock Firestore: get data from ${path}/${id}`);
        return Promise.resolve({
          exists: () => true,
          data: () => ({ mockData: "This is mock data for " + id, ...({id: id || `mock-${Math.random().toString(36).substring(7)}`}) }),
        });
      }
    }),
    add: async (data: any) => {
      const newId = `mock-${Math.random().toString(36).substring(7)}`;
      console.log(`Mock Firestore: add data to ${path}, new id: ${newId}`, data);
      return Promise.resolve({ id: newId });
    },
    get: async () => {
       console.log(`Mock Firestore: get collection ${path}`);
       return Promise.resolve({
         empty: false,
         docs: [
           { id: 'mockDoc1', data: () => ({ name: 'Mock Booking 1', dateOfVisit: '2024-08-15', totalPrice: 300, visitors: [{name: 'Visitor A', country: 'Nepal'}], createdAt: new Date() }) },
           { id: 'mockDoc2', data: () => ({ name: 'Mock Booking 2', dateOfVisit: '2024-08-16', totalPrice: 500, visitors: [{name: 'Visitor B', country: 'Other'}], createdAt: new Date() }) },
         ]
       });
    }
  }),
};


// export { db, auth, app };
export const db = mockDb as any; // Mock Firestore instance
export const auth = {} as any; // Mock Auth instance
export const app = {} as any; // Mock App instance
