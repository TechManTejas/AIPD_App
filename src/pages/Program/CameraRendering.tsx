import { IonContent, IonPage } from "@ionic/react";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import CameraPoseDetect from "./CameraComponent";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export const CameraRendering: React.FC = () => {
  const repref = useRef<HTMLDivElement>(null);
  const setref = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const [loading, setloading] = useState(true)

  const getDateWithFormat = () => {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, '0');
    var day = String(currentDate.getDate()).padStart(2, '0');
    var formattedDate = year + '-' + month + '-' + day;
    return formattedDate
  }


  const ExerciseId = () => {
    const exercise = localStorage.getItem("exercise")
    if(exercise === 'PendulumStraight'){
      return 1
    } else if (exercise === 'PendulumSideways'){
      return 2
    } else if (exercise === 'Butterfly'){
      return 8
    } else if (exercise === 'PendulumCircles') {
      return 6
    } else if (exercise === 'LyingArms') {
      return 7
    } else if (exercise === 'ArmsLock') {
      return 9
    }
  }

  

  const addExerciseDataToDatabase = () => {
    axios.post("/exercise_record/", {
      date: getDateWithFormat(),
      exercise: ExerciseId(),
      patient: 43
    }, {
      headers: {
        Authorization: `Token ${localStorage.getItem(
          "aipd-patient-access-token"
        )}`,
      }
    }).then(() => console.log("Data Added to Database")).catch((e) => console.error(e))
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        {
          loading &&
          <div className="w-screen h-screen absolute z-10 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <iframe className="w-screen" src="https://giphy.com/embed/4bjIKBOWUnVPICCzJc" allowFullScreen></iframe>
              <p className="bg-white w-screen text-center">Loading Exercise ... </p>
            </div>
          </div>
        }
        <div className="bg-white flex flex-col flex-grow pb-16">
          <div className="flex flex-col justify-between h-[calc(100vh-64px)]">
            <div className="p-1 absolute w-full top-0">
              <div className="border text-2xl bg-white font-semibold p-1 flex justify-around">
                <p ref={repref}></p>
                <p ref={messageRef}></p>
                <p ref={setref}></p>
              </div>
            </div>
            <div>
              <CameraPoseDetect setloading={setloading} repref={repref} setref={setref} messageRef={messageRef} />
            </div>
            {!loading && <div className="p-1 absolute w-full bottom-0">
              <Link to="/demo-video-logs">
                <CardActionArea>
                  <div onClick={addExerciseDataToDatabase} className="border bg-blue-600 text-white font-semibold p-1 text-center">
                    Done
                  </div>
                </CardActionArea>
              </Link>
            </div>}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
