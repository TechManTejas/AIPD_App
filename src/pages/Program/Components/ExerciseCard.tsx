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

    // console.log(completed)

    return (
        <Link to="/demo-video">
            <CardActionArea>
                <div
                    className="m-1.5 rounded-lg relative mt-8"
                    style={{
                        boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 5px"
                    }}
                >
                    {(completed) &&
                        <div className="absolute top-2 right-2 z-10 text-white-600">
                            <CheckCircleIcon fontSize="large" sx = {{color : "green"}} />
                        </div>
                    }
                    <div className={`p-1 ${(completed) ? 'bg-green-50' : ''}`}>
                        <div className={`p-1 ${(completed) ? 'opacity-50' : ''} m-1`}>
                            <img className="rounded-lg w-[180px] h-[180px] object-cover -mt-8" src={image} style={{
                                boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 5px 5px"
                            }}/>
                        </div>
                        <div className="border-t border-green-600 mx-3"></div>
                        <div className={` ${completed ? "" : ""} text-center p-1 text-md font-roboto text-black `}>
                            {text}
                        </div>
                    </div>
                    
                </div>
            </CardActionArea>
        </Link>
    )
}