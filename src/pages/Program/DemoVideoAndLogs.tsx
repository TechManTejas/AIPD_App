import { IonContent, IonPage } from '@ionic/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { exerciseNameFromTag } from '../../utils/ExerciseUtils';
import { exerciseNames } from '../../utils/ExerciseUtils';

export const DemoVideoAndLogs: React.FC = () => {

    const [exerciseData, setExerciseData] = useState<{ description: string, link: string, name: string, image: string, id: number, data: object }>()

    interface ExerciseNames {
        [key: number]: string;
    }

    function findKeyByValue(object: ExerciseNames, value: string): number | undefined {
        return Object.keys(object).find((key) => object[Number(key)] === value) as number | undefined;
    }

    useEffect(() => {
        axios.get("/exercise/", {
            headers: {
                Authorization: `Token ${localStorage.getItem(
                    "aipd-patient-access-token"
                )}`,
            },
        }).then((data: any) => {
            // console.log(data.data)
            getInfoOfSelectedExercise(data.data)
        }).catch((e) => console.log(e))


        // const exercise = localStorage?.getItem("exercise")
        // console.log((exercise))
        // if (exercise !== null)
        //     console.log(exerciseData[ExerciseToID.indexOf(exercise)])


    }, [])

    const getInfoOfSelectedExercise = (data: any) => {
        const exercise = localStorage.getItem("exercise")
        // console.log(data)
        if (exercise !== null) {
            const key = findKeyByValue(exerciseNames, exercise);
            // console.log(data, typeof Number(key));
            setExerciseData(data[Number(key) - 1])
        }
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                {
                    exerciseData === undefined ? <></> :
                        <>
                            <div className='bg-white flex flex-col flex-grow pb-16'>
                                <div className="border-2 border-x-0 border-black p-2">
                                    <div className='flex space-x-2 items-center'>
                                        <div className="text-xl font-semibold">
                                            {exerciseData.name}
                                        </div>
                                        <div className="text-green-600">
                                            <CheckCircleIcon fontSize='large' />
                                        </div>
                                    </div>
                                    <div>
                                        {exerciseData.description}
                                    </div>
                                </div>
                                <div className="p-2">
                                    <div className="text-lg font-semibold">
                                        Exercise Log
                                    </div>
                                    <div>
                                        All the events tracked during the recording
                                        Issues, errors, warnings highlighted in red
                                        Completions highlighted in Green
                                    </div>
                                </div>
                                <a href="/" className='flex absolute bottom-20 w-full justify-center items-center'>
                                    <div className='bg-blue-600 w-8/12 text-3xl text-center text-white px-3 py-1 rounded'>Home Page</div>
                                </a>
                            </div>
                        </>
                }

            </IonContent>
        </IonPage>
    )
}