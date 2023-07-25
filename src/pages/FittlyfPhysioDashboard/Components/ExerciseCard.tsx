import { CardActionArea, Paper } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from "react-router-dom";
import { Carousel } from "antd";

interface ExerciseCardProps {
    completed?: number
    image?: string
    coverImage?: string
    text?: string
}

const contentStyle: React.CSSProperties = {
    margin: 0,
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
    completed,
    image = "exercise_image.webp",
    coverImage = "exercise_image.webp",
    text = "Exercise Name",
}) => {

    // const ExerciseMap = ["Pendulum stretch", "Towel stretch" , "Finger walk" , "Cross-body reach", "Armpit stretch", ""]

    // console.log(dateSelected)
    // console.log(completedExercise)'

    return (
            <CardActionArea
                onClick={()=>{
                    if(completed){
                        localStorage.setItem('review-exercise-record', completed.toString())
                        window.location.href = '/review'
                        console.log(completed)
                    }
                }}
            >
                <div
                    className="m-1.5 rounded-lg relative mt-8"
                    style={{
                        boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 5px"
                    }}
                >

                    <div className={`p-1 ${(completed) ? 'bg-green-100' : ''}`}>
                        <div className={`p-1  m-1`}>
                            {(completed !== 0) &&
                                <div className="absolute -top-8 right-2 z-10 text-white-600 bg-white rounded-full">
                                    <CheckCircleIcon fontSize="large" sx={{ color: "green" }} />
                                </div>
                            }
                            <Carousel>
                                <img className={`rounded-lg object-cover -mt-8 ${(completed) ? '' : ''}`} src={image} style={{
                                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 5px 5px"
                                }} />
                                <img className={`rounded-lg object-cover -mt-8   ${(completed) ? '' : ''}`} src={coverImage} style={{
                                    boxShadow: "rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 5px 5px"
                                }} />
                            </Carousel>

                        </div>
                        <div className="border-t border-green-600 mx-3"></div>
                        <div className={` ${completed ? "" : ""} text-center p-1 text-md font-roboto text-black `}>
                            {text}
                        </div>
                    </div>

                </div>
            </CardActionArea>
    )
}

