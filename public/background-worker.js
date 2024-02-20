this.importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js');
this.importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-storage-compat.js');

var firebaseConfig = {
    apiKey: "AIzaSyB9QLepVKOLuK6IshHapO5ezxn9elfIWrM",
    authDomain: "aipd-15f6b.firebaseapp.com",
    projectId: "aipd-15f6b",
    storageBucket: "aipd-15f6b.appspot.com",
    messagingSenderId: "253496855545",
    appId: "1:253496855545:web:adea80edbc86a4725d0b28",
    measurementId: "G-KRYBVHMYK8"
};

this.firebase.initializeApp(firebaseConfig);
const storageRef = this.firebase.storage().ref().child(new Date().toUTCString());

const uploadFileFirebase = async (file) => {
    await this.firebase.storage.uploadBytes(storageRef, file).then(async (snapshot) => {
        console.log(snapshot);
    });
}

const addExerciseDataToDatabase = async (blob, exercise, patient, authToken) => {
    const databaseURL = 'https://13.232.102.80/exercise_record/';

    const fileName = 'video.webm';
    const file = new File([blob], fileName, { type: blob.type });

    const formData = new FormData();
    formData.append('date', getDateWithFormat());
    formData.append('exercise', exercise);
    formData.append('patient', patient);
    formData.append('blob', file);

    const headers = new Headers({
        'Authorization': `Token ${authToken}`
    });

    try {
        const response = await fetch(databaseURL, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (response.ok) {
            console.log('Data Added to Database');
        } else {
            console.error('Failed to add data to the database:', response);
        }
    } catch (error) {
        console.error('Error while making the request:', error);
    }
};

// Listen for messages from the main script
this.addEventListener('message', async (event) => {
    const data = event.data;
    if (data.blob) {
        let blob = data.blob;
        console.log(blob);

        try {
            // await uploadFileFirebase(blob);
            await addExerciseDataToDatabase(blob, data.exercise, data.patient, data.authToken)

        } catch (error) {
            console.log(error);
        }
    }
});


const getDateWithFormat = () => {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var day = String(currentDate.getDate()).padStart(2, '0');
    var formattedDate = year + '-' + month + '-' + day;
    return formattedDate
}