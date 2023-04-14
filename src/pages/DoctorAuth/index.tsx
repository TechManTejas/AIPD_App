import { IonContent, IonPage } from "@ionic/react"
import { OutlinedInput } from "@mui/material"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import GradientButton from "../../components/GradientButton"
import AIPDLogo from "../../Images/aipdlogo.png"
import axios from "axios"

export const DoctorAuth: React.FC = () => {

    const history = useHistory()

    const [username, setUsername] = useState("") 
    const [password, setPassword] = useState("")

    function authAndProceed(){
        const url = "/auth/";
        const data = { username: username, password: password };
        axios.post(url, data, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }).catch(function (error: any) {
                console.log(error);
            })
            .then(( data: any ) => {
                console.log(data.data.token);
                if(data.data.token){
                    localStorage.setItem("aipd-doctor-access-token", data.data.token)
                    console.log(data.data.token)
                    history.push("/doctor-dashboard")
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