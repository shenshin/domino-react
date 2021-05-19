import { createSlice } from '@reduxjs/toolkit'

const tileSlice = createSlice({
  name: 'tile',
  initialState: {
    draggedTile: null,
    stockPosition: null,
  },
  reducers: {
    startDrag: (state, { payload: { tile } }) => {
      state.draggedTile = tile;
    },
    stopDrag: (state) => {
      state.draggedTile = null;
    },
    setStockPosition: (state, { payload: { position } }) => {
      state.stockPosition = position;
    },
  },
})

export const { startDrag, stopDrag, setStockPosition } = tileSlice.actions
export default tileSlice.reducer
