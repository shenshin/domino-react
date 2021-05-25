import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import Tile from './Tile'
import {
  restartGame,
  putTileToStock,
  drawTileToAI,
  drawTileToUser,
  drawTileToPlayline,
} from '../redux/dominoSlice'
import { StockContainer, Title, SubTitle as ST } from './styled'
import { dispatchConsequently } from '../util/tileOperations'

const SubTitle = styled(ST)`
  margin-bottom: 0.5rem;
`

const Stock = () => {
  const dispatch = useDispatch()
  const tiles = useSelector((state) => state.domino.stock)
  const { winner } = useSelector((state) => state.domino)

  // restart the game when winner is set to null
  useEffect(() => {
    if (winner === null) {
      (async () => {
        const interval = 0.3
        dispatch(restartGame());
        await dispatchConsequently(dispatch, {
          action: putTileToStock,
          steps: 28,
          interval: 0.05,
        })
        await dispatchConsequently(dispatch, {
          action: drawTileToAI,
          steps: 6,
          interval,
        })
        await dispatchConsequently(dispatch, {
          action: drawTileToUser,
          steps: 6,
          interval,
        })
        dispatch(drawTileToPlayline())
      })()
    }
  }, [winner])

  return (
    <div>
      <Title>Game Stock</Title>
      {tiles?.length > 0 ? (
        <StockContainer>
          {tiles?.map((tile) => (
            <Tile
              key={tile.id}
              tile={tile}
              size="sm"
              color="textSecondary"
              duration={0.4}
              variant="dimmed"
            />
          ))}
        </StockContainer>
      ) : (
        <SubTitle>is empty</SubTitle>
      )}
    </div>
  )
}

export default Stock
