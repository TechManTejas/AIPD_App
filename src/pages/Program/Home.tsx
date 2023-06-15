import { useEffect, useState} from "react";
import { ExerciseCard } from "./Components/ExerciseCard";
import AIPDLogoName from "../../Images/aipdlogoname.png";
import axios from "axios";
import { PerviousDate } from "../../utils/DateTime";
import { message } from "antd";
import { exerciseNames } from "../../utils/ExerciseUtils";

// * The Types of Exercise


export const Home: React.FC = () => {
  // * value => the index of the dates present in the top scroll bar
  const [value, setValue] = useState<number>(0);
  // * The Exercise that needs to be done by the patients logined
  // ^ id => the id of the exercise, name => name of the exercise, image => url of the image of the exercise
  const [exerciseDetails, setExerciseDetails] = useState<{ id: number, name: string, image: string; sets: number }[]>([]);
  // * The Array of Exercise that are completed by the patient
  const [completedExercise, setCompletedExercise] = useState<number[]>([]);
  const [individualSetReps, setIndivisualSetsReps] = useState<{id : number, patient : number, exercise : number, sets : number, reps : number}[]>([])

  useEffect(() => {
    axios.get("/patient_exercise/", {
      headers: {
        Authorization: `Token ${localStorage.getItem(
          "aipd-patient-access-token"
        )}`,
      },
    }).then((data: any) => {
      setIndivisualSetsReps(data.data)
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
    axios.get("/exercise_record/", {
      headers: {
        Authorization: `Token ${localStorage.getItem(
          "aipd-patient-access-token"
        )}`,
      },
    }).then((data: any) => {
      const todaysExercise = data.data.filter(checkdate)
      // * extracts the index of the done exercise
      setCompletedExercise(todaysExercise.map((e: any) => { return e.exercise }))
    }).catch((e) => {
      message.error(e.toString())
    })
  }, [value])

  // ^ for the top navbar scroll, reloads after the value (state) changes
  // ! is not 100% accurate needs perfection
  useEffect(() => {
    document.getElementById("scroll-top")?.scrollBy(-32 * 13, 0);
    if (![-6, -5, -4].includes(value)) {
      if ([4, 5, 6].includes(value)) {
        document.getElementById("scroll-top")?.scrollBy(32 * 14, 0);
      } else if (value == -3)
        document.getElementById("scroll-top")?.scrollBy(16 * 2, 0);
      else if (value == -2)
        document.getElementById("scroll-top")?.scrollBy(16 * 6, 0);
      else if (value == -1)
        document.getElementById("scroll-top")?.scrollBy(16 * 10, 0);
      else if (value == 0)
        document.getElementById("scroll-top")?.scrollBy(16 * 14, 0);
      else if (value == 1)
        document.getElementById("scroll-top")?.scrollBy(16 * 18, 0);
      else if (value == 2)
        document.getElementById("scroll-top")?.scrollBy(16 * 22, 0);
      else if (value == 3)
        document.getElementById("scroll-top")?.scrollBy(16 * 26, 0);
    }
  }, [value]);

  // * to get the exercise that needs to be done by the patient
  useEffect(() => {
    axios.get("/patient/", {
      headers: {
        Authorization: `Token ${localStorage.getItem(
          "aipd-patient-access-token"
        )}`,
      },
    })
      .then((data: any) => {
        setExerciseDetails(data.data[0]["condition"]["exercises"]);
        localStorage.setItem("patient-ID", data.data[0].id)
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
    <div onLoad={() => { document.getElementById("scroll-top")?.scrollBy(-1000, 0); document.getElementById("scroll-top")?.scrollBy(16 * 13 - 4, 0) }}>
      <div className="">
        <div className="sticky top-0 z-20 p-2">
          <div className="overflow-hidden">
            <div id="scroll-top" className="flex overflow-auto">
              {Array.from({ length: 13 }, (_, index) => index - 6).map(
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
              )}
            </div>
          </div>
        </div>
      </div>
      {/* <div>
        <img className="p-6" src={AIPDLogoName}></img>
      </div> */}
      <div className={`${value === 0 ? "pointer-events-auto" : "pointer-events-none"}  grid grid-cols-2 overflow-auto`}>
        {exerciseDetails.map((exercise) => {
          // console.log(.sets, exercise.id)
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
                  exerciseNames[(exercise as { id: number }).id]
                );
              }}
            >
              <ExerciseCard
                completed={completedExercise.indexOf(exercise.id) !== -1}
                image={exercise.image}
                text={(exercise as { name: string }).name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
