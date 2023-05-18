import { IonContent, IonPage } from '@ionic/react';
import { CameraRendering } from './CameraRendering';
import { DemoVideoAndLogs } from './DemoVideoAndLogs';
import { Home } from './Home';
import axios from "axios"

const Program: React.FC = () => {

  axios.get("/exercise_record/", {
    headers: {
      Authorization: `Token ${localStorage.getItem(
        "aipd-patient-access-token"
      )}`,
    },
  }).then((data: any) => {
    console.log(data.data)
  })

  


  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='bg-white flex flex-col flex-grow pb-16'>
          <Home />
          {/* /* <DemoVideoAndLogs /> */}
          {/* <CameraRendering /> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Program;
