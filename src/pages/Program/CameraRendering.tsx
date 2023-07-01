import { IonContent, IonPage } from "@ionic/react";
import { CardActionArea } from "@mui/material";
import CameraPoseDetect from "./CameraComponent";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export const CameraRendering: React.FC = () => {

  const repref = useRef<HTMLDivElement>(null);
  const setref = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const [loading, setloading] = useState(true)
  const [showCoutdown, setShowCoutdown] = useState(true);

  

  return (
    <IonPage>
      <IonContent fullscreen>
        {
          loading &&
          <div className="w-screen h-screen absolute z-10 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <iframe
                className="w-screen"
                src="https://giphy.com/embed/4bjIKBOWUnVPICCzJc"
                allowFullScreen
                sandbox="allow-scripts"
              ></iframe>
              <p className="bg-white w-screen text-center">Loading Exercise ... </p>
            </div>
          </div>
        }
        <div className="bg-white flex flex-col flex-grow pb-16">
          <div className="flex flex-col h-[calc(100vh-64px)]">
            {showCoutdown && <div className={`p-1 ${loading ? "hidden" : ""} absolute w-full top-0`}>
              <div className="text-3xl text-white font-semibold p-1 flex justify-between">
                <div className="w-28 h-28 bg-blue-600 rounded-full flex justify-center items-center">
                  <p ref={repref}></p>
                </div>
                <div className="w-28 h-28 bg-blue-600 rounded-full flex justify-center items-center">
                  <p ref={setref}></p>
                </div>
                {/* <p ref={messageRef}></p> */}
              </div>
            </div>}
            <div>
            </div>
            <div>
              <CameraPoseDetect showCoutdown={showCoutdown} setShowCoutdown={setShowCoutdown} loading={loading} setloading={setloading} repref={repref} setref={setref} messageRef={messageRef} />
            </div>
            {!loading && <div className="p-1 absolute w-full bottom-0">
              <div className={`${showCoutdown ? "" : "hidden"}`}>
                <CardActionArea>
                  <div id="done-exercise" className="border rounded-full bg-blue-600 text-white font-semibold p-1 text-center">
                    Emergency Stop
                  </div>
                </CardActionArea>
              </div>
            </div>}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
