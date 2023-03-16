import { IonContent, IonPage } from '@ionic/react';

const Results: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className='bg-white flex flex-col flex-grow pb-8'>
          <div className='text-3xl font-bold p-3'>
            "Condition Name"
          </div>
          <hr className='bg-green-600 h-1' />
          <div className='p-3'>
            <div className='pb-8'>
              <div className='text-2xl font-bold'>13/03/2023</div>
              <div className='border-2 rounded p-3 border-gray-700'>
                <div className='text-3xl font-semibold'>
                  2 Warnings
                </div>
                <div className='text-2xl font-semibold text-green-600'>
                  Completed
                </div>
              </div>
            </div>
            <div className='pb-8'>
              <div className='text-2xl font-bold'>12/03/2023</div>
              <div className='border-2 rounded p-3 border-gray-700'>
                <div className='text-3xl font-semibold'>
                  0 Warnings
                </div>
                <div className='text-2xl font-semibold text-green-600'>
                  Completed
                </div>
              </div>
            </div>
            <div className='pb-8'>
              <div className='text-2xl font-bold'>11/03/2023</div>
              <div className='border-2 rounded p-3 border-gray-700'>
                <div className='text-3xl font-semibold'>
                  NA
                </div>
                <div className='text-2xl font-semibold text-red-600'>
                  Missed session
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Results;
