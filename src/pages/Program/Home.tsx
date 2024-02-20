import { useEffect, useState } from "react";
import { ExerciseCard } from "./Components/ExerciseCard";
import AIPDLogoName from "../../Images/aipdlogoname.png";
import axios from "axios";
import { PerviousDate } from "../../utils/DateTime";
import { message } from "antd";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useHistory } from "react-router-dom";
import { Modal } from "antd";
import { CardActionArea } from "@mui/material";

// * The Types of Exercise

export const Home: React.FC = () => {
  // * value => the index of the dates present in the top scroll bar
  const [value, setValue] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [google_business_name, set_google_business_name] = useState<string>('');
  const [google_business_review_link, set_google_business_review_link] = useState<string>('');

  // * The Exercise that needs to be done by the patients logined
  // ^ id => the id of the exercise, name => name of the exercise, image => url of the image of the exercise
  const [exerciseDetails, setExerciseDetails] = useState<{ id: number, name: string, image: string, cover_image: string, sets: number }[]>([]);
  // * The Array of Exercise that are completed by the patient
  const [completedExercise, setCompletedExercise] = useState<number[]>([]);
  const [individualSetReps, setIndivisualSetsReps] = useState<{ id: number, patient: number, exercise: number, sets: number, reps: number }[]>([])
  const [logo, setlogo] = useState<string>()

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

    window.location.href = "/camera-rendering";
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
        console.log(data.data)
        const currentDate = new Date().toLocaleDateString();

        // if (new Date(data.data[0]["prompt_review"]).toLocaleDateString() === currentDate) {
        //   set_google_business_review_link(data.data[0]['doctor']['company']['google_business_review_link'])
        //   set_google_business_name(data.data[0]['doctor']['company']['name'])
        //   showModal()
        //   localStorage.setItem("prompt_review", data.data[0]["prompt_review"])
        // }

        setlogo(data.data[0].doctor.company.logo)
        localStorage.setItem("exerciseDetails", JSON.stringify(data.data[0]["condition"]["exercises"]))
        setExerciseDetails(data.data[0]["condition"]["exercises"]);
        localStorage.setItem("patient-ID", data.data[0].id)
      }).catch(() => {
        console.log("error")
      });
  }, []);

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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };


  return (
    <div>
      <Modal
        title="Rate us"
        centered
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null} // You can customize the footer as needed
      >
        <div className="space-y-3">
          <div className="text-center text-xl">Rate
            <span className="text-purple-700">{' '}
              {google_business_name}
            </span>{' '}
            clinic on google</div>
          <CardActionArea onClick={() => {
            window.location.href = google_business_review_link
          }}>
            <div className="text-center bg-red-600 text-white p-3 rounded-md font-fredokaone text-xl">
              Rate
            </div>
          </CardActionArea>
        </div>
      </Modal>
      <div className="">
        <div className="sticky top-0 z-20 p-2">
          <div className="overflow-hidden">
            <div id="scroll-top" className="flex overflow-auto">
              <section
                className="w-screen flex justify-evenly items-center text-xl"
              >
                <ArrowLeftIcon onClick={() => setValue(value - 1)} className="text-green-500" sx={{ fontSize: "50px" }} />
                <p>{value === 0 ? "TODAY" : PerviousDate(value)}</p>
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
        <img className="p-6" src={logo} alt="Brand Logo"></img>
      </div>

      {/* <div className="flex justify-center m-3">
        <button onClick={() => {

          localStorage.setItem(
            "exercise",
            "NextGenTracking"
          );

          window.location.href = "/camera-rendering";

        }} className="bg-blue-500 text-white px-5 py-5 rounded-full border-2 border-black shadow-2xl">
          Next Gen Tracking (BETA)
        </button>
      </div>

      <div className="flex justify-center m-3">
        <button onClick={() => {

          localStorage.setItem(
            "exercise",
            "Arthritis1"
          );

          window.location.href = "/camera-rendering";

        }} className="bg-blue-500 text-white px-5 py-5 rounded-full border-2 border-black shadow-2xl">
          Arthritis Exercise 1
        </button>
      </div>

      <div className="flex justify-center m-3">
        <button onClick={() => {

          localStorage.setItem(
            "exercise",
            "Arthritis2"
          );

          window.location.href = "/camera-rendering";

        }} className="bg-blue-500 text-white px-5 py-5 rounded-full border-2 border-black shadow-2xl">
          Arthritis Exercise 2
        </button>
      </div>

      <div className="flex justify-center m-3">
        <button onClick={() => {

          localStorage.setItem(
            "exercise",
            "Arthritis3"
          );

          window.location.href = "/camera-rendering";

        }} className="bg-blue-500 text-white px-5 py-5 rounded-full border-2 border-black shadow-2xl">
          Arthritis Exercise 3
        </button>
      </div>

      <div className="flex justify-center m-3">
        <button onClick={() => {

          localStorage.setItem(
            "exercise",
            "Arthritis4"
          );

          window.location.href = "/camera-rendering";

        }} className="bg-blue-500 text-white px-5 py-5 rounded-full border-2 border-black shadow-2xl">
          Arthritis Exercise 4
        </button>
      </div>

      <div className="flex justify-center m-3">
        <button onClick={() => {

          localStorage.setItem(
            "exercise",
            "Arthritis5"
          );

          window.location.href = "/camera-rendering";

        }} className="bg-blue-500 text-white px-5 py-5 rounded-full border-2 border-black shadow-2xl">
          Arthritis Exercise 5
        </button>
      </div>

      <div className="flex justify-center m-3">
        <button onClick={() => {

          localStorage.setItem(
            "exercise",
            "Arthritis6"
          );

          window.location.href = "/camera-rendering";

        }} className="bg-blue-500 text-white px-5 py-5 rounded-full border-2 border-black shadow-2xl">
          Arthritis Exercise 6
        </button>
      </div>

      <div className="flex justify-center m-3">
        <button onClick={() => {

          localStorage.setItem(
            "exercise",
            "Arthritis7"
          );

          window.location.href = "/camera-rendering";

        }} className="bg-blue-500 text-white px-5 py-5 rounded-full border-2 border-black shadow-2xl">
          Arthritis Exercise 7
        </button>
      </div>

      <div className="flex justify-center m-3">
        <button onClick={() => {

          localStorage.setItem(
            "exercise",
            "Arthritis8"
          );

          window.location.href = "/camera-rendering";

        }} className="bg-blue-500 text-white px-5 py-5 rounded-full border-2 border-black shadow-2xl">
          Arthritis Exercise 8
        </button>
      </div>

      <div className="flex justify-center m-3">
        <button onClick={() => {

          localStorage.setItem(
            "exercise",
            "Arthritis9"
          );

          window.location.href = "/camera-rendering";

        }} className="bg-blue-500 text-white px-5 py-5 rounded-full border-2 border-black shadow-2xl">
          Arthritis Exercise 9
        </button>
      </div>

      <div className="flex justify-center">
        <button onClick={() => Handle$Start$All$Exercise()} className="bg-green-500 px-5 py-5 rounded-full border-2 border-black shadow-2xl">
          Today's Session
        </button>
      </div> */}

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
                completed={completedExercise.indexOf(exercise.id) !== -1}
                image={exercise.image}
                coverImage={exercise.cover_image}
                text={(exercise as { name: string }).name}
              />
            </div>
          );
        })}
      </div>
      <p className="text-right p-2">Powered by Fittlyf</p>
    </div>
  );
};
