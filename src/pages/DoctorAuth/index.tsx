import { IonContent, IonPage } from "@ionic/react"
import { OutlinedInput } from "@mui/material"
import GradientButton from "../../components/GradientButton"

export const DoctorAuth: React.FC = () => {

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className='bg-white flex flex-col flex-grow p-2 h-full'>
                    <div className='flex h-full  flex-col justify-center items-center'>
                        <div className='space-y-2 my-4'>
                            <OutlinedInput fullWidth placeholder="Phone number" />
                            <OutlinedInput fullWidth placeholder="Program code" />
                        </div>
                        <GradientButton
                            onClick={() => { }}
                            varient={"success"}
                            isFullWidth={true}
                        >
                            <div className="text-base">
                                Access your Program
                            </div>
                        </GradientButton>
                    </div>
                    <GradientButton
                        onClick={() => { }}
                        varient={"primary"}
                        isFullWidth={true}
                    >
                        <div className="text-base">
                            Doctor Login
                        </div>
                    </GradientButton>
                </div>
            </IonContent>
        </IonPage>
    )
}