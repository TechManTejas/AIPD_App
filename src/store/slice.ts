import { createSlice } from "@reduxjs/toolkit";

const Slice = createSlice({
  name: "state",
  initialState: {
    CompletedExercise: [],
  },
  reducers: {
    updateCompletedExercise(state, action) {
      state.CompletedExercise = action.payload.CompletedExercise;
    },
  },
});

export const Action = Slice.actions;
export default Slice;
