import { Paper } from "@mui/material"
import { ExerciseCard } from "./Components/ExerciseCard"

export const Home:React.FC = () => {
    return(
        <div className="space-y-4">
            <div className="justify-center items-center flex space-x-2 overflow-auto sticky top-0 z-20 bg-white p-2">
                <Paper className="p-2 px-4">
                    10/03
                </Paper>
                <Paper className="p-2 px-4">
                    12/03
                </Paper>
                <Paper className="p-2 px-4">
                    Today
                </Paper>
                <Paper className="p-2 px-4">
                    13/03
                </Paper>
                <Paper className="p-2 px-4">
                    14/03
                </Paper>
            </div>
            <div className="text-center text-2xl font-semibold">
                Product name and logo
            </div>
            <div>
                <div className="border-2 border-green-600  m-1">
                    <div className="bg-green-500 h-2 w-52">
                        
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2">
                <ExerciseCard completed/>
                <ExerciseCard />
                <ExerciseCard />
                <ExerciseCard />
                <ExerciseCard />
                <ExerciseCard />
                <ExerciseCard />
                <ExerciseCard />
            </div>
        </div>
    )
}