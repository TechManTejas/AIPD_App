import { IonContent, IonPage } from "@ionic/react"
import { OutlinedInput } from "@mui/material"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import GradientButton from "../../components/GradientButton"
import AIPDLogo from "../../Images/aipdlogo.png"
import axios from "axios"
import { GlobalDataState } from "../../Context/global"

export const DoctorAuth: React.FC = () => {

    const history = useHistory()

    const { setAuthenticated } = GlobalDataState()

    const [username, setUsername] = useState("") 
    const [password, setPassword] = useState("")

    function authAndProceed(){
        const url = "/auth/";
        const data = { username: username, password: password };
        console.log(data)
        axios.post(url, data, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).then(( data: any ) => {
                console.log(data)
                console.log(data.data)
                if(data.data.token){
                    if(data.data.user_type === 'doctor')
                        localStorage.setItem("aipd-doctor-access-token", data.data.token)
                    else if(data.data.user_type === 'fittlyf_physio')
                        localStorage.setItem("aipd-fittlyf-physio-access-token", data.data.token)
                    setAuthenticated(true)
                    window.location.href = "/";
                }
            });
    }

    return (
        <IonPage>
            <IonContent fullscreen>
                <div className='bg-white flex flex-col flex-grow p-2 h-full justify-between items-center'>
                    <div>
                        <img src={AIPDLogo} />
                    </div>
                    <div className='mb-16'>
                        <div className='space-y-2 my-2'>
                            <OutlinedInput fullWidth placeholder="Username / Phonenumber" 
                                value={username}
                                onChange={(e)=>{
                                    setUsername(e.target.value)
                                }}
                            />
                            <OutlinedInput fullWidth placeholder="Password" 
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                        </div>
                        <GradientButton
                            onClick={authAndProceed}
                            varient={"primary"}
                            isFullWidth={true}
                        >
                            <div className="text-base">
                                Login
                            </div>
                        </GradientButton>
                    </div>
                    <div>
                        <GradientButton
                            onClick={() => {
                                history.goBack()
                            }}
                            varient={"success"}
                            isFullWidth={true}
                        >
                            <div className="text-base flex space-x-1">
                                <div>
                                    I'm A Patient
                                </div>
                            </div>
                        </GradientButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}