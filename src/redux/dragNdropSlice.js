import { createSlice } from '@reduxjs/toolkit';

const tileSlice = createSlice({
  name: 'tile',
  initialState: {
    draggedTile: null,
  },
  reducers: {
    startDrag: (state, { payload: { tile } }) => {
      state.draggedTile = tile;
    },
    stopDrag: (state) => {
      state.draggedTile = null;
    },
  },
});

export const { startDrag, stopDrag } = tileSlice.actions;
export default tileSlice.reducer;
