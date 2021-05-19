import { createSlice } from '@reduxjs/toolkit'
import { combinationsWithRepetition, shuffle } from '../util/combinatorics'
import {
  insertTileToPlayline,
  getEdges,
  getNumbers,
} from '../util/tileOperations'

function moveTile({ from, to }) {
  if (from.length > 0) {
    to.push(from.splice(from.length - 1)[0])
  }
}

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

    setGameStockCoords: (state, { payload: { tile, lastCoords } }) => {
      const tileInStock = state.stock.find((t) => t.id === tile.id)
      if (tileInStock) {
        tileInStock.lastCoords = lastCoords
      }
    },

    putTileToStock: (state) => moveTile({ from: state.initialStock, to: state.stock }),
    drawTileToAI: (state) => moveTile({ from: state.stock, to: state.players[1].stock }),
    drawTileToPlayline: (state) => moveTile({ from: state.stock, to: state.playline }),
    drawTileToUser: (state) => moveTile({ from: state.stock, to: state.players[0].stock }),

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
      } else moveTile({ from: state.stock, to: user.stock })
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
        } else moveTile({ from: state.stock, to: ai.stock })
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
  userMissesMove,
} = dominoSlice.actions
export default dominoSlice.reducer
