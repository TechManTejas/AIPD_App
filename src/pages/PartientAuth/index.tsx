import { IonContent, IonPage } from "@ionic/react"
import { OutlinedInput } from "@mui/material"
import { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import GradientButton from "../../components/GradientButton"
import axios from "axios"

export const Auth: React.FC = () => {

    const history = useHistory()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function authAndProceed() {
        const url = "http://127.0.0.1:8000/auth/";
        const data = { username: username, password: password };
        console.log(data)
        axios.post(url, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }).catch(function (error: any) {
            console.log(error);
        })
            .then((data: any) => {
                console.log(data);
                if (data.data.token) {
                    localStorage.setItem("aipd-patient-access-token", data.data.token)
                    console.log(data.data.token)
                    history.push("/program")
                }
            });
    }


    return (
        <IonPage>
            <IonContent fullscreen>
                <div className='bg-white flex flex-col flex-grow p-2 h-full'>
                    <div className='flex h-full  flex-col justify-center items-center'>
                        <div className='space-y-2 my-4'>
                            <OutlinedInput fullWidth placeholder="Phone number" 
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                            />
                            <OutlinedInput fullWidth placeholder="Program code" 
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }}
                            />
                        </div>
                        <GradientButton
                            onClick={authAndProceed}
                            varient={"success"}
                            isFullWidth={true}
                        >
                            <div className="text-base">
                                Access your Program
                            </div>
                        </GradientButton>
                    </div>
                    <Link to="/doctor-auth">
                        <GradientButton
                            onClick={() => { }}
                            varient={"primary"}
                            isFullWidth={true}
                        >
                            <div className="text-base">
                                Doctor Login
                            </div>
                        </GradientButton>
                    </Link>
                </div>
            </IonContent>
        </IonPage>
    )
}