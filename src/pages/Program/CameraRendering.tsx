import { IonContent, IonPage } from "@ionic/react";
import { CardActionArea } from "@mui/material";
import CameraPoseDetect from "./CameraComponent";
import { useRef, useState } from "react";
import Slideshow from "./Slideshow";

export const CameraRendering: React.FC = () => {

  const repref = useRef<HTMLDivElement>(null);
  const setref = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const [loading, setloading] = useState(true)
  const [carsouselShown, setCarouselShown] = useState(false)
  const [warning, setWarning] = useState(true)
  const [showCoutdown, setShowCoutdown] = useState(false);

  return (
    <IonPage>
      <IonContent fullscreen>
        {
          (loading || !carsouselShown) &&
          <div className="w-screen h-screen absolute z-10 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <Slideshow setCarouselShown={setCarouselShown} />
              {/* <p className="bg-white w-screen text-center text-4xl">Loading Exercise ... Please keep your phone away from you and stand in front of the camera such that you are clearly visible to us and please wait for a few seconds. Make sure that you are connected to WIFI for best experience</p> */}
            </div>
          </div>
        }
        {
          !loading && warning && carsouselShown &&
          <div className="w-screen h-screen absolute z-10 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <p className="bg-white text-red-600 font-fredokaone text-9xl w-screen text-center">You are not visible to us!</p>
            </div>
          </div>
        }
        <div className="bg-white flex flex-col flex-grow pb-16">
          <div className="flex flex-col h-[calc(100vh-64px)]">
            {!showCoutdown &&
              <div className={`p-1 ${loading ? "hidden" : ""} absolute w-full top-0`}>
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
            {carsouselShown &&
              <div>
                <CameraPoseDetect showCoutdown={showCoutdown} setShowCoutdown={setShowCoutdown} loading={loading} setloading={setloading} setWarning={setWarning} repref={repref} setref={setref} messageRef={messageRef} carsouselShown={carsouselShown} />
              </div>
            }
            {!loading &&
              <div className="p-1 absolute w-full bottom-0">
                <div className={`${!showCoutdown ? "" : "hidden"}`}>
                  <CardActionArea onClick={() => {
                    window.location.href = "/"
                  }}>
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
