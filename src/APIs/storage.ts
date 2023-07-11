import { uploadBytes, ref, StorageReference, getDownloadURL, updateMetadata  } from "firebase/storage";
import { storage } from "../utils/firebase";
import { addExerciseDataToDatabase } from "./PatientRecord";

export const uploadFile = async (file: File) => {
    const storageRef = ref(storage, new Date().toUTCString())
    await uploadBytes(storageRef, file).then(async (snapshot) => {
        await setVideoContentType(storageRef);
        await getVideoURL(storageRef)
    });
}

const setVideoContentType = async (storageRef: StorageReference): Promise<void> => {
  const metadata = { contentType: "video/webm;codecs=vp8" };
  await updateMetadata(storageRef, metadata);
};

export const getVideoURL = async (storageRef: StorageReference) => {
    try {
        const downloadURL = await getDownloadURL(storageRef);
        addExerciseDataToDatabase(downloadURL)
    } catch (error) {
        throw error; 
    }
};