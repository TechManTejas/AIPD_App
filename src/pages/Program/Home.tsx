import { useEffect, useState } from "react";
import { ExerciseCard } from "./Components/ExerciseCard";
import AIPDLogoName from "../../Images/aipdlogoname.png";
import axios from "axios";
import { PerviousDate } from "../../utils/DateTime";
import { message } from "antd";
import { useDispatch } from "react-redux";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useHistory } from "react-router-dom";
// * The Types of Exercise

declare namespace TTS {
    interface IOptions {
        /** text to speak */
        text: string;
        /** cancel, boolean: true/false */
        identifier: string;
        /** voice identifier (iOS / Android) from getVoices */
        locale?: string;
        /** speed rate, 0 ~ 1 */
        rate?: number;
        /** pitch, 0 ~ 1 */
        pitch?: number;
        /** cancel, boolean: true/false */
        cancel?: boolean;
        /** iOS ONLY: a voice URI (DEPRECATED, use identifier) **/
        voiceURI?: string;
    }
    interface TTSVoice {
        /** Voice name */
        name: string;
        /** Language **/
        language: string;
        /** identifier string */
        identifier: string;
    }

    function speak(options: IOptions): Promise<void>;
    function speak(text: string): Promise<void>;
    function stop(): Promise<void>;
    function checkLanguage(): Promise<string>;
    function openInstallTts(): Promise<void>;
    function getVoices(): Promise<TTSVoice[]>;
}

export const Home: React.FC = () => {
  // * value => the index of the dates present in the top scroll bar
  const [value, setValue] = useState<number>(0);

  const history = useHistory()

  // * The Exercise that needs to be done by the patients logined
  // ^ id => the id of the exercise, name => name of the exercise, image => url of the image of the exercise
  const [exerciseDetails, setExerciseDetails] = useState<{ id: number, name: string, image: string; sets: number }[]>([]);
  // * The Array of Exercise that are completed by the patient
  const [completedExercise, setCompletedExercise] = useState<number[]>([]);
  const [individualSetReps, setIndivisualSetsReps] = useState<{ id: number, patient: number, exercise: number, sets: number, reps: number }[]>([])

  const speak = () => {
    document.addEventListener('deviceready', function () {
      console.log("running")
      TTS.speak('hello, world!').then(function () {
        alert('success');
      }, function (reason: any) {
        alert(reason);
      });

      // or with more options
      TTS
        .speak({
          text: 'Hi I\'m Siri!',
          identifier: 'com.apple.ttsbundle.Samantha-compact',
          rate: 0.75,
          pitch: 0.9,
          cancel: true
        }).then(function () {
          alert('success');
        }, function (reason : any) {
          alert(reason);
        });
      // or with more options
      TTS
        .getVoices().then(function (voices : any) {
          // Array of voices [{name:'', identifier: '', language: ''},..] see TS-declarations
        }, function (reason : any) {
          alert(reason);
        });
    }, false);
  }

  useEffect(() => {

    axios.get("/patient_exercise/", {
      headers: {
        Authorization: `Token ${localStorage.getItem(
          "aipd-patient-access-token"
        )}`,
      },
    }).then((data: any) => {
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
    speak()
    axios.get("/exercise_record/", {
      headers: {
        Authorization: `Token ${localStorage.getItem(
          "aipd-patient-access-token"
        )}`,
      },
    }).then((data: any) => {
      const todaysExercise = data.data.filter(checkdate)
      // * extracts the index of the done exercise

      // dispatch(loginAction.addExerciseDetails({ ExerciseDetails: todaysExercise.map((e: any) => { return e.exercise }) }))
      // dispatch(Action.updateCompletedExercise({ completedExercise: todaysExercise.map((e: any) => { return e.exercise }) }))
      setCompletedExercise(todaysExercise.map((e: any) => { return e.exercise }))
    }).catch((e) => {
      message.error(e.toString())
    })
  }, [value])

  useEffect(() => {
    console.log(exerciseDetails)
  }, [exerciseDetails])

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
      headers: {
        Authorization: `Token ${localStorage.getItem(
          "aipd-patient-access-token"
        )}`,
      },
    })
      .then((data: any) => {
        localStorage.setItem("exerciseDetails", JSON.stringify(data.data[0]["condition"]["exercises"]))
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
      <div>
        <img className="p-6" src={AIPDLogoName}></img>
      </div>
      <div className="flex justify-center">
        <button onClick={() => Handle$Start$All$Exercise()} className="bg-green-500 px-5 py-2 rounded">Start Exercise</button>
      </div>
      <div className={`${value === 0 ? "pointer-events-auto" : "pointer-events-none"}  grid grid-cols-2 overflow-auto`}>
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
