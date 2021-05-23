import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import styled, { css } from 'styled-components';
import Tile from './Tile'
import { drawTileToAI, aiMakesMove } from '../redux/dominoSlice'
import Container from './StockContainer'

const AIPlayer = () => {
  const dispatch = useDispatch()
  const {
    players: [, aiPlayer], winner,
  } = useSelector((state) => state.domino)
  // untill aiPlayer.missedLastMove is not 0, every 'delay'
  const delay = 600 // ms
  // milliseconds dispatch draw tile
  useEffect(() => {
    if (aiPlayer?.missedLastMove > 0 && !winner) {
      setTimeout(() => {
        dispatch(drawTileToAI())
        dispatch(aiMakesMove())
      }, delay)
    }
  }, [aiPlayer?.missedLastMove, winner])
  return (
    <div>
      {aiPlayer?.stock?.length > 0 ? (
        <div>
          <h6>Artificial Intelligence</h6>
          {aiPlayer?.missedLastMove > 0 && (
            <p>{`missed move ${aiPlayer?.missedLastMove}`}</p>
          )}
          <Container>
            {aiPlayer?.stock?.map((tile) => (
              <Tile key={tile.id} tile={tile} />
            ))}
          </Container>
        </div>
      ) : (
        <p>AI&apos;s stock is empty</p>
      )}
    </div>
  )
}

export default AIPlayer
