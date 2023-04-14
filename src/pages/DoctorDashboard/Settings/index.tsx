import GradientButton from "../../../components/GradientButton";
import AIPDLogoName from "../../../Images/aipdlogoname.png"
export const Settings: React.FC = () => {

    return (
        <div className="pb-16">
            <div className="m-2">
                <img src={AIPDLogoName} />
            </div>
            <div className='space-y-4 my-4'>
                <div className='space-y-4 text-end'>
                    version: 1.0.0
                </div>
                <GradientButton
                    onClick={()=>{

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