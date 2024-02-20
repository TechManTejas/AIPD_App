import { IonContent, IonPage } from '@ionic/react';
import { Home } from './Home';

const Program: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='flex flex-col flex-grow pb-16'>
          <Home />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Program;
