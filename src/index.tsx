import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import axios from 'axios';
import GlobalDataContext from "./Context/global";
import { Provider } from 'react-redux';
import store from './store';

axios.defaults.baseURL = 'http://13.232.102.80:8000';
// axios.defaults.baseURL = 'http://127.0.0.1:8000';

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <GlobalDataContext>
      <App />
    </GlobalDataContext>
  </Provider>
);
