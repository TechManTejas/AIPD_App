import { IonContent, IonPage } from "@ionic/react"
import { CardActionArea } from "@mui/material"
import { Link } from "react-router-dom"

export const CameraRendering: React.FC = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className='bg-white flex flex-col flex-grow pb-16'>
                    <div className="flex flex-col justify-between h-[calc(100vh-64px)]">
                        <div className="p-1">
                            <div className="font-bold text-lg">
                                Recording screen details
                            </div>
                            <div>
                                <div className="text-xs">
                                    1. Starting point reference
                                </div>
                                <div className="text-xs">
                                    2. Comfrmation when the patient gets into the right starting point
                                </div>
                                <div className="text-xs">
                                    3. Reference on where the completion point is
                                </div>
                                <div className="text-xs">
                                    4. Confrmation when the patient reaches the completion poin
                                </div>
                                <div className="text-xs">
                                    5. Rep count
                                </div>
                                <div className="text-xs">
                                    6. Current Set number
                                </div>
                                <div className="text-xs">
                                    7. Total number of sets lef
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                            CAMERA RENDERS HERE
                        </div>
                        <div className="p-1">
                            <Link to="/demo-video-logs">
                                <CardActionArea>
                                    <div className="border bg-blue-600 text-white font-semibold p-1 text-center">
                                        Summary
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