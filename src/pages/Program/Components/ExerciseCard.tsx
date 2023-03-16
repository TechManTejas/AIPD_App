import { CardActionArea, Paper } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ExerciseCardProps {
    completed?: boolean
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
    completed = false
}) => {
    return (
        <CardActionArea>
            <Paper className="m-1.5">
                {(completed) &&
                    <div className="absolute right-3 z-10 text-green-600">
                        <CheckCircleIcon />
                    </div>
                }
                
                <div className={`p-1 ${(completed)? 'bg-green-50' : ''}`}>
                    <div className={`${(completed) ? 'opacity-50' : ''}`}>
                        <img className="rounded-md" src="exercise_image.webp" />
                    </div>
                    <div className="text-lg font-semibold">
                        <div>
                            Exercise 1 Name
                        </div>
                        <div>
                            (vernacular)
                        </div>
                    </div>
                </div>
            </Paper>
        </CardActionArea>
    )
}