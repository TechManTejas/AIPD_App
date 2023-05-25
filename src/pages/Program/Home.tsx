import { Box, styled, Tab, Tabs } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { ExerciseCard } from "./Components/ExerciseCard";
import AIPDLogoName from "../../Images/aipdlogoname.png";
import axios from "axios";
import { PerviousDate } from "../../utils/DateTime";

// * The Types of Exercise
interface ExerciseNames {
  [key: number]: string;
}

export const Home: React.FC = () => {
  // * value => the index of the dates present in the top scroll bar
  const [value, setValue] = useState<number>(0);
  // * The Exercise that needs to be done by the patients logined
  // ^ id => the id of the exercise, name => name of the exercise, image => url of the image of the exercise
  const [exerciseDetails, setExerciseDetails] = useState<{ id: number, name: string, image: string; sets: number }[]>([]);
  // * The Array of Exercise that are completed by the patient
  const [completedExercise, setCompletedExercise] = useState<number[]>([]);

  // * function to check whether the date selected is present in the data fetch in above state
  const checkdate = (dateObj: any) => {
    return ((parseInt(dateObj.date.split("-")[1]) === parseInt(PerviousDate(value).split("/")[1])) && parseInt(dateObj.date.split("-")[2]) === parseInt(PerviousDate(value).split("/")[0]))
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
    })
  }, [value])

  // ^ for the top navbar scroll, reloads after the value (state) changes
  // ! is not 100% accurate needs perfection
  useEffect(() => {
    console.log(value)
    document.getElementById("scroll-top")?.scrollBy(-32 * 13, 0);
    if (![-6, -5, -4].includes(value)) {
      if ([4, 5, 6].includes(value)) {
        document.getElementById("scroll-top")?.scrollBy(32 * 13, 0);
      } else if (value == -3)
        document.getElementById("scroll-top")?.scrollBy(16 * 1, 0);
      else if (value == -2)
        document.getElementById("scroll-top")?.scrollBy(16 * 5, 0);    
      else if (value == -1)
        document.getElementById("scroll-top")?.scrollBy(16 * 9, 0);
      else if (value == 0)
        document.getElementById("scroll-top")?.scrollBy(16 * 13, 0);
      else if (value == 1)
        document.getElementById("scroll-top")?.scrollBy(16 * 17, 0);
      else if (value == 2)
        document.getElementById("scroll-top")?.scrollBy(16 * 21, 0);
      else if (value == 3)
        document.getElementById("scroll-top")?.scrollBy(16 * 25, 0);
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
        console.log(data.data[0]["condition"]["exercises"]);
      });
  }, []);

  const exerciseNames: ExerciseNames = {
    1: "PendulumStraight",
    2: "PendulumSideways",
    4: "CrossBodyReach",
    5: "ArmpitStretch",
    8: "Butterfly",
    6: "PendulumCircles",
    7: "LyingArms",
    9: "ArmsLock",
  };

  // * initial scroll for todays date
  document.getElementById("scroll-top")?.scrollBy(16 * 13 - 4, 0);
  // document.getElementById("scroll-top")?.scrollBy(-208, 0)

  return (
    <div className="space-y-4">
      <div className="">
        <div className="sticky top-0 z-20 bg-slate-50 p-2">
          <div className="overflow-hidden">
            <div id="scroll-top" className="flex overflow-auto gap-3">
              {Array.from({ length: 13 }, (_, index) => index - 6).map(
                (val) => {
                  return (
                    <section
                      id={val.toString()}
                      onClick={() => {
                        setValue(val);
                      }}
                      className={`w-16 p-2 ${value === val ? "border-b-2 border-green-500" : ""
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
      <div className={`${value === 0 ? "pointer-events-auto" : "pointer-events-none"}  grid grid-cols-2 overflow-auto`}>
        {exerciseDetails.map((exercise) => {
          console.log(completedExercise, exercise.id)
          return (
            <div
              key={(exercise as { id: number }).id}
              onClick={() => {
                localStorage.setItem(
                  "sets",
                  exercise.sets.toString(),
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
