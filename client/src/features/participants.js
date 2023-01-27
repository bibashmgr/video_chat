import { createSlice } from '@reduxjs/toolkit';

export const participantsSlice = createSlice({
  name: 'participants',
  initialState: {
    value: [],
  },
  reducers: {
    addParticipant: (state, actions) => {
      state.value.push(actions.payload);
    },
    removeParticipant: (state, actions) => {
      let newParticipants = state.value.filter(
        (val) => val.email !== actions.payload
      );
      state.value = newParticipants;
    },
  },
});

export const { addParticipant, removeParticipant } = participantsSlice.actions;

export default participantsSlice.reducer;
