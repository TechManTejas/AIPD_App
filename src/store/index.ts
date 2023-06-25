import { configureStore } from "@reduxjs/toolkit";
import Slice from "./slice";
const store = configureStore({
  reducer: {
    state: Slice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
