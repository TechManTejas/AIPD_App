import React, { useEffect, useRef, useState } from "react";
import mesh from "../../Images/mesh-113.png"


export const CountDownComponent: React.FC<{ settimer: (val: boolean) => void }> = ({ settimer }) => {

  const [timer, setimer] = useState(500)
  var interval;

  useEffect(() => {
    interval = setInterval(() => {
      setimer(timer => timer - 1);
    }, 10);
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      settimer(true)
    }
  }, [timer])

  return (
    <>
      <img className="h-screen absolute z-10 " src={mesh}></img>
      <div style={{ fontFamily: 'Chakra Petch' }} className="flex absolute z-20 h-screen w-screen flex-col">
        <h2 className="text-white p-10 text-3xl font-bold" >Take a Break</h2>
        <div className="flex flex-col gap-10 justify-center items-center" >
          <div className="flex flex-col gap-2 bg-[#333333] p-5 rounded-lg">
            <div className="text-white font-extrabold text-xl">Next Set Starts In</div>
            <div className="text-white font-extrabold text-xl">{`${Math.ceil(timer / 100)} Seconds(s)`}</div>
            <div className="">
              <div style={{ width: timer / 10 }} className={`flex relative top-1 bg-white h-[4px] rounded-md`}></div>
              <div style={{ width: 300 }} className={`flex bg-slate-600 h-[4px] rounded-md`}></div>
            </div>
          </div>
          {/* <div className="flex flex-col gap-2 bg-[#333333] p-5 rounded-lg">
            <div className="text-white font-extrabold text-xl">Statistics</div>
            <div className="text-white font-extrabold text-xl">Time Elapsed : 5 Mins 3 Seconds</div>
            <div className="text-white font-extrabold text-xl">No. Of Sets Completed : 2</div>
            <div className="text-white font-extrabold text-xl"></div>
          </div> */}
        </div>

      </div>
    </>

  );
};
