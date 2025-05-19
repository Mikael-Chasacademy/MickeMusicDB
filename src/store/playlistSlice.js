import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedTracks: [],
  currentPlaylist: null,
  userPlaylists: [],
};

const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    addTrack: (state, action) => {
      state.selectedTracks.push(action.payload);
    },
    removeTrack: (state, action) => {
      state.selectedTracks = state.selectedTracks.filter((track) => track.id !== action.payload);
    },
    clearSelectedTracks: (state) => {
      state.selectedTracks = [];
    },
    setCurrentPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
    },
    setUserPlaylists: (state, action) => {
      state.userPlaylists = action.payload;
    },
  },
});

export const { addTrack, removeTrack, clearSelectedTracks, setCurrentPlaylist, setUserPlaylists } = playlistSlice.actions;

export default playlistSlice.reducer;
