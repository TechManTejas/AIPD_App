import GradientButton from "../../../components/GradientButton";
import { GlobalDataState } from "../../../Context/global";
import AIPDLogoName from "../../../Images/aipdlogoname.png"

export const Settings: React.FC = () => {

    const { setAuthenticated } = GlobalDataState()

    return (
        <div className="pb-16">
            <div className="m-2 flex justify-center">
                <img src={AIPDLogoName} />
            </div>
            <div className='space-y-4 my-4'>
                <div className='space-y-4 text-end'>
                    version: 1.0.0
                </div>
                <GradientButton
                    onClick={()=>{
                        localStorage.removeItem("aipd-doctor-access-token")
                        setAuthenticated(false)
                        window.location.href = "/";
                    }}
                    varient={"primary"}
                    isFullWidth={false}
                >
                    <div className="text-base">
                        Logout
                    </div>
                </GradientButton>
            </div>
        </div>
    )
}