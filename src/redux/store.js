import { configureStore } from '@reduxjs/toolkit'
import dominoSlice from './dominoSlice'
import dragNdropSlice from './dragNdropSlice'

const store = configureStore({
  reducer: {
    domino: dominoSlice,
    dragNdrop: dragNdropSlice,
  },
});
export default store
