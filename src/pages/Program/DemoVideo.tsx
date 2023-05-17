import { IonContent, IonPage } from '@ionic/react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import fittlyf_pcos_hero from "../../Videos/Fittlyf_pcos_hero.mp4"


export const DemoVideo: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className='bg-white flex flex-col flex-grow pb-16'>
                    <p className='text-center p-3 text-xl text-bold'>Demo Video</p>
                    <div className='p-3'>
                        <video className='rounded-xl' controls>
                            <source src={fittlyf_pcos_hero} type="video/mp4" />
                        </video>
                    </div>
                    <div className="border-2 border-x-0 border-black p-2">
                        <div className='flex space-x-2 items-center'>
                            <div className="text-xl font-semibold">
                                {localStorage.getItem("exercise")}
                            </div>
                        </div>
                        <div>
                            Exercise details including the movement, possible wrong movement chances
                        </div>

                    </div>
                    <div className="p-2">
                        <div className="p-1 my-4">
                            <Link to="/camera-rendering">
                                <CardActionArea>
                                    <div className=" rounded-xl shadow-black shadow-lg border bg-blue-600 text-white font-semibold p-1 text-center">
                                        Start Exercise
                                    </div>
                                </CardActionArea>
                            </Link>
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}