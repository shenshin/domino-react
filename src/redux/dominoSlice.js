import { createSlice } from '@reduxjs/toolkit'
import { combinationsWithRepetition, shuffle } from '../util/combinatorics'
import {
  insertTileToPlayline,
  getEdges,
  getNumbers,
} from '../util/tileOperations'

const initialState = {
  initialStock: [],
  stock: [],
  playline: [],
  players: [],
  winner: null,
};
const dominoSlice = createSlice({
  name: 'domino',
  initialState,
  reducers: {
    restartGame: (state) => {
      state.winner = null;
      state.stock = [];
      state.playline = [];
      state.initialStock = combinationsWithRepetition(
        [...Array(7).keys()],
        2,
      ).map((tile) => ({
        id: tile.join(''),
        isRotated: false,
        lastCoords: {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        },
      }))
      shuffle(state.initialStock)
      // create players
      state.players = [1, 2].map((id) => ({
        id: String(id),
        missedLastMove: 0,
        name: ['User', 'Artificial Intelligence'][id - 1],
        stock: [],
      }))
    },
    putTileToStock: (state) => {
      if (state.initialStock.length > 0) {
        state.stock.push(state.initialStock.splice(0, 1)[0])
      }
    },
    setGameStockCoords: (state, { payload: { tile, lastCoords } }) => {
      const tileInStock = state.stock.find((t) => t.id === tile.id)
      if (tileInStock) {
        tileInStock.lastCoords = lastCoords
      }
    },

    drawTileToAI: (state) => {
      if (state.stock.length > 0) {
        state.players[1].stock.push(state.stock.splice(state.stock.length - 1)[0])
      }
    },
    drawTileToUser: (state) => {
      if (state.stock.length > 0) {
        state.players[0].stock.push(
          state.stock.splice(state.stock.length - 1)[0],
        );
      }
    },
    drawTileToPlayline: (state) => {
      if (state.stock.length > 0) {
        state.playline.push(state.stock.splice(state.stock.length - 1)[0])
      }
    },

    userMakesMove: (state, { payload: { tile, position } }) => {
      // find a player with matched tile
      const user = state.players[0]
      const playersTile = user.stock.find((t) => t.id === tile.id)
      insertTileToPlayline({
        playline: state.playline,
        tile: playersTile,
        position,
      })
      // remove matched tile from player's stock
      user.stock = user.stock.filter((t) => t !== playersTile)
      if (user.stock.length === 0) {
        // game over
        state.winner = user
      } else if (state.stock.length > 0) {
        // add new tile from stock
        user.stock.push(state.stock.splice(state.stock.length - 1)[0])
      }
    },

    userDrawsTile: (state) => {
      if (state.stock.length > 0) {
        state.players[0].stock.push(

          state.stock.splice(state.stock.length - 1)[0],
        )
      }
    },

    userMissesMove: (state) => {
      state.players[0].missedLastMove += 1
    },

    aiMakesMove: (state) => {
      const ai = state.players[1];
      const playlineEdges = getEdges(state.playline)
      const matchingTiles = ai.stock.filter((t) => getNumbers(t)
        .some((n) => playlineEdges.includes(n)))
      if (matchingTiles.length > 0) {
        ai.missedLastMove = 0
        const randomIndex = Math.floor(Math.random() * matchingTiles.length)
        const tile = ai.stock.find((t) => t === matchingTiles[randomIndex])
        insertTileToPlayline({ playline: state.playline, tile })
        ai.stock = ai.stock.filter((t) => t !== tile)
        if (ai.stock.length === 0) {
          // game over
          state.winner = ai
        } else if (state.stock.length > 0) {
          // add new tile from stock
          ai.stock.push(state.stock.splice(state.stock.length - 1)[0])
        }
      } else {
        ai.missedLastMove += 1
      }
    },
  },
});

export const {
  restartGame,
  putTileToStock,
  setGameStockCoords,
  drawTileToAI,
  drawTileToUser,
  drawTileToPlayline,

  userMakesMove,
  aiMakesMove,
  userDrawsTile,
  userMissesMove,
} = dominoSlice.actions
export default dominoSlice.reducer
