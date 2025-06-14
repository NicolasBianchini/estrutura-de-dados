// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// IMPORTANTE: Substitua por suas próprias credenciais do Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCrkhI_PJ8ogcBHjEy2gZPyTzli_yVTrjA",
    authDomain: "projeto-estrutura-c2f18.firebaseapp.com",
    projectId: "projeto-estrutura-c2f18",
    storageBucket: "projeto-estrutura-c2f18.firebasestorage.app",
    messagingSenderId: "283711294023",
    appId: "1:283711294023:web:27eb70790ddb25ff66ff62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (sem auth)
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 