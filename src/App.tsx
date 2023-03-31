import { Redirect, Route, Switch } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Program from "./pages/Program";
import Results from "./pages/Results";
import Settings from "./pages/Settings";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import { BottomNavigationBar } from "./components/BottomNavigationBar";
import { DemoVideo } from "./pages/Program/DemoVideo";
import { DemoVideoAndLogs } from "./pages/Program/DemoVideoAndLogs";
import { CameraRendering } from "./pages/Program/CameraRendering";
import { useState } from "react";
import { Auth } from "./pages/PartientAuth";
import { DoctorAuth } from "./pages/DoctorAuth";
import { DoctorDashboard } from "./pages/DoctorDashboard";
setupIonicReact();

const authenticatedRoutes = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/program">
          <Program />
        </Route>
        <Route exact path="/demo-video">
          <DemoVideo />
        </Route>
        <Route exact path="/demo-video-logs">
          <DemoVideoAndLogs />
        </Route>
        <Route exact path="/camera-rendering">
          <CameraRendering />
        </Route>
        <Route exact path="/program">
          <Program />
        </Route>
        <Route exact path="/results">
          <Results />
        </Route>
        <Route path="/settings">
          <Settings />
        </Route>
        <Route exact path="/auth">
          <Auth />
        </Route>
        <Route exact path="/doctor-auth">
          <DoctorAuth />
        </Route>
        <Route exact path="/doctor-dashboard">
          <DoctorDashboard />
        </Route>
        <Route exact path="/">
          <Redirect to="/camera-rendering" />
        </Route>
      </IonRouterOutlet>
      <Switch>
        <Route exact path="/camera-rendering" />
        <Route exact path="/auth" />
        <Route exact path="/doctor-auth" />
        <Route exact path="/doctor-dashboard" />
        <Route path="/" component={BottomNavigationBar} />
      </Switch>
    </IonReactRouter>
  )
}
const unAuthenticatedRoutes = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/auth">
          <Auth />
        </Route>
        <Route exact path="/doctor-auth"> 
          <DoctorAuth />
        </Route>
        <Route exact path="/">
          <Redirect to="/camera-rendering" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  )
}

const App: React.FC = () => {

  const [authenticated, isAuthenticated] = useState(
    // !!localStorage.getItem("aipd-access-token")
    true
  )

  return (
    <IonApp>
      {
        authenticated
          ?
          authenticatedRoutes()
          :
          unAuthenticatedRoutes()
      }
    </IonApp>
  )

};

export default App;
