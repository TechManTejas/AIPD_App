import { IonContent, IonPage } from '@ionic/react';
import { CardActionArea, Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from "axios"
import React, { useEffect, useState } from 'react';
import GradientButton from '../../../components/GradientButton';


export const FittlyfDemoVideo: React.FC = () => {

    const [exerciseData, setExerciseData] = useState<any>()
    const [comment, setComment] = useState<string>("");
    const [approved, setApproved] = useState<boolean>(true);

    useEffect(() => {
        axios.get("/exercise_record/", {
            params: {
                exercise_record_id: localStorage.getItem('review-exercise-record')
            },
            headers: {
                Authorization: `Token ${localStorage.getItem(
                    "aipd-fittlyf-physio-access-token"
                )}`,
            },
        }).then((data: any) => {
            console.log(JSON.stringify(data.data))
            setExerciseData(data.data[0])
        }).catch((e) => console.log(e))

    }, [])

    const handleReviewSubmit = () => {
        // Implement the logic to submit the review
        const reviewData = {
            commment: comment,
            review: approved
            // Add other review-related data if needed
        };

        // Send the PATCH request
        axios.patch(`/exercise_record_redundant/${localStorage.getItem('review-exercise-record')}/`, reviewData, {
            headers: {
                Authorization: `Token ${localStorage.getItem("aipd-fittlyf-physio-access-token")}`,
            },
        })
        .then((response) => {
            console.log("Review Data:", response.data);
            // You can handle the response data or show a success message here
        })
        .catch((error) => {
            console.error("Error updating exercise record:", error);
            // You can handle errors here or show an error message to the user
        });
    };


    return (
        <IonPage>
            <IonContent fullscreen>
                {
                    exerciseData === undefined ? <></> : <>
                        <div className='bg-white flex flex-col flex-grow pb-16'>
                            <div className='flex justify-center bg-red-600'>
                                <iframe
                                    className=''
                                    src={exerciseData.video}
                                    title="YouTube video player"
                                    width="100%"
                                    height="300"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            <div className="border-2 border-x-0 border-black p-2">
                                <div className='flex space-x-2 items-center'>
                                    <div className="text-xl font-semibold">
                                        ID: {exerciseData.id}
                                    </div>
                                    <div className="text-xl font-semibold">
                                        Date: {exerciseData.date}
                                    </div>
                                </div>
                            </div>

                            <div className="p-2">
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: approved ? "green" : "red" }}
                                    onClick={() => setApproved(!approved)}
                                >
                                    {approved ? "Approved" : "Not Approved"}
                                </Button>
                            </div>

                            <div className="p-2" style={{ width: "100%" }}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Comment"
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    fullWidth  // Add fullWidth prop to ensure the TextField takes full width
                                />
                            </div>

                            <div className="p-2">
                                <GradientButton
                                    onClick={handleReviewSubmit}
                                    varient={"primary"}
                                    isFullWidth={true}
                                >
                                    <div className="text-base flex space-x-1">
                                        <div>
                                            Submit Review
                                        </div>
                                    </div>
                                </GradientButton>
                            </div>
                        </div>
                    </>
                }

            </IonContent>
        </IonPage>
    )
}