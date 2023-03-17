import { Box, styled, Tab, Tabs } from "@mui/material"
import { useState } from "react";
import { ExerciseCard } from "./Components/ExerciseCard"

export const Home:React.FC = () => {

    const [value, setValue] = useState<number>(3);

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    const StyledTabs = styled((props:any) => (
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

    const StyledTab = styled((props:any) => <Tab disableRipple {...props} />)(
        ({ theme }) => ({
            fontSize: theme.typography.pxToRem(15),
            '&.Mui-selected': {
                color: '#008000',
            },
        }),
    );

    return(
        <div className="space-y-4">
            <div className="sticky top-0 z-20 bg-slate-50 p-2">
                <Box display="flex" justifyContent="center" width="100%">
                    <StyledTabs
                        selectionFollowsFocus
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons="auto"
                    >
                        <StyledTab label="13/03" />
                        <StyledTab label="14/03" />
                        <StyledTab label="15/03" />
                        <StyledTab label="Today" />
                        <StyledTab label="17/03" />
                        <StyledTab label="18/03" />
                        <StyledTab label="19/03" />
                    </StyledTabs>
                </Box>
                
            </div>
            <div className="text-center text-2xl font-roboto">
                Product name and logo
            </div>
            <div>
                <div className="border-2 rounded border-green-600 m-2 bg-green-50">
                    <div className="bg-green-500 h-2 w-28" style={{
                        backgroundImage:"linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))"
                    }}/>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <ExerciseCard image="exercise1.jpg" text="Shoulder circles AROM, sitting" completed/>
                <ExerciseCard image="exercise2.jpg" text="Upper trapezius to levator scapulae s..."/>
                <ExerciseCard image="exercise3.jpg" text="Scapular protraction/retraction " />
                <ExerciseCard image="exercise4.jpg" text="Upper trunk rotation AROM, arms cros..." />
                <ExerciseCard image="exercise5.jpg" text="Cervical/thoracic rotation AROM, rot..." />
                <ExerciseCard image="exercise6.jpg" text="Rhomboids/middle trapezius stretch, ..." completed />
                <ExerciseCard image="exercise7.webp" text="Pectoralis stretch, middle fibers arm ..." />
                <ExerciseCard image="exercise8.jpg" text="Scapular retraction/ depression strength..." />
            </div>
        </div>
    )
}