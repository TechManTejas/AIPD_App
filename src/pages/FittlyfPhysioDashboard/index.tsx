import { IonContent, IonPage } from "@ionic/react"
import { CardActionArea } from "@mui/material"
import { useState } from "react"
import { PatientsInfo } from "./PatientsInfo"
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import { Settings } from "./Settings"

export const FittlyfPhysioDashboard: React.FC = () => {

    const [value, setValue] = useState(0);

    const selectedTab: { [key: number]: JSX.Element } = {
        0: <PatientsInfo />,
        1: <Settings/>,
    };

    return (
        <>
            <IonPage>
                <IonContent fullscreen>
                    <div className='bg-white flex flex-col flex-grow p-2 h-full'>
                        {selectedTab[value]}
                    </div>
                    <div className='flex border-t border border-b z-50 bg-white w-full fixed bottom-0 text-base'>
                        <CardActionArea onClick={() => setValue(0)}>
                            <div className={`text-xs flex flex-col items-center p-1 py-1.5 ${(value === 0) ? 'text-green-600' : 'opacity-50 text-gray-500'}`}>
                                <BarChartIcon />
                                Patients Info
                            </div>
                        </CardActionArea>
                        <CardActionArea onClick={() => setValue(1)}>
                            <div className={`text-xs flex flex-col items-center p-1 py-1.5 ${(value === 2) ? 'text-green-600' : 'opacity-50 text-gray-500'}`}>
                                <SettingsIcon />
                                Settings
                            </div>
                        </CardActionArea>
                    </div>
                </IonContent>
            </IonPage>
        </>
    )
}