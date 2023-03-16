import { IonContent, IonPage } from '@ionic/react';
import { CameraRendering } from './CameraRendering';
import { DemoVideoAndLogs } from './DemoVideoAndLogs';
import { Home } from './Home';

const Program: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='bg-white flex flex-col flex-grow pb-16'>
          <Home />
          {/* <DemoVideoAndLogs />
          <CameraRendering /> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Program;
