import { IonContent, IonPage } from "@ionic/react";
import { CardActionArea } from "@mui/material";
import { Link } from "react-router-dom";
import CameraPoseDetect from "./CameraComponent";
import { useRef } from "react";

export const CameraRendering: React.FC = () => {
  const repref = useRef<HTMLDivElement>(null);
  const setref = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="bg-white flex flex-col flex-grow pb-16">
          <div className="flex flex-col justify-between h-[calc(100vh-64px)]">
            <div className="p-1 absolute w-full top-0">
              <div className="border text-2xl bg-white font-semibold p-1 flex justify-around">
                <p ref={repref}></p>
                <p ref={messageRef}></p>
                <p ref={setref}></p>
              </div>
            </div>
            <CameraPoseDetect repref={repref} setref={setref} messageRef={messageRef}/>
            <div className="p-1 absolute w-full bottom-0">
              <Link to="/demo-video-logs">
                <CardActionArea>
                  <div className="border bg-blue-600 text-white font-semibold p-1 text-center">
                    Done
                  </div>
                </CardActionArea>
              </Link>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
