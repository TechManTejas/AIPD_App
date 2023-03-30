import { IonContent, IonPage } from "@ionic/react"
import { OutlinedInput, Tab } from "@mui/material"
import { useState } from "react"
import GradientButton from "../../components/GradientButton"
import { SlidingTabs } from "../../components/Tabs"
import FactCheckIcon from '@mui/icons-material/FactCheck';
import EmailIcon from '@mui/icons-material/Email';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import { DoctorPatientsInfo } from "../DoctorPatientsInnfo"
import { DoctorCreatePatient } from "../DoctorCreatePatient"

export const DoctorDashboard: React.FC = () => {

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const selectedTab: { [key: number]: JSX.Element } = {
        0: <DoctorPatientsInfo />,
        1: <DoctorCreatePatient />
    };

    return (
        <>
            <IonPage>
                <IonContent fullscreen>
                    <div className='bg-white flex flex-col flex-grow p-2 h-full'>
                        <div className='sticky top-2'>
                            <SlidingTabs>
                                <Tab
                                    onClick={() => { setValue(0) }}
                                    label="Patients' Info"
                                    style={{
                                        "zIndex": 1,
                                        "WebkitBoxPack": "center",
                                        "justifyContent": "center",
                                        "boxSizing": "border-box",
                                        "WebkitTapHighlightColor": "transparent",
                                        "backgroundColor": "transparent",
                                        "outline": "0px",
                                        "border": "0px",
                                        "margin": "0px",
                                        "cursor": "pointer",
                                        "userSelect": "none",
                                        "verticalAlign": "middle",
                                        "appearance": "none",
                                        "textDecoration": "none",
                                        "fontFamily": "Roboto, Helvetica, Arial, sans-serif",
                                        "letterSpacing": "0.02857em",
                                        "position": "relative",
                                        "overflow": "hidden",
                                        "whiteSpace": "normal",
                                        "display": "flex",
                                        "WebkitBoxAlign": "center",
                                        "alignItems": "center",
                                        "flexDirection": "row",
                                        "flex": "1 1 auto",
                                        "textAlign": "center",
                                        "fontSize": "1rem",
                                        "fontWeight": "400",
                                        "textTransform": "none",
                                        "lineHeight": "inherit",
                                        "padding": "0.25rem",
                                        "borderRadius": "0.5rem",
                                        "maxWidth": "unset",
                                        "minWidth": "unset",
                                        "minHeight": "unset",
                                        "color": (value === 0) ? "rgb(255, 255, 255)" : "rgb(52, 71, 103)",
                                        "opacity": "1",
                                        "transition": "all 0.5s"
                                    }}
                                    icon={<UpcomingIcon style={{ "userSelect": "none", "width": "1em", "height": "1em", "overflow": "hidden", "display": "inline-block", "textAlign": "center", "flexShrink": "0", "marginTop": "-2px", "fontSize": "1.25rem" }} />}
                                    iconPosition="start"
                                />
                                <Tab
                                    onClick={() => { setValue(1) }}
                                    value={1}
                                    label="New Patient"
                                    style={{
                                        "zIndex": 1,
                                        "WebkitBoxPack": "center",
                                        "justifyContent": "center",
                                        "boxSizing": "border-box",
                                        "WebkitTapHighlightColor": "transparent",
                                        "backgroundColor": "transparent",
                                        "outline": "0px",
                                        "border": "0px",
                                        "margin": "0px",
                                        "cursor": "pointer",
                                        "userSelect": "none",
                                        "verticalAlign": "middle",
                                        "appearance": "none",
                                        "textDecoration": "none",
                                        "fontFamily": "Roboto, Helvetica, Arial, sans-serif",
                                        "letterSpacing": "0.02857em",
                                        "position": "relative",
                                        "overflow": "hidden",
                                        "whiteSpace": "normal",
                                        "display": "flex",
                                        "WebkitBoxAlign": "center",
                                        "alignItems": "center",
                                        "flexDirection": "row",
                                        "flex": "1 1 auto",
                                        "textAlign": "center",
                                        "fontSize": "1rem",
                                        "fontWeight": "400",
                                        "textTransform": "none",
                                        "lineHeight": "inherit",
                                        "borderRadius": "0.5rem",
                                        "maxWidth": "unset",
                                        "minWidth": "unset",
                                        "minHeight": "unset",
                                        "color": (value === 1) ? "rgb(255, 255, 255)" : "rgb(52, 71, 103)",
                                        "opacity": "1",
                                        "transition": "all 0.5s"
                                    }}
                                    icon={<FactCheckIcon style={{ "userSelect": "none", "width": "1em", "height": "1em", "overflow": "hidden", "display": "inline-block", "textAlign": "center", "flexShrink": "0", "marginTop": "-2px", "fontSize": "1.25rem" }} />}
                                    iconPosition="start"
                                />
                            </SlidingTabs>
                        </div>
                        <div>
                            {
                                selectedTab[value]
                            }
                        </div>
                    </div>
                </IonContent>
            </IonPage>
        </>
    )
}