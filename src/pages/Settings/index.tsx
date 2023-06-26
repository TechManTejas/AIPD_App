import { IonContent, IonPage } from '@ionic/react';
import GradientButton from '../../components/GradientButton';
import { GlobalDataState } from '../../Context/global';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Settings: React.FC = () => {
  
  const { setAuthenticated } = GlobalDataState()
  const [Exercise, setExercise] = useState<any>({});
  
  useEffect(() => {
    axios.get("/patient/", {
      headers: {
        Authorization: `Token ${localStorage.getItem(
          "aipd-patient-access-token"
        )}`,
      },
    })
      .then((data: any) => {
        // localStorage.setItem("exerciseDetails", JSON.stringify(data.data[0]["condition"]["exercises"]))
        setExercise(data.data[0]);
        // localStorage.setItem("patient-ID", data.data[0].id)
      });
  }, []);

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='bg-white flex flex-col flex-grow'>
          <div className='text-3xl font-bold p-3'>
            Settings
          </div>
          <div className='border border-green-600 border-b'/>
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
                    Frozen Shoulder
                  </div>
                </div>
                <div>
                  <div className='text-xl py-1 font-semibold text-green-700'>
                    Condition Name
                  </div>
                  <div>
                    Start Date: <span> {Exercise.start_date} </span>
                  </div>
                  <div>
                    End Date: <span> {Exercise.end_date} </span>
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
