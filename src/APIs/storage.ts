import { uploadBytesResumable, uploadBytes, ref, StorageReference, getDownloadURL } from "firebase/storage";
import { storage } from "../utils/firebase";
import { addExerciseDataToDatabase } from "./PatientRecord";

export const uploadFile = async (file: File) => {
    const storageRef = ref(storage, new Date().toUTCString())
    await uploadBytes(storageRef, file).then(async (snapshot) => {
        console.log(snapshot);
        console.log(file);
        await getVideoURL(storageRef)
    });
    //  const uploadTask = uploadBytesResumable(storageRef, file);
    //  uploadTask.on(
    //    "state_changed",
    //    (snapshot) => {},
    //    (error) => {
    //      console.log(error);
    //    },
    //    () => {
    //     getVideoURL(storageRef)
    //    }
    //  );

}

export const getVideoURL = async (storageRef: StorageReference) => {
    try {
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Video URL:', downloadURL);
        await addExerciseDataToDatabase(downloadURL)
    } catch (error) {
        console.log('Error retrieving video:', error);
        throw error; // Rethrow the error or handle it as needed
    }
};