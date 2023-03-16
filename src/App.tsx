import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Program from './pages/Program';
import Results from './pages/Results';
import Settings from './pages/Settings';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import { BottomNavigationBar } from './components/BottomNavigationBar';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/program">
          <Program />
        </Route>
        <Route exact path="/results">
          <Results />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route exact path="/">
          <Redirect to="/program" />
        </Route>
      </IonRouterOutlet>
      <BottomNavigationBar />
    </IonReactRouter>
  </IonApp >
);

export default App;
