// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9QLepVKOLuK6IshHapO5ezxn9elfIWrM",
  authDomain: "aipd-15f6b.firebaseapp.com",
  projectId: "aipd-15f6b",
  storageBucket: "aipd-15f6b.appspot.com",
  messagingSenderId: "253496855545",
  appId: "1:253496855545:web:adea80edbc86a4725d0b28",
  measurementId: "G-KRYBVHMYK8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// const analytics = getAnalytics(app);

export const uploadFile = (file : File) => {
    const storageRef = ref(storage, new Date().toUTCString())
    uploadBytes(storageRef, file).then((snapshot) => {
        console.log(snapshot);
        console.log(file);
    });
}

export const getVideoURL = async (filename: string): Promise<string> => {
  const fileRef = ref(storage, filename);
  
  try {
    const downloadURL = await getDownloadURL(fileRef);
    console.log('Video URL:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.log('Error retrieving video:', error);
    throw error; // Rethrow the error or handle it as needed
  }
};