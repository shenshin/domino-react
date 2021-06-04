import { createSlice } from '@reduxjs/toolkit'
import { combinationsWithRepetition, shuffle } from '../util/combinatorics'
import {
  insertTileToPlayline,
  getEdges,
  getNumbers,
  moveTile,
} from '../util/tileOperations'

const initialState = {
  initialStock: [],
  stock: [],
  playline: [],
  players: [],
  winner: null,
  firstInPlayline: null,
};
const dominoSlice = createSlice({
  name: 'domino',
  initialState,
  reducers: {

    restartGame: (state) => {
      state.firstInPlayline = null
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
        id,
        missedLastMove: 0,
        name: ['Human', 'Artificial Intelligence'][id - 1],
        stock: [],
      }))
    },

    setTileCoords: (state, { payload: { tile, lastCoords } }) => {
      const stocks = [state.players[0].stock, state.players[1].stock, state.stock, state.playline];
      const stock = stocks.find((s) => s.some((t) => t.id === tile.id))
      const tileInStock = stock.find((t) => t.id === tile.id)
      tileInStock.lastCoords = lastCoords
    },

    unsetUserTileCoords: (state, { payload }) => {
      const userTile = state.players[0].stock.find((t) => t.id === payload.id)
      userTile.lastCoords = null
    },

    putTileToStock: (state) => moveTile({ from: state.initialStock, to: state.stock }),
    drawTileToAI: (state) => moveTile({ from: state.stock, to: state.players[1].stock }),
    drawTileToPlayline: (state) => {
      // remember first tile to indicate it in the playline
      if (state.playline.length === 0) {
        state.firstInPlayline = state.stock[state.stock.length - 1]
      }
      moveTile({ from: state.stock, to: state.playline })
    },
    drawTileToUser: (state) => moveTile({ from: state.stock, to: state.players[0].stock }),

    userMakesMove: (state, { payload: { tile, position } }) => {
      if (!state.winner) {
        const user = state.players[0]
        const playersTile = user.stock.find((t) => t.id === tile.id)
        if (playersTile) {
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
          }
        }
      }
    },

    userMissesMove: (state) => {
      state.players[0].missedLastMove += 1
    },

    aiMakesMove: (state) => {
      if (!state.winner) {
        const ai = state.players[1];
        const playlineEdges = getEdges(state.playline)
        // all tiles that match with one of the edges
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
          }
          // if the stock is empty and the rival missed previous move
        } else if (!state.stock.length && state.players[0].missedLastMove) {
          [state.winner] = [...state.players].sort((a, b) => a.stock.length - b.stock.length)
        } else {
          ai.missedLastMove += 1
        }
      }
    },

    /* setFirstInPlayline: (state, { payload }) => {
      state.firstInPlayline = payload
    }, */
  },
});

export const {
  aiMakesMove,
  drawTileToAI,
  drawTileToUser,
  drawTileToPlayline,
  putTileToStock,
  restartGame,
  setTileCoords,
  unsetUserTileCoords,
  userMakesMove,
  userMissesMove,
  setFirstInPlayline,
} = dominoSlice.actions
export default dominoSlice.reducer
