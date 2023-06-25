import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "login",
  initialState: {
    ExerciseDetails : [],
  },
  reducers: {
    
    addExerciseDetails(state, action) {
      state.ExerciseDetails = action.payload.ExerciseDetails;
    },
  },
});

export const loginAction = loginSlice.actions;
export default loginSlice;