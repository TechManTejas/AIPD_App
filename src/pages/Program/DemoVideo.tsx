import { IonContent, IonPage } from '@ionic/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from "axios"
import { useEffect, useState } from 'react';


export const DemoVideo: React.FC = () => {

    const [exerciseData, setExerciseData] = useState<{ description: string, link: string, name: string, image: string, id: number, data: object }>()

    interface ExerciseNames {
        [key: number]: string;
    }

    const exerciseNames: ExerciseNames = {
        6: "ArmsLock",
        7: "Butterfly",
        8: "LyingArms",
        9: "PendulumCircles",
        10: "PendulumSideways",
        11: "PendulumStraight",
    };

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
            setExerciseData(data[Number(key)-1])
        }
    }


    // console.log(getInfoOfSelectedExercise())

    return (
        <IonPage>
            <IonContent fullscreen>
                {
                    exerciseData === undefined ? <></> : <>
                        <div className='bg-white flex flex-col flex-grow pb-16'>
                            <p className='text-center p-3 text-xl text-bold'>Demo Video</p>
                            <div className='flex justify-center'>
                                <iframe allowFullScreen className='p-3 w-10/12' src={exerciseData.link} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share">
                                </iframe>
                            </div>
                            <div className="border-2 border-x-0 border-black p-2">
                                <div className='flex space-x-2 items-center'>
                                    <div className="text-xl font-semibold">
                                        {exerciseData.name}
                                    </div>
                                </div>
                                <div>
                                    {exerciseData.description}
                                </div>
                            </div>
                            <div className="p-2">
                                <div className="p-1 my-4">
                                    <Link to="/camera-rendering">
                                        <CardActionArea>
                                            <div className=" rounded-xl shadow-black shadow border bg-blue-600 text-white font-semibold p-1 text-center text-2xl">
                                                Start Exercise
                                            </div>
                                        </CardActionArea>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                }

            </IonContent>
        </IonPage>
    )
}