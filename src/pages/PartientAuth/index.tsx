import { IonContent, IonPage } from "@ionic/react"
import { OutlinedInput } from "@mui/material"
import { useState } from "react"
import { useHistory } from "react-router-dom"
import { ReactComponent as DoctorIcon } from "../../SVGs/doctor.svg"
import AIPDLogo from "../../Images/aipdlogo.png"
import GradientButton from "../../components/GradientButton"
import axios from "axios"
import { GlobalDataState } from "../../Context/global"
import { message } from "antd"

export const Auth: React.FC = () => {

    const history = useHistory()

    const { setAuthenticated } = GlobalDataState()


    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    function authAndProceed() {
        const url = "/auth/";
        const data = { username: username, password: password };
        console.log(data.toString())
        axios.post(url, data, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        })
            .then((data: any) => {
                console.log(data);
                if (data) {
                    if (data.data.token) {
                        message.success("success")
                        localStorage.setItem("aipd-patient-access-token", data.data.token)
                        console.log(data.data.token)
                        setAuthenticated(true)
                        window.location.href = "/";

                    }
                }

            }).catch(function (error: any) {
                message.error(error.toString());
                console.error(error)
                if (error.response.status === 400 || error.response.status === 401) {
                    message.error(error.response.data.non_field_errors[0])
                }
            })
    }


    return (
        <IonPage>
            <IonContent fullscreen>
                <div className='bg-white flex flex-col flex-grow p-2 h-full justify-between items-center'>
                    <div>
                        <img src={AIPDLogo} />
                    </div>
                    <div className="mb-16">
                        <div className='space-y-2 my-2'>
                            <OutlinedInput fullWidth placeholder="Phone number"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                }}
                            />
                            <OutlinedInput fullWidth placeholder="Password"
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
                    <div>
                        <GradientButton
                            onClick={() => {
                                history.push("/doctor-auth")
                            }}
                            varient={"primary"}
                            isFullWidth={true}
                        >
                            <div className="text-base flex space-x-1">
                                <div>
                                    I'm A Doctor
                                </div>
                                <div>
                                    <DoctorIcon />
                                </div>
                            </div>
                        </GradientButton>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    )
}