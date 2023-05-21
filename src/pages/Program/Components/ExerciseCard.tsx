import { CardActionArea, Paper } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from "react-router-dom";

interface ExerciseCardProps {
    completed?: boolean
    image?: string
    text?: string
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
    completed,
    image = "exercise_image.webp",
    text = "Exercise Name",
}) => {

    // const ExerciseMap = ["Pendulum stretch", "Towel stretch" , "Finger walk" , "Cross-body reach", "Armpit stretch", ""]

    // console.log(dateSelected)
    // console.log(completedExercise)'

    console.log(completed)

    return (
        <Link to="/demo-video">
            <CardActionArea>
                <div className="m-1.5 rounded bg-[#333333]" style={{
                    boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 3px"
                }}>
                    {(completed) &&
                        <div className="absolute top-2 right-2 z-10 text-green-600">
                            <CheckCircleIcon />
                        </div>
                    }

                    <div className={`p-1 ${(completed) ? 'bg-green-50' : ''}`}>
                        <div className={`p-1 ${(completed) ? 'opacity-50' : ''}`}>
                            <img className="rounded w-[180px] h-[180px] object-cover" src={image} />
                        </div>
                        <div className="text-white text-center p-1 text-md font-robotomedium">
                            {text}
                        </div>
                    </div>
                </div>
            </CardActionArea>
        </Link>
    )
}