import { IonContent, IonPage } from '@ionic/react';
import GradientButton from '../../components/GradientButton';
import { GlobalDataState } from '../../Context/global';

const Settings: React.FC = () => {
  
  const { setAuthenticated } = GlobalDataState()

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='bg-white flex flex-col flex-grow'>
          <div className='text-3xl font-bold p-3'>
            Settings
          </div>
          <hr className='bg-green-600 h-1'/>
          <div className='p-3'>
            <div>
              <div className='text-2xl font-semibold'>
                Program Details
              </div>
              <div className='py-2'>
                <div>
                  <div className='text-xl py-1 font-semibold text-green-700'>
                    Program Code
                  </div>
                  <div>
                    qwert321
                  </div>
                </div>
                <div>
                  <div className='text-xl py-1 font-semibold text-green-700'>
                    Condition Name
                  </div>
                  <div>
                    Start Date: <span> dd/mm/yyyy</span>
                  </div>
                  <div>
                    End Date: <span> dd/mm/yyyy</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className='text-2xl font-semibold'>
                Myphysio
              </div>
              <div className='py-2'>
                  1.0.0
              </div>
              <div className='py-2'>
                <GradientButton
                  onClick={() => {
                    localStorage.removeItem("aipd-patient-access-token")
                    setAuthenticated(false)
                    window.location.href = "/";
                  }}
                  varient={"primary"}
                  isFullWidth={false}
                >
                  <div className="text-base">
                    Logout
                  </div>
                </GradientButton>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
