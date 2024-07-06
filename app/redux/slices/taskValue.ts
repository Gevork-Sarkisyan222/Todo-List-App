import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TaskStateType {
  taskValue: string;
}

const initialState: TaskStateType = {
  taskValue: '',
};

const taskValue = createSlice({
  name: 'value',
  initialState,
  reducers: {
    setTaskValue(state, action: PayloadAction<string>) {
      state.taskValue = action.payload;
    },
  },
});

export const { setTaskValue } = taskValue.actions;
export default taskValue.reducer;
