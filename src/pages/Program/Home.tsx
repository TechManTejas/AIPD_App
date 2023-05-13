import { Box, styled, Tab, Tabs } from "@mui/material"
import { useEffect, useState } from "react"
import { ExerciseCard } from "./Components/ExerciseCard"
import AIPDLogoName from "../../Images/aipdlogoname.png"
import axios from "axios"
import mesh from "../../Images/mesh-113.png"
import { PerviousDate } from "../../utils/DateTime"

interface ExerciseNames {
    [key: number]: string;
}

export const Home: React.FC = () => {

    const [value, setValue] = useState<number>(6);
    const [exerciseDetails, setExerciseDetails] = useState([])

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    const StyledTabs = styled((props: any) => (
        <Tabs
            {...props}
            TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
        />
    ))({
        '& .MuiTabs-indicator': {
            display: 'flex',
        },
        '& .MuiTabs-indicatorSpan': {
            width: '100%',
            backgroundColor: '#008000',
        },
    });

    const StyledTab = styled((props: any) => <Tab disableRipple {...props} />)(
        ({ theme }) => ({
            fontSize: theme.typography.pxToRem(15),
            '&.Mui-selected': {
                color: '#008000',
            },
        }),
    );

    useEffect(() => {
        axios.get("/patient/",
            {
                headers: {
                    'Authorization': `Token ${localStorage.getItem("aipd-patient-access-token")}`
                },
            }).then((data: any) => {
                setExerciseDetails(data.data[0]['condition']['exercises'])
                console.log(data.data[0]['condition']['exercises'])
            });
    }, [])

    const exerciseNames: ExerciseNames = {
        0: "PendulumStraight",
        1: "PendulumSideways",
        2: "ElbowCurl"
    }

    return (
        <div className="space-y-4">
            <img className="absolute h-full" src={mesh}></img>
            <div className="relative z-10">
                <div className="sticky top-0 z-20 bg-slate-50 p-2">
                    <Box display="flex" justifyContent="center" width="100%">
                        <StyledTabs
                            selectionFollowsFocus
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                        >

                            <StyledTab label={PerviousDate(6)} />
                            <StyledTab label={PerviousDate(5)} />
                            <StyledTab label={PerviousDate(4)} />
                            <StyledTab label={PerviousDate(3)} />
                            <StyledTab label={PerviousDate(2)} />
                            <StyledTab label={PerviousDate(1)} />
                            <StyledTab label="Today" />
                            <StyledTab label={PerviousDate(-1)} />
                            <StyledTab label={PerviousDate(-2)} />
                            <StyledTab label={PerviousDate(-3)} />
                            <StyledTab label={PerviousDate(-4)} />
                            <StyledTab label={PerviousDate(-5)} />
                            <StyledTab label={PerviousDate(-6)} />
                        </StyledTabs>
                    </Box>
                </div>
                <div className="m-12 bg-white p-6">
                    <img src={AIPDLogoName} />
                </div>
                <div>
                    <div className="border-2 rounded border-green-600 m-2 bg-green-50">
                        <div className="bg-green-500 h-2 w-[50%]" style={{
                            backgroundImage: "linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))"
                        }} />
                    </div>
                </div>
                <div className="h-80 grid grid-cols-2 overflow-auto">
                    {
                        exerciseDetails.map((exercise, index: number) => {
                            return (
                                <div key={(exercise as { id: number }).id} onClick={() => {
                                    localStorage.setItem("exercise", exerciseNames[index])
                                }}>
                                    <ExerciseCard
                                        image={(exercise as { image: string }).image}
                                        text={(exercise as { name: string }).name}
                                    />
                                </div>
                            )
                        })
                    }
                    {/* <ExerciseCard image="exercise2_new_webp.webp" text="Upper trapezius to levator scapulae s..." />
                <ExerciseCard image="exercise3_new_webp.webp" text="Scapular protraction/retraction " />
                <ExerciseCard image="exercise4_new_webp.webp" text="Upper trunk rotation AROM, arms cros..." />
                <ExerciseCard image="exercise5_new_webp.webp" text="Cervical/thoracic rotation AROM, rot..." />
                <ExerciseCard image="exercise6_new_webp.webp" text="Rhomboids/middle trapezius stretch, ..." />
                <ExerciseCard image="exercise7_new_webp.webp" text="Pectoralis stretch, middle fibers arm ..." /> */}
                </div>
            </div>

        </div>
    )
}