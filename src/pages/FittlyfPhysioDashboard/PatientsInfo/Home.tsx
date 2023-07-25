import { useEffect, useState } from "react";
import { ExerciseCard } from "../Components/ExerciseCard";
import AIPDLogoName from "../../Images/aipdlogoname.png";
import axios from "axios";
import { PerviousDate } from "../../../utils/DateTime";
import { message } from "antd";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useHistory } from "react-router-dom";


// * The Types of Exercise

export const Home: React.FC = () => {
  // * value => the index of the dates present in the top scroll bar
  const [value, setValue] = useState<number>(0);

  const history = useHistory()

  // * The Exercise that needs to be done by the patients logined
  // ^ id => the id of the exercise, name => name of the exercise, image => url of the image of the exercise
  const [exerciseDetails, setExerciseDetails] = useState<{ id: number, name: string, image: string, cover_image : string, sets: number }[]>([]);
  // * The Array of Exercise that are completed by the patient
  const [completedExercise, setCompletedExercise] = useState<any>([]);
  const [individualSetReps, setIndivisualSetsReps] = useState<{ id: number, patient: number, exercise: number, sets: number, reps: number }[]>([])
  const [logo, setlogo] = useState<string>()

  useEffect(() => {

    axios.get("/patient_exercise/", {
      params:{
        patient_id:localStorage.getItem('selected-review-patient')
      },
      headers: {
        Authorization: `Token ${localStorage.getItem(
          "aipd-fittlyf-physio-access-token"
        )}`,
      },
    }).then((data: any) => {
      console.log(data)
      setIndivisualSetsReps(data.data)
      localStorage.setItem("individualSetReps", JSON.stringify(data.data))
    }).catch((e) => {
      message.error(e.toString())
    })
  }, [])


  // * function to check whether the date selected is present in the data fetch in above state
  const checkdate = (dateObj: any) => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return ((parseInt(dateObj.date.split("-")[1]) === parseInt(PerviousDate(value).split("/")[0])) && parseInt(dateObj.date.split("-")[2]) === parseInt(PerviousDate(value).split("/")[1]))
    } else {
      return ((parseInt(dateObj.date.split("-")[1]) === parseInt(PerviousDate(value).split("/")[1])) && parseInt(dateObj.date.split("-")[2]) === parseInt(PerviousDate(value).split("/")[0]))
    }
  }

  // * an axios post to fetch the completed exercise, reloads whenever the value (state) changes
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.onload = function () {
        console.log("loaded")
        var text = "This text will be spoken on load.";
        var utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = speechSynthesis.getVoices()[0];
        utterance.volume = 1;
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
      };
    }
    axios.get("/exercise_record/", {
      params:{
        patient_id:localStorage.getItem('selected-review-patient')
      },
      headers: {
        Authorization: `Token ${localStorage.getItem(
          "aipd-fittlyf-physio-access-token"
        )}`,
      },
    }).then((data: any) => {
      console.log(data)
      const todaysExercise = data.data.filter(checkdate)
      // * extracts the index of the done exercise

      // dispatch(loginAction.addExerciseDetails({ ExerciseDetails: todaysExercise.map((e: any) => { return e.exercise }) }))
      // dispatch(Action.updateCompletedExercise({ completedExercise: todaysExercise.map((e: any) => { return e.exercise }) }))
      setCompletedExercise(todaysExercise.map((e: any) => { return e }))
    }).catch((e) => {
      message.error(e.toString())
    })
  }, [value])

  // useEffect(() => {
  //   console.log(exerciseDetails)
  // }, [exerciseDetails])

  localStorage.setItem("allexercise", "0")

  const Handle$Start$All$Exercise = () => {

    localStorage.setItem("allexercise", "1")
    localStorage.setItem("Allexerciseid", "0")

    localStorage.setItem(
      "exercise",
      exerciseDetails[Number(localStorage.getItem("Allexerciseid") || "0")].name
    );
    const entry = findEntryByExercise(individualSetReps, Number(exerciseDetails[Number(localStorage.getItem("Allexerciseid") || "0")].id))

    console.log(entry)

    localStorage.setItem(
      "exerciseID",
      exerciseDetails[Number(localStorage.getItem("Allexerciseid") || "0")].id.toString()
    );

    localStorage.setItem(
      "sets",
      entry ? entry.sets.toString() : "",
    );
    localStorage.setItem(
      "reps",
      entry ? entry.reps.toString() : "",
    );

    history.push("/camera-rendering");


  }

  // * to get the exercise that needs to be done by the patient
  useEffect(() => {
    axios.get("/patient/", {
      params:{
        patient_id:localStorage.getItem('selected-review-patient')
      },
      headers: {
        Authorization: `Token ${localStorage.getItem(
          "aipd-fittlyf-physio-access-token"
        )}`,
      },
    })
      .then((data: any) => {
        console.log(data)
        setlogo(data.data[0].doctor.company.logo)
        localStorage.setItem("exerciseDetails", JSON.stringify(data.data[0]["condition"]["exercises"]))
        setExerciseDetails(data.data[0]["condition"]["exercises"]);
        localStorage.setItem("patient-ID", data.data[0].id)
      }).catch(() => {
        console.log("error")
      });
  }, []);

  // * initial scroll for todays date
  // document.getElementById("scroll-top")?.scrollBy(-208, 0)

  interface DataEntry {
    id: number;
    patient: number;
    exercise: number;
    sets: number;
    reps: number;
  }

  function findEntryByExercise(data: DataEntry[], exercise: number): DataEntry | null {
    const entry = data.find((entry) => entry.exercise === exercise);
    return entry || null;
  }

  return (
    <div>
      <div className="">
        <div className="sticky top-0 z-20 p-2">
          <div className="overflow-hidden">
            <div id="scroll-top" className="flex overflow-auto">
              <section
                className="w-screen flex justify-evenly items-center text-xl"
              >
                <ArrowLeftIcon onClick={() => setValue(value - 1)} className="text-green-500" sx={{ fontSize: "50px" }} />
                <p>{value == 0 ? "TODAY" : PerviousDate(value)}</p>
                <ArrowRightIcon onClick={() => setValue(value + 1)} className="text-green-500" sx={{ fontSize: "50px" }} />
              </section>
              {/* {Array.from({ length: 13 }, (_, index) => index - 6).map(
                (val) => {
                  return (
                    <section
                      onLoad={() => console.log("loaded")}
                      id={val.toString()}
                      onClick={() => {
                        setValue(val);
                      }}
                      style = {{minWidth : "65px"}}
                      className={`text-center p-2 ${value === val ? "border-b-2 border-green-500" : ""
                        }`}
                    >
                      {val == 0 ? "TODAY" : PerviousDate(val)}
                    </section>
                  );
                }
              )} */}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <img className="p-6" src={logo}></img>
        <p className="text-right p-4">Powered by Fittlyf</p>
      </div>
      <div className={`${value === 0 ? "pointer-events-auto" : "pointer-events-none"} overflow-auto`}>
        {exerciseDetails.map((exercise) => {
          const entry = findEntryByExercise(individualSetReps, exercise.id)
          return (
            <div
              key={(exercise as { id: number }).id}
              onClick={() => {
                localStorage.setItem(
                  "sets",
                  entry ? entry.sets.toString() : "",
                );
                localStorage.setItem(
                  "reps",
                  entry ? entry.reps.toString() : "",
                );
                localStorage.setItem(
                  "exercise",
                  exercise.name.toString()
                );
                localStorage.setItem(
                  "exerciseID",
                  exercise.id.toString()
                );

                localStorage.setItem("allexercise", "0")
              }}
            >
              <ExerciseCard
                completed={completedExercise.indexOf(exercise) !== -1 ? exercise.id : 0}
                image={exercise.image}
                coverImage = {exercise.cover_image}
                text={(exercise as { name: string }).name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
