import { Redirect, Route, Switch } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Program from "./pages/Program";
import ProgramFittlyfPhysio from "./pages/FittlyfPhysioDashboard/PatientsInfo/Program";
import Results from "./pages/Results";
import Settings from "./pages/Settings";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import { BottomNavigationBar } from "./components/BottomNavigationBar";
import { DemoVideo } from "./pages/Program/DemoVideo";
import { DemoVideoAndLogs } from "./pages/Program/DemoVideoAndLogs";
import { CameraRendering } from "./pages/Program/CameraRendering";
import { useEffect, useState } from "react";
import { Auth } from "./pages/PartientAuth";
import { DoctorAuth } from "./pages/DoctorAuth";
import { DoctorDashboard } from "./pages/DoctorDashboard";
import { GlobalDataState } from "./Context/global";
import { FittlyfPhysioDashboard } from "./pages/FittlyfPhysioDashboard";
import { FittlyfDemoVideo } from "./pages/FittlyfPhysioDashboard/PatientsInfo/DemoVideo";
setupIonicReact();

const patientRoutes = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/">
          <Redirect to="/program" />
        </Route>
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
      </IonRouterOutlet>
      <Switch>
        <Route exact path="/camera-rendering" />
        <Route path="/" component={BottomNavigationBar} />
      </Switch>
    </IonReactRouter>
  )
}

const doctorRoutes = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/">
          <Redirect to="/doctor-dashboard" />
        </Route>
        <Route exact path="/doctor-dashboard">
          <DoctorDashboard />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  )
}

const fittlyfPhysioRoutes = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/">
          <Redirect to="/fittlyf-physio-dashboard" />
        </Route>
        <Route exact path="/fittlyf-physio-dashboard">
          <FittlyfPhysioDashboard />
        </Route>
        <Route exact path="/program">
          <ProgramFittlyfPhysio />
        </Route>
        <Route exact path="/review">
          <FittlyfDemoVideo />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  )
}

const unauthenticatedRoutes = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/">
          <Redirect to="/auth" />
        </Route>
        <Route exact path="/auth">
          <Auth />
        </Route>
        <Route exact path="/doctor-auth">
          <DoctorAuth />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  )
}

const App: React.FC = () => {

  const { authenticated } = GlobalDataState()

  const [routes, setRoutes] = useState<() => JSX.Element>(unauthenticatedRoutes)

  useEffect(() => {
    if (!!localStorage.getItem("aipd-patient-access-token"))
      setRoutes(() => patientRoutes)
    else if (localStorage.getItem("aipd-doctor-access-token"))
      setRoutes(() => doctorRoutes)
    else if (localStorage.getItem("aipd-fittlyf-physio-access-token"))
      setRoutes(() => fittlyfPhysioRoutes)
    else
      setRoutes(() => unauthenticatedRoutes)

  }, [authenticated])

  return (
    <IonApp>
      {typeof routes === "function" && routes()}
    </IonApp>
  )

};

export default App;
