import React, { useEffect, useRef, useState } from "react";
import playSound from "../../utils/PlaySound";
import breakSound from "../../sounds/break.wav";
import { CountdownTimer } from "./CountdownTimer";

export const CountDownComponent: React.FC<{ settimer: (val: boolean) => void }> = ({ settimer }) => {

  useEffect(() => {
    playSound(breakSound)
  }, []);

  return (
    <>
      <div className="flex z-20 h-screen w-screen flex-col justify-center items-center">
          <CountdownTimer
            seconds={5}
            size={200}
            strokeBgColor="white"
            strokeColor="black"
            strokeWidth={12}
            setCountDown={() => {}}
            settimer={settimer}
          />
      </div>
    </>
  );
};
