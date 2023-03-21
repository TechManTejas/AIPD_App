import { IonContent, IonPage } from "@ionic/react"
import { CardActionArea } from "@mui/material"
import { Link } from "react-router-dom"
import CameraPoseDetect from "./CameraComponent"

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
                            </div>
                        </div>
                        <div>
                            <CameraPoseDetect />
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