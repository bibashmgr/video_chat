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
    addParticipants: (state, actions) => {
      actions.payload.map((participant) => {
        state.value.push(participant);
      });
    },
    removeParticipant: (state, actions) => {
      let { userId } = actions.payload;
      let newParticipants = state.value.filter(
        (participant) => participant.email !== userId
      );
      state.value = newParticipants;
    },
    clearParticipants: (state) => {
      state.value = [];
    },
    setAudio: (state, actions) => {
      let { userId } = actions.payload;
      let updatedParticipants = state.value.filter((participant) => {
        if (participant.email === userId) {
          participant.prefs.audio = !participant.prefs.audio;
        }
        return participant;
      });
      state.value = updatedParticipants;
    },
    setVideo: (state, actions) => {
      let { userId } = actions.payload;
      let updatedParticipants = state.value.filter((participant) => {
        if (participant.email === userId) {
          participant.prefs.video = !participant.prefs.video;
        }
        return participant;
      });
      state.value = updatedParticipants;
    },
    setScreen: (state, actions) => {
      let { userId } = actions.payload;
      let updatedParticipants = state.value.filter((participant) => {
        if (participant.email === userId) {
          participant.prefs.screen = !participant.prefs.screen;
        }
        return participant;
      });
      state.value = updatedParticipants;
    },
  },
});

export const {
  addParticipant,
  addParticipants,
  removeParticipant,
  clearParticipants,
  setAudio,
  setVideo,
  setScreen,
} = participantsSlice.actions;

export default participantsSlice.reducer;
