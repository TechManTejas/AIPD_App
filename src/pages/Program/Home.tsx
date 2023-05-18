import { Box, styled, Tab, Tabs } from "@mui/material"
import { useEffect, useState, useRef } from "react"
import { ExerciseCard } from "./Components/ExerciseCard"
import AIPDLogoName from "../../Images/aipdlogoname.png"
import axios from "axios"
import { PerviousDate } from "../../utils/DateTime"

interface ExerciseNames {
    [key: number]: string;
}

export const Home: React.FC = () => {

    const w = window.innerWidth
    const [value, setValue] = useState<number>(0);
    const [exerciseDetails, setExerciseDetails] = useState([])

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };


    useEffect(() => {


        document.getElementById("scroll-top")?.scrollBy(-1000, 0)
        if ([-6, -5, -4].includes(value)) {

        }
        else if ([4, 5, 6].includes(value)) {
            document.getElementById("scroll-top")?.scrollBy(1000, 0)
        }
        else if (value == -3)
            document.getElementById("scroll-top")?.scrollBy(30, 0)
        else if (value == -2)
            document.getElementById("scroll-top")?.scrollBy(90, 0)
        else if (value == -1)
            document.getElementById("scroll-top")?.scrollBy(150, 0)
        else if (value == 0)
            document.getElementById("scroll-top")?.scrollBy(220, 0)
        else if (value == 1)
            document.getElementById("scroll-top")?.scrollBy(290, 0)
        else if (value == 2)
            document.getElementById("scroll-top")?.scrollBy(350, 0)
        else if (value == 3)
            document.getElementById("scroll-top")?.scrollBy(410, 0)

    }, [value])

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

    document.getElementById("scroll-top")?.scrollBy(-1000, 0)
    document.getElementById("scroll-top")?.scrollBy(220, 0)

    return (
        <div className="space-y-4">
            <div className="">
                <div className="sticky top-0 z-20 bg-slate-50 p-2">
                    {/* <Box display="flex" justifyContent="center" width="100%">
                        <StyledTabs
                            selectionFollowsFocus
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            className = "snap-center"
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
                    </Box> */}
                    {/* <Pagination itemRender={itemRender} total={50} />
                     */}
                    {/* <Pagination/> */}
                    <div className="overflow-hidden">
                        <div id="scroll-top" className="flex overflow-auto gap-3">
                            {
                                Array.from({ length: 13 }, (_, index) => index - 6).map((val) => {
                                    return <section id={val.toString()} onClick={() => { setValue(val) }} className={`w-70 p-2 ${value === val ? "border-b-2 border-green-500" : ""}`} >{val == 0 ? "TODAY" : PerviousDate(val)}</section>
                                })
                            }
                        </div>
                    </div>

                </div>
                <div className="m-3 bg-white p-6">
                    <img src={AIPDLogoName} />
                </div>
                <div>
                    <div className="border-2 rounded border-green-600 m-2 bg-green-50">
                        <div className="bg-green-500 h-2 w-[50%]" style={{
                            backgroundImage: "linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))"
                        }} />
                    </div>
                </div>
                <div id = "exercises-grid" className={`${value === 0 ? "pointer-events-auto" : "pointer-events-none"}  grid grid-cols-2 overflow-auto`}>
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