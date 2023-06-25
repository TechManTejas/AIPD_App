import React, { useEffect, useRef, useState } from "react";
import playSound from "../../utils/PlaySound";
import breakSound from "../../sounds/break.wav";
import { CountdownTimer } from "./CountdownTimer";

export const CountDownComponent: React.FC<{ settimer: (val: boolean) => void }> = ({ settimer }) => {

  const [timer, setimer] = useState(1000)
  var interval;

  useEffect(() => {
    playSound(breakSound)
    interval = setInterval(() => {
      setimer(timer => timer - 1);
    }, 5);
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      settimer(true)
    }
  }, [timer])

  return (
    <>
      <div className="flex z-20 h-screen w-screen flex-col justify-center items-center">
          <CountdownTimer
            seconds={5}
            size={200}
            strokeBgColor="white"
            strokeColor="black"
            strokeWidth={12}
          />
      </div>
    </>
  );
};
