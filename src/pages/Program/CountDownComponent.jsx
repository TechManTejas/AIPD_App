import React, { useEffect, useRef, useState } from "react";

export const CountDownComponent = ({ settimer }) => {
  var time = 5;

  const timeref = useRef();

  useEffect(() => {
    const interval = setInterval(() => {
      if (time <= 0) {
        settimer(true);
        clearInterval(interval);
      }
      timeref.current.innerHTML = time + " seconds";
      time--;
    }, 1000);
  }, []);
  return (
    <div className="flex justify-center items-center h-screen w-screen flex-col">
      <h2 className="font-">Take a Break</h2>
      <div ref={timeref}></div>
    </div>
  );
};
