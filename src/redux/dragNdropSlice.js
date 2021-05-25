import { createSlice } from '@reduxjs/toolkit'

const tileSlice = createSlice({
  name: 'tile',
  initialState: {
    draggedTile: null,
    droppedTile: null,
    firstInPlayline: null,
  },
  reducers: {
    startDrag: (state, { payload }) => {
      state.draggedTile = payload
    },
    stopDrag: (state) => {
      state.draggedTile = null
    },
    startDrop: (state, { payload }) => {
      state.droppedTile = payload
    },
    stopDrop: (state) => {
      state.droppedTile = null
    },
  },
})

export const {
  startDrag, stopDrag, startDrop, stopDrop,
} = tileSlice.actions
export default tileSlice.reducer
